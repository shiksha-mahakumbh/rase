const createNextIntlPlugin = require("next-intl/plugin");
const { LEGACY_REDIRECTS } = require("./src/config/legacy-redirects.js");

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
  /** Keep heavy native deps out of the webpack bundle (Vercel function size). */
  serverExternalPackages: ["@prisma/client", "prisma", "jspdf", "nodemailer"],
  /** Typecheck runs via scripts/build-production.js — skip duplicate in-build pass (OOM on low RAM). */
  typescript: {
    ignoreBuildErrors: process.env.SKIP_NEXT_STATIC_CHECKS === "1",
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_NEXT_STATIC_CHECKS === "1",
  },
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: [
      "framer-motion",
      "antd",
      "recharts",
      "react-icons",
      "@heroicons/react",
      "@fortawesome/react-fontawesome",
    ],
  },
  /** Prevent ~600MB `public/` from being traced into donation API routes. */
  outputFileTracingExcludes: {
    "/api/donation/complete": ["./public/**"],
    "/api/donation/receipt": ["./public/**"],
  },
  outputFileTracingIncludes: {
    "/api/donation/complete": [
      "./public/images/dhe-logo.png",
      "./public/images/shiksha-mahakumbh-logo.png",
    ],
    "/api/donation/receipt": [
      "./public/images/dhe-logo.png",
      "./public/images/shiksha-mahakumbh-logo.png",
    ],
  },
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
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/**",
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
    return LEGACY_REDIRECTS;
  },
};

module.exports = withNextIntl(nextConfig);
