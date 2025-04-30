import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Flame } from 'lucide-react';
import TreeVisual from './TreeVisual';
import StreakTracker from './StreakTracker';
import { Button } from '@/components/ui/button';
import { Ritual } from '@/hooks/useRituals';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface FocusModeProps {
  onOpenLibrary: () => void;
  currentRitual: Ritual;
  onCompletedRitual: (id: string) => void;
}

const affirmations = [
  "Your roots are deepening.",
  "Small steps, strong roots.",
  "Nature grows at its own pace.",
  "You showed up.",
  "Growth happens within.",
  "Every day is a new leaf.",
  "The forest begins with a seed.",
  "Cultivate your inner garden.",
  "Time nurtures all things."
];

// Define this helper function outside or make it static if inside a class
const isCompletedToday = (lastCompletedStr?: string | null): boolean => {
  if (!lastCompletedStr) return false;

  // Use the user's local date for comparison
  const todayLocalStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  try {
    // Parse lastCompletedStr as local date string (assume it's in YYYY-MM-DD)
    // If lastCompletedStr is an ISO string, extract the date part
    let lastCompletedDateStr = lastCompletedStr;
    if (lastCompletedStr.includes('T')) {
      lastCompletedDateStr = new Date(lastCompletedStr).toLocaleDateString('en-CA');
    }
    return todayLocalStr === lastCompletedDateStr;
  } catch (e) {
    return false; // Treat invalid dates as not completed today
  }
};

const FocusMode: React.FC<FocusModeProps> = ({
  onOpenLibrary,
  currentRitual,
  onCompletedRitual
}) => {
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Initialize isCompleted state directly using the prop
  const [isCompleted, setIsCompleted] = useState(() => 
    isCompletedToday(currentRitual.last_completed)
  );

  // Effect to handle random affirmation setting on mount and ritual change
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  }, [currentRitual.id]); // Run only when ritual ID changes

  // Effect to update isCompleted state if the prop changes *after* mount
  useEffect(() => {
    const completedToday = isCompletedToday(currentRitual.last_completed);
    if (completedToday !== isCompleted) {
      setIsCompleted(completedToday);
      setShowAffirmation(completedToday); // Also update affirmation visibility based on completion
    }
    // We might also need to reset animation if the ritual changes and is already completed
    if (completedToday) {
      setIsAnimating(false);
    }
  }, [currentRitual.last_completed, currentRitual.id, isCompleted]); // Re-run if last_completed, id, or isCompleted changes

  // State to track if this ritual is the next one that needs to be completed in a chain
  const [isNextInChain, setIsNextInChain] = useState(true);
  const { toast } = useToast();

  // Check if this ritual is the next one that needs to be completed in a chain
  useEffect(() => {
    const checkIfNextInChain = async () => {
      // If ritual is not chained, it's always completable
      if (currentRitual.status !== 'chained') {
        setIsNextInChain(true);
        return;
      }

      try {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        // Check if this ritual is already completed today
        if (currentRitual.last_completed === today) {
          setIsNextInChain(true); // Already completed, so it's valid
          return;
        }

        // Get all rituals in this chain with their chain_order to determine the correct sequence
        const response = await supabase
          .from('habits')
          .select('id, name, last_completed, chain_order, user_id')
          .eq('chain_id', currentRitual.chain_id)
          .order('chain_order', { ascending: true }); // Order by chain_order to get the correct sequence
        
        console.log('Chain rituals query result:', response.data);

        if (response.error) throw response.error;

        const chainedRituals = response.data;
        
        // The rituals are already sorted by chain_order from the database query
        // Now we need to identify which ritual is next to be completed
        const sortedRituals = [...chainedRituals];
        
        console.log('Current ritual:', currentRitual.id, currentRitual.name);
        console.log('Sorted rituals:', sortedRituals.map(r => ({ id: r.id, name: r.name, completed: r.last_completed === today })));
        
        // Find the first incomplete ritual in the chain
        const firstIncompleteIndex = sortedRituals.findIndex(r => r.last_completed !== today);
        
        // If all rituals are completed, there's no next ritual to complete
        if (firstIncompleteIndex === -1) {
          console.log('All rituals in chain are completed');
          setIsNextInChain(true); // All completed, so this one is valid too
          return;
        }
        
        // The next ritual to complete is the first incomplete one
        const nextRitualId = sortedRituals[firstIncompleteIndex].id;
        console.log('Next ritual to complete:', nextRitualId);
        
        // This ritual can be completed if it's the next one in the chain
        const isNextToComplete = currentRitual.id === nextRitualId;
        console.log('Is this ritual next to complete?', isNextToComplete);
        
        setIsNextInChain(isNextToComplete);
      } catch (error) {
        // In case of error, default to allowing completion
        setIsNextInChain(true);
      }
    };

    checkIfNextInChain();
  }, [currentRitual.id, currentRitual.status, currentRitual.last_completed, currentRitual.chain_id, currentRitual.name]);

  const handleRitualCompletion = async () => {
    // Check if ritual is active and is the next one in chain that needs to be completed
    if (currentRitual.status !== 'active' && currentRitual.status !== 'chained') {
      return;
    }

    // If it's chained, check if it's the next one that needs to be completed
    if (currentRitual.status === 'chained' && !isNextInChain) {
      toast({
        title: "Complete rituals in order",
        description: "You need to complete previous rituals in this chain first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnimating(true);
    
    try {
      // Call the parent callback and await its result
      await onCompletedRitual(currentRitual.id);
      
      // Only update UI state after successful completion
      setIsCompleted(true);
      setShowAffirmation(true);
      
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    } catch (error) {
      // If there's an error, don't update UI state
      setIsAnimating(false);
    }
  };



  return (
    <div className="min-h-screen bg-ritual-paper flex flex-col">
      {/* Top left menu button */}
      <button 
        onClick={onOpenLibrary}
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white shadow-md
                  flex items-center justify-center hover:shadow-lg
                  transition-all duration-300 z-10"
      >
        <Menu className="w-6 h-6 text-ritual-forest" />
      </button>



      {/* Main centered content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Tree visualization */}
        <div className="tree-container mb-4">
          <TreeVisual 
            streak={currentRitual.streak_count} 
            isAnimating={isAnimating}
          />
        </div>

        {/* Add StreakTracker below the tree */}
        <div className="mb-6 mt-2">
          <StreakTracker
            lastCompletedDate={currentRitual.last_completed}
            streakCount={currentRitual.streak_count}
          />
        </div>

        {/* Ritual name */}
        <h1 className="font-serif text-3xl md:text-4xl text-center text-ritual-forest mb-8">
          {currentRitual.name}
        </h1>

        {/* Main button */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.button
                key="complete-button"
                className="ritual-button w-full"
                onClick={handleRitualCompletion}
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                disabled={isAnimating || (currentRitual.status === 'chained' && !isNextInChain)}
              >
                I kept my ritual alive today
              </motion.button>
            ) : (
              <motion.div
                key="completion-message"
                className="text-center text-ritual-forest text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                See you tomorrow 🌱
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Affirmation (conditional) */}
        <motion.div 
          className="h-12 mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showAffirmation ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {showAffirmation && (
            <p className="text-ritual-forest text-lg font-light">{affirmation}</p>
          )}
        </motion.div>

        {/* Streak counter */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-lg font-medium text-ritual-forest">
            <Flame className="w-5 h-5 text-ritual-green" />
            <span>{currentRitual.streak_count}-Day Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
