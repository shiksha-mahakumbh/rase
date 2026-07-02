const createNextIntlPlugin = require("next-intl/plugin");
const { LEGACY_REDIRECTS } = require("./src/config/legacy-redirects.js");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const RECEIPT_LOGO_INCLUDES = [
  "./public/images/dhe-logo.png",
  "./public/images/shiksha-mahakumbh-logo.png",
  "./public/receipt/hindi-campaign.png",
  "./public/receipt/hindi-thanks-block.png",
];

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://connect.facebook.net https://www.clarity.ms https://scripts.clarity.ms https://checkout.razorpay.com https://cdn.razorpay.com https://cdn.botpress.cloud https://*.botpress.cloud https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://www.google.com https://www.google-analytics.com https://www.googletagmanager.com https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://www.clarity.ms https://*.clarity.ms https://connect.facebook.net https://*.botpress.cloud wss://*.botpress.cloud https://vitals.vercel-insights.com https://www.facebook.com",
      "frame-src 'self' https://www.googletagmanager.com https://checkout.razorpay.com https://api.razorpay.com https://www.google.com https://www.gstatic.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.razorpay.com",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  /** Keep heavy native deps out of the webpack bundle (Vercel function size). */
  serverExternalPackages: ["@prisma/client", "prisma", "jspdf", "nodemailer", "@sparticuz/chromium", "puppeteer-core"],
  /** Typecheck runs via scripts/build-production.js — skip duplicate in-build pass (OOM on low RAM). */
  typescript: {
    ignoreBuildErrors: process.env.SKIP_NEXT_STATIC_CHECKS === "1",
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_NEXT_STATIC_CHECKS === "1",
  },
  experimental: {
    /** Required for legacy case aliases (e.g. /Proceeding1 → /proceeding1) without self-loops. */
    caseSensitiveRoutes: true,
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
  /** Prevent ~600MB `public/` from being traced into API routes. */
  outputFileTracingExcludes: {
    "/api/**": ["./public/**"],
    "/api/donation/complete": ["./public/**"],
    "/api/donation/receipt": ["./public/**"],
    "/api/donation/receipt/preview": ["./public/**"],
    "/api/payments/razorpay-webhook": ["./public/**"],
    "/api/payments/create-order": ["./public/**"],
    "/api/payments/verify-payment": ["./public/**"],
    "/api/v2/registration/submit": ["./public/**"],
    "/api/v2/registration/receipt": ["./public/**"],
    "/api/registration/submit": ["./public/**"],
    "/api/registration/receipt": ["./public/**"],
    "/api/registration/send-email": ["./public/**"],
    "/api/participant/download": ["./public/**"],
    "/api/v2/registration/submit": ["./public/**"],
    "/api/v2/admin/donations": ["./public/**"],
    "/api/v2/admin/donations/[donationId]/resend-receipt": ["./public/**"],
    "/api/v2/admin/receipts/[registrationId]": ["./public/**"],
    "/api/v2/admin/email-logs/[id]/resend": ["./public/**"],
    "/api/v2/admin/attendees/bulk": ["./public/**"],
  },
  outputFileTracingIncludes: {
    "/api/donation/complete": RECEIPT_LOGO_INCLUDES,
    "/api/donation/receipt": RECEIPT_LOGO_INCLUDES,
    "/api/v2/registration/submit": RECEIPT_LOGO_INCLUDES,
    "/api/v2/registration/receipt": RECEIPT_LOGO_INCLUDES,
    "/api/registration/submit": RECEIPT_LOGO_INCLUDES,
    "/api/registration/receipt": RECEIPT_LOGO_INCLUDES,
    "/api/registration/send-email": RECEIPT_LOGO_INCLUDES,
    "/api/participant/download": RECEIPT_LOGO_INCLUDES,
    "/api/v2/admin/receipts/[registrationId]": RECEIPT_LOGO_INCLUDES,
    "/api/v2/admin/donations/[donationId]/resend-receipt": RECEIPT_LOGO_INCLUDES,
    "/api/v2/admin/email-logs/[id]/resend": RECEIPT_LOGO_INCLUDES,
    "/api/v2/admin/attendees/bulk": RECEIPT_LOGO_INCLUDES,
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
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  async rewrites() {
    return [
      {
        source: "/pay/v1/checkout.js",
        destination: "https://checkout.razorpay.com/v1/checkout.js",
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
