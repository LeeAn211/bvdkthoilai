'use client'

import { useEffect, useMemo, useState } from 'react'

type ScienceItem = {
  id: string | number
  title: string
  slug: string
  category?: string
  excerpt?: string
  date?: string
  coverUrl?: string
  href?: string
}

type ScienceTab = { label?: string; categories?: string[]; manualItems?: ScienceItem[] }

const defaultTabs: ScienceTab[] = [
  { label: 'Đào tạo – Tập huấn', categories: ['Đào tạo – Tập huấn', 'Đào tạo – nghiên cứu'] },
  { label: 'Hội nghị – Hội thảo', categories: ['Hội nghị – Hội thảo'] },
  { label: 'Kiến thức y khoa', categories: ['Kiến thức sức khỏe'] },
  { label: 'Thông tin cho người bệnh', categories: ['Thông tin cho người bệnh'] },
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

/** Card hoạt động khoa học — dùng cùng form editorial với Trang tin tức Bệnh viện */
function ScienceCard({
  item,
  isFeatured,
  activeTab,
}: {
  item: ScienceItem
  isFeatured: boolean
  activeTab: string
}) {
  if (isFeatured) {
    // Ô lớn: ảnh trên (kèm badge chuyên mục), nội dung dưới (kèm excerpt)
    return (
      <a href={item.href || `/hoat-dong-khoa-hoc/${item.slug}`} className="featured">
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
          <p>{item.excerpt || 'Thông tin chuyên môn và hoạt động đào tạo của bệnh viện.'}</p>
        </div>
      </a>
    )
  }

  // 4 ô nhỏ: layout dọc (ảnh trên, text dưới, không badge, không excerpt)
  return (
    <a href={item.href || `/hoat-dong-khoa-hoc/${item.slug}`}>
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

export function HomeScienceTabs({ items, tabs: configuredTabs }: { items: ScienceItem[]; tabs?: ScienceTab[] }) {
  const tabs = useMemo(() => {
    const valid = (configuredTabs || []).filter(
      (tab) => tab.label?.trim() || tab.categories?.some(Boolean) || tab.manualItems?.some((item) => item.title?.trim()),
    )
    const source = configuredTabs === undefined ? (valid.length ? valid : defaultTabs) : valid
    return source.map((tab, index) => ({
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
    if (!tab) return []
    return [
      ...items.filter((item) => (tab.categories || []).includes(item.category || '')),
      ...(tab.manualItems || []),
    ]
  }, [activeTab, items, tabs])

  if (!tabs.length) {
    return <div className="professionalEmpty tabEmptyState">Chưa có nhóm Hoạt động khoa học đang sử dụng.</div>
  }

  // Luôn 5 slot: [0] = ô lớn, [1..4] = 4 ô nhỏ (null nếu thiếu bài)
  const slots = Array.from({ length: 5 }, (_, i) => filteredItems[i] || null)
  const [featured, ...sideItems] = slots

  return (
    <>
      <div className="portalTabs newsTabButtons" role="tablist" aria-label="Nhóm hoạt động khoa học">
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

      {filteredItems.length > 0 ? (
        <div role="tabpanel" className="homeEditorialGrid" style={{ marginTop: 22 }}>
          {featured ? (
            <ScienceCard item={featured} isFeatured={true} activeTab={activeTab} />
          ) : (
            <EmptyCard />
          )}
          {sideItems.map((item, idx) =>
            item ? (
              <ScienceCard key={item.id} item={item} isFeatured={false} activeTab={activeTab} />
            ) : (
              <EmptyCard key={`empty-${idx}`} />
            ),
          )}
        </div>
      ) : (
        <div className="professionalEmpty tabEmptyState">
          Chưa có bài viết trong nhóm &ldquo;{activeTab}&rdquo;.
        </div>
      )}
    </>
  )
}

