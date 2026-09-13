'use client'

import { useRef, useState } from 'react'
import { useForm } from '@payloadcms/ui'

type DeptSlot = {
  deptName: string
  subRole: string
  deptType: string
  day2: string; day3: string; day4: string
  day5: string; day6: string; day7: string; day8: string
  fixedStaff: string
  note: string
}

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

type Contact = {
  name: string
  phone: string
  type: string
  note?: string
}

export default function EmergencyTemplateDownload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [slots, setSlots] = useState<DeptSlot[] | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [generalNote, setGeneralNote] = useState('')
  const [weekDates, setWeekDates] = useState<{ start?: string; end?: string }>({})
  const [meta, setMeta] = useState<{ title?: string; weekLabel?: string; total?: number } | null>(null)
  const [error, setError] = useState('')
  const [applied, setApplied] = useState(false)

  const { dispatchFields } = useForm()

  const handleUpload = async () => {
    if (!file || busy) return
    setBusy(true); setError(''); setSlots(null); setApplied(false)
    try {
      // Đọc file trực tiếp tại trình duyệt bằng thư viện xlsx (siêu nhanh, không phụ thuộc API)
      const XLSX = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const { parseEmergencyWorkbook } = await import('@/lib/emergencyExcelParser')
      const data = parseEmergencyWorkbook(workbook, file.name)

      setSlots(data.slots || [])
      setContacts(data.contacts || [])
      setGeneralNote(data.generalNote || '')
      setWeekDates({ start: data.emergencyWeekStart, end: data.emergencyWeekEnd })
      setMeta({ title: data.title, weekLabel: data.weekLabel, total: data.total })
    } catch (e) {
      console.error('Lỗi parse file Excel:', e)
      setError(e instanceof Error ? e.message : 'Lỗi xử lý file Excel.')
    } finally {
      setBusy(false)
    }
  }

  const handleApply = () => {
    if (!slots || !dispatchFields) return

    // 1. Điền bảng Khoa/Bộ phận
    dispatchFields({
      type: 'UPDATE',
      path: 'weeklyDeptSlots',
      value: slots.map((s, i) => ({
        id: `imported-${i}`,
        deptName: s.deptName,
        subRole: s.subRole,
        deptType: s.deptType,
        day2: s.day2, day3: s.day3, day4: s.day4,
        day5: s.day5, day6: s.day6, day7: s.day7, day8: s.day8,
        fixedStaff: s.fixedStaff,
        note: s.note,
      })),
    })

    // 2. Điền ngày tuần nếu bóc tách được
    if (weekDates.start) {
      dispatchFields({
        type: 'UPDATE',
        path: 'emergencyWeekStart',
        value: weekDates.start,
      })
    }
    if (weekDates.end) {
      dispatchFields({
        type: 'UPDATE',
        path: 'emergencyWeekEnd',
        value: weekDates.end,
      })
    }

    // 3. Điền ghi chú chung
    if (generalNote) {
      dispatchFields({
        type: 'UPDATE',
        path: 'emergencyGeneralNote',
        value: generalNote,
      })
    }

    // 4. Điền danh bạ điện thoại trực & cấp cứu
    if (contacts.length > 0) {
      dispatchFields({
        type: 'UPDATE',
        path: 'emergencyContacts',
        value: contacts.map((c, i) => ({
          id: `contact-${i}`,
          name: c.name,
          phone: c.phone,
          type: c.type || 'internal',
          note: c.note || '',
        })),
      })
    }

    setApplied(true)
  }

  return (
    <div style={{ margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* ── Banner Upload ── */}
      <div style={{
        padding: '14px 18px',
        border: '1.5px solid #fca5a5', borderRadius: 12,
        background: 'linear-gradient(135deg, #fff1f2 0%, #fff8f8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
      }}>
        {/* Icon + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(220,38,38,0.25)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              <path d="M7 8h4" /><path d="M9 6v4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '1px', color: '#b91c1c', textTransform: 'uppercase', marginBottom: 2 }}>
              IMPORT TỰ ĐỘNG · LỊCH TRỰC THEO TUẦN
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 1 }}>
              Upload file Excel lịch trực → Tự điền toàn bộ bảng
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              Đọc đúng format <b>Khoa × 7 ngày</b> như file truc.xlsx của bạn
            </div>
          </div>
        </div>

        {/* Nút tải mẫu */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <a href="/templates/lich-truc-cap-cuu-mau.xlsx" download="lich-truc-mau.xlsx"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
              color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none',
              whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Tải mẫu Excel
          </a>
        </div>
      </div>

      {/* ── Khu vực Upload ── */}
      <div style={{
        padding: '12px 16px', border: '1.5px dashed #fca5a5', borderRadius: 10,
        background: '#fffbfb', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', flex: 1, minWidth: 0 }}>
          <b>Upload file Excel lịch trực</b> — Hỗ trợ .xlsx
        </span>

        <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
          onChange={e => { setFile(e.target.files?.[0] || null); setError(''); setSlots(null); setApplied(false) }} />

        <div onClick={() => inputRef.current?.click()} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 7,
          border: '1.5px dashed #fca5a5', background: '#fff',
          color: '#b91c1c', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          📂 {file ? file.name : 'Chọn file .xlsx'}
        </div>

        <button type="button" disabled={!file || busy} onClick={handleUpload}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 7, border: 0,
            background: file && !busy ? 'linear-gradient(135deg, #b91c1c, #dc2626)' : '#e2e8f0',
            color: file && !busy ? '#fff' : '#94a3b8',
            fontSize: 12, fontWeight: 800, cursor: file && !busy ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>
          {busy ? '⏳ Đang đọc...' : '✓ Đọc và Import'}
        </button>
      </div>

      {/* ── Lỗi ── */}
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: 12, fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Preview bảng Khoa × Ngày ── */}
      {slots && slots.length > 0 && (
        <div style={{ border: '1.5px solid #bbf7d0', borderRadius: 10, overflow: 'hidden', background: '#f0fdf4' }}>
          {/* Header */}
          <div style={{
            padding: '10px 14px', background: 'linear-gradient(135deg, #15803d, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>
                ✅ Đọc thành công — {slots.length} khoa/bộ phận
              </div>
              {meta?.weekLabel && <div style={{ fontSize: 10, opacity: 0.85 }}>{meta.weekLabel}</div>}
            </div>
            {!applied ? (
              <button type="button" onClick={handleApply}
                style={{
                  padding: '6px 16px', borderRadius: 7, border: 0,
                  background: '#fff', color: '#15803d',
                  fontSize: 11, fontWeight: 900, cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}>
                ✓ Điền vào bảng bên dưới
              </button>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 800, color: '#bbf7d0', background: 'rgba(0,0,0,0.15)', padding: '5px 12px', borderRadius: 6 }}>✓ Đã điền xong!</span>
            )}
          </div>

          {/* Bảng preview */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#dcfce7' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, color: '#15803d', borderBottom: '1px solid #bbf7d0', width: 130, minWidth: 110 }}>Khoa / Bộ phận</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, color: '#15803d', borderBottom: '1px solid #bbf7d0', width: 80 }}>Loại</th>
                  {DAY_LABELS.map(d => (
                    <th key={d} style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 800, color: '#15803d', borderBottom: '1px solid #bbf7d0', width: 70 }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f0fdf4' }}>
                    <td style={{ padding: '5px 8px', fontWeight: 700, color: '#166534', borderBottom: '1px solid #dcfce7', fontSize: 11 }}>
                      {slot.deptName}
                    </td>
                    <td style={{ padding: '5px 8px', color: '#6b7280', borderBottom: '1px solid #dcfce7', fontSize: 10 }}>
                      {slot.subRole || '–'}
                    </td>
                    {[slot.day2, slot.day3, slot.day4, slot.day5, slot.day6, slot.day7, slot.day8].map((d, di) => (
                      <td key={di} style={{ padding: '4px 6px', color: '#374151', borderBottom: '1px solid #dcfce7', verticalAlign: 'top', fontSize: 10, lineHeight: 1.4 }}>
                        {d ? d.split('\n').map((n, ni) => <div key={ni}>{n}</div>) : <span style={{ color: '#d1d5db' }}>–</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview danh bạ & ghi chú */}
          {(generalNote || contacts.length > 0) && (
            <div style={{ padding: '10px 14px', borderTop: '1px solid #bbf7d0', background: '#f0fdf4', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
              {generalNote && (
                <div style={{ color: '#166534' }}>
                  <b>📝 Ghi chú chung:</b> {generalNote}
                </div>
              )}
              {contacts.length > 0 && (
                <div style={{ color: '#166534' }}>
                  <b>📞 Danh bạ tìm thấy ({contacts.length}):</b>{' '}
                  {contacts.slice(0, 5).map(c => `${c.name}: ${c.phone}`).join(' · ')}
                  {contacts.length > 5 ? ` và ${contacts.length - 5} số khác...` : ''}
                </div>
              )}
            </div>
          )}

          {applied && (
            <div style={{ padding: '8px 14px', background: '#dcfce7', fontSize: 11, color: '#15803d', fontWeight: 700, textAlign: 'center' }}>
              ✅ Đã điền đầy đủ Bảng Khoa/Bộ phận, Ngày tuần, Ghi chú chung và Danh bạ điện thoại trực vào form! Kiểm tra rồi nhấn <b>Lưu</b>.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
