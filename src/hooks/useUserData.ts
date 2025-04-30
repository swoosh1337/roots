
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const hasFetchedRef = useRef(false);

  const fetchUserProfile = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Skip if already fetched and no force refresh requested
    if (hasFetchedRef.current && !forceRefresh) {
      // Skip fetch - profile already loaded
      return;
    }

    try {
      // Fetch user profile
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
      hasFetchedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
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

      // Update local state directly instead of triggering a refetch
      setProfile(prev => prev ? { ...prev, ...updates } : data as UserProfile);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to update profile') };
    }
  }, [user]);

  // Fetch user profile only once when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile(false);
    } else {
      // Reset state when user logs out
      setProfile(null);
      setLoading(false);
      setError(null);
      hasFetchedRef.current = false;
    }
  }, [user, fetchUserProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: () => fetchUserProfile(true), // Allow explicit refresh
  };
};
