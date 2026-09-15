type ExcelCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | { text?: string; result?: unknown; richText?: Array<{ text?: string }> }

function cellText(value: ExcelCellValue): string | number | boolean {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toLocaleDateString('vi-VN')
  if (typeof value !== 'object') return value
  if (Array.isArray(value.richText)) return value.richText.map((part) => part.text || '').join('')
  if (value.result !== undefined) return cellText(value.result as ExcelCellValue)
  if (value.text !== undefined) return value.text
  return String(value)
}

export function workbookToRows(workbook: any): { sheetName: string; rows: Array<Array<string | number | boolean>> } {
  const worksheet = workbook?.worksheets?.[0]
  if (!worksheet) return { sheetName: '', rows: [] }

  const rows: Array<Array<string | number | boolean>> = []
  const rowCount = Number(worksheet.rowCount || 0)
  const columnCount = Number(worksheet.columnCount || 0)

  for (let rowNumber = 1; rowNumber <= rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber)
    const values: Array<string | number | boolean> = []
    for (let columnNumber = 1; columnNumber <= columnCount; columnNumber += 1) {
      values.push(cellText(row.getCell(columnNumber).value as ExcelCellValue))
    }
    rows.push(values)
  }

  return { sheetName: worksheet.name || '', rows }
}
