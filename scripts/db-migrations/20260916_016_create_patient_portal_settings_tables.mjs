export const id = '20260916_016_create_patient_portal_settings_tables'
export const description = 'Tạo bảng patient_portal_settings và các bảng phụ pps_sub_tabs, pps_commits, pps_svc_groups, pps_svc_items quản trị 100% trang Dành cho người bệnh'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu ENUM nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pps_not_align') THEN
        CREATE TYPE public."pps_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pps_badge_t') THEN
        CREATE TYPE public."pps_badge_t" AS ENUM ('active', 'periodic', 'closed');
      END IF;
    END $$;
  `)

  // 2. Tạo bảng chính patient_portal_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."patient_portal_settings" (
      "id" serial PRIMARY KEY,
      "hero_eyebrow" varchar DEFAULT 'CỔNG TIỆN ÍCH DÀNH CHO NGƯỜI BỆNH',
      "hero_title" varchar NOT NULL DEFAULT 'Dành cho Người bệnh',
      "hero_description" text DEFAULT 'Tổng hợp đầy đủ hướng dẫn quy trình khám chữa bệnh, lịch làm việc, biểu phí, kênh tiếp nhận phản ánh và khảo sát ý kiến tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      "hero_show_notice_banner" boolean DEFAULT false,
      "hero_notice_title" varchar DEFAULT 'Thông báo dành cho người bệnh & thân nhân',
      "hero_notice_content" text DEFAULT '• Vui lòng mang theo CCCD gắn chip (hoặc ứng dụng VNeID mức 2) và thẻ BHYT khi đến đăng ký khám.
• Đặt lịch hẹn trực tuyến để được tiếp nhận ưu tiên và giảm thời gian chờ đợi.',
      "hero_notice_align" public."pps_not_align" DEFAULT 'left',
      "commitments_section_enabled" boolean DEFAULT true,
      "cta_section_enabled" boolean DEFAULT true,
      "cta_section_title" varchar DEFAULT 'Bạn cần hỗ trợ khẩn cấp hoặc cần hỏi thêm thông tin?',
      "cta_section_description" text DEFAULT 'Đường dây nóng bệnh viện: {{HOTLINE}} · Cấp cứu 24/24: {{EMERGENCY_HOTLINE}}. Bệnh viện luôn sẵn sàng phục vụ!',
      "cta_section_primary_btn_text" varchar DEFAULT 'Gọi tư vấn ngay',
      "cta_section_secondary_btn_text" varchar DEFAULT 'Thông tin liên hệ',
      "cta_section_secondary_btn_link" varchar DEFAULT '/lien-he',
      "updated_at" timestamp with time zone DEFAULT now(),
      "created_at" timestamp with time zone DEFAULT now()
    );
  `)

  // 3. Tạo bảng phụ pps_sub_tabs (các Tab điều hướng Sub-Nav)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."pps_sub_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "key" varchar NOT NULL,
      "label" varchar NOT NULL,
      "href" varchar NOT NULL,
      "icon" varchar DEFAULT '🏥',
      "badge" varchar
    );
    CREATE INDEX IF NOT EXISTS "pps_sub_tabs_order_idx" ON public."pps_sub_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "pps_sub_tabs_parent_id_idx" ON public."pps_sub_tabs" ("_parent_id");
  `)

  // 4. Tạo bảng phụ pps_commits (các ô cam kết phục vụ)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."pps_commits" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '❤️',
      "title" varchar NOT NULL,
      "desc" text NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pps_commits_order_idx" ON public."pps_commits" ("_order");
    CREATE INDEX IF NOT EXISTS "pps_commits_parent_id_idx" ON public."pps_commits" ("_parent_id");
  `)

  // 5. Tạo bảng phụ pps_svc_groups (nhóm danh mục dịch vụ)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."pps_svc_groups" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "category_title" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "pps_svc_groups_order_idx" ON public."pps_svc_groups" ("_order");
    CREATE INDEX IF NOT EXISTS "pps_svc_groups_parent_id_idx" ON public."pps_svc_groups" ("_parent_id");
  `)

  // 6. Tạo bảng phụ pps_svc_items (thẻ dịch vụ tiện ích con)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."pps_svc_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "desc" text NOT NULL,
      "href" varchar NOT NULL,
      "icon" varchar DEFAULT '🩺',
      "badge" varchar,
      "badge_type" public."pps_badge_t" DEFAULT 'active',
      "button_text" varchar DEFAULT 'Truy cập dịch vụ →'
    );
    CREATE INDEX IF NOT EXISTS "pps_svc_items_order_idx" ON public."pps_svc_items" ("_order");
    CREATE INDEX IF NOT EXISTS "pps_svc_items_parent_id_idx" ON public."pps_svc_items" ("_parent_id");
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = 'patient_portal_settings';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng patient_portal_settings trong cơ sở dữ liệu.')
  }
}
