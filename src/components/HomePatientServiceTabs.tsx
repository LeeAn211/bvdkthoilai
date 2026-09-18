'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'

export type PortalTabSource = 'packages' | 'flow' | 'inpatient' | 'map' | 'portal-cards' | 'manual'

export type ServiceCardItem = {
  id: string | number
  title: string
  desc?: string
  badge?: string
  badgeType?: string
  icon?: string
  priceText?: string
  targetUser?: string
  features?: string[]
  href: string
  buttonText?: string
}

export type PortalServiceTab = {
  id?: string
  label: string
  source: PortalTabSource
  limit?: number
  customBadge?: string
  seeMoreUrl?: string
  items?: ServiceCardItem[]
}

export function HomePatientServiceTabs({
  tabs: configuredTabs,
}: {
  tabs: PortalServiceTab[]
}) {
  // Lọc chỉ giữ các tab thực sự có items (> 0)
  const activeTabs = useMemo(() => {
    return (configuredTabs || [])
      .filter((tab) => tab && tab.label && tab.items && tab.items.length > 0)
  }, [configuredTabs])

  const [activeTabLabel, setActiveTabLabel] = useState<string>(activeTabs[0]?.label || '')

  useEffect(() => {
    if (!activeTabs.some((t) => t.label === activeTabLabel)) {
      setActiveTabLabel(activeTabs[0]?.label || '')
    }
  }, [activeTabs, activeTabLabel])

  if (!activeTabs || activeTabs.length === 0) {
    return null
  }

  const currentTab = activeTabs.find((t) => t.label === activeTabLabel) || activeTabs[0]
  const currentItems = currentTab?.items || []

  // Phân loại render: nếu là dạng gói khám (packages) thì render card có Giá & Danh mục kỹ thuật
  const isPackages = currentTab?.source === 'packages'

  return (
    <div className="homePatientServicesWrap">
      {/* Thanh chuyển Tab: Tự động ẩn nếu chỉ có 1 tab */}
      {activeTabs.length > 1 && (
        <div className="portalTabs newsTabButtons" role="tablist" aria-label="Các dịch vụ người bệnh">
          {activeTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={activeTabLabel === tab.label}
              className={activeTabLabel === tab.label ? 'active' : ''}
              onClick={() => setActiveTabLabel(tab.label)}
            >
              {tab.label}
              {tab.customBadge && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 700,
                  }}
                >
                  {tab.customBadge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lưới nội dung hiển thị */}
      <div
        role="tabpanel"
        style={{
          marginTop: activeTabs.length > 1 ? 24 : 0,
          display: 'grid',
          gridTemplateColumns: isPackages
            ? 'repeat(auto-fit, minmax(320px, 1fr))'
            : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {currentItems.map((item, idx) => {
          if (isPackages) {
            // Card Gói khám chuyên nghiệp (Hiển thị giá, đối tượng, tính năng)
            return (
              <div
                key={item.id || idx}
                style={{
                  background: '#ffffff',
                  borderRadius: 18,
                  border: '1px solid #e2e8f0',
                  padding: '28px 24px',
                  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 18,
                      right: 20,
                      background: '#e0f2fe',
                      color: '#0369a1',
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                <div style={{ marginBottom: 14 }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 6px',
                      paddingRight: item.badge ? 85 : 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.targetUser && (
                    <p style={{ fontSize: 12.5, color: '#0284c7', fontWeight: 600, margin: 0 }}>
                      👥 {item.targetUser}
                    </p>
                  )}
                </div>

                {item.priceText && (
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '12px 16px',
                      borderRadius: 12,
                      marginBottom: 16,
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ fontSize: 11.5, color: '#64748b', display: 'block' }}>
                      Chi phí trọn gói
                    </span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#0284c7' }}>
                      {item.priceText}
                    </span>
                  </div>
                )}

                {item.desc && (
                  <p
                    style={{
                      fontSize: 13,
                      color: '#475569',
                      lineHeight: 1.55,
                      margin: '0 0 16px',
                    }}
                  >
                    {item.desc}
                  </p>
                )}

                {item.features && item.features.length > 0 && (
                  <div
                    style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 14,
                      marginBottom: 20,
                      flexGrow: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#0f172a',
                        display: 'block',
                        marginBottom: 8,
                      }}
                    >
                      Danh mục kỹ thuật:
                    </span>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: 12.5,
                        color: '#334155',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.features.slice(0, 5).map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          style={{
                            display: 'flex',
                            gap: 6,
                            marginBottom: 4,
                            alignItems: 'baseline',
                          }}
                        >
                          <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                          <span>{feat.replace(/^[•\-✓]\s*/, '')}</span>
                        </li>
                      ))}
                      {item.features.length > 5 && (
                        <li style={{ color: '#64748b', fontStyle: 'italic', fontSize: 12, marginTop: 4 }}>
                          + và {item.features.length - 5} kỹ thuật chuyên sâu khác...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <Link
                  href={item.href || '/goi-kham'}
                  style={{
                    marginTop: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px 16px',
                    background: '#0754a8',
                    color: '#ffffff',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 13.5,
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {item.buttonText || 'Đăng ký / Xem chi tiết →'}
                </Link>
              </div>
            )
          }

          // Card Tiện ích dịch vụ chung (Quy trình, Nội trú, Sơ đồ, Thẻ Cổng người bệnh)
          return (
            <Link
              key={item.id || idx}
              href={item.href}
              className="patientCareCard"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: 16,
                padding: '24px 20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#f0f7fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {item.icon || '🩺'}
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: 12,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <h3
                style={{
                  fontSize: 16.5,
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: '0 0 8px',
                  lineHeight: 1.35,
                }}
              >
                {item.title}
              </h3>

              {item.desc && (
                <p
                  style={{
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.55,
                    margin: '0 0 16px',
                    flexGrow: 1,
                  }}
                >
                  {item.desc}
                </p>
              )}

              <div style={{ marginTop: 'auto' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0754a8',
                  }}
                >
                  {item.buttonText || 'Xem hướng dẫn →'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
