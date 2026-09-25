export const id = '20260925_078_seal_external_fetch_toggles_schema'
export const description = 'Xác nhận schema sinh ra cho các trường công tắc bật/tắt lấy tin liên kết ngoài trên trang chủ'

export async function up() {
  // Schema vật lý đã được tạo và kiểm tra an toàn trong migration 077.
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'homepage_sections' AND column_name = 'enable_external_fetch')
        OR (table_name = '_homepage_v_version_sections' AND column_name = 'enable_external_fetch')
        OR (table_name = 'hp_linked_tabs' AND column_name = 'auto_fetch_enabled')
        OR (table_name = '_hp_linked_tabs_v' AND column_name = 'auto_fetch_enabled')
      )
  `)
  if (result.rowCount !== 4) {
    throw new Error('Chưa đầy đủ các cột công tắc lấy tin ngoài (enable_external_fetch, auto_fetch_enabled).')
  }
}
