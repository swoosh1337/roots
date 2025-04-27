import { Ritual, RitualStatus } from '@/types/ritual';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Fetch rituals from Supabase
export const fetchUserRituals = async (userId: string): Promise<Ritual[]> => {
  console.log(`fetchUserRituals called for userId: ${userId}`);

  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*') // Select all columns explicitly includes chain_id if it exists
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

    return data.map((habit: any) => { // Use any temporarily if types mismatch
      let status: RitualStatus;
      if (habit.is_chained) {
        status = 'chained';
      } else if (habit.is_active) {
        status = 'active';
      } else {
        status = 'paused';
      }

      return {
        id: habit.id,
        user_id: habit.user_id,
        name: habit.name,
        created_at: habit.created_at,
        streak_count: habit.streak_count ?? 0,
        status: status,
        last_completed: habit.last_completed,
        is_active: habit.is_active,
        is_chained: habit.is_chained,
        chain_id: habit.chain_id ?? null // Access chain_id
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

const mapStatusToDb = (status: RitualStatus): { is_active: boolean; is_chained: boolean } => {
  return {
    is_active: status === 'active',
    is_chained: status === 'chained',
  };
};

export const updateUserRitual = async (
  id: string,
  updates: Partial<Ritual>,
  userId: string
): Promise<void> => {
  try {
    let chainToBreak: string | null = null;

    if (updates.status && updates.status !== 'chained') {
      // Fetch the current state to check old status and chain_id
      const { data: currentHabitData, error: fetchError } = await supabase
        .from('habits')
        .select('is_chained, chain_id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      // Explicitly cast if necessary, or ideally rely on generated types
      const currentHabit = currentHabitData as { is_chained: boolean; chain_id: string | null } | null;

      if (fetchError) {
        console.error('Error fetching current habit state before update:', fetchError);
        throw fetchError;
      }

      if (currentHabit && currentHabit.is_chained && currentHabit.chain_id) {
        // If it was chained and had a chain_id, we need to break the chain
        chainToBreak = currentHabit.chain_id;
      }
    }

    if (chainToBreak) {
      console.log(`Breaking chain for chain_id: ${chainToBreak}`);
      const { error: breakChainError } = await supabase
        .from('habits')
        .update({ 
            is_chained: false, 
            is_active: true, 
            chain_id: null 
        })
        .eq('chain_id', chainToBreak)
        .eq('user_id', userId);

      if (breakChainError) {
        console.error('Error breaking chain:', breakChainError);
        throw breakChainError; 
      }
    }

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.status !== undefined) {
      const statusBooleans = mapStatusToDb(updates.status);
      dbUpdates.is_active = statusBooleans.is_active;
      dbUpdates.is_chained = statusBooleans.is_chained;
      if (updates.status !== 'chained') {
        dbUpdates.chain_id = null;
      }
    }

    const { error: updateError } = await supabase
      .from('habits')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId);

    if (updateError) throw updateError;

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
    const newChainId = uuidv4(); 
    console.log(`Chaining rituals ${ritualIds.join(', ')} with chain_id: ${newChainId}`);

    const { error } = await supabase
      .from('habits')
      .update({ 
          is_chained: true, 
          is_active: false, 
          chain_id: newChainId 
       })
      .in('id', ritualIds)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error chaining rituals:', err);
    throw err;
  }
};

export const deleteUserRitual = async (id: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting ritual:', err);
    throw err;
  }
};
