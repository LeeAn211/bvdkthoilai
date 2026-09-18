export const id = '20260918_034_add_gemini_api_key_to_schedule_settings'
export const description = 'Thêm cột gemini_api_key vào bảng schedule_settings phục vụ tính năng Quét ảnh lịch trực AI'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schedule_settings') THEN
        ALTER TABLE public."schedule_settings"
          ADD COLUMN IF NOT EXISTS "gemini_api_key" varchar;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const check = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'schedule_settings' AND column_name = 'gemini_api_key'
  `)
  if (check.rows.length === 0) {
    throw new Error('Chưa tìm thấy cột gemini_api_key trong bảng schedule_settings.')
  }
}
