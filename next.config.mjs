/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
      },
      new URL('https://ae01.alicdn.com/**'),
      new URL('https://judge.me/**'),
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
