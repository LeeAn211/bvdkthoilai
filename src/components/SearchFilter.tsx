'use client'
import { useMemo, useState } from 'react'

const norm = (value: unknown) => String(value || '').trim()

export function SearchFilter({ items, kind = 'news', initialCategory = 'all' }: { items: any[]; kind?: string; initialCategory?: string }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const categories = useMemo(() => Array.from(new Set(items.map(i => norm(i.category || i.type)).filter(Boolean))), [items])
  const filtered = useMemo(() => items.filter(item => {
    const text = `${item.title || item.name || ''} ${item.excerpt || ''} ${item.referenceCode || ''}`.toLowerCase()
    const matchQ = text.includes(q.toLowerCase().trim())
    const c = norm(item.category || item.type)
    return matchQ && (category === 'all' || c === category)
  }), [items, q, category])

  const label = kind === 'notice' ? 'thông báo' : kind === 'procurement' ? 'nội dung mua sắm' : kind === 'recruitment' ? 'tin tuyển dụng' : kind === 'schedule' ? 'lịch khám' : kind === 'vaccination' ? 'nội dung tiêm chủng' : kind === 'document' ? 'văn bản' : 'tin bài'

  return (
    <section className="contentDirectory" aria-label={`Danh sách ${label}`}>
      <div className="contentDirectoryTools">
        <div className="contentSearchBox">
          <span aria-hidden="true">⌕</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Tìm trong ${label}...`} aria-label={`Tìm trong ${label}`} />
        </div>
        <div className="contentResultCount"><strong>{filtered.length}</strong><span> / {items.length} {label}</span></div>
      </div>

      {categories.length > 0 && (
        <div className="categoryDirectory" aria-label="Chuyên mục">
          <button type="button" className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>
            <span>Tất cả</span><b>{items.length}</b>
          </button>
          {categories.map(c => {
            const count = items.filter(item => norm(item.category || item.type) === c).length
            return <button type="button" key={String(c)} className={category === c ? 'active' : ''} onClick={() => setCategory(String(c))}><span>{String(c)}</span><b>{count}</b></button>
          })}
        </div>
      )}

      <div className="contentDirectoryHeading">
        <div>
          <span className="contentDirectoryEyebrow">{category === 'all' ? 'TẤT CẢ CHUYÊN MỤC' : 'CHUYÊN MỤC'}</span>
          <h2>{category === 'all' ? (kind === 'news' ? 'Tin mới cập nhật' : kind === 'notice' ? 'Thông báo mới cập nhật' : kind === 'schedule' ? 'Lịch khám mới cập nhật' : kind === 'vaccination' ? 'Thông tin tiêm chủng mới cập nhật' : kind === 'document' ? 'Văn bản mới cập nhật' : 'Nội dung mới cập nhật') : category}</h2>
        </div>
        {category !== 'all' && <button type="button" onClick={() => setCategory('all')}>Xem tất cả chuyên mục</button>}
      </div>

      {filtered.length === 0 ? <div className="contentDirectoryEmpty"><strong>Không tìm thấy kết quả phù hợp.</strong><span>Thử từ khóa khác hoặc chọn lại chuyên mục.</span></div> : (
        <div className="contentCardGrid">
          {filtered.map((item, idx) => (
            <a className="directoryCard" href={item.href || '#'} key={item.id || idx} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
              <span className={`directoryCardMedia ${item.coverUrl ? 'hasImage' : ''}`}>
                <span className="directoryCardPlaceholder" aria-hidden="true">{kind === 'notice' ? 'TB' : kind === 'procurement' ? 'MS' : kind === 'recruitment' ? 'TD' : kind === 'schedule' ? 'LK' : kind === 'vaccination' ? 'TC' : kind === 'document' ? 'VB' : 'TT'}</span>
                {item.coverUrl && (
                  <img
                    className="directoryCardImage"
                    src={item.coverUrl}
                    alt={item.title || item.name || ''}
                    loading="lazy"
                    onError={event => { event.currentTarget.style.display = 'none' }}
                  />
                )}
                {(item.category || item.type) && <span className="directoryCardCategory">{item.category || item.type}</span>}
              </span>
              <span className="directoryCardBody">
                {(item.date || item.publishedAt || item.referenceCode || item.meta) && <small>
                  {item.referenceCode ? `${item.referenceCode} · ` : ''}
                  {(item.date || item.publishedAt) ? `${kind === 'schedule' || kind === 'vaccination' ? '' : 'Ngày đăng: '}${item.date || item.publishedAt}` : ''}
                  {item.meta ? `${(item.date || item.publishedAt || item.referenceCode) ? ' · ' : ''}${item.meta}` : ''}
                </small>}
                <strong>{item.title || item.name}</strong>
                {item.excerpt && <p>{item.excerpt}</p>}
                <span className="directoryCardMore">{item.actionLabel || 'Xem chi tiết'} <i>→</i></span>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
