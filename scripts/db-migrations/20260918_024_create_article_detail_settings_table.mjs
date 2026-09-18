export const id = '20260918_024_create_article_detail_settings_table'
export const description = 'Tạo bảng article_detail_settings và enum vị trí tiêu đề cho trang Quản trị Bố cục & Chi tiết Bài viết độc lập'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu enum nếu chưa tồn tại
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_article_detail_settings_title_position') THEN
        CREATE TYPE public."enum_article_detail_settings_title_position" AS ENUM ('hero', 'body');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_article_detail_settings_hero_padding') THEN
        CREATE TYPE public."enum_article_detail_settings_hero_padding" AS ENUM ('standard', 'spacious', 'compact');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_article_detail_settings_share_position') THEN
        CREATE TYPE public."enum_article_detail_settings_share_position" AS ENUM ('left', 'right', 'top', 'bottom');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_article_detail_settings_banner_position') THEN
        CREATE TYPE public."enum_article_detail_settings_banner_position" AS ENUM ('aboveLatest', 'belowLatest');
      END IF;
    END $$;
  `)

  // 2. Tạo bảng article_detail_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."article_detail_settings" (
      "id" serial PRIMARY KEY,
      "title_position" public."enum_article_detail_settings_title_position" DEFAULT 'hero',
      "hero_padding" public."enum_article_detail_settings_hero_padding" DEFAULT 'standard',
      
      "apply_news" boolean DEFAULT true,
      "apply_notices" boolean DEFAULT true,
      "apply_advanced_techniques" boolean DEFAULT true,
      "apply_procurement" boolean DEFAULT true,
      "apply_recruitment" boolean DEFAULT true,
      "apply_custom_posts" boolean DEFAULT true,
      "apply_all_new_sections" boolean DEFAULT true,
      "custom_slugs_text" text,
      
      "share_settings_enabled" boolean DEFAULT true,
      "share_settings_position" public."enum_article_detail_settings_share_position" DEFAULT 'left',
      "share_settings_platforms_order" varchar DEFAULT 'facebook, zalo, copy, print, custom',
      "share_settings_show_facebook" boolean DEFAULT true,
      "share_settings_show_zalo" boolean DEFAULT true,
      "share_settings_show_copy_link" boolean DEFAULT true,
      "share_settings_show_print" boolean DEFAULT true,
      "share_settings_custom_shares_json" text,
      
      "sidebar_banner_enabled" boolean DEFAULT true,
      "sidebar_banner_position" public."enum_article_detail_settings_banner_position" DEFAULT 'aboveLatest',
      "sidebar_banner_title" varchar DEFAULT 'ĐẶT LỊCH KHÁM BỆNH',
      "sidebar_banner_description" text DEFAULT 'Khám chữa bệnh nhanh chóng, tiện lợi, không phải chờ đợi qua ứng dụng y tế.',
      "sidebar_banner_button_text" varchar DEFAULT 'Đặt lịch khám ngay →',
      "sidebar_banner_button_link" varchar DEFAULT 'https://medpro.vn/',
      "sidebar_banner_open_new_tab" boolean DEFAULT true,
      "sidebar_banner_custom_banner_image_id" integer,
      "sidebar_banner_banner2_enabled" boolean DEFAULT false,
      "sidebar_banner_banner2_title" varchar DEFAULT 'LỊCH TIÊM CHỦNG',
      "sidebar_banner_banner2_description" text DEFAULT 'Tra cứu thông tin và lịch tiêm vắc xin cho trẻ em và người lớn.',
      "sidebar_banner_banner2_button_text" varchar DEFAULT 'Xem lịch tiêm →',
      "sidebar_banner_banner2_button_link" varchar DEFAULT '/tiem-chung',
      "sidebar_banner_banner2_open_new_tab" boolean DEFAULT false,
      "sidebar_banner_banner2_image_id" integer,
      "sidebar_banner_banner3_enabled" boolean DEFAULT false,
      "sidebar_banner_banner3_title" varchar DEFAULT 'BẢNG GIÁ DỊCH VỤ',
      "sidebar_banner_banner3_description" text DEFAULT 'Công khai giá khám chữa bệnh BHYT và dịch vụ yêu cầu.',
      "sidebar_banner_banner3_button_text" varchar DEFAULT 'Tra cứu giá →',
      "sidebar_banner_banner3_button_link" varchar DEFAULT '/bang-gia',
      "sidebar_banner_banner3_open_new_tab" boolean DEFAULT false,
      "sidebar_banner_banner3_image_id" integer,
      "sidebar_banner_extra_banners_json" text,
      
      "display_options_show_breadcrumbs" boolean DEFAULT true,
      "display_options_show_date" boolean DEFAULT true,
      "display_options_show_views" boolean DEFAULT true,
      "display_options_show_category" boolean DEFAULT true,
      "display_options_show_highlights" boolean DEFAULT true,
      "display_options_show_excerpt" boolean DEFAULT false,
      "display_options_show_source" boolean DEFAULT true,
      "display_options_default_source_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
      "display_options_show_sidebar" boolean DEFAULT true,
      "display_options_show_sidebar_latest" boolean DEFAULT true,
      "display_options_sidebar_latest_title" varchar DEFAULT 'Tin mới nhất',
      "display_options_show_sidebar_banners" boolean DEFAULT true,
      "display_options_show_related_section" boolean DEFAULT true,
      "display_options_related_section_title" varchar DEFAULT 'Tin tức cùng chuyên mục',
      "display_options_show_back_to_list" boolean DEFAULT true,
      
      "updated_at" timestamp with time zone DEFAULT now(),
      "created_at" timestamp with time zone DEFAULT now()
    );
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'article_detail_settings';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng article_detail_settings trong PostgreSQL.')
  }
}
