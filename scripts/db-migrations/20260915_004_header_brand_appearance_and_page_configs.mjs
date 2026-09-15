export const id = '20260915_004_header_brand_appearance_and_page_configs'
export const description = 'Thêm các trường nhận diện thương hiệu SiteSettings và cấu hình 4 trang mới'
export const transactional = false

const enums = [
  {
    name: 'brand_color_scheme',
    values: ['default', 'navy-gold', 'green-white', 'dark-premium', 'red-white', 'sky-orange'],
  },
  {
    name: 'brand_name_font',
    values: ['be-vietnam-pro', 'montserrat', 'roboto', 'nunito', 'inter'],
  },
  {
    name: 'brand_name_weight',
    values: ['400', '600', '700', '800', '900'],
  },
  {
    name: 'brand_name_effect',
    values: ['none', 'gradient-text', 'shadow', 'border-accent', 'underline-accent', 'highlight-bg'],
  },
  {
    name: 'brand_slogan_weight',
    values: ['400', '500', '600', '700', '800'],
  },
  {
    name: 'brand_slogan_effect',
    values: ['none', 'gradient-text', 'shadow', 'decorative-underline', 'star-wrap'],
  },
  {
    name: 'enum_site_settings_header_brand_appearance_slogan_align',
    values: ['left', 'center', 'right'],
  },
]

const columns = [
  // Cột nhận diện thương hiệu bảng chính
  ['site_settings', 'header_brand_appearance_color_scheme', 'brand_color_scheme', "'default'"],
  ['site_settings', 'header_brand_appearance_name_font_family', 'brand_name_font', "'be-vietnam-pro'"],
  ['site_settings', 'header_brand_appearance_name_font_weight', 'brand_name_weight', "'800'"],
  ['site_settings', 'header_brand_appearance_name_text_effect', 'brand_name_effect', "'none'"],
  ['site_settings', 'header_brand_appearance_slogan_font_weight', 'brand_slogan_weight', "'700'"],
  ['site_settings', 'header_brand_appearance_slogan_italic', 'boolean', 'false'],
  ['site_settings', 'header_brand_appearance_slogan_text_effect', 'brand_slogan_effect', "'none'"],
  ['site_settings', 'header_brand_appearance_slogan_align', 'enum_site_settings_header_brand_appearance_slogan_align', "'left'"],

  // Cột cấu hình 4 trang mới bảng chính
  ['site_settings', 'patient_portal_page_eyebrow', 'varchar', null],
  ['site_settings', 'patient_portal_page_title', 'varchar', null],
  ['site_settings', 'patient_portal_page_description', 'text', null],
  ['site_settings', 'patient_portal_page_show_notice_banner', 'boolean', 'false'],
  ['site_settings', 'patient_portal_page_notice_title', 'varchar', null],
  ['site_settings', 'patient_portal_page_notice_content', 'text', null],
  ['site_settings', 'patient_portal_page_notice_align', 'varchar', "'left'"],

  ['site_settings', 'lich_truc_page_eyebrow', 'varchar', null],
  ['site_settings', 'lich_truc_page_title', 'varchar', null],
  ['site_settings', 'lich_truc_page_description', 'text', null],
  ['site_settings', 'lich_truc_page_show_notice_banner', 'boolean', 'false'],
  ['site_settings', 'lich_truc_page_notice_title', 'varchar', null],
  ['site_settings', 'lich_truc_page_notice_content', 'text', null],
  ['site_settings', 'lich_truc_page_notice_align', 'varchar', "'left'"],

  ['site_settings', 'science_activity_page_eyebrow', 'varchar', null],
  ['site_settings', 'science_activity_page_title', 'varchar', null],
  ['site_settings', 'science_activity_page_description', 'text', null],
  ['site_settings', 'science_activity_page_show_notice_banner', 'boolean', 'false'],
  ['site_settings', 'science_activity_page_notice_title', 'varchar', null],
  ['site_settings', 'science_activity_page_notice_content', 'text', null],
  ['site_settings', 'science_activity_page_notice_align', 'varchar', "'left'"],

  ['site_settings', 'clinical_protocol_page_eyebrow', 'varchar', null],
  ['site_settings', 'clinical_protocol_page_title', 'varchar', null],
  ['site_settings', 'clinical_protocol_page_description', 'text', null],
  ['site_settings', 'clinical_protocol_page_show_notice_banner', 'boolean', 'false'],
  ['site_settings', 'clinical_protocol_page_notice_title', 'varchar', null],
  ['site_settings', 'clinical_protocol_page_notice_content', 'text', null],
  ['site_settings', 'clinical_protocol_page_notice_align', 'varchar', "'left'"],
  ['site_settings', 'clinical_protocol_page_show_search_box', 'boolean', 'true'],
  ['site_settings', 'clinical_protocol_page_show_category_filter', 'boolean', 'true'],
]

export async function up({ client }) {
  // 1. Tạo Enums
  for (const { name, values } of enums) {
    const formattedValues = values.map((v) => `'${v}'`).join(', ')
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${name}') THEN
          CREATE TYPE public."${name}" AS ENUM (${formattedValues});
        END IF;
      END $$;
    `)
  }

  // 2. Thêm columns vào bảng site_settings
  for (const [table, column, type, defaultValue] of columns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(
      `ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};`,
    )
  }
}

export async function verify({ client }) {
  const result = await client.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'site_settings'
        AND column_name = 'header_brand_appearance_color_scheme'`,
  )

  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột header_brand_appearance_color_scheme trong bảng site_settings.')
  }
}
