
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useFriendships } from '@/hooks/useFriendships';

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
  const { friends, incomingRequests, sentRequests, loading, acceptRequest, rejectRequest } = useFriendships();
  const [isIncomingOpen, setIsIncomingOpen] = useState(true);
  const [isSentOpen, setIsSentOpen] = useState(false);

  // Toggle section visibility
  const toggleIncoming = () => setIsIncomingOpen(!isIncomingOpen);
  const toggleSent = () => setIsSentOpen(!isSentOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
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
        
        {/* Add Friend button */}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading friends...</p>
            </div>
          ) : (
            <>
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
              
              <Separator className="my-4 bg-gray-200" />
              
              {/* Incoming Requests section */}
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
                                  acceptRequest(request.id);
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
                                  rejectRequest(request.id);
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
              
              <Separator className="my-4 bg-gray-200" />
              
              {/* Sent Requests section */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPanel;
