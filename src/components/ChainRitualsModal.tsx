
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link, ArrowRight } from 'lucide-react';
import type { Ritual } from '@/types/ritual';

interface ChainRitualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rituals: Ritual[];
  onChainRituals: (chainedRituals: string[]) => void;
}

const ChainRitualsModal: React.FC<ChainRitualsModalProps> = ({
  isOpen,
  onClose,
  rituals,
  onChainRituals
}) => {
  const [selectedRituals, setSelectedRituals] = useState<string[]>([]);

  const handleToggleRitual = (ritualId: string) => {
    if (selectedRituals.includes(ritualId)) {
      setSelectedRituals(selectedRituals.filter(id => id !== ritualId));
    } else {
      // Limit to max 3 rituals
      if (selectedRituals.length < 3) {
        setSelectedRituals([...selectedRituals, ritualId]);
      }
    }
  };

  const handleSaveChain = () => {
    if (selectedRituals.length >= 2) {
      onChainRituals(selectedRituals);
    }
  };

  const getAvailableRituals = () => {
    return rituals.filter(ritual => ritual.status !== 'chained');
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-ritual-moss/30">
          <h2 className="text-2xl font-serif text-ritual-forest flex items-center gap-2">
            <Link className="w-5 h-5" /> Chain Rituals
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            Select 2-3 rituals to chain together. These rituals will be completed in sequence.
          </p>
          
          {/* Ritual selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">SELECT RITUALS (MAX 3)</h3>
            <div className="space-y-2">
              {getAvailableRituals().map(ritual => (
                <div
                  key={ritual.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRituals.includes(ritual.id)
                      ? 'border-ritual-green bg-ritual-green/10'
                      : 'border-gray-200 hover:border-ritual-green/50'
                  }`}
                  onClick={() => handleToggleRitual(ritual.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ritual.name}</span>
                    <span className="text-sm text-gray-500">Day {ritual.streak_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chain visualization */}
          {selectedRituals.length > 0 && (
            <div className="bg-ritual-moss/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">YOUR RITUAL CHAIN</h3>
              <div className="flex items-center justify-center">
                {selectedRituals.map((ritualId, index) => {
                  const ritual = rituals.find(r => r.id === ritualId);
                  return (
                    <React.Fragment key={ritualId}>
                      <div className="flex-shrink-0 bg-white rounded-lg p-3 shadow-sm">
                        <span className="font-medium">{ritual?.name}</span>
                      </div>
                      {index < selectedRituals.length - 1 && (
                        <ArrowRight className="mx-3 text-ritual-forest" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-ritual-moss/30">
          <button
            onClick={handleSaveChain}
            className="w-full ritual-button"
            disabled={selectedRituals.length < 2}
          >
            Save Chain
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChainRitualsModal;
