-- Run in Supabase SQL Editor
-- Add pro_expires_at column for auto-expiration of test Pro access
ALTER TABLE users ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;
