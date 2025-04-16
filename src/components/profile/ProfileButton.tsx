import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  const { user } = useAuth();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch the user's profile image URL from the database
    const fetchProfileImage = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile_img_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile image:', error);
          return;
        }
        
        if (data && data.profile_img_url) {
          setProfileImgUrl(data.profile_img_url);
        }
      } catch (error) {
        console.error('Exception fetching profile image:', error);
      }
    };
    
    fetchProfileImage();
  }, [user]);
  
  // Get profile image with fallback logic
  const getProfileImage = () => {
    // First try user's profile_img_url from our database
    if (profileImgUrl) {
      return profileImgUrl;
    }
    // Then try Google avatar if available
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    // Otherwise use placeholder
    return "/placeholder.svg";
  };
  
  return (
    <button 
      onClick={onClick}
      className="rounded-full hover:ring-2 hover:ring-ritual-green transition-all duration-300"
    >
      <Avatar className="h-9 w-9 border border-ritual-moss">
        <AvatarImage src={getProfileImage()} alt="User Avatar" />
        <AvatarFallback className="bg-ritual-moss/20 text-ritual-forest">
          {user?.email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
    </button>
  );
};

export default ProfileButton;
