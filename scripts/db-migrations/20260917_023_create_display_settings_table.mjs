export const id = '20260917_023_create_display_settings_table'
export const description = 'Tạo bảng display_settings và các enum hiển thị đa thiết bị cho toàn bộ website'
export const transactional = false

const ENUM_VALUES = "'both', 'desktop_only', 'mobile_only', 'hidden'"

const ENUMS = [
  'enum_display_settings_article_breadcrumbs',
  'enum_display_settings_article_date',
  'enum_display_settings_article_views',
  'enum_display_settings_article_category',
  'enum_display_settings_article_share',
  'enum_display_settings_article_highlights',
  'enum_display_settings_article_excerpt',
  'enum_display_settings_article_source',
  'enum_display_settings_article_back_to_list',
  'enum_display_settings_article_sidebar',
  'enum_display_settings_article_sidebar_latest',
  'enum_display_settings_article_sidebar_banners',
  'enum_display_settings_article_related',
  'enum_display_settings_doctor_booking_btn',
  'enum_display_settings_doctor_booking_notice',
  'enum_display_settings_doctor_card_booking_btn',
  'enum_display_settings_schedule_booking_btn',
  'enum_display_settings_schedule_hotline_btn',
  'enum_display_settings_schedule_notes',
  'enum_display_settings_emergency_print_btn',
  'enum_display_settings_emergency_contacts',
  'enum_display_settings_emergency_general_note',
  'enum_display_settings_mobile_top_bar',
  'enum_display_settings_mobile_top_search',
  'enum_display_settings_mobile_top_socials',
  'enum_display_settings_mobile_bottom_nav',
  'enum_display_settings_mobile_bottom_booking_btn',
  'enum_display_settings_mobile_bottom_emergency_btn',
  'enum_display_settings_floating_assistant',
  'enum_display_settings_floating_back_to_top',
  'enum_display_settings_scrolling_ticker',
]

export async function up({ client }) {
  // 1. Tạo các kiểu enum nếu chưa tồn tại
  for (const enumName of ENUMS) {
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${enumName}') THEN
          CREATE TYPE public."${enumName}" AS ENUM (${ENUM_VALUES});
        END IF;
      END $$;
    `)
  }

  // 2. Tạo bảng display_settings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."display_settings" (
      "id" serial PRIMARY KEY,
      "article_breadcrumbs" public."enum_display_settings_article_breadcrumbs" DEFAULT 'both',
      "article_date" public."enum_display_settings_article_date" DEFAULT 'both',
      "article_views" public."enum_display_settings_article_views" DEFAULT 'both',
      "article_category" public."enum_display_settings_article_category" DEFAULT 'both',
      "article_share" public."enum_display_settings_article_share" DEFAULT 'both',
      "article_highlights" public."enum_display_settings_article_highlights" DEFAULT 'both',
      "article_excerpt" public."enum_display_settings_article_excerpt" DEFAULT 'hidden',
      "article_source" public."enum_display_settings_article_source" DEFAULT 'both',
      "article_default_source_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
      "article_back_to_list" public."enum_display_settings_article_back_to_list" DEFAULT 'both',
      "article_sidebar" public."enum_display_settings_article_sidebar" DEFAULT 'both',
      "article_sidebar_latest" public."enum_display_settings_article_sidebar_latest" DEFAULT 'both',
      "article_sidebar_latest_title" varchar DEFAULT 'Tin mới nhất',
      "article_sidebar_banners" public."enum_display_settings_article_sidebar_banners" DEFAULT 'both',
      "article_related" public."enum_display_settings_article_related" DEFAULT 'both',
      "article_related_title" varchar DEFAULT 'Tin tức cùng chuyên mục',
      "doctor_booking_btn" public."enum_display_settings_doctor_booking_btn" DEFAULT 'both',
      "doctor_booking_notice" public."enum_display_settings_doctor_booking_notice" DEFAULT 'both',
      "doctor_booking_default_text" varchar DEFAULT 'Đặt lịch khám',
      "doctor_booking_default_url" varchar DEFAULT '/dat-lich-kham',
      "doctor_card_booking_btn" public."enum_display_settings_doctor_card_booking_btn" DEFAULT 'both',
      "schedule_booking_btn" public."enum_display_settings_schedule_booking_btn" DEFAULT 'both',
      "schedule_hotline_btn" public."enum_display_settings_schedule_hotline_btn" DEFAULT 'both',
      "schedule_notes" public."enum_display_settings_schedule_notes" DEFAULT 'both',
      "emergency_print_btn" public."enum_display_settings_emergency_print_btn" DEFAULT 'desktop_only',
      "emergency_contacts" public."enum_display_settings_emergency_contacts" DEFAULT 'both',
      "emergency_general_note" public."enum_display_settings_emergency_general_note" DEFAULT 'both',
      "mobile_top_bar" public."enum_display_settings_mobile_top_bar" DEFAULT 'mobile_only',
      "mobile_top_search" public."enum_display_settings_mobile_top_search" DEFAULT 'mobile_only',
      "mobile_top_socials" public."enum_display_settings_mobile_top_socials" DEFAULT 'mobile_only',
      "mobile_bottom_nav" public."enum_display_settings_mobile_bottom_nav" DEFAULT 'mobile_only',
      "mobile_bottom_booking_btn" public."enum_display_settings_mobile_bottom_booking_btn" DEFAULT 'mobile_only',
      "mobile_bottom_emergency_btn" public."enum_display_settings_mobile_bottom_emergency_btn" DEFAULT 'mobile_only',
      "floating_assistant" public."enum_display_settings_floating_assistant" DEFAULT 'both',
      "floating_back_to_top" public."enum_display_settings_floating_back_to_top" DEFAULT 'both',
      "scrolling_ticker" public."enum_display_settings_scrolling_ticker" DEFAULT 'both',
      "updated_at" timestamp with time zone DEFAULT now(),
      "created_at" timestamp with time zone DEFAULT now()
    );
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'display_settings';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng display_settings trong PostgreSQL.')
  }
}
