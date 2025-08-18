/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: ['@restaurant-platform/web-common', '@restaurant-platform/database'],
}

module.exports = nextConfig