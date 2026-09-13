import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getGlobal } from '@/lib/payload'
import './lich-lam-viec.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Lịch làm việc & Thời gian khám bệnh — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Thông tin chi tiết khung giờ làm việc các khoa phòng, giờ khám ngoại trú, BHYT, tiêm chủng và dịch vụ cấp cứu 24/24 tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

// Helper render Icon SVG dựa theo cấu hình từ Admin
function renderDepartmentIcon(iconType?: string, customText?: string) {
  if (iconType === 'custom') {
    return <span style={{ fontSize: 20, lineHeight: 1 }}>{customText || '🏥'}</span>
  }

  switch (iconType) {
    case 'calendar':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'syringe':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 2 4 4" />
          <path d="m17 7 3-3" />
          <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
          <path d="m9 11 4 4" />
          <path d="m5 19-3 3" />
          <path d="m14 4 6 6" />
        </svg>
      )
    case 'flask':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        </svg>
      )
    case 'card':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    case 'building':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2" />
        </svg>
      )
    case 'heart':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )
    case 'clock':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'stethoscope':
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      )
  }
}

// Helper render icon cho khối liên kết tab
function renderLinkIcon(iconType?: string) {
  switch (iconType) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'clock':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'paperclip':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      )
    case 'ambulance':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 17 16 17 16 8" />
          <circle cx="5.5" cy="19.5" r="2" />
          <circle cx="18.5" cy="19.5" r="2" />
        </svg>
      )
    case 'fileText':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
    case 'calendar':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
  }
}

export default async function WorkingHoursPage() {
  let whData: any = {}
  let siteSettings: any = {}
  let contactSettings: any = {}

  try {
    const [wh, site, contact] = await Promise.all([
      getGlobal('working-hours-settings' as any).catch(() => null),
      getGlobal('site-settings' as any).catch(() => null),
      getGlobal('contact-settings' as any).catch(() => null),
    ])
    whData = wh || {}
    siteSettings = site || {}
    contactSettings = contact || {}
  } catch {}

  const hero = whData?.hero || {}
  const announcement = whData?.announcement || {}
  const emergency = whData?.emergencyBanner || {}
  const scheduleLinks = whData?.scheduleLinksSection || {}
  const notes = whData?.notesSection || {}

  const hotline = contactSettings?.hotline || siteSettings?.hotline || '0292 3689 115'
  const emergencyHotline = emergency?.hotline || contactSettings?.emergencyHotline || siteSettings?.emergencyHotline || '0292 3686 115'

  // Danh sách các khoa phòng làm việc (chỉ lấy các ô có enabled !== false)
  const defaultDepartments = [
    {
      enabled: true,
      title: 'Quầy Tiếp đón & Đăng ký khám',
      subtitle: 'Khu vực phát số tự động & làm thủ tục khám BHYT, Viện phí',
      iconType: 'card',
      customIconText: '💳',
      badgeColor: 'blue',
      timeRows: [
        { label: 'Bắt đầu tiếp nhận:', value: 'Từ 06:00 sáng', highlight: true },
        { label: 'Giờ phục vụ buổi sáng:', value: '06:00 – 11:30', highlight: true },
        { label: 'Giờ phục vụ buổi chiều:', value: '13:00 – 17:00', highlight: false },
        { label: 'Tiếp đón cấp cứu:', value: 'Thường trực 24/24', highlight: false },
      ],
      note: 'Phát số thứ tự tự động từ 06:00. Có quầy ưu tiên cho người cao tuổi, người khuyết tật, phụ nữ mang thai và trẻ nhỏ.',
    },
    {
      enabled: true,
      title: 'Nhóm Khoa Bác sĩ khám sớm (06:30)',
      subtitle: 'Khám sớm tại các khoa chuyên môn chủ lực',
      iconType: 'stethoscope',
      customIconText: '🩺',
      badgeColor: 'teal',
      timeRows: [
        { label: 'Khoa Khám liên chuyên khoa:', value: 'Từ 06:30 sáng', highlight: true },
        { label: 'Ngoại – Phẫu thuật – GMHS:', value: 'Từ 06:30 sáng', highlight: true },
        { label: 'Sức khỏe sinh sản & Phụ sản:', value: 'Từ 06:30 sáng', highlight: true },
        { label: 'Khám buổi chiều:', value: '13:00 – 17:00', highlight: false },
      ],
      note: 'Bác sĩ bắt đầu khám bệnh từ 06:30 tại 3 khoa trọng điểm giúp người bệnh ở xa được thăm khám sớm và rút ngắn thời gian chờ đợi.',
    },
    {
      enabled: true,
      title: 'Các Phòng khám còn lại (07:00)',
      subtitle: 'Hoạt động theo lịch phân công chuyên khoa của bệnh viện',
      iconType: 'calendar',
      customIconText: '🏥',
      badgeColor: 'blue',
      timeRows: [
        { label: 'Phòng khám Y học cổ truyền:', value: 'Từ 07:00 sáng', highlight: true },
        { label: 'Phòng khám Bác sĩ gia đình:', value: 'Từ 07:00 sáng', highlight: true },
        { label: 'Phòng khám dịch vụ & PK khác:', value: 'Từ 07:00 sáng', highlight: true },
        { label: 'Khám buổi chiều:', value: '13:00 – 17:00', highlight: false },
      ],
      note: 'Áp dụng cho tất cả các phòng khám chuyên khoa nội, nhi, da liễu và chuyên khoa lẻ theo lịch hoạt động thường quy.',
    },
    {
      enabled: true,
      title: 'Xét nghiệm, X-Quang, Siêu âm',
      subtitle: 'Khoa Cận Lâm Sàng & Chẩn đoán hình ảnh',
      iconType: 'flask',
      customIconText: '🔬',
      badgeColor: 'blue',
      timeRows: [
        { label: 'Lấy mẫu xét nghiệm sớm:', value: 'Từ 06:00 sáng', highlight: true },
        { label: 'Chụp X-Quang & Siêu âm:', value: 'Từ 06:30 sáng', highlight: true },
        { label: 'Phục vụ ca cấp cứu:', value: 'Thường trực 24/24', highlight: true },
      ],
      note: 'Người bệnh cần xét nghiệm máu nên đi sớm và nhịn ăn sáng để kết quả chẩn đoán đạt độ chính xác cao nhất.',
    },
    {
      enabled: true,
      title: 'Khám Thứ Bảy & Ngoài giờ',
      subtitle: 'Tạo thuận lợi tối đa cho người dân bận rộn trong tuần',
      iconType: 'calendar',
      customIconText: '📅',
      badgeColor: 'amber',
      timeRows: [
        { label: 'Khám sáng Thứ Bảy:', value: '07:00 – 11:30', highlight: true },
        { label: 'Khám Ngoài giờ:', value: 'Theo thông báo từng đợt', highlight: false },
        { label: 'Chủ Nhật & Ngày Lễ:', value: 'Trực Cấp cứu 24/24', highlight: false },
      ],
      note: 'Người bệnh có thể liên hệ tổng đài hoặc đặt lịch trước để giảm tối đa thời gian chờ đợi tại viện.',
    },
    {
      enabled: true,
      title: 'Phòng Tiêm chủng Vắc xin',
      subtitle: 'Tiêm chủng mở rộng & Vắc xin dịch vụ chất lượng cao',
      iconType: 'syringe',
      customIconText: '💉',
      badgeColor: 'teal',
      timeRows: [
        { label: 'Buổi sáng:', value: '07:30 – 11:00', highlight: true },
        { label: 'Buổi chiều:', value: '13:30 – 16:30', highlight: true },
        { label: 'Lịch tiêm:', value: 'Theo kế hoạch tiêm chủng', highlight: false },
      ],
      note: 'Có khám sàng lọc và tư vấn kỹ lưỡng trước tiêm bởi bác sĩ chuyên khoa.',
    },
    {
      enabled: true,
      title: 'Khối Phòng ban Hành chính',
      subtitle: 'Phòng Kế hoạch tổng hợp, Tổ chức cán bộ, Tài chính kế toán...',
      iconType: 'building',
      customIconText: '🏢',
      badgeColor: 'blue',
      timeRows: [
        { label: 'Buổi sáng:', value: '07:00 – 11:00', highlight: true },
        { label: 'Buổi chiều:', value: '13:00 – 17:00', highlight: true },
        { label: 'Ngày làm việc:', value: 'Thứ Hai – Thứ Sáu', highlight: false },
      ],
      note: 'Tiếp nhận giải quyết văn bản, trích lục hồ sơ bệnh án, xác nhận giấy tờ BHYT và thủ tục hành chính.',
    },
  ]

  const rawDepartments = Array.isArray(whData?.departments) && whData.departments.length > 0
    ? whData.departments
    : defaultDepartments

  const activeDepartments = rawDepartments.filter((d: any) => d?.enabled !== false && d?.title?.trim())

  // Danh sách thẻ liên kết tab
  const defaultLinks = [
    {
      enabled: true,
      title: 'Khối Lịch khám Trang chủ',
      subtitle: 'Mục section lịch khám tổng hợp',
      url: '/#schedules',
      iconType: 'home',
      isEmergency: false,
    },
    {
      enabled: true,
      title: 'Tab Lịch theo tuần',
      subtitle: 'Lịch trực tuần & ma trận phân công',
      url: '/#schedules?tab=weekly',
      iconType: 'calendar',
      isEmergency: false,
    },
    {
      enabled: true,
      title: 'Tab Lịch theo ngày',
      subtitle: 'Phân công bác sĩ trực tiếp theo ca',
      url: '/#schedules?tab=daily',
      iconType: 'clock',
      isEmergency: false,
    },
    {
      enabled: true,
      title: 'Tab Lịch đính kèm',
      subtitle: 'Bản ảnh chụp / tệp Excel lịch trực',
      url: '/#schedules?tab=attachments',
      iconType: 'paperclip',
      isEmergency: false,
    },
    {
      enabled: true,
      title: 'Trang Lịch trực cấp cứu 24/24',
      subtitle: 'Xem danh sách lịch trực cấp cứu mới nhất',
      url: '/lich-kham?type=emergency',
      iconType: 'ambulance',
      isEmergency: true,
    },
    {
      enabled: true,
      title: 'Trang Lịch khám bệnh tuần',
      subtitle: 'Bộ lọc chuyên mục Lịch khám theo tuần',
      url: '/lich-kham?type=weekly',
      iconType: 'fileText',
      isEmergency: false,
    },
  ]

  const rawLinks = Array.isArray(scheduleLinks?.links) && scheduleLinks.links.length > 0
    ? scheduleLinks.links
    : defaultLinks

  const activeLinks = rawLinks.filter((l: any) => l?.enabled !== false && l?.title?.trim())

  // Danh sách mốc giờ thông báo (chỉ lấy các mốc có enabled !== false)
  const activeMilestones = Array.isArray(announcement?.milestones)
    ? announcement.milestones.filter((ms: any) => ms?.enabled !== false && ms?.time?.trim())
    : []

  // Danh sách dòng lưu ý
  const defaultNotes = [
    {
      enabled: true,
      boldPrefix: 'Giấy tờ cần mang theo:',
      content: 'Căn cước công dân gắn chip (hoặc ứng dụng VNeID mức 2 tích hợp thẻ BHYT), thẻ BHYT giấy (nếu chưa tích hợp), sổ khám bệnh và các đơn thuốc/kết quả xét nghiệm cũ (nếu có).',
    },
    {
      enabled: true,
      boldPrefix: 'Lưu ý trước khi làm xét nghiệm máu:',
      content: 'Người bệnh nên nhịn ăn sáng (có thể uống ít nước lọc) để đảm bảo độ chính xác cho các chỉ số đường huyết, mỡ máu, chức năng gan thận.',
    },
    {
      enabled: true,
      boldPrefix: 'Hỗ trợ & Hướng dẫn:',
      content: `Luôn có nhân viên Chăm sóc khách hàng và Đoàn viên thanh niên trực tiếp hỗ trợ tại sảnh chính tiếp đón bệnh nhân. Đường dây nóng bệnh viện: ${hotline}.`,
    },
  ]

  const rawNotes = Array.isArray(notes?.items) && notes.items.length > 0
    ? notes.items
    : defaultNotes

  const activeNotes = rawNotes.filter((n: any) => n?.enabled !== false && (n?.content?.trim() || n?.boldPrefix?.trim()))

  return (
    <>
      <SiteHeader />
      <main className="workingHoursPage">
        {/* 1. HERO BANNER (QUẢN LÝ NỀN, ẢNH NỀN, MÀU SẮC TỪ ADMIN) */}
        {(() => {
          const bgType = hero?.bgType || 'gradient'
          const bgGradient = hero?.bgGradient || 'blue-teal'
          const bgImageUrl = typeof hero?.bgImage === 'object' && hero?.bgImage?.url ? hero?.bgImage?.url : ''
          const overlayClass = hero?.overlayOpacity === 'dark' ? 'dark' : hero?.overlayOpacity === 'light' ? 'light' : 'medium'
          const titleSizeClass = hero?.titleSize === 'compact' ? 'size-compact' : hero?.titleSize === 'large' ? 'size-large' : 'size-default'
          const titleColorClass = hero?.titleColor === 'yellow' ? 'color-yellow' : hero?.titleColor === 'cyan' ? 'color-cyan' : 'color-white'

          const heroStyle: React.CSSProperties = {}
          if (bgType === 'image' && bgImageUrl) {
            heroStyle.backgroundImage = `url(${bgImageUrl})`
            heroStyle.backgroundSize = 'cover'
            heroStyle.backgroundPosition = 'center center'
          } else if (bgType === 'solid') {
            heroStyle.background = '#0369a1'
          }

          return (
            <section
              className={`whHero ${bgType === 'gradient' ? `grad-${bgGradient}` : ''}`}
              style={heroStyle}
            >
              <div className={`whHeroOverlay ${overlayClass}`} />
              <div className="container">
                <div className="whHeroInner">
                  {hero?.badgeText && (
                    <span className="whBadge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {hero.badgeText}
                    </span>
                  )}
                  <h1 className={`${titleSizeClass} ${titleColorClass}`}>
                    {hero?.title || 'Thời gian Tiếp nhận & Khám chữa bệnh'}
                  </h1>
                  {hero?.slogan && (
                    <p className="whSlogan">
                      {hero.slogan}
                    </p>
                  )}
                  <div className="whHeroActions">
                    {hero?.showPrimaryBtn !== false && (
                      <a href={hero?.primaryBtnLink || '#kham-benh'} className="whBtnPrimary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {hero?.primaryBtnText || 'Xem khung giờ khám mới'}
                      </a>
                    )}
                    {hero?.showSecondaryBtn !== false && (
                      <a href={hero?.secondaryBtnLink || '/lich-kham'} className="whBtnSecondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        {hero?.secondaryBtnText || 'Tra cứu lịch trực & phân công'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )
        })()}

        {/* 2. NỘI DUNG CHI TIẾT */}
        <div className="whContainer">
          {/* KHỐI THÔNG BÁO ĐIỀU CHỈNH THỜI GIAN TIẾP NHẬN & KHÁM BỆNH TỪ 10/08/2026 */}
          {announcement?.enabled !== false && (
            <div className="whAnnouncementCard">
              <div className="whAnnouncementHeader">
                <div className="whAnnouncementBadge">
                  <span className="whAnnouncementPulse" />
                  {announcement?.badge || 'THÔNG BÁO ĐIỀU CHỈNH THỜI GIAN TIẾP NHẬN & KHÁM BỆNH'}
                </div>
                {announcement?.effectiveDate && (
                  <div className="whAnnouncementDate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{announcement.effectiveDate}</span>
                  </div>
                )}
              </div>

              {announcement?.introText && (
                <p className="whAnnouncementIntro">{announcement.introText}</p>
              )}

              {activeMilestones.length > 0 && (
                <div className="whMilestonesGrid">
                  {activeMilestones.map((ms: any, mIdx: number) => {
                    const alignStyle = ms.textAlign ? { textAlign: ms.textAlign } : undefined
                    const titleColorClass = ms.titleColor === 'green' ? 'color-green' : ms.titleColor === 'navy' ? 'color-navy' : ms.titleColor === 'red' ? 'color-red' : ''
                    const titleSizeClass = ms.titleSize === 'large' ? 'size-large' : ms.titleSize === 'xlarge' ? 'size-xlarge' : ''
                    const descColorClass = ms.descColor === 'black' ? 'color-black' : ms.descColor === 'navy' ? 'color-navy' : ''
                    const descSizeClass = ms.descSize === 'large' ? 'size-large' : ''

                    return (
                      <div
                        key={ms.id || mIdx}
                        className={`whMilestoneCard ${ms.highlight ? 'highlight' : ''}`}
                        style={alignStyle}
                      >
                        <div className="whMilestoneTop">
                          <div className="whMilestoneTimeBadge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{ms.time}</span>
                          </div>
                          {ms.highlight && <span className="whMilestoneTag">Ưu tiên phục vụ sớm</span>}
                        </div>
                        <h4 className={`whMilestoneTitle ${titleColorClass} ${titleSizeClass}`}>{ms.title}</h4>
                        {ms.desc && (
                          <div className={`whMilestoneDesc ${descColorClass} ${descSizeClass}`} style={alignStyle}>
                            {ms.desc.split('\n').map((line: string, lIdx: number) => (
                              <div key={lIdx} className="whMilestoneLine">
                                {line}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {announcement?.closingText && (
                <div className="whAnnouncementClosing">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <p>{announcement.closingText}</p>
                </div>
              )}
            </div>
          )}

          {/* BANNER CẤP CỨU 24/7 (Có thể bật/tắt trong Admin) */}
          {emergency?.enabled !== false && (
            <div className="whEmergencyBanner">
              <div className="whEmergencyLeft" style={emergency?.textAlign ? { textAlign: emergency.textAlign } : undefined}>
                <div className="whEmergencyIconWrap">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <div>
                  <h2 className={emergency?.titleSize === 'large' ? 'size-large' : emergency?.titleSize === 'xlarge' ? 'size-xlarge' : ''}>
                    {emergency?.title || 'KHOA CẤP CỨU HOẠT ĐỘNG 24/24 (24/7)'}
                  </h2>
                  <p className={emergency?.descSize === 'large' ? 'size-large' : ''} style={{ whiteSpace: 'pre-line' }}>
                    {emergency?.description || 'Tiếp nhận, xử trí cấp cứu mọi trường hợp khẩn cấp liên tục tất cả các ngày trong tuần, thứ Bảy, Chủ Nhật và ngày Lễ.'}
                  </p>
                </div>
              </div>
              <a href={`tel:${emergencyHotline.replace(/\D/g, '')}`} className="whEmergencyCallBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.19 2.2z" />
                </svg>
                <span>{emergency?.buttonLabel || `HOTLINE CẤP CỨU: ${emergencyHotline}`}</span>
              </a>
            </div>
          )}

          {/* GRID CÁC KHUNG GIỜ LÀM VIỆC (QUẢN LÝ ĐỘNG TỪ ADMIN) */}
          {activeDepartments.length > 0 && (
            <div className="whGrid" id="kham-benh">
              {activeDepartments.map((dept: any, idx: number) => {
                const colorClass = dept.badgeColor === 'teal' ? 'teal' : dept.badgeColor === 'amber' ? 'amber' : ''
                const timeRows = Array.isArray(dept.timeRows) ? dept.timeRows : []
                const alignStyle = dept.textAlign ? { textAlign: dept.textAlign } : undefined
                const titleColorClass = dept.titleColor === 'navy' ? 'color-navy' : dept.titleColor === 'blue' ? 'color-blue' : dept.titleColor === 'green' ? 'color-green' : dept.titleColor === 'red' ? 'color-red' : dept.titleColor === 'slate' ? 'color-slate' : ''
                const titleSizeClass = dept.titleSize === 'small' ? 'size-small' : dept.titleSize === 'large' ? 'size-large' : dept.titleSize === 'xlarge' ? 'size-xlarge' : ''
                const noteColorClass = dept.noteColor === 'navy' ? 'color-navy' : dept.noteColor === 'green' ? 'color-green' : dept.noteColor === 'red' ? 'color-red' : ''
                const noteSizeClass = dept.noteSize === 'large' ? 'size-large' : ''

                return (
                  <div className="whCard" key={dept.id || idx}>
                    <div className="whCardHeader">
                      <div className={`whCardIconWrap ${colorClass}`}>
                        {renderDepartmentIcon(dept.iconType, dept.customIconText)}
                      </div>
                      <div className="whCardTitle">
                        <h3 className={`${titleColorClass} ${titleSizeClass}`} style={alignStyle}>{dept.title}</h3>
                        {dept.subtitle && <span style={alignStyle}>{dept.subtitle}</span>}
                      </div>
                    </div>

                    {timeRows.length > 0 && (
                      <div className="whTimeRows">
                        {timeRows.map((row: any, rIdx: number) => (
                          <div
                            key={row.id || rIdx}
                            className={`whTimeRow ${row.highlight ? 'highlight' : ''}`}
                          >
                            <span className="whTimeLabel">{row.label}</span>
                            <span className="whTimeValue">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {dept.note && (
                      <div className={`whCardNote ${noteColorClass} ${noteSizeClass}`} style={alignStyle}>
                        {dept.note}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* 3. SECTION ĐIỀU HƯỚNG LINK CHÍNH XÁC SANG CÁC TAB LỊCH KHÁM (QUẢN LÝ ĐỘNG TỪ ADMIN) */}
          {scheduleLinks?.enabled !== false && activeLinks.length > 0 && (
            <section className="whScheduleLinksSection">
              <div className="whScheduleLinksHeader">
                <h2>{scheduleLinks?.title || 'Tra cứu Lịch phân công & Trực theo từng chuyên mục'}</h2>
                {scheduleLinks?.description && <p>{scheduleLinks.description}</p>}
              </div>
              <div className="whLinksGrid">
                {activeLinks.map((link: any, idx: number) => {
                  const linkAlignStyle = link.textAlign ? { textAlign: link.textAlign } : undefined
                  const linkColorClass = link.titleColor === 'blue' ? 'color-blue' : link.titleColor === 'navy' ? 'color-navy' : link.titleColor === 'red' ? 'color-red' : ''
                  const linkSizeClass = link.titleSize === 'large' ? 'size-large' : ''

                  return (
                    <a
                      key={link.id || idx}
                      href={link.url}
                      className="whLinkCard"
                    >
                      <div
                        className="whLinkIcon"
                        style={link.isEmergency ? { background: '#fee2e2', color: '#dc2626' } : undefined}
                      >
                        {renderLinkIcon(link.iconType)}
                      </div>
                      <div className="whLinkText" style={linkAlignStyle}>
                        <strong className={`${linkColorClass} ${linkSizeClass}`} style={linkAlignStyle}>{link.title}</strong>
                        {link.subtitle && <span style={linkAlignStyle}>{link.subtitle}</span>}
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* 4. LƯU Ý CHO NGƯỜI BỆNH KHI ĐẾN KHÁM (QUẢN LÝ ĐỘNG TỪ ADMIN) */}
          {notes?.enabled !== false && activeNotes.length > 0 && (
            <div className="whNotesBox">
              <div className="whNotesTitle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{notes?.title || 'LƯU Ý DÀNH CHO NGƯỜI BỆNH VÀ THÂN NHÂN'}</span>
              </div>
              <ul className="whNotesList">
                {activeNotes.map((item: any, idx: number) => {
                  const alignStyle = item.textAlign ? { textAlign: item.textAlign } : undefined
                  const colorClass = item.textColor === 'black' ? 'color-black' : item.textColor === 'navy' ? 'color-navy' : item.textColor === 'red' ? 'color-red' : ''
                  const sizeClass = item.textSize === 'large' ? 'size-large' : ''

                  return (
                    <li key={item.id || idx} className={`${colorClass} ${sizeClass}`} style={alignStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="whNoteContentText" style={alignStyle}>
                        {item.boldPrefix && <strong>{item.boldPrefix} </strong>}
                        {item.content}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
