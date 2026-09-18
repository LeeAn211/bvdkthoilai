export const id = '20260918_026_add_about_page_content_and_custom_blocks'
export const description = 'Bổ sung khối bài viết chi tiết contentBlock và bảng mảng ab_custom_blocks cho trang Giới thiệu chung'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các enum liên quan nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ab_cb_align') THEN
        CREATE TYPE public."ab_cb_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_ab_custom_blocks_text_align') THEN
        CREATE TYPE public."enum_ab_custom_blocks_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__ab_custom_blocks_v_text_align') THEN
        CREATE TYPE public."enum__ab_custom_blocks_v_text_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Bổ sung các cột contentBlock vào bảng chính about_page
  await client.query(`
    ALTER TABLE public."about_page"
      ADD COLUMN IF NOT EXISTS "content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "content_block_title" varchar DEFAULT 'Giới thiệu Tổng quan & Quá trình Phát triển',
      ADD COLUMN IF NOT EXISTS "content_block_subtitle" varchar DEFAULT 'Thông tin chi tiết về cơ cấu, chức năng, đội ngũ thầy thuốc và định hướng nâng cao chất lượng khám chữa bệnh tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "content_block_text_align" public."ab_cb_align" DEFAULT 'left';
  `)

  // 3. Bổ sung các cột contentBlock vào bảng phiên bản _about_page_v
  await client.query(`
    ALTER TABLE public."_about_page_v"
      ADD COLUMN IF NOT EXISTS "version_content_block_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_content_block_title" varchar DEFAULT 'Giới thiệu Tổng quan & Quá trình Phát triển',
      ADD COLUMN IF NOT EXISTS "version_content_block_subtitle" varchar,
      ADD COLUMN IF NOT EXISTS "version_content_block_content" jsonb,
      ADD COLUMN IF NOT EXISTS "version_content_block_text_align" public."ab_cb_align" DEFAULT 'left';
  `)

  // 4. Tạo bảng mảng ab_custom_blocks cho bảng chính
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."ab_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum_ab_custom_blocks_text_align" DEFAULT 'left'
    );

    CREATE INDEX IF NOT EXISTS "ab_custom_blocks_order_idx" ON public."ab_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "ab_custom_blocks_parent_id_idx" ON public."ab_custom_blocks" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'ab_custom_blocks_parent_id_fk'
      ) THEN
        ALTER TABLE public."ab_custom_blocks"
          ADD CONSTRAINT "ab_custom_blocks_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."about_page" ("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 5. Tạo bảng mảng _ab_custom_blocks_v cho bảng phiên bản
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_ab_custom_blocks_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."enum__ab_custom_blocks_v_text_align" DEFAULT 'left',
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_ab_custom_blocks_v_order_idx" ON public."_ab_custom_blocks_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ab_custom_blocks_v_parent_id_idx" ON public."_ab_custom_blocks_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = '_ab_custom_blocks_v_parent_id_fk'
      ) THEN
        ALTER TABLE public."_ab_custom_blocks_v"
          ADD CONSTRAINT "_ab_custom_blocks_v_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."_about_page_v" ("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // Kiểm tra cột mới trên bảng about_page
  const colRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'about_page' AND column_name = 'content_block_enabled';
  `)
  if (colRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột content_block_enabled trong bảng about_page.')
  }

  // Kiểm tra bảng ab_custom_blocks
  const tableRes = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ab_custom_blocks';
  `)
  if (tableRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng ab_custom_blocks trong PostgreSQL.')
  }
}
