export const id = '20260919_044_add_icon_and_tagline_to_specialties'
export const description = 'Bổ sung enum icon và các cột icon, tagline vào bảng specialties và _specialties_v'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo enum cho enum_specialties_icon
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_specialties_icon') THEN
        CREATE TYPE "enum_specialties_icon" AS ENUM (
          'default',
          'emergency',
          'imaging',
          'lab',
          'pediatrics',
          'surgery',
          'internal',
          'pharmacy',
          'dental',
          'rehab'
        );
      END IF;
    END $$;
  `)

  // 2. Tạo enum cho enum__specialties_v_version_icon
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__specialties_v_version_icon') THEN
        CREATE TYPE "enum__specialties_v_version_icon" AS ENUM (
          'default',
          'emergency',
          'imaging',
          'lab',
          'pediatrics',
          'surgery',
          'internal',
          'pharmacy',
          'dental',
          'rehab'
        );
      END IF;
    END $$;
  `)

  // 3. Thêm cột icon và tagline vào bảng specialties
  await client.query(`
    ALTER TABLE public."specialties"
      ADD COLUMN IF NOT EXISTS "icon" "enum_specialties_icon" DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS "tagline" varchar;
  `)

  // 4. Thêm cột version_icon và version_tagline vào bảng _specialties_v
  await client.query(`
    ALTER TABLE public."_specialties_v"
      ADD COLUMN IF NOT EXISTS "version_icon" "enum__specialties_v_version_icon" DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS "version_tagline" varchar;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum tồn tại
  const { rows: enumRows } = await client.query(`
    SELECT typname FROM pg_type WHERE typname IN (
      'enum_specialties_icon',
      'enum__specialties_v_version_icon'
    );
  `)
  if (enumRows.length < 2) {
    throw new Error('Verification failed: specialties icon enums not created')
  }

  // 2. Kiểm tra cột tồn tại trong specialties
  const { rows: colRows } = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'specialties' 
      AND column_name IN ('icon', 'tagline');
  `)
  if (colRows.length < 2) {
    throw new Error('Verification failed: columns icon/tagline do not exist in specialties')
  }

  // 3. Kiểm tra cột tồn tại trong _specialties_v
  const { rows: vColRows } = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = '_specialties_v' 
      AND column_name IN ('version_icon', 'version_tagline');
  `)
  if (vColRows.length < 2) {
    throw new Error('Verification failed: columns version_icon/version_tagline do not exist in _specialties_v')
  }

  return true
}
