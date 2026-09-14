'use client'

import { useRef, useState } from 'react'
import styles from './ServicesExcelImport.module.css'

type Preview = { total: number; valid: number; invalid: number; duplicateCodes: string[]; canImport: boolean; preview: Array<{row:number;code:string;name:string;insurancePrice?:number;servicePrice?:number;effectiveFrom?:string;errors:string[]}> }
type Result = { created: number; updated: number; skipped: number; errors: string[] }

export default function ServicesExcelImport() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const send = async (mode: 'preview' | 'import') => {
    if (!file || busy) return
    setBusy(true); setError(''); if (mode === 'preview') { setPreview(null); setResult(null) }
    try {
      const form = new FormData(); form.append('file', file); form.append('mode', mode)
      const response = await fetch('/api/services-import', { method: 'POST', body: form })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Không thể xử lý file Excel.')
      if (mode === 'preview') setPreview(data)
      else {
        setResult(data); setPreview(null); setFile(null)
        if (inputRef.current) inputRef.current.value = ''
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể xử lý file Excel.') }
    finally { setBusy(false) }
  }

  return <section className={styles.importPanel}>
    <div className={styles.heading}><span className={styles.icon}>XLSX</span><div><span className={styles.eyebrow}>IMPORT CENTER · BẢNG GIÁ</span><h2>Kiểm tra trước khi nhập Excel</h2><p>Mẫu v3.6 có nhóm, đơn vị tính, giá BHYT, giá dịch vụ, quyết định và thời gian hiệu lực. Hệ thống lưu lịch sử giá thay vì ghi đè.</p></div></div>
    <div className={styles.actions}>
      <a className={styles.templateButton} href="/api/services-import" download>⇩ Tải mẫu Excel v3.6</a>
      <label className={styles.filePicker}><input ref={inputRef} type="file" accept=".xlsx" onChange={event => { setFile(event.target.files?.[0] || null); setError(''); setPreview(null); setResult(null) }}/><span>▣ {file ? file.name : 'Chọn file Excel'}</span></label>
      <button className={styles.importButton} type="button" disabled={!file || busy} onClick={() => send('preview')}>{busy ? 'Đang kiểm tra…' : 'Kiểm tra dữ liệu'}</button>
      {preview?.canImport && <button className={styles.importButton} type="button" disabled={busy} onClick={() => send('import')}>{busy ? 'Đang nhập…' : 'Xác nhận nhập dữ liệu'}</button>}
    </div>
    <div className={styles.notes}><span>✓ Bắt buộc kiểm tra trước khi nhập</span><span>↻ Mã dịch vụ cũ được cập nhật danh mục</span><span>◷ Giá mới tạo lịch sử theo ngày hiệu lực</span><span>! Tối đa 10.000 dòng / 20 MB</span></div>
    {preview && <div className={preview.canImport ? styles.success : styles.error}><strong>Kết quả kiểm tra</strong><span>Tổng: <b>{preview.total}</b></span><span>Hợp lệ: <b>{preview.valid}</b></span><span>Lỗi: <b>{preview.invalid}</b></span>{preview.duplicateCodes.length > 0 && <span>Mã trùng: <b>{preview.duplicateCodes.join(', ')}</b></span>}{preview.preview.some(x => x.errors.length > 0) && <details><summary>Xem các dòng cần sửa</summary><ul>{preview.preview.filter(x=>x.errors.length).map(x=><li key={x.row}>Dòng {x.row} · {x.code || '(chưa có mã)'}: {x.errors.join(', ')}</li>)}</ul></details>}</div>}
    {result && <div className={styles.success}><strong>Nhập Excel hoàn tất</strong><span>Thêm mới: <b>{result.created}</b></span><span>Cập nhật: <b>{result.updated}</b></span><span>Bỏ qua: <b>{result.skipped}</b></span>{result.errors.length > 0 && <details><summary>Xem {result.errors.length} dòng lỗi</summary><ul>{result.errors.map((item,index)=><li key={index}>{item}</li>)}</ul></details>}<button type="button" onClick={() => window.location.reload()}>Làm mới danh sách</button></div>}
    {error && <div className={styles.error}><strong>Không thể xử lý dữ liệu</strong><span>{error}</span></div>}
  </section>
}
