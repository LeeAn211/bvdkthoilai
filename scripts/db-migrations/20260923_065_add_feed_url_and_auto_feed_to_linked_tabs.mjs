export const id = '20260923_065_add_feed_url_and_auto_feed_to_linked_tabs'
export const description = 'Bổ sung giá trị auto-feed vào enum source và thêm cột feed_url vào hp_linked_tabs và _hp_linked_tabs_v'
export const transactional = false

export async function up({ client }) {
  // 1. Bổ sung giá trị 'auto-feed' vào các enum nguồn của linked tabs
  try {
    await client.query(`ALTER TYPE "enum_hp_linked_tabs_source" ADD VALUE IF NOT EXISTS 'auto-feed';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm auto-feed vào enum_hp_linked_tabs_source:', err.message)
  }

  try {
    await client.query(`ALTER TYPE "enum__hp_linked_tabs_v_source" ADD VALUE IF NOT EXISTS 'auto-feed';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm auto-feed vào enum__hp_linked_tabs_v_source:', err.message)
  }

  // 2. Thêm cột feed_url vào bảng hp_linked_tabs
  await client.query(`
    ALTER TABLE public."hp_linked_tabs"
    ADD COLUMN IF NOT EXISTS "feed_url" varchar;
  `)

  // 3. Thêm cột feed_url vào bảng _hp_linked_tabs_v (version table)
  await client.query(`
    ALTER TABLE public."_hp_linked_tabs_v"
    ADD COLUMN IF NOT EXISTS "feed_url" varchar;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra enum value auto-feed đã tồn tại
  const { rows: enumRows1 } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_hp_linked_tabs_source' 
      AND pg_enum.enumlabel = 'auto-feed';
  `)
  if (enumRows1.length === 0) {
    throw new Error('Verification failed: enum_hp_linked_tabs_source does not have auto-feed')
  }

  const { rows: enumRows2 } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum__hp_linked_tabs_v_source' 
      AND pg_enum.enumlabel = 'auto-feed';
  `)
  if (enumRows2.length === 0) {
    throw new Error('Verification failed: enum__hp_linked_tabs_v_source does not have auto-feed')
  }

  // 2. Kiểm tra cột feed_url đã tồn tại trong hp_linked_tabs và _hp_linked_tabs_v
  const { rows: col1 } = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'hp_linked_tabs' AND column_name = 'feed_url';
  `)
  if (col1.length === 0) {
    throw new Error('Verification failed: column feed_url not found in hp_linked_tabs')
  }

  const { rows: col2 } = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = '_hp_linked_tabs_v' AND column_name = 'feed_url';
  `)
  if (col2.length === 0) {
    throw new Error('Verification failed: column feed_url not found in _hp_linked_tabs_v')
  }

  return true
}
