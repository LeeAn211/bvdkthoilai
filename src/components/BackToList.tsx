export function BackToList({ href, label = 'Trở lại danh sách trước' }: { href: string; label?: string }) {
  return <div className="backToListWrap"><a className="backToListButton" href={href}><span>←</span> {label}</a></div>
}
