import ExcelJS from 'exceljs'
import { getPayload } from 'payload'
import config from '../payload.config'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Cách dùng: npm run import:services -- "D:\\bang-gia.xlsx"')
  process.exit(1)
}

const numberValue = (value: unknown) => {
  if (typeof value === 'number') return value
  if (value === undefined || value === null || value === '') return undefined
  const cleaned = String(value).replace(/[^0-9,-]/g, '').replace(',', '.')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : undefined
}

const value = (row: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) if (row[key] !== undefined && row[key] !== null) return row[key]
  return undefined
}

const workbook = new ExcelJS.Workbook()
await workbook.xlsx.readFile(filePath)
const worksheet = workbook.worksheets[0]
if (!worksheet) throw new Error('File Excel không có sheet dữ liệu.')
const headers = worksheet.getRow(1).values as unknown[]
const rows: Record<string, unknown>[] = []
worksheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return
  const record: Record<string, unknown> = {}
  for (let col = 1; col < headers.length; col++) {
    const header = String(headers[col] ?? '').trim()
    if (!header) continue
    const cellValue: any = row.getCell(col).value
    record[header] = cellValue instanceof Date
      ? cellValue.toISOString()
      : (cellValue && typeof cellValue === 'object' && 'result' in cellValue ? cellValue.result : cellValue)
  }
  if (Object.values(record).some(v => v !== null && v !== undefined && String(v).trim() !== '')) rows.push(record)
})
const payload = await getPayload({ config })
let created = 0
let updated = 0
let skipped = 0

for (const row of rows) {
  const code = String(value(row, 'Mã dịch vụ', 'MA_DV', 'MA DICH VU', 'Mã DV', 'Code') || '').trim()
  const name = String(value(row, 'Tên dịch vụ', 'TEN_DV', 'TEN DICH VU', 'Tên DV', 'Name') || '').trim()
  if (!code || !name) { skipped++; continue }

  const data = {
    sequence: numberValue(value(row, 'STT', 'Số thứ tự', 'So thu tu')),
    code,
    name,
    insurancePrice: numberValue(value(row, 'Giá BHYT', 'GIA_BHYT', 'Giá bảo hiểm y tế')),
    price: numberValue(value(row, 'Giá dịch vụ', 'GIA_DV', 'Giá thu dịch vụ')),
    note: String(value(row, 'Ghi chú', 'GHI_CHU', 'Ghi chu') || '').trim() || undefined,
    active: true,
  }
  const existing = await payload.find({ collection: 'services', where: { code: { equals: code } }, limit: 1 })
  if (existing.docs[0]) { await payload.update({ collection: 'services', id: existing.docs[0].id, data }); updated++ }
  else { await payload.create({ collection: 'services', data }); created++ }
}

console.log(`Hoàn tất: thêm mới ${created}, cập nhật ${updated}, bỏ qua ${skipped}.`)
