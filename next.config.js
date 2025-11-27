/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fix for Googlebot trying to crawl root domain
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ];
  },

  // Allow images & static files
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Ensure Next.js pages do not block Googlebot
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Prevent SSR crash for bots
  poweredByHeader: false,
};

module.exports = nextConfig;