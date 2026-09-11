import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS, getGlobal } from '@/lib/payload'

export const revalidate = 300
export const metadata: Metadata = { title: 'Bảng giá dịch vụ', description: 'Tra cứu giá BHYT và giá dịch vụ tại Bệnh viện Đa khoa Khu vực Thới Lai.' }
type Props = { searchParams: Promise<{ q?: string; page?: string }> }
const money = (value: any) => typeof value === 'number' ? `${new Intl.NumberFormat('vi-VN').format(value)}đ` : '-'

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
    const searchable: any[] = [{ code: { contains: query } }, { name: { contains: query } }, { category: { contains: query } }]
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
    const prices = await payload.find({ collection: 'servicePrices', where: { active: { equals: true } }, sort: '-effectiveFrom', limit: 5000, depth: 1 })
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
  const visiblePages = Array.from(new Set([1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, totalPages])).filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b)

  return <><SiteHeader/><PageHero eyebrow="CÔNG KHAI – MINH BẠCH" title={settings.title || 'Bảng giá dịch vụ'} description={settings.description || 'Tra cứu giá BHYT và giá dịch vụ được cập nhật trực tiếp từ hệ thống quản trị.'}/><main className="section servicePricePage"><div className="container">
    <form className="serviceSearch" action="/bang-gia" method="get"><div className="serviceSearchInput"><span>⌕</span><label htmlFor="service-query">Tìm dịch vụ</label><input id="service-query" name="q" defaultValue={query} placeholder={settings.searchPlaceholder || 'Nhập tên, mã dịch vụ, nhóm hoặc ghi chú…'}/></div><button type="submit">Tìm kiếm</button>{query && <a href="/bang-gia">Xóa bộ lọc</a>}</form>
    <div className="serviceResultBar"><div><strong>{new Intl.NumberFormat('vi-VN').format(result.totalDocs || 0)}</strong><span>{query ? ` kết quả cho “${query}”` : ' dịch vụ đang công khai'}</span></div><span>Hiển thị {rowsPerPage} dòng / trang</span></div>
    <div className="price-table price-table-full"><div className="price-head"><span>STT</span><span>Mã dịch vụ / Tên dịch vụ</span><span>Giá BHYT</span><span>Giá dịch vụ</span><span>Ghi chú</span></div>{docs.map((item:any,index:number)=>{const current=priceMap.get(String(item.id)); return <div className="price-row" key={item.id}><span>{item.sequence || (currentPage - 1) * rowsPerPage + index + 1}</span><span><b>{item.code}</b><strong>{item.name}</strong>{item.category && <small>{item.category}{item.unit ? ` · ${item.unit}` : ''}</small>}</span><strong>{money(current?.insurancePrice ?? item.insurancePrice)}</strong><strong>{money(current?.servicePrice ?? item.price)}</strong><span>{current?.decisionNo ? `${current.decisionNo}${current.note ? ` · ${current.note}` : ''}` : (item.note || '-')}</span></div>})}{docs.length === 0 && <div className="serviceEmpty"><span>⌕</span><strong>{settings.emptyText || 'Không tìm thấy dịch vụ phù hợp.'}</strong><a href="/bang-gia">Xem toàn bộ bảng giá</a></div>}</div>
    {totalPages > 1 && <nav className="servicePagination" aria-label="Phân trang bảng giá"><a className={currentPage <= 1 ? 'disabled' : ''} href={pageHref(Math.max(1,currentPage-1),query)}>← Trước</a><div>{visiblePages.map((page,index)=><span key={page}>{index>0&&page-visiblePages[index-1]>1&&<i>…</i>}<a className={page===currentPage?'active':''} href={pageHref(page,query)} aria-current={page===currentPage?'page':undefined}>{page}</a></span>)}</div><a className={currentPage >= totalPages ? 'disabled' : ''} href={pageHref(Math.min(totalPages,currentPage+1),query)}>Sau →</a></nav>}
  </div></main><SiteFooter/></>
}
