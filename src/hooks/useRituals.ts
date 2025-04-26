import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRitualState } from '@/hooks/useRitualState';
import type { Ritual } from '@/types/ritual';
import {
  fetchUserRituals,
  createUserRitual,
  updateUserRitual,
  completeUserRitual,
  chainUserRituals,
  deleteUserRitual
} from '@/utils/ritualOperations';

export type { Ritual };

export const useRituals = (targetUserId?: string) => {
  const { user } = useAuth();
  const {
    rituals,
    loading,
    error,
    setLoading,
    updateRituals,
    addRitual,
    updateRitual,
    showError
  } = useRitualState();
  const [hasFetched, setHasFetched] = useState(false);

  // Check if we're viewing our own rituals or someone else's
  const isOwnRituals = !targetUserId || (user && user.id === targetUserId);

  // Memoize the fetchRituals function to prevent recreations
  const fetchRituals = useCallback(async (forceRefresh = false) => {
    const userIdToFetch = targetUserId || user?.id;
    console.log(`fetchRituals called with userIdToFetch: ${userIdToFetch}, forceRefresh: ${forceRefresh}`);

    // If we've already fetched and no force refresh is requested, don't fetch again
    if (hasFetched && !forceRefresh) {
      console.log('Skipping fetch - already loaded rituals');
      return;
    }

    if (!userIdToFetch) {
      console.log('No userId to fetch, setting empty rituals array');
      updateRituals([]);
      setLoading(false);
      showError(null);
      return;
    }

    try {
      console.log(`Fetching rituals for user ID: ${userIdToFetch}`);
      setLoading(true);
      showError(null);
      const fetchedRituals = await fetchUserRituals(userIdToFetch);
      console.log(`Fetched ${fetchedRituals.length} rituals:`, fetchedRituals);
      updateRituals(fetchedRituals);
      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching rituals:', err);
      showError(err instanceof Error ? err.message : 'Failed to fetch rituals');
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId, setLoading, updateRituals, showError, hasFetched]);

  const createRitual = useCallback(async (name: string) => {
    if (!isOwnRituals || !user) {
      showError("Cannot create ritual: Not own garden or no user");
      return;
    }

    try {
      const newRitual = await createUserRitual(name, user.id);
      addRitual(newRitual);
      return newRitual;
    } catch (err) {
      showError("There was a problem creating your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, addRitual, showError]);

  const handleUpdateRitual = useCallback(async (id: string, updates: Partial<Ritual>) => {
    if (!isOwnRituals || !user) {
      showError("Cannot update ritual: Not own garden or no user");
      return;
    }

    try {
      await updateUserRitual(id, updates, user.id);
      updateRitual(id, updates);
    } catch (err) {
      showError("There was a problem updating your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, updateRitual, showError]);

  const handleCompleteRitual = useCallback(async (id: string) => {
    if (!isOwnRituals || !user) {
      showError("Cannot complete ritual: Not own garden or no user");
      return;
    }

    try {
      const ritual = rituals.find(r => r.id === id);
      if (!ritual) return;

      const update = await completeUserRitual(id, user.id, ritual.streak_count);
      updateRitual(id, update);
      return update;
    } catch (err) {
      showError("There was a problem completing your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, rituals, updateRitual, showError]);

  const handleChainRituals = useCallback(async (ritualIds: string[]) => {
    if (!isOwnRituals || !user) {
      showError("Cannot chain rituals: Not own garden or no user");
      return;
    }

    try {
      await chainUserRituals(ritualIds, user.id);
      ritualIds.forEach(id => {
        updateRitual(id, { status: 'chained' });
      });
    } catch (err) {
      showError("There was a problem linking your rituals.");
      throw err;
    }
  }, [isOwnRituals, user, updateRitual, showError]);

  const handleDeleteRitual = useCallback(async (id: string) => {
    if (!isOwnRituals || !user) {
      showError("Cannot delete ritual: Not own garden or no user");
      return;
    }

    try {
      await deleteUserRitual(id, user.id);
      // Remove from local state
      const updatedRituals = rituals.filter(r => r.id !== id);
      updateRituals(updatedRituals);
    } catch (err) {
      showError("There was a problem deleting your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, rituals, updateRituals, showError]);

  // Fetch initial data only once when user or targetUserId changes
  useEffect(() => {
    console.log('useRituals effect running, checking if fetch is needed...');
    fetchRituals(false); // Don't force refresh on initial mount
  }, [fetchRituals]);

  return {
    rituals,
    loading,
    error,
    fetchRituals: (forceRefresh = true) => fetchRituals(forceRefresh), // Allow forcing refresh when explicitly called
    createRitual: isOwnRituals ? createRitual : undefined,
    updateRitual: isOwnRituals ? handleUpdateRitual : undefined,
    completeRitual: isOwnRituals ? handleCompleteRitual : undefined,
    chainRituals: isOwnRituals ? handleChainRituals : undefined,
    deleteRitual: isOwnRituals ? handleDeleteRitual : undefined,
  };
};
