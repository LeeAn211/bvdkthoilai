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

const DEFAULT_PACKAGES = [
  {
    badge: 'Phổ biến nhất',
    title: 'Gói Khám Sức khỏe Tổng quát Định kỳ',
    targetUser: 'Người lớn từ 18 tuổi trở lên, người lao động, cán bộ hưu trí',
    priceText: '850.000 đ',
    desc: 'Kiểm tra toàn diện các chỉ số sinh hiệu, chức năng gan, thận, mỡ máu, đường huyết và phát hiện sớm các bệnh lý chuyển hóa.',
    features: `• Khám lâm sàng toàn diện: Nội, Ngoại, Mắt, Tai Mũi Họng, Răng Hàm Mặt
• Xét nghiệm máu: Công thức máu 18 thông số, Đường huyết đói (Glucose)
• Đánh giá chức năng gan (AST/GOT, ALT/GPT) & Chức năng thận (Ure, Creatinin)
• Xét nghiệm mỡ máu toàn phần (Cholesterol, Triglycerid)
• Tổng phân tích nước tiểu 10 thông số
• Chụp X-Quang ngực thẳng kỹ thuật số
• Siêu âm màu ổ bụng tổng quát & Đo điện tâm đồ (ECG)
• Bác sĩ chuyên khoa kết luận và tư vấn chế độ ăn uống, sinh hoạt`,
    showButton: true,
    buttonText: 'Đăng ký khám ngay',
    buttonLink: '/dat-lich-kham',
  },
  {
    badge: 'Chuyên sâu',
    title: 'Gói Tầm soát Bệnh lý Tim mạch & Huyết áp',
    targetUser: 'Người trên 40 tuổi, người có tiền sử tăng huyết áp, đái tháo đường hoặc gia đình có bệnh tim',
    priceText: '1.250.000 đ',
    desc: 'Đánh giá nguy cơ xơ vữa động mạch, suy tim, bệnh mạch vành và các biến chứng tim mạch sớm.',
    features: `• Khám chuyên khoa Tim mạch cùng Bác sĩ Chuyên khoa I / II
• Đo điện tâm đồ 12 chuyển đạo (ECG)
• Siêu âm tim Doppler màu khảo sát cấu trúc van tim và co bóp cơ tim
• Xét nghiệm bộ lipid máu nâng cao (HDL-C, LDL-C, Triglycerid, Cholesterol)
• Xét nghiệm đường huyết & HbA1c (đánh giá đường huyết trung bình 3 tháng)
• Đo chức năng thận & Axit Uric máu
• Chụp X-Quang tim phổi thẳng
• Tư vấn phác đồ phòng ngừa nhồi máu cơ tim & đột quỵ`,
    showButton: true,
    buttonText: 'Đăng ký tầm soát',
    buttonLink: '/dat-lich-kham',
  },
  {
    badge: 'Đúng quy chuẩn',
    title: 'Gói Khám Cấp Giấy phép Lái xe (Hạng A1, B1, B2, C...)',
    targetUser: 'Người học lái xe mới hoặc gia hạn, đổi bằng lái xe các hạng',
    priceText: '360.000 đ',
    desc: 'Khám và cấp Giấy chứng nhận sức khỏe lái xe theo đúng Thông tư liên tịch của Bộ Y tế và Bộ Giao thông Vận tải.',
    features: `• Khám thể lực: Chiều cao, cân nặng, vòng ngực, huyết áp, mạch
• Khám Mắt: Thị lực, sắc giác (khả năng nhận biết màu sắc tín hiệu giao thông)
• Khám Tai Mũi Họng & Thần kinh, Tâm thần
• Khám Cơ xương khớp & Hệ hô hấp, Tim mạch
• Xét nghiệm ma túy 4 chất (Test nhanh que thử 4 chân)
• Xét nghiệm nồng độ cồn trong máu / hơi thở
• Ký duyệt hồ sơ và trả kết quả ngay trong buổi khám`,
    showButton: true,
    buttonText: 'Đăng ký khám lái xe',
    buttonLink: '/dat-lich-kham',
  },
  {
    badge: 'Hạnh phúc gia đình',
    title: 'Gói Khám Sức khỏe Tiền Hôn nhân',
    targetUser: 'Các cặp đôi chuẩn bị kết hôn hoặc có kế hoạch mang thai',
    priceText: '1.100.000 đ',
    desc: 'Kiểm tra sức khỏe sinh sản, phát hiện sớm các bệnh lý di truyền và bệnh lây truyền qua đường tình dục.',
    features: `• Khám chuyên khoa Sản phụ khoa (Nữ) và Khám Nam khoa (Nam)
• Xét nghiệm công thức máu, nhóm máu ABO & Rh
• Tầm soát viêm gan siêu vi B (HBsAg, Anti-HBs), Viêm gan C
• Xét nghiệm sàng lọc HIV, Giang mai
• Siêu âm tử cung - buồng trứng (Nữ) / Siêu âm tinh hoàn (Nam)
• Soi tươi dịch âm đạo & Tầm soát tế bào cổ tử cung
• Bác sĩ tư vấn tiêm ngừa phòng bệnh trước khi mang thai`,
    showButton: true,
    buttonText: 'Đăng ký tư vấn',
    buttonLink: '/dat-lich-kham',
  },
]

async function seed() {
  await client.connect()
  console.log('Đang kết nối PostgreSQL để điền dữ liệu mẫu cho Trang Gói khám sức khỏe...')

  // 1. Kiểm tra hoặc cập nhật bản ghi checkup_packages_settings
  const check = await client.query('SELECT id FROM public."checkup_packages_settings" LIMIT 1;')
  let cpsId = 1
  if (check.rowCount === 0) {
    const insertRes = await client.query(`
      INSERT INTO public."checkup_packages_settings" (
        "eyebrow", "title", "description",
        "show_notice_banner", "notice_title", "notice_content", "notice_align",
        "content_block_enabled", "content_block_title", "content_block_subtitle", "content_block_text_align",
        "created_at", "updated_at"
      ) VALUES (
        'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE',
        'Gói Khám Sức khỏe & Tầm soát Bệnh lý',
        'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        true,
        'Lưu ý quan trọng trước khi đi khám sức khỏe',
        '• Nhịn ăn sáng từ 8 - 10 tiếng nếu gói khám có xét nghiệm đường huyết, mỡ máu.\n• Uống nhiều nước lọc và nhịn tiểu trước khi làm siêu âm ổ bụng.\n• Không sử dụng rượu bia, chất kích thích 24 giờ trước khi khám.',
        'left',
        true,
        'Chính sách Khám Sức khỏe Định kỳ & Tư vấn Doanh nghiệp / Cá nhân',
        'Quy trình tiếp nhận, đăng ký khám theo đoàn thể, công ty, trường học và cá nhân với quy chuẩn xét nghiệm chẩn đoán hiện đại tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        'left',
        NOW(), NOW()
      ) RETURNING id;
    `)
    cpsId = insertRes.rows[0].id
  } else {
    cpsId = check.rows[0].id
    await client.query(`
      UPDATE public."checkup_packages_settings" SET
        "eyebrow" = 'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE',
        "title" = 'Gói Khám Sức khỏe & Tầm soát Bệnh lý',
        "description" = 'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        "show_notice_banner" = true,
        "notice_title" = 'Lưu ý quan trọng trước khi đi khám sức khỏe',
        "notice_content" = '• Nhịn ăn sáng từ 8 - 10 tiếng nếu gói khám có xét nghiệm đường huyết, mỡ máu.\n• Uống nhiều nước lọc và nhịn tiểu trước khi làm siêu âm ổ bụng.\n• Không sử dụng rượu bia, chất kích thích 24 giờ trước khi khám.',
        "notice_align" = 'left',
        "content_block_enabled" = true,
        "content_block_title" = 'Chính sách Khám Sức khỏe Định kỳ & Tư vấn Doanh nghiệp / Cá nhân',
        "content_block_subtitle" = 'Quy trình tiếp nhận, đăng ký khám theo đoàn thể, công ty, trường học và cá nhân với quy chuẩn xét nghiệm chẩn đoán hiện đại tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        "content_block_text_align" = 'left',
        "updated_at" = NOW()
      WHERE "id" = $1;
    `, [cpsId])
  }

  // 2. Điền Packages vào checkup_packages_settings_packages
  await client.query(`DELETE FROM public."checkup_packages_settings_packages" WHERE "_parent_id" = $1;`, [cpsId])
  let order = 1
  for (const pkg of DEFAULT_PACKAGES) {
    const pkgId = `pkg_${order}`
    await client.query(`
      INSERT INTO public."checkup_packages_settings_packages" (
        "_order", "_parent_id", "id", "enabled", "badge", "title", "target_user", "price_text", "desc", "features", "show_button", "button_text", "button_link"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT ("id") DO UPDATE SET
        "_order" = EXCLUDED."_order",
        "_parent_id" = EXCLUDED."_parent_id",
        "enabled" = EXCLUDED."enabled",
        "badge" = EXCLUDED."badge",
        "title" = EXCLUDED."title",
        "target_user" = EXCLUDED."target_user",
        "price_text" = EXCLUDED."price_text",
        "desc" = EXCLUDED."desc",
        "features" = EXCLUDED."features",
        "show_button" = EXCLUDED."show_button",
        "button_text" = EXCLUDED."button_text",
        "button_link" = EXCLUDED."button_link";
    `, [
      order++,
      cpsId,
      pkgId,
      true,
      pkg.badge,
      pkg.title,
      pkg.targetUser,
      pkg.priceText,
      pkg.desc,
      pkg.features,
      pkg.showButton,
      pkg.buttonText,
      pkg.buttonLink,
    ])
  }

  // 3. Đồng thời nạp vào bảng chk_pkgs nếu có (dành cho site_settings.checkupPackagesPage fallback)
  // Lấy site_settings id
  const ssCheck = await client.query('SELECT id FROM public."site_settings" LIMIT 1;')
  if (ssCheck.rowCount > 0) {
    const ssId = ssCheck.rows[0].id
    await client.query(`DELETE FROM public."chk_pkgs" WHERE "_parent_id" = $1;`, [ssId])
    let chkOrder = 1
    for (const pkg of DEFAULT_PACKAGES) {
      const chkId = `chk_pkg_${chkOrder}`
      await client.query(`
        INSERT INTO public."chk_pkgs" (
          "_order", "_parent_id", "id", "enabled", "badge", "title", "target_user", "price_text", "desc", "features", "show_button", "button_text", "button_link"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT ("id") DO UPDATE SET
          "_order" = EXCLUDED."_order",
          "_parent_id" = EXCLUDED."_parent_id",
          "enabled" = EXCLUDED."enabled",
          "badge" = EXCLUDED."badge",
          "title" = EXCLUDED."title",
          "target_user" = EXCLUDED."target_user",
          "price_text" = EXCLUDED."price_text",
          "desc" = EXCLUDED."desc",
          "features" = EXCLUDED."features",
          "show_button" = EXCLUDED."show_button",
          "button_text" = EXCLUDED."button_text",
          "button_link" = EXCLUDED."button_link";
      `, [
        chkOrder++,
        ssId,
        chkId,
        true,
        pkg.badge,
        pkg.title,
        pkg.targetUser,
        pkg.priceText,
        pkg.desc,
        pkg.features,
        pkg.showButton,
        pkg.buttonText,
        pkg.buttonLink,
      ])
    }
  }

  console.log('✓ Đã điền sẵn đầy đủ 100% nội dung mẫu vào CSDL cho Trang Gói khám sức khỏe!')
  await client.end()
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu mẫu gói khám:', err)
  process.exit(1)
})
