-- Run this in Supabase SQL Editor.
-- Adds a plain-text room_name field to bookings, so room info doesn't rely
-- entirely on the room_id foreign key (which links to Supabase's rooms table -
-- now orphaned, since real room content moved to Sanity).

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS room_name TEXT DEFAULT '';
