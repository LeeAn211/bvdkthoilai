export const id = '20260918_042_add_custom_carousel_section_to_homepage'
export const description = 'Bổ sung enum custom-carousel vào homepage_sections_type, thêm các cột carousel và tạo bảng hp_custom_cards, _hp_custom_cards_v'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm giá trị 'custom-carousel' vào các enum type của homepage sections
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'enum_homepage_sections_type' AND pg_enum.enumlabel = 'custom-carousel'
      ) THEN
        ALTER TYPE "enum_homepage_sections_type" ADD VALUE 'custom-carousel';
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'enum__homepage_v_version_sections_type' AND pg_enum.enumlabel = 'custom-carousel'
      ) THEN
        ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE 'custom-carousel';
      END IF;
    END $$;
  `)

  // 2. Tạo enum cho statusType của customCarouselCards
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hp_custom_cards_status_type') THEN
        CREATE TYPE "enum_hp_custom_cards_status_type" AS ENUM ('available', 'info', 'warning', 'unavailable');
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__hp_custom_cards_v_status_type') THEN
        CREATE TYPE "enum__hp_custom_cards_v_status_type" AS ENUM ('available', 'info', 'warning', 'unavailable');
      END IF;
    END $$;
  `)

  // 3. Thêm các cột cấu hình carousel vào bảng homepage_sections và _homepage_v_version_sections
  await client.query(`
    ALTER TABLE public."homepage_sections"
      ADD COLUMN IF NOT EXISTS "carousel_items_per_view" numeric DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "carousel_autoplay_seconds" numeric DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "carousel_detail_btn_text" varchar DEFAULT 'Chi tiết',
      ADD COLUMN IF NOT EXISTS "carousel_action_btn_text" varchar DEFAULT 'Đăng ký ngay',
      ADD COLUMN IF NOT EXISTS "carousel_see_more_text" varchar DEFAULT 'Xem tất cả →',
      ADD COLUMN IF NOT EXISTS "carousel_see_more_url" varchar;

    ALTER TABLE public."_homepage_v_version_sections"
      ADD COLUMN IF NOT EXISTS "carousel_items_per_view" numeric DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "carousel_autoplay_seconds" numeric DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "carousel_detail_btn_text" varchar DEFAULT 'Chi tiết',
      ADD COLUMN IF NOT EXISTS "carousel_action_btn_text" varchar DEFAULT 'Đăng ký ngay',
      ADD COLUMN IF NOT EXISTS "carousel_see_more_text" varchar DEFAULT 'Xem tất cả →',
      ADD COLUMN IF NOT EXISTS "carousel_see_more_url" varchar;
  `)

  // 4. Tạo bảng hp_custom_cards (danh sách thẻ trong section)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_custom_cards" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "code" varchar,
      "status_text" varchar,
      "status_type" "enum_hp_custom_cards_status_type" DEFAULT 'available',
      "origin" varchar,
      "image_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "summary" varchar,
      "spec1_key" varchar,
      "spec1_val" varchar,
      "spec2_key" varchar,
      "spec2_val" varchar,
      "spec3_key" varchar,
      "spec3_val" varchar,
      "price_label" varchar DEFAULT 'GIÁ NIÊM YẾT',
      "price_value" varchar,
      "detail_url" varchar,
      "detail_btn_text" varchar,
      "action_url" varchar,
      "action_btn_text" varchar
    );

    CREATE INDEX IF NOT EXISTS "hp_custom_cards_order_idx" ON public."hp_custom_cards" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_custom_cards_parent_id_idx" ON public."hp_custom_cards" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_custom_cards_parent_id_fk' 
        AND table_name = 'hp_custom_cards'
      ) THEN
        ALTER TABLE public."hp_custom_cards"
          ADD CONSTRAINT "hp_custom_cards_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."homepage_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 5. Tạo bảng _hp_custom_cards_v (phiên bản draft/history)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_custom_cards_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar,
      "code" varchar,
      "status_text" varchar,
      "status_type" "enum__hp_custom_cards_v_status_type" DEFAULT 'available',
      "origin" varchar,
      "image_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "summary" varchar,
      "spec1_key" varchar,
      "spec1_val" varchar,
      "spec2_key" varchar,
      "spec2_val" varchar,
      "spec3_key" varchar,
      "spec3_val" varchar,
      "price_label" varchar DEFAULT 'GIÁ NIÊM YẾT',
      "price_value" varchar,
      "detail_url" varchar,
      "detail_btn_text" varchar,
      "action_url" varchar,
      "action_btn_text" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_custom_cards_v_order_idx" ON public."_hp_custom_cards_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_custom_cards_v_parent_id_idx" ON public."_hp_custom_cards_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_custom_cards_v_parent_id_fk' 
        AND table_name = '_hp_custom_cards_v'
      ) THEN
        ALTER TABLE public."_hp_custom_cards_v"
          ADD CONSTRAINT "_hp_custom_cards_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_homepage_v_version_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum custom-carousel
  const { rows: enumRows } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_homepage_sections_type' 
      AND pg_enum.enumlabel = 'custom-carousel';
  `)
  if (enumRows.length === 0) {
    throw new Error('Verification failed: enum_homepage_sections_type does not have custom-carousel')
  }

  // 2. Kiểm tra các bảng hp_custom_cards và _hp_custom_cards_v
  const tables = ['hp_custom_cards', '_hp_custom_cards_v']
  for (const table of tables) {
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1
    `, [table])
    if (rows.length === 0) {
      throw new Error(`Verification failed: table public.${table} does not exist`)
    }
  }

  return true
}
