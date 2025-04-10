
import React from 'react';
import { motion } from 'framer-motion';

interface TreeVisualProps {
  streak: number;
  isAnimating: boolean;
}

const TreeVisual: React.FC<TreeVisualProps> = ({ streak, isAnimating }) => {
  // Tree visualization based on streak count
  // Day 1 = Sprout, Day 3 = Sapling, Day 7 = Young Tree,
  // Day 14 = Full Tree, Day 30 = Blossoms, Day 60+ = Fruits
  
  const getTreeStage = () => {
    if (streak >= 60) return 'fruit';
    if (streak >= 30) return 'blossom';
    if (streak >= 14) return 'full';
    if (streak >= 7) return 'young';
    if (streak >= 3) return 'sapling';
    return 'sprout';
  };

  const renderFallingPetals = () => {
    if (getTreeStage() !== 'blossom' && getTreeStage() !== 'fruit') return null;
    
    return Array.from({ length: 8 }).map((_, index) => (
      <div 
        key={index}
        className="petal"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          backgroundColor: getTreeStage() === 'fruit' 
            ? '#FFD6A5' // Fruit color
            : '#FFCFD2'  // Blossom color
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
        <ellipse cx="100" cy="230" rx="50" ry="15" fill="#DBE4C6" />
        
        {/* Trunk - common to all trees */}
        <motion.path 
          d="M100 230C100 230 95 180 100 160C105 140 100 130 100 130"
          stroke="#A67C52"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
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
            <circle cx="100" cy="125" r="8" fill="#A1C181" />
            <circle cx="105" cy="120" r="7" fill="#A1C181" />
          </>
        );
        
      case 'sapling':
        return baseSVG(
          <>
            {/* Two leaves */}
            <path 
              d="M85 115C75 105 80 90 95 95C110 100 115 115 100 120C85 125 75 115 85 115Z" 
              fill="#A1C181" 
            />
            <path 
              d="M115 115C125 105 120 90 105 95C90 100 85 115 100 120C115 125 125 115 115 115Z" 
              fill="#A1C181" 
            />
          </>
        );
        
      case 'young':
        return baseSVG(
          <>
            {/* Three branched young tree */}
            <path 
              d="M100 130C100 130 80 110 85 90C90 70 110 80 110 80" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <path 
              d="M100 130C100 130 120 110 115 90C110 70 90 80 90 80" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <circle cx="85" cy="82" r="12" fill="#A1C181" />
            <circle cx="115" cy="82" r="12" fill="#A1C181" />
            <circle cx="100" cy="70" r="15" fill="#A1C181" />
          </>
        );
        
      case 'full':
        return baseSVG(
          <>
            {/* Full leafy tree */}
            <path 
              d="M100 130C100 130 70 110 65 80C60 50 90 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <path 
              d="M100 130C100 130 130 110 135 80C140 50 110 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <circle cx="65" cy="70" r="20" fill="#A1C181" />
            <circle cx="100" cy="50" r="22" fill="#A1C181" />
            <circle cx="135" cy="70" r="20" fill="#A1C181" />
            <circle cx="80" cy="90" r="18" fill="#94B49F" />
            <circle cx="120" cy="90" r="18" fill="#94B49F" />
          </>
        );
        
      case 'blossom':
        return baseSVG(
          <>
            {/* Tree with blossoms */}
            <path 
              d="M100 130C100 130 70 110 65 80C60 50 90 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <path 
              d="M100 130C100 130 130 110 135 80C140 50 110 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <circle cx="65" cy="70" r="20" fill="#A1C181" />
            <circle cx="100" cy="50" r="22" fill="#A1C181" />
            <circle cx="135" cy="70" r="20" fill="#A1C181" />
            <circle cx="80" cy="90" r="18" fill="#94B49F" />
            <circle cx="120" cy="90" r="18" fill="#94B49F" />
            
            {/* Blossoms */}
            <circle cx="65" cy="60" r="5" fill="#FFCFD2" />
            <circle cx="90" cy="45" r="5" fill="#FFCFD2" />
            <circle cx="110" cy="45" r="5" fill="#FFCFD2" />
            <circle cx="135" cy="60" r="5" fill="#FFCFD2" />
            <circle cx="75" cy="85" r="4" fill="#FFCFD2" />
            <circle cx="125" cy="85" r="4" fill="#FFCFD2" />
          </>
        );
        
      case 'fruit':
        return baseSVG(
          <>
            {/* Tree with glowing fruit */}
            <path 
              d="M100 130C100 130 70 110 65 80C60 50 90 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <path 
              d="M100 130C100 130 130 110 135 80C140 50 110 60 100 50" 
              stroke="#A67C52" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <circle cx="65" cy="70" r="20" fill="#A1C181" />
            <circle cx="100" cy="50" r="22" fill="#A1C181" />
            <circle cx="135" cy="70" r="20" fill="#A1C181" />
            <circle cx="80" cy="90" r="18" fill="#94B49F" />
            <circle cx="120" cy="90" r="18" fill="#94B49F" />
            
            {/* Glowing Fruits */}
            <circle cx="65" cy="60" r="6" fill="#FFD6A5" />
            <circle cx="65" cy="60" r="8" fill="#FFD6A5" fillOpacity="0.3" />
            
            <circle cx="90" cy="45" r="6" fill="#FFD6A5" />
            <circle cx="90" cy="45" r="8" fill="#FFD6A5" fillOpacity="0.3" />
            
            <circle cx="110" cy="45" r="6" fill="#FFD6A5" />
            <circle cx="110" cy="45" r="8" fill="#FFD6A5" fillOpacity="0.3" />
            
            <circle cx="135" cy="60" r="6" fill="#FFD6A5" />
            <circle cx="135" cy="60" r="8" fill="#FFD6A5" fillOpacity="0.3" />
            
            <circle cx="75" cy="85" r="5" fill="#FFD6A5" />
            <circle cx="75" cy="85" r="7" fill="#FFD6A5" fillOpacity="0.3" />
            
            <circle cx="125" cy="85" r="5" fill="#FFD6A5" />
            <circle cx="125" cy="85" r="7" fill="#FFD6A5" fillOpacity="0.3" />
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {renderFallingPetals()}
      {renderTree()}
    </div>
  );
};

export default TreeVisual;
