const dev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.discordapp.com",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  `frame-ancestors ${dev ? "'self'" : "'none'"}`,
  "form-action 'self'",
].join("; ");
export default {
  allowedDevOrigins: ["terminal.local"],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: { optimizePackageImports: ["lucide-react"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.discordapp.com" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: dev ? "SAMEORIGIN" : "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          ...(!dev
            ? [{ key: "Strict-Transport-Security", value: "max-age=15552000" }]
            : []),
        ],
      },
      {
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/api/otp/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};
