'use client'

import React from 'react'

export type LegalDocItem = {
  id: string | number
  title: string
  number?: string
  issuer?: string
  date?: string
  excerpt?: string
  href: string
  fileUrl?: string
  category?: string
}

interface HomeLegalDisseminationProps {
  items: LegalDocItem[]
  eyebrow?: string
  title?: string
  description?: string
  seeAllUrl?: string
}

export function HomeLegalDissemination({
  items = [],
  eyebrow = 'PHỔ BIẾN VĂN BẢN PHÁP LUẬT',
  title = 'Tuyên truyền & Phổ biến chính sách pháp luật y tế',
  description = 'Hệ thống các Luật, Nghị định của Chính phủ, Thông tư của Bộ Y tế và văn bản chỉ đạo điều hành về công tác chăm sóc, bảo vệ sức khỏe nhân dân.',
  seeAllUrl = '/van-ban',
}: HomeLegalDisseminationProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="homeLegalDisseminationBlock">
      <div className="homeSectionHead" style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div
            style={{
              flexShrink: 0,
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1d4ed8',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.12)',
            }}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
            </svg>
          </div>
          <div>
            <span className="sectionKicker" style={{ color: '#1d4ed8', fontWeight: 800 }}>
              {eyebrow}
            </span>
            <h2 style={{ color: '#1e3a8a' }}>{title}</h2>
            {description && <p style={{ color: '#475569' }}>{description}</p>}
          </div>
        </div>
        <a href={seeAllUrl} className="homeSectionActionExternal">
          Xem tất cả văn bản pháp luật <span>→</span>
        </a>
      </div>

      {/* LƯỚI THẺ HỒ SƠ PHÁP LUẬT */}
      <div className="homeDocDossierGrid cols-3 legalDisseminationGrid">
        {items.slice(0, 6).map((doc) => (
          <div
            className="homeDocDossierCard legalDocCard"
            key={doc.id}
            style={{
              borderTop: '3.5px solid #1d4ed8',
            }}
          >
            <div className="homeDocCardHeader">
              <div className="homeDocCardIconWrap pdfFormat" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span className="homeDocFileFormatText">LUẬT</span>
              </div>

              <div className="homeDocCardMetaTop">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span
                    className="homeDocTypeBadge"
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      borderColor: '#bfdbfe',
                      fontWeight: 750,
                    }}
                  >
                    {doc.category || 'VĂN BẢN PHÁP LUẬT'}
                  </span>
                </div>
                {doc.number && (
                  <div className="homeDocNumberBox">
                    <span>Số:</span>
                    <span className="homeDocNumberCode">{doc.number}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="homeDocCardBody">
              <a href={doc.href} className="homeDocCardTitle" title={doc.title} style={{ color: '#0f2744' }}>
                {doc.title}
              </a>
              {doc.excerpt && <p className="homeDocCardSummary">{doc.excerpt}</p>}

              <div className="homeDocCardSpecs">
                {doc.issuer && (
                  <div className="homeDocSpecRow">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l8 8H4z" />
                    </svg>
                    <span>Cơ quan: <strong style={{ color: '#334155' }}>{doc.issuer}</strong></span>
                  </div>
                )}
                {doc.date && (
                  <div className="homeDocSpecRow">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Ban hành: <strong style={{ color: '#334155' }}>{doc.date}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div className="homeDocCardFooter">
              <a href={doc.href} className="homeDocActionView" style={{ color: '#1d4ed8' }}>
                <span>Xem toàn văn văn bản</span>
                <span aria-hidden="true">→</span>
              </a>
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="homeDocActionDownload"
                  title="Tải văn bản đính kèm"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Tải về</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
