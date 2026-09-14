'use client'

import { useRef, useState } from 'react'
import styles from './ChatbotExcelImport.module.css'

type Target = 'faqs' | 'intents'
type PreviewRow = { row: number; key: string; secondary?: string; errors: string[] }
type Preview = { target: Target; total: number; valid: number; invalid: number; canImport: boolean; duplicates: string[]; preview: PreviewRow[] }
type Result = { created: number; updated: number; skipped: number; errors: string[] }

type Props = {
  target: Target
  title: string
  description: string
}

export default function ChatbotExcelImport({ target, title, description }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const send = async (mode: 'preview' | 'import') => {
    if (!file || busy) return
    setBusy(true)
    setError('')
    if (mode === 'preview') { setPreview(null); setResult(null) }
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('mode', mode)
      form.append('target', target)
      const response = await fetch('/api/chatbot-excel-import', { method: 'POST', body: form })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Không thể xử lý file Excel.')
      if (mode === 'preview') setPreview(data)
      else {
        setResult(data)
        setPreview(null)
        setFile(null)
        if (inputRef.current) inputRef.current.value = ''
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể xử lý file Excel.')
    } finally {
      setBusy(false)
    }
  }

  return <section className={styles.importPanel}>
    <div className={styles.heading}>
      <span className={styles.icon}>XLSX</span>
      <div>
        <span className={styles.eyebrow}>NHẬP NHANH CHATBOT · EXCEL</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
    <div className={styles.actions}>
      <a className={styles.templateButton} href="/templates/Mau-Nhap-Chatbot-BVDK-Thoi-Lai.xlsx" download>⇩ Tải mẫu Excel Chatbot</a>
      <label className={styles.filePicker}>
        <input ref={inputRef} type="file" accept=".xlsx" onChange={event => {
          setFile(event.target.files?.[0] || null)
          setError(''); setPreview(null); setResult(null)
        }}/>
        <span>▣ {file ? file.name : 'Chọn file Excel'}</span>
      </label>
      <button className={styles.checkButton} type="button" disabled={!file || busy} onClick={() => send('preview')}>
        {busy ? 'Đang kiểm tra…' : 'Kiểm tra dữ liệu'}
      </button>
      {preview?.canImport && <button className={styles.importButton} type="button" disabled={busy} onClick={() => send('import')}>
        {busy ? 'Đang nhập…' : 'Xác nhận nhập dữ liệu'}
      </button>}
    </div>
    <div className={styles.notes}>
      <span>✓ Kiểm tra trước khi nhập</span>
      <span>↻ Trùng câu hỏi/tên kịch bản sẽ cập nhật bản ghi hiện có</span>
      <span>⌁ Nhiều từ khóa/câu hỏi tương đương: ngăn cách bằng dấu ; hoặc xuống dòng</span>
      <span>! Tối đa 2.000 dòng / 10 MB</span>
    </div>
    {preview && <div className={preview.canImport ? styles.success : styles.error}>
      <strong>Kết quả kiểm tra</strong>
      <span>Tổng: <b>{preview.total}</b></span>
      <span>Hợp lệ: <b>{preview.valid}</b></span>
      <span>Lỗi: <b>{preview.invalid}</b></span>
      {preview.duplicates.length > 0 && <span>Trùng trong file: <b>{preview.duplicates.join(', ')}</b></span>}
      {preview.preview.some(x => x.errors.length > 0) && <details><summary>Xem các dòng cần sửa</summary><ul>{preview.preview.filter(x => x.errors.length).map(x => <li key={x.row}>Dòng {x.row} · {x.key || '(trống)'}: {x.errors.join(', ')}</li>)}</ul></details>}
    </div>}
    {result && <div className={styles.success}>
      <strong>Nhập Excel hoàn tất</strong>
      <span>Thêm mới: <b>{result.created}</b></span>
      <span>Cập nhật: <b>{result.updated}</b></span>
      <span>Bỏ qua: <b>{result.skipped}</b></span>
      {result.errors.length > 0 && <details><summary>Xem {result.errors.length} dòng lỗi</summary><ul>{result.errors.map((item, index) => <li key={index}>{item}</li>)}</ul></details>}
      <button type="button" onClick={() => window.location.reload()}>Làm mới danh sách</button>
    </div>}
    {error && <div className={styles.error}><strong>Không thể xử lý dữ liệu</strong><span>{error}</span></div>}
  </section>
}
