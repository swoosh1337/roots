import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { friendsData, FriendData, Habit } from '@/data/dummyFriendsData'; // Use the actual path
import TreeVisual from '../TreeVisual'; // Assuming TreeVisual path
import RitualPopup from '../popups/RitualPopup'; // Assuming popup path and reusability

interface FriendGardenViewProps {
  friendId: string;
  onClose: () => void;
}

const FriendGardenView: React.FC<FriendGardenViewProps> = ({ friendId, onClose }) => {
  const [friend, setFriend] = useState<FriendData | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch friend data based on ID (using dummy data)
  useEffect(() => {
    const foundFriend = friendsData.find(f => f.id === friendId);
    setFriend(foundFriend || null);
  }, [friendId]);

  const handleTileClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedHabit(null), 300);
  };

  if (!friend) {
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

      <h2 className="text-4xl font-serif text-[#2F7A32] mb-8">
        {friend.name}'s Garden
      </h2>

      <div className="w-full max-w-4xl flex-1 overflow-y-auto">
        {friend.habits.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {friend.habits.map((habit) => (
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