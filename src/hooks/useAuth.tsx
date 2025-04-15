
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types'; // Import generated types

// Define a type for our merged user profile data
export type UserProfile = Database['public']['Tables']['users']['Row'] & {
  // Use Record<string, unknown> instead of any
  user_metadata?: Record<string, unknown>; 
};

interface AuthContextType {
  session: Session | null;
  user: User | null; // Supabase Auth user
  profile: UserProfile | null; // Our custom user profile from DB + potentially metadata
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>; // Function to update profile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null); // Raw Supabase auth user
  const [profile, setProfile] = useState<UserProfile | null>(null); // User profile from DB
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile from DB
  const fetchUserProfile = async (userId: string, authUser: User | null) => {
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
        setProfile(null); 
        return null;
      }
      
      const userProfile: UserProfile = data ? { ...data, user_metadata: authUser?.user_metadata } : null;
      console.log(`[fetchUserProfile] Setting profile state for ${userId}:`, userProfile);
      setProfile(userProfile);
      return userProfile;

    } catch (catchError) {
      console.error(`[fetchUserProfile] CATCH block error for ${userId}:`, catchError);
      toast({ title: 'Error Fetching Profile', description: (catchError as Error).message, variant: 'destructive' });
      setProfile(null); 
      return null;
    }
  };

  useEffect(() => {
    let ignore = false;
    console.log("[Auth Effect] Starting effect...");
    setLoading(true);

    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log(`[Auth Effect] onAuthStateChange triggered. Event: ${event}, Session:`, currentSession?.user?.id);
        if (ignore) return;
        
        const currentUser = currentSession?.user ?? null;
        console.log(`[Auth Effect] State Change: Event: ${event}, User: ${currentUser?.id}`);
        
        // Always update session and user state immediately
        setSession(currentSession);
        setUser(currentUser);

        // Handle session changes with non-blocking profile fetch
        if (currentUser) {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log(`[Auth Effect] User ${currentUser.id} signed in or token refreshed, checking profile...`);
            // Use a setTimeout to avoid blocking the auth state change
            setTimeout(async () => {
              if (ignore) return;
              
              try {
                const userProfile = await fetchUserProfile(currentUser.id, currentUser);
                
                // Check if we need to create a new profile
                if (!userProfile && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
                  console.log(`[Auth Effect] No profile found for ${currentUser.id}, attempting creation...`);
                  const { error: insertError } = await supabase.from('users').insert({
                    id: currentUser.id,
                    email: currentUser.email ?? '',
                    full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '',
                  });

                  if (insertError) {
                    console.error('[Auth Effect] Error creating user profile:', insertError);
                    if (insertError.code !== '23505') { // Not a duplicate key error
                      toast({ title: 'Profile Creation Error', description: insertError.message, variant: 'destructive' });
                    } else {
                      // Profile likely already exists, try to fetch again
                      await fetchUserProfile(currentUser.id, currentUser);
                    }
                  } else {
                    console.log(`[Auth Effect] Created profile for ${currentUser.id}, re-fetching...`);
                    await fetchUserProfile(currentUser.id, currentUser);
                  }
                }
              } finally {
                if (!ignore) {
                  console.log("[Auth Effect] Setting loading to false after profile operations");
                  setLoading(false);
                }
              }
            }, 0);
          } else {
            // For other events with a user, just set loading to false
            if (!ignore) setLoading(false);
          }
        } else {
          // No user, clear profile and set loading to false
          console.log("[Auth Effect] No user, clearing profile");
          setProfile(null);
          if (!ignore) setLoading(false);
        }
      }
    );

    // Then check for an initial session
    const checkInitialSession = async () => {
      try {
        console.log("[Auth Effect] Checking initial session...");
        
        // Use a timeout to avoid hanging indefinitely
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('getSession timeout')), 5000);
        });
        
        const { data } = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: Session | null } };
        if (ignore) return;
        
        const initialSession = data.session;
        console.log("[Auth Effect] Initial session check result:", initialSession?.user?.id || 'No session');
        
        // If we have a session, update state and fetch profile
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Non-blocking profile fetch
          setTimeout(async () => {
            if (ignore) return;
            try {
              await fetchUserProfile(initialSession.user.id, initialSession.user);
            } finally {
              if (!ignore) {
                console.log("[Auth Effect] Setting loading to false after initial profile fetch");
                setLoading(false);
              }
            }
          }, 0);
        } else {
          // No initial session
          console.log("[Auth Effect] No initial session found");
          if (!ignore) setLoading(false);
        }
      } catch (err) {
        console.error("[Auth Effect] Error checking initial session:", err);
        if (!ignore) {
          // Even on error, we should exit the loading state
          setLoading(false);
        }
      }
    };
    
    // Start the initial session check
    checkInitialSession();

    return () => {
      console.log("[Auth Effect] Cleaning up effect.");
      ignore = true;
      subscription.unsubscribe();
    };
  }, [toast]); 

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully 🌿",
      });
    } else {
      console.error("Error logging out:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
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

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("User not authenticated");
    console.log(`[updateUserProfile] Attempting to update profile for ${user.id} with:`, updates);

    const dbUpdates = { ...updates };
    delete dbUpdates.user_metadata;
    delete dbUpdates.created_at;

    try {
      console.log(`[updateUserProfile] Calling Supabase update for ${user.id}...`);
      const { data, error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();
      
      console.log(`[updateUserProfile] Supabase update result for ${user.id}: Data:`, data, `Error:`, error);

      if (error) {
        console.error('[updateUserProfile] Error updating profile:', error);
        toast({ title: 'Profile Update Error', description: error.message, variant: 'destructive' });
        throw error; 
      }

      if (data) {
        const updatedProfile: UserProfile = { ...data, user_metadata: user?.user_metadata };
        console.log(`[updateUserProfile] Updating local profile state for ${user.id}:`, updatedProfile);
        setProfile(updatedProfile);
        console.log(`[updateUserProfile] Local profile state updated for ${user.id}.`);
        toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully. 🌿' });
      }
    } catch (catchError) {
        console.error('[updateUserProfile] CATCH block error:', catchError);
        throw catchError; 
    }
  };

  const value = {
    session,
    user,
    profile, 
    loading,
    signOut,
    signInWithGoogle,
    updateUserProfile, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
