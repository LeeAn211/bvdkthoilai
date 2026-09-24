export const id = '20260923_072_create_work_schedules'
export const description = 'Tạo bảng work_schedules, work_schedules_days, _work_schedules_v, _work_schedules_v_version_days và enum types'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các enum types nếu chưa tồn tại
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "enum_work_schedules_display_mode" AS ENUM ('table', 'viewer');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_work_schedules_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__work_schedules_v_version_display_mode" AS ENUM ('table', 'viewer');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__work_schedules_v_version_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 2. Tạo bảng chính work_schedules
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."work_schedules" (
      "id" serial PRIMARY KEY,
      "title" varchar DEFAULT 'LỊCH CÔNG TÁC TUẦN',
      "display_mode" "enum_work_schedules_display_mode" DEFAULT 'table',
      "document_number" varchar DEFAULT '08/LLV - BVĐKKVTL',
      "revision" varchar,
      "active" boolean DEFAULT true,
      "week_number" numeric,
      "year" numeric DEFAULT 2026,
      "start_date" timestamp(3) with time zone,
      "end_date" timestamp(3) with time zone,
      "attached_file_id" integer,
      "scanned_image_id" integer,
      "general_note" varchar DEFAULT 'Tùy tình hình thực tế, Lịch làm việc này có thể thay đổi, Bệnh viện Đa khoa khu vực Thới Lai sẽ có thông báo sau./.',
      "signer_role" varchar DEFAULT 'TL. GIÁM ĐỐC',
      "signer_name" varchar DEFAULT 'DSCKI. Dương Văn Bé',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone,
      "_status" "enum_work_schedules_status" DEFAULT 'draft',
      CONSTRAINT "work_schedules_attached_file_id_fk" FOREIGN KEY ("attached_file_id") REFERENCES public."media"("id") ON DELETE SET NULL,
      CONSTRAINT "work_schedules_scanned_image_id_fk" FOREIGN KEY ("scanned_image_id") REFERENCES public."media"("id") ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS "work_schedules_attached_file_idx" ON public."work_schedules" ("attached_file_id");
    CREATE INDEX IF NOT EXISTS "work_schedules_scanned_image_idx" ON public."work_schedules" ("scanned_image_id");
    CREATE INDEX IF NOT EXISTS "work_schedules_updated_at_idx" ON public."work_schedules" ("updated_at");
    CREATE INDEX IF NOT EXISTS "work_schedules_created_at_idx" ON public."work_schedules" ("created_at");
    CREATE INDEX IF NOT EXISTS "work_schedules_deleted_at_idx" ON public."work_schedules" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "work_schedules__status_idx" ON public."work_schedules" ("_status");
  `)

  // 3. Tạo bảng con work_schedules_days
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."work_schedules_days" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "day_label" varchar,
      "date_formatted" varchar,
      "morning_content" varchar,
      "afternoon_content" varchar,
      "note" varchar,
      CONSTRAINT "work_schedules_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."work_schedules"("id") ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "work_schedules_days_order_idx" ON public."work_schedules_days" ("_order");
    CREATE INDEX IF NOT EXISTS "work_schedules_days_parent_id_idx" ON public."work_schedules_days" ("_parent_id");
  `)

  // 4. Tạo bảng _work_schedules_v (Versions tracking)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_work_schedules_v" (
      "id" serial PRIMARY KEY,
      "parent_id" integer,
      "version_title" varchar DEFAULT 'LỊCH CÔNG TÁC TUẦN',
      "version_display_mode" "enum__work_schedules_v_version_display_mode" DEFAULT 'table',
      "version_document_number" varchar DEFAULT '08/LLV - BVĐKKVTL',
      "version_revision" varchar,
      "version_active" boolean DEFAULT true,
      "version_week_number" numeric,
      "version_year" numeric DEFAULT 2026,
      "version_start_date" timestamp(3) with time zone,
      "version_end_date" timestamp(3) with time zone,
      "version_attached_file_id" integer,
      "version_scanned_image_id" integer,
      "version_general_note" varchar DEFAULT 'Tùy tình hình thực tế, Lịch làm việc này có thể thay đổi, Bệnh viện Đa khoa khu vực Thới Lai sẽ có thông báo sau./.',
      "version_signer_role" varchar DEFAULT 'TL. GIÁM ĐỐC',
      "version_signer_name" varchar DEFAULT 'DSCKI. Dương Văn Bé',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "version__status" "enum__work_schedules_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean,
      CONSTRAINT "_work_schedules_v_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES public."work_schedules"("id") ON DELETE SET NULL,
      CONSTRAINT "_work_schedules_v_attached_file_id_fk" FOREIGN KEY ("version_attached_file_id") REFERENCES public."media"("id") ON DELETE SET NULL,
      CONSTRAINT "_work_schedules_v_scanned_image_id_fk" FOREIGN KEY ("version_scanned_image_id") REFERENCES public."media"("id") ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS "_work_schedules_v_parent_idx" ON public."_work_schedules_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_version_attached_file_idx" ON public."_work_schedules_v" ("version_attached_file_id");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_version_scanned_image_idx" ON public."_work_schedules_v" ("version_scanned_image_id");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_version_updated_at_idx" ON public."_work_schedules_v" ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_version_created_at_idx" ON public."_work_schedules_v" ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_version_deleted_at_idx" ON public."_work_schedules_v" ("version_deleted_at");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_version__status_idx" ON public."_work_schedules_v" ("version__status");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_created_at_idx" ON public."_work_schedules_v" ("created_at");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_updated_at_idx" ON public."_work_schedules_v" ("updated_at");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_latest_idx" ON public."_work_schedules_v" ("latest");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_autosave_idx" ON public."_work_schedules_v" ("autosave");
  `)

  // 5. Tạo bảng _work_schedules_v_version_days
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_work_schedules_v_version_days" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "day_label" varchar,
      "date_formatted" varchar,
      "morning_content" varchar,
      "afternoon_content" varchar,
      "note" varchar,
      "_uuid" varchar,
      CONSTRAINT "_work_schedules_v_version_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."_work_schedules_v"("id") ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_days_order_idx" ON public."_work_schedules_v_version_days" ("_order");
    CREATE INDEX IF NOT EXISTS "_work_schedules_v_version_days_parent_id_idx" ON public."_work_schedules_v_version_days" ("_parent_id");
  `)

  // 6. Thêm cột work_schedules_id vào bảng payload_locked_documents_rels
  await client.query(`
    ALTER TABLE public."payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "work_schedules_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_work_schedules_id_idx"
      ON public."payload_locked_documents_rels" ("work_schedules_id");

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_work_schedules_fk'
          AND table_name = 'payload_locked_documents_rels'
      ) THEN
        ALTER TABLE public."payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_work_schedules_fk"
          FOREIGN KEY ("work_schedules_id") REFERENCES public."work_schedules"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 7. Thêm dữ liệu mẫu ban đầu đúng theo hình ảnh người dùng đã gửi
  await client.query(`
    INSERT INTO public."work_schedules" (
      "id", "title", "display_mode", "document_number", "revision", "active",
      "week_number", "year", "start_date", "end_date", "general_note", "signer_role", "signer_name",
      "_status", "created_at", "updated_at"
    )
    VALUES (
      1,
      'LỊCH CÔNG TÁC TUẦN (Từ ngày 21/9/2026 – 25/9/2026)',
      'table',
      '08/LLV - BVĐKKVTL',
      'CHỈNH SỬA 02',
      true,
      39,
      2026,
      '2026-09-21 00:00:00+07',
      '2026-09-25 23:59:59+07',
      'Tùy tình hình thực tế, Lịch làm việc này có thể thay đổi, Bệnh viện Đa khoa khu vực Thới Lai sẽ có thông báo sau./.',
      'TL. GIÁM ĐỐC',
      'DSCKI. Dương Văn Bé',
      'published',
      now(),
      now()
    )
    ON CONFLICT ("id") DO NOTHING;

    INSERT INTO public."work_schedules_days" ("_order", "_parent_id", "id", "day_label", "date_formatted", "morning_content", "afternoon_content", "note")
    VALUES
      (1, 1, 'day_1', 'Thứ hai', '(21/9/26)', '', '', ''),
      (2, 1, 'day_2', 'Thứ ba', '(22/9/26)', '- 8h00: Ban giám đốc, phòng TCHC, P. KHTH, P. TCKT, K. DƯỢC và các bộ phận liên quan tiếp đoàn thẩm định giấy phép hoạt động SYT tại Hội trường giao ban', '', ''),
      (3, 1, 'day_3', 'Thứ tư', '(23/9/26)', '* Bs Thắng khám sức khỏe tại trường mầm non Cờ Đỏ (cả ngày)', '13h00: Bs Hạnh, Bs Huy tham gia đoàn công tác hỗ trợ chuyên môn kỹ thuật, hỗ trợ, kiểm tra... tại BVĐKKV Cái Răng', ''),
      (4, 1, 'day_4', 'Thứ năm', '(24/9/26)', '* Bs Thắng khám sức khỏe tại trường mầm non Cờ Đỏ (cả ngày)', '', ''),
      (5, 1, 'day_5', 'Thứ sáu', '(25/9/26)', '', '', '')
    ON CONFLICT ("id") DO NOTHING;
  `)
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('work_schedules', 'work_schedules_days', '_work_schedules_v', '_work_schedules_v_version_days');
  `)

  if (rows.length < 4) {
    throw new Error(`Verification failed: Expected 4 tables, found ${rows.length}`)
  }
}
