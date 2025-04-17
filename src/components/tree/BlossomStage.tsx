
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const BlossomStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Tree trunk - slightly thicker */}
      <motion.path
        d="M95 230c0 0 -10 -100 5 -110"
        stroke={treeColors.trunk}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Large rounded foliage based on mockup */}
      <motion.ellipse
        cx="100" 
        cy="110" 
        rx="40" 
        ry="35"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Darker bottom layer for depth */}
      <motion.ellipse
        cx="100" 
        cy="125" 
        rx="35" 
        ry="25"
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Flower/blossom details */}
      <motion.circle 
        cx="70" 
        cy="100" 
        r="5" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.circle 
        cx="130" 
        cy="105" 
        r="5" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      />
      <motion.circle 
        cx="100" 
        cy="90" 
        r="5" 
        fill={treeColors.blossom}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
    </BaseSVG>
  );
};

export default BlossomStage;
