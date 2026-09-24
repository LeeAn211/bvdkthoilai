'use client'

import React from 'react'

export type WarningItem = {
  id: string | number
  title: string
  excerpt?: string
  date?: string
  level?: 'urgent' | 'important' | 'normal' | string
  href: string
  cover?: string
  category?: string
}

interface HomeHealthWarningsProps {
  items: WarningItem[]
  eyebrow?: string
  title?: string
  description?: string
  seeAllUrl?: string
}

export function HomeHealthWarnings({
  items = [],
  eyebrow = 'CẢNH BÁO Y TẾ & CỘNG ĐỒNG',
  title = 'Cảnh báo khẩn cấp & Khuyến cáo sức khỏe',
  description = 'Thông tin cảnh báo dịch bệnh, an toàn thực phẩm, phòng chống lừa đảo và các khuyến cáo khẩn cấp từ Bệnh viện và Ngành Y tế.',
  seeAllUrl = '/goc-canh-bao',
}: HomeHealthWarningsProps) {
  if (!items || items.length === 0) return null

  // Tách bài đầu làm tiêu điểm lớn (nếu có)
  const heroItem = items[0]
  const subItems = items.slice(1, 5)

  return (
    <div className="homeHealthWarningsBlock">
      <div className="homeSectionHead" style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div
            style={{
              flexShrink: 0,
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.12)',
            }}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <span className="sectionKicker" style={{ color: '#dc2626', fontWeight: 800 }}>
              {eyebrow}
            </span>
            <h2 style={{ color: '#7f1d1d' }}>{title}</h2>
            {description && <p style={{ color: '#475569' }}>{description}</p>}
          </div>
        </div>
        <a
          href={seeAllUrl}
          className="homeSectionActionExternal"
          style={{
            color: '#dc2626',
            borderColor: '#fca5a5',
            background: '#fff5f5',
          }}
        >
          Xem tất cả cảnh báo <span>→</span>
        </a>
      </div>

      <div className="homeEditorialGrid editorialVariant3 healthWarningsGrid">
        {/* CỘT TRÁI: BÀI CẢNH BÁO LỚN NỔI BẬT */}
        {heroItem && (
          <a
            href={heroItem.href}
            className="editorialHeroCard featured warningHeroCard"
            style={{
              borderColor: '#fecaca',
              background: '#fff',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.08)',
            }}
          >
            <div className="editorialHeroThumb" style={{ position: 'relative' }}>
              <img
                src={heroItem.cover || '/default-content/notices.svg'}
                alt={heroItem.title}
                className="editorialHeroImg"
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
              <span
                className="editorialHeroBadge"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ⚠️ {heroItem.level === 'urgent' ? 'CẢNH BÁO KHẨN' : (heroItem.category || 'CẢNH BÁO')}
              </span>
            </div>
            <div className="editorialHeroBody">
              <div className="editorialHeroDate" style={{ color: '#dc2626' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{heroItem.date || 'Mới cập nhật'}</span>
              </div>
              <h3 className="editorialHeroTitle" style={{ color: '#991b1b' }}>
                {heroItem.title}
              </h3>
              {heroItem.excerpt && (
                <p className="editorialHeroExcerpt">{heroItem.excerpt}</p>
              )}
              <div className="editorialHeroAction" style={{ color: '#dc2626' }}>
                <span>Xem nội dung cảnh báo chi tiết →</span>
              </div>
            </div>
          </a>
        )}

        {/* CỘT PHẢI: CÁC TIN CẢNH BÁO HÀNG NGANG */}
        <div className="editorialRowList">
          {subItems.length > 0 ? (
            subItems.map((item) => (
              <a
                href={item.href}
                className="editorialRowItem warningRowItem"
                key={item.id}
                style={{
                  borderLeft: '3.5px solid #dc2626',
                }}
              >
                <div className="editorialRowThumb">
                  <img
                    src={item.cover || '/default-content/notices.svg'}
                    alt={item.title}
                    className="editorialRowImg"
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="editorialRowContent">
                  <div className="editorialRowMeta">
                    <span
                      className="editorialRowBadge"
                      style={{
                        background: item.level === 'urgent' ? '#fee2e2' : '#fef3c7',
                        color: item.level === 'urgent' ? '#dc2626' : '#d97706',
                        fontWeight: 700,
                      }}
                    >
                      {item.level === 'urgent' ? '🚨 Khẩn cấp' : (item.category || 'Cảnh báo')}
                    </span>
                    <span className="editorialRowDate">{item.date || 'Mới cập nhật'}</span>
                  </div>
                  <h4 className="editorialRowTitle" style={{ color: '#7f1d1d' }}>
                    {item.title}
                  </h4>
                  {item.excerpt && (
                    <p className="editorialRowExcerpt">{item.excerpt}</p>
                  )}
                </div>
                <div className="editorialRowArrow" aria-hidden="true" style={{ color: '#dc2626' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </a>
            ))
          ) : (
            <div className="editorialRowEmpty" style={{ borderColor: '#fee2e2', color: '#991b1b' }}>
              Hiện không có thêm cảnh báo dịch bệnh hoặc sự cố khẩn cấp.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
