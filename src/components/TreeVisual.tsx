import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTreeStage } from './tree/TreeStages';
import WaterDrop from './animations/WaterDrop';
import Ripple from './animations/Ripple';

interface TreeVisualProps {
  streak: number;
  isAnimating: boolean;
}

const stageImages = {
  sprout: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png',
  sapling: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-2.png',
  young: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-3.png',
  full: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-4.png',
  blossom: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-5.png',
  fruit: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-6.png'
};

// Helper method to verify image loading
const imageExists = (url: string): boolean => {
  const img = new Image();
  img.src = url;
  return img.complete;
};

const TreeVisual: React.FC<TreeVisualProps> = ({ 
  streak, 
  isAnimating
}) => {
  const currentStage = getTreeStage(streak);
  
  const imagePath = stageImages[currentStage];
  
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <motion.div
        className={`w-full h-full flex items-center justify-center ${isAnimating ? '' : 'animate-sway'}`}
        initial={isAnimating ? { scale: 0.95, opacity: 0.8 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={imagePath}
          alt={`Tree at ${currentStage} stage`}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.style.border = "1px dashed red";
            e.currentTarget.style.padding = "8px";
          }}
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        />
        
        <AnimatePresence>
          <WaterDrop key="water-drop" isAnimating={isAnimating} />
          <Ripple key="ripple" isAnimating={isAnimating} />
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default TreeVisual;
