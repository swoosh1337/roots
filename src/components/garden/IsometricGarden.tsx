
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GardenTile from './GardenTile';
import { Ritual } from '@/hooks/useRituals';

interface IsometricGardenProps {
  rituals: Ritual[];
}

const IsometricGarden: React.FC<IsometricGardenProps> = ({ rituals }) => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  
  // Calculate grid size based on rituals count (minimum 3x3, maximum 5x5)
  const gridSize = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(rituals.length))));
  
  // Create a 2D grid layout
  const createGrid = () => {
    const grid = [];
    let ritualIndex = 0;
    
    for (let y = 0; y < gridSize; y++) {
      const row = [];
      for (let x = 0; x < gridSize; x++) {
        // Only add a ritual if we have one
        if (ritualIndex < rituals.length) {
          row.push({
            x,
            y,
            ritual: rituals[ritualIndex]
          });
          ritualIndex++;
        } else {
          // Add empty tile
          row.push({ x, y, ritual: null });
        }
      }
      grid.push(row);
    }
    
    return grid;
  };
  
  const grid = createGrid();
  
  const handleTileClick = (ritualId: string) => {
    setSelectedTile(selectedTile === ritualId ? null : ritualId);
  };
  
  // Animation variants for the whole garden
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto my-10 perspective-800">
      <motion.div 
        className="relative isometric-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          transform: 'rotateX(60deg) rotateZ(-45deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex" style={{ marginTop: `-${rowIndex * 10}px` }}>
            {row.map((tile) => (
              <GardenTile
                key={`tile-${tile.x}-${tile.y}`}
                x={tile.x}
                y={tile.y}
                ritual={tile.ritual}
                isSelected={selectedTile === (tile.ritual?.id || '')}
                onClick={tile.ritual ? () => handleTileClick(tile.ritual.id) : undefined}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default IsometricGarden;
