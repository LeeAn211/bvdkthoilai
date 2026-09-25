'use client'

import React, { useRef, useState } from 'react'
import { useAllFormFields, useForm } from '@payloadcms/ui'

type DayItem = {
  dayLabel: string
  dateFormatted: string
  morningContent: string
  afternoonContent: string
  note: string
}

const generateHexId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return `${timestamp}${randomHex}`
}

const switchToDetailTab = () => {
  setTimeout(() => {
    try {
      const tabButtons = document.querySelectorAll<HTMLButtonElement>('button.tabs-field__tab-button')
      for (const btn of Array.from(tabButtons)) {
        const text = btn.textContent || ''
        if (text.includes('Bảng chi tiết') || text.includes('Lịch tuần') || text.includes('Sáng / Chiều')) {
          btn.click()
          break
        }
      }
    } catch {
      // bỏ qua nếu DOM chưa sẵn sàng
    }
  }, 150)
}

export default function WorkScheduleAdminHelper() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [excelBusy, setExcelBusy] = useState(false)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [parsedData, setParsedData] = useState<any>(null)
  const [applied, setApplied] = useState(false)

  const [fields, dispatchFields] = useAllFormFields()
  const { getFields, setModified } = useForm()

  // Hàm cốt lõi: Nạp toàn bộ dữ liệu vào Form State chuẩn Payload CMS 3
  const applyDataToForm = (dataToApply: {
    title?: string
    displayMode?: string
    documentNumber?: string
    revision?: string
    weekNumber?: number | string
    year?: number | string
    startDate?: string
    endDate?: string
    generalNote?: string
    signerRole?: string
    signerName?: string
    days?: DayItem[]
  }) => {
    if (!dispatchFields) return

    const currentFields: Record<string, any> = typeof getFields === 'function' ? getFields() : fields || {}
    const nextState: Record<string, any> = {}

    // 1. Giữ lại tất cả các trường không thuộc array 'days' và không can thiệp vào 'id'
    for (const [key, val] of Object.entries(currentFields)) {
      if (!key.startsWith('days.') && key !== 'days' && key !== 'id') {
        nextState[key] = val
      }
    }
    delete nextState['id']

    // Luôn đảm bảo displayMode là 'table' để tab Bảng chi tiết Lịch tuần được hiển thị
    nextState['displayMode'] = {
      ...(currentFields['displayMode'] || {}),
      value: 'table',
      initialValue: 'table',
      valid: true,
      passesCondition: true,
      isModified: true,
    }

    // 2. Cập nhật các trường đơn cấp nếu có
    const setSingle = (path: string, val: any) => {
      if (val !== undefined && val !== null && val !== '') {
        nextState[path] = {
          ...(currentFields[path] || {}),
          value: val,
          initialValue: val,
          valid: true,
          passesCondition: true,
          isModified: true,
        }
      }
    }

    if (dataToApply.title) setSingle('title', dataToApply.title)
    if (dataToApply.documentNumber) setSingle('documentNumber', dataToApply.documentNumber)
    if (dataToApply.revision) setSingle('revision', dataToApply.revision)
    if (dataToApply.weekNumber) setSingle('weekNumber', Number(dataToApply.weekNumber))
    if (dataToApply.year) setSingle('year', Number(dataToApply.year))
    if (dataToApply.startDate) setSingle('startDate', dataToApply.startDate)
    if (dataToApply.endDate) setSingle('endDate', dataToApply.endDate)
    if (dataToApply.generalNote) setSingle('generalNote', dataToApply.generalNote)
    if (dataToApply.signerRole) setSingle('signerRole', dataToApply.signerRole)
    if (dataToApply.signerName) setSingle('signerName', dataToApply.signerName)

    // 3. Xử lý trường array 'days' theo đúng chuẩn state của Payload Array Field
    const daysList = dataToApply.days || []
    if (daysList.length > 0) {
      const rowMetadata = daysList.map((d, index) => {
        const rowId = generateHexId()
        const rowPath = `days.${index}`

        nextState[`${rowPath}.id`] = {
          value: rowId,
          initialValue: rowId,
          valid: true,
          passesCondition: true,
        }
        nextState[`${rowPath}.dayLabel`] = {
          value: d.dayLabel || `Thứ ${index + 2}`,
          initialValue: d.dayLabel || `Thứ ${index + 2}`,
          valid: true,
          passesCondition: true,
        }
        nextState[`${rowPath}.dateFormatted`] = {
          value: d.dateFormatted || '',
          initialValue: d.dateFormatted || '',
          valid: true,
          passesCondition: true,
        }
        nextState[`${rowPath}.morningContent`] = {
          value: d.morningContent || '',
          initialValue: d.morningContent || '',
          valid: true,
          passesCondition: true,
        }
        nextState[`${rowPath}.afternoonContent`] = {
          value: d.afternoonContent || '',
          initialValue: d.afternoonContent || '',
          valid: true,
          passesCondition: true,
        }
        nextState[`${rowPath}.note`] = {
          value: d.note || '',
          initialValue: d.note || '',
          valid: true,
          passesCondition: true,
        }

        return {
          id: rowId,
          isLoading: false,
        }
      })

      nextState['days'] = {
        ...(currentFields['days'] || {}),
        disableFormData: true,
        rows: rowMetadata,
        value: daysList.length,
        initialValue: daysList.length,
        valid: true,
        passesCondition: true,
      }
    }

    // 4. Dispatch REPLACE_STATE để áp dụng đồng bộ toàn bộ Form
    dispatchFields({
      type: 'REPLACE_STATE',
      state: nextState,
      optimize: false,
      sanitize: true,
    })

    // 5. Đánh dấu form đã thay đổi để bật nút Lưu thay đổi
    if (typeof setModified === 'function') {
      setModified(true)
    }

    setApplied(true)

    // 6. Tự động chuyển người dùng sang Tab 2 xem trực tiếp bảng lịch
    switchToDetailTab()
  }

  // Xử lý nạp dữ liệu từ File Excel (.xlsx / .xls)
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExcelFile(file)
    setExcelBusy(true)
    setError('')
    setSuccess('')
    setApplied(false)

    try {
      const { Workbook } = await import('exceljs')
      const arrayBuffer = await file.arrayBuffer()
      const workbook = new Workbook()
      await workbook.xlsx.load(arrayBuffer)

      const worksheet = workbook.worksheets[0]
      if (!worksheet) {
        throw new Error('File Excel không có dữ liệu sheet nào.')
      }

      const days: DayItem[] = []

      // Bỏ qua dòng tiêu đề (row 1), duyệt từ row 2 trở đi
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return // header
        const dayVal = String(row.getCell(1).value ?? '').trim()
        const dateVal = String(row.getCell(2).value ?? '').trim()
        const morningVal = String(row.getCell(3).value ?? '').trim()
        const afternoonVal = String(row.getCell(4).value ?? '').trim()
        const noteVal = String(row.getCell(5).value ?? '').trim()

        if (dayVal || morningVal || afternoonVal) {
          days.push({
            dayLabel: dayVal || `Thứ ${days.length + 2}`,
            dateFormatted: dateVal,
            morningContent: morningVal,
            afternoonContent: afternoonVal,
            note: noteVal,
          })
        }
      })

      if (days.length === 0) {
        throw new Error('Không tìm thấy dòng dữ liệu lịch công tác nào trong file Excel. Vui lòng sử dụng file theo đúng mẫu (.xlsx).')
      }

      // Tự động điền danh sách các ngày vào Form Payload CMS
      applyDataToForm({ days })

      setSuccess(`🎉 Đã đọc thành công ${days.length} ngày từ file Excel "${file.name}" và điền vào Form! Đang mở Tab Bảng chi tiết Lịch tuần để bạn kiểm tra.`)
    } catch (err) {
      console.error('Lỗi đọc Excel:', err)
      setError(err instanceof Error ? err.message : 'Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng file.')
    } finally {
      setExcelBusy(false)
      if (e.target) e.target.value = '' // reset input file
    }
  }

  // 1. Quét ảnh lịch bằng AI (Gemini Vision)
  const handleScanImage = async () => {
    if (!imageFile || ocrBusy) return
    setOcrBusy(true)
    setError('')
    setSuccess('')
    setParsedData(null)
    setApplied(false)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const res = await fetch('/api/ai-work-schedule-ocr', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Quét ảnh thất bại. Vui lòng kiểm tra lại ảnh hoặc cấu hình AI.')
      }

      setParsedData(json.data)
      const dayCount = Array.isArray(json.data?.days) ? json.data.days.length : 0
      setSuccess(`✨ Đã đọc và bóc tách thành công ${dayCount} ngày công tác từ ảnh! Bấm "Áp dụng vào Form ngay" để điền tự động.`)
    } catch (err) {
      console.error('Lỗi Quét ảnh AI:', err)
      setError(err instanceof Error ? err.message : 'Lỗi không xác định khi quét ảnh.')
    } finally {
      setOcrBusy(false)
    }
  }

  // 2. Áp dụng kết quả AI OCR vào Form Payload CMS
  const handleApplyToForm = () => {
    if (!parsedData) return
    applyDataToForm(parsedData)
    const dayCount = Array.isArray(parsedData.days) ? parsedData.days.length : 0
    setSuccess(`✅ Đã điền toàn bộ ${dayCount} ngày và thông tin công văn vào Form thành công!`)
  }

  // 3. Tải file mẫu Excel (.xlsx)
  const handleDownloadExcelTemplate = async () => {
    try {
      const { Workbook } = await import('exceljs')
      const workbook = new Workbook()
      const sheet = workbook.addWorksheet('Lịch công tác tuần')

      sheet.columns = [
        { header: 'Thứ', key: 'day', width: 14 },
        { header: 'Ngày', key: 'date', width: 14 },
        { header: 'Buổi Sáng', key: 'morning', width: 50 },
        { header: 'Buổi Chiều', key: 'afternoon', width: 50 },
        { header: 'Ghi chú', key: 'note', width: 25 },
      ]

      sheet.addRow({ day: 'Thứ hai', date: '(21/9/26)', morning: '', afternoon: '', note: '' })
      sheet.addRow({
        day: 'Thứ ba',
        date: '(22/9/26)',
        morning: '- 8h00: Ban giám đốc, phòng TCHC, P. KHTH... tiếp đoàn thẩm định SYT tại Hội trường',
        afternoon: '',
        note: '',
      })
      sheet.addRow({
        day: 'Thứ tư',
        date: '(23/9/26)',
        morning: '* Bs Thắng khám sức khỏe tại trường mầm non Cờ Đỏ (cả ngày)',
        afternoon: '13h00: Bs Hạnh, Bs Huy tham gia đoàn công tác tại BVĐKKV Cái Răng',
        note: '',
      })
      sheet.addRow({
        day: 'Thứ năm',
        date: '(24/9/26)',
        morning: '* Bs Thắng khám sức khỏe tại trường mầm non Cờ Đỏ (cả ngày)',
        afternoon: '',
        note: '',
      })
      sheet.addRow({ day: 'Thứ sáu', date: '(25/9/26)', morning: '', afternoon: '', note: '' })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Mau_Lich_Cong_Tac_Tuan_BVDK_Thoi_Lai.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Lỗi xuất Excel:', e)
      alert('Không thể tạo file Excel mẫu.')
    }
  }

  // 4. Tải file mẫu Word (.doc dạng XML HTML tương thích 100% Word)
  const handleDownloadWordTemplate = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Lịch công tác tuần</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid black; padding: 6px 8px; vertical-align: top; }
          th { font-weight: bold; text-align: center; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <table style="border:none; margin-bottom: 20px;">
          <tr style="border:none;">
            <td style="border:none; width: 45%; text-align: center;">
              <b>SỞ Y TẾ THÀNH PHỐ CẦN THƠ</b><br>
              <b>BVĐK KHU VỰC THỚI LAI</b><br>
              Số: 08/LLV - BVĐKKVTL
            </td>
            <td style="border:none; width: 55%; text-align: center;">
              <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
              <b><u>Độc lập – Tự do – Hạnh phúc</u></b><br><br>
              <i>Thới Lai, ngày 21 tháng 9 năm 2026</i>
            </td>
          </tr>
        </table>

        <div class="center">
          <h2 style="margin: 0; font-size: 15pt;">LỊCH CÔNG TÁC TUẦN</h2>
          <p style="margin: 4px 0 15px;"><b>( Từ ngày 21/9/2026 – 25/9/2026 )</b></p>
        </div>

        <table>
          <tr>
            <th style="width: 14%;">Thứ</th>
            <th style="width: 43%;">Sáng</th>
            <th style="width: 43%;">Chiều</th>
          </tr>
          <tr>
            <td class="center"><b>Thứ hai</b><br>(21/9/26)</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td class="center"><b>Thứ ba</b><br>(22/9/26)</td>
            <td>- 8h00: Ban giám đốc, phòng TCHC, P. KHTH, P. TCKT, K. DƯỢC và các bộ phận liên quan tiếp đoàn thẩm định giấy phép hoạt động SYT tại Hội trường giao ban</td>
            <td></td>
          </tr>
          <tr>
            <td class="center"><b>Thứ tư</b><br>(23/9/26)</td>
            <td>* Bs Thắng khám sức khỏe tại trường mầm non Cờ Đỏ (cả ngày)</td>
            <td>13h00: Bs Hạnh, Bs Huy tham gia đoàn công tác hỗ trợ chuyên môn kỹ thuật, hỗ trợ, kiểm tra... tại BVĐKKV Cái Răng</td>
          </tr>
          <tr>
            <td class="center"><b>Thứ năm</b><br>(24/9/26)</td>
            <td>* Bs Thắng khám sức khỏe tại trường mầm non Cờ Đỏ (cả ngày)</td>
            <td></td>
          </tr>
          <tr>
            <td class="center"><b>Thứ sáu</b><br>(25/9/26)</td>
            <td></td>
            <td></td>
          </tr>
        </table>

        <p style="margin-top: 15px;"><i><u>Ghi chú:</u> Tùy tình hình thực tế. Lịch làm việc này có thể thay đổi, Bệnh viện Đa khoa khu vực Thới Lai sẽ có thông báo sau./.</i></p>

        <table style="border:none; margin-top: 25px;">
          <tr style="border:none;">
            <td style="border:none; width: 50%;"></td>
            <td style="border:none; width: 50%; text-align: center;">
              <b>TL. GIÁM ĐỐC</b><br><br><br><br>
              <b>DSCKI. Dương Văn Bé</b>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Mau_Lich_Cong_Tac_Tuan_BVDK_Thoi_Lai.doc'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      border: '1.5px solid #bfdbfe',
      borderRadius: '12px',
      padding: '20px',
      margin: '16px 0 24px 0',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡ CÔNG CỤ HỖ TRỢ NHẬP LỊCH CÔNG TÁC NHANH</span>
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>
            Quét ảnh chụp lịch công tác bằng AI hoặc tải mẫu Excel / Word chuẩn quy cách bệnh viện.
          </p>
        </div>

        {/* Nút tải mẫu Excel & Word */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadExcelTemplate}
            style={{
              padding: '7px 12px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#065f46',
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📊 Tải mẫu Excel (.xlsx)
          </button>
          <button
            type="button"
            onClick={handleDownloadWordTemplate}
            style={{
              padding: '7px 12px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#1e40af',
              background: '#dbeafe',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📝 Tải mẫu Word (.doc)
          </button>
        </div>
      </div>

      {/* KHỐI 1: CHỌN & NẠP FILE EXCEL VÀO WEB */}
      <div style={{
        background: '#ffffff',
        border: '1.5px dashed #10b981',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>📗</span>
            <div>
              <b style={{ fontSize: '13.5px', color: '#065f46' }}>Nạp lịch công tác từ File Excel (.xlsx / .xls)</b>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Chọn file Excel theo mẫu đã điền sẵn để hệ thống tự động đưa lên lịch tuần trên web</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={excelInputRef}
              style={{ display: 'none' }}
              onChange={handleImportExcel}
            />
            <button
              type="button"
              disabled={excelBusy}
              onClick={() => excelInputRef.current?.click()}
              style={{
                padding: '7px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                background: excelBusy ? '#94a3b8' : '#059669',
                border: 'none',
                borderRadius: '6px',
                cursor: excelBusy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
              }}
            >
              {excelBusy ? '⏳ Đang đọc file Excel...' : '📂 Chọn file Excel để nạp lên web'}
            </button>
          </div>
        </div>

        {excelFile && (
          <div style={{ fontSize: '12px', color: '#047857', background: '#ecfdf5', padding: '6px 10px', borderRadius: '4px' }}>
            📄 File đã chọn: <b>{excelFile.name}</b> ({(excelFile.size / 1024).toFixed(0)} KB)
          </div>
        )}
      </div>

      {/* KHỐI 2: QUÉT ẢNH LỊCH BẰNG AI */}
      <div style={{
        background: '#ffffff',
        border: '1px dashed #3b82f6',
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <div>
              <b style={{ fontSize: '13.5px', color: '#1e293b' }}>Quét ảnh lịch bằng AI (Gemini Vision)</b>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Chọn ảnh chụp văn bản lịch tuần (như mẫu BVĐKKV Thới Lai) để AI tự bóc tách</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  setImageFile(f)
                  setImagePreview(URL.createObjectURL(f))
                  setError('')
                  setSuccess('')
                  setParsedData(null)
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2563eb',
                background: '#eff6ff',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {imageFile ? 'Đổi ảnh khác' : '📷 Chọn ảnh lịch...'}
            </button>

            {imageFile && (
              <button
                type="button"
                onClick={handleScanImage}
                disabled={ocrBusy}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: ocrBusy ? '#94a3b8' : '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: ocrBusy ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {ocrBusy ? '⏳ Đang quét AI...' : '🚀 Bắt đầu quét AI'}
              </button>
            )}
          </div>
        </div>

        {/* Xem trước ảnh đã chọn */}
        {imagePreview && (
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
            <img src={imagePreview} alt="Xem trước ảnh" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
            <div style={{ fontSize: '12px', color: '#475569' }}>
              <b>{imageFile?.name}</b> ({(Number(imageFile?.size) / 1024).toFixed(0)} KB)
            </div>
          </div>
        )}

        {/* Xem trước tóm tắt dữ liệu AI bóc tách được */}
        {parsedData && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '12.5px',
            color: '#334155',
          }}>
            <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>📋 Dữ liệu AI đã bóc tách được:</span>
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                {parsedData.days?.length || 0} ngày công tác
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
              {parsedData.title && <div><b>Tiêu đề:</b> {parsedData.title}</div>}
              {parsedData.weekNumber && <div><b>Tuần:</b> {parsedData.weekNumber}</div>}
              {parsedData.year && <div><b>Năm:</b> {parsedData.year}</div>}
              {parsedData.startDate && <div><b>Từ:</b> {parsedData.startDate}</div>}
              {parsedData.endDate && <div><b>Đến:</b> {parsedData.endDate}</div>}
            </div>
            {Array.isArray(parsedData.days) && parsedData.days.length > 0 && (
              <div style={{ maxHeight: '110px', overflowY: 'auto', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', padding: '6px 8px' }}>
                {parsedData.days.map((d: any, idx: number) => (
                  <div key={idx} style={{ fontSize: '11.5px', padding: '3px 0', borderBottom: idx < parsedData.days.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                    <b style={{ color: '#0369a1' }}>{d.dayLabel} {d.dateFormatted}:</b> {d.morningContent ? `[Sáng] ${d.morningContent.slice(0, 70)}... ` : ''}{d.afternoonContent ? `[Chiều] ${d.afternoonContent.slice(0, 70)}...` : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thông báo lỗi / thành công */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ fontWeight: 600 }}>{success}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {parsedData && (
                <button
                  type="button"
                  onClick={handleApplyToForm}
                  style={{
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: '#16a34a',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  ✍️ Áp dụng vào Form ngay
                </button>
              )}
              {applied && (
                <button
                  type="button"
                  onClick={switchToDetailTab}
                  style={{
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#1e40af',
                    background: '#dbeafe',
                    border: '1px solid #93c5fd',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  👉 Xem Bảng chi tiết Lịch tuần
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
