
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
  // Quick access stage buttons for test mode
  const stages = [
    { name: 'sprout', label: '1' },
    { name: 'sapling', label: '2' },
    { name: 'young', label: '3' },
    { name: 'full', label: '4' },
    { name: 'blossom', label: '5' },
    { name: 'fruit', label: '6' }
  ];
  
  return (
    <div className="absolute bottom-0 left-0 w-full">
      {/* Stage buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {stages.map((stage) => (
          <motion.button
            key={stage.name}
            whileTap={{ scale: 0.95 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors
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
      <div className="flex justify-center mt-4 space-x-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-ritual-green text-white"
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
          className="p-2 rounded-full bg-ritual-green text-white"
          onClick={() => onStreakChange(testStreak + 1)}
          aria-label="Increase streak"
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default TestControls;
