'use client'

import { useEffect, useMemo, useState } from 'react'

type DepartmentItem = {
  id: string | number
  name: string
  slug: string
  kind?: string
  location?: string
  summary?: string
  href?: string
}

type DepartmentTab = { label?: string; kinds?: string[]; manualItems?: DepartmentItem[] }

const defaultTabs: DepartmentTab[] = [
  { label: 'Khối lâm sàng', kinds: ['clinical', 'department'] },
  { label: 'Khối cận lâm sàng', kinds: ['paraclinical'] },
  { label: 'Phòng chức năng', kinds: ['office'] },
]

export function HomeDepartmentTabs({ items, tabs: configuredTabs, compact = false }: { items: DepartmentItem[]; tabs?: DepartmentTab[]; compact?: boolean }) {
  const tabs = useMemo(() => {
    const valid = (configuredTabs || []).filter((tab) => tab.label?.trim() || tab.kinds?.some(Boolean) || tab.manualItems?.some((item) => item.name?.trim()))
    return (valid.length ? valid : defaultTabs).map((tab, index) => ({ ...tab, label: tab.label?.trim() || `Nhóm đơn vị ${index + 1}`, kinds: (tab.kinds || []).filter(Boolean), manualItems: (tab.manualItems || []).filter((item) => item.name?.trim()) }))
  }, [configuredTabs])
  const [activeTab, setActiveTab] = useState(tabs[0]?.label || '')

  useEffect(() => {
    if (!tabs.some((tab) => tab.label === activeTab)) setActiveTab(tabs[0]?.label || '')
  }, [activeTab, tabs])

  const filteredItems = useMemo(() => {
    const tab = tabs.find((item) => item.label === activeTab) || tabs[0]
    return [...items.filter((item) => (tab.kinds || []).includes(item.kind || 'department')), ...(tab.manualItems || [])]
  }, [activeTab, items, tabs])
  const activeTabData = tabs.find((item) => item.label === activeTab) || tabs[0]
  const visibleItems = filteredItems.slice(0, 5)

  if (compact) {
    return <>
      <div className="portalTabs newsTabButtons compactDepartmentButtons" role="tablist" aria-label="Nhóm đơn vị trực thuộc">
        {tabs.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab.label} className={activeTab === tab.label ? 'active' : ''} onClick={() => setActiveTab(tab.label)} key={tab.label}>{tab.label}</button>)}
      </div>
      <div className="homeDepartmentList">
        {filteredItems.slice(0, 7).map((item) => <a href={item.href || `/don-vi/${item.slug}`} key={item.id}><span>✚</span><strong>{item.name}</strong><i>›</i></a>)}
        {filteredItems.length === 0 && <div className="professionalEmpty">Chưa có đơn vị trong nhóm “{activeTab}”.</div>}
      </div>
    </>
  }

  return (
    <>
      <div className="portalTabs newsTabButtons" role="tablist" aria-label="Nhóm đơn vị trực thuộc">
        {tabs.map((tab) => (
          <button type="button" role="tab" aria-selected={activeTab === tab.label} className={activeTab === tab.label ? 'active' : ''} onClick={() => setActiveTab(tab.label)} key={tab.label}>
            {tab.label}
          </button>
        ))}
      </div>
      {filteredItems.length > 0 ? (
        <div role="tabpanel">
          <div className={`tabEditorialGrid departmentEditorialGrid ${visibleItems.length === 1 ? 'single' : ''}`}>
            <a className="directoryCard tabFeatureCard" href={visibleItems[0].href || `/don-vi/${visibleItems[0].slug}`}>
              <span className="directoryIcon">{visibleItems[0].kind === 'office' ? '⌂' : '✚'}</span>
              <div>
                <small>{activeTab.toUpperCase()}</small>
                <h3>{visibleItems[0].name}</h3>
                <p>{visibleItems[0].location || visibleItems[0].summary || 'Xem thông tin chi tiết đơn vị'}</p>
              </div>
              <i>›</i>
            </a>
            <div className="tabEditorialList">
              {visibleItems.slice(1).map((item) => (
                <a className="directoryCard tabSideCard" href={item.href || `/don-vi/${item.slug}`} key={item.id}>
                  <span className="directoryIcon">{item.kind === 'office' ? '⌂' : '✚'}</span>
                  <div>
                    <small>{activeTab.toUpperCase()}</small>
                    <h3>{item.name}</h3>
                    <p>{item.location || item.summary || 'Xem thông tin chi tiết đơn vị'}</p>
                  </div>
                  <i>›</i>
                </a>
              ))}
            </div>
          </div>
          <div className="tabViewAllWrap">
            <a className="tabViewAllButton" href={activeTabData.kinds?.[0] ? `/don-vi?kind=${encodeURIComponent(activeTabData.kinds[0])}` : '/don-vi'}>Xem tất cả {activeTab.toLowerCase()} ({filteredItems.length}) →</a>
          </div>
        </div>
      ) : (
        <div className="professionalEmpty tabEmptyState">Chưa có đơn vị trong nhóm “{activeTab}”.</div>
      )}
    </>
  )
}
