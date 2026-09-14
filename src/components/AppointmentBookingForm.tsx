'use client'

import QRCode from 'qrcode'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { TurnstileWidget } from './TurnstileWidget'
import styles from './AppointmentBookingForm.module.css'

interface SpecialtyOption {
  id: string | number
  name: string
}

interface DoctorOption {
  id: string | number
  name: string
  title?: string
  specialtyName?: string
}

interface CustomFieldConfig {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox'
  column?: 'left' | 'right'
  required?: boolean
  placeholder?: string
  options?: string
}

interface TimeSlotOption {
  label: string
  value: string
  isDefault?: boolean
}

const VIETNAMESE_TIME_SLOT_FALLBACKS: Record<string, string> = {
  morning: 'Buổi sáng (07:00 – 11:30)',
  afternoon: 'Buổi chiều (13:00 – 17:00)',
  anytime: 'Giờ hành chính',
}

interface Props {
  specialties: SpecialtyOption[]
  doctors?: DoctorOption[]
  settings?: {
    showEmail?: boolean
    showAddress?: boolean
    showInsurance?: boolean
    showDoctorSelect?: boolean
    showDob?: boolean
    showGender?: boolean
    showSymptoms?: boolean
    showTimeSlot?: boolean
    requireEmail?: boolean
    requireAddress?: boolean
    requireDob?: boolean
    requireSymptoms?: boolean
    hospitalGuidance?: string
    hotlineSupport?: string
    leftColumnTitle?: string
    rightColumnTitle?: string
    nameFieldLabel?: string
    nameFieldPlaceholder?: string
    phoneFieldLabel?: string
    phoneFieldPlaceholder?: string
    emailFieldLabel?: string
    emailFieldPlaceholder?: string
    addressFieldLabel?: string
    addressFieldPlaceholder?: string
    dobFieldLabel?: string
    genderFieldLabel?: string
    specialtyFieldLabel?: string
    specialtyFieldPlaceholder?: string
    doctorFieldLabel?: string
    appointmentDateFieldLabel?: string
    symptomsFieldLabel?: string
    symptomsFieldPlaceholder?: string
    timeSlotFieldLabel?: string
    insuranceFieldLabel?: string
    timeSlots?: TimeSlotOption[]
    customFields?: CustomFieldConfig[]
    submitButtonBg?: string
    submitButtonHoverBg?: string
    submitButtonTextColor?: string
    formBackground?: string
    inputBorderColor?: string
    inputFocusBorderColor?: string
    headingColor?: string
    labelColor?: string
    requiredStarColor?: string
    fontFamily?: string
    submitButtonText?: string
    inputBorderRadius?: number
    submitButtonRadius?: number
  }
}

export function AppointmentBookingForm({ specialties = [], doctors = [], settings = {} }: Props) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState<{
    code: string
    fullName: string
    appointmentDate: string
    timeSlot: string
    specialtyTitle?: string
    phone?: string
    qrDataUrl?: string
  } | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Ngày tối thiểu là ngày hôm nay theo múi giờ địa phương (YYYY-MM-DD)
  const localNow = new Date()
  const localYear = localNow.getFullYear()
  const localMonth = String(localNow.getMonth() + 1).padStart(2, '0')
  const localDay = String(localNow.getDate()).padStart(2, '0')
  const today = `${localYear}-${localMonth}-${localDay}`

  // Danh sách khung giờ khám (lấy từ cấu hình hoặc fallback mặc định)
  const timeSlots: TimeSlotOption[] =
    Array.isArray(settings.timeSlots) && settings.timeSlots.length > 0
      ? settings.timeSlots
      : [
          { label: 'Buổi sáng (07:00 – 11:30)', value: 'morning', isDefault: true },
          { label: 'Buổi chiều (13:00 – 17:00)', value: 'afternoon', isDefault: false },
        ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrorMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    // Kiểm tra ngày khám không được nhỏ hơn ngày hiện tại
    const chosenDate = String(payload.appointmentDate || '').trim()
    if (!chosenDate || chosenDate < today) {
      setState('error')
      setErrorMessage('Ngày đặt khám không được nhỏ hơn ngày hiện tại. Vui lòng chọn lại ngày hẹn khám phù hợp.')
      return
    }

    // Lấy tên hiển thị của chuyên khoa đã chọn
    if (payload.specialty) {
      const matched = specialties.find((s) => String(s.id) === String(payload.specialty))
      if (matched) {
        payload.specialtyTitle = matched.name
      } else {
        payload.specialtyTitle = String(payload.specialty)
      }
    }

    // Tìm và đính kèm tên nhãn tiếng Việt của khung giờ khám
    const selectedSlotValue = String(payload.timeSlot || '').trim()
    const matchedSlot = timeSlots.find((s) => s.value === selectedSlotValue || s.label === selectedSlotValue)
    const slotLabelVietnamese = matchedSlot
      ? matchedSlot.label
      : (VIETNAMESE_TIME_SLOT_FALLBACKS[selectedSlotValue] || selectedSlotValue || 'Buổi sáng (07:00 – 11:30)')
    payload.timeSlotLabel = slotLabelVietnamese
    // Ghi nhận chính xác thời điểm người dùng bấm nút đặt lịch (theo giờ máy người dùng)
    payload.submittedAt = new Date().toISOString()

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi đăng ký đặt khám. Vui lòng thử lại.')
      }

      // Xác định nhãn khung giờ hiển thị tiếng Việt
      const finalSlotDisplay =
        data.timeSlotLabel ||
        slotLabelVietnamese ||
        VIETNAMESE_TIME_SLOT_FALLBACKS[data.timeSlot] ||
        data.timeSlot

      // Tạo mã QR Code cho mã phiếu hẹn
      let qrCodeUrl = ''
      try {
        qrCodeUrl = await QRCode.toDataURL(data.code || 'BVTL', {
          width: 140,
          margin: 1,
          color: {
            dark: '#0369a1',
            light: '#ffffff',
          },
        })
      } catch (qrErr) {
        console.warn('Cannot generate QR code:', qrErr)
      }

      setState('success')
      setResult({
        code: data.code,
        fullName: data.fullName,
        appointmentDate: data.appointmentDate,
        timeSlot: finalSlotDisplay,
        specialtyTitle: payload.specialtyTitle ? String(payload.specialtyTitle) : undefined,
        phone: payload.phone ? String(payload.phone) : undefined,
        qrDataUrl: qrCodeUrl,
      })
      form.reset()
    } catch (err: any) {
      setState('error')
      setErrorMessage(err?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.')
    }
  }

  // Tùy biến CSS variables cho form
  const formStyle: CSSProperties = {
    '--form-bg': settings.formBackground || '#ffffff',
    '--input-border': settings.inputBorderColor || '#e2e8f0',
    '--input-focus-border': settings.inputFocusBorderColor || '#f472b6',
    '--input-radius': `${settings.inputBorderRadius ?? 8}px`,
    '--btn-bg': settings.submitButtonBg || '#0ea5e9',
    '--btn-hover-bg': settings.submitButtonHoverBg || '#0284c7',
    '--btn-text': settings.submitButtonTextColor || '#ffffff',
    '--btn-radius': `${settings.submitButtonRadius ?? 9999}px`,
    '--heading-color': settings.headingColor || '#1e293b',
    '--label-color': settings.labelColor || '#334155',
    '--star-color': settings.requiredStarColor || '#ef4444',
    fontFamily: settings.fontFamily && settings.fontFamily !== 'inherit' ? settings.fontFamily : undefined,
  } as CSSProperties

  const customFields = Array.isArray(settings.customFields) ? settings.customFields : []
  const leftCustomFields = customFields.filter((f) => f.column !== 'right')
  const rightCustomFields = customFields.filter((f) => f.column === 'right')

  const renderCustomField = (field: CustomFieldConfig) => {
    const isRequired = Boolean(field.required)
    const options = (field.options || '')
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean)

    if (field.type === 'checkbox') {
      return (
        <div className={styles.fieldGroup} key={field.name}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name={field.name} required={isRequired} className={styles.checkboxControl} />
            <span>
              {field.label} {isRequired && <span className={styles.required}>*</span>}
            </span>
          </label>
        </div>
      )
    }

    if (field.type === 'select') {
      return (
        <div className={styles.fieldGroup} key={field.name}>
          <label className={styles.fieldLabel}>
            {field.label} {isRequired && <span className={styles.required}>*</span>}
          </label>
          <select name={field.name} required={isRequired} className={styles.selectControl} defaultValue="">
            <option value="" disabled>
              {field.placeholder || `-- Chọn ${field.label} --`}
            </option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div className={styles.fieldGroup} key={field.name}>
          <label className={styles.fieldLabel}>
            {field.label} {isRequired && <span className={styles.required}>*</span>}
          </label>
          <textarea
            name={field.name}
            required={isRequired}
            rows={3}
            placeholder={field.placeholder || `Nhập ${field.label}...`}
            className={styles.textareaControl}
          />
        </div>
      )
    }

    return (
      <div className={styles.fieldGroup} key={field.name}>
        <label className={styles.fieldLabel}>
          {field.label} {isRequired && <span className={styles.required}>*</span>}
        </label>
        <input
          type={field.type || 'text'}
          name={field.name}
          required={isRequired}
          placeholder={field.placeholder || `Nhập ${field.label}...`}
          className={styles.inputControl}
        />
      </div>
    )
  }

  if (state === 'success' && result) {
    return (
      <div className={styles.successBox} style={formStyle}>
        <div className={styles.successIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h3 className={styles.successTitle}>Đăng ký đặt lịch khám thành công!</h3>
        <p className={styles.successDesc}>
          Cảm ơn quý khách <strong>{result.fullName}</strong> đã chủ động đăng ký khám tại <strong>Bệnh viện Đa khoa Khu vực Thới Lai</strong>.
        </p>

        <div className={styles.ticketCard}>
          <div className={styles.ticketHeader}>
            <span>PHIẾU HẸN KHÁM BỆNH</span>
            <span className={styles.ticketHospital}>BVĐK KV THỚI LAI</span>
          </div>
          <div className={styles.ticketBody}>
            <div className={styles.ticketFlex}>
              <div className={styles.ticketInfoCol}>
                <div className={styles.ticketCodeBox}>
                  <span className={styles.ticketCodeLabel}>MÃ PHIẾU HẸN CỦA QUÝ KHÁCH</span>
                  <span className={styles.ticketCode}>{result.code}</span>
                </div>
                <div className={styles.ticketMeta}>
                  <div>
                    <small>Ngày hẹn khám</small>
                    <strong>{result.appointmentDate.split('-').reverse().join('/')}</strong>
                  </div>
                  <div>
                    <small>Khung giờ</small>
                    <strong>{result.timeSlot}</strong>
                  </div>
                </div>
              </div>

              {result.qrDataUrl && (
                <div className={styles.ticketQrBox} title="Quét mã QR để đối soát thông tin phiếu hẹn tại viện">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.qrDataUrl}
                    alt={`Mã QR phiếu hẹn ${result.code}`}
                    width={110}
                    height={110}
                    className={styles.ticketQrImg}
                  />
                  <span className={styles.ticketQrText}>Quét tại quầy</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.guidanceBox}>
          <h4>📋 Lời dặn trước khi đến khám:</h4>
          <p>
            {settings.hospitalGuidance ||
              '• Vui lòng có mặt tại Quầy Tiếp đón trước giờ hẹn 15 phút.\n• Mang theo Căn cước công dân (hoặc VNeID mức 2) và thẻ BHYT (nếu có).\n• Xuất trình Mã phiếu hẹn trên để nhận số thứ tự tiếp đón ưu tiên.'}
          </p>
          <div className={styles.hotlineSupport}>
            Tổng đài hỗ trợ: <strong>{settings.hotlineSupport || '02923686115'}</strong>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.printBtn}
            disabled={isGeneratingImage}
            onClick={async () => {
              if (previewImage) return
              setIsGeneratingImage(true)
              try {
                // Tạo ảnh phiếu khám sắc nét trên canvas độ phân giải cao
                const canvas = document.createElement('canvas')
                const scale = 2
                canvas.width = 600 * scale
                canvas.height = 420 * scale
                const ctx = canvas.getContext('2d')
                if (!ctx) throw new Error('Cannot get canvas context')

                ctx.scale(scale, scale)

                // Hàm vẽ hình chữ nhật bo góc tương thích mọi trình duyệt
                const drawRoundRect = (
                  c: CanvasRenderingContext2D,
                  x: number,
                  y: number,
                  w: number,
                  h: number,
                  r: number
                ) => {
                  if (typeof c.roundRect === 'function') {
                    c.beginPath()
                    c.roundRect(x, y, w, h, r)
                  } else {
                    c.beginPath()
                    c.moveTo(x + r, y)
                    c.lineTo(x + w - r, y)
                    c.quadraticCurveTo(x + w, y, x + w, y + r)
                    c.lineTo(x + w, y + h - r)
                    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
                    c.lineTo(x + r, y + h)
                    c.quadraticCurveTo(x, y + h, x, y + h - r)
                    c.lineTo(x, y + r)
                    c.quadraticCurveTo(x, y, x + r, y)
                    c.closePath()
                  }
                }

                // 1. Nền phiếu khám thẻ y tế xanh chuyển sắc cao cấp
                const grad = ctx.createLinearGradient(0, 0, 600, 420)
                grad.addColorStop(0, '#0369a1')
                grad.addColorStop(1, '#075985')
                ctx.fillStyle = grad
                drawRoundRect(ctx, 0, 0, 600, 420, 20)
                ctx.fill()

                // Họa tiết viền y tế trang nhã
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
                ctx.lineWidth = 1.5
                ctx.stroke()

                // 2. Header
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 15px Arial, sans-serif'
                ctx.textAlign = 'left'
                ctx.fillText('PHIẾU HẸN KHÁM BỆNH', 28, 42)

                // Tag tên bệnh viện
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
                drawRoundRect(ctx, 420, 22, 152, 30, 6)
                ctx.fill()
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 12px Arial, sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText('BVĐK KV THỚI LAI', 496, 42)

                // Đường gạch đứt ngăn cách
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
                ctx.lineWidth = 1
                ctx.setLineDash([5, 5])
                ctx.beginPath()
                ctx.moveTo(28, 64)
                ctx.lineTo(572, 64)
                ctx.stroke()
                ctx.setLineDash([])

                // 3. Thông tin người bệnh & mã phiếu
                ctx.textAlign = 'left'
                ctx.fillStyle = '#bae6fd'
                ctx.font = 'bold 12px Arial, sans-serif'
                ctx.fillText('MÃ PHIẾU HẸN TIẾP ĐÓN', 28, 92)

                // Mã phiếu nổi bật
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 36px "Courier New", monospace, sans-serif'
                ctx.fillText(result.code, 28, 134)

                // Họ tên người bệnh
                ctx.fillStyle = '#e0f2fe'
                ctx.font = '13px Arial, sans-serif'
                ctx.fillText('Họ và tên người bệnh:', 28, 172)
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 17px Arial, sans-serif'
                ctx.fillText(result.fullName, 185, 172)

                // Số điện thoại (nếu có)
                if (result.phone) {
                  ctx.fillStyle = '#e0f2fe'
                  ctx.font = '13px Arial, sans-serif'
                  ctx.fillText('Số điện thoại:', 28, 202)
                  ctx.fillStyle = '#ffffff'
                  ctx.font = 'bold 15px Arial, sans-serif'
                  ctx.fillText(result.phone, 185, 202)
                }

                // Chuyên khoa đăng ký
                const specText = result.specialtyTitle || 'Khám Đa khoa / Theo chỉ định'
                ctx.fillStyle = '#e0f2fe'
                ctx.font = '13px Arial, sans-serif'
                ctx.fillText('Chuyên khoa:', 28, 232)
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 15px Arial, sans-serif'
                ctx.fillText(specText.length > 25 ? specText.slice(0, 24) + '...' : specText, 185, 232)

                // Ngày hẹn khám
                const dateVn = result.appointmentDate.split('-').reverse().join('/')
                ctx.fillStyle = '#e0f2fe'
                ctx.font = '13px Arial, sans-serif'
                ctx.fillText('Ngày hẹn khám:', 28, 264)
                ctx.fillStyle = '#fef08a' // Màu vàng nổi bật
                ctx.font = 'bold 17px Arial, sans-serif'
                ctx.fillText(dateVn, 185, 264)

                // Khung giờ
                ctx.fillStyle = '#e0f2fe'
                ctx.font = '13px Arial, sans-serif'
                ctx.fillText('Khung giờ:', 28, 296)
                ctx.fillStyle = '#ffffff'
                ctx.font = 'bold 15px Arial, sans-serif'
                ctx.fillText(result.timeSlot, 185, 296)

                // 4. Vẽ Khối QR Code bên phải
                if (result.qrDataUrl) {
                  await new Promise<void>((resolve) => {
                    const qrImg = new Image()
                    qrImg.onload = () => {
                      // Khung nền trắng bo góc cho QR
                      ctx.fillStyle = '#ffffff'
                      drawRoundRect(ctx, 415, 85, 155, 185, 12)
                      ctx.fill()

                      // Ảnh QR
                      ctx.drawImage(qrImg, 425, 95, 135, 135)

                      // Chữ hướng dẫn bên dưới QR
                      ctx.fillStyle = '#0369a1'
                      ctx.font = 'bold 11px Arial, sans-serif'
                      ctx.textAlign = 'center'
                      ctx.fillText('QUÉT TẠI QUẦY', 492, 252)
                      resolve()
                    }
                    qrImg.onerror = () => resolve()
                    qrImg.src = result.qrDataUrl!
                  })
                }

                // 5. Chân phiếu dặn dò
                ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
                drawRoundRect(ctx, 24, 335, 552, 65, 10)
                ctx.fill()

                ctx.textAlign = 'left'
                ctx.fillStyle = '#f8fafc'
                ctx.font = '12px Arial, sans-serif'
                ctx.fillText('• Quý khách vui lòng có mặt trước giờ hẹn 15 phút tại Quầy Tiếp đón.', 38, 357)
                ctx.fillText('• Xuất trình ảnh phiếu này hoặc mã QR để nhận số thứ tự ưu tiên khám.', 38, 380)

                const dataUrl = canvas.toDataURL('image/png')
                setPreviewImage(dataUrl)
              } catch (e: any) {
                console.error('Error creating ticket image:', e)
                alert('Không thể tạo ảnh phiếu khám: ' + (e?.message || 'Vui lòng thử lại'))
              } finally {
                setIsGeneratingImage(false)
              }
            }}
          >
            {isGeneratingImage ? '⏳ Đang tạo ảnh...' : '🖨️ In phiếu khám (Xem & Tải ảnh)'}
          </button>
          <button type="button" className={styles.newBookingBtn} onClick={() => setState('idle')}>
            ➕ Đặt thêm lịch hẹn khác
          </button>
        </div>

        {/* MODAL HIỂN THỊ ẢNH PHIẾU KHÁM ĐỂ NGƯỜI DÙNG TẢI VỀ */}
        {previewImage && (
          <div className={styles.modalOverlay} onClick={() => setPreviewImage(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>📸 Ảnh Phiếu Khám Bệnh — {result.code}</h3>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setPreviewImage(null)}
                  title="Đóng cửa sổ"
                >
                  ✕
                </button>
              </div>
              <div className={styles.modalBody}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt={`Phiếu khám bệnh ${result.code}`}
                  className={styles.ticketImgPreview}
                />
              </div>
              <div className={styles.modalFooter}>
                <a
                  href={previewImage}
                  download={`phieu-kham-${result.code}.png`}
                  className={styles.downloadBtn}
                >
                  📥 Bấm Tải ảnh về máy
                </a>
                <button
                  type="button"
                  className={styles.closeModalBtn}
                  onClick={() => setPreviewImage(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <form className={styles.bookingForm} style={formStyle} onSubmit={handleSubmit}>
      {/* Honeypot chống bot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className={styles.honeypot} />

      <div className={styles.formColumns}>
        {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG */}
        <div className={styles.formColumn}>
          <h3 className={styles.columnHeading}>{settings.leftColumnTitle || 'Thông tin khách hàng'}</h3>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {settings.nameFieldLabel || 'Họ và tên'} <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder={settings.nameFieldPlaceholder || 'Họ và tên'}
              className={styles.inputControl}
            />
          </div>

          {settings.showEmail !== false && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                {settings.emailFieldLabel || 'Email'} {settings.requireEmail && <span className={styles.required}>*</span>}
              </label>
              <input
                type="email"
                name="email"
                required={settings.requireEmail}
                placeholder={settings.emailFieldPlaceholder || 'Email'}
                className={styles.inputControl}
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {settings.phoneFieldLabel || 'Số điện thoại'} <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder={settings.phoneFieldPlaceholder || 'Số điện thoại'}
              className={styles.inputControl}
            />
          </div>

          {settings.showAddress !== false && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                {settings.addressFieldLabel || 'Địa chỉ'} {settings.requireAddress && <span className={styles.required}>*</span>}
              </label>
              <input
                type="text"
                name="address"
                required={settings.requireAddress}
                placeholder={settings.addressFieldPlaceholder || 'Địa chỉ'}
                className={styles.inputControl}
              />
            </div>
          )}

          {settings.showInsurance && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{settings.insuranceFieldLabel || 'Mã số thẻ BHYT (nếu có)'}</label>
              <input
                type="text"
                name="insuranceNumber"
                placeholder="VD: GD479..."
                className={styles.inputControl}
              />
            </div>
          )}

          {settings.showDob !== false && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                {settings.dobFieldLabel || 'Ngày sinh'} {settings.requireDob && <span className={styles.required}>*</span>}
              </label>
              <input
                type="date"
                name="dob"
                required={settings.requireDob}
                className={styles.inputControl}
                placeholder="dd/mm/yyyy"
              />
            </div>
          )}

          {settings.showGender !== false && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{settings.genderFieldLabel || 'Giới tính'}</label>
              <div className={styles.genderOptions}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="gender" value="male" defaultChecked className={styles.radioControl} />
                  <span>Nam</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="gender" value="female" className={styles.radioControl} />
                  <span>Nữ</span>
                </label>
              </div>
            </div>
          )}

          {/* Render các trường tùy biến bên cột trái */}
          {leftCustomFields.map(renderCustomField)}
        </div>

        {/* CỘT PHẢI: CHUYÊN KHOA & HẸN KHÁM */}
        <div className={styles.formColumn}>
          <h3 className={styles.columnHeading}>{settings.rightColumnTitle || 'Chuyên khoa'}</h3>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {settings.specialtyFieldLabel || 'Chuyên khoa'} <span className={styles.required}>*</span>
            </label>
            <select name="specialty" required className={styles.selectControl} defaultValue="">
              <option value="" disabled>
                {settings.specialtyFieldPlaceholder || '-- Chọn chuyên khoa --'}
              </option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {settings.showDoctorSelect && doctors.length > 0 && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{settings.doctorFieldLabel || 'Bác sĩ mong muốn khám (tùy chọn)'}</label>
              <select name="doctor" className={styles.selectControl} defaultValue="">
                <option value="">-- Bất kỳ bác sĩ trực --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title ? `${doc.title} ${doc.name}` : doc.name} {doc.specialtyName ? `(${doc.specialtyName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {settings.showSymptoms !== false && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                {settings.symptomsFieldLabel || 'Thông tin bổ sung'} {settings.requireSymptoms && <span className={styles.required}>*</span>}
              </label>
              <textarea
                name="symptoms"
                required={settings.requireSymptoms}
                rows={4}
                placeholder={settings.symptomsFieldPlaceholder || 'Thông tin bổ sung (mô tả triệu chứng, bệnh nền, tiền sử dị ứng nếu có...)'}
                className={styles.textareaControl}
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {settings.appointmentDateFieldLabel || 'Ngày khám'} <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              name="appointmentDate"
              required
              min={today}
              className={styles.inputControl}
              placeholder="dd/mm/yyyy"
            />
          </div>

          {settings.showTimeSlot !== false && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{settings.timeSlotFieldLabel || 'Khung giờ khám'}</label>
              <div className={styles.timeSlotOptions}>
                {timeSlots.map((slot, idx) => (
                  <label className={styles.radioCard} key={slot.value || idx}>
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.value}
                      defaultChecked={Boolean(slot.isDefault) || idx === 0}
                    />
                    <span>{slot.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Render các trường tùy biến bên cột phải */}
          {rightCustomFields.map(renderCustomField)}

          <div className={styles.submitSection}>
            <TurnstileWidget />

            {state === 'error' && (
              <div className={styles.errorAlert}>
                ⚠️ {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className={styles.submitButton}
            >
              {state === 'submitting' ? 'Đang gửi đăng ký…' : (settings.submitButtonText || 'Đăng ký')}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
