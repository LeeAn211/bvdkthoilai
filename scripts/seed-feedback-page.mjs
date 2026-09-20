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

const DEFAULT_FEEDBACK_BOXES = [
  {
    icon: '📞',
    title: 'Đường dây nóng 24/7',
    desc: 'Trường hợp khẩn cấp, vui lòng gọi trực tiếp hotline: {{HOTLINE}} hoặc Cấp cứu: {{EMERGENCY_HOTLINE}}.',
  },
  {
    icon: '🔍',
    title: 'Cấp mã tra cứu minh bạch',
    desc: 'Sau khi gửi ý kiến, bạn sẽ nhận được mã tiếp nhận để tra cứu tiến độ xử lý và phản hồi công khai từ bệnh viện.',
  },
  {
    icon: '⚖️',
    title: 'Bảo mật & Tôn trọng',
    desc: 'Bệnh viện cam kết bảo mật danh tính người phản ánh theo đúng quy định của Luật Khám bệnh, chữa bệnh.',
  },
]

async function seed() {
  await client.connect()
  console.log('Đang kết nối PostgreSQL để điền dữ liệu mẫu cho Trang Góp ý – Phản ánh...')

  // 1. Kiểm tra hoặc cập nhật bản ghi feedback_page_settings
  const check = await client.query('SELECT id FROM public."feedback_page_settings" LIMIT 1;')
  let fbId = 1
  if (check.rowCount === 0) {
    const insertRes = await client.query(`
      INSERT INTO public."feedback_page_settings" (
        "eyebrow", "title", "description",
        "show_notice_banner", "notice_title", "notice_content", "notice_align",
        "created_at", "updated_at"
      ) VALUES (
        'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN',
        'Góp ý – Phản ánh Chất lượng',
        'Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ.',
        true,
        'Quy trình tiếp nhận phản ánh & xử lý minh bạch',
        '• Ban Giám đốc tiếp nhận trực tiếp mọi ý kiến phản ánh của người bệnh và thân nhân.\n• Mọi phản ánh đều được cấp mã tra cứu tiến độ xử lý minh bạch và phản hồi chính thức.',
        'left',
        NOW(), NOW()
      ) RETURNING id;
    `)
    fbId = insertRes.rows[0].id
  } else {
    fbId = check.rows[0].id
    await client.query(`
      UPDATE public."feedback_page_settings" SET
        "eyebrow" = 'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN',
        "title" = 'Góp ý – Phản ánh Chất lượng',
        "description" = 'Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ.',
        "show_notice_banner" = true,
        "notice_title" = 'Quy trình tiếp nhận phản ánh & xử lý minh bạch',
        "notice_content" = '• Ban Giám đốc tiếp nhận trực tiếp mọi ý kiến phản ánh của người bệnh và thân nhân.\n• Mọi phản ánh đều được cấp mã tra cứu tiến độ xử lý minh bạch và phản hồi chính thức.',
        "notice_align" = 'left',
        "updated_at" = NOW()
      WHERE "id" = $1;
    `, [fbId])
  }

  // 2. Điền Info Boxes vào feedback_page_settings_info_boxes
  await client.query(`DELETE FROM public."feedback_page_settings_info_boxes" WHERE "_parent_id" = $1;`, [fbId])
  let boxOrder = 1
  for (const box of DEFAULT_FEEDBACK_BOXES) {
    const boxId = `fb_box_${boxOrder}`
    await client.query(`
      INSERT INTO public."feedback_page_settings_info_boxes" (
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
      fbId,
      boxId,
      true,
      box.icon,
      box.title,
      box.desc,
    ])
  }

  console.log('✓ Đã điền sẵn đầy đủ 100% nội dung mẫu vào CSDL cho Trang Góp ý – Phản ánh!')
  await client.end()
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu mẫu góp ý:', err)
  process.exit(1)
})
