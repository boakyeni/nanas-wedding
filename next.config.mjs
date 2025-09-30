/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false, // 👈 disable Strict Mode

  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      { jquery: "jQuery" },
    ];
    return config;
  },
};

export default nextConfig;

