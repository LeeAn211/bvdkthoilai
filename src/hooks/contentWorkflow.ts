const pathPrefix: Record<string, string> = {
  news: '/tin-tuc',
  notices: '/thong-bao',
  procurement: '/dau-thau-mua-sam',
  recruitment: '/tuyen-dung',
  pages: '/trang',
}

/** Đồng bộ workflowState với Draft/Published thực tế của Payload. */
export const syncPublishedAt = (dateField = 'publishedAt') => ({ data, originalDoc }: any) => {
  const state = data?.workflowState

  if (state === 'published') data._status = 'published'
  if (state === 'draft' || state === 'submitted' || state === 'approved' || state === 'hidden') data._status = 'draft'

  if (data?._status === 'published') {
    data.workflowState = 'published'
    if (!data?.[dateField] && !originalDoc?.[dateField]) data[dateField] = new Date().toISOString()
  }

  // Khi Payload lưu lại bản nháp từ nút Draft mà client không gửi workflowState,
  // giữ trạng thái biên tập trước đó nếu hợp lệ; bản published cũ không bị đổi URL hay xóa dữ liệu.
  if (data?._status === 'draft' && !state && originalDoc?.workflowState === 'published') {
    data.workflowState = 'draft'
  }
  return data
}

/** Tạo/cập nhật 301 khi slug của nội dung đã từng xuất bản thay đổi. */
export const createSlugRedirect = (collection: string) => async ({ doc, previousDoc, req }: any) => {
  const oldSlug = previousDoc?.slug
  const newSlug = doc?.slug
  const wasPublished = previousDoc?._status === 'published' || previousDoc?.workflowState === 'published'
  const prefix = pathPrefix[collection]
  if (!prefix || !wasPublished || !oldSlug || !newSlug || oldSlug === newSlug) return doc

  const fromPath = `${prefix}/${oldSlug}`
  const toPath = `${prefix}/${newSlug}`
  try {
    const existing = await req.payload.find({
      collection: 'redirects', where: { fromPath: { equals: fromPath } }, limit: 1, depth: 0,
      overrideAccess: true, req,
    })
    if (existing.docs?.[0]) {
      await req.payload.update({
        collection: 'redirects', id: existing.docs[0].id,
        data: { toPath, sourceCollection: collection, sourceId: String(doc.id), active: true },
        overrideAccess: true, req,
      })
    } else {
      await req.payload.create({
        collection: 'redirects',
        data: { fromPath, toPath, sourceCollection: collection, sourceId: String(doc.id), active: true },
        overrideAccess: true, req,
      })
    }
  } catch (error) {
    req.payload.logger.warn({ err: error }, `Không thể tạo chuyển hướng 301 ${fromPath} -> ${toPath}`)
  }
  return doc
}
