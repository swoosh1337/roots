import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, TestTube } from 'lucide-react';
import TreeVisual from './TreeVisual';
import StreakTracker from './StreakTracker';
import { Button } from '@/components/ui/button';
import { Ritual } from '@/hooks/useRituals';

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
    console.error("Error parsing lastCompleted date:", lastCompletedStr, e);
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
  const [testMode, setTestMode] = useState(false);
  
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
  }, [currentRitual.last_completed, currentRitual.id]); // Re-run if last_completed or id changes

  const handleRitualCompletion = async () => {
    setIsAnimating(true);
    
    try {
      console.log('Starting ritual completion for:', currentRitual.id);
      // Call the parent callback and await its result
      await onCompletedRitual(currentRitual.id);
      console.log('Ritual completion successful');
      
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
      console.error('Error completing ritual in FocusMode:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', error);
      }
    }
  };

  const toggleTestMode = () => {
    setTestMode(prev => !prev);
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

      {/* Test mode toggle button - MOVED TO BOTTOM LEFT */}
      <button 
        onClick={toggleTestMode}
        className={`absolute bottom-6 left-6 w-12 h-12 rounded-full shadow-md
                  flex items-center justify-center hover:shadow-lg
                  transition-all duration-300 z-10 ${testMode ? 'bg-ritual-green text-white' : 'bg-white text-ritual-forest'}`}
        aria-label="Toggle test mode"
      >
        <TestTube className="w-6 h-6" />
      </button>

      {/* Main centered content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Tree visualization */}
        <div className="tree-container mb-4">
          <TreeVisual 
            streak={currentRitual.streak_count} 
            isAnimating={isAnimating}
            testMode={testMode} 
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
                disabled={isAnimating}
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
          <p className="text-sm text-ritual-forest/70">Day {currentRitual.streak_count}</p>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
