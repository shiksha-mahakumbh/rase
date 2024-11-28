/** @type {import('next').NextConfig} */
const nextConfig = {  reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "firebasestorage.googleapis.com",
          pathname: "/v0/b/**", // Allows any subpath under this hostname
        },
      ],
    },
   
  }

module.exports = nextConfig
