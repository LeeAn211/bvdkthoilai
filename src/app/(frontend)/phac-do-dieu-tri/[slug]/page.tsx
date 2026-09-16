import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { DocumentDetailView } from '@/components/DocumentDetailView'
import { BackToList } from '@/components/BackToList'
import { getCMS } from '@/lib/payload'
import { mediaFormat, mediaLabel, mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { RichText } from '@/components/RichText'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

async function getData(slug: string) {
  const payload = await getCMS()
  const [current, latest] = await Promise.all([
    payload.find({
      collection: 'clinical-protocols' as any,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }).catch(() => ({ docs: [] })),
    payload.find({
      collection: 'clinical-protocols' as any,
      where: { slug: { not_equals: slug } },
      sort: '-issuedAt',
      limit: 6,
      depth: 2,
    }).catch(() => ({ docs: [] })),
  ])
  return {
    item: (current.docs[0] as any) || null,
    related: (latest.docs as any[]) || [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.documents
    return {
      title: item.seoTitle || item.title,
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

export default async function Page({ params }: Props) {
  const { slug } = await params
  const { item, related } = await getData(slug)

  if (!item) notFound()

  const specName = typeof item.specialty === 'object' && item.specialty?.name ? item.specialty.name : ''
  const cat = specName || item.documentType || 'Phác đồ điều trị'
  const fileUrl = mediaUrl(item.file)
  const fileName = mediaLabel(item.file)
  const fileFormat = mediaFormat(item.file)

  let defaultPin = 'BVTL2026'
  let hospitalName = 'Bệnh viện Đa khoa Khu vực Thới Lai'
  try {
    const payload = await getCMS()
    const settings = await payload.findGlobal({ slug: 'site-settings' as any }) as any
    if (settings?.defaultDocumentPin) defaultPin = settings.defaultDocumentPin
    if (settings?.hospitalName) hospitalName = settings.hospitalName
  } catch {}

  const docData = {
    id: item.id,
    title: item.title,
    number: item.code,
    issuedAt: item.issuedAt ? new Date(item.issuedAt).toLocaleDateString('vi-VN') : '',
    effectiveAt: item.effectiveAt ? new Date(item.effectiveAt).toLocaleDateString('vi-VN') : '',
    documentType: item.documentType || 'Phác đồ điều trị',
    category: cat,
    issuer: item.issuer || hospitalName,
    signer: item.signer,
    summary: item.summary,
    content: item.content,
    fileUrl,
    fileName,
    fileFormat,
    accessMode: item.accessMode || 'public',
    pinCode: item.pinCode,
    defaultPin,
    allowDownload: item.allowDownload !== false,
    preventCopy: Boolean(item.preventCopy),
    showViewer: item.showViewer !== false,
    textAlign: item.textAlign || 'left',
    titleColor: item.titleColor || 'default',
    titleSize: item.titleSize || 'normal',
    summaryColor: item.summaryColor || 'default',
    summarySize: item.summarySize || 'normal',
  }

  return (
    <>
      <SiteHeader />
      <main className="section" style={{ background: '#f8fafc', minHeight: '80vh', padding: '32px 0 60px' }}>
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: 20, fontSize: '0.9rem', color: '#64748b' }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Trang chủ</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/phac-do-dieu-tri" style={{ color: '#64748b', textDecoration: 'none' }}>Phác đồ điều trị</Link>
            {cat && (
              <>
                <span style={{ margin: '0 8px' }}>/</span>
                <span style={{ color: '#0878d1', fontWeight: 500 }}>{cat}</span>
              </>
            )}
          </nav>

          <DocumentDetailView doc={docData} />

          {item.content && (
            <div style={{ maxWidth: 1100, margin: '30px auto 0', background: '#fff', padding: '24px 30px', borderRadius: 14, border: '1px solid #dce8f1' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: '#18344e' }}>Nội dung chi tiết</h3>
              <RichText data={item.content} />
            </div>
          )}

          {related.length > 0 && (
            <div style={{ maxWidth: 1100, margin: '40px auto 0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, color: '#18344e' }}>
                Phác đồ điều trị liên quan khác
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {related.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/phac-do-dieu-tri/${rel.slug}`}
                    style={{
                      background: '#fff',
                      padding: '16px 20px',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div>
                      {rel.code && (
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0878d1', display: 'block', marginBottom: 4 }}>
                          {rel.code}
                        </span>
                      )}
                      <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.45 }}>
                        {rel.title}
                      </h4>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                      <span>{rel.issuedAt ? new Date(rel.issuedAt).toLocaleDateString('vi-VN') : ''}</span>
                      <span style={{ color: '#0878d1', fontWeight: 600 }}>Xem phác đồ →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ maxWidth: 1100, margin: '30px auto 0' }}>
            <BackToList href="/phac-do-dieu-tri" label="Trở lại danh sách Phác đồ điều trị" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
