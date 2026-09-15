export const id = '20260914_002_user_custom_permissions'
export const description = 'Thêm chế độ ma trận quyền tùy chỉnh cho người dùng'
export const transactional = true

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS use_custom_permissions boolean DEFAULT false
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT data_type
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'users'
       AND column_name = 'use_custom_permissions'
  `)

  if (result.rows[0]?.data_type !== 'boolean') {
    throw new Error('users.use_custom_permissions chưa tồn tại hoặc không phải boolean.')
  }
}
