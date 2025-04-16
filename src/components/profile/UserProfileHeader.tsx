
import React from 'react';
import { Leaf } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import ProfileAvatar from './ProfileAvatar';

interface UserProfileHeaderProps {
  user: User | null;
  avatarSrc: string;
  onImageUpdate: (newImageUrl: string) => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  user, 
  avatarSrc, 
  onImageUpdate 
}) => {
  return (
    <div className="bg-[#E7F1E5] rounded-tl-3xl p-8 pt-12 flex flex-col items-center relative">
      {/* Leaf decoration */}
      <div className="absolute top-3 left-3 text-ritual-green opacity-30">
        <Leaf size={24} />
      </div>
      
      {/* Avatar with upload button */}
      <ProfileAvatar 
        user={user} 
        avatarSrc={avatarSrc} 
        onImageUpdate={onImageUpdate} 
      />

      {/* User Name */}
      <h2 className="font-serif text-2xl font-bold text-[#2E4C2F] mt-4">
        {user?.email?.split('@')[0] || 'Rishi'}
      </h2>
    </div>
  );
};

export default UserProfileHeader;
