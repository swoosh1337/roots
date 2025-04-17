
import React, { useState } from 'react';
import { getTreeStage, TreeStage } from './tree/TreeStages';
import SproutStage from './tree/SproutStage';
import SaplingStage from './tree/SaplingStage';
import YoungStage from './tree/YoungStage';
import FullStage from './tree/FullStage';
import BlossomStage from './tree/BlossomStage';
import FruitStage from './tree/FruitStage';
import FallingPetals from './tree/FallingPetals';
import TestControls from './tree/TestControls';

interface TreeVisualProps {
  streak: number;
  isAnimating: boolean;
  testMode?: boolean;
}

const TreeVisual: React.FC<TreeVisualProps> = ({ 
  streak: initialStreak, 
  isAnimating, 
  testMode = false 
}) => {
  const [testStreak, setTestStreak] = useState(initialStreak);
  
  // Use testStreak if in testMode, otherwise use the prop value
  const streak = testMode ? testStreak : initialStreak;
  
  // Get current tree stage based on streak
  const currentStage = getTreeStage(streak);
  
  // Render the appropriate tree stage component
  const renderTree = () => {
    switch (currentStage) {
      case 'sprout':
        return <SproutStage isAnimating={isAnimating} />;
      case 'sapling':
        return <SaplingStage isAnimating={isAnimating} />;
      case 'young':
        return <YoungStage isAnimating={isAnimating} />;
      case 'full':
        return <FullStage isAnimating={isAnimating} />;
      case 'blossom':
        return <BlossomStage isAnimating={isAnimating} />;
      case 'fruit':
        return <FruitStage isAnimating={isAnimating} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-64 h-64 flex flex-col items-center justify-center">
      <FallingPetals stage={currentStage} />
      {renderTree()}
      
      {/* Test mode controls */}
      {testMode && (
        <TestControls 
          currentStage={currentStage}
          testStreak={testStreak}
          onStreakChange={setTestStreak}
        />
      )}
    </div>
  );
};

export default TreeVisual;
