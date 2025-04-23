
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
      // Fetch accepted friendships (friends)
      const { data: acceptedFriendships, error: friendsError } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          users:sender_id (
            id,
            full_name,
            profile_img_url
          )
        `)
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (friendsError) throw friendsError;

      // Fetch incoming requests
      const { data: incoming, error: incomingError } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          users:sender_id (
            id,
            full_name,
            profile_img_url
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (incomingError) throw incomingError;

      // Fetch sent requests
      const { data: sent, error: sentError } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          users:receiver_id (
            id,
            full_name,
            profile_img_url
          )
        `)
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      // Transform the data to match our Friend interface
      const friendsList = acceptedFriendships.map(friendship => ({
        id: friendship.users.id,
        name: friendship.users.full_name || 'Unknown',
        avatar: friendship.users.profile_img_url || '/avatars/default.png',
        habits: [] // We'll populate this later
      }));

      // Transform requests data
      const incomingList = incoming.map(request => ({
        id: request.id,
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: request.status,
        created_at: request.created_at,
        name: request.users.full_name || 'Unknown',
        avatar: request.users.profile_img_url || '/avatars/default.png'
      }));

      const sentList = sent.map(request => ({
        id: request.id,
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: request.status,
        created_at: request.created_at,
        name: request.users.full_name || 'Unknown',
        avatar: request.users.profile_img_url || '/avatars/default.png'
      }));

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
