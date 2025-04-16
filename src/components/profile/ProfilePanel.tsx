
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ProfileStats from './ProfileStats';
import StreakCalendar from './StreakCalendar';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import UserProfileHeader from './UserProfileHeader';
import ProfileActions from './ProfileActions';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalStreaks: number;
    longestStreak: number;
    ritualsCreated: number;
    chains: number;
  };
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isOpen, onClose, stats }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);

  // Fetch the user's profile image URL when the component mounts or user changes
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) return;
      
      try {
        console.log("ProfilePanel: Fetching profile image for user ID:", user.id);
        const { data, error } = await supabase
          .from('users')
          .select('profile_img_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile image:', error);
          return;
        }
        
        console.log("ProfilePanel: Profile image data from database:", data);
        
        if (data && data.profile_img_url) {
          // Add cache-busting parameter
          const timestamp = new Date().getTime();
          const urlWithTimestamp = `${data.profile_img_url.split('?')[0]}?t=${timestamp}`;
          console.log("ProfilePanel: Setting profile URL with timestamp:", urlWithTimestamp);
          setProfileImgUrl(urlWithTimestamp);
        }
      } catch (error) {
        console.error('Exception fetching profile image:', error);
      }
    };
    
    fetchProfileImage();
    
    // Set up a listener for user profile updates
    const channel = supabase
      .channel('profile-panel-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user?.id}`
        },
        (payload) => {
          console.log('ProfilePanel: User profile updated:', payload);
          fetchProfileImage();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAddFriend = () => {
    toast({
      title: "Friend Request Sent",
      description: "Your friend request has been sent!",
    });
  };

  const handleViewGarden = () => {
    toast({
      title: "Coming Soon",
      description: "Garden view will be available in a future update!",
    });
  };

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
    setProfileImgUrl(newImageUrl);
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

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.4, type: 'spring', damping: 30 }}
        className="fixed top-0 right-0 h-full w-4/5 max-w-[400px] bg-ritual-paper shadow-xl rounded-l-3xl z-50 flex flex-col"
      >
        {/* Close Button */}
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
            onAddFriend={handleAddFriend}
            onViewGarden={handleViewGarden}
            onSignOut={signOut}
          />
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePanel;
