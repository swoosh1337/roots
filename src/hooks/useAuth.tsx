import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { ensureUserRecord } from './useUserProfile';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  retrySessionLoad: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Simplified auth state management
  useEffect(() => {
    // Auth provider initializing
    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout;

    // First check for existing session - this is faster than waiting for onAuthStateChange
    const getInitialSession = async () => {
      // Set up a timeout handler - 2 seconds as requested
      timeoutId = setTimeout(() => {
        // Session fetch timeout - proceeding without session
        setSession(null);
        setUser(null);
        setLoading(false);
      }, 2000);

      try {
        // Race against the timeout
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        console.log(`Get session completed in ${Date.now() - startTime}ms`,
          currentSession ? "session exists" : "no session");

        // If we have a valid session with a user, ensure the user record exists
        if (currentSession?.user) {
          // Create user profile record if needed (non-blocking)
          ensureUserRecord(currentSession.user.id, currentSession.user.email || '')
            .catch(err => console.error("Error ensuring user record:", err));
        }

        // Update state with the session result
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      } catch (error) {
        // Clear the timeout since we got a response (error)
        clearTimeout(timeoutId);
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up the auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Handle SIGNED_IN and USER_UPDATED events
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          // Ensure user record exists in database (non-blocking)
          if (newSession?.user) {
            ensureUserRecord(newSession.user.id, newSession.user.email || '')
              .catch(err => console.error("Error ensuring user record:", err));
          }

          // Only show welcome toast for SIGNED_IN event
          if (event === 'SIGNED_IN') {
            // Check if we've shown a welcome toast in this browser session
            const hasShownWelcomeToast = localStorage.getItem('welcome_toast_shown');

            // If we haven't shown it yet in this browser session, show it
            if (!hasShownWelcomeToast) {
              toast({
                title: "Welcome back! 🌿",
                description: "You've been successfully logged in.",
              });

              // Mark that we've shown the toast in this browser session
              localStorage.setItem('welcome_toast_shown', 'true');
            }
          }
        }

        // Update state
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      // Only attempt to sign out if we have a session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            title: "Logout Error",
            description: "Failed to log out. Please try again.",
            variant: "destructive",
          });
        } else {
          // Clear all auth-related localStorage items
          localStorage.removeItem('welcome_toast_shown');
          localStorage.removeItem('current_browser_session');

          toast({
            title: "Logged Out",
            description: "You have been logged out successfully 🌿",
          });
          // Force client-side refresh after logout to clear any cached state
          window.location.href = '/auth';
        }
      } else {
        // If no session exists, just update our local state
        setSession(null);
        setUser(null);
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully 🌿",
        });
      }
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Manually update the user state to ensure it's immediately available
      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
      }

      toast({
        title: "Welcome back! 🌿",
        description: "You've been successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      // Check if email confirmation is enabled in Supabase
      // If it is, the user will need to confirm their email
      // If not, they will be automatically signed in
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account already exists",
          description: "Please log in or reset your password",
          variant: "destructive",
        });
        return;
      }

      if (data?.user?.confirmed_at) {
        // User is already confirmed (email confirmation disabled)
        toast({
          title: "Registration successful! 🌱",
          description: "Your account has been created. You can now log in.",
          className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
        });
      } else {
        // User needs to confirm email
        toast({
          title: "Registration successful! 🌱",
          description: "Please check your email to confirm your account.",
          className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
        });
      }
    } catch (error) {
      
      // Special handling for email sending errors
      if (error instanceof Error && error.message.includes("sending confirmation email")) {
        toast({
          title: "Registration Issue",
          description: "Account created but couldn't send confirmation email. Please contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      // Note: For OAuth, this won't immediately update the user state
      // as the user will be redirected to Google. The state will be
      // updated when they return via the onAuthStateChange listener.
    } catch (error) {
      toast({
        title: "Google Sign-In Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      toast({
        title: "Magic link sent! 🪄",
        description: "Check your email for a login link.",
        className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
      });
    } catch (error) {
      toast({
        title: "Couldn't send magic link",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Retry function to allow user to retry session load
  const retrySessionLoad = () => {
    setLoading(true);
    setSession(null);
    setUser(null);
    // The effect will re-run due to state change
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendMagicLink,
    retrySessionLoad, // Expose retry to consumers
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
