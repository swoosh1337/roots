
import React from 'react';
import { motion } from 'framer-motion';
import { Ritual } from '@/hooks/useRituals';
import { getUpdatedTreeStage } from './treeStageMapping';

interface GardenTileProps {
  x: number;
  y: number;
  ritual: Ritual | null;
  isSelected: boolean;
  onClick?: () => void;
}

const GardenTile: React.FC<GardenTileProps> = ({ 
  x, 
  y, 
  ritual, 
  isSelected, 
  onClick 
}) => {
  // Tile dimensions
  const tileSize = 100;
  const tileHeight = 20;
  
  // Calculate position offset for isometric grid 
  // (offset every other row to create the isometric effect)
  const xOffset = x * (tileSize - 20) + y * 10;
  const yOffset = y * (tileSize - 50);
  
  // Animation variants
  const tileVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        delay: (x + y) * 0.08 
      }
    }
  };
  
  // Tile hover style
  const hoverStyle = ritual ? {
    cursor: 'pointer',
    filter: 'brightness(1.1)',
    transform: 'translateZ(5px)'
  } : {};
  
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${xOffset}px`,
        top: `${yOffset}px`,
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        transformStyle: 'preserve-3d'
      }}
      variants={tileVariants}
      whileHover={ritual ? hoverStyle : {}}
      onClick={onClick}
    >
      {/* Base tile */}
      <div 
        className="absolute bottom-0 w-full"
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Top face */}
        <div 
          className="absolute" 
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, #A1C181, #8FB573)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            transform: `translateZ(${tileHeight}px)`,
            boxShadow: isSelected ? '0 0 20px rgba(161, 193, 129, 0.7)' : 'none',
            transition: 'box-shadow 0.3s ease'
          }}
        />
        
        {/* Side faces to create depth */}
        <div 
          className="absolute" 
          style={{
            width: '100%',
            height: tileHeight,
            background: '#8B6C42',
            clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
            transform: 'rotateX(90deg) translateZ(0) translateY(-50%)',
            transformOrigin: 'top',
            opacity: 0.7
          }}
        />
        
        {/* Tree or plant based on ritual streak */}
        {ritual && (
          <div 
            className="absolute" 
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translateZ(${tileHeight + 1}px)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="relative"
              style={{ 
                transform: 'translateY(-40%) rotateX(-60deg) rotateZ(45deg)',
                width: '80%',
                height: '80%'
              }}
            >
              <img 
                src={getUpdatedTreeStage(ritual.streak_count)}
                alt={`${ritual.name} tree`}
                className="w-full h-full object-contain transition-all duration-300"
                style={{ 
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  filter: isSelected ? 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.1))' : 'none'
                }}
              />
            </div>
          </div>
        )}
        
        {/* Floating info card */}
        {isSelected && ritual && (
          <motion.div
            className="absolute w-40 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-center z-50"
            style={{
              bottom: '120%',
              left: '50%',
              transform: 'translateX(-50%) rotateX(-60deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h3 className="font-medium text-ritual-forest">{ritual.name}</h3>
            <p className="text-sm text-ritual-forest/80">
              Day {ritual.streak_count}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GardenTile;
