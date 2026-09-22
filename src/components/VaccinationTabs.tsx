'use client'

import { useEffect, useMemo, useState } from 'react'

type VaccinationTabConfig = {
  label?: string
  kind?: string
  limit?: number
  customBadge?: string
  seeMoreUrl?: string
  manualItems?: any[]
}
type Props = {
  announcements: any[]
  campaigns: any[]
  vaccines: any[]
  medpro: string
  tabOrder?: string[]
  tabs?: VaccinationTabConfig[]
  compact?: boolean
  bookButtonText?: string
  detailButtonText?: string
  itemsPerView?: number
  autoplaySeconds?: number
}
type VaccinationKind = 'announcements' | 'campaigns' | 'vaccines' | 'manual'

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''
const money = (value: any) => typeof value === 'number' ? `${new Intl.NumberFormat('vi-VN').format(value)}đ` : (typeof value === 'string' && value ? value : 'Liên hệ')
const availability: Record<string, string> = { available: 'Đang có vắc xin', coming: 'Sắp có', unavailable: 'Tạm hết' }

function ModernVaccineItemCard({
  item,
  medproUrl,
  detailButtonText = 'Chi tiết',
  bookButtonText = 'Đăng ký tiêm',
}: {
  item: any
  medproUrl?: string
  detailButtonText?: string
  bookButtonText?: string
}) {
  const isAvail = item.availability !== 'unavailable' && item.availability !== 'coming'
  const isComing = item.availability === 'coming'
  const feeDisplay = item.priceText ? item.priceText : money(item.fee)
  const isFree = item.fee === 0 || String(feeDisplay).toLowerCase().includes('miễn phí')

  return (
    <div className="vaccineModernCard">
      {/* 1. Header: Trạng thái, Xuất xứ, Mã vắc xin */}
      <div className="vaccineCardTopHeader">
        <div className="vaccineCardTopBadges">
          <span className={`vaccineStatusPill ${isAvail ? 'available' : isComing ? 'coming' : 'unavailable'}`}>
            <span className="vaccineStatusDot" />
            {isAvail ? 'ĐANG CÓ VẮC XIN' : isComing ? 'SẮP CÓ VẮC XIN' : 'TẠM HẾT'}
          </span>
          {item.origin && (
            <span className="vaccineOriginPill">
              Xuất xứ: {item.origin}
            </span>
          )}
        </div>
        {item.code && <span className="vaccineCodeTag">{item.code}</span>}
      </div>

      {/* 2. Body: Tiêu đề, Mô tả tóm tắt, Bảng thông tin chi tiết */}
      <div className="vaccineCardMainBody">
        <h3 className="vaccineMainTitle">
          <a href={item.href || `/tiem-chung/${item.id}`}>{item.title}</a>
        </h3>

        {item.summary && <p className="vaccineShortSummary">{item.summary}</p>}

        <div className="vaccineInfoTableBox">
          {item.prevents && (
            <div className="vaccineInfoRow">
              <span className="vaccineInfoKey">Phòng bệnh:</span>
              <span className="vaccineInfoVal preventVal">{item.prevents}</span>
            </div>
          )}
          {(item.ageGroup || item.target) && (
            <div className="vaccineInfoRow">
              <span className="vaccineInfoKey">Đối tượng:</span>
              <span className="vaccineInfoVal">{item.ageGroup || item.target}</span>
            </div>
          )}
          {item.manufacturer && (
            <div className="vaccineInfoRow">
              <span className="vaccineInfoKey">Hãng SX:</span>
              <span className="vaccineInfoVal">{item.manufacturer}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer: Giá tiêm niêm yết + Nút Chi tiết & Đăng ký tiêm */}
      <div className="vaccineBottomBar">
        <div className="vaccinePriceBox">
          <span className="vaccinePriceSub">GIÁ TIÊM NIÊM YẾT</span>
          <span className={`vaccinePriceNum ${isFree ? 'free' : ''}`}>{feeDisplay}</span>
        </div>

        <div className="vaccineCardBtns">
          <a href={item.href || `/tiem-chung/${item.id}`} className="vaccineBtnDetail">
            {detailButtonText}
          </a>
          <a
            href={item.registrationUrl || medproUrl || '/tiem-chung'}
            target={item.registrationUrl || medproUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="vaccineBtnRegister"
          >
            {item.buttonText || bookButtonText}
          </a>
        </div>
      </div>
    </div>
  )
}

function VaccinationCard({ item, kind, featured = false }: { item: any; kind: VaccinationKind; featured?: boolean }) {
  const isVaccine = kind === 'vaccines'


  // --- TAB VẮC XIN: giữ nguyên layout cũ ---
  if (isVaccine) {
    const label = item.badge || (availability[item.availability] || 'Đang cập nhật')
    const feeDisplay = item.priceText ? item.priceText : money(item.fee)
    return (
      <a className={`vaccineCard ${featured ? 'tabFeatureCard' : 'tabSideCard'}`} href={item.href || `/tiem-chung/${item.id}`}>
        {item.imageUrl ? <img src={item.imageUrl} alt={item.title}/> : <div className="vaccinePlaceholder">💉</div>}
        <div>
          <span className={`vaccineStatus ${item.availability || 'available'}`}>{label}</span>
          <h3>{item.title}</h3>
          {featured && <p>{item.prevents ? `Phòng bệnh: ${item.prevents}` : (item.summary || item.desc)}</p>}
          {featured ? <div className="vaccineCardFooter"><strong>{feeDisplay}</strong><b>{item.buttonText || 'Xem chi tiết →'}</b></div> : <b>{item.buttonText || 'Xem chi tiết →'}</b>}
        </div>
      </a>
    )
  }

  // --- TAB TIÊM NGỪA THEO ĐỢT & THÔNG BÁO LỊCH TIÊM: Phương án 3 chuẩn mực ---
  const badge = item.badge || (kind === 'announcements' ? 'THÔNG BÁO TIÊM NGỪA' : `ĐỢT TIÊM · ${formatDate(item.date)}`)
  const excerpt = kind === 'announcements'
    ? (item.summary || item.description || 'Bấm xem chi tiết nội dung thông báo lịch tiêm ngừa.')
    : (item.summary || item.target || item.description || 'Thông tin đợt tiêm ngừa tại bệnh viện.')
  const href = item.href || `/tiem-chung/${item.id}`
  const dateStr = item.date ? formatDate(item.date) : (item.startDate ? formatDate(item.startDate) : '')
  const placeholder = kind === 'announcements' ? '📢' : '🗓'

  if (featured) {
    return (
      <a className="editorialHeroCard" href={href}>
        <div className="editorialHeroThumb">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="editorialHeroImg" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' }}>
              {placeholder}
            </div>
          )}
          <span className="editorialHeroBadge">{badge}</span>
        </div>
        <div className="editorialHeroBody">
          {dateStr && (
            <div className="editorialHeroDate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{dateStr}</span>
            </div>
          )}
          <h3 className="editorialHeroTitle">{item.title}</h3>
          <p className="editorialHeroExcerpt">{excerpt}</p>
          <div className="editorialHeroAction">
            <span>Xem chi tiết thông tin →</span>
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
    <a className="editorialRowItem" href={href}>
      <div className="editorialRowThumb">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="editorialRowImg" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: '#e0f2fe' }}>
            {placeholder}
          </div>
        )}
      </div>
      <div className="editorialRowContent">
        <div className="editorialRowMeta">
          <span className="editorialRowBadge">{badge}</span>
          {dateStr && <span className="editorialRowDate">{dateStr}</span>}
        </div>
        <h4 className="editorialRowTitle">{item.title}</h4>
        {excerpt && <p className="editorialRowExcerpt">{excerpt}</p>}
      </div>
      <div className="editorialRowArrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </a>
  )
}


export function VaccinationTabs({
  announcements,
  campaigns,
  vaccines,
  medpro = '',
  tabOrder = ['announcements', 'campaigns', 'vaccines'],
  tabs: configuredTabs,
  compact = false,
  bookButtonText = 'Đăng ký tiêm',
  detailButtonText = 'Chi tiết',
  itemsPerView = 3,
  autoplaySeconds = 5,
}: Props) {
  const builtInMeta: Record<string, { label: string; items: any[]; kind: VaccinationKind; empty: string }> = {
    announcements: { label: 'Thông báo lịch tiêm', items: announcements, kind: 'announcements', empty: 'Chưa có thông báo lịch tiêm ngừa chung.' },
    campaigns: { label: 'Tiêm ngừa theo đợt', items: campaigns, kind: 'campaigns', empty: 'Chưa có đợt tiêm ngừa được thông báo.' },
    vaccines: { label: 'Các loại vắc xin', items: vaccines, kind: 'vaccines', empty: 'Danh mục vắc xin đang được cập nhật.' },
  }
  const tabDefinitions = useMemo(() => {
    const valid = (configuredTabs || []).filter((item) => item.label?.trim() || item.kind || item.manualItems?.some((entry) => entry.title?.trim()))
    let rawTabs = []
    if (valid.length) {
      rawTabs = valid.map((item, index) => {
        const builtIn = item.kind ? builtInMeta[item.kind] : undefined
        const manualItems = (item.manualItems || []).filter((entry) => entry.title?.trim())
        const mergedItems = builtIn ? [...(builtIn.items || []), ...manualItems] : manualItems
        const limit = typeof item.limit === 'number' && item.limit > 0 ? item.limit : 999
        const limitedItems = mergedItems.slice(0, limit)
        return {
          key: `${item.kind || 'manual'}-${index}`,
          queryKey: item.kind || `manual-${index}`,
          label: item.label?.trim() || builtIn?.label || `Tiêm ngừa ${index + 1}`,
          kind: (builtIn?.kind || (item.kind === 'vaccines' ? 'vaccines' : 'announcements')) as VaccinationKind,
          customBadge: item.customBadge,
          seeMoreUrl: item.seeMoreUrl,
          items: limitedItems,
          empty: builtIn?.empty || 'Nội dung đang được cập nhật.',
        }
      })
    } else {
      const keys = tabOrder.length ? tabOrder : ['announcements', 'campaigns', 'vaccines']
      rawTabs = keys.filter((key) => builtInMeta[key]).map((key, index) => ({
        key: `${key}-${index}`,
        queryKey: key,
        ...builtInMeta[key],
        customBadge: undefined as string | undefined,
        seeMoreUrl: undefined as string | undefined,
      }))
    }

    // Chỉ giữ lại các tab THỰC SỰ CÓ DỮ LIỆU
    const activeWithItems = rawTabs.filter((tab) => tab.items && tab.items.length > 0)
    return activeWithItems.length > 0 ? activeWithItems : rawTabs
  }, [announcements, campaigns, configuredTabs, tabOrder, vaccines])

  const initialTabKey = useMemo(() => {
    const found = tabDefinitions.find((t) => t.items.length > 0)
    return found ? found.key : (tabDefinitions[0]?.key || 'announcements-0')
  }, [tabDefinitions])

  const [tab, setTab] = useState(initialTabKey)
  const [expandedTab, setExpandedTab] = useState<string | null>(null)
  const [selectedAge, setSelectedAge] = useState<string>('all')

  // Quản lý chuyển động trượt 3 ô vắc xin (Carousel)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useMemo(() => ({ current: null as number | null }), [])

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab')
    const requested = tabDefinitions.find((item) => item.queryKey === requestedTab || item.key === requestedTab)
    if (requested) setTab(requested.key)
  }, [tabDefinitions])

  useEffect(() => {
    if (!tabDefinitions.some((item) => item.key === tab)) setTab(tabDefinitions[0]?.key || '')
  }, [tab, tabDefinitions])

  const ageOptions = [
    { label: 'Tất cả', value: 'all', matches: [] },
    { label: 'Trẻ sơ sinh', value: 'infant', matches: ['infant', 'tháng', 'sơ sinh', 'tuần', '< 1'] },
    { label: 'Trẻ em', value: 'child', matches: ['child', 'trẻ em', 'tuổi', 'trẻ'] },
    { label: 'Phụ nữ mang thai', value: 'pregnancy', matches: ['pregnancy', 'mang thai', 'phụ nữ', 'thai kỳ'] },
    { label: 'Người lớn', value: 'adult', matches: ['adult', 'người lớn', 'cao tuổi', 'trưởng thành'] },
  ]

  const activeDefinition = tabDefinitions.find((item) => item.key === tab) || tabDefinitions[0]

  // Tính toán danh sách vắc xin sau lọc
  const processedVaccineItems = useMemo(() => {
    if (!activeDefinition || activeDefinition.kind !== 'vaccines') return []
    let list = activeDefinition.items || []
    if (selectedAge !== 'all') {
      const opt = ageOptions.find(o => o.value === selectedAge)
      if (opt) {
        list = list.filter(v => {
          if (v.targetGroup) {
            if (v.targetGroup === selectedAge) return true
            if (v.targetGroup === 'all') return true
          }
          const text = `${v.ageGroup || ''} ${v.prevents || ''}`.toLowerCase()
          return opt.matches.some(m => text.includes(m))
        })
      }
    }
    return list
  }, [activeDefinition, selectedAge])

  const totalVaccines = processedVaccineItems.length

  // Tự động chuyển động qua các ô khác (Autoplay)
  useEffect(() => {
    if (totalVaccines <= 3 || !autoplaySeconds || autoplaySeconds <= 0 || isPaused) return
    const timer = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % totalVaccines)
    }, autoplaySeconds * 1000)
    return () => window.clearInterval(timer)
  }, [totalVaccines, autoplaySeconds, isPaused])

  const nextVaccine = () => {
    if (totalVaccines > 0) {
      setCarouselIndex((prev) => (prev + 1) % totalVaccines)
    }
  }

  const prevVaccine = () => {
    if (totalVaccines > 0) {
      setCarouselIndex((prev) => (prev - 1 + totalVaccines) % totalVaccines)
    }
  }

  // Xử lý vuốt cảm ứng trên thiết bị di động
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX > 45) {
      prevVaccine()
    } else if (deltaX < -45) {
      nextVaccine()
    }
    touchStartX.current = null
  }

  const renderPanel = (definition: typeof tabDefinitions[number]) => {
    let items = definition.items

    // Nếu đang ở tab Vắc xin, cho phép lọc theo độ tuổi / đối tượng
    if (definition.kind === 'vaccines' && selectedAge !== 'all') {
      items = processedVaccineItems
    }

    const expanded = !compact && expandedTab === definition.key
    const visibleItems = expanded ? items : items.slice(0, 5)

    // Xác định 3 ô vắc xin hiển thị xoay vòng
    const targetPerView = Math.max(1, Math.min(itemsPerView || 3, 4))
    const displayCount = Math.min(items.length, targetPerView)
    const carouselVisibleItems = items.length > 0
      ? Array.from({ length: displayCount }).map((_, offset) => {
          const idx = (carouselIndex + offset) % items.length
          return { ...items[idx], originalIndex: idx }
        })
      : []

    return <div className="vaccinationPanel">
      {definition.kind === 'vaccines' && (
        <div className="vaccineAgeFilterBar">
          <span className="vaccineAgeFilterLabel">Lọc theo độ tuổi:</span>
          {ageOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setSelectedAge(opt.value); setExpandedTab(null); setCarouselIndex(0) }}
              className={`vaccineAgeFilterBtn ${selectedAge === opt.value ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {items.length === 0 ? <div className="empty-state">{definition.kind === 'vaccines' ? 'Không có vắc xin nào cho độ tuổi này.' : definition.empty}</div> : <>
        {definition.kind === 'vaccines' ? (
          items.length > 3 && !expanded ? (
            /* CAROUSEL TRƯỢT 3 Ô VẮC XIN */
            <div
              className="vaccineCarouselWrapper"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="vaccineCarouselTrack">
                {carouselVisibleItems.map((item, index) => (
                  <ModernVaccineItemCard
                    item={item}
                    medproUrl={medpro}
                    detailButtonText={detailButtonText}
                    bookButtonText={bookButtonText}
                    key={item.id ? `${item.id}-${index}` : index}
                  />
                ))}
              </div>

              {/* Thanh điều hướng Trước/Sau tinh gọn (chỉ giữ 2 nút < và > đồng bộ) */}
              <div className="vaccineCarouselControls">
                <button
                  type="button"
                  className="vaccineNavBtn"
                  onClick={prevVaccine}
                  aria-label="Vắc xin trước"
                  title="Vắc xin trước"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="vaccineNavBtn"
                  onClick={nextVaccine}
                  aria-label="Vắc xin tiếp theo"
                  title="Vắc xin tiếp theo"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Hiển thị lưới khi có <= 3 vắc xin hoặc khi bấm Xem tất cả */
            <div className="vaccineModernGrid">
              {visibleItems.map((item, index) => (
                <ModernVaccineItemCard
                  item={item}
                  medproUrl={medpro}
                  detailButtonText={detailButtonText}
                  bookButtonText={bookButtonText}
                  key={item.id || index}
                />
              ))}
            </div>
          )
        ) : (
          <div className={`editorialVariant3 vaccinationEditorialGrid ${visibleItems.length === 1 ? 'single' : ''}`}>
            <VaccinationCard item={visibleItems[0]} kind={definition.kind} featured />
            {visibleItems.length > 1 && (
              <div className="editorialRowList">
                {visibleItems.slice(1).map((item, index) => <VaccinationCard item={item} kind={definition.kind} key={item.id || index} />)}
              </div>
            )}
          </div>
        )}
        {!compact && items.length > 3 && (
          <div className="tabViewAllWrap">
            <button className="tabViewAllButton" type="button" onClick={() => setExpandedTab(expanded ? null : definition.key)}>
              {expanded ? 'Thu gọn về chế độ xem 3 ô ↑' : `Xem tất cả ${items.length} vắc xin dạng danh sách →`}
            </button>
          </div>
        )}
      </>}
    </div>
  }

  return <div className={`vaccinationExplorer ${compact ? 'compactVaccinationExplorer' : ''}`}>
    {tabDefinitions.length > 1 && (
      <div className="scheduleTabs vaccinationTabButtons">
        {tabDefinitions.map((item) => (
          <button
            key={item.key}
            className={tab === item.key ? 'active' : ''}
            onClick={() => { setTab(item.key); setExpandedTab(null); setSelectedAge('all') }}
            style={{ position: 'relative' }}
          >
            {item.label}
            {item.customBadge && (
              <span style={{ marginLeft: '4px', fontSize: '10px', background: '#f59e0b', color: '#fff', padding: '1px 6px', borderRadius: '99px', fontWeight: 700 }}>
                {item.customBadge}
              </span>
            )}
            <span>{item.items.length}</span>
          </button>
        ))}
      </div>
    )}
    {activeDefinition && renderPanel(activeDefinition)}
  </div>
}
