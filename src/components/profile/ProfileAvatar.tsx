
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProfileAvatarProps {
  user: User | null;
  avatarSrc: string;
  onImageUpdate: (newImageUrl: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, avatarSrc, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) {
      return;
    }

    setUploading(true);

    try {
      // Create a consistent file path for this user - always same name to enable overwriting
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload the file to Supabase Storage with upsert: true to overwrite existing file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-imgs')
        .upload(filePath, file, {
          upsert: true, // Enables overwriting existing files
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profile-imgs')
        .getPublicUrl(filePath);
          
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to retrieve public URL after upload.');
      }
      
      // Add cache-busting parameter to force image refresh
      const timestamp = new Date().getTime();
      const publicUrl = `${urlData.publicUrl}?t=${timestamp}`;
      
      // Update the parent component with the new URL
      onImageUpdate(publicUrl);

      // Update the user's profile with the new image URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_img_url: urlData.publicUrl }) // Store base URL without timestamp in DB
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile image has been updated successfully! 🌿",
      });

    } catch (error) {
      
      // Enhanced error reporting for debugging
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload Failed",
        description: `There was an error uploading your image: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  return (
    <div className="relative group">
      <Avatar className="h-20 w-20 border-2 border-ritual-moss">
        <AvatarImage src={avatarSrc} alt="User Avatar" />
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
  );
};

export default ProfileAvatar;
