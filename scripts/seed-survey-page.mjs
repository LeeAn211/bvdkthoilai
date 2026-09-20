import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import pg from 'pg'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator < 1) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const { Client } = pg
const client = new Client({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL })

const DEFAULT_SURVEY_BOXES = [
  {
    icon: '🛡️',
    title: '100% Ẩn danh & Bảo mật',
    desc: 'Mọi thông tin phản hồi của quý vị được mã hóa bảo mật, không ảnh hưởng đến quyền lợi khám chữa bệnh.',
  },
  {
    icon: '📊',
    title: 'Chuẩn Bộ Y tế (83 Tiêu chí)',
    desc: 'Nội dung khảo sát áp dụng theo mẫu chuẩn sự hài lòng người bệnh do Bộ Y tế ban hành định kỳ.',
  },
  {
    icon: '🎯',
    title: 'Cải tiến hành động cụ thể',
    desc: 'Kết quả khảo sát được Ban Giám đốc tiếp nhận hàng tháng để chấn chỉnh và đầu tư cải tiến dịch vụ.',
  },
]

const OUTPATIENT_CLINICS = `Phòng khám Nội tổng quát / Tim mạch / Tiểu đường
Phòng khám Ngoại - Chấn thương
Phòng khám Sản - Phụ khoa
Phòng khám Nhi khoa
Liên chuyên khoa Mắt - TMH - Răng Hàm Mặt
Phòng khám Y học cổ truyền & Phục hồi chức năng
Khu vực Tiếp nhận Cấp cứu`

const INPATIENT_DEPARTMENTS = `Khoa Nội tổng hợp
Khoa Ngoại tổng hợp
Khoa Phụ sản
Khoa Nhi
Khoa Hồi sức cấp cứu (ICU)
Khoa Y học cổ truyền & PHCN
Khoa Truyền nhiễm`

const STAFF_POSITIONS = `Bác sĩ điều trị
Điều dưỡng / Hộ sinh
Dược sĩ
Kỹ thuật viên xét nghiệm / CĐHA
Chuyên viên / Nhân viên phòng chức năng
Lãnh đạo Khoa / Phòng
Nhân viên hỗ trợ khác`

const STAFF_UNIT_TYPES = `Khoa Lâm sàng (Nội, Ngoại, Sản, Nhi, Cấp cứu...)
Khoa Cận lâm sàng (Xét nghiệm, CĐHA, Dược...)
Phòng Chức năng (KHTH, TCCB, TCKT, QLCL, ĐD...)`

const STAFF_DEPARTMENTS = `Khoa Khám bệnh
Khoa Cấp cứu - Hồi sức tích cực
Khoa Nội tổng hợp
Khoa Ngoại tổng hợp
Khoa Phụ sản
Khoa Nhi
Khoa Y học cổ truyền & PHCN
Khoa Dược
Khoa Xét nghiệm & CĐHA
Khối các Phòng chức năng`

const AREA_SUGGESTIONS = `Xã Thới Lai, TP. Cần Thơ
Xã Trường Thành, TP. Cần Thơ
Xã Đông Thuận, TP. Cần Thơ
Xã Trường Xuân, TP. Cần Thơ
Xã Đông Hiệp, TP. Cần Thơ
Phường Ô Môn, TP. Cần Thơ
Xã Trường Long, TP. Cần Thơ
Xã Thới Hưng, TP. Cần Thơ
Thị trấn Cờ Đỏ, TP. Cần Thơ
Thị trấn Phong Điền, TP. Cần Thơ
Phường Thốt Nốt, TP. Cần Thơ
Phường Ninh Kiều, TP. Cần Thơ
Phường An Khánh, TP. Cần Thơ
Tỉnh Hậu Giang
Tỉnh Kiên Giang
Tỉnh An Giang
Tỉnh Đồng Tháp`

async function seed() {
  await client.connect()
  console.log('Đang kết nối PostgreSQL để điền dữ liệu mẫu cho Trang Khảo sát ý kiến...')

  // 1. Kiểm tra hoặc cập nhật bản ghi survey_page_settings
  const check = await client.query('SELECT id FROM public."survey_page_settings" LIMIT 1;')
  let spsId = 1
  if (check.rowCount === 0) {
    const insertRes = await client.query(`
      INSERT INTO public."survey_page_settings" (
        "eyebrow", "title", "description",
        "show_notice_banner", "notice_title", "notice_content", "notice_align",
        "outpatient_clinics", "inpatient_departments", "staff_positions", "staff_unit_types", "staff_departments", "area_suggestions",
        "created_at", "updated_at"
      ) VALUES (
        'CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT',
        'Khảo sát Ý kiến & Sự hài lòng',
        'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng từng ý kiến đóng góp của người bệnh và thân nhân để không ngừng nâng cao y đức, văn hóa phục vụ và chất lượng điều trị.',
        true,
        'Quy chế khảo sát ẩn danh & bảo mật thông tin',
        'Mọi câu trả lời của quý người bệnh hoàn toàn bảo mật, ẩn danh và không ảnh hưởng đến quá trình khám chữa bệnh.',
        'left',
        $1, $2, $3, $4, $5, $6,
        NOW(), NOW()
      ) RETURNING id;
    `, [
      OUTPATIENT_CLINICS,
      INPATIENT_DEPARTMENTS,
      STAFF_POSITIONS,
      STAFF_UNIT_TYPES,
      STAFF_DEPARTMENTS,
      AREA_SUGGESTIONS,
    ])
    spsId = insertRes.rows[0].id
  } else {
    spsId = check.rows[0].id
    await client.query(`
      UPDATE public."survey_page_settings" SET
        "eyebrow" = 'CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT',
        "title" = 'Khảo sát Ý kiến & Sự hài lòng',
        "description" = 'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng từng ý kiến đóng góp của người bệnh và thân nhân để không ngừng nâng cao y đức, văn hóa phục vụ và chất lượng điều trị.',
        "show_notice_banner" = true,
        "notice_title" = 'Quy chế khảo sát ẩn danh & bảo mật thông tin',
        "notice_content" = 'Mọi câu trả lời của quý người bệnh hoàn toàn bảo mật, ẩn danh và không ảnh hưởng đến quá trình khám chữa bệnh.',
        "notice_align" = 'left',
        "outpatient_clinics" = $1,
        "inpatient_departments" = $2,
        "staff_positions" = $3,
        "staff_unit_types" = $4,
        "staff_departments" = $5,
        "area_suggestions" = $6,
        "updated_at" = NOW()
      WHERE "id" = $7;
    `, [
      OUTPATIENT_CLINICS,
      INPATIENT_DEPARTMENTS,
      STAFF_POSITIONS,
      STAFF_UNIT_TYPES,
      STAFF_DEPARTMENTS,
      AREA_SUGGESTIONS,
      spsId,
    ])
  }

  // 2. Điền Info Boxes vào survey_page_settings_info_boxes
  await client.query(`DELETE FROM public."survey_page_settings_info_boxes" WHERE "_parent_id" = $1;`, [spsId])
  let boxOrder = 1
  for (const box of DEFAULT_SURVEY_BOXES) {
    const boxId = `sps_box_${boxOrder}`
    await client.query(`
      INSERT INTO public."survey_page_settings_info_boxes" (
        "_order", "_parent_id", "id", "enabled", "icon", "title", "desc"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT ("id") DO UPDATE SET
        "_order" = EXCLUDED."_order",
        "_parent_id" = EXCLUDED."_parent_id",
        "enabled" = EXCLUDED."enabled",
        "icon" = EXCLUDED."icon",
        "title" = EXCLUDED."title",
        "desc" = EXCLUDED."desc";
    `, [
      boxOrder++,
      spsId,
      boxId,
      true,
      box.icon,
      box.title,
      box.desc,
    ])
  }

  console.log('✓ Đã điền sẵn đầy đủ 100% nội dung mẫu vào CSDL cho Trang Khảo sát ý kiến (Global)!')
  await client.end()
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu mẫu khảo sát:', err)
  process.exit(1)
})
