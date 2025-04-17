
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TreeVisual from '@/components/TreeVisual';
import { useRituals } from '@/hooks/useRituals';
import GardenGrid from '@/components/garden/GardenGrid';
import TestModePanel from '@/components/garden/TestModePanel';
import { TreeStage } from '@/components/tree/TreeStages';

export type GardenCell = {
  id: string;
  ritualId: string;
  streak: number;
  position: number;
};

const Garden = () => {
  const navigate = useNavigate();
  const { rituals, loading } = useRituals();
  const [testMode, setTestMode] = useState(false);
  const [cells, setCells] = useState<GardenCell[]>([]);
  const [draggedTree, setDraggedTree] = useState<GardenCell | null>(null);
  
  // Filter for only active rituals
  const activeRituals = rituals.filter(ritual => 
    ritual.status === 'active' || ritual.status === 'chained'
  );

  // Initialize garden cells from rituals if not already set
  React.useEffect(() => {
    if (activeRituals.length > 0 && cells.length === 0) {
      const newCells = activeRituals.map((ritual, index) => ({
        id: `cell-${index}`,
        ritualId: ritual.id,
        streak: ritual.streak_count,
        position: index
      }));
      setCells(newCells);
    }
  }, [activeRituals, cells.length]);

  // Handle drag start
  const handleDragStart = (cell: GardenCell) => {
    setDraggedTree(cell);
  };

  // Handle drag end and rearrangement
  const handleDragEnd = (droppedIndex: number) => {
    if (!draggedTree) return;
    
    setCells(prevCells => {
      // Create a new array with the tree moved to the new position
      const newCells = [...prevCells];
      const draggedIndex = newCells.findIndex(cell => cell.id === draggedTree.id);
      
      if (draggedIndex !== -1) {
        const [removedCell] = newCells.splice(draggedIndex, 1);
        newCells.splice(droppedIndex, 0, removedCell);
        
        // Update positions
        return newCells.map((cell, index) => ({
          ...cell,
          position: index
        }));
      }
      return prevCells;
    });
    
    setDraggedTree(null);
  };

  // Add a test tree in test mode
  const handleAddTestTree = (streak: number) => {
    if (!testMode) return;
    
    const newCell: GardenCell = {
      id: `test-${Date.now()}`,
      ritualId: `test-ritual-${Date.now()}`,
      streak,
      position: cells.length
    };
    
    setCells([...cells, newCell]);
  };

  // Remove a tree in test mode
  const handleRemoveTree = (cellId: string) => {
    if (!testMode) return;
    
    setCells(cells.filter(cell => cell.id !== cellId));
  };

  return (
    <div className="min-h-screen bg-ritual-paper">
      {/* Garden Header */}
      <div className="pt-8 pb-4 text-center relative">
        <h1 className="text-4xl font-serif text-ritual-green">My Garden</h1>
        
        {/* Test Mode Toggle (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-4"
            onClick={() => setTestMode(!testMode)}
          >
            <Settings className="h-4 w-4 mr-1" />
            {testMode ? "Exit Test Mode" : "Test Mode"}
          </Button>
        )}
      </div>
      
      {/* Test Mode Panel */}
      {testMode && (
        <TestModePanel 
          onAddTree={handleAddTestTree}
          onClearGarden={() => setCells([])}
        />
      )}
      
      {/* Garden Grid with Trees */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading your garden...</p>
          </div>
        ) : activeRituals.length === 0 && cells.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <p className="text-ritual-forest mb-4">Your garden is empty.</p>
            <p className="text-sm text-ritual-forest/70">Create rituals to see trees grow here.</p>
          </div>
        ) : (
          <GardenGrid
            cells={cells}
            testMode={testMode}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onRemoveTree={handleRemoveTree}
          />
        )}
      </div>
      
      {/* Back Button */}
      <div className="flex justify-center mb-8">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="rounded-full px-8 py-6 bg-ritual-paper/80 hover:bg-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default Garden;
