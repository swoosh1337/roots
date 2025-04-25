import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  profile_img_url: string | null;
  created_at: string;
}

/**
 * Hook to fetch and manage user profile data
 * This is separate from authentication to keep concerns separated
 */
export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data as UserProfile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No authenticated user') };

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as UserProfile);
      return { data, error: null };
    } catch (err) {
      console.error('Error updating user profile:', err);
      return { data: null, error: err instanceof Error ? err : new Error('Failed to update profile') };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};
