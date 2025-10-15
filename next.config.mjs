/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.shopify.com", "ae01.alicdn.com", "judge.me"],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "ae01.alicdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "judge.me",
        pathname: "/**",
      },
    ],
    loader: "custom",
    loaderFile: "./src/lib/image-loader.js",
  },
  reactStrictMode: true,
};

export default nextConfig;
