export const id = '20260923_070_add_visit_stats_custom_labels_to_footer'
export const description = 'Thêm các cột tùy biến tiêu đề và nhãn thẻ thống kê truy cập vào bảng footer và _footer_v'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm các cột tiêu đề và nhãn thẻ vào bảng footer
  await client.query(`
    ALTER TABLE public."footer"
      ADD COLUMN IF NOT EXISTS "visit_stats_kicker" varchar DEFAULT 'HỆ THỐNG GIÁM SÁT TRUY CẬP',
      ADD COLUMN IF NOT EXISTS "visit_stats_title" varchar DEFAULT 'Thống kê truy cập Cổng thông tin điện tử',
      ADD COLUMN IF NOT EXISTS "visit_stats_meta_tag" varchar DEFAULT 'Hệ thống thời gian thực',
      ADD COLUMN IF NOT EXISTS "visit_stats_meta_org" varchar DEFAULT 'BVĐK KHU VỰC THỚI LAI',
      ADD COLUMN IF NOT EXISTS "visit_stats_online_label" varchar DEFAULT 'Đang trực tuyến',
      ADD COLUMN IF NOT EXISTS "visit_stats_today_label" varchar DEFAULT 'Lượt truy cập ngày',
      ADD COLUMN IF NOT EXISTS "visit_stats_month_label" varchar DEFAULT 'Lượt truy cập tháng',
      ADD COLUMN IF NOT EXISTS "visit_stats_total_label" varchar DEFAULT 'Tổng lượt truy cập';
  `)

  // 2. Thêm các cột tương ứng vào bảng version _footer_v
  await client.query(`
    ALTER TABLE public."_footer_v"
      ADD COLUMN IF NOT EXISTS "version_visit_stats_kicker" varchar DEFAULT 'HỆ THỐNG GIÁM SÁT TRUY CẬP',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_title" varchar DEFAULT 'Thống kê truy cập Cổng thông tin điện tử',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_meta_tag" varchar DEFAULT 'Hệ thống thời gian thực',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_meta_org" varchar DEFAULT 'BVĐK KHU VỰC THỚI LAI',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_online_label" varchar DEFAULT 'Đang trực tuyến',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_today_label" varchar DEFAULT 'Lượt truy cập ngày',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_month_label" varchar DEFAULT 'Lượt truy cập tháng',
      ADD COLUMN IF NOT EXISTS "version_visit_stats_total_label" varchar DEFAULT 'Tổng lượt truy cập';
  `)

  // 3. Điền nội dung mẫu vào bản ghi footer hiện tại nếu đang null
  await client.query(`
    UPDATE public."footer"
    SET
      "visit_stats_kicker" = COALESCE("visit_stats_kicker", 'HỆ THỐNG GIÁM SÁT TRUY CẬP'),
      "visit_stats_title" = COALESCE("visit_stats_title", 'Thống kê truy cập Cổng thông tin điện tử'),
      "visit_stats_meta_tag" = COALESCE("visit_stats_meta_tag", 'Hệ thống thời gian thực'),
      "visit_stats_meta_org" = COALESCE("visit_stats_meta_org", 'BVĐK KHU VỰC THỚI LAI'),
      "visit_stats_online_label" = COALESCE("visit_stats_online_label", 'Đang trực tuyến'),
      "visit_stats_today_label" = COALESCE("visit_stats_today_label", 'Lượt truy cập ngày'),
      "visit_stats_month_label" = COALESCE("visit_stats_month_label", 'Lượt truy cập tháng'),
      "visit_stats_total_label" = COALESCE("visit_stats_total_label", 'Tổng lượt truy cập')
    WHERE "id" = 1;
  `)
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'footer'
      AND column_name IN (
        'visit_stats_kicker',
        'visit_stats_title',
        'visit_stats_meta_tag',
        'visit_stats_meta_org',
        'visit_stats_online_label',
        'visit_stats_today_label',
        'visit_stats_month_label',
        'visit_stats_total_label'
      );
  `)
  if (rows.length < 8) {
    throw new Error('Chưa đủ các cột tùy biến visit_stats trong bảng footer.')
  }
}
