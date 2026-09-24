export const id = '20260923_068_add_warnings_and_legal_to_homepage'
export const description = 'Bổ sung giá trị health-warnings và legal-dissemination vào enum_homepage_sections_type và enum__homepage_v_version_sections_type'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm value 'health-warnings' và 'legal-dissemination' vào enum_homepage_sections_type
  try {
    await client.query(`ALTER TYPE "enum_homepage_sections_type" ADD VALUE IF NOT EXISTS 'health-warnings';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm health-warnings vào enum_homepage_sections_type:', err.message)
  }

  try {
    await client.query(`ALTER TYPE "enum_homepage_sections_type" ADD VALUE IF NOT EXISTS 'legal-dissemination';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm legal-dissemination vào enum_homepage_sections_type:', err.message)
  }

  // 2. Thêm vào enum__homepage_v_version_sections_type
  try {
    await client.query(`ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE IF NOT EXISTS 'health-warnings';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm health-warnings vào enum__homepage_v_version_sections_type:', err.message)
  }

  try {
    await client.query(`ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE IF NOT EXISTS 'legal-dissemination';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm legal-dissemination vào enum__homepage_v_version_sections_type:', err.message)
  }
}

export async function verify({ client }) {
  const { rows: enumRows1 } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum_homepage_sections_type' 
      AND pg_enum.enumlabel IN ('health-warnings', 'legal-dissemination');
  `)
  if (enumRows1.length < 2) {
    throw new Error('Verification failed: enum_homepage_sections_type does not have all new values')
  }

  const { rows: enumRows2 } = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE pg_type.typname = 'enum__homepage_v_version_sections_type' 
      AND pg_enum.enumlabel IN ('health-warnings', 'legal-dissemination');
  `)
  if (enumRows2.length < 2) {
    throw new Error('Verification failed: enum__homepage_v_version_sections_type does not have all new values')
  }
}

export async function down() {
  // PostgreSQL không hỗ trợ drop value khỏi enum một cách an toàn mà không tái tạo type.
}
