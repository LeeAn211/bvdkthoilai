import React from 'react'

export type EditorialItem = {
  id: string | number
  title: string
  href: string
  cover?: string
  coverFit?: string
  coverPosition?: string
  excerpt?: string
  date?: string
  category?: string
  isExternal?: boolean
}

export interface EditorialSectionParams {
  items: EditorialItem[]
  layout?: string
  showDate?: boolean
  showCategory?: boolean
  showExcerpt?: boolean
  badgeOverride?: string
  emptyText?: string
  actionText?: string
}

export function EditorialSectionRenderer({
  items,
  layout = 'editorial-grid',
  showDate = true,
  showCategory = true,
  showExcerpt = true,
  badgeOverride,
  emptyText = 'Chưa có nội dung.',
  actionText = 'Xem chi tiết →',
}: EditorialSectionParams) {
  if (!items || items.length === 0) return <div className="professionalEmpty">{emptyText}</div>

  // ── MẪU 1: Editorial Grid (Phương án 3: 1 Thẻ Lớn Nổi Bật Trái + Danh Sách Hàng Ngang Phải) ──
  if (layout === 'editorial-grid') {
    const mainEntry = items[0] || null
    const subEntries = items.slice(1, 5)

    const renderImageProps = (entry: any) => {
      const fit = (entry.coverFit === 'fill' ? 'fill' : (entry.coverFit === 'contain' ? 'contain' : 'cover')) as React.CSSProperties['objectFit']
      const pos = entry.coverFit === 'cover-top' || entry.coverPosition === 'top'
        ? 'top center'
        : (entry.coverFit === 'cover-bottom' || entry.coverPosition === 'bottom'
          ? 'bottom center'
          : 'center center')
      return { fit, pos }
    }

    return (
      <div className="homeEditorialGrid editorialVariant3">
        {/* CỘT TRÁI: 1 THẺ LỚN NỔI BẬT (FEATURED HERO CARD) */}
        {mainEntry ? (
          (() => {
            const { fit, pos } = renderImageProps(mainEntry)
            const isExt = mainEntry.isExternal || (typeof mainEntry.href === 'string' && mainEntry.href.startsWith('http'))
            return (
              <a
                href={mainEntry.href}
                className="editorialHeroCard featured"
                key={mainEntry.id}
                target={isExt ? '_blank' : undefined}
                rel={isExt ? 'noopener noreferrer' : undefined}
              >
                <div
                  className="editorialHeroThumb"
                  style={{
                    background: mainEntry.coverFit === 'contain' ? '#eaf4fc' : undefined,
                  }}
                >
                  <img
                    src={mainEntry.cover}
                    alt={mainEntry.title}
                    className="editorialHeroImg"
                    loading="lazy"
                    style={{
                      objectFit: fit,
                      objectPosition: pos,
                    }}
                  />
                  {showCategory && (
                    <span className="editorialHeroBadge">
                      {badgeOverride || mainEntry.category || 'THÔNG BÁO'}
                    </span>
                  )}
                </div>
                <div className="editorialHeroBody">
                  {showDate && (
                    <div className="editorialHeroDate">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{mainEntry.date || 'Mới cập nhật'}</span>
                    </div>
                  )}
                  <h3 className="editorialHeroTitle">{mainEntry.title}</h3>
                  {showExcerpt && (
                    <p className="editorialHeroExcerpt">{mainEntry.excerpt || ''}</p>
                  )}
                  <div className="editorialHeroAction">
                    <span>{actionText}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </a>
            )
          })()
        ) : (
          <div className="homeEditorialEmptyCard" aria-hidden="true" />
        )}

        {/* CỘT PHẢI: DANH SÁCH CÁC HÀNG NGANG (SUB LIST ROWS) */}
        <div className="editorialRowList">
          {subEntries.length > 0 ? (
            subEntries.map((entry: any) => {
              const { fit, pos } = renderImageProps(entry)
              const isExt = entry.isExternal || (typeof entry.href === 'string' && entry.href.startsWith('http'))
              return (
                <a
                  href={entry.href}
                  className="editorialRowItem"
                  key={entry.id}
                  target={isExt ? '_blank' : undefined}
                  rel={isExt ? 'noopener noreferrer' : undefined}
                >
                  <div
                    className="editorialRowThumb"
                    style={{
                      background: entry.coverFit === 'contain' ? '#f4f8fb' : undefined,
                    }}
                  >
                    <img
                      src={entry.cover}
                      alt={entry.title}
                      className="editorialRowImg"
                      loading="lazy"
                      style={{
                        objectFit: fit,
                        objectPosition: pos,
                      }}
                    />
                  </div>
                  <div className="editorialRowContent">
                    <div className="editorialRowMeta">
                      {showCategory && (entry.category || badgeOverride) && (
                        <span className="editorialRowBadge">
                          {badgeOverride || entry.category}
                        </span>
                      )}
                      {showDate && (
                        <span className="editorialRowDate">
                          {entry.date || 'Mới cập nhật'}
                        </span>
                      )}
                    </div>
                    <h4 className="editorialRowTitle">{entry.title}</h4>
                    {showExcerpt && entry.excerpt && (
                      <p className="editorialRowExcerpt">{entry.excerpt}</p>
                    )}
                  </div>
                  <div className="editorialRowArrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </a>
              )
            })
          ) : (
            <div className="editorialRowEmpty">Chưa có thêm thông tin trong mục này.</div>
          )}
        </div>
      </div>
    )
  }

  // ── MẪU 2: Card Grid – 4 thẻ đều nhau ──
  if (layout === 'card-grid-4') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '18px' }}>
        {items.map((entry: any) => {
          const isExt = entry.isExternal || (typeof entry.href === 'string' && entry.href.startsWith('http'))
          return (
            <a
              key={entry.id}
              href={entry.href}
              target={isExt ? '_blank' : undefined}
              rel={isExt ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(10,45,75,0.05)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform .22s,box-shadow .22s',
                height: '100%',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(8,120,209,.12)'
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.transform = ''
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(10,45,75,0.05)'
              }}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={entry.cover} alt={entry.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                {showCategory && entry.category && (
                  <span style={{ position: 'absolute', bottom: 8, left: 10, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)', color: '#008046', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: '5px' }}>
                    {badgeOverride || entry.category}
                  </span>
                )}
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', padding: '13px 14px 14px' }}>
                {showDate && <span style={{ fontSize: '11px', color: '#64748b', marginBottom: 6 }}>{entry.date || 'Mới cập nhật'}</span>}
                <strong style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.42, color: '#0f172a', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', marginBottom: 6 }}>{entry.title}</strong>
                {showExcerpt && entry.excerpt && <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', margin: '0 0 8px' }}>{entry.excerpt}</p>}
                <span style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: '#0878d1' }}>Xem chi tiết →</span>
              </div>
            </a>
          )
        })}
      </div>
    )
  }

  // ── MẪU 3: List Rows – hàng ngang, ảnh nhỏ trái + nội dung phải ──
  if (layout === 'list-rows') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((entry: any) => {
          const isExt = entry.isExternal || (typeof entry.href === 'string' && entry.href.startsWith('http'))
          return (
            <a
              key={entry.id}
              href={entry.href}
              target={isExt ? '_blank' : undefined}
              rel={isExt ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                background: '#fff',
                border: '1px solid #e8edf4',
                borderRadius: '10px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                padding: '0 14px 0 0',
                transition: 'box-shadow .2s,border-color .2s',
              }}
              onMouseOver={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(8,120,209,.1)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#7fb9e5'
              }}
              onMouseOut={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                ;(e.currentTarget as HTMLElement).style.borderColor = '#e8edf4'
              }}
            >
              <div style={{ width: '110px', minWidth: '110px', height: '74px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={entry.cover} alt={entry.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 0' }}>
                {(showDate || showCategory) && (
                  <div style={{ display: 'flex', gap: 8, fontSize: '11px', color: '#64748b', alignItems: 'center' }}>
                    {showDate && <span>{entry.date || 'Mới cập nhật'}</span>}
                    {showDate && showCategory && entry.category && <span>·</span>}
                    {showCategory && entry.category && <span style={{ color: '#0878d1', fontWeight: 600 }}>{entry.category}</span>}
                  </div>
                )}
                <strong style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4, color: '#0f172a', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{entry.title}</strong>
                {showExcerpt && entry.excerpt && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>{entry.excerpt}</p>}
              </div>
              <span style={{ fontSize: '18px', color: '#bfcfdb', flexShrink: 0 }}>›</span>
            </a>
          )
        })}
      </div>
    )
  }

  // ── MẪU 4: Compact List – chỉ text, ngày + tiêu đề + chuyên mục ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((entry: any, idx: number) => {
        const isExt = entry.isExternal || (typeof entry.href === 'string' && entry.href.startsWith('http'))
        return (
          <a
            key={entry.id}
            href={entry.href}
            target={isExt ? '_blank' : undefined}
            rel={isExt ? 'noopener noreferrer' : undefined}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              padding: '10px 0',
              borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'color .18s',
            }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#0878d1'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = ''
            }}
          >
            {showDate && <span style={{ fontSize: '11.5px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '72px' }}>{entry.date || '—'}</span>}
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{entry.title}</span>
            {showCategory && entry.category && <span style={{ fontSize: '11px', fontWeight: 700, color: '#0878d1', whiteSpace: 'nowrap', flexShrink: 0 }}>{entry.category}</span>}
          </a>
        )
      })}
    </div>
  )
}
