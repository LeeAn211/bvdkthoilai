export const id = '20260915_008_add_smtp_settings_to_site_settings'
export const description = 'Thêm nhóm cấu hình Email SMTP (smtp_settings) vào site_settings và _site_settings_v'
export const transactional = false

const columns = [
  // site_settings
  ['site_settings', 'smtp_settings_enabled', 'boolean', 'true'],
  ['site_settings', 'smtp_settings_host', 'varchar', "'smtp.gmail.com'"],
  ['site_settings', 'smtp_settings_port', 'numeric', '465'],
  ['site_settings', 'smtp_settings_user', 'varchar', "'leean170792@gmail.com'"],
  ['site_settings', 'smtp_settings_pass', 'varchar', "'mvdbzvsojuorpwgv'"],
  ['site_settings', 'smtp_settings_from_address', 'varchar', "'leean170792@gmail.com'"],
  ['site_settings', 'smtp_settings_from_name', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai'"],

  // _site_settings_v
  ['_site_settings_v', 'version_smtp_settings_enabled', 'boolean', 'true'],
  ['_site_settings_v', 'version_smtp_settings_host', 'varchar', "'smtp.gmail.com'"],
  ['_site_settings_v', 'version_smtp_settings_port', 'numeric', '465'],
  ['_site_settings_v', 'version_smtp_settings_user', 'varchar', "'leean170792@gmail.com'"],
  ['_site_settings_v', 'version_smtp_settings_pass', 'varchar', "'mvdbzvsojuorpwgv'"],
  ['_site_settings_v', 'version_smtp_settings_from_address', 'varchar', "'leean170792@gmail.com'"],
  ['_site_settings_v', 'version_smtp_settings_from_name', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai'"],
]

export async function up({ client }) {
  for (const [table, column, type, defaultValue] of columns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
    `)
  }
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_settings' AND column_name = 'smtp_settings_user';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột smtp_settings_user trong bảng site_settings.')
  }
}
