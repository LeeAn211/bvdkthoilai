import { withPayload } from '@payloadcms/next/withPayload'

const isProduction = process.env.NODE_ENV === 'production'

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https:",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isProduction ? '' : " 'unsafe-eval'"}`,
  `connect-src 'self' https: wss:${isProduction ? '' : " http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*"}`,
  "media-src 'self' blob: https:",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://challenges.cloudflare.com",
  ...(isProduction ? ['upgrade-insecure-requests'] : []),
].join('; ')

const commonHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  ...(isProduction ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }] : []),
]

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/(.*)', headers: commonHeaders },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] },
    ]
  },
  images: { remotePatterns: [
    { protocol: 'https', hostname: 'medpro.vn' },
    { protocol: 'https', hostname: 'www.google.com' },
  ] },
}

export default withPayload(nextConfig)
