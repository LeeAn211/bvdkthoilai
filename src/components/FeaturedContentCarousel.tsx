'use client'

import { useEffect, useMemo, useState } from 'react'

type Item = {
  id: string
  title: string
  excerpt?: string
  image?: string
  href: string
  kind: string
  date?: string
}

export function FeaturedContentCarousel({ items, interval = 4500 }: { items: Item[]; interval?: number }) {
  const safeItems = useMemo(() => items.filter((item) => item?.title && item?.href), [items])
  const [start, setStart] = useState(0)
  const visibleCount = Math.min(4, safeItems.length)

  useEffect(() => {
    if (safeItems.length <= visibleCount || interval < 2000) return
    const timer = window.setInterval(() => setStart((current) => (current + 1) % safeItems.length), interval)
    return () => window.clearInterval(timer)
  }, [safeItems.length, visibleCount, interval])

  if (!safeItems.length) return <div className="professionalEmpty">Nội dung nổi bật sẽ hiển thị tại đây sau khi được cập nhật từ Admin.</div>

  const visible = Array.from({ length: visibleCount }, (_, index) => safeItems[(start + index) % safeItems.length])
  const previous = () => setStart((current) => (current - 1 + safeItems.length) % safeItems.length)
  const next = () => setStart((current) => (current + 1) % safeItems.length)

  return <div className="featuredCarousel" aria-label="Nội dung nổi bật">
    <div className="featuredCarouselViewport">
      <div className="featuredCarouselGrid" key={start}>
        {visible.map((item) => <a href={item.href} className="featuredCarouselCard" key={`${item.id}-${start}`}>
          <div className="featuredCarouselImage" style={{ backgroundImage: item.image ? `url("${item.image}")` : undefined }}>
            <span>{item.kind}</span>
          </div>
          <div className="featuredCarouselCopy">
            <small>{item.date || 'Mới cập nhật'}</small>
            <h3>{item.title}</h3>
            {item.excerpt && <p>{item.excerpt}</p>}
          </div>
        </a>)}
      </div>
    </div>
    {safeItems.length > visibleCount && <div className="featuredCarouselControls">
      <button type="button" onClick={previous} aria-label="Nội dung trước">‹</button>
      <span>{start + 1} / {safeItems.length}</span>
      <button type="button" onClick={next} aria-label="Nội dung tiếp theo">›</button>
    </div>}
  </div>
}
