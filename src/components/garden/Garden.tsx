import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../ui/Garden.css';
import type { Ritual } from '@/types/ritual';
import RitualPopup from '../popups/RitualPopup';

// Tree stage images from Supabase
const treeStages = [
  'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png',
  'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-2.png',
  'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-3.png',
  'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-4.png',
  'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-5.png',
  'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-6.png',
];

// Interfaces
interface TreeData {
  id: string;
  stage: number;
  name: string;
  streak_count: number;
}

interface GardenProps {
  rituals: Ritual[];
  onClose: () => void;
  isViewOnly?: boolean;
}

// Helper to determine tree stage based on streak count
const getTreeStageIndex = (streakCount: number): number => {
  if (streakCount >= 50) return 5;
  if (streakCount >= 30) return 4;
  if (streakCount >= 14) return 3;
  if (streakCount >= 7) return 2;
  if (streakCount >= 3) return 1;
  return 0;
};

// Helper to calculate grid layout
const calculateGridLayout = (count: number) => {
  // Use a fixed 4-column layout like in the image
  const columns = 4;

  // Calculate how many rows we need
  let rows = Math.ceil(count / columns);

  // Ensure we have at least one row
  rows = Math.max(1, rows);

  return { rows, columns, totalPlots: columns * rows };
};

const Garden: React.FC<GardenProps> = ({ rituals, onClose, isViewOnly = false }) => {
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [gridLayout, setGridLayout] = useState({ rows: 3, columns: 4 });
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const gardenContainerRef = useRef<HTMLDivElement>(null);

  // Initialize garden with rituals - filter out paused rituals
  useEffect(() => {
    // Only include active rituals in the garden (status === 'active' or 'chained')
    const activeRituals = rituals.filter(ritual => ritual.status !== 'paused');
    
    const gardenTrees: TreeData[] = activeRituals.map(ritual => ({
      id: ritual.id,
      name: ritual.name,
      stage: getTreeStageIndex(ritual.streak_count),
      streak_count: ritual.streak_count
    }));

    // Calculate the grid layout
    const layout = calculateGridLayout(gardenTrees.length);
    setGridLayout(layout);

    // Add empty plots to fill the grid
    const totalPlots = layout.rows * layout.columns;
    const allTrees = [...gardenTrees];

    if (allTrees.length < totalPlots) {
      const emptyPlotsNeeded = totalPlots - allTrees.length;
      for (let i = 0; i < emptyPlotsNeeded; i++) {
        allTrees.push({ id: `empty-${i}`, stage: -1, name: "", streak_count: 0 });
      }
    }

    setTrees(allTrees);
  }, [rituals]);

  // Handle tree click - TOGGLE popup
  const handleTreeClick = (tree: TreeData, event: React.MouseEvent<HTMLDivElement>) => {
    // Stop propagation to prevent issues with nested clicks
    event.stopPropagation();

    if (tree.stage >= 0) {
      // Toggle popup - if the same tile is clicked again, close it; otherwise open new popup
      setActivePopupId(activePopupId === tree.id ? null : tree.id);
    } else {
      // Close popup if clicking empty plot
      setActivePopupId(null);
    }
  };

  // Add a click handler for the entire garden to close any open popup
  const handleGardenClick = () => {
    if (activePopupId) {
      setActivePopupId(null);
    }
  };

  // Handle closing the popup
  const handleClosePopup = () => {
    setActivePopupId(null);
  };

  // Close popup when clicking outside the garden plots or popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside the popup itself
      const popupElement = document.querySelector('.ritual-popup-container');
      if (activePopupId &&
          gardenContainerRef.current &&
          !gardenContainerRef.current.contains(event.target as Node) &&
          (!popupElement || !popupElement.contains(event.target as Node)))
      {
          handleClosePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopupId]); // Re-run when popup ID changes

  return (
    <motion.div
      className="garden-container fixed inset-0 bg-ritual-paper z-40"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      ref={gardenContainerRef}
      onClick={handleGardenClick}
    >
      <div className="garden-header">
        <h1 className="garden-title">{isViewOnly ? "Friend's Garden" : "My Garden"}</h1>
        <button
          onClick={onClose}
          className="garden-close-button"
          aria-label="Close garden view"
        >
          &times;
        </button>
      </div>

      <div
        className="garden-grid"
        style={{
          gridTemplateColumns: `repeat(${gridLayout.columns}, 1fr)`,
        }}
      >
        {trees.map(tree => (
          <motion.div
            key={tree.id}
            className={`garden-plot
              ${tree.stage < 0 ? 'garden-plot-empty' : ''}
              ${activePopupId === tree.id ? 'garden-plot-active' : ''}
            `}
            onClick={(e) => handleTreeClick(tree, e)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={tree.stage >= 0 ? { scale: 1.05 } : {}}
          >
            {tree.stage >= 0 && (
              <img
                src={treeStages[tree.stage]}
                alt={`Tree for ritual: ${tree.name}`}
                className="tree-image"
              />
            )}
            {tree.stage >= 0 && (
              <RitualPopup
                isOpen={activePopupId === tree.id}
                ritualName={tree.name}
                streakCount={tree.streak_count}
                onClose={handleClosePopup}
                isViewOnly={isViewOnly}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Garden;
