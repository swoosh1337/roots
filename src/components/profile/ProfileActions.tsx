import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ProfileActionsProps {
  onOpenFriends: () => void;
  onViewGarden: () => void;
  onSignOut: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ 
  onOpenFriends,
  onViewGarden, 
  onSignOut 
}) => {
  return (
    <>
      <div className="w-full space-y-3 mt-4 min-h-[130px]">
        <Button 
          className="w-full bg-ritual-green hover:bg-ritual-green/90 text-[#2F4F4F] font-medium rounded-full py-6"
          onClick={onOpenFriends}
        >
          Friends
        </Button>
        
        <Button 
          className="w-full bg-ritual-green hover:bg-ritual-green/90 text-[#2F4F4F] font-medium rounded-full py-6"
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
