import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './bac-si.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Đội ngũ bác sĩ | BVĐK Khu vực Thới Lai',
  description: 'Danh sách và thông tin đội ngũ bác sĩ, chuyên gia y tế giàu kinh nghiệm tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; dept?: string; page?: string }>
}) {
  const params = await searchParams
  const searchQuery = (params.q || '').trim().toLowerCase()
  const selectedDept = (params.dept || '').trim()
  const currentPage = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const pageSize = 12

  let allDoctors: any[] = []
  let departments: any[] = []
  let siteSettings: any = null

  try {
    const [payload, siteRes] = await Promise.all([
      getCMS(),
      getGlobal('site-settings').catch(() => null),
    ])
    siteSettings = siteRes

    // Lấy danh sách khoa/phòng để làm bộ lọc
    const deptResult = await payload.find({
      collection: 'departments',
      where: { active: { equals: true } },
      sort: ['order', 'name'],
      limit: 100,
    })
    departments = deptResult.docs as any[]

    // Lấy danh sách bác sĩ
    const docResult = await payload.find({
      collection: 'doctors',
      limit: 300,
      sort: ['order', 'name'],
      depth: 2,
    })
    const rawDocs = (docResult.docs as any[]).filter((item) => item.active !== false)

    // NGUYÊN TẮC BẮT BUỘC TOÀN DỰ ÁN:
    // Ban Giám đốc (Giám đốc -> Phó Giám đốc) luôn luôn hiển thị ở trang đầu, sắp xếp từ trên xuống dưới
    const getLeadershipRank = (doc: any): number => {
      const title = (doc.title || '').toLowerCase()
      const dept = (typeof doc.department === 'object' ? doc.department?.name : '').toLowerCase()
      const isBoard = dept.includes('ban giám đốc') || title.includes('giám đốc')

      if (isBoard) {
        if (title.includes('phó') || title.includes('pho')) return 2 // Phó Giám đốc
        if (title.includes('giám đốc') || title.includes('giam doc')) return 1 // Giám đốc
        return 3 // Thành viên Ban Giám đốc khác
      }
      if (doc.featured) return 4 // Bác sĩ nổi bật
      return 10 // Bác sĩ thông thường
    }

    allDoctors = rawDocs.sort((a, b) => {
      const rankA = getLeadershipRank(a)
      const rankB = getLeadershipRank(b)
      if (rankA !== rankB) return rankA - rankB
      const orderA = typeof a.order === 'number' ? a.order : 999
      const orderB = typeof b.order === 'number' ? b.order : 999
      if (orderA !== orderB) return orderA - orderB
      return (a.name || '').localeCompare(b.name || '', 'vi')
    })
  } catch {}

  // Lọc theo từ khóa tìm kiếm & Khoa phòng
  const filteredDoctors = allDoctors.filter((doc) => {
    const deptId = typeof doc.department === 'object' ? doc.department?.id : doc.department
    const deptName = typeof doc.department === 'object' ? doc.department?.name : ''
    const specialty = typeof doc.specialtyRef === 'object' ? doc.specialtyRef?.name : doc.specialty || ''
    const matchDept = !selectedDept || String(deptId) === selectedDept || deptName === selectedDept

    const textToSearch = `${doc.name || ''} ${doc.title || ''} ${doc.degree || ''} ${deptName || ''} ${specialty || ''}`.toLowerCase()
    const matchSearch = !searchQuery || textToSearch.includes(searchQuery)

    return matchDept && matchSearch
  })

  // Phân trang
  const totalItems = filteredDoctors.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + pageSize)

  return (
    <>
      <SiteHeader />
      <main className="doctorsPage">
        {/* ── BANNER HEADER ───────────────── */}
        <section className="doctorsHero">
          <div className="container doctorsHeroInner">
            <div className="doctorsBreadcrumb">
              <a href="/">Trang chủ</a>
              <span>/</span>
              <span>Đội ngũ bác sĩ</span>
            </div>
            <h1 className="doctorsHeroTitle">Danh sách Bác sĩ</h1>
            <p className="doctorsHeroDesc">
              Quy tụ đội ngũ thầy thuốc giàu kinh nghiệm, tận tụy và tâm huyết, luôn đặt y đức và an toàn của người bệnh lên hàng đầu.
            </p>
          </div>
        </section>

        {/* ── THANH CÔNG CỤ TÌM KIẾM & BỘ LỌC KHOA PHÒNG ─ */}
        <section className="doctorsFilterSection">
          <div className="container">
            <form method="GET" action="/bac-si" className="doctorsFilterInner">
              <div className="doctorsSearchBox">
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q || ''}
                  placeholder="Tìm theo tên bác sĩ, học vị, chuyên khoa..."
                  className="doctorsSearchInput"
                />
                <span className="doctorsSearchIcon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
              </div>

              <div className="doctorsSelectGroup">
                <select
                  name="dept"
                  defaultValue={selectedDept}
                  className="doctorsSelect"
                  aria-label="Chọn chuyên khoa/khoa phòng"
                >
                  <option value="">Tất cả Chuyên khoa / Khoa phòng</option>
                  {departments.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <button type="submit" className="doctorsSearchBtn">
                  Tìm kiếm
                </button>

                {(searchQuery || selectedDept) && (
                  <a href="/bac-si" className="doctorsResetBtn">
                    Đặt lại
                  </a>
                )}
              </div>

              <div className="doctorsCountBadge">
                Tổng số: <strong>{totalItems}</strong> bác sĩ
              </div>
            </form>
          </div>
        </section>

        {/* ── DANH SÁCH THẺ BÁC SĨ ─── */}
        <section className="container doctorsGridSection">
          {paginatedDoctors.length > 0 ? (
            <div className="doctorsGrid">
              {paginatedDoctors.map((doc: any) => {
                const avatar = mediaUrl(doc.avatar)
                const deptName = typeof doc.department === 'object' ? doc.department?.name : ''
                const specialtyName = typeof doc.specialtyRef === 'object' ? doc.specialtyRef?.name : doc.specialty || ''
                const subtitle = doc.title || deptName || specialtyName || 'Bệnh viện Đa khoa Khu vực Thới Lai'
                
                // Kết hợp học vị + tên đầy đủ (VD: PGS.TS. Phan Thu Phương)
                const prefix = doc.degree ? `${doc.degree}. ` : ''
                const fullDisplayName = doc.name.startsWith(doc.degree || '___') ? doc.name : `${prefix}${doc.name}`

                return (
                  <a href={`/bac-si/${doc.slug}`} className="doctorCard" key={doc.id} title={fullDisplayName}>
                    {doc.featured && (
                      <span className="doctorCardFeaturedTag">Nổi bật</span>
                    )}

                    <div className="doctorCardImageWrap">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={fullDisplayName}
                          className="doctorCardImg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="doctorCardAvatarFallback">
                          {doc.name?.slice(0, 1) || 'BS'}
                        </div>
                      )}
                    </div>

                    <div className="doctorCardBody">
                      <h2 className="doctorCardName">
                        {fullDisplayName}
                      </h2>
                      <p className="doctorCardDept" title={subtitle}>
                        {subtitle}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="doctorsEmpty">
              <span className="doctorsEmptyIcon">👨‍⚕️</span>
              <h3>Không tìm thấy bác sĩ phù hợp</h3>
              <p>Vui lòng thử lại với từ khóa khác hoặc chọn danh mục khoa phòng khác.</p>
            </div>
          )}

          {/* ── PHÂN TRANG CHUẨN ───────────────────────────── */}
          {totalPages > 1 && (
            <div className="doctorsPagination">
              {currentPage > 1 ? (
                <a
                  href={`/bac-si?page=${currentPage - 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}${selectedDept ? `&dept=${encodeURIComponent(selectedDept)}` : ''}`}
                  className="doctorsPageBtn"
                  aria-label="Trang trước"
                >
                  ‹
                </a>
              ) : (
                <span className="doctorsPageBtn disabled">‹</span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage
                return (
                  <a
                    key={p}
                    href={`/bac-si?page=${p}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}${selectedDept ? `&dept=${encodeURIComponent(selectedDept)}` : ''}`}
                    className={`doctorsPageBtn ${isActive ? 'active' : ''}`}
                  >
                    {p}
                  </a>
                )
              })}

              {currentPage < totalPages ? (
                <a
                  href={`/bac-si?page=${currentPage + 1}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}${selectedDept ? `&dept=${encodeURIComponent(selectedDept)}` : ''}`}
                  className="doctorsPageBtn"
                  aria-label="Trang sau"
                >
                  ›
                </a>
              ) : (
                <span className="doctorsPageBtn disabled">›</span>
              )}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
