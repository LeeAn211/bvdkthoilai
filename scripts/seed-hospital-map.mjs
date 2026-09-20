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

const DEFAULT_FLOORS = [
  {
    floorName: 'Tầng Trệt (Khu Tiếp đón & Cấp cứu)',
    overview: 'Khu vực tiếp đón ban đầu, khám bệnh đa khoa ngoại trú, cấp cứu khẩn cấp và nhà thuốc.',
    rooms: `• Quầy Tiếp nhận BHYT & Phát số tự động (Cửa số 1 – 4)
• Quầy Thu viện phí & Viện phí Ngoại trú
• Khoa Cấp cứu 24/24 & Phòng Hồi sức Cấp cứu chống sốc
• Khoa Khám bệnh (Các phòng khám: Nội, Ngoại, Sản, Nhi, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Y học cổ truyền)
• Nhà thuốc Bệnh viện đạt chuẩn GPP & Quầy Phát thuốc Ngoại trú BHYT
• Bàn Tổ Chăm sóc khách hàng & Chỉ dẫn di chuyển xe lăn`,
  },
  {
    floorName: 'Tầng 1 (Khu Cận lâm sàng & Chẩn đoán hình ảnh)',
    overview: 'Khu kỹ thuật xét nghiệm y học, chẩn đoán hình ảnh và thăm dò chức năng.',
    rooms: `• Phòng Xét nghiệm Huyết học – Sinh hóa – Vi sinh
• Phòng Chụp X-Quang kỹ thuật số & Chụp CT-Scanner
• Phòng Siêu âm Doppler màu (Tổng quát, Tim mạch, Sản phụ khoa)
• Phòng Đo điện tim (ECG) & Đo chức năng hô hấp
• Phòng Nội soi tiêu hóa (Dạ dày – Tá tràng – Đại trực tràng)
• Khu vực ghế chờ lấy máu và trả kết quả cận lâm sàng`,
  },
  {
    floorName: 'Tầng 2 (Khu Điều trị Nội trú 1 & Phẫu thuật)',
    overview: 'Các khoa điều trị nội trú hệ Ngoại, Sản và cụm phòng mổ vô khuẩn.',
    rooms: `• Khoa Ngoại Tổng hợp (Buồng bệnh nội trú Ngoại khoa)
• Khoa Phụ sản & Phòng sinh vô khuẩn
• Cụm Phẫu thuật – Gây mê hồi sức (Phòng mổ áp lực dương)
• Phòng Hồi tỉnh & Phòng Chăm sóc hậu phẫu tích cực
• Phòng Điều dưỡng trưởng khoa & Trực ban Bác sĩ`,
  },
  {
    floorName: 'Tầng 3 (Khu Điều trị Nội trú 2 & Ban Giám đốc)',
    overview: 'Các khoa điều trị nội trú hệ Nội, Nhi, YHCT và văn phòng hành chính.',
    rooms: `• Khoa Nội Tổng hợp & Khoa Nhi
• Khoa Y học Cổ truyền – Phục hồi chức năng
• Khoa Hồi sức tích cực – Chống độc (ICU)
• Hội trường giao ban chuyên môn & Phòng Đào tạo
• Văn phòng Ban Giám đốc & Các phòng chức năng (Kế hoạch tổng hợp, Tổ chức cán bộ, Tài chính kế toán)`,
  },
]

const DEFAULT_FACILITIES = [
  {
    icon: '💊',
    name: 'Nhà thuốc Bệnh viện GPP',
    location: 'Sảnh chính Tầng trệt (cạnh quầy tiếp đón)',
    hours: '06:00 – 21:00 hàng ngày',
    desc: 'Cung ứng đầy đủ thuốc điều trị chính hãng, vắc xin và vật tư y tế theo giá niêm yết của Bộ Y tế.',
  },
  {
    icon: '🚑',
    name: 'Cổng Cấp cứu 24/24',
    location: 'Cổng số 2 (Đường chuyên dụng xe cứu thương)',
    hours: 'Thường trực 24/7/365',
    desc: 'Đường tiếp cận riêng biệt, bằng phẳng, có mái che phục vụ tiếp nhận xe cấp cứu và ca bệnh nguy kịch.',
  },
  {
    icon: '🍵',
    name: 'Căn tin & Suất ăn Dinh dưỡng',
    location: 'Khuôn viên phía sau Tầng trệt',
    hours: '05:30 – 20:00 hàng ngày',
    desc: 'Phục vụ bữa ăn dinh dưỡng, nước giải khát hợp vệ sinh cho thân nhân và cung cấp suất ăn bệnh lý theo chỉ định.',
  },
  {
    icon: '🏧',
    name: 'Cây rút tiền ATM & Điểm thanh toán số',
    location: 'Cổng chính sảnh tiếp đón',
    hours: '24/24',
    desc: 'Cung cấp cây ATM rút tiền mặt và hỗ trợ quét mã VietQR tĩnh/động tại tất cả các quầy thu viện phí.',
  },
  {
    icon: '🛵',
    name: 'Bãi giữ xe 2 bánh & Ô tô',
    location: 'Hai bên cổng chính vào viện',
    hours: '24/24',
    desc: 'Khuôn viên có mái che, hệ thống camera an ninh giám sát và bảo vệ túc trực hỗ trợ người dân.',
  },
  {
    icon: '♿',
    name: 'Khu cấp phát Xe lăn & Xe cáng miễn phí',
    location: 'Tại Bàn Hướng dẫn CSKH (Sảnh chính)',
    hours: '24/24',
    desc: 'Phục vụ người cao tuổi, người khuyết tật và bệnh nhân đi lại khó khăn khi đến viện khám chữa bệnh.',
  },
]

async function seed() {
  await client.connect()
  console.log('Đang kết nối PostgreSQL để điền dữ liệu mẫu cho Trang Sơ đồ & Chỉ dẫn khoa phòng...')

  // 1. Kiểm tra hoặc cập nhật bản ghi hospital_map_settings
  const check = await client.query('SELECT id FROM public."hospital_map_settings" LIMIT 1;')
  let hmsId = 1
  if (check.rowCount === 0) {
    const insertRes = await client.query(`
      INSERT INTO public."hospital_map_settings" (
        "eyebrow", "title", "description",
        "show_notice_banner", "notice_title", "notice_content", "notice_align",
        "content_block_enabled", "content_block_title", "content_block_subtitle", "content_block_text_align",
        "created_at", "updated_at"
      ) VALUES (
        'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH',
        'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
        'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        true,
        'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển',
        '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.\n• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.',
        'left',
        true,
        'Chỉ dẫn Luồng Di chuyển & Tiện ích Hỗ trợ Người bệnh',
        'Thông tin chi tiết về hệ thống thang máy ưu tiên, đường dốc xe lăn, quy định trật tự an ninh và hướng dẫn tiếp cận các khoa lâm sàng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        'left',
        NOW(), NOW()
      ) RETURNING id;
    `)
    hmsId = insertRes.rows[0].id
  } else {
    hmsId = check.rows[0].id
    await client.query(`
      UPDATE public."hospital_map_settings" SET
        "eyebrow" = 'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH',
        "title" = 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
        "description" = 'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        "show_notice_banner" = true,
        "notice_title" = 'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển',
        "notice_content" = '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.\n• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.',
        "notice_align" = 'left',
        "content_block_enabled" = true,
        "content_block_title" = 'Chỉ dẫn Luồng Di chuyển & Tiện ích Hỗ trợ Người bệnh',
        "content_block_subtitle" = 'Thông tin chi tiết về hệ thống thang máy ưu tiên, đường dốc xe lăn, quy định trật tự an ninh và hướng dẫn tiếp cận các khoa lâm sàng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        "content_block_text_align" = 'left',
        "updated_at" = NOW()
      WHERE "id" = $1;
    `, [hmsId])
  }

  // 2. Điền Floors vào hospital_map_settings_floors
  await client.query(`DELETE FROM public."hospital_map_settings_floors" WHERE "_parent_id" = $1;`, [hmsId])
  let floorOrder = 1
  for (const fl of DEFAULT_FLOORS) {
    const flId = `fl_${floorOrder}`
    await client.query(`
      INSERT INTO public."hospital_map_settings_floors" (
        "_order", "_parent_id", "id", "enabled", "floor_name", "overview", "rooms"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT ("id") DO UPDATE SET
        "_order" = EXCLUDED."_order",
        "_parent_id" = EXCLUDED."_parent_id",
        "enabled" = EXCLUDED."enabled",
        "floor_name" = EXCLUDED."floor_name",
        "overview" = EXCLUDED."overview",
        "rooms" = EXCLUDED."rooms";
    `, [
      floorOrder++,
      hmsId,
      flId,
      true,
      fl.floorName,
      fl.overview,
      fl.rooms,
    ])
  }

  // 3. Điền Facilities vào hospital_map_settings_facilities
  await client.query(`DELETE FROM public."hospital_map_settings_facilities" WHERE "_parent_id" = $1;`, [hmsId])
  let facOrder = 1
  for (const fac of DEFAULT_FACILITIES) {
    const facId = `fac_${facOrder}`
    await client.query(`
      INSERT INTO public."hospital_map_settings_facilities" (
        "_order", "_parent_id", "id", "enabled", "icon", "name", "location", "hours", "desc"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT ("id") DO UPDATE SET
        "_order" = EXCLUDED."_order",
        "_parent_id" = EXCLUDED."_parent_id",
        "enabled" = EXCLUDED."enabled",
        "icon" = EXCLUDED."icon",
        "name" = EXCLUDED."name",
        "location" = EXCLUDED."location",
        "hours" = EXCLUDED."hours",
        "desc" = EXCLUDED."desc";
    `, [
      facOrder++,
      hmsId,
      facId,
      true,
      fac.icon,
      fac.name,
      fac.location,
      fac.hours,
      fac.desc,
    ])
  }

  // 4. Đồng bộ vào bảng hm_floors nếu có (dành cho site_settings fallback)
  const ssCheck = await client.query('SELECT id FROM public."site_settings" LIMIT 1;')
  if (ssCheck.rowCount > 0) {
    const ssId = ssCheck.rows[0].id
    await client.query(`DELETE FROM public."hm_floors" WHERE "_parent_id" = $1;`, [ssId])
    let hmOrder = 1
    for (const fl of DEFAULT_FLOORS) {
      const hmId = `hm_fl_${hmOrder}`
      await client.query(`
        INSERT INTO public."hm_floors" (
          "_order", "_parent_id", "id", "enabled", "floor_name", "overview", "rooms"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT ("id") DO UPDATE SET
          "_order" = EXCLUDED."_order",
          "_parent_id" = EXCLUDED."_parent_id",
          "enabled" = EXCLUDED."enabled",
          "floor_name" = EXCLUDED."floor_name",
          "overview" = EXCLUDED."overview",
          "rooms" = EXCLUDED."rooms";
      `, [
        hmOrder++,
        ssId,
        hmId,
        true,
        fl.floorName,
        fl.overview,
        fl.rooms,
      ])
    }
  }

  console.log('✓ Đã điền sẵn đầy đủ 100% nội dung mẫu vào CSDL cho Trang Sơ đồ & Chỉ dẫn khoa phòng!')
  await client.end()
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu mẫu sơ đồ bệnh viện:', err)
  process.exit(1)
})
