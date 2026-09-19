'use client'

import { useRef, useState } from 'react'
import { useForm } from '@payloadcms/ui'
import { parseNurseScheduleWorkbook, ParsedNurseAssignment } from '@/lib/nurseScheduleExcelParser'

export default function NurseTemplateDownload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [assignments, setAssignments] = useState<ParsedNurseAssignment[] | null>(null)
  const [parsedDate, setParsedDate] = useState<string | undefined>()
  const [parsedTitle, setParsedTitle] = useState<string | undefined>()
  const [generalNote, setGeneralNote] = useState<string | undefined>()
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
      const data = parseNurseScheduleWorkbook(workbook, file.name)

      if (!data.assignments || data.assignments.length === 0) {
        throw new Error('Không tìm thấy dữ liệu phân công trong file Excel. Vui lòng kiểm tra lại định dạng file.')
      }

      setAssignments(data.assignments)
      setParsedDate(data.date)
      setParsedTitle(data.title)
      setGeneralNote(data.generalNote)
    } catch (e) {
      console.error('Lỗi parse file Excel lịch điều dưỡng:', e)
      setError(e instanceof Error ? e.message : 'Lỗi xử lý file Excel.')
    } finally {
      setBusy(false)
    }
  }

  const handleApply = () => {
    if (!assignments || !dispatchFields) return

    // 0. Đảm bảo mode được chọn là nurse
    dispatchFields({
      type: 'UPDATE',
      path: 'mode',
      value: 'nurse',
    })

    // 1. Điền bảng Phân công ĐD - NHS theo Khoa/Phòng
    dispatchFields({
      type: 'UPDATE',
      path: 'nurseAssignments',
      value: assignments.map((a) => ({
        departmentName: a.departmentName,
        departmentIcon: a.departmentIcon,
        administrativeStaff: a.administrativeStaff,
        reinforcementStaff: a.reinforcementStaff,
        note: a.note || '',
      })),
    })

    // 2. Điền ngày nếu có
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

    // 4. Cập nhật ghi chú chung (nghỉ phép/công tác)
    if (generalNote) {
      dispatchFields({
        type: 'UPDATE',
        path: 'nurseGeneralNote',
        value: generalNote,
      })
    }

    setApplied(true)
  }

  // Quét ảnh lịch điều dưỡng bằng AI OCR (Gemini Vision)
  const handleScanImage = async () => {
    if (!imageFile || ocrBusy) return
    setOcrBusy(true)
    setError('')
    setAssignments(null)
    setApplied(false)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const res = await fetch('/api/ai-nurse-ocr', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Quét ảnh thất bại. Vui lòng kiểm tra lại ảnh hoặc cấu hình hệ thống.')
      }

      const data = json.data
      if (!data.assignments || data.assignments.length === 0) {
        throw new Error('AI không nhận diện được danh sách khoa/phòng trong ảnh. Vui lòng chụp rõ nét hơn.')
      }

      setAssignments(data.assignments)
      if (data.date) setParsedDate(data.date)
      if (data.title) setParsedTitle(data.title)
      if (data.generalNote) setGeneralNote(data.generalNote)
    } catch (e) {
      console.error('Lỗi AI OCR lịch điều dưỡng:', e)
      setError(e instanceof Error ? e.message : 'Lỗi nhận diện ảnh lịch điều dưỡng.')
    } finally {
      setOcrBusy(false)
    }
  }

  return (
    <div style={{ margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* ── Banner Thông tin & Tải mẫu ── */}
      <div
        style={{
          padding: '14px 18px',
          border: '1.5px solid #a7f3d0',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              flexShrink: 0,
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '1px', color: '#059669', textTransform: 'uppercase', marginBottom: 2 }}>
              TỰ ĐỘNG HÓA · LỊCH ĐIỀU DƯỠNG - NỮ HỘ SINH (ĐD - NHS)
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#064e3b', marginBottom: 1 }}>
              Import Excel hoặc Quét ảnh AI → Tự động trích xuất bảng phân công
            </div>
            <div style={{ fontSize: 11.5, color: '#047857' }}>
              Phân tách chuẩn 3 cột: <b>Khoa/Phòng</b>, ca <b>Hành chánh</b>, ca <b>Tăng cường</b> và <b>Ghi chú nghỉ phép</b>.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <a
            href="/templates/lich-dieu-duong-mau.xlsx"
            download="lich-dieu-duong-mau.xlsx"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Tải mẫu Excel ĐD - NHS
          </a>
        </div>
      </div>

      {/* ── Khu vực Upload Excel ── */}
      <div
        style={{
          padding: '12px 16px',
          border: '1.5px dashed #6ee7b7',
          borderRadius: 10,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', flex: 1, minWidth: 0 }}>
          <b>Upload file Excel lịch điều dưỡng</b> — Hỗ trợ file .xlsx
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
            border: '1.5px dashed #059669',
            background: '#fff',
            color: '#059669',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          📄 {file ? file.name : 'Chọn file Excel (.xlsx)'}
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
            background: file && !busy ? 'linear-gradient(135deg, #059669, #047857)' : '#e2e8f0',
            color: file && !busy ? '#fff' : '#94a3b8',
            fontSize: 12,
            fontWeight: 800,
            cursor: file && !busy ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
            boxShadow: file && !busy ? '0 2px 6px rgba(5, 150, 105, 0.3)' : 'none',
          }}
        >
          {busy ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Đang đọc file...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Đọc dữ liệu Excel
            </>
          )}
        </button>
      </div>

      {/* ── Khu vực Quét Ảnh AI (Gemini Vision) ── */}
      <div
        style={{
          padding: '12px 16px',
          border: '1.5px dashed #c084fc',
          borderRadius: 10,
          background: '#faf5ff',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#581c87' }}>
            <b>Quét ảnh lịch điều dưỡng bằng AI (Gemini Vision)</b> — Chụp ảnh bảng lịch in hoặc ảnh chụp Word
          </span>
        </div>

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
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 7,
            border: '1.5px dashed #9333ea',
            background: '#fff',
            color: '#9333ea',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          🖼️ {imageFile ? imageFile.name : 'Chọn ảnh lịch điều dưỡng'}
        </div>

        <button
          type="button"
          disabled={!imageFile || ocrBusy}
          onClick={handleScanImage}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 18px',
            borderRadius: 7,
            border: 0,
            background: imageFile && !ocrBusy ? 'linear-gradient(135deg, #9333ea, #7e22ce)' : '#e2e8f0',
            color: imageFile && !ocrBusy ? '#fff' : '#94a3b8',
            fontSize: 12,
            fontWeight: 800,
            cursor: imageFile && !ocrBusy ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
            boxShadow: imageFile && !ocrBusy ? '0 2px 6px rgba(147, 51, 234, 0.3)' : 'none',
          }}
        >
          {ocrBusy ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              AI đang quét ảnh...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              Quét bằng AI
            </>
          )}
        </button>
      </div>

      {/* Preview ảnh chụp */}
      {imagePreview && !ocrBusy && !assignments && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
          <img
            src={imagePreview}
            alt="Xem trước ảnh lịch điều dưỡng"
            style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, border: '1px solid #e9d5ff', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Thông báo lỗi */}
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

      {/* ── Bảng Xem trước kết quả (Preview) ── */}
      {assignments && assignments.length > 0 && (
        <div style={{ border: '1.5px solid #86efac', borderRadius: 10, overflow: 'hidden', background: '#f0fdf4' }}>
          <div
            style={{
              padding: '10px 14px',
              background: 'linear-gradient(135deg, #059669, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 12.5, fontWeight: 800 }}>
                ✅ Đã nhận diện thành công {assignments.length} Khoa / Phòng
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                {parsedDate && <span>Ngày: <b>{parsedDate}</b> · </span>}
                {parsedTitle && <span>Tiêu đề: <b>{parsedTitle}</b></span>}
              </div>
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
                  color: '#047857',
                  fontSize: 11.5,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  whiteSpace: 'nowrap',
                }}
              >
                ⬇️ ĐIỀN VÀO FORM LỊCH
              </button>
            ) : (
              <span style={{ color: '#dcfce7', fontSize: 11.5, fontWeight: 800 }}>
                ✓ Đã áp dụng vào form bên dưới! Nhớ bấm "Lưu thay đổi".
              </span>
            )}
          </div>

          {/* Danh sách khoa & điều dưỡng */}
          <div style={{ maxHeight: 240, overflowY: 'auto', padding: 8 }}>
            <table style={{ width: '100%', fontSize: 11.5, borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f0fdf4', borderBottom: '1.5px solid #bbf7d0', color: '#065f46' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', width: '25%' }}>KHOA / PHÒNG</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', width: '38%' }}>HÀNH CHÁNH</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', width: '37%' }}>TĂNG CƯỜNG</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0f172a' }}>
                      {row.departmentName}
                    </td>
                    <td style={{ padding: '6px 8px', color: '#334155', whiteSpace: 'pre-line' }}>
                      {row.administrativeStaff || <span style={{ color: '#94a3b8' }}>–</span>}
                    </td>
                    <td style={{ padding: '6px 8px', color: '#334155', whiteSpace: 'pre-line' }}>
                      {row.reinforcementStaff || <span style={{ color: '#94a3b8' }}>–</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {generalNote && (
            <div style={{ padding: '8px 12px', background: '#fef3c7', borderTop: '1px solid #fde68a', color: '#92400e', fontSize: 11.5, fontWeight: 600 }}>
              📌 {generalNote}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
