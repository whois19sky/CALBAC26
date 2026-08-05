export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton pattern - there should only ever be one of these documents.
  fields: [
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'heroVideoUrl', title: 'Hero Video URL (fallback - only used if no video is uploaded below)', type: 'url' },
    { name: 'heroVideoMobile', title: 'Hero Video (used for ALL devices - upload directly, keep under ~6MB)', type: 'file', options: { accept: 'video/mp4' } },
    { name: 'heroImageMobile', title: 'Hero Image (Mobile fallback, used only if no mobile video is set)', type: 'image' },

    { name: 'homeHeroTitle1', title: 'Home: Hero Slide 1 Title', type: 'string' },
    { name: 'homeHeroSubtitle1', title: 'Home: Hero Slide 1 Subtitle', type: 'text', rows: 2 },
    { name: 'homeHeroTitle2', title: 'Home: Hero Slide 2 Title', type: 'string' },
    { name: 'homeHeroSubtitle2', title: 'Home: Hero Slide 2 Subtitle', type: 'text', rows: 2 },
    { name: 'homeHeroTitle3', title: 'Home: Hero Slide 3 Title', type: 'string' },
    { name: 'homeHeroSubtitle3', title: 'Home: Hero Slide 3 Subtitle', type: 'text', rows: 2 },

    { name: 'aboutHeading', title: 'About Section: Heading', type: 'string' },
    { name: 'aboutBody', title: 'About Section: Body Text', type: 'text' },

    { name: 'whatsappNumber', title: 'WhatsApp Number (for bookings)', type: 'string' },
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'contactAddress', title: 'Address', type: 'text', rows: 2 },
    { name: 'instagramUrl', title: 'Instagram Profile URL', type: 'url' },
    {
      name: 'instagramPosts',
      title: 'Instagram Posts to Embed (paste public post URLs, e.g. instagram.com/p/XXXXX)',
      type: 'array',
      of: [{ type: 'url' }],
    },
    { name: 'facebookUrl', title: 'Facebook URL', type: 'url' },

    // --- Default/Fallback SEO (used when a page has no custom SEO entry below) ---
    { name: 'defaultMetaTitle', title: 'Default Meta Title (fallback)', type: 'string' },
    { name: 'defaultMetaDescription', title: 'Default Meta Description (fallback)', type: 'text', rows: 2 },

    // --- Local SEO / Entity signals (for AI search + Google Maps discovery) ---
    { name: 'primaryNeighborhood', title: 'Primary Neighborhood (e.g. "Park Street Area, Central Kolkata")', type: 'string' },
    { name: 'googleMapsUrl', title: 'Google Maps Link (share/embed URL for your listing)', type: 'url' },
    { name: 'latitude', title: 'Latitude', type: 'number' },
    { name: 'longitude', title: 'Longitude', type: 'number' },

    // --- Structured data facts (powers LodgingBusiness/Hostel schema markup) ---
    { name: 'checkInTime', title: 'Check-in Time (e.g. "14:00")', type: 'string' },
    { name: 'checkOutTime', title: 'Check-out Time (e.g. "11:00")', type: 'string' },
    { name: 'priceRangeLow', title: 'Lowest Price (₹, for price range signal)', type: 'number' },
    { name: 'priceRangeHigh', title: 'Highest Price (₹, for price range signal)', type: 'number' },
    { name: 'coreAmenities', title: 'Core Amenities (e.g. Free WiFi, AC, 24/7 Front Desk, Lockers)', type: 'array', of: [{ type: 'string' }] },

    {
      name: 'seo',
      title: 'SEO Per Page',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pageSeo',
          fields: [
            { name: 'page', title: 'Page', type: 'string', options: { list: ['Homepage', 'The Nest XP', 'WanderXP', 'The Social', 'Blog', 'Booking', 'Check-in'] } },
            { name: 'metaTitle', title: 'Meta Title', type: 'string' },
            { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'page', subtitle: 'metaTitle' } },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
};
