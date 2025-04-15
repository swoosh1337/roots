
import { Database } from '@/integrations/supabase/types';
import { Session, User } from '@supabase/supabase-js';

// Define a type for our merged user profile data
export type UserProfile = Database['public']['Tables']['users']['Row'] & {
  // Use Record<string, unknown> instead of any
  user_metadata?: Record<string, unknown>; 
};

export interface AuthContextType {
  session: Session | null;
  user: User | null; // Supabase Auth user
  profile: UserProfile | null; // Our custom user profile from DB + potentially metadata
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>; // Function to update profile
}
