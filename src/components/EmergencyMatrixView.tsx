'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { getVisibilityClass, shouldRender } from '@/lib/deviceVisibility'

export type DeptSlot = {
  deptName?: string
  subRole?: string
  deptType?: string
  day2?: string
  day3?: string
  day4?: string
  day5?: string
  day6?: string
  day7?: string
  day8?: string
  fixedStaff?: string
  note?: string
}

type Props = {
  title?: string
  weekStart?: string
  weekEnd?: string
  weekLabel?: string
  slots: DeptSlot[]
  emergencyPhone?: string
  excelUrl?: string
  generalNote?: string
  contacts?: Array<{ name: string; phone: string; type?: string; note?: string }>
  displaySettings?: any
}

const DAY_KEYS = ['2', '3', '4', '5', '6', '7', '8'] as const
const DAY_HEADERS: Record<string, { full: string; short: string }> = {
  '2': { full: 'Thứ Hai', short: 'T2' },
  '3': { full: 'Thứ Ba', short: 'T3' },
  '4': { full: 'Thứ Tư', short: 'T4' },
  '5': { full: 'Thứ Năm', short: 'T5' },
  '6': { full: 'Thứ Sáu', short: 'T6' },
  '7': { full: 'Thứ Bảy', short: 'T7' },
  '8': { full: 'Chủ Nhật', short: 'CN' },
}

// Icon cho từng chuyên khoa / bộ phận giống lịch khám ngày
function renderDeptIcon(deptName?: string, subRole?: string) {
  const norm = ((deptName || '') + ' ' + (subRole || '')).toUpperCase()
  if (norm.includes('LÃNH ĐẠO') || norm.includes('GIÁM ĐỐC')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }
  if (norm.includes('CẤP CỨU')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
        <path d="M7 8h4" /><path d="M9 6v4" />
      </svg>
    )
  }
  if (norm.includes('SẢN')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.5 1.5.5 2 0" />
        <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
      </svg>
    )
  }
  if (norm.includes('NỘI') || norm.includes('NHI')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
      </svg>
    )
  }
  if (norm.includes('DƯỢC')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 11-4-7" /><path d="M4 11h16a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8 8 8 0 0 1-8-8v-1a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }
  if (norm.includes('CẬN LÂM SÀNG') || norm.includes('XÉT NGHIỆM')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  }
  if (norm.includes('X QUANG') || norm.includes('SIÊU ÂM')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M6 10h2l2-4 3 8 2-4h3" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
      </svg>
    )
  }
  if (norm.includes('TÀI XẾ')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v6" /><path d="M12 15v6" /><path d="M3 12h6" /><path d="M15 12h6" />
      </svg>
    )
  }
  if (norm.includes('VIỆN PHÍ')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  }
  if (norm.includes('ĐIỆN') || norm.includes('NƯỚC')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  }
  if (norm.includes('IT') || norm.includes('CNTT') || norm.includes('CÔNG NGHỆ THÔNG TIN')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  }
  if (norm.includes('KSNK') || norm.includes('KIỂM SOÁT NHIỄM KHUẨN') || norm.includes('NHIỄM KHUẨN')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  )
}

// Helper trích xuất thông tin lãnh đạo trực gộp 1 ô
function parseLeaderMerged(raw: string) {
  let phone = ''
  const phoneMatch = raw.match(/(?:SĐT|SDT|ĐT|DT|Tel)[:\s*]*([0-9\s.]+)/i) || raw.match(/([0-9]{9,11})/)
  if (phoneMatch) {
    phone = phoneMatch[1].trim()
  }

  let cleanName = raw
    .replace(/\(?Thường\s*Trực[^\)]*\)?/gi, '')
    .replace(/(?:SĐT|SDT|ĐT|DT|Tel)[:\s*]*[0-9\s.]+/gi, '')
    .replace(/\*+/g, ' ')
    .replace(/[()]/g, ' ')
    .trim()

  return { name: cleanName || raw, phone, original: raw }
}

export function EmergencyMatrixView({
  title,
  weekStart,
  weekEnd,
  weekLabel,
  slots,
  emergencyPhone = '0292 3686 115',
  excelUrl,
  generalNote,
  contacts,
  displaySettings,
}: Props) {
  const printBtnVis = displaySettings?.emergencyPrintBtn || 'desktop_only'
  const contactsVis = displaySettings?.emergencyContacts || 'both'
  const generalNoteVis = displaySettings?.emergencyGeneralNote || 'both'
  // todayDayKey: chỉ set trên client để tránh SSR/hydration mismatch với new Date()
  const [todayDayKey, setTodayDayKey] = useState<string | null>(null)
  useEffect(() => {
    const today = new Date()
    if (weekStart && weekEnd) {
      const s = new Date(weekStart)
      s.setHours(0, 0, 0, 0)
      const e = new Date(weekEnd)
      e.setHours(23, 59, 59, 999)
      if (today < s || today > e) {
        setTodayDayKey(null)
        return
      }
    }
    const day = today.getDay()
    setTodayDayKey(day === 0 ? '8' : String(day + 1))
  }, [weekStart, weekEnd])

  // Tính ngày thực tế tương ứng với Thứ Hai (dayKey = '2') -> Chủ Nhật (dayKey = '8')
  const dayDateMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (!weekStart) return map

    const startDate = new Date(weekStart)
    if (isNaN(startDate.getTime())) return map

    // Thứ Hai luôn là mốc bắt đầu của tuần trực
    DAY_KEYS.forEach((key, idx) => {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + idx)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      map[key] = `${day}/${month}`
    })

    return map
  }, [weekStart])

  // Kiểm tra hàng thường trực gộp (nếu các ngày giống nhau hoặc có chữ thường trực/24/24)
  const getPermanentRowInfo = (slot: DeptSlot) => {
    const name = (slot.deptName || '').toUpperCase()
    const isLeadership = name.includes('LÃNH ĐẠO') || name.includes('GIÁM ĐỐC') || name.includes('BAN GIÁM ĐỐC')
    const isIT = name.includes('IT') || name.includes('CNTT') || name.includes('CÔNG NGHỆ THÔNG TIN')
    
    // Nếu có chữ THƯỜNG TRỰC hoặc 24/24 trong tên khoa
    const hasPermanentKeyword = name.includes('THƯỜNG TRỰC') || name.includes('24/24') || name.includes('24/7')

    const days = [slot.day2, slot.day3, slot.day4, slot.day5, slot.day6, slot.day7, slot.day8].map((d) => (d || '').trim())
    const first = days[0]
    const allDaysSame = Boolean(first && days.every((d) => d === first))

    const isPermanent = hasPermanentKeyword || allDaysSame

    let tagTitle = 'THƯỜNG TRỰC'
    if (isIT) {
      tagTitle = 'THƯỜNG TRỰC IT'
    } else if (isLeadership) {
      tagTitle = 'THƯỜNG TRỰC BAN GIÁM ĐỐC (24/7)'
    } else {
      tagTitle = `THƯỜNG TRỰC ${slot.deptName?.toUpperCase() || ''}`.trim()
    }

    return {
      isPermanent,
      isIT,
      isLeadership,
      tagTitle,
    }
  }

  // Phân loại chế độ hiển thị của từng hàng khoa (chỉ gọi khi isPermanent=false):
  //
  // NHÓM TRÊN (daily) - chia từng ngày riêng lẻ:
  //   Những row có dữ liệu ở nhiều ngày giữa tuần (day3, day4 đều có nội dung)
  //   Hoặc các bộ phận như ĐIỆN NƯỚC, TÀI XẾ, VIỆN PHÍ, LÃNH ĐẠO, CẤP CỨU TỔNG HỢP...
  //   → T2, T3, T4, T5, T6, T7, CN hiển thị riêng, không gộp lại khi các ngày trống
  //
  // NHÓM DƯỚI - gộp ô (chỉ áp dụng từ Nội – Nhi – ĐY, Khám, Cấp Cứu TH nhóm dưới trở xuống):
  //   - Nội-Nhi-ĐY / Khám / Cấp Cứu TH → split3_3: [T2-T4] | [T5-T7] | CN
  //   - Các khoa phòng còn lại        → merge_all: [T2-T7] | CN
  const getRowMergeMode = (slot: DeptSlot): 'daily' | 'split3_3' | 'merge_all' => {
    const name = (slot.deptName || '').trim()
    const nameUpper = name.toUpperCase()
    const sub  = (slot.subRole  || '').toUpperCase()
    const combined = nameUpper + ' ' + sub

    // Các bộ phận đặc thù luôn hiển thị theo từng ngày riêng lẻ (T2 -> CN), tuyệt đối không gộp ô:
    // ĐIỆN NƯỚC, TÀI XẾ, VIỆN PHÍ, X QUANG, CẬN LÂM SÀNG, DƯỢC, SẢN, NỘI - NHI (nhóm trên), LÃNH ĐẠO
    if (
      nameUpper.includes('ĐIỆN') ||
      nameUpper.includes('NƯỚC') ||
      nameUpper.includes('DIEN') ||
      nameUpper.includes('NUOC') ||
      nameUpper.includes('TÀI XẾ') ||
      nameUpper.includes('TAI XE') ||
      nameUpper.includes('VIỆN PHÍ') ||
      nameUpper.includes('VIEN PHI')
    ) {
      return 'daily'
    }

    // --- Phân biệt nhóm trên vs nhóm dưới bằng dữ liệu: ---
    // Nhóm dưới: day3 và day4 đều rỗng (dữ liệu gộp vào day2=T2-T4, day5=T5-T7)
    const day3Empty = !(slot.day3 || '').trim()
    const day4Empty = !(slot.day4 || '').trim()
    const isBottomGroup = day3Empty && day4Empty

    if (!isBottomGroup) {
      // Nhóm trên: từng ngày riêng lẻ
      return 'daily'
    }

    // Nhóm dưới: xác định split3_3 hay merge_all
    const isSplit3 =
      combined.includes('NỘI') ||
      combined.includes('NHI') ||
      combined.includes('ĐY') ||
      combined.includes('D.Y') ||
      combined.includes('ĐÔNG Y') ||
      combined.includes('KHÁM') ||
      combined.includes('KHAM') ||
      combined.includes('CẤP CỨU') ||
      combined.includes('CAP CUU')
    if (isSplit3) return 'split3_3'

    return 'merge_all'
  }

  // Helper lấy icon cho chip bác sĩ/nhân sự theo khoa và vai trò
  const renderDoctorChipIcon = (deptName?: string, subRole?: string, isLeaderRow?: boolean) => {
    const isNurse = (subRole || '').toUpperCase().includes('ĐIỀU DƯỠNG') || (subRole || '').toUpperCase().includes('DIEU DUONG')
    if (isLeaderRow) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    }

    if (isNurse) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )
    }

    const norm = ((deptName || '') + ' ' + (subRole || '')).toUpperCase()
    if (norm.includes('NỘI') || norm.includes('NHI')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
        </svg>
      )
    }
    if (norm.includes('SẢN')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.5 1.5.5 2 0" />
          <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
        </svg>
      )
    }
    if (norm.includes('DƯỢC')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 11-4-7" /><path d="M4 11h16a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8 8 8 0 0 1-8-8v-1a1 1 0 0 1 1-1Z" />
        </svg>
      )
    }
    if (norm.includes('CẬN LÂM SÀNG') || norm.includes('XÉT NGHIỆM')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        </svg>
      )
    }
    if (norm.includes('X QUANG') || norm.includes('SIÊU ÂM')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M6 10h2l2-4 3 8 2-4h3" />
        </svg>
      )
    }
    if (norm.includes('TÀI XẾ') || norm.includes('LÁI XE')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v6" /><path d="M12 15v6" /><path d="M3 12h6" /><path d="M15 12h6" />
        </svg>
      )
    }
    if (norm.includes('VIỆN PHÍ') || norm.includes('THU NGÂN')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    }
    if (norm.includes('ĐIỆN') || norm.includes('NƯỚC')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    }
    if (norm.includes('CẤP CỨU')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 17 16 17 16 8" />
          <circle cx="5.5" cy="19.5" r="2" />
          <circle cx="18.5" cy="19.5" r="2" />
        </svg>
      )
    }
    if (norm.includes('IT') || norm.includes('CNTT') || norm.includes('CÔNG NGHỆ THÔNG TIN')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    }
    if (norm.includes('KSNK') || norm.includes('KIỂM SOÁT NHIỄM KHUẨN') || norm.includes('NHIỄM KHUẨN')) {
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    }

    // Mặc định ống nghe y tế
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    )
  }

  // Render chip nhân sự theo ngày giống dailyDoctorChip của lịch khám ngày
  const renderStaffChips = (text?: string, isLeaderRow?: boolean, subRole?: string, deptName?: string) => {
    if (!text || !text.trim() || text.trim() === '-') {
      return <span className="emergCellEmpty">–</span>
    }

    const names = text
      .split(/[,;\n/]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (names.length === 0) {
      return <span className="emergCellEmpty">–</span>
    }

    const isNurse = (subRole || '').toUpperCase().includes('ĐIỀU DƯỠNG') || (subRole || '').toUpperCase().includes('DIEU DUONG')

    return (
      <div className="emergDoctorChipList">
        {names.map((name, idx) => (
          <div
            key={idx}
            className={`emergDoctorChip ${isLeaderRow ? 'chip-leader' : isNurse ? 'chip-nurse' : 'chip-default'}`}
            title={name}
          >
            <span className="emergDoctorChipIcon">
              {renderDoctorChipIcon(deptName, subRole, isLeaderRow)}
            </span>
            <strong className="emergDoctorChipName">{name}</strong>
          </div>
        ))}
      </div>
    )
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  return (
    <section className="emergPosterShell" id="printable-schedule">
      {/* ── 1. MASTHEAD TINH GỌN CHUẨN NHƯ LỊCH BÁC SĨ KHÁM NGÀY ── */}
      <header className="emergMastheadClassic">
        <div className="emergMastheadBox">
          <div className="emergRibbon">
            <h2>LỊCH PHÂN CÔNG TRỰC TUẦN</h2>
          </div>
          {weekLabel && (
            <div className="emergDateBadge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{weekLabel}</span>
            </div>
          )}
        </div>

        {/* Nút in nhanh tiện ích */}
        {shouldRender(printBtnVis) && (
          <div className={`emergMastheadTools ${getVisibilityClass(printBtnVis)}`}>
            <button type="button" onClick={handlePrint} className="emergPrintBtnQuick">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>In lịch trực</span>
            </button>
          </div>
        )}
      </header>

      {/* ── 2. BẢNG MA TRẬN PHÂN CÔNG CHÍNH QUY ── */}
      <div className="emergTableWrapper">
        <table className="emergMatrixTable">
          <thead>
            <tr>
              <th className="emergColDeptHeader">
                <div className="emergThDeptInner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2" />
                  </svg>
                  <span>KHOA / BỘ PHẬN</span>
                </div>
              </th>
              {DAY_KEYS.map((key) => {
                const isToday = todayDayKey === key
                const header = DAY_HEADERS[key]
                const actualDate = dayDateMap[key]
                return (
                  <th key={key} className={`emergColDayHeader ${isToday ? 'isTodayCol' : ''}`}>
                    <div className="emergThDayInner">
                      <strong className="emergDayFullName">{header.full}</strong>
                      {actualDate ? (
                        <span className="emergDayDateActual">{actualDate}</span>
                      ) : (
                        <span className="emergDayShortName">({header.short})</span>
                      )}
                      {isToday && <span className="emergTodayIndicator">● Hôm nay</span>}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {slots
              .filter((slot) => {
                // Nếu tất cả các ngày từ T2 đến CN đều trống (hoặc chỉ có '-') thì ẩn hàng
                const days = [slot.day2, slot.day3, slot.day4, slot.day5, slot.day6, slot.day7, slot.day8]
                const hasAnyData = days.some((d) => {
                  const val = (d || '').trim()
                  return val.length > 0 && val !== '-' && val !== '–'
                })
                return hasAnyData
              })
              .map((slot, rIdx) => {
                const permInfo = getPermanentRowInfo(slot)
                const isPermanent = permInfo.isPermanent
                // isLeaderNormal: chỉ true cho LASNH ĐẠO/GIÁM ĐỐC không phải hàng permanent
                const isLeaderNormal = !isPermanent && (
                  (slot.deptName || '').toUpperCase().includes('LÃNH ĐẠO') ||
                  (slot.deptName || '').toUpperCase().includes('GIÁM ĐỐC')
                )
                // isEmergencyHighlight: nổi bật riêng cho CẤP CỨU TỔNG HỢP (Bác sĩ & Điều dưỡng)
                const normName = (slot.deptName || '').toUpperCase()
                const isEmergencyHighlight = !isPermanent && (normName.includes('CẤP CỨU TỔNG HỢP') || normName.includes('CAP CUU TONG HOP'))
                const mergeMode = isPermanent ? 'permanent' : getRowMergeMode(slot)

              const daysData: Record<string, string | undefined> = {
                '2': slot.day2,
                '3': slot.day3,
                '4': slot.day4,
                '5': slot.day5,
                '6': slot.day6,
                '7': slot.day7,
                '8': slot.day8,
              }

              // Helper: gộp nội dung nhiều ngày lại thành 1 chuỗi duy nhất
              const mergeText = (keys: string[]) =>
                keys
                  .map((k) => (daysData[k] || '').trim())
                  .filter((v) => v && v !== '-' && v !== '–')
                  .join(', ')

              // Kiểm tra xem nhóm ngày có any data không (để isTodayCell)
              const groupHasToday = (keys: string[]) => keys.some((k) => todayDayKey === k)

              return (
                <tr
                  key={rIdx}
                  className={`emergRowItem ${isPermanent ? 'emergPermanentRow' : ''} ${
                    isLeaderNormal ? 'emergLeaderNormalRow' : ''
                  } ${isEmergencyHighlight ? 'emergEmergencyHighlightRow' : ''} ${rIdx % 2 === 1 ? 'emergRowEven' : 'emergRowOdd'}`}
                >
                  {/* Cột Tên Khoa / Bộ phận bên trái */}
                  <td className="emergCellDeptTitle">
                    <div className="emergDeptBox">
                      <span className="emergDeptIconWrap">
                        {renderDeptIcon(slot.deptName, slot.subRole)}
                      </span>
                      <div className="emergDeptNameText">
                        <strong className="emergDeptName">{slot.deptName}</strong>
                        {slot.subRole && <span className="emergDeptSubRole">{slot.subRole}</span>}
                      </div>
                    </div>
                  </td>

                  {/* ── PERMANENT (THƯỜNG TRỰC LÃNH ĐẠO / THƯỜNG TRỰC IT): colSpan=7 badge ── */}
                  {mergeMode === 'permanent' ? (
                    (() => {
                      const sampleText = slot.day2 || slot.day3 || slot.day4 || slot.day5 || slot.day6 || slot.day7 || slot.day8 || ''
                      const parsed = parseLeaderMerged(sampleText)
                      return (
                        <td colSpan={7} className="emergMergedLeaderCell">
                          <div className="emergMergedLeaderCard">
                            <div className={`emergMergedTag ${permInfo.isIT ? 'emergTagIT' : ''}`}>
                              {permInfo.isIT ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="3" width="20" height="14" rx="2" />
                                  <line x1="8" y1="21" x2="16" y2="21" />
                                  <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                              ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                              )}
                              <span>{permInfo.tagTitle}</span>
                            </div>
                            <div className="emergMergedLeaderMain">
                              <strong className="emergMergedName">{parsed.name}</strong>
                              {parsed.phone && (
                                <a href={`tel:${parsed.phone.replace(/\D/g, '')}`} className="emergMergedPhoneBtn">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.33a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.19 2.2z" />
                                  </svg>
                                  <span>SĐT: {parsed.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                      )
                    })()
                  ) : mergeMode === 'daily' ? (
                    /* ── LÃNH ĐẠO ngày khác nhau: 7 ô riêng lẻ ── */
                    DAY_KEYS.map((key) => {
                      const isToday = todayDayKey === key
                      const staffStr = daysData[key]
                      return (
                        <td key={key} className={`emergCellDayData ${isToday ? 'isTodayCell' : ''}`}>
                          {renderStaffChips(staffStr, isLeaderNormal, slot.subRole, slot.deptName)}
                        </td>
                      )
                    })
                  ) : mergeMode === 'split3_3' ? (
                    /* ── NỘI-NHI-ĐY / KHÁM / CẤP CỨU: [T2-T4] [T5-T7] [CN] ── */
                    <>
                      <td
                        colSpan={3}
                        className={`emergCellDayData emergCellMerged3 ${groupHasToday(['2','3','4']) ? 'isTodayCell' : ''}`}
                      >
                        {renderStaffChips(mergeText(['2','3','4']), isLeaderNormal, slot.subRole, slot.deptName)}
                      </td>
                      <td
                        colSpan={3}
                        className={`emergCellDayData emergCellMerged3 ${groupHasToday(['5','6','7']) ? 'isTodayCell' : ''}`}
                      >
                        {renderStaffChips(mergeText(['5','6','7']), isLeaderNormal, slot.subRole, slot.deptName)}
                      </td>
                      <td
                        colSpan={1}
                        className={`emergCellDayData ${groupHasToday(['8']) ? 'isTodayCell' : ''}`}
                      >
                        {renderStaffChips(daysData['8'], isLeaderNormal, slot.subRole, slot.deptName)}
                      </td>
                    </>
                  ) : (
                    /* ── SẢN + CÁC KHOA/PHÒNG CÒN LẠI: gộp T2-T7 | CN riêng ── */
                    <>
                      <td
                        colSpan={6}
                        className={`emergCellDayData emergCellMerged6 ${groupHasToday(['2','3','4','5','6','7']) ? 'isTodayCell' : ''}`}
                      >
                        {renderStaffChips(mergeText(['2','3','4','5','6','7']), isLeaderNormal, slot.subRole, slot.deptName)}
                      </td>
                      <td
                        colSpan={1}
                        className={`emergCellDayData ${groupHasToday(['8']) ? 'isTodayCell' : ''}`}
                      >
                        {renderStaffChips(daysData['8'], isLeaderNormal, slot.subRole, slot.deptName)}
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── 3. GHI CHÚ ĐIỀU ĐỘNG & CÔNG TÁC (Nếu có) ── */}
      {shouldRender(generalNoteVis) && generalNote && (
        <div className={`emergNoteBox ${getVisibilityClass(generalNoteVis)}`}>
          <div className="emergNoteTitle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>GHI CHÚ ĐIỀU ĐỘNG & CÔNG TÁC TRONG TUẦN</span>
          </div>
          <div className="emergNoteContent">{generalNote}</div>
        </div>
      )}

      {/* ── 4. DANH BẠ LIÊN LẠC NỘI BỘ & CẤP CỨU LIÊN VIỆN (Nếu có) ── */}
      {shouldRender(contactsVis) && Array.isArray(contacts) && contacts.length > 0 && (
        <div className={`emergContactsBox ${getVisibilityClass(contactsVis)}`}>
          <div className="emergContactsTitle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>ĐƯỜNG DÂY NÓNG TRỰC & SỐ ĐIỆN THOẠI CẤP CỨU LIÊN VIỆN</span>
          </div>
          <div className="emergContactsGrid">
            {contacts.map((c, idx) => {
              const isHospital = c.type === 'emergency_unit'
              return (
                <div key={idx} className={`emergContactCard ${isHospital ? 'isHospitalContact' : ''}`}>
                  <div className="emergContactInfo">
                    <span className="emergContactName">{c.name}</span>
                    <span className="emergContactType">{isHospital ? '🚑 Bệnh viện tuyến trên' : '📞 Trực nội bộ'}</span>
                  </div>
                  <a href={`tel:${String(c.phone).replace(/\s+/g, '')}`} className="emergContactPhone">
                    {c.phone}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
