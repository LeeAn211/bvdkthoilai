import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './ky-thuat-chuyen-sau.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kỹ thuật chuyên sâu | Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Các kỹ thuật y khoa hiện đại, phương pháp điều trị tiên tiến được ứng dụng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function AdvancedTechniquesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const searchQuery = (params.q || '').trim().toLowerCase()

  let techniques: any[] = []
  try {
    const payload = await getCMS()
    const result = await payload.find({
      collection: 'advanced-techniques',
      where: { active: { equals: true } },
      limit: 100,
      sort: ['order', '-createdAt'],
      depth: 1,
    })
    techniques = result.docs as any[]
  } catch {}

  const filteredTechniques = techniques.filter((item) => {
    if (!searchQuery) return true
    const deptName = typeof item.department === 'object' ? item.department?.name || '' : ''
    const text = `${item.title || ''} ${item.summary || ''} ${item.badge || ''} ${deptName}`.toLowerCase()
    return text.includes(searchQuery)
  })

  return (
    <>
      <SiteHeader />
      <main className="techniquesPage">
        {/* ── BANNER HEADER CHUẨN Y TẾ ĐỒNG BỘ ───────────────── */}
        <section className="techniquesHero">
          <div className="container techniquesHeroInner">
            <nav className="techniquesBreadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span aria-hidden="true">/</span>
              <span>Kỹ thuật chuyên sâu</span>
            </nav>

            <h1 className="techniquesHeroTitle">Kỹ thuật chuyên sâu</h1>
            <p className="techniquesHeroDesc">
              Tiên phong ứng dụng các tiến bộ y khoa và kỹ thuật công nghệ cao phục vụ công tác khám, tầm soát và điều trị người bệnh.
            </p>
          </div>
        </section>

        {/* ── THANH CÔNG CỤ TÌM KIẾM & THỐNG KÊ ──────────────── */}
        <section className="techniquesFilterSection">
          <div className="container">
            <form method="GET" action="/ky-thuat-chuyen-sau" className="techniquesFilterInner">
              <div className="techniquesSearchBox">
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q || ''}
                  placeholder="Tìm kiếm kỹ thuật, công nghệ y khoa..."
                  className="techniquesSearchInput"
                />
                <span className="techniquesSearchIcon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
              </div>

              <div className="techniquesCountBadge">
                Tổng số: <strong>{filteredTechniques.length}</strong> kỹ thuật
              </div>
            </form>
          </div>
        </section>

        {/* ── DANH SÁCH THẺ KỸ THUẬT CHUYÊN SÂU ───────────────── */}
        <section className="container techniquesGridSection">
          {filteredTechniques.length ? (
            <div className="techniquesGrid">
              {filteredTechniques.map((item) => {
                const department = typeof item.department === 'object' ? item.department?.name : ''
                const cover = mediaUrl(item.cover)
                return (
                  <Link
                    className="techniqueCard"
                    href={`/ky-thuat-chuyen-sau/${item.slug}`}
                    key={item.id}
                  >
                    {cover ? (
                      <div className="techniqueCoverWrap">
                        <img
                          src={cover}
                          alt={item.title}
                          className="techniqueCoverImg"
                          style={{
                            objectFit: item.imageFit === 'fill' ? 'fill' : ((item.imageFit === 'cover' || item.imageFit === 'cover-top' || item.imageFit === 'cover-center' || item.imageFit === 'cover-bottom') ? 'cover' : 'contain'),
                            objectPosition: (item.imageFit === 'cover' || item.imageFit === 'cover-top') ? 'top center' : (item.imageFit === 'cover-bottom' ? 'bottom center' : 'center center'),
                          }}
                          loading="lazy"
                        />
                        {item.badge && (
                          <span className="techniqueBadge">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="techniqueFallbackVisual">
                        <span>🔬</span>
                        {item.badge && (
                          <span className="techniqueBadge">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="techniqueBody">
                      <small className="techniqueDeptTag">
                        {department || item.badge || 'KỸ THUẬT TIÊN TIẾN'}
                      </small>
                      <h3 className="techniqueTitle">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="techniqueSummary">
                          {item.summary}
                        </p>
                      )}
                      <div className="techniqueAction">
                        <span>Xem chi tiết</span>
                        <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="professionalEmpty">
              {searchQuery
                ? `Không tìm thấy kỹ thuật chuyên sâu nào phù hợp với từ khóa "${params.q}".`
                : 'Danh sách kỹ thuật chuyên sâu đang được cập nhật từ hệ thống quản trị.'}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
