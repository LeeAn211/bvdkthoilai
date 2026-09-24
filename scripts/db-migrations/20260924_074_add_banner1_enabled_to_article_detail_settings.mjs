export const id = '20260924_074_add_banner1_enabled_to_article_detail_settings'
export const description = 'Bổ sung cột sidebar_banner_banner1_enabled vào bảng article_detail_settings để hỗ trợ bật/tắt riêng Banner #1 trên sidebar'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."article_detail_settings"
      ADD COLUMN IF NOT EXISTS "sidebar_banner_banner1_enabled" boolean DEFAULT true;
  `)
}

export async function verify({ client }) {
  const colRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'article_detail_settings' AND column_name = 'sidebar_banner_banner1_enabled';
  `)
  if (!colRes.rows?.length) {
    throw new Error('Chưa tìm thấy cột sidebar_banner_banner1_enabled trong bảng article_detail_settings.')
  }
}
