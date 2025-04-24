import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Ritual } from '@/types/ritual';
import {
  fetchUserRituals,
  createUserRitual,
  updateUserRitual,
  completeUserRitual,
  chainUserRituals
} from '@/utils/ritualUtils';

export type { Ritual };

export const useRituals = (targetUserId?: string) => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const isOwnRituals = !targetUserId || (user && user.id === targetUserId);

  const fetchRituals = useCallback(async () => {
    const userIdToFetch = targetUserId || user?.id;

    if (!userIdToFetch) {
      setRituals([]);
      setLoading(false);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const fetchedRituals = await fetchUserRituals(userIdToFetch);
      setRituals(fetchedRituals);
    } catch (err) {
      console.error('Error fetching rituals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rituals');
      toast({
        title: "Error Fetching Rituals",
        description: "There was a problem loading your rituals.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId, toast]);

  const createRitual = async (name: string) => {
    if (!isOwnRituals || !user) {
      toast({
        title: "Action Not Allowed",
        description: "You can only create rituals for your own garden.",
        variant: "destructive"
      });
      throw new Error("Action not allowed");
    }
    
    try {
      const newRitual = await createUserRitual(name, user.id);
      setRituals(prev => [newRitual, ...prev]);
      return newRitual;
    } catch (err) {
      console.error('Error creating ritual:', err);
      toast({
        title: "Error Creating Ritual",
        description: "There was a problem creating your ritual.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateRitual = async (id: string, updates: Partial<Ritual>) => {
    if (!isOwnRituals || !user) {
      toast({
        title: "Action Not Allowed",
        description: "You can only update rituals in your own garden.",
        variant: "destructive"
      });
      throw new Error("Action not allowed");
    }
    
    try {
      await updateUserRitual(id, updates, user.id);
      setRituals(prev => 
        prev.map(ritual => 
          ritual.id === id ? { ...ritual, ...updates } : ritual
        )
      );
    } catch (err) {
      console.error('Error updating ritual:', err);
      toast({
        title: "Error Updating Ritual",
        description: "There was a problem updating your ritual.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const completeRitual = async (id: string) => {
    if (!isOwnRituals || !user) {
      toast({
        title: "Action Not Allowed",
        description: "You can only complete rituals in your own garden.",
        variant: "destructive"
      });
      throw new Error("Action not allowed");
    }
    
    try {
      const ritual = rituals.find(r => r.id === id);
      if (!ritual) return;
      
      const update = await completeUserRitual(id, user.id, ritual.streak_count);
      
      setRituals(prev => 
        prev.map(r => 
          r.id === id 
            ? { 
                ...r, 
                streak_count: update.streak_count,
                last_completed: update.last_completed
              } 
            : r
        )
      );
      
      toast({
        title: "Ritual Completed!",
        description: "Your tree is growing stronger each day.",
      });

      return update;
    } catch (err) {
      console.error('Error completing ritual:', err);
      toast({
        title: "Error Completing Ritual",
        description: "There was a problem completing your ritual.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const chainRituals = async (ritualIds: string[]) => {
    if (!isOwnRituals || !user) {
      toast({
        title: "Action Not Allowed",
        description: "You can only chain rituals in your own garden.",
        variant: "destructive"
      });
      throw new Error("Action not allowed");
    }
    
    try {
      await chainUserRituals(ritualIds, user.id);
      
      setRituals(prev => 
        prev.map(ritual => 
          ritualIds.includes(ritual.id) 
            ? { ...ritual, status: 'chained' } 
            : ritual
        )
      );
      
      toast({
        title: "Rituals Chained",
        description: "Your selected rituals are now linked together.",
      });
    } catch (err) {
      console.error('Error chaining rituals:', err);
      toast({
        title: "Error Chaining Rituals",
        description: "There was a problem linking your rituals.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRituals();
  }, [fetchRituals]);

  return {
    rituals,
    loading,
    error,
    fetchRituals,
    createRitual,
    updateRitual,
    completeRitual,
    chainRituals
  };
};
