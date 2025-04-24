import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RitualPopup.css';

interface RitualPopupProps {
  isOpen: boolean;
  ritualName: string;
  streakCount: number;
  onClose: () => void;
  isViewOnly?: boolean;
}

const RitualPopup: React.FC<RitualPopupProps> = ({ 
  isOpen, 
  ritualName, 
  streakCount, 
  onClose,
  isViewOnly = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ritual-popup-container"
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ritual-popup-content">
            <h3 className="ritual-popup-name">
              <span>{ritualName}</span>
            </h3>
            <p className="ritual-popup-streak">
              <span>Day {streakCount}</span>
            </p>
          </div>
          {/* Close button hidden via CSS */}
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              onClose(); 
            }}
            className="ritual-popup-close"
            aria-label="Close popup"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RitualPopup; 