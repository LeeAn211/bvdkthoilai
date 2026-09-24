export const id = '20260923_066_add_partner_banners_to_homepage'
export const description = 'Bổ sung enum partner-banners, enum banner_columns, enum bg_gradient và tạo bảng hp_partner_banners, _hp_partner_banners_v'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm value 'partner-banners' vào enum_homepage_sections_type và enum__homepage_v_version_sections_type
  try {
    await client.query(`ALTER TYPE "enum_homepage_sections_type" ADD VALUE IF NOT EXISTS 'partner-banners';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm partner-banners vào enum_homepage_sections_type:', err.message)
  }

  try {
    await client.query(`ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE IF NOT EXISTS 'partner-banners';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm partner-banners vào enum__homepage_v_version_sections_type:', err.message)
  }

  // 2. Tạo enum_homepage_sections_banner_columns và enum__homepage_v_version_sections_banner_columns nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_homepage_sections_banner_columns') THEN
        CREATE TYPE "enum_homepage_sections_banner_columns" AS ENUM ('4', '3', '5', '2');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__homepage_v_version_sections_banner_columns') THEN
        CREATE TYPE "enum__homepage_v_version_sections_banner_columns" AS ENUM ('4', '3', '5', '2');
      END IF;
    END $$;
  `)

  // 3. Thêm cột banner_columns vào homepage_sections và _homepage_v_version_sections nếu chưa có
  await client.query(`
    ALTER TABLE public."homepage_sections"
    ADD COLUMN IF NOT EXISTS "banner_columns" "enum_homepage_sections_banner_columns" DEFAULT '4';
  `)

  await client.query(`
    ALTER TABLE public."_homepage_v_version_sections"
    ADD COLUMN IF NOT EXISTS "banner_columns" "enum__homepage_v_version_sections_banner_columns" DEFAULT '4';
  `)

  // 4. Tạo enum bg_gradient cho partner banners
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hp_partner_banners_bg_gradient') THEN
        CREATE TYPE "enum_hp_partner_banners_bg_gradient" AS ENUM ('cantho', 'moh', 'chinhphu', 'dvc', 'medical', 'green');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__hp_partner_banners_v_bg_gradient') THEN
        CREATE TYPE "enum__hp_partner_banners_v_bg_gradient" AS ENUM ('cantho', 'moh', 'chinhphu', 'dvc', 'medical', 'green');
      END IF;
    END $$;
  `)

  // 5. Tạo bảng hp_partner_banners
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_partner_banners" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar,
      "sub_title" varchar,
      "url" varchar,
      "open_new_tab" boolean DEFAULT true,
      "banner_image_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "banner_image_url" varchar,
      "bg_gradient" "enum_hp_partner_banners_bg_gradient" DEFAULT 'cantho'
    );

    CREATE INDEX IF NOT EXISTS "hp_partner_banners_order_idx" ON public."hp_partner_banners" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_partner_banners_parent_id_idx" ON public."hp_partner_banners" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "hp_partner_banners_banner_image_idx" ON public."hp_partner_banners" ("banner_image_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_partner_banners_parent_id_fk' 
        AND table_name = 'hp_partner_banners'
      ) THEN
        ALTER TABLE public."hp_partner_banners"
          ADD CONSTRAINT "hp_partner_banners_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."homepage_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 6. Tạo bảng _hp_partner_banners_v
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_partner_banners_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar,
      "sub_title" varchar,
      "url" varchar,
      "open_new_tab" boolean DEFAULT true,
      "banner_image_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "banner_image_url" varchar,
      "bg_gradient" "enum__hp_partner_banners_v_bg_gradient" DEFAULT 'cantho',
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_partner_banners_v_order_idx" ON public."_hp_partner_banners_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_partner_banners_v_parent_id_idx" ON public."_hp_partner_banners_v" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_hp_partner_banners_v_banner_image_idx" ON public."_hp_partner_banners_v" ("banner_image_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_partner_banners_v_parent_id_fk' 
        AND table_name = '_hp_partner_banners_v'
      ) THEN
        ALTER TABLE public."_hp_partner_banners_v"
          ADD CONSTRAINT "_hp_partner_banners_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_homepage_v_version_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum value partner-banners
  const { rows: enumRows1 } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_homepage_sections_type' 
      AND pg_enum.enumlabel = 'partner-banners';
  `)
  if (enumRows1.length === 0) {
    throw new Error('Verification failed: enum_homepage_sections_type does not have partner-banners')
  }

  // 2. Kiểm tra bảng hp_partner_banners
  const { rows: table1 } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name = 'hp_partner_banners';
  `)
  if (table1.length === 0) {
    throw new Error('Verification failed: table hp_partner_banners does not exist')
  }

  // 3. Kiểm tra bảng _hp_partner_banners_v
  const { rows: table2 } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name = '_hp_partner_banners_v';
  `)
  if (table2.length === 0) {
    throw new Error('Verification failed: table _hp_partner_banners_v does not exist')
  }

  // 4. Kiểm tra cột banner_columns
  const { rows: col1 } = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'homepage_sections' AND column_name = 'banner_columns';
  `)
  if (col1.length === 0) {
    throw new Error('Verification failed: column banner_columns missing in homepage_sections')
  }
}
