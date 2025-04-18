
import { useState, useEffect } from 'react';
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

export const useRituals = () => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRituals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedRituals = await fetchUserRituals(user.id);
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
  };

  const createRitual = async (name: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create rituals.",
        variant: "destructive"
      });
      throw new Error("Authentication required");
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
    if (!user) return;
    
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
    if (!user) return;
    
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
    } catch (err) {
      console.error('Error completing ritual:', err);
      toast({
        title: "Error Completing Ritual",
        description: "There was a problem completing your ritual.",
        variant: "destructive"
      });
    }
  };

  const chainRituals = async (ritualIds: string[]) => {
    if (!user) return;
    
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
    if (user) {
      fetchRituals();
    }
  }, [user]);

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
