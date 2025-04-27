
import React, { useState, useEffect } from 'react';
import { useRituals } from '@/hooks/useRituals';
import { useDisplayMode } from '@/hooks/useDisplayMode';
import FocusMode from '@/components/FocusMode';
import Garden from '@/components/garden/Garden';
import RitualLibrary from '@/components/RitualLibrary';
import RitualModals from '@/components/RitualModals';
import RitualProfilePanel from '@/components/RitualProfilePanel';
import ProfileButton from '@/components/profile/ProfileButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Leaf } from 'lucide-react';
import type { Ritual } from '@/types/ritual';

interface IndexProps {
  userId?: string;
}

const animationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 } // Fast transition
};

const Index: React.FC<IndexProps> = ({ userId }) => {
  const { rituals, loading, createRitual, completeRitual, chainRituals, updateRitual, deleteRitual } = useRituals(userId);
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

  // Show loading spinner while data is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ritual-forest">Loading your rituals...</div>
      </div>
    );
  }

  // Add an empty state when there are no rituals (rituals.length must be exactly 0)
  if (!loading && rituals.length === 0) {
    console.log("Showing empty state view - no rituals found");
    
    return (
      <div className="min-h-screen bg-ritual-paper flex flex-col items-center justify-center p-6">
        <div className="absolute top-6 right-6 z-10">
          <ProfileButton onClick={() => setProfileOpen(true)} />
        </div>
        
        <Leaf className="w-16 h-16 text-ritual-green mb-4 animate-bounce" />
        <h1 className="text-2xl font-serif text-ritual-forest mb-4 text-center">Welcome to Your Garden</h1>
        <p className="text-center text-gray-600 max-w-md mb-8">
          You don't have any rituals yet. Start by creating your first ritual to build a healthy habit.
        </p>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-ritual-green text-white rounded-full 
                  flex items-center justify-center hover:bg-ritual-green/90
                  transition-colors shadow-md"
        >
          <span className="text-xl mr-2">+</span> Create Your First Ritual
        </button>
        
        {/* Include modals so user can add rituals */}
        <RitualModals
          showAddModal={showAddModal}
          showChainModal={false}
          showAddFriendModal={false}
          isOwnGarden={true}
          rituals={[]}
          onCloseAddModal={() => setShowAddModal(false)}
          onCloseChainModal={() => {}}
          onCloseAddFriendModal={() => {}}
          onAddRitual={handleAddRitual}
          onChainRituals={() => {}}
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
  }

  // Main interface when rituals are available
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

      <AnimatePresence mode="wait">
        {/* Focus Mode */}
        {currentRitual && displayMode === 'focus' && (
          <motion.div key="focus-mode" {...animationProps} className="w-full h-full">
            <FocusMode
              onOpenLibrary={handleOpenLibrary}
              currentRitual={currentRitual}
              onCompletedRitual={completeRitual}
            />
          </motion.div>
        )}

        {/* Garden View */}
        {displayMode === 'garden' && (
          <motion.div key="garden-view" {...animationProps} className="w-full h-full">
            <Garden 
              rituals={rituals} 
              onClose={handleCloseGarden} 
              isViewOnly={!isOwnGarden}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ritual Library */}
      <RitualLibrary
        rituals={rituals}
        isOpen={displayMode === 'library'}
        onClose={handleCloseLibrary}
        onSelectRitual={handleSelectRitual}
        onAddRitual={isOwnGarden ? () => setShowAddModal(true) : undefined}
        onChainRituals={isOwnGarden ? () => setShowChainModal(true) : undefined}
        onUpdateRitual={isOwnGarden ? updateRitual : undefined}
        onDeleteRitual={isOwnGarden ? deleteRitual : undefined}
      />

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
