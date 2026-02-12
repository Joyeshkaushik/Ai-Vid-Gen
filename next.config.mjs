/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
       hostname: 'via.placeholder.com',
      },
        {
        protocol: 'https',
        hostname: 'placehold.co',  // ← ADD THIS BACK
      },
    ],
  },
  // ← UPDATED: Use serverExternalPackages instead of experimental
  serverExternalPackages: [
    '@remotion/bundler',
    '@remotion/renderer',
    '@remotion/cli',
  ],
  // ← UPDATED: Add turbopack config (empty is fine)
  turbopack: {},
  // ← Keep webpack for fallback
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });

    if (isServer) {
      config.externals = [
        ...config.externals,
        '@remotion/bundler',
        '@remotion/renderer',
        '@remotion/cli',
      ];
    }

    return config;
  },
};

export default nextConfig;