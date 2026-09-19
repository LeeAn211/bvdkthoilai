'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export interface SpecialtyItem {
  id: string | number
  name: string
  slug: string
  icon?: string
  tagline?: string
  summary?: string
  coverUrl?: string
  department?: {
    id?: string | number
    name?: string
    slug?: string
    kind?: string
    location?: string
    phone?: string
  } | null
  kindGroup: 'clinical' | 'paraclinical' | 'other'
  highlightBadges?: string[]
}

interface Props {
  specialties: SpecialtyItem[]
  hospitalHotline?: string
  bookingUrl?: string
}

// Hàm render SVG biểu tượng y tế tương ứng chuyên ngành
function renderSpecialtyIcon(name: string, iconKey?: string) {
  const n = (name || '').toLowerCase()

  if (iconKey === 'emergency' || n.includes('cấp cứu') || n.includes('hồi sức')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 9v6" />
        <path d="M9 12h6" />
      </svg>
    )
  }

  if (iconKey === 'imaging' || n.includes('chẩn đoán hình ảnh') || n.includes('x-quang') || n.includes('siêu âm') || n.includes('ct')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  }

  if (iconKey === 'lab' || n.includes('kiểm soát') || n.includes('nhiễm khuẩn') || n.includes('xét nghiệm')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  if (iconKey === 'internal' || n.includes('nội') || n.includes('khám bệnh')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 3h15M6 3v10a6 6 0 0 0 12 0V3M18 19a3 3 0 0 0-6 0v2h6v-2Z" />
      </svg>
    )
  }

  if (n.includes('kế hoạch') || n.includes('nghiệp vụ') || n.includes('phòng')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="8" x2="16" y1="10" y2="10" />
        <line x1="8" x2="12" y1="14" y2="14" />
      </svg>
    )
  }

  // Mặc định chữ thập y tế
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 10.5h-4.5V6a1.5 1.5 0 0 0-3 0v4.5H7a1.5 1.5 0 0 0 0 3h4.5V18a1.5 1.5 0 0 0 3 0v-4.5H19a1.5 1.5 0 0 0 0-3z" />
    </svg>
  )
}

export function SpecialtiesDirectoryClient({
  specialties,
  hospitalHotline = '02923686115',
  bookingUrl = 'https://medpro.vn/trung-tam-y-te-khu-vuc-thoi-lai',
}: Props) {
  const [keyword, setKeyword] = useState('')

  // Lọc chuyên khoa theo từ khóa tìm kiếm
  const filteredSpecialties = useMemo(() => {
    const q = keyword.toLowerCase().trim()
    return specialties.filter(item => {
      if (q) {
        const textToSearch = `${item.name} ${item.tagline || ''} ${item.summary || ''} ${item.department?.name || ''}`.toLowerCase()
        if (!textToSearch.includes(q)) return false
      }
      return true
    })
  }, [specialties, keyword])

  return (
    <div className="specialtiesProWrap">
      {/* ── THANH TÌM KIẾM & TIỆN ÍCH NHANH CHUẨN HIỆN ĐẠI ── */}
      <div className="specialtiesFilterCard">
        <div className="specialtiesFilterTopRow" style={{ marginBottom: 0 }}>
          {/* Ô tìm kiếm thông minh */}
          <div className="specialtiesSearchBox">
            <svg className="specialtiesSearchIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="specialtiesSearchInput"
              placeholder="Tìm nhanh chuyên khoa, lĩnh vực điều trị, kỹ thuật y tế..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              aria-label="Tìm kiếm chuyên khoa"
            />
            {keyword && (
              <button
                type="button"
                className="specialtiesClearBtn"
                onClick={() => setKeyword('')}
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick CTA bên phải thanh lọc */}
          <div className="specialtiesFastActions">
            <a href={`tel:${hospitalHotline}`} className="specialtyFastCallBtn" title="Tổng đài tư vấn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Hotline: <strong>{hospitalHotline}</strong></span>
            </a>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="specialtyFastBookBtn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Đặt khám trực tuyến</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── THỐNG KÊ KẾT QUẢ TÌM KIẾM ── */}
      <div className="specialtiesStatusBar">
        <span>
          Hiển thị <strong>{filteredSpecialties.length}</strong> / {specialties.length} chuyên khoa y tế
          {keyword && ` phù hợp với từ khóa "${keyword}"`}
        </span>
        {keyword && (
          <button
            type="button"
            className="specialtiesResetBtn"
            onClick={() => setKeyword('')}
          >
            ↺ Đặt lại tìm kiếm
          </button>
        )}
      </div>

      {/* ── LƯỚI THẺ CHUYÊN KHOA Y TẾ THIẾT KẾ ĐẲNG CẤP (3D CARDS) ── */}
      {filteredSpecialties.length === 0 ? (
        <div className="specialtiesEmptyState">
          <div className="specialtiesEmptyIconBox">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>Không tìm thấy chuyên khoa phù hợp</h3>
          <p>Không có chuyên khoa nào khớp với từ khóa tìm kiếm của bạn. Hãy thử tra cứu với từ khóa khác hoặc xem toàn bộ danh mục.</p>
          <button
            type="button"
            className="specialtyClearSearchBtn"
            onClick={() => setKeyword('')}
          >
            Xem tất cả chuyên khoa
          </button>
        </div>
      ) : (
        <div className="specialtiesGridHospital">
          {filteredSpecialties.map((item, idx) => {
            const isClinical = item.kindGroup === 'clinical'
            const isParaclinical = item.kindGroup === 'paraclinical'
            const groupBadge = isClinical ? 'Lâm sàng' : isParaclinical ? 'Cận lâm sàng' : 'Nghiệp vụ'
            const deptName = item.department?.name || ''

            return (
              <Link
                key={item.id || idx}
                href={`/chuyen-khoa/${item.slug}`}
                className={`specialtyHospitalCard ${isClinical ? 'cardClinical' : isParaclinical ? 'cardParaclinical' : 'cardOther'}`}
              >
                {/* Header thẻ: Icon y khoa chuyên ngành + Badge phân loại */}
                <div className="cardTopHeader">
                  <div className="cardIconWrap">
                    {renderSpecialtyIcon(item.name, item.icon)}
                  </div>
                  <div className="cardBadgeGroup">
                    <span className="cardTypeBadge">{groupBadge}</span>
                  </div>
                </div>

                {/* Tên chuyên khoa & Tagline */}
                <h3 className="cardTitleText">{item.name}</h3>

                {item.tagline ? (
                  <div className="cardTaglineBox">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{item.tagline}</span>
                  </div>
                ) : (
                  <div className="cardTaglineBox fallback">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Khám chữa bệnh chuyên sâu • Kỹ thuật chuẩn</span>
                  </div>
                )}

                {/* Mô tả tóm tắt nghiệp vụ y tế */}
                <p className="cardSummaryText">
                  {item.summary || 'Cung cấp dịch vụ khám, chẩn đoán, điều trị chuyên khoa sâu với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại tại Bệnh viện Đa khoa Khu vực Thới Lai.'}
                </p>

                {/* Chân thẻ: Nút bấm Khám phá chi tiết & Mũi tên tương tác */}
                <div className="cardBottomFooter">
                  <span className="cardActionLabel">Xem chi tiết chuyên khoa</span>
                  <span className="cardActionArrowWrap" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── BANNER TRỢ GIÚP & HƯỚNG DẪN NGƯỜI BỆNH ── */}
      <div className="specialtiesSupportBanner">
        <div className="supportBannerContent">
          <div className="supportBannerIcon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <h4>Cần hỗ trợ tư vấn chọn Chuyên khoa phù hợp?</h4>
            <p>Liên hệ ngay Tổng đài Chăm sóc khách hàng hoặc đến Bàn tiếp đón tại Bệnh viện Đa khoa Khu vực Thới Lai để được hướng dẫn khám đúng chuyên khoa nhanh chóng nhất.</p>
          </div>
        </div>
        <div className="supportBannerActions">
          <a href={`tel:${hospitalHotline}`} className="supportHotlineBtn">
            Gọi Hotline: {hospitalHotline}
          </a>
          <Link href="/lien-he" className="supportContactBtn">
            Chỉ đường & Liên hệ
          </Link>
        </div>
      </div>
    </div>
  )
}
