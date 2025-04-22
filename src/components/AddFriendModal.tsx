import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Dummy user data for testing
const DUMMY_USERS = [
  { id: '1', email: 'alex@example.com', name: 'Alex' },
  { id: '2', email: 'polina@example.com', name: 'Polina' },
  { id: '3', email: 'taylor@example.com', name: 'Taylor' },
  { id: '4', email: 'jordan@example.com', name: 'Jordan' },
];

// Type for friend request status
type RequestStatus = 'idle' | 'pending_sent' | 'not_found';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (identifier: string) => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
  onSendRequest
}) => {
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRequestedUser, setLastRequestedUser] = useState<{id: string, name: string} | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (identifier.trim()) {
      // Reset state
      setErrorMessage('');
      setRequestStatus('idle');
      
      // Search for user (case insensitive)
      const trimmedIdentifier = identifier.trim().toLowerCase();
      const foundUser = DUMMY_USERS.find(
        user => 
          user.email.toLowerCase() === trimmedIdentifier || 
          user.name.toLowerCase() === trimmedIdentifier
      );
      
      if (foundUser) {
        // Success - User found
        setRequestStatus('pending_sent');
        setLastRequestedUser(foundUser);
        
        // Call the provided callback
        onSendRequest(identifier.trim());
        
        // Show success toast
        toast({
          title: "Friend Request Sent",
          description: `Friend request sent to ${foundUser.name}!`,
          variant: "default",
        });
        
        // Clear the input after a brief delay to allow user to see what they entered
        setTimeout(() => {
          setIdentifier('');
          setRequestStatus('idle'); // Reset status to allow sending another request
        }, 1500);
      } else {
        // Error - User not found
        setRequestStatus('not_found');
        setErrorMessage('No user found with that name or email');
        
        // Show error toast
        toast({
          title: "User Not Found",
          description: "Oops! That user doesn't exist. Try again.",
          variant: "destructive",
        });
      }
    }
  };

  const resetState = () => {
    setIdentifier('');
    setRequestStatus('idle');
    setErrorMessage('');
    setLastRequestedUser(null);
  };

  // Reset state when modal closes
  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Custom modal */}
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw] overflow-hidden">
        {/* Header with X button */}
        <div className="relative pt-8 pb-4">
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-4xl font-serif text-ritual-forest text-center">
            Add Friend
          </h2>
        </div>
        
        {/* Form content */}
        <div className="px-8 py-4 space-y-4">
          {/* Input */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter a username or email"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                // Reset error when typing again
                if (requestStatus === 'not_found') {
                  setRequestStatus('idle');
                  setErrorMessage('');
                }
              }}
              className={`w-full rounded-md py-2 px-3 ${
                requestStatus === 'not_found' 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-ritual-green focus:ring-ritual-green'
              }`}
            />
            {/* Error message */}
            {requestStatus === 'not_found' && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
          
          {/* Button with darker green color */}
          {requestStatus === 'pending_sent' && lastRequestedUser ? (
            <Button
              disabled
              className="w-full bg-[#A1C181] border border-[#8FB573] text-[#3E6140] font-medium rounded-md py-3 text-base cursor-not-allowed"
            >
              ⏳ Request Pending
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSend}
              disabled={!identifier.trim()}
              className="w-full bg-[#A1C181] hover:bg-[#8FB573] border border-[#8FB573] text-[#3E6140] font-medium rounded-md py-3 text-base transition-colors"
            >
              Send Request
            </Button>
          )}
          
          {/* Help text */}
          <p className="text-center text-sm text-gray-500 mt-2">
            Try entering: Alex, Polina, Taylor, or Jordan
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal; 