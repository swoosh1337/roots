
import React, { useState } from 'react';
import { getTreeStage, stageToStreakMap, TreeStage } from '@/components/tree/TreeStages';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import TreeVisual from '@/components/TreeVisual';
import { Plus, Trash } from 'lucide-react';

interface TestModePanelProps {
  onAddTree: (streak: number) => void;
  onClearGarden: () => void;
}

const TestModePanel: React.FC<TestModePanelProps> = ({ onAddTree, onClearGarden }) => {
  const [selectedStage, setSelectedStage] = useState<TreeStage>('sapling');
  
  // Get streak count for the selected stage
  const getStreakForStage = (): number => {
    // Use the middle of the range for the selected stage
    const stageMin = stageToStreakMap[selectedStage];
    const nextStage = getNextStage(selectedStage);
    const stageMax = nextStage ? stageToStreakMap[nextStage] - 1 : 100;
    
    return Math.floor((stageMin + stageMax) / 2);
  };
  
  // Helper to get the next stage
  const getNextStage = (stage: TreeStage): TreeStage | null => {
    const stages: TreeStage[] = ['sprout', 'sapling', 'young', 'full', 'blossom', 'fruit'];
    const currentIndex = stages.indexOf(stage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };

  return (
    <div className="bg-white/80 rounded-lg shadow-sm border border-ritual-moss/30 p-4 mx-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-ritual-forest">Garden Test Mode</h3>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onClearGarden}
        >
          <Trash className="h-4 w-4 mr-1" />
          Clear Garden
        </Button>
      </div>
      
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">
            Tree Stage
          </label>
          <Select 
            value={selectedStage} 
            onValueChange={(value: TreeStage) => setSelectedStage(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sprout">Sprout (0-2 days)</SelectItem>
              <SelectItem value="sapling">Sapling (3-6 days)</SelectItem>
              <SelectItem value="young">Young (7-13 days)</SelectItem>
              <SelectItem value="full">Full (14-29 days)</SelectItem>
              <SelectItem value="blossom">Blossom (30-49 days)</SelectItem>
              <SelectItem value="fruit">Fruit (50+ days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-24 h-24">
          <TreeVisual streak={getStreakForStage()} isAnimating={false} />
        </div>
        
        <Button 
          onClick={() => onAddTree(getStreakForStage())}
          className="bg-ritual-green hover:bg-ritual-green/90 mb-1"
        >
          <Plus className="h-4 w-4 mr-1" /> 
          Add to Garden
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-ritual-forest/70">
        <p>Tip: Drag trees to rearrange them. Click the trash icon to remove trees.</p>
      </div>
    </div>
  );
};

export default TestModePanel;
