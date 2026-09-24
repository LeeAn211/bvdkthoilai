export const id = '20260923_064_add_linked_websites_tabs_to_homepage'
export const description = 'Tạo các bảng hp_linked_tabs, hp_linked_items và version tables cho Cổng thông tin liên kết đa tab'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các enum source cho linked tabs
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_hp_linked_tabs_source') THEN
        CREATE TYPE "enum_hp_linked_tabs_source" AS ENUM ('cantho-syt', 'manual');
      END IF;
    END $$;
  `)

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__hp_linked_tabs_v_source') THEN
        CREATE TYPE "enum__hp_linked_tabs_v_source" AS ENUM ('cantho-syt', 'manual');
      END IF;
    END $$;
  `)

  // 2. Tạo bảng hp_linked_tabs
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_linked_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "source" "enum_hp_linked_tabs_source" DEFAULT 'cantho-syt',
      "badge" varchar,
      "see_more_url" varchar,
      "see_more_text" varchar
    );

    CREATE INDEX IF NOT EXISTS "hp_linked_tabs_order_idx" ON public."hp_linked_tabs" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_linked_tabs_parent_id_idx" ON public."hp_linked_tabs" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_linked_tabs_parent_id_fk' 
        AND table_name = 'hp_linked_tabs'
      ) THEN
        ALTER TABLE public."hp_linked_tabs"
          ADD CONSTRAINT "hp_linked_tabs_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."homepage_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 3. Tạo bảng hp_linked_items
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."hp_linked_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "title" varchar,
      "url" varchar,
      "category" varchar,
      "cover_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "cover_url" varchar,
      "date" varchar,
      "badge" varchar,
      "excerpt" varchar
    );

    CREATE INDEX IF NOT EXISTS "hp_linked_items_order_idx" ON public."hp_linked_items" ("_order");
    CREATE INDEX IF NOT EXISTS "hp_linked_items_parent_id_idx" ON public."hp_linked_items" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "hp_linked_items_cover_idx" ON public."hp_linked_items" ("cover_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'hp_linked_items_parent_id_fk' 
        AND table_name = 'hp_linked_items'
      ) THEN
        ALTER TABLE public."hp_linked_items"
          ADD CONSTRAINT "hp_linked_items_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."hp_linked_tabs"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 4. Tạo bảng _hp_linked_tabs_v (version table)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_linked_tabs_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "label" varchar,
      "source" "enum__hp_linked_tabs_v_source" DEFAULT 'cantho-syt',
      "badge" varchar,
      "see_more_url" varchar,
      "see_more_text" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_linked_tabs_v_order_idx" ON public."_hp_linked_tabs_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_linked_tabs_v_parent_id_idx" ON public."_hp_linked_tabs_v" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_linked_tabs_v_parent_id_fk' 
        AND table_name = '_hp_linked_tabs_v'
      ) THEN
        ALTER TABLE public."_hp_linked_tabs_v"
          ADD CONSTRAINT "_hp_linked_tabs_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_homepage_v_version_sections"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 5. Tạo bảng _hp_linked_items_v (version table)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_hp_linked_items_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "title" varchar,
      "url" varchar,
      "category" varchar,
      "cover_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "cover_url" varchar,
      "date" varchar,
      "badge" varchar,
      "excerpt" varchar,
      "_uuid" varchar
    );

    CREATE INDEX IF NOT EXISTS "_hp_linked_items_v_order_idx" ON public."_hp_linked_items_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hp_linked_items_v_parent_id_idx" ON public."_hp_linked_items_v" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_hp_linked_items_v_cover_idx" ON public."_hp_linked_items_v" ("cover_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = '_hp_linked_items_v_parent_id_fk' 
        AND table_name = '_hp_linked_items_v'
      ) THEN
        ALTER TABLE public."_hp_linked_items_v"
          ADD CONSTRAINT "_hp_linked_items_v_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."_hp_linked_tabs_v"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum types đã tồn tại
  const { rows: enum1 } = await client.query(`
    SELECT typname FROM pg_type WHERE typname = 'enum_hp_linked_tabs_source';
  `)
  if (enum1.length === 0) {
    throw new Error('Verification failed: enum_hp_linked_tabs_source does not exist')
  }

  const { rows: enum2 } = await client.query(`
    SELECT typname FROM pg_type WHERE typname = 'enum__hp_linked_tabs_v_source';
  `)
  if (enum2.length === 0) {
    throw new Error('Verification failed: enum__hp_linked_tabs_v_source does not exist')
  }

  // 2. Kiểm tra các bảng đã được tạo
  const tables = ['hp_linked_tabs', 'hp_linked_items', '_hp_linked_tabs_v', '_hp_linked_items_v']
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
