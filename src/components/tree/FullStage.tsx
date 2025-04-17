
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const FullStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Curved trunk with taper */}
      <motion.path
        d="M100 230C100 230 95 160 100 130"
        stroke={treeColors.trunk}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Upper cloud-like foliage layer */}
      <motion.path 
        d="M100 130C80 120 70 130 90 140C110 125 125 135 100 130Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Middle cloud-like foliage layer */}
      <motion.path 
        d="M100 140C75 140 65 150 90 155C110 150 120 140 100 140Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Bottom cloud-like foliage layer for depth */}
      <motion.path 
        d="M95 155C75 150 70 165 95 165C115 165 120 155 95 155Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
    </BaseSVG>
  );
};

export default FullStage;
