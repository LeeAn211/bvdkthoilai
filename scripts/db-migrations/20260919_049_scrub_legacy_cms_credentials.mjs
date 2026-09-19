export const id = '20260919_049_scrub_legacy_cms_credentials'
export const description = 'Xóa credential SMTP/Gemini legacy khỏi Payload Globals và gỡ default SMTP password'
export const transactional = true

export async function up({ client }) {
  await client.query(`
    UPDATE public.site_settings
    SET smtp_settings_pass = NULL
    WHERE smtp_settings_pass IS NOT NULL;

    UPDATE public._site_settings_v
    SET version_smtp_settings_pass = NULL
    WHERE version_smtp_settings_pass IS NOT NULL;

    UPDATE public.schedule_settings
    SET gemini_api_key = NULL
    WHERE gemini_api_key IS NOT NULL;

    ALTER TABLE public.site_settings
      ALTER COLUMN smtp_settings_pass SET DEFAULT NULL;

    ALTER TABLE public._site_settings_v
      ALTER COLUMN version_smtp_settings_pass SET DEFAULT NULL;
  `)
}

export async function verify({ client }) {
  const { rows: valueRows } = await client.query(`
    SELECT
      (SELECT count(*)::int FROM public.site_settings WHERE smtp_settings_pass IS NOT NULL) AS site_smtp_secrets,
      (SELECT count(*)::int FROM public._site_settings_v WHERE version_smtp_settings_pass IS NOT NULL) AS version_smtp_secrets,
      (SELECT count(*)::int FROM public.schedule_settings WHERE gemini_api_key IS NOT NULL) AS schedule_gemini_secrets;
  `)

  const remaining = valueRows[0]
  if (
    remaining.site_smtp_secrets !== 0 ||
    remaining.version_smtp_secrets !== 0 ||
    remaining.schedule_gemini_secrets !== 0
  ) {
    throw new Error('Migration 049 verify thất bại: credential legacy vẫn còn trong Payload Globals.')
  }

  const { rows: defaultRows } = await client.query(`
    SELECT table_name, column_name, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'site_settings' AND column_name = 'smtp_settings_pass')
        OR
        (table_name = '_site_settings_v' AND column_name = 'version_smtp_settings_pass')
      );
  `)

  const hasSensitiveDefault = defaultRows.some((row) => {
    const value = String(row.column_default || '').trim().toLowerCase()
    return value !== '' && !value.startsWith('null::')
  })

  if (defaultRows.length !== 2 || hasSensitiveDefault) {
    throw new Error('Migration 049 verify thất bại: SMTP password column vẫn còn default nhạy cảm.')
  }
}
