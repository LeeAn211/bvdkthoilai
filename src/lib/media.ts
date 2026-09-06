const looksLikeUrl = (value: string) => /^(?:https?:\/\/|data:|blob:|\/)/i.test(value)

export function mediaUrl(media: any, preferredSize?: string) {
  if (!media) return ''

  // Payload có thể trả upload dưới dạng URL trực tiếp khi relationship chưa populate đầy đủ.
  if (typeof media === 'string') {
    const value = media.trim()
    if (!value) return ''
    if (looksLikeUrl(value)) return value

    // Chỉ coi chuỗi có phần mở rộng là tên file; chuỗi ID quan hệ không được tạo URL giả.
    if (/\.[a-z0-9]{2,8}(?:\?.*)?$/i.test(value)) {
      return `/api/media/file/${encodeURIComponent(value)}`
    }
    return ''
  }

  if (typeof media === 'number') return ''

  const sizedUrl = preferredSize ? media.sizes?.[preferredSize]?.url : ''
  const rawUrl = sizedUrl || media.url
  if (typeof rawUrl === 'string' && rawUrl.trim()) return rawUrl.trim()

  return media.filename
    ? `/api/media/file/${encodeURIComponent(media.filename)}`
    : ''
}

export function mediaLabel(media: any, fallback = 'Tệp đính kèm') {
  if (!media || typeof media !== 'object') return fallback
  return media.filename || fallback
}

export function mediaFormat(media: any) {
  if (!media || typeof media !== 'object') return 'TỆP'
  const filename = typeof media.filename === 'string' ? media.filename : ''
  const extension = filename.includes('.') ? filename.split('.').pop() : ''
  if (extension) return extension.toUpperCase()
  const subtype = typeof media.mimeType === 'string' ? media.mimeType.split('/').pop() : ''
  return subtype ? subtype.toUpperCase() : 'TỆP'
}
