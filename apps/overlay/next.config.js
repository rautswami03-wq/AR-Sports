/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ar-sports/graphics',
    '@ar-sports/animations',
    '@ar-sports/theme',
    '@ar-sports/hooks',
    '@ar-sports/utils',
    '@ar-sports/types',
    '@ar-sports/store',
  ],
};

module.exports = nextConfig;
