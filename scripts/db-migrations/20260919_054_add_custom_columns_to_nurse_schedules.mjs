export const id = '20260919_054_add_custom_columns_to_nurse_schedules'
export const description = 'Thêm các trường tùy biến tiêu đề cột (nurse_col1_title, nurse_col2_title, nurse_col3_title...) và cột extra_staff cho schedules_nurse_assignments'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm các cột tùy chỉnh tiêu đề và cờ bật/tắt cột 4 vào schedules
  await client.query(`
    ALTER TABLE public."schedules"
      ADD COLUMN IF NOT EXISTS "nurse_col1_title" varchar DEFAULT 'KHOA / PHÒNG',
      ADD COLUMN IF NOT EXISTS "nurse_col1_sub" varchar,
      ADD COLUMN IF NOT EXISTS "nurse_col2_title" varchar DEFAULT 'HÀNH CHÁNH',
      ADD COLUMN IF NOT EXISTS "nurse_col2_sub" varchar DEFAULT 'Ca trực chính theo phân công',
      ADD COLUMN IF NOT EXISTS "nurse_col3_title" varchar DEFAULT 'TĂNG CƯỜNG',
      ADD COLUMN IF NOT EXISTS "nurse_col3_sub" varchar DEFAULT 'Hỗ trợ chuyên môn / Điều động',
      ADD COLUMN IF NOT EXISTS "nurse_enable_col4" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "nurse_col4_title" varchar,
      ADD COLUMN IF NOT EXISTS "nurse_col4_sub" varchar;
  `)

  // 2. Thêm cột extra_staff vào bảng schedules_nurse_assignments
  await client.query(`
    ALTER TABLE public."schedules_nurse_assignments"
      ADD COLUMN IF NOT EXISTS "extra_staff" varchar;
  `)
}

export async function verify({ client }) {
  const checkCol = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'schedules' AND column_name IN (
      'nurse_col1_title', 'nurse_col2_title', 'nurse_col3_title', 'nurse_enable_col4'
    )
  `)
  if (checkCol.rows.length < 4) {
    throw new Error('Migration 054 verify thất bại: chưa tìm thấy đầy đủ các cột tùy chỉnh trong bảng schedules.')
  }

  const checkExtra = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'schedules_nurse_assignments' AND column_name = 'extra_staff'
  `)
  if (checkExtra.rows.length === 0) {
    throw new Error('Migration 054 verify thất bại: chưa tìm thấy cột extra_staff trong schedules_nurse_assignments.')
  }
}
