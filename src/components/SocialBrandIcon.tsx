export function SocialBrandIcon({ type }: { type: 'facebook' | 'zalo' | 'youtube' | 'tiktok' }) {
  if (type === 'facebook') {
    return (
      <svg className="socialBrandSvg socialBrandFacebook" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="16" fill="#1877F2" />
        <path fill="#fff" d="M18.25 28V17.05h3.68l.55-4.27h-4.23v-2.73c0-1.24.35-2.08 2.12-2.08h2.26V4.15c-.39-.05-1.73-.17-3.29-.17-3.25 0-5.48 1.99-5.48 5.65v3.15h-3.68v4.27h3.68V28h4.39Z"/>
      </svg>
    )
  }

  if (type === 'youtube') {
    return (
      <svg className="socialBrandSvg socialBrandYoutube" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="16" fill="#fff" />
        <rect x="5.2" y="9.2" width="21.6" height="13.6" rx="4.2" fill="#FF0000" />
        <path d="M14 12.7 20.1 16 14 19.3v-6.6Z" fill="#fff" />
      </svg>
    )
  }

  if (type === 'tiktok') {
    return (
      <svg className="socialBrandSvg socialBrandTiktok" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="16" fill="#111111" />
        <path d="M18.4 7.2c.5 2.4 1.9 3.8 4.4 4.2v3.1c-1.7 0-3.2-.5-4.5-1.4v6.4a5.5 5.5 0 1 1-4.7-5.4v3.2a2.4 2.4 0 1 0 1.6 2.3V7.2h3.2Z" fill="#fff"/>
      </svg>
    )
  }

  return (
    <svg className="socialBrandSvg socialBrandZalo" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="16" fill="#fff" />
      <rect x="4.6" y="6.4" width="22.8" height="18.4" rx="6.2" fill="#0A7CFF" />
      <path d="M9.2 11.5h13.6v8.2H16l-4.2 3v-3H9.2v-8.2Z" fill="#fff" />
      <text x="16" y="17.1" textAnchor="middle" fill="#0A7CFF" fontFamily="Arial, Helvetica, sans-serif" fontSize="5.5" fontWeight="700">Zalo</text>
    </svg>
  )
}
