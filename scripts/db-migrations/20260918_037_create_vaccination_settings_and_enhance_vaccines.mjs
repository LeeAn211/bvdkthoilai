export const id = '20260918_037_create_vaccination_settings_and_enhance_vaccines'
export const description = 'Tạo bảng vaccination_settings, vcs_custom_blocks và bổ sung target_group, price, price_note cho vaccines'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu ENUM nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_vaccines_target_group') THEN
        CREATE TYPE public."enum_vaccines_target_group" AS ENUM ('all', 'infant', 'child', 'pregnancy', 'adult');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__vaccines_v_version_target_group') THEN
        CREATE TYPE public."enum__vaccines_v_version_target_group" AS ENUM ('all', 'infant', 'child', 'pregnancy', 'adult');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vcs_not_align') THEN
        CREATE TYPE public."vcs_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_vaccination_settings_content_block_text_align') THEN
        CREATE TYPE public."enum_vaccination_settings_content_block_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_vcs_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_vcs_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Thêm cột target_group, price, price_note vào vaccines và _vaccines_v
  await client.query(`
    ALTER TABLE public."vaccines"
      ADD COLUMN IF NOT EXISTS "target_group" public."enum_vaccines_target_group" DEFAULT 'all',
      ADD COLUMN IF NOT EXISTS "price" numeric,
      ADD COLUMN IF NOT EXISTS "price_note" varchar;

    ALTER TABLE public."_vaccines_v"
      ADD COLUMN IF NOT EXISTS "version_target_group" public."enum__vaccines_v_version_target_group" DEFAULT 'all',
      ADD COLUMN IF NOT EXISTS "version_price" numeric,
      ADD COLUMN IF NOT EXISTS "version_price_note" varchar;
  `)

  // 3. Tạo bảng vaccination_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."vaccination_settings" (
      "id" serial PRIMARY KEY,
      "eyebrow" varchar DEFAULT 'TIÊM NGỪA AN TOÀN',
      "title" varchar NOT NULL DEFAULT 'Thông tin tiêm ngừa & Danh mục Vắc xin',
      "description" varchar DEFAULT 'Theo dõi bảng giá vắc xin hiện hành, đối tượng tiêm ngừa và lịch tiêm chủng an toàn tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      "show_notice_banner" boolean DEFAULT true,
      "notice_title" varchar DEFAULT 'Quy trình và An toàn Tiêm chủng tại Bệnh viện',
      "notice_content" varchar DEFAULT '• Người đến tiêm chủng được khám sàng lọc trước tiêm và tư vấn chỉ định vắc xin phù hợp.\n• Theo dõi sức khỏe ít nhất 30 phút sau tiêm tại phòng theo dõi của bệnh viện.\n• Vui lòng mang theo sổ tiêm chủng hoặc ứng dụng tiêm chủng điện tử khi đến tiêm.',
      "notice_align" public."vcs_not_align" DEFAULT 'left',
      "show_search" boolean DEFAULT true,
      "show_age_filter" boolean DEFAULT true,
      "show_price" boolean DEFAULT true,
      "show_book_button" boolean DEFAULT true,
      "show_workflow_section" boolean DEFAULT true,
      "show_support_banner" boolean DEFAULT true,
      "book_button_text" varchar DEFAULT 'Đăng ký tiêm',
      "book_button_url" varchar DEFAULT 'https://medpro.vn/',
      "consult_hotline" varchar DEFAULT '0292 3861 234',
      "content_block_enabled" boolean DEFAULT false,
      "content_block_title" varchar DEFAULT 'Hướng dẫn tiêm chủng an toàn và phòng ngừa phản ứng sau tiêm',
      "content_block_subtitle" varchar DEFAULT 'Thông tin chuyên môn từ Hội đồng Chuyên môn Bệnh viện Đa khoa Khu vực Thới Lai về theo dõi sức khỏe và quy chuẩn tiêm chủng an toàn.',
      "content_block_content" jsonb,
      "content_block_text_align" public."enum_vaccination_settings_content_block_text_align" DEFAULT 'left',
      "updated_at" timestamp with time zone DEFAULT now(),
      "created_at" timestamp with time zone DEFAULT now()
    );
  `)

  // 4. Tạo bảng vcs_custom_blocks cho các khối tùy biến
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."vcs_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_vcs_custom_blocks_text_align" DEFAULT 'left'
    );

    CREATE INDEX IF NOT EXISTS "vcs_custom_blocks_order_idx" ON public."vcs_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "vcs_custom_blocks_parent_id_idx" ON public."vcs_custom_blocks" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'vcs_custom_blocks_parent_id_fk' 
        AND table_name = 'vcs_custom_blocks'
      ) THEN
        ALTER TABLE public."vcs_custom_blocks"
          ADD CONSTRAINT "vcs_custom_blocks_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."vaccination_settings"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra bảng vaccination_settings
  const tableCheck = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'vaccination_settings';
  `)
  if (tableCheck.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng vaccination_settings trong PostgreSQL.')
  }

  // 2. Kiểm tra cột price và target_group trong vaccines
  const columnCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'vaccines' AND column_name IN ('target_group', 'price');
  `)
  if (columnCheck.rowCount < 2) {
    throw new Error('Chưa tìm thấy đầy đủ các cột target_group và price trong bảng vaccines.')
  }
}
