/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Disable API routes for static export
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
