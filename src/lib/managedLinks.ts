import { slugifyVietnamese } from '@/fields/common'

const relationId = (value: any) => {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'object' && value.id != null) return value.id
  if (typeof value === 'object' && value.value != null) {
    if (typeof value.value === 'object' && value.value.id != null) return value.value.id
    return value.value
  }
  return null
}

const relationSlug = (value: any) => {
  if (!value || typeof value !== 'object') return ''
  if (typeof value.slug === 'string') return value.slug
  if (value.value && typeof value.value === 'object' && typeof value.value.slug === 'string') return value.value.slug
  return ''
}

async function loadPage(req: any, value: any) {
  const directSlug = relationSlug(value)
  if (directSlug) return { id: relationId(value), slug: directSlug }
  const id = relationId(value)
  if (id == null) return null
  try {
    const page = await req.payload.findByID({ collection: 'pages', id, depth: 0, overrideAccess: true })
    return page ? { id: page.id, slug: page.slug } : null
  } catch {
    return null
  }
}

async function findOrCreateContentSection(req: any, title: string, requestedSlug?: string) {
  const slug = slugifyVietnamese(requestedSlug?.trim() || title)
  if (!slug) return null

  const existing = await req.payload.find({
    collection: 'content-sections',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs?.[0]) return existing.docs[0]

  return await req.payload.create({
    collection: 'content-sections',
    data: {
      title: title.trim(),
      slug,
      active: true,
      workflowState: 'published',
      _status: 'published',
    } as any,
    draft: false,
    overrideAccess: true,
  } as any)
}

async function loadContentSection(req: any, value: any) {
  const directSlug = relationSlug(value)
  if (directSlug) return { id: relationId(value), slug: directSlug }
  const id = relationId(value)
  if (id == null) return null
  try {
    const section = await req.payload.findByID({ collection: 'content-sections', id, depth: 0, overrideAccess: true })
    return section ? { id: section.id, slug: section.slug } : null
  } catch {
    return null
  }
}

async function findOrCreatePage(req: any, title: string, requestedSlug?: string) {
  const slug = slugifyVietnamese(requestedSlug?.trim() || title)
  if (!slug) return null

  const existing = await req.payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs?.[0]) return existing.docs[0]

  return await req.payload.create({
    collection: 'pages',
    data: {
      title: title.trim(),
      slug,
      layout: [],
      workflowState: 'published',
      _status: 'published',
    } as any,
    draft: false,
    overrideAccess: true,
  } as any)
}

export async function resolveSmartLink(req: any, item: any, fallbackTitle = 'Trang nội dung') {
  if (!item || typeof item !== 'object') return item
  const mode = item.linkMode

  if (mode === 'existing-page') {
    const page = await loadPage(req, item.linkedPage)
    if (page?.slug) item.url = `/trang/${page.slug}`
    return item
  }

  if (mode === 'auto-page') {
    const title = String(item.newPageTitle || item.title || item.label || fallbackTitle).trim()
    const page = await findOrCreatePage(req, title, item.newPageSlug)
    if (page?.slug) {
      item.linkedPage = page.id
      item.url = `/trang/${page.slug}`
    }
    return item
  }

  if (mode === 'internal' && typeof item.url === 'string' && item.url.trim()) {
    const value = item.url.trim()
    item.url = value.startsWith('/') ? value : `/${value}`
  }
  return item
}

export async function resolveNavigationItem(req: any, item: any) {
  if (!item || typeof item !== 'object') return item
  if (item.linkType === 'auto-page') {
    const title = String(item.newPageTitle || item.label || 'Trang nội dung').trim()
    const page = await findOrCreatePage(req, title, item.newPageSlug)
    if (page?.slug) {
      item.linkType = 'reference'
      item.reference = { relationTo: 'pages', value: page.id }
      item.url = `/trang/${page.slug}`
    }
  }
  if (item.linkType === 'auto-section') {
    const title = String(item.newSectionTitle || item.label || 'Mục nội dung').trim()
    const section = await findOrCreateContentSection(req, title, item.newSectionSlug)
    if (section?.slug) {
      item.contentSection = section.id
      item.url = `/${section.slug}`
    }
  }
  if (item.linkType === 'content-section') {
    const section = await loadContentSection(req, item.contentSection)
    if (section?.slug) item.url = `/${section.slug}`
  }
  if (Array.isArray(item.children)) {
    for (const child of item.children) await resolveNavigationItem(req, child)
  }
  return item
}

export async function resolveHomepageLinks(req: any, data: any) {
  for (const section of data?.sections || []) {
    for (const tab of section.contentTabs || []) {
      for (const item of tab.manualItems || []) await resolveSmartLink(req, item, item.title || tab.label || section.title)
    }
    for (const tab of section.departmentTabs || []) {
      for (const item of tab.manualItems || []) await resolveSmartLink(req, item, item.title || tab.label || section.title)
    }
    for (const tab of section.scheduleTabOrder || []) {
      for (const item of tab.manualItems || []) await resolveSmartLink(req, item, item.title || tab.label || section.title)
    }
    for (const tab of section.vaccinationTabOrder || []) {
      for (const item of tab.manualItems || []) await resolveSmartLink(req, item, item.title || tab.label || section.title)
    }

    if (section.type === 'custom') {
      const mode = section.buttonLinkMode
      if (mode === 'existing-page') {
        const page = await loadPage(req, section.buttonPage)
        if (page?.slug) section.buttonUrl = `/trang/${page.slug}`
      } else if (mode === 'auto-page') {
        const title = String(section.buttonNewPageTitle || section.title || 'Trang nội dung').trim()
        const page = await findOrCreatePage(req, title, section.buttonNewPageSlug)
        if (page?.slug) {
          section.buttonPage = page.id
          section.buttonUrl = `/trang/${page.slug}`
        }
      } else if (mode === 'internal' && typeof section.buttonUrl === 'string' && section.buttonUrl.trim()) {
        const value = section.buttonUrl.trim()
        section.buttonUrl = value.startsWith('/') ? value : `/${value}`
      }
    }
  }
  return data
}
