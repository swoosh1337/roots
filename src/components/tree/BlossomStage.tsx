
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const BlossomStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Tree trunk - thicker with base widening */}
      <motion.path
        d="M100 230C100 230 95 140 100 110C105 105 95 105 100 110"
        stroke={treeColors.trunk}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Top foliage layer */}
      <motion.path
        d="M100 110C75 100 60 110 85 120C115 100 130 115 100 110Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Middle foliage layer */}
      <motion.path
        d="M100 120C70 115 55 130 85 135C115 130 135 115 100 120Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Bottom foliage layer for depth */}
      <motion.path
        d="M95 135C70 130 60 145 90 150C120 145 125 130 95 135Z"
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Small flower/blossom details */}
      <motion.circle 
        cx="80" 
        cy="115" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.circle 
        cx="120" 
        cy="118" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      />
      <motion.circle 
        cx="100" 
        cy="95" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
    </BaseSVG>
  );
};

export default BlossomStage;
