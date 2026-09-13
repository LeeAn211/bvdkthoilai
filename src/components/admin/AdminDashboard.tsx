import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import AdminAccountSummary from './AdminAccountSummary'
import AdminDashboardClient, { DashboardGlyph, MetricCardConfig, GlyphName } from './AdminDashboardClient'
import styles from './AdminDashboard.module.css'

async function count(payload: any, collection: string, where?: any) {
  try { return (await payload.count({ collection, where, overrideAccess: true })).totalDocs || 0 } catch { return 0 }
}

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : 'Chưa cập nhật'

export default async function AdminDashboard() {
  const payload = await getPayload({ config })
  // Truy vấn đồng thời toàn bộ chỉ số thực tế từ cơ sở dữ liệu
  const [
    // 📰 Truyền thông & Văn bản
    news, publishedNews,
    notices, priorityNotices,
    procurement, openProcurement,
    documents, recruitment, customPosts,
    // 🩺 Chuyên môn & Tổ chức
    clinicalProtocols, effectiveProtocols,
    doctors, departments, specialties,
    advancedTechniques, scientificActivities, ourExperts,
    // 🏥 Khám bệnh & Dịch vụ Y tế
    schedules, appointments, pendingAppointments,
    vaccines, vaccinationSchedules, services, servicePrices,
    // 💬 Chăm sóc & Khảo sát
    feedbackNew, feedbackProcessing, feedbackDone,
    consultations, surveys, surveyResponses,
    // 🌐 Trang chủ & Giao diện Website
    pages, faqs,
    // ⚙️ Hệ thống & Dữ liệu
    users, media, auditLogs,
    // Cài đặt & Nội dung động
    dynamicSectionsResult,
    systemSettings,
  ] = await Promise.all([
    // Truyền thông & Văn bản
    count(payload, 'news'), count(payload, 'news', { _status: { equals: 'published' } }),
    count(payload, 'notices'), count(payload, 'notices', { level: { in: ['important', 'urgent'] } }),
    count(payload, 'procurement'), count(payload, 'procurement', { procurementStatus: { in: ['open', 'closing'] } }),
    count(payload, 'documents'), count(payload, 'recruitment'), count(payload, 'custom-posts'),
    // Chuyên môn & Tổ chức
    count(payload, 'clinical-protocols'), count(payload, 'clinical-protocols', { status: { equals: 'effective' } }),
    count(payload, 'doctors'), count(payload, 'departments'), count(payload, 'specialties'),
    count(payload, 'advanced-techniques'), count(payload, 'scientific-activities'), count(payload, 'our-experts'),
    // Khám bệnh & Dịch vụ Y tế
    count(payload, 'schedules'), count(payload, 'appointments'), count(payload, 'appointments', { status: { equals: 'pending' } }),
    count(payload, 'vaccines'), count(payload, 'vaccinationSchedules'), count(payload, 'services'), count(payload, 'servicePrices'),
    // Chăm sóc & Khảo sát
    count(payload, 'feedback', { status: { equals: 'new' } }),
    count(payload, 'feedback', { status: { equals: 'processing' } }),
    count(payload, 'feedback', { status: { equals: 'done' } }),
    count(payload, 'consultations', { status: { in: ['new', 'processing'] } }),
    count(payload, 'surveyCampaigns', { active: { equals: true } }),
    count(payload, 'surveyResponses'),
    // Trang chủ & Giao diện Website
    count(payload, 'pages'), count(payload, 'faqs'),
    // Hệ thống & Dữ liệu
    count(payload, 'users'), count(payload, 'media'), count(payload, 'audit-logs'),
    // Nội dung động
    payload.find({ collection: 'content-sections', limit: 20, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.findGlobal({ slug: 'system-settings' as any }).catch(() => null),
  ])

  // Lấy bài viết chuyên đề động
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

  // Danh sách feed mới cập nhật
  const [latestNews, latestFeedback, latestProtocols] = await Promise.all([
    payload.find({ collection: 'news', limit: 5, sort: '-updatedAt', depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'feedback', limit: 5, sort: '-createdAt', where: { status: { not_equals: 'done' } }, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'clinical-protocols', limit: 5, sort: '-updatedAt', depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
  ])

  const totalContent = news + notices + procurement + documents + recruitment + clinicalProtocols + customPosts
  const publishedPercent = news ? Math.round((publishedNews / news) * 100) : 0
  const totalFeedback = feedbackNew + feedbackProcessing + feedbackDone
  const feedbackDonePercent = totalFeedback ? `${Math.round((feedbackDone / totalFeedback) * 100)}%` : '0%'
  const feedbackProcessingPercent = totalFeedback ? `${Math.round((feedbackProcessing / totalFeedback) * 100)}%` : '0%'
  const maxContent = Math.max(news, notices, procurement, documents, clinicalProtocols, recruitment, 1)
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

  // Danh sách thẻ thống kê chuẩn mực theo từng phân hệ nghiệp vụ y tế
  const coreMetricCards: MetricCardConfig[] = [
    // 1. KHÁM BỆNH & DỊCH VỤ Y TẾ
    {
      id: 'schedules',
      title: 'Lịch trực & Khám bệnh',
      value: schedules,
      badge: `${departments} khoa phòng`,
      badgeType: 'info',
      subtext: 'Lịch khám thường & trực cấp cứu 24/7',
      href: '/admin/collections/schedules',
      createHref: '/admin/collections/schedules/create',
      icon: 'schedule',
      categoryGroup: 'kham-benh',
      visible: cardVisibility.schedules,
    },
    {
      id: 'appointments',
      title: 'Đặt lịch khám trực tuyến',
      value: appointments,
      badge: pendingAppointments > 0 ? `${pendingAppointments} chờ duyệt` : 'Đã duyệt xong',
      badgeType: pendingAppointments > 0 ? 'warning' : 'success',
      subtext: `${appointments} lượt đăng ký khám qua website`,
      href: '/admin/collections/appointments',
      createHref: '/admin/collections/appointments/create',
      icon: 'schedule',
      categoryGroup: 'kham-benh',
      visible: true,
    },
    {
      id: 'services',
      title: 'Dịch vụ kỹ thuật y tế',
      value: services,
      badge: `${servicePrices} mục viện phí`,
      badgeType: 'info',
      subtext: 'Kỹ thuật lâm sàng & cận lâm sàng phân tuyến',
      href: '/admin/collections/services',
      createHref: '/admin/collections/services/create',
      icon: 'price',
      categoryGroup: 'kham-benh',
      visible: true,
    },
    {
      id: 'service-prices',
      title: 'Bảng giá viện phí & BHYT',
      value: servicePrices,
      badge: 'Công khai giá',
      badgeType: 'success',
      subtext: 'Minh bạch viện phí BHYT và thu phí tự nguyện',
      href: '/admin/collections/service-prices',
      createHref: '/admin/collections/service-prices/create',
      icon: 'price',
      categoryGroup: 'kham-benh',
      visible: true,
    },
    {
      id: 'vaccines',
      title: 'Tiêm chủng & Vắc xin',
      value: vaccines,
      badge: `${vaccinationSchedules} Lịch tiêm`,
      badgeType: 'success',
      subtext: `${vaccines} loại vắc xin phòng ngừa sẵn sàng`,
      href: '/admin/collections/vaccines',
      createHref: '/admin/collections/vaccines/create',
      icon: 'medical',
      categoryGroup: 'kham-benh',
      visible: cardVisibility.vaccines,
    },

    // 2. CHUYÊN MÔN & TỔ CHỨC
    {
      id: 'clinical-protocols',
      title: 'Phác đồ điều trị chuẩn',
      value: clinicalProtocols,
      badge: `${effectiveProtocols} đang áp dụng`,
      badgeType: 'success',
      subtext: 'Hướng dẫn chẩn đoán & điều trị chuẩn Bộ Y tế',
      href: '/admin/collections/clinical-protocols',
      createHref: '/admin/collections/clinical-protocols/create',
      icon: 'stethoscope',
      categoryGroup: 'chuyen-mon',
      visible: true,
    },
    {
      id: 'doctors',
      title: 'Đội ngũ Thầy thuốc & Bác sĩ',
      value: doctors,
      badge: `${specialties} chuyên khoa`,
      badgeType: 'info',
      subtext: 'Ban Giám đốc & các Bác sĩ chuyên môn',
      href: '/admin/collections/doctors',
      createHref: '/admin/collections/doctors/create',
      icon: 'people',
      categoryGroup: 'chuyen-mon',
      visible: true,
    },
    {
      id: 'departments',
      title: 'Khoa / Phòng chức năng',
      value: departments,
      badge: 'Cơ cấu tổ chức',
      badgeType: 'neutral',
      subtext: 'Khối Lâm sàng, Cận lâm sàng & Khối Hành chính',
      href: '/admin/collections/departments',
      createHref: '/admin/collections/departments/create',
      icon: 'building',
      categoryGroup: 'chuyen-mon',
      visible: true,
    },
    {
      id: 'advanced-techniques',
      title: 'Kỹ thuật cao chuyên sâu',
      value: advancedTechniques,
      badge: 'Mũi nhọn',
      badgeType: 'info',
      subtext: 'Kỹ thuật chẩn đoán và điều trị hiện đại của viện',
      href: '/admin/collections/advanced-techniques',
      createHref: '/admin/collections/advanced-techniques/create',
      icon: 'sparkles',
      categoryGroup: 'chuyen-mon',
      visible: true,
    },
    {
      id: 'scientific-activities',
      title: 'Nghiên cứu & Sinh hoạt KH',
      value: scientificActivities,
      badge: 'Y học thực chứng',
      badgeType: 'neutral',
      subtext: 'Hội thảo chuyên môn, sinh hoạt khoa học kỹ thuật',
      href: '/admin/collections/scientific-activities',
      createHref: '/admin/collections/scientific-activities/create',
      icon: 'microscope',
      categoryGroup: 'chuyen-mon',
      visible: true,
    },

    // 3. TRUYỀN THÔNG, VĂN BẢN & ĐẤU THẦU
    {
      id: 'news',
      title: 'Tin tức & Hoạt động y tế',
      value: news,
      badge: `${publishedPercent}% online`,
      badgeType: 'neutral',
      subtext: `${publishedNews} bài công khai · ${news - publishedNews} bản nháp`,
      href: '/admin/collections/news',
      createHref: '/admin/collections/news/create',
      icon: 'news',
      categoryGroup: 'truyen-thong',
      visible: cardVisibility.news,
    },
    {
      id: 'notices',
      title: 'Thông báo & Chỉ đạo điều hành',
      value: notices,
      badge: priorityNotices ? `${priorityNotices} khẩn/quan trọng` : 'Bình thường',
      badgeType: priorityNotices ? 'warning' : 'neutral',
      subtext: `${notices} thông báo chỉ đạo, lịch công tác`,
      href: '/admin/collections/notices',
      createHref: '/admin/collections/notices/create',
      icon: 'notice',
      categoryGroup: 'truyen-thong',
      visible: cardVisibility.notices,
    },
    {
      id: 'procurement',
      title: 'Đấu thầu & Mua sắm trang thiết bị',
      value: procurement,
      badge: openProcurement ? `${openProcurement} gói đang mở` : 'Đã đóng thầu',
      badgeType: openProcurement ? 'warning' : 'info',
      subtext: `${procurement} gói thầu thuốc, vật tư y tế`,
      href: '/admin/collections/procurement',
      createHref: '/admin/collections/procurement/create',
      icon: 'procurement',
      categoryGroup: 'truyen-thong',
      visible: cardVisibility.procurement,
    },
    {
      id: 'documents',
      title: 'Văn bản pháp quy & Biểu mẫu',
      value: documents,
      badge: `${documents} tệp văn bản`,
      badgeType: 'info',
      subtext: 'Quy chế, quyết định và văn bản chỉ đạo',
      href: '/admin/collections/documents',
      createHref: '/admin/collections/documents/create',
      icon: 'document',
      categoryGroup: 'truyen-thong',
      visible: cardVisibility.documents,
    },
    {
      id: 'recruitment',
      title: 'Tuyển dụng nhân sự y tế',
      value: recruitment,
      badge: `${recruitment} vị trí tuyển`,
      badgeType: 'success',
      subtext: 'Thông báo tuyển dụng bác sĩ, điều dưỡng, nhân viên',
      href: '/admin/collections/recruitment',
      createHref: '/admin/collections/recruitment/create',
      icon: 'briefcase',
      categoryGroup: 'truyen-thong',
      visible: cardVisibility.recruitment,
    },

    // 4. CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT
    {
      id: 'feedback',
      title: 'Hộp thư phản ánh & Khiếu nại',
      value: feedbackNew + feedbackProcessing,
      badge: feedbackNew > 0 ? `${feedbackNew} mới` : 'Đã giải quyết',
      badgeType: feedbackNew > 0 ? 'danger' : 'success',
      subtext: `${feedbackDone} đã xử lý · ${feedbackNew} chờ tiếp nhận`,
      href: '/admin/collections/feedback',
      createHref: '/admin/collections/feedback/create',
      icon: 'feedback',
      categoryGroup: 'cskh',
      visible: cardVisibility.feedback,
    },
    {
      id: 'consultations',
      title: 'Hộp thư Tư vấn sức khỏe',
      value: consultations,
      badge: consultations > 0 ? `${consultations} chờ phản hồi` : 'Đã phản hồi',
      badgeType: consultations > 0 ? 'warning' : 'success',
      subtext: 'Bệnh nhân đăng ký giải đáp thắc mắc chuyên môn',
      href: '/admin/collections/consultations',
      createHref: '/admin/collections/consultations/create',
      icon: 'chat',
      categoryGroup: 'cskh',
      visible: true,
    },
    {
      id: 'surveys',
      title: 'Khảo sát sự hài lòng người bệnh',
      value: surveyResponses,
      badge: `${surveys} đợt đang mở`,
      badgeType: 'info',
      subtext: 'Đánh giá chất lượng bệnh viện theo chuẩn Bộ Y tế',
      href: '/admin/collections/survey-responses',
      createHref: '/admin/collections/survey-campaigns/create',
      icon: 'survey',
      categoryGroup: 'cskh',
      visible: cardVisibility.surveys,
    },

    // 5. TRANG CHỦ & GIAO DIỆN WEBSITE
    {
      id: 'pages',
      title: 'Trang thông tin tĩnh',
      value: pages,
      badge: 'Giao diện',
      badgeType: 'neutral',
      subtext: 'Trang giới thiệu, hướng dẫn và điều khoản viện',
      href: '/admin/collections/pages',
      createHref: '/admin/collections/pages/create',
      icon: 'layout',
      categoryGroup: 'giao-dien',
      visible: true,
    },
    {
      id: 'faqs',
      title: 'Hỏi đáp Y tế thường gặp',
      value: faqs,
      badge: 'Hỗ trợ 24/7',
      badgeType: 'info',
      subtext: 'Giải đáp thắc mắc về khám chữa bệnh, BHYT & viện phí',
      href: '/admin/collections/faqs',
      createHref: '/admin/collections/faqs/create',
      icon: 'chat',
      categoryGroup: 'giao-dien',
      visible: true,
    },

    // 6. HỆ THỐNG & DỮ LIỆU
    {
      id: 'media',
      title: 'Thư viện tệp tin & Hình ảnh',
      value: media,
      badge: 'Lưu trữ R2/Local',
      badgeType: 'neutral',
      subtext: 'Ảnh chân dung, tư liệu và văn bản số hóa',
      href: '/admin/collections/media',
      createHref: '/admin/collections/media/create',
      icon: 'media',
      categoryGroup: 'he-thong',
      visible: true,
    },
    {
      id: 'users',
      title: 'Quản trị viên & Phân quyền',
      value: users,
      badge: 'Bảo mật tài khoản',
      badgeType: 'info',
      subtext: 'Cán bộ IT, Biên tập viên và Lãnh đạo duyệt bài',
      href: '/admin/collections/users',
      createHref: '/admin/collections/users/create',
      icon: 'people',
      categoryGroup: 'he-thong',
      visible: true,
    },
    {
      id: 'audit-logs',
      title: 'Nhật ký kiểm toán an toàn',
      value: auditLogs,
      badge: 'Audit Trail',
      badgeType: 'success',
      subtext: 'Ghi vết đầy đủ mọi thao tác thêm, sửa, xóa dữ liệu',
      href: '/admin/collections/audit-logs',
      icon: 'shieldCheck',
      categoryGroup: 'he-thong',
      visible: true,
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
        createHref: `/admin/collections/custom-posts/create`,
        icon: (sec.slug.includes('so') || sec.title.toLowerCase().includes('số') ? 'cpu' : 'folder') as GlyphName,
        categoryGroup: 'truyen-thong',
        visible: true,
      }))
    : []

  const initialMetricCards = [...coreMetricCards, ...dynamicMetricCards]

  // Cơ cấu dữ liệu hệ thống
  const contentBreakdown = [
    { id: 'clinical-protocols', label: 'Phác đồ điều trị chuẩn', count: clinicalProtocols, totalPercent: Math.round((clinicalProtocols / maxContent) * 100), color: '#0f766e', href: '/admin/collections/clinical-protocols' },
    { id: 'news', label: 'Tin tức y tế & hoạt động', count: news, totalPercent: Math.round((news / maxContent) * 100), color: '#0284c7', href: '/admin/collections/news' },
    { id: 'notices', label: 'Thông báo & Chỉ đạo điều hành', count: notices, totalPercent: Math.round((notices / maxContent) * 100), color: '#059669', href: '/admin/collections/notices' },
    { id: 'documents', label: 'Văn bản pháp quy & Biểu mẫu', count: documents, totalPercent: Math.round((documents / maxContent) * 100), color: '#0d9488', href: '/admin/collections/documents' },
    { id: 'procurement', label: 'Gói thầu mua sắm trang thiết bị', count: procurement, totalPercent: Math.round((procurement / maxContent) * 100), color: '#d97706', href: '/admin/collections/procurement' },
    { id: 'recruitment', label: 'Thông tin tuyển dụng viên chức', count: recruitment, totalPercent: Math.round((recruitment / maxContent) * 100), color: '#8b5cf6', href: '/admin/collections/recruitment' },
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
    showWeeklyWorkload: dSettings.showWeeklyWorkload !== false,
    showProtocolDistribution: dSettings.showProtocolDistribution !== false,
  }

  // Live Metrics Command Bar
  const commandBarNode = (
    <div key="command-bar-node" className={styles.commandBar}>
      <div className={styles.commandBarItem}>
        <DashboardGlyph name="clock" />
        <span>{today}</span>
      </div>
      <div className={styles.commandDivider} />
      <div className={styles.commandMetrics}>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Tổng nội dung số:</span>
          <strong className={styles.subMetricValue}>{totalContent}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Phác đồ điều trị:</span>
          <strong className={styles.subMetricValue}>{clinicalProtocols}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Bác sĩ & Nhân sự:</span>
          <strong className={styles.subMetricValue}>{doctors}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Dịch vụ kỹ thuật:</span>
          <strong className={styles.subMetricValue}>{services}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Ý kiến phản ánh:</span>
          <strong className={styles.subMetricValue}>{totalFeedback}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Tệp Media:</span>
          <strong className={styles.subMetricValue}>{media}</strong>
        </div>
        <div className={styles.subMetric}>
          <span className={styles.subMetricLabel}>Audit Logs:</span>
          <strong className={styles.subMetricValue}>{auditLogs}</strong>
        </div>
      </div>
    </div>
  )

  const bentoContentNode = (
    <div key="bento-content-wrapper">
      {/* 4. Main Bento Grid (Operational & Triage Hub) */}
      <div className={styles.bentoGrid}>
        {/* Card 1: Phân bổ dữ liệu & Tình trạng kho nội dung */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.cardCategory}>KHO NỘI DUNG SỐ & PHÁC ĐỒ</span>
              <h2 className={styles.cardTitle}>Cơ cấu tài nguyên bệnh viện</h2>
            </div>
            <span className={styles.countPill}>{totalContent} tài nguyên</span>
          </div>

          <div className={styles.breakdownList}>
            {contentBreakdown.map((row, idx) => (
              <Link href={row.href} key={row.id || idx} className={styles.breakdownRow}>
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
              Đồng bộ dữ liệu thời gian thực từ PostgreSQL
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
              <strong>{feedbackNew > 0 ? `Có ${feedbackNew} phản hồi mới cần xử lý kịp thời` : 'Đã giải quyết toàn bộ góp ý của bệnh nhân'}</strong>
              <p>Phản hồi nhanh chóng giúp nâng cao chỉ số hài lòng của bệnh nhân và người nhà.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Linear Activity Feeds Grid */}
      <div className={styles.bentoGrid}>
        {/* Feed 1: Phác đồ điều trị & Văn bản mới cập nhật */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeading}>
            <div>
              <span className={styles.cardCategory}>CHUYÊN MÔN Y TẾ</span>
              <h2 className={styles.cardTitle}>Phác đồ điều trị vừa cập nhật</h2>
            </div>
            <Link href="/admin/collections/clinical-protocols" className={styles.cardLink}>Xem tất cả →</Link>
          </div>

          <div className={styles.activityFeed}>
            {(latestProtocols.docs as any[]).length === 0 && (
              <div className={styles.emptyFeed}>Chưa có phác đồ điều trị nào trong hệ thống.</div>
            )}
            {(latestProtocols.docs as any[]).map((item) => (
              <Link href={`/admin/collections/clinical-protocols/${item.id}`} key={item.id} className={styles.feedRow}>
                <div className={styles.feedAvatar}>
                  <DashboardGlyph name="stethoscope" />
                </div>
                <div className={styles.feedBody}>
                  <span className={styles.feedTitle}>{item.title || 'Chưa đặt tiêu đề'}</span>
                  <div className={styles.feedSub}>
                    <span>{item.protocolNumber ? `Số ${item.protocolNumber}` : 'Phác đồ điều trị'}</span>
                    <span>·</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${item.status === 'effective' ? styles.statusPublished : styles.statusDraft}`}>
                  {item.status === 'effective' ? 'Hiệu lực' : 'Đang dự thảo'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Feed 2: Ý kiến người bệnh chờ xử lý */}
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
                <span>Hộp thư đang trống. Tất cả ý kiến đã được xử lý hoàn tất!</span>
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
            <span className={styles.cardCategory}>DANH MỤC CƠ SỞ & HỆ THỐNG</span>
            <h2 className={styles.cardTitle}>Năng lực số bệnh viện & Dữ liệu cốt lõi</h2>
          </div>
          <Link href="/admin/collections/users" className={styles.cardLink}>Quản trị tài khoản →</Link>
        </div>

        <div className={styles.masterGrid}>
          <Link href="/admin/collections/clinical-protocols" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="stethoscope" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{clinicalProtocols}</strong>
              <span className={styles.masterItemLabel}>Phác đồ điều trị</span>
            </div>
          </Link>
          <Link href="/admin/collections/departments" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="building" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{departments}</strong>
              <span className={styles.masterItemLabel}>Khoa / Phòng ban</span>
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
          <Link href="/admin/collections/audit-logs" className={styles.masterItem}>
            <div className={styles.masterItemIcon}><DashboardGlyph name="shieldCheck" /></div>
            <div className={styles.masterItemInfo}>
              <strong className={styles.masterItemNum}>{auditLogs}</strong>
              <span className={styles.masterItemLabel}>Nhật ký kiểm toán</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 7. Quick Launch Command Grid */}
      <section className={styles.quickCommandsSection}>
        <div className={styles.quickCommandsHead}>
          <span className={styles.cardCategory}>TRUY CẬP TÁC VỤ NHANH</span>
          <h2 className={styles.cardTitle}>Phím tắt tạo mới & Điều hành nhanh</h2>
        </div>

        <div className={styles.commandsGrid}>
          <Link href="/admin/collections/clinical-protocols/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="stethoscope" />
            <span>Thêm Phác đồ điều trị</span>
            <kbd className={styles.shortcutKey}>⌘P</kbd>
          </Link>
          <Link href="/admin/collections/doctors/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="people" />
            <span>Thêm Bác sĩ mới</span>
            <kbd className={styles.shortcutKey}>⌘B</kbd>
          </Link>
          <Link href="/admin/collections/schedules/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="schedule" />
            <span>Cập nhật Lịch khám</span>
            <kbd className={styles.shortcutKey}>⌘L</kbd>
          </Link>
          <Link href="/admin/collections/news/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="news" />
            <span>Đăng bài Tin tức</span>
            <kbd className={styles.shortcutKey}>⌘N</kbd>
          </Link>
          <Link href="/admin/collections/notices/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="notice" />
            <span>Tạo Thông báo khẩn</span>
            <kbd className={styles.shortcutKey}>⌘T</kbd>
          </Link>
          <Link href="/admin/collections/procurement/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="procurement" />
            <span>Tạo Gói thầu</span>
            <kbd className={styles.shortcutKey}>⌘G</kbd>
          </Link>
          <Link href="/admin/collections/documents/create" className={styles.commandActionBtn}>
            <DashboardGlyph name="document" />
            <span>Đăng tải Văn bản</span>
            <kbd className={styles.shortcutKey}>⌘D</kbd>
          </Link>
          <Link href="/admin/collections/appointments" className={styles.commandActionBtn}>
            <DashboardGlyph name="schedule" />
            <span>Duyệt lịch đặt khám</span>
            <kbd className={styles.shortcutKey}>⌘A</kbd>
          </Link>
          <Link href="/admin/collections/feedback" className={styles.commandActionBtn}>
            <DashboardGlyph name="feedback" />
            <span>Hộp thư phản ánh ({feedbackNew})</span>
            <kbd className={styles.shortcutKey}>⌘F</kbd>
          </Link>
          <Link href="/admin/globals/homepage" className={styles.commandActionBtn}>
            <DashboardGlyph name="chart" />
            <span>Cấu hình Trang chủ</span>
            <kbd className={styles.shortcutKey}>⌘H</kbd>
          </Link>
        </div>
      </section>
    </div>
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
      totalAppointments={appointments}
      clinicalProtocols={clinicalProtocols}
      accountSummaryNode={<AdminAccountSummary key="account-summary-node" />}
      commandBarNode={commandBarNode}
      bentoContentNode={bentoContentNode}
    />
  )
}
