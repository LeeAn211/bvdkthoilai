import Link from 'next/link'
import { getGlobal } from '@/lib/payload'
import { resolveBookingConfig } from '@/lib/booking'
import { mediaUrl } from '@/lib/media'
import { SocialBrandIcon } from './SocialBrandIcon'
import styles from './SiteFooter.module.css'

const legacyColumns = (medpro: string, hotline: string) => [
  {
    title: 'Dành cho người bệnh',
    links: [
      { label: 'Đặt lịch khám trực tuyến', url: medpro, openNewTab: true },
      { label: 'Quy trình khám bệnh', url: '/quy-trinh-kham-benh' },
      { label: 'Giờ làm việc & Tiếp đón', url: '/lich-lam-viec' },
      { label: 'Lịch khám bệnh & Trực', url: '/lich-kham' },
      { label: 'Bảng giá viện phí dịch vụ', url: '/bang-gia' },
      { label: 'Hướng dẫn khám chữa BHYT', url: '/trang/kham-bhyt' },
    ],
  },
  {
    title: 'Thông tin bệnh viện',
    links: [
      { label: 'Giới thiệu chung', url: '/gioi-thieu' },
      { label: 'Chuyên khoa & Đơn vị', url: '/chuyen-khoa' },
      { label: 'Đội ngũ Bác sĩ chuyên gia', url: '/bac-si' },
      { label: 'Tin tức & Hoạt động', url: '/tin-tuc' },
      { label: 'Thông báo & Công khai', url: '/thong-bao' },
      { label: 'Chất lượng bệnh viện', url: '/chat-luong-benh-vien' },
      { label: 'Đấu thầu – Mua sắm y tế', url: '/dau-thau-mua-sam' },
    ],
  },
  {
    title: 'Hỗ trợ & CSKH',
    links: [
      { label: `Hotline: ${hotline}`, url: `tel:${hotline}` },
      { label: 'Khảo sát sự hài lòng', url: '/khao-sat' },
      { label: 'Góp ý – Phản ánh', url: '/gop-y' },
      { label: 'Hỏi đáp y tế (FAQ)', url: '/hoi-dap' },
      { label: 'Biểu mẫu điện tử', url: '/bieu-mau' },
      { label: 'Văn bản – Tài liệu y tế', url: '/van-ban' },
      { label: 'Tìm kiếm thông tin cổng', url: '/tim-kiem' },
    ],
  },
]

export async function SiteFooter() {
  let settings: any = {}, footer: any = {}, contact: any = {}, social: any = {}, medproSettings: any = {}
  try { settings = await getGlobal('site-settings') } catch {}
  try { footer = await getGlobal('footer') } catch {}
  try { contact = await getGlobal('contact-settings') } catch {}
  try { social = await getGlobal('social-settings') } catch {}
  try { medproSettings = await getGlobal('medpro-settings') } catch {}

  if (footer?.enabled === false) return null

  const hotline = contact?.hotline || settings?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '02923686115'
  const emergencyHotline = contact?.emergencyHotline || settings?.emergencyHotline || hotline
  const email = contact?.email || settings?.email || ''
  const workingHours = contact?.workingHours || settings?.workingHours || ''
  const booking = resolveBookingConfig(medproSettings, settings)
  const medpro = booking.url
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
  const brand = footer?.brandOptions || {}
  const hasManagedColumns = Array.isArray(footer?.columns) && footer.columns.length > 0
  const columns = (hasManagedColumns ? footer.columns : legacyColumns(medpro, hotline))
    .filter((column: any) => column?.visible !== false)
    .map((column: any) => ({
      ...column,
      links: Array.isArray(column?.links)
        ? column.links.filter((link: any) => booking.enabled || !String(link?.label || '').toLowerCase().includes('đặt lịch'))
        : column?.links,
    }))
  const bottom = footer?.bottom || {}

  return (
    <>
      <footer className={styles.footerWrapper}>
        {/* Subtle Decorative Ambient Glows */}
        <div className={styles.footerBackgroundGlow} aria-hidden="true" />
        <div className={styles.footerBackgroundGlowLeft} aria-hidden="true" />

        {/* Top Emergency & Quick Action Bar */}
        <div className={styles.footerQuickBar}>
          <div className={`container ${styles.footerQuickBarInner}`}>
            <div className={styles.footerQuickBarCol}>
              <a
                href={`tel:${emergencyHotline.replace(/\s+/g, '')}`}
                className={styles.footerEmergencyCard}
                title="Gọi ngay đường dây nóng cấp cứu 24/24"
              >
                <div className={styles.emergencyPulseIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className={styles.emergencyPulseDot} />
                </div>
                <div className={styles.emergencyContent}>
                  <span className={styles.emergencyLabel}>Cấp cứu trực 24/24</span>
                  <span className={styles.emergencyNumber}>{emergencyHotline}</span>
                </div>
              </a>
            </div>

            <div className={styles.footerActionButtons}>
              {booking.enabled && <a
                href={medpro}
                target={booking.openNewTab ? '_blank' : undefined}
                rel={booking.openNewTab ? 'noreferrer' : undefined}
                className={styles.footerBookingBtn}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Đặt khám trực tuyến</span>
              </a>}
              <Link href="/quy-trinh-kham-benh" className={styles.footerGuideBtn}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Quy trình khám</span>
              </Link>
              <Link href="/lien-he" className={styles.footerGuideBtn}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Góp ý &amp; Liên hệ</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className={styles.footerMain}>
          <div
            className={`container ${styles.footerGrid}`}
            style={{ ['--footer-columns' as any]: Math.max(1, columns.length) }}
          >
            {/* Hospital Identity Column */}
            <div className={styles.hospitalBrandCol}>
              <div className={styles.brandHeaderRow}>
                {brand.showLogo !== false && (
                  <div className={styles.brandLogoWrapper}>
                    <img
                      className={styles.brandLogoImg}
                      src={logo || '/branding/logo-bvdk-thoi-lai.png'}
                      alt="Logo Bệnh viện Đa khoa Khu vực Thới Lai"
                      decoding="async"
                    />
                  </div>
                )}
                <div className={styles.brandTitles}>
                  {brand.showHospitalName !== false && (
                    <div className={styles.hospitalName}>
                      {settings?.hospitalName || 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI'}
                    </div>
                  )}
                  <span className={styles.hospitalSubtitle}>
                    {settings?.headerSlogan || settings?.slogan || 'Tận tâm cứu chữa – Vững vàng chuyên môn'}
                  </span>
                </div>
              </div>

              {brand.showDescription !== false && (
                <p className={styles.hospitalDescription}>
                  {footer?.description ||
                    settings?.footerText ||
                    'Đơn vị y tế công lập tận tâm phục vụ nhân dân, không ngừng đổi mới nâng cao chất lượng khám chữa bệnh và chăm sóc sức khỏe cộng đồng.'}
                </p>
              )}

              {/* Contact Information List with Professional Icons */}
              <div className={styles.contactInfoList}>
                {brand.showAddress !== false && (
                  <div className={styles.contactItem}>
                    <div className={styles.contactItemIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className={styles.contactItemContent}>
                      <strong>Trụ sở:</strong>
                      <span>{contact?.address || settings?.address || 'Ấp Thới Thuận B, Thị trấn Thới Lai, Huyện Thới Lai, TP. Cần Thơ'}</span>
                    </div>
                  </div>
                )}

                {brand.showPhone !== false && (
                  <div className={styles.contactItem}>
                    <div className={styles.contactItemIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className={styles.contactItemContent}>
                      <strong>Tổng đài tư vấn:</strong>
                      <a href={`tel:${hotline.replace(/\s+/g, '')}`}>{hotline}</a>
                      {brand.showEmergencyHotline !== false && emergencyHotline && emergencyHotline !== hotline && (
                        <> · <strong>Cấp cứu:</strong> <a href={`tel:${emergencyHotline.replace(/\s+/g, '')}`}>{emergencyHotline}</a></>
                      )}
                    </div>
                  </div>
                )}

                {brand.showEmail !== false && email && (
                  <div className={styles.contactItem}>
                    <div className={styles.contactItemIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className={styles.contactItemContent}>
                      <strong>Email:</strong>
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  </div>
                )}

                {brand.showWorkingHours !== false && workingHours && (
                  <div className={styles.contactItem}>
                    <div className={styles.contactItemIcon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className={styles.contactItemContent}>
                      <strong>Thời gian tiếp đón:</strong>
                      <span>{workingHours}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Channels Block */}
              {footer?.showSocial !== false && socialLinks.length > 0 && (
                <div className={styles.socialChannelRow} aria-label="Kênh mạng xã hội chính thức">
                  <span className={styles.socialLabel}>Kết nối cùng chúng tôi:</span>
                  {socialLinks.map((item: any, index: number) => {
                    const platform = String(item?.platform || '').toLowerCase()
                    const customIconUrl = mediaUrl(item?.customIcon)
                    return (
                      <a
                        className={styles.socialLinkItem}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item?.label || platform || 'Mạng xã hội'}
                        key={`${platform}-${index}`}
                      >
                        {customIconUrl ? (
                          <img src={customIconUrl} alt="" />
                        ) : ['facebook', 'zalo', 'youtube', 'tiktok'].includes(platform) ? (
                          <SocialBrandIcon type={platform as 'facebook' | 'zalo' | 'youtube' | 'tiktok'} />
                        ) : (
                          <span style={{ fontSize: '9px', fontWeight: 'bold' }}>{item?.label || 'Link'}</span>
                        )}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Managed Navigation Columns */}
            {columns.map((column: any, index: number) => {
              const colAlign = column.textAlign || 'left'
              const headingClass =
                colAlign === 'center'
                  ? `${styles.columnHeading} ${styles.columnHeadingCenter}`
                  : colAlign === 'right'
                  ? `${styles.columnHeading} ${styles.columnHeadingRight}`
                  : styles.columnHeading

              return (
                <div
                  className={styles.navColumn}
                  key={column.id || index}
                  style={colAlign !== 'left' ? { textAlign: colAlign as any, alignItems: colAlign === 'center' ? 'center' : 'flex-end' } : undefined}
                >
                  <h3 className={headingClass}>{column.title}</h3>
                  <ul className={styles.navLinkList}>
                    {(column.links || []).filter((link: any) => link?.visible !== false).map((link: any, linkIndex: number) => {
                      const isExternal = link.openNewTab || (link.url && (link.url.startsWith('http://') || link.url.startsWith('https://') || link.url.startsWith('tel:') || link.url.startsWith('mailto:')))
                      if (isExternal) {
                        return (
                          <li key={link.id || linkIndex}>
                            <a
                              className={styles.navLinkItem}
                              href={link.url || '#'}
                              target={link.openNewTab ? '_blank' : undefined}
                              rel={link.openNewTab ? 'noreferrer' : undefined}
                            >
                              <span className={styles.navLinkBullet} aria-hidden="true" />
                              <span>{link.label}</span>
                            </a>
                          </li>
                        )
                      }
                      return (
                        <li key={link.id || linkIndex}>
                          <Link className={styles.navLinkItem} href={link.url || '#'}>
                            <span className={styles.navLinkBullet} aria-hidden="true" />
                            <span>{link.label}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Copyright & Portal Metadata */}
        {(bottom.showCopyright !== false || bottom.showRightText !== false) && (
          <div className={styles.footerBottomBar}>
            <div className={`container ${styles.footerBottomInner}`}>
              {bottom.showCopyright !== false && (
                <div className={styles.copyrightText}>
                  {String(
                    bottom.copyright ||
                      footer?.copyright ||
                      '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai. Tất cả quyền được bảo lưu.'
                  ).replace('{CURRENT_YEAR}', String(new Date().getFullYear()))}
                </div>
              )}

              {bottom.showRightText !== false && (
                <div className={styles.rightPortalInfo}>
                  <div className={styles.portalBadge}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>{bottom.rightText || 'Cổng thông tin điện tử chính thức'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </footer>
    </>
  )
}
