export const id = '20260918_041_add_carousel_controls_to_vaccination_settings'
export const description = 'Thêm cấu hình items_per_view, autoplay_seconds và detail_button_text vào bảng vaccination_settings'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."vaccination_settings"
      ADD COLUMN IF NOT EXISTS "items_per_view" numeric DEFAULT 3,
      ADD COLUMN IF NOT EXISTS "autoplay_seconds" numeric DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "detail_button_text" varchar DEFAULT 'Chi tiết';
  `)
}

export async function verify({ client }) {
  const columnCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'vaccination_settings' 
      AND column_name IN ('items_per_view', 'autoplay_seconds', 'detail_button_text');
  `)
  if (columnCheck.rowCount < 3) {
    throw new Error('Chưa tìm thấy đầy đủ các cột items_per_view, autoplay_seconds, detail_button_text trong bảng vaccination_settings.')
  }
}
