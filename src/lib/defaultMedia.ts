import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

const builtIn = {
  news: '/default-content/news.svg',
  notices: '/default-content/notices.svg',
  procurement: '/default-content/procurement.svg',
  recruitment: '/default-content/recruitment.svg',
  documents: '/default-content/documents.svg',
  schedules: '/default-content/schedules.svg',
  vaccinations: '/default-content/vaccinations.svg',
}

export async function getDefaultContentMedia() {
  try {
    const payload = await getCMS()
    const settings: any = await payload.findGlobal({ slug: 'default-media-settings', depth: 1 })
    return {
      news: mediaUrl(settings?.news) || builtIn.news,
      notices: mediaUrl(settings?.notices) || builtIn.notices,
      procurement: mediaUrl(settings?.procurement) || builtIn.procurement,
      recruitment: mediaUrl(settings?.recruitment) || builtIn.recruitment,
      documents: mediaUrl(settings?.documents) || builtIn.documents,
      schedules: mediaUrl(settings?.schedules) || builtIn.schedules,
      vaccinations: mediaUrl(settings?.vaccinations) || builtIn.vaccinations,
      custom: Object.fromEntries((settings?.customDefaults || []).filter((item: any) => item?.key && item?.image).map((item: any) => [String(item.key).trim(), mediaUrl(item.image)])),
    }
  } catch {
    return builtIn
  }
}

export function categoryName(item: any) {
  const ref = item?.categoryRef
  if (ref && typeof ref === 'object' && ref.name) return String(ref.name)
  return String(item?.category || item?.type || '').trim()
}
