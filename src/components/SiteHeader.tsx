import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { isExternalUrl, resolveMenuUrl } from '@/lib/navigation'
import type { CSSProperties, ReactNode } from 'react'
import styles from './SiteHeader.module.css'
import { SocialBrandIcon } from './SocialBrandIcon'
import { CurrentWeekdayTime } from './CurrentWeekdayTime'

function ContactIcon({ type = 'phone', customUrl }: { type?: string; customUrl?: string }) {
  if (type === 'custom' && customUrl) return <span className="mastheadContactIcon custom" aria-hidden="true"><img src={customUrl} alt="" /></span>
  const paths: Record<string, ReactNode> = {
    emergency: <><path d="M12 3v18M3 12h18"/><path d="M6.5 6.5a7.8 7.8 0 1 0 11 0"/></>,
    headset: <><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 19c0 2-2 2-5 2"/></>,
    calendar: <><path d="M7 2v3M17 2v3M4 8h16M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/><path d="M8 12h3v3H8z"/></>,
    heart: <path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 11 6.7L12 8l1-1.3A4.5 4.5 0 0 1 21 9.5C21 16 12 21 12 21Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></>,
    phone: <path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z"/>,
  }
  return <span className="mastheadContactIcon" aria-hidden="true"><svg viewBox="0 0 24 24">{paths[type] || paths.phone}</svg></span>
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

  const hotline = contact?.hotline || settings?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '0292 368 9115'
  const emergency = contact?.emergencyHotline || settings?.emergencyHotline || hotline
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
    { label: 'Giới thiệu', url: '/gioi-thieu' },
    { label: 'Chuyên khoa', url: '/don-vi' },
    { label: 'Lịch khám', url: '/lich-kham' },
    { label: 'Tiêm chủng', url: '/tiem-chung' },
    { label: 'Bảng giá', url: '/bang-gia' },
    { label: 'Tin tức', url: '/tin-tuc' },
    { label: 'Đấu thầu – Mua sắm', url: '/dau-thau-mua-sam' },
    { label: 'Liên hệ', url: '/lien-he' },
  ]

  const shellStyle = { '--site-primary': theme?.primaryColor || '#0878D1', '--site-secondary': theme?.secondaryColor || '#0754A8', '--site-accent': theme?.accentColor || '#16A36A', '--site-max-width': `${theme?.contentMaxWidth || 1300}px` } as CSSProperties

  const brandAppearance = settings?.headerBrandAppearance || {}
  const utilityAppearance = settings?.headerUtilityAppearance || {}
  const utilityStyle = {
    '--utility-background': utilityAppearance.background || 'linear-gradient(90deg,#064a83,#0878d1)',
    '--time-color': utilityAppearance.timeColor || '#ffffff',
    '--time-font-size': `${utilityAppearance.timeFontSize || 13}px`,
    '--time-font-weight': utilityAppearance.timeFontWeight || '700',
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
    '--masthead-subtitle-color': brandAppearance?.subtitleColor || '#0a9b50',
    '--masthead-logo-size': `${brandAppearance?.logoSize || 66}px`,
  } as CSSProperties

  const configuredCards = Array.isArray(settings?.headerContactCards) ? settings.headerContactCards.filter((card: any) => card?.visible !== false) : []
  const contactCards = configuredCards.length > 0 ? configuredCards : [
    { title: 'CẤP CỨU 24/7', text: emergency, href: `tel:${emergency}`, iconType: 'emergency', background: '#ffffff', borderColor: '#e1e7ec', titleColor: '#273b4c', textColor: '#ed2632', iconColor: '#118d48', iconBackground: '#eaf8ef', titleFontSize: 10, textFontSize: 17, fontWeight: '800' },
    { title: 'TỔNG ĐÀI HỖ TRỢ', text: hotline, href: `tel:${hotline}`, iconType: 'headset', background: '#ffffff', borderColor: '#e1e7ec', titleColor: '#273b4c', textColor: '#0756b4', iconColor: '#075ec2', iconBackground: '#eaf5ff', titleFontSize: 10, textFontSize: 17, fontWeight: '800' },
  ]

  return (
    <div className={styles.root} style={shellStyle}>
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
              const cardStyle = {
                '--contact-background': card?.background || '#ffffff',
                '--contact-border': card?.borderColor || '#e1e7ec',
                '--contact-title': card?.titleColor || '#273b4c',
                '--contact-text': card?.textColor || '#0756b4',
                '--contact-extra': card?.extraTextColor || '#557082',
                '--contact-icon': card?.iconColor || '#075ec2',
                '--contact-icon-bg': card?.iconBackground || '#eaf5ff',
                '--contact-title-size': `${card?.titleFontSize || 10}px`,
                '--contact-text-size': `${card?.textFontSize || 17}px`,
                '--contact-weight': card?.fontWeight || '800',
              } as CSSProperties
              const href = card?.href || (card?.text ? `tel:${String(card.text).replace(/[^+\d]/g, '')}` : '#')
              return <a className="mastheadContact" href={href} style={cardStyle} key={`${card?.title || 'contact'}-${index}`}>
                <ContactIcon type={card?.iconType || 'phone'} customUrl={customIconUrl} />
                <span>
                  <small>{card?.title}</small>
                  <strong>{card?.text}</strong>
                  {card?.extraText && <em>{card.extraText}</em>}
                </span>
              </a>
            })}
          </div>}
        </div>
      </div>

      <header className={`mainHeader ${settings?.headerStickyMenu === false ? 'notSticky' : ''}`}>
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
