import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import ProfileStats from './ProfileStats';
import StreakCalendar from './StreakCalendar';
import { Separator } from '@/components/ui/separator';
import UserProfileHeader from './UserProfileHeader';
import ProfileActions from './ProfileActions';
import FriendsPanel from '../friends/FriendsPanel';
import FriendGardenView from '../friends/FriendGardenView';
import { getUserRecentActivity } from '@/utils/ritualOperations';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalStreaks: number;
    longestStreak: number;
    ritualsCreated: number;
    chains: number;
  };
  onViewGarden: () => void;
  onAddFriend: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  isOpen,
  onClose,
  stats,
  onViewGarden,
  onAddFriend
}) => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useUserData();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);
  const [selectedFriendIdForGarden, setSelectedFriendIdForGarden] = useState<string | null>(null);

  // Get profile image with correct priority logic
  const getProfileImage = () => {
    // Step 1: Check if we have a profile image URL from our database (user uploaded)
    if (profileImgUrl) {
      return profileImgUrl;
    }

    // Step 2: Fall back to Google avatar if available
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }

    // Step 3: Check if user has picture in metadata
    if (user?.user_metadata?.picture) {
      return user.user_metadata.picture;
    }

    // Step 4: Default to placeholder
    return "/placeholder.svg";
  };

  const openFriendsPanel = () => {
    setIsFriendsPanelOpen(true);
    setSelectedFriendIdForGarden(null);
  };

  const closeFriendsPanel = () => setIsFriendsPanelOpen(false);
  
  const handleViewGardenClick = () => {
    onClose(); // Close the profile panel
    onViewGarden(); // Trigger the garden view
  };

  const handleSelectFriendForGarden = (friendId: string) => {
    setSelectedFriendIdForGarden(friendId);
    setIsFriendsPanelOpen(false);
  };

  const handleCloseFriendGarden = () => {
    setSelectedFriendIdForGarden(null);
  };

  // Effect for profile image
  useEffect(() => {
    if (profile?.profile_img_url) {
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${profile.profile_img_url.split('?')[0]}?t=${timestamp}`;
      setProfileImgUrl(urlWithTimestamp);
    }
  }, [profile]);

  const handleImageUpdate = (newImageUrl: string) => {
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${newImageUrl.split('?')[0]}?t=${timestamp}`;
    setProfileImgUrl(urlWithTimestamp);
  };

  const handleNameUpdate = (newName: string) => {
    updateProfile({ full_name: newName });
  };

  // Add state for activity data
  const [currentWeekActivity, setCurrentWeekActivity] = useState<boolean[]>(Array(7).fill(false));
  const [lastWeekActivity, setLastWeekActivity] = useState<boolean[]>(Array(7).fill(false));
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Add useEffect to fetch activity data
  useEffect(() => {
    const fetchActivity = async () => {
      if (isOpen && user) {
        setLoadingActivity(true);
        try {
          const activityData = await getUserRecentActivity(user.id);
          setCurrentWeekActivity(activityData.currentWeekActivity);
          setLastWeekActivity(activityData.lastWeekActivity);
        } catch (err) {
          setCurrentWeekActivity(Array(7).fill(false));
          setLastWeekActivity(Array(7).fill(false));
        } finally {
          setLoadingActivity(false);
        }
      } 
    };

    fetchActivity();
  }, [isOpen, user]); // Re-run if panel opens/closes or user changes

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && !isFriendsPanelOpen && !selectedFriendIdForGarden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Main Profile Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen && !isFriendsPanelOpen && !selectedFriendIdForGarden ? 0 : '100%' }}
        transition={{ duration: 0.4, type: 'spring', damping: 30, stiffness: 120 }}
        className="fixed top-0 right-0 h-full w-4/5 max-w-[400px] bg-ritual-paper shadow-xl rounded-l-3xl z-50 flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ritual-forest hover:bg-ritual-moss/20 p-2 rounded-full z-10"
          aria-label="Close profile panel"
        >
          <X size={24} />
        </button>

        <UserProfileHeader
          user={user}
          avatarSrc={getProfileImage()}
          onImageUpdate={handleImageUpdate}
          onNameUpdate={handleNameUpdate}
        />

        {/* Content section */}
        <div className="flex flex-col flex-grow p-6 gap-6 overflow-y-auto">
          <ProfileStats stats={stats} />

          <div className="w-full mt-2 min-h-[150px]">
            <h3 className="text-[#6F8D6A] text-sm mb-3">Recent Activity</h3>
            {/* Pass the state data as props */}
            <StreakCalendar
              currentWeekActivity={currentWeekActivity}
              lastWeekActivity={lastWeekActivity}
            />
            {/* Add a placeholder div with the same height as the loading indicator */}
            <div className="h-6">
              {loadingActivity && <p className="text-xs text-center mt-2 text-ritual-gray">Loading activity...</p>}
            </div>
          </div>

          <Separator className="my-2 bg-ritual-moss/30" />

          <ProfileActions
            onOpenFriends={openFriendsPanel}
            onViewGarden={handleViewGardenClick}
            onSignOut={signOut}
          />
        </div>
      </motion.div>

      {/* Friends Panel */}
      {isOpen && (
        <FriendsPanel
          isOpen={isFriendsPanelOpen}
          onClose={closeFriendsPanel}
          onAddFriend={onAddFriend}
          onSelectFriend={handleSelectFriendForGarden}
        />
      )}

      {/* Friend Garden View */}
      {isOpen && selectedFriendIdForGarden && (
        <FriendGardenView
          friendId={selectedFriendIdForGarden}
          onClose={handleCloseFriendGarden}
        />
      )}
    </>
  );
};

export default ProfilePanel;
