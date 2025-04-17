
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const SproutStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Thin, straight trunk with slight taper */}
      <motion.path
        d="M100 230L100 195"
        stroke={treeColors.trunk}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Single oval leaf based on mockup - more rounded and natural */}
      <motion.path 
        d="M100 190C92 180 85 185 95 195C105 185 115 180 100 190Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </BaseSVG>
  );
};

export default SproutStage;
