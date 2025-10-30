import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file contains:\n' +
    'VITE_SUPABASE_URL=your-url\n' +
    'VITE_SUPABASE_ANON_KEY=your-key'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = true;

// Database Types
export interface Client {
  id: string;
  site_name: string;
  domain_name: string;
  email: string;
  payment_status: 'paid' | 'unpaid';
  payment_date: string | null;
  site_active: boolean;
  manual_override: boolean;
  monthly_fee: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}
