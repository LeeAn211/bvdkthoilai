/**
 * Script tạo file Excel mẫu: Lịch trực Cấp cứu theo Tuần
 * Chạy: node scripts/create-emergency-template.js
 * Yêu cầu: npm install xlsx (cài 1 lần)
 */

const path = require('path')
const fs = require('fs')

// Thử dùng thư viện xlsx nếu có
let XLSX
try {
  XLSX = require('xlsx')
} catch {
  console.log('⚠️  Chưa có thư viện xlsx. Đang cài...')
  require('child_process').execSync('npm install xlsx --no-save', { stdio: 'inherit' })
  XLSX = require('xlsx')
}

// ============================================================
// DỮ LIỆU MẪU
// ============================================================
const SHIFTS = [
  { key: 'morning', label: '☀️ Ca Sáng (07:00–13:00)' },
  { key: 'afternoon', label: '🌤️ Ca Chiều (13:00–19:00)' },
  { key: 'night', label: '🌙 Ca Tối (19:00–07:00)' },
]

const DAYS = [
  { value: '2', label: 'Thứ Hai' },
  { value: '3', label: 'Thứ Ba' },
  { value: '4', label: 'Thứ Tư' },
  { value: '5', label: 'Thứ Năm' },
  { value: '6', label: 'Thứ Sáu' },
  { value: '7', label: 'Thứ Bảy' },
  { value: '8', label: 'Chủ Nhật' },
]

const SAMPLE_DATA = {
  '2': { morning: 'BS. Nguyễn Văn A, BS. Trần Thị B', afternoon: 'BS. Lê Văn C, BS. Phạm Thị D', night: 'BS. Hoàng Văn E', note: '' },
  '3': { morning: 'BS. Nguyễn Văn F, BS. Trần Thị G', afternoon: 'BS. Lê Văn H, BS. Phạm Thị I', night: 'BS. Hoàng Văn K', note: '' },
  '4': { morning: 'BS. Nguyễn Văn L, BS. Trần Thị M', afternoon: 'BS. Lê Văn N, BS. Phạm Thị O', night: 'BS. Hoàng Văn P', note: '' },
  '5': { morning: 'BS. Nguyễn Văn Q, BS. Trần Thị R', afternoon: 'BS. Lê Văn S, BS. Phạm Thị T', night: 'BS. Hoàng Văn U', note: '' },
  '6': { morning: 'BS. Nguyễn Văn V, BS. Trần Thị X', afternoon: 'BS. Lê Văn Y, BS. Phạm Thị Z', night: 'BS. Hoàng Văn W', note: '' },
  '7': { morning: 'BS. Nguyễn Văn A1, BS. Trần Thị B1', afternoon: 'BS. Lê Văn C1', night: 'BS. Hoàng Văn D1', note: 'Trực tăng cường cuối tuần' },
  '8': { morning: 'BS. Nguyễn Văn E1', afternoon: 'BS. Lê Văn F1', night: 'BS. Hoàng Văn G1', note: 'Nghỉ lễ - có thể tăng cường' },
}

// ============================================================
// SHEET 1: BẢNG NHẬP LIỆU (dạng hàng = ngày, cột = ca)
// ============================================================
function buildInputSheet() {
  const rows = []

  // Tiêu đề
  rows.push(['LỊCH TRỰC CẤP CỨU THEO TUẦN', '', '', '', '', ''])
  rows.push(['Bệnh viện Đa khoa Khu vực Thới Lai', '', '', '', '', ''])
  rows.push([''])
  rows.push(['📋 HƯỚNG DẪN:', 'Nhập tên bác sĩ ngăn cách bằng dấu phẩy (VD: BS. Năm, BS. Dương)', '', '', '', ''])
  rows.push([''])

  // Header
  rows.push([
    'THỨ TRONG TUẦN',
    '☀️ CA SÁNG (07:00–13:00)',
    '🌤️ CA CHIỀU (13:00–19:00)',
    '🌙 CA TỐI (19:00–07:00)',
    '📝 GHI CHÚ',
    'GIÁ TRỊ (nhập vào Admin)',
  ])

  // Data rows
  for (const day of DAYS) {
    const d = SAMPLE_DATA[day.value]
    rows.push([
      day.label,
      d.morning,
      d.afternoon,
      d.night,
      d.note,
      day.value,
    ])
  }

  return XLSX.utils.aoa_to_sheet(rows)
}

// ============================================================
// SHEET 2: HƯỚNG DẪN SỬ DỤNG
// ============================================================
function buildGuideSheet() {
  const rows = [
    ['📖 HƯỚNG DẪN SỬ DỤNG FILE EXCEL MẪU'],
    [''],
    ['BƯỚC 1: ĐIỀN DỮ LIỆU VÀO SHEET "LỊCH TRỰC"'],
    ['  - Cột "THỨ TRONG TUẦN": Không cần sửa'],
    ['  - Cột "CA SÁNG / CA CHIỀU / CA TỐI": Nhập tên bác sĩ, ngăn cách bằng dấu PHẨY (,)'],
    ['  - Cột "GHI CHÚ": Ghi chú đặc biệt cho ngày đó (tùy chọn)'],
    [''],
    ['BƯỚC 2: SAO CHÉP VÀO HỆ THỐNG ADMIN'],
    ['  1. Mở trình duyệt → vào Admin CMS → Lịch khám / Lịch trực'],
    ['  2. Tạo mới → chọn "Lịch trực cấp cứu theo tuần (bảng ma trận)"'],
    ['  3. Nhập Tuần trực từ ngày → đến ngày'],
    ['  4. Trong "Bảng lịch trực cấp cứu theo tuần":'],
    ['     - Nhấn "+ Thêm mục"'],
    ['     - Chọn "Thứ trong tuần" (VD: Thứ Hai)'],
    ['     - Dán nội dung từ cột CA SÁNG vào ô "Ca Sáng (07:00 – 13:00)"'],
    ['     - Dán nội dung từ cột CA CHIỀU vào ô "Ca Chiều (13:00 – 19:00)"'],
    ['     - Dán nội dung từ cột CA TỐI vào ô "Ca Tối (19:00 – 07:00)"'],
    ['     - Lặp lại cho 7 ngày'],
    ['  5. Lưu lại → Kích hoạt "Đang áp dụng"'],
    [''],
    ['⚡ MẸO NHANH:'],
    ['  - Có thể sao chép nguyên dòng từ bảng Excel rồi dán vào từng ô trong Admin'],
    ['  - Bác sĩ tên dài: hệ thống tự cắt và hiển thị tooltip'],
    ['  - Để trống ô = không có bác sĩ trực ca đó (hiển thị "–" trên web)'],
    [''],
    ['📌 LƯU Ý FORMAT TÊN BÁC SĨ:'],
    ['  ✅ Đúng:  BS. Nguyễn Văn A, BS. Trần Thị B'],
    ['  ✅ Đúng:  BS. Nguyễn Văn A; BS. Trần Thị B  (cũng được)'],
    ['  ❌ Sai:   BS.Nguyễn Văn A,BS.Trần Thị B     (thiếu khoảng trắng sau dấu phẩy)'],
    [''],
    ['📞 Hỗ trợ: Liên hệ quản trị viên hệ thống'],
  ]
  return XLSX.utils.aoa_to_sheet(rows)
}

// ============================================================
// TẠO FILE
// ============================================================
const wb = XLSX.utils.book_new()

const ws1 = buildInputSheet()
// Căn chỉnh độ rộng cột
ws1['!cols'] = [
  { wch: 16 }, // Thứ
  { wch: 40 }, // Sáng
  { wch: 40 }, // Chiều
  { wch: 40 }, // Tối
  { wch: 30 }, // Ghi chú
  { wch: 12 }, // Giá trị
]
XLSX.utils.book_append_sheet(wb, ws1, 'LỊCH TRỰC')

const ws2 = buildGuideSheet()
ws2['!cols'] = [{ wch: 70 }]
XLSX.utils.book_append_sheet(wb, ws2, 'HƯỚNG DẪN')

// Xuất file
const outDir = path.join(__dirname, '..', 'public', 'templates')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const outPath = path.join(outDir, 'lich-truc-cap-cuu-mau.xlsx')
XLSX.writeFile(wb, outPath)

console.log(`✅ Đã tạo file Excel mẫu tại:\n   ${outPath}`)
console.log('\nMở file bằng Excel hoặc Google Sheets để xem và chỉnh sửa.')
