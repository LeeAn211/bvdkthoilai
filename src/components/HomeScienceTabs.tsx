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

export function HomeScienceTabs({ items, tabs: configuredTabs }: { items: ScienceItem[]; tabs?: ScienceTab[] }) {
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
  const activeTabData = tabs.find((item) => item.label === activeTab) || tabs[0]
  const visibleItems = filteredItems.slice(0, 5)

  return (
    <>
      <div className="portalTabs newsTabButtons" role="tablist" aria-label="Nhóm hoạt động khoa học">
        {tabs.map((tab) => (
          <button type="button" role="tab" aria-selected={activeTab === tab.label} className={activeTab === tab.label ? 'active' : ''} onClick={() => setActiveTab(tab.label)} key={tab.label}>
            {tab.label}
          </button>
        ))}
      </div>
      {filteredItems.length > 0 ? (
        <div role="tabpanel">
          <div className={`tabEditorialGrid ${visibleItems.length === 1 ? 'single' : ''}`}>
            <a className="scienceCard tabFeatureCard" href={visibleItems[0].href || `/tin-tuc/${visibleItems[0].slug}`}>
              <div className="scienceImage" style={visibleItems[0].coverUrl ? { backgroundImage: `url("${visibleItems[0].coverUrl}")` } : undefined}></div>
              <div>
                <small>{visibleItems[0].category || activeTab}{visibleItems[0].date ? ` · ${visibleItems[0].date}` : ''}</small>
                <h3>{visibleItems[0].title}</h3>
                <p>{visibleItems[0].excerpt || 'Thông tin chuyên môn và hoạt động đào tạo của bệnh viện.'}</p>
              </div>
            </a>
            <div className="tabEditorialList">
              {visibleItems.slice(1).map((item) => (
                <a className="scienceCard tabSideCard" href={item.href || `/tin-tuc/${item.slug}`} key={item.id}>
                  <div className="scienceImage" style={item.coverUrl ? { backgroundImage: `url("${item.coverUrl}")` } : undefined}></div>
                  <div>
                    <small>{item.category || activeTab}{item.date ? ` · ${item.date}` : ''}</small>
                    <h3>{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="tabViewAllWrap">
            <a className="tabViewAllButton" href={activeTabData.categories?.[0] ? `/tin-tuc?category=${encodeURIComponent(activeTabData.categories[0])}` : '/tin-tuc'}>Xem tất cả {activeTab.toLowerCase()} ({filteredItems.length}) →</a>
          </div>
        </div>
      ) : (
        <div className="professionalEmpty tabEmptyState">Chưa có bài viết trong nhóm “{activeTab}”.</div>
      )}
    </>
  )
}
