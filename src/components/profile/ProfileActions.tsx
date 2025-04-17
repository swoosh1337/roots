
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ProfileActionsProps {
  onAddFriend: () => void;
  onViewGarden: () => void;
  onSignOut: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ 
  onAddFriend, 
  onViewGarden, 
  onSignOut 
}) => {
  return (
    <>
      <div className="w-full space-y-3 mt-4">
        <Button 
          className="w-full bg-ritual-green hover:bg-ritual-green/90 text-white rounded-full py-6"
          onClick={onAddFriend}
        >
          Add Friend
        </Button>
        
        <Button 
          className="w-full bg-ritual-green hover:bg-ritual-green/90 text-white rounded-full py-6"
          onClick={onViewGarden}
        >
          View Garden
        </Button>
      </div>

      <div className="flex-grow"></div>

      {/* Logout Button */}
      <div className="pb-4">
        <Button
          variant="ghost" 
          className="w-full text-center text-[#A14444] hover:text-[#B65C5C] hover:bg-transparent"
          onClick={onSignOut} 
        >
          Log Out
        </Button>
      </div>
    </>
  );
};

export default ProfileActions;
