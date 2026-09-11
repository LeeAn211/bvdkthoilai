import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { SocialBrandIcon } from './SocialBrandIcon'

const legacyColumns = (medpro: string, hotline: string) => [
  { title: 'Dành cho người bệnh', links: [{ label: 'Đặt lịch khám', url: medpro }, { label: 'Lịch khám', url: '/lich-kham' }, { label: 'Bảng giá dịch vụ', url: '/bang-gia' }, { label: 'Hướng dẫn BHYT', url: '/trang/kham-bhyt' }] },
  { title: 'Thông tin bệnh viện', links: [{ label: 'Giới thiệu', url: '/gioi-thieu' }, { label: 'Tin tức', url: '/tin-tuc' }, { label: 'Thông báo', url: '/thong-bao' }, { label: 'Đấu thầu – Mua sắm', url: '/dau-thau-mua-sam' }] },
  { title: 'Hỗ trợ', links: [{ label: `Hotline: ${hotline}`, url: `tel:${hotline}` }, { label: 'Góp ý – Phản hồi', url: '/lien-he' }, { label: 'Văn bản – Tài liệu', url: '/van-ban' }, { label: 'Tìm kiếm thông tin', url: '/tim-kiem' }] },
]

export async function SiteFooter() {
  let settings: any = {}, footer: any = {}, contact: any = {}, social: any = {}, medproSettings: any = {}
  try { settings = await getGlobal('site-settings') } catch {}
  try { footer = await getGlobal('footer') } catch {}
  try { contact = await getGlobal('contact-settings') } catch {}
  try { social = await getGlobal('social-settings') } catch {}
  try { medproSettings = await getGlobal('medpro-settings') } catch {}

  if (footer?.enabled === false) return null

  const hotline = contact?.hotline || settings?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '02920000000'
  const emergencyHotline = contact?.emergencyHotline || settings?.emergencyHotline || hotline
  const email = contact?.email || settings?.email || ''
  const workingHours = contact?.workingHours || settings?.workingHours || ''
  const medpro = medproSettings?.url || settings?.medproUrl || process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
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
  const hasManagedColumns = Array.isArray(footer?.columns)
  const columns = (hasManagedColumns ? footer.columns : legacyColumns(medpro, hotline)).filter((column: any) => column?.visible !== false)
  const bottom = footer?.bottom || {}

  return <>
    <footer className="footerPro">
      <div className="container footerProGrid" style={{ ['--footer-columns' as any]: Math.max(1, columns.length) }}>
        <div className="footerBrand">
          {brand.showLogo !== false && <div className="footerLogo footerLogoBackground"><img className="footerLogoImage" src={logo || "/branding/logo-bvdk-thoi-lai.png"} alt="Logo Bệnh viện Đa khoa Khu vực Thới Lai" decoding="async" /></div>}
          <div>
            {brand.showHospitalName !== false && <strong>{settings?.hospitalName || 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI'}</strong>}
            {brand.showAddress !== false && <p><strong>Địa chỉ:</strong> {contact?.address || settings?.address || 'Địa chỉ được cập nhật từ hệ thống quản trị.'}</p>}
            {brand.showPhone !== false && <p><strong>Điện thoại:</strong> <a href={`tel:${hotline}`}>{hotline}</a>{brand.showEmergencyHotline !== false && emergencyHotline && emergencyHotline !== hotline ? <> · <strong>Cấp cứu:</strong> <a href={`tel:${emergencyHotline}`}>{emergencyHotline}</a></> : null}</p>}
            {brand.showEmail !== false && email && <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>}
            {brand.showWorkingHours !== false && workingHours && <p><strong>Thời gian làm việc:</strong> {workingHours}</p>}
            {brand.showDescription !== false && <p>{footer?.description || settings?.footerText || 'Chăm sóc sức khỏe cộng đồng bằng sự tận tâm và chuyên nghiệp.'}</p>}
            {footer?.showSocial !== false && <div className="footerSocials" aria-label="Kênh mạng xã hội">
              {socialLinks.map((item: any, index: number) => {
                const platform = String(item?.platform || '').toLowerCase()
                const customIconUrl = mediaUrl(item?.customIcon)
                return <a className={platform || 'custom'} href={item.url} target="_blank" rel="noreferrer" aria-label={item?.label || platform || 'Mạng xã hội'} key={`${platform}-${index}`}>
                  {customIconUrl ? <img src={customIconUrl} alt="" /> : ['facebook','zalo','youtube','tiktok'].includes(platform) ? <SocialBrandIcon type={platform as 'facebook' | 'zalo' | 'youtube' | 'tiktok'} /> : <span>{item?.label || 'Link'}</span>}
                </a>
              })}
            </div>}
          </div>
        </div>

        {columns.map((column: any, index: number) => <div className="footerLinkColumn" key={column.id || index}>
          <h3>{column.title}</h3>
          {(column.links || []).filter((link: any) => link?.visible !== false).map((link: any, linkIndex: number) => <a key={link.id || linkIndex} href={link.url || '#'} target={link.openNewTab ? '_blank' : undefined} rel={link.openNewTab ? 'noreferrer' : undefined}>{link.label}</a>)}
        </div>)}
      </div>
      {(bottom.showCopyright !== false || bottom.showRightText !== false) && <div className="container footerBottom">
        {bottom.showCopyright !== false && <span>{String(bottom.copyright || footer?.copyright || '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai').replace('{CURRENT_YEAR}', String(new Date().getFullYear()))}</span>}
        {bottom.showRightText !== false && <span>{bottom.rightText || 'Cổng thông tin điện tử'}</span>}
      </div>}
    </footer>

    {footer?.showMobileBar !== false && <div className="mobileActionBar">
      <a href="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9"/></svg><span>Trang chủ</span></a>
      <a href="/lich-kham"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg><span>Lịch khám</span></a>
      <a className="mobileBooking" href={medpro} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg><span>Đặt khám</span></a>
      <a className="mobileEmergency" href={`tel:${hotline}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z"/></svg><span>Cấp cứu</span></a>
    </div>}
  </>
}
