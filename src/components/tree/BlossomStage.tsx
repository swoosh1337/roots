
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const BlossomStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Tree trunk - thicker with base widening and proper taper */}
      <motion.path
        d="M100 230C100 230 95 150 100 115C105 110 95 110 100 115"
        stroke={treeColors.trunk}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Top foliage layer - more circular and balanced */}
      <motion.path
        d="M100 115C75 105 65 115 85 125C115 105 130 115 100 115Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Middle foliage layer - more balanced */}
      <motion.path
        d="M95 125C65 120 55 135 85 140C115 135 130 120 95 125Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Bottom foliage layer for depth - more balanced and rounded */}
      <motion.path
        d="M90 140C65 135 60 150 85 155C115 150 125 135 90 140Z"
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Small flower/blossom details - positioned better to match mockup */}
      <motion.circle 
        cx="75" 
        cy="115" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.circle 
        cx="125" 
        cy="118" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      />
      <motion.circle 
        cx="100" 
        cy="100" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
      <motion.circle 
        cx="90" 
        cy="130" 
        r="4" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.4 }}
      />
    </BaseSVG>
  );
};

export default BlossomStage;
