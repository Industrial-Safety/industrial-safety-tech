import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      // Fotos de perfil de Google OAuth
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      // Imágenes subidas a S3
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

export default nextConfig;
