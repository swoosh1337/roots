
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface TreeVisualProps {
  streak: number;
  isAnimating: boolean;
  testMode?: boolean;
}

const TreeVisual: React.FC<TreeVisualProps> = ({ streak: initialStreak, isAnimating, testMode = false }) => {
  const [testStreak, setTestStreak] = useState(initialStreak);
  
  // Use testStreak if in testMode, otherwise use the prop value
  const streak = testMode ? testStreak : initialStreak;

  // Tree visualization based on streak count
  // 0-2 = Tiny sprout, 3-6 = Sapling, 7-13 = Young Tree,
  // 14-29 = Full Tree, 30-49 = Blossoms, 50+ = Fruits
  
  const getTreeStage = () => {
    if (streak >= 50) return 'fruit';
    if (streak >= 30) return 'blossom';
    if (streak >= 14) return 'full';
    if (streak >= 7) return 'young';
    if (streak >= 3) return 'sapling';
    return 'sprout';
  };

  const renderFallingPetals = () => {
    if (getTreeStage() !== 'blossom' && getTreeStage() !== 'fruit') return null;
    
    return Array.from({ length: 8 }).map((_, index) => (
      <motion.div 
        key={index}
        className="absolute w-2 h-2 rounded-full opacity-80 pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: getTreeStage() === 'fruit' 
            ? '#FFD6A5' // Fruit color
            : '#FFCFD2',  // Blossom color
          top: `-${Math.random() * 20}px`,
        }}
        animate={{
          y: [0, 100, 200],
          x: [0, Math.random() * 30 - 15, Math.random() * 50 - 25],
          opacity: [0.8, 0.5, 0],
          rotate: [0, Math.random() * 360]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: Math.random() * 2,
          delay: Math.random() * 3
        }}
      />
    ));
  };

  const renderTree = () => {
    const stage = getTreeStage();
    
    // Base SVG components for all stages - trunk and ground
    const baseSVG = (children: React.ReactNode) => (
      <motion.svg
        width="200"
        height="250"
        viewBox="0 0 200 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${isAnimating ? 'animate-tree-grow' : 'animate-sway'}`}
      >
        {/* Ground */}
        <motion.ellipse 
          cx="100" 
          cy="230" 
          rx="50" 
          ry="15" 
          fill="#DBE4C6"
          initial={isAnimating ? { opacity: 0.5, scale: 0.9 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Trunk - common to all trees */}
        <motion.path 
          d="M100 230C100 230 95 180 100 160C105 140 100 130 100 130"
          stroke="#A67C52"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: isAnimating ? 0 : 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
        
        {/* Specific stage components */}
        {children}
      </motion.svg>
    );

    switch (stage) {
      case 'sprout':
        return baseSVG(
          <>
            {/* Small leaves */}
            <motion.circle 
              cx="100" 
              cy="125" 
              r="8" 
              fill="#A1C181"
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            <motion.circle 
              cx="105" 
              cy="120" 
              r="7" 
              fill="#A1C181"
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
          </>
        );
        
      case 'sapling':
        return baseSVG(
          <>
            {/* Two leaves */}
            <motion.path 
              d="M85 115C75 105 80 90 95 95C110 100 115 115 100 120C85 125 75 115 85 115Z" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0.5 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.path 
              d="M115 115C125 105 120 90 105 95C90 100 85 115 100 120C115 125 125 115 115 115Z" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0.5 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </>
        );
        
      case 'young':
        return baseSVG(
          <>
            {/* Three branched young tree */}
            <motion.path 
              d="M100 130C100 130 80 110 85 90C90 70 110 80 110 80" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }} 
            />
            <motion.path 
              d="M100 130C100 130 120 110 115 90C110 70 90 80 90 80" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.circle 
              cx="85" 
              cy="82" 
              r="12" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
            <motion.circle 
              cx="115" 
              cy="82" 
              r="12" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            <motion.circle 
              cx="100" 
              cy="70" 
              r="15" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
          </>
        );
        
      case 'full':
        return baseSVG(
          <>
            {/* Full leafy tree */}
            <motion.path 
              d="M100 130C100 130 70 110 65 80C60 50 90 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.path 
              d="M100 130C100 130 130 110 135 80C140 50 110 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.circle 
              cx="65" 
              cy="70" 
              r="20" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
            <motion.circle 
              cx="100" 
              cy="50" 
              r="22" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            />
            <motion.circle 
              cx="135" 
              cy="70" 
              r="20" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            />
            <motion.circle 
              cx="80" 
              cy="90" 
              r="18" 
              fill="#94B49F"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            <motion.circle 
              cx="120" 
              cy="90" 
              r="18" 
              fill="#94B49F"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            />
          </>
        );
        
      case 'blossom':
        return baseSVG(
          <>
            {/* Tree with blossoms */}
            <motion.path 
              d="M100 130C100 130 70 110 65 80C60 50 90 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.path 
              d="M100 130C100 130 130 110 135 80C140 50 110 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.circle 
              cx="65" 
              cy="70" 
              r="20" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
            <motion.circle 
              cx="100" 
              cy="50" 
              r="22" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            />
            <motion.circle 
              cx="135" 
              cy="70" 
              r="20" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            />
            <motion.circle 
              cx="80" 
              cy="90" 
              r="18" 
              fill="#94B49F"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            <motion.circle 
              cx="120" 
              cy="90" 
              r="18" 
              fill="#94B49F"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            />
            
            {/* Blossoms - animate appearance */}
            <motion.circle 
              cx="65" 
              cy="60" 
              r="5" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 2 }}
            />
            <motion.circle 
              cx="90" 
              cy="45" 
              r="5" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 2.1 }}
            />
            <motion.circle 
              cx="110" 
              cy="45" 
              r="5" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 2.2 }}
            />
            <motion.circle 
              cx="135" 
              cy="60" 
              r="5" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 2.3 }}
            />
            <motion.circle 
              cx="75" 
              cy="85" 
              r="4" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 2.4 }}
            />
            <motion.circle 
              cx="125" 
              cy="85" 
              r="4" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 2.5 }}
            />
          </>
        );
        
      case 'fruit':
        return baseSVG(
          <>
            {/* Tree with glowing fruit */}
            <motion.path 
              d="M100 130C100 130 70 110 65 80C60 50 90 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.path 
              d="M100 130C100 130 130 110 135 80C140 50 110 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.circle 
              cx="65" 
              cy="70" 
              r="20" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
            <motion.circle 
              cx="100" 
              cy="50" 
              r="22" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            />
            <motion.circle 
              cx="135" 
              cy="70" 
              r="20" 
              fill="#A1C181"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            />
            <motion.circle 
              cx="80" 
              cy="90" 
              r="18" 
              fill="#94B49F"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            <motion.circle 
              cx="120" 
              cy="90" 
              r="18" 
              fill="#94B49F"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            />
            
            {/* Glowing Fruits - with pulsing animation */}
            <motion.circle 
              cx="65" 
              cy="60" 
              r="6" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false} 
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 2 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2 }
              }
            />
            <motion.circle 
              cx="65" 
              cy="60" 
              r="8" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <motion.circle 
              cx="90" 
              cy="45" 
              r="6" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 2.1 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2.3 }
              }
            />
            <motion.circle 
              cx="90" 
              cy="45" 
              r="8" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.3, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            />
            
            <motion.circle 
              cx="110" 
              cy="45" 
              r="6" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 2.2 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 1.9 }
              }
            />
            <motion.circle 
              cx="110" 
              cy="45" 
              r="8" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.7, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
            />
            
            <motion.circle 
              cx="135" 
              cy="60" 
              r="6" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 2.3 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2.2 }
              }
            />
            <motion.circle 
              cx="135" 
              cy="60" 
              r="8" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
            />
            
            <motion.circle 
              cx="75" 
              cy="85" 
              r="5" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 2.4 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2 }
              }
            />
            <motion.circle 
              cx="75" 
              cy="85" 
              r="7" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
            />
            
            <motion.circle 
              cx="125" 
              cy="85" 
              r="5" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 2.5 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 1.8 }
              }
            />
            <motion.circle 
              cx="125" 
              cy="85" 
              r="7" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="relative w-64 h-64 flex flex-col items-center justify-center">
      {renderFallingPetals()}
      {renderTree()}
      
      {/* Test mode controls */}
      {testMode && (
        <div className="absolute bottom-0 left-0 w-full flex justify-center mt-4 space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-ritual-green text-white"
            onClick={() => setTestStreak(prev => Math.max(0, prev - 1))}
            aria-label="Decrease streak"
          >
            <Minus size={16} />
          </motion.button>
          <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-ritual-moss/30 text-sm">
            {testStreak}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-ritual-green text-white"
            onClick={() => setTestStreak(prev => prev + 1)}
            aria-label="Increase streak"
          >
            <Plus size={16} />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TreeVisual;
