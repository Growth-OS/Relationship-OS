import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://steunfbcpofecftasvin.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0ZXVuZmJjcG9mZWNmdGFzdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODg5MjksImV4cCI6MjA1MDQ2NDkyOX0.iK_eO44GLKA99BRtEhbN1QGVURB35UbGgBuw1uCYIz0";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);