
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Function to fetch user profile from DB
export const fetchUserProfile = async (userId: string, authUser: User | null) => {
  console.log(`[fetchUserProfile] Attempting to fetch profile for user ID: ${userId}`);
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors

    console.log(`[fetchUserProfile] Query result for ${userId}: Data:`, data, `Error:`, error);

    if (error) { 
      console.error(`[fetchUserProfile] Error fetching profile for ${userId}:`, error);
      toast({ title: 'Error Fetching Profile', description: error.message, variant: 'destructive' });
      return null;
    }
    
    const userProfile: UserProfile = data ? { ...data, user_metadata: authUser?.user_metadata } : null;
    console.log(`[fetchUserProfile] Profile for ${userId}:`, userProfile);
    return userProfile;

  } catch (catchError) {
    console.error(`[fetchUserProfile] CATCH block error for ${userId}:`, catchError);
    toast({ title: 'Error Fetching Profile', description: (catchError as Error).message, variant: 'destructive' });
    return null;
  }
};

// Sign out functionality
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully 🌿",
    });
    return;
  }
  console.error("Error logging out:", error);
  toast({
    title: "Logout Error",
    description: "Failed to log out. Please try again.",
    variant: "destructive",
  });
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { }
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    toast({
      title: "Google Sign-In Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>, userMetadata: Record<string, unknown> | undefined) => {
  console.log(`[updateUserProfile] Attempting to update profile for ${userId} with:`, updates);

  const dbUpdates = { ...updates };
  delete dbUpdates.user_metadata;
  delete dbUpdates.created_at;

  try {
    console.log(`[updateUserProfile] Calling Supabase update for ${userId}...`);
    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();
    
    console.log(`[updateUserProfile] Supabase update result for ${userId}: Data:`, data, `Error:`, error);

    if (error) {
      console.error('[updateUserProfile] Error updating profile:', error);
      toast({ title: 'Profile Update Error', description: error.message, variant: 'destructive' });
      throw error; 
    }

    if (data) {
      const updatedProfile: UserProfile = { ...data, user_metadata: userMetadata };
      console.log(`[updateUserProfile] Updated profile for ${userId}:`, updatedProfile);
      toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully. 🌿' });
      return updatedProfile;
    }
    return null;
  } catch (catchError) {
    console.error('[updateUserProfile] CATCH block error:', catchError);
    throw catchError; 
  }
};
