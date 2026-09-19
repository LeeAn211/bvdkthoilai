'use client'

import React, { useMemo, useState } from 'react'

export interface HomeProcurementItem {
  id: string | number
  title: string
  slug: string
  referenceCode?: string
  procurementStatus?: 'open' | 'closing' | 'closed' | 'cancelled' | string
  deadlineAt?: string
  publishedAt?: string
  createdAt?: string
  type?: string
  category?: any
  categoryRef?: any
}

interface HomeProcurementTabsProps {
  items: HomeProcurementItem[]
  limit?: number
}

// Hàm chuẩn hóa lấy tên phân loại / chuyên mục
function getProcurementCategoryName(item: HomeProcurementItem): string {
  // 1. Nếu có liên kết Chuyên mục chuẩn (categoryRef)
  if (item.categoryRef && typeof item.categoryRef === 'object' && item.categoryRef.name) {
    return String(item.categoryRef.name).trim()
  }
  // 2. Nếu có trường category (text hoặc object)
  if (item.category) {
    if (typeof item.category === 'object' && (item.category.name || item.category.title)) {
      return String(item.category.name || item.category.title).trim()
    }
    if (typeof item.category === 'string' && item.category.trim()) {
      return item.category.trim()
    }
  }
  // 3. Nếu có phân loại type (ví dụ: 'Yêu cầu báo giá', 'Thông báo mời thầu'...)
  if (item.type && String(item.type).trim()) {
    return String(item.type).trim()
  }
  return 'Khác'
}

export function HomeProcurementTabs({ items = [], limit = 4 }: HomeProcurementTabsProps) {
  // 1. Phân tích các chuyên mục THỰC TẾ CÓ BÀI ĐĂNG
  const categoriesWithPosts = useMemo(() => {
    if (!items || items.length === 0) return []

    const countMap = new Map<string, number>()

    items.forEach((item) => {
      const catName = getProcurementCategoryName(item)
      if (catName) {
        countMap.set(catName, (countMap.get(catName) || 0) + 1)
      }
    })

    // Chỉ lấy những chuyên mục có số lượng bài > 0
    return Array.from(countMap.entries())
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }))
  }, [items])

  // State tab đang chọn: 'all' hoặc tên chuyên mục cụ thể
  const [activeTab, setActiveTab] = useState<string>('all')

  // 2. Lọc danh sách bài hiển thị theo tab đang chọn
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return []

    let list = items
    if (activeTab !== 'all') {
      list = items.filter((item) => getProcurementCategoryName(item) === activeTab)
    }

    return list.slice(0, limit)
  }, [items, activeTab, limit])

  if (!items || items.length === 0) {
    return <div className="pairColEmpty">Chưa có hồ sơ đấu thầu – mua sắm.</div>
  }

  return (
    <div className="homeProcurementTabsContainer">
      {/* THANH TAB CHUYÊN MỤC CÓ BÀI ĐĂNG */}
      {categoriesWithPosts.length > 0 && (
        <div className="homeProcurementTabBar" role="tablist" aria-label="Chuyên mục đấu thầu có bài đăng">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`homeProcTabBtn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>Tất cả</span>
            <span className="homeProcTabCount">{Math.min(items.length, limit)}</span>
          </button>

          {categoriesWithPosts.map((cat) => {
            const isSelected = activeTab === cat.name
            return (
              <button
                key={cat.name}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`homeProcTabBtn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.name)}
                title={`Xem ${cat.count} hồ sơ thuộc ${cat.name}`}
              >
                <span>{cat.name}</span>
                <span className="homeProcTabCount">{cat.count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* DANH SÁCH THẺ ĐẤU THẦU ĐÃ LỌC */}
      <div className="pairColList">
        {filteredItems.length > 0 ? (
          filteredItems.map((entry) => {
            const status = entry.procurementStatus || 'open'
            const statusClass = status === 'open' ? 'open' : status === 'closing' ? 'closing' : 'closed'
            const statusText =
              status === 'open'
                ? 'Đang tiếp nhận'
                : status === 'closing'
                ? 'Sắp hết hạn'
                : status === 'closed'
                ? 'Đã hết hạn'
                : 'Đã kết thúc'
            const deadline = entry.deadlineAt ? new Date(entry.deadlineAt).toLocaleDateString('vi-VN') : null
            const typeText = entry.type || 'Mời thầu'
            const catLabel = getProcurementCategoryName(entry)

            return (
              <a className="procurementCardItem" href={`/dau-thau-mua-sam/${entry.slug}`} key={entry.id}>
                <div className="procurementCardTop">
                  <div className="procurementCardBadges">
                    <span className="procurementTypeBadge">{typeText}</span>
                    <span className={`procurementStatusBadge ${statusClass}`}>{statusText}</span>
                  </div>
                  {entry.referenceCode && (
                    <span className="procurementRefCode">Mã: {entry.referenceCode}</span>
                  )}
                </div>

                <h3 className="procurementCardTitle">{entry.title}</h3>

                <div className="procurementCardFooter">
                  {deadline ? (
                    <span className="procurementDeadline">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Hạn nộp: {deadline}
                    </span>
                  ) : (
                    <span className="procurementDeadline noDeadline">
                      {entry.publishedAt
                        ? `Đăng ngày ${new Date(entry.publishedAt).toLocaleDateString('vi-VN')}`
                        : 'Xem hồ sơ'}
                    </span>
                  )}

                  <span className="procurementActionLink">Hồ sơ chi tiết →</span>
                </div>
              </a>
            )
          })
        ) : (
          <div className="pairColEmpty">Không có bài đăng nào trong chuyên mục này.</div>
        )}
      </div>
    </div>
  )
}
