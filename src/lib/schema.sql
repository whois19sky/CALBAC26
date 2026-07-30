-- Calcutta Backpackers Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ROOMS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price_per_night INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 1,
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- BOOKINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  room_name TEXT DEFAULT '',
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in')),
  whatsapp_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- CHECKINS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT DEFAULT '',
  id_type TEXT DEFAULT '',
  id_number TEXT DEFAULT '',
  emergency_contact TEXT DEFAULT '',
  special_requests TEXT,
  id_image_base64 TEXT,
  address TEXT DEFAULT '',
  visa_no TEXT DEFAULT '',
  coming_from TEXT DEFAULT '',
  going_to TEXT DEFAULT '',
  google_sheet_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- BLOG POSTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT,
  author TEXT DEFAULT 'Calcutta Backpackers',
  category TEXT DEFAULT 'General',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- EXPERIENCES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Adventure',
  description TEXT DEFAULT '',
  long_description TEXT,
  image TEXT DEFAULT '',
  price INTEGER,
  duration TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- GALLERY IMAGES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- TESTIMONIALS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  origin TEXT DEFAULT '',
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- SITE SETTINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}'::jsonb
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Disable RLS on all tables (since auth is handled by Next.js middleware now)
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE checkins DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- =====================
-- SEED DATA
-- =====================

-- Rooms
INSERT INTO rooms (name, slug, tagline, description, price_per_night, capacity, features, images, sort_order) VALUES
('The Social Dorms', 'social-dorms', 'Best Value. Zero Cap.', 'Capsule-style bunks with privacy curtains, your own reading light, and a locker that actually locks. Built for people who want a good night''s sleep without the price tag.', 499, 8, '["Air Conditioned", "Privacy Curtains", "Personal Lockers", "Free WiFi", "Reading Lights", "Charging Ports"]', '["/images/Dorm1.webp"]', 1),
('Private Ensuite', 'private-ensuite', 'Privacy, Priced Fair.', 'Your own room, your own bathroom, a proper bed — for less than you''d pay for a mid-range hotel with none of the character. Good light, good desk, good wifi.', 1999, 2, '["En-suite Bathroom", "King Size Bed", "Work Desk", "City View", "Air Conditioned", "Free WiFi"]', '["/images/private room.webp"]', 2),
('Bunk Beds', 'bunk-beds', 'The Cheapest Good Night''s Sleep in Kolkata.', 'Simple, clean bunk beds in a shared space — for backpackers who''d rather spend on experiences than on a room. Still AC. Still secure. Still comfortable.', 399, 6, '["Air Conditioned", "Shared Bathroom", "Personal Lockers", "Free WiFi"]', '["/images/Dorm1.webp"]', 3),
('Deluxe Apartment', 'deluxe-apartment', 'For Groups, Long Stays & Real Kitchens.', 'A fully furnished apartment with a real kitchen, living room, and washing machine — ideal for longer stays, digital nomads, or a group splitting the bill.', 3499, 4, '["Full Kitchen", "Living Room", "Washing Machine", "Smart TV", "Air Conditioned", "Free WiFi"]', '["/images/private1.webp"]', 4)
ON CONFLICT (slug) DO NOTHING;

-- Experiences
INSERT INTO experiences (title, slug, category, description, image, price, duration, sort_order) VALUES
('Street Food Crawl', 'street-food-crawl', 'Culinary', 'Phuchka, kathi rolls, cutting chai at dawn — the real Kolkata street food scene, not the tourist version. We take you to the stalls near New Market that locals have queued at for decades.', '/images/bp_street.png', 799, '3 hours', 1),
('Heritage Walk', 'heritage-walk', 'Culture', 'Crumbling colonial mansions, hidden courtyards, and North Kolkata''s grand old palaces — the free walking tour every Gen Z traveler''s Instagram grid is missing.', '/images/bp_community.png', 599, '4 hours', 2),
('The Social Evening', 'social-evening', 'Community', 'Rooftop music nights, 5pm chai sessions, and communal dinners with fellow travelers — daily, free, and honestly the best part of staying at a poshtel instead of a hotel.', '/images/bp_dorm.png', 0, '2 hours', 3),
('Kumartuli Art District', 'kumartuli-art', 'Culture', 'Kolkata''s famous idol-making quarter — watch artisans hand-sculpt clay idols the traditional way, a scene most tourists never even hear about.', '/images/Community.webp', 499, '2.5 hours', 4),
('Sunrise Boat Ride', 'sunrise-boat-ride', 'Adventure', 'A scenic boat ride along the Hooghly River at dawn — the cheapest, calmest way to see Kolkata wake up.', '/images/Commonspace.webp', 699, '2 hours', 5)
ON CONFLICT (slug) DO NOTHING;

-- Gallery Images
INSERT INTO gallery_images (src, alt, category, sort_order) VALUES
('/images/Community.webp', 'Community Space', 'Spaces', 1),
('/images/Dorm1.webp', 'Dormitory', 'Rooms', 2),
('/images/Corridor.webp', 'Corridor', 'Spaces', 3),
('/images/Common SPace1.webp', 'Common Space', 'Spaces', 4),
('/images/private1.webp', 'Private Room Detail', 'Rooms', 5),
('/images/Commonspace.webp', 'Lounge Area', 'Spaces', 6),
('/images/Community1.webp', 'Community Gathering', 'Community', 7),
('/images/corridor1.webp', 'Hallway', 'Spaces', 8),
('/images/private room.webp', 'Private Room', 'Rooms', 9);

-- Testimonials
INSERT INTO testimonials (quote, guest_name, origin, rating, sort_order) VALUES
('The most beautiful hostel I''ve ever stayed in. It feels like a boutique hotel but with the warmth and community of a backpacker lodge. Absolutely world-class.', 'Sarah Mitchell', 'Melbourne, Australia', 5, 1),
('Immaculate design, incredible staff, and the WanderXP street food tour was life-changing. I extended my stay three times. 10 out of 10.', 'Marco Fernández', 'Barcelona, Spain', 5, 2),
('A true oasis in Kolkata. The private rooms are stunning and the chai at The Social is the best I''ve had in India. Already planning my return.', 'Yuki Tanaka', 'Tokyo, Japan', 5, 3),
('Best hostel in India, hands down. The staff made me feel at home from the moment I walked in. The heritage walk was the highlight of my trip.', 'James Patterson', 'London, UK', 5, 4)
ON CONFLICT DO NOTHING;

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, is_published, published_at) VALUES
('Welcome to Calcutta Backpackers: Your Guide to Kolkata''s Best Value Poshtel', 'welcome-to-the-family-your-insider-guide-to-calcutta-backpackers', 'Everything you need to know before you check in - from getting here to what makes this Kolkata''s best value poshtel for backpackers.', '# Welcome to Calcutta Backpackers!

Welcome to the poshtel! Whether you''re a seasoned backpacker counting rupees or this is your first hostel stay, here''s everything you need to settle in fast.

## Getting Here

We''re located at **6/27a, Pashupati Bhattacharya Road, Kolkata 700034**, just minutes from Sudder Street and the iconic New Market area. The nearest metro station is Park Street.

## The Social

Our common area, **The Social**, is the heart of the hostel - free, daily, and where most of the good stories start. Here you''ll find:
- Daily chai sessions at 5 PM
- Weekly music nights every Saturday
- A curated library of travel books
- Board games and a pool table

## WanderXP Tours

Our **WanderXP** experiences are priced for backpackers and built to get you past the guidebook version of Kolkata:
- **Street Food Crawl** — Phuchka, kati rolls, and cutting chai at the stalls locals actually queue at
- **Heritage Walk** — Colonial mansions, hidden courtyards, and the real stories behind North Kolkata
- **Kumartuli Art District** — Watch artisans hand-sculpt clay idols the traditional way

## House Rules

1. Check-in: 2:00 PM | Check-out: 11:00 AM
2. Quiet hours: 11 PM – 7 AM
3. No outside food in dorms
4. Be respectful of fellow travelers

## Why a Poshtel, Not a Hotel

We keep prices honest - dorms from Rs.399, private rooms from Rs.1,999 - because we''d rather you spend on experiences than on a room. Good design and good value aren''t mutually exclusive, and that''s the whole idea here.

See you soon! 🙏', 'Sky', 'Guide', true, now())
ON CONFLICT (slug) DO NOTHING;

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
('contact', '{"phone": "+919875432441", "email": "bookingcalcuttabackpackers@gmail.com", "address": "6/27a, Pashupati Bhattacharya Road, Kolkata 700034", "whatsapp": "+919875432441"}'::jsonb),
('social', '{"instagram": "https://www.instagram.com/calcuttabackpackers/", "facebook": "https://www.facebook.com/", "tiktok": "https://tiktok.com/"}'::jsonb),
('hero', '{"video_url": "https://videos.pexels.com/video-files/4874712/4874712-uhd_3840_2160_25fps.mp4", "tagline": "Welcome to the Poshtel"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
