'use client'

import React, { useRef, useState, useEffect } from 'react'

// ─── Premium illustrated icons with gradient fills ───────────────────────────
function QuickIconGlyph({ name, colorKey }: { name?: string; colorKey?: number }) {
  const uid = name ?? 'default'

  // ── Đặt lịch khám ──────────────────────────────────────────────────────────
  if (name === 'calendar') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`cal-bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4DA8FF"/>
          <stop offset="100%" stopColor="#1A6FCC"/>
        </linearGradient>
        <linearGradient id={`cal-body-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#EAF4FF"/>
        </linearGradient>
        <filter id={`cal-sh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1260CC" floodOpacity="0.25"/>
        </filter>
      </defs>
      {/* Calendar body */}
      <rect x="5" y="12" width="36" height="33" rx="7" fill={`url(#cal-body-${uid})`} stroke="#3D9EF5" strokeWidth="1.8" filter={`url(#cal-sh-${uid})`}/>
      {/* Header bar */}
      <rect x="5" y="12" width="36" height="12" rx="7" fill={`url(#cal-bg-${uid})`}/>
      <rect x="5" y="18" width="36" height="6" fill={`url(#cal-bg-${uid})`}/>
      {/* Binder rings */}
      <rect x="15" y="7" width="4" height="10" rx="2" fill="#5BB0FF"/>
      <rect x="27" y="7" width="4" height="10" rx="2" fill="#5BB0FF"/>
      {/* Day dots */}
      <circle cx="14" cy="31" r="2.2" fill="#3D9EF5"/>
      <circle cx="22" cy="31" r="2.2" fill="#3D9EF5"/>
      <circle cx="30" cy="31" r="2.2" fill="#3D9EF5"/>
      <circle cx="14" cy="39" r="2.2" fill="#3D9EF5"/>
      <circle cx="22" cy="39" r="2.2" fill="#3D9EF5"/>
      {/* Clock bubble */}
      <circle cx="35" cy="38" r="9" fill="white" stroke="#3D9EF5" strokeWidth="2"/>
      <circle cx="35" cy="38" r="9" fill="white" stroke="#3D9EF5" strokeWidth="2"/>
      <path d="M35 34v4l2.8 1.6" stroke="#1A6FCC" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Star badge */}
      <circle cx="42" cy="9" r="7" fill="#FFB800"/>
      <path d="M42 5.5l1.2 3h3.1l-2.5 1.9.9 3-2.7-1.7-2.7 1.7.9-3-2.5-1.9H40.8z" fill="white"/>
    </svg>
  )

  // ── Khám chuyên khoa ───────────────────────────────────────────────────────
  if (name === 'doctor') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`doc-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B6B"/>
          <stop offset="100%" stopColor="#CC2626"/>
        </linearGradient>
        <linearGradient id={`doc-body-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5F5"/>
          <stop offset="100%" stopColor="#FFE8E8"/>
        </linearGradient>
        <filter id={`doc-sh-${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#CC2626" floodOpacity="0.2"/>
        </filter>
      </defs>
      {/* Bag body */}
      <rect x="6" y="17" width="36" height="27" rx="8" fill={`url(#doc-body-${uid})`} stroke="#FF8080" strokeWidth="1.8" filter={`url(#doc-sh-${uid})`}/>
      {/* Handle */}
      <path d="M18 17V13a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v4" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Cross */}
      <rect x="21" y="24" width="6" height="14" rx="3" fill={`url(#doc-g1-${uid})`}/>
      <rect x="17" y="28" width="14" height="6" rx="3" fill={`url(#doc-g1-${uid})`}/>
      {/* Gold star badge */}
      <circle cx="42" cy="10" r="7" fill="#FFB800"/>
      <path d="M42 6.5l1.2 3h3.1l-2.5 1.9.9 3-2.7-1.7-2.7 1.7.9-3-2.5-1.9H40.8z" fill="white"/>
    </svg>
  )

  // ── Đặt lịch xét nghiệm ────────────────────────────────────────────────────
  if (name === 'insurance') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`lab-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22D3A0"/>
          <stop offset="100%" stopColor="#0FA876"/>
        </linearGradient>
        <linearGradient id={`lab-fluid-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD580"/>
          <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
        <filter id={`lab-sh-${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0FA876" floodOpacity="0.25"/>
        </filter>
      </defs>
      {/* Test tube body */}
      <rect x="21" y="8" width="14" height="32" rx="7" fill="white" stroke="#22D3A0" strokeWidth="2" filter={`url(#lab-sh-${uid})`}/>
      {/* Fluid inside */}
      <rect x="23" y="27" width="10" height="13" rx="5" fill={`url(#lab-fluid-${uid})`}/>
      {/* Bubbles */}
      <circle cx="26" cy="23" r="1.5" fill="#22D3A0" opacity="0.5"/>
      <circle cx="30" cy="20" r="1" fill="#22D3A0" opacity="0.4"/>
      {/* Cap */}
      <rect x="20" y="6" width="16" height="6" rx="3" fill={`url(#lab-g1-${uid})`}/>
      {/* Tick badge */}
      <circle cx="41" cy="10" r="7" fill={`url(#lab-g1-${uid})`}/>
      <path d="M37.5 10l2.5 2.5 4-4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* XN label */}
      <rect x="3" y="30" width="16" height="10" rx="5" fill={`url(#lab-g1-${uid})`}/>
      <text x="11" y="37.5" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">XN</text>
    </svg>
  )

  // ── Khám ngoài giờ / 22h ───────────────────────────────────────────────────
  if (name === 'price') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`clk-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A78BFA"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
        <filter id={`clk-sh-${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.3"/>
        </filter>
      </defs>
      {/* Clock face */}
      <circle cx="24" cy="30" r="18" fill="white" stroke="#C4B5FD" strokeWidth="2" filter={`url(#clk-sh-${uid})`}/>
      <circle cx="24" cy="30" r="18" fill="white" stroke="#C4B5FD" strokeWidth="2"/>
      {/* Tick marks */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const r = deg * Math.PI / 180
        const isMajor = i % 3 === 0
        const r1 = isMajor ? 13 : 15, r2 = 17
        return <line key={deg}
          x1={24 + r1*Math.sin(r)} y1={30 - r1*Math.cos(r)}
          x2={24 + r2*Math.sin(r)} y2={30 - r2*Math.cos(r)}
          stroke={isMajor ? '#7C3AED' : '#C4B5FD'} strokeWidth={isMajor ? 2 : 1} strokeLinecap="round"/>
      })}
      {/* Hands */}
      <path d="M24 30V20" stroke={`url(#clk-g1-${uid})`} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 30l7 0" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="30" r="2.5" fill={`url(#clk-g1-${uid})`}/>
      {/* 22h badge */}
      <rect x="36" y="6" width="18" height="11" rx="5.5" fill={`url(#clk-g1-${uid})`}/>
      <text x="45" y="14" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">22h</text>
      {/* T7+CN badge */}
      <rect x="36" y="37" width="18" height="11" rx="5.5" fill="#F87171"/>
      <text x="45" y="45" textAnchor="middle" fill="white" fontSize="7" fontWeight="900" fontFamily="sans-serif">T7+CN</text>
    </svg>
  )

  // ── Giúp việc / Hỗ trợ bệnh nhân ──────────────────────────────────────────
  if (name === 'hospital') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`fam-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C"/>
          <stop offset="100%" stopColor="#DC6A0A"/>
        </linearGradient>
      </defs>
      {/* Person 1 (left) */}
      <circle cx="16" cy="18" r="6" fill="white" stroke="#FB923C" strokeWidth="2"/>
      <path d="M7 38c0-7 4-10 9-10s9 3 9 10" stroke="#FB923C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Person 2 (right, foreground) */}
      <circle cx="30" cy="21" r="5.5" fill="white" stroke={`url(#fam-g1-${uid})`} strokeWidth="2.2"/>
      <path d="M22 42c0-6.5 3.5-9 8-9s8 2.5 8 9" stroke={`url(#fam-g1-${uid})`} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Heart */}
      <path d="M28 13c0 0-1.5-3 1-3s3 3 3 3-1.5-3 1-3 2.5 3 0 5.5L28 19l-5-5.5C20.5 11 22 8 24.5 8S28 11 28 13z" fill="#F87171" transform="translate(7 -3) scale(0.8)"/>
      {/* MỚI badge */}
      <rect x="25" y="4" width="22" height="12" rx="6" fill={`url(#fam-g1-${uid})`}/>
      <text x="36" y="13" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MỚI</text>
    </svg>
  )

  // ── Gọi video / Tư vấn trực tuyến ─────────────────────────────────────────
  if (name === 'map') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`vid-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#0284C7"/>
        </linearGradient>
        <filter id={`vid-sh-${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.25"/>
        </filter>
      </defs>
      {/* Bubble */}
      <rect x="4" y="10" width="38" height="28" rx="10" fill="white" stroke="#38BDF8" strokeWidth="2" filter={`url(#vid-sh-${uid})`}/>
      <path d="M16 38l-5 8v-8" fill="white" stroke="#38BDF8" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Camera body */}
      <rect x="10" y="18" width="16" height="12" rx="4" fill={`url(#vid-g1-${uid})`}/>
      {/* Camera lens */}
      <circle cx="18" cy="24" r="3.5" fill="white" opacity="0.35"/>
      <circle cx="18" cy="24" r="2" fill="white" opacity="0.6"/>
      {/* Video arrow */}
      <path d="M26 20l10-4v16l-10-4" fill={`url(#vid-g1-${uid})`}/>
      {/* Star badge */}
      <circle cx="44" cy="9" r="7" fill="#FFB800"/>
      <path d="M44 5.5l1.2 3h3.1l-2.5 1.9.9 3-2.7-1.7-2.7 1.7.9-3-2.5-1.9H42.8z" fill="white"/>
    </svg>
  )

  // ── Khám sức khỏe thông tư / tổng quát ────────────────────────────────────
  if (name === 'document') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`chk-g1-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
        <filter id={`chk-sh-${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#059669" floodOpacity="0.22"/>
        </filter>
      </defs>
      {/* Clipboard */}
      <rect x="5" y="9" width="30" height="38" rx="7" fill="white" stroke="#86EFAC" strokeWidth="2" filter={`url(#chk-sh-${uid})`}/>
      {/* Clip top */}
      <rect x="13" y="5" width="14" height="8" rx="3" fill={`url(#chk-g1-${uid})`}/>
      {/* Check big */}
      <path d="M12 23l4.5 4.5 8-9" stroke={`url(#chk-g1-${uid})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Lines */}
      <rect x="12" y="33" width="18" height="2.5" rx="1.25" fill="#D1FAE5"/>
      <rect x="12" y="38" width="13" height="2.5" rx="1.25" fill="#D1FAE5"/>
      {/* Magnifier */}
      <circle cx="40" cy="16" r="8.5" fill="white" stroke="#34D399" strokeWidth="2.2" filter={`url(#chk-sh-${uid})`}/>
      <circle cx="40" cy="16" r="5" fill="#D1FAE5"/>
      <line x1="45" y1="21" x2="50" y2="26.5" stroke="#059669" strokeWidth="2.8" strokeLinecap="round"/>
      {/* Pointer */}
      <path d="M40 26v-3.5c0-1-1.2-1-1.2 0V35l-4-2.5-1.2 1.8 4.5 7.7h7c1 0 1.7-.8 1.7-1.7l.5-5.5c0-1.8-1.2-2.5-2-2.5H40" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  // ── Hotline 24/7 ───────────────────────────────────────────────────────────
  if (name === 'phone') return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id={`ph-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6"/>
          <stop offset="100%" stopColor="#BE185D"/>
        </linearGradient>
        <filter id={`ph-sh-${uid}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#BE185D" floodOpacity="0.22"/>
        </filter>
      </defs>
      {/* Bubble */}
      <rect x="4" y="9" width="38" height="30" rx="9" fill="white" stroke="#F9A8D4" strokeWidth="2" filter={`url(#ph-sh-${uid})`}/>
      <path d="M14 39l-3 8v-8" fill="white" stroke="#F9A8D4" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Phone handset */}
      <path d="M13 16c0 0 2 8 7 12s8 4 8 4l-3.5-4.5-3 .5c-2-2-3.5-4.5-4.5-7.5l2.5-2L13 16z" fill={`url(#ph-g1-${uid})`}/>
      {/* Sound waves */}
      <path d="M25 18c2 2 2 5.5 0 7.5" stroke={`url(#ph-g1-${uid})`} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M28.5 15c3.5 3.5 3.5 9.5 0 13" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round"/>
      {/* 24/7 badge */}
      <rect x="28" y="4" width="22" height="12" rx="6" fill={`url(#ph-g1-${uid})`}/>
      <text x="39" y="13" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">24/7</text>
    </svg>
  )

  // Default
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id={`def-g1-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#2563EB"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="44" height="44" rx="10" fill="white" stroke="#93C5FD" strokeWidth="2"/>
      <path d="M28 14v28M14 28h28" stroke={`url(#def-g1-${uid})`} strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  )
}

function QuickServiceIcon({ name }: { name?: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  const glyph = (() => {
    switch (name) {
      case 'calendar':
        return <>
          <rect x="11" y="13" width="31" height="29" rx="7" />
          <path d="M11 23h31M19 9v8M34 9v8" />
          <path d="m21 33 4 4 8-9" className="quickIconAccent" />
        </>
      case 'doctor':
        return <>
          <path d="M18 18v-4a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v4" />
          <rect x="9" y="17" width="36" height="27" rx="8" />
          <path d="M27 25v12M21 31h12" className="quickIconAccent" />
          <path d="M10 25c10 4 24 4 34 0" opacity=".45" />
        </>
      case 'insurance':
        return <>
          <path d="M27 8 41 14v10c0 10-5.7 17-14 21-8.3-4-14-11-14-21V14L27 8Z" />
          <path d="M22 18h10M24 18v13a3 3 0 0 0 6 0V18" />
          <path d="m21 34 4 4 8-9" className="quickIconAccent" />
        </>
      case 'price':
        return <>
          <path d="M14 9h26v36l-4-3-4 3-5-3-5 3-4-3-4 3V9Z" />
          <path d="M20 17h14M20 23h9" opacity=".55" />
          <circle cx="32" cy="33" r="8" className="quickIconAccentFill" />
          <text x="32" y="36.5" textAnchor="middle" className="quickIconCurrency">₫</text>
        </>
      case 'hospital':
        return <>
          <path d="M12 31h6l17 8V15l-17 8h-6v8Z" />
          <path d="m18 31 3 12h7l-3-10" />
          <path d="M40 21c3 3 3 9 0 12M44 17c5 5 5 15 0 20" className="quickIconAccent" />
        </>
      case 'map':
        return <>
          <path d="M11 18h32v25H11z" />
          <path d="M20 18v-4a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v4M11 27h32" />
          <path d="m22 34 4 4 8-9" className="quickIconAccent" />
        </>
      case 'document':
        return <>
          <path d="M16 9h19l7 7v29H16z" />
          <path d="M35 9v8h7M22 25h13M22 31h13M22 37h9" />
          <path d="M11 15v34h25" className="quickIconAccent" />
        </>
      case 'phone':
        return <>
          <path d="M12 30v-4a15 15 0 0 1 30 0v4" />
          <rect x="8" y="27" width="8" height="13" rx="4" />
          <rect x="38" y="27" width="8" height="13" rx="4" />
          <path d="M42 40c0 4-4 7-9 7h-4" />
          <circle cx="26" cy="47" r="2" className="quickIconAccentFill" />
        </>
      default:
        return <><circle cx="27" cy="27" r="18" /><path d="M27 18v18M18 27h18" /></>
    }
  })()

  return (
    <svg className="quickServiceSvg" viewBox="0 0 54 54" aria-hidden="true" {...common}>
      <path className="quickIconDepth" d="M12 46c8 3 22 3 30 0" />
      {glyph}
      <path className="quickIconShine" d="M16 15c4-4 9-6 14-6" />
      {['calendar', 'doctor', 'map'].includes(name || '') && (
        <g className="quickIconBadge">
          <circle cx="43" cy="10" r="6" />
          <path d="M43 7v6M40 10h6" />
        </g>
      )}
    </svg>
  )
}

type QuickLinkItem = {
  id?: string
  title: string
  description?: string
  url?: string
  openNewTab?: boolean
  visualMode?: string
  icon?: string
  image?: any
  imageFit?: string
  quickImage?: string
}

type Props = {
  items: QuickLinkItem[]
  showHeroBanners?: boolean
}

export function QuickLinksCardsSlider({ items, showHeroBanners }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const atStart = el.scrollLeft <= 4
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setCanScrollLeft(!atStart)
    setCanScrollRight(!atEnd)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [items])

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const distance = 280
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    })
  }

  if (!items || items.length === 0) return null

  return (
    <section
      className={`homeQuickSliderWrap ${showHeroBanners ? 'withHero' : 'withoutHero'}`}
      aria-label="Dịch vụ nhanh"
    >
      <div className="container homeQuickSliderContainer">
        {canScrollLeft && (
          <button
            type="button"
            className="homeQuickNavBtn prev"
            onClick={() => scrollByAmount('left')}
            aria-label="Cuộn sang trái"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="homeQuickTrack" ref={scrollRef}>
          {items.map((item, index) => {
            const external = /^https?:\/\//.test(item.url || '')
            const openNewTab = item.openNewTab === true || external
            return (
              <a
                key={item.id || `${item.title}-${index}`}
                href={item.url || '#'}
                className="homeQuickCardItem"
                target={openNewTab ? '_blank' : undefined}
                rel={openNewTab ? 'noopener noreferrer' : undefined}
              >
                <div className={`homeQuickCardIcon ${item.quickImage ? 'hasCustomImage' : ''}`}>
                  {item.quickImage ? (
                    <img
                      src={item.quickImage}
                      alt=""
                      style={{ objectFit: item.imageFit === 'cover' ? 'cover' : 'contain' }}
                    />
                  ) : (
                    <QuickServiceIcon name={item.icon} />
                  )}
                </div>
                <div className="homeQuickCardTitle">{item.title}</div>
              </a>
            )
          })}
        </div>

        {canScrollRight && (
          <button
            type="button"
            className="homeQuickNavBtn next"
            onClick={() => scrollByAmount('right')}
            aria-label="Cuộn sang phải"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}
