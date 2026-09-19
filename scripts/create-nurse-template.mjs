import ExcelJS from 'exceljs'

async function createTemplate() {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Lich_DD_NHS')

  sheet.columns = [
    { header: 'KHOA', key: 'khoa', width: 28 },
    { header: 'Hành chánh', key: 'hanh_chanh', width: 45 },
    { header: 'Tăng cường', key: 'tang_cuong', width: 45 },
  ]

  sheet.spliceRows(1, 0,
    ['LỊCH NGÀY ĐD - NHS'],
    ['(Ngày 18/09/2026)'],
    []
  )

  sheet.mergeCells('A1:C1')
  sheet.getCell('A1').font = { name: 'Times New Roman', size: 16, bold: true }
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }

  sheet.mergeCells('A2:C2')
  sheet.getCell('A2').font = { name: 'Times New Roman', size: 13, italic: true }
  sheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }

  // Header row at row 4
  sheet.getRow(4).values = ['KHOA', 'Hành chánh', 'Tăng cường']
  const headerRow = sheet.getRow(4)
  headerRow.font = { name: 'Times New Roman', size: 12, bold: true }
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' }

  const sampleData = [
    {
      khoa: 'KHÁM BỆNH-LCK',
      hanh_chanh: 'Vân, Song, Tuấn, Hạnh, Diễm, Tuyền C, Yến.\nTuyền S: Phòng răng.\nPhòng tiêm ngừa: Ys Trang, Ys Oanh.\nPhòng khám lao: CN Thắm.',
      tang_cuong: 'Trình ký giấy: Thiện\nYs Ngân S: (Phòng DV + BSGĐ)'
    },
    {
      khoa: 'HSCC',
      hanh_chanh: 'Loan, Công S, Quang, Tâm',
      tang_cuong: ''
    },
    {
      khoa: 'NỘI- NHI- TRUYỀN NHIỄM',
      hanh_chanh: 'Tú, Nga, Ngân, Trân, Minh',
      tang_cuong: 'M.Nga, Bích, T.Hằng, Hs Loan, Ys Ngân C, Liễu, Duy, Thông C, Công C'
    },
    {
      khoa: 'YHCT và PHCN',
      hanh_chanh: 'Ys Bé, Nhựt, Thảo, Thiệu',
      tang_cuong: ''
    },
    {
      khoa: 'PHỤ SẢN',
      hanh_chanh: 'Vân.',
      tang_cuong: ''
    },
    {
      khoa: 'NGOẠI TH',
      hanh_chanh: 'H.Nga, Phương, Sang, Thông S',
      tang_cuong: ''
    },
    {
      khoa: 'KSNK',
      hanh_chanh: 'Huỳnh, Phúc',
      tang_cuong: ''
    },
    {
      khoa: 'Phòng KHTH',
      hanh_chanh: 'Linh.',
      tang_cuong: 'B.Ngân, Uyên S'
    },
    {
      khoa: 'Phòng ĐD',
      hanh_chanh: 'Hoài, Hằng, Uyên C',
      tang_cuong: ''
    }
  ]

  sampleData.forEach((item) => {
    const row = sheet.addRow(item)
    row.alignment = { vertical: 'middle', wrapText: true }
    row.font = { name: 'Times New Roman', size: 11 }
  })

  sheet.addRow([])
  const noteRow = sheet.addRow(['Ghi chú: Nghỉ phép: Lập, Nghi, Kiên.'])
  const noteNum = noteRow.number
  sheet.mergeCells(`A${noteNum}:C${noteNum}`)
  sheet.getCell(`A${noteNum}`).font = { name: 'Times New Roman', size: 12, italic: true, bold: true }

  for (let r = 4; r <= 4 + sampleData.length; r++) {
    ;['A', 'B', 'C'].forEach(col => {
      sheet.getCell(`${col}${r}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
  }

  await workbook.xlsx.writeFile('public/templates/lich-dieu-duong-mau.xlsx')
  console.log('Tạo thành công public/templates/lich-dieu-duong-mau.xlsx')
}

createTemplate().catch(console.error)
