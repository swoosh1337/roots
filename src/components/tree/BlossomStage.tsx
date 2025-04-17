
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const BlossomStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Mature trunk with natural curve and taper */}
      <motion.path
        d="M100 230 C95 180 105 130 100 110"
        stroke={treeColors.trunk}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Full canopy - rounded, cloud-like foliage */}
      <motion.path
        d="M100 110 C60 110 45 85 55 60 C40 40 65 20 100 35 C135 20 160 40 145 60 C155 85 140 110 100 110 Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Inner leaf clusters for depth and dimension */}
      <motion.path 
        d="M100 100 C70 100 60 80 70 60 C55 45 75 30 100 45 C125 30 145 45 130 60 C140 80 130 100 100 100 Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Blossom details scattered through the canopy */}
      {Array.from({ length: 12 }).map((_, i) => {
        // Random positions within the canopy bounds
        const angle = (i / 12) * Math.PI * 2;
        const distance = 15 + Math.random() * 25;
        const x = 100 + Math.cos(angle) * distance;
        const y = 70 + Math.sin(angle) * distance;
        const size = 3 + Math.random() * 3;
        
        return (
          <motion.circle 
            key={i}
            cx={x} 
            cy={y} 
            r={size} 
            fill={treeColors.blossom}
            initial={isAnimating ? { scale: 0, opacity: 0 } : false}
            animate={{ 
              scale: isAnimating ? 1 : [1, 1.2, 1], 
              opacity: isAnimating ? 1 : [1, 0.8, 1] 
            }}
            transition={isAnimating 
              ? { duration: 0.3, delay: 1 + (i * 0.05) }
              : { duration: 2 + (i % 3), repeat: Infinity, repeatType: "reverse" }
            }
          />
        );
      })}
    </BaseSVG>
  );
};

export default BlossomStage;
