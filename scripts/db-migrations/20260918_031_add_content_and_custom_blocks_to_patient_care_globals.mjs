export const id = '20260918_031_add_content_and_custom_blocks_to_patient_care_globals'
export const description = 'Thêm khối bài viết chi tiết contentBlock và bảng mảng customBlocks cho các Global Dành cho người bệnh'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu ENUM cho content_block_text_align và custom_blocks_text_align nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_patient_portal_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_patient_portal_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pps_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_pps_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_examination_flow_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_examination_flow_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_efs_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_efs_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_inpatient_guide_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_inpatient_guide_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_igs_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_igs_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_checkup_packages_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_checkup_packages_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cps_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_cps_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hospital_map_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_hospital_map_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hms_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_hms_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hospital_quality_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_hospital_quality_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hqs_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_hqs_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Thêm các cột contentBlock vào bảng chính của 6 Global
  await client.query(`
    -- patient_portal_settings
    ALTER TABLE public."patient_portal_settings"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Cẩm nang Thông tin & Hướng dẫn Tiện ích dành cho Người bệnh',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai cung cấp đầy đủ các tiện ích trực tuyến và hướng dẫn cụ thể giúp người bệnh tiếp cận dịch vụ y tế an toàn, nhanh chóng và hiệu quả nhất.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."enum_patient_portal_settings_content_block_text_align" DEFAULT 'left';

    -- examination_flow_settings
    ALTER TABLE public."examination_flow_settings"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Nguyên tắc Tiếp đón & Quyền lợi Khám chữa bệnh BHYT Thông tuyến',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Chính sách thông tuyến khám chữa bệnh BHYT toàn quốc, ứng dụng Căn cước công dân gắn chip / VNeID mức 2 trong tiếp nhận bệnh nhân và quy chế chuyển tuyến tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."enum_examination_flow_settings_content_block_text_align" DEFAULT 'left';

    -- inpatient_guide_settings
    ALTER TABLE public."inpatient_guide_settings"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Quy chế Quản lý & Chế độ Chăm sóc Toàn diện Người bệnh Nội trú',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Các quy định chi tiết về buồng bệnh vô trùng, an toàn dùng thuốc, quyền lợi khám chữa bệnh BHYT và nghĩa vụ của người bệnh khi nằm viện tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."enum_inpatient_guide_settings_content_block_text_align" DEFAULT 'left';

    -- checkup_packages_settings
    ALTER TABLE public."checkup_packages_settings"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Chính sách Khám Sức khỏe Định kỳ & Tư vấn Doanh nghiệp / Cá nhân',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Quy trình tiếp nhận, đăng ký khám theo đoàn thể, công ty, trường học và cá nhân với quy chuẩn xét nghiệm chẩn đoán hiện đại tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."enum_checkup_packages_settings_content_block_text_align" DEFAULT 'left';

    -- hospital_map_settings
    ALTER TABLE public."hospital_map_settings"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Chỉ dẫn Luồng Di chuyển & Tiện ích Hỗ trợ Người bệnh',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Thông tin chi tiết về hệ thống thang máy ưu tiên, đường dốc xe lăn, quy định trật tự an ninh và hướng dẫn tiếp cận các khoa lâm sàng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."enum_hospital_map_settings_content_block_text_align" DEFAULT 'left';

    -- hospital_quality_settings
    ALTER TABLE public."hospital_quality_settings"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Báo cáo Đánh giá Chất lượng & Cam kết An toàn Người bệnh',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Tổng hợp kết quả phúc tra 83 Tiêu chí Chất lượng của Bộ Y tế và các giải pháp cải tiến chất lượng khám chữa bệnh liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."enum_hospital_quality_settings_content_block_text_align" DEFAULT 'left';
  `)

  // 3. Tạo các bảng mảng customBlocks cho 6 Global
  await client.query(`
    -- 1. pps_custom_blocks
    CREATE TABLE IF NOT EXISTS public."pps_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_pps_custom_blocks_text_align" DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "pps_custom_blocks_order_idx" ON public."pps_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "pps_custom_blocks_parent_id_idx" ON public."pps_custom_blocks" ("_parent_id");
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'pps_custom_blocks_parent_id_fk') THEN
        ALTER TABLE public."pps_custom_blocks"
          ADD CONSTRAINT "pps_custom_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."patient_portal_settings" ("id") ON DELETE CASCADE;
      END IF;
    END $$;

    -- 2. efs_custom_blocks
    CREATE TABLE IF NOT EXISTS public."efs_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_efs_custom_blocks_text_align" DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "efs_custom_blocks_order_idx" ON public."efs_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "efs_custom_blocks_parent_id_idx" ON public."efs_custom_blocks" ("_parent_id");
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'efs_custom_blocks_parent_id_fk') THEN
        ALTER TABLE public."efs_custom_blocks"
          ADD CONSTRAINT "efs_custom_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."examination_flow_settings" ("id") ON DELETE CASCADE;
      END IF;
    END $$;

    -- 3. igs_custom_blocks
    CREATE TABLE IF NOT EXISTS public."igs_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_igs_custom_blocks_text_align" DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "igs_custom_blocks_order_idx" ON public."igs_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "igs_custom_blocks_parent_id_idx" ON public."igs_custom_blocks" ("_parent_id");
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'igs_custom_blocks_parent_id_fk') THEN
        ALTER TABLE public."igs_custom_blocks"
          ADD CONSTRAINT "igs_custom_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."inpatient_guide_settings" ("id") ON DELETE CASCADE;
      END IF;
    END $$;

    -- 4. cps_custom_blocks
    CREATE TABLE IF NOT EXISTS public."cps_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_cps_custom_blocks_text_align" DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "cps_custom_blocks_order_idx" ON public."cps_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "cps_custom_blocks_parent_id_idx" ON public."cps_custom_blocks" ("_parent_id");
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cps_custom_blocks_parent_id_fk') THEN
        ALTER TABLE public."cps_custom_blocks"
          ADD CONSTRAINT "cps_custom_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."checkup_packages_settings" ("id") ON DELETE CASCADE;
      END IF;
    END $$;

    -- 5. hms_custom_blocks
    CREATE TABLE IF NOT EXISTS public."hms_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_hms_custom_blocks_text_align" DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "hms_custom_blocks_order_idx" ON public."hms_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "hms_custom_blocks_parent_id_idx" ON public."hms_custom_blocks" ("_parent_id");
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'hms_custom_blocks_parent_id_fk') THEN
        ALTER TABLE public."hms_custom_blocks"
          ADD CONSTRAINT "hms_custom_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."hospital_map_settings" ("id") ON DELETE CASCADE;
      END IF;
    END $$;

    -- 6. hqs_custom_blocks
    CREATE TABLE IF NOT EXISTS public."hqs_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_hqs_custom_blocks_text_align" DEFAULT 'left'
    );
    CREATE INDEX IF NOT EXISTS "hqs_custom_blocks_order_idx" ON public."hqs_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "hqs_custom_blocks_parent_id_idx" ON public."hqs_custom_blocks" ("_parent_id");
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'hqs_custom_blocks_parent_id_fk') THEN
        ALTER TABLE public."hqs_custom_blocks"
          ADD CONSTRAINT "hqs_custom_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."hospital_quality_settings" ("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const tables = [
    'pps_custom_blocks',
    'efs_custom_blocks',
    'igs_custom_blocks',
    'cps_custom_blocks',
    'hms_custom_blocks',
    'hqs_custom_blocks',
  ]

  for (const table of tables) {
    const res = await client.query(`
      SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1
    `, [table])
    if (res.rowCount === 0) {
      throw new Error(`Table public."${table}" is missing after migration`)
    }
  }

  const globals = [
    'patient_portal_settings',
    'examination_flow_settings',
    'inpatient_guide_settings',
    'checkup_packages_settings',
    'hospital_map_settings',
    'hospital_quality_settings',
  ]

  for (const g of globals) {
    const res = await client.query(`
      SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = 'content_block_title'
    `, [g])
    if (res.rowCount === 0) {
      throw new Error(`Column content_block_title missing on table public."${g}"`)
    }
  }

  return true
}
