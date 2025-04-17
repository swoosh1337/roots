
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
        d="M100 230C100 230 98 200 100 180"
        stroke={treeColors.trunk}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Two-leaf top based on mockup - more circular and balanced */}
      <motion.path 
        d="M100 180C90 170 82 175 92 185C102 175 110 170 100 180Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Second leaf cluster for more fullness */}
      <motion.path 
        d="M100 185C90 180 85 185 95 190C105 185 110 180 100 185Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
    </BaseSVG>
  );
};

export default SaplingStage;
