import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS, getGlobal } from '@/lib/payload'
import styles from './bang-gia.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata: Metadata = {
  title: 'Bảng giá dịch vụ',
  description: 'Tra cứu giá BHYT và giá dịch vụ công khai tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

type Props = { searchParams: Promise<{ q?: string; page?: string }> }

const money = (value: any) =>
  typeof value === 'number'
    ? `${new Intl.NumberFormat('vi-VN').format(value)} đ`
    : '-'

const formatDate = (dateVal: any) => {
  if (!dateVal) return ''
  try {
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

const pageHref = (page: number, query: string) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))
  const suffix = params.toString()
  return suffix ? `/bang-gia?${suffix}` : '/bang-gia'
}

export default async function PricePage({ searchParams }: Props) {
  const incoming = await searchParams
  const query = String(incoming.q || '').trim().slice(0, 120)
  const requestedPage = Math.max(1, Number.parseInt(String(incoming.page || '1'), 10) || 1)
  let settings: any = {}
  let result: any = { docs: [], totalDocs: 0, totalPages: 1, page: requestedPage }
  let priceMap = new Map<string, any>()

  try {
    const [payload, siteSettings] = await Promise.all([getCMS(), getGlobal('site-settings')])
    settings = (siteSettings as any)?.servicePricePage || {}
    const limit = settings.rowsPerPage === '50' || settings.rowsPerPage === 50 ? 50 : 40
    const searchable: any[] = [
      { code: { contains: query } },
      { name: { contains: query } },
      { category: { contains: query } },
    ]
    if (settings.searchNotes !== false) searchable.push({ note: { contains: query } })

    result = await payload.find({
      collection: 'services',
      where: query ? { and: [{ active: { equals: true } }, { or: searchable }] } : { active: { equals: true } },
      sort: 'sequence',
      limit,
      page: requestedPage,
      depth: 0,
    })

    const now = new Date()
    const prices = await payload.find({
      collection: 'servicePrices',
      where: { active: { equals: true } },
      sort: '-effectiveFrom',
      limit: 5000,
      depth: 1,
    })

    priceMap = new Map()
    for (const price of prices.docs as any[]) {
      const from = price.effectiveFrom ? new Date(price.effectiveFrom) : null
      const to = price.effectiveTo ? new Date(price.effectiveTo) : null
      if (from && from > now) continue
      if (to && to < now) continue
      const serviceId = typeof price.service === 'object' ? String(price.service?.id || '') : String(price.service || '')
      if (serviceId && !priceMap.has(serviceId)) priceMap.set(serviceId, price)
    }
  } catch (error) {
    console.error('[PricePage] Lỗi khi tải dữ liệu bảng giá:', error)
  }

  const docs = result.docs as any[]
  const currentPage = Number(result.page || requestedPage)
  const totalPages = Math.max(1, Number(result.totalPages || 1))
  const rowsPerPage = settings.rowsPerPage === '50' || settings.rowsPerPage === 50 ? 50 : 40
  const visiblePages = Array.from(
    new Set([1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, totalPages])
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CÔNG KHAI – MINH BẠCH"
        title={settings.title || 'Bảng giá dịch vụ'}
        description={settings.description || 'Tra cứu giá BHYT và giá dịch vụ được cập nhật trực tiếp theo quy định hiện hành.'}
      />

      <main className="section servicePricePage">
        <div className="container">
          <div className={styles.pricePageContainer}>
            {/* Thông cáo / Căn cứ pháp lý & Lưu ý BHYT */}
            {settings.showNoticeBanner !== false && (settings.noticeContent || settings.noticeTitle) && (
              <aside className={styles.legalBanner} aria-label="Thông báo và quy định bảng giá">
                <div className={styles.legalBannerIcon} aria-hidden="true">
                  ⚖️
                </div>
                <div className={styles.legalBannerBody}>
                  {settings.noticeTitle && <h2 className={styles.legalBannerTitle}>{settings.noticeTitle}</h2>}
                  {settings.noticeContent && <p className={styles.legalBannerContent}>{settings.noticeContent}</p>}
                </div>
              </aside>
            )}

            {/* Khung tìm kiếm & Thao tác lọc */}
            <section className={styles.searchSection} aria-label="Bộ lọc tìm kiếm bảng giá">
              <form className={styles.searchForm} action="/bang-gia" method="get">
                <div className={styles.searchInputWrapper}>
                  <span className={styles.searchIcon} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                  <input
                    id="service-query"
                    name="q"
                    className={styles.searchInput}
                    defaultValue={query}
                    placeholder={settings.searchPlaceholder || 'Nhập tên dịch vụ, mã kỹ thuật, nhóm chuyên khoa hoặc ghi chú...'}
                    aria-label="Tìm kiếm dịch vụ y tế"
                  />
                </div>
                <button type="submit" className={styles.searchSubmitBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Tìm kiếm</span>
                </button>
                {query && (
                  <a href="/bang-gia" className={styles.clearFilterBtn}>
                    ✕ Xóa bộ lọc
                  </a>
                )}
              </form>

              {/* Thanh thống kê kết quả */}
              <div className={styles.statsBar}>
                <div className={styles.statsHighlight}>
                  <span>Kết quả:</span>
                  <span className={styles.badgeCount}>
                    {new Intl.NumberFormat('vi-VN').format(result.totalDocs || 0)}
                  </span>
                  <span>{query ? `dịch vụ khớp từ khóa “${query}”` : 'dịch vụ đang áp dụng'}</span>
                </div>
                <div className={styles.legalNoticeBadge}>
                  <span aria-hidden="true">🛡️</span>
                  <span>Đồng bộ dữ liệu quản trị & danh mục BHYT</span>
                </div>
              </div>
            </section>

            {/* BẢNG GIÁ HIỂN THỊ TRÊN DESKTOP & TABLET */}
            <div className={styles.tableContainer}>
              <div className={styles.tableScrollWrapper}>
                <table className={styles.medicalTable}>
                  <thead>
                    <tr>
                      <th className={styles.thSequence}>STT</th>
                      <th className={styles.thService}>Mã & Tên dịch vụ kỹ thuật</th>
                      <th className={styles.thBhytPrice}>Giá BHYT</th>
                      <th className={styles.thHospitalPrice}>Giá Dịch vụ</th>
                      <th className={styles.thLegalDecision}>Quyết định & Hiệu lực</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((item: any, index: number) => {
                      const current = priceMap.get(String(item.id))
                      const stt = item.sequence || (currentPage - 1) * rowsPerPage + index + 1
                      const bhytPrice = current?.insurancePrice ?? item.insurancePrice
                      const hospitalPrice = current?.servicePrice ?? item.price
                      const decisionNo = current?.decisionNo || ''
                      const effectiveFromStr = formatDate(current?.effectiveFrom)
                      const effectiveToStr = formatDate(current?.effectiveTo)
                      const note = current?.note || item.note || ''

                      return (
                        <tr key={item.id}>
                          <td className={styles.tdSequence}>{stt}</td>
                          <td>
                            <div className={styles.serviceDetailCell}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span className={styles.serviceCodePill}>{item.code}</span>
                                {item.unit && !/^(lần|lan)$/i.test(item.unit.trim()) && (
                                  <span className={styles.serviceUnit}>{item.unit}</span>
                                )}
                              </div>
                              <span className={styles.serviceNameText}>{item.name}</span>
                              {item.category && (
                                <span className={styles.serviceMetaText}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 7h-7L10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                                  </svg>
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={styles.priceCellBhyt}>
                            <span className={styles.priceNumberBhyt}>{money(bhytPrice)}</span>
                          </td>
                          <td className={styles.priceCellHospital}>
                            <span className={styles.priceNumberHospital}>{money(hospitalPrice)}</span>
                          </td>
                          <td>
                            <div className={styles.legalDecisionCell}>
                              <div className={styles.legalDecisionRow}>
                                {decisionNo ? (
                                  <span className={styles.decisionChip} title={`Quyết định: ${decisionNo}`}>
                                    📜 {decisionNo}
                                  </span>
                                ) : (
                                  <span className={styles.decisionDefault}>Quy định chung</span>
                                )}

                                {effectiveFromStr && (
                                  <span className={styles.effectiveDatePill} title={`Hiệu lực từ ${effectiveFromStr}${effectiveToStr ? ` đến ${effectiveToStr}` : ''}`}>
                                    📅 {effectiveFromStr}
                                  </span>
                                )}
                              </div>

                              {note && (
                                <span className={styles.legalNote} title={note}>
                                  * {note}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {docs.length === 0 && (
                <div className={styles.emptyNotice}>
                  <div className={styles.emptyNoticeIcon} aria-hidden="true">🔍</div>
                  <h3 className={styles.emptyNoticeTitle}>{settings.emptyText || 'Không tìm thấy dịch vụ y tế phù hợp.'}</h3>
                  <a href="/bang-gia" className={styles.emptyNoticeLink}>
                    Nhấn vào đây để xem toàn bộ bảng giá
                  </a>
                </div>
              )}
            </div>

            {/* BẢNG GIÁ DẠNG THẺ CHO MÀN HÌNH DI ĐỘNG (MOBILE) */}
            <div className={styles.mobileCardsContainer}>
              {docs.map((item: any, index: number) => {
                const current = priceMap.get(String(item.id))
                const stt = item.sequence || (currentPage - 1) * rowsPerPage + index + 1
                const bhytPrice = current?.insurancePrice ?? item.insurancePrice
                const hospitalPrice = current?.servicePrice ?? item.price
                const decisionNo = current?.decisionNo || ''
                const effectiveFromStr = formatDate(current?.effectiveFrom)
                const note = current?.note || item.note || ''

                return (
                  <article className={styles.mobileCard} key={`m-${item.id}`}>
                    <div className={styles.mobileCardHeader}>
                      <span className={styles.serviceCodePill}>#{stt} · {item.code}</span>
                      {item.unit && !/^(lần|lan)$/i.test(item.unit.trim()) && (
                        <span className={styles.serviceUnit}>{item.unit}</span>
                      )}
                    </div>

                    <h3 className={styles.mobileCardTitle}>{item.name}</h3>

                    {item.category && (
                      <div className={styles.serviceMetaText}>
                        <span>📁 {item.category}</span>
                      </div>
                    )}

                    <div className={styles.mobilePriceGrid}>
                      <div className={styles.mobilePriceBox}>
                        <span className={`${styles.mobilePriceLabel} ${styles.mobileBhytLabel}`}>Giá BHYT</span>
                        <span className={`${styles.mobilePriceValue} ${styles.priceNumberBhyt}`}>{money(bhytPrice)}</span>
                      </div>
                      <div className={styles.mobilePriceBox}>
                        <span className={`${styles.mobilePriceLabel} ${styles.mobileHospitalLabel}`}>Giá Dịch vụ</span>
                        <span className={`${styles.mobilePriceValue} ${styles.priceNumberHospital}`}>{money(hospitalPrice)}</span>
                      </div>
                    </div>

                    {(decisionNo || effectiveFromStr || note) && (
                      <div className={styles.mobileLegalBox}>
                        {decisionNo && (
                          <div className={styles.decisionChip}>
                            <span>📜 {decisionNo}</span>
                          </div>
                        )}
                        {effectiveFromStr && (
                          <div className={styles.effectiveDatesRow}>
                            <span className={styles.effectiveDatePill}>
                              📅 Hiệu lực: {effectiveFromStr}
                            </span>
                          </div>
                        )}
                        {note && <span className={styles.legalNote}>* {note}</span>}
                      </div>
                    )}
                  </article>
                )
              })}

              {docs.length === 0 && (
                <div className={styles.emptyNotice}>
                  <div className={styles.emptyNoticeIcon} aria-hidden="true">🔍</div>
                  <h3 className={styles.emptyNoticeTitle}>{settings.emptyText || 'Không tìm thấy dịch vụ y tế phù hợp.'}</h3>
                  <a href="/bang-gia" className={styles.emptyNoticeLink}>
                    Nhấn vào đây để xem toàn bộ bảng giá
                  </a>
                </div>
              )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <nav className="servicePagination" aria-label="Phân trang bảng giá">
                <a className={currentPage <= 1 ? 'disabled' : ''} href={pageHref(Math.max(1, currentPage - 1), query)}>
                  ← Trước
                </a>
                <div>
                  {visiblePages.map((page, index) => (
                    <span key={page}>
                      {index > 0 && page - visiblePages[index - 1] > 1 && <i>…</i>}
                      <a
                        className={page === currentPage ? 'active' : ''}
                        href={pageHref(page, query)}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </a>
                    </span>
                  ))}
                </div>
                <a className={currentPage >= totalPages ? 'disabled' : ''} href={pageHref(Math.min(totalPages, currentPage + 1), query)}>
                  Sau →
                </a>
              </nav>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}

