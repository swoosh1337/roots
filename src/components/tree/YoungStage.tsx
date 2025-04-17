
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const YoungStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Slightly curved taller trunk */}
      <motion.path
        d="M100 230C100 230 97 170 100 155"
        stroke={treeColors.trunk}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Three-leaf clover style top based on mockup */}
      <motion.path 
        d="M100 155C85 145 80 150 95 160C105 145 115 150 100 155C95 140 85 140 100 155Z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </BaseSVG>
  );
};

export default YoungStage;
