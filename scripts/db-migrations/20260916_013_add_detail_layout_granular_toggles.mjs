export const id = '20260916_013_add_detail_layout_granular_toggles'
export const description = 'Thêm các cột bật/tắt độc lập từng khối chi tiết bài viết và kỹ thuật chuyên sâu vào theme_settings và _theme_settings_v'
export const transactional = false

const columns = [
  // 1. Phạm vi
  ['detail_layout_apply_advanced_techniques', 'boolean', 'true'],

  // 2. Tùy chọn hiển thị dùng chung (displayOptions)
  ['detail_layout_display_options_show_breadcrumbs', 'boolean', 'true'],
  ['detail_layout_display_options_show_highlights', 'boolean', 'true'],
  ['detail_layout_display_options_show_excerpt', 'boolean', 'false'],
  ['detail_layout_display_options_show_source', 'boolean', 'true'],
  ['detail_layout_display_options_show_sidebar', 'boolean', 'true'],
  ['detail_layout_display_options_show_sidebar_banners', 'boolean', 'true'],
  ['detail_layout_display_options_show_back_to_list', 'boolean', 'true'],

  // 3. Tùy chọn riêng cho Kỹ thuật chuyên sâu (techniqueOptions)
  ['detail_layout_technique_options_show_breadcrumbs', 'boolean', 'true'],
  ['detail_layout_technique_options_show_date', 'boolean', 'true'],
  ['detail_layout_technique_options_show_views', 'boolean', 'true'],
  ['detail_layout_technique_options_show_category', 'boolean', 'true'],
  ['detail_layout_technique_options_show_highlights', 'boolean', 'true'],
  ['detail_layout_technique_options_show_advantages', 'boolean', 'true'],
  ['detail_layout_technique_options_show_cover_in_detail', 'boolean', 'false'],
  ['detail_layout_technique_options_show_source', 'boolean', 'false'],
  ['detail_layout_technique_options_source_name', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai'"],
  ['detail_layout_technique_options_show_share_buttons', 'boolean', 'true'],
  ['detail_layout_technique_options_show_sidebar', 'boolean', 'true'],
  ['detail_layout_technique_options_show_sidebar_latest', 'boolean', 'true'],
  ['detail_layout_technique_options_sidebar_latest_title', 'varchar', "'Kỹ thuật chuyên sâu khác'"],
  ['detail_layout_technique_options_show_sidebar_banners', 'boolean', 'true'],
  ['detail_layout_technique_options_show_related_section', 'boolean', 'true'],
  ['detail_layout_technique_options_related_section_title', 'varchar', "'Kỹ thuật cùng chuyên mục'"],
  ['detail_layout_technique_options_show_back_to_list', 'boolean', 'true'],
]

export async function up({ client }) {
  // 1. Đồng bộ bảng chính theme_settings
  for (const [column, type, defaultValue] of columns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."theme_settings"
      ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
    `)
  }

  // 2. Đồng bộ bảng phiên bản _theme_settings_v
  for (const [column, type, defaultValue] of columns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."_theme_settings_v"
      ADD COLUMN IF NOT EXISTS "version_${column}" ${type}${defaultClause};
    `)
  }
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'theme_settings' 
      AND column_name = 'detail_layout_technique_options_show_source';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột detail_layout_technique_options_show_source trong bảng theme_settings.')
  }
}
