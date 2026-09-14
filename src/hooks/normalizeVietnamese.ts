/**
 * Chuẩn hóa Unicode NFC đệ quy cho toàn bộ dữ liệu (richText nodes, strings, objects, arrays).
 * Giúp khắc phục triệt để lỗi gõ / dán văn bản tiếng Việt bị dấu tổ hợp (NFD) làm rời rạc ký tự.
 */
export function normalizeNFC<T>(val: T): T {
  if (typeof val === 'string') {
    return val.normalize('NFC') as unknown as T
  }
  if (Array.isArray(val)) {
    return val.map((item) => normalizeNFC(item)) as unknown as T
  }
  if (val !== null && typeof val === 'object') {
    const res: Record<string, any> = {}
    for (const [k, v] of Object.entries(val)) {
      res[k] = normalizeNFC(v)
    }
    return res as T
  }
  return val
}

/**
 * Hook beforeValidate hoặc beforeChange để tự động chuẩn hóa tiếng Việt chuẩn dựng sẵn (NFC).
 */
export const normalizeVietnameseHook = ({ data }: any) => {
  if (!data) return data
  return normalizeNFC(data)
}
