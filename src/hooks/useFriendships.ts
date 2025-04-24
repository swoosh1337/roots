import { useEffect, useState, useCallback } from 'react';
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

  const fetchFriendships = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
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
        
        // Fetch friend details from users table
        const { data: friendDetails, error: userError } = await supabase
          .from('users') // Use users table
          .select('id, full_name, profile_img_url, email')
          .eq('id', friendId)
          .single();

        if (userError) {
          console.error(`Error fetching details for user ${friendId}:`, userError);
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
          console.warn(`No details found for user ${friendId}`);
          friendsList.push({
            id: friendId,
            name: 'Unknown',
            avatar: '/avatars/default.png',
            habits: []
          });
        }
      }

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
          // Fetch sender details from users table
          const { data: senderData, error: senderError } = await supabase
            .from('users') // Use users table
            .select('full_name, profile_img_url, email')
            .eq('id', request.sender_id)
            .single();
            
          // Handle potential error fetching user details
          if (senderError) {
            console.error(`Error fetching details for sender ${request.sender_id}:`, senderError);
          }

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
          // Fetch receiver details from users table
          const { data: receiverData, error: receiverError } = await supabase
            .from('users') // Use users table
            .select('full_name, profile_img_url, email')
            .eq('id', request.receiver_id)
            .single();
            
          // Handle potential error fetching user details
          if (receiverError) {
            console.error(`Error fetching details for receiver ${request.receiver_id}:`, receiverError);
          }

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
    } catch (error) {
      console.error('Error fetching friendships:', error);
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
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          sender_id: user.id,
          receiver_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent successfully!",
      });

      // Refresh the lists
      fetchFriendships();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast, fetchFriendships]);

  const acceptRequest = useCallback(async (requestId: string) => {
    try {
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

      // Refresh the lists
      fetchFriendships();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast, fetchFriendships]);

  const rejectRequest = useCallback(async (requestId: string) => {
    try {
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

      // Refresh the lists
      fetchFriendships();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast, fetchFriendships]);

  // Set up real-time subscription for friendship changes
  useEffect(() => {
    if (!user) return;

    fetchFriendships();

    // Subscribe to changes
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
        () => fetchFriendships()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => fetchFriendships()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchFriendships]);

  // Fetch initial data
  useEffect(() => {
    fetchFriendships();
  }, [fetchFriendships, user]);

  return {
    friends,
    incomingRequests,
    sentRequests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    refresh: fetchFriendships
  };
}
