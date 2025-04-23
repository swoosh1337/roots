
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import TreeVisual from '../TreeVisual'; 
import RitualPopup from '../popups/RitualPopup';
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

interface Habit {
  id: string;
  name: string;
  streak: number;
  last_completed: string | null;
}

const FriendGardenView: React.FC<FriendGardenViewProps> = ({ friendId, onClose }) => {
  const { toast } = useToast();
  const [friend, setFriend] = useState<FriendData | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch friend data and habits
  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        setLoading(true);
        
        // Fetch friend details
        const { data: friendData, error: friendError } = await supabase
          .from('users')
          .select('id, full_name, profile_img_url')
          .eq('id', friendId)
          .single();
        
        if (friendError) {
          throw friendError;
        }
        
        if (friendData) {
          setFriend({
            id: friendData.id,
            name: friendData.full_name || 'Unknown',
            avatar: friendData.profile_img_url || '/avatars/default.png'
          });
          
          // Fetch friend's habits
          const { data: habitsData, error: habitsError } = await supabase
            .from('habits')
            .select('id, name, streak_count, last_completed')
            .eq('user_id', friendId)
            .eq('is_active', true);
          
          if (habitsError) {
            throw habitsError;
          }
          
          if (habitsData) {
            setHabits(habitsData.map(habit => ({
              id: habit.id,
              name: habit.name,
              streak: habit.streak_count,
              last_completed: habit.last_completed
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching friend data:', error);
        toast({
          title: "Error",
          description: "Failed to load friend's garden. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriendData();
  }, [friendId, toast]);

  const handleTileClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedHabit(null), 300);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-ritual-paper z-50 flex items-center justify-center">
        <p className="text-ritual-forest text-lg">Loading friend's garden...</p>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-ritual-forest hover:bg-ritual-moss/20 p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="fixed inset-0 bg-ritual-paper z-50 flex items-center justify-center">
        <p className="text-ritual-forest text-lg">Friend not found</p>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-ritual-forest hover:bg-ritual-moss/20 p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-ritual-paper z-50 flex flex-col items-center p-6 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-ritual-forest hover:bg-ritual-moss/20 p-2 rounded-full transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-14 w-14 bg-[#E3F2E1] border border-[#D5E6C5]">
          <AvatarImage src={friend.avatar} alt={friend.name} />
          <AvatarFallback className="text-lg">{friend.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-serif text-[#2F7A32]">
          {friend.name}'s Garden
        </h2>
      </div>

      <div className="w-full max-w-4xl flex-1 overflow-y-auto">
        {habits.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                className="relative aspect-square bg-[#e8f5e9] rounded-xl flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => handleTileClick(habit)}
                whileHover={{ scale: 1.03, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <TreeVisual 
                  streak={habit.streak} 
                  isAnimating={false}
                  testMode={false}
                />
                
                {selectedHabit?.id === habit.id && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10">
                    <RitualPopup 
                      isOpen={isPopupOpen} 
                      ritualName={selectedHabit.name} 
                      streakCount={selectedHabit.streak} 
                      onClose={handleClosePopup} 
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic text-lg">
              {friend.name}'s garden is empty right now.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FriendGardenView;
