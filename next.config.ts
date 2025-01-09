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
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow all origins, modify if needed
          { 
            key: 'Content-Security-Policy', 
            value: "frame-ancestors 'self' http://localhost:3000;" // Allow embedding from your domain
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;