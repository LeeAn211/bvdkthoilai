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
  if (isFeatured) {
    // Ô lớn: ảnh trên (kèm badge chuyên mục), nội dung dưới (kèm excerpt)
    return (
      <a href={item.href || `/tin-tuc/${item.slug}`} className="featured">
        <div className="homeEditorialImage">
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              className="editorialImg"
              loading="lazy"
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
      <div className="homeEditorialImage">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="editorialImg"
            loading="lazy"
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
    const valid = (configuredTabs || []).filter(
      (tab) => tab.label?.trim() || tab.categories?.some(Boolean) || tab.manualItems?.some((item) => item.title?.trim()),
    )
    return (valid.length ? valid : defaultTabs).map((tab, index) => ({
      ...tab,
      label: tab.label?.trim() || `Chuyên mục ${index + 1}`,
      categories: (tab.categories || []).filter(Boolean),
      manualItems: (tab.manualItems || []).filter((item) => item.title?.trim()),
    }))
  }, [configuredTabs])

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
      {/* Tab buttons */}
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

      {/* Panel — dùng cùng form homeEditorialGrid của section Thông báo */}
      {filteredItems.length > 0 ? (
        <div role="tabpanel" className="homeEditorialGrid" style={{ marginTop: 22 }}>
          {featured ? (
            <NewsCard item={featured} isFeatured={true} activeTab={activeTab} />
          ) : (
            <EmptyCard />
          )}
          {sideItems.map((item, idx) =>
            item ? (
              <NewsCard key={item.id} item={item} isFeatured={false} activeTab={activeTab} />
            ) : (
              <EmptyCard key={`empty-${idx}`} />
            ),
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
