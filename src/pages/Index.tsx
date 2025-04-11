
import React, { useState, useEffect } from 'react';
import RitualLibrary from '@/components/RitualLibrary';
import FocusMode from '@/components/FocusMode';
import AddRitualModal from '@/components/AddRitualModal';
import ChainRitualsModal from '@/components/ChainRitualsModal';
import { useRituals, Ritual } from '@/hooks/useRituals';

type DisplayMode = 'focus' | 'library';

const Index = () => {
  const { rituals, loading, createRitual, completeRitual, chainRituals } = useRituals();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('focus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);

  // Find first active ritual for focus mode
  useEffect(() => {
    if (rituals.length > 0 && !currentRitual) {
      const activeRitual = rituals.find(r => r.is_active);
      if (activeRitual) {
        setCurrentRitual(activeRitual);
      }
    }
  }, [rituals, currentRitual]);

  // Handle modal openings
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleOpenChainModal = () => {
    setShowChainModal(true);
  };

  // Map Supabase ritual to UI ritual format
  const mapRitualForUI = (ritual: Ritual) => {
    return {
      id: ritual.id,
      name: ritual.name,
      streak: ritual.streak_count,
      status: ritual.is_chained ? 'chained' : (ritual.is_active ? 'active' : 'paused')
    };
  };

  // Handler for when user completes a ritual
  const handleCompletedRitual = (ritualId: string) => {
    completeRitual(ritualId);
  };

  // Handler for when user selects a different ritual
  const handleSelectRitual = (ritual: Ritual) => {
    setCurrentRitual(ritual);
    setDisplayMode('focus');
  };

  // Handler for adding a new ritual
  const handleAddRitual = (name: string) => {
    createRitual(name);
    setShowAddModal(false);
  };

  // Handler for chaining rituals
  const handleChainRituals = (ritual1Id: string, ritual2Id: string) => {
    chainRituals(ritual1Id, ritual2Id);
    setShowChainModal(false);
  };

  // Check if we have data to display
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ritual-forest">Loading your rituals...</div>
      </div>
    );
  }

  // Render the appropriate mode
  return (
    <div className="min-h-screen bg-ritual-paper">
      {displayMode === 'focus' && currentRitual ? (
        <FocusMode
          onOpenLibrary={() => setDisplayMode('library')}
          currentRitual={currentRitual}
          onCompletedRitual={handleCompletedRitual}
        />
      ) : (
        <RitualLibrary
          rituals={rituals.map(ritual => mapRitualForUI(ritual))}
          onSelectRitual={handleSelectRitual}
          onAddRitual={handleOpenAddModal}
          onChainRituals={handleOpenChainModal}
        />
      )}

      {/* Modals */}
      <AddRitualModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddRitual={handleAddRitual}
      />
      
      <ChainRitualsModal
        isOpen={showChainModal}
        onClose={() => setShowChainModal(false)}
        rituals={rituals.map(ritual => mapRitualForUI(ritual))}
        onChainRituals={handleChainRituals}
      />
    </div>
  );
};

export default Index;
