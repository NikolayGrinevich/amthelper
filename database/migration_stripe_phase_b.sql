-- Stripe Phase B Migration: missing columns, constraints, webhook idempotency, role sync trigger
-- Run in Supabase SQL Editor after base schema.sql

-- 1. Add missing columns to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS analyses_count INT DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS letters_count INT DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS analyses_reset_at TIMESTAMPTZ DEFAULT now() + interval '1 month';

-- 2. CHECK constraints (NOT VALID = skip existing rows, validate new ones)
ALTER TABLE user_profiles ADD CONSTRAINT check_role 
  CHECK (role IN ('free','pro')) NOT VALID;
ALTER TABLE user_subscriptions ADD CONSTRAINT check_status 
  CHECK (status IN ('none','active','past_due','canceled')) NOT VALID;

-- 3. Webhook idempotency table
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(100),
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Trigger: auto-sync user_profiles.role from user_subscriptions.status
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET role = CASE WHEN NEW.status = 'active' THEN 'pro' ELSE 'free' END
  WHERE stripe_customer_id = NEW.stripe_customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_role
AFTER INSERT OR UPDATE ON user_subscriptions
FOR EACH ROW EXECUTE FUNCTION sync_user_role();

-- 5. Optional: validate constraints on existing data (run after confirming no bad rows)
-- ALTER TABLE user_profiles VALIDATE CONSTRAINT check_role;
-- ALTER TABLE user_subscriptions VALIDATE CONSTRAINT check_status;