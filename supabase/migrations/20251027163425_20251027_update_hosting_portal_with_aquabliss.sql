-- Hosting Portal Database - Add AquaBliss Water Client
--
-- 1. Tables Created
--    - admin_users: Admin authentication and profile management
--    - clients: Client domain and payment tracking
--
-- 2. Security
--    - Enable RLS on all tables
--    - Admin users can view/update their own profile
--    - Authenticated admins have full CRUD access to clients
--
-- 3. Automation
--    - Trigger to auto-update updated_at timestamp
--    - Function to check and deactivate expired clients
--
-- 4. Initial Data
--    - Insert AquaBliss Water as first active client with today's payment date

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
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check and deactivate expired clients (30 days after payment)
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

-- Insert AquaBliss Water as the first client
INSERT INTO clients (site_name, domain_name, email, payment_status, payment_date, site_active, manual_override)
VALUES 
  ('AquaBliss Water', 'aquablisswaters.com', 'victormogeni34@gmail.com', 'paid', CURRENT_DATE, true, false)
ON CONFLICT DO NOTHING;