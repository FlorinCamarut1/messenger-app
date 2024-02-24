/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*res.cloudinary.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*avatars.githubusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
// "avatars.githubusercontent.com",
// "res.cloudinary.com",
// "lh3.googleusercontent.com",
