import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kỹ thuật chuyên sâu — Bệnh viện Đa khoa Thới Lai',
  description: 'Các kỹ thuật y khoa hiện đại, phương pháp điều trị tiên tiến được ứng dụng tại Bệnh viện Đa khoa Thới Lai.',
}

export default async function AdvancedTechniquesListPage() {
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

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHUYÊN KHOA & CÔNG NGHỆ Y TẾ"
        title="Kỹ thuật chuyên sâu"
        description="Tiên phong ứng dụng các tiến bộ y khoa và kỹ thuật công nghệ cao phục vụ công tác khám, tầm soát và điều trị người bệnh."
      />
      <main className="section soft">
        <div className="container">
          {techniques.length ? (
            <div className="directoryGrid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {techniques.map((item) => {
                const department = typeof item.department === 'object' ? item.department?.name : ''
                const cover = mediaUrl(item.cover)
                return (
                  <Link
                    className="directoryCard"
                    href={`/ky-thuat-chuyen-sau/${item.slug}`}
                    key={item.id}
                    style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', borderRadius: '14px', border: '1px solid #dbe8f2', background: '#fff' }}
                  >
                    {cover ? (
                      <div style={{ width: '100%', aspectRatio: '1 / 1.15', maxHeight: '260px', backgroundColor: '#f8fbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={cover}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                          loading="lazy"
                        />
                        {item.badge && (
                          <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(255,255,255,0.92)', color: '#0754a8', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, #eef6fc, #d9ecfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ fontSize: '32px', color: '#0754a8' }}>🔬</span>
                        {item.badge && (
                          <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#fff', color: '#0754a8', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <small style={{ color: '#0876c9', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', marginBottom: '6px' }}>
                        {department || item.badge || 'KỸ THUẬT CHUYÊN SÂU'}
                      </small>
                      <h3 style={{ fontSize: '16px', lineHeight: '1.45', margin: '0 0 8px', color: '#0f3c64', fontWeight: '700' }}>
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p style={{ margin: '0', fontSize: '13px', color: '#5f7587', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.summary}
                        </p>
                      )}
                      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#0876c9', fontSize: '13px', fontWeight: '600' }}>
                        Xem chi tiết →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="professionalEmpty">
              Danh sách kỹ thuật chuyên sâu đang được cập nhật từ hệ thống quản trị.
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
