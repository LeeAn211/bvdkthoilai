import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { draftMode } from 'next/headers'

export const getCMS = async () => getPayload({ config })

export const getGlobal = cache(async (slug: 'site-settings' | 'navigation' | 'homepage' | 'organization-chart' | 'hospital-history' | 'about-page' | 'upload-settings' | 'footer' | 'contact-settings' | 'social-settings' | 'medpro-settings' | 'theme-settings' | 'default-media-settings' | 'seo-settings' | 'chatbot-settings' | 'system-settings' | 'schedule-settings' | 'quick-links-settings' | 'working-hours-settings' | 'patient-portal-settings' | 'appointment-settings' | 'display-settings' | 'examination-flow-settings' | 'inpatient-guide-settings' | 'checkup-packages-settings' | 'hospital-map-settings' | 'hospital-quality-settings' | 'survey-page-settings' | 'faq-page-settings' | 'forms-page-settings' | 'feedback-page-settings' | (string & {})) => {
  const payload = await getCMS()
  // Lấy đầy đủ thông tin Media (url, filename, kích thước) cho logo và banner.
  return payload.findGlobal({ slug: slug as any, depth: 2 })
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
