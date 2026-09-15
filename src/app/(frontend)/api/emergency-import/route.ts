import { NextRequest, NextResponse } from 'next/server'
import { parseEmergencyWorkbook } from '@/lib/emergencyExcelParser'

const MAX_FILE_SIZE = 20 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Không tìm thấy file.' }, { status: 400 })
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return NextResponse.json({ error: 'Chỉ chấp nhận file Excel .xlsx.' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File vượt quá giới hạn 20 MB.' }, { status: 400 })
    }

    const { Workbook } = await import('exceljs')
    const workbook = new Workbook()
    await workbook.xlsx.load(new Uint8Array(await file.arrayBuffer()) as any)

    const data = parseEmergencyWorkbook(workbook, file.name)
    return NextResponse.json({
      success: true,
      ...data,
      sheetName: workbook.worksheets[0]?.name || '',
    })
  } catch (error) {
    console.error('[emergency-import] Error:', error)
    return NextResponse.json(
      { error: `Lỗi xử lý file: ${error instanceof Error ? error.message : 'Không xác định'}` },
      { status: 500 },
    )
  }
}
