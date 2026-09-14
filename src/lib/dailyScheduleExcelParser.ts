import * as XLSX from 'xlsx'

export type ParsedDailyAssignment = {
  departmentName: string
  departmentIcon: string
  morningDoctors: string
  noonDoctors: string
  afternoonDoctors: string
  eveningDoctors: string
  note?: string
}

export type ParsedDailyScheduleData = {
  date?: string // YYYY-MM-DD
  title?: string
  assignments: ParsedDailyAssignment[]
  total: number
}

// Helper đoán icon tương ứng theo tên khoa
export function guessDeptIcon(name: string): string {
  const norm = name.toUpperCase()
  if (norm.includes('CẤP CỨU')) return 'ambulance'
  if (norm.includes('NỘI') || norm.includes('NHI')) return 'bed'
  if (norm.includes('YHCT') || norm.includes('ĐÔNG Y') || norm.includes('DƯỢC')) return 'mortar'
  if (norm.includes('NGOẠI') || norm.includes('MỔ') || norm.includes('PHẪU THUẬT')) return 'scalpel'
  if (norm.includes('SẢN') || norm.includes('SKSS') || norm.includes('PHỤ')) return 'baby'
  if (norm.includes('SIÊU ÂM') || norm.includes('X QUANG') || norm.includes('X-QUANG') || norm.includes('THĂM DÒ')) return 'ultrasound'
  if (norm.includes('RĂNG') || norm.includes('HÀM') || norm.includes('MẶT')) return 'tooth'
  if (norm.includes('COVID') || norm.includes('DỊCH') || norm.includes('VI SINH')) return 'virus'
  if (norm.includes('KHÁM') || norm.includes('PHÒNG KHÁM') || norm.includes('PK')) return 'stethoscope'
  return 'clinic'
}

export function parseDailyScheduleWorkbook(workbook: any, fileName?: string): ParsedDailyScheduleData {
  const sheetName = workbook.SheetNames[0]
  const ws = workbook.Sheets[sheetName]
  const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

  let parsedDate: string | undefined = undefined
  let parsedTitle: string | undefined = undefined

  // 1. Quét tìm tiêu đề và ngày khám (VD: "LỊCH NGÀY 10.9.2026" hoặc "10/09/2026")
  for (let i = 0; i < Math.min(raw.length, 10); i++) {
    const row = raw[i]
    for (const cell of row) {
      const s = String(cell || '').trim()
      if (!s) continue

      // Tìm "LỊCH NGÀY dd.mm.yyyy" hoặc "LỊCH KHÁM NGÀY..."
      const dateMatch = s.match(/(?:NGÀY|NGAY)\s*([0-9]{1,2})[\.\-\/]([0-9]{1,2})[\.\-\/]([0-9]{4})/i)
      if (dateMatch) {
        const day = String(dateMatch[1]).padStart(2, '0')
        const month = String(dateMatch[2]).padStart(2, '0')
        const year = dateMatch[3]
        parsedDate = `${year}-${month}-${day}`
        parsedTitle = `Lịch khám bệnh ngày ${day}/${month}/${year}`
        break
      }
    }
    if (parsedDate) break
  }

  // 2. Tìm dòng Header ca khám (chứa "7 - 10" hoặc "10 - 11" hoặc "13 - 16" hoặc "SÁNG" / "CHIỀU")
  let headerRowIdx = -1
  let colMorning = 1
  let colNoon = 2
  let colAfternoon = 3
  let colEvening = 4

  for (let i = 0; i < Math.min(raw.length, 15); i++) {
    const row = raw[i]
    const rowStr = row.map(c => String(c || '').toLowerCase()).join(' | ')
    if (
      (rowStr.includes('7') && rowStr.includes('10')) ||
      (rowStr.includes('sáng') && rowStr.includes('chiều')) ||
      (rowStr.includes('13') && rowStr.includes('16'))
    ) {
      headerRowIdx = i
      // Tự dò cột theo từ khóa
      row.forEach((cell: any, cIdx: number) => {
        const cStr = String(cell || '').toLowerCase()
        if (cStr.includes('7') || (cStr.includes('sáng') && !cStr.includes('trưa'))) {
          colMorning = cIdx
        } else if (cStr.includes('10') && (cStr.includes('11') || cStr.includes('trưa'))) {
          colNoon = cIdx
        } else if (cStr.includes('13') || (cStr.includes('chiều') && !cStr.includes('tối'))) {
          colAfternoon = cIdx
        } else if (cStr.includes('16') || cStr.includes('17') || cStr.includes('tối')) {
          colEvening = cIdx
        }
      })
      break
    }
  }

  const dataStart = headerRowIdx >= 0 ? headerRowIdx + 1 : 1
  const assignments: ParsedDailyAssignment[] = []

  for (let r = dataStart; r < raw.length; r++) {
    const row = raw[r]
    if (!row || row.length === 0) continue

    const deptName = String(row[0] || '').trim()
    // Nếu dòng trống hoàn toàn hoặc là dòng ghi chú phụ ở chân trang
    if (!deptName) continue
    if (deptName.toLowerCase().startsWith('ghi chú') || deptName.toLowerCase().startsWith('nơi nhận')) {
      break
    }

    const morningVal = String(row[colMorning] || '').trim()
    const noonVal = String(row[colNoon] || '').trim()
    const afternoonVal = String(row[colAfternoon] || '').trim()
    const eveningVal = String(row[colEvening] || '').trim()

    // Bỏ qua nếu cả 4 ca đều rỗng và tên chỉ là khoảng trắng
    if (!morningVal && !noonVal && !afternoonVal && !eveningVal && deptName.length <= 1) {
      continue
    }

    assignments.push({
      departmentName: deptName,
      departmentIcon: guessDeptIcon(deptName),
      morningDoctors: morningVal !== '-' && morningVal !== '–' ? morningVal : '',
      noonDoctors: noonVal !== '-' && noonVal !== '–' ? noonVal : '',
      afternoonDoctors: afternoonVal !== '-' && afternoonVal !== '–' ? afternoonVal : '',
      eveningDoctors: eveningVal !== '-' && eveningVal !== '–' ? eveningVal : '',
      note: '',
    })
  }

  return {
    date: parsedDate,
    title: parsedTitle,
    assignments,
    total: assignments.length,
  }
}
