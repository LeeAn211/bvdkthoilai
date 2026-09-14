'use client'

import { useEffect, useMemo, useState } from 'react'

type VaccinationTabConfig = { label?: string; kind?: string; manualItems?: any[] }
type Props = { announcements: any[]; campaigns: any[]; vaccines: any[]; medpro: string; tabOrder?: string[]; tabs?: VaccinationTabConfig[]; compact?: boolean }
type VaccinationKind = 'announcements' | 'campaigns' | 'vaccines'

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''
const money = (value: any) => typeof value === 'number' ? `${new Intl.NumberFormat('vi-VN').format(value)}đ` : 'Liên hệ'
const availability: Record<string, string> = { available: 'Đang có vắc xin', coming: 'Sắp có', unavailable: 'Tạm hết' }

function VaccinationCard({ item, kind, featured = false }: { item: any; kind: VaccinationKind; featured?: boolean }) {
  const isVaccine = kind === 'vaccines'
  const label = kind === 'announcements' ? 'THÔNG BÁO TIÊM NGỪA' : kind === 'campaigns' ? `ĐỢT TIÊM · ${formatDate(item.date)}` : (availability[item.availability] || 'Đang cập nhật')
  const summary = kind === 'announcements'
    ? (item.summary || 'Bấm xem chi tiết nội dung thông báo lịch tiêm ngừa.')
    : kind === 'campaigns'
      ? (item.summary || item.target || 'Thông tin đợt tiêm ngừa tại bệnh viện.')
      : (item.prevents ? `Phòng bệnh: ${item.prevents}` : item.summary)
  const placeholder = kind === 'announcements' ? '📢' : kind === 'campaigns' ? '🗓' : '✚'

  return <a className={`${isVaccine ? 'vaccineCard' : 'vaccinationPostCard'} ${featured ? 'tabFeatureCard' : 'tabSideCard'}`} href={item.href || `/tiem-chung/${item.id}`}>
    {item.imageUrl ? <img src={item.imageUrl} alt={item.title}/> : <div className={isVaccine ? 'vaccinePlaceholder' : 'vaccinationPostPlaceholder'}>{placeholder}</div>}
    <div>
      {isVaccine ? <span className={`vaccineStatus ${item.availability}`}>{label}</span> : <span>{label}</span>}
      <h3>{item.title}</h3>
      {featured && <p>{summary}</p>}
      {isVaccine && featured ? <div className="vaccineCardFooter"><strong>{money(item.fee)}</strong><b>Xem chi tiết →</b></div> : <b>Xem chi tiết →</b>}
    </div>
  </a>
}

export function VaccinationTabs({ announcements, campaigns, vaccines, tabOrder = ['announcements', 'campaigns', 'vaccines'], tabs: configuredTabs, compact = false }: Props) {
  const builtInMeta: Record<string, { label: string; items: any[]; kind: VaccinationKind; empty: string }> = {
    announcements: { label: 'Thông báo lịch tiêm', items: announcements, kind: 'announcements', empty: 'Chưa có thông báo lịch tiêm ngừa chung.' },
    campaigns: { label: 'Tiêm ngừa theo đợt', items: campaigns, kind: 'campaigns', empty: 'Chưa có đợt tiêm ngừa được thông báo.' },
    vaccines: { label: 'Các loại vắc xin', items: vaccines, kind: 'vaccines', empty: 'Danh mục vắc xin đang được cập nhật.' },
  }
  const tabDefinitions = useMemo(() => {
    const valid = (configuredTabs || []).filter((item) => item.label?.trim() || item.kind || item.manualItems?.some((entry) => entry.title?.trim()))
    if (valid.length) return valid.map((item, index) => {
      const builtIn = item.kind ? builtInMeta[item.kind] : undefined
      const manualItems = (item.manualItems || []).filter((entry) => entry.title?.trim())
      return { key: `${item.kind || 'manual'}-${index}`, queryKey: item.kind || `manual-${index}`, label: item.label?.trim() || builtIn?.label || `Tiêm ngừa ${index + 1}`, kind: builtIn?.kind || 'announcements' as VaccinationKind, items: [...(builtIn?.items || []), ...manualItems], empty: builtIn?.empty || 'Nội dung đang được cập nhật.' }
    })
    const keys = tabOrder.length ? tabOrder : ['announcements', 'campaigns', 'vaccines']
    return keys.filter((key) => builtInMeta[key]).map((key, index) => ({ key: `${key}-${index}`, queryKey: key, ...builtInMeta[key] }))
  }, [announcements, campaigns, configuredTabs, tabOrder, vaccines])
  const [tab, setTab] = useState(tabDefinitions[0]?.key || 'announcements-0')
  const [expandedTab, setExpandedTab] = useState<string | null>(null)

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab')
    const requested = tabDefinitions.find((item) => item.queryKey === requestedTab || item.key === requestedTab)
    if (requested) setTab(requested.key)
  }, [tabDefinitions])

  useEffect(() => {
    if (!tabDefinitions.some((item) => item.key === tab)) setTab(tabDefinitions[0]?.key || '')
  }, [tab, tabDefinitions])

  const renderPanel = (definition: typeof tabDefinitions[number]) => {
    const items = definition.items
    const expanded = !compact && expandedTab === definition.key
    const visibleItems = expanded ? items : items.slice(0, 5)

    return <div className="vaccinationPanel">
      {items.length === 0 ? <div className="empty-state">{definition.empty}</div> : <>
        <div className={`tabEditorialGrid vaccinationEditorialGrid ${visibleItems.length === 1 ? 'single' : ''}`}>
          <VaccinationCard item={visibleItems[0]} kind={definition.kind} featured />
          <div className="tabEditorialList">
            {visibleItems.slice(1).map((item, index) => <VaccinationCard item={item} kind={definition.kind} key={item.id || index} />)}
          </div>
        </div>
        {!compact && items.length > 5 && <div className="tabViewAllWrap"><button className="tabViewAllButton" type="button" onClick={() => setExpandedTab(expanded ? null : definition.key)}>{expanded ? 'Thu gọn danh sách ↑' : `Xem tất cả ${items.length} nội dung →`}</button></div>}
      </>}
    </div>
  }

  const activeDefinition = tabDefinitions.find((item) => item.key === tab) || tabDefinitions[0]

  return <div className={`vaccinationExplorer ${compact ? 'compactVaccinationExplorer' : ''}`}>
    <div className="scheduleTabs vaccinationTabButtons">
      {tabDefinitions.map((item) => <button key={item.key} className={tab === item.key ? 'active' : ''} onClick={() => { setTab(item.key); setExpandedTab(null) }}>{item.label} <span>{item.items.length}</span></button>)}
    </div>
    {activeDefinition && renderPanel(activeDefinition)}
  </div>
}
