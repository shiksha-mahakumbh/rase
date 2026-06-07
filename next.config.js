const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  /** Avoids missing vendor-chunks/@firebase.js from incomplete Firebase SSR bundling */
  serverExternalPackages: [
    "firebase",
    "firebase/app",
    "firebase/auth",
    "firebase/firestore",
    "firebase/storage",
    "firebase/analytics",
  ],
  /** Reduces dev memory spikes from PackFileCacheStrategy on large codebases */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: "memory",
        maxGenerations: 1,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/participantregistrationdatadekh%20copy",
        destination: "/participantregistrationdatadekh",
        permanent: true,
      },
      {
        source: "/participantregistrationdatadekh copy",
        destination: "/participantregistrationdatadekh",
        permanent: true,
      },
      {
        source: "/ngoregistrationdatadekh%20copy",
        destination: "/ngoregistrationdatadekh",
        permanent: true,
      },
      {
        source: "/ngoregistrationdatadekh copy",
        destination: "/ngoregistrationdatadekh",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
