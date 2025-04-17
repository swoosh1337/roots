
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const FullStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Curved trunk */}
      <motion.path
        d="M100 230c0 0 -10 -80 0 -90"
        stroke={treeColors.trunk}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Rounded cloud-like foliage based on mockup */}
      <motion.path 
        d="M100 140c-25 -5 -40 -20 -20 -10c-15 -20 15 -15 20 -5c5 -10 35 -5 20 15c20 10 -15 5 -20 0z" 
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Darker areas for depth */}
      <motion.path 
        d="M90 145c-15 -5 -25 -15 0 -5c-5 -15 25 -5 5 5z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
    </BaseSVG>
  );
};

export default FullStage;
