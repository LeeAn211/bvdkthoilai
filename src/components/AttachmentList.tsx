import { mediaFormat, mediaLabel, mediaUrl } from '@/lib/media'

export function AttachmentList({ items, title = 'Tài liệu đính kèm' }: { items?: any[]; title?: string }) {
  const files = (items || []).map((item) => ({
    ...item,
    url: mediaUrl(item?.file),
    name: mediaLabel(item?.file),
    format: mediaFormat(item?.file),
  })).filter((item) => item.url)

  if (!files.length) return null

  return <section className="downloads attachmentPanel">
    <h2>{title}</h2>
    <div className="attachmentList">
      {files.map((item, index) => <a key={item.id || index} href={item.url} target="_blank" rel="noopener noreferrer">
        <span className="attachmentIcon">{item.format}</span>
        <span><strong>{item.name}</strong><small>Tệp {item.format} · Bấm để xem hoặc tải xuống</small></span>
        <b>Mở tệp →</b>
      </a>)}
    </div>
  </section>
}
