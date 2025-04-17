
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
        d="M100 230c0 0 -5 -70 0 -75"
        stroke={treeColors.trunk}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Three-leaf clover style top based on mockup */}
      <motion.path 
        d="M100 155c-10 0 -20 -10 -5 -5c-5 -10 15 -10 10 0c15 -5 5 15 -5 5z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </BaseSVG>
  );
};

export default YoungStage;
