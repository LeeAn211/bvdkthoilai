/**
 * Module tự động lấy tin tức & thông báo từ Cổng thông tin điện tử Sở Y tế TP Cần Thơ (https://soyte.cantho.gov.vn/)
 * Nền tảng: VNPT Portal
 * Có bộ nhớ đệm (In-memory Cache với TTL) và Fallback an toàn để đảm bảo tốc độ tải trang chủ < 100ms.
 */

export type CanThoHealthNewsItem = {
  id: string
  title: string
  href: string
  cover: string
  coverFit?: string
  coverPosition?: string
  excerpt?: string
  date?: string
  category?: string
  isExternal?: boolean
}

// Bộ nhớ đệm trong RAM
let cachedNews: CanThoHealthNewsItem[] = []
let lastFetchedAt = 0
let lastFailedAt = 0
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 phút
const FAILURE_COOLDOWN_MS = 5 * 60 * 1000 // 5 phút cooldown khi mạng ngoài lỗi

// Danh sách dữ liệu mẫu dự phòng khi mạng quá tải, chưa có mạng hoặc khi tắt lấy tin bên ngoài
export const FALLBACK_ITEMS: CanThoHealthNewsItem[] = [
  {
    id: '353900',
    title: 'Hội nghị Khoa học Thường niên Tập đoàn Y tế Phương Châu - ACP 2026: Kiến tạo mô hình y tế toàn diện trong kỷ nguyên mới',
    href: 'https://soyte.cantho.gov.vn/tin-hoat-dong-nganh/hoi-nghi-khoa-hoc-thuong-nien-tap-doan-y-te-phuong-chau-acp-2026-kien-tao-mo-hinh-y-te-toan-dien-353900',
    cover: 'https://storage-vnportal.vnpt.vn/cto-chinhquyen/5381/Thang 09/2026/51 phuong chau 1.jpg',
    excerpt: 'Hội nghị khoa học thường niên quy tụ nhiều chuyên gia đầu ngành chia sẻ về các giải pháp kỹ thuật cao trong điều trị và nâng cao chất lượng khám chữa bệnh.',
    date: 'Mới cập nhật',
    category: 'Hoạt động ngành',
    isExternal: true,
  },
  {
    id: '353841',
    title: 'Chủ động bảo vệ bàn chân, ngăn nguy cơ đoạn chi ở người bệnh đái tháo đường',
    href: 'https://soyte.cantho.gov.vn/tin-hoat-dong-nganh/chu-dong-bao-ve-ban-chan-ngan-nguy-co-doan-chi-o-nguoi-benh-dai-thao-duong-353841',
    cover: 'https://storage-vnportal.vnpt.vn/cto-chinhquyen/5381/Thang 09/2026/50 BAI NGAN DOAN CHI DTD 01.jpg',
    excerpt: 'Hướng dẫn phát hiện sớm và chăm sóc tổn thương bàn chân ở bệnh nhân tiểu đường để phòng tránh tối đa các biến chứng nặng nề.',
    date: 'Mới cập nhật',
    category: 'Y học - Dược học',
    isExternal: true,
  },
  {
    id: '353809',
    title: 'Hội thảo Xây dựng kế hoạch ứng phó dinh dưỡng khẩn cấp trước tác động của biến đổi khí hậu, thiên tai, dịch bệnh',
    href: 'https://soyte.cantho.gov.vn/tin-hoat-dong-nganh/hoi-thao-xay-dung-ke-hoach-ung-pho-dinh-duong-khan-cap-truoc-tac-dong-cua-bien-doi-khi-hau-thien-353809',
    cover: 'https://storage-vnportal.vnpt.vn/cto-chinhquyen/5381/Thang 09/2026/HOI THAO UNG PHO BIEN DOI KHI HAU 01.jpg',
    excerpt: 'Triển khai phương án bảo đảm an ninh dinh dưỡng cho các nhóm đối tượng dễ bị tổn thương khi xảy ra thiên tai hoặc biến đổi khí hậu.',
    date: 'Mới cập nhật',
    category: 'Hoạt động ngành',
    isExternal: true,
  },
  {
    id: '353807',
    title: 'Tác hại của thuốc lá đến phổi và các bệnh lý hô hấp liên quan',
    href: 'https://soyte.cantho.gov.vn/tin-hoat-dong-nganh/tac-hai-cua-thuoc-la-den-phoi-353807',
    cover: 'https://storage-vnportal.vnpt.vn/cto-chinhquyen/5381/Thang 09/2026/48 TAC HAI THUOC LA DEN PHOI.png',
    excerpt: 'Cảnh báo tác hại lâu dài của khói thuốc lá đối với chức năng hô hấp và khuyến cáo các biện pháp bảo vệ sức khỏe lá phổi.',
    date: 'Mới cập nhật',
    category: 'Kiến thức sức khỏe',
    isExternal: true,
  },
  {
    id: '350651',
    title: 'Sở Y tế TP Cần Thơ triển khai các quyết định về công tác cán bộ',
    href: 'https://soyte.cantho.gov.vn/tin-hoat-dong-nganh/so-y-te-tp-can-tho-trien-khai-cac-quyet-dinh-ve-cong-tac-can-bo-350651',
    cover: 'https://storage-vnportal.vnpt.vn/cto-chinhquyen/5381/Thang%2008/2026/ANH%20SYT%20CONG%20BO%20QUYET%20D%e1%bb%8aNH%2001.jpg',
    excerpt: 'Kiện toàn tổ chức bộ máy và nhân sự lãnh đạo tại các đơn vị y tế trực thuộc trên địa bàn thành phố Cần Thơ.',
    date: 'Mới cập nhật',
    category: 'Tin hoạt động Sở',
    isExternal: true,
  },
]

function formatCategoryName(slug: string): string {
  switch (slug) {
    case 'tin-hoat-dong-nganh':
      return 'Hoạt động ngành'
    case 'tin-hoat-dong-so':
      return 'Hoạt động Sở'
    case 'tin-tieu-diem':
      return 'Tin tiêu điểm'
    case 'thong-tin-y-duoc-hoc':
      return 'Thông tin Y - Dược'
    case 'khanh-chua-benh':
      return 'Khám chữa bệnh'
    case 'an-toan-sinh-hoc':
      return 'An toàn sinh học'
    case 'y-hoc-du-phong':
      return 'Y học dự phòng'
    case 'duoc':
      return 'Dược phẩm'
    case 'quyet-dinh-cong-bo-cai-cach-hanh-chinh':
      return 'Cải cách hành chính'
    default:
      return 'Sở Y tế Cần Thơ'
  }
}

/**
 * Phân tích mã nguồn HTML từ trang chủ soyte.cantho.gov.vn để bóc tách bài viết
 */
function parseSoyTeHtml(html: string): CanThoHealthNewsItem[] {
  // Format URL bài viết của VNPT Portal Cần Thơ luôn có dạng: /(chuyen-muc)/(ten-bai)-(\d+)
  const articleRegex = /<a\s+[^>]*href=["'](\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+-(\d+))["'][^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null
  const articlesMap = new Map<string, CanThoHealthNewsItem>()

  while ((match = articleRegex.exec(html)) !== null) {
    const path = match[1]
    const id = match[2]
    const inner = match[3]
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().replace(/\s*New$/i, '')
    const imgMatch = inner.match(/<img[^>]+src=["']([^"']+)["']/i)
    const img = imgMatch ? imgMatch[1] : null

    // Lọc tiêu đề bài viết hợp lệ (loại trừ các nút menu ngắn hoặc trùng)
    if (text.length > 20) {
      const categorySlug = path.split('/')[1] || ''
      if (!articlesMap.has(path)) {
        articlesMap.set(path, {
          id,
          title: text,
          href: 'https://soyte.cantho.gov.vn' + path,
          cover: img || '',
          category: formatCategoryName(categorySlug),
          date: 'Mới cập nhật',
          isExternal: true,
        })
      } else {
        const existing = articlesMap.get(path)!
        if (!existing.cover && img) {
          existing.cover = img
        }
      }
    }
  }

  // Quét vùng HTML lân cận để tìm ảnh thumbnail nếu link bài viết không chứa sẵn thẻ <img>
  for (const [path, art] of articlesMap.entries()) {
    if (!art.cover) {
      const idx = html.indexOf(path)
      if (idx !== -1) {
        const surrounding = html.slice(Math.max(0, idx - 450), Math.min(html.length, idx + 450))
        const nearImg =
          surrounding.match(/<img[^>]+src=["'](https?:\/\/[^"']*(?:jpg|jpeg|png|webp)[^"']*)["']/i) ||
          surrounding.match(/<img[^>]+src=["'](\/[^"']*(?:jpg|jpeg|png|webp)[^"']*)["']/i)
        if (nearImg) {
          const rawSrc = nearImg[1]
          art.cover = rawSrc.startsWith('http') ? rawSrc : 'https://soyte.cantho.gov.vn' + rawSrc
        }
      }
    }
  }

  const list = Array.from(articlesMap.values())
  // Ưu tiên các bài viết có hình ảnh lên trước để hiển thị giao diện đẹp mắt
  list.sort((a, b) => {
    if (a.cover && !b.cover) return -1
    if (!a.cover && b.cover) return 1
    return 0
  })

  return list
}

export type GetCanThoHealthDeptNewsOptions = {
  skipFetch?: boolean
}

/**
 * Lấy danh sách tin tức từ Sở Y tế TP Cần Thơ có bộ đệm và fallback
 */
export async function getCanThoHealthDeptNews(
  limit = 6,
  options?: GetCanThoHealthDeptNewsOptions,
): Promise<CanThoHealthNewsItem[]> {
  // Nếu có tùy chọn skipFetch (ví dụ người dùng tắt lấy tin từ bên ngoài), lập tức trả về fallback/cache mà KHÔNG gọi mạng
  if (options?.skipFetch) {
    if (cachedNews.length > 0) return cachedNews.slice(0, limit)
    return FALLBACK_ITEMS.slice(0, limit)
  }

  const now = Date.now()

  // 1. Kiểm tra cache RAM hợp lệ
  if (cachedNews.length > 0 && now - lastFetchedAt < CACHE_TTL_MS) {
    return cachedNews.slice(0, limit)
  }

  // 2. Nếu vừa lỗi kết nối trong vòng 5 phút, lập tức dùng cache/fallback mà không thử lại
  if (now - lastFailedAt < FAILURE_COOLDOWN_MS) {
    return (cachedNews.length > 0 ? cachedNews : FALLBACK_ITEMS).slice(0, limit)
  }

  // 3. Fetch từ soyte.cantho.gov.vn với timeout 4.5 giây
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4500)

    const response = await fetch('https://soyte.cantho.gov.vn/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 BVDKThoiLai/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi,en;q=0.9',
      },
      signal: controller.signal,
      next: { revalidate: 900 }, // Next.js ISR cache 15 phút
    })

    clearTimeout(timer)

    if (response.ok) {
      const html = await response.text()
      const parsed = parseSoyTeHtml(html)
      if (parsed.length > 0) {
        cachedNews = parsed
        lastFetchedAt = now
        lastFailedAt = 0
        return parsed.slice(0, limit)
      }
    }
  } catch (err: unknown) {
    lastFailedAt = now
    console.warn('[CanThoHealthDept] Fetch failed, using cache/fallback (cooldown 5m):', err instanceof Error ? err.message : err)
  }

  // 4. Nếu fetch lỗi, trả về cache trước đó hoặc danh sách dự phòng
  if (cachedNews.length > 0) {
    return cachedNews.slice(0, limit)
  }

  return FALLBACK_ITEMS.slice(0, limit)
}
