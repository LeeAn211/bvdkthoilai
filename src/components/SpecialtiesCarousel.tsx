'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import styles from './SpecialtiesCarousel.module.css'

export type SpecialtyCarouselItem = {
  id: string
  name: string
  slug: string
  departmentName?: string
  summary?: string
  coverUrl?: string
  coverFitHome?: 'contain' | 'cover-top' | 'cover-center' | 'cover-bottom' | 'cover' | 'fill' | string
  coverFit?: 'contain' | 'cover-top' | 'cover-center' | 'cover-bottom' | 'cover' | 'fill' | string
  coverPosition?: 'top' | 'center' | 'bottom' | string
}

type Props = {
  items: SpecialtyCarouselItem[]
  autoplaySeconds?: number
}

export function SpecialtiesCarousel({
  items = [],
  autoplaySeconds = 5,
}: Props) {
  const safeItems = useMemo(
    () => items.filter((item) => item?.name && item?.slug),
    [items]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const total = safeItems.length
  // Desktop hiển thị 4 thẻ, tablet 2-3 thẻ, mobile 1 thẻ
  const maxPerView = Math.max(1, Math.min(4, total || 1))

  useEffect(() => {
    if (total <= maxPerView || !autoplaySeconds || autoplaySeconds <= 0 || isPaused) return
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, autoplaySeconds * 1000)
    return () => window.clearInterval(timer)
  }, [total, maxPerView, autoplaySeconds, isPaused])

  if (!total) {
    return (
      <div className="professionalEmpty">
        Chưa có chuyên khoa nào được công khai.
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

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Danh sách chuyên khoa nổi bật"
    >
      <div className={styles.carouselTrack} data-count={maxPerView}>
        {visibleItems.map((item, idx) => {
          const key = item.id || `specialty-${item.originalIndex}-${idx}`
          const fitMode = item.coverFitHome || item.coverFit || 'cover-top'
          const fitClass =
            fitMode === 'contain'
              ? styles.fitContain
              : fitMode === 'cover-top'
              ? styles.fitCoverTop
              : fitMode === 'cover-center'
              ? styles.fitCoverCenter
              : fitMode === 'cover-bottom'
              ? styles.fitCoverBottom
              : fitMode === 'fill'
              ? styles.fitFill
              : styles.fitCoverTop

          return (
            <a
              key={key}
              href={`/chuyen-khoa/${item.slug}`}
              className={styles.specialtyCard}
            >
              {/* Ảnh bìa chuyên khoa hoặc Header minh họa y khoa */}
              <div
                className={`${styles.cardVisualHeader} ${fitMode === 'contain' ? styles.headerContainMode : ''}`}
              >
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={item.name}
                    className={`${styles.cardCoverImg} ${fitClass}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.cardDefaultVisual}>
                    <div className={styles.medicalBgPattern} />
                  </div>
                )}

                {fitMode !== 'contain' && <div className={styles.cardOverlayGradient} />}

                {/* Huy hiệu khoa phụ trách */}
                {item.departmentName && (
                  <span className={styles.departmentBadge} title={item.departmentName}>
                    {item.departmentName}
                  </span>
                )}
              </div>

              {/* Thân thẻ nội dung chuyên môn */}
              <div className={styles.cardBody}>
                <div className={styles.cardBodyHeader}>
                  <div className={styles.specialtyIconBadge}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 10.5h-4.5V6a1.5 1.5 0 0 0-3 0v4.5H7a1.5 1.5 0 0 0 0 3h4.5V18a1.5 1.5 0 0 0 3 0v-4.5H19a1.5 1.5 0 0 0 0-3z" />
                    </svg>
                  </div>
                  <h3 className={styles.specialtyTitle}>{item.name}</h3>
                </div>

                <p className={styles.specialtySummary}>
                  {item.summary ||
                    'Cung cấp dịch vụ chẩn đoán chuyên sâu, phác đồ điều trị tiêu chuẩn và trang thiết bị hiện đại tại bệnh viện.'}
                </p>

                <div className={styles.cardActionFooter}>
                  <span className={styles.actionText}>Chi tiết chuyên khoa</span>
                  <div className={styles.actionArrowCircle}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Nút điều hướng Carousel nếu có nhiều hơn số thẻ hiển thị */}
      {total > maxPerView && (
        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.navButton}
            onClick={prev}
            aria-label="Chuyên khoa trước"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={styles.carouselIndicators}>
            {safeItems.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`${styles.indicatorDot} ${dotIdx === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Đến chuyên khoa ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={next}
            aria-label="Chuyên khoa tiếp theo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
