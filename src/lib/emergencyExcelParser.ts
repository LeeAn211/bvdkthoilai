import { workbookToRows } from './excelRows'

export type ParsedEmergencyData = {
  slots: Array<{
    deptName: string
    subRole: string
    deptType: string
    day2: string; day3: string; day4: string
    day5: string; day6: string; day7: string; day8: string
    fixedStaff: string
    note: string
  }>
  contacts: Array<{
    name: string
    phone: string
    type: 'internal' | 'emergency_unit'
    note?: string
  }>
  emergencyWeekStart?: string
  emergencyWeekEnd?: string
  generalNote?: string
  title?: string
  weekLabel?: string
  total: number
}

export function parseEmergencyWorkbook(workbook: any, fileName?: string): ParsedEmergencyData {
  const { rows: raw } = workbookToRows(workbook)

  // ── Bước 1: Tìm dòng header ngày (có "Thứ Hai" hoặc "Thứ Ba") ──────────
  let headerRow = -1
  let dayColMap: Record<number, string> = {} // col_index -> dayKey ('2'..'8')

  for (let i = 0; i < Math.min(raw.length, 15); i++) {
    const row = raw[i]
    const hasDay = row.some((cell: any) => {
      const s = String(cell || '')
      return s.includes('Thứ Hai') || s.includes('Thứ Ba') || s.includes('Thứ Tư') || s.includes('Monday')
    })
    if (hasDay) {
      headerRow = i
      row.forEach((cell: any, col: number) => {
        const s = String(cell || '')
        if (s.includes('Thứ Hai') || s.includes('Thu Hai') || s.includes('Monday')) dayColMap[col] = '2'
        else if (s.includes('Thứ Ba') || s.includes('Thu Ba') || s.includes('Tuesday')) dayColMap[col] = '3'
        else if (s.includes('Thứ Tư') || s.includes('Thu Tu') || s.includes('Wednesday')) dayColMap[col] = '4'
        else if (s.includes('Thứ Năm') || s.includes('Thu Nam') || s.includes('Thursday')) dayColMap[col] = '5'
        else if (s.includes('Thứ Sáu') || s.includes('Thu Sau') || s.includes('Friday')) dayColMap[col] = '6'
        else if (s.includes('Thứ Bảy') || s.includes('Thu Bay') || s.includes('Saturday')) dayColMap[col] = '7'
        else if (s.includes('Chủ Nhật') || s.includes('Chu Nhat') || s.includes('Sunday')) dayColMap[col] = '8'
      })
      break
    }
  }

  // Fallback: nếu không tìm được header, dùng mặc định cột 2-8
  if (Object.keys(dayColMap).length === 0) {
    dayColMap = { 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8' }
    headerRow = 5 // row index mặc định theo file truc.xlsx
  }

  const dayCols = Object.entries(dayColMap).map(([col, day]) => ({ col: Number(col), day }))
  const dataStart = headerRow + 1

  // ── Bước 2: Tìm điểm kết thúc của Bảng Lịch Trực (Bảng 1) ──────────────────
  // Bảng 1 dừng khi gặp dòng tiêu đề "KHOA", "Ghi chú:" hoặc hết bảng
  let table1End = raw.length
  for (let i = dataStart + 1; i < raw.length; i++) {
    const c0 = String(raw[i][0] || '').trim().toUpperCase()
    const joined = raw[i].map((c: any) => String(c || '')).join('|').toUpperCase()
    if (
      c0 === 'KHOA' ||
      c0.startsWith('GHI CHÚ:') ||
      (c0 === '' && joined.includes('SỐ ĐIỆN THOẠI'))
    ) {
      table1End = i
      break
    }
  }

  // ── Bước 3: Parse đúng và đủ các dòng thuộc bảng lịch trực 7 ngày ──────────
  const deptMap: Map<string, {
    deptName: string; subRole: string; deptType: string;
    dayData: Record<string, string[]>; fixedStaff: string; note: string
  }> = new Map()

  let currentDept = ''
  let currentSubRole = ''

  const isRoleKeyword = (s: string) => {
    const norm = s.toUpperCase().trim()
    return norm === 'BÁC SĨ' || norm === 'BAC SI' || norm === 'ĐIỀU DƯỠNG' || norm === 'DIEU DUONG' || norm === 'KTV' || norm === 'HSTH'
  }

  for (let i = dataStart; i < table1End; i++) {
    const row = raw[i]
    let col0 = String(row[0] || '').trim()
    let col1 = String(row[1] || '').trim()

    // Bỏ qua hàng hoàn toàn trống
    if (!col0 && !col1 && row.slice(2, 9).every((c: any) => !String(c || '').trim())) {
      continue
    }

    // Nếu col0 là 'TRỰC' (tiêu đề khối ở góc trái trên)
    if (col0.toUpperCase() === 'TRỰC') {
      if (!col1 && row.slice(2, 9).every((c: any) => !String(c || '').trim())) {
        // Dòng tiêu đề phụ độc lập hoàn toàn rỗng -> bỏ qua
        continue
      }
      // Ngược lại, tên thực sự của hàng nằm ở col1
      col0 = col1
      col1 = ''
    }

    const rowText = (col0 + ' ' + col1).toLowerCase()

    // Xử lý trường hợp hàng đặc biệt như "THƯỜNG TRỰC LÃNH ĐẠO" (ô merged suốt 7 ngày)
    if (rowText.includes('thường trực')) {
      const deptName = col0.toLowerCase().includes('thường trực') ? col0 : (col1 || 'THƯỜNG TRỰC LÃNH ĐẠO')
      const mergedVal = row.slice(2, 9).filter((c: any) => String(c || '').trim()).map((c: any) => String(c).trim()).join(' ')
      if (mergedVal) {
        deptMap.set(deptName, {
          deptName,
          subRole: '',
          deptType: 'leader',
          dayData: {
            '2': [mergedVal], '3': [mergedVal], '4': [mergedVal],
            '5': [mergedVal], '6': [mergedVal], '7': [mergedVal], '8': [mergedVal],
          },
          fixedStaff: '',
          note: '',
        })
        continue
      }
    }

    // Phân định currentDept và currentSubRole
    if (col0) {
      if (isRoleKeyword(col0)) {
        currentSubRole = col0
      } else {
        currentDept = col0
        currentSubRole = col1 || ''
      }
    } else if (col1) {
      if (isRoleKeyword(col1)) {
        currentSubRole = col1
      } else {
        currentDept = col1
        currentSubRole = ''
      }
    }

    if (!currentDept) continue

    let deptType = 'clinical'
    const lower = currentDept.toLowerCase()
    if (lower.includes('lãnh đạo') || lower.includes('ban giám') || lower.includes('thường trực')) deptType = 'leader'
    else if (lower.includes('x quang') || lower.includes('xét nghiệm') || lower.includes('cận lâm')) deptType = 'paraclinical'
    else if (lower.includes('tài xế') || lower.includes('viện phí') || lower.includes('điện') || lower.includes('bảo vệ')) deptType = 'admin'

    const key = currentDept + (currentSubRole ? ` (${currentSubRole})` : '')
    if (!deptMap.has(key)) {
      deptMap.set(key, { deptName: currentDept, subRole: currentSubRole, deptType, dayData: {}, fixedStaff: '', note: '' })
    }

    const entry = deptMap.get(key)!
    for (const { col, day } of dayCols) {
      const cellVal = String(row[col] || '').trim()
      if (cellVal && cellVal !== '-' && cellVal !== '–') {
        if (!entry.dayData[day]) entry.dayData[day] = []
        entry.dayData[day].push(cellVal)
      }
    }
  }

  // ── Bước 4: Chuyển thành array weeklyDeptSlots ───────────────────────────
  const slots = Array.from(deptMap.values()).map(entry => ({
    deptName: entry.deptName,
    subRole: entry.subRole,
    deptType: entry.deptType,
    day2: (entry.dayData['2'] || []).join('\n'),
    day3: (entry.dayData['3'] || []).join('\n'),
    day4: (entry.dayData['4'] || []).join('\n'),
    day5: (entry.dayData['5'] || []).join('\n'),
    day6: (entry.dayData['6'] || []).join('\n'),
    day7: (entry.dayData['7'] || []).join('\n'),
    day8: (entry.dayData['8'] || []).join('\n'),
    fixedStaff: '',
    note: '',
  }))

  const contacts: Array<{ name: string; phone: string; type: 'internal' | 'emergency_unit'; note?: string }> = []
  let generalNote = ''

  // Trích xuất tiêu đề và ngày tuần từ file
  let title = ''
  let weekLabel = ''
  let emergencyWeekStart = ''
  let emergencyWeekEnd = ''

  for (let i = 0; i < Math.min(6, raw.length); i++) {
    const joined = raw[i].map(c => String(c || '')).join(' ').trim()
    if (joined.toLowerCase().includes('lịch trực') || joined.toLowerCase().includes('lich truc')) {
      title = joined
    }
    if (joined.includes('/') && (joined.toLowerCase().includes('từ') || joined.toLowerCase().includes('đến'))) {
      weekLabel = joined
      const dateMatches = joined.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g)
      if (dateMatches && dateMatches.length >= 2) {
        const parseDateStr = (dStr: string) => {
          const parts = dStr.split(/[\/\-]/)
          const d = parts[0].padStart(2, '0')
          const m = parts[1].padStart(2, '0')
          const y = parts[2]
          return `${y}-${m}-${d}`
        }
        emergencyWeekStart = parseDateStr(dateMatches[0])
        emergencyWeekEnd = parseDateStr(dateMatches[1])
      }
    }
  }

  return {
    slots,
    total: slots.length,
    contacts,
    generalNote,
    emergencyWeekStart,
    emergencyWeekEnd,
    title: title || fileName || 'Lịch trực cấp cứu',
    weekLabel,
  }
}
