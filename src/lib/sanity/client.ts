import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // fast, cached reads - fine for public-facing content
});

const builder = imageUrlBuilder(sanityClient);

// Minimal chainable object matching the subset of the real Sanity image
// builder's API that this codebase actually uses (.width/.height/.url) -
// used as a safe fallback so callers never need special-case handling.
function staticFallbackBuilder(path: string = "/images/Community.webp") {
  const chain = {
    width: () => chain,
    height: () => chain,
    url: () => path,
  };
  return chain;
}

/**
 * Generates an optimized image URL from a Sanity image reference.
 * Usage: urlFor(room.images[0]).width(800).url()
 *
 * Never throws, even on a broken/incomplete image object - Sanity Studio can
 * leave behind an image array entry with no actual asset attached (upload
 * started but never finished), and calling the underlying builder on one of
 * those throws an uncaught error that used to crash the entire page.
 */
export function urlFor(source: any) {
  if (!hasValidImage(source)) {
    return staticFallbackBuilder();
  }
  try {
    // .auto('format') lets Sanity's image CDN pick WebP/AVIF automatically
    // based on the requesting browser's Accept header, instead of always
    // serving whatever format the file was originally uploaded in (often a
    // much larger JPEG/PNG). Every urlFor() caller benefits automatically -
    // no per-call-site changes needed.
    return builder.image(source).auto('format');
  } catch {
    return staticFallbackBuilder();
  }
}

/**
 * Checks whether a Sanity image object actually has a usable asset attached.
 * Sanity Studio can leave behind an incomplete image entry (just _key/_type,
 * no asset reference) if an upload was started but never fully completed -
 * calling urlFor() on one of those throws an uncaught error and crashes the
 * page. Always check this before calling urlFor() on a Sanity image field.
 */
export function hasValidImage(image: any): boolean {
  return !!(image && (image.asset?._ref || image.asset?.url || image.asset?._id));
}
