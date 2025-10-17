import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Client {
  id: string;
  domain_name: string;
  client_name: string;
  amount_due: number;
  payment_status: 'paid' | 'unpaid';
  last_payment_date: string | null;
  next_due_date: string;
  site_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}
