import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://dflmgfymcsiaefgdevdh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbG1nZnltY3NpYWVmZ2RldmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTg3NjEsImV4cCI6MjA3NjIzNDc2MX0.2WtCwfstAfLateKHBGdixR6lX4Xjit5uf0atTDqDcUQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);