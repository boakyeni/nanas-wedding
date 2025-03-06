/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.externals = [...(config.externals || []), { jquery: 'jQuery' }];
      return config;
    },
  }

export default nextConfig;
