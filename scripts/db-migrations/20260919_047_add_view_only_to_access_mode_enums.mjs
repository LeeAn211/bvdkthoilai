export const id = '20260919_047_add_view_only_to_access_mode_enums'
export const description = 'Bổ sung giá trị view_only vào enum_documents_access_mode và enum_clinical_protocols_access_mode'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm giá trị 'view_only' vào enum_documents_access_mode nếu chưa có
  const checkDoc = await client.query(`
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
    WHERE t.typname = 'enum_documents_access_mode' AND e.enumlabel = 'view_only';
  `)
  if (checkDoc.rows.length === 0) {
    await client.query(`ALTER TYPE enum_documents_access_mode ADD VALUE 'view_only';`)
  }

  // 2. Thêm giá trị 'view_only' vào enum_clinical_protocols_access_mode nếu chưa có
  const checkCp = await client.query(`
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
    WHERE t.typname = 'enum_clinical_protocols_access_mode' AND e.enumlabel = 'view_only';
  `)
  if (checkCp.rows.length === 0) {
    await client.query(`ALTER TYPE enum_clinical_protocols_access_mode ADD VALUE 'view_only';`)
  }
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT t.typname, e.enumlabel 
    FROM pg_enum e 
    JOIN pg_type t ON e.enumtypid = t.oid 
    WHERE t.typname IN ('enum_documents_access_mode', 'enum_clinical_protocols_access_mode')
      AND e.enumlabel = 'view_only';
  `)

  const found = rows.map(r => `${r.typname}.${r.enumlabel}`)
  const required = [
    'enum_documents_access_mode.view_only',
    'enum_clinical_protocols_access_mode.view_only',
  ]

  for (const item of required) {
    if (!found.includes(item)) {
      throw new Error(`Migration 047 verify thất bại: Thiếu enum value ${item}`)
    }
  }
}
