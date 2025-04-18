
import React from 'react';
import { motion } from 'framer-motion';

export type TreeStage = 'sprout' | 'sapling' | 'young' | 'full' | 'blossom' | 'fruit';

export const stageToStreakMap = {
  'sprout': 0,
  'sapling': 3,
  'young': 7,
  'full': 14,
  'blossom': 30,
  'fruit': 50
} as const;

export const getTreeStage = (streak: number): TreeStage => {
  if (streak >= 50) return 'fruit';
  if (streak >= 30) return 'blossom';
  if (streak >= 14) return 'full';
  if (streak >= 7) return 'young';
  if (streak >= 3) return 'sapling';
  return 'sprout';
};

// Add the missing exports for tree colors and BaseSVG component
export const treeColors = {
  trunk: '#8B5E3C',
  leaf: '#4CAF50',
  leafDark: '#388E3C',
  blossom: '#F8BBD0',
  fruit: '#FF5722'
};

interface BaseSVGProps {
  children: React.ReactNode;
  isAnimating: boolean;
}

export const BaseSVG: React.FC<BaseSVGProps> = ({ children, isAnimating }) => {
  return (
    <svg 
      width="200" 
      height="250" 
      viewBox="0 0 200 250" 
      className={`w-full h-full ${isAnimating ? '' : 'animate-sway'}`}
    >
      {/* Ground */}
      <motion.ellipse 
        cx="100" 
        cy="230" 
        rx="45" 
        ry="10" 
        fill="#E1E1E1"
        initial={isAnimating ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {children}
    </svg>
  );
};
