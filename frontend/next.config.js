/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://forgemuse-ai.onrender.com/api',
    NEXT_PUBLIC_APP_NAME: 'ForgeMuse AI',
  },
}

module.exports = nextConfig