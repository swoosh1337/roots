
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TreeVisual from '../TreeVisual';
import type { Ritual } from '@/hooks/useRituals';

interface GardenGridProps {
  rituals: Ritual[];
  inTestMode?: boolean;
}

const GardenGrid: React.FC<GardenGridProps> = ({ rituals, inTestMode = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <AnimatePresence>
        {rituals.map((ritual) => (
          <motion.div
            key={ritual.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-ritual-paper/50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <TreeVisual 
              streak={ritual.streak_count} 
              isAnimating={false}
              testMode={inTestMode}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GardenGrid;
