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
      // Restore .single()
      console.log(`[fetchUserProfile] Checking session right before DB query...`);
      const currentAuthCheck = await supabase.auth.getSession(); // Check session again
      console.log(`[fetchUserProfile] Session check result:`, currentAuthCheck.data.session, `Error:`, currentAuthCheck.error);
      
      if (!currentAuthCheck.data.session) {
        console.error(`[fetchUserProfile] No active session found immediately before DB query for ${userId}! Aborting fetch.`);
        setProfile(null);
        return null;
      }

      console.log(`[fetchUserProfile] Running query WITH .single()...`);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single(); // RESTORED

      console.log(`[fetchUserProfile] Query (.single()) result for ${userId}: Data:`, data, `Error:`, error);

      if (error && error.code !== 'PGRST116') { 
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

    async function initializeAuth() {
      console.log("[Auth Effect] Initializing Auth...");
      console.log("[Auth Effect] Getting session...");
      console.log("[Auth Effect] Supabase client object:", supabase);
      
      // Check initial session without delay
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("[Auth Effect] Got session:", session, "Error:", sessionError);
      if (ignore) return;

      if (sessionError) {
        console.error("[Auth Effect] Error getting initial session:", sessionError);
        if (!ignore) setLoading(false);
        return;
      }

      const authUser = session?.user ?? null;
      console.log("[Auth Effect] Setting initial session/user state:", session, authUser);
      setSession(session);
      setUser(authUser);

      if (authUser) {
        console.log(`[Auth Effect] Initial User ${authUser.id} found, fetching profile...`);
        try {
          await fetchUserProfile(authUser.id, authUser);
          console.log(`[Auth Effect] Initial profile fetch complete for user ${authUser.id}`);
        } catch (profileError) {
          console.error("[Auth Effect] Error fetching initial profile:", profileError);
        }
      } else {
         console.log("[Auth Effect] No initial user found.");
      }
      
      if (!ignore) {
        console.log("[Auth Effect] Setting loading to false after initializeAuth.");
        setLoading(false);
      }
    }

    initializeAuth();

    console.log("[Auth Effect] Setting up onAuthStateChange listener...");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log(`[Auth Effect] onAuthStateChange triggered. Event: ${_event}, Session:`, session);
        if (ignore) return;
        
        const currentUser = session?.user ?? null;
        const currentUserId = currentUser?.id;
        const previousUserId = user?.id; 
        
        console.log(`[Auth Effect] State Change: Prev User: ${previousUserId}, Curr User: ${currentUserId}`);
        setSession(session);
        setUser(currentUser);

        if (currentUserId !== previousUserId && currentUser && _event !== 'INITIAL_SESSION') {
          console.log(`[Auth Effect] User changed or relevant event (${_event}). Fetching/checking profile for ${currentUserId}`);
          if (!ignore) setLoading(true); 
          try {
            console.log(`[Auth Effect] Fetching profile for ${currentUserId} in listener...`);
            const userProfile = await fetchUserProfile(currentUser.id, currentUser);
            console.log(`[Auth Effect] Profile fetched in listener for ${currentUserId}:`, userProfile); // Added log here

            if ((_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') && !userProfile) {
              console.log(`[Auth Effect] No profile found for ${currentUserId}, attempting creation...`, _event);
              const { error: insertError } = await supabase.from('users').insert({
                id: currentUser.id,
                email: currentUser.email!,
                full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
              });

              if (insertError) {
                if (insertError.code === '23505') {
                  console.warn(`[Auth Effect] Profile creation conflict (23505): Profile for ${currentUser.id} likely already exists.`);
                  await fetchUserProfile(currentUser.id, currentUser); 
                } else {
                  console.error('[Auth Effect] Error creating user profile:', insertError);
                  toast({ title: 'Profile Creation Error', description: insertError.message, variant: 'destructive' });
                }
              } else {
                console.log(`[Auth Effect] Created profile for ${currentUser.id}, re-fetching...`);
                await fetchUserProfile(currentUser.id, currentUser);
                console.log(`[Auth Effect] Re-fetched profile for ${currentUser.id} after creation.`);
              }
            }
          } catch (profileError) {
             console.error("[Auth Effect] Error handling profile in onAuthStateChange:", profileError);
          } finally {
             if (!ignore) {
                console.log("[Auth Effect] Setting loading to false in onAuthStateChange finally block.");
                setLoading(false); 
             }
          }
        } else if (!currentUser) {
          console.log("[Auth Effect] User logged out, clearing profile.");
          setProfile(null);
          if (!ignore && loading) {
             console.log("[Auth Effect] Setting loading to false on logout.");
             setLoading(false); 
          }
        } else {
           console.log("[Auth Effect] No user change or irrelevant event, skipping profile fetch/check.");
           if (!ignore && loading) setLoading(false);
        }
      }
    );

    return () => {
      console.log("[Auth Effect] Cleaning up effect.");
      ignore = true;
      subscription.unsubscribe();
    };
  }, []); 

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
