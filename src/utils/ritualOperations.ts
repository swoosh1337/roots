import { Ritual, RitualStatus } from '@/types/ritual';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { startOfWeek, endOfWeek, subWeeks, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';

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
    console.log(`createUserRitual called for name: ${name}, userId: ${userId}`);
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

    // First, get the habit we're completing to check if it's chained
    const { data: habitData, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (habitError) {
      console.error('Error fetching habit before update:', habitError);
      throw habitError;
    }

    // Set completion for this habit
    const updateObject: Record<string, unknown> = {
      last_completed: todayLocalStr
    };

    if (habitData && 'last_completed_timestamp' in habitData) {
      updateObject['last_completed_timestamp'] = fullTimestamp;
    }

    // Update this individual habit's completion status
    const { error: updateError } = await supabase
      .from('habits')
      .update(updateObject)
      .eq('id', id)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating habit completion:', updateError);
      throw updateError;
    }

    // Now handle streak logic
    let newStreak = currentStreak + 1; // Default streak increase
    let shouldUpdateStreak = true;

    // If this habit is part of a chain, check if all habits in the chain are completed today
    if (habitData && habitData.chain_id) {
      // Find all habits in this chain
      const { data: chainedHabits, error: chainError } = await supabase
        .from('habits')
        .select('id, last_completed')
        .eq('chain_id', habitData.chain_id)
        .eq('user_id', userId);

      if (chainError) {
        console.error('Error fetching chained habits:', chainError);
        throw chainError;
      }

      // Check if all habits in the chain are completed today
      const allCompletedToday = chainedHabits.every(
        habit => habit.last_completed === todayLocalStr
      );

      if (!allCompletedToday) {
        // Not all habits in chain completed today, don't update streak yet
        shouldUpdateStreak = false;
        console.log('Chain not fully completed today - not updating streaks');
      } else {
        // All habits in chain completed today, update all their streaks
        console.log('All habits in chain completed today - updating all streaks');
        
        // Batch update all streaks in this chain
        const { error: chainUpdateError } = await supabase
          .from('habits')
          .update({ streak_count: supabase.rpc('increment', { x: 1 }) })
          .eq('chain_id', habitData.chain_id)
          .eq('user_id', userId);

        if (chainUpdateError) {
          console.error('Error updating chained habits streaks:', chainUpdateError);
          throw chainUpdateError;
        }
      }
    } else if (shouldUpdateStreak) {
      // This is a standalone habit, update its streak
      const { error: streakError } = await supabase
        .from('habits')
        .update({ streak_count: newStreak })
        .eq('id', id)
        .eq('user_id', userId);

      if (streakError) {
        console.error('Error updating habit streak:', streakError);
        throw streakError;
      }
    }

    // If we're in a chain and not all habits are completed, don't increase the streak in the UI
    return {
      streak_count: shouldUpdateStreak ? newStreak : currentStreak,
      last_completed: todayLocalStr
    };
  } catch (err) {
    console.error('Error completing ritual:', err);
    throw err;
  }
};

export const chainUserRituals = async (ritualIds: string[], userId: string): Promise<void> => {
  console.log(`chainUserRituals called for IDs: ${ritualIds.join(', ')}, userId: ${userId}`);
  try {
    const newChainId = uuidv4(); // Generate a unique ID for the chain
    const { error } = await supabase
      .from('habits')
      .update({ 
          is_chained: true, 
          is_active: false, // Chained rituals might not be 'active' in the same way?
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
  console.log(`deleteUserRitual called for ID: ${id}, userId: ${userId}`);
  try {
    // Find if this ritual is part of a chain before deleting
    const { data: ritual, error: fetchError } = await supabase
      .from('habits')
      .select('id, is_chained, chain_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching habit before deletion:', fetchError);
      throw fetchError;
    }

    // If this ritual is part of a chain, we need special handling
    if (ritual && ritual.chain_id) {
      const chainId = ritual.chain_id;

      // Count how many habits are in this chain
      // Use the correct count approach to get the total number
      const { data, count, error: countError } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .eq('chain_id', chainId)
        .eq('user_id', userId);

      if (countError) {
        console.error('Error counting habits in chain:', countError);
        throw countError;
      }

      // Make sure we're using the count number returned from Supabase
      const totalInChain = count ?? 0;
      
      // If there are exactly 2 habits in the chain (including the one being deleted)
      // We need to unchain the remaining habit
      if (totalInChain === 2) {
        console.log('Chain will have only 1 habit after deletion - breaking chain');
        
        // Get the ID of the other habit in the chain
        const { data: otherHabit, error: otherError } = await supabase
          .from('habits')
          .select('id')
          .eq('chain_id', chainId)
          .neq('id', id)
          .eq('user_id', userId)
          .single();
          
        if (otherError) {
          console.error('Error finding other habit in chain:', otherError);
          throw otherError;
        }

        if (otherHabit) {
          // Unchain the other habit
          const { error: unchainError } = await supabase
            .from('habits')
            .update({
              is_chained: false,
              is_active: true,
              chain_id: null
            })
            .eq('id', otherHabit.id)
            .eq('user_id', userId);

          if (unchainError) {
            console.error('Error unchaining remaining habit:', unchainError);
            throw unchainError;
          }
        }
      }
      // For chains with 3 habits, we keep the chain for the remaining 2 habits
      // No action needed as we're just deleting the one habit
    }

    // Now delete the habit
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

// Function to get user's activity for the current and previous week
export const getUserRecentActivity = async (userId: string): Promise<{ currentWeekActivity: boolean[], lastWeekActivity: boolean[] }> => {
  console.log(`getUserRecentActivity called for userId: ${userId}`);
  const today = new Date();
  // Get Sunday of the current week and Saturday of the current week
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 0 });   // Saturday

  // Get Sunday of the previous week
  const startOfLastWeek = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 }); // Sunday of last week

  // Format dates for Supabase query (inclusive range for 14 days)
  const startDateStr = format(startOfLastWeek, 'yyyy-MM-dd');
  const endDateStr = format(endOfCurrentWeek, 'yyyy-MM-dd');

  console.log(`Fetching activity for user ${userId} from ${startDateStr} to ${endDateStr}`);

  // Query habits completed within the last two weeks
  const { data, error } = await supabase
    .from('habits')
    .select('last_completed')
    .eq('user_id', userId)
    .gte('last_completed', startDateStr)
    .lte('last_completed', endDateStr);

  if (error) {
    console.error('Error fetching recent habit completions:', error);
    // Return empty arrays on error
    return { currentWeekActivity: Array(7).fill(false), lastWeekActivity: Array(7).fill(false) };
  }

  // Get unique completion dates (YYYY-MM-DD strings)
  const completionDates = new Set(
    data
      .map(h => h.last_completed)
      .filter((date): date is string => date !== null) // Filter out nulls and ensure type is string
  );

  console.log('Unique completion dates found:', Array.from(completionDates));

  // Generate date ranges for both weeks
  const currentWeekInterval = { start: startOfCurrentWeek, end: endOfCurrentWeek };
  const lastWeekInterval = { start: startOfLastWeek, end: endOfWeek(startOfLastWeek, { weekStartsOn: 0 }) };

  const currentWeekDays = eachDayOfInterval(currentWeekInterval);
  const lastWeekDays = eachDayOfInterval(lastWeekInterval);

  // Map completion dates to boolean arrays for each week
  const mapDatesToActivity = (days: Date[], datesSet: Set<string>): boolean[] => {
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      // Check if ANY habit was completed on this day
      return datesSet.has(dayStr);
    });
  };

  const currentWeekActivity = mapDatesToActivity(currentWeekDays, completionDates);
  const lastWeekActivity = mapDatesToActivity(lastWeekDays, completionDates);

  console.log('Processed Current Week Activity:', currentWeekActivity);
  console.log('Processed Last Week Activity:', lastWeekActivity);


  // Ensure arrays always have 7 elements (shouldn't be necessary with date-fns but safe)
  while (currentWeekActivity.length < 7) currentWeekActivity.push(false);
  while (lastWeekActivity.length < 7) lastWeekActivity.push(false);

  return {
      currentWeekActivity: currentWeekActivity.slice(0, 7),
      lastWeekActivity: lastWeekActivity.slice(0, 7)
  };
};
