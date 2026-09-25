export const id = '20260925_077_add_external_fetch_toggles_to_homepage'
export const description = 'Bổ sung cột enable_external_fetch vào homepage_sections và auto_fetch_enabled vào hp_linked_tabs để kiểm soát bật/tắt lấy tin từ liên kết ngoài'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm enable_external_fetch vào homepage_sections và _homepage_v_version_sections
  await client.query(`
    ALTER TABLE public."homepage_sections"
      ADD COLUMN IF NOT EXISTS "enable_external_fetch" boolean DEFAULT false;

    ALTER TABLE public."_homepage_v_version_sections"
      ADD COLUMN IF NOT EXISTS "enable_external_fetch" boolean DEFAULT false;
  `)

  // 2. Thêm auto_fetch_enabled vào hp_linked_tabs và _hp_linked_tabs_v
  await client.query(`
    ALTER TABLE public."hp_linked_tabs"
      ADD COLUMN IF NOT EXISTS "auto_fetch_enabled" boolean DEFAULT false;

    ALTER TABLE public."_hp_linked_tabs_v"
      ADD COLUMN IF NOT EXISTS "auto_fetch_enabled" boolean DEFAULT false;
  `)
}

export async function verify({ client }) {
  const { rows: col1 } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'homepage_sections' AND column_name = 'enable_external_fetch';
  `)
  if (!col1.length) {
    throw new Error('Chưa tìm thấy cột enable_external_fetch trong bảng homepage_sections.')
  }

  const { rows: col2 } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = '_homepage_v_version_sections' AND column_name = 'enable_external_fetch';
  `)
  if (!col2.length) {
    throw new Error('Chưa tìm thấy cột enable_external_fetch trong bảng _homepage_v_version_sections.')
  }

  const { rows: col3 } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'hp_linked_tabs' AND column_name = 'auto_fetch_enabled';
  `)
  if (!col3.length) {
    throw new Error('Chưa tìm thấy cột auto_fetch_enabled trong bảng hp_linked_tabs.')
  }

  const { rows: col4 } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = '_hp_linked_tabs_v' AND column_name = 'auto_fetch_enabled';
  `)
  if (!col4.length) {
    throw new Error('Chưa tìm thấy cột auto_fetch_enabled trong bảng _hp_linked_tabs_v.')
  }
}
