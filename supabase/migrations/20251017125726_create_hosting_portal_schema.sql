-- Hosting/Domain Provider Admin Portal - Database Schema
-- This migration creates the database structure for managing client domains,
-- tracking payments, and controlling site activation with n8n integration.

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL,
  domain_name text NOT NULL,
  email text NOT NULL,
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_date date,
  site_active boolean DEFAULT true,
  manual_override boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view own profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update own profile"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for clients
CREATE POLICY "Authenticated admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for clients table
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert the three clients
INSERT INTO clients (site_name, domain_name, email, payment_status, payment_date, site_active, manual_override)
VALUES 
  ('AquaBliss Water', 'aquablisswaters.com', 'victormogeni34@gmail.com', 'paid', CURRENT_DATE - INTERVAL '10 days', true, false),
  ('Injaaz', 'injaaz.netlify.app', 'salminabdalla93@gmail.com', 'paid', CURRENT_DATE - INTERVAL '5 days', true, false),
  ('Jaylocs', 'jaylocs.netlify.app', 'salminabdalla93@gmail.com', 'paid', CURRENT_DATE - INTERVAL '7 days', true, false)
ON CONFLICT DO NOTHING;