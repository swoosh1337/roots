
import React from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Link, CheckCircle, Pause } from 'lucide-react';
import { Ritual } from '@/hooks/useRituals';

interface RitualLibraryProps {
  rituals: Ritual[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRitual: (ritual: Ritual) => void;
  onAddRitual: () => void;
  onChainRituals: () => void;
}

const RitualLibrary: React.FC<RitualLibraryProps> = ({
  rituals,
  isOpen,
  onClose,
  onSelectRitual,
  onAddRitual,
  onChainRituals
}) => {
  const getStatusIcon = (status: 'active' | 'paused' | 'chained') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'chained':
        return <Link className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      
      {/* Sidebar panel */}
      <motion.div
        className="absolute top-0 left-0 h-full w-full sm:w-96 bg-white shadow-xl flex flex-col"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-ritual-moss/30 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-ritual-forest">Your Rituals</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Ritual List */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {rituals.map(ritual => (
            <div 
              key={ritual.id}
              className="ritual-card cursor-pointer"
              onClick={() => onSelectRitual(ritual)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-ritual-forest">{ritual.name}</h3>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">Day {ritual.streak_count}</span>
                <span className={`status-badge status-${ritual.status} flex items-center gap-1`}>
                  {getStatusIcon(ritual.status)}
                  <span className="capitalize">{ritual.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t border-ritual-moss/30 space-y-3">
          <button 
            onClick={onAddRitual}
            className="w-full py-3 px-4 bg-ritual-green text-white rounded-full 
                     flex items-center justify-center gap-2 hover:bg-ritual-green/90
                     transition-colors"
          >
            <span className="text-xl">+</span> Add New Ritual
          </button>
          
          <button 
            onClick={onChainRituals}
            className="w-full py-3 px-4 bg-white border border-ritual-forest text-ritual-forest 
                     rounded-full hover:bg-ritual-moss/10 transition-colors flex items-center
                     justify-center gap-2"
          >
            <Link className="w-4 h-4" /> Chain Rituals
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RitualLibrary;
