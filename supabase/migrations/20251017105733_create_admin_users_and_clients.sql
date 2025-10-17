/*
  # Salmin Hosting & Domain Provider Portal - Database Schema

  ## Overview
  This migration creates the database structure for a secure admin portal where Salmin Abdalla
  can manage client domains, track payments, and control site suspension/activation.

  ## New Tables
  
  ### `admin_users`
  Admin authentication table for portal access
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique, not null) - Admin login email
  - `password_hash` (text, not null) - Hashed password for security
  - `full_name` (text, not null) - Admin's full name
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `clients`
  Client domain and payment tracking table
  - `id` (uuid, primary key) - Unique client identifier
  - `domain_name` (text, not null) - Client's domain/URL
  - `client_name` (text, not null) - Client's business/personal name
  - `amount_due` (numeric, not null) - Payment amount owed
  - `payment_status` (text, not null) - 'paid' or 'unpaid' status
  - `last_payment_date` (date) - Date of most recent payment
  - `next_due_date` (date, not null) - Upcoming payment due date
  - `site_active` (boolean, default true) - Whether site is active or suspended
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ## Security
  - Row Level Security (RLS) enabled on both tables
  - Only authenticated admin users can access data
  - Admin users can only access their own authentication record
  - Admin users can view and manage all client records

  ## Notes
  - Passwords should be hashed before storage (handled by application layer)
  - Payment status uses text enum for flexibility ('paid', 'unpaid')
  - Site suspension is controlled via `site_active` boolean flag
  - Timestamps use `timestamptz` for timezone awareness
*/

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
  domain_name text NOT NULL,
  client_name text NOT NULL,
  amount_due numeric(10, 2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'unpaid',
  last_payment_date date,
  next_due_date date NOT NULL,
  site_active boolean DEFAULT true,
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

-- Insert demo clients
INSERT INTO clients (domain_name, client_name, amount_due, payment_status, last_payment_date, next_due_date, site_active)
VALUES 
  ('aquablisswaters.com', 'Aqua Bliss Waters', 14.99, 'paid', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', true),
  ('injaaz.netlify.app', 'Injaaz', 63.00, 'unpaid', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', false),
  ('jaylocs.netlify.app', 'Jaylocs', 29.99, 'paid', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', true);
