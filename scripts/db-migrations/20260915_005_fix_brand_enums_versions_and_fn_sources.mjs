export const id = '20260915_005_fix_brand_enums_versions_and_fn_sources'
export const description = 'Sửa chuẩn các kiểu enum, thêm cột cho _site_settings_v và tạo bảng fn_sources, _fn_sources_v'
export const transactional = false

async function ensureEnum(client, enumName, values) {
  const check = await client.query(`SELECT 1 FROM pg_type WHERE typname = $1`, [enumName])
  if (check.rowCount === 0) {
    const formattedValues = values.map((v) => `'${v}'`).join(', ')
    await client.query(`CREATE TYPE public."${enumName}" AS ENUM (${formattedValues});`)
  } else {
    for (const val of values) {
      try {
        await client.query(`ALTER TYPE public."${enumName}" ADD VALUE IF NOT EXISTS '${val}';`)
      } catch (err) {
        // Ignored if already exists or unsupported
      }
    }
  }
}

export async function up({ client }) {
  // 1. Tạo hoặc cập nhật Enums chính xác theo Drizzle Schema
  await ensureEnum(client, 'brand_color_scheme', [
    'custom',
    'navy-gold',
    'green-white',
    'dark-premium',
    'red-white',
    'sky-orange',
  ])

  await ensureEnum(client, 'brand_name_font', [
    'inherit',
    '"Be Vietnam Pro", sans-serif',
    '"Montserrat", sans-serif',
    '"Roboto", sans-serif',
    '"Nunito", sans-serif',
    '"Inter", sans-serif',
  ])

  await ensureEnum(client, 'header_slogan_align', ['center', 'left', 'right'])

  const pageEnums = ['pp_not_align', 'lt_not_align', 'sa_not_align', 'cp_not_align']
  for (const enumName of pageEnums) {
    await ensureEnum(client, enumName, ['left', 'center', 'justify'])
  }

  await ensureEnum(client, 'enum_fn_sources_source', [
    'news',
    'news-category',
    'notices',
    'procurement',
    'schedules',
    'documents',
  ])

  await ensureEnum(client, 'enum__fn_sources_v_source', [
    'news',
    'news-category',
    'notices',
    'procurement',
    'schedules',
    'documents',
  ])

  // 2. Chuyển đổi kiểu cột trong site_settings nếu trước đó tạo là varchar hoặc sai enum
  try {
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "header_brand_appearance_slogan_align" TYPE public."header_slogan_align" USING "header_brand_appearance_slogan_align"::text::public."header_slogan_align";`)
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "header_brand_appearance_slogan_align" SET DEFAULT 'center';`)
  } catch (e) {
    // Ignore error if column not exists or already converted
  }

  try {
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "patient_portal_page_notice_align" TYPE public."pp_not_align" USING "patient_portal_page_notice_align"::text::public."pp_not_align";`)
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "patient_portal_page_notice_align" SET DEFAULT 'left';`)
  } catch (e) {}

  try {
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "lich_truc_page_notice_align" TYPE public."lt_not_align" USING "lich_truc_page_notice_align"::text::public."lt_not_align";`)
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "lich_truc_page_notice_align" SET DEFAULT 'left';`)
  } catch (e) {}

  try {
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "science_activity_page_notice_align" TYPE public."sa_not_align" USING "science_activity_page_notice_align"::text::public."sa_not_align";`)
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "science_activity_page_notice_align" SET DEFAULT 'left';`)
  } catch (e) {}

  try {
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "clinical_protocol_page_notice_align" TYPE public."cp_not_align" USING "clinical_protocol_page_notice_align"::text::public."cp_not_align";`)
    await client.query(`ALTER TABLE public."site_settings" ALTER COLUMN "clinical_protocol_page_notice_align" SET DEFAULT 'left';`)
  } catch (e) {}

  // 3. Thêm các cột cho bảng phiên bản _site_settings_v
  const versionColumns = [
    // Brand Appearance
    ['_site_settings_v', 'version_header_brand_appearance_color_scheme', 'public."brand_color_scheme"', "'custom'"],
    ['_site_settings_v', 'version_header_brand_appearance_logo_size', 'numeric', '66'],
    ['_site_settings_v', 'version_header_brand_appearance_title_font_size', 'numeric', '17'],
    ['_site_settings_v', 'version_header_brand_appearance_subtitle_font_size', 'numeric', '13'],
    ['_site_settings_v', 'version_header_brand_appearance_name_font_family', 'public."brand_name_font"', "'inherit'"],
    ['_site_settings_v', 'version_header_brand_appearance_name_font_weight', 'public."brand_name_weight"', "'800'"],
    ['_site_settings_v', 'version_header_brand_appearance_name_text_effect', 'public."brand_name_effect"', "'none'"],
    ['_site_settings_v', 'version_header_brand_appearance_header_background_color', 'varchar', "'#FFFFFF'"],
    ['_site_settings_v', 'version_header_brand_appearance_logo_background_color', 'varchar', "'#FFFFFF'"],
    ['_site_settings_v', 'version_header_brand_appearance_title_color', 'varchar', "'#143653'"],
    ['_site_settings_v', 'version_header_brand_appearance_subtitle_color', 'varchar', "'#0878D1'"],
    ['_site_settings_v', 'version_header_brand_appearance_slogan_align', 'public."header_slogan_align"', "'center'"],
    ['_site_settings_v', 'version_header_brand_appearance_slogan_color', 'varchar', "'#0a9b50'"],
    ['_site_settings_v', 'version_header_brand_appearance_slogan_font_size', 'numeric', '13'],
    ['_site_settings_v', 'version_header_brand_appearance_slogan_font_weight', 'public."brand_slogan_weight"', "'500'"],
    ['_site_settings_v', 'version_header_brand_appearance_slogan_italic', 'boolean', 'false'],
    ['_site_settings_v', 'version_header_brand_appearance_slogan_text_effect', 'public."brand_slogan_effect"', "'none'"],
    ['_site_settings_v', 'version_header_brand_appearance_show_logo', 'boolean', 'true'],
    ['_site_settings_v', 'version_header_brand_appearance_show_hospital_name', 'boolean', 'true'],
    ['_site_settings_v', 'version_header_brand_appearance_background_image_id', 'integer', 'null'],
    ['_site_settings_v', 'version_header_brand_appearance_background_size', 'varchar', "'cover'"],
    ['_site_settings_v', 'version_header_brand_appearance_background_position', 'varchar', "'center center'"],
    ['_site_settings_v', 'version_header_brand_appearance_background_overlay', 'varchar', "'rgba(255,255,255,0.88)'"],
    ['_site_settings_v', 'version_header_brand_appearance_min_height', 'numeric', '110'],

    // 4 Trang mới
    ['_site_settings_v', 'version_patient_portal_page_eyebrow', 'varchar', "'CỔNG TIỆN ÍCH NGƯỜI BỆNH'"],
    ['_site_settings_v', 'version_patient_portal_page_title', 'varchar', "'Dành cho Người bệnh'"],
    ['_site_settings_v', 'version_patient_portal_page_description', 'varchar', "'Tổng hợp đầy đủ các tiện ích, hướng dẫn và dịch vụ hỗ trợ người bệnh tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_patient_portal_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_patient_portal_page_notice_title', 'varchar', "'Thông báo dành cho người bệnh'"],
    ['_site_settings_v', 'version_patient_portal_page_notice_content', 'varchar', "'• Vui lòng mang theo CCCD/CMND và thẻ BHYT khi đến khám.\\n• Đặt lịch trực tuyến qua ứng dụng Medpro để được phục vụ ưu tiên.'"],
    ['_site_settings_v', 'version_patient_portal_page_notice_align', 'public."pp_not_align"', "'left'"],

    ['_site_settings_v', 'version_lich_truc_page_eyebrow', 'varchar', "'TRỰC 24/7'"],
    ['_site_settings_v', 'version_lich_truc_page_title', 'varchar', "'Lịch trực Cấp cứu'"],
    ['_site_settings_v', 'version_lich_truc_page_description', 'varchar', "'Danh sách bác sĩ, điều dưỡng trực cấp cứu 24/7 tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_lich_truc_page_show_notice_banner', 'boolean', 'true'],
    ['_site_settings_v', 'version_lich_truc_page_notice_title', 'varchar', "'Đường dây cấp cứu bệnh viện'"],
    ['_site_settings_v', 'version_lich_truc_page_notice_content', 'varchar', "'• Cấp cứu 24/7: Gọi ngay 02923686115.\\n• Ekip trực cấp cứu sẵn sàng tiếp nhận tất cả các ngày trong tuần, kể cả ngày lễ, Tết.'"],
    ['_site_settings_v', 'version_lich_truc_page_notice_align', 'public."lt_not_align"', "'left'"],

    ['_site_settings_v', 'version_science_activity_page_eyebrow', 'varchar', "'NGHIÊN CỨU & HỌC THUẬT'"],
    ['_site_settings_v', 'version_science_activity_page_title', 'varchar', "'Hoạt động Khoa học'"],
    ['_site_settings_v', 'version_science_activity_page_description', 'varchar', "'Tổng hợp các hội nghị khoa học, đề tài nghiên cứu, chương trình đào tạo chuyên môn và hoạt động học thuật tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_science_activity_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_science_activity_page_notice_title', 'varchar', "'Thông báo hoạt động khoa học'"],
    ['_site_settings_v', 'version_science_activity_page_notice_content', 'varchar', "''"],
    ['_site_settings_v', 'version_science_activity_page_notice_align', 'public."sa_not_align"', "'left'"],

    ['_site_settings_v', 'version_clinical_protocol_page_eyebrow', 'varchar', "'CHUYÊN MÔN LÂM SÀNG'"],
    ['_site_settings_v', 'version_clinical_protocol_page_title', 'varchar', "'Phác đồ Điều trị'"],
    ['_site_settings_v', 'version_clinical_protocol_page_description', 'varchar', "'Hệ thống phác đồ điều trị chuẩn được Ban Giám đốc và Hội đồng Khoa học thông qua, áp dụng thống nhất tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_clinical_protocol_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_clinical_protocol_page_notice_title', 'varchar', "'Lưu ý về phác đồ điều trị'"],
    ['_site_settings_v', 'version_clinical_protocol_page_notice_content', 'varchar', "'• Phác đồ được cập nhật định kỳ theo hướng dẫn của Bộ Y tế và y văn quốc tế.\\n• Áp dụng theo chỉ định của bác sĩ điều trị, không tự ý thay đổi.'"],
    ['_site_settings_v', 'version_clinical_protocol_page_notice_align', 'public."cp_not_align"', "'left'"],
    ['_site_settings_v', 'version_clinical_protocol_page_show_search_box', 'boolean', 'true'],
    ['_site_settings_v', 'version_clinical_protocol_page_show_category_filter', 'boolean', 'true'],
  ]

  for (const [table, column, type, defaultValue] of versionColumns) {
    const defaultClause = defaultValue !== 'null' ? ` DEFAULT ${defaultValue}` : ''
    await client.query(
      `ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};`,
    )
  }

  // 4. Tạo bảng fn_sources và _fn_sources_v (Homepage sections featured sources)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."fn_sources" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY,
      "source" public."enum_fn_sources_source",
      "category_ref_id" integer REFERENCES public."categories"("id") ON DELETE SET NULL,
      "category_name" varchar,
      "custom_badge" varchar,
      "limit" numeric DEFAULT 6,
      "enabled" boolean DEFAULT true
    );
    CREATE INDEX IF NOT EXISTS "fn_sources_order_idx" ON public."fn_sources" ("_order");
    CREATE INDEX IF NOT EXISTS "fn_sources_parent_id_idx" ON public."fn_sources" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "fn_sources_category_ref_idx" ON public."fn_sources" ("category_ref_id");
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_fn_sources_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "source" public."enum__fn_sources_v_source",
      "category_ref_id" integer REFERENCES public."categories"("id") ON DELETE SET NULL,
      "category_name" varchar,
      "custom_badge" varchar,
      "limit" numeric DEFAULT 6,
      "enabled" boolean DEFAULT true,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_fn_sources_v_order_idx" ON public."_fn_sources_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_fn_sources_v_parent_id_idx" ON public."_fn_sources_v" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_fn_sources_v_category_ref_idx" ON public."_fn_sources_v" ("category_ref_id");
  `)
}

export async function verify({ client }) {
  const fnSources = await client.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fn_sources'
  `)
  if (fnSources.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng fn_sources.')
  }

  const versionCol = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = '_site_settings_v' AND column_name = 'version_header_brand_appearance_color_scheme'
  `)
  if (versionCol.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột version_header_brand_appearance_color_scheme trong bảng _site_settings_v.')
  }
}
