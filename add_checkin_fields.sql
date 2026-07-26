-- Run this in Supabase SQL Editor to add the new guest registration fields
-- to your EXISTING checkins table (safe to run once; uses IF NOT EXISTS).

ALTER TABLE checkins ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS visa_no TEXT DEFAULT '';
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS coming_from TEXT DEFAULT '';
ALTER TABLE checkins ADD COLUMN IF NOT EXISTS going_to TEXT DEFAULT '';
