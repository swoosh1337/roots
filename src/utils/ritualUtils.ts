import { supabase } from '@/integrations/supabase/client';
import type { Ritual } from '@/types/ritual';

// Fetch rituals from Supabase
export const fetchUserRituals = async (userId: string): Promise<Ritual[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map the database habits to our Ritual interface with proper status type checking
  return data.map(habit => ({
    id: habit.id,
    name: habit.name,
    streak_count: habit.streak_count,
    status: habit.is_chained ? 'chained' : (habit.is_active ? 'active' : 'paused'),
    last_completed: habit.last_completed
  } as Ritual)); // Add explicit type assertion to ensure it matches the Ritual interface
};

// Create a new ritual
export const createUserRitual = async (name: string, userId: string) => {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      name,
      streak_count: 0,
      is_active: true,
      is_chained: false,
      user_id: userId
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    streak_count: data.streak_count,
    status: 'active',
    last_completed: data.last_completed
  } as Ritual;
};

// Update ritual
export const updateUserRitual = async (
  id: string, 
  updates: Partial<Ritual>, 
  userId: string
) => {
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
    .eq('user_id', userId);
  
  if (error) throw error;
};

// Complete ritual
export const completeUserRitual = async (id: string, userId: string, currentStreak: number) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const { error } = await supabase
    .from('habits')
    .update({
      streak_count: currentStreak + 1,
      last_completed: today
    })
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) throw error;
  
  return {
    streak_count: currentStreak + 1,
    last_completed: today
  };
};

// Chain rituals
export const chainUserRituals = async (ritualIds: string[], userId: string) => {
  const { error } = await supabase
    .from('habits')
    .update({ is_chained: true })
    .in('id', ritualIds)
    .eq('user_id', userId);
  
  if (error) throw error;
};
