
import { createContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextType, UserProfile } from '@/types/auth';
import { fetchUserProfile, signOutUser, signInWithGoogle, updateUserProfile as updateProfile } from '@/utils/authUtils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null); // Raw Supabase auth user
  const [profile, setProfile] = useState<UserProfile | null>(null); // User profile from DB
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
                      const refetchedProfile = await fetchUserProfile(currentUser.id, currentUser);
                      if (!ignore) setProfile(refetchedProfile);
                    }
                  } else {
                    console.log(`[Auth Effect] Created profile for ${currentUser.id}, re-fetching...`);
                    const newProfile = await fetchUserProfile(currentUser.id, currentUser);
                    if (!ignore) setProfile(newProfile);
                  }
                } else if (userProfile) {
                  if (!ignore) setProfile(userProfile);
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
              const userProfile = await fetchUserProfile(initialSession.user.id, initialSession.user);
              if (!ignore) setProfile(userProfile);
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

  const handleSignOut = async () => {
    await signOutUser();
  };

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
  };

  const handleUpdateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("User not authenticated");
    
    const updatedProfile = await updateProfile(user.id, updates, user?.user_metadata);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  const value = {
    session,
    user,
    profile, 
    loading,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    updateUserProfile: handleUpdateUserProfile, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
