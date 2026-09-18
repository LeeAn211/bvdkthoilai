'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface VaccineItem {
  id: string
  name: string
  code?: string
  slug?: string
  summary?: string
  manufacturer?: string
  origin?: string
  prevents?: string
  targetGroup?: string
  ageGroup?: string
  availability?: 'available' | 'coming' | 'unavailable'
  price?: number
  decisionNo?: string
  note?: string
  registrationUrl?: string
  coverUrl?: string
  href: string
}

interface ScheduleItem {
  id: string
  title: string
  summary?: string
  scheduleKind?: 'official' | 'adjustment' | 'announcement'
  target?: string
  date?: string
  endDate?: string
  startTime?: string
  endTime?: string
  location?: string
  registrationUrl?: string
  note?: string
  coverUrl?: string
  href: string
}

interface VaccinationViewProps {
  vaccines: VaccineItem[]
  schedules: ScheduleItem[]
  medproUrl: string
  hotline?: string
  showSearch?: boolean
  showAgeFilter?: boolean
  showPrice?: boolean
  showBookButton?: boolean
  showWorkflowSection?: boolean
  showSupportBanner?: boolean
  bookButtonText?: string
  bookButtonUrl?: string
}

const AGE_FILTER_OPTIONS = [
  { label: 'Tất cả lứa tuổi', value: 'all', matches: [] },
  { label: 'Trẻ sơ sinh (< 1 tuổi)', value: 'infant', matches: ['infant', 'tháng', 'sơ sinh', 'tuần', '< 1'] },
  { label: 'Trẻ em (1 - 15 tuổi)', value: 'child', matches: ['child', 'trẻ em', 'tuổi', 'trẻ'] },
  { label: 'Phụ nữ mang thai', value: 'pregnancy', matches: ['pregnancy', 'mang thai', 'phụ nữ', 'thai kỳ'] },
  { label: 'Người lớn & Cao tuổi', value: 'adult', matches: ['adult', 'người lớn', 'mọi lứa tuổi', 'cao tuổi', 'bệnh nền', 'trưởng thành'] },
]

export function VaccinationView({
  vaccines,
  schedules,
  medproUrl,
  hotline = '0292 3861 234',
  showSearch = true,
  showAgeFilter = true,
  showPrice = true,
  showBookButton = true,
  showWorkflowSection = true,
  showSupportBanner = true,
  bookButtonText = 'Đăng ký tiêm',
  bookButtonUrl,
}: VaccinationViewProps) {
  const [activeTab, setActiveTab] = useState<'vaccines' | 'schedules'>('vaccines')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAge, setSelectedAge] = useState('all')

  // Lọc danh mục vắc xin theo từ khóa & độ tuổi
  const filteredVaccines = useMemo(() => {
    return vaccines.filter((item) => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.prevents && item.prevents.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.origin && item.origin.toLowerCase().includes(q)) ||
        (item.manufacturer && item.manufacturer.toLowerCase().includes(q))

      if (!matchSearch) return false

      if (selectedAge === 'all') return true
      const opt = AGE_FILTER_OPTIONS.find((o) => o.value === selectedAge)
      if (!opt) return true

      // 1. Kiểm tra trường targetGroup chọn từ Admin CMS
      if (item.targetGroup) {
        if (item.targetGroup === selectedAge) return true
        if (item.targetGroup === 'all') return true
      }

      // 2. Fallback kiểm tra từ khóa trong ageGroup / prevents
      const ageText = `${item.ageGroup || ''} ${item.prevents || ''}`.toLowerCase()
      return opt.matches.some((keyword) => ageText.includes(keyword))
    })
  }, [vaccines, searchQuery, selectedAge])

  // Lọc lịch tiêm chủng
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (item.target && item.target.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q))
      )
    })
  }, [schedules, searchQuery])

  const formatPrice = (price?: number) => {
    if (typeof price === 'number') {
      if (price === 0) return 'Miễn phí'
      return `${new Intl.NumberFormat('vi-VN').format(price)} đ`
    }
    return 'Liên hệ'
  }

  return (
    <div className="vaccinePageWrapper">
      {/* 1. THANH CHUYỂN ĐỔI TAB CHÍNH */}
      <div className="vaccineTabNav" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'vaccines'}
          className={`vaccineTabBtn ${activeTab === 'vaccines' ? 'active' : ''}`}
          onClick={() => setActiveTab('vaccines')}
        >
          <span>💉 Danh mục & Bảng giá Vắc xin</span>
          <span className="vaccineTabCount">{vaccines.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'schedules'}
          className={`vaccineTabBtn ${activeTab === 'schedules' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedules')}
        >
          <span>📅 Lịch tiêm & Đợt tiêm chủng</span>
          <span className="vaccineTabCount">{schedules.length}</span>
        </button>
      </div>

      {/* 2. THANH CÔNG CỤ TÌM KIẾM & BỘ LỌC */}
      {(showSearch || showAgeFilter) && (
        <div className="vaccineFilterBar">
          {showSearch && (
            <div className="vaccineSearchRow">
              <div className="vaccineSearchInputWrap">
                <span className="vaccineSearchIcon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="text"
                  className="vaccineSearchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'vaccines' ? 'Tìm theo tên vắc xin, bệnh phòng ngừa, xuất xứ...' : 'Tìm kiếm theo tiêu đề lịch tiêm, đối tượng, địa điểm...'}
                />
              </div>
              <div className="vaccineCountBadge">
                Hiển thị <strong>{activeTab === 'vaccines' ? filteredVaccines.length : filteredSchedules.length}</strong> / {activeTab === 'vaccines' ? vaccines.length : schedules.length} kết quả
              </div>
            </div>
          )}

          {showAgeFilter && activeTab === 'vaccines' && (
            <div className="vaccineAgeFilters">
              <span className="vaccineAgeFilterLabel">Đối tượng tiêm:</span>
              {AGE_FILTER_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`vaccineAgePill ${selectedAge === opt.value ? 'active' : ''}`}
                  onClick={() => setSelectedAge(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. NỘI DUNG TAB 1: DANH MỤC & GIÁ VẮC XIN */}
      {activeTab === 'vaccines' && (
        <>
          {filteredVaccines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#334155' }}>Không tìm thấy vắc xin phù hợp</p>
              <span style={{ fontSize: '13.5px' }}>Quý khách vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bộ lọc đối tượng.</span>
            </div>
          ) : (
            <div className="vaccineGrid">
              {filteredVaccines.map((v) => {
                const isAvail = v.availability !== 'unavailable' && v.availability !== 'coming'
                const isComing = v.availability === 'coming'

                return (
                  <div className="vaccineCard" key={v.id}>
                    <div className="vaccineCardHeader">
                      <div className="vaccineCardBadgeWrap">
                        <span className={`vaccineStatusBadge ${isAvail ? 'vaccineStatusAvailable' : isComing ? 'vaccineStatusComing' : 'vaccineStatusUnavailable'}`}>
                          {isAvail ? '● Đang có vắc xin' : isComing ? '⏱ Sắp có vắc xin' : '✕ Tạm hết'}
                        </span>
                        {v.origin && <span className="vaccineOriginBadge">Xuất xứ: {v.origin}</span>}
                      </div>
                      {v.code && <span className="vaccineCardCode">{v.code}</span>}
                    </div>

                    <div className="vaccineCardBody">
                      <h3 className="vaccineCardTitle">
                        <Link href={v.href}>{v.name}</Link>
                      </h3>

                      {v.summary && <p className="vaccineCardSummary">{v.summary}</p>}

                      <div className="vaccineSpecList">
                        {v.prevents && (
                          <div className="vaccineSpecRow">
                            <span className="vaccineSpecKey">Phòng bệnh:</span>
                            <span className="vaccineSpecVal preventVal">{v.prevents}</span>
                          </div>
                        )}
                        {v.ageGroup && (
                          <div className="vaccineSpecRow">
                            <span className="vaccineSpecKey">Đối tượng:</span>
                            <span className="vaccineSpecVal">{v.ageGroup}</span>
                          </div>
                        )}
                        {v.manufacturer && (
                          <div className="vaccineSpecRow">
                            <span className="vaccineSpecKey">Hãng SX:</span>
                            <span className="vaccineSpecVal">{v.manufacturer}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="vaccineCardFooter">
                      {showPrice ? (
                        <div className="vaccinePriceWrap">
                          <span className="vaccinePriceLabel">Giá tiêm niêm yết</span>
                          <span className={`vaccinePriceValue ${v.price === 0 ? 'free' : ''}`}>{formatPrice(v.price)}</span>
                        </div>
                      ) : <div />}

                      <div className="vaccineCardActions">
                        <Link href={v.href} className="vaccineDetailBtn">
                          Chi tiết
                        </Link>
                        {showBookButton && (
                          <a
                            href={v.registrationUrl || bookButtonUrl || medproUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vaccineBookBtn"
                          >
                            {bookButtonText || 'Đăng ký tiêm'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* 4. NỘI DUNG TAB 2: LỊCH TIÊM CHỦNG & THÔNG BÁO */}
      {activeTab === 'schedules' && (
        <>
          {filteredSchedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#334155' }}>Không có lịch tiêm phù hợp với từ khóa</p>
              <span style={{ fontSize: '13.5px' }}>Quý khách vui lòng thử tìm kiếm lại hoặc xem toàn bộ lịch tiêm.</span>
            </div>
          ) : (
            <div className="scheduleListWrap">
              {filteredSchedules.map((s) => {
                const isOfficial = s.scheduleKind === 'official'

                return (
                  <div className="scheduleCardItem" key={s.id}>
                    <div className="scheduleItemHeader">
                      <div className="scheduleBadgeWrap">
                        <span className={`scheduleKindBadge ${isOfficial ? 'scheduleKindOfficial' : 'scheduleKindAnnouncement'}`}>
                          {isOfficial ? 'Lịch tiêm thường quy' : 'Thông báo tiêm chủng'}
                        </span>
                      </div>
                      <Link href={s.href} className="vaccineDetailBtn" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
                        Xem thông báo chi tiết →
                      </Link>
                    </div>

                    <h3 className="scheduleItemTitle">{s.title}</h3>
                    {s.summary && <p className="scheduleItemSummary">{s.summary}</p>}

                    <div className="scheduleMetaGrid">
                      {s.date && (
                        <div className="scheduleMetaItem">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>Thời gian: <strong>{s.date} {s.endDate ? `– ${s.endDate}` : ''}</strong></span>
                        </div>
                      )}

                      {(s.startTime || s.endTime) && (
                        <div className="scheduleMetaItem">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>Khung giờ: <strong>{s.startTime || '07h00'} {s.endTime ? `– ${s.endTime}` : ''}</strong></span>
                        </div>
                      )}

                      {s.target && (
                        <div className="scheduleMetaItem">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span>Đối tượng: <strong>{s.target}</strong></span>
                        </div>
                      )}

                      {s.location && (
                        <div className="scheduleMetaItem">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>Địa điểm: <strong>{s.location}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* 5. KHỐI QUY TRÌNH TIÊM CHỦNG AN TOÀN 4 BƯỚC */}
      {showWorkflowSection && (
        <section className="vaccineWorkflowSection">
          <div className="workflowHeader">
            <span className="workflowEyebrow">QUY CHUẨN AN TOÀN BỘ Y TẾ</span>
            <h2 className="workflowTitle">Quy trình 4 bước Tiêm chủng An toàn tại Bệnh viện Đa khoa Khu vực Thới Lai</h2>
            <p className="workflowDesc">
              Mọi khách hàng và bệnh nhi đều được khám sàng lọc kỹ lưỡng, tư vấn phác đồ tiêm tối ưu và theo dõi sau tiêm bởi đội ngũ bác sĩ chuyên khoa.
            </p>
          </div>

          <div className="workflowGrid">
            <div className="workflowStepCard">
              <span className="workflowStepNum">1</span>
              <h4 className="workflowStepTitle">Tiếp đón & Đăng ký</h4>
              <p className="workflowStepDesc">
                Khách hàng làm thủ tục tại quầy tiếp đón tiêm chủng, kiểm tra sổ tiêm và cập nhật thông tin tiêm chủng quốc gia.
              </p>
            </div>

            <div className="workflowStepCard">
              <span className="workflowStepNum">2</span>
              <h4 className="workflowStepTitle">Khám sàng lọc trước tiêm</h4>
              <p className="workflowStepDesc">
                Bác sĩ chuyên khoa tiến hành đo sinh hiệu, đánh giá thể trạng, kiểm tra tiền sử dị ứng và tư vấn phác đồ vắc xin phù hợp.
              </p>
            </div>

            <div className="workflowStepCard">
              <span className="workflowStepNum">3</span>
              <h4 className="workflowStepTitle">Thực hiện tiêm chủng</h4>
              <p className="workflowStepDesc">
                Điều dưỡng đối chiếu thông tin vắc xin (hạn sử dụng, liều dùng, xuất xứ) trước sự chứng kiến của người tiêm và tiêm đúng kỹ thuật.
              </p>
            </div>

            <div className="workflowStepCard">
              <span className="workflowStepNum">4</span>
              <h4 className="workflowStepTitle">Theo dõi & Hướng dẫn</h4>
              <p className="workflowStepDesc">
                Khách hàng được theo dõi phản ứng sau tiêm tại chỗ tối thiểu 30 phút, kiểm tra lại sức khỏe và hướng dẫn chăm sóc tại nhà.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. BANNER LIÊN HỆ ĐẶT LỊCH & TƯ VẤN */}
      {showSupportBanner && (
        <div className="vaccineSupportBanner">
          <div className="vaccineSupportContent">
            <h3>Tư vấn phác đồ vắc xin & Đặt lịch tiêm chủng</h3>
            <p>
              Quý khách có nhu cầu tiêm ngừa cho trẻ hoặc người lớn, vui lòng liên hệ trực tiếp phòng tiêm chủng Bệnh viện Đa khoa Khu vực Thới Lai để được tư vấn tận tâm.
            </p>
          </div>
          <div className="vaccineSupportActions">
            <a href={bookButtonUrl || medproUrl} target="_blank" rel="noopener noreferrer" className="vaccineSupportBtn">
              <span>📅 {bookButtonText ? `${bookButtonText} trực tuyến` : 'Đặt hẹn trực tuyến'}</span>
            </a>
            <a href={`tel:${hotline.replace(/\s+/g, '')}`} className="vaccineHotlineBtn">
              <span>📞 Hotline: {hotline}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
