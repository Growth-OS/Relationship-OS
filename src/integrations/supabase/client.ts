import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://steunfbcpofecftasvin.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0ZXVuZmJjcG9mZWNmdGFzdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODg5MjksImV4cCI6MjA1MDQ2NDkyOX0.iK_eO44GLKA99BRtEhbN1QGVURB35UbGgBuw1uCYIz0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});