export const id = '20260918_027_enhance_hospital_history_toggles_and_blocks'
export const description = 'Bổ sung checkbox enabled, căn lề và kích thước ô Giá trị cốt lõi, và bảng mảng hist_custom_blocks cho trang Lịch sử phát triển'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu ENUM nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hist_val_title_align') THEN
        CREATE TYPE public."hist_val_title_align" AS ENUM ('center', 'left', 'right');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hist_val_desc_align') THEN
        CREATE TYPE public."hist_val_desc_align" AS ENUM ('justify', 'center', 'left');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hist_cb_align') THEN
        CREATE TYPE public."hist_cb_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Thêm cột enabled vào các bảng mảng con hiện có của hospital_history
  await client.query(`
    ALTER TABLE public."hospital_history_quick_stats"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."_hospital_history_v_version_quick_stats"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."hospital_history_milestones"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."_hospital_history_v_version_milestones"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."hospital_history_journey_steps"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."_hospital_history_v_version_journey_steps"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."hospital_history_achievements"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;

    ALTER TABLE public."_hospital_history_v_version_achievements"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true;
  `)

  // 3. Thêm cột enabled, title_align, desc_align vào bảng Giá trị cốt lõi
  await client.query(`
    ALTER TABLE public."history_core_values"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "title_align" public."hist_val_title_align" DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "desc_align" public."hist_val_desc_align" DEFAULT 'justify';

    ALTER TABLE public."_history_core_values_v"
      ADD COLUMN IF NOT EXISTS "enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "title_align" public."hist_val_title_align" DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "desc_align" public."hist_val_desc_align" DEFAULT 'justify';
  `)

  // 4. Thêm các cột kích thước ô Giá trị cốt lõi vào bảng chính và phiên bản
  await client.query(`
    ALTER TABLE public."hospital_history"
      ADD COLUMN IF NOT EXISTS "core_value_card_min_width" numeric DEFAULT 260,
      ADD COLUMN IF NOT EXISTS "core_value_card_padding" numeric DEFAULT 24;

    ALTER TABLE public."_hospital_history_v"
      ADD COLUMN IF NOT EXISTS "version_core_value_card_min_width" numeric DEFAULT 260,
      ADD COLUMN IF NOT EXISTS "version_core_value_card_padding" numeric DEFAULT 24;
  `)

  // 5. Tạo bảng mảng hist_custom_blocks cho bảng chính
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hist_custom_blocks" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."hist_cb_align" DEFAULT 'left'
    );

    CREATE INDEX IF NOT EXISTS "hist_custom_blocks_order_idx" ON public."hist_custom_blocks" ("_order");
    CREATE INDEX IF NOT EXISTS "hist_custom_blocks_parent_id_idx" ON public."hist_custom_blocks" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'hist_custom_blocks_parent_id_fk'
      ) THEN
        ALTER TABLE public."hist_custom_blocks"
          ADD CONSTRAINT "hist_custom_blocks_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."hospital_history" ("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 6. Tạo bảng mảng _hist_custom_blocks_v cho bảng phiên bản
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hist_custom_blocks_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "kicker" varchar,
      "title" varchar NOT NULL,
      "subtitle" varchar,
      "content" jsonb,
      "text_align" public."hist_cb_align" DEFAULT 'left',
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hist_custom_blocks_v_order_idx" ON public."_hist_custom_blocks_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hist_custom_blocks_v_parent_id_idx" ON public."_hist_custom_blocks_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = '_hist_custom_blocks_v_parent_id_fk'
      ) THEN
        ALTER TABLE public."_hist_custom_blocks_v"
          ADD CONSTRAINT "_hist_custom_blocks_v_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."_hospital_history_v" ("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // Kiểm tra cột mới trên bảng history_core_values
  const cvRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'history_core_values' AND column_name = 'title_align';
  `)
  if (cvRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột title_align trong bảng history_core_values.')
  }

  // Kiểm tra cột kích thước trên bảng hospital_history
  const hhRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'hospital_history' AND column_name = 'core_value_card_min_width';
  `)
  if (hhRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột core_value_card_min_width trong bảng hospital_history.')
  }

  // Kiểm tra bảng hist_custom_blocks
  const tableRes = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'hist_custom_blocks';
  `)
  if (tableRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng hist_custom_blocks trong PostgreSQL.')
  }
}
