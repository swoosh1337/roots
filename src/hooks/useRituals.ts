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
    // console.log(`Executing fetchRituals: forceRefresh=${forceRefresh}, userId=${userIdToFetch}, hasFetched=${hasFetched}`); // Keep commented out for future debug if needed

    // Prevent refetch if already fetched and not forcing
    if (hasFetched && !forceRefresh) {
      // console.log("fetchRituals: Already fetched and not forcing refresh. Skipping.");
      return;
    }

    if (!userIdToFetch) {
      // console.log('fetchRituals: No userId, returning.');
      return;
    }

    try {
      // console.log('fetchRituals: Setting loading true.');
      setLoading(true);
      // console.log('fetchRituals: Calling fetchUserRituals...');
      const fetchedRituals = await fetchUserRituals(userIdToFetch);
      // console.log('fetchRituals: fetchUserRituals completed, updating state.');
      updateRituals(fetchedRituals);
      setHasFetched(true); // Set fetched flag *after* successful fetch and update
      showError(null); // Clear any previous errors
    } catch (err: unknown) {
      console.error('fetchRituals: Error occurred.', err);
      showError('Failed to load rituals.');
      // Consider if hasFetched should be reset on error
    } finally {
      // console.log('fetchRituals: Setting loading false.');
      setLoading(false);
    }
  }, [user?.id, targetUserId, hasFetched, updateRituals, setLoading, showError, setHasFetched]); // Add hasFetched dependency

  const createRitual = useCallback(async (name: string) => {
    if (!isOwnRituals || !user) {
      showError("Cannot create ritual: Not own garden or no user");
      return;
    }

    try {
      const newRitual = await createUserRitual(name, user.id);
      addRitual(newRitual);
      fetchRituals(true); // Force refresh after successful creation
      return newRitual;
    } catch (err) {
      showError("There was a problem creating your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, addRitual, showError, fetchRituals]);

  const handleUpdateRitual = useCallback(async (id: string, updates: Partial<Ritual>) => {
    if (!isOwnRituals || !user) {
      showError("Cannot update ritual: Not own garden or no user");
      return;
    }

    try {
      await updateUserRitual(id, updates, user.id);
      updateRitual(id, updates);
      fetchRituals(true); // Force refresh after successful update
    } catch (err) {
      showError("There was a problem updating your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, updateRitual, showError, fetchRituals]);

  const handleCompleteRitual = useCallback(async (id: string) => {
    if (!isOwnRituals || !user) {
      showError("Cannot complete ritual: Not own garden or no user");
      return;
    }

    try {
      const ritual = rituals.find(r => r.id === id);
      if (!ritual) return;

      // Call the updated complete handler which handles chain logic
      const update = await completeUserRitual(id, user.id, ritual.streak_count);
      updateRitual(id, update);
      
      // If this ritual is part of a chain and all rituals in the chain are completed,
      // we need to refresh all rituals in the chain to update their streaks
      if (ritual.chain_id) {
        const chainId = ritual.chain_id;
        // Check if this update changed the streak (meaning all chain rituals were completed)
        if (update.streak_count > ritual.streak_count) {
          // Update all rituals in the chain
          rituals
            .filter(r => r.chain_id === chainId)
            .forEach(r => {
              if (r.id !== id) { // Skip the one we already updated
                updateRitual(r.id, { 
                  streak_count: r.streak_count + 1,
                  last_completed: update.last_completed 
                });
              }
            });
        }
      }
      
      fetchRituals(true); // Force refresh after successful completion and local updates
      return update;
    } catch (err) {
      showError("There was a problem completing your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, rituals, updateRitual, showError, fetchRituals]);

  const handleChainRituals = useCallback(async (ritualIds: string[]) => {
    if (!isOwnRituals || !user) {
      showError("Cannot chain rituals: Not own garden or no user");
      return;
    }

    try {
      await chainUserRituals(ritualIds, user.id);
      // Update local state for all rituals in the chain
      const newChainId = ritualIds[0]; // Use first ritual ID as reference
      ritualIds.forEach(id => {
        updateRitual(id, { 
          status: 'chained', 
          chain_id: newChainId 
        });
      });
      fetchRituals(true); // Force refresh after successful chaining
    } catch (err) {
      showError("There was a problem linking your rituals.");
      throw err;
    }
  }, [isOwnRituals, user, updateRitual, showError, fetchRituals]);

  const handleDeleteRitual = useCallback(async (id: string) => {
    if (!isOwnRituals || !user) {
      showError("Cannot delete ritual: Not own garden or no user");
      return;
    }

    try {
      // Find if this ritual is part of a chain before deleting
      const ritual = rituals.find(r => r.id === id);
      if (!ritual) return;
      
      const chainId = ritual.chain_id;
      const chainsInRituals = chainId ? rituals.filter(r => r.chain_id === chainId) : [];
      const chainSize = chainsInRituals.length;
      
      // Now delete the ritual
      await deleteUserRitual(id, user.id);
      
      // Handle remaining chain members in the UI
      if (chainId && chainSize === 2) {
        // If this was a chain of 2, we need to unchain the other ritual
        const otherRitual = chainsInRituals.find(r => r.id !== id);
        if (otherRitual) {
          updateRitual(otherRitual.id, { 
            status: 'active',
            chain_id: null 
          });
        }
      }
      
      // Remove from local state
      const updatedRituals = rituals.filter(r => r.id !== id);
      updateRituals(updatedRituals);
      fetchRituals(true); // Force refresh after successful deletion and local updates
    } catch (err) {
      showError("There was a problem deleting your ritual.");
      throw err;
    }
  }, [isOwnRituals, user, rituals, updateRituals, updateRitual, showError, fetchRituals]);

  // Effect to fetch initial data or when user/targetUser changes
  useEffect(() => {
    const userIdToFetch = targetUserId || user?.id;
    // console.log(`Effect run: userId=${userIdToFetch}`);
    if (userIdToFetch) {
      // console.log("Effect condition met (userId exists): Calling fetchRituals(false)...");
      fetchRituals(false); // Let fetchRituals handle the 'hasFetched' check
    } else {
      // console.log("Effect: No user ID, resetting state.");
      // If no user/target user, reset state (important for logout)
      updateRituals([]);
      setLoading(false);
      showError(null);
      setHasFetched(false); // Reset fetched status on logout/no user
    }
  }, [user?.id, targetUserId, fetchRituals, updateRituals, setLoading, showError, setHasFetched]); // Include setHasFetched for reset

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
