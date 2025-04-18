import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getTreeStage } from './tree/TreeStages';
import TestControls from './tree/TestControls';

interface TreeVisualProps {
  streak: number;
  isAnimating: boolean;
  testMode?: boolean;
}

const stageImages = {
  sprout: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png',
  sapling: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-2.png',
  young: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-3.png',
  full: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-4.png',
  blossom: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-5.png',
  fruit: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-6.png'
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
