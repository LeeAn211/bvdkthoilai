export const id = '20260919_045_add_sub_cover_and_custom_icon_to_specialties'
export const description = 'Bổ sung các cột sub_cover_id và icon_custom_upload_id vào bảng specialties và phiên bản'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm cột sub_cover_id và icon_custom_upload_id vào bảng specialties
  await client.query(`
    ALTER TABLE public."specialties"
      ADD COLUMN IF NOT EXISTS "sub_cover_id" integer,
      ADD COLUMN IF NOT EXISTS "icon_custom_upload_id" integer;
  `)

  // 2. Thêm cột version_sub_cover_id và version_icon_custom_upload_id vào bảng _specialties_v
  await client.query(`
    ALTER TABLE public."_specialties_v"
      ADD COLUMN IF NOT EXISTS "version_sub_cover_id" integer,
      ADD COLUMN IF NOT EXISTS "version_icon_custom_upload_id" integer;
  `)
}

export async function verify({ client }) {
  const { rows: colRows } = await client.query(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_name IN ('specialties', '_specialties_v')
      AND column_name IN ('sub_cover_id', 'icon_custom_upload_id', 'version_sub_cover_id', 'version_icon_custom_upload_id');
  `)

  const foundCols = colRows.map((r) => `${r.table_name}.${r.column_name}`)
  const requiredCols = [
    'specialties.sub_cover_id',
    'specialties.icon_custom_upload_id',
    '_specialties_v.version_sub_cover_id',
    '_specialties_v.version_icon_custom_upload_id',
  ]

  for (const rc of requiredCols) {
    if (!foundCols.includes(rc)) {
      throw new Error(`Migration 045 verify thất bại: Thiếu cột ${rc}`)
    }
  }
}
