
import { Ritual } from '@/types/ritual';
import { supabase } from '@/integrations/supabase/client';

// Fetch rituals from Supabase
export const fetchUserRituals = async (userId: string): Promise<Ritual[]> => {
  console.log(`fetchUserRituals called for userId: ${userId}`);

  try {
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

    if (!data || data.length === 0) {
      console.log(`No rituals found for user ${userId}, returning empty array`);
      return [];
    }

    return data.map((habit) => {
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
      };
    });
  } catch (err) {
    console.error(`Exception in fetchUserRituals for user ${userId}:`, err);
    return [];
  }
};

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
    };
  } catch (err) {
    console.error('Error creating ritual:', err);
    throw err;
  }
};

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

export const completeUserRitual = async (
  id: string,
  userId: string,
  currentStreak: number
): Promise<{ streak_count: number; last_completed: string }> => {
  try {
    const today = new Date();
    const todayLocalStr = today.toLocaleDateString('en-CA');
    const fullTimestamp = today.toISOString();

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

    const updateObject: Record<string, unknown> = {
      streak_count: currentStreak + 1,
      last_completed: todayLocalStr
    };

    if (columnsData && 'last_completed_timestamp' in columnsData) {
      updateObject['last_completed_timestamp'] = fullTimestamp;
    }

    const { error } = await supabase
      .from('habits')
      .update(updateObject)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating habit:', error);
      throw error;
    }

    return {
      streak_count: currentStreak + 1,
      last_completed: todayLocalStr
    };
  } catch (err) {
    console.error('Error completing ritual:', err);
    throw err;
  }
};

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
