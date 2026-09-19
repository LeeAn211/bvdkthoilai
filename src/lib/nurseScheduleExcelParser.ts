import { workbookToRows } from './excelRows'

export type ParsedNurseAssignment = {
  departmentName: string
  departmentIcon: string
  administrativeStaff: string // Hành chánh
  reinforcementStaff: string // Tăng cường
  note?: string
}

export type ParsedNurseScheduleData = {
  date?: string // YYYY-MM-DD
  title?: string
  assignments: ParsedNurseAssignment[]
  generalNote?: string // Ghi chú: Nghỉ phép: ...
  total: number
}

// Helper đoán icon tương ứng theo tên khoa/phòng điều dưỡng
export function guessNurseDeptIcon(name: string): string {
  const norm = name.toUpperCase()
  if (norm.includes('CẤP CỨU') || norm.includes('HSCC')) return 'ambulance'
  if (norm.includes('NỘI') || norm.includes('NHI') || norm.includes('TRUYỀN NHIỄM')) return 'bed'
  if (norm.includes('YHCT') || norm.includes('PHCN') || norm.includes('ĐÔNG Y')) return 'mortar'
  if (norm.includes('NGOẠI') || norm.includes('MỔ') || norm.includes('PHẪU THUẬT')) return 'scalpel'
  if (norm.includes('SẢN') || norm.includes('PHỤ SẢN') || norm.includes('SKSS')) return 'baby'
  if (norm.includes('SIÊU ÂM') || norm.includes('X QUANG') || norm.includes('X-QUANG')) return 'ultrasound'
  if (norm.includes('RĂNG') || norm.includes('HÀM') || norm.includes('MẶT')) return 'tooth'
  if (norm.includes('KSNK') || norm.includes('KIỂM SOÁT')) return 'virus'
  if (norm.includes('KHÁM') || norm.includes('LCK')) return 'stethoscope'
  return 'clinic'
}

export function parseNurseScheduleWorkbook(workbook: any, fileName?: string): ParsedNurseScheduleData {
  const { rows: raw } = workbookToRows(workbook)

  let parsedDate: string | undefined = undefined
  let parsedTitle: string | undefined = undefined
  let generalNote: string | undefined = undefined

  // 1. Quét tìm tiêu đề và ngày (VD: "LỊCH NGÀY ĐD - NHS (Ngày 18/09/2026)")
  for (let i = 0; i < Math.min(raw.length, 10); i++) {
    const row = raw[i]
    for (const cell of row) {
      const s = String(cell || '').trim()
      if (!s) continue

      // Tìm "(Ngày dd/mm/yyyy)" hoặc "Ngày dd.mm.yyyy"
      const dateMatch = s.match(/(?:NGÀY|NGAY)\s*([0-9]{1,2})[\.\-\/]([0-9]{1,2})[\.\-\/]([0-9]{4})/i)
      if (dateMatch) {
        const day = String(dateMatch[1]).padStart(2, '0')
        const month = String(dateMatch[2]).padStart(2, '0')
        const year = dateMatch[3]
        parsedDate = `${year}-${month}-${day}`
        parsedTitle = `Lịch ngày ĐD - NHS (${day}/${month}/${year})`
        break
      }
    }
    if (parsedDate) break
  }

  // 2. Tìm dòng Header (chứa "KHOA", "HÀNH CHÁNH" / "HÀNH CHÍNH", "TĂNG CƯỜNG")
  let headerRowIdx = -1
  let colDept = 0
  let colAdmin = 1
  let colReinforce = 2

  for (let i = 0; i < Math.min(raw.length, 15); i++) {
    const row = raw[i]
    const rowStr = row.map(c => String(c || '').toLowerCase()).join(' | ')
    if (
      (rowStr.includes('khoa') && (rowStr.includes('hành chánh') || rowStr.includes('hành chính'))) ||
      rowStr.includes('tăng cường')
    ) {
      headerRowIdx = i
      row.forEach((cell: any, cIdx: number) => {
        const cStr = String(cell || '').toLowerCase()
        if (cStr.includes('khoa')) {
          colDept = cIdx
        } else if (cStr.includes('hành chánh') || cStr.includes('hành chính')) {
          colAdmin = cIdx
        } else if (cStr.includes('tăng cường') || cStr.includes('tang cuong')) {
          colReinforce = cIdx
        }
      })
      break
    }
  }

  const dataStart = headerRowIdx >= 0 ? headerRowIdx + 1 : 1
  const assignments: ParsedNurseAssignment[] = []

  for (let r = dataStart; r < raw.length; r++) {
    const row = raw[r]
    if (!row || row.length === 0) continue

    const firstCell = String(row[0] || '').trim()
    const fullRowStr = row.map(c => String(c || '').trim()).filter(Boolean).join(' ')

    // Kiểm tra dòng ghi chú nghỉ phép ở cuối bảng (VD: "Ghi chú: Nghỉ phép: Lập, Nghi, Kiên.")
    if (
      firstCell.toLowerCase().startsWith('ghi chú') ||
      firstCell.toLowerCase().startsWith('ghi chu') ||
      fullRowStr.toLowerCase().startsWith('ghi chú') ||
      fullRowStr.toLowerCase().startsWith('ghi chu')
    ) {
      generalNote = fullRowStr
      continue
    }

    const deptName = String(row[colDept] || '').trim()
    if (!deptName) continue

    const adminVal = String(row[colAdmin] || '').trim()
    const reinforceVal = String(row[colReinforce] || '').trim()

    // Bỏ qua nếu cả 2 cột đều rỗng và tên khoa quá ngắn
    if (!adminVal && !reinforceVal && deptName.length <= 1) {
      continue
    }

    assignments.push({
      departmentName: deptName,
      departmentIcon: guessNurseDeptIcon(deptName),
      administrativeStaff: adminVal !== '-' && adminVal !== '–' ? adminVal : '',
      reinforcementStaff: reinforceVal !== '-' && reinforceVal !== '–' ? reinforceVal : '',
      note: '',
    })
  }

  return {
    date: parsedDate,
    title: parsedTitle,
    assignments,
    generalNote,
    total: assignments.length,
  }
}
