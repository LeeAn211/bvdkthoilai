export const id = '20260921_060_add_visit_statistics'
export const description = 'Thêm bảng thống kê lượt truy cập site_visits_summary, site_visits_daily, cột views bài viết và cấu hình bật/tắt thống kê footer'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo bảng tổng kết thống kê truy cập website
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."site_visits_summary" (
      "id" serial PRIMARY KEY,
      "total_views" bigint DEFAULT 0,
      "total_visits" bigint DEFAULT 0,
      "initial_offset" integer DEFAULT 0,
      "updated_at" timestamp with time zone DEFAULT now()
    );

    INSERT INTO public."site_visits_summary" ("id", "total_views", "total_visits", "initial_offset", "updated_at")
    SELECT 1, 0, 0, 0, now()
    WHERE NOT EXISTS (SELECT 1 FROM public."site_visits_summary" WHERE "id" = 1);
  `)

  // 2. Tạo bảng thống kê truy cập hàng ngày (theo ngày YYYY-MM-DD)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."site_visits_daily" (
      "date" varchar(10) PRIMARY KEY,
      "views" bigint DEFAULT 0,
      "unique_visits" bigint DEFAULT 0,
      "updated_at" timestamp with time zone DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS "site_visits_daily_date_idx" ON public."site_visits_daily" ("date");
  `)

  // 3. Thêm cột views cho các collection bài viết nếu chưa có
  await client.query(`
    ALTER TABLE public."news" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0;
    ALTER TABLE public."_news_v" ADD COLUMN IF NOT EXISTS "version_views" integer DEFAULT 0;

    ALTER TABLE public."notices" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0;
    ALTER TABLE public."_notices_v" ADD COLUMN IF NOT EXISTS "version_views" integer DEFAULT 0;

    ALTER TABLE public."clinical_protocols" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0;
    ALTER TABLE public."_clinical_protocols_v" ADD COLUMN IF NOT EXISTS "version_views" integer DEFAULT 0;
  `)

  // 4. Thêm các cột cấu hình hiển thị thống kê ngoài Website vào bảng footer và _footer_v
  await client.query(`
    ALTER TABLE public."footer"
      ADD COLUMN IF NOT EXISTS "visit_stats_show_stats" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "visit_stats_show_online" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "visit_stats_show_today" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "visit_stats_show_month" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "visit_stats_show_total" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "visit_stats_initial_offset" integer DEFAULT 0;

    ALTER TABLE public."_footer_v"
      ADD COLUMN IF NOT EXISTS "version_visit_stats_show_stats" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_visit_stats_show_online" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_visit_stats_show_today" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_visit_stats_show_month" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_visit_stats_show_total" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_visit_stats_initial_offset" integer DEFAULT 0;
  `)

  // 5. Thêm cấu hình hiển thị thẻ Thống kê lượt truy cập & biểu đồ trong SystemSettings Admin Dashboard
  await client.query(`
    ALTER TABLE public."system_settings"
      ADD COLUMN IF NOT EXISTS "dashboard_settings_show_visit_stats" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "dashboard_settings_show_visit_stats_chart" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "dashboard_settings_show_weekly_workload" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "dashboard_settings_show_resource_structure" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "dashboard_settings_show_feedback_donut" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "dashboard_settings_show_protocol_distribution" boolean DEFAULT true;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra bảng site_visits_summary
  const summaryCheck = await client.query(`
    SELECT COUNT(*)::int AS count FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'site_visits_summary';
  `)
  if (summaryCheck.rows[0]?.count !== 1) {
    throw new Error('Thiếu bảng site_visits_summary.')
  }

  // 2. Kiểm tra bảng site_visits_daily
  const dailyCheck = await client.query(`
    SELECT COUNT(*)::int AS count FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'site_visits_daily';
  `)
  if (dailyCheck.rows[0]?.count !== 1) {
    throw new Error('Thiếu bảng site_visits_daily.')
  }

  // 3. Kiểm tra các cột trong footer
  const footerCheck = await client.query(`
    SELECT COUNT(*)::int AS count FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'footer'
      AND column_name IN (
        'visit_stats_show_stats',
        'visit_stats_show_online',
        'visit_stats_show_today',
        'visit_stats_show_month',
        'visit_stats_show_total',
        'visit_stats_initial_offset'
      );
  `)
  if (footerCheck.rows[0]?.count !== 6) {
    throw new Error('Bảng footer chưa đủ các cột visit_stats.')
  }

  // 4. Kiểm tra cột views trong news, notices, clinical_protocols
  const viewsCheck = await client.query(`
    SELECT COUNT(*)::int AS count FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'views'
      AND table_name IN ('news', 'notices', 'clinical_protocols');
  `)
  if (viewsCheck.rows[0]?.count !== 3) {
    throw new Error('Chưa đủ cột views cho các bài viết.')
  }
}
