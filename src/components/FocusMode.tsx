
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, TestTube } from 'lucide-react';
import TreeVisual from './TreeVisual';
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

const FocusMode: React.FC<FocusModeProps> = ({
  onOpenLibrary,
  currentRitual,
  onCompletedRitual
}) => {
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    // Set a random affirmation when component mounts
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  }, []);

  const handleRitualCompletion = () => {
    setIsAnimating(true);
    setShowAffirmation(true);
    // Call the parent callback
    onCompletedRitual(currentRitual.id);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
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
        <div className="tree-container mb-8">
          <TreeVisual 
            streak={currentRitual.streak_count} 
            isAnimating={isAnimating}
            testMode={testMode} 
          />
        </div>

        {/* Ritual name */}
        <h1 className="font-serif text-3xl md:text-4xl text-center text-ritual-forest mb-8">
          {currentRitual.name}
        </h1>

        {/* Main button */}
        <div className="w-full max-w-md">
          <button
            onClick={handleRitualCompletion}
            className="ritual-button w-full"
            disabled={isAnimating}
          >
            I kept my ritual alive today
          </button>
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
