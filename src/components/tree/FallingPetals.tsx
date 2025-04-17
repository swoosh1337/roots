
import React from 'react';
import { motion } from 'framer-motion';
import { TreeStage, treeColors } from './TreeStages';

interface FallingPetalsProps {
  stage: TreeStage;
}

const FallingPetals: React.FC<FallingPetalsProps> = ({ stage }) => {
  // Only render petals for blossom and fruit stages
  if (stage !== 'blossom' && stage !== 'fruit') return null;
  
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div 
          key={index}
          className="absolute w-2 h-2 rounded-full opacity-80 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: stage === 'fruit' 
              ? treeColors.fruit // Fruit color
              : treeColors.blossom,  // Blossom color
            top: `-${Math.random() * 20}px`,
          }}
          animate={{
            y: [0, 100, 200],
            x: [0, Math.random() * 30 - 15, Math.random() * 50 - 25],
            opacity: [0.8, 0.5, 0],
            rotate: [0, Math.random() * 360]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            delay: Math.random() * 3
          }}
        />
      ))}
    </>
  );
};

export default FallingPetals;
