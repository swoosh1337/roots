
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, Leaf, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/auth'; // Import from types/auth instead of hooks/useAuth
import ProfileStats from './ProfileStats';
import StreakCalendar from './StreakCalendar';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

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
  const { user, profile, signOut, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB limit

    if (file.size > maxSize) {
      toast({ title: "File Too Large", description: "Please select an image smaller than 2MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-imgs') // Use the correct bucket name
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-imgs')
        .getPublicUrl(filePath);
        
      if (!urlData || !urlData.publicUrl) {
          throw new Error("Could not get public URL for uploaded image.");
      }

      const publicUrl = urlData.publicUrl;

      // Update user profile in DB and local state
      await updateUserProfile({ profile_img_url: publicUrl });
      // Toast is handled inside updateUserProfile

    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({ 
        title: "Upload Failed", 
        description: error instanceof Error ? error.message : "Could not upload image.", 
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Clear the file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Determine avatar URL based on priority
  const avatarUrl = profile?.profile_img_url || profile?.user_metadata?.avatar_url as string || '/placeholder.svg'; // Default fallback
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName?.charAt(0).toUpperCase() || 'U';

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

        {/* Top section with green background */}
        <div className="bg-[#E7F1E5] rounded-tl-3xl p-8 pt-12 flex flex-col items-center relative">
          {/* Leaf decoration */}
          <div className="absolute top-3 left-3 text-ritual-green opacity-30">
            <Leaf size={24} />
          </div>
          
          {/* Avatar Area */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-ritual-moss">
              <AvatarImage src={avatarUrl} alt="User Avatar" />
              <AvatarFallback className="bg-ritual-moss/20 text-ritual-forest text-xl">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            {/* Hidden File Input */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: 'none' }}
            />
            {/* Upload Button Overlay */}
            <button 
              onClick={handleTriggerUpload}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-ritual-green text-white rounded-full p-1.5 shadow-md hover:bg-ritual-green/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Upload profile picture"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
          </div>

          {/* User Name */}
          <h2 className="font-serif text-2xl font-bold text-[#2E4C2F] mt-4">
            {userName}
          </h2>
        </div>

        {/* Content section - Use flex-grow and flex container */}
        <div className="flex flex-col flex-grow p-6 gap-6 overflow-y-auto">
          {/* Stats Grid */}
          <ProfileStats stats={stats} />

          {/* Streak Calendar */}
          <div className="w-full mt-2">
            <h3 className="text-[#6F8D6A] text-sm mb-3">Recent Activity</h3>
            <StreakCalendar />
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mt-4">
            <Button 
              className="w-full bg-ritual-green hover:bg-ritual-green/90 text-white rounded-full py-6"
              onClick={handleAddFriend}
            >
              Add Friend
            </Button>
            
            <Button 
              className="w-full bg-ritual-green hover:bg-ritual-green/90 text-white rounded-full py-6"
              onClick={handleViewGarden}
            >
              View Garden
            </Button>
          </div>

          {/* Spacer to push logout to bottom */}
          <div className="flex-grow"></div>

          {/* Divider */}
          <Separator className="my-4 bg-ritual-moss/30" />

          {/* Logout Button */}
          <div className="pb-4">
            <Button
              variant="ghost"
              className="w-full text-center text-[#A14444] hover:text-[#B65C5C] hover:bg-transparent"
              onClick={signOut}
            >
              Log Out
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePanel;
