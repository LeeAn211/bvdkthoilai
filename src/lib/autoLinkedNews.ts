/**
 * Module Crawler & Parser tự động lấy tin tức từ mọi website hoặc luồng RSS Feed
 * Hỗ trợ:
 * 1. RSS / Atom Feed (XML)
 * 2. Trang web HTML thông thường (trích xuất thẻ bài viết, OpenGraph og:title, og:image, link, date)
 * 3. Bộ nhớ đệm RAM (Cache) với TTL 15 phút + ISR để tải siêu tốc < 100ms
 */

export type AutoFeedArticle = {
  id: string
  title: string
  href: string
  cover?: string
  excerpt?: string
  date?: string
  category?: string
  isExternal?: boolean
}

// Bộ nhớ đệm cache theo URL
const feedCache = new Map<string, { items: AutoFeedArticle[]; timestamp: number }>()
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 phút

/**
 * Xóa sạch thẻ HTML và chuẩn hóa chuỗi
 */
function cleanText(raw?: string | null): string {
  if (!raw) return ''
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Bóc tách nội dung từ luồng RSS / Atom XML
 */
function parseRssFeed(xml: string, baseUrl: string): AutoFeedArticle[] {
  const articles: AutoFeedArticle[] = []

  // Tìm tất cả khối <item> (RSS) hoặc <entry> (Atom)
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi
  let itemMatch: RegExpExecArray | null

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemContent = itemMatch[1]

    // 1. Tiêu đề
    const titleMatch = itemContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = cleanText(titleMatch ? titleMatch[1] : '')
    if (!title) continue

    // 2. Đường link bài viết
    let link = ''
    const linkTagMatch = itemContent.match(/<link[^>]*href=["']([^"']+)["']/i)
    if (linkTagMatch) {
      link = linkTagMatch[1]
    } else {
      const linkMatch = itemContent.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
      if (linkMatch) link = cleanText(linkMatch[1])
    }
    if (!link) {
      const guidMatch = itemContent.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)
      if (guidMatch && guidMatch[1].startsWith('http')) link = cleanText(guidMatch[1])
    }

    // 3. Ảnh bìa / Thumbnail
    let cover = ''
    const mediaThumbMatch = itemContent.match(/<(?:media:content|media:thumbnail|enclosure)[^>]*url=["']([^"']+)["']/i)
    if (mediaThumbMatch) {
      cover = mediaThumbMatch[1]
    } else {
      // Tìm thẻ <img> trong description / content:encoded
      const imgInDesc = itemContent.match(/<img[^>]+src=["']([^"']+)["']/i)
      if (imgInDesc) cover = imgInDesc[1]
    }

    // 4. Mô tả tóm tắt
    let excerpt = ''
    const descMatch = itemContent.match(/<(?:description|summary|content)[^>]*>([\s\S]*?)<\/(?:description|summary|content)>/i)
    if (descMatch) {
      excerpt = cleanText(descMatch[1]).slice(0, 220)
    }

    // 5. Ngày đăng
    let dateStr = 'Mới cập nhật'
    const dateMatch = itemContent.match(/<(?:pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated|dc:date)>/i)
    if (dateMatch) {
      try {
        const d = new Date(cleanText(dateMatch[1]))
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString('vi-VN')
        }
      } catch {}
    }

    // 6. Chuyên mục
    let category = ''
    const catMatch = itemContent.match(/<category[^>]*>([\s\S]*?)<\/category>/i)
    if (catMatch) category = cleanText(catMatch[1])

    articles.push({
      id: link || `rss-${articles.length}`,
      title,
      href: link.startsWith('http') ? link : new URL(link, baseUrl).toString(),
      cover,
      excerpt,
      date: dateStr,
      category,
      isExternal: true,
    })
  }

  return articles
}

/**
 * Bóc tách nội dung tự động từ trang HTML thông thường
 */
function parseGenericHtml(rawHtml: string, baseUrl: string): AutoFeedArticle[] {
  // Loại bỏ các thẻ script, style, nav, header, footer và menu tĩnh tránh cào nhầm menu khoa/phòng
  const cleanHtml = rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')

  const articlesMap = new Map<string, AutoFeedArticle & { score: number }>()

  // Tìm các thẻ liên kết bài viết dạng: <a href="..."> ... </a>
  const aRegex = /<a\s+[^>]*href=["']([^"'#\s]+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let aMatch: RegExpExecArray | null

  while ((aMatch = aRegex.exec(cleanHtml)) !== null) {
    const rawHref = aMatch[1].trim()
    const innerHtml = aMatch[2]
    const text = cleanText(innerHtml)

    // Lọc các liên kết có tiêu đề dài hợp lý (thường là bài viết, tin tức)
    if (
      text.length >= 18 &&
      !rawHref.startsWith('javascript:') &&
      !rawHref.startsWith('mailto:') &&
      !rawHref.startsWith('tel:') &&
      !rawHref.endsWith('.css') &&
      !rawHref.endsWith('.js')
    ) {
      let fullUrl = rawHref
      try {
        fullUrl = rawHref.startsWith('http') ? rawHref : new URL(rawHref, baseUrl).toString()
      } catch {
        continue
      }

      // Không lấy chính trang chủ hoặc link rỗng
      if (fullUrl === baseUrl || fullUrl === `${baseUrl}/`) continue

      // Trích xuất ảnh trong thẻ nếu có
      let cover = ''
      const imgMatch = innerHtml.match(/<img[^>]+src=["']([^"']+)["']/i)
      if (imgMatch) {
        const rawImg = imgMatch[1]
        try {
          cover = rawImg.startsWith('http') ? rawImg : new URL(rawImg, baseUrl).toString()
        } catch {}
      }

      const matchIdx = aMatch.index
      const surrounding = cleanHtml.slice(Math.max(0, matchIdx - 450), Math.min(cleanHtml.length, matchIdx + 450))

      // Quét vùng lân cận để tìm ảnh thumbnail nếu thẻ <a> chưa có ảnh
      if (!cover) {
        const nearImg = surrounding.match(/<img[^>]+src=["']([^"']*(?:jpg|jpeg|png|webp)[^"']*)["']/i)
        if (nearImg) {
          const rawSrc = nearImg[1]
          if (!rawSrc.includes('logo') && !rawSrc.includes('icon') && !rawSrc.includes('banner-image')) {
            try {
              cover = rawSrc.startsWith('http') ? rawSrc : new URL(rawSrc, baseUrl).toString()
            } catch {}
          }
        }
      }

      // Trích xuất ngày đăng nếu có (loại bỏ thẻ html trước khi tìm ngày để không khớp nhầm số trong đường dẫn ảnh)
      let dateStr = 'Mới cập nhật'
      const surroundingText = surrounding.replace(/<[^>]+>/g, ' ')
      const dateMatch = surroundingText.match(/(\b\d{1,2}[\/\.-]\d{1,2}[\/\.-](?:19|20)\d{2}\b)/)
      if (dateMatch) {
        dateStr = dateMatch[1]
      }

      // Trích xuất tóm tắt ngắn nếu có thẻ <p> lân cận
      let excerpt = ''
      const nearP = surrounding.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
      if (nearP) {
        excerpt = cleanText(nearP[1]).slice(0, 200)
      }

      // Tính điểm trọng số: Ưu tiên link có chứa ID bài viết, tin tức, thông báo, sự kiện
      let score = 0
      const lowerHref = fullUrl.toLowerCase()
      const lowerTitle = text.toLowerCase()

      if (
        lowerHref.includes('ndid=') ||
        lowerHref.includes('tin-tuc') ||
        lowerHref.includes('bai-viet') ||
        lowerHref.includes('detail') ||
        lowerHref.includes('article') ||
        lowerHref.includes('.html') ||
        lowerHref.includes('id=')
      ) {
        score += 15
      }

      if (
        lowerTitle.includes('thông báo') ||
        lowerTitle.includes('hội nghị') ||
        lowerTitle.includes('tập huấn') ||
        lowerTitle.includes('bản tin') ||
        lowerTitle.includes('khám') ||
        lowerTitle.includes('điều trị') ||
        lowerTitle.includes('y tế') ||
        lowerTitle.includes('bệnh viện') ||
        lowerTitle.includes('sức khỏe') ||
        lowerTitle.includes('kỷ niệm') ||
        lowerTitle.includes('trao tặng')
      ) {
        score += 10
      }

      // Phạt điểm các link giới thiệu đơn vị / khoa phòng thuần túy
      if (lowerHref.includes('/gioi-thieu/') || lowerHref.includes('/khoa-') || lowerHref.includes('/phong-')) {
        score -= 20
      }

      if (cover) score += 6
      if (dateStr !== 'Mới cập nhật') score += 4

      if (!articlesMap.has(fullUrl)) {
        articlesMap.set(fullUrl, {
          id: fullUrl,
          title: text,
          href: fullUrl,
          cover,
          excerpt,
          date: dateStr,
          score,
          isExternal: true,
        })
      } else {
        const existing = articlesMap.get(fullUrl)!
        if (!existing.cover && cover) existing.cover = cover
        if (score > existing.score) existing.score = score
      }
    }
  }

  const list = Array.from(articlesMap.values())
  // Sắp xếp ưu tiên bài có điểm tin tức cao nhất lên đầu
  list.sort((a, b) => b.score - a.score)
  return list
}

/**
 * Hàm gọi chính: Tự động phát hiện RSS hay Web HTML và cào dữ liệu an toàn
 */
export async function fetchAutoLinkedNews(feedUrl: string, limit = 6): Promise<AutoFeedArticle[]> {
  const cleanUrl = feedUrl?.trim()
  if (!cleanUrl || !cleanUrl.startsWith('http')) return []

  const now = Date.now()

  // 1. Kiểm tra cache RAM
  const cached = feedCache.get(cleanUrl)
  if (cached && now - cached.timestamp < CACHE_TTL_MS && cached.items.length > 0) {
    return cached.items.slice(0, limit)
  }

  // 2. Fetch dữ liệu từ URL nguồn với timeout 5 giây
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 BVDKThoiLai/AutoCrawler/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi,en;q=0.9',
      },
      signal: controller.signal,
      next: { revalidate: 900 }, // Next.js ISR 15 phút
    })

    clearTimeout(timer)

    if (response.ok) {
      const content = await response.text()
      let parsedItems: AutoFeedArticle[] = []

      // Nếu nội dung là XML (RSS / Atom)
      if (
        content.includes('<rss') ||
        content.includes('<feed') ||
        content.includes('<?xml') ||
        cleanUrl.includes('.rss') ||
        cleanUrl.includes('/rss')
      ) {
        parsedItems = parseRssFeed(content, cleanUrl)
      }

      // Nếu không parse được RSS hoặc là trang HTML thông thường
      if (parsedItems.length === 0) {
        parsedItems = parseGenericHtml(content, cleanUrl)
      }

      if (parsedItems.length > 0) {
        feedCache.set(cleanUrl, { items: parsedItems, timestamp: now })
        return parsedItems.slice(0, limit)
      }
    }
  } catch (err: unknown) {
    console.warn(`[AutoLinkedNews] Failed to fetch from ${cleanUrl}:`, err instanceof Error ? err.message : err)
  }

  // Nếu fetch thất bại nhưng có cache cũ
  if (cached && cached.items.length > 0) {
    return cached.items.slice(0, limit)
  }

  return []
}
