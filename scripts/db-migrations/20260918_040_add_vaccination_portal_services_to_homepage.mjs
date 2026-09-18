export const id = '20260918_040_add_vaccination_portal_services_to_homepage'
export const description = 'Bổ sung enum vaccination-portal-services vào homepage_sections_type và tạo các bảng hp_vax_tabs_cfg, hp_vax_manual'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm giá trị 'vaccination-portal-services' vào các enum type của homepage sections
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'enum_homepage_sections_type' AND pg_enum.enumlabel = 'vaccination-portal-services'
      ) THEN
        ALTER TYPE "enum_homepage_sections_type" ADD VALUE 'vaccination-portal-services';
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'enum__homepage_v_version_sections_type' AND pg_enum.enumlabel = 'vaccination-portal-services'
      ) THEN
        ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE 'vaccination-portal-services';
      END IF;
    END $$;
  `)

  // 2. Tạo enum enum_hp_vax_tabs_cfg_source và enum__hp_vax_tabs_cfg_v_source
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hp_vax_tabs_cfg_source') THEN
        CREATE TYPE "enum_hp_vax_tabs_cfg_source" AS ENUM ('vaccines', 'campaigns', 'announcements', 'manual');
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__hp_vax_tabs_cfg_v_source') THEN
        CREATE TYPE "enum__hp_vax_tabs_cfg_v_source" AS ENUM ('vaccines', 'campaigns', 'announcements', 'manual');
      END IF;
    END $$;
  `)

  // 3. Tạo bảng hp_vax_tabs_cfg
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_vax_tabs_cfg" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "source" "enum_hp_vax_tabs_cfg_source" DEFAULT 'vaccines',
      "limit" numeric DEFAULT 8,
      "custom_badge" varchar,
      "see_more_url" varchar
    );

    CREATE INDEX IF NOT EXISTS "hp_vax_tabs_cfg_order_idx" ON public."hp_vax_tabs_cfg" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_vax_tabs_cfg_parent_id_idx" ON public."hp_vax_tabs_cfg" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_vax_tabs_cfg_parent_id_fk' 
        AND table_name = 'hp_vax_tabs_cfg'
      ) THEN
        ALTER TABLE public."hp_vax_tabs_cfg"
          ADD CONSTRAINT "hp_vax_tabs_cfg_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."homepage_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 4. Tạo bảng hp_vax_manual
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_vax_manual" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "title" varchar,
      "desc" varchar,
      "badge" varchar,
      "icon" varchar DEFAULT '💉',
      "price_text" varchar,
      "href" varchar,
      "button_text" varchar DEFAULT 'Xem chi tiết →'
    );

    CREATE INDEX IF NOT EXISTS "hp_vax_manual_order_idx" ON public."hp_vax_manual" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_vax_manual_parent_id_idx" ON public."hp_vax_manual" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_vax_manual_parent_id_fk' 
        AND table_name = 'hp_vax_manual'
      ) THEN
        ALTER TABLE public."hp_vax_manual"
          ADD CONSTRAINT "hp_vax_manual_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."hp_vax_tabs_cfg"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 5. Tạo bảng _hp_vax_tabs_cfg_v (bảng version)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_vax_tabs_cfg_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "source" "enum__hp_vax_tabs_cfg_v_source" DEFAULT 'vaccines',
      "limit" numeric DEFAULT 8,
      "custom_badge" varchar,
      "see_more_url" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_vax_tabs_cfg_v_order_idx" ON public."_hp_vax_tabs_cfg_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_vax_tabs_cfg_v_parent_id_idx" ON public."_hp_vax_tabs_cfg_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_vax_tabs_cfg_v_parent_id_fk' 
        AND table_name = '_hp_vax_tabs_cfg_v'
      ) THEN
        ALTER TABLE public."_hp_vax_tabs_cfg_v"
          ADD CONSTRAINT "_hp_vax_tabs_cfg_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_homepage_v_version_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 6. Tạo bảng _hp_vax_manual_v (bảng version)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_vax_manual_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "title" varchar,
      "desc" varchar,
      "badge" varchar,
      "icon" varchar DEFAULT '💉',
      "price_text" varchar,
      "href" varchar,
      "button_text" varchar DEFAULT 'Xem chi tiết →',
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_vax_manual_v_order_idx" ON public."_hp_vax_manual_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_vax_manual_v_parent_id_idx" ON public."_hp_vax_manual_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_vax_manual_v_parent_id_fk' 
        AND table_name = '_hp_vax_manual_v'
      ) THEN
        ALTER TABLE public."_hp_vax_manual_v"
          ADD CONSTRAINT "_hp_vax_manual_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_hp_vax_tabs_cfg_v"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum value đã tồn tại
  const { rows: enumRows } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_homepage_sections_type' 
      AND pg_enum.enumlabel = 'vaccination-portal-services';
  `)
  if (enumRows.length === 0) {
    throw new Error('Verification failed: enum_homepage_sections_type does not have vaccination-portal-services')
  }

  // 2. Kiểm tra các bảng đã được tạo
  const tables = ['hp_vax_tabs_cfg', 'hp_vax_manual', '_hp_vax_tabs_cfg_v', '_hp_vax_manual_v']
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
