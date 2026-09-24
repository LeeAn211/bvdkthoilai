export const id = '20260923_067_add_banner_motion_to_homepage'
export const description = 'Bổ sung enum banner_motion_mode và các cột banner_motion_mode, banner_autoplay_speed vào homepage_sections và _homepage_v_version_sections'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo enum banner_motion_mode nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_homepage_sections_banner_motion_mode') THEN
        CREATE TYPE "enum_homepage_sections_banner_motion_mode" AS ENUM ('marquee', 'carousel', 'grid');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__homepage_v_version_sections_banner_motion_mode') THEN
        CREATE TYPE "enum__homepage_v_version_sections_banner_motion_mode" AS ENUM ('marquee', 'carousel', 'grid');
      END IF;
    END $$;
  `)

  // 2. Thêm cột banner_motion_mode và banner_autoplay_speed vào homepage_sections
  await client.query(`
    ALTER TABLE public."homepage_sections"
    ADD COLUMN IF NOT EXISTS "banner_motion_mode" "enum_homepage_sections_banner_motion_mode" DEFAULT 'marquee',
    ADD COLUMN IF NOT EXISTS "banner_autoplay_speed" numeric DEFAULT 5;
  `)

  // 3. Thêm cột tương ứng vào _homepage_v_version_sections
  await client.query(`
    ALTER TABLE public."_homepage_v_version_sections"
    ADD COLUMN IF NOT EXISTS "banner_motion_mode" "enum__homepage_v_version_sections_banner_motion_mode" DEFAULT 'marquee',
    ADD COLUMN IF NOT EXISTS "banner_autoplay_speed" numeric DEFAULT 5;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum_homepage_sections_banner_motion_mode
  const { rows: enumRows } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_homepage_sections_banner_motion_mode';
  `)
  if (enumRows.length === 0) {
    throw new Error('Verification failed: enum_homepage_sections_banner_motion_mode does not exist')
  }

  // 2. Kiểm tra cột banner_motion_mode trong homepage_sections
  const { rows: col1 } = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'homepage_sections' AND column_name = 'banner_motion_mode';
  `)
  if (col1.length === 0) {
    throw new Error('Verification failed: column banner_motion_mode missing in homepage_sections')
  }

  // 3. Kiểm tra cột banner_autoplay_speed trong homepage_sections
  const { rows: col2 } = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'homepage_sections' AND column_name = 'banner_autoplay_speed';
  `)
  if (col2.length === 0) {
    throw new Error('Verification failed: column banner_autoplay_speed missing in homepage_sections')
  }
}
