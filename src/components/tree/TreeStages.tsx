
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Color palette for tree components
 * Defines natural, organic colors for different tree parts
 * - ground: Soft earth tone for the base
 * - trunk: Rich brown for the tree trunk
 * - leaf: Fresh green for primary leaf color
 * - leafDark: Deeper green for depth and shading
 * - blossom: Delicate pink for flower details
 * - fruit: Warm orange-red for fruit elements
 */
export const treeColors = {
  ground: '#E6F4DC',
  trunk: '#8D6E63',
  leaf: '#7CB342',
  leafDark: '#558B2F',
  blossom: '#F8BBD0',
  fruit: '#FF8A65'
};

/**
 * Mapping of tree stages to streak counts
 * Defines the minimum streak count required to reach each tree stage
 * - sprout: Initial stage (0 streak)
 * - sapling: Reached at 3 consecutive days
 * - young: Reached at 7 consecutive days
 * - full: Reached at 14 consecutive days
 * - blossom: Reached at 30 consecutive days
 * - fruit: Reached at 50 consecutive days
 */
export const stageToStreakMap = {
  'sprout': 0,
  'sapling': 3,
  'young': 7,
  'full': 14,
  'blossom': 30,
  'fruit': 50
};

/**
 * Type definition for tree stages based on the stageToStreakMap keys
 */
export type TreeStage = keyof typeof stageToStreakMap;

/**
 * Determines the current tree stage based on the user's streak count
 * 
 * @param streak - Number of consecutive days a ritual has been maintained
 * @returns The corresponding tree stage based on streak progression
 * 
 * Stage progression logic:
 * - 0-2 days: sprout
 * - 3-6 days: sapling
 * - 7-13 days: young
 * - 14-29 days: full
 * - 30-49 days: blossom
 * - 50+ days: fruit
 */
export const getTreeStage = (streak: number): TreeStage => {
  if (streak >= 50) return 'fruit';
  if (streak >= 30) return 'blossom';
  if (streak >= 14) return 'full';
  if (streak >= 7) return 'young';
  if (streak >= 3) return 'sapling';
  return 'sprout';
};

/**
 * Base SVG wrapper for all tree stage components
 * Provides consistent ground and animation handling
 * 
 * @param children - Tree stage-specific SVG elements
 * @param isAnimating - Flag to control initial growth animation
 */
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
    {/* Ground element with subtle animation */}
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
    
    {/* Render specific tree stage components */}
    {children}
  </motion.svg>
);
