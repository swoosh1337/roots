
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const SaplingStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Slightly curved trunk */}
      <motion.path
        d="M100 230C100 230 98 185 100 175"
        stroke={treeColors.trunk}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Two-leaf top based on mockup */}
      <motion.path 
        d="M100 175C92 165 85 170 95 180C105 170 95 160 100 175Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </BaseSVG>
  );
};

export default SaplingStage;
