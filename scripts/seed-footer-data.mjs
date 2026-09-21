import fs from 'node:fs'
import pg from 'pg'
import crypto from 'node:crypto'

for (const envFile of ['.env.local', '.env']) {
  if (!fs.existsSync(envFile)) continue
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

function makeId() {
  return crypto.randomBytes(12).toString('hex')
}

console.log('--- BẮT ĐẦU ĐIỀN DỮ LIỆU MẪU CHÂN TRANG (FOOTER) ---')

// 1. Cập nhật thông tin cốt lõi bảng footer
const sampleDescription = 'Bệnh viện Đa khoa Khu vực Thới Lai là đơn vị y tế công lập tuyến quận/huyện phục vụ khám chữa bệnh chất lượng cao cho nhân dân huyện Thới Lai và khu vực lân cận; không ngừng nỗ lực nâng cao y đức, tinh thần phục vụ và đổi mới trang thiết bị kỹ thuật.'

await client.query(`
  UPDATE public."footer"
  SET 
    "enabled" = true,
    "brand_options_show_logo" = true,
    "brand_options_show_hospital_name" = true,
    "brand_options_show_address" = true,
    "brand_options_show_phone" = true,
    "brand_options_show_emergency_hotline" = true,
    "brand_options_show_email" = true,
    "brand_options_show_working_hours" = true,
    "brand_options_show_description" = true,
    "description" = $1,
    "show_social" = true,
    "bottom_show_copyright" = true,
    "bottom_copyright" = '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai',
    "bottom_show_right_text" = true,
    "bottom_right_text" = 'Cổng thông tin điện tử y tế công cộng',
    "show_mobile_bar" = true,
    "visit_stats_show_stats" = true,
    "visit_stats_show_online" = true,
    "visit_stats_show_today" = true,
    "visit_stats_show_month" = true,
    "visit_stats_show_total" = true,
    "visit_stats_initial_offset" = 0,
    "updated_at" = now()
  WHERE "id" = 1;
`, [sampleDescription])

// 2. Dữ liệu chuẩn mực cho các cột chân trang (Columns & Links)
const sampleColumns = [
  {
    title: 'Dành cho người bệnh',
    textAlign: 'left',
    links: [
      { label: 'Đặt lịch khám trực tuyến', linkMode: 'external', url: 'https://medpro.vn/', openNewTab: true },
      { label: 'Quy trình khám bệnh', linkMode: 'internal', url: '/quy-trinh-kham-benh', openNewTab: false },
      { label: 'Giờ làm việc & Tiếp đón', linkMode: 'internal', url: '/lich-lam-viec', openNewTab: false },
      { label: 'Lịch khám & Trực cấp cứu', linkMode: 'internal', url: '/lich-kham', openNewTab: false },
      { label: 'Bảng giá dịch vụ kỹ thuật', linkMode: 'internal', url: '/bang-gia', openNewTab: false },
      { label: 'Hướng dẫn khám chữa BHYT', linkMode: 'internal', url: '/trang/kham-bhyt', openNewTab: false },
    ],
  },
  {
    title: 'Thông tin bệnh viện',
    textAlign: 'left',
    links: [
      { label: 'Giới thiệu chung', linkMode: 'internal', url: '/gioi-thieu', openNewTab: false },
      { label: 'Sơ đồ tổ chức & Khoa phòng', linkMode: 'internal', url: '/chuyen-khoa', openNewTab: false },
      { label: 'Đội ngũ Bác sĩ chuyên khoa', linkMode: 'internal', url: '/bac-si', openNewTab: false },
      { label: 'Tin tức & Hoạt động y tế', linkMode: 'internal', url: '/tin-tuc', openNewTab: false },
      { label: 'Thông báo & Chỉ đạo điều hành', linkMode: 'internal', url: '/thong-bao', openNewTab: false },
      { label: 'Đấu thầu – Mua sắm y tế', linkMode: 'internal', url: '/dau-thau-mua-sam', openNewTab: false },
    ],
  },
  {
    title: 'Hỗ trợ & Tra cứu',
    textAlign: 'left',
    links: [
      { label: 'Hỏi đáp y tế & Tư vấn', linkMode: 'internal', url: '/hoi-dap', openNewTab: false },
      { label: 'Khảo sát sự hài lòng', linkMode: 'internal', url: '/khao-sat', openNewTab: false },
      { label: 'Góp ý – Phản ánh chất lượng', linkMode: 'internal', url: '/lien-he', openNewTab: false },
      { label: 'Văn bản – Biểu mẫu tài liệu', linkMode: 'internal', url: '/van-ban', openNewTab: false },
      { label: 'Tìm kiếm trên cổng thông tin', linkMode: 'internal', url: '/tim-kiem', openNewTab: false },
    ],
  },
]

// Xóa các cột và link cũ của Footer
await client.query('DELETE FROM public.footer_columns_links;')
await client.query('DELETE FROM public.footer_columns;')

// Chèn lại các cột và links mới
let colOrder = 1
for (const col of sampleColumns) {
  const colId = makeId()
  await client.query(`
    INSERT INTO public.footer_columns ("_order", "_parent_id", "id", "visible", "title", "text_align")
    VALUES ($1, 1, $2, true, $3, $4);
  `, [colOrder, colId, col.title, col.textAlign])

  let linkOrder = 1
  for (const link of col.links) {
    const linkId = makeId()
    await client.query(`
      INSERT INTO public.footer_columns_links (
        "_order", "_parent_id", "id", "visible", "label", "link_mode", "url", "open_new_tab"
      ) VALUES ($1, $2, $3, true, $4, $5, $6, $7);
    `, [linkOrder, colId, linkId, link.label, link.linkMode, link.url, link.openNewTab])
    linkOrder++
  }
  colOrder++
}

// Đồng bộ sang bảng version _footer_v để Payload CMS quản trị hiển thị chính xác
await client.query('DELETE FROM public._footer_v_version_columns_links;')
await client.query('DELETE FROM public._footer_v_version_columns;')
await client.query('DELETE FROM public._footer_v;')

const versionRes = await client.query(`
  INSERT INTO public._footer_v (
    "version_enabled",
    "version_brand_options_show_logo",
    "version_brand_options_show_hospital_name",
    "version_brand_options_show_address",
    "version_brand_options_show_phone",
    "version_brand_options_show_emergency_hotline",
    "version_brand_options_show_email",
    "version_brand_options_show_working_hours",
    "version_brand_options_show_description",
    "version_description",
    "version_show_social",
    "version_bottom_show_copyright",
    "version_bottom_copyright",
    "version_bottom_show_right_text",
    "version_bottom_right_text",
    "version_show_mobile_bar",
    "version_visit_stats_show_stats",
    "version_visit_stats_show_online",
    "version_visit_stats_show_today",
    "version_visit_stats_show_month",
    "version_visit_stats_show_total",
    "version_visit_stats_initial_offset",
    "version_created_at",
    "version_updated_at",
    "created_at",
    "updated_at"
  ) VALUES (
    true, true, true, true, true, true, true, true, true,
    $1, true, true, '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai',
    true, 'Cổng thông tin điện tử y tế công cộng', true,
    true, true, true, true, true, 0,
    now(), now(), now(), now()
  ) RETURNING id;
`, [sampleDescription])

const newVersionId = versionRes.rows[0].id

colOrder = 1
for (const col of sampleColumns) {
  const colUuid = crypto.randomUUID()
  const vColRes = await client.query(`
    INSERT INTO public._footer_v_version_columns (
      "_order", "_parent_id", "visible", "title", "text_align", "_uuid"
    ) VALUES ($1, $2, true, $3, $4, $5) RETURNING id;
  `, [colOrder, newVersionId, col.title, col.textAlign, colUuid])

  const vColId = vColRes.rows[0].id

  let linkOrder = 1
  for (const link of col.links) {
    const linkUuid = crypto.randomUUID()
    await client.query(`
      INSERT INTO public._footer_v_version_columns_links (
        "_order", "_parent_id", "visible", "label", "link_mode", "url", "open_new_tab", "_uuid"
      ) VALUES ($1, $2, true, $3, $4, $5, $6, $7);
    `, [linkOrder, vColId, link.label, link.linkMode, link.url, link.openNewTab, linkUuid])
    linkOrder++
  }
  colOrder++
}

console.log('✅ ĐÃ ĐIỀN ĐẦY ĐỦ NỘI DUNG MẪU CHÂN TRANG VÀO CMS THÀNH CÔNG!')
await client.end()
