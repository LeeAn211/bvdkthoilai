export const id = '20260919_043_add_expert_display_layout_to_homepage'
export const description = 'Bổ sung enum expert_display_layout và cột expert_display_layout vào homepage_sections và _homepage_v_version_sections'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo enum cho homepage_sections_expert_display_layout
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_homepage_sections_expert_display_layout') THEN
        CREATE TYPE "enum_homepage_sections_expert_display_layout" AS ENUM ('featured-grid', 'carousel');
      END IF;
    END $$;
  `)

  // 2. Tạo enum cho _homepage_v_version_sections_expert_display_layout
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__homepage_v_version_sections_expert_display_layout') THEN
        CREATE TYPE "enum__homepage_v_version_sections_expert_display_layout" AS ENUM ('featured-grid', 'carousel');
      END IF;
    END $$;
  `)

  // 3. Thêm cột expert_display_layout vào homepage_sections
  await client.query(`
    ALTER TABLE public."homepage_sections"
      ADD COLUMN IF NOT EXISTS "expert_display_layout" "enum_homepage_sections_expert_display_layout" DEFAULT 'featured-grid';
  `)

  // 4. Thêm cột expert_display_layout vào _homepage_v_version_sections
  await client.query(`
    ALTER TABLE public."_homepage_v_version_sections"
      ADD COLUMN IF NOT EXISTS "expert_display_layout" "enum__homepage_v_version_sections_expert_display_layout" DEFAULT 'featured-grid';
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum tồn tại
  const { rows: enumRows } = await client.query(`
    SELECT typname FROM pg_type WHERE typname IN (
      'enum_homepage_sections_expert_display_layout',
      'enum__homepage_v_version_sections_expert_display_layout'
    );
  `)
  if (enumRows.length < 2) {
    throw new Error('Verification failed: expert display layout enums not created')
  }

  // 2. Kiểm tra cột tồn tại trong homepage_sections
  const { rows: colRows } = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'homepage_sections' 
      AND column_name = 'expert_display_layout';
  `)
  if (colRows.length === 0) {
    throw new Error('Verification failed: column expert_display_layout does not exist in homepage_sections')
  }

  return true
}
