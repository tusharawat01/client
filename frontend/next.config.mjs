/** @type {import('next').NextConfig} */



const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["ik.imagekit.io"],
  },

  output: "standalone",
};

export default nextConfig;
