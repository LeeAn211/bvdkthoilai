export const id = '20260916_017_add_patient_care_content_tables'
export const description = 'Tạo các bảng và cột quản trị nội dung chi tiết các tab dành cho người bệnh (quy trình khám, chất lượng, khảo sát, biểu mẫu, góp ý)'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu enum nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qp_icon_t') THEN
        CREATE TYPE public."qp_icon_t" AS ENUM ('blue', 'green', 'amber');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fb_not_align') THEN
        CREATE TYPE public."fb_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Bổ sung các cột feedbackPage vào site_settings và _site_settings_v
  await client.query(`
    ALTER TABLE public."site_settings"
      ADD COLUMN IF NOT EXISTS "feedback_page_eyebrow" varchar DEFAULT 'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN',
      ADD COLUMN IF NOT EXISTS "feedback_page_title" varchar DEFAULT 'Góp ý – Phản ánh Chất lượng',
      ADD COLUMN IF NOT EXISTS "feedback_page_description" varchar DEFAULT 'Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ.',
      ADD COLUMN IF NOT EXISTS "feedback_page_show_notice_banner" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "feedback_page_notice_title" varchar DEFAULT 'Quy trình tiếp nhận phản ánh',
      ADD COLUMN IF NOT EXISTS "feedback_page_notice_content" varchar DEFAULT '• Ban Giám đốc tiếp nhận trực tiếp mọi ý kiến phản ánh của người bệnh và thân nhân.
• Mọi phản ánh đều được cấp mã tra cứu tiến độ xử lý minh bạch.',
      ADD COLUMN IF NOT EXISTS "feedback_page_notice_align" public."fb_not_align" DEFAULT 'left';

    ALTER TABLE public."_site_settings_v"
      ADD COLUMN IF NOT EXISTS "version_feedback_page_eyebrow" varchar DEFAULT 'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN',
      ADD COLUMN IF NOT EXISTS "version_feedback_page_title" varchar DEFAULT 'Góp ý – Phản ánh Chất lượng',
      ADD COLUMN IF NOT EXISTS "version_feedback_page_description" varchar DEFAULT 'Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ.',
      ADD COLUMN IF NOT EXISTS "version_feedback_page_show_notice_banner" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "version_feedback_page_notice_title" varchar DEFAULT 'Quy trình tiếp nhận phản ánh',
      ADD COLUMN IF NOT EXISTS "version_feedback_page_notice_content" varchar DEFAULT '• Ban Giám đốc tiếp nhận trực tiếp mọi ý kiến phản ánh của người bệnh và thân nhân.
• Mọi phản ánh đều được cấp mã tra cứu tiến độ xử lý minh bạch.',
      ADD COLUMN IF NOT EXISTS "version_feedback_page_notice_align" public."fb_not_align" DEFAULT 'left';
  `)

  // 3. Tạo các bảng chính & version cho Quy trình khám bệnh (ef_tabs, ef_steps, ef_checks, ef_prios)
  await client.query(`
    -- ef_tabs
    CREATE TABLE IF NOT EXISTS public."ef_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar NOT NULL,
      "badge_text" varchar,
      "title" varchar NOT NULL,
      "summary" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "ef_tabs_order_idx" ON public."ef_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "ef_tabs_parent_id_idx" ON public."ef_tabs" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ef_tabs_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "_uuid" varchar NOT NULL,
      "label" varchar NOT NULL,
      "badge_text" varchar,
      "title" varchar NOT NULL,
      "summary" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_ef_tabs_v_order_idx" ON public."_ef_tabs_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ef_tabs_v_parent_id_idx" ON public."_ef_tabs_v" ("_parent_id");

    -- ef_steps
    CREATE TABLE IF NOT EXISTS public."ef_steps" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "step" numeric NOT NULL,
      "title" varchar NOT NULL,
      "location" varchar NOT NULL,
      "time_estimate" varchar,
      "desc" varchar NOT NULL,
      "actions" varchar,
      "note" varchar,
      "is_highlight" boolean DEFAULT false,
      "is_emergency" boolean DEFAULT false
    );
    CREATE INDEX IF NOT EXISTS "ef_steps_order_idx" ON public."ef_steps" ("_order");
    CREATE INDEX IF NOT EXISTS "ef_steps_parent_id_idx" ON public."ef_steps" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ef_steps_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "step" numeric NOT NULL,
      "title" varchar NOT NULL,
      "location" varchar NOT NULL,
      "time_estimate" varchar,
      "desc" varchar NOT NULL,
      "actions" varchar,
      "note" varchar,
      "is_highlight" boolean DEFAULT false,
      "is_emergency" boolean DEFAULT false,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_ef_steps_v_order_idx" ON public."_ef_steps_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ef_steps_v_parent_id_idx" ON public."_ef_steps_v" ("_parent_id");

    -- ef_checks
    CREATE TABLE IF NOT EXISTS public."ef_checks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "icon" varchar DEFAULT 'id'
    );
    CREATE INDEX IF NOT EXISTS "ef_checks_order_idx" ON public."ef_checks" ("_order");
    CREATE INDEX IF NOT EXISTS "ef_checks_parent_id_idx" ON public."ef_checks" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ef_checks_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "icon" varchar DEFAULT 'id',
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_ef_checks_v_order_idx" ON public."_ef_checks_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ef_checks_v_parent_id_idx" ON public."_ef_checks_v" ("_parent_id");

    -- ef_prios
    CREATE TABLE IF NOT EXISTS public."ef_prios" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "text" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "ef_prios_order_idx" ON public."ef_prios" ("_order");
    CREATE INDEX IF NOT EXISTS "ef_prios_parent_id_idx" ON public."ef_prios" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ef_prios_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "text" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_ef_prios_v_order_idx" ON public."_ef_prios_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ef_prios_v_parent_id_idx" ON public."_ef_prios_v" ("_parent_id");
  `)

  // 4. Tạo các bảng chính & version cho Chất lượng bệnh viện (qp_stats, qp_dims, qp_progs)
  await client.query(`
    -- qp_stats
    CREATE TABLE IF NOT EXISTS public."qp_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "val" varchar NOT NULL,
      "unit" varchar,
      "label" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "qp_stats_order_idx" ON public."qp_stats" ("_order");
    CREATE INDEX IF NOT EXISTS "qp_stats_parent_id_idx" ON public."qp_stats" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_qp_stats_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "val" varchar NOT NULL,
      "unit" varchar,
      "label" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_qp_stats_v_order_idx" ON public."_qp_stats_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_qp_stats_v_parent_id_idx" ON public."_qp_stats_v" ("_parent_id");

    -- qp_dims
    CREATE TABLE IF NOT EXISTS public."qp_dims" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "code" varchar NOT NULL,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "score" varchar NOT NULL,
      "percent" numeric NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "qp_dims_order_idx" ON public."qp_dims" ("_order");
    CREATE INDEX IF NOT EXISTS "qp_dims_parent_id_idx" ON public."qp_dims" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_qp_dims_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "code" varchar NOT NULL,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "score" varchar NOT NULL,
      "percent" numeric NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_qp_dims_v_order_idx" ON public."_qp_dims_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_qp_dims_v_parent_id_idx" ON public."_qp_dims_v" ("_parent_id");

    -- qp_progs
    CREATE TABLE IF NOT EXISTS public."qp_progs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon_type" public."qp_icon_t" DEFAULT 'blue',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "highlights" varchar
    );
    CREATE INDEX IF NOT EXISTS "qp_progs_order_idx" ON public."qp_progs" ("_order");
    CREATE INDEX IF NOT EXISTS "qp_progs_parent_id_idx" ON public."qp_progs" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_qp_progs_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon_type" public."qp_icon_t" DEFAULT 'blue',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "highlights" varchar,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_qp_progs_v_order_idx" ON public."_qp_progs_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_qp_progs_v_parent_id_idx" ON public."_qp_progs_v" ("_parent_id");
  `)

  // 5. Tạo các bảng hộp thông tin Khảo sát (sv_boxes), Biểu mẫu (fm_boxes), Góp ý (fb_boxes)
  await client.query(`
    -- sv_boxes
    CREATE TABLE IF NOT EXISTS public."sv_boxes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '🛡️',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "sv_boxes_order_idx" ON public."sv_boxes" ("_order");
    CREATE INDEX IF NOT EXISTS "sv_boxes_parent_id_idx" ON public."sv_boxes" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_sv_boxes_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '🛡️',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_sv_boxes_v_order_idx" ON public."_sv_boxes_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_sv_boxes_v_parent_id_idx" ON public."_sv_boxes_v" ("_parent_id");

    -- fm_boxes
    CREATE TABLE IF NOT EXISTS public."fm_boxes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '⚡',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "fm_boxes_order_idx" ON public."fm_boxes" ("_order");
    CREATE INDEX IF NOT EXISTS "fm_boxes_parent_id_idx" ON public."fm_boxes" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_fm_boxes_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '⚡',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_fm_boxes_v_order_idx" ON public."_fm_boxes_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_fm_boxes_v_parent_id_idx" ON public."_fm_boxes_v" ("_parent_id");

    -- fb_boxes
    CREATE TABLE IF NOT EXISTS public."fb_boxes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📞',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "fb_boxes_order_idx" ON public."fb_boxes" ("_order");
    CREATE INDEX IF NOT EXISTS "fb_boxes_parent_id_idx" ON public."fb_boxes" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_fb_boxes_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📞',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_fb_boxes_v_order_idx" ON public."_fb_boxes_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_fb_boxes_v_parent_id_idx" ON public."_fb_boxes_v" ("_parent_id");
  `)
}

export async function verify({ client }) {
  const tables = ['ef_tabs', 'ef_steps', 'ef_checks', 'ef_prios', 'qp_stats', 'qp_dims', 'qp_progs', 'sv_boxes', 'fm_boxes', 'fb_boxes']
  for (const t of tables) {
    const res = await client.query(`SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1;`, [t])
    if (res.rowCount === 0) {
      throw new Error(`Chưa tìm thấy bảng ${t} sau khi thực thi migration.`)
    }
  }
}
