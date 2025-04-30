import { useEffect, useState, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  habits: unknown[]; // TODO: Define a proper type for habits later
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Join with users table to get these
  name: string;
  avatar: string;
}

export function useFriendships() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetchedFriendships, setHasFetchedFriendships] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchFriendships = useCallback(async (forceRefresh = false) => {
    // Fetch friendships data
    
    if (!user) return;
    
    try {
      // Fetch friendships data
      setLoading(true);
      
      // Fetch friends as sender
      // Fetch accepted friendships where the current user is the sender
      const { data: friendsAsSender, error: senderError } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('status', 'accepted')
        .eq('sender_id', user.id);

      if (senderError) throw senderError;

      // Fetch friends as receiver
      // Fetch accepted friendships where the current user is the receiver
      const { data: friendsAsReceiver, error: receiverError } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('status', 'accepted')
        .eq('receiver_id', user.id);

      if (receiverError) throw receiverError;

      // Combine both result sets
      const acceptedFriendships = [...(friendsAsSender || []), ...(friendsAsReceiver || [])];

      // Fetch user details for friends
      const friendsList: Friend[] = [];
      
      for (const friendship of acceptedFriendships) {
        // Determine which user is the friend (not the current user)
        const friendId = friendship.sender_id === user.id ? friendship.receiver_id : friendship.sender_id;
        
        // Fetch user details for friend
        // Fetch friend details from users table
        const { data: friendDetails, error: userError } = await supabase
          .from('users') // Use users table
          .select('id, full_name, profile_img_url, email')
          .eq('id', friendId)
          .single();

        if (userError) {
          friendsList.push({
            id: friendId,
            name: 'Error loading name',
            avatar: '/avatars/default.png',
            habits: []
          });
          continue;
        }
          
        if (friendDetails) {
          // Extract username from email as fallback if no full_name exists
          const emailUsername = friendDetails.email ? friendDetails.email.split('@')[0] : null;
          
          friendsList.push({
            id: friendDetails.id,
            name: friendDetails.full_name || emailUsername || 'Unknown',
            avatar: friendDetails.profile_img_url || '/avatars/default.png',
            habits: []
          });
        } else {
          // No details found for user
          friendsList.push({
            id: friendId,
            name: 'Unknown',
            avatar: '/avatars/default.png',
            habits: []
          });
        }
      }

      // Fetch incoming requests
      // Fetch incoming requests
      const { data: incomingReqs } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
      
      // Transform incoming requests with sender details
      const incomingList: FriendRequest[] = [];
      
      if (incomingReqs) {
        for (const request of incomingReqs) {
          // Fetch sender details for incoming request
          // Fetch sender details from users table
          const { data: senderData, error: senderError } = await supabase
            .from('users') // Use users table
            .select('full_name, profile_img_url, email')
            .eq('id', request.sender_id)
            .single();
            
          

          if (senderData) {
            // Extract username from email as fallback if no full_name exists
            const emailUsername = senderData.email ? senderData.email.split('@')[0] : null;
            
            incomingList.push({
              id: request.id,
              sender_id: request.sender_id,
              receiver_id: request.receiver_id,
              status: request.status as 'pending' | 'accepted' | 'rejected',
              created_at: request.created_at,
              name: senderData.full_name || emailUsername || 'Unknown',
              avatar: senderData.profile_img_url || '/avatars/default.png'
            });
          }
        }
      }

      // Fetch sent requests
      // Fetch sent requests
      const { data: sentReqs } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('sender_id', user.id)
        .eq('status', 'pending');
      
      // Transform sent requests with receiver details
      const sentList: FriendRequest[] = [];
      
      if (sentReqs) {
        for (const request of sentReqs) {
          // Fetch receiver details for sent request
          // Fetch receiver details from users table
          const { data: receiverData, error: receiverError } = await supabase
            .from('users') // Use users table
            .select('full_name, profile_img_url, email')
            .eq('id', request.receiver_id)
            .single();
            
          // Handle potential error fetching user details
          

          if (receiverData) {
            // Extract username from email as fallback if no full_name exists
            const emailUsername = receiverData.email ? receiverData.email.split('@')[0] : null;
            
            sentList.push({
              id: request.id,
              sender_id: request.sender_id,
              receiver_id: request.receiver_id,
              status: request.status as 'pending' | 'accepted' | 'rejected',
              created_at: request.created_at,
              name: receiverData.full_name || emailUsername || 'Unknown',
              avatar: receiverData.profile_img_url || '/avatars/default.png'
            });
          }
        }
      }

      setFriends(friendsList);
      setIncomingRequests(incomingList);
      setSentRequests(sentList);
      setHasFetchedFriendships(true);
    } catch (error) {
      // Handle error silently in production
      toast({
        title: "Error",
        description: "Failed to load friends list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const sendRequest = useCallback(async (targetUserId: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return; // Early return if no user
    }

    // 1. Prevent adding self
    if (user && targetUserId === user.id) {
      throw new Error("Cannot add yourself"); 
    }

    try {
      // Check for existing friendship/request
      // 2. Check for existing friendship or pending request
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select('status, sender_id') // Select sender_id to check who sent pending request
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .maybeSingle(); // Expect 0 or 1 result

      if (checkError) {
        // Handle error silently in production
        throw new Error("Database error checking friendship status."); // Throw generic DB error
      }

      // 3. Handle existing relationship
      if (existingFriendship) {
        if (existingFriendship.status === 'accepted') {
          throw new Error("Already friends"); // Specific error for catch block
        } else if (existingFriendship.status === 'pending') {
           // Check who sent the pending request
           if (existingFriendship.sender_id === user.id) {
             throw new Error("Request pending (sent)"); // You already sent one
           } else {
             throw new Error("Request pending (received)"); // They sent you one
           }
        }
         // Potentially handle 'rejected' status if needed, currently ignored
      }

      // 4. No existing relationship, proceed with insert
      // Insert new friendship record
      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          sender_id: user.id,
          receiver_id: targetUserId,
          status: 'pending'
        });

      if (insertError) {
         // Handle error silently in production
         // Check for specific DB errors if necessary (e.g., constraints like unique index)
         // Example: Check for unique violation code (e.g., '23505' in PostgreSQL)
         if (insertError.code === '23505') {
             // This might happen in a race condition if the initial check passed but another request inserted meanwhile
             // Or if the DB constraint logic is slightly different from the initial check
             throw new Error("Request pending or already friends"); // More generic for race condition
         }
         throw new Error("Failed to send friend request."); // More specific than generic catch
      }

      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent successfully!",
         variant: "default", // Use default or success variant
      });

      // OPTIONAL: Update local state optimistically (kept from previous version)
      // This avoids waiting for the real-time update or a manual refresh
      const { data: receiverData } = await supabase
        .from('users')
        .select('full_name, profile_img_url, email')
        .eq('id', targetUserId)
        .single();
      
      if (receiverData) {
        const emailUsername = receiverData.email ? receiverData.email.split('@')[0] : null;
        
        // Create a new request object mirroring the FriendRequest interface
        const newSentRequest: FriendRequest = {
          // Generate a temporary client-side ID. The real-time update should replace this.
          id: `temp_${crypto.randomUUID()}`,
          sender_id: user.id,
          receiver_id: targetUserId,
          status: 'pending',
          created_at: new Date().toISOString(),
          name: receiverData.full_name || emailUsername || 'Unknown',
          avatar: receiverData.profile_img_url || '/avatars/default.png'
        };

        setSentRequests(prev => [...prev, newSentRequest]);
      }

      fetchFriendships(true); // Force refresh
    } catch (error: unknown) {
      
      let shouldShowToast = true; // Flag to control generic toast

      // Use specific messages from thrown errors
      if (error instanceof Error) {
         if (error.message === "Already friends") {
           shouldShowToast = false; // Handled inline by modal
         } else if (error.message === "Request pending (sent)") {
           shouldShowToast = false; // Handled inline by modal
         } else if (error.message === "Request pending (received)") {
           shouldShowToast = false; // Handled inline by modal
         } else if (error.message === "Cannot add yourself") {
           shouldShowToast = false; // Handled inline by modal
         } else if (error.message === "Request pending or already friends") { 
           shouldShowToast = false; // Treat race condition as a specific error handled inline
         }
      }

      // Show toast only for generic/unhandled errors
      if (shouldShowToast) {
        toast({
          title: "Error",
          description: (error instanceof Error) ? error.message : "Failed to send friend request. Please try again.",
          variant: "destructive",
        });
      }

      // Re-throw the error so AddFriendModal's catch block can potentially react
      // (though AddFriendModal currently doesn't differentiate based on these errors)
      throw error; 
    }
  }, [user, toast, setSentRequests, fetchFriendships]); // Add fetchFriendships

  const acceptRequest = useCallback(async (requestId: string) => {
    if (!user) return; // Add check for user
    try {
      // Update friendship to accepted status
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .eq('receiver_id', user?.id); // Safety check

      if (error) throw error;

      toast({
        title: "Friend Request Accepted",
        description: "You are now friends!",
      });

      // Update local state directly instead of refetching
      const acceptedRequest = incomingRequests.find(req => req.id === requestId);
      if (acceptedRequest) {
        // Add to friends list
        setFriends(prev => [...prev, {
          id: acceptedRequest.sender_id,
          name: acceptedRequest.name,
          avatar: acceptedRequest.avatar,
          habits: []
        }]);
        
        // Remove from incoming requests
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      }

      fetchFriendships(true); // Force refresh
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast, setFriends, setIncomingRequests, fetchFriendships, incomingRequests]); // Add incomingRequests

  const rejectRequest = useCallback(async (requestId: string) => {
    if (!user) return; // Ensure user context is available
    try {
      // Delete friendship request
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId)
        .eq('receiver_id', user?.id); // Safety check

      if (error) throw error;

      toast({
        title: "Friend Request Rejected",
        description: "The friend request has been rejected.",
      });

      // Update local state directly
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));

      fetchFriendships(true); // Force refresh
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast, setIncomingRequests, fetchFriendships]); // Add fetchFriendships

  // Debounced fetch for real-time updates
  const debouncedFetchFriendships = useRef(debounce(() => fetchFriendships(true), 300)).current;

  // Set up real-time subscription for friendship changes - only once when component mounts
  useEffect(() => {
    if (!user) return;

    // Fetch only if we have a user AND haven't fetched successfully yet
    if (user && !hasFetchedFriendships) {
      // Initial fetch triggered by useEffect
      fetchFriendships();
    } else if (!user) {
      // If user logs out, reset state
      setFriends([]);
      setIncomingRequests([]);
      setSentRequests([]);
      setLoading(true);
      setHasFetchedFriendships(false);
    }

    // Set up subscription only once
    if (!channelRef.current) {
      // Set up real-time subscription for friendship changes
      
      const channel = supabase
        .channel('friendship-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friendships',
            filter: `sender_id=eq.${user.id}`,
          },
          () => {
            // Real-time update detected (sender)
            fetchFriendships(true);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friendships',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            // Real-time update detected (receiver)
            fetchFriendships(true);
          }
        )
        .subscribe();

      channelRef.current = channel;
    }

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        // Clean up friendship subscription
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      debouncedFetchFriendships.cancel();
    };
  }, [user, fetchFriendships, hasFetchedFriendships, debouncedFetchFriendships]);

  return {
    friends,
    incomingRequests,
    sentRequests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    refresh: () => fetchFriendships(true) // Force refresh when explicitly called
  };
}
