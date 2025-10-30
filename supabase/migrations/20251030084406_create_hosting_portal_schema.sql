-- Hosting Portal Database Schema
-- Creates tables for admin authentication and client management
--
-- Tables:
--   - admin_users: Admin authentication
--   - clients: Client domain and payment tracking
--
-- Security: RLS enabled with authenticated user policies
-- Automation: Auto-update timestamps and expiration checking

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL,
  domain_name text NOT NULL,
  email text NOT NULL,
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_date date,
  site_active boolean DEFAULT true,
  manual_override boolean DEFAULT false,
  monthly_fee decimal(10,2) DEFAULT 14.99,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin users can view own profile" ON admin_users;
CREATE POLICY "Admin users can view own profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin users can update own profile" ON admin_users;
CREATE POLICY "Admin users can update own profile"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated admins can view all clients" ON clients;
CREATE POLICY "Authenticated admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins can insert clients" ON clients;
CREATE POLICY "Authenticated admins can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can update clients" ON clients;
CREATE POLICY "Authenticated admins can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can delete clients" ON clients;
CREATE POLICY "Authenticated admins can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION check_expired_clients()
RETURNS void AS $$
BEGIN
  UPDATE clients
  SET 
    payment_status = 'unpaid',
    site_active = false
  WHERE 
    payment_status = 'paid'
    AND manual_override = false
    AND payment_date IS NOT NULL
    AND payment_date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

INSERT INTO clients (site_name, domain_name, email, payment_status, payment_date, site_active, manual_override, monthly_fee)
VALUES 
  ('AquaBliss Water', 'aquablisswaters.com', 'victormogeni34@gmail.com', 'paid', CURRENT_DATE, true, false, 14.99)
ON CONFLICT DO NOTHING;