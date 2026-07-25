-- ============================================================
-- Content refresh: Poshtel / value-focused / Gen Z rebrand
-- Run this in the Supabase SQL Editor for your live project.
-- Safe to re-run (idempotent) — only updates existing rows by slug.
-- Does NOT touch testimonials (real guest reviews — left as-is).
-- ============================================================

-- Rooms
UPDATE rooms SET tagline = 'Best Value. Zero Cap.', description = 'Capsule-style bunks with privacy curtains, your own reading light, and a locker that actually locks. Built for people who want a good night''s sleep without the price tag.' WHERE slug = 'social-dorms';
UPDATE rooms SET tagline = 'Privacy, Priced Fair.', description = 'Your own room, your own bathroom, a proper bed — for less than you''d pay for a mid-range hotel with none of the character. Good light, good desk, good wifi.' WHERE slug = 'private-ensuite';
UPDATE rooms SET tagline = 'The Cheapest Good Night''s Sleep in Kolkata.', description = 'Simple, clean bunk beds in a shared space — for backpackers who''d rather spend on experiences than on a room. Still AC. Still secure. Still comfortable.' WHERE slug = 'bunk-beds';
UPDATE rooms SET tagline = 'For Groups, Long Stays & Real Kitchens.', description = 'A fully furnished apartment with a real kitchen, living room, and washing machine — ideal for longer stays, digital nomads, or a group splitting the bill.' WHERE slug = 'deluxe-apartment';

-- Experiences
UPDATE experiences SET description = 'Phuchka, kathi rolls, cutting chai at dawn — the real Kolkata street food scene, not the tourist version. We take you to the stalls near New Market that locals have queued at for decades.' WHERE slug = 'street-food-crawl';
UPDATE experiences SET description = 'Crumbling colonial mansions, hidden courtyards, and North Kolkata''s grand old palaces — the free walking tour every Gen Z traveler''s Instagram grid is missing.' WHERE slug = 'heritage-walk';
UPDATE experiences SET description = 'Rooftop music nights, 5pm chai sessions, and communal dinners with fellow travelers — daily, free, and honestly the best part of staying at a poshtel instead of a hotel.' WHERE slug = 'social-evening';
UPDATE experiences SET description = 'Kolkata''s famous idol-making quarter — watch artisans hand-sculpt clay idols the traditional way, a scene most tourists never even hear about.' WHERE slug = 'kumartuli-art';
UPDATE experiences SET description = 'A scenic boat ride along the Hooghly River at dawn — the cheapest, calmest way to see Kolkata wake up.' WHERE slug = 'sunrise-boat-ride';

-- Blog post
UPDATE blog_posts SET
  title = 'Welcome to Calcutta Backpackers: Your Guide to Kolkata''s Best Value Poshtel',
  excerpt = 'Everything you need to know before you check in — from getting here to what makes this Kolkata''s best value poshtel for backpackers.',
  content = '# Welcome to Calcutta Backpackers!

Welcome to the poshtel! Whether you''re a seasoned backpacker counting rupees or this is your first hostel stay, here''s everything you need to settle in fast.

## Getting Here

We''re located at **6/27a, Pashupati Bhattacharya Road, Kolkata 700034**, just minutes from Sudder Street and the iconic New Market area. The nearest metro station is Park Street.

## The Social

Our common area, **The Social**, is the heart of the hostel — free, daily, and where most of the good stories start. Here you''ll find:
- Daily chai sessions at 5 PM
- Weekly music nights every Saturday
- A curated library of travel books
- Board games and a pool table

## WanderXP Experiences

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

We keep prices honest — dorms from ₹399, private rooms from ₹1,999 — because we''d rather you spend on experiences than on a room. Good design and good value aren''t mutually exclusive, and that''s the whole idea here.

See you soon! 🙏'
WHERE slug = 'welcome-to-the-family-your-insider-guide-to-calcutta-backpackers';

-- Site settings: hero tagline
UPDATE site_settings
SET value = jsonb_set(value, '{tagline}', '"Welcome to the Poshtel"')
WHERE key = 'hero';

-- ============================================================
-- Verify afterward with:
-- SELECT slug, tagline FROM rooms;
-- SELECT slug, description FROM experiences;
-- SELECT slug, title FROM blog_posts;
-- SELECT key, value FROM site_settings WHERE key = 'hero';
-- ============================================================
