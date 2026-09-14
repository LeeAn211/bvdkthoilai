'use client'
import { useState } from 'react'
import { TurnstileWidget } from './TurnstileWidget'

export function FeedbackForm() {
  const [state, setState] = useState<'idle'|'sending'|'done'|'error'>('idle')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState('sending'); setError(''); setCode('')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries()) as any
    payload.allowContact = form.get('allowContact') === 'on'
    const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json().catch(() => ({}))
    if (res.ok) { setState('done'); setCode(data.code || ''); e.currentTarget.reset() }
    else { setState('error'); setError(data.error || 'Không thể gửi phản hồi. Vui lòng thử lại.') }
  }
  return (
    <form className="feedback-form" onSubmit={submit}>
      <h2>Góp ý – Phản ánh</h2>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot" />
      <label>Họ tên<input name="name" required placeholder="Nhập họ tên" /></label>
      <label>Số điện thoại<input name="phone" required placeholder="Số điện thoại dùng để tra cứu" /></label>
      <label>Email<input name="email" type="email" placeholder="Email (không bắt buộc)" /></label>
      <label>Loại phản hồi<select name="type"><option>Góp ý</option><option>Khen ngợi</option><option>Khiếu nại</option><option>Khác</option></select></label>
      <label>Tiêu đề<input name="subject" required placeholder="Nội dung cần phản ánh" /></label>
      <label>Nội dung<textarea name="message" required rows={6} placeholder="Nội dung phản hồi"></textarea></label>
      <label className="feedback-consent"><input name="allowContact" type="checkbox" defaultChecked /> Tôi đồng ý để bệnh viện liên hệ khi cần làm rõ nội dung.</label>
      <TurnstileWidget />
      <button className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Đang gửi...' : 'Gửi phản ánh'}</button>
      {state === 'done' && <div className="success-message"><p>Phản ánh đã được tiếp nhận.</p>{code && <><p><b>Mã tra cứu: {code}</b></p><a href={`/gop-y/tra-cuu?code=${encodeURIComponent(code)}`}>Tra cứu tiến độ →</a></>}</div>}
      {state === 'error' && <p className="error-message">{error}</p>}
    </form>
  )
}
