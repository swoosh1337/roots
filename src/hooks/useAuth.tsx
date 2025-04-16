
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth provider initializing");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed", _event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
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
  }, []);

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

  const value = {
    session,
    user,
    loading,
    signOut,
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
