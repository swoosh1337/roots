import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Link, CheckCircle, Pause } from 'lucide-react';
import StreakTracker from './StreakTracker';
import EditRitualModal from './EditRitualModal';
import { Ritual } from '@/types/ritual';

interface RitualLibraryProps {
  rituals: Ritual[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRitual: (ritual: Ritual) => void;
  onAddRitual?: () => void;
  onChainRituals?: () => void;
  onUpdateRitual?: (id: string, updates: Partial<Ritual>) => void;
  onDeleteRitual?: (id: string) => void;
}

const RitualLibrary: React.FC<RitualLibraryProps> = ({
  rituals,
  isOpen,
  onClose,
  onSelectRitual,
  onAddRitual,
  onChainRituals,
  onUpdateRitual,
  onDeleteRitual
}) => {
  const [editingRitual, setEditingRitual] = useState<Ritual | null>(null);
  
  console.log('RitualLibrary - Received rituals:', rituals); // Log received rituals

  // Group rituals by chain_id
  const ritualGroups = useMemo(() => {
    const groups: Record<string, Ritual[]> = {};
    const standalone: Ritual[] = [];
    
    rituals.forEach(ritual => {
      if (ritual.chain_id) {
        if (!groups[ritual.chain_id]) {
          groups[ritual.chain_id] = [];
        }
        groups[ritual.chain_id].push(ritual);
      } else {
        standalone.push(ritual);
      }
    });
    
    return { groups, standalone };
  }, [rituals]);

  // Memoize this function to avoid recreating on each render
  const canChainRituals = useCallback(() => {
    // Count rituals that are not already chained
    const availableRituals = rituals.filter(ritual => ritual.status !== 'chained');
    console.log('RitualLibrary - Available for chaining:', availableRituals);
    return availableRituals.length >= 2;
  }, [rituals]);

  const getStatusIcon = useCallback((status: 'active' | 'paused' | 'chained') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'chained':
        return <Link className="w-4 h-4" />;
    }
  }, []);

  const handleEditClick = useCallback((e: React.MouseEvent, ritual: Ritual) => {
    e.stopPropagation();
    setEditingRitual(ritual);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingRitual(null);
  }, []);

  const handleUpdateRitual = useCallback((id: string, updates: Partial<Ritual>) => {
    if (onUpdateRitual) {
      onUpdateRitual(id, updates);
      setEditingRitual(null);
    }
  }, [onUpdateRitual]);

  // Check if chaining is possible on mount and when rituals change, not on every render
  const canChain = canChainRituals();

  // Render a single ritual card
  const renderRitualCard = (ritual: Ritual, isChained: boolean = false) => {
    return (
      <div 
        key={ritual.id}
        className={`ritual-card cursor-pointer ${
          ritual.status === 'paused' ? 'opacity-70 bg-gray-50' : ''
        } ${isChained ? 'border-l-4 border-l-ritual-green' : ''}`}
        onClick={() => onSelectRitual(ritual)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-medium ${ritual.status === 'paused' ? 'text-gray-500' : 'text-ritual-forest'}`}>
            {ritual.name}
            {ritual.status === 'paused' && 
              <span className="text-xs ml-2 text-gray-500">(Paused)</span>
            }
          </h3>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={(e) => handleEditClick(e, ritual)}
            aria-label={`Edit ${ritual.name}`}
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Add Streak Tracker component */}
        <StreakTracker 
          lastCompletedDate={ritual.last_completed} 
          streakCount={ritual.streak_count} 
        />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">Day {ritual.streak_count}</span>
          <span className={`status-badge status-${ritual.status} flex items-center gap-1`}>
            {getStatusIcon(ritual.status)}
            <span className="capitalize">{ritual.status}</span>
          </span>
        </div>
      </div>
    );
  };

  const renderChainedGroup = (chainId: string, chainedRituals: Ritual[]) => {
    return (
      <div key={chainId} className="mb-6 bg-ritual-moss/10 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2 text-ritual-forest">
          <Link className="w-4 h-4" />
          <span className="text-sm font-medium">Chained Rituals</span>
        </div>
        <div className="space-y-3">
          {chainedRituals.map(ritual => renderRitualCard(ritual, true))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.4, type: 'spring', damping: 30, stiffness: 120 }}
        className="fixed top-0 left-0 h-full w-4/5 max-w-[400px] bg-ritual-paper shadow-xl rounded-r-3xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-ritual-moss/30 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-ritual-forest">Your Rituals</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close ritual library"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Ritual List */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Render chained groups first */}
          {Object.entries(ritualGroups.groups).map(([chainId, chainedRituals]) => 
            renderChainedGroup(chainId, chainedRituals)
          )}
          
          {/* Then render standalone rituals */}
          {ritualGroups.standalone.map(ritual => renderRitualCard(ritual))}
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t border-ritual-moss/30 space-y-3">
          {onAddRitual && (
            <button 
              onClick={onAddRitual}
              className="w-full py-3 px-4 bg-ritual-green text-white rounded-full 
                      flex items-center justify-center gap-2 hover:bg-ritual-green/90
                      transition-colors"
            >
              <span className="text-xl">+</span> Add New Ritual
            </button>
          )}
          
          {onChainRituals && (
            <button 
              onClick={onChainRituals}
              disabled={!canChain}
              className={`w-full py-3 px-4 rounded-full flex items-center
                      justify-center gap-2 transition-colors
                      ${canChain 
                        ? 'bg-white border border-ritual-forest text-ritual-forest hover:bg-ritual-moss/10' 
                        : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'}`}
            >
              <Link className="w-4 h-4" /> Chain Rituals
            </button>
          )}
        </div>
      </motion.div>

      {/* Edit Ritual Modal */}
      {editingRitual && onUpdateRitual && (
        <EditRitualModal
          ritual={editingRitual}
          isOpen={!!editingRitual}
          onClose={handleCloseEditModal}
          onUpdateRitual={handleUpdateRitual}
          onDeleteRitual={onDeleteRitual}
        />
      )}
    </>
  );
};

export default RitualLibrary;
