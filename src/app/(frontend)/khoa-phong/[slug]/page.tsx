import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { RichText } from '@/components/RichText'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './department-detail.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'departments',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const dep: any = result.docs[0]
  if (!dep || dep.active === false) return { title: 'Khoa / Phòng không tồn tại' }

  const titleText = `${dep.name} | BVĐK Khu vực Thới Lai`
  const descText = dep.summary || `Thông tin tổ chức, chức năng nhiệm vụ và đội ngũ y bác sĩ ${dep.name} tại Bệnh viện Đa khoa Khu vực Thới Lai.`
  const coverImage = mediaUrl(dep.cover)

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      images: coverImage ? [coverImage] : [],
    },
  }
}

export default async function DepartmentDetail({ params }: Props) {
  const { slug } = await params
  const payload = await getCMS()
  const [result, siteSettings] = await Promise.all([
    payload.find({
      collection: 'departments',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }),
    getGlobal('site-settings').catch(() => null),
  ])

  const dep: any = result.docs[0]
  if (!dep || dep.active === false) notFound()

  // Truy vấn song song Bác sĩ và Chuyên khoa trực thuộc
  const [docResult, specialtyResult] = await Promise.all([
    payload.find({
      collection: 'doctors',
      where: {
        and: [
          { department: { equals: dep.id } },
          { active: { equals: true } },
        ],
      },
      limit: 100,
      depth: 2,
    }),
    payload.find({
      collection: 'specialties',
      where: {
        and: [
          { department: { equals: dep.id } },
          { active: { equals: true } },
        ],
      },
      limit: 50,
      sort: ['order', 'name'],
      depth: 1,
    }).catch(() => ({ docs: [] })),
  ])

  // QUY TẮC BẮT BUỘC DỰ ÁN (AGENTS.md - Mandate 1):
  // Ban Giám đốc BỆNH VIỆN LUÔN LUÔN ĐƯỢC ƯU TIÊN HIỂN THỊ TRANG ĐẦU TIÊN, SẮP XẾP TỪ TRÊN XUỐNG DƯỚI.
  // Giám đốc bệnh viện -> Phó Giám đốc -> Trưởng/Phó các Khoa, Phòng -> Bác sĩ.
  const getDoctorRank = (doc: any): number => {
    const title = (doc.title || '').toLowerCase()
    const docDept = (typeof doc.department === 'object' ? doc.department?.name : '').toLowerCase()
    const isBoard = docDept.includes('ban giám đốc') || title.includes('giám đốc')
    if (isBoard) {
      if (title.includes('giám đốc') && !title.includes('phó')) return 1
      if (title.includes('phó giám đốc')) return 2
      return 3
    }
    if (title.includes('trưởng khoa') || title.includes('trưởng phòng')) return 10
    if (title.includes('phó trưởng khoa') || title.includes('phó khoa') || title.includes('phó trưởng phòng')) return 11
    return 20
  }

  const rawDoctors = (docResult.docs as any[]).filter((d) => d.showInDepartment !== false)
  const doctors = [...rawDoctors].sort((a, b) => {
    const rankA = getDoctorRank(a)
    const rankB = getDoctorRank(b)
    if (rankA !== rankB) return rankA - rankB
    const orderA = typeof a.order === 'number' ? a.order : 999
    const orderB = typeof b.order === 'number' ? b.order : 999
    if (orderA !== orderB) return orderA - orderB
    return (a.name || '').localeCompare(b.name || '', 'vi')
  })

  const specialties = specialtyResult.docs as any[]
  const coverUrl = mediaUrl(dep.cover)

  // Cấu hình hiển thị khối nhân sự (Bác sĩ, Điều dưỡng, Kỹ sư, Cán bộ y tế)
  const showMembers = (dep as any).showMembersSection !== false && doctors.length > 0
  const membersTitle = (dep as any).membersSectionTitle || 'Đội ngũ Cán bộ – Nhân viên'

  // Cấu hình liên hệ & đặt khám từ siteSettings hoặc fallback chuẩn bệnh viện Thới Lai
  const medproUrl = (siteSettings as any)?.medproBookingUrl || process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/trung-tam-y-te-khu-vuc-thoi-lai'
  const hotline = (siteSettings as any)?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '02923686115'

  // Phân loại đơn vị hiển thị badge
  const unitKind = dep.unitType || dep.kind || 'clinical'
  const badgeLabel =
    unitKind === 'office'
      ? 'Phòng chức năng'
      : unitKind === 'paraclinical'
      ? 'Khoa cận lâm sàng'
      : unitKind === 'other'
      ? 'Đơn vị chuyên trách'
      : 'Khoa chuyên môn'

  // Cờ bật/tắt hiển thị khối Chuyên khoa (mặc định true)
  const showSpecialties = dep.showSpecialtiesSection !== false && specialties.length > 0

  return (
    <>
      <SiteHeader />
      <main className="departmentDetailPage">
        {/* ── HERO BANNER CHUẨN Y TẾ ────────────────────────────── */}
        <section className="departmentHero">
          <div className="container">
            <div className="departmentHeroInner">
              <nav className="departmentBreadcrumb" aria-label="Breadcrumb">
                <Link href="/">Trang chủ</Link>
                <span aria-hidden="true">/</span>
                <Link href="/khoa-phong">Khoa – Phòng</Link>
                <span aria-hidden="true">/</span>
                <span>{dep.name}</span>
              </nav>

              <div className="departmentBadgeWrap">
                <span className="departmentBadge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 10.5h-4.5V6a1.5 1.5 0 0 0-3 0v4.5H7a1.5 1.5 0 0 0 0 3h4.5V18a1.5 1.5 0 0 0 3 0v-4.5H19a1.5 1.5 0 0 0 0-3z" />
                  </svg>
                  {badgeLabel}
                </span>
              </div>

              <h1 className="departmentHeroTitle">{dep.name}</h1>

              {dep.summary && (
                <p className="departmentHeroDesc">{dep.summary}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── THÂN TRANG 2 CỘT ─────────────────────────────────── */}
        <div className="container departmentBody">
          <div className="departmentGrid">
            {/* ── CỘT TRÁI: SIDEBAR THÔNG TIN ĐƠN VỊ & ĐẶT KHÁM ── */}
            <aside className="departmentSidebar">
              {/* Card Thông tin đơn vị */}
              <div className="departmentSideCard">
                <h3 className="departmentSideTitle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  Thông tin đơn vị
                </h3>
                <ul className="departmentInfoList">
                  {dep.leader && (
                    <li className="departmentInfoItem">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <div>
                        <span className="departmentInfoLabel">Trưởng đơn vị</span>
                        <div className="departmentInfoValue">{dep.leader}</div>
                      </div>
                    </li>
                  )}
                  {Array.isArray(dep.deputyLeaders) && dep.deputyLeaders.length > 0 && (
                    <li className="departmentInfoItem">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <div>
                        <span className="departmentInfoLabel">Phó trưởng đơn vị</span>
                        <div className="departmentInfoValue">
                          {dep.deputyLeaders.map((dl: any) => `${dl.title ? `${dl.title} ` : ''}${dl.name}`).join(' · ')}
                        </div>
                      </div>
                    </li>
                  )}
                  {dep.location && (
                    <li className="departmentInfoItem">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <span className="departmentInfoLabel">Vị trí khoa / phòng</span>
                        <div className="departmentInfoValue">{dep.location}</div>
                      </div>
                    </li>
                  )}
                  {dep.phone && (
                    <li className="departmentInfoItem">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <div>
                        <span className="departmentInfoLabel">Số điện thoại</span>
                        <div className="departmentInfoValue">
                          <a href={`tel:${dep.phone}`}>{dep.phone}</a>
                        </div>
                      </div>
                    </li>
                  )}
                  {dep.email && (
                    <li className="departmentInfoItem">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <div>
                        <span className="departmentInfoLabel">Email liên hệ</span>
                        <div className="departmentInfoValue">
                          <a href={`mailto:${dep.email}`}>{dep.email}</a>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Card Đặt lịch khám & Hỗ trợ */}
              <div className="departmentActionCard">
                <h3 className="departmentActionTitle">Đăng ký khám & Hỗ trợ</h3>
                <p className="departmentActionDesc">
                  Chủ động đặt lịch khám chuyên khoa hoặc liên hệ trực tiếp đường dây nóng của bệnh viện.
                </p>
                <a
                  href={medproUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="departmentBookingBtn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Đặt khám trực tuyến</span>
                </a>
                <a href={`tel:${hotline}`} className="departmentHotlineBtn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Hotline: {hotline}</span>
                </a>
              </div>

              {/* Hộp lưu ý BHYT & Cấp cứu */}
              <div className="departmentNoticeBox">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <strong>Tiếp nhận khám BHYT & Cấp cứu</strong>
                  <div style={{ marginTop: '2px', fontSize: '12.5px', whiteSpace: 'pre-line' }}>
                    Áp dụng đầy đủ quyền lợi BHYT đúng tuyến và thông tuyến toàn quốc theo quy định Bộ Y tế. Cấp cứu trực 24/7.
                  </div>
                </div>
              </div>
            </aside>

            {/* ── CỘT PHẢI: NỘI DUNG CHUYÊN MÔN SÂU ─────────────── */}
            <div className="departmentMainContent">
              {/* 1. Ảnh bìa khoa/phòng */}
              {coverUrl && (
                <div className="departmentCoverBox">
                  <img
                    src={coverUrl}
                    alt={dep.name}
                    className="departmentCoverImg"
                    loading="eager"
                  />
                </div>
              )}

              {/* 2. Khối Giới thiệu chuyên môn */}
              <section className="departmentCardSection">
                <div className="departmentSectionHeader">
                  <div className="departmentSectionTitleWrap">
                    <div className="departmentSectionIcon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>
                    <h2 className="departmentSectionTitle">Giới thiệu chuyên môn</h2>
                  </div>
                </div>

                {dep.summary && (
                  <p className="departmentSectionLead">{dep.summary}</p>
                )}

                {dep.content ? (
                  <div className="departmentRichTextWrap">
                    <RichText data={dep.content} />
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontStyle: 'italic', margin: '0 0 16px' }}>
                    Thông tin giới thiệu chuyên môn đang được cập nhật chuẩn hóa bởi Hội đồng Chuyên môn Bệnh viện Đa khoa Khu vực Thới Lai.
                  </p>
                )}

                {dep.functions && (
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0754a8', marginBottom: '12px' }}>
                      Chức năng – Nhiệm vụ
                    </h3>
                    <div className="departmentRichTextWrap">
                      <RichText data={dep.functions} />
                    </div>
                  </div>
                )}
              </section>

              {/* 3. Khối Hoạt động chuyên môn */}
              {dep.activities && (
                <section className="departmentCardSection">
                  <div className="departmentSectionHeader">
                    <div className="departmentSectionTitleWrap">
                      <div className="departmentSectionIcon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <h2 className="departmentSectionTitle">Hoạt động chuyên môn</h2>
                    </div>
                  </div>
                  <div className="departmentRichTextWrap">
                    <RichText data={dep.activities} />
                  </div>
                </section>
              )}

              {/* 4. Khối Chuyên khoa trực thuộc (Có nút toggle showSpecialtiesSection từ Admin) */}
              {showSpecialties && (
                <section className="departmentCardSection">
                  <div className="departmentSectionHeader">
                    <div className="departmentSectionTitleWrap">
                      <div className="departmentSectionIcon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="departmentSectionTitle">Chuyên khoa trực thuộc</h2>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          Các lĩnh vực chuyên môn sâu trực thuộc {dep.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="departmentSpecialtiesGrid">
                    {specialties.map((s) => (
                      <Link
                        key={s.id}
                        href={`/chuyen-khoa/${s.slug}`}
                        className="departmentSpecialtyCard"
                      >
                        <h3 className="departmentSpecialtyCardTitle">
                          <span>{s.name}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </h3>
                        <p className="departmentSpecialtyCardDesc">
                          {s.summary || 'Xem thông tin chi tiết dịch vụ và bác sĩ phụ trách chuyên khoa.'}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 5. Khối Đội ngũ Nhân sự / Cán bộ y tế (Bác sĩ, Điều dưỡng, Kỹ sư, Nhân viên) */}
              {showMembers && (
                <section className="departmentCardSection">
                  <div className="departmentSectionHeader">
                    <div className="departmentSectionTitleWrap">
                      <div className="departmentSectionIcon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="departmentSectionTitle">{membersTitle}</h2>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          {doctors.length} thành viên công tác tại đơn vị
                        </span>
                      </div>
                    </div>
                    <Link href={`/bac-si?dept=${dep.id}`} style={{ fontSize: '13px', fontWeight: 700, color: '#0878d1' }}>
                      Xem tất cả nhân sự →
                    </Link>
                  </div>

                  <div className="departmentDoctorGrid">
                    {doctors.map((d) => {
                      const avatarUrl = mediaUrl(d.avatar)
                      const degreePrefix = d.degree ? `${d.degree}. ` : ''
                      const fullDoctorName = `${degreePrefix}${d.name}`
                      const memberRole = d.title || (typeof d.specialtyRef === 'object' ? d.specialtyRef?.name : d.specialty) || d.professionalTitle || 'Cán bộ y tế'

                      return (
                        <Link
                          key={d.id}
                          href={`/bac-si/${d.slug}`}
                          className="departmentDocCard"
                        >
                          {/* Khung ảnh chân dung 3:4 chuẩn Mandate 2, tuyệt đối không méo ảnh */}
                          <div className="departmentDocAvatarWrap">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={fullDoctorName}
                                className="departmentDocAvatarImg"
                                loading="lazy"
                              />
                            ) : (
                              <div className="departmentDocAvatarFallback">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <span className="departmentDocBadgeRole">{memberRole}</span>
                          <h3 className="departmentDocName">{fullDoctorName}</h3>
                          {d.professionalTitle && (
                            <span className="departmentDocDegree">{d.professionalTitle}</span>
                          )}

                          <div className="departmentDocFooter">
                            <span>Xem hồ sơ chi tiết</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* 6. Khối Thành tích / Điểm nổi bật */}
              {dep.achievements && (
                <section className="departmentCardSection">
                  <div className="departmentSectionHeader">
                    <div className="departmentSectionTitleWrap">
                      <div className="departmentSectionIcon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                      </div>
                      <h2 className="departmentSectionTitle">Thành tích & Điểm nổi bật</h2>
                    </div>
                  </div>
                  <div className="departmentRichTextWrap">
                    <RichText data={dep.achievements} />
                  </div>
                </section>
              )}

              {/* Điều hướng quay lại */}
              <div className="departmentBackNav">
                <Link href="/khoa-phong" className="departmentBackBtn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Xem tất cả khoa / phòng</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

