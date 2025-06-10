/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMAGE_CONFIG_DOMAIN,
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.wav$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]', // File naming pattern
          publicPath: '/_next/static/sounds',
          outputPath: 'static/sounds',
        },
      },
    });
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]', // File naming pattern
          publicPath: '/_next/static/sounds',
          outputPath: 'static/sounds',
        },
      },
    });
    return config;
  },
};

export default nextConfig;
