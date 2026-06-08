/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    // Pengaturan ini mengabaikan error ESLint saat proses build di Vercel
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;