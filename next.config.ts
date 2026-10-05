import type { NextConfig } from "next";

// Public business landing pages (copied into public/sites by scripts/copy-business-sites.mjs)
const SITE_ROUTES = [
  { path: "/it-support", slug: "diaspora-it-support" },
  { path: "/websites", slug: "naija-biz-websites" },
];

// Landing pages need Google Fonts and the Calendly booking widget
const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
  "img-src 'self' data: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src https://calendly.com",
  "connect-src 'self' https://calendly.com",
].join("; ");

const nextConfig: NextConfig = {
  rewrites: async () =>
    SITE_ROUTES.map(({ path, slug }) => ({
      source: path,
      destination: `/sites/${slug}/index.html`,
    })),
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.anthropic.com https://*.supabase.co",
            "font-src 'self'",
          ].join("; "),
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
    // Must come after the global rule: the last matching header with the same key wins
    ...["/sites/:path*", ...SITE_ROUTES.map((r) => r.path)].map((source) => ({
      source,
      headers: [{ key: "Content-Security-Policy", value: SITE_CSP }],
    })),
  ],
};

export default nextConfig;
