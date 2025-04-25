import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth provider initializing");

    // Create a unique key for this browser session
    const browserSessionKey = 'auth_session_' + Date.now();

    // Store this key in localStorage if it doesn't exist yet
    if (!localStorage.getItem('current_browser_session')) {
      localStorage.setItem('current_browser_session', browserSessionKey);
    }

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed", event);

        // Only handle SIGNED_IN event for toast
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

        // Update state
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Get session completed", currentSession ? "session exists" : "no session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      // Only attempt to sign out if we have a session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Error logging out:", error);
          toast({
            title: "Logout Error",
            description: "Failed to log out. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Logged Out",
            description: "You have been logged out successfully 🌿",
          });
          // Force client-side refresh after logout to clear any cached state
          window.location.href = '/auth';
        }
      } else {
        // If no session exists, just update our local state
        console.log("No active session found, clearing local state only");
        setSession(null);
        setUser(null);
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully 🌿",
        });
      }
    } catch (error) {
      console.error("Exception during logout:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back! 🌿",
        description: "You've been successfully logged in.",
      });
    } catch (error) {
      console.error("Error signing in:", error);
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful! 🌱",
        description: "Please check your email to confirm your account.",
        className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
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
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      toast({
        title: "Magic link sent! 🪄",
        description: "Check your email for a login link.",
        className: "bg-ritual-green/20 border-ritual-green text-ritual-forest",
      });
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast({
        title: "Couldn't send magic link",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
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
