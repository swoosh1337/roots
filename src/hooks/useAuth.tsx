
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile from public.users table
  const fetchUserProfile = async (userId: string, currentUser?: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // If user just signed in, check/create their profile
        if (event === 'SIGNED_IN' && currentUser) {
          try {
            // Try to fetch existing profile
            const userProfile = await fetchUserProfile(currentUser.id, currentUser);
            
            // If no profile exists, create one
            if (!userProfile) {
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: currentUser.id,
                  email: currentUser.email!,
                  full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || null
                });
              
              if (insertError) {
                // Handle duplicate key error (profile may have been created in race condition)
                if (insertError.code === '23505') {
                  console.warn('User profile already exists (concurrent creation)');
                  // Re-fetch to ensure we have the correct data
                  await fetchUserProfile(currentUser.id, currentUser);
                } else {
                  console.error('Error creating user profile:', insertError);
                  toast({
                    title: 'Profile Creation Error',
                    description: 'There was an error creating your profile.',
                    variant: 'destructive',
                  });
                }
              } else {
                console.log('User profile created successfully');
                // Re-fetch profile to ensure we have the latest data
                await fetchUserProfile(currentUser.id, currentUser);
              }
            }
          } catch (error) {
            console.error('Error in profile management:', error);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Google Sign-In Error',
        description: error instanceof Error ? error.message : 'There was an error signing in with Google.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    signInWithGoogle,
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
