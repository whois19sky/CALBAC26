import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // fast, cached reads - fine for public-facing content
});

const builder = imageUrlBuilder(sanityClient);

/**
 * Generates an optimized image URL from a Sanity image reference.
 * Usage: urlFor(room.images[0]).width(800).url()
 */
export function urlFor(source: any) {
  return builder.image(source);
}
