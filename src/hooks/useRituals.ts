
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Define the Ritual type 
export interface Ritual {
  id: string;
  name: string;
  streak_count: number;
  status: 'active' | 'paused' | 'chained';
  last_completed?: string | null;
}

export const useRituals = () => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch rituals from Supabase
  const fetchRituals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map the database habits to our Ritual interface
      const mappedRituals: Ritual[] = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        streak_count: habit.streak_count,
        status: habit.is_chained ? 'chained' : (habit.is_active ? 'active' : 'paused'),
        last_completed: habit.last_completed
      }));
      
      setRituals(mappedRituals);
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

  // Create a new ritual
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
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name,
          streak_count: 0,
          is_active: true,
          is_chained: false,
          user_id: user.id  // Add user_id to fix the type error
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newRitual: Ritual = {
        id: data.id,
        name: data.name,
        streak_count: data.streak_count,
        status: 'active',
        last_completed: data.last_completed
      };
      
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

  // Update a ritual
  const updateRitual = async (id: string, updates: Partial<Ritual>) => {
    if (!user) return;
    
    try {
      // Convert our Ritual status to the database format
      const dbUpdates: Record<string, any> = {};
      
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.streak_count !== undefined) dbUpdates.streak_count = updates.streak_count;
      
      if (updates.status !== undefined) {
        dbUpdates.is_active = updates.status === 'active';
        dbUpdates.is_chained = updates.status === 'chained';
      }
      
      const { error } = await supabase
        .from('habits')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
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

  // Complete a ritual (increment streak and update last_completed)
  const completeRitual = async (id: string) => {
    if (!user) return;
    
    try {
      // Find current ritual to get streak count
      const ritual = rituals.find(r => r.id === id);
      if (!ritual) return;
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { error } = await supabase
        .from('habits')
        .update({
          streak_count: ritual.streak_count + 1,
          last_completed: today
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setRituals(prev => 
        prev.map(r => 
          r.id === id 
            ? { 
                ...r, 
                streak_count: r.streak_count + 1,
                last_completed: today
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

  // Chain rituals
  const chainRituals = async (ritualIds: string[]) => {
    if (!user) return;
    
    try {
      // Update all specified rituals to be chained
      const { error } = await supabase
        .from('habits')
        .update({ is_chained: true })
        .in('id', ritualIds)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
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

  // Load rituals on initial mount or when user changes
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
