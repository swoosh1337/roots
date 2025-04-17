
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { TreeStage, stageToStreakMap } from './TreeStages';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  // Stage definitions with proper labels
  const stages = [
    { name: 'sprout', label: '1' },
    { name: 'sapling', label: '2' },
    { name: 'young', label: '3' },
    { name: 'full', label: '4' },
    { name: 'blossom', label: '5' },
    { name: 'fruit', label: '6' }
  ];
  
  return (
    <div className="px-4 py-6 flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-t-xl border-t border-ritual-moss/20 shadow-sm">
      {/* Stage selector using toggle group from shadcn/ui */}
      <ToggleGroup type="single" value={currentStage} onValueChange={(value) => {
        if (value) onStreakChange(stageToStreakMap[value as TreeStage]);
      }} className="bg-ritual-ground/30 p-1 rounded-full">
        {stages.map((stage) => (
          <ToggleGroupItem
            key={stage.name}
            value={stage.name}
            aria-label={`Set tree to stage ${stage.label}`}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-300
              data-[state=on]:bg-ritual-green data-[state=on]:text-white
              data-[state=off]:bg-transparent data-[state=off]:text-ritual-forest
              hover:bg-ritual-green/10`}
          >
            {stage.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      {/* Streak adjustment controls */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-ritual-green/10 text-ritual-forest hover:bg-ritual-green/20 transition-colors"
          onClick={() => onStreakChange(Math.max(0, testStreak - 1))}
          aria-label="Decrease streak"
        >
          <Minus size={16} />
        </motion.button>
        <div className="px-4 py-1 rounded-full bg-white border border-ritual-moss/30 text-sm font-medium min-w-[3rem] text-center">
          {testStreak}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-ritual-green/10 text-ritual-forest hover:bg-ritual-green/20 transition-colors"
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
