
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

