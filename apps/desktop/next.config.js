/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ar-sports/ui',
    '@ar-sports/theme',
    '@ar-sports/store',
    '@ar-sports/hooks',
    '@ar-sports/icons',
    '@ar-sports/graphics',
    '@ar-sports/animations',
    '@ar-sports/utils',
    '@ar-sports/types',
  ],
};

module.exports = nextConfig;
