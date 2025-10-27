import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if env vars are missing (for client-only pages)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

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
