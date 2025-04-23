
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  habits: any[]; // We'll type this properly later when we implement habits
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

  const fetchFriendships = async () => {
    if (!user) return;

    try {
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
      const acceptedFriendships = [...friendsAsSender, ...friendsAsReceiver];

      // Fetch user details for friends
      const friendsList: Friend[] = [];
      
      for (const friendship of acceptedFriendships) {
        // Determine which user is the friend (not the current user)
        const friendId = friendship.sender_id === user.id ? friendship.receiver_id : friendship.sender_id;
        
        // Fetch friend details
        const { data: friendData, error: friendError } = await supabase
          .from('users')
          .select('id, full_name, profile_img_url')
          .eq('id', friendId)
          .single();
          
        if (friendError) {
          console.error('Error fetching friend details:', friendError);
          continue; // Skip this friend but continue with the rest
        }
        
        if (friendData) {
          friendsList.push({
            id: friendData.id,
            name: friendData.full_name || 'Unknown',
            avatar: friendData.profile_img_url || '/avatars/default.png',
            habits: [] // We'll populate this later
          });
        }
      }

      // Fetch incoming requests with user details
      const { data: incomingReqs, error: incomingError } = await supabase
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

      if (incomingError) throw incomingError;
      
      // Transform incoming requests with sender details
      const incomingList: FriendRequest[] = [];
      
      for (const request of incomingReqs) {
        const { data: senderData, error: senderError } = await supabase
          .from('users')
          .select('full_name, profile_img_url')
          .eq('id', request.sender_id)
          .single();
          
        if (senderError) {
          console.error('Error fetching sender details:', senderError);
          continue;
        }
        
        incomingList.push({
          id: request.id,
          sender_id: request.sender_id,
          receiver_id: request.receiver_id,
          status: request.status as 'pending' | 'accepted' | 'rejected',
          created_at: request.created_at,
          name: senderData?.full_name || 'Unknown',
          avatar: senderData?.profile_img_url || '/avatars/default.png'
        });
      }

      // Fetch sent requests with receiver details
      const { data: sentReqs, error: sentError } = await supabase
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

      if (sentError) throw sentError;
      
      // Transform sent requests with receiver details
      const sentList: FriendRequest[] = [];
      
      for (const request of sentReqs) {
        const { data: receiverData, error: receiverError } = await supabase
          .from('users')
          .select('full_name, profile_img_url')
          .eq('id', request.receiver_id)
          .single();
          
        if (receiverError) {
          console.error('Error fetching receiver details:', receiverError);
          continue;
        }
        
        sentList.push({
          id: request.id,
          sender_id: request.sender_id,
          receiver_id: request.receiver_id,
          status: request.status as 'pending' | 'accepted' | 'rejected',
          created_at: request.created_at,
          name: receiverData?.full_name || 'Unknown',
          avatar: receiverData?.profile_img_url || '/avatars/default.png'
        });
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
  };

  const sendRequest = async (targetUserId: string) => {
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
  };

  const acceptRequest = async (requestId: string) => {
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
  };

  const rejectRequest = async (requestId: string) => {
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
  };

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
  }, [user?.id]);

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
