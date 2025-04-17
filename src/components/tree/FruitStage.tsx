
import React from 'react';
import { motion } from 'framer-motion';
import { BaseSVG, treeColors } from './TreeStages';

interface TreeStageProps {
  isAnimating: boolean;
}

const FruitStage: React.FC<TreeStageProps> = ({ isAnimating }) => {
  return (
    <BaseSVG isAnimating={isAnimating}>
      {/* Large trunk with widening base and proper taper */}
      <motion.path
        d="M100 230C100 230 95 150 100 115C105 110 95 110 100 115"
        stroke={treeColors.trunk}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: isAnimating ? 0 : 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Top foliage layer - more circular and balanced as in mockup */}
      <motion.path
        d="M100 115C70 100 60 110 85 125C115 105 135 110 100 115Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      
      {/* Middle foliage layer - more balanced */}
      <motion.path
        d="M95 125C65 120 55 135 85 140C115 135 130 120 95 125Z"
        fill={treeColors.leaf}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Bottom foliage layer for depth - more circular */}
      <motion.path
        d="M90 140C65 135 55 150 85 160C115 150 125 135 90 140Z"
        fill={treeColors.leafDark}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      
      {/* Fruit details - better positioned as in the mockup */}
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
        cx="85" 
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
        cx="115" 
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
      <motion.circle 
        cx="95" 
        cy="140" 
        r="6" 
        fill={treeColors.fruit}
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ 
          scale: isAnimating ? 1 : [1, 1.1, 1], 
          opacity: isAnimating ? 1 : [1, 0.8, 1] 
        }}
        transition={isAnimating 
          ? { duration: 0.3, delay: 1.5 }
          : { duration: 2.5, repeat: Infinity, repeatType: "reverse" }
        }
      />
    </BaseSVG>
  );
};

export default FruitStage;
