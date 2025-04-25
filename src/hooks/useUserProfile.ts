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
      console.error('Error checking for existing user:', checkError);
      return;
    }

    // If user doesn't exist, create a new record
    if (!existingUser) {
      console.log(`Creating new user record for ${userId}`);
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating user record:', insertError);
      } else {
        console.log(`User record created for ${userId}`);
      }
    } else {
      console.log(`User record already exists for ${userId}`);
    }
  } catch (error) {
    console.error('Exception in ensureUserRecord:', error);
  }
};
