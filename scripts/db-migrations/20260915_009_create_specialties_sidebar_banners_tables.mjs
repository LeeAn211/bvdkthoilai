export const id = '20260915_009_create_specialties_sidebar_banners_tables'
export const description = 'Tạo bảng specialties_sidebar_banners và _specialties_v_version_sidebar_banners cùng các cột còn thiếu trong specialties / _specialties_v'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo bảng specialties_sidebar_banners nếu chưa có
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."specialties_sidebar_banners" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "image_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "title" varchar,
      "btn_text" varchar,
      "link" varchar,
      "open_new_tab" boolean DEFAULT true,
      "desc" varchar
    );
  `)

  // Foreign key và index cho specialties_sidebar_banners
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'specialties_sidebar_banners_parent_id_fk'
      ) THEN
        ALTER TABLE public."specialties_sidebar_banners"
        ADD CONSTRAINT "specialties_sidebar_banners_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES public."specialties"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await client.query(`
    CREATE INDEX IF NOT EXISTS "specialties_sidebar_banners_order_idx" ON public."specialties_sidebar_banners" ("_order");
    CREATE INDEX IF NOT EXISTS "specialties_sidebar_banners_parent_id_idx" ON public."specialties_sidebar_banners" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "specialties_sidebar_banners_image_idx" ON public."specialties_sidebar_banners" ("image_id");
  `)

  // 2. Tạo bảng _specialties_v_version_sidebar_banners nếu chưa có
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_specialties_v_version_sidebar_banners" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "image_id" integer REFERENCES public."media"("id") ON DELETE SET NULL,
      "title" varchar,
      "btn_text" varchar,
      "link" varchar,
      "open_new_tab" boolean DEFAULT true,
      "desc" varchar,
      "_uuid" varchar
    );
  `)

  // Foreign key và index cho _specialties_v_version_sidebar_banners
  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_specialties_v_version_sidebar_banners_parent_id_fk'
      ) THEN
        ALTER TABLE public."_specialties_v_version_sidebar_banners"
        ADD CONSTRAINT "_specialties_v_version_sidebar_banners_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES public."_specialties_v"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await client.query(`
    CREATE INDEX IF NOT EXISTS "_specialties_v_version_sidebar_banners_order_idx" ON public."_specialties_v_version_sidebar_banners" ("_order");
    CREATE INDEX IF NOT EXISTS "_specialties_v_version_sidebar_banners_parent_id_idx" ON public."_specialties_v_version_sidebar_banners" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_specialties_v_version_sidebar_banners_image_idx" ON public."_specialties_v_version_sidebar_banners" ("image_id");
  `)

  // 3. Đảm bảo tất cả các cột cấu hình chi tiết chuyên khoa trong specialties và _specialties_v đều tồn tại
  const specialtyColumns = [
    // specialties
    ['specialties', 'show_department_card', 'boolean', 'true'],
    ['specialties', 'show_booking_card', 'boolean', 'true'],
    ['specialties', 'custom_booking_title', 'varchar', null],
    ['specialties', 'custom_booking_button_label', 'varchar', null],
    ['specialties', 'custom_booking_button_url', 'varchar', null],
    ['specialties', 'custom_hotline', 'varchar', null],
    ['specialties', 'custom_booking_desc', 'varchar', null],
    ['specialties', 'show_notice_box', 'boolean', 'true'],
    ['specialties', 'custom_notice_text', 'varchar', null],
    ['specialties', 'sidebar_banners_json', 'varchar', null],
    ['specialties', 'show_cover_image', 'boolean', 'true'],
    ['specialties', 'show_summary_lead', 'boolean', 'true'],
    ['specialties', 'show_content_section', 'boolean', 'true'],
    ['specialties', 'show_services_section', 'boolean', 'true'],
    ['specialties', 'show_doctors_section', 'boolean', 'true'],
    ['specialties', 'show_protocols_section', 'boolean', 'true'],
    ['specialties', 'show_related_section', 'boolean', 'true'],

    // _specialties_v
    ['_specialties_v', 'version_show_department_card', 'boolean', 'true'],
    ['_specialties_v', 'version_show_booking_card', 'boolean', 'true'],
    ['_specialties_v', 'version_custom_booking_title', 'varchar', null],
    ['_specialties_v', 'version_custom_booking_button_label', 'varchar', null],
    ['_specialties_v', 'version_custom_booking_button_url', 'varchar', null],
    ['_specialties_v', 'version_custom_hotline', 'varchar', null],
    ['_specialties_v', 'version_custom_booking_desc', 'varchar', null],
    ['_specialties_v', 'version_show_notice_box', 'boolean', 'true'],
    ['_specialties_v', 'version_custom_notice_text', 'varchar', null],
    ['_specialties_v', 'version_sidebar_banners_json', 'varchar', null],
    ['_specialties_v', 'version_show_cover_image', 'boolean', 'true'],
    ['_specialties_v', 'version_show_summary_lead', 'boolean', 'true'],
    ['_specialties_v', 'version_show_content_section', 'boolean', 'true'],
    ['_specialties_v', 'version_show_services_section', 'boolean', 'true'],
    ['_specialties_v', 'version_show_doctors_section', 'boolean', 'true'],
    ['_specialties_v', 'version_show_protocols_section', 'boolean', 'true'],
    ['_specialties_v', 'version_show_related_section', 'boolean', 'true'],
  ]

  for (const [table, column, type, defaultValue] of specialtyColumns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
    `)
  }
}

export async function verify({ client }) {
  // 1. Kiểm tra bảng specialties_sidebar_banners
  const t1 = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'specialties_sidebar_banners';
  `)
  if (t1.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng specialties_sidebar_banners.')
  }

  // 2. Kiểm tra bảng _specialties_v_version_sidebar_banners
  const t2 = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = '_specialties_v_version_sidebar_banners';
  `)
  if (t2.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng _specialties_v_version_sidebar_banners.')
  }
}
