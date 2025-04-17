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

  // Map stage names to streak counts for quick access buttons
  const stageToStreakMap = {
    'sprout': 0,
    'sapling': 3,
    'young': 7,
    'full': 14,
    'blossom': 30,
    'fruit': 50
  };
  
  // Color palette based on the mockups
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
    
    // Base SVG components for all stages - ground
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

    // Based on the provided mockups, here are the simplified tree stages
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
            {/* Slightly curved trunk */}
            <motion.path
              d="M100 230c0 0 -3 -50 0 -55"
              stroke={colors.trunk}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: isAnimating ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Double leaf top based on mockup */}
            <motion.path 
              d="M100 175c-5 -8 -15 -8 -8 0c-2 -10 15 -8 8 0z" 
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
            {/* Slightly curved taller trunk */}
            <motion.path
              d="M100 230c0 0 -5 -70 0 -75"
              stroke={colors.trunk}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: isAnimating ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Three-leaf clover style top based on mockup */}
            <motion.path 
              d="M100 155c-10 0 -20 -10 -5 -5c-5 -10 15 -10 10 0c15 -5 5 15 -5 5z" 
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
            {/* Curved trunk */}
            <motion.path
              d="M100 230c0 0 -10 -80 0 -90"
              stroke={colors.trunk}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: isAnimating ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Rounded cloud-like foliage based on mockup */}
            <motion.path 
              d="M100 140c-25 -5 -40 -20 -20 -10c-15 -20 15 -15 20 -5c5 -10 35 -5 20 15c20 10 -15 5 -20 0z" 
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            
            {/* Darker areas for depth */}
            <motion.path 
              d="M90 145c-15 -5 -25 -15 0 -5c-5 -15 25 -5 5 5z" 
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
            {/* Tree trunk - slightly thicker */}
            <motion.path
              d="M95 230c0 0 -10 -100 5 -110"
              stroke={colors.trunk}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: isAnimating ? 0 : 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            {/* Large rounded foliage based on mockup */}
            <motion.ellipse
              cx="100" 
              cy="110" 
              rx="40" 
              ry="35"
              fill={colors.leaf}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            
            {/* Darker bottom layer for depth */}
            <motion.ellipse
              cx="100" 
              cy="125" 
              rx="35" 
              ry="25"
              fill={colors.leafDark}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            
            {/* Flower/blossom details */}
            <motion.circle 
              cx="70" 
              cy="100" 
              r="5" 
              fill={colors.blossom}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            />
            <motion.circle 
              cx="130" 
              cy="105" 
              r="5" 
              fill={colors.blossom}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.3 }}
            />
            <motion.circle 
              cx="100" 
              cy="90" 
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
            {/* Large trunk with widening base */}
            <motion.path
              d="M95 230c0 0 -5 -100 5 -110"
              stroke={colors.trunk}
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
              fill={colors.leaf}
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
              fill={colors.leafDark}
              initial={isAnimating ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            
            {/* Fruit details */}
            <motion.circle 
              cx="70" 
              cy="90" 
              r="7" 
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
              cy="95" 
              r="7" 
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
              cx="85" 
              cy="75" 
              r="7" 
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
              cx="115" 
              cy="80" 
              r="7" 
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

  // Quick access stage buttons for test mode
  const renderStageButtons = () => {
    if (!testMode) return null;
    
    const stages = [
      { name: 'sprout', label: '1' },
      { name: 'sapling', label: '2' },
      { name: 'young', label: '3' },
      { name: 'full', label: '4' },
      { name: 'blossom', label: '5' },
      { name: 'fruit', label: '6' }
    ];
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {stages.map((stage) => (
          <motion.button
            key={stage.name}
            whileTap={{ scale: 0.95 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                      ${getTreeStage() === stage.name 
                        ? 'bg-ritual-green text-white shadow-md' 
                        : 'bg-white text-ritual-forest border border-ritual-moss/30'}`}
            onClick={() => setTestStreak(stageToStreakMap[stage.name as keyof typeof stageToStreakMap])}
            aria-label={`Set tree to stage ${stage.label}`}
          >
            {stage.label}
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-64 h-64 flex flex-col items-center justify-center">
      {renderFallingPetals()}
      {renderTree()}
      
      {/* Test mode controls */}
      {testMode && (
        <div className="absolute bottom-0 left-0 w-full">
          {/* Stage buttons */}
          {renderStageButtons()}
          
          {/* Existing increment/decrement controls */}
          <div className="flex justify-center mt-4 space-x-2">
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
        </div>
      )}
    </div>
  );
};

export default TreeVisual;
