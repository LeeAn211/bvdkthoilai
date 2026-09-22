'use client'

import { useEffect, useMemo, useState } from 'react'

type NewsItem = {
  id: string | number
  title: string
  slug: string
  excerpt?: string
  category?: string
  date?: string
  coverUrl?: string
  href?: string
  coverFit?: string
  coverPosition?: string
}

type NewsTab = { label?: string; categories?: string[]; manualItems?: NewsItem[] }

const defaultTabs: NewsTab[] = [
  { label: 'Tin bệnh viện', categories: ['Hoạt động bệnh viện'] },
  { label: 'Tin y tế', categories: ['Tin y tế'] },
  { label: 'Kiến thức sức khỏe', categories: ['Kiến thức sức khỏe', 'Thông tin cho người bệnh'] },
  { label: 'Đào tạo – nghiên cứu', categories: ['Đào tạo – nghiên cứu', 'Đào tạo – Tập huấn', 'Hội nghị – Hội thảo', 'Thông tin cho nhân viên y tế'] },
  { label: 'Hoạt động đoàn thể', categories: ['Hoạt động đoàn thể', 'Tin Đảng ủy bệnh viện', 'Tin Công đoàn', 'Tin Đoàn thanh niên'] },
]

/** Placeholder card giữ layout khi không đủ bài — ẩn hoàn toàn */
function EmptyCard() {
  return (
    <div
      className="homeEditorialEmptyCard"
      aria-hidden="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: '#f7fbfe',
        border: '1px solid #e8f2f9',
        borderRadius: 14,
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

/** Card tin tức — dùng layout Phương án 3 Chuẩn mực */
function NewsCard({
  item,
  isFeatured,
  activeTab,
}: {
  item: NewsItem
  isFeatured: boolean
  activeTab: string
}) {
  const imgFitStyle = {
    objectFit: item.coverFit === 'fill' ? ('fill' as const) : (item.coverFit === 'contain' ? ('contain' as const) : ('cover' as const)),
    objectPosition: item.coverFit === 'cover-top' || item.coverPosition === 'top'
      ? 'top center'
      : (item.coverFit === 'cover-bottom' || item.coverPosition === 'bottom' ? 'bottom center' : 'center center'),
    width: '100%',
    height: '100%',
    display: 'block',
  }

  const bgStyle = item.coverFit === 'contain' ? { background: '#f4f8fb' } : undefined
  const href = item.href || `/tin-tuc/${item.slug}`
  const badge = item.category || activeTab || 'TIN TỨC'

  if (isFeatured) {
    return (
      <a href={href} className="editorialHeroCard featured">
        <div className="editorialHeroThumb" style={bgStyle}>
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              className="editorialHeroImg"
              loading="lazy"
              style={imgFitStyle}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', background: 'linear-gradient(135deg,#e0f2fe 0%,#bae6fd 100%)' }}>
              📰
            </div>
          )}
          <span className="editorialHeroBadge">{badge}</span>
        </div>
        <div className="editorialHeroBody">
          {item.date && (
            <div className="editorialHeroDate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{item.date}</span>
            </div>
          )}
          <h3 className="editorialHeroTitle">{item.title}</h3>
          <p className="editorialHeroExcerpt">{item.excerpt || 'Nội dung được cập nhật từ hệ thống quản trị của bệnh viện.'}</p>
          <div className="editorialHeroAction">
            <span>Xem chi tiết tin tức →</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </a>
    )
  }

  return (
    <a href={href} className="editorialRowItem">
      <div className="editorialRowThumb" style={bgStyle}>
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="editorialRowImg"
            loading="lazy"
            style={imgFitStyle}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: '#e0f2fe' }}>
            📰
          </div>
        )}
      </div>
      <div className="editorialRowContent">
        <div className="editorialRowMeta">
          <span className="editorialRowBadge">{badge}</span>
          {item.date && <span className="editorialRowDate">{item.date}</span>}
        </div>
        <h4 className="editorialRowTitle">{item.title}</h4>
        {item.excerpt && <p className="editorialRowExcerpt">{item.excerpt}</p>}
      </div>
      <div className="editorialRowArrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </a>
  )
}

export function HomeNewsTabs({ items, tabs: configuredTabs }: { items: NewsItem[]; tabs?: NewsTab[] }) {
  const tabs = useMemo(() => {
    // 1. Nếu admin có cấu hình tabs thủ công: chỉ giữ lại các tab THỰC SỰ CÓ BÀI VIẾT
    if (Array.isArray(configuredTabs) && configuredTabs.length > 0) {
      const activeConfigured = configuredTabs
        .map((tab, index) => {
          const label = tab.label?.trim() || `Chuyên mục ${index + 1}`
          const categories = (tab.categories || []).filter(Boolean)
          const manualItems = (tab.manualItems || []).filter((item) => item.title?.trim())
          const matchingArticles = items.filter((item) => categories.includes(item.category || ''))
          const totalCount = matchingArticles.length + manualItems.length
          return {
            ...tab,
            label,
            categories,
            manualItems,
            totalCount,
          }
        })
        .filter((tab) => tab.totalCount > 0)

      if (activeConfigured.length > 0) {
        return activeConfigured
      }
    }

    // 2. Tự động sinh danh sách Tabs từ chính các Chuyên mục THỰC TẾ của các bài viết đang có
    const categoryMap = new Map<string, number>()
    for (const item of items) {
      const cat = item.category?.trim() || 'Tin tức chung'
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    }

    if (categoryMap.size > 0) {
      return Array.from(categoryMap.keys()).map((cat) => ({
        label: cat,
        categories: [cat],
        manualItems: [],
        totalCount: categoryMap.get(cat) || 0,
      }))
    }

    return []
  }, [configuredTabs, items])

  const [activeTab, setActiveTab] = useState(tabs[0]?.label || '')

  useEffect(() => {
    if (!tabs.some((tab) => tab.label === activeTab)) setActiveTab(tabs[0]?.label || '')
  }, [activeTab, tabs])

  const filteredItems = useMemo(() => {
    const tab = tabs.find((item) => item.label === activeTab) || tabs[0]
    return [
      ...items.filter((item) => (tab.categories || []).includes(item.category || '')),
      ...(tab.manualItems || []),
    ]
  }, [activeTab, items, tabs])

  // Luôn 5 slot: [0] = ô lớn, [1..4] = 4 ô nhỏ (null nếu thiếu bài)
  const slots = Array.from({ length: 5 }, (_, i) => filteredItems[i] || null)
  const [featured, ...sideItems] = slots

  return (
    <>
      {/* Tab buttons: Chỉ hiển thị khi có từ 2 chuyên mục trở lên */}
      {tabs.length > 1 && (
        <div className="portalTabs newsTabButtons" role="tablist" aria-label="Các chuyên mục tin tức">
          {tabs.map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab.label}
              className={activeTab === tab.label ? 'active' : ''}
              onClick={() => setActiveTab(tab.label)}
              key={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Panel — dùng layout Phương án 3 Chuẩn mực */}
      {filteredItems.length > 0 ? (
        <div role="tabpanel" className="homeEditorialGrid editorialVariant3" style={{ marginTop: tabs.length > 1 ? 22 : 0 }}>
          {featured && <NewsCard item={featured} isFeatured={true} activeTab={activeTab} />}
          {sideItems.length > 0 && (
            <div className="editorialRowList">
              {sideItems.map((item) =>
                item ? (
                  <NewsCard key={item.id} item={item} isFeatured={false} activeTab={activeTab} />
                ) : null,
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="professionalEmpty tabEmptyState">
          Chưa có bài viết trong chuyên mục &ldquo;{activeTab}&rdquo;.
        </div>
      )}
    </>
  )
}
