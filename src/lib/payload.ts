import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { draftMode } from 'next/headers'

export const getCMS = async () => getPayload({ config })

export const getGlobal = cache(async (slug: 'site-settings' | 'navigation' | 'homepage' | 'organization-chart' | 'upload-settings' | 'footer' | 'contact-settings' | 'social-settings' | 'medpro-settings' | 'theme-settings' | 'default-media-settings' | 'seo-settings' | 'chatbot-settings' | 'system-settings' | 'schedule-settings' | 'quick-links-settings') => {
  const payload = await getCMS()
  // Lấy đầy đủ thông tin Media (url, filename, kích thước) cho logo và banner.
  return payload.findGlobal({ slug, depth: 2 })
})

export async function findPublished(collection: any, options: Record<string, any> = {}) {
  const payload = await getCMS()
  return payload.find({
    collection,
    where: { _status: { equals: 'published' }, ...(options.where || {}) },
    sort: options.sort || '-publishedAt',
    limit: options.limit || 20,
    depth: options.depth ?? 1,
    page: options.page || 1
  })
}

export async function getHomepage() {
  const payload = await getCMS()
  const draft = await draftMode()
  return payload.findGlobal({ slug: 'homepage', depth: 2, draft: draft.isEnabled })
}
