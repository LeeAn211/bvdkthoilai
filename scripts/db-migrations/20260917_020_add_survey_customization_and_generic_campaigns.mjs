export const id = '20260917_020_add_survey_customization_and_generic_campaigns'
export const description = 'Thêm cấu hình tùy chọn danh mục khảo sát vào site_settings và hỗ trợ câu hỏi linh hoạt customQuestions cho survey_campaigns'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo enum cho kiểu câu hỏi custom nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_survey_campaigns_custom_questions_type') THEN
        CREATE TYPE public."enum_survey_campaigns_custom_questions_type" AS ENUM ('rating5', 'rating10', 'single', 'multiple', 'yesno', 'text');
      END IF;
    END $$;
  `)

  // 2. Thêm các cột tùy chỉnh danh mục vào site_settings và _site_settings_v
  await client.query(`
    ALTER TABLE public."site_settings"
      ADD COLUMN IF NOT EXISTS "survey_page_outpatient_clinics" varchar,
      ADD COLUMN IF NOT EXISTS "survey_page_inpatient_departments" varchar,
      ADD COLUMN IF NOT EXISTS "survey_page_staff_positions" varchar,
      ADD COLUMN IF NOT EXISTS "survey_page_staff_unit_types" varchar,
      ADD COLUMN IF NOT EXISTS "survey_page_staff_departments" varchar,
      ADD COLUMN IF NOT EXISTS "survey_page_area_suggestions" varchar;

    ALTER TABLE public."_site_settings_v"
      ADD COLUMN IF NOT EXISTS "version_survey_page_outpatient_clinics" varchar,
      ADD COLUMN IF NOT EXISTS "version_survey_page_inpatient_departments" varchar,
      ADD COLUMN IF NOT EXISTS "version_survey_page_staff_positions" varchar,
      ADD COLUMN IF NOT EXISTS "version_survey_page_staff_unit_types" varchar,
      ADD COLUMN IF NOT EXISTS "version_survey_page_staff_departments" varchar,
      ADD COLUMN IF NOT EXISTS "version_survey_page_area_suggestions" varchar;
  `)

  // 3. Thêm các cột chế độ mẫu dùng chung vào survey_campaigns
  await client.query(`
    ALTER TABLE public."survey_campaigns"
      ADD COLUMN IF NOT EXISTS "use_custom_questions" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "show_demographics" boolean DEFAULT true;

    -- Cho phép template_version_id NULL khi dùng câu hỏi linh hoạt trực tiếp
    ALTER TABLE public."survey_campaigns"
      ALTER COLUMN "template_version_id" DROP NOT NULL;
  `)

  // 4. Tạo bảng mảng survey_campaigns_custom_questions
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."survey_campaigns_custom_questions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "code" varchar NOT NULL,
      "question" varchar NOT NULL,
      "type" public."enum_survey_campaigns_custom_questions_type" DEFAULT 'rating5' NOT NULL,
      "required" boolean DEFAULT true,
      "options" varchar,
      "order" numeric DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS "survey_campaigns_cq_order_idx" 
      ON public."survey_campaigns_custom_questions" ("_order");
    CREATE INDEX IF NOT EXISTS "survey_campaigns_cq_parent_id_idx" 
      ON public."survey_campaigns_custom_questions" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'survey_campaigns_cq_parent_fk'
      ) THEN
        ALTER TABLE public."survey_campaigns_custom_questions"
          ADD CONSTRAINT "survey_campaigns_cq_parent_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."survey_campaigns"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // Kiểm tra cột trong site_settings
  const checkSite = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name IN (
      'survey_page_outpatient_clinics',
      'survey_page_inpatient_departments',
      'survey_page_staff_positions',
      'survey_page_staff_unit_types',
      'survey_page_staff_departments',
      'survey_page_area_suggestions'
    );
  `)
  if (checkSite.rows.length < 6) {
    throw new Error('Verification failed: columns missing in site_settings')
  }

  // Kiểm tra cột trong survey_campaigns
  const checkCampaign = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'survey_campaigns' AND column_name IN (
      'use_custom_questions',
      'show_demographics'
    );
  `)
  if (checkCampaign.rows.length < 2) {
    throw new Error('Verification failed: columns missing in survey_campaigns')
  }

  // Kiểm tra bảng survey_campaigns_custom_questions
  const checkTable = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'survey_campaigns_custom_questions';
  `)
  if (checkTable.rows.length === 0) {
    throw new Error('Verification failed: table survey_campaigns_custom_questions missing')
  }
}
