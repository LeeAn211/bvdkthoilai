'use client'

import { FormEvent, useState } from 'react'
import styles from './FeedbackLookup.module.css'

interface LookupResult {
  code: string
  name?: string
  subject: string
  message?: string
  status: 'new' | 'assigned' | 'processing' | 'waiting' | 'resolved' | 'closed'
  publicResponse?: string
  resolvedAt?: string
  createdAt?: string
  updatedAt?: string
  timeline?: Array<{
    action: string
    note: string
    createdAt: string
  }>
}

interface PhoneListItem {
  code: string
  name: string
  subject: string
  message: string
  status: 'new' | 'assigned' | 'processing' | 'waiting' | 'resolved' | 'closed'
  publicResponse: string
  resolvedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  new: { label: 'Mới tiếp nhận', badgeClass: styles.statusBadgeNew },
  assigned: { label: 'Đang xử lý', badgeClass: styles.statusBadgeProcessing },
  processing: { label: 'Đang xử lý & Xác minh', badgeClass: styles.statusBadgeProcessing },
  waiting: { label: 'Chờ phản hồi bổ sung', badgeClass: styles.statusBadgeProcessing },
  resolved: { label: 'Đã giải quyết', badgeClass: styles.statusBadgeResolved },
  closed: { label: 'Đã giải quyết', badgeClass: styles.statusBadgeResolved },
}

export function FeedbackLookup({
  initialCode = '',
  hotline = '02923 689 115',
  zaloUrl = 'https://zalo.me/02923689115',
  facebookUrl = 'https://www.facebook.com/bvdkthoilai',
}: {
  initialCode?: string
  hotline?: string
  zaloUrl?: string
  facebookUrl?: string
}) {
  const [mode, setMode] = useState<'code' | 'phone'>(initialCode ? 'code' : 'code')
  const [code, setCode] = useState(initialCode)
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<LookupResult | null>(null)
  const [phoneList, setPhoneList] = useState<PhoneListItem[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Tra cứu theo Mã hồ sơ + Số điện thoại
  async function searchByCode(searchCode: string, searchPhone: string) {
    if (!searchCode.trim() || !searchPhone.trim()) {
      setError('Vui lòng điền đầy đủ cả Mã tra cứu và Số điện thoại.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    setPhoneList(null)

    try {
      const res = await fetch(
        `/api/feedback?code=${encodeURIComponent(searchCode.trim())}&phone=${encodeURIComponent(searchPhone.trim())}`,
        { cache: 'no-store' }
      )
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Không tìm thấy hồ sơ phản ánh phù hợp với thông tin đã nhập.')
      }
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  // Tra cứu khi QUÊN MÃ: chỉ cần Số điện thoại
  async function searchByPhone(searchPhone: string) {
    if (!searchPhone.trim()) {
      setError('Vui lòng nhập Số điện thoại đã sử dụng khi gửi phản ánh.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    setPhoneList(null)

    try {
      const res = await fetch(
        `/api/feedback?phone=${encodeURIComponent(searchPhone.trim())}`,
        { cache: 'no-store' }
      )
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        if (data.items && data.items.length > 0) {
          setPhoneList(data.items)
        } else {
          setError(`Không tìm thấy hồ sơ phản ánh nào thuộc số điện thoại ${searchPhone}.`)
        }
      } else {
        setError(data.error || 'Không tìm thấy hồ sơ nào từ số điện thoại này.')
      }
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (mode === 'code') {
      searchByCode(code, phone)
    } else {
      searchByPhone(phone)
    }
  }

  // Bấm vào 1 hồ sơ từ danh sách tìm theo SĐT để xem chi tiết
  function selectItemFromList(item: PhoneListItem) {
    searchByCode(item.code, phone)
  }

  const currentStatus = result ? statusConfig[result.status] || { label: result.status, badgeClass: styles.statusBadgeNew } : null

  return (
    <div className={styles.lookupContainer}>
      <div className={styles.searchCard}>
        {/* Thanh chuyển đổi chế độ tra cứu */}
        <div className={styles.modeTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'code'}
            className={`${styles.modeTabBtn} ${mode === 'code' ? styles.modeTabBtnActive : ''}`}
            onClick={() => { setMode('code'); setError(''); setResult(null); setPhoneList(null) }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" />
            </svg>
            <span>Tra cứu theo Mã tiếp nhận</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'phone'}
            className={`${styles.modeTabBtn} ${mode === 'phone' ? styles.modeTabBtnActive : ''}`}
            onClick={() => { setMode('phone'); setError(''); setResult(null); setPhoneList(null) }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Quên mã tra cứu? Tìm theo Số điện thoại</span>
          </button>
        </div>

        <form className={styles.searchForm} onSubmit={onSubmit}>
          <div className={styles.inputGrid}>
            {mode === 'code' && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="feedback-code">
                  Mã tra cứu hồ sơ <span className={styles.requiredMark}>*</span>
                </label>
                <input
                  id="feedback-code"
                  className={styles.fieldInput}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: GY-2026-D7E1B299"
                  required={mode === 'code'}
                />
                <p className={styles.fieldHint}>Mã tiếp nhận được hệ thống cấp khi gửi phản ánh thành công</p>
              </div>
            )}

            <div className={styles.fieldGroup} style={mode === 'phone' ? { gridColumn: 'span 2' } : {}}>
              <label className={styles.fieldLabel} htmlFor="feedback-phone">
                Số điện thoại người gửi <span className={styles.requiredMark}>*</span>
              </label>
              <input
                id="feedback-phone"
                type="tel"
                className={styles.fieldInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại đã sử dụng khi gửi"
                required
              />
              <p className={styles.fieldHint}>
                {mode === 'phone'
                  ? 'Hệ thống sẽ tự động tra cứu tất cả các hồ sơ phản ánh đã gửi từ số điện thoại này'
                  : 'Dùng để xác minh tính chính danh và bảo mật thông tin'}
              </p>
            </div>
          </div>

          <button type="submit" className={styles.searchBtn} disabled={loading}>
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span>Đang kiểm tra hồ sơ…</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span>{mode === 'code' ? 'Tra cứu kết quả' : 'Tìm tất cả hồ sơ của tôi'}</span>
              </>
            )}
          </button>

          {error && (
            <div className={styles.errorMessage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* DANH SÁCH HỒ SƠ TÌM THẤY THEO SỐ ĐIỆN THOẠI */}
      {phoneList && !result && (
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <h3 className={styles.listTitle}>
              Hồ sơ phản ánh tìm thấy theo số {phone}
            </h3>
            <span className={styles.listCount}>{phoneList.length} hồ sơ</span>
          </div>

          {phoneList.map((item, idx) => {
            const itemStatus = statusConfig[item.status] || { label: item.status, badgeClass: styles.statusBadgeNew }
            return (
              <div
                key={idx}
                className={styles.itemCard}
                onClick={() => selectItemFromList(item)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.itemCardHeader}>
                  <span className={styles.itemCode}>{item.code}</span>
                  <div className={`${styles.statusBadge} ${itemStatus.badgeClass}`}>
                    <span className={styles.statusDot} />
                    <span>{itemStatus.label}</span>
                  </div>
                </div>

                <h4 className={styles.itemSubject}>{item.subject}</h4>
                {item.message && <p className={styles.itemMessage}>{item.message}</p>}

                <div className={styles.itemFooter}>
                  <span className={styles.itemDate}>
                    {item.createdAt ? `Gửi ngày: ${new Date(item.createdAt).toLocaleDateString('vi-VN')}` : ''}
                  </span>
                  <span className={styles.viewDetailBtn}>
                    Xem câu trả lời của Bệnh viện →
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CHI TIẾT KẾT QUẢ TRA CỨU */}
      {result && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.resultHeaderLeft}>
              {phoneList && (
                <button
                  type="button"
                  className={styles.backToListBtn}
                  onClick={() => setResult(null)}
                >
                  ← Quay lại danh sách hồ sơ
                </button>
              )}
              <span className={styles.resultEyebrow}>Hồ sơ phản ánh tiếp nhận</span>
              <span className={styles.resultCode}>{result.code}</span>
            </div>
            {currentStatus && (
              <div className={`${styles.statusBadge} ${currentStatus.badgeClass}`}>
                <span className={styles.statusDot} />
                <span>{currentStatus.label}</span>
              </div>
            )}
          </div>

          <div className={styles.resultBody}>
            {/* Nội dung phản ánh của người bệnh */}
            <div className={styles.sectionBlock}>
              <span className={styles.sectionLabel}>Thông tin phản ánh</span>
              <div className={styles.patientQuestionBox}>
                <h3 className={styles.questionTitle}>{result.subject}</h3>
                {result.message && <p className={styles.questionMessage}>{result.message}</p>}
                <div className={styles.questionMeta}>
                  <span>Người gửi: <b>{result.name || 'Người bệnh'}</b></span>
                  {result.createdAt && (
                    <span>Ngày gửi: {new Date(result.createdAt).toLocaleString('vi-VN')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Câu trả lời chính thức từ Bệnh viện */}
            <div className={styles.sectionBlock}>
              <span className={styles.sectionLabel}>Kết quả xử lý từ Bệnh viện</span>
              {result.publicResponse ? (
                <div className={styles.responseCard}>
                  <div className={styles.responseHeader}>
                    <div className={styles.responseIcon}>✓</div>
                    <h4 className={styles.responseTitle}>Phản hồi chính thức từ Bệnh viện Đa khoa Khu vực Thới Lai</h4>
                  </div>
                  <p className={styles.responseContent}>{result.publicResponse}</p>
                </div>
              ) : (
                <div className={styles.responsePendingCard}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>
                    Hồ sơ đang được bộ phận chuyên môn xác minh và trình Ban Giám đốc xem xét giải quyết. Câu trả lời chính thức sẽ được cập nhật tại đây ngay sau khi có kết luận.
                  </span>
                </div>
              )}
            </div>

            {/* Dòng thời gian tiến độ */}
            {result.timeline && result.timeline.length > 0 && (
              <div className={styles.sectionBlock}>
                <span className={styles.sectionLabel}>Tiến độ giải quyết hồ sơ</span>
                <div className={styles.timelineWrapper}>
                  <ol className={styles.timelineList}>
                    {result.timeline.map((item, index) => {
                      const isLast = index === (result.timeline?.length ?? 1) - 1
                      return (
                        <li key={index} className={styles.timelineItem}>
                          <div className={`${styles.timelineMarker} ${isLast ? styles.timelineMarkerActive : ''}`} />
                          <div className={styles.timelineTime}>
                            {new Date(item.createdAt).toLocaleString('vi-VN')}
                          </div>
                          <div className={styles.timelineNote}>{item.note}</div>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KHỐI KÊNH HỖ TRỢ TRỰC TIẾP: HOTLINE, ZALO, FACEBOOK */}
      <div className={styles.supportSection}>
        <div className={styles.supportTitleGroup}>
          <span className={styles.supportIcon}>📞</span>
          <h4 className={styles.supportHeading}>Bạn cần hỗ trợ cấp lại mã hoặc giải đáp trực tiếp?</h4>
        </div>
        <p className={styles.supportDesc}>
          Nếu bạn không tìm thấy hồ sơ hoặc cần cung cấp thêm thông tin khẩn cấp cho Ban Giám đốc, vui lòng liên hệ qua các kênh chính thức của Bệnh viện Đa khoa Khu vực Thới Lai:
        </p>

        <div className={styles.supportChannels}>
          {/* Hotline */}
          <a
            href={`tel:${hotline.replace(/\s+/g, '')}`}
            className={`${styles.channelCard} ${styles.channelHotline}`}
            title="Gọi đường dây nóng hỗ trợ"
          >
            <div className={styles.channelIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>Tổng đài CSKH</span>
              <span className={styles.channelValue}>{hotline}</span>
            </div>
          </a>

          {/* Zalo */}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.channelCard} ${styles.channelZalo}`}
            title="Nhắn tin hỗ trợ qua Zalo Official Account"
          >
            <div className={styles.channelIcon}>Z</div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>Zalo Bệnh viện</span>
              <span className={styles.channelValue}>Nhắn tin tư vấn</span>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.channelCard} ${styles.channelFacebook}`}
            title="Liên hệ qua Trang Fanpage Facebook chính thức"
          >
            <div className={styles.channelIcon}>f</div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>Facebook Fanpage</span>
              <span className={styles.channelValue}>Trang chính thức</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
