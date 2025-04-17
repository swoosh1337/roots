
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const FruitStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Thick, mature trunk with natural curve and strong taper */}
      <motion.path
        d="M100 230 C94 180 106 130 100 100"
        stroke={treeColors.trunk}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Full, lush canopy - rounded, multi-layered foliage */}
      <motion.path
        d="M100 100 C55 100 35 70 50 40 C30 15 65 0 100 15 C135 0 170 15 150 40 C165 70 145 100 100 100 Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Inner leaf clusters for depth and dimension */}
      <motion.path 
        d="M100 90 C65 90 50 65 65 40 C45 20 75 10 100 25 C125 10 155 20 135 40 C150 65 135 90 100 90 Z" 
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Fruit details strategically placed throughout the canopy */}
      {Array.from({ length: 8 }).map((_, i) => {
        // Strategic positions for fruits
        const positions = [
          { x: 70, y: 45 },
          { x: 130, y: 45 },
          { x: 60, y: 70 },
          { x: 140, y: 70 },
          { x: 85, y: 30 },
          { x: 115, y: 30 },
          { x: 75, y: 60 },
          { x: 125, y: 60 },
        ];
        
        return (
          <motion.circle 
            key={i}
            cx={positions[i].x} 
            cy={positions[i].y} 
            r={8} 
            fill={treeColors.fruit}
            initial={isAnimating ? { scale: 0, opacity: 0 } : false}
            animate={{ 
              scale: isAnimating ? 1 : [1, 1.1, 1], 
              opacity: isAnimating ? 1 : [1, 0.9, 1] 
            }}
            transition={isAnimating 
              ? { duration: 0.3, delay: 1.1 + (i * 0.1) }
              : { duration: 2 + (i % 3), repeat: Infinity, repeatType: "reverse" }
            }
          />
        );
      })}
    </BaseSVG>
  );
};

export default FruitStage;
