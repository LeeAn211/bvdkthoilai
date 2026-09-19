export const id = '20260919_048_add_document_columns_to_homepage_sections'
export const description = 'Bổ sung lựa chọn document_columns (3, 4, 5 cột) cho các section văn bản ngoài trang chủ'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo enum types nếu chưa tồn tại
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_homepage_sections_document_columns AS ENUM ('3', '4', '5');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum__homepage_v_version_sections_document_columns AS ENUM ('3', '4', '5');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 2. Thêm cột document_columns vào bảng homepage_sections
  await client.query(`
    ALTER TABLE homepage_sections 
    ADD COLUMN IF NOT EXISTS document_columns enum_homepage_sections_document_columns DEFAULT '3';
  `)

  // 3. Thêm cột document_columns vào bảng _homepage_v_version_sections
  await client.query(`
    ALTER TABLE _homepage_v_version_sections 
    ADD COLUMN IF NOT EXISTS document_columns enum__homepage_v_version_sections_document_columns DEFAULT '3';
  `)
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_name IN ('homepage_sections', '_homepage_v_version_sections')
      AND column_name = 'document_columns';
  `)

  const found = rows.map(r => `${r.table_name}.${r.column_name}`)
  const required = [
    'homepage_sections.document_columns',
    '_homepage_v_version_sections.document_columns',
  ]

  for (const col of required) {
    if (!found.includes(col)) {
      throw new Error(`Migration 048 verify thất bại: Thiếu cột ${col}`)
    }
  }
}
