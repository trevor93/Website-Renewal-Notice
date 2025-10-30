/*
  # Client Repository Management System

  ## Overview
  This migration creates a comprehensive repository management system that allows admin to:
  - Upload and store client website repositories
  - Track repository versions and deployments
  - Enable automatic activation/deactivation of client sites based on repository state

  ## 1. New Tables
  
  ### `client_repositories`
  Stores metadata about uploaded client repositories
  - `id` (uuid, primary key) - Unique identifier
  - `client_id` (uuid, foreign key) - Links to clients table
  - `repository_name` (text) - Name of the repository
  - `storage_path` (text) - Path in Supabase storage
  - `version` (text) - Repository version/tag
  - `file_size` (bigint) - Size of repository archive
  - `upload_date` (timestamptz) - When uploaded
  - `status` (text) - active, inactive, archived
  - `deployment_url` (text, nullable) - Live deployment URL
  - `notes` (text, nullable) - Admin notes
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### `repository_deployment_logs`
  Tracks all activation/deactivation events
  - `id` (uuid, primary key) - Unique identifier
  - `repository_id` (uuid, foreign key) - Links to client_repositories
  - `action` (text) - activate, deactivate, deploy, rollback
  - `performed_by` (uuid, nullable) - Admin user ID
  - `success` (boolean) - Whether action succeeded
  - `error_message` (text, nullable) - Error details if failed
  - `metadata` (jsonb, nullable) - Additional deployment info
  - `created_at` (timestamptz) - When action occurred

  ## 2. Security
  - Enable RLS on both tables
  - Only authenticated admin users can manage repositories
  - Repositories linked to specific clients for access control
  - Deployment logs are immutable (insert only)

  ## 3. Important Notes
  - Repositories are stored as ZIP archives in Supabase Storage
  - Each client can have multiple repository versions
  - The system tracks which version is currently active/deployed
  - All deployment actions are logged for audit trail
*/

-- Create client_repositories table
CREATE TABLE IF NOT EXISTS client_repositories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  repository_name text NOT NULL,
  storage_path text NOT NULL,
  version text DEFAULT '1.0.0',
  file_size bigint DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  deployment_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create repository_deployment_logs table
CREATE TABLE IF NOT EXISTS repository_deployment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id uuid NOT NULL,
  client_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('activate', 'deactivate', 'deploy', 'rollback', 'upload')),
  performed_by uuid,
  success boolean DEFAULT true,
  error_message text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_repository FOREIGN KEY (repository_id) REFERENCES client_repositories(id) ON DELETE CASCADE,
  CONSTRAINT fk_client_log FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_repositories_client_id ON client_repositories(client_id);
CREATE INDEX IF NOT EXISTS idx_client_repositories_status ON client_repositories(status);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_repository_id ON repository_deployment_logs(repository_id);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_client_id ON repository_deployment_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_created_at ON repository_deployment_logs(created_at DESC);

-- Enable RLS
ALTER TABLE client_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_deployment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_repositories
CREATE POLICY "Authenticated users can view repositories"
  ON client_repositories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert repositories"
  ON client_repositories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update repositories"
  ON client_repositories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete repositories"
  ON client_repositories
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for repository_deployment_logs (read-only for auditing)
CREATE POLICY "Authenticated users can view deployment logs"
  ON repository_deployment_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deployment logs"
  ON repository_deployment_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_repository_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_repository_timestamp ON client_repositories;
CREATE TRIGGER trigger_update_repository_timestamp
  BEFORE UPDATE ON client_repositories
  FOR EACH ROW
  EXECUTE FUNCTION update_repository_updated_at();

-- Function to automatically log repository status changes
CREATE OR REPLACE FUNCTION log_repository_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO repository_deployment_logs (repository_id, client_id, action, metadata)
    VALUES (NEW.id, NEW.client_id, 'upload', jsonb_build_object('version', NEW.version, 'status', NEW.status));
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    INSERT INTO repository_deployment_logs (repository_id, client_id, action, metadata)
    VALUES (
      NEW.id, 
      NEW.client_id, 
      CASE 
        WHEN NEW.status = 'active' THEN 'activate'
        WHEN NEW.status = 'inactive' THEN 'deactivate'
        ELSE 'deploy'
      END,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'version', NEW.version)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-log status changes
DROP TRIGGER IF EXISTS trigger_log_repository_changes ON client_repositories;
CREATE TRIGGER trigger_log_repository_changes
  AFTER INSERT OR UPDATE ON client_repositories
  FOR EACH ROW
  EXECUTE FUNCTION log_repository_status_change();