/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora qualquer erro de tipagem na hora de subir para a Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de linting da Vercel
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;