'use client'
import { FormEvent, useState } from 'react'

const labels: Record<string,string> = { new:'Mới tiếp nhận', assigned:'Đã phân công', processing:'Đang xử lý', waiting:'Chờ phản hồi', resolved:'Đã xử lý', closed:'Đã đóng' }
export function FeedbackLookup({ initialCode = '' }: { initialCode?: string }) {
  const [result, setResult] = useState<any>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    const form = new FormData(e.currentTarget); const code = String(form.get('code') || ''); const phone = String(form.get('phone') || '')
    const res = await fetch(`/api/feedback?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}`, { cache: 'no-store' }); const data = await res.json().catch(() => ({}))
    if (res.ok) setResult(data); else setError(data.error || 'Không tìm thấy dữ liệu.'); setLoading(false)
  }
  return <div className="feedback-lookup">
    <form className="feedback-form" onSubmit={submit}><label>Mã tra cứu<input name="code" defaultValue={initialCode} required /></label><label>Số điện thoại<input name="phone" required /></label><button className="btn btn-primary" disabled={loading}>{loading ? 'Đang tra cứu…' : 'Tra cứu'}</button>{error && <p className="error-message">{error}</p>}</form>
    {result && <section className="feedback-result"><h2>{result.subject}</h2><p><b>Mã:</b> {result.code}</p><p><b>Trạng thái:</b> {labels[result.status] || result.status}</p>{result.publicResponse && <p><b>Phản hồi của bệnh viện:</b> {result.publicResponse}</p>}<h3>Tiến độ xử lý</h3><ol>{(result.timeline || []).map((row:any, i:number) => <li key={i}><b>{new Date(row.createdAt).toLocaleString('vi-VN')}</b>{row.note ? ` — ${row.note}` : ''}</li>)}</ol></section>}
  </div>
}
