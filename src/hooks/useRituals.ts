
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRitualState } from '@/hooks/useRitualState';
import type { Ritual } from '@/types/ritual';
import {
  fetchUserRituals,
  createUserRitual,
  updateUserRitual,
  completeUserRitual,
  chainUserRituals
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

  // Check if we're viewing our own rituals or someone else's
  const isOwnRituals = !targetUserId || (user && user.id === targetUserId);

  const fetchRituals = useCallback(async () => {
    const userIdToFetch = targetUserId || user?.id;
    console.log(`fetchRituals called with userIdToFetch: ${userIdToFetch}`);

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
    } catch (err) {
      console.error('Error fetching rituals:', err);
      showError(err instanceof Error ? err.message : 'Failed to fetch rituals');
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId, setLoading, updateRituals, showError]);

  const createRitual = async (name: string) => {
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
  };

  const handleUpdateRitual = async (id: string, updates: Partial<Ritual>) => {
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
  };

  const handleCompleteRitual = async (id: string) => {
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
  };

  const handleChainRituals = async (ritualIds: string[]) => {
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
  };

  // Fetch initial data and set up effect to refetch when user or targetUserId changes
  useEffect(() => {
    console.log('useRituals effect running, fetching rituals...');
    fetchRituals();
  }, [fetchRituals]);

  return {
    rituals,
    loading,
    error,
    fetchRituals,
    createRitual: isOwnRituals ? createRitual : undefined,
    updateRitual: isOwnRituals ? handleUpdateRitual : undefined,
    completeRitual: isOwnRituals ? handleCompleteRitual : undefined,
    chainRituals: isOwnRituals ? handleChainRituals : undefined,
  };
};
