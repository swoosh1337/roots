
import React, { useState, useEffect } from 'react';
import { useRituals, Ritual } from '@/hooks/useRituals';
import FocusMode from '@/components/FocusMode';
import AddRitualModal from '@/components/AddRitualModal';
import ChainRitualsModal from '@/components/ChainRitualsModal';
import RitualLibrary from '@/components/RitualLibrary';

type DisplayMode = 'focus' | 'library';

// Define a UI Ritual type that matches what our components expect
interface UIRitual {
  id: string;
  name: string;
  streak: number;
  status: 'active' | 'paused' | 'chained';
}

const Index = () => {
  const { rituals, loading, createRitual, completeRitual, chainRituals } = useRituals();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('focus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);

  // Find first active ritual for focus mode
  useEffect(() => {
    if (rituals.length > 0 && !currentRitual) {
      const activeRitual = rituals.find(r => r.status === 'active');
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
  const mapRitualForUI = (ritual: Ritual): UIRitual => {
    return {
      id: ritual.id,
      name: ritual.name,
      streak: ritual.streak_count,
      status: ritual.status
    };
  };

  // Handler for when user completes a ritual
  const handleCompletedRitual = (ritualId: string) => {
    completeRitual(ritualId);
  };

  // Handler for when user selects a different ritual
  const handleSelectRitual = (ritual: UIRitual) => {
    // Find the corresponding backend Ritual from the UIRitual
    const selectedRitual = rituals.find(r => r.id === ritual.id);
    if (selectedRitual) {
      setCurrentRitual(selectedRitual);
      setDisplayMode('focus');
    }
  };

  // Handler for adding a new ritual
  const handleAddRitual = (name: string) => {
    createRitual(name);
    setShowAddModal(false);
  };

  // Handler for chaining rituals
  const handleChainRituals = (ritualIds: string[]) => {
    chainRituals(ritualIds);
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
          isOpen={true}
          onClose={() => {}}
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
