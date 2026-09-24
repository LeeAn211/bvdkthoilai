export const id = '20260924_075_add_sidebar_banner_scopes_and_full_width_images'
export const description = 'Bổ sung enum và các cột phạm vi áp dụng chuyên mục cho banner sidebar và tùy chọn ảnh bài viết full-width vào article_detail_settings'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_article_detail_settings_sidebar_banner_scope_mode') THEN
        CREATE TYPE public.enum_article_detail_settings_sidebar_banner_scope_mode AS ENUM ('all', 'custom', 'none');
      END IF;
    END $$;

    ALTER TABLE public."article_detail_settings"
      ADD COLUMN IF NOT EXISTS "sidebar_banner_scope_mode" public.enum_article_detail_settings_sidebar_banner_scope_mode DEFAULT 'all',
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_news" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_notices" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_advanced_techniques" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_procurement" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_recruitment" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_custom_posts" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_clinical_protocols" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_health_warnings" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_scientific_activities" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_apply_documents" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sidebar_banner_custom_sections_text" varchar,
      ADD COLUMN IF NOT EXISTS "display_options_show_cover_image" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "display_options_full_width_images" boolean DEFAULT true;
  `)
}

export async function verify({ client }) {
  const colRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'article_detail_settings' 
      AND column_name IN (
        'sidebar_banner_scope_mode',
        'sidebar_banner_apply_news',
        'display_options_show_cover_image',
        'display_options_full_width_images'
      );
  `)
  if ((colRes.rows?.length || 0) < 4) {
    throw new Error('Chưa tìm thấy đủ các cột mới trong bảng article_detail_settings.')
  }
}
