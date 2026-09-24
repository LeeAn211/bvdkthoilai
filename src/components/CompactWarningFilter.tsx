'use client'

import React, { useMemo, useState } from 'react'
import styles from './CompactWarningFilter.module.css'

export type WarningDirectoryItem = {
  id: string | number
  title: string
  slug: string
  href: string
  date?: string
  rawDate?: string
  level?: 'urgent' | 'important' | 'normal' | string
  levelLabel?: string
  excerpt?: string
  coverUrl?: string
  category?: string
}

interface CompactWarningFilterProps {
  items: WarningDirectoryItem[]
  initialLevel?: string
}

export function CompactWarningFilter({ items, initialLevel = 'all' }: CompactWarningFilterProps) {
  const [q, setQ] = useState('')
  const [levelFilter, setLevelFilter] = useState(initialLevel)

  // Đếm số lượng theo mức độ
  const urgentCount = useMemo(() => items.filter(x => x.level === 'urgent').length, [items])
  const importantCount = useMemo(() => items.filter(x => x.level === 'important').length, [items])
  const normalCount = useMemo(() => items.filter(x => x.level === 'normal' || !x.level).length, [items])

  // Lọc bài viết
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter(item => {
      const matchText = !term || (
        (item.title || '').toLowerCase().includes(term) ||
        (item.excerpt || '').toLowerCase().includes(term) ||
        (item.category || '').toLowerCase().includes(term)
      )

      let matchLevel = true
      if (levelFilter === 'urgent') matchLevel = item.level === 'urgent'
      else if (levelFilter === 'important') matchLevel = item.level === 'important'
      else if (levelFilter === 'normal') matchLevel = item.level === 'normal' || !item.level

      return matchText && matchLevel
    })
  }, [items, q, levelFilter])

  return (
    <div className={styles.warningDirectory}>
      {/* CÔNG CỤ TÌM KIẾM & THỐNG KÊ */}
      <div className={styles.toolsRow}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Tìm kiếm cảnh báo theo tiêu đề, nội dung khuyến cáo..."
            aria-label="Tìm kiếm cảnh báo"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.resultCount}>
          Hiển thị <strong>{filtered.length}</strong> / {items.length} cảnh báo & khuyến cáo
        </div>
      </div>

      {/* TABS LỌC MỨC ĐỘ KHẨN CẤP */}
      <div className={styles.filterTabs} role="tablist">
        <button
          type="button"
          className={`${styles.tabBtn} ${levelFilter === 'all' ? styles.active : ''}`}
          onClick={() => setLevelFilter('all')}
        >
          <span>Tất cả</span>
          <span className={styles.tabBadge}>{items.length}</span>
        </button>

        {urgentCount > 0 && (
          <button
            type="button"
            className={`${styles.tabBtn} ${levelFilter === 'urgent' ? styles.activeDanger : ''}`}
            onClick={() => setLevelFilter('urgent')}
          >
            <span>🚨 Khẩn cấp</span>
            <span className={styles.tabBadge}>{urgentCount}</span>
          </button>
        )}

        {importantCount > 0 && (
          <button
            type="button"
            className={`${styles.tabBtn} ${levelFilter === 'important' ? styles.active : ''}`}
            onClick={() => setLevelFilter('important')}
          >
            <span>⚠️ Quan trọng</span>
            <span className={styles.tabBadge}>{importantCount}</span>
          </button>
        )}

        <button
          type="button"
          className={`${styles.tabBtn} ${levelFilter === 'normal' ? styles.active : ''}`}
          onClick={() => setLevelFilter('normal')}
        >
          <span>🛡️ Khuyến cáo cộng đồng</span>
          <span className={styles.tabBadge}>{normalCount}</span>
        </button>
      </div>

      {/* DANH SÁCH THẺ NHỎ GỌN */}
      {filtered.length === 0 ? (
        <div className={styles.emptyBox}>
          <strong>Không tìm thấy cảnh báo nào phù hợp.</strong>
          <span>Thử kiểm tra lại từ khóa hoặc chọn tab mức độ cảnh báo khác.</span>
        </div>
      ) : (
        <div className={styles.compactGrid}>
          {filtered.map(item => {
            const isUrgent = item.level === 'urgent'
            const isImportant = item.level === 'important'
            const levelClass = isUrgent ? styles.urgentCard : (isImportant ? styles.importantCard : styles.normalCard)
            const badgeClass = isUrgent ? styles.badgeUrgent : (isImportant ? styles.badgeImportant : styles.badgeNormal)
            const badgeText = isUrgent ? '🚨 KHẨN CẤP' : (isImportant ? '⚠️ QUAN TRỌNG' : '🛡️ KHUYẾN CÁO')

            return (
              <a
                key={item.id}
                href={item.href}
                className={`${styles.compactCard} ${levelClass}`}
              >
                {/* ẢNH ĐẠI DIỆN COMPACT */}
                <div className={styles.mediaWrap}>
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className={styles.mediaImg}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.placeholderThumb}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span>CẢNH BÁO Y TẾ</span>
                    </div>
                  )}

                  <span className={`${styles.cardBadge} ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>

                {/* NỘI DUNG NHỎ GỌN */}
                <div className={styles.cardBody}>
                  <div className={styles.dateRow}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{item.date || 'Mới cập nhật'}</span>
                    {item.category && <span>• {item.category}</span>}
                  </div>

                  <h3 className={styles.cardTitle}>{item.title}</h3>

                  {item.excerpt && (
                    <p className={styles.cardExcerpt}>{item.excerpt}</p>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.cardAction}>
                      Xem chi tiết <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
