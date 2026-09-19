'use client'

import { useRef, useState } from 'react'
import { useForm } from '@payloadcms/ui'
import { parseDailyScheduleWorkbook, ParsedDailyAssignment } from '@/lib/dailyScheduleExcelParser'

export default function DailyTemplateDownload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [assignments, setAssignments] = useState<ParsedDailyAssignment[] | null>(null)
  const [parsedDate, setParsedDate] = useState<string | undefined>()
  const [parsedTitle, setParsedTitle] = useState<string | undefined>()
  const [error, setError] = useState('')
  const [applied, setApplied] = useState(false)

  const { dispatchFields } = useForm()

  const handleUpload = async () => {
    if (!file || busy) return
    setBusy(true)
    setError('')
    setAssignments(null)
    setApplied(false)

    try {
      const buffer = await file.arrayBuffer()
      const { Workbook } = await import('exceljs')
      const workbook = new Workbook()
      await workbook.xlsx.load(buffer as any)
      const data = parseDailyScheduleWorkbook(workbook, file.name)

      if (!data.assignments || data.assignments.length === 0) {
        throw new Error('Không tìm thấy dữ liệu ca trực trong file Excel. Vui lòng kiểm tra lại định dạng file.')
      }

      setAssignments(data.assignments)
      setParsedDate(data.date)
      setParsedTitle(data.title)
    } catch (e) {
      console.error('Lỗi parse file Excel lịch ngày:', e)
      setError(e instanceof Error ? e.message : 'Lỗi xử lý file Excel.')
    } finally {
      setBusy(false)
    }
  }

  const handleApply = () => {
    if (!assignments || !dispatchFields) return

    // 1. Điền bảng Phân công ca khám theo Khoa/Phòng
    dispatchFields({
      type: 'UPDATE',
      path: 'dailyAssignments',
      value: assignments.map((a) => ({
        departmentName: a.departmentName,
        departmentIcon: a.departmentIcon,
        morningDoctors: a.morningDoctors,
        noonDoctors: a.noonDoctors,
        afternoonDoctors: a.afternoonDoctors,
        eveningDoctors: a.eveningDoctors,
        note: a.note || '',
      })),
    })

    // 2. Điền ngày khám nếu bóc tách được từ tiêu đề
    if (parsedDate) {
      dispatchFields({
        type: 'UPDATE',
        path: 'date',
        value: parsedDate,
      })
    }

    // 3. Cập nhật tiêu đề nếu có
    if (parsedTitle) {
      dispatchFields({
        type: 'UPDATE',
        path: 'title',
        value: parsedTitle,
      })
    }

    setApplied(true)
  }
  // Xử lý quét ảnh lịch ngày bằng Gemini Vision AI
  const handleScanImage = async () => {
    if (!imageFile || ocrBusy) return
    setOcrBusy(true); setError(''); setAssignments(null); setApplied(false)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const res = await fetch('/api/ai-daily-ocr', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Quét ảnh thất bại. Vui lòng kiểm tra lại ảnh hoặc API Key.')
      }

      const data = json.data
      const rows: ParsedDailyAssignment[] = (data.assignments || []).map((a: any) => ({
        departmentName: a.departmentName || '',
        departmentIcon: a.departmentIcon || 'clinic',
        morningDoctors: a.morningDoctors || '',
        noonDoctors: a.noonDoctors || '',
        afternoonDoctors: a.afternoonDoctors || '',
        eveningDoctors: a.eveningDoctors || '',
        note: a.note || '',
      }))

      setAssignments(rows)
      if (data.date) setParsedDate(data.date)
      if (data.title) setParsedTitle(data.title)
    } catch (e) {
      console.error('Lỗi AI OCR lịch ngày:', e)
      setError(e instanceof Error ? e.message : 'Lỗi nhận diện ảnh lịch ngày.')
    } finally {
      setOcrBusy(false)
    }
  }


  return (
    <div style={{ margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* ── Banner Upload ── */}
      <div
        style={{
          padding: '14px 18px',
          border: '1.5px solid #bae6fd',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
        }}
      >
        {/* Icon + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              flexShrink: 0,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '1px', color: '#0284c7', textTransform: 'uppercase', marginBottom: 2 }}>
              TỰ ĐỘNG HÓA · LỊCH KHÁM THEO NGÀY
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 1 }}>
              Upload file Excel lịch ngày → Tự động điền bảng phân công ca
            </div>
            <div style={{ fontSize: 11.5, color: '#475569' }}>
              Nhận diện chính xác 4 ca trực: <b>7-10 giờ</b>, <b>10-11 giờ</b>, <b>13-16 giờ</b>, <b>16-17 giờ</b> của từng Khoa/Phòng
            </div>
          </div>
        </div>

        {/* Nút tải mẫu */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <a
            href="/templates/lich-kham-ngay-mau.xlsx"
            download="lich-kham-ngay-mau.xlsx"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Tải mẫu Excel chuẩn
          </a>
        </div>
      </div>

      {/* ── Khu vực Upload ── */}
      <div
        style={{
          padding: '12px 16px',
          border: '1.5px dashed #7dd3fc',
          borderRadius: 10,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', flex: 1, minWidth: 0 }}>
          <b>Upload file Excel lịch ngày</b> — Hỗ trợ file .xlsx
        </span>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null)
            setError('')
            setAssignments(null)
            setApplied(false)
          }}
        />

        <div
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 7,
            border: '1.5px dashed #0284c7',
            background: '#fff',
            color: '#0284c7',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          📂 {file ? file.name : 'Chọn file Excel (.xlsx)'}
        </div>

        <button
          type="button"
          disabled={!file || busy}
          onClick={handleUpload}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 18px',
            borderRadius: 7,
            border: 0,
            background: file && !busy ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#e2e8f0',
            color: file && !busy ? '#fff' : '#94a3b8',
            fontSize: 12,
            fontWeight: 800,
            cursor: file && !busy ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
            boxShadow: file && !busy ? '0 2px 6px rgba(2, 132, 199, 0.2)' : 'none',
          }}
        >
          {busy ? '⏳ Đang đọc...' : '✓ Đọc & Import'}
        </button>
      </div>

      {/* ── AI SCAN ẢNH LỊCH NGÀY ── */}
      <div style={{
        padding: '14px 18px',
        border: '1.5px solid #a78bfa',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)',
      }}>
        {/* Icon + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(109, 40, 217, 0.3)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '1px', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 2 }}>
              AI OCR · QUÉT ẢNH LỊCH NGÀY
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 1 }}>
              Chụp / scan ảnh lịch ngày → AI tự nhận diện và điền bảng
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              Hỗ trợ ảnh chụp bảng lịch ngày • JPEG, PNG, WebP • Tối đa 8 MB
            </div>
          </div>
        </div>
      </div>

      {/* ── Chọn ảnh + Nút quét ── */}
      <div style={{
        padding: '12px 16px',
        border: '1.5px dashed #c4b5fd',
        borderRadius: 10,
        background: '#fdfcff',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', flex: 1, minWidth: 0 }}>
          <b>Chọn ảnh lịch ngày</b> — Hỗ trợ JPEG, PNG, WebP
        </span>

        <input
          ref={imgInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0] || null
            setImageFile(f)
            setError('')
            setAssignments(null)
            setApplied(false)
            if (f) {
              const url = URL.createObjectURL(f)
              setImagePreview(url)
            } else {
              setImagePreview(null)
            }
          }}
        />

        <div
          onClick={() => imgInputRef.current?.click()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 7,
            border: '1.5px dashed #7c3aed', background: '#fff',
            color: '#7c3aed', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', whiteSpace: 'nowrap',
            maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          🖼️ {imageFile ? imageFile.name : 'Chọn ảnh lịch ngày'}
        </div>

        <button
          type="button"
          disabled={!imageFile || ocrBusy}
          onClick={handleScanImage}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 18px', borderRadius: 7, border: 0,
            background: imageFile && !ocrBusy ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#e2e8f0',
            color: imageFile && !ocrBusy ? '#fff' : '#94a3b8',
            fontSize: 12, fontWeight: 800,
            cursor: imageFile && !ocrBusy ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap', transition: 'all 0.15s',
            boxShadow: imageFile && !ocrBusy ? '0 2px 6px rgba(109, 40, 217, 0.3)' : 'none',
          }}
        >
          {ocrBusy ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Đang quét...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Quét bằng AI
            </>
          )}
        </button>
      </div>

      {/* Preview ảnh đã chọn */}
      {imagePreview && !ocrBusy && !assignments && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
          <img
            src={imagePreview}
            alt="Xem trước ảnh lịch ngày"
            style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, border: '1px solid #ddd6fe', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* ── Lỗi nếu có ── */}
      {error && (

        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── Preview kết quả đọc được ── */}
      {assignments && assignments.length > 0 && (
        <div style={{ border: '1.5px solid #7dd3fc', borderRadius: 10, overflow: 'hidden', background: '#f0f9ff' }}>
          <div
            style={{
              padding: '10px 14px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 12.5, fontWeight: 800 }}>
                ✅ Đọc thành công {assignments.length} khoa/phòng
              </div>
              {parsedDate && (
                <div style={{ fontSize: 11, opacity: 0.9 }}>
                  Ngày phát hiện: <b>{parsedDate}</b>
                </div>
              )}
            </div>
            {!applied ? (
              <button
                type="button"
                onClick={handleApply}
                style={{
                  padding: '7px 18px',
                  borderRadius: 7,
                  border: 0,
                  background: '#fff',
                  color: '#0369a1',
                  fontSize: 11.5,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}
              >
                ✓ Điền vào bảng bên dưới
              </button>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#bae6fd',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '5px 12px',
                  borderRadius: 6,
                }}
              >
                ✓ Đã điền xong vào bảng!
              </span>
            )}
          </div>

          <div style={{ maxHeight: 200, overflowY: 'auto', padding: '8px 12px', fontSize: 11.5 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #bae6fd', textAlign: 'left', color: '#0369a1', fontWeight: 800 }}>
                  <th style={{ padding: '4px 6px' }}>Khoa / Phòng</th>
                  <th style={{ padding: '4px 6px' }}>07:00 - 10:00</th>
                  <th style={{ padding: '4px 6px' }}>10:00 - 11:00</th>
                  <th style={{ padding: '4px 6px' }}>13:00 - 16:00</th>
                  <th style={{ padding: '4px 6px' }}>16:00 - 17:00</th>
                </tr>
              </thead>
              <tbody>
                {assignments.slice(0, 10).map((a, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e0f2fe' }}>
                    <td style={{ padding: '4px 6px', fontWeight: 700, color: '#0f172a' }}>{a.departmentName}</td>
                    <td style={{ padding: '4px 6px', color: '#475569' }}>{a.morningDoctors || '–'}</td>
                    <td style={{ padding: '4px 6px', color: '#475569' }}>{a.noonDoctors || '–'}</td>
                    <td style={{ padding: '4px 6px', color: '#475569' }}>{a.afternoonDoctors || '–'}</td>
                    <td style={{ padding: '4px 6px', color: '#475569' }}>{a.eveningDoctors || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {assignments.length > 10 && (
              <div style={{ textAlign: 'center', padding: '6px', color: '#64748b', fontStyle: 'italic' }}>
                ... và {assignments.length - 10} khoa/phòng khác
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
