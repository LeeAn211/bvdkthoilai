import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'

type Props = { params: Promise<{ slug: string }> }

async function getItem(slug: string) {
  const payload = await getCMS()
  const data = await payload.find({
    collection: 'advanced-techniques',
    where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
    limit: 1,
    depth: 2,
  })
  return data.docs[0] as any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const [item, defaults] = await Promise.all([getItem(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.news
    return {
      title: item.seoTitle || `${item.title} — Kỹ thuật chuyên sâu`,
      description: item.seoDescription || item.summary,
      openGraph: {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.summary,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function AdvancedTechniqueDetailPage({ params }: Props) {
  const { slug } = await params
  let item: any
  try {
    item = await getItem(slug)
  } catch {
    notFound()
  }
  if (!item) notFound()

  const department = typeof item.department === 'object' ? item.department : null
  const coverUrl = mediaUrl(item.cover)

  return (
    <>
      <SiteHeader />
      <main className="article-shell container">
        <div className="article-meta">
          <span>KỸ THUẬT CHUYÊN SÂU</span>
          {item.badge && <> · <strong>{item.badge}</strong></>}
          {department?.name && (
            <>
              {' '}· Khoa/Phòng:{' '}
              <Link href={`/khoa-phong/${department.slug}`} style={{ color: 'var(--site-primary, #0878d1)' }}>
                {department.name}
              </Link>
            </>
          )}
        </div>

        <h1 style={{ color: 'var(--site-secondary, #0754a8)', marginTop: '8px', marginBottom: '16px' }}>
          {item.title}
        </h1>

        {item.summary && <p className="article-lead" style={{ fontSize: '16px', lineHeight: 1.6, color: '#32506d' }}>{item.summary}</p>}

        {coverUrl && item.showCoverInDetail === true && (
          <div style={{ margin: '24px 0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #dce8f1', maxHeight: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f9fc' }}>
            <img
              src={coverUrl}
              alt={item.title}
              style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'contain' }}
            />
          </div>
        )}

        {Array.isArray(item.advantages) && item.advantages.length > 0 && (
          <div
            style={{
              margin: '24px 0',
              padding: '20px 24px',
              backgroundColor: '#f0f7fd',
              borderRadius: '14px',
              border: '1px solid #bce0f8',
            }}
          >
            <h3 style={{ margin: '0 0 12px', color: '#0754a8', fontSize: '18px' }}>
              ✦ Ưu điểm vượt trội của kỹ thuật:
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#18344e', lineHeight: 1.7 }}>
              {item.advantages.map((adv: any, idx: number) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{adv.text}</li>
              ))}
            </ul>
          </div>
        )}

        {item.indications && (
          <div
            style={{
              margin: '20px 0',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #dce8f1',
            }}
          >
            <strong style={{ color: '#0878d1', display: 'block', marginBottom: '6px' }}>
              Đối tượng / Trường hợp chỉ định:
            </strong>
            <p style={{ margin: 0, color: '#3a5874', lineHeight: 1.6 }}>{item.indications}</p>
          </div>
        )}

        <div style={{ marginTop: '28px', lineHeight: 1.8 }}>
          <RichText data={item.content} />
        </div>

        <AttachmentList items={item.attachments} />

        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #dce8f1' }}>
          <BackToList href="/" label="← Trở lại Trang chủ" />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
