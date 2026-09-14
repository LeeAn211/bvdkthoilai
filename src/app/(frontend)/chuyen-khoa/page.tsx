import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'
import './specialties.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Danh sách Chuyên khoa | BVĐK Khu vực Thới Lai',
  description: 'Danh mục các lĩnh vực chuyên khoa, chuyên môn sâu và khoa phòng phụ trách tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function SpecialtiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = (params.q || '').trim().toLowerCase()

  let rawSpecialties: any[] = []
  try {
    const payload = await getCMS()
    const result = await payload.find({
      collection: 'specialties',
      where: {
        and: [
          { active: { equals: true } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 200,
      sort: ['order', 'name'],
      depth: 1,
    })
    rawSpecialties = result.docs as any[]
  } catch {}

  // Lọc theo từ khóa tìm kiếm nếu có
  const specialties = rawSpecialties.filter((item) => {
    if (!query) return true
    const nameMatch = (item.name || '').toLowerCase().includes(query)
    const summaryMatch = (item.summary || '').toLowerCase().includes(query)
    const dept = typeof item.department === 'object' ? (item.department?.name || '').toLowerCase() : ''
    const deptMatch = dept.includes(query)
    return nameMatch || summaryMatch || deptMatch
  })

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHUYÊN MÔN Y TẾ"
        title="Danh mục Chuyên khoa"
        description="Thông tin chi tiết các chuyên khoa chuyên môn sâu, khoa/phòng phụ trách và đội ngũ bác sĩ giàu kinh nghiệm tại Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="specialtiesListPage">
        <div className="container" style={{ marginTop: '36px' }}>
          {/* Thanh tìm kiếm nhanh chuyên khoa */}
          <div className="specialtiesFilterBar">
            <form className="specialtiesSearchForm" method="GET" action="/chuyen-khoa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={params.q || ''}
                placeholder="Tìm chuyên khoa, triệu chứng hoặc khoa phòng phụ trách..."
                className="specialtiesSearchInput"
              />
            </form>
            <div className="specialtiesCountBadge">
              {specialties.length} Chuyên khoa
            </div>
          </div>

          {/* Lưới danh sách Chuyên khoa */}
          {specialties.length > 0 ? (
            <div className="specialtiesModernGrid">
              {specialties.map((item) => {
                const department = typeof item.department === 'object' ? item.department?.name : ''
                return (
                  <Link
                    key={item.id}
                    href={`/chuyen-khoa/${item.slug}`}
                    className="specialtyCardModern"
                  >
                    <div className="specialtyCardTop">
                      <div className="specialtyCardIconBox">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 10.5h-4.5V6a1.5 1.5 0 0 0-3 0v4.5H7a1.5 1.5 0 0 0 0 3h4.5V18a1.5 1.5 0 0 0 3 0v-4.5H19a1.5 1.5 0 0 0 0-3z" />
                        </svg>
                      </div>
                      {department && (
                        <span className="specialtyCardDeptBadge" title={department}>
                          {department}
                        </span>
                      )}
                    </div>

                    <h3 className="specialtyCardTitle">{item.name}</h3>
                    <p className="specialtyCardDesc">
                      {item.summary || 'Thông tin chuyên môn, dịch vụ kỹ thuật cao và đội ngũ bác sĩ chuyên khoa phụ trách.'}
                    </p>

                    <div className="specialtyCardFooter">
                      <span>Xem chi tiết chuyên khoa</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="professionalEmpty" style={{ background: '#ffffff', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 16px' }}>
                Không tìm thấy chuyên khoa nào phù hợp với từ khóa &ldquo;{params.q}&rdquo;.
              </p>
              <Link href="/chuyen-khoa" className="btn btn-outline" style={{ display: 'inline-block' }}>
                ← Xem toàn bộ chuyên khoa
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

