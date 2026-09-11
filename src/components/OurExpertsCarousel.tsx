'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import styles from './OurExpertsCarousel.module.css'

export type ExpertItem = {
  id?: string
  name: string
  position?: string
  subPosition?: string
  badge?: string
  image?: string
  imageFit?: 'contain' | 'cover' | string
  url?: string
  openNewTab?: boolean
  visible?: boolean
}

type Props = {
  items: ExpertItem[]
  autoplaySeconds?: number
  itemsPerView?: number
  cardBarBgColor?: string
  cardBarTextColor?: string
}

export function OurExpertsCarousel({
  items = [],
  autoplaySeconds = 5,
  itemsPerView = 4,
  cardBarBgColor,
  cardBarTextColor,
}: Props) {
  const safeItems = useMemo(
    () => items.filter((item) => item?.visible !== false && item?.name),
    [items]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const total = safeItems.length
  const maxPerView = Math.max(1, Math.min(itemsPerView || 4, total || 1))

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
        Chưa có chuyên gia nào được kích hoạt. Hãy thêm chuyên gia trong phần Cấu hình Trang chủ.
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
      className={styles.expertCarouselWrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Chuyên gia của chúng tôi carousel"
    >
      <div className={styles.expertCarouselTrack} data-count={maxPerView}>
        {visibleItems.map((item, idx) => {
          const content = (
            <div className={styles.expertCard}>
              <div className={styles.expertCardImage}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`${styles.expertCardImg} ${item.imageFit === 'cover' ? styles.fitCover : styles.fitContain}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.expertCardPlaceholder}>
                    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#0878d1" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.expertCardFooter} style={footerCustomStyle}>
                <h3 className={styles.expertCardName} style={titleCustomStyle}>
                  {item.name}
                </h3>
                {item.position && (
                  <p className={styles.expertCardPosition}>
                    {item.position}
                  </p>
                )}
                {item.subPosition && (
                  <p className={styles.expertCardSubPosition}>
                    {item.subPosition}
                  </p>
                )}
              </div>
            </div>
          )

          const key = item.id || `expert-${item.originalIndex}-${idx}`
          if (item.url) {
            return (
              <a
                key={key}
                href={item.url}
                className={styles.expertCardLink}
                target={item.openNewTab ? '_blank' : undefined}
                rel={item.openNewTab ? 'noopener noreferrer' : undefined}
              >
                {content}
              </a>
            )
          }

          return (
            <div key={key} className={`${styles.expertCardLink} ${styles.noCursor}`}>
              {content}
            </div>
          )
        })}
      </div>

      {total > 1 && (
        <div className={styles.expertCarouselControls}>
          <button
            type="button"
            className={styles.expertNavBtn}
            onClick={prev}
            aria-label="Chuyên gia trước"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0878d1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.expertNavBtn}
            onClick={next}
            aria-label="Chuyên gia kế tiếp"
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
