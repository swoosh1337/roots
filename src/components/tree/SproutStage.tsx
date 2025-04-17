
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const SproutStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Thin straight sprout stem */}
      <motion.path
        d="M100 195 L100 230"
        stroke={treeColors.trunk}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1, originY: "100%" }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Two tiny seed leaves */}
      <motion.path
        d="M100 195 C95 190 90 193 100 195 C105 190 110 193 100 195 Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </BaseSVG>
  );
};

export default SproutStage;
