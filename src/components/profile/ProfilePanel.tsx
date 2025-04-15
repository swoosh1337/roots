
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ProfileStats from './ProfileStats';
import StreakCalendar from './StreakCalendar';
import { useToast } from '@/components/ui/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();

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
          
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-2 border-ritual-moss">
            <AvatarImage src="/placeholder.svg" alt="User Avatar" />
            <AvatarFallback className="bg-ritual-moss/20 text-ritual-forest text-xl">
              {user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          {/* User Name */}
          <h2 className="font-serif text-2xl font-bold text-[#2E4C2F] mt-4">
            {user?.email?.split('@')[0] || 'Rishi'}
          </h2>
        </div>

        {/* Content section */}
        <div className="flex flex-col p-6 gap-6 overflow-y-auto">
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
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePanel;
