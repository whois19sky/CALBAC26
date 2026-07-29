export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton pattern - there should only ever be one of these documents.
  fields: [
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'heroVideoUrl', title: 'Hero Video URL (Desktop)', type: 'url' },
    { name: 'heroVideoMobile', title: 'Hero Video (Mobile - upload directly, keep under ~6MB)', type: 'file', options: { accept: 'video/mp4' } },
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
    { name: 'instagramUrl', title: 'Instagram URL', type: 'url' },
    { name: 'facebookUrl', title: 'Facebook URL', type: 'url' },

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
