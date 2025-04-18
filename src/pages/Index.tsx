
import React, { useState, useEffect } from 'react';
import { useRituals, Ritual } from '@/hooks/useRituals';
import FocusMode from '@/components/FocusMode';
import AddRitualModal from '@/components/AddRitualModal';
import ChainRitualsModal from '@/components/ChainRitualsModal';
import RitualLibrary from '@/components/RitualLibrary';
import ProfileButton from '@/components/profile/ProfileButton';
import ProfilePanel from '@/components/profile/ProfilePanel';

type DisplayMode = 'focus' | 'library';

// Define a UI Ritual type that matches what our components expect
interface UIRitual {
  id: string;
  name: string;
  streak: number;
  status: 'active' | 'paused' | 'chained';
  last_completed?: string | null;
}

const Index = () => {
  const { rituals, loading, createRitual, completeRitual, chainRituals } = useRituals();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('focus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Profile stats derived from ritual data
  const profileStats = {
    totalStreaks: rituals.reduce((total, ritual) => total + ritual.streak_count, 0),
    longestStreak: rituals.reduce((max, ritual) => Math.max(max, ritual.streak_count), 0),
    ritualsCreated: rituals.length,
    chains: rituals.filter(ritual => ritual.status === 'chained').length
  };

  // Find first active ritual for focus mode
  useEffect(() => {
    if (rituals.length > 0 && !currentRitual) {
      const activeRitual = rituals.find(r => r.status === 'active');
      if (activeRitual) {
        setCurrentRitual(activeRitual);
      }
    }
  }, [rituals, currentRitual]);

  // Update currentRitual when rituals array changes (e.g. after completion)
  useEffect(() => {
    if (currentRitual) {
      const updatedRitualData = rituals.find(r => r.id === currentRitual.id);
      
      if (updatedRitualData) {
        // Check if streak count or last_completed has changed
        if (
          updatedRitualData.streak_count !== currentRitual.streak_count ||
          updatedRitualData.last_completed !== currentRitual.last_completed
        ) {
          setCurrentRitual(updatedRitualData);
        }
      } else {
        // If ritual no longer exists in the array, reset currentRitual
        setCurrentRitual(null);
      }
    }
  }, [rituals]);

  // Handle modal openings
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleOpenChainModal = () => {
    setShowChainModal(true);
  };

  const toggleProfilePanel = () => {
    setProfileOpen(!profileOpen);
  };

  // Map Supabase ritual to UI ritual format
  const mapRitualForUI = (ritual: Ritual): UIRitual => {
    return {
      id: ritual.id,
      name: ritual.name,
      streak: ritual.streak_count,
      status: ritual.status,
      last_completed: ritual.last_completed
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

  // Handler for closing the ritual library
  const handleCloseLibrary = () => {
    setDisplayMode('focus');
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
    <div className="min-h-screen bg-ritual-paper relative">
      {/* Profile Button */}
      <div className="absolute top-6 right-6 z-10">
        <ProfileButton onClick={toggleProfilePanel} />
      </div>

      {/* Always render FocusMode */}
      {currentRitual && (
        <FocusMode
          onOpenLibrary={() => setDisplayMode('library')}
          currentRitual={currentRitual}
          onCompletedRitual={handleCompletedRitual}
        />
      )}

      {/* Always render RitualLibrary, controlling visibility with isOpen prop */}
      <RitualLibrary
        rituals={rituals.map(ritual => mapRitualForUI(ritual))}
        isOpen={displayMode === 'library'}
        onClose={handleCloseLibrary}
        onSelectRitual={handleSelectRitual}
        onAddRitual={handleOpenAddModal}
        onChainRituals={handleOpenChainModal}
      />

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

      {/* Profile Panel */}
      <ProfilePanel 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        stats={profileStats}
      />
    </div>
  );
};

export default Index;
