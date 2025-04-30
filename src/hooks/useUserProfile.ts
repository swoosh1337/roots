import { supabase } from '@/integrations/supabase/client';

/**
 * Creates or ensures a user record exists in the database
 * This is separated from the auth hook to keep authentication concerns separate
 * from user profile management
 */
export const ensureUserRecord = async (userId: string, email: string): Promise<void> => {
  try {
    // Check if user exists in our users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means not found, which is expected if user doesn't exist yet
      return;
    }

    // If user doesn't exist, create a new record
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          created_at: new Date().toISOString()
        });

    }
  } catch (error) {
    console.error('Error ensuring user record:', error);
  }
};
