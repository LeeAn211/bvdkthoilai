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

export function HomeNewsTabs({ items, tabs: configuredTabs }: { items: NewsItem[]; tabs?: NewsTab[] }) {
  const tabs = useMemo(() => {
    const valid = (configuredTabs || []).filter((tab) => tab.label?.trim() || tab.categories?.some(Boolean) || tab.manualItems?.some((item) => item.title?.trim()))
    return (valid.length ? valid : defaultTabs).map((tab, index) => ({ ...tab, label: tab.label?.trim() || `Chuyên mục ${index + 1}`, categories: (tab.categories || []).filter(Boolean), manualItems: (tab.manualItems || []).filter((item) => item.title?.trim()) }))
  }, [configuredTabs])
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || '')

  useEffect(() => {
    if (!tabs.some((tab) => tab.label === activeTab)) setActiveTab(tabs[0]?.label || '')
  }, [activeTab, tabs])

  const filteredItems = useMemo(() => {
    const tab = tabs.find((item) => item.label === activeTab) || tabs[0]
    return [...items.filter((item) => (tab.categories || []).includes(item.category || '')), ...(tab.manualItems || [])]
  }, [activeTab, items, tabs])

  const visibleItems = filteredItems.slice(0, 5)

  return (
    <>
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

      {filteredItems.length > 0 ? (
        <div role="tabpanel">
          <div className={`tabEditorialGrid ${visibleItems.length === 1 ? 'single' : ''}`}>
            <a className="portalNewsCard tabFeatureCard" href={visibleItems[0].href || `/tin-tuc/${visibleItems[0].slug}`}>
              <div className="portalNewsImage" style={visibleItems[0].coverUrl ? { backgroundImage: `url("${visibleItems[0].coverUrl}")` } : undefined}>
                <span>{visibleItems[0].category || activeTab}</span>
              </div>
              <div className="portalNewsBody">
                <small>{visibleItems[0].date || 'Mới cập nhật'}</small>
                <h3>{visibleItems[0].title}</h3>
                <p>{visibleItems[0].excerpt || 'Nội dung được cập nhật từ hệ thống quản trị của bệnh viện.'}</p>
              </div>
            </a>
            <div className="tabEditorialList">
              {visibleItems.slice(1).map((item) => (
                <a className="portalNewsCard tabSideCard" href={item.href || `/tin-tuc/${item.slug}`} key={item.id}>
                  <div className="portalNewsImage" style={item.coverUrl ? { backgroundImage: `url("${item.coverUrl}")` } : undefined}>
                    <span>{item.category || activeTab}</span>
                  </div>
                  <div className="portalNewsBody">
                    <small>{item.date || 'Mới cập nhật'}</small>
                    <h3>{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="professionalEmpty tabEmptyState">Chưa có bài viết trong chuyên mục “{activeTab}”.</div>
      )}
    </>
  )
}
