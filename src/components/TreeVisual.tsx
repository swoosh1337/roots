
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
  
  // Color palette based on the screenshots
  const colors = {
    ground: '#E6F4DC',
    trunk: '#A67C52',
    leaf: '#8BAA76',
    leafDark: '#7A9969',
    blossom: '#FFCFD2',
    fruit: '#FFD6A5'
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
          fill={colors.ground}
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
            {/* Simple straight trunk */}
            <motion.rect
              x="98" 
              y="195" 
              width="4" 
              height="35"
              fill={colors.trunk}
              rx="1"
              initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
              animate={{ scaleY: 1, originY: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Single leaf */}
            <motion.path 
              d="M100 195C100 195 92 185 100 180C108 185 100 195 100 195Z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
          </>
        );
        
      case 'sapling':
        return baseSVG(
          <>
            {/* Slightly taller trunk */}
            <motion.rect
              x="97" 
              y="175" 
              width="6" 
              height="55"
              fill={colors.trunk}
              rx="2"
              initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
              animate={{ scaleY: 1, originY: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Heart-shaped leaf on top */}
            <motion.path 
              d="M100 175c-5-7-15-7-15 3s10 15 15 15c5 0 15-5 15-15s-10-10-15-3z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
          </>
        );
        
      case 'young':
        return baseSVG(
          <>
            {/* Slightly taller trunk */}
            <motion.rect
              x="97" 
              y="165" 
              width="6" 
              height="65"
              fill={colors.trunk}
              rx="2"
              initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
              animate={{ scaleY: 1, originY: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Three-leaf clover style top */}
            <motion.path 
              d="M100 165c-8-5-18 0-15 10 2 10 12 8 15 5 3 3 13 5 15-5 3-10-7-15-15-10z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
          </>
        );
        
      case 'full':
        return baseSVG(
          <>
            {/* Wider trunk with slight taper */}
            <motion.path
              d="M90 230c0-40 3-60 10-75 7 15 10 35 10 75H90z" 
              fill={colors.trunk}
              initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
              animate={{ scaleY: 1, originY: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Simple cloud-like foliage */}
            <motion.path 
              d="M100 155c-25 0-35-20-30-35 5-15 20-15 30-5 10-10 25-10 30 5 5 15-5 35-30 35z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            
            {/* Darker areas for depth */}
            <motion.path 
              d="M85 145c0-15 10-25 15-15 5-10 15 0 15 15-10 15-20 15-30 0z" 
              fill={colors.leafDark}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
          </>
        );
        
      case 'blossom':
        return baseSVG(
          <>
            {/* Wider trunk with more taper */}
            <motion.path
              d="M85 230c0-40 5-65 15-80 10 15 15 40 15 80H85z" 
              fill={colors.trunk}
              initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
              animate={{ scaleY: 1, originY: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Large cloud-like foliage */}
            <motion.path 
              d="M100 150c-30 0-45-25-40-45 5-20 25-20 40-5 15-15 35-15 40 5 5 20-10 45-40 45z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            
            {/* Darker areas for depth */}
            <motion.path 
              d="M80 130c0-20 15-35 20-25 10-10 20 5 20 25-15 20-25 20-40 0z" 
              fill={colors.leafDark}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            
            {/* Flower/blossom details */}
            <motion.circle 
              cx="70" 
              cy="120" 
              r="5" 
              fill={colors.blossom}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            />
            <motion.circle 
              cx="130" 
              cy="125" 
              r="5" 
              fill={colors.blossom}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.3 }}
            />
            <motion.circle 
              cx="100" 
              cy="105" 
              r="5" 
              fill={colors.blossom}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.1 }}
            />
          </>
        );
        
      case 'fruit':
        return baseSVG(
          <>
            {/* Wider trunk with more taper - like in the screenshot */}
            <motion.path
              d="M85 230c0-40 5-65 15-85 10 20 15 45 15 85H85z" 
              fill={colors.trunk}
              initial={{ scaleY: isAnimating ? 0 : 1, originY: "100%" }}
              animate={{ scaleY: 1, originY: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Large cloud-like foliage similar to the screenshot */}
            <motion.path 
              d="M100 145c-35 0-50-25-45-45 5-20 25-20 45-5 20-15 40-15 45 5 5 20-10 45-45 45z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            
            {/* Darker areas for depth */}
            <motion.path 
              d="M75 125c0-20 15-35 25-25 10-10 25 5 25 25-15 20-35 20-50 0z" 
              fill={colors.leafDark}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            
            {/* Fruit details */}
            <motion.circle 
              cx="70" 
              cy="120" 
              r="6" 
              fill={colors.fruit}
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
              cy="125" 
              r="6" 
              fill={colors.fruit}
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
              cy="105" 
              r="6" 
              fill={colors.fruit}
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
              cy="115" 
              r="6" 
              fill={colors.fruit}
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
          </>
        );
        
      default:
        return null;
    }
  };

  const renderFallingPetals = () => {
    if (getTreeStage() !== 'blossom' && getTreeStage() !== 'fruit') return null;
    
    return Array.from({ length: 6 }).map((_, index) => (
      <motion.div 
        key={index}
        className="absolute w-2 h-2 rounded-full opacity-80 pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: getTreeStage() === 'fruit' 
            ? colors.fruit // Fruit color
            : colors.blossom,  // Blossom color
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
