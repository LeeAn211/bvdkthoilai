export const id = '20260919_051_site_settings_hotline_defaults'
export const description = 'Thêm giá trị mặc định chuẩn cho hotline cấp cứu và hotline tư vấn trong site_settings và contact_settings'
export const transactional = true

export async function up({ client }) {
  await client.query(`
    -- 1. Cập nhật default cho site_settings
    ALTER TABLE public.site_settings
      ALTER COLUMN emergency_hotline SET DEFAULT '0292 3861 115',
      ALTER COLUMN hotline SET DEFAULT '0292 3861 234';

    -- 2. Cập nhật default cho bảng versions _site_settings_v
    ALTER TABLE public._site_settings_v
      ALTER COLUMN version_emergency_hotline SET DEFAULT '0292 3861 115',
      ALTER COLUMN version_hotline SET DEFAULT '0292 3861 234';

    -- 3. Cập nhật default cho contact_settings
    ALTER TABLE public.contact_settings
      ALTER COLUMN core_info_emergency_hotline SET DEFAULT '0292 3861 115',
      ALTER COLUMN core_info_hotline SET DEFAULT '0292 3861 234';

    -- 4. Cập nhật default cho bảng versions _contact_settings_v
    ALTER TABLE public._contact_settings_v
      ALTER COLUMN version_core_info_emergency_hotline SET DEFAULT '0292 3861 115',
      ALTER COLUMN version_core_info_hotline SET DEFAULT '0292 3861 234';
  `)
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT
      table_name,
      column_name,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'site_settings' AND column_name IN ('emergency_hotline', 'hotline')) OR
        (table_name = 'contact_settings' AND column_name IN ('core_info_emergency_hotline', 'core_info_hotline'))
      );
  `)

  if (rows.length < 4) {
    throw new Error('Migration 051 verify thất bại: không tìm thấy đủ các cột hotline trong site_settings hoặc contact_settings.')
  }
}
