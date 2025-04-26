
import React, { useState, useEffect } from 'react';
import { useRituals } from '@/hooks/useRituals';
import { useDisplayMode } from '@/hooks/useDisplayMode';
import FocusMode from '@/components/FocusMode';
import RitualLibrary from '@/components/RitualLibrary';
import Garden from '@/components/garden/Garden';
import ProfileButton from '@/components/profile/ProfileButton';
import RitualModals from '@/components/RitualModals';
import RitualProfilePanel from '@/components/RitualProfilePanel';
import type { Ritual } from '@/types/ritual';
import { Menu } from 'lucide-react';

interface IndexProps {
  userId?: string;
}

const Index: React.FC<IndexProps> = ({ userId }) => {
  const { rituals, loading, createRitual, completeRitual, chainRituals, updateRitual } = useRituals(userId);
  const { displayMode, setDisplayMode, handleViewGarden, handleCloseGarden, handleOpenLibrary, handleCloseLibrary } = useDisplayMode(userId ? 'garden' : 'focus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Determine if we are viewing the logged-in user's garden
  const isOwnGarden = !userId;

  useEffect(() => {
    if (!loading && rituals.length > 0 && !currentRitual) {
      // First try to find an active ritual, if none exists, don't default to any ritual
      const activeRitual = rituals.find(r => r.status === 'active');
      if (activeRitual) {
        console.log('Setting initial currentRitual:', activeRitual);
        setCurrentRitual(activeRitual);
      } else {
        console.log('No active rituals found for Focus Mode');
      }
    }
  }, [rituals, loading, currentRitual]);

  // Update currentRitual if its data changes
  useEffect(() => {
    if (currentRitual) {
      const updatedRitualData = rituals.find(r => r.id === currentRitual.id);
      if (updatedRitualData) {
        if (
          updatedRitualData.streak_count !== currentRitual.streak_count ||
          updatedRitualData.last_completed !== currentRitual.last_completed
        ) {
          setCurrentRitual(updatedRitualData);
        }
      } else {
        setCurrentRitual(null);
      }
    }
  }, [rituals, currentRitual]);

  // Handlers
  const handleAddRitual = async (name: string) => {
    const newRitual = await createRitual(name);
    setShowAddModal(false);
    return newRitual;
  };

  const handleChainRituals = (ritualIds: string[]) => {
    chainRituals(ritualIds);
    setShowChainModal(false);
  };

  const handleSelectRitual = (ritual: Ritual) => {
    setCurrentRitual(ritual);
    setDisplayMode('focus');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ritual-forest">Loading your rituals...</div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-ritual-paper relative">
      
      {/* Profile Button */}
      <div className="absolute top-6 right-6 z-10">
        <ProfileButton onClick={() => setProfileOpen(true)} />
      </div>

      {/* ALWAYS show menu button for all users */}
      <button 
        onClick={handleOpenLibrary}
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white shadow-md
                  flex items-center justify-center hover:shadow-lg
                  transition-all duration-300 z-10"
      >
        <Menu className="w-6 h-6 text-ritual-forest" />
      </button>

      {/* Focus Mode */}
      {currentRitual && (
        <FocusMode
          onOpenLibrary={handleOpenLibrary}
          currentRitual={currentRitual}
          onCompletedRitual={completeRitual}
        />
      )}

      {/* Empty state message when no rituals */}
      {!currentRitual && !loading && rituals.length === 0 && isOwnGarden && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-semibold text-ritual-forest mb-4">Welcome to Your Ritual Garden</h2>
          <p className="text-ritual-forest/80 mb-6">You don't have any rituals yet. Click the menu button in the top left to add your first ritual.</p>
        </div>
      )}

      {/* Ritual Library */}
      <RitualLibrary
        rituals={rituals}
        isOpen={displayMode === 'library'}
        onClose={handleCloseLibrary}
        onSelectRitual={handleSelectRitual}
        onAddRitual={isOwnGarden ? () => setShowAddModal(true) : undefined}
        onChainRituals={isOwnGarden ? () => setShowChainModal(true) : undefined}
        onUpdateRitual={isOwnGarden ? updateRitual : undefined}
      />

      {/* Garden View */}
      {displayMode === 'garden' && (
        <Garden 
          rituals={rituals} 
          onClose={handleCloseGarden} 
          isViewOnly={!isOwnGarden}
        />
      )}

      {/* Modals */}
      <RitualModals
        showAddModal={showAddModal}
        showChainModal={showChainModal}
        showAddFriendModal={showAddFriendModal}
        isOwnGarden={isOwnGarden}
        rituals={rituals}
        onCloseAddModal={() => setShowAddModal(false)}
        onCloseChainModal={() => setShowChainModal(false)}
        onCloseAddFriendModal={() => setShowAddFriendModal(false)}
        onAddRitual={handleAddRitual}
        onChainRituals={handleChainRituals}
      />

      {/* Profile Panel */}
      <RitualProfilePanel
        profileOpen={profileOpen}
        rituals={rituals}
        onCloseProfile={() => setProfileOpen(false)}
        onViewGarden={handleViewGarden}
        onAddFriend={() => setShowAddFriendModal(true)}
      />
    </div>
  );
};

export default Index;
