
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
        
        {/* Specific stage components */}
        {children}
      </motion.svg>
    );

    switch (stage) {
      case 'sprout':
        return baseSVG(
          <>
            {/* Trunk - simple straight line */}
            <motion.path 
              d="M100 230L100 210"
              stroke="#A67C52"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: isAnimating ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            
            {/* Single leaf */}
            <motion.path 
              d="M100 210C100 210 95 200 100 198C105 200 100 210 100 210Z" 
              fill="#8BAA76"
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
          </>
        );
        
      case 'sapling':
        return baseSVG(
          <>
            {/* Longer trunk */}
            <motion.path 
              d="M100 230L100 190"
              stroke="#A67C52"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: isAnimating ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            
            {/* Two leaves */}
            <motion.path 
              d="M100 190C90 185 85 175 95 170C105 175 110 185 100 190Z" 
              fill="#8BAA76"
              initial={isAnimating ? { opacity: 0, scale: 0.5 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </>
        );
        
      case 'young':
        return baseSVG(
          <>
            {/* Slightly curved trunk */}
            <motion.path 
              d="M100 230C100 230 95 210 100 180C105 150 100 150 100 150" 
              stroke="#A67C52" 
              strokeWidth="8" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }} 
            />
            
            {/* Cloud-like foliage */}
            <motion.path 
              d="M100 150C70 150 70 120 90 110C110 100 130 110 130 130C130 150 100 150 100 150Z" 
              fill="#8BAA76"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
          </>
        );
        
      case 'full':
        return baseSVG(
          <>
            {/* Thicker trunk with slight curve */}
            <motion.path 
              d="M100 230C100 230 95 200 100 170C105 140 100 130 100 130" 
              stroke="#9E7553" 
              strokeWidth="10" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            {/* Fluffy, cloud-like foliage */}
            <motion.path 
              d="M100 130C60 130 60 90 80 80C60 70 70 40 90 40C110 40 120 70 100 80C120 90 140 110 120 130C100 140 100 130 100 130Z" 
              fill="#8BAA76"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            
            {/* Darker undertones */}
            <motion.path 
              d="M100 130C80 130 70 110 75 95C65 100 60 120 80 125C90 135 100 130 100 130Z" 
              fill="#7A9969"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
          </>
        );
        
      case 'blossom':
        return baseSVG(
          <>
            {/* Strong trunk with texture */}
            <motion.path 
              d="M100 230C100 230 95 200 100 170C105 140 100 130 100 130" 
              stroke="#9E7553" 
              strokeWidth="12" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            {/* Texture lines on trunk */}
            <motion.path 
              d="M95 200L105 195M95 180L105 175" 
              stroke="#8B6B4A" 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />
            
            {/* Lush, full foliage */}
            <motion.path 
              d="M100 130C50 130 50 80 70 60C40 60 50 20 80 20C110 20 120 50 100 60C130 70 150 100 120 130C100 140 100 130 100 130Z" 
              fill="#8BAA76"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            
            {/* Darker undertones */}
            <motion.path 
              d="M100 130C70 130 60 100 65 85C55 90 50 110 70 125C90 135 100 130 100 130Z" 
              fill="#7A9969"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
            
            {/* Blossoms */}
            <motion.circle 
              cx="70" 
              cy="50" 
              r="6" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            <motion.circle 
              cx="90" 
              cy="40" 
              r="5" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.3 }}
            />
            <motion.circle 
              cx="120" 
              cy="60" 
              r="6" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
            <motion.circle 
              cx="115" 
              cy="90" 
              r="5" 
              fill="#FFCFD2"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.5 }}
            />
          </>
        );
        
      case 'fruit':
        return baseSVG(
          <>
            {/* Strong mature trunk with texture */}
            <motion.path 
              d="M100 230C95 215 90 200 95 170C100 140 95 130 100 130" 
              stroke="#8B6B4A" 
              strokeWidth="14" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            {/* Texture on trunk */}
            <motion.path 
              d="M90 200L100 195M90 180L100 175M90 160L100 155" 
              stroke="#7D5F3F" 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={isAnimating ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />
            
            {/* Lush, full foliage - more detailed shape */}
            <motion.path 
              d="M100 130C40 130 40 80 60 50C30 60 30 10 70 10C110 10 130 40 110 60C140 60 160 90 130 130C110 150 100 130 100 130Z" 
              fill="#7A9969"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
            
            {/* Lighter highlights */}
            <motion.path 
              d="M90 20C110 10 130 30 120 50C140 40 150 70 130 90C140 110 120 125 100 125C85 125 70 100 80 80C60 70 70 40 90 20Z" 
              fill="#8BAA76"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            />
            
            {/* Fruits with glow effect */}
            <motion.circle 
              cx="60" 
              cy="60" 
              r="7" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 1.2 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2 }
              }
            />
            <motion.circle 
              cx="60" 
              cy="60" 
              r="9" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <motion.circle 
              cx="90" 
              cy="40" 
              r="7" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 1.3 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2.3 }
              }
            />
            <motion.circle 
              cx="90" 
              cy="40" 
              r="9" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.3, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            />
            
            <motion.circle 
              cx="130" 
              cy="70" 
              r="7" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 1.4 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 1.9 }
              }
            />
            <motion.circle 
              cx="130" 
              cy="70" 
              r="9" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.7, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
            />
            
            <motion.circle 
              cx="115" 
              cy="110" 
              r="6" 
              fill="#FFD6A5"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={isAnimating 
                ? { duration: 0.6, delay: 1.5 }
                : { scale: [1, 1.1, 1], opacity: [1, 0.8, 1], repeat: Infinity, repeatType: "reverse", duration: 2.2 }
              }
            />
            <motion.circle 
              cx="115" 
              cy="110" 
              r="8" 
              fill="#FFD6A5" 
              fillOpacity="0.3"
              initial={isAnimating ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
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
