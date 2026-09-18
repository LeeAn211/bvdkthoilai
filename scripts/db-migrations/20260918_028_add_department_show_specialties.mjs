export const id = '20260918_028_add_department_show_specialties'
export const description = 'Thêm cột show_specialties_section cho bảng departments'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."departments"
      ADD COLUMN IF NOT EXISTS "show_specialties_section" boolean DEFAULT true;
  `)
}

export async function verify({ client }) {
  const res = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'departments' AND column_name = 'show_specialties_section';
  `)
  if (res.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột show_specialties_section trong bảng departments.')
  }
}
