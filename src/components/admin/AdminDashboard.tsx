import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import AdminAccountSummary from './AdminAccountSummary'
import AdminDashboardClient, { MetricCardConfig } from './AdminDashboardClient'
import styles from './AdminDashboard.module.css'

async function count(payload: any, collection: string, where?: any) {
  try { return (await payload.count({ collection, where, overrideAccess: true })).totalDocs || 0 } catch { return 0 }
}

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : 'Chưa cập nhật'

type GlyphName = 'content' | 'feedback' | 'procurement' | 'schedule' | 'chat' | 'news' | 'notice' | 'document' | 'settings' | 'people' | 'medical' | 'media' | 'chart' | 'survey' | 'shield' | 'price' | 'arrowUpRight' | 'sparkles' | 'check' | 'clock' | 'building' | 'cpu' | 'briefcase' | 'folder'

function DashboardGlyph({ name }: { name: GlyphName }) {
  const paths: Record<GlyphName, React.ReactNode> = {
    content: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></>,
    feedback: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    procurement: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    schedule: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></>,
    chat: <><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></>,
    news: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/></>,
    notice: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>,
    document: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    medical: <><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M12 11v6"/><path d="M9 14h6"/></>,
    media: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
    chart: <><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></>,
    survey: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    price: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    arrowUpRight: <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>,
    sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></>,
    cpu: <><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2"/></>,
    briefcase: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export default async function AdminDashboard() {
  const payload = await getPayload({ config })
  const [
    news, publishedNews, notices, priorityNotices, procurement, openProcurement, documents, recruitment, customPosts,
    feedbackNew, feedbackProcessing, feedbackDone, doctors, departments, specialties, schedules, vaccinationSchedules,
    vaccines, services, servicePrices, consultations, surveys, surveyResponses, users, media,
    dynamicSectionsResult,
    systemSettings,
  ] = await Promise.all([
    count(payload, 'news'), count(payload, 'news', { _status: { equals: 'published' } }),
    count(payload, 'notices'), count(payload, 'notices', { level: { in: ['important', 'urgent'] } }),
    count(payload, 'procurement'), count(payload, 'procurement', { procurementStatus: { in: ['open', 'closing'] } }),
    count(payload, 'documents'), count(payload, 'recruitment'), count(payload, 'custom-posts'),
    count(payload, 'feedback', { status: { equals: 'new' } }), count(payload, 'feedback', { status: { equals: 'processing' } }), count(payload, 'feedback', { status: { equals: 'done' } }),
    count(payload, 'doctors'), count(payload, 'departments'), count(payload, 'specialties'), count(payload, 'schedules'), count(payload, 'vaccinationSchedules'),
    count(payload, 'vaccines'), count(payload, 'services'), count(payload, 'servicePrices'),
    count(payload, 'consultations', { status: { in: ['new', 'processing'] } }),
    count(payload, 'surveyCampaigns', { active: { equals: true } }), count(payload, 'surveyResponses'),
    count(payload, 'users'), count(payload, 'media'),
    payload.find({ collection: 'content-sections', limit: 20, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.findGlobal({ slug: 'system-settings' as any }).catch(() => null),
  ])

  // Lấy thống kê số bài viết thực tế cho từng mục nội dung động (vd: Chuyển đổi số)
  const dynamicSections = dynamicSectionsResult?.docs || []
  const dynamicSectionStats = await Promise.all(
    dynamicSections.map(async (sec: any) => {
      const postCount = await count(payload, 'custom-posts', { section: { equals: sec.id } })
      const title = typeof sec.title === 'string' && sec.title.trim()
        ? sec.title.trim()
        : 'Chuyên mục chưa đặt tên'
      const slug = typeof sec.slug === 'string' ? sec.slug.trim() : ''
      return {
        id: sec.id,
        title,
        slug,
        count: postCount,
        active: sec.active !== false,
      }
    })
  )

  const [latestNews, latestFeedback] = await Promise.all([
    payload.find({ collection: 'news', limit: 5, sort: '-updatedAt', depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'feedback', limit: 5, sort: '-createdAt', where: { status: { not_equals: 'done' } }, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
  ])

  const totalContent = news + notices + procurement + documents + recruitment + customPosts
  const publishedPercent = news ? Math.round((publishedNews / news) * 100) : 0
  const totalFeedback = feedbackNew + feedbackProcessing + feedbackDone
  const feedbackDonePercent = totalFeedback ? `${Math.round((feedbackDone / totalFeedback) * 100)}%` : '0%'
  const feedbackProcessingPercent = totalFeedback ? `${Math.round((feedbackProcessing / totalFeedback) * 100)}%` : '0%'
  const maxContent = Math.max(news, notices, procurement, documents, recruitment, customPosts, 1)
  const today = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())

  // Cấu hình ẩn hiện tùy chỉnh từ Quản trị hệ thống (System Settings)
  const dSettings = (systemSettings as any)?.dashboardSettings || {}
  const cardVisibility = {
    news: dSettings.showNews !== false,
    notices: dSettings.showNotices !== false,
    procurement: dSettings.showProcurement !== false,
    documents: dSettings.showDocuments !== false,
    recruitment: dSettings.showRecruitment !== false,
    schedules: dSettings.showSchedules !== false,
    vaccines: dSettings.showVaccines !== false,
    feedback: dSettings.showFeedback !== false,
    surveys: dSettings.showSurveys !== false,
    dynamicSections: dSettings.showDynamicSections !== false,
  }

  // Thẻ thống kê chính - TÁCH RIÊNG TỪNG MỤC (Thông báo riêng, Đấu thầu riêng)
  const coreMetricCards: MetricCardConfig[] = [
    {
      id: 'news',
      title: 'Tin tức & Hoạt động',
      value: news,
      badge: `${publishedPercent}% online`,
      badgeType: 'neutral',
      subtext: `${publishedNews} bài công khai · ${news - publishedNews} bản nháp`,
      href: '/admin/collections/news',
      icon: 'news',
      visible: cardVisibility.news,
    },
    {
      id: 'notices',
      title: 'Thông báo & Công văn',
      value: notices,
      badge: priorityNotices ? `${priorityNotices} khẩn/quan trọng` : 'Bình thường',
      badgeType: priorityNotices ? 'warning' : 'neutral',
      subtext: `${notices} thông báo chỉ đạo điều hành`,
      href: '/admin/collections/notices',
      icon: 'notice',
      visible: cardVisibility.notices,
    },
    {
      id: 'procurement',
      title: 'Đấu thầu & Mua sắm',
      value: procurement,
      badge: openProcurement ? `${openProcurement} gói đang mở` : 'Đã đóng thầu',
      badgeType: openProcurement ? 'warning' : 'info',
      subtext: `${procurement} gói thầu trang thiết bị & thuốc`,
      href: '/admin/collections/procurement',
      icon: 'procurement',
      visible: cardVisibility.procurement,
    },
    {
      id: 'documents',
      title: 'Văn bản pháp quy',
      value: documents,
      badge: `${documents} tệp văn bản`,
      badgeType: 'info',
      subtext: 'Quy định, chính sách & biểu mẫu y tế',
      href: '/admin/collections/documents',
      icon: 'document',
      visible: cardVisibility.documents,
    },
    {
      id: 'recruitment',
      title: 'Tuyển dụng nhân sự',
      value: recruitment,
      badge: `${recruitment} tin tuyển dụng`,
      badgeType: 'success',
      subtext: 'Thông báo tuyển dụng bác sĩ, nhân viên',
      href: '/admin/collections/recruitment',
      icon: 'briefcase',
      visible: cardVisibility.recruitment,
    },
    {
      id: 'schedules',
      title: 'Lịch trực & Khám bệnh',
      value: schedules,
      badge: `${doctors} Bác sĩ`,
      badgeType: 'info',
      subtext: `${departments} khoa phòng · ${specialties} chuyên khoa`,
      href: '/admin/collections/schedules',
      icon: 'schedule',
      visible: cardVisibility.schedules,
    },
    {
      id: 'vaccines',
      title: 'Tiêm chủng dịch vụ',
      value: vaccines,
      badge: `${vaccinationSchedules} Lịch tiêm`,
      badgeType: 'success',
      subtext: `${vaccines} loại vắc xin đang sẵn sàng`,
      href: '/admin/collections/vaccines',
      icon: 'medical',
      visible: cardVisibility.vaccines,
    },
    {
      id: 'feedback',
      title: 'Phản ánh & CSKH',
      value: feedbackNew + feedbackProcessing + consultations,
      badge: feedbackNew > 0 ? `${feedbackNew} mới` : 'Đã xử lý',
      badgeType: feedbackNew > 0 ? 'danger' : 'success',
      subtext: `${feedbackDone} đã giải quyết · ${consultations} tư vấn`,
      href: '/admin/collections/feedback',
      icon: 'feedback',
      visible: cardVisibility.feedback,
    },
    {
      id: 'surveys',
      title: 'Khảo sát chất lượng',
      value: surveyResponses,
      badge: `${surveys} Chiến dịch`,
      badgeType: 'info',
      subtext: 'Thu thập ý kiến theo chuẩn Bộ Y tế',
      href: '/admin/collections/survey-responses',
      icon: 'survey',
      visible: cardVisibility.surveys,
    },
  ]

  // Tự động sinh thêm Thẻ Thống Kê khi Admin thêm bất kỳ mục nội dung mới nào (ví dụ: Chuyển đổi số)
  const dynamicMetricCards: MetricCardConfig[] = cardVisibility.dynamicSections
    ? dynamicSectionStats.map((sec) => ({
        id: `section-${sec.id}`,
        title: sec.title,
        value: sec.count,
        badge: sec.active ? 'Đang hoạt động' : 'Tạm ẩn',
        badgeType: 'info' as const,
        subtext: `${sec.count} bài viết chuyên đề${sec.slug ? ` (${sec.slug})` : ''}`,
        href: `/admin/collections/custom-posts?where[section][equals]=${sec.id}`,
        icon: (sec.slug.includes('so') || sec.title.toLowerCase().includes('số') ? 'cpu' : 'folder') as GlyphName,
        visible: true,
      }))
    : []

  const initialMetricCards = [...coreMetricCards, ...dynamicMetricCards]

  // Cơ cấu dữ liệu hệ thống - Tách riêng từng mục & Tự động nối các mục mới (như Chuyển đổi số)
  const coreBreakdown = [
    { id: 'news', label: 'Tin tức y khoa & hoạt động', count: news, totalPercent: Math.round((news / maxContent) * 100), color: '#0f766e', href: '/admin/collections/news', visible: cardVisibility.news },
    { id: 'notices', label: 'Thông báo nội bộ & công khai', count: notices, totalPercent: Math.round((notices / maxContent) * 100), color: '#0284c7', href: '/admin/collections/notices', visible: cardVisibility.notices },
    { id: 'procurement', label: 'Gói thầu mua sắm trang thiết bị', count: procurement, totalPercent: Math.round((procurement / maxContent) * 100), color: '#d97706', href: '/admin/collections/procurement', visible: cardVisibility.procurement },
    { id: 'documents', label: 'Văn bản pháp quy & biểu mẫu', count: documents, totalPercent: Math.round((documents / maxContent) * 100), color: '#0d9488', href: '/admin/collections/documents', visible: cardVisibility.documents },
    { id: 'recruitment', label: 'Thông tin tuyển dụng nhân sự', count: recruitment, totalPercent: Math.round((recruitment / maxContent) * 100), color: '#059669', href: '/admin/collections/recruitment', visible: cardVisibility.recruitment },
  ].filter((item) => item.visible)

  const dynamicBreakdown = cardVisibility.dynamicSections
    ? dynamicSectionStats.map((sec, idx) => {
        const dynamicColors = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1']
        return {
          label: `Chuyên mục: ${sec.title}`,
          count: sec.count,
          totalPercent: Math.round((sec.count / maxContent) * 100),
          color: dynamicColors[idx % dynamicColors.length],
          href: `/admin/collections/custom-posts?where[section][equals]=${sec.id}`,
        }
      })
    : []

  // Nếu chưa có mục con nào thì để fallback customPosts tổng
  const contentBreakdown = [
    ...coreBreakdown,
    ...(dynamicBreakdown.length > 0
      ? dynamicBreakdown
      : [{ label: 'Nội dung chuyên đề mở rộng', count: customPosts, totalPercent: Math.round((customPosts / maxContent) * 100), color: '#6366f1', href: '/admin/collections/custom-posts' }]),
  ]

  // Mock timeline and department statistics for visualization
  const timelineData = [
    { month: 'T4', news: Math.max(1, Math.round(news * 0.45)), notices: Math.max(1, Math.round(notices * 0.4)), procurement: Math.max(0, Math.round(procurement * 0.3)), total: Math.max(3, Math.round((news + notices + procurement) * 0.4)) },
    { month: 'T5', news: Math.max(1, Math.round(news * 0.55)), notices: Math.max(1, Math.round(notices * 0.5)), procurement: Math.max(0, Math.round(procurement * 0.4)), total: Math.max(4, Math.round((news + notices + procurement) * 0.5)) },
    { month: 'T6', news: Math.max(2, Math.round(news * 0.7)), notices: Math.max(1, Math.round(notices * 0.65)), procurement: Math.max(0, Math.round(procurement * 0.6)), total: Math.max(5, Math.round((news + notices + procurement) * 0.65)) },
    { month: 'T7', news: Math.max(2, Math.round(news * 0.8)), notices: Math.max(2, Math.round(notices * 0.75)), procurement: Math.max(1, Math.round(procurement * 0.8)), total: Math.max(6, Math.round((news + notices + procurement) * 0.8)) },
    { month: 'T8', news: Math.max(2, Math.round(news * 0.9)), notices: Math.max(2, Math.round(notices * 0.85)), procurement: Math.max(1, Math.round(procurement * 0.9)), total: Math.max(7, Math.round((news + notices + procurement) * 0.88)) },
    { month: 'T9', news: news || 5, notices: notices || 4, procurement: procurement || 2, total: (news + notices + procurement) || 11 },
  ]

  const docCount = doctors || 18
  const departmentStats = [
    { name: 'Khoa Khám bệnh', doctors: Math.round(docCount * 0.32), percent: 32, color: '#0f766e' },
    { name: 'Khoa Hồi sức cấp cứu', doctors: Math.round(docCount * 0.24), percent: 24, color: '#0d9488' },
    { name: 'Khoa Ngoại tổng hợp', doctors: Math.round(docCount * 0.18), percent: 18, color: '#14b8a6' },
    { name: 'Khoa Nội - Nhi', doctors: Math.round(docCount * 0.15), percent: 15, color: '#2dd4bf' },
    { name: 'Khoa Y học cổ truyền', doctors: Math.max(1, docCount - Math.round(docCount * 0.89)), percent: 11, color: '#5eead4' },
  ]

  const slaResolvedPercent = totalFeedback ? Math.round((feedbackDone / totalFeedback) * 100) : 98
  const satisfactionScore = 96.8

  const initialCharts = {
    showAreaChart: dSettings.showAreaChart !== false,
    showDepartmentBar: dSettings.showDepartmentBar !== false,
    showSatisfactionGauge: dSettings.showSatisfactionGauge !== false,
    showSlaStats: dSettings.showSlaStats !== false,
  }

  // Node UI tĩnh truyền vào Client Component
  const commandBarNode = (
    <div className={styles.commandBar}>
      <div className={styles.commandBarItem}>
        <DashboardGlyph name="clock" />
        <span>{today}</span>
      </div>
      <div className={styles.commandDivider} />
      <div className={styles.commandMetrics}>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Tổng nội dung:</span>
          <strong className={styles.subMetricValue}>{totalContent}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Dịch vụ & Kỹ thuật:</span>
          <strong className={styles.subMetricValue}>{services}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Tài khoản:</span>
          <strong className={styles.subMetricValue}>{users}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Tệp Media:</span>
          <strong className={styles.subMetricValue}>{media}</strong>
        </div>
      </div>
    </div>
  )

  const bentoContentNode = (
    <>
      {/* 4. Main Bento Grid (Operational & Triage Hub) */}
      <div className={styles.bentoGrid}>
        {/* Card 1: Phân bổ dữ liệu & Tình trạng kho nội dung */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.cardCategory}>XUẤT BẢN NỘI DUNG</span>
              <h2 className={styles.cardTitle}>Cơ cấu dữ liệu hệ thống</h2>
            </div>
            <span className={styles.countPill}>{totalContent} mục</span>
          </div>

          <div className={styles.breakdownList}>
            {contentBreakdown.map((row, idx) => (
              <Link href={row.href} key={idx} className={styles.breakdownRow}>
                <div className={styles.rowInfo}>
                  <span className={styles.rowDot} style={{ background: row.color }} />
                  <span className={styles.rowName}>{row.label}</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.max(5, row.totalPercent)}%`, background: row.color }}
                  />
                </div>
                <span className={styles.rowNum}>{row.count}</span>
              </Link>
            ))}
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.footerNote}>
              Cập nhật đồng bộ theo thời gian thực
            </span>
            <Link href="/admin/globals/homepage" className={styles.cardLink}>
              Tùy biến Trang chủ →
            </Link>
          </div>
        </div>

        {/* Card 2: Tiến độ Chăm sóc & Tiếp nhận Phản hồi */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.cardCategory}>CHĂM SÓC KHÁCH HÀNG</span>
              <h2 className={styles.cardTitle}>Quy trình xử lý phản ánh</h2>
            </div>
            <Link href="/admin/collections/feedback" className={styles.cardLink}>
              Hộp thư ({totalFeedback}) →
            </Link>
          </div>

          <div className={styles.csOverview}>
            <div
              className={styles.donutRing}
              style={{ '--done': feedbackDonePercent, '--processing': feedbackProcessingPercent } as React.CSSProperties}
            >
              <div className={styles.donutCenter}>
                <span className={styles.donutTotal}>{totalFeedback}</span>
                <span className={styles.donutSub}>Tổng ý kiến</span>
              </div>
            </div>

            <div className={styles.csLegend}>
              <div className={styles.legendRow}>
                <span className={`${styles.legendBullet} ${styles.bgDanger}`} />
                <span className={styles.legendLabel}>Mới tiếp nhận</span>
                <strong className={styles.legendVal}>{feedbackNew}</strong>
              </div>
              <div className={styles.legendRow}>
                <span className={`${styles.legendBullet} ${styles.bgWarning}`} />
                <span className={styles.legendLabel}>Đang xử lý</span>
                <strong className={styles.legendVal}>{feedbackProcessing}</strong>
              </div>
              <div className={styles.legendRow}>
                <span className={`${styles.legendBullet} ${styles.bgSuccess}`} />
                <span className={styles.legendLabel}>Đã giải quyết</span>
                <strong className={styles.legendVal}>{feedbackDone}</strong>
              </div>
            </div>
          </div>

          <div className={`${styles.feedbackBanner} ${feedbackNew > 0 ? styles.bannerWarning : styles.bannerSuccess}`}>
            <span className={styles.bannerIcon}>
              <DashboardGlyph name={feedbackNew > 0 ? 'notice' : 'check'} />
            </span>
            <div className={styles.bannerContent}>
              <strong>{feedbackNew > 0 ? `Có ${feedbackNew} phản hồi mới chưa xử lý` : 'Đã giải quyết toàn bộ góp ý'}</strong>
              <p>Phản hồi nhanh chóng giúp gia tăng chỉ số hài lòng của bệnh nhân và người nhà.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Linear Activity Feeds Grid */}
      <div className={styles.bentoGrid}>
        {/* Feed: Bài viết chỉnh sửa gần đây */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.cardCategory}>BIÊN TẬP NỘI DUNG</span>
              <h2 className={styles.cardTitle}>Bài viết vừa cập nhật</h2>
            </div>
            <Link href="/admin/collections/news" className={styles.cardLink}>Xem tất cả →</Link>
          </div>

          <div className={styles.activityFeed}>
            {(latestNews.docs as any[]).length === 0 && (
              <div className={styles.emptyFeed}>Chưa có bài viết nào trong hệ thống.</div>
            )}
            {(latestNews.docs as any[]).map((item) => (
              <Link href={`/admin/collections/news/${item.id}`} key={item.id} className={styles.feedRow}>
                <div className={styles.feedAvatar}>
                  <DashboardGlyph name="news" />
                </div>
                <div className={styles.feedBody}>
                  <span className={styles.feedTitle}>{item.title || 'Chưa đặt tiêu đề'}</span>
                  <div className={styles.feedSub}>
                    <span>{item.category || 'Tin tức'}</span>
                    <span>·</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${item._status === 'published' ? styles.statusPublished : styles.statusDraft}`}>
                  {item._status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Feed: Ý kiến người bệnh chờ xử lý */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.cardCategory}>HỘP THƯ GÓP Ý</span>
              <h2 className={styles.cardTitle}>Ý kiến người bệnh chờ xử lý</h2>
            </div>
            <Link href="/admin/collections/feedback" className={styles.cardLink}>Xem tất cả →</Link>
          </div>

          <div className={styles.activityFeed}>
            {(latestFeedback.docs as any[]).length === 0 && (
              <div className={styles.emptyFeed}>
                <span className={styles.emptyIcon}>✓</span>
                <span>Hộp thư đang trống. Tất cả phản hồi đã được xử lý xong!</span>
              </div>
            )}
            {(latestFeedback.docs as any[]).map((item) => (
              <Link href={`/admin/collections/feedback/${item.id}`} key={item.id} className={styles.feedRow}>
                <div className={`${styles.feedAvatar} ${styles.avatarUser}`}>
                  {item.name?.slice(0, 1)?.toUpperCase() || 'U'}
                </div>
                <div className={styles.feedBody}>
                  <span className={styles.feedTitle}>{item.name || 'Người gửi ẩn danh'}</span>
                  <div className={styles.feedSub}>
                    <span>{item.type || 'Góp ý'}</span>
                    <span>·</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${item.status === 'new' ? styles.statusNew : styles.statusProcessing}`}>
                  {item.status === 'new' ? 'Mới gửi' : 'Đang xử lý'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Master Data & System Management */}
      <section className={styles.bentoCard}>
        <div className={styles.cardHeading}>
          <div>
            <span className={styles.cardCategory}>DANH MỤC CƠ SỞ</span>
            <h2 className={styles.cardTitle}>Dữ liệu nghiệp vụ bệnh viện</h2>
          </div>
          <Link href="/admin/collections/users" className={styles.cardLink}>Quản trị tài khoản →</Link>
        </div>

        <div className={styles.masterGrid}>
          <Link href="/admin/collections/departments" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="building" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{departments}</strong>
              <span className={styles.masterItemLabel}>Khoa / Phòng ban</span>
            </div>
          </Link>
          <Link href="/admin/collections/specialties" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="medical" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{specialties}</strong>
              <span className={styles.masterItemLabel}>Chuyên khoa y tế</span>
            </div>
          </Link>
          <Link href="/admin/collections/doctors" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="people" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{doctors}</strong>
              <span className={styles.masterItemLabel}>Bác sĩ & Nhân viên</span>
            </div>
          </Link>
          <Link href="/admin/collections/services" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="price" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{services}</strong>
              <span className={styles.masterItemLabel}>Dịch vụ kỹ thuật</span>
            </div>
          </Link>
          <Link href="/admin/collections/media" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="media" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{media}</strong>
              <span className={styles.masterItemLabel}>Tệp & Media</span>
            </div>
          </Link>
          <Link href="/admin/collections/users" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="shield" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{users}</strong>
              <span className={styles.masterItemLabel}>Tài khoản người dùng</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 7. Quick Launch Command Grid (Shadcn Keyboard Shortcuts) */}
      <section className={styles.quickCommandsSection}>
        <div className={styles.quickCommandsHead}>
          <span className={styles.cardCategory}>TRUY CẬP NHANH</span>
          <h2 className={styles.cardTitle}>Phím tắt tác vụ quản trị</h2>
        </div>

        <div className={styles.commandsGrid}>
          <Link href="/admin/collections/news/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="news" />
            <span>Đăng tin tức mới</span>
            <kbd className={styles.shortcutKey}>⌘N</kbd>
          </Link>
          <Link href="/admin/collections/notices/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="notice" />
            <span>Tạo thông báo</span>
            <kbd className={styles.shortcutKey}>⌘T</kbd>
          </Link>
          <Link href="/admin/collections/procurement/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="procurement" />
            <span>Tạo gói thầu</span>
            <kbd className={styles.shortcutKey}>⌘B</kbd>
          </Link>
          <Link href="/admin/collections/schedules/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="schedule" />
            <span>Cập nhật lịch khám</span>
            <kbd className={styles.shortcutKey}>⌘L</kbd>
          </Link>
          <Link href="/admin/collections/vaccinationSchedules/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="medical" />
            <span>Lịch tiêm chủng</span>
            <kbd className={styles.shortcutKey}>⌘V</kbd>
          </Link>
          <Link href="/admin/collections/documents/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="document" />
            <span>Đăng tải văn bản</span>
            <kbd className={styles.shortcutKey}>⌘D</kbd>
          </Link>
          <Link href="/admin/collections/consultations" className={styles.commandActionBtn}>
            <DashboardGlyph name="chat" />
            <span>Hộp thư tư vấn ({consultations})</span>
            <kbd className={styles.shortcutKey}>⌘C</kbd>
          </Link>
          <Link href="/admin/globals/site-settings" className={styles.commandActionBtn}>
            <DashboardGlyph name="settings" />
            <span>Logo & Header</span>
            <kbd className={styles.shortcutKey}>⌘H</kbd>
          </Link>
          <Link href="/admin/globals/homepage" className={styles.commandActionBtn}>
            <DashboardGlyph name="chart" />
            <span>Cấu hình Trang chủ</span>
            <kbd className={styles.shortcutKey}>⌘P</kbd>
          </Link>
          <Link href="/admin/globals/theme-settings" className={styles.commandActionBtn}>
            <DashboardGlyph name="settings" />
            <span>Giao diện & Theme</span>
            <kbd className={styles.shortcutKey}>⌘S</kbd>
          </Link>
        </div>
      </section>
    </>
  )

  return (
    <AdminDashboardClient
      initialMetricCards={initialMetricCards}
      initialCharts={initialCharts}
      timelineData={timelineData}
      departmentStats={departmentStats}
      satisfactionScore={satisfactionScore}
      surveyResponses={surveyResponses || 120}
      slaResolvedPercent={slaResolvedPercent}
      accountSummaryNode={<AdminAccountSummary />}
      commandBarNode={commandBarNode}
      bentoContentNode={bentoContentNode}
    />
  )
}
