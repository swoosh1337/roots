
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
  sprout: '/lovable-uploads/8582287a-166e-48b7-bcda-03138c829c67.png',
  sapling: '/lovable-uploads/57c52578-6395-4c7f-a494-632c296154f8.png',
  young: '/lovable-uploads/01317a2f-bd10-4ff8-9778-14977ef4c4f6.png',
  full: '/lovable-uploads/39e0a590-fca7-4a27-b0fa-8f4f64a8a9ff.png',
  blossom: '/lovable-uploads/9b0965ce-7864-4af2-a1df-4682815fec5c.png',
  fruit: '/lovable-uploads/469c0b68-551b-43dc-b9b5-d129e9afeaf8.png'
};

const TreeVisual: React.FC<TreeVisualProps> = ({ 
  streak, 
  isAnimating,
  testMode = false 
}) => {
  const [testStreak, setTestStreak] = useState(streak);
  const currentStreak = testMode ? testStreak : streak;
  const currentStage = getTreeStage(currentStreak);
  
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <motion.div
        className={`w-full h-full flex items-center justify-center ${isAnimating ? '' : 'animate-sway'}`}
        initial={isAnimating ? { scale: 0.95, opacity: 0.8 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={stageImages[currentStage]}
          alt={`Tree at ${currentStage} stage`}
          className="w-full h-full object-contain"
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
