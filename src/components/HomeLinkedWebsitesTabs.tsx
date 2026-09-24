'use client'

import React, { useMemo, useState } from 'react'
import { EditorialSectionRenderer } from './EditorialSectionRenderer'

export type LinkedArticleItem = {
  id: string | number
  title: string
  href: string
  cover?: string
  coverFit?: string
  coverPosition?: string
  excerpt?: string
  date?: string
  category?: string
  isExternal?: boolean
}

export type LinkedTabConfig = {
  id?: string
  enabled?: boolean
  label: string
  source: 'cantho-syt' | 'manual' | string
  badge?: string
  seeMoreUrl?: string
  seeMoreText?: string
  items?: LinkedArticleItem[]
}

interface HomeLinkedWebsitesTabsProps {
  tabs: LinkedTabConfig[]
  layout?: string
  showDate?: boolean
  showCategory?: boolean
  showExcerpt?: boolean
  badgeOverride?: string
  eyebrow?: string
  title?: string
  description?: string
  defaultSeeMoreUrl?: string
}

export function HomeLinkedWebsitesTabs({
  tabs = [],
  layout = 'editorial-grid',
  showDate = true,
  showCategory = true,
  showExcerpt = true,
  badgeOverride,
  eyebrow,
  title,
  description,
  defaultSeeMoreUrl = 'https://soyte.cantho.gov.vn/',
}: HomeLinkedWebsitesTabsProps) {
  // Lọc các tab đang bật (enabled !== false)
  const activeTabs = useMemo(() => {
    return tabs.filter((t) => t && t.enabled !== false && t.label?.trim())
  }, [tabs])

  const [activeTabLabel, setActiveTabLabel] = useState<string>(activeTabs[0]?.label || '')

  // Đồng bộ active tab nếu danh sách tab thay đổi
  const currentTab = useMemo(() => {
    return activeTabs.find((t) => t.label === activeTabLabel) || activeTabs[0] || null
  }, [activeTabs, activeTabLabel])

  if (!currentTab) return null

  // URL và text xem tất cả của Tab hiện tại
  const currentSeeMoreUrl = currentTab.seeMoreUrl || defaultSeeMoreUrl
  const currentSeeMoreText = currentTab.seeMoreText || `Xem tất cả tại ${currentTab.label} ↗`

  return (
    <>
      <div className="homeSectionHead">
        <div>
          <span className="sectionKicker">{eyebrow || 'CHỈ ĐẠO & TIN TỨC NGÀNH'}</span>
          <h2>{title || 'Cổng thông tin Liên kết & Chỉ đạo ngành'}</h2>
          <p>{description || 'Cập nhật tin tức hoạt động, văn bản chỉ đạo điều hành từ các cơ quan, đơn vị y tế liên kết.'}</p>
        </div>
        {currentSeeMoreUrl && (
          <a
            href={currentSeeMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="homeSectionActionExternal"
            title={`Mở trang chủ ${currentTab.label} ở tab mới`}
          >
            {currentSeeMoreText}
          </a>
        )}
      </div>

      {/* Thanh nút chuyển Tab (chỉ hiện khi có từ 2 tab trở lên) */}
      {activeTabs.length > 1 && (
        <div className="portalTabs newsTabButtons" role="tablist" aria-label="Các đơn vị y tế liên kết">
          {activeTabs.map((tab) => {
            const isActive = tab.label === currentTab.label
            return (
              <button
                type="button"
                role="tab"
                key={tab.label}
                aria-selected={isActive}
                className={isActive ? 'active' : ''}
                onClick={() => setActiveTabLabel(tab.label)}
              >
                {tab.label}
                {tab.badge && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 10,
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#e0f2fe',
                      color: isActive ? '#ffffff' : '#0369a1',
                      fontWeight: 700,
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Render nội dung bài viết của Tab đang chọn */}
      <div style={{ marginTop: activeTabs.length > 1 ? 22 : 0 }}>
        <EditorialSectionRenderer
          items={currentTab.items || []}
          layout={layout}
          showDate={showDate}
          showCategory={showCategory}
          showExcerpt={showExcerpt}
          badgeOverride={badgeOverride || currentTab.badge || currentTab.label.toUpperCase()}
          emptyText={`Chưa có thông tin hoặc bài viết từ ${currentTab.label}.`}
          actionText={`Xem trên ${currentTab.label} ↗`}
        />
      </div>
    </>
  )
}
