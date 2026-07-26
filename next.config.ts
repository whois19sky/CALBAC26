import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Caps how large a source image the optimizer will ever process, and how many
    // distinct sizes it generates. Client uploads are now pre-resized to begin with,
    // but this is a second safety layer against server memory spikes from any image
    // (including ones already sitting in storage from before that fix existed).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
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
