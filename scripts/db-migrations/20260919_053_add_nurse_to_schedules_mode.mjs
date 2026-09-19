export const id = '20260919_053_add_nurse_to_schedules_mode'
export const description = 'Bổ sung giá trị nurse vào enum_schedules_mode để tách hình thức đăng lịch điều dưỡng riêng biệt'
export const transactional = false

export async function up({ client }) {
  // Thêm giá trị 'nurse' vào enum_schedules_mode nếu chưa có
  const check = await client.query(`
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
    WHERE t.typname = 'enum_schedules_mode' AND e.enumlabel = 'nurse';
  `)
  if (check.rows.length === 0) {
    await client.query(`ALTER TYPE enum_schedules_mode ADD VALUE 'nurse';`)
  }
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT t.typname, e.enumlabel 
    FROM pg_enum e 
    JOIN pg_type t ON e.enumtypid = t.oid 
    WHERE t.typname = 'enum_schedules_mode'
      AND e.enumlabel = 'nurse';
  `)

  if (rows.length === 0) {
    throw new Error('enum_schedules_mode chưa có giá trị nurse.')
  }
}
