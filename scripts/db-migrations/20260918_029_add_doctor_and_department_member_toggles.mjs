export const id = '20260918_029_add_doctor_and_department_member_toggles'
export const description = 'Thêm cột show_in_specialty, show_in_department vào doctors và show_members_section, members_section_title vào departments'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm cột vào bảng doctors và bảng phiên bản _doctors_v
  await client.query(`
    ALTER TABLE public."doctors"
      ADD COLUMN IF NOT EXISTS "show_in_specialty" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "show_in_department" boolean DEFAULT true;

    ALTER TABLE public."_doctors_v"
      ADD COLUMN IF NOT EXISTS "version_show_in_specialty" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_show_in_department" boolean DEFAULT true;
  `)

  // 2. Thêm cột vào bảng departments (departments không có version)
  await client.query(`
    ALTER TABLE public."departments"
      ADD COLUMN IF NOT EXISTS "show_members_section" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "members_section_title" varchar;
  `)
}

export async function verify({ client }) {
  const docRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name IN ('show_in_specialty', 'show_in_department');
  `)
  if (docRes.rowCount < 2) {
    throw new Error('Chưa tìm thấy đủ các cột show_in_specialty, show_in_department trong bảng doctors.')
  }

  const deptRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'departments' AND column_name IN ('show_members_section', 'members_section_title');
  `)
  if (deptRes.rowCount < 2) {
    throw new Error('Chưa tìm thấy đủ các cột show_members_section, members_section_title trong bảng departments.')
  }
}
