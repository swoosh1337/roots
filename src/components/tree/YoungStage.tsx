
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const YoungStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Growing trunk with natural taper */}
      <motion.path
        d="M100 230 C97 200 103 170 100 155"
        stroke={treeColors.trunk}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Multiple leaf clusters */}
      <motion.path 
        d="M100 155 C85 145 75 150 90 140 C95 125 105 125 110 140 C125 150 115 145 100 155 Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Inner leaf details for depth */}
      <motion.path 
        d="M100 150 C90 145 85 150 100 145 C110 145 105 150 100 150 Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
    </BaseSVG>
  );
};

export default YoungStage;
