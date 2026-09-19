'use client'

import React, { useMemo, useState } from 'react'
import styles from './OurExpertsFeaturedGrid.module.css'
import type { ExpertItem } from './OurExpertsCarousel'

type Props = {
  items: ExpertItem[]
  cardBarBgColor?: string
  cardBarTextColor?: string
  subItemsPerPage?: number
}

export function OurExpertsFeaturedGrid({
  items = [],
  cardBarBgColor,
  cardBarTextColor,
  subItemsPerPage = 6,
}: Props) {
  const safeItems = useMemo(
    () => items.filter((item) => item?.visible !== false && item?.name),
    [items]
  )

  const [page, setPage] = useState(0)

  if (!safeItems.length) {
    return (
      <div className="professionalEmpty">
        Chưa có chuyên gia nào được kích hoạt. Hãy thêm chuyên gia trong phần Cấu hình Trang chủ hoặc mục Bác sĩ.
      </div>
    )
  }

  // Thẻ Lãnh đạo VIP bên trái: Là người đầu tiên trong danh sách (đã được sort Giám đốc -> Phó Giám đốc theo Mandate 1)
  const leader = safeItems[0]

  // Danh sách các bác sĩ còn lại hiển thị ở lưới bên phải
  const remainingExperts = safeItems.slice(1)

  // Nếu không còn bác sĩ nào ngoài leader, dùng chính leader cho cả lưới phụ
  const subList = remainingExperts.length > 0 ? remainingExperts : safeItems

  const totalSubPages = Math.ceil(subList.length / subItemsPerPage) || 1
  const currentPage = Math.min(page, totalSubPages - 1)

  const currentSubItems = subList.slice(
    currentPage * subItemsPerPage,
    (currentPage + 1) * subItemsPerPage
  )

  const prevPage = () => setPage((p) => (p - 1 + totalSubPages) % totalSubPages)
  const nextPage = () => setPage((p) => (p + 1) % totalSubPages)

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
    <div className={styles.featuredSectionContainer}>
      <div className={styles.featuredLayoutWrapper}>
        {/* CỘT TRÁI: THẺ LÃNH ĐẠO TIÊU BIỂU / GIÁM ĐỐC */}
        {leader && (
          <a
            href={leader.url || '/bac-si'}
            className={styles.leaderCard}
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

        {/* CỘT PHẢI: LƯỚI BÁC SĨ & TRƯỞNG KHOA PHÒNG TIÊU BIỂU */}
        <div className={styles.expertSubGrid} data-count={subItemsPerPage}>
          {currentSubItems.map((item, idx) => {
            const cardKey = `${item.id || 'sub-expert'}-${idx}`
            const isLeadership =
              Boolean(
                item.position?.toLowerCase().includes('giám đốc') ||
                item.subPosition?.toLowerCase().includes('ban giám đốc') ||
                item.position?.toLowerCase().includes('ban giám đốc')
              )

            return (
              <a
                key={cardKey}
                href={item.url || '/bac-si'}
                className={styles.subExpertCard}
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

      {/* THANH ĐIỀU HƯỚNG MŨI TÊN <> NẰM RIÊNG DƯỚI ĐÁY BÊN PHẢI (KHÔNG LÀM DÀI Ô CHÍNH) */}
      {totalSubPages > 1 && (
        <div className={styles.paginationRow}>
          <div className={styles.gridPaginationControls}>
            <button
              type="button"
              className={styles.gridNavBtn}
              onClick={prevPage}
              aria-label="Xem bác sĩ trước"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.gridNavBtn}
              onClick={nextPage}
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
