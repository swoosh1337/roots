
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { TreeStage, stageToStreakMap } from './TreeStages';

interface TestControlsProps {
  currentStage: TreeStage;
  testStreak: number;
  onStreakChange: (newStreak: number) => void;
}

const TestControls: React.FC<TestControlsProps> = ({ 
  currentStage, 
  testStreak, 
  onStreakChange 
}) => {
  const stages = [
    { name: 'sprout', label: '1' },
    { name: 'sapling', label: '2' },
    { name: 'young', label: '3' },
    { name: 'full', label: '4' },
    { name: 'blossom', label: '5' },
    { name: 'fruit', label: '6' }
  ];
  
  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm rounded-full shadow-md p-2 flex items-center space-x-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stage buttons */}
      <div className="flex items-center space-x-2">
        {stages.map((stage) => (
          <motion.button
            key={stage.name}
            whileTap={{ scale: 0.95 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                      ${currentStage === stage.name 
                        ? 'bg-ritual-green text-white shadow-md' 
                        : 'bg-white text-ritual-forest border border-ritual-moss/30'}`}
            onClick={() => onStreakChange(stageToStreakMap[stage.name as keyof typeof stageToStreakMap])}
            aria-label={`Set tree to stage ${stage.label}`}
          >
            {stage.label}
          </motion.button>
        ))}
      </div>
      
      {/* Increment/decrement controls */}
      <div className="flex items-center space-x-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-full bg-ritual-green/10 text-ritual-green hover:bg-ritual-green/20"
          onClick={() => onStreakChange(Math.max(0, testStreak - 1))}
          aria-label="Decrease streak"
        >
          <Minus size={16} />
        </motion.button>
        <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-ritual-moss/30 text-sm">
          {testStreak}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-full bg-ritual-green/10 text-ritual-green hover:bg-ritual-green/20"
          onClick={() => onStreakChange(testStreak + 1)}
          aria-label="Increase streak"
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TestControls;
