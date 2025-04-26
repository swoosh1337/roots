
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRituals } from '@/hooks/useRituals';
import Garden from '@/components/garden/Garden';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

interface FriendGardenViewProps {
  friendId: string;
  onClose: () => void;
}

interface FriendData {
  id: string;
  name: string;
  avatar: string;
}

const FriendGardenView: React.FC<FriendGardenViewProps> = ({ friendId, onClose }) => {
  const { rituals, loading, error } = useRituals(friendId);
  const [friend, setFriend] = useState<FriendData | null>(null);
  const { toast } = useToast();

  // Fetch friend's basic info for the header
  useEffect(() => {
    const fetchFriendData = async () => {
      console.log("Fetching friend data for ID:", friendId);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, profile_img_url, email')
          .eq('id', friendId)
          .single();

        if (error) {
          console.error("Error fetching friend data:", error);
          toast({
            title: "Error Loading Friend",
            description: "Could not load friend information.",
            variant: "destructive"
          });
          
          // Set a fallback friend object even if there's an error
          setFriend({
            id: friendId,
            name: 'Friend',
            avatar: '/avatars/default.png'
          });
          return;
        }

        if (data) {
          console.log("Friend data retrieved:", data);
          // Extract username from email as fallback if no full_name exists
          const emailUsername = data.email ? data.email.split('@')[0] : null;

          setFriend({
            id: data.id,
            name: data.full_name || emailUsername || 'Friend',
            avatar: data.profile_img_url || '/avatars/default.png'
          });
        }
      } catch (err) {
        console.error("Exception fetching friend data:", err);
        setFriend({
          id: friendId,
          name: 'Friend',
          avatar: '/avatars/default.png'
        });
      }
    };

    fetchFriendData();
  }, [friendId, toast]);

  // Log the rituals data whenever it changes
  useEffect(() => {
    console.log("Friend garden rituals:", rituals);
  }, [rituals]);
  
  return (
    <motion.div
      className="fixed inset-0 bg-ritual-paper z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-ritual-forest hover:bg-ritual-moss/20 p-2 rounded-full transition-colors z-50"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Friend info header */}
      {friend && (
        <div className="flex items-center gap-3 p-4 pb-0">
          <Avatar className="h-10 w-10 bg-[#E3F2E1] border border-[#D5E6C5]">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback className="text-sm">{friend.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-serif text-[#2F7A32]">
            {friend.name}'s Garden
          </h2>
        </div>
      )}

      {/* Directly render the Garden component */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-ritual-forest text-lg">Loading garden...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-ritual-forest text-lg">Error loading garden. Please try again later.</p>
          </div>
        ) : rituals.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-ritual-forest text-lg">This garden is empty. No rituals found.</p>
          </div>
        ) : (
          <Garden
            rituals={rituals}
            onClose={onClose}
            isViewOnly={true}
            hideCloseButton={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default FriendGardenView;
