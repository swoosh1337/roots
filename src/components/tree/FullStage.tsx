
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const FullStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Thicker trunk with natural curve */}
      <motion.path
        d="M100 230 C96 190 104 150 100 130"
        stroke={treeColors.trunk}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Main canopy - layered cloud-like foliage */}
      <motion.path 
        d="M100 130 C70 130 60 110 75 95 C65 80 80 60 100 70 C120 60 135 80 125 95 C140 110 130 130 100 130 Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Inner leaf clusters for depth and dimension */}
      <motion.path 
        d="M100 120 C80 120 75 100 90 95 C75 85 90 75 100 85 C110 75 125 85 110 95 C125 100 120 120 100 120 Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
    </BaseSVG>
  );
};

export default FullStage;
