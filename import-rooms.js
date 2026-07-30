// One-time script to import the remaining rooms into Sanity.
// Usage: node import-rooms.js
//
// Requires SANITY_API_TOKEN to be set below (an Editor-permission token from
// manage.sanity.io -> your project -> API -> Tokens).

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nyxl5v82',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skcX1F6AFSyUoJHXGil4n2VGOcgNQ6APdrR4SRKySqqVRZHJy6kgCdXjmpOP4NW674w5EXxuvehcUrcKfDilWFK9OWJgYMyKXGTzYPitLJnjSBMyeJVaUtAG5T8HY63WEqFVyWOHQIupD2KpchQhGPmeOAawTCSRzO201lPpNtGI17JwKc6r',
  useCdn: false,
});

const rooms = [
  {
    _type: 'room',
    name: 'Premium Dorms',
    slug: { _type: 'slug', current: 'premium-dorms' },
    tagline: "More Privacy, Still a Steal.",
    description: "Upgraded dorm bunks with extra breathing room, thicker privacy curtains, and your own reading light — for travelers who want a bit more comfort without jumping to a private room.",
    pricePerNight: 799,
    capacity: 8,
    features: ["Air Conditioned", "Privacy Curtains", "Personal Lockers", "Free WiFi", "Reading Lights", "USB Charging Ports"],
    isActive: true,
    sortOrder: 2,
  },
  {
    _type: 'room',
    name: 'Budget Rooms',
    slug: { _type: 'slug', current: 'budget-rooms' },
    tagline: "Your Own Space, Fair Price.",
    description: "A simple private room with a real door that locks — for when you want privacy without the private-room price tag. Extra bed available on request.",
    pricePerNight: 1699,
    capacity: 3,
    features: ["Private Room", "Air Conditioned", "Free WiFi", "Personal Lockers", "Extra Bed Available"],
    isActive: true,
    sortOrder: 3,
  },
  {
    _type: 'room',
    name: 'Premium Rooms',
    slug: { _type: 'slug', current: 'premium-rooms' },
    tagline: "Privacy, Done Properly.",
    description: "Your own room and bathroom, a proper bed, good light — priced like it's meant to be used, not admired. Extra bed available on request.",
    pricePerNight: 2199,
    capacity: 3,
    features: ["En-suite Bathroom", "Air Conditioned", "Free WiFi", "Work Desk", "Extra Bed Available"],
    isActive: true,
    sortOrder: 4,
  },
  {
    _type: 'room',
    name: 'Serviced Apartments',
    slug: { _type: 'slug', current: 'serviced-apartments' },
    tagline: "For Groups, Long Stays & Real Kitchens.",
    description: "A fully furnished apartment with a real kitchen and living room — ideal for longer stays or a group splitting the bill. Extra bed available on request.",
    pricePerNight: 4599,
    capacity: 4,
    features: ["Full Kitchen", "Living Room", "Air Conditioned", "Free WiFi", "Washing Machine", "Extra Bed Available"],
    isActive: true,
    sortOrder: 5,
  },
];

async function run() {
  console.log(`Importing ${rooms.length} rooms into Sanity...`);
  for (const room of rooms) {
    try {
      const result = await client.create(room);
      console.log(`✓ Created: ${room.name} (id: ${result._id})`);
    } catch (err) {
      console.error(`✗ Failed to create ${room.name}:`, err.message);
    }
  }
  console.log('Done. Go check your Sanity Studio -> Rooms to confirm, then click into each one to add a real photo (this script cannot upload images).');
}

run();
