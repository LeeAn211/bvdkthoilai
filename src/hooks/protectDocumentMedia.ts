import type { CollectionAfterChangeHook } from 'payload'

const mediaID = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) return (value as { id: string | number }).id
  return null
}

/**
 * Tài liệu không công khai luôn kéo file đính kèm về mức restricted.
 * Hook không tự hạ restricted về public để tránh vô tình công khai media đang được dùng chung.
 */
export const protectDocumentMedia: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc || doc.accessMode === 'public') return doc
  const id = mediaID(doc.file)
  if (!id) return doc

  try {
    const media = await req.payload.findByID({
      collection: 'media',
      id,
      depth: 0,
      overrideAccess: true,
      req,
    }) as any

    if (media?.accessLevel !== 'restricted') {
      await req.payload.update({
        collection: 'media',
        id,
        data: { accessLevel: 'restricted' },
        depth: 0,
        overrideAccess: true,
        req,
      })
    }
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Không thể đặt media tài liệu bảo vệ thành restricted' })
    throw error
  }

  return doc
}
