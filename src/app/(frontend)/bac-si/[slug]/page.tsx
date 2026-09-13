import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './doctor-detail.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getCMS()
  const r = await p.find({ collection: 'doctors', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  const d: any = r.docs[0]
  if (!d || d.active === false) return { title: 'Bác sĩ không tồn tại' }

  const fullName = `${d.degree ? `${d.degree}. ` : ''}${d.name}`
  const deptName = typeof d.department === 'object' ? d.department?.name : ''
  const roleTitle = d.title || 'Bác sĩ'
  return {
    title: `${fullName} - ${roleTitle} | BVĐK Khu vực Thới Lai`,
    description: `Thông tin chuyên môn, quá trình đào tạo và công tác của ${fullName} - ${roleTitle} tại Bệnh viện Đa khoa Khu vực Thới Lai.`,
  }
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params
  const p = await getCMS()
  const r = await p.find({ collection: 'doctors', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  const d: any = r.docs[0]
  if (!d || d.active === false) notFound()

  const s: any = await getGlobal('site-settings').catch(() => null)

  const deptObj = typeof d.department === 'object' ? d.department : null
  const deptId = deptObj?.id || d.department
  const deptName = deptObj?.name || 'Bệnh viện Đa khoa Khu vực Thới Lai'
  const specialtyName = typeof d.specialtyRef === 'object' ? d.specialtyRef?.name : d.specialty || ''

  // Lấy danh sách các bác sĩ cùng khoa hoặc chuyên khoa
  let relatedDoctors: any[] = []
  try {
    const relRes = await p.find({
      collection: 'doctors',
      where: {
        and: [
          { active: { not_equals: false } },
          { id: { not_equals: d.id } },
          deptId ? { department: { equals: deptId } } : {},
        ],
      },
      limit: 8,
      depth: 2,
    })
    const rawRel = relRes.docs as any[]

    // Quy tắc bắt buộc dự án: Luôn ưu tiên Ban Giám đốc từ trên xuống dưới
    const getLeadershipRank = (doc: any): number => {
      const title = (doc.title || '').toLowerCase()
      const dept = (typeof doc.department === 'object' ? doc.department?.name : '').toLowerCase()
      const isBoard = dept.includes('ban giám đốc') || title.includes('giám đốc')

      if (isBoard) {
        if (title.includes('phó') || title.includes('pho')) return 2
        if (title.includes('giám đốc') || title.includes('giam doc')) return 1
        return 3
      }
      if (doc.featured) return 4
      return 10
    }

    relatedDoctors = rawRel.sort((a, b) => {
      const rankA = getLeadershipRank(a)
      const rankB = getLeadershipRank(b)
      if (rankA !== rankB) return rankA - rankB
      const orderA = typeof a.order === 'number' ? a.order : 999
      const orderB = typeof b.order === 'number' ? b.order : 999
      if (orderA !== orderB) return orderA - orderB
      return (a.name || '').localeCompare(b.name || '', 'vi')
    })
  } catch {}

  const avatarUrl = mediaUrl(d.avatar)
  const fullDisplayName = `${d.degree ? `${d.degree}. ` : ''}${d.name}`
  const bookingBtnText = (d.bookingBtnText || '').trim() || 'Đặt lịch khám'
  const bookingBtnUrl = (d.bookingBtnUrl || '').trim() || '/dat-lich-kham'
  const bookingOpenNewTab = Boolean(d.bookingBtnOpenNewTab)
  const bookingNoticeText = d.bookingNoticeText !== undefined ? d.bookingNoticeText : 'Đăng ký hẹn khám trực tuyến tiếp đón ưu tiên tại viện.'

  // Kiểm tra có dữ liệu đào tạo/kinh nghiệm/chuyên môn hay không
  const hasEducation = Boolean(d.education)
  const hasExperience = Boolean(d.experience)
  const hasExpertise = Boolean(d.expertise)
  const hasBio = Boolean(d.bio)
  const hasAchievements = Boolean(d.achievements)

  return (
    <>
      <SiteHeader />
      <main className="doctorDetailPage">
        {/* ── DẢI HERO BREADCRUMB ───────────────── */}
        <section className="docDetailHero">
          <div className="container">
            <nav className="docDetailBreadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <Link href="/bac-si">Đội ngũ bác sĩ</Link>
              <span aria-hidden="true">/</span>
              <span>{d.name}</span>
            </nav>
            <h1 className="docDetailHeroTitle">{fullDisplayName}</h1>
          </div>
        </section>

        {/* ── THÂN TRANG BÁC SĨ (SIDEBAR TRÁI + NỘI DUNG PHẢI) ─── */}
        <div className="container docDetailBody">
          <div className="docDetailGrid">
            {/* ── CỘT TRÁI: ẢNH CHÂN DUNG 3:4 & NÚT ĐẶT LỊCH ── */}
            <aside className="docDetailSidebar">
              <div className="docAvatarBox">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullDisplayName}
                    className="docAvatarImg"
                    loading="eager"
                  />
                ) : (
                  <div className="docAvatarFallback">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Ảnh đang cập nhật</span>
                  </div>
                )}
              </div>

              <Link
                href={bookingBtnUrl}
                className="docBookingBtn"
                {...(bookingOpenNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{bookingBtnText}</span>
              </Link>

              {bookingNoticeText && (
                <div className="docContactNotice">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>{bookingNoticeText}</span>
                </div>
              )}
            </aside>

            {/* ── CỘT PHẢI: CHI TIẾT DANH HIỆU, ĐÀO TẠO & CÔNG TÁC ── */}
            <article className="docDetailContent">
              <h2 className="docNameLarge">{fullDisplayName}</h2>
              <div className="docRoleTitle">{d.title || 'Bác sĩ chuyên khoa'}</div>

              {/* Huy hiệu học vị và đơn vị công tác */}
              <div className="docMetaBadges">
                {d.degree && (
                  <div className="docBadgeItem">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    <span>Học vị:</span>
                    <span className="docBadgeTag">{d.degree}</span>
                  </div>
                )}

                <div className="docBadgeItem">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Đơn vị:</span>
                  <strong>{deptName}</strong>
                </div>

                {specialtyName && (
                  <div className="docBadgeItem">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span>Chuyên khoa:</span>
                    <span>{specialtyName}</span>
                  </div>
                )}

                {d.licenseNumber && (
                  <div className="docBadgeItem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M7 8h10M7 12h10M7 16h6" />
                    </svg>
                    <span>Số CCHN:</span>
                    <code>{d.licenseNumber}</code>
                  </div>
                )}
              </div>

              {/* ── 2 CỘT QUÁ TRÌNH ĐÀO TẠO & THẾ MẠNH KINH NGHIỆM ── */}
              <div className="docTwoColSection">
                {/* Cột 1: Quá trình đào tạo - Công tác */}
                <div className="docSectionCard">
                  <div className="docSectionCardHeader">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M6 6h10M6 10h10" />
                    </svg>
                    <h3 className="docSectionTitle">Quá trình đào tạo - Công tác</h3>
                  </div>
                  <div className="docSectionBody">
                    {hasEducation || hasExperience ? (
                      <>
                        {hasEducation && (
                          <div style={{ marginBottom: hasExperience ? '16px' : 0 }}>
                            <p><strong>Quá trình đào tạo:</strong></p>
                            <RichText data={d.education} />
                          </div>
                        )}
                        {hasExperience && (
                          <div>
                            <p><strong>Quá trình công tác:</strong></p>
                            <RichText data={d.experience} />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p><strong>Quá trình đào tạo & công tác:</strong></p>
                        <p>
                          {fullDisplayName} tốt nghiệp bác sĩ chuyên khoa và có nhiều năm học tập, nâng cao nghiệp vụ chuyên môn tại các trường Đại học Y Dược uy tín trong cả nước.
                        </p>
                        <p>
                          Hiện đang công tác và đảm nhiệm vị trí <strong>{d.title || 'Bác sĩ'}</strong> tại <strong>{deptName}</strong> - Bệnh viện Đa khoa Khu vực Thới Lai, luôn tận tâm phục vụ và chăm sóc sức khỏe người dân.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Cột 2: Thế mạnh, kinh nghiệm công tác */}
                <div className="docSectionCard">
                  <div className="docSectionCardHeader">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <h3 className="docSectionTitle">Thế mạnh, kinh nghiệm công tác</h3>
                  </div>
                  <div className="docSectionBody">
                    {hasExpertise || hasAchievements ? (
                      <>
                        {hasExpertise && (
                          <div style={{ marginBottom: hasAchievements ? '16px' : 0 }}>
                            <p><strong>Lĩnh vực chuyên môn:</strong></p>
                            <RichText data={d.expertise} />
                          </div>
                        )}
                        {hasAchievements && (
                          <div>
                            <p><strong>Thành tích & nghiên cứu:</strong></p>
                            <RichText data={d.achievements} />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          Với nhiều năm cống hiến trong ngành y tế, {fullDisplayName} có bề dày kinh nghiệm trong công tác khám chữa bệnh, tư vấn và điều trị chuyên sâu cho người bệnh.
                        </p>
                        <p>
                          Luôn tiên phong cập nhật các phác đồ y khoa hiện đại, chú trọng nâng cao chất lượng dịch vụ y tế, đặt y đức và an toàn của bệnh nhân làm kim chỉ nam trong mọi hoạt động chuyên môn.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tiểu sử bổ sung (nếu có trường bio) */}
              {hasBio && (
                <div className="docBioBox">
                  <div className="docBioBoxHeader">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <h3 className="docSectionTitle">Thông tin giới thiệu thêm</h3>
                  </div>
                  <div className="docSectionBody">
                    <RichText data={d.bio} />
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* ── BÁC SĨ CÙNG CHUYÊN KHOA / ĐƠN VỊ CÔNG TÁC ── */}
          {relatedDoctors.length > 0 && (
            <section className="docRelatedSection">
              <div className="docRelatedHeader">
                <div>
                  <h3 className="docRelatedTitle">Bác sĩ cùng đơn vị công tác</h3>
                  <p className="docRelatedDesc">Đội ngũ y bác sĩ, chuyên gia y tế tại {deptName}</p>
                </div>
                <Link href={`/bac-si?dept=${deptId}`} className="docRelatedViewAll">
                  <span>Xem toàn bộ bác sĩ</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              <div className="docRelatedGrid">
                {relatedDoctors.map((relDoc) => {
                  const relAvatar = mediaUrl(relDoc.avatar)
                  const relFullTitle = relDoc.title || (typeof relDoc.department === 'object' ? relDoc.department?.name : '')
                  const relDisplayName = `${relDoc.degree ? `${relDoc.degree}. ` : ''}${relDoc.name}`

                  return (
                    <Link
                      key={relDoc.id || relDoc.slug}
                      href={`/bac-si/${relDoc.slug}`}
                      className="docRelatedCard"
                    >
                      <div className="docRelatedImgWrap">
                        {relAvatar ? (
                          <img
                            src={relAvatar}
                            alt={relDisplayName}
                            className="docRelatedImg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="docAvatarFallback" style={{ fontSize: '12px' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '42px', height: '42px' }}>
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="docRelatedRole">{relFullTitle}</div>
                      <div className="docRelatedName">{relDisplayName}</div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

