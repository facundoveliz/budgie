/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // FIX: disable this when done
  // disable type errors in building TEMPORARLY
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
