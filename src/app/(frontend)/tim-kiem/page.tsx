import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PageHero } from '@/components/PageHero'
import { getCMS } from '@/lib/payload'

export const metadata: Metadata = { title: 'Tìm kiếm', description: 'Tìm kiếm thông tin trên website Bệnh viện Đa khoa Khu vực Thới Lai.', robots: { index: false, follow: true } }
type Props = { searchParams: Promise<{ q?: string; type?: string }> }
type SearchItem = { id: string; title: string; href: string; type: string; summary?: string }

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = String(params.q || '').trim().replace(/\s+/g, ' ').slice(0, 100)
  const typeFilter = String(params.type || 'all')
  const results: SearchItem[] = []
  if (query.length >= 2) {
    try {
      const payload = await getCMS()
      const configs = [
        { key: 'news', collection: 'news', label: 'Tin tức', path: '/tin-tuc', title: 'title', summary: 'excerpt', published: true },
        { key: 'notices', collection: 'notices', label: 'Thông báo', path: '/thong-bao', title: 'title', summary: 'excerpt', published: true },
        { key: 'procurement', collection: 'procurement', label: 'Đấu thầu – Mua sắm', path: '/dau-thau-mua-sam', title: 'title', summary: 'summary', published: true },
        { key: 'pages', collection: 'pages', label: 'Trang nội dung', path: '/trang', title: 'title', published: true },
        { key: 'recruitment', collection: 'recruitment', label: 'Tuyển dụng', path: '/tuyen-dung', title: 'title', summary: 'excerpt', published: true },
        { key: 'doctors', collection: 'doctors', label: 'Bác sĩ', path: '/bac-si', title: 'name', summary: 'position' },
        { key: 'departments', collection: 'departments', label: 'Khoa / Phòng', path: '/khoa-phong', title: 'name', summary: 'summary' },
        { key: 'specialties', collection: 'specialties', label: 'Chuyên khoa', path: '/chuyen-khoa', title: 'name', summary: 'summary' },
        { key: 'services', collection: 'services', label: 'Dịch vụ', path: '/bang-gia', title: 'name', summary: 'code', direct: true },
        { key: 'vaccines', collection: 'vaccines', label: 'Vắc xin', path: '/tiem-chung', title: 'name', summary: 'manufacturer', direct: true },
      ]
      const selected = configs.filter(c => typeFilter === 'all' || c.key === typeFilter)
      for (const config of selected) {
        const and: any[] = [{ [config.title]: { contains: query } }]
        if (config.published) and.unshift({ _status: { equals: 'published' } })
        const source: any = await payload.find({ collection: config.collection as any, where: { and }, limit: 15, depth: 0 })
        for (const item of source.docs || []) {
          const title = String(item[config.title] || '')
          const href = config.direct ? `${config.path}?q=${encodeURIComponent(title)}` : `${config.path}/${item.slug}`
          results.push({ id: `${config.key}-${item.id}`, title, href, type: config.label, summary: config.summary ? String(item[config.summary] || '') : undefined })
        }
      }
    } catch {}
  }
  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'news', label: 'Tin tức' },
    { key: 'notices', label: 'Thông báo' },
    { key: 'procurement', label: 'Đấu thầu' },
    { key: 'recruitment', label: 'Tuyển dụng' },
    { key: 'pages', label: 'Trang nội dung' },
    { key: 'doctors', label: 'Bác sĩ' },
    { key: 'departments', label: 'Khoa/Phòng' },
    { key: 'specialties', label: 'Chuyên khoa' },
    { key: 'services', label: 'Dịch vụ' },
    { key: 'vaccines', label: 'Vắc xin' },
  ]

  const activeLabel = filters.find(f => f.key === typeFilter)?.label || 'Tất cả'

  return <>
    <SiteHeader />
    <PageHero eyebrow="TRA CỨU" title="Tìm kiếm toàn website" description="Tìm nhanh tin tức, thông báo, bác sĩ, khoa/phòng, chuyên khoa, dịch vụ, vắc xin và các nội dung khác của bệnh viện." />
    <main className="section searchPageSection">
      <div className="container searchPageContainer">
        <section className="searchPanel" aria-label="Công cụ tìm kiếm">
          <div className="searchPanelHeading">
            <div className="searchPanelIcon" aria-hidden="true">⌕</div>
            <div><span>TRA CỨU NHANH</span><h2>Bạn cần tìm thông tin gì?</h2><p>Nhập từ khóa và chọn nhóm nội dung để thu hẹp kết quả.</p></div>
          </div>
          <form className="siteSearchForm siteSearchFormModern" action="/tim-kiem">
            <label className="srOnly" htmlFor="site-query">Nội dung cần tìm</label>
            <div className="searchInputWrap"><span aria-hidden="true">⌕</span><input id="site-query" name="q" defaultValue={query} minLength={2} maxLength={100} required placeholder="Ví dụ: lịch khám, nội tổng hợp, tiêm chủng..." /></div>
            <label className="srOnly" htmlFor="search-type">Loại nội dung</label>
            <select id="search-type" name="type" defaultValue={typeFilter} aria-label="Loại nội dung">{filters.map(f => <option value={f.key} key={f.key}>{f.label}</option>)}</select>
            <button className="searchSubmitButton" type="submit"><span aria-hidden="true">⌕</span>Tìm kiếm</button>
          </form>
          <div className="searchFilterChips" aria-label="Lọc nhanh theo loại nội dung">
            {filters.map(f => <a className={f.key === typeFilter ? 'active' : ''} href={`/tim-kiem?${query ? `q=${encodeURIComponent(query)}&` : ''}type=${f.key}`} key={f.key}>{f.label}</a>)}
          </div>
        </section>

        {query.length >= 2 ? <section className="searchResults searchResultsModern">
          <div className="searchResultsHeader"><div><span>KẾT QUẢ TÌM KIẾM</span><h2>{results.length ? `Tìm thấy ${results.length} kết quả` : 'Chưa tìm thấy nội dung phù hợp'}</h2><p>Từ khóa: <strong>“{query}”</strong> · Nhóm: <strong>{activeLabel}</strong></p></div>{results.length > 0 && <div className="searchCountBadge">{results.length}</div>}</div>
          {results.length > 0 ? <div className="searchResultList">{results.map(item => <a className="searchResultCard" href={item.href} key={item.id}>
            <div className="searchResultType">{item.type}</div>
            <div className="searchResultBody"><strong>{item.title}</strong>{item.summary && <small>{item.summary}</small>}</div>
            <div className="searchResultArrow" aria-hidden="true">→</div>
          </a>)}</div> : <div className="searchEmptyState"><div aria-hidden="true">⌕</div><h3>Không có kết quả cho “{query}”</h3><p>Hãy thử từ khóa ngắn hơn, kiểm tra chính tả hoặc chọn nhóm “Tất cả”.</p><a href="/tim-kiem" className="btn btn-primary">Tìm lại</a></div>}
        </section> : <section className="searchTips"><strong>Gợi ý tìm kiếm</strong><p>Bạn có thể tìm theo tên bác sĩ, tên khoa/phòng, tên dịch vụ, tiêu đề bài viết hoặc tên vắc xin. Từ khóa cần ít nhất 2 ký tự.</p></section>}
      </div>
    </main>
    <SiteFooter />
  </>
}
