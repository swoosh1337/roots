
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  const { user } = useAuth();
  const { profile } = useUserData();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);

  // Use the profile data from useUserData hook
  useEffect(() => {
    if (profile?.profile_img_url) {
      // Add cache-busting parameter
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${profile.profile_img_url.split('?')[0]}?t=${timestamp}`;
      setProfileImgUrl(urlWithTimestamp);
    }
  }, [profile]);

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

  const avatarSrc = getProfileImage();

  return (
    <button
      onClick={onClick}
      className="rounded-full hover:ring-2 hover:ring-ritual-green transition-all duration-300"
    >
      <Avatar className="h-9 w-9 border border-ritual-moss">
        <AvatarImage src={avatarSrc} alt="User Avatar" />
        <AvatarFallback className="bg-ritual-moss/20 text-ritual-forest">
          {user?.email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
    </button>
  );
};

export default ProfileButton;
