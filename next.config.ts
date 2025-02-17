import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Config options here */
  images: {
    domains: ['images.unsplash.com'], // Add more domains if needed
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
  
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
 
};

export default nextConfig;