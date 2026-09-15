export const id = '20260915_010_sync_all_remaining_collection_and_global_columns'
export const description = 'Đồng bộ toàn diện các cột còn thiếu cho our_experts, advanced_techniques, contact_settings và các bảng liên quan'
export const transactional = false

export async function up({ client }) {
  // 1. Đảm bảo kiểu enum ct_not_align tồn tại cho contact_settings
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ct_not_align') THEN
        CREATE TYPE public."ct_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Đảm bảo kiểu enum enum_our_experts_image_fit và enum_advanced_techniques_image_fit
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_our_experts_image_fit') THEN
        CREATE TYPE public."enum_our_experts_image_fit" AS ENUM ('contain', 'cover-top', 'cover-center', 'cover-bottom', 'fill');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_advanced_techniques_image_fit') THEN
        CREATE TYPE public."enum_advanced_techniques_image_fit" AS ENUM ('contain', 'cover-top', 'cover-center', 'cover-bottom', 'fill');
      END IF;
    END $$;
  `)

  // Helper an toàn: chỉ ALTER TABLE nếu bảng thực sự tồn tại trong database
  async function safeAddColumn(table, column, type, defaultValue) {
    const tableExists = await client.query(`
      SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1;
    `, [table])
    if (tableExists.rowCount > 0) {
      const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
      await client.query(`
        ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
      `)
    }
  }

  // 3. Bổ sung các cột cho our_experts và _our_experts_v
  const expertCols = [
    ['our_experts', 'enable_link', 'boolean', 'true'],
    ['our_experts', 'url', 'varchar', null],
    ['our_experts', 'open_new_tab', 'boolean', 'false'],
    ['_our_experts_v', 'version_enable_link', 'boolean', 'true'],
    ['_our_experts_v', 'version_url', 'varchar', null],
    ['_our_experts_v', 'version_open_new_tab', 'boolean', 'false'],
  ]

  for (const [table, column, type, defaultValue] of expertCols) {
    await safeAddColumn(table, column, type, defaultValue)
  }

  // 4. Bổ sung các cột cho advanced_techniques và _advanced_techniques_v
  const techCols = [
    ['advanced_techniques', 'enable_link', 'boolean', 'true'],
    ['advanced_techniques', 'custom_url', 'varchar', null],
    ['advanced_techniques', 'show_cover_in_detail', 'boolean', 'false'],
    ['_advanced_techniques_v', 'version_enable_link', 'boolean', 'true'],
    ['_advanced_techniques_v', 'version_custom_url', 'varchar', null],
    ['_advanced_techniques_v', 'version_show_cover_in_detail', 'boolean', 'false'],
  ]

  for (const [table, column, type, defaultValue] of techCols) {
    await safeAddColumn(table, column, type, defaultValue)
  }

  // 5. Bổ sung các cột cho contact_settings và _contact_settings_v
  const contactCols = [
    ['contact_settings', 'notice_text_align', 'public."ct_not_align"', "'left'"],
    ['contact_settings', 'ct_not_align', 'public."ct_not_align"', "'left'"],
    ['_contact_settings_v', 'version_notice_text_align', 'public."ct_not_align"', "'left'"],
    ['_contact_settings_v', 'version_ct_not_align', 'public."ct_not_align"', "'left'"],
  ]

  for (const [table, column, type, defaultValue] of contactCols) {
    await safeAddColumn(table, column, type, defaultValue)
  }
}

export async function verify({ client }) {
  // 1. Kiểm tra cột enable_link trong our_experts
  const expCheck = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'our_experts' AND column_name = 'enable_link';
  `)
  if (expCheck.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột enable_link trong bảng our_experts.')
  }

  // 2. Kiểm tra cột enable_link và custom_url trong advanced_techniques
  const techCheck = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'advanced_techniques' AND column_name IN ('enable_link', 'custom_url');
  `)
  if (techCheck.rowCount < 2) {
    throw new Error('Chưa tìm thấy đủ các cột enable_link, custom_url trong bảng advanced_techniques.')
  }

  // 3. Kiểm tra cột notice_text_align trong contact_settings
  const ctCheck = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'contact_settings' AND column_name = 'notice_text_align';
  `)
  if (ctCheck.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột notice_text_align trong bảng contact_settings.')
  }
}
