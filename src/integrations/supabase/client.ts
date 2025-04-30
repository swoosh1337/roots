// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
// Use environment variables or fallback to development values
// IMPORTANT: In production, these must be set as environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sakeurhfemssebptfycs.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Validate that we have the required configuration

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
  }
});
