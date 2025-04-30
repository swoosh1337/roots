
import React, { useState } from 'react';
import { Leaf, Pencil, Check } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import ProfileAvatar from './ProfileAvatar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface UserProfileHeaderProps {
  user: User | null;
  avatarSrc: string;
  onImageUpdate: (newImageUrl: string) => void;
  onNameUpdate?: (newName: string) => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  user, 
  avatarSrc, 
  onImageUpdate,
  onNameUpdate
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState<string>(
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  );
  const [nameInputValue, setNameInputValue] = useState(displayName);
  const { toast } = useToast();

  const handleSaveName = async () => {
    if (!user) return;
    
    try {
      // Update the user's metadata with the new full_name
      const { error } = await supabase.auth.updateUser({
        data: { full_name: nameInputValue }
      });

      if (error) throw error;

      // Also update the full_name in the users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ full_name: nameInputValue })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setDisplayName(nameInputValue);
      setIsEditingName(false);
      
      // Notify parent component if callback exists
      if (onNameUpdate) {
        onNameUpdate(nameInputValue);
      }

      toast({
        title: "Name Updated",
        description: "Your display name has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your name. Please try again.",
        variant: "destructive"
      });
    }
  };
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

      {/* User Name - Editable */}
      <div className="mt-4 flex items-center gap-2">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
              className="h-8 w-40 bg-white/80"
              placeholder="Enter your name"
              autoFocus
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-1 h-8 w-8"
              onClick={handleSaveName}
            >
              <Check className="h-4 w-4 text-ritual-green" />
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl font-bold text-[#2E4C2F]">
              {displayName}
            </h2>
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-1 h-8 w-8 -mt-1"
              onClick={() => setIsEditingName(true)}
            >
              <Pencil className="h-4 w-4 text-ritual-green" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
