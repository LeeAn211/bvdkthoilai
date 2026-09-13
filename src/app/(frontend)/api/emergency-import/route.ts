import { NextRequest, NextResponse } from 'next/server'

// Dòng nào là khoa/bộ phận (cột 0 có dữ liệu, cột 2-8 là nhân sự theo ngày)
// Dòng nào là phần danh sách nhân sự cố định (bảng thứ 2, rows 25+)
// Cấu trúc file truc.xlsx:
// - Row 5: Header ngày (cột 2=T2, 3=T3, ... 8=CN)
// - Row 8-24: Bảng lịch trực (cột 0=Khoa, cột 1=subRole, cột 2-8=nhân sự từng ngày)
//   Nhiều hàng cùng 1 Khoa (merged cells) → gom lại bằng \n
// - Row 25: Header bảng 2 (có chứa "KHOA", "BÁC SĨ")
// - Row 26+: Danh sách nhân sự cố định theo Khoa
// - Row 48+: Danh bạ điện thoại trực & Cấp cứu liên viện

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Không tìm thấy file.' }, { status: 400 })

    const ext = file.name.toLowerCase().split('.').pop()
    if (ext !== 'xlsx' && ext !== 'xls') {
      return NextResponse.json({ error: 'Chỉ chấp nhận file .xlsx hoặc .xls' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let XLSX: any
    try {
      XLSX = await import('xlsx')
    } catch {
      return NextResponse.json({ error: 'Server chưa cài thư viện xlsx.' }, { status: 500 })
    }

    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const ws = workbook.Sheets[sheetName]
    const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

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

    // ── Bước 2: Tìm dòng bắt đầu bảng nhân sự cố định ──────────────────────
    let fixedTableStart = -1
    for (let i = dataStart; i < raw.length; i++) {
      const joined = raw[i].map(c => String(c || '')).join('|').toLowerCase()
      if (joined.includes('bác sĩ') || joined.includes('bac si') || (joined.includes('khoa') && joined.includes('điều dưỡng'))) {
        fixedTableStart = i + 1
        break
      }
    }

    // ── Bước 3: Parse bảng lịch trực (bảng 1: hàng 8 - 24) ──────────────────
    const deptMap: Map<string, {
      deptName: string; subRole: string; deptType: string;
      dayData: Record<string, string[]>; fixedStaff: string; note: string
    }> = new Map()

    let currentDept = ''
    let currentSubRole = ''

    const endRow = fixedTableStart > 0 ? fixedTableStart - 1 : raw.length

    for (let i = dataStart; i < endRow; i++) {
      const row = raw[i]
      let col0 = String(row[0] || '').trim()
      let col1 = String(row[1] || '').trim()

      // Bỏ qua dòng tiêu đề phụ thừa như "TRỰC"
      if (col0.toUpperCase() === 'TRỰC') {
        continue
      }

      if (col0) {
        currentDept = col0
        currentSubRole = col1 || ''
      } else if (col1) {
        currentSubRole = col1
      }

      if (!currentDept) continue

      let deptType = 'clinical'
      const lower = currentDept.toLowerCase()
      if (lower.includes('lãnh đạo') || lower.includes('ban giám')) deptType = 'leader'
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

    // ── Bước 4: Parse bảng nhân sự cố định (bảng 2: hàng 25+) ────────────────
    let generalNote = ''
    if (fixedTableStart > 0) {
      for (let i = fixedTableStart; i < raw.length; i++) {
        const row = raw[i]
        const col0 = String(row[0] || '').trim()
        const col2 = String(row[2] || '').trim()
        const col5 = String(row[5] || '').trim()

        if (col0.toLowerCase().startsWith('ghi chú:')) {
          generalNote = (generalNote ? generalNote + '\n' : '') + col0
          continue
        }

        if (col0 && (col2 || col5)) {
          const staffParts: string[] = []
          if (col2) staffParts.push(col2)
          if (col5) staffParts.push(`ĐD/KTV: ${col5}`)
          const staffStr = staffParts.join('\n')

          let matched = false
          for (const [, entry] of deptMap) {
            if (entry.deptName.toLowerCase().includes(col0.toLowerCase()) || col0.toLowerCase().includes(entry.deptName.toLowerCase())) {
              entry.fixedStaff = (entry.fixedStaff ? entry.fixedStaff + '\n' : '') + staffStr
              matched = true
            }
          }

          if (!matched) {
            deptMap.set(col0, {
              deptName: col0,
              subRole: '',
              deptType: col0.toLowerCase().includes('phòng') ? 'admin' : 'clinical',
              dayData: {},
              fixedStaff: staffStr,
              note: '',
            })
          }
        }
      }
    }

    // ── Bước 5: Parse bảng số điện thoại trực & cấp cứu (hàng 48+) ──────────
    const contacts: Array<{ name: string; phone: string; type: 'internal' | 'emergency_unit'; note?: string }> = []
    for (let i = fixedTableStart > 0 ? fixedTableStart : dataStart; i < raw.length; i++) {
      const row = raw[i]
      const col0 = String(row[0] || '').trim()
      const col3 = String(row[3] || '').trim()
      const col4 = String(row[4] || '').trim()
      const col7 = String(row[7] || '').trim()

      const isHeaderRow = (str: string) => str.toLowerCase().includes('số điện thoại') || str.toLowerCase().includes('bệnh viện')

      // 1. Danh bạ nội bộ (Tài xế, Điện nước, Bảo vệ, Công an, Huyện đội...)
      if (col0 && col3 && !isHeaderRow(col3)) {
        contacts.push({
          name: col0,
          phone: col3,
          type: 'internal',
        })
      }

      // 2. Danh bạ bệnh viện tuyến trên / cấp cứu
      if (col4 && col7 && !isHeaderRow(col7)) {
        contacts.push({
          name: col4,
          phone: col7,
          type: 'emergency_unit',
        })
      }
    }

    // ── Bước 6: Chuyển thành array weeklyDeptSlots ───────────────────────────
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
      fixedStaff: entry.fixedStaff,
      note: entry.note,
    }))

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
        // Tìm định dạng DD/MM/YYYY trong chuỗi (VD: Từ ngày 05/8/2024 đến ngày 11/8/2024)
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

    return NextResponse.json({
      success: true,
      slots,
      total: slots.length,
      contacts,
      generalNote,
      emergencyWeekStart,
      emergencyWeekEnd,
      sheetName,
      title: title || file.name,
      weekLabel,
      dayColMap,
      headerRow,
    })
  } catch (err) {
    console.error('[emergency-import] Error:', err)
    return NextResponse.json({ error: 'Lỗi xử lý file: ' + (err as Error).message }, { status: 500 })
  }
}
