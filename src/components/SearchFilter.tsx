'use client'
import { useMemo, useState } from 'react'
import styles from './SearchFilter.module.css'

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

  const label = kind === 'notice' ? 'thông báo' : kind === 'procurement' ? 'nội dung mua sắm' : kind === 'recruitment' ? 'tin tuyển dụng' : kind === 'schedule' ? 'lịch khám' : kind === 'vaccination' ? 'nội dung tiêm chủng' : kind === 'document' ? 'văn bản' : kind === 'science' ? 'hoạt động khoa học' : 'tin bài'

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
          <h2>{category === 'all' ? (kind === 'news' ? 'Tin mới cập nhật' : kind === 'notice' ? 'Thông báo mới cập nhật' : kind === 'schedule' ? 'Lịch khám mới cập nhật' : kind === 'vaccination' ? 'Thông tin tiêm chủng mới cập nhật' : kind === 'document' ? 'Văn bản mới cập nhật' : kind === 'science' ? 'Hoạt động khoa học mới cập nhật' : 'Nội dung mới cập nhật') : category}</h2>
        </div>
        {category !== 'all' && <button type="button" onClick={() => setCategory('all')}>Xem tất cả chuyên mục</button>}
      </div>

      {filtered.length === 0 ? <div className="contentDirectoryEmpty"><strong>Không tìm thấy kết quả phù hợp.</strong><span>Thử từ khóa khác hoặc chọn lại chuyên mục.</span></div> : (
        <div className={`contentCardGrid ${styles.contentCardGrid}`}>
          {filtered.map((item, idx) => (
            <a className={`contentDirectoryPostCard ${styles.contentDirectoryPostCard}`} href={item.href || '#'} key={item.id || idx} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
              <div className={`postCardMediaWrap ${styles.postCardMediaWrap}`}>
                {item.coverUrl ? (
                  <img
                    className={`postCardImg ${styles.postCardImg}`}
                    src={item.coverUrl}
                    alt={item.title || item.name || ''}
                    loading="lazy"
                    onError={event => { event.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div className={`postCardPlaceholder ${styles.postCardPlaceholder}`}>
                    <span>{kind === 'notice' ? 'THÔNG BÁO' : kind === 'procurement' ? 'MUA SẮM' : kind === 'recruitment' ? 'TUYỂN DỤNG' : kind === 'science' ? 'KHOA HỌC' : 'TIN BÀI'}</span>
                  </div>
                )}
                {(item.category || item.type) && <span className={`postCardBadge ${styles.postCardBadge}`}>{item.category || item.type}</span>}
              </div>
              <div className={`postCardBody ${styles.postCardBody}`}>
                <div className={`postCardDate ${styles.postCardDate}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{(item.date || item.publishedAt) ? (item.date || item.publishedAt) : 'Mới cập nhật'}</span>
                </div>
                <h3 className={`postCardTitle ${styles.postCardTitle}`}>{item.title || item.name}</h3>
                {item.excerpt && <p className={`postCardExcerpt ${styles.postCardExcerpt}`}>{item.excerpt}</p>}
                <div className={`postCardFooter ${styles.postCardFooter}`}>
                  <span className={`postCardAction ${styles.postCardAction}`}>Xem chi tiết <i aria-hidden="true">→</i></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
