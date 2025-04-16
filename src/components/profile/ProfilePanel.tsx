import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, Leaf, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Get the file from the input
      const file = event.target.files?.[0];
      if (!file || !user) return;

      setUploading(true);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('profile-imgs')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-imgs')
        .getPublicUrl(filePath);

      // Update the user's profile with the new image URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_img_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile image has been updated successfully! 🌿",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the input value so the same file can be selected again
      if (event.target) event.target.value = '';
    }
  };

  // Get profile image with fallback logic
  const getProfileImage = () => {
    // First try user's profile_img_url from our database
    if (user?.user_metadata?.profile_img_url) {
      return user.user_metadata.profile_img_url;
    }
    // Then try Google avatar if available
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    // Otherwise use placeholder
    return "/placeholder.svg";
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

        {/* Top section with green background */}
        <div className="bg-[#E7F1E5] rounded-tl-3xl p-8 pt-12 flex flex-col items-center relative">
          {/* Leaf decoration */}
          <div className="absolute top-3 left-3 text-ritual-green opacity-30">
            <Leaf size={24} />
          </div>
          
          {/* Avatar with upload button */}
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-ritual-moss">
              <AvatarImage src={getProfileImage()} alt="User Avatar" />
              <AvatarFallback className="bg-ritual-moss/20 text-ritual-forest text-xl">
                {user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {/* Upload overlay - visible on hover */}
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              aria-label="Upload profile picture"
            >
              <Camera size={20} />
            </label>
            
            {/* Hidden file input */}
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            
            {/* Loading indicator during upload */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full">
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* User Name */}
          <h2 className="font-serif text-2xl font-bold text-[#2E4C2F] mt-4">
            {user?.email?.split('@')[0] || 'Rishi'}
          </h2>
        </div>

        {/* Content section - Make it flex column with grow */}
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
