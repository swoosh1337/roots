import { supabase } from '@/integrations/supabase/client';
import type { Ritual } from '@/types/ritual';

// Define a type for the habit data from the database
interface HabitData {
  id: string;
  name: string;
  streak_count: number;
  is_active: boolean;
  is_chained: boolean;
  last_completed: string | null;
  user_id: string;
  created_at: string;
  last_completed_timestamp?: string; // Optional timestamp field
  [key: string]: unknown; // For any other fields
}

// Fetch rituals from Supabase
export const fetchUserRituals = async (userId: string): Promise<Ritual[]> => {
  console.log(`fetchUserRituals called for userId: ${userId}`);

  try {
    // Skip checking if user exists as this might be causing permission issues for friend's gardens
    // Just try to fetch habits directly - if the user doesn't exist, we'll get an empty array
    
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching rituals for user ${userId}:`, error);
      throw error;
    }

    console.log(`Retrieved ${data?.length ?? 0} rituals for user ${userId}`);

    // Handle case where data is null or undefined
    if (!data || data.length === 0) {
      console.log(`No rituals found for user ${userId}, returning empty array`);
      return [];
    }

    // Map the database habits to our Ritual interface with proper status type checking
    return data.map((habit: HabitData) => {
      // Determine status based on flags
      let status: 'active' | 'paused' | 'chained';
      if (habit.is_chained) {
        status = 'chained';
      } else if (habit.is_active) {
        status = 'active';
      } else {
        status = 'paused';
      }

      return {
        id: habit.id,
        name: habit.name,
        streak_count: habit.streak_count ?? 0,
        status: status,
        last_completed: habit.last_completed
      } as Ritual;
    });
  } catch (err) {
    console.error(`Exception in fetchUserRituals for user ${userId}:`, err);
    return []; // Return empty array on error to avoid breaking the UI
  }
};

// Create a new ritual
export const createUserRitual = async (name: string, userId: string): Promise<Ritual> => {
  try {
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

    if (!data) {
      throw new Error("No data returned after creating ritual");
    }

    return {
      id: data.id,
      name: data.name,
      streak_count: data.streak_count ?? 0,
      status: 'active',
      last_completed: data.last_completed
    } as Ritual;
  } catch (err) {
    console.error('Error creating ritual:', err);
    throw err;
  }
};

// Update ritual
export const updateUserRitual = async (
  id: string,
  updates: Partial<Ritual>,
  userId: string
): Promise<void> => {
  try {
    const dbUpdates: Record<string, unknown> = {};

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
  } catch (err) {
    console.error('Error updating ritual:', err);
    throw err;
  }
};

// Complete ritual - Enhanced with better date handling
export const completeUserRitual = async (
  id: string,
  userId: string,
  currentStreak: number
): Promise<{ streak_count: number, last_completed: string }> => {
  try {
    console.log('Attempting to complete ritual:', { id, userId, currentStreak });

    // Use the user's local date (YYYY-MM-DD) to avoid timezone issues
    const today = new Date();
    const todayLocalStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local time

    // Also store the full ISO timestamp for potential future analytics
    const fullTimestamp = today.toISOString();

    console.log('Update values:', {
      streak_count: currentStreak + 1,
      last_completed: todayLocalStr,
      fullTimestamp,
    });

    // First check if last_completed_timestamp column exists
    const { data: columnsData, error: columnsError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (columnsError) {
      console.error('Error fetching habit before update:', columnsError);
      throw columnsError;
    }

    console.log('Current habit data:', columnsData);

    // Prepare update object based on available columns
    const updateObject: Record<string, unknown> = {
      streak_count: currentStreak + 1,
      last_completed: todayLocalStr
    };

    // Only add last_completed_timestamp if the column exists in the database
    if (columnsData && 'last_completed_timestamp' in columnsData) {
      updateObject['last_completed_timestamp'] = fullTimestamp;
    }

    console.log('Final update object:', updateObject);

    const { error } = await supabase
      .from('habits')
      .update(updateObject)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating habit:', error);
      throw error;
    }

    console.log('Ritual completed successfully with streak:', currentStreak + 1);

    return {
      streak_count: currentStreak + 1,
      last_completed: todayLocalStr
    };
  } catch (err) {
    console.error('Error completing ritual:', err);
    throw err;
  }
};

// Chain rituals
export const chainUserRituals = async (ritualIds: string[], userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('habits')
      .update({ is_chained: true })
      .in('id', ritualIds)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error chaining rituals:', err);
    throw err;
  }
};
