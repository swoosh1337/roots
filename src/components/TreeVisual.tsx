
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getTreeStage } from './tree/TreeStages';
import TestControls from './tree/TestControls';

interface TreeVisualProps {
  streak: number;
  isAnimating: boolean;
  testMode?: boolean;
}

// Updated image paths - using relative paths instead of absolute paths
const stageImages = {
  sprout: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', // placeholder image
  sapling: 'https://images.unsplash.com/photo-1518770660439-4636190af475', // placeholder image
  young: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', // placeholder image
  full: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7', // placeholder image
  blossom: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', // placeholder image
  fruit: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6' // placeholder image
};

// Helper method to verify image loading
const imageExists = (url: string): boolean => {
  const img = new Image();
  img.src = url;
  return img.complete;
};

const TreeVisual: React.FC<TreeVisualProps> = ({ 
  streak, 
  isAnimating,
  testMode = false 
}) => {
  const [testStreak, setTestStreak] = useState(streak);
  const currentStreak = testMode ? testStreak : streak;
  const currentStage = getTreeStage(currentStreak);
  
  // For debugging - log the current image path
  const imagePath = stageImages[currentStage];
  console.log("Current tree stage:", currentStage);
  console.log("Image path:", imagePath);
  console.log("Image exists check:", imageExists(imagePath));
  
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <motion.div
        className={`w-full h-full flex items-center justify-center ${isAnimating ? '' : 'animate-sway'}`}
        initial={isAnimating ? { scale: 0.95, opacity: 0.8 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Add image onError handling to help debug */}
        <img
          src={imagePath}
          alt={`Tree at ${currentStage} stage`}
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error("Failed to load image:", imagePath);
            e.currentTarget.style.border = "1px dashed red";
            e.currentTarget.style.padding = "8px";
          }}
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        />
      </motion.div>
      
      {testMode && (
        <TestControls 
          currentStage={currentStage}
          testStreak={testStreak}
          onStreakChange={setTestStreak}
        />
      )}
    </div>
  );
};

export default TreeVisual;
