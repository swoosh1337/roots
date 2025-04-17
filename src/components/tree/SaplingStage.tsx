
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const SaplingStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Slightly curved trunk with taper */}
      <motion.path
        d="M100 230 C98 210 102 185 100 175"
        stroke={treeColors.trunk}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Small cluster of leaves */}
      <motion.path 
        d="M100 175 C92 165 85 172 100 170 C108 165 115 172 100 170 Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Small inner leaf detail for depth */}
      <motion.path 
        d="M100 173 C95 170 97 175 100 172 Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
    </BaseSVG>
  );
};

export default SaplingStage;
