import type { MetadataRoute } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  let seo: any = {}
  try { seo = await getGlobal('seo-settings') } catch {}
  if (seo?.enableSitemap === false || seo?.allowIndexing === false) return []

  const staticPaths = ['', '/gioi-thieu', '/so-do-to-chuc', '/tin-tuc', '/thong-bao', '/dau-thau-mua-sam', '/lich-kham', '/tiem-chung', '/bang-gia', '/van-ban', '/tuyen-dung', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/lien-he']
  const entries: MetadataRoute.Sitemap = staticPaths.map(path => ({ url: base + path, changeFrequency: path ? 'weekly' : 'daily' }))
  try {
    const payload = await getCMS()
    const configs: Array<{ collection: any; prefix: string; published?: boolean }> = [
      { collection: 'news', prefix: '/tin-tuc', published: true },
      { collection: 'notices', prefix: '/thong-bao', published: true },
      { collection: 'procurement', prefix: '/dau-thau-mua-sam', published: true },
      { collection: 'pages', prefix: '/trang', published: true },
      { collection: 'recruitment', prefix: '/tuyen-dung', published: true },
      { collection: 'doctors', prefix: '/bac-si' },
      { collection: 'departments', prefix: '/khoa-phong' },
      { collection: 'specialties', prefix: '/chuyen-khoa' },
    ]
    for (const config of configs) {
      const clauses: any[] = [{ excludeFromSitemap: { not_equals: true } }]
      if (config.published) clauses.push({ _status: { equals: 'published' } })
      const result: any = await payload.find({ collection: config.collection, where: { and: clauses }, limit: 1000, depth: 0 })
      for (const item of result.docs || []) if (item.slug) entries.push({ url: `${base}${config.prefix}/${item.slug}`, lastModified: item.updatedAt || undefined })
    }
  } catch {}
  return entries
}
