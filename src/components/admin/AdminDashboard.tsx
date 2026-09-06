import config from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import AdminAccountSummary from './AdminAccountSummary'
import styles from './AdminDashboard.module.css'
import motionStyles from './AdminMotion.module.css'

async function count(payload: any, collection: string, where?: any) {
  try { return (await payload.count({ collection, where, overrideAccess: true })).totalDocs || 0 } catch { return 0 }
}

const date = (value?: string) => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value)) : 'Chưa cập nhật'

type GlyphName = 'content' | 'feedback' | 'procurement' | 'schedule' | 'chat' | 'news' | 'notice' | 'document' | 'settings' | 'people' | 'medical' | 'media'

function DashboardGlyph({ name, small = false }: { name: GlyphName, small?: boolean }) {
  const paths: Record<GlyphName, React.ReactNode> = {
    content: <><path d="M6 4h9l3 3v13H6z"/><path d="M14 4v4h4M9 12h6M9 16h6"/></>,
    feedback: <><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 13h5"/></>,
    procurement: <><path d="M5 8h14l-1 12H6zM9 8V5h6v3"/><path d="M9 12h6"/></>,
    schedule: <><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 3v6M16 3v6M4 11h16M8 15h3"/></>,
    chat: <><path d="M12 21a9 9 0 1 0-8-5l-1 5 5-1a9 9 0 0 0 4 1z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>,
    news: <><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    notice: <><path d="M12 3 3 20h18z"/><path d="M12 9v5M12 17h.01"/></>,
    document: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6l-.3-2.6h-4L10.4 6A7 7 0 0 0 8.9 7L6.5 6l-2 3.4 2 1.5a7 7 0 0 0 0 2.1l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.5 1l.3 2.6h4l.3-2.6a7 7 0 0 0 1.5-1l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z"/></>,
    people: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 2-7 6-7s6 3 6 7M15 14c3 0 5 2 5 6"/></>,
    medical: <><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></>,
    media: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m5 17 4-4 3 3 2-2 5 3"/></>,
  }
  return <svg className={small ? motionStyles.quickGlyph : motionStyles.glyph} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export default async function AdminDashboard() {
  const payload = await getPayload({ config })
  const [
    news, publishedNews, notices, priorityNotices, procurement, openProcurement, documents, recruitment, customPosts,
    feedbackNew, feedbackProcessing, feedbackDone, doctors, departments, specialties, schedules, vaccinationSchedules,
    services, consultations, users, media,
  ] = await Promise.all([
    count(payload, 'news'), count(payload, 'news', { _status: { equals: 'published' } }),
    count(payload, 'notices'), count(payload, 'notices', { level: { in: ['important', 'urgent'] } }),
    count(payload, 'procurement'), count(payload, 'procurement', { procurementStatus: { in: ['open', 'closing'] } }),
    count(payload, 'documents'), count(payload, 'recruitment'), count(payload, 'custom-posts'),
    count(payload, 'feedback', { status: { equals: 'new' } }), count(payload, 'feedback', { status: { equals: 'processing' } }), count(payload, 'feedback', { status: { equals: 'done' } }),
    count(payload, 'doctors'), count(payload, 'departments'), count(payload, 'specialties'), count(payload, 'schedules'), count(payload, 'vaccinationSchedules'),
    count(payload, 'services'), count(payload, 'consultations', { status: { in: ['new', 'processing'] } }), count(payload, 'users'), count(payload, 'media'),
  ])

  const [latestNews, latestFeedback, contentSectionsResult] = await Promise.all([
    payload.find({ collection: 'news', limit: 5, sort: '-updatedAt', depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'feedback', limit: 5, sort: '-createdAt', where: { status: { not_equals: 'done' } }, depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'content-sections', limit: 50, sort: 'title', depth: 0, overrideAccess: true }).catch(() => ({ docs: [] })),
  ])

  const menuContentSections = contentSectionsResult.docs as any[]
  const sectionCounts = Object.fromEntries(await Promise.all(menuContentSections.map(async (section) => [String(section.id), await count(payload, 'custom-posts', { section: { equals: section.id } })])))
  const totalContent = news + notices + procurement + documents + recruitment + customPosts
  const publishedPercent = news ? Math.round((publishedNews / news) * 100) : 0
  const totalFeedback = feedbackNew + feedbackProcessing + feedbackDone
  const feedbackDonePercent = totalFeedback ? `${Math.round((feedbackDone / totalFeedback) * 100)}%` : '0%'
  const feedbackProcessingPercent = totalFeedback ? `${Math.round((feedbackProcessing / totalFeedback) * 100)}%` : '0%'
  const maxContent = Math.max(news, notices, procurement, documents, recruitment, customPosts, 1)
  const today = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())

  const cards = [
    ['Tổng nội dung', totalContent, `${publishedNews} tin đã xuất bản`, 'content', '/admin/collections/news', 'blue'],
    ['Phản hồi cần xử lý', feedbackNew + feedbackProcessing, `${feedbackNew} phản hồi mới`, 'feedback', '/admin/collections/feedback', feedbackNew ? 'orange' : 'green'],
    ['Gói thầu đang mở', openProcurement, `Tổng cộng ${procurement} hồ sơ`, 'procurement', '/admin/collections/procurement', 'purple'],
    ['Lịch khám', schedules, `${doctors} bác sĩ · ${departments} khoa/phòng`, 'schedule', '/admin/collections/schedules', 'teal'],
    ['Lịch tiêm chủng', vaccinationSchedules, 'Lịch và thông báo tiêm ngừa', 'medical', '/admin/collections/vaccinationSchedules', 'green'],
    ['Tư vấn đang chờ', consultations, 'Yêu cầu cần tiếp nhận', 'chat', '/admin/collections/consultations', consultations ? 'orange' : 'green'],
  ]

  const content = [
    ['Tin tức', news, 'blue', '/admin/collections/news'], ['Thông báo', notices, 'violet', '/admin/collections/notices'],
    ['Đấu thầu – Mua sắm', procurement, 'orange', '/admin/collections/procurement'], ['Văn bản – Tài liệu', documents, 'teal', '/admin/collections/documents'],
    ['Tuyển dụng', recruitment, 'green', '/admin/collections/recruitment'], ['Nội dung từ Menu', customPosts, 'navy', '/admin/collections/custom-posts'],
  ]

  return <section className={styles.dashboard}>
    <header className={styles.hero}>
      <div className={styles.heroCopy}><div className={styles.brandMark}>✚</div><div><span className={styles.eyebrow}>CỔNG QUẢN TRỊ BỆNH VIỆN</span><h1>Bảng điều khiển quản trị</h1><p>Theo dõi nội dung, lịch khám, phản hồi và vận hành website tại một nơi.</p></div></div>
      <div className={styles.heroSide}><AdminAccountSummary /><div className={styles.heroActions}><Link href="/admin/collections/news/create" className={styles.primaryButton}>+ Đăng tin mới</Link><Link href="/" target="_blank" className={styles.secondaryButton}>Xem website ↗</Link></div></div>
    </header>

    <div className={styles.operationBar}><span className={styles.liveDot} /><strong>Hệ thống quản trị đang hoạt động</strong><span className={styles.operationDivider} /><span className={styles.today}>{today}</span><span className={styles.operationSpacer} /><span><b>{publishedPercent}%</b> tin tức đã xuất bản</span><span><b>{services}</b> dịch vụ</span><span><b>{users}</b> tài khoản</span><span><b>{media}</b> tệp Media</span></div>

    <div className={styles.statGrid}>{cards.map(([label, value, note, icon, href, tone]) => <Link key={label as string} href={href as string} className={`${styles.statCard} ${styles[`tone${tone}`]}`}><span className={styles.statIcon}><DashboardGlyph name={icon as GlyphName} /></span><span className={styles.statBody}><strong>{value}</strong><b>{label}</b><small>{note}</small></span><span className={styles.cardArrow}>→</span></Link>)}</div>

    <div className={styles.mainGrid}>
      <section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.panelEyebrow}>THỐNG KÊ NỘI DUNG</span><h2>Kho nội dung website</h2></div><span className={styles.totalPill}>{totalContent} mục</span></div><div className={styles.metricList}>{content.map(([label, value, color, href]) => <Link href={href as string} key={label as string} className={styles.metricRow}><span className={`${styles.colorDot} ${styles[`dot${color}`]}`} /><span className={styles.metricName}>{label}</span><span className={styles.progress}><i className={styles[`bar${color}`]} style={{ width: `${(Number(value) / maxContent) * 100}%` }} /></span><strong>{value}</strong><span className={styles.metricArrow}>›</span></Link>)}</div><div className={styles.panelFooter}><span>⚑ {priorityNotices} thông báo quan trọng hoặc khẩn</span><Link href="/admin/globals/homepage">Chỉnh trang chủ →</Link></div></section>
      <section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.panelEyebrow}>CHĂM SÓC NGƯỜI BỆNH</span><h2>Tiến độ phản hồi</h2></div><Link href="/admin/collections/feedback" className={styles.textLink}>Mở hộp thư →</Link></div><div className={styles.feedbackSummary}><div className={styles.donut} style={{ '--done': feedbackDonePercent, '--processing': feedbackProcessingPercent } as React.CSSProperties}><strong>{totalFeedback}</strong><span>tổng phản hồi</span></div><div className={styles.legend}><span><i className={styles.legendNew} /><b>{feedbackNew}</b> Mới tiếp nhận</span><span><i className={styles.legendProcess} /><b>{feedbackProcessing}</b> Đang xử lý</span><span><i className={styles.legendDone} /><b>{feedbackDone}</b> Đã hoàn tất</span></div></div><div className={styles.attention}><span>!</span><p><b>{feedbackNew ? `Có ${feedbackNew} phản hồi mới cần xem` : 'Không có phản hồi mới'}</b><br />Ưu tiên xử lý phản hồi của người bệnh trong ngày.</p></div></section>
    </div>

    <section className={styles.overviewPanel}>
      <div className={styles.panelHead}><div><span className={styles.panelEyebrow}>TỔNG QUAN VẬN HÀNH</span><h2>Tổ chức & hệ thống</h2></div><Link href="/admin/collections/users" className={styles.textLink}>Quản lý tài khoản →</Link></div>
      <div className={styles.overviewGrid}>
        <Link href="/admin/collections/departments"><DashboardGlyph name="people" /><span><strong>{departments}</strong><small>Khoa / Phòng</small></span></Link>
        <Link href="/admin/collections/specialties"><DashboardGlyph name="medical" /><span><strong>{specialties}</strong><small>Chuyên khoa</small></span></Link>
        <Link href="/admin/collections/doctors"><DashboardGlyph name="people" /><span><strong>{doctors}</strong><small>Bác sĩ</small></span></Link>
        <Link href="/admin/collections/services"><DashboardGlyph name="content" /><span><strong>{services}</strong><small>Dịch vụ</small></span></Link>
        <Link href="/admin/collections/media"><DashboardGlyph name="media" /><span><strong>{media}</strong><small>Media</small></span></Link>
        <Link href="/admin/collections/users"><DashboardGlyph name="settings" /><span><strong>{users}</strong><small>Tài khoản</small></span></Link>
      </div>
    </section>

    {menuContentSections.length > 0 && <section className={styles.dynamicContentPanel}><div className={styles.panelHead}><div><span className={styles.panelEyebrow}>NỘI DUNG TỰ SINH TỪ MENU</span><h2>Các mục nội dung đang quản lý</h2><p className={styles.dynamicHint}>Các mục như “Chuyển đổi số” được tạo từ Menu sẽ xuất hiện tại đây để thêm và quản lý bài viết.</p></div><Link href="/admin/collections/content-sections" className={styles.textLink}>Quản lý các mục →</Link></div><div className={styles.dynamicSectionGrid}>{menuContentSections.map((section) => <div className={styles.dynamicSectionCard} key={section.id}><div><span className={styles.dynamicSectionIcon}>▤</span><strong>{section.title}</strong><small>/{section.slug} · {sectionCounts[String(section.id)] || 0} bài viết</small></div><div className={styles.dynamicSectionActions}><Link href={`/admin/collections/custom-posts?where[section][equals]=${section.id}`}>Xem bài</Link><Link href={`/admin/collections/custom-posts/create?section=${section.id}`} className={styles.dynamicPrimary}>+ Thêm bài</Link></div></div>)}</div></section>}

    <div className={styles.contentGrid}><section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.panelEyebrow}>CẬP NHẬT GẦN ĐÂY</span><h2>Tin tức vừa chỉnh sửa</h2></div><Link href="/admin/collections/news" className={styles.textLink}>Xem tất cả →</Link></div><div className={styles.list}>{(latestNews.docs as any[]).length === 0 && <p className={styles.empty}>Chưa có bài viết. Hãy tạo tin đầu tiên cho website.</p>}{(latestNews.docs as any[]).map((item) => <Link href={`/admin/collections/news/${item.id}`} className={styles.listItem} key={item.id}><span className={styles.listIcon}>▤</span><span className={styles.listCopy}><strong>{item.title || 'Chưa đặt tiêu đề'}</strong><small>{item.category || 'Tin tức'} · {date(item.updatedAt)}</small></span><span className={item._status === 'published' ? styles.published : styles.draft}>{item._status === 'published' ? 'Đã đăng' : 'Bản nháp'}</span></Link>)}</div></section>
      <section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.panelEyebrow}>HỘP THƯ TIẾP NHẬN</span><h2>Phản hồi đang chờ</h2></div><Link href="/admin/collections/feedback" className={styles.textLink}>Xử lý phản hồi →</Link></div><div className={styles.list}>{(latestFeedback.docs as any[]).length === 0 && <p className={styles.empty}>Không có phản hồi nào đang chờ xử lý.</p>}{(latestFeedback.docs as any[]).map((item) => <Link href={`/admin/collections/feedback/${item.id}`} className={styles.listItem} key={item.id}><span className={styles.avatar}>{item.name?.slice(0, 1)?.toUpperCase() || '?'}</span><span className={styles.listCopy}><strong>{item.name || 'Người gửi ẩn danh'}</strong><small>{item.type || 'Phản hồi'} · {date(item.createdAt)}</small></span><span className={item.status === 'new' ? styles.newStatus : styles.processing}>{item.status === 'new' ? 'Mới' : 'Đang xử lý'}</span></Link>)}</div></section></div>

    <section className={styles.quickPanel}><div><span className={styles.panelEyebrow}>THAO TÁC NHANH</span><h2>Bắt đầu công việc</h2><p>Truy cập nhanh các tác vụ quản trị thường dùng.</p></div><div className={styles.quickActions}><Link href="/admin/collections/consultations"><DashboardGlyph name="chat" small /><span>Tư vấn trực tuyến</span></Link><Link href="/admin/collections/news/create"><DashboardGlyph name="news" small /><span>Tin tức mới</span></Link><Link href="/admin/collections/notices/create"><DashboardGlyph name="notice" small /><span>Thông báo mới</span></Link><Link href="/admin/collections/procurement/create"><DashboardGlyph name="procurement" small /><span>Tạo gói thầu</span></Link><Link href="/admin/collections/documents/create"><DashboardGlyph name="document" small /><span>Tải văn bản</span></Link><Link href="/admin/collections/schedules/create"><DashboardGlyph name="schedule" small /><span>Thêm lịch khám</span></Link><Link href="/admin/collections/vaccinationSchedules/create"><DashboardGlyph name="medical" small /><span>Thêm lịch tiêm</span></Link><Link href="/admin/globals/site-settings"><DashboardGlyph name="settings" small /><span>Cấu hình website</span></Link></div></section>
  </section>
}
