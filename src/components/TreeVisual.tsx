
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
    <div className="relative w-64 h-80 flex flex-col items-center justify-center"> {/* Increased height for more spacing */}
      <FallingPetals stage={currentStage} />
      <div className="mb-20"> {/* Increased bottom margin to create more space */}
        {renderTree()}
      </div>
      
      {/* Test mode controls positioned at bottom with good spacing */}
      {testMode && (
        <div className="absolute bottom-0 left-0 w-full">
          <TestControls 
            currentStage={currentStage}
            testStreak={testStreak}
            onStreakChange={setTestStreak}
          />
        </div>
      )}
    </div>
  );
};

export default TreeVisual;
