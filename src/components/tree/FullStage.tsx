
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
        d="M100 230C100 230 95 170 100 135"
        stroke={treeColors.trunk}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Top cloud-like foliage layer - more circular and balanced */}
      <motion.path 
        d="M100 135C80 125 70 135 90 145C110 130 125 135 100 135Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Middle cloud-like foliage layer */}
      <motion.path 
        d="M95 145C70 140 65 150 85 155C115 150 125 140 95 145Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Bottom cloud-like foliage layer for depth - more balanced */}
      <motion.path 
        d="M95 155C70 150 65 165 90 170C115 165 120 150 95 155Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
    </BaseSVG>
  );
};

export default FullStage;
