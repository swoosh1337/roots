
import React from 'react';
import { motion } from 'framer-motion';

// Define the color palette for the tree components
export const treeColors = {
  ground: '#E6F4DC',
  trunk: '#A67C52',
  leaf: '#8BAA76',
  leafDark: '#7A9969',
  blossom: '#FFCFD2',
  fruit: '#FFD6A5'
};

// Map stage names to streak counts for quick access buttons
export const stageToStreakMap = {
  'sprout': 0,
  'sapling': 3,
  'young': 7,
  'full': 14,
  'blossom': 30,
  'fruit': 50
};

export type TreeStage = keyof typeof stageToStreakMap;

// Helper function to determine tree stage based on streak count
export const getTreeStage = (streak: number): TreeStage => {
  if (streak >= 50) return 'fruit';
  if (streak >= 30) return 'blossom';
  if (streak >= 14) return 'full';
  if (streak >= 7) return 'young';
  if (streak >= 3) return 'sapling';
  return 'sprout';
};

// Base SVG wrapper component used by all tree stages
export const BaseSVG: React.FC<{
  children: React.ReactNode;
  isAnimating: boolean;
}> = ({ children, isAnimating }) => (
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
      fill={treeColors.ground}
      initial={isAnimating ? { opacity: 0.5, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    
    {/* Tree components passed as children */}
    {children}
  </motion.svg>
);
