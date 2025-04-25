
import React, { useState, useEffect } from 'react';
import { useRituals, Ritual } from '@/hooks/useRituals';
import FocusMode from '@/components/FocusMode';
import AddRitualModal from '@/components/AddRitualModal';
import ChainRitualsModal from '@/components/ChainRitualsModal';
import AddFriendModal from '@/components/AddFriendModal';
import RitualLibrary from '@/components/RitualLibrary';
import ProfileButton from '@/components/profile/ProfileButton';
import ProfilePanel from '@/components/profile/ProfilePanel';
import Garden from '@/components/garden/Garden';

// Update displayMode to include 'garden'
type DisplayMode = 'focus' | 'library' | 'garden';

// Define a UI Ritual type that matches what our components expect
interface UIRitual {
  id: string;
  name: string;
  streak: number;
  status: 'active' | 'paused' | 'chained';
  last_completed?: string | null;
}

interface IndexProps {
  userId?: string;
}

const Index: React.FC<IndexProps> = ({ userId }) => {
  const { rituals, loading, createRitual, completeRitual, chainRituals } = useRituals(userId);
  // If userId is provided (viewing a friend's garden), default to garden view
  const [displayMode, setDisplayMode] = useState<DisplayMode>(userId ? 'garden' : 'focus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChainModal, setShowChainModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [currentRitual, setCurrentRitual] = useState<Ritual | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Determine if we are viewing the logged-in user's garden
  const isOwnGarden = !userId;
  
  console.log("Index rendering, isOwnGarden:", isOwnGarden, "userId:", userId, "rituals:", rituals);

  // Profile stats derived from ritual data
  const profileStats = {
    totalStreaks: rituals.reduce((total, ritual) => total + ritual.streak_count, 0),
    longestStreak: rituals.reduce((max, ritual) => Math.max(max, ritual.streak_count), 0),
    ritualsCreated: rituals.length,
    chains: rituals.filter(ritual => ritual.status === 'chained').length
  };

  useEffect(() => {
    // Only set the initial ritual if rituals are loaded and we haven't set one yet
    if (!loading && rituals.length > 0 && !currentRitual) {
      const activeRitual = rituals.find(r => r.status === 'active') || rituals[0]; // Fallback to first ritual if no active one
      if (activeRitual) {
        console.log('Setting initial currentRitual:', activeRitual);
        setCurrentRitual(activeRitual);
      }
    }
  }, [rituals, loading, currentRitual]); // Depend on rituals, loading state, and currentRitual

  // Update currentRitual state if its data changes in the main rituals list
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
  }, [rituals, currentRitual]); // Depend on rituals and currentRitual

  // Handlers for opening modals
  const handleOpenAddRitualModal = () => {
    if (!isOwnGarden) return; // Disable if not own garden
    setShowAddModal(true);
  }
  
  const handleOpenChainModal = () => {
    if (!isOwnGarden) return; // Disable if not own garden
    setShowChainModal(true);
  }

  // Handler for opening AddFriendModal
  const handleOpenAddFriendModal = () => {
    setShowAddFriendModal(true);
  };

  // Handler for closing AddFriendModal
  const handleCloseAddFriendModal = () => {
    setShowAddFriendModal(false);
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
    return completeRitual(ritualId);
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

  // Handler for opening the garden view
  const handleViewGarden = () => {
    setDisplayMode('garden');
    // Close the profile panel when opening garden
    setProfileOpen(false);
  };

  // Handler for closing the garden view
  const handleCloseGarden = () => {
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
        onAddRitual={isOwnGarden ? handleOpenAddRitualModal : undefined}
        onChainRituals={isOwnGarden ? handleOpenChainModal : undefined}
      />

      {/* Garden View - Pass isViewOnly prop */}
      {displayMode === 'garden' && (
        <Garden 
          rituals={rituals} 
          onClose={handleCloseGarden} 
          isViewOnly={!isOwnGarden} // Pass view only status
        />
      )}

      {/* Modals - Conditionally control isOpen */}
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
      
      {/* AddFriendModal for both direct access and via FriendsPanel */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={handleCloseAddFriendModal}
      />

      {/* Profile Panel */}
      <ProfilePanel 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        stats={profileStats}
        onViewGarden={handleViewGarden}
        onAddFriend={handleOpenAddFriendModal}
      />
    </div>
  );
};

export default Index;
