'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import styles from './AdvancedTechniquesCarousel.module.css'

export type TechniqueItem = {
  id?: string
  title: string
  badge?: string
  image?: string
  imageFit?: 'contain' | 'cover' | string
  url?: string
  openNewTab?: boolean
  visible?: boolean
}

type Props = {
  items: TechniqueItem[]
  autoplaySeconds?: number
  itemsPerView?: number
  cardBarBgColor?: string
  cardBarTextColor?: string
}

export function AdvancedTechniquesCarousel({
  items = [],
  autoplaySeconds = 5,
  itemsPerView = 3,
  cardBarBgColor,
  cardBarTextColor,
}: Props) {
  const safeItems = useMemo(
    () => items.filter((item) => item?.visible !== false && item?.title),
    [items]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const total = safeItems.length
  const maxPerView = Math.max(1, Math.min(itemsPerView || 3, total || 1))

  useEffect(() => {
    if (total <= 1 || !autoplaySeconds || autoplaySeconds <= 0 || isPaused) return
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, autoplaySeconds * 1000)
    return () => window.clearInterval(timer)
  }, [total, autoplaySeconds, isPaused])

  if (!total) {
    return (
      <div className="professionalEmpty">
        Chưa có kỹ thuật chuyên sâu nào được kích hoạt. Hãy thêm kỹ thuật trong phần Cấu hình Trang chủ.
      </div>
    )
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % total)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + total) % total)

  // Xử lý vuốt màn hình cảm ứng
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX > 45) {
      prev()
    } else if (deltaX < -45) {
      next()
    }
    touchStartX.current = null
  }

  const visibleItems = Array.from({ length: maxPerView }).map((_, offset) => {
    const idx = (currentIndex + offset) % total
    return { ...safeItems[idx], originalIndex: idx }
  })

  // Dynamic overrides only if customized differently from default
  const footerCustomStyle = (cardBarBgColor && cardBarBgColor !== '#f0f7fd') || (cardBarTextColor && cardBarTextColor !== '#0754a8')
    ? {
        backgroundColor: cardBarBgColor || undefined,
        color: cardBarTextColor || undefined,
      }
    : undefined

  const titleCustomStyle = cardBarTextColor && cardBarTextColor !== '#0754a8'
    ? { color: cardBarTextColor }
    : undefined

  return (
    <div
      className={styles.techCarouselWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Kỹ thuật chuyên sâu carousel"
    >
      <div className={styles.techCarouselTrack} data-count={maxPerView}>
        {visibleItems.map((item, idx) => {
          const content = (
            <div className={styles.techCard}>
              <div className={styles.techCardImage}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`${styles.techCardImg} ${item.imageFit === 'cover' ? styles.fitCover : styles.fitContain}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.techCardPlaceholder}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#0878d1" strokeWidth="1.5">
                      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                {item.badge && (
                  <span className={styles.techCardBadge}>
                    {item.badge}
                  </span>
                )}
              </div>
              <div className={styles.techCardFooter} style={footerCustomStyle}>
                <h3 className={styles.techCardTitle} style={titleCustomStyle}>
                  {item.title}
                </h3>
              </div>
            </div>
          )

          const key = item.id || `tech-${item.originalIndex}-${idx}`
          if (item.url) {
            return (
              <a
                key={key}
                href={item.url}
                className={styles.techCardLink}
                target={item.openNewTab ? '_blank' : undefined}
                rel={item.openNewTab ? 'noopener noreferrer' : undefined}
              >
                {content}
              </a>
            )
          }

          return (
            <div key={key} className={`${styles.techCardLink} ${styles.noCursor}`}>
              {content}
            </div>
          )
        })}
      </div>

      {total > 1 && (
        <div className={styles.techCarouselControls}>
          <button
            type="button"
            className={styles.techNavBtn}
            onClick={prev}
            aria-label="Kỹ thuật trước"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0878d1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.techNavBtn}
            onClick={next}
            aria-label="Kỹ thuật kế tiếp"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0878d1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
