import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { friendsData, FriendData, Habit } from '@/data/dummyFriendsData'; // Use the actual path

// Define a unified User type for the panel state
interface PanelUser extends FriendData {
  status: 'friend' | 'incoming' | 'sent'; // Add status back for requests
  // Note: FriendData already has id, name, avatar, habits
}

// Function to adapt FriendData to PanelUser for initial state
const adaptFriendDataToPanelUser = (data: FriendData[]): PanelUser[] => {
  return data.map(friend => ({
    ...friend,
    // Infer initial status based on dummy data structure or add explicitly
    // For now, let's assume friendsData might need a status field or we infer it
    // Example: if habits exist, status is friend. Need explicit status for requests in source data.
    status: friend.habits.length > 0 ? 'friend' : 'sent' // Simplified logic - needs better source data
  }));
};

// Let's update dummy data slightly for clarity
const INITIAL_PANEL_USERS: PanelUser[] = [
  {
    id: '1', name: "Polina", avatar: "/avatars/polina.png", status: "friend",
    habits: [ { id: 'h1', name: "Reading", streak: 5, currentDay: 6, stage: 2 }, { id: 'h2', name: "Meditation", streak: 9, currentDay: 10, stage: 3 } ]
  },
  {
    id: '2', name: "Taylor", avatar: "/avatars/taylor.png", status: "friend",
    habits: [ { id: 'h4', name: "Journaling", streak: 15, currentDay: 16, stage: 4 } ]
  },
  { id: '3', name: "Jordan", avatar: "/avatars/jordan.png", status: "sent", habits: [] },
  { id: '4', name: "Alex", avatar: "/avatars/alex.png", status: "incoming", habits: [] },
  { id: '5', name: "Casey", avatar: "/avatars/casey.png", status: "incoming", habits: [] },
];

interface FriendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: () => void;
  onSelectFriend: (friendId: string) => void;
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({
  isOpen,
  onClose,
  onAddFriend,
  onSelectFriend
}) => {
  const { toast } = useToast();
  const [panelUsers, setPanelUsers] = useState<PanelUser[]>(INITIAL_PANEL_USERS);

  // Derive lists from panelUsers state using the status field
  const friends = panelUsers.filter(user => user.status === 'friend');
  const incomingRequests = panelUsers.filter(user => user.status === 'incoming');
  const sentRequests = panelUsers.filter(user => user.status === 'sent');

  // State for collapsible sections
  const [isIncomingOpen, setIsIncomingOpen] = useState(true);
  const [isSentOpen, setIsSentOpen] = useState(false);

  // Toggle section visibility
  const toggleIncoming = () => setIsIncomingOpen(!isIncomingOpen);
  const toggleSent = () => setIsSentOpen(!isSentOpen);

  // Handle accepting a friend request
  const handleAccept = (userId: string) => {
    const userToAccept = panelUsers.find(user => user.id === userId);
    if (!userToAccept) return;

    setPanelUsers(currentUsers => 
      currentUsers.map(user => 
        user.id === userId ? { ...user, status: 'friend' as const } : user
      )
    );

    // Show success toast
    toast({
      title: "Friend Accepted",
      description: `${userToAccept.name} has been added to your friends list!`,
      variant: "default",
    });
  };

  // Handle declining a friend request
  const handleDecline = (userId: string) => {
    const userToDecline = panelUsers.find(u => u.id === userId);
    setPanelUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    toast({
      title: "Request Declined",
      description: `You declined the friend request from ${userToDecline?.name}.`,
      variant: "default",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-2xl shadow-lg w-[500px] max-h-[80vh] max-w-[95vw] overflow-hidden flex flex-col">
        {/* Header with title and close button */}
        <div className="relative pt-8 pb-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[#4CAF50] hover:text-[#3e9142] transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-4xl font-serif text-[#2F7A32] text-center">
            Friends
          </h2>
        </div>
        
        {/* Add Friend button - richer green color */}
        <div className="px-8 py-3">
          <Button 
            onClick={onAddFriend}
            className="w-full bg-[#4CAF50] hover:bg-[#3e9142] text-white rounded-full py-5 shadow-sm transition-colors"
          >
            Add Friend
          </Button>
        </div>
        
        {/* Friends list section */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          {/* Friends section */}
          <div className="mb-4">
            <h3 className="text-2xl font-medium text-[#2F4F4F] mb-4">
              Friends
            </h3>
            
            {friends.length > 0 ? (
              <div className="space-y-4">
                {friends.map(friend => (
                  <div 
                    key={friend.id}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => onSelectFriend(friend.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-[#E3F2E1] border border-[#D5E6C5]">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="text-lg">{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-lg font-medium text-[#1E1E1E]">{friend.name}</span>
                    </div>
                    
                    <span className="text-gray-400 text-sm">View Garden</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No friends yet</p>
            )}
          </div>
          
          {/* Separator between sections */}
          <Separator className="my-4 bg-gray-200" />
          
          {/* Incoming Requests section - Collapsible with Animation */}
          <div className="mb-4">
            <button 
              onClick={toggleIncoming}
              className="flex items-center justify-between w-full text-left mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <h3 className="text-2xl font-medium text-[#2F4F4F]">
                Incoming Requests
              </h3>
              {incomingRequests.length > 0 && (
                <span className="text-[#4CAF50]">
                  {isIncomingOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {isIncomingOpen && (
                <motion.div 
                  className="space-y-4 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {incomingRequests.length > 0 ? (
                    incomingRequests.map(request => (
                      <div 
                        key={request.id}
                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 bg-[#E3F2E1] border border-[#D5E6C5]">
                            <AvatarImage src={request.avatar} alt={request.name} />
                            <AvatarFallback className="text-lg">{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-lg font-medium text-[#1E1E1E]">{request.name}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            className="text-[#2F4F4F] border-[#4CAF50] rounded-full hover:bg-[#E3F2E1] hover:text-[#4CAF50] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(request.id);
                            }}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className="text-[#6C757D] hover:text-[#4f5256] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDecline(request.id);
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No incoming requests</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Separator between sections */}
          <Separator className="my-4 bg-gray-200" />
          
          {/* Sent Requests section - Collapsible with Animation */}
          <div className="mb-4">
            <button 
              onClick={toggleSent}
              className="flex items-center justify-between w-full text-left mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <h3 className="text-2xl font-medium text-[#2F4F4F]">
                Sent Requests
              </h3>
              {sentRequests.length > 0 && (
                <span className="text-[#4CAF50]">
                  {isSentOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {isSentOpen && (
                <motion.div 
                  className="space-y-4 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {sentRequests.length > 0 ? (
                    sentRequests.map(request => (
                      <div 
                        key={request.id}
                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 bg-[#E3F2E1] border border-[#D5E6C5]">
                            <AvatarImage src={request.avatar} alt={request.name} />
                            <AvatarFallback className="text-lg">{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-lg font-medium text-[#1E1E1E]">{request.name}</span>
                        </div>
                        
                        <span className="text-[#6C757D] font-semibold">Pending</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No sent requests</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPanel; 