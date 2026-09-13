type MenuItem = Record<string, any>

const prefix: Record<string, string> = {
  pages: '/trang',
  news: '/tin-tuc',
  notices: '/thong-bao',
  procurement: '/dau-thau-mua-sam',
  recruitment: '/tuyen-dung',
  departments: '/khoa-phong',
  specialties: '/chuyen-khoa',
  doctors: '/bac-si',
  'scientific-activities': '/hoat-dong-khoa-hoc',
}

export function resolveMenuUrl(item: MenuItem): string {
  if (!item) return '/'

  // Support section selections saved by both new and older Admin forms.
  if (item.preset && (!item.linkType || item.linkType === 'preset')) {
    return item.preset
  }

  // Existing menu records remain valid.
  if ((!item.linkType || item.linkType === 'url') && item.url) {
    return item.url
  }

  if ((item.linkType === 'auto-section' || item.linkType === 'content-section') && item.url) {
    return item.url
  }

  if (item.linkType === 'preset' && item.preset) {
    return item.preset
  }

  if (item.linkType === 'parent') return '#'

  if (item.linkType === 'custom' && item.customUrl) {
    return item.customUrl
  }

  if (item.linkType === 'reference' && item.reference) {
    const ref = item.reference

    if (ref.relationTo && ref.value && typeof ref.value === 'object') {
      const base = prefix[ref.relationTo]
      if (base && ref.value.slug) return `${base}/${ref.value.slug}`
    }
  }

  // Fall back to the legacy URL if present.
  if (item.url) return item.url

  return '/'
}

export const isExternalUrl = (url: string) => /^https?:\/\//i.test(url)
