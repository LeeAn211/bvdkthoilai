'use client'

import React, { useEffect, useMemo, useState } from 'react'

export type CustomCarouselCardItem = {
  id?: string
  enabled?: boolean
  title: string
  code?: string
  statusText?: string
  statusType?: 'available' | 'info' | 'warning' | 'unavailable' | string
  origin?: string
  image?: any
  summary?: string
  spec1Key?: string
  spec1Val?: string
  spec2Key?: string
  spec2Val?: string
  spec3Key?: string
  spec3Val?: string
  priceLabel?: string
  priceValue?: string
  detailUrl?: string
  detailBtnText?: string
  actionUrl?: string
  actionBtnText?: string
}

type Props = {
  cards: CustomCarouselCardItem[]
  itemsPerView?: number
  autoplaySeconds?: number
  defaultDetailBtnText?: string
  defaultActionBtnText?: string
}

export function CustomCardsCarousel({
  cards = [],
  itemsPerView = 3,
  autoplaySeconds = 5,
  defaultDetailBtnText = 'Chi tiết',
  defaultActionBtnText = 'Đăng ký ngay',
}: Props) {
  const safeCards = useMemo(
    () => cards.filter((c) => c?.enabled !== false && c?.title),
    [cards]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useMemo(() => ({ current: null as number | null }), [])

  const total = safeCards.length
  const targetPerView = Math.max(1, Math.min(itemsPerView || 3, 4))
  const displayCount = Math.min(total, targetPerView)

  // Tự động chuyển slide tuần tự
  useEffect(() => {
    if (total <= targetPerView || !autoplaySeconds || autoplaySeconds <= 0 || isPaused) return
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, autoplaySeconds * 1000)
    return () => window.clearInterval(timer)
  }, [total, targetPerView, autoplaySeconds, isPaused])

  const next = () => {
    if (total > 0) setCurrentIndex((prev) => (prev + 1) % total)
  }

  const prev = () => {
    if (total > 0) setCurrentIndex((prev) => (prev - 1 + total) % total)
  }

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

  if (total === 0) {
    return (
      <div className="professionalEmpty">
        Chưa có thẻ nào trong Slider. Vui lòng thêm thẻ trong phần Bố cục Trang chủ.
      </div>
    )
  }

  const visibleCards = Array.from({ length: displayCount }).map((_, offset) => {
    const idx = (currentIndex + offset) % total
    return { ...safeCards[idx], originalIndex: idx }
  })

  return (
    <div
      className="vaccineCarouselWrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Khối thẻ slider tùy biến"
    >
      <div className="vaccineCarouselTrack" style={{ gridTemplateColumns: `repeat(${displayCount}, minmax(0, 1fr))` }}>
        {visibleCards.map((card, idx) => {
          const statusClass = card.statusType || 'available'
          const detailText = card.detailBtnText || defaultDetailBtnText
          const actionText = card.actionBtnText || defaultActionBtnText
          const isFree = card.priceValue && (card.priceValue.toLowerCase().includes('miễn phí') || card.priceValue === '0' || card.priceValue === '0đ')

          return (
            <div className="vaccineCardModern" key={card.id ? `${card.id}-${idx}` : idx}>
              {/* 1. Header: Status badge, Xuất xứ/Đơn vị, Mã định danh */}
              <div className="vaccineTopMetaBar">
                <div className="vaccineMetaBadges">
                  {card.statusText && (
                    <span className={`vaccineStatusPill ${statusClass}`}>
                      <span className="vaccineStatusDot" />
                      {card.statusText}
                    </span>
                  )}
                  {card.origin && (
                    <span className="vaccineOriginPill" title={card.origin}>
                      {card.origin}
                    </span>
                  )}
                </div>
                {card.code && <span className="vaccineCodeTag">{card.code}</span>}
              </div>

              {/* 2. Body: Tiêu đề, Mô tả tóm tắt, Bảng 3 thông số */}
              <div className="vaccineCardMainBody">
                <h3 className="vaccineMainTitle">
                  {card.detailUrl ? (
                    <a href={card.detailUrl}>{card.title}</a>
                  ) : (
                    <span>{card.title}</span>
                  )}
                </h3>

                {card.summary && <p className="vaccineShortSummary">{card.summary}</p>}

                {(card.spec1Val || card.spec2Val || card.spec3Val) && (
                  <div className="vaccineInfoTableBox">
                    {card.spec1Val && (
                      <div className="vaccineInfoRow">
                        <span className="vaccineInfoKey">{card.spec1Key || 'Thông tin 1'}:</span>
                        <span className="vaccineInfoVal preventVal">{card.spec1Val}</span>
                      </div>
                    )}
                    {card.spec2Val && (
                      <div className="vaccineInfoRow">
                        <span className="vaccineInfoKey">{card.spec2Key || 'Thông tin 2'}:</span>
                        <span className="vaccineInfoVal">{card.spec2Val}</span>
                      </div>
                    )}
                    {card.spec3Val && (
                      <div className="vaccineInfoRow">
                        <span className="vaccineInfoKey">{card.spec3Key || 'Thông tin 3'}:</span>
                        <span className="vaccineInfoVal">{card.spec3Val}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Footer: Giá niêm yết + 2 nút hành động */}
              <div className="vaccineBottomBar">
                <div className="vaccinePriceBox">
                  <span className="vaccinePriceSub">{card.priceLabel || 'GIÁ NIÊM YẾT'}</span>
                  <span className={`vaccinePriceNum ${isFree ? 'free' : ''}`}>
                    {card.priceValue || 'Liên hệ'}
                  </span>
                </div>

                <div className="vaccineCardBtns">
                  {card.detailUrl && (
                    <a href={card.detailUrl} className="vaccineBtnDetail">
                      {detailText}
                    </a>
                  )}
                  {card.actionUrl && (
                    <a
                      href={card.actionUrl}
                      target={card.actionUrl.startsWith('http') ? '_blank' : undefined}
                      rel={card.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="vaccineBtnRegister"
                    >
                      {actionText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Điều hướng Trước / Sau và Dots chỉ báo chuẩn y tế */}
      {total > targetPerView && (
        <div className="vaccineCarouselControls">
          <button
            type="button"
            className="vaccineNavBtn"
            onClick={prev}
            aria-label="Thẻ trước"
            title="Thẻ trước"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="vaccineCarouselDots">
            {safeCards.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                className={`vaccineCarouselDot ${currentIndex === dotIdx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Chuyển đến thẻ ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="vaccineNavBtn"
            onClick={next}
            aria-label="Thẻ tiếp theo"
            title="Thẻ tiếp theo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
