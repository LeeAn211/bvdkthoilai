'use client'

import React, { useMemo, useState, useRef } from 'react'
import styles from './OurExpertsFeaturedGrid.module.css'
import type { ExpertItem } from './OurExpertsCarousel'

type Props = {
  items: ExpertItem[]
  autoplaySeconds?: number
  cardBarBgColor?: string
  cardBarTextColor?: string
  subItemsPerPage?: number
}

export function OurExpertsFeaturedGrid({
  items = [],
  autoplaySeconds = 5,
  cardBarBgColor,
  cardBarTextColor,
  subItemsPerPage = 6,
}: Props) {
  const safeItems = useMemo(
    () => items.filter((item) => item?.visible !== false && item?.name),
    [items]
  )

  const [startIndex, setStartIndex] = useState(0)
  const [selectedLeaderIndex, setSelectedLeaderIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Thẻ Lãnh đạo VIP bên trái: Mặc định là người đầu tiên (Giám đốc), nhưng khi người dùng bấm vào ảnh bác sĩ bất kỳ, ảnh và thông tin của bác sĩ đó sẽ chuyển sang khung lớn bên trái mượt mà
  const leader = safeItems[selectedLeaderIndex] || safeItems[0]

  // Danh sách các bác sĩ hiển thị ở lưới bên phải (nếu có nhiều hơn 1 người, hiển thị toàn bộ hoặc danh sách còn lại)
  const remainingExperts = safeItems.length > 1
    ? safeItems.filter((_, i) => i !== selectedLeaderIndex)
    : safeItems

  const subList = remainingExperts.length > 0 ? remainingExperts : safeItems
  const totalItems = subList.length

  // Số lượng hiển thị cùng một lúc trên lưới bên phải (mặc định 6 ô: 2 hàng x 3 cột)
  const visibleCount = Math.min(totalItems, subItemsPerPage)

  // Tạo danh sách xoay vòng tròn (Circular / Carousel roll)
  const currentSubItems = useMemo(() => {
    if (totalItems <= visibleCount) return subList
    return Array.from({ length: visibleCount }).map((_, offset) => {
      const idx = (startIndex + offset) % totalItems
      return subList[idx]
    })
  }, [subList, startIndex, totalItems, visibleCount])

  const touchStartX = useRef<number | null>(null)

  // Chuyển tới 1 ô theo vòng tròn (roll forward by 1)
  const rollNext = (step = 1) => {
    if (totalItems <= visibleCount) return
    setIsTransitioning(true)
    setTimeout(() => {
      setStartIndex((prev) => (prev + step) % totalItems)
      setIsTransitioning(false)
    }, 180)
  }

  // Chuyển lui 1 ô theo vòng tròn (roll back by 1)
  const rollPrev = (step = 1) => {
    if (totalItems <= visibleCount) return
    setIsTransitioning(true)
    setTimeout(() => {
      setStartIndex((prev) => (prev - step + totalItems) % totalItems)
      setIsTransitioning(false)
    }, 180)
  }

  // Vuốt chạm chuyển bác sĩ trên điện thoại
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX > 40) {
      rollPrev(1)
    } else if (deltaX < -40) {
      rollNext(1)
    }
    touchStartX.current = null
  }

  // Tự động chuyển động tới theo vòng tròn (Circular Autoplay) sau mỗi số giây nhất định
  React.useEffect(() => {
    if (totalItems <= visibleCount || !autoplaySeconds || autoplaySeconds <= 0 || isPaused) return

    const timer = window.setInterval(() => {
      setStartIndex((prev) => (prev + 1) % totalItems)
    }, autoplaySeconds * 1000)

    return () => window.clearInterval(timer)
  }, [totalItems, visibleCount, autoplaySeconds, isPaused])

  if (!safeItems.length) {
    return (
      <div className="professionalEmpty">
        Chưa có chuyên gia nào được kích hoạt. Hãy thêm chuyên gia trong phần Cấu hình Trang chủ hoặc mục Bác sĩ.
      </div>
    )
  }

  const subFooterStyle = cardBarBgColor && cardBarBgColor !== '#f0f7fd'
    ? { backgroundColor: cardBarBgColor, color: cardBarTextColor || undefined }
    : undefined

  const subTitleStyle = cardBarTextColor && cardBarTextColor !== '#0754a8'
    ? { color: cardBarTextColor }
    : undefined

  const renderImageFitClass = (fit?: string) => {
    if (fit === 'cover' || fit === 'cover-top') return styles.fitCoverTop
    if (fit === 'cover-center') return styles.fitCoverCenter
    if (fit === 'cover-bottom') return styles.fitCoverBottom
    if (fit === 'fill') return styles.fitFill
    return ''
  }

  return (
    <div
      className={styles.featuredSectionContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Chuyên gia của chúng tôi"
    >
      <div className={styles.featuredLayoutWrapper}>
        {/* CỘT TRÁI: THẺ LÃNH ĐẠO TIÊU BIỂU / GIÁM ĐỐC (CỐ ĐỊNH KÍCH THƯỚC, CHUYỂN ẢNH VÀ THÔNG TIN MƯỢT MÀ) */}
        {leader && (
          <a
            href={leader.url || '/bac-si'}
            className={`${styles.leaderCard} ${isTransitioning ? styles.cardFading : ''}`}
            target={leader.openNewTab ? '_blank' : undefined}
            rel={leader.openNewTab ? 'noopener noreferrer' : undefined}
          >
            <div className={styles.leaderBadge}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              BAN LÃNH ĐẠO
            </div>

            <div className={styles.leaderImageFrame}>
              {leader.image ? (
                <img
                  key={`leader-${leader.id || leader.name}`}
                  src={leader.image}
                  alt={leader.name}
                  className={`${styles.leaderImg} ${renderImageFitClass(leader.imageFit)}`}
                  loading="lazy"
                />
              ) : (
                <div className={styles.leaderPlaceholder}>
                  <svg viewBox="0 0 24 24" width="70" height="70" fill="none" stroke="#0878d1" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>

            <div className={styles.leaderInfo}>
              <div>
                <span className={styles.leaderRoleBadge}>
                  {leader.position || 'LÃNH ĐẠO BỆNH VIỆN'}
                </span>
                <h3 className={styles.leaderName}>{leader.name}</h3>
                {leader.subPosition && (
                  <p className={styles.leaderDept}>{leader.subPosition}</p>
                )}
              </div>

              <div className={styles.leaderActionBtn}>
                <span>Xem hồ sơ & lịch công tác</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </a>
        )}

        {/* CỘT PHẢI: LƯỚI BÁC SĨ & TRƯỞNG KHOA PHÒNG TIÊU BIỂU (TỰ ĐỘNG CHUYỂN TIẾP VÒNG TRÒN) */}
        <div
          className={`${styles.expertSubGrid} ${isTransitioning ? styles.gridFading : ''}`}
          data-count={subItemsPerPage}
        >
          {currentSubItems.map((item, idx) => {
            const cardKey = `${item.id || item.name}-${idx}`
            const isLeadership =
              Boolean(
                item.position?.toLowerCase().includes('giám đốc') ||
                item.subPosition?.toLowerCase().includes('ban giám đốc') ||
                item.position?.toLowerCase().includes('ban giám đốc')
              )
            const targetUrl = item.url || '/bac-si'

            return (
              <a
                key={cardKey}
                href={targetUrl}
                className={styles.subExpertCard}
                title={`Xem chi tiết hồ sơ: ${item.name}`}
                target={item.openNewTab ? '_blank' : undefined}
                rel={item.openNewTab ? 'noopener noreferrer' : undefined}
              >
                {isLeadership && (
                  <div className={styles.subLeaderBadge}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    BAN LÃNH ĐẠO
                  </div>
                )}

                <div className={styles.subImageFrame}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`${styles.subImg} ${renderImageFitClass(item.imageFit)}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.subPlaceholder}>
                      <svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="#0878d1" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className={styles.subInfo} style={subFooterStyle}>
                  <h4 className={styles.subName} style={subTitleStyle}>
                    {item.name}
                  </h4>
                  {item.position && (
                    <p className={styles.subPosition}>{item.position}</p>
                  )}
                  {item.subPosition && (
                    <span className={styles.subDept}>{item.subPosition}</span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG MŨI TÊN <> NẰM RIÊNG DƯỚI ĐÁY BÊN PHẢI (CHỈ LẤY < >) */}
      {totalItems > visibleCount && (
        <div className={styles.paginationRow}>
          <div className={styles.gridPaginationControls}>
            <button
              type="button"
              className={styles.gridNavBtn}
              onClick={() => rollPrev(1)}
              aria-label="Xem bác sĩ trước"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.gridNavBtn}
              onClick={() => rollNext(1)}
              aria-label="Xem bác sĩ tiếp theo"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
