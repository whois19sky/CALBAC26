import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Server-side image optimization (which depends on the "sharp" library having
    // correctly installed native binaries for this specific host) was causing every
    // single image on the site to fail with 503s, including tiny local files like
    // the logo. Rather than keep chasing sharp/host compatibility, we serve images
    // unoptimized instead. Uploads are already resized client-side before they ever
    // reach the server (see uploadFileToStorage), so this is a reasonable trade-off:
    // slightly larger payloads in exchange for images that reliably load at all.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mwlmrpgcapayddcxqhsu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.zyrosite.com',
      },
    ],
  },
};

export default nextConfig;
