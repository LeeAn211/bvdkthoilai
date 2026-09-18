export const id = '20260918_039_add_patient_portal_services_to_homepage'
export const description = 'Bổ sung enum patient-portal-services vào homepage_sections_type và tạo các bảng hp_svc_tabs, hp_svc_manual'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm giá trị 'patient-portal-services' vào các enum type của homepage sections
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'enum_homepage_sections_type' AND pg_enum.enumlabel = 'patient-portal-services'
      ) THEN
        ALTER TYPE "enum_homepage_sections_type" ADD VALUE 'patient-portal-services';
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'enum__homepage_v_version_sections_type' AND pg_enum.enumlabel = 'patient-portal-services'
      ) THEN
        ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE 'patient-portal-services';
      END IF;
    END $$;
  `)

  // 2. Tạo enum enum_hp_svc_tabs_source và enum__hp_svc_tabs_v_source
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hp_svc_tabs_source') THEN
        CREATE TYPE "enum_hp_svc_tabs_source" AS ENUM ('packages', 'flow', 'inpatient', 'map', 'portal-cards', 'manual');
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__hp_svc_tabs_v_source') THEN
        CREATE TYPE "enum__hp_svc_tabs_v_source" AS ENUM ('packages', 'flow', 'inpatient', 'map', 'portal-cards', 'manual');
      END IF;
    END $$;
  `)

  // 3. Tạo bảng hp_svc_tabs
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_svc_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "source" "enum_hp_svc_tabs_source" DEFAULT 'packages',
      "limit" numeric DEFAULT 6,
      "custom_badge" varchar,
      "see_more_url" varchar
    );

    CREATE INDEX IF NOT EXISTS "hp_svc_tabs_order_idx" ON public."hp_svc_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_svc_tabs_parent_id_idx" ON public."hp_svc_tabs" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_svc_tabs_parent_id_fk' 
        AND table_name = 'hp_svc_tabs'
      ) THEN
        ALTER TABLE public."hp_svc_tabs"
          ADD CONSTRAINT "hp_svc_tabs_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."homepage_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 4. Tạo bảng hp_svc_manual
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_svc_manual" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "title" varchar,
      "desc" varchar,
      "badge" varchar,
      "icon" varchar DEFAULT '🩺',
      "href" varchar,
      "button_text" varchar DEFAULT 'Xem chi tiết →'
    );

    CREATE INDEX IF NOT EXISTS "hp_svc_manual_order_idx" ON public."hp_svc_manual" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_svc_manual_parent_id_idx" ON public."hp_svc_manual" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_svc_manual_parent_id_fk' 
        AND table_name = 'hp_svc_manual'
      ) THEN
        ALTER TABLE public."hp_svc_manual"
          ADD CONSTRAINT "hp_svc_manual_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."hp_svc_tabs"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 5. Tạo bảng _hp_svc_tabs_v (bảng version)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_svc_tabs_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "source" "enum__hp_svc_tabs_v_source" DEFAULT 'packages',
      "limit" numeric DEFAULT 6,
      "custom_badge" varchar,
      "see_more_url" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_svc_tabs_v_order_idx" ON public."_hp_svc_tabs_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_svc_tabs_v_parent_id_idx" ON public."_hp_svc_tabs_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_svc_tabs_v_parent_id_fk' 
        AND table_name = '_hp_svc_tabs_v'
      ) THEN
        ALTER TABLE public."_hp_svc_tabs_v"
          ADD CONSTRAINT "_hp_svc_tabs_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_homepage_v_version_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 6. Tạo bảng _hp_svc_manual_v (bảng version)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_svc_manual_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "title" varchar,
      "desc" varchar,
      "badge" varchar,
      "icon" varchar DEFAULT '🩺',
      "href" varchar,
      "button_text" varchar DEFAULT 'Xem chi tiết →',
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_svc_manual_v_order_idx" ON public."_hp_svc_manual_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_svc_manual_v_parent_id_idx" ON public."_hp_svc_manual_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_svc_manual_v_parent_id_fk' 
        AND table_name = '_hp_svc_manual_v'
      ) THEN
        ALTER TABLE public."_hp_svc_manual_v"
          ADD CONSTRAINT "_hp_svc_manual_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_hp_svc_tabs_v"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('hp_svc_tabs', 'hp_svc_manual', '_hp_svc_tabs_v', '_hp_svc_manual_v');
  `)

  if (result.rows.length < 4) {
    throw new Error(`Thiếu bảng hp_svc_* trong cơ sở dữ liệu: chỉ tìm thấy ${result.rows.length}/4 bảng.`)
  }

  const enumCheck = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_homepage_sections_type' AND pg_enum.enumlabel = 'patient-portal-services';
  `)

  if (enumCheck.rows.length === 0) {
    throw new Error('Chưa thêm giá trị patient-portal-services vào enum_homepage_sections_type.')
  }

  return true
}
