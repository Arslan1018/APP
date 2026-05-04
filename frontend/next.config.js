/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['armenu-assets.s3.amazonaws.com', 'localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Allow model-viewer web component
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|usdz)$/,
      use: { loader: 'file-loader', options: { publicPath: '/_next/static/models/', outputPath: 'static/models/' } },
    });
    return config;
  },
  // Headers for WebXR
  async headers() {
    return [
      {
        source: '/ar/:path*',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
