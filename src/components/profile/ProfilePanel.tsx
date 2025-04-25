import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalStreaks: number;
    longestStreak: number;
    ritualsCreated: number;
    chains: number;
  };
  onViewGarden: () => void; // For user's own garden
  onAddFriend: () => void; // Opens the AddFriendModal
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

  // State for the Friends panel visibility
  const [isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);
  // State to track which friend's garden to view
  const [selectedFriendIdForGarden, setSelectedFriendIdForGarden] = useState<string | null>(null);

  // Open/close functions for the Friends panel
  const openFriendsPanel = () => {
    setIsFriendsPanelOpen(true);
    // Reset friend garden view when opening friends panel
    setSelectedFriendIdForGarden(null);
  };
  const closeFriendsPanel = () => setIsFriendsPanelOpen(false);

  // Function to handle selecting a friend to view their garden
  const handleSelectFriendForGarden = (friendId: string) => {
    console.log("Selecting friend garden for ID:", friendId);
    setSelectedFriendIdForGarden(friendId);
    setIsFriendsPanelOpen(false); // Close the friends panel when selecting a friend garden
  };

  // Function to close the friend's garden view
  const handleCloseFriendGarden = () => {
    setSelectedFriendIdForGarden(null);
    // Optional: Reopen friends panel
    // setIsFriendsPanelOpen(true);
  };

  // Use the profile data from useUserData hook
  useEffect(() => {
    if (profile?.profile_img_url) {
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${profile.profile_img_url.split('?')[0]}?t=${timestamp}`;
      console.log("ProfilePanel: Setting profile URL with timestamp:", urlWithTimestamp);
      setProfileImgUrl(urlWithTimestamp);
    }
  }, [profile]);

  // Get profile image with correct priority logic
  const getProfileImage = () => {
    // Step 1: Check if we have a profile image URL from our database (user uploaded)
    if (profileImgUrl) {
      console.log("ProfilePanel: Using profile_img_url from state:", profileImgUrl);
      return profileImgUrl;
    }

    // Step 2: Fall back to Google avatar if available
    if (user?.user_metadata?.avatar_url) {
      console.log("ProfilePanel: Using avatar_url from user metadata:", user.user_metadata.avatar_url);
      return user.user_metadata.avatar_url;
    }

    // Step 3: Check if user has picture in metadata
    if (user?.user_metadata?.picture) {
      console.log("ProfilePanel: Using picture from user metadata:", user.user_metadata.picture);
      return user.user_metadata.picture;
    }

    // Step 4: Default to placeholder
    console.log("ProfilePanel: Using default placeholder image");
    return "/placeholder.svg";
  };

  const avatarSrc = getProfileImage();
  console.log("ProfilePanel: Final avatar source:", avatarSrc);

  // Handler for image updates from the ProfileAvatar component
  const handleImageUpdate = (newImageUrl: string) => {
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${newImageUrl.split('?')[0]}?t=${timestamp}`;
    setProfileImgUrl(urlWithTimestamp);
  };

  // Handler for name updates
  const handleNameUpdate = (newName: string) => {
    // Use updateProfile method from useUserData hook
    updateProfile({ full_name: newName });
  };

  return (
    <>
      {/* Backdrop for Profile Panel */}
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

      {/* Main Profile Panel */}
      <motion.div
        initial={{ x: '100%' }}
        // Only animate closed if the profile panel itself AND the friends panel AND friend garden are closed
        animate={{ x: isOpen && !isFriendsPanelOpen && !selectedFriendIdForGarden ? 0 : '100%' }}
        transition={{ duration: 0.4, type: 'spring', damping: 30 }}
        className="fixed top-0 right-0 h-full w-4/5 max-w-[400px] bg-ritual-paper shadow-xl rounded-l-3xl z-50 flex flex-col"
        style={{ display: isOpen ? 'flex' : 'none' }} // Use style to ensure it's removed from layout when not open
      >
        {/* Close Button for main panel */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ritual-forest hover:bg-ritual-moss/20 p-2 rounded-full z-10"
          aria-label="Close profile panel"
        >
          <X size={24} />
        </button>

        {/* User Profile Header with Avatar */}
        <UserProfileHeader
          user={user}
          avatarSrc={avatarSrc}
          onImageUpdate={handleImageUpdate}
          onNameUpdate={handleNameUpdate}
        />

        {/* Content section - Make it flex column with grow */}
        <div className="flex flex-col flex-grow p-6 gap-6 overflow-y-auto">
          {/* Stats Grid */}
          <ProfileStats stats={stats} />

          {/* Streak Calendar */}
          <div className="w-full mt-2">
            <h3 className="text-[#6F8D6A] text-sm mb-3">Recent Activity</h3>
            <StreakCalendar />
          </div>

          {/* Separator */}
          <Separator className="my-2 bg-ritual-moss/30" />

          {/* Action Buttons and Logout */}
          <ProfileActions
            onOpenFriends={openFriendsPanel}
            onViewGarden={onViewGarden}
            onSignOut={signOut}
          />
        </div>
      </motion.div>

      {/* Friends Panel (conditionally rendered) */}
      {isOpen && (
          <FriendsPanel
            isOpen={isFriendsPanelOpen}
            onClose={closeFriendsPanel}
            onAddFriend={onAddFriend}
            onSelectFriend={handleSelectFriendForGarden}
          />
      )}

      {/* Friend Garden View (conditionally rendered) */}
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
