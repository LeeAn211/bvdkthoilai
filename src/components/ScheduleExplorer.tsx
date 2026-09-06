'use client'

import { useEffect, useMemo, useState } from 'react'

type ScheduleTabConfig = { label?: string; kind?: string; manualItems?: any[] }
type Props = { daily: any[]; weekly: any[]; attachments: any[]; medpro: string; tabOrder?: string[]; tabs?: ScheduleTabConfig[]; compact?: boolean }
type ScheduleKind = 'daily' | 'weekly' | 'attachments'

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''

function ScheduleCard({ item, kind, featured = false }: { item: any; kind: ScheduleKind; featured?: boolean }) {
  const label = kind === 'daily' ? `LỊCH KHÁM · ${formatDate(item.date)}` : kind === 'weekly' ? 'LỊCH KHÁM THEO TUẦN' : 'LỊCH ĐÍNH KÈM'
  const title = kind === 'daily' ? (item.title || item.doctor || 'Lịch khám bác sĩ') : item.title
  const summary = kind === 'daily'
    ? (item.summary || `${item.doctor || 'Bác sĩ phụ trách'} · ${item.department || 'Khoa khám bệnh'}`)
    : kind === 'weekly'
      ? (item.summary || `${item.slots?.length || 0} buổi khám được cập nhật trong tuần.`)
      : (item.summary || item.note || 'Bảng lịch khám được bệnh viện cập nhật.')
  const detail = kind === 'daily'
    ? `${item.startTime || '--:--'} – ${item.endTime || '--:--'} · ${item.room || 'Phòng khám cập nhật tại quầy'}`
    : `Áp dụng: ${formatDate(item.weekStart || item.validFrom)} ${(item.weekEnd || item.validTo) ? `– ${formatDate(item.weekEnd || item.validTo)}` : ''}`
  const placeholder = kind === 'daily' ? (item.date ? new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit' }) : 'LỊCH') : kind === 'weekly' ? '7' : (item.fileFormat || 'TỆP')

  return <a className={`schedulePostCard ${featured ? 'tabFeatureCard' : 'tabSideCard'}`} href={item.href || `/lich-kham/${item.id}`}>
    {item.imageUrl ? <img src={item.imageUrl} alt={title}/> : <div className="schedulePostPlaceholder">{placeholder}</div>}
    <div>
      <span>{label}</span>
      <h3>{title}</h3>
      {featured && <p>{summary}</p>}
      <small>{detail}</small>
      <b>Xem chi tiết →</b>
    </div>
  </a>
}

export function ScheduleExplorer({ daily, weekly, attachments, tabOrder = ['attachments', 'daily', 'weekly'], tabs: configuredTabs, compact = false }: Props) {
  const builtInMeta: Record<string, { label: string; items: any[]; kind: ScheduleKind; empty: string }> = {
    attachments: { label: 'Lịch đính kèm', items: attachments, kind: 'attachments', empty: 'Chưa có ảnh hoặc tệp lịch khám.' },
    daily: { label: 'Theo ngày', items: daily, kind: 'daily', empty: 'Chưa có lịch khám theo ngày.' },
    weekly: { label: 'Theo tuần', items: weekly, kind: 'weekly', empty: 'Chưa có lịch khám theo tuần.' },
  }
  const tabDefinitions = useMemo(() => {
    const valid = (configuredTabs || []).filter((item) => item.label?.trim() || item.kind || item.manualItems?.some((entry) => entry.title?.trim()))
    if (valid.length) return valid.map((item, index) => {
      const builtIn = item.kind ? builtInMeta[item.kind] : undefined
      const manualItems = (item.manualItems || []).filter((entry) => entry.title?.trim())
      return { key: `${item.kind || 'manual'}-${index}`, queryKey: item.kind || `manual-${index}`, label: item.label?.trim() || builtIn?.label || `Lịch khám ${index + 1}`, kind: builtIn?.kind || 'attachments' as ScheduleKind, items: [...(builtIn?.items || []), ...manualItems], empty: builtIn?.empty || 'Nội dung đang được cập nhật.' }
    })
    const keys = tabOrder.length ? tabOrder : ['attachments', 'daily', 'weekly']
    return keys.filter((key) => builtInMeta[key]).map((key, index) => ({ key: `${key}-${index}`, queryKey: key, ...builtInMeta[key] }))
  }, [attachments, configuredTabs, daily, tabOrder, weekly])
  const firstTab = tabDefinitions[0]?.key || 'attachments-0'
  const [tab, setTab] = useState(firstTab)
  const [selectedDate, setSelectedDate] = useState('all')
  const [expandedTab, setExpandedTab] = useState<string | null>(null)

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab')
    const requested = tabDefinitions.find((item) => item.queryKey === requestedTab || item.key === requestedTab)
    if (requested) setTab(requested.key)
  }, [tabDefinitions])

  useEffect(() => {
    if (!tabDefinitions.some((item) => item.key === tab)) setTab(tabDefinitions[0]?.key || '')
  }, [tab, tabDefinitions])

  const dates = useMemo(() => Array.from(new Set(daily.map(item => item.date).filter(Boolean))), [daily])

  const renderPanel = (definition: typeof tabDefinitions[number]) => {
    const items = definition.kind === 'daily' && selectedDate !== 'all' ? definition.items.filter((item: any) => !item.date || item.date === selectedDate) : definition.items
    const expanded = !compact && expandedTab === definition.key
    const visibleItems = expanded ? items : items.slice(0, 5)

    return <div className="scheduleTabPanel">
      {items.length === 0 ? <div className="empty-state">{definition.empty}</div> : <>
        <div className={`tabEditorialGrid scheduleEditorialGrid ${visibleItems.length === 1 ? 'single' : ''}`}>
          <ScheduleCard item={visibleItems[0]} kind={definition.kind} featured />
          <div className="tabEditorialList">
            {visibleItems.slice(1).map((item, index) => <ScheduleCard item={item} kind={definition.kind} key={item.id || index} />)}
          </div>
        </div>
        {!compact && items.length > 5 && <div className="tabViewAllWrap"><button className="tabViewAllButton" type="button" onClick={() => setExpandedTab(expanded ? null : definition.key)}>{expanded ? 'Thu gọn danh sách ↑' : `Xem tất cả ${items.length} nội dung →`}</button></div>}
      </>}
    </div>
  }

  const activeDefinition = tabDefinitions.find((item) => item.key === tab) || tabDefinitions[0]

  return <div className={`scheduleExplorer ${compact ? 'compactScheduleExplorer' : ''}`}>
    <div className="scheduleTabs" role="tablist">
      {tabDefinitions.map((item) => <button key={item.key} className={tab === item.key ? 'active' : ''} onClick={() => { setTab(item.key); setExpandedTab(null) }}>{item.label} <span>{item.items.length}</span></button>)}
    </div>

    {activeDefinition?.kind === 'daily' && <>
      {dates.length > 1 && <div className="scheduleDateFilter"><label>Chọn ngày xem lịch</label><select value={selectedDate} onChange={event => { setSelectedDate(event.target.value); setExpandedTab(null) }}><option value="all">Tất cả các ngày</option>{dates.map(date => <option value={date as string} key={date as string}>{formatDate(date as string)}</option>)}</select></div>}
    </>}
    {activeDefinition && renderPanel(activeDefinition)}
  </div>
}
