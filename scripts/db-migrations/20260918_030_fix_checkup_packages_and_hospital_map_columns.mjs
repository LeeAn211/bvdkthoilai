export const id = '20260918_030_fix_checkup_packages_and_hospital_map_columns'
export const description = 'Thêm các cột title, target_user, price_text, desc vào checkup_packages_settings_packages và floor_name, overview, rooms, hours, desc vào hospital_map_settings tables'
export const transactional = false

export async function up({ client }) {
  // 1. checkup_packages_settings_packages
  await client.query(`
    ALTER TABLE public."checkup_packages_settings_packages"
      ADD COLUMN IF NOT EXISTS "title" varchar,
      ADD COLUMN IF NOT EXISTS "target_user" varchar,
      ADD COLUMN IF NOT EXISTS "price_text" varchar,
      ADD COLUMN IF NOT EXISTS "desc" text;

    UPDATE public."checkup_packages_settings_packages"
    SET 
      "title" = COALESCE("title", "name", 'Gói khám'),
      "target_user" = COALESCE("target_user", "target", 'Mọi đối tượng'),
      "price_text" = COALESCE("price_text", "price", 'Liên hệ'),
      "desc" = COALESCE("desc", 'Mô tả gói khám');
  `)

  // 2. hospital_map_settings_floors
  await client.query(`
    ALTER TABLE public."hospital_map_settings_floors"
      ADD COLUMN IF NOT EXISTS "floor_name" varchar,
      ADD COLUMN IF NOT EXISTS "overview" varchar,
      ADD COLUMN IF NOT EXISTS "rooms" text;

    UPDATE public."hospital_map_settings_floors"
    SET
      "floor_name" = COALESCE("floor_name", "name", "level", 'Tầng'),
      "overview" = COALESCE("overview", "description", 'Khu vực chức năng'),
      "rooms" = COALESCE("rooms", "departments", 'Các phòng chức năng');
  `)

  // 3. hospital_map_settings_facilities
  await client.query(`
    ALTER TABLE public."hospital_map_settings_facilities"
      ADD COLUMN IF NOT EXISTS "hours" varchar DEFAULT '24/24 hoặc Giờ hành chính',
      ADD COLUMN IF NOT EXISTS "desc" text;

    UPDATE public."hospital_map_settings_facilities"
    SET
      "desc" = COALESCE("desc", "note");
  `)
}

export async function verify({ client }) {
  const chk = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'checkup_packages_settings_packages' AND column_name IN ('title', 'target_user', 'price_text', 'desc');
  `)
  if (chk.rowCount < 4) {
    throw new Error('Chưa tìm thấy đủ các cột mới trong bảng checkup_packages_settings_packages.')
  }

  const flr = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'hospital_map_settings_floors' AND column_name IN ('floor_name', 'overview', 'rooms');
  `)
  if (flr.rowCount < 3) {
    throw new Error('Chưa tìm thấy đủ các cột mới trong bảng hospital_map_settings_floors.')
  }

  const fac = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'hospital_map_settings_facilities' AND column_name IN ('hours', 'desc');
  `)
  if (fac.rowCount < 2) {
    throw new Error('Chưa tìm thấy đủ các cột mới trong bảng hospital_map_settings_facilities.')
  }
}
