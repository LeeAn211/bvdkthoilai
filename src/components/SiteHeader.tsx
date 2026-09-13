import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { isExternalUrl, resolveMenuUrl } from '@/lib/navigation'
import type { CSSProperties, ReactNode } from 'react'
import { SocialBrandIcon } from './SocialBrandIcon'
import { CurrentWeekdayTime } from './CurrentWeekdayTime'

function ContactIcon({ type = 'phone', customUrl, iconSize }: { type?: string; customUrl?: string; iconSize?: number }) {
  const iconPixelSize = iconSize ? `${iconSize}px` : undefined
  const iconInnerSize = iconSize ? Math.round(iconSize * 0.52) : undefined

  if (type === 'custom' && customUrl) {
    return (
      <span className="mastheadContactIcon custom" style={{ width: iconPixelSize, height: iconPixelSize, flexBasis: iconPixelSize }} aria-hidden="true">
        <img src={customUrl} alt="" style={iconInnerSize ? { width: `${iconInnerSize}px`, height: `${iconInnerSize}px` } : undefined} />
      </span>
    )
  }
  
  if (type === 'emergency' || type === 'cross') {
    return (
      <span className="mastheadContactIcon emergencyCross" style={{ width: iconPixelSize, height: iconPixelSize, flexBasis: iconPixelSize }} aria-hidden="true">
        <svg viewBox="0 0 24 24" style={iconInnerSize ? { width: `${iconInnerSize}px`, height: `${iconInnerSize}px` } : undefined}>
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" fill="currentColor" />
        </svg>
      </span>
    )
  }

  if (type === 'calendar' || type === 'calendar-clock') {
    return (
      <span className="mastheadContactIcon calendarClock" style={{ width: iconPixelSize, height: iconPixelSize, flexBasis: iconPixelSize }} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={iconInnerSize ? { width: `${iconInnerSize}px`, height: `${iconInnerSize}px` } : undefined}>
          {/* Calendar top and body */}
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          {/* Calendar grid dots/lines */}
          <path d="M7 14h2" />
          <path d="M7 17h2" />
          <path d="M11 14h2" />
          {/* Clock circle in bottom-right corner */}
          <circle cx="16.5" cy="16.5" r="4.5" fill="var(--contact-icon-bg, #f0f9ff)" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16.5 14.5v2l1.3 1.3" />
        </svg>
      </span>
    )
  }

  const paths: Record<string, ReactNode> = {
    headset: <><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 19c0 2-2 2-5 2"/></>,
    heart: <path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 11 6.7L12 8l1-1.3A4.5 4.5 0 0 1 21 9.5C21 16 12 21 12 21Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></>,
    phone: <path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z"/>,
  }
  return (
    <span className="mastheadContactIcon" style={{ width: iconPixelSize, height: iconPixelSize, flexBasis: iconPixelSize }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={iconInnerSize ? { width: `${iconInnerSize}px`, height: `${iconInnerSize}px` } : undefined}>
        {paths[type] || paths.phone}
      </svg>
    </span>
  )
}

export async function SiteHeader() {
  let settings: any = {}
  let nav: any = {}
  let contact: any = {}
  let social: any = {}
  let theme: any = {}

  try {
    settings = await getGlobal('site-settings')
    nav = await getGlobal('navigation')
    try { contact = await getGlobal('contact-settings') } catch {}
    try { social = await getGlobal('social-settings') } catch {}
    try { theme = await getGlobal('theme-settings') } catch {}
  } catch {}

  const hotline = contact?.hotline || settings?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '02923686115'
  const emergency = contact?.emergencyHotline || settings?.emergencyHotline || '02923686115'
  const zalo = social?.zaloUrl || settings?.zaloUrl || process.env.NEXT_PUBLIC_ZALO_URL || '#'
  const facebook = social?.facebookUrl || settings?.facebookUrl || ''
  const youtube = social?.youtubeUrl || settings?.youtubeUrl || ''
  const tiktok = settings?.tiktokUrl || social?.tiktokUrl || ''
  const configuredSocialLinks = Array.isArray(settings?.headerSocialLinks) ? settings.headerSocialLinks.filter((item: any) => item?.visible !== false && item?.url) : []
  const socialLinks = configuredSocialLinks.length > 0 ? configuredSocialLinks : [
    ...(facebook ? [{ platform: 'facebook', label: 'Facebook', url: facebook }] : []),
    ...(zalo && zalo !== '#' ? [{ platform: 'zalo', label: 'Zalo', url: zalo }] : []),
    ...(youtube ? [{ platform: 'youtube', label: 'YouTube', url: youtube }] : []),
    ...(tiktok ? [{ platform: 'tiktok', label: 'TikTok', url: tiktok }] : []),
  ]
  const logo = mediaUrl(settings?.logo)
  const hospitalName = settings?.hospitalName || 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI'
  const slogan = settings?.headerSlogan || 'Điều trị bằng trái tim - Chăm sóc bằng tấm lòng'
  const tickerText = settings?.slogan || 'Chào mừng đến với Cổng thông tin Bệnh viện Đa khoa khu vực Thới Lai'
  const tickerSettings = settings?.tickerAppearance || {}
  const tickerStyle = {
    '--ticker-background': tickerSettings.backgroundColor || '#f5a623',
    '--ticker-color': tickerSettings.textColor || '#ffffff',
    '--ticker-font-size': `${tickerSettings.fontSize || 13}px`,
    '--ticker-duration': `${tickerSettings.duration || 24}s`,
  } as CSSProperties

  const items = nav?.items?.filter((x: any) => x.visible !== false) || [
    { label: 'Trang chủ', url: '/' },
    {
      label: 'Giới thiệu',
      url: '/gioi-thieu',
      children: [
        { label: 'Giới thiệu chung', url: '/gioi-thieu' },
        { label: 'Lịch sử phát triển', url: '/gioi-thieu/lich-su-phat-trien' },
      ],
    },
    {
      label: 'Tổ chức',
      url: '/so-do-to-chuc',
      children: [
        { label: 'Sơ đồ tổ chức', url: '/so-do-to-chuc' },
        { label: 'Khoa – Phòng', url: '/khoa-phong' },
        { label: 'Chuyên khoa', url: '/chuyen-khoa' },
        { label: 'Đội ngũ Bác sĩ', url: '/bac-si' },
      ],
    },
    { label: 'Lịch khám', url: '/lich-kham' },
    { label: 'Tiêm chủng', url: '/tiem-chung' },
    { label: 'Bảng giá', url: '/bang-gia' },
    { label: 'Tin tức', url: '/tin-tuc' },
    { label: 'Thông báo', url: '/thong-bao' },
    { label: 'Đấu thầu – Mua sắm', url: '/dau-thau-mua-sam' },
    { label: 'Liên hệ', url: '/lien-he' },
  ]

  const brandAppearance = { ...(settings?.brandAppearance || {}), ...(settings?.headerBrandAppearance || {}) }
  const utilityAppearance = { ...(settings?.utilityAppearance || {}), ...(settings?.headerUtilityAppearance || {}) }
  const shellStyle = {
    '--site-primary': theme?.primaryColor || '#0878D1',
    '--site-secondary': theme?.secondaryColor || '#0754A8',
    '--site-accent': theme?.accentColor || '#16A36A',
    '--site-max-width': `${theme?.contentMaxWidth || 1300}px`,
    '--header-font-family': settings?.headerFontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  } as CSSProperties

  const utilityStyle = {
    '--utility-background': utilityAppearance.backgroundColor || 'linear-gradient(90deg, #064a83, #0878d1)',
    '--utility-text-color': utilityAppearance.textColor || '#ffffff',
    '--utility-font-size': `${utilityAppearance.fontSize || 12}px`,
    '--time-color': utilityAppearance.timeColor || '#ffffff',
    '--time-font-size': `${utilityAppearance.timeFontSize || 13}px`,
  } as CSSProperties

  const backgroundImage = mediaUrl(brandAppearance?.backgroundImage)
  const mastheadStyle = {
    '--masthead-background': brandAppearance?.headerBackgroundColor || '#ffffff',
    '--masthead-background-image': backgroundImage ? `url("${backgroundImage}")` : 'none',
    '--masthead-background-size': brandAppearance?.backgroundSize || 'cover',
    '--masthead-background-position': brandAppearance?.backgroundPosition || 'center center',
    '--masthead-background-overlay': brandAppearance?.backgroundOverlay || 'rgba(255,255,255,0.88)',
    '--masthead-min-height': `${brandAppearance?.minHeight || 110}px`,
    '--masthead-title-color': brandAppearance?.titleColor || '#0756b4',
    '--masthead-title-size': `${brandAppearance?.titleFontSize || 17}px`,
    '--masthead-subtitle-color': brandAppearance?.sloganColor || brandAppearance?.subtitleColor || '#0a9b50',
    '--masthead-subtitle-size': `${brandAppearance?.sloganFontSize || brandAppearance?.subtitleFontSize || 13}px`,
    '--masthead-slogan-align': brandAppearance?.sloganAlign || 'center',
    '--masthead-logo-size': `${brandAppearance?.logoSize || 66}px`,
  } as CSSProperties

  const configuredCards = Array.isArray(settings?.headerContactCards) ? settings.headerContactCards.filter((card: any) => card?.visible !== false) : []
  const contactCards = configuredCards.length > 0 ? configuredCards : [
    {
      title: 'CẤP CỨU 24/7',
      text: emergency,
      href: `tel:${emergency}`,
      iconType: 'emergency',
      background: '#ffffff',
      borderColor: '#e1e7ec',
      titleColor: '#273b4c',
      textColor: '#ed2632',
      iconColor: '#118d48',
      iconBackground: '#eaf8ef',
      titleFontSize: 10,
      textFontSize: 17,
      fontWeight: '800'
    },
    {
      title: 'ĐẶT LỊCH KHÁM',
      text: 'ĐẶT LỊCH NGAY',
      href: '/dat-lich-kham',
      iconType: 'calendar',
      hasArrow: true,
      background: '#ffffff',
      borderColor: '#e1e7ec',
      titleColor: '#273b4c',
      textColor: '#0878d1',
      iconColor: '#0284c7',
      iconBackground: '#e0f2fe',
      titleFontSize: 10,
      textFontSize: 16,
      fontWeight: '800'
    },
  ]

  // Menu appearance settings
  const menuApp = settings?.headerMenuAppearance || {}
  const menuBg = menuApp.background || '#075db8'
  const menuGradientEnd = menuApp.gradientEnd || '#006bc7'
  const menuBackground = menuGradientEnd ? `linear-gradient(90deg, ${menuBg} 0%, ${menuGradientEnd} 100%)` : menuBg
  const menuFontFamily = menuApp.fontFamily && menuApp.fontFamily !== 'inherit' ? menuApp.fontFamily : undefined

  const menuStyle = {
    '--menu-font-size': `${menuApp.fontSize || 14}px`,
    '--menu-font-weight': menuApp.fontWeight || '700',
    '--menu-text-transform': menuApp.textTransform || 'uppercase',
    '--menu-letter-spacing': `${menuApp.letterSpacing ?? 0}px`,
    '--menu-font-family': menuFontFamily,
    '--menu-height': `${menuApp.height || 56}px`,
    '--menu-justify': menuApp.justifyContent || 'space-between',
    '--menu-item-spacing': `${menuApp.itemSpacing ?? 8}px`,
    '--menu-border-radius': `${menuApp.borderRadius || 0}px`,
    '--menu-item-radius': `${menuApp.itemBorderRadius || 6}px`,
    '--menu-background': menuBackground,
    '--menu-text-color': menuApp.textColor || '#ffffff',
    '--menu-hover-text': menuApp.hoverTextColor || '#ffe272',
    '--menu-hover-bg': menuApp.hoverBackground || 'rgba(255, 255, 255, 0.1)',
    '--menu-active-indicator': menuApp.activeIndicatorColor || '#ffd24d',
    // Dropdown variables
    '--menu-dropdown-width': `${menuApp.dropdownWidth || 250}px`,
    '--menu-dropdown-font-size': `${menuApp.dropdownFontSize || 14}px`,
    '--menu-dropdown-radius': `${menuApp.dropdownBorderRadius || 12}px`,
    '--menu-dropdown-bg': menuApp.dropdownBackground || '#ffffff',
    '--menu-dropdown-text': menuApp.dropdownTextColor || '#1e3a5f',
    '--menu-dropdown-border': menuApp.dropdownBorderColor || '#e2e8f0',
    '--menu-dropdown-hover-bg': menuApp.dropdownHoverBackground || '#f0f7ff',
    '--menu-dropdown-hover-text': menuApp.dropdownHoverTextColor || '#075db8',
    '--menu-dropdown-arrow': menuApp.dropdownArrowColor || '#94a3b8',
    '--menu-anim-speed': menuApp.animationSpeed || '0.22s',
  } as CSSProperties

  const animClass = `anim-${menuApp.animationStyle || 'slide-down'}`

  return (
    <div className="siteHeaderRoot" style={shellStyle}>
      {settings?.headerShowUtilityBar !== false && <div className="utilityBar" style={utilityStyle}>
        <div className="container utilityInner">
          <div className="utilityGroup utilityContact">
            <CurrentWeekdayTime prefix={utilityAppearance.timePrefix || ''} showIcon={utilityAppearance.showCalendarIcon !== false} />
          </div>
          <div className="utilityGroup utilityRight" aria-label="Kênh mạng xã hội">
            {socialLinks.map((item: any, index: number) => {
              const platform = String(item?.platform || '').toLowerCase()
              const customIconUrl = mediaUrl(item?.customIcon)
              return <a className={`headerSocial ${platform || 'custom'}`} href={item.url} target="_blank" rel="noreferrer" aria-label={item?.label || platform || 'Mạng xã hội'} key={`${platform}-${index}`}>
                {customIconUrl ? <img src={customIconUrl} alt="" /> : ['facebook','zalo','youtube','tiktok'].includes(platform) ? <SocialBrandIcon type={platform as 'facebook' | 'zalo' | 'youtube' | 'tiktok'} /> : <span className="socialCustomText">{item?.label || 'Link'}</span>}
              </a>
            })}
            {settings?.headerShowSearch !== false && <form className="utilitySearch" action="/tim-kiem" method="get" role="search"><label className="srOnly" htmlFor="header-search">Tìm kiếm toàn website</label><input id="header-search" name="q" type="search" minLength={2} maxLength={100} placeholder="Nhập nội dung cần tìm..." aria-label="Nhập nội dung cần tìm"/><button type="submit" aria-label="Tìm kiếm">⌕</button></form>}
          </div>
        </div>
      </div>}

      <div className="hospitalMasthead" style={mastheadStyle}>
        <div className="container hospitalMastheadInner">
          <a className="mastheadBrand" href="/" aria-label="Về trang chủ">
            {brandAppearance?.showLogo !== false && <span className="mastheadLogo"><img className="mastheadLogoImage" src={logo || "/branding/logo-bvdk-thoi-lai.png"} alt="Logo Bệnh viện Đa khoa Khu vực Thới Lai" decoding="async" fetchPriority="high" /></span>}
            <span className="mastheadBrandText">
              {brandAppearance?.showHospitalName !== false && <strong>{hospitalName}</strong>}
              {settings?.headerShowSlogan !== false && <small>{slogan}</small>}
            </span>
          </a>

          {settings?.headerShowContactCards !== false && <div className="mastheadContacts">
            {contactCards.map((card: any, index: number) => {
              const customIconUrl = mediaUrl(card?.customIcon)
              const fontFamilyVal = card?.fontFamily && card.fontFamily !== 'inherit' ? card.fontFamily : undefined
              const cardStyle = {
                '--contact-background': card?.background || '#ffffff',
                '--contact-border': card?.borderColor || '#e1e7ec',
                '--contact-title': card?.titleColor || '#273b4c',
                '--contact-text': card?.textColor || '#0756b4',
                '--contact-extra': card?.extraTextColor || '#557082',
                '--contact-icon': card?.iconColor || (card?.iconType === 'emergency' ? '#ef4444' : '#075ec2'),
                '--contact-icon-bg': card?.iconBackground || (card?.iconType === 'emergency' ? '#fee2e2' : '#eaf5ff'),
                '--contact-title-size': `${card?.titleFontSize || 11}px`,
                '--contact-text-size': `${card?.textFontSize || 18}px`,
                '--contact-weight': card?.fontWeight || '800',
                '--contact-font-family': fontFamilyVal,
                '--contact-min-width': card?.minWidth ? `${card.minWidth}px` : '220px',
                '--contact-border-radius': card?.borderRadius !== undefined ? `${card.borderRadius}px` : '16px',
                fontFamily: fontFamilyVal,
              } as CSSProperties
              const href = card?.href || (card?.text ? (String(card.text).match(/\d{5,}/) ? `tel:${String(card.text).replace(/[^+\d]/g, '')}` : '/lich-kham') : '#')
              const isAction = card?.hasArrow || String(card?.text || '').includes('NGAY') || String(card?.title || '').includes('ĐẶT LỊCH')
              return <a className={`mastheadContact ${card?.iconType === 'emergency' ? 'contactEmergency' : ''} ${isAction ? 'contactAction' : ''}`} href={href} style={cardStyle} key={`${card?.title || 'contact'}-${index}`}>
                <ContactIcon type={card?.iconType || 'phone'} customUrl={customIconUrl} iconSize={card?.iconSize || 46} />
                <span className="mastheadContactInfo">
                  <small>{card?.title}</small>
                  <strong>
                    {card?.text}
                    {isAction && (
                      <svg className="contactActionArrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </strong>
                  {card?.extraText && <em>{card.extraText}</em>}
                </span>
              </a>
            })}
          </div>}
        </div>
      </div>

      <header className={`mainHeader ${settings?.headerStickyMenu === false ? 'notSticky' : ''} ${animClass}`} style={menuStyle}>
        <div className="container headerInner">
          <nav className="mainMenu" aria-label="Điều hướng chính">
            <a className="navSimpleLink navHomeText" href="/">Trang chủ</a>
            {items.map((item: any, index: number) => {
              const url = resolveMenuUrl(item)
              const children = item.children?.filter((child: any) => child.visible !== false) || []
              if (url === '/' && index === 0) return null

              if (children.length === 0) {
                return <a className="navSimpleLink" href={url} target={item.openInNewTab || isExternalUrl(url) ? '_blank' : undefined} rel={item.openInNewTab || isExternalUrl(url) ? 'noreferrer' : undefined} key={`${item.label}-${index}`}>{item.label}</a>
              }

              return (
                <div className="navItem" key={`${item.label}-${index}`}>
                  <a
                    className="navMainLink"
                    href={item.linkType === 'parent' ? undefined : url}
                    role={item.linkType === 'parent' ? 'button' : undefined}
                    target={item.openInNewTab || isExternalUrl(url) ? '_blank' : undefined}
                    rel={item.openInNewTab || isExternalUrl(url) ? 'noreferrer' : undefined}
                  >
                    <span>{item.label}</span>
                    <svg className="navChevron" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" /></svg>
                  </a>
                  <div className="navDropdown">
                    {item.linkType !== 'parent' && <a href={url}><span>Xem tất cả {item.label}</span><i>›</i></a>}
                    {children.map((child: any, childIndex: number) => {
                      const childUrl = resolveMenuUrl(child)
                      return <a key={`${child.label}-${childIndex}`} href={childUrl} target={child.openInNewTab || isExternalUrl(childUrl) ? '_blank' : undefined} rel={child.openInNewTab || isExternalUrl(childUrl) ? 'noreferrer' : undefined}><span>{child.label}</span><i>›</i></a>
                    })}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>
      </header>

      {tickerSettings.enabled !== false && (
        <div className="scrollingNotice" role="status" aria-label={tickerText} style={tickerStyle}>
          <div className="scrollingNoticeTrack">
            <span className="scrollingNoticeItem">✦ {tickerText}</span>
            <span className="scrollingNoticeItem" aria-hidden="true">✦ {tickerText}</span>
          </div>
        </div>
      )}
    </div>
  )
}
