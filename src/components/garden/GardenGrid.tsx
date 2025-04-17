
import React from 'react';
import { Motion, Presence } from 'framer-motion';
import TreeVisual from '@/components/TreeVisual';
import { GardenCell } from '@/pages/Garden';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GardenGridProps {
  cells: GardenCell[];
  testMode: boolean;
  onDragStart: (cell: GardenCell) => void;
  onDragEnd: (position: number) => void;
  onRemoveTree: (cellId: string) => void;
}

const GardenGrid: React.FC<GardenGridProps> = ({
  cells,
  testMode,
  onDragStart,
  onDragEnd,
  onRemoveTree
}) => {
  // Prepare cells for the grid (fill empty spaces if needed)
  const gridSize = Math.max(9, Math.ceil(cells.length / 3) * 3); // Ensure at least 9 cells, and always a multiple of 3
  const filledCells = [...cells];
  
  // Fill remaining cells with empty placeholders
  while (filledCells.length < gridSize) {
    filledCells.push({
      id: `empty-${filledCells.length}`,
      ritualId: '',
      streak: 0,
      position: filledCells.length
    });
  }

  // Handle drag over for empty cells
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    // Only allow dropping on empty cells
    const isEmptyCell = !cells.some(cell => cell.position === index);
    if (isEmptyCell) {
      e.currentTarget.classList.add('drop-target');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drop-target');
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-target');
    
    // Check if this is an empty cell
    const isEmptyCell = !cells.some(cell => cell.position === index);
    if (isEmptyCell) {
      onDragEnd(index);
    }
  };

  return (
    <div className="garden-grid relative mx-auto max-w-4xl">
      {/* Garden Ground */}
      <div className="garden-ground bg-[#F2FCE2] rounded-lg shadow-md p-6 mb-8">
        {/* Grid Lines */}
        <div className="garden-grid-lines mb-4">
          {/* Grid pattern - subtle lines */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 grid grid-cols-3 gap-4 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-ritual-moss/10 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Trees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filledCells.map((cell, index) => {
            const hasTree = cell.ritualId !== '';
            
            return (
              <div
                key={cell.id}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ${
                  hasTree ? 'bg-[#E6F4DC]/70' : 'bg-transparent'
                } ${testMode ? 'cursor-pointer' : ''}`}
                draggable={hasTree}
                onDragStart={(e) => {
                  if (hasTree) {
                    e.dataTransfer.setData('text/plain', cell.id);
                    onDragStart(cell);
                    
                    // Hide drag image
                    const img = new Image();
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    e.dataTransfer.setDragImage(img, 0, 0);
                    
                    setTimeout(() => {
                      e.currentTarget.classList.add('dragging');
                    }, 0);
                  }
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove('dragging');
                }}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                {hasTree ? (
                  <>
                    <div className="relative">
                      <TreeVisual 
                        streak={cell.streak} 
                        isAnimating={false}
                      />
                      
                      {/* Remove button in test mode */}
                      {testMode && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 rounded-full"
                          onClick={() => onRemoveTree(cell.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center">
                    {testMode && (
                      <div className="text-ritual-moss/50 text-sm">
                        Drop tree here
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GardenGrid;
