'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import styles from './DocumentDirectoryView.module.css'

export interface DocumentDirectoryItem {
  id: string | number
  title: string
  slug?: string
  number?: string
  category?: string
  issuer?: string
  signer?: string
  issuedAt?: string
  date?: string
  year?: string | number
  documentType?: string
  summary?: string
  excerpt?: string
  fileUrl?: string
  fileName?: string
  fileFormat?: string
  coverUrl?: string
  href: string
  allowDownload?: boolean
  preventCopy?: boolean
  showViewer?: boolean
}

interface Props {
  items: DocumentDirectoryItem[]
  title?: string
  eyebrow?: string
  emptyText?: string
}

export function DocumentDirectoryView({
  items,
  title = 'Kho văn bản & tài liệu',
  eyebrow = 'TRA CỨU VĂN BẢN ĐIỀU HÀNH',
  emptyText = 'Không tìm thấy văn bản phù hợp.',
}: Props) {
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Trích xuất danh sách chuyên mục
  const categories = useMemo(() => {
    const set = new Set<string>()
    items.forEach(item => {
      const c = (item.category || item.documentType || '').trim()
      if (c) set.add(c)
    })
    return Array.from(set)
  }, [items])

  // Trích xuất danh sách năm ban hành
  const years = useMemo(() => {
    const set = new Set<string>()
    items.forEach(item => {
      if (item.year) {
        set.add(String(item.year))
      } else if (item.issuedAt) {
        const y = new Date(item.issuedAt).getFullYear()
        if (!isNaN(y)) set.add(String(y))
      } else if (item.date) {
        const parts = item.date.split('/')
        if (parts.length === 3 && parts[2]) set.add(parts[2])
      }
    })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [items])

  // Lọc văn bản theo từ khóa, chuyên mục và năm
  const filteredItems = useMemo(() => {
    const q = keyword.toLowerCase().trim()
    return items.filter(item => {
      // Bộ lọc từ khóa (tìm theo Tiêu đề, Số hiệu, Cơ quan, Người ký, Trích yếu)
      if (q) {
        const searchStr = `${item.title} ${item.number || ''} ${item.issuer || ''} ${item.signer || ''} ${item.summary || item.excerpt || ''}`.toLowerCase()
        if (!searchStr.includes(q)) return false
      }

      // Bộ lọc chuyên mục
      if (selectedCategory !== 'all') {
        const c = (item.category || item.documentType || '').trim()
        if (c !== selectedCategory) return false
      }

      // Bộ lọc năm
      if (selectedYear !== 'all') {
        let y = ''
        if (item.year) y = String(item.year)
        else if (item.issuedAt) y = String(new Date(item.issuedAt).getFullYear())
        else if (item.date) {
          const parts = item.date.split('/')
          if (parts.length === 3) y = parts[2]
        }
        if (y !== selectedYear) return false
      }

      return true
    })
  }, [items, keyword, selectedCategory, selectedYear])

  return (
    <div className={styles.directoryWrapper}>
      {/* Thanh điều khiển tìm kiếm & bộ lọc */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm theo số hiệu, trích yếu, tên văn bản, cơ quan..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            aria-label="Tìm kiếm văn bản"
          />
          {keyword && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setKeyword('')}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterDropdowns}>
          {/* Lọc chuyên mục / hình thức */}
          {categories.length > 0 && (
            <select
              className={styles.selectFilter}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              aria-label="Chọn chuyên mục văn bản"
            >
              <option value="all">Tất cả chuyên mục ({items.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c} ({items.filter(i => (i.category || i.documentType) === c).length})
                </option>
              ))}
            </select>
          )}

          {/* Lọc theo năm */}
          {years.length > 0 && (
            <select
              className={styles.selectFilter}
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              aria-label="Chọn năm ban hành"
            >
              <option value="all">Tất cả năm</option>
              {years.map(y => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          )}

          {/* Nút chuyển đổi kiểu xem: Bảng danh sách hoặc Lưới thẻ */}
          <div className={styles.viewToggleGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.toggleActive : ''}`}
              onClick={() => setViewMode('table')}
              title="Xem dạng Bảng công văn chuẩn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span>Bảng danh sách</span>
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${viewMode === 'cards' ? styles.toggleActive : ''}`}
              onClick={() => setViewMode('cards')}
              title="Xem dạng Thẻ lưới có ảnh"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Lưới thẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thông tin số lượng văn bản tìm thấy */}
      <div className={styles.statusBar}>
        <span>
          Hiển thị <strong>{filteredItems.length}</strong> / {items.length} văn bản
          {(selectedCategory !== 'all' || selectedYear !== 'all' || keyword) && (
            <button
              type="button"
              className={styles.resetFiltersBtn}
              onClick={() => {
                setKeyword('')
                setSelectedCategory('all')
                setSelectedYear('all')
              }}
            >
              Đặt lại bộ lọc
            </button>
          )}
        </span>
      </div>

      {/* Nội dung danh sách theo kiểu xem đã chọn */}
      {filteredItems.length === 0 ? (
        <div className={styles.emptyNotice}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <h4>{emptyText}</h4>
          <p>Thử tìm kiếm với từ khóa khác hoặc bỏ các điều kiện lọc phía trên.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* CHẾ ĐỘ XEM 1: BẢNG DANH SÁCH CHUẨN CỔNG THÔNG TIN SỞ Y TẾ */
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.docTable}>
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>STT</th>
                  <th style={{ width: '150px' }}>Số / Ký hiệu</th>
                  <th style={{ width: '120px' }}>Ngày ban hành</th>
                  <th>Trích yếu nội dung văn bản</th>
                  <th style={{ width: '160px' }}>Cơ quan ban hành</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((doc, idx) => (
                  <tr key={doc.id || idx}>
                    <td className={styles.textCenter} style={{ fontWeight: 600, color: '#64748b' }}>
                      {idx + 1}
                    </td>
                    <td>
                      <Link href={doc.href} className={styles.numberLink}>
                        {doc.number || 'Chưa số'}
                      </Link>
                      {doc.category && (
                        <span className={styles.tableCategoryBadge}>{doc.category}</span>
                      )}
                    </td>
                    <td className={styles.dateCell}>
                      {doc.date || (doc.issuedAt ? new Date(doc.issuedAt).toLocaleDateString('vi-VN') : '—')}
                    </td>
                    <td className={styles.summaryCell}>
                      <Link href={doc.href} className={styles.docTitleLink}>
                        {doc.title}
                      </Link>
                      {doc.summary && (
                        <p className={styles.docExcerptText}>{doc.summary}</p>
                      )}
                    </td>
                    <td className={styles.issuerCell}>
                      {doc.issuer || 'BVĐK Khu vực Thới Lai'}
                    </td>
                    <td className={styles.actionCell}>
                      <Link href={doc.href} className={styles.btnViewDetail}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Xem chi tiết</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CHẾ ĐỘ XEM 2: LƯỚI THẺ (CARD GRID VIEW) */
        <div className={styles.cardGrid}>
          {filteredItems.map((doc, idx) => (
            <Link href={doc.href} key={doc.id || idx} className={styles.docCard}>
              <div className={styles.cardMedia}>
                {doc.coverUrl ? (
                  <img src={doc.coverUrl} alt={doc.title} loading="lazy" className={styles.cardImg} />
                ) : (
                  <div className={styles.cardPlaceholder}>
                    <span>VĂN BẢN</span>
                  </div>
                )}
                {doc.category && <span className={styles.cardBadge}>{doc.category}</span>}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  {doc.number && <strong className={styles.cardNumber}>{doc.number}</strong>}
                  <span className={styles.cardDate}>
                    {doc.date || (doc.issuedAt ? new Date(doc.issuedAt).toLocaleDateString('vi-VN') : '')}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{doc.title}</h3>
                {doc.summary && <p className={styles.cardExcerpt}>{doc.summary}</p>}
                <div className={styles.cardFooter}>
                  <span className={styles.viewLink}>
                    Xem chi tiết & đọc tài liệu <i>→</i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
