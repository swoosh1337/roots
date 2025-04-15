
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  const { user } = useAuth();
  
  return (
    <button 
      onClick={onClick}
      className="rounded-full hover:ring-2 hover:ring-ritual-green transition-all duration-300"
    >
      <Avatar className="h-9 w-9 border border-ritual-moss">
        <AvatarImage src="/placeholder.svg" alt="User Avatar" />
        <AvatarFallback className="bg-ritual-moss/20 text-ritual-forest">
          {user?.email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
    </button>
  );
};

export default ProfileButton;
