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

/** Card tin tức — dùng cùng form với editorial section thông báo */
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

  if (isFeatured) {
    // Ô lớn: ảnh trên (kèm badge chuyên mục), nội dung dưới (kèm excerpt)
    return (
      <a href={item.href || `/tin-tuc/${item.slug}`} className="featured">
        <div className="homeEditorialImage" style={bgStyle}>
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              className="editorialImg"
              loading="lazy"
              style={imgFitStyle}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#f0f7fd,#e2eef7)' }} />
          )}
          <span>{item.category || activeTab}</span>
        </div>
        <div className="homeEditorialCopy">
          <small>{item.date || 'Mới cập nhật'}</small>
          <h3>{item.title}</h3>
          <p>{item.excerpt || 'Nội dung được cập nhật từ hệ thống quản trị của bệnh viện.'}</p>
        </div>
      </a>
    )
  }

  // 4 ô nhỏ: layout dọc (ảnh trên, text dưới, không badge, không excerpt)
  return (
    <a href={item.href || `/tin-tuc/${item.slug}`}>
      <div className="homeEditorialImage" style={bgStyle}>
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="editorialImg"
            loading="lazy"
            style={imgFitStyle}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#f0f7fd,#e2eef7)' }} />
        )}
      </div>
      <div className="homeEditorialCopy">
        <small>{item.date || 'Mới cập nhật'}</small>
        <h3>{item.title}</h3>
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

      {/* Panel — dùng cùng form homeEditorialGrid của section Thông báo */}
      {filteredItems.length > 0 ? (
        <div role="tabpanel" className="homeEditorialGrid" style={{ marginTop: tabs.length > 1 ? 22 : 0 }}>
          {featured && <NewsCard item={featured} isFeatured={true} activeTab={activeTab} />}
          {sideItems.map((item) =>
            item ? (
              <NewsCard key={item.id} item={item} isFeatured={false} activeTab={activeTab} />
            ) : null,
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
