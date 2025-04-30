import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFriendships } from '@/hooks/useFriendships'; // Assuming this handles toasts for existing/pending

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  // sendRequest should ideally handle checking existing friendships/requests
  // and throw specific errors or return status codes if needed, or handle toasts internally.
  const { sendRequest } = useFriendships(); 
  const [identifier, setIdentifier] = useState(''); // Email input
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null); // State for inline errors

  // Reset state when modal opens/closes
  useEffect(() => {
    // Reset only when modal is closed to keep input on reopen if desired
    // Or reset also when isOpen becomes true if you want a fresh state always
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!identifier.trim() || isSubmitting) return;

    const emailToSearch = identifier.trim();
    setIsSubmitting(true);
    setNotFoundError(false); // Clear previous error
    setInlineError(null); // Clear previous inline error

    try {
      // 1. Find the user by email first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id') // Only need the ID
        .ilike('email', emailToSearch) // Use ilike for case-insensitive search
        .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without error

      // 2. Handle User Not Found
      if (userError) {
        throw new Error('Database error searching for user.'); // Throw a generic error for unexpected DB issues
      }
      
      if (!userData) {
        setNotFoundError(true);
        setIsSubmitting(false); // Stop submission but keep error visible
        return;
      }

      // 3. User found, attempt to send request via the hook
      // The hook should handle logic like "already friends", "request pending", "cannot add self"
      // and potentially show appropriate toasts or throw specific errors.
      await sendRequest(userData.id);

      // 4. Success (if sendRequest doesn't throw for handled cases)
      toast({
        title: "Success",
        description: "Friend request sent successfully.",
        variant: "default", // Or use a success variant if available
      });
      resetState();
      onClose(); // Close modal on success

    } catch (error: unknown) { 
      // Clear previous errors
      setNotFoundError(false);
      setInlineError(null);

      // Type check before accessing properties
      if (error instanceof Error) {
        // Handle specific errors inline
        if (error.message === "Already friends") {
          setInlineError("You are already friends with this user.");
        } else if (error.message.includes("Request pending")) { // Covers sent/received
          setInlineError("A friend request is already pending.");
        } else if (error.message === "Cannot add yourself") {
          setInlineError("You cannot add yourself as a friend.");
        } else {
          // Show generic error toast for other errors
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      } else {
        // Non-Error object thrown, show generic toast
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
      // Always stop submitting on error
      setIsSubmitting(false);
    }
    // Ensure loading state is always turned off if we didn't hit the 'not found' case earlier
  };

  const resetState = () => {
    setIdentifier('');
    setIsSubmitting(false);
    setNotFoundError(false);
    setInlineError(null); // Reset inline error too
  };

  if (!isOpen) return null;

  return (
    // Added background overlay and centering
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden" 
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        {/* Modal Header */}
        <div className="relative pt-6 pb-4 px-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold font-serif text-ritual-forest text-center"> 
            Add Friend
          </h2>
          <button 
            onClick={onClose} // Use onClose directly
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="px-6 py-6 space-y-5"> 
          <div className="relative">
            <label htmlFor="friend-email" className="block text-sm font-medium text-gray-700 mb-1">Friend's Email</label>
            <Input
              id="friend-email"
              type="email" // Use email type
              placeholder="e.g., friend@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                // Clear errors on typing
                if (notFoundError) {
                  setNotFoundError(false); // Clear error on typing
                }
                if (inlineError) {
                  setInlineError(null); // Clear inline error on typing
                }
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }} // Allow Enter key submission
              className={`w-full rounded-md py-2 px-3 border ${ // Improved styling
                notFoundError || inlineError // Highlight border on either error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                  : 'border-gray-300 focus:border-ritual-green focus:ring-ritual-green/50'
              } focus:ring-1 focus:outline-none transition-colors`}
              aria-invalid={!!(notFoundError || inlineError)}
              aria-describedby={notFoundError ? "email-not-found-message" : inlineError ? "email-inline-error-message" : undefined}
            />
            {notFoundError && (
              <p id="email-not-found-message" className="text-red-600 text-xs mt-1">No user found with this email address.</p>
            )}
            {inlineError && (
              <p id="email-inline-error-message" className="text-red-600 text-xs mt-1">{inlineError}</p>
            )}
          </div>
          
          {/* Single Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!identifier.trim() || isSubmitting}
            className="w-full bg-ritual-green hover:bg-ritual-green-dark border border-ritual-green-dark text-white font-medium rounded-md py-2.5 px-4 text-base transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ritual-green"
          >
            {isSubmitting ? 'Sending Request...' : 'Send Friend Request'}
          </Button>
          
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
