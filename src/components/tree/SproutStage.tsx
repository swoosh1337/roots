
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const SproutStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Simple straight trunk */}
      <motion.rect
        x="98" 
        y="195" 
        width="4" 
        height="35"
        fill={treeColors.trunk}
        rx="2"
        initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
        animate={{ scaleY: 1, originY: "100%" }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Single leaf based on mockup */}
      <motion.ellipse
        cx="100" 
        cy="185" 
        rx="10" 
        ry="15"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
    </BaseSVG>
  );
};

export default SproutStage;
