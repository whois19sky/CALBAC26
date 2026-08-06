import { cache } from 'react';
import { sanityClient } from './client';

export type SanityRoom = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  features: string[];
  images: any[];
  isActive: boolean;
  sortOrder: number;
};

export type SanityBlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage: any;
  author: string;
  category: string;
  content: any[];
  isPublished: boolean;
  isPinned: boolean;
  publishedAt: string;
};

export type SanityTestimonial = {
  _id: string;
  guestName: string;
  origin: string;
  quote: string;
  rating: number;
  reviewDate?: string;
  isActive: boolean;
  sortOrder: number;
};

export type SanityExperience = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  description: string;
  image: any;
  price: number;
  duration: string;
  sortOrder: number;
};

export type SanitySiteSettings = {
  logo: any;
  heroVideoUrl: string;
  heroVideoMobile: { asset?: { url: string } };
  heroImageMobile: any;
  homeHeroTitle1: string;
  homeHeroSubtitle1: string;
  homeHeroTitle2: string;
  homeHeroSubtitle2: string;
  homeHeroTitle3: string;
  homeHeroSubtitle3: string;
  aboutHeading: string;
  aboutBody: string;
  whatsappNumber: string;
  contactEmail: string;
  contactAddress: string;
  instagramUrl: string;
  instagramPosts: string[];
  facebookUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  primaryNeighborhood: string;
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
  checkInTime: string;
  checkOutTime: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  coreAmenities: string[];
  seo: Array<{ page: string; metaTitle: string; metaDescription: string }>;
};

// Every fetcher below is wrapped in React's `cache()`. On the server this
// deduplicates identical calls made while rendering a single request - e.g.
// a page's generateMetadata() and the page component itself both asking for
// the same Sanity document only ever result in one real network request.
// (On the client, cache() is a no-op passthrough - harmless, since these
// functions are also imported by client-side hooks.)

export const getRooms = cache(async (): Promise<SanityRoom[]> => {
  return sanityClient.fetch(
    `*[_type == "room" && isActive == true] | order(sortOrder asc)`
  );
});

export const getBlogPosts = cache(async (): Promise<SanityBlogPost[]> => {
  return sanityClient.fetch(
    `*[_type == "blogPost" && isPublished == true] | order(isPinned desc, publishedAt desc)`
  );
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<SanityBlogPost | null> => {
  return sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]`,
    { slug }
  );
});

export const getTestimonials = cache(async (): Promise<SanityTestimonial[]> => {
  return sanityClient.fetch(
    `*[_type == "testimonial" && isActive == true] | order(sortOrder asc)`
  );
});

export const getExperiences = cache(async (): Promise<SanityExperience[]> => {
  return sanityClient.fetch(
    `*[_type == "experience"] | order(sortOrder asc)`
  );
});

export const getSiteSettings = cache(async (): Promise<SanitySiteSettings | null> => {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    ...,
    heroVideoMobile { asset->{url} }
  }`);
});

/**
 * Convenience helper: gets the SEO title/description for a specific page from
 * Site Settings, if set. Returns null if not configured, so callers can fall
 * back to their own hardcoded defaults.
 */
export const getPageSeo = cache(async (pageName: string): Promise<{ metaTitle: string; metaDescription: string } | null> => {
  const settings = await getSiteSettings();
  const match = settings?.seo?.find((s) => s.page === pageName);
  if (match && (match.metaTitle || match.metaDescription)) return match;

  // No page-specific SEO set - fall back to the site-wide default, if set.
  if (settings?.defaultMetaTitle || settings?.defaultMetaDescription) {
    return {
      metaTitle: settings.defaultMetaTitle,
      metaDescription: settings.defaultMetaDescription,
    };
  }

  return null;
});
