-- Add monthly fee column to clients table and update AquaBliss Water
--
-- 1. Schema Changes
--    - Add monthly_fee column to track client payment amount
--
-- 2. Data Updates
--    - Set AquaBliss Water monthly fee to $14.99

-- Add monthly_fee column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'monthly_fee'
  ) THEN
    ALTER TABLE clients ADD COLUMN monthly_fee decimal(10,2) DEFAULT 14.99;
  END IF;
END $$;

-- Update AquaBliss Water with monthly fee
UPDATE clients
SET monthly_fee = 14.99
WHERE domain_name = 'aquablisswaters.com';