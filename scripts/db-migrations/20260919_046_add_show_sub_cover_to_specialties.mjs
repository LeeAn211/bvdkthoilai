export const id = '20260919_046_add_show_sub_cover_to_specialties'
export const description = 'Bổ sung cột show_sub_cover vào bảng specialties và version_show_sub_cover vào bảng _specialties_v'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm cột show_sub_cover vào bảng specialties
  await client.query(`
    ALTER TABLE public."specialties"
      ADD COLUMN IF NOT EXISTS "show_sub_cover" boolean DEFAULT true;
  `)

  // 2. Thêm cột version_show_sub_cover vào bảng _specialties_v
  await client.query(`
    ALTER TABLE public."_specialties_v"
      ADD COLUMN IF NOT EXISTS "version_show_sub_cover" boolean DEFAULT true;
  `)
}

export async function verify({ client }) {
  const { rows: colRows } = await client.query(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_name IN ('specialties', '_specialties_v')
      AND column_name IN ('show_sub_cover', 'version_show_sub_cover');
  `)

  const foundCols = colRows.map((r) => `${r.table_name}.${r.column_name}`)
  const requiredCols = [
    'specialties.show_sub_cover',
    '_specialties_v.version_show_sub_cover',
  ]

  for (const rc of requiredCols) {
    if (!foundCols.includes(rc)) {
      throw new Error(`Migration 046 verify thất bại: Thiếu cột ${rc}`)
    }
  }
}
