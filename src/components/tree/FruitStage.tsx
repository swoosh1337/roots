
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const FruitStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Large trunk with widening base */}
      <motion.path
        d="M95 230c0 0 -5 -100 5 -110"
        stroke={treeColors.trunk}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Large rounded foliage based on mockup */}
      <motion.ellipse
        cx="100" 
        cy="100" 
        rx="45" 
        ry="40"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Darker bottom layer for depth */}
      <motion.ellipse
        cx="100" 
        cy="120" 
        rx="40" 
        ry="30"
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Fruit details */}
      <motion.circle 
        cx="70" 
        cy="90" 
        r="7" 
        fill={treeColors.fruit}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ 
          scale: isAnimating ? 1 : [1, 1.1, 1], 
          opacity: isAnimating ? 1 : [1, 0.8, 1] 
        }}
        transition={isAnimating 
          ? { duration: 0.3, delay: 1.2 }
          : { duration: 2, repeat: Infinity, repeatType: "reverse" }
        }
      />
      <motion.circle 
        cx="130" 
        cy="95" 
        r="7" 
        fill={treeColors.fruit}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ 
          scale: isAnimating ? 1 : [1, 1.1, 1], 
          opacity: isAnimating ? 1 : [1, 0.8, 1] 
        }}
        transition={isAnimating 
          ? { duration: 0.3, delay: 1.3 }
          : { duration: 2.3, repeat: Infinity, repeatType: "reverse" }
        }
      />
      <motion.circle 
        cx="85" 
        cy="75" 
        r="7" 
        fill={treeColors.fruit}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ 
          scale: isAnimating ? 1 : [1, 1.1, 1], 
          opacity: isAnimating ? 1 : [1, 0.8, 1] 
        }}
        transition={isAnimating 
          ? { duration: 0.3, delay: 1.1 }
          : { duration: 1.9, repeat: Infinity, repeatType: "reverse" }
        }
      />
      <motion.circle 
        cx="115" 
        cy="80" 
        r="7" 
        fill={treeColors.fruit}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ 
          scale: isAnimating ? 1 : [1, 1.1, 1], 
          opacity: isAnimating ? 1 : [1, 0.8, 1] 
        }}
        transition={isAnimating 
          ? { duration: 0.3, delay: 1.4 }
          : { duration: 2.2, repeat: Infinity, repeatType: "reverse" }
        }
      />
    </BaseSVG>
  );
};

export default FruitStage;
