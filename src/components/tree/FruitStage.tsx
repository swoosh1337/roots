
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
        d="M100 230C100 230 95 140 100 110C105 105 95 105 100 110"
        stroke={treeColors.trunk}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Top foliage layer */}
      <motion.path
        d="M100 110C75 95 60 105 85 115C115 95 130 110 100 110Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Middle foliage layer */}
      <motion.path
        d="M100 115C70 110 55 125 85 130C115 125 135 110 100 115Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Bottom foliage layer for depth */}
      <motion.path
        d="M95 130C70 125 60 140 90 145C120 140 125 125 95 130Z"
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Fruit details */}
      <motion.circle 
        cx="75" 
        cy="110" 
        r="6" 
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
        cx="125" 
        cy="115" 
        r="6" 
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
        cx="90" 
        cy="95" 
        r="6" 
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
        cx="110" 
        cy="100" 
        r="6" 
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
