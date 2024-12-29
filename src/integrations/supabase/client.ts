import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://steunfbcpofecftasvin.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0ZXVuZmJjcG9mZWNmdGFzdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODg5MjksImV4cCI6MjA1MDQ2NDkyOX0.iK_eO44GLKA99BRtEhbN1QGVURB35UbGgBuw1uCYIz0";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web',
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data if needed
    console.log('User signed out, clearing cached data');
  }
});