export const id = '20260917_022_create_independent_patient_care_globals_tables'
export const description = 'Tạo các bảng và kiểu ENUM cho 9 Global độc lập của phân nhóm Khám bệnh & Dịch vụ Y tế và Chăm sóc người bệnh & Khảo sát'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu ENUM cho 9 Global mới nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_examination_flow_settings_notice_align') THEN
        CREATE TYPE public."enum_examination_flow_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_inpatient_guide_settings_notice_align') THEN
        CREATE TYPE public."enum_inpatient_guide_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_checkup_packages_settings_notice_align') THEN
        CREATE TYPE public."enum_checkup_packages_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hospital_map_settings_notice_align') THEN
        CREATE TYPE public."enum_hospital_map_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hospital_quality_settings_notice_align') THEN
        CREATE TYPE public."enum_hospital_quality_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hospital_quality_settings_programs_icon_type') THEN
        CREATE TYPE public."enum_hospital_quality_settings_programs_icon_type" AS ENUM ('blue', 'green', 'amber');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_survey_page_settings_notice_align') THEN
        CREATE TYPE public."enum_survey_page_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_faq_page_settings_notice_align') THEN
        CREATE TYPE public."enum_faq_page_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_forms_page_settings_notice_align') THEN
        CREATE TYPE public."enum_forms_page_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_feedback_page_settings_notice_align') THEN
        CREATE TYPE public."enum_feedback_page_settings_notice_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Tạo bảng cho examination_flow_settings và các bảng phụ
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."examination_flow_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
      "title" varchar DEFAULT 'Quy trình Khám chữa bệnh',
      "description" text,
      "show_notice_banner" boolean DEFAULT false,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_examination_flow_settings_notice_align" DEFAULT 'left',
      "show_checklist" boolean DEFAULT true,
      "show_priority" boolean DEFAULT true,
      "show_support_banner" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."examination_flow_settings_flow_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar NOT NULL,
      "badge_text" varchar,
      "title" varchar NOT NULL,
      "summary" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "efs_flow_tabs_order_idx" ON public."examination_flow_settings_flow_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "efs_flow_tabs_parent_id_idx" ON public."examination_flow_settings_flow_tabs" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."examination_flow_settings_flow_tabs_steps" (
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
    CREATE INDEX IF NOT EXISTS "efs_ft_steps_order_idx" ON public."examination_flow_settings_flow_tabs_steps" ("_order");
    CREATE INDEX IF NOT EXISTS "efs_ft_steps_parent_id_idx" ON public."examination_flow_settings_flow_tabs_steps" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."examination_flow_settings_checklists" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "icon" varchar DEFAULT 'id'
    );
    CREATE INDEX IF NOT EXISTS "efs_checks_order_idx" ON public."examination_flow_settings_checklists" ("_order");
    CREATE INDEX IF NOT EXISTS "efs_checks_parent_id_idx" ON public."examination_flow_settings_checklists" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."examination_flow_settings_priorities" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "text" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "efs_prios_order_idx" ON public."examination_flow_settings_priorities" ("_order");
    CREATE INDEX IF NOT EXISTS "efs_prios_parent_id_idx" ON public."examination_flow_settings_priorities" ("_parent_id");
  `)

  // 3. Tạo bảng cho inpatient_guide_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."inpatient_guide_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
      "title" varchar DEFAULT 'Hướng dẫn Điều trị Nội trú',
      "description" text,
      "show_notice_banner" boolean DEFAULT true,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_inpatient_guide_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."inpatient_guide_settings_admission_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "step" numeric NOT NULL,
      "title" varchar NOT NULL,
      "location" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "note" varchar
    );
    CREATE INDEX IF NOT EXISTS "igs_ad_steps_order_idx" ON public."inpatient_guide_settings_admission_steps" ("_order");
    CREATE INDEX IF NOT EXISTS "igs_ad_steps_parent_id_idx" ON public."inpatient_guide_settings_admission_steps" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."inpatient_guide_settings_visiting_hours" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "session" varchar NOT NULL,
      "time_range" varchar NOT NULL,
      "note" varchar
    );
    CREATE INDEX IF NOT EXISTS "igs_vh_order_idx" ON public."inpatient_guide_settings_visiting_hours" ("_order");
    CREATE INDEX IF NOT EXISTS "igs_vh_parent_id_idx" ON public."inpatient_guide_settings_visiting_hours" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."inpatient_guide_settings_belongings_checklist" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '🎒',
      "category" varchar NOT NULL,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "igs_bc_order_idx" ON public."inpatient_guide_settings_belongings_checklist" ("_order");
    CREATE INDEX IF NOT EXISTS "igs_bc_parent_id_idx" ON public."inpatient_guide_settings_belongings_checklist" ("_parent_id");
  `)

  // 4. Tạo bảng cho checkup_packages_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."checkup_packages_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE',
      "title" varchar DEFAULT 'Gói Khám Sức khỏe & Tầm soát Bệnh lý',
      "description" text,
      "show_notice_banner" boolean DEFAULT true,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_checkup_packages_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."checkup_packages_settings_packages" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "is_popular" boolean DEFAULT false,
      "badge" varchar,
      "name" varchar NOT NULL,
      "code" varchar,
      "target" varchar NOT NULL,
      "price" varchar NOT NULL,
      "original_price" varchar,
      "features" varchar NOT NULL,
      "button_text" varchar DEFAULT 'Đăng ký gói khám',
      "button_link" varchar DEFAULT '/dat-lich-kham'
    );
    CREATE INDEX IF NOT EXISTS "cps_pkgs_order_idx" ON public."checkup_packages_settings_packages" ("_order");
    CREATE INDEX IF NOT EXISTS "cps_pkgs_parent_id_idx" ON public."checkup_packages_settings_packages" ("_parent_id");
  `)

  // 5. Tạo bảng cho hospital_map_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hospital_map_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH',
      "title" varchar DEFAULT 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
      "description" text,
      "show_notice_banner" boolean DEFAULT true,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_hospital_map_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."hospital_map_settings_floors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "level" varchar NOT NULL,
      "name" varchar NOT NULL,
      "badge" varchar,
      "departments" varchar NOT NULL,
      "description" varchar
    );
    CREATE INDEX IF NOT EXISTS "hms_floors_order_idx" ON public."hospital_map_settings_floors" ("_order");
    CREATE INDEX IF NOT EXISTS "hms_floors_parent_id_idx" ON public."hospital_map_settings_floors" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."hospital_map_settings_facilities" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📍',
      "name" varchar NOT NULL,
      "location" varchar NOT NULL,
      "note" varchar
    );
    CREATE INDEX IF NOT EXISTS "hms_fac_order_idx" ON public."hospital_map_settings_facilities" ("_order");
    CREATE INDEX IF NOT EXISTS "hms_fac_parent_id_idx" ON public."hospital_map_settings_facilities" ("_parent_id");
  `)

  // 6. Tạo bảng cho hospital_quality_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hospital_quality_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHẤT LƯỢNG & SỰ HÀI LÒNG',
      "title" varchar DEFAULT 'Chất lượng Bệnh viện & Cam kết Phục vụ',
      "description" text,
      "show_notice_banner" boolean DEFAULT false,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_hospital_quality_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."hospital_quality_settings_stat_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "value" varchar NOT NULL,
      "label" varchar NOT NULL,
      "subtext" varchar
    );
    CREATE INDEX IF NOT EXISTS "hqs_stats_order_idx" ON public."hospital_quality_settings_stat_cards" ("_order");
    CREATE INDEX IF NOT EXISTS "hqs_stats_parent_id_idx" ON public."hospital_quality_settings_stat_cards" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."hospital_quality_settings_dimensions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "name" varchar NOT NULL,
      "score" varchar NOT NULL,
      "max_score" varchar DEFAULT '/5.0',
      "desc" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "hqs_dims_order_idx" ON public."hospital_quality_settings_dimensions" ("_order");
    CREATE INDEX IF NOT EXISTS "hqs_dims_parent_id_idx" ON public."hospital_quality_settings_dimensions" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."hospital_quality_settings_programs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "icon_type" public."enum_hospital_quality_settings_programs_icon_type" DEFAULT 'blue'
    );
    CREATE INDEX IF NOT EXISTS "hqs_progs_order_idx" ON public."hospital_quality_settings_programs" ("_order");
    CREATE INDEX IF NOT EXISTS "hqs_progs_parent_id_idx" ON public."hospital_quality_settings_programs" ("_parent_id");
  `)

  // 7. Tạo bảng cho survey_page_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."survey_page_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHĂM SÓC NGƯỜI BỆNH & LẮNG NGHE Ý KIẾN',
      "title" varchar DEFAULT 'Khảo sát Ý kiến Người bệnh & Nhân viên',
      "description" text,
      "show_notice_banner" boolean DEFAULT false,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_survey_page_settings_notice_align" DEFAULT 'left',
      "outpatient_clinics" varchar,
      "inpatient_departments" varchar,
      "staff_positions" varchar,
      "staff_unit_types" varchar,
      "staff_departments" varchar,
      "area_suggestions" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."survey_page_settings_info_boxes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📋',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "badge" varchar
    );
    CREATE INDEX IF NOT EXISTS "sps_boxes_order_idx" ON public."survey_page_settings_info_boxes" ("_order");
    CREATE INDEX IF NOT EXISTS "sps_boxes_parent_id_idx" ON public."survey_page_settings_info_boxes" ("_parent_id");
  `)

  // 8. Tạo bảng cho faq_page_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."faq_page_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHĂM SÓC NGƯỜI BỆNH & GIẢI ĐÁP',
      "title" varchar DEFAULT 'Hỏi đáp Y tế & Câu hỏi thường gặp',
      "description" text,
      "show_notice_banner" boolean DEFAULT false,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_faq_page_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );
  `)

  // 9. Tạo bảng cho forms_page_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."forms_page_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHĂM SÓC NGƯỜI BỆNH & THỦ TỤC ĐIỆN TỬ',
      "title" varchar DEFAULT 'Biểu mẫu Điện tử & Đăng ký',
      "description" text,
      "show_notice_banner" boolean DEFAULT false,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_forms_page_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."forms_page_settings_info_boxes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📋',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "badge" varchar
    );
    CREATE INDEX IF NOT EXISTS "forms_boxes_order_idx" ON public."forms_page_settings_info_boxes" ("_order");
    CREATE INDEX IF NOT EXISTS "forms_boxes_parent_id_idx" ON public."forms_page_settings_info_boxes" ("_parent_id");
  `)

  // 10. Tạo bảng cho feedback_page_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."feedback_page_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN',
      "title" varchar DEFAULT 'Góp ý – Phản ánh Chất lượng',
      "description" text,
      "show_notice_banner" boolean DEFAULT false,
      "notice_title" varchar,
      "notice_content" text,
      "notice_align" public."enum_feedback_page_settings_notice_align" DEFAULT 'left',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public."feedback_page_settings_info_boxes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📞',
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "badge" varchar
    );
    CREATE INDEX IF NOT EXISTS "fb_boxes_order_idx" ON public."feedback_page_settings_info_boxes" ("_order");
    CREATE INDEX IF NOT EXISTS "fb_boxes_parent_id_idx" ON public."feedback_page_settings_info_boxes" ("_parent_id");
  `)
}

export async function verify({ client }) {
  const check = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN (
      'examination_flow_settings',
      'inpatient_guide_settings',
      'checkup_packages_settings',
      'hospital_map_settings',
      'hospital_quality_settings',
      'survey_page_settings',
      'faq_page_settings',
      'forms_page_settings',
      'feedback_page_settings'
    );
  `)
  if (check.rows.length < 9) {
    throw new Error(`Verification failed: Expected 9 tables, found ${check.rows.length}`)
  }
}
