
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFriendships } from '@/hooks/useFriendships';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchStatus = 'idle' | 'searching' | 'not_found' | 'found';

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { sendRequest, friends, sentRequests } = useFriendships();
  const [identifier, setIdentifier] = useState('');
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const [foundUser, setFoundUser] = useState<{id: string, email: string, name: string} | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (identifier.trim()) {
      setSearchStatus('searching');
      setFoundUser(null);

      try {
        // Search for user by email
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, full_name')
          .ilike('email', identifier.trim())
          .single();

        if (userError) {
          if (userError.code === 'PGRST116') {
            setSearchStatus('not_found');
          } else {
            throw userError;
          }
          return;
        }

        // Check if already friends or request pending
        const isAlreadyFriend = friends.some(friend => friend.id === userData.id);
        const isPending = sentRequests.some(request => 
          request.receiver_id === userData.id && request.status === 'pending'
        );

        if (isAlreadyFriend) {
          toast({
            title: "Already Friends",
            description: "You are already friends with this user.",
            variant: "default",
          });
          resetState();
          return;
        }

        if (isPending) {
          toast({
            title: "Request Pending",
            description: "You already have a pending request to this user.",
            variant: "default",
          });
          resetState();
          return;
        }

        // Transform the user data to match our expected format
        setFoundUser({
          id: userData.id,
          email: userData.email,
          name: userData.full_name || 'Unknown'
        });
        setSearchStatus('found');
      } catch (error) {
        console.error('Error searching for user:', error);
        toast({
          title: "Error",
          description: "An error occurred while searching. Please try again.",
          variant: "destructive",
        });
        setSearchStatus('idle');
      }
    }
  };

  const handleSendRequest = async () => {
    if (foundUser) {
      await sendRequest(foundUser.id);
      resetState();
      onClose();
    }
  };

  const resetState = () => {
    setIdentifier('');
    setSearchStatus('idle');
    setFoundUser(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-w-[95vw] overflow-hidden">
        <div className="relative pt-8 pb-4">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-4xl font-serif text-ritual-forest text-center">
            Add Friend
          </h2>
        </div>
        
        <div className="px-8 py-4 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter email address"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (searchStatus === 'not_found') {
                  setSearchStatus('idle');
                }
              }}
              className={`w-full rounded-md py-2 px-3 ${
                searchStatus === 'not_found' 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-ritual-green focus:ring-ritual-green'
              }`}
            />
            {searchStatus === 'not_found' && (
              <p className="text-red-500 text-sm mt-1">No user found with that email address.</p>
            )}
          </div>
          
          {searchStatus === 'found' && foundUser ? (
            <Button
              onClick={handleSendRequest}
              className="w-full bg-[#A1C181] hover:bg-[#8FB573] border border-[#8FB573] text-[#3E6140] font-medium rounded-md py-3 text-base transition-colors"
            >
              Send Friend Request
            </Button>
          ) : (
            <Button
              onClick={handleSearch}
              disabled={!identifier.trim() || searchStatus === 'searching'}
              className="w-full bg-[#A1C181] hover:bg-[#8FB573] border border-[#8FB573] text-[#3E6140] font-medium rounded-md py-3 text-base transition-colors"
            >
              {searchStatus === 'searching' ? 'Searching...' : 'Search'}
            </Button>
          )}
          
          <p className="text-center text-sm text-gray-500 mt-2">
            Search by email address to find your friend
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
