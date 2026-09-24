export const id = '20260923_063_add_cantho_health_dept_to_homepage_sections_type'
export const description = 'Bổ sung enum cantho-health-dept vào enum_homepage_sections_type và enum__homepage_v_version_sections_type'
export const transactional = false

export async function up({ client }) {
  try {
    await client.query(`ALTER TYPE "enum_homepage_sections_type" ADD VALUE IF NOT EXISTS 'cantho-health-dept';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm enum cantho-health-dept vào enum_homepage_sections_type:', err.message)
  }

  try {
    await client.query(`ALTER TYPE "enum__homepage_v_version_sections_type" ADD VALUE IF NOT EXISTS 'cantho-health-dept';`)
  } catch (err) {
    console.warn('Lưu ý khi thêm enum cantho-health-dept vào enum__homepage_v_version_sections_type:', err.message)
  }
}

export async function verify({ client }) {
  const res1 = await client.query(`
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'enum_homepage_sections_type'::regtype
      AND enumlabel = 'cantho-health-dept';
  `)
  if (!res1.rows?.length) {
    throw new Error('Chưa tìm thấy enum value cantho-health-dept trong enum_homepage_sections_type')
  }

  const res2 = await client.query(`
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'enum__homepage_v_version_sections_type'::regtype
      AND enumlabel = 'cantho-health-dept';
  `)
  if (!res2.rows?.length) {
    throw new Error('Chưa tìm thấy enum value cantho-health-dept trong enum__homepage_v_version_sections_type')
  }
}
