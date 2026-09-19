export const id = '20260919_050_protect_document_media_and_pin'
export const description = 'Chuyển media của tài liệu bảo vệ sang restricted và xóa PIN mặc định dự đoán được'
export const transactional = true

export async function up({ client }) {
  await client.query(`
    UPDATE public.media AS m
    SET access_level = 'restricted'
    WHERE m.id IN (
      SELECT d.file_id
      FROM public.documents AS d
      WHERE d.file_id IS NOT NULL
        AND COALESCE(d.access_mode::text, 'public') <> 'public'
      UNION
      SELECT p.file_id
      FROM public.clinical_protocols AS p
      WHERE p.file_id IS NOT NULL
        AND COALESCE(p.access_mode::text, 'public') <> 'public'
    )
      AND COALESCE(m.access_level::text, 'public') <> 'restricted';

    UPDATE public.site_settings
    SET default_document_pin = NULL
    WHERE default_document_pin IS NOT NULL;

    UPDATE public._site_settings_v
    SET version_default_document_pin = NULL
    WHERE version_default_document_pin IS NOT NULL;

    ALTER TABLE public.site_settings
      ALTER COLUMN default_document_pin SET DEFAULT NULL;

    ALTER TABLE public._site_settings_v
      ALTER COLUMN version_default_document_pin SET DEFAULT NULL;
  `)
}

export async function verify({ client }) {
  const { rows: mediaRows } = await client.query(`
    SELECT count(*)::int AS unprotected_media
    FROM (
      SELECT d.file_id
      FROM public.documents AS d
      JOIN public.media AS m ON m.id = d.file_id
      WHERE COALESCE(d.access_mode::text, 'public') <> 'public'
        AND COALESCE(m.access_level::text, 'public') <> 'restricted'
      UNION ALL
      SELECT p.file_id
      FROM public.clinical_protocols AS p
      JOIN public.media AS m ON m.id = p.file_id
      WHERE COALESCE(p.access_mode::text, 'public') <> 'public'
        AND COALESCE(m.access_level::text, 'public') <> 'restricted'
    ) AS pending;
  `)

  if (mediaRows[0]?.unprotected_media !== 0) {
    throw new Error('Migration 050 verify thất bại: vẫn còn media tài liệu bảo vệ chưa ở chế độ restricted.')
  }

  const { rows: pinRows } = await client.query(`
    SELECT
      (SELECT count(*)::int FROM public.site_settings WHERE default_document_pin IS NOT NULL) AS live_pins,
      (SELECT count(*)::int FROM public._site_settings_v WHERE version_default_document_pin IS NOT NULL) AS version_pins;
  `)

  if (pinRows[0]?.live_pins !== 0 || pinRows[0]?.version_pins !== 0) {
    throw new Error('Migration 050 verify thất bại: PIN mặc định legacy vẫn còn trong SiteSettings.')
  }

  const { rows: defaultRows } = await client.query(`
    SELECT table_name, column_name, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'site_settings' AND column_name = 'default_document_pin')
        OR
        (table_name = '_site_settings_v' AND column_name = 'version_default_document_pin')
      );
  `)

  const hasPinDefault = defaultRows.some((row) => {
    const value = String(row.column_default || '').trim().toLowerCase()
    return value !== '' && !value.startsWith('null::')
  })
  if (defaultRows.length !== 2 || hasPinDefault) {
    throw new Error('Migration 050 verify thất bại: cột PIN vẫn có default không an toàn.')
  }
}
