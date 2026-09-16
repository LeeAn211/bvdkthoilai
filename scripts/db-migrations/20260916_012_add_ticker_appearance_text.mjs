export const id = '20260916_012_add_ticker_appearance_text'
export const description = 'Thêm trường nội dung chữ chạy ticker_appearance_text vào site_settings và _site_settings_v'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm cột ticker_appearance_text vào bảng site_settings
  await client.query(`
    ALTER TABLE public."site_settings"
    ADD COLUMN IF NOT EXISTS "ticker_appearance_text" varchar DEFAULT 'Chào mừng đến với Cổng thông tin Bệnh viện Đa khoa khu vực Thới Lai';
  `)

  // 2. Thêm cột version_ticker_appearance_text vào bảng _site_settings_v
  await client.query(`
    ALTER TABLE public."_site_settings_v"
    ADD COLUMN IF NOT EXISTS "version_ticker_appearance_text" varchar DEFAULT 'Chào mừng đến với Cổng thông tin Bệnh viện Đa khoa khu vực Thới Lai';
  `)

  // 3. Cập nhật dữ liệu hàng hiện tại nếu đang rỗng/null
  await client.query(`
    UPDATE public."site_settings"
    SET "ticker_appearance_text" = COALESCE(NULLIF(slogan, ''), 'Chào mừng đến với Cổng thông tin Bệnh viện Đa khoa khu vực Thới Lai')
    WHERE "ticker_appearance_text" IS NULL OR "ticker_appearance_text" = '';
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_settings' AND column_name = 'ticker_appearance_text';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột ticker_appearance_text trong bảng site_settings.')
  }
}
