import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_permissions_actions" AS ENUM('view', 'create', 'edit', 'delete', 'submit', 'approve', 'publish', 'hide', 'import', 'export', 'restore');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'system-admin', 'board', 'admin', 'editor', 'reviewer', 'department', 'department-manager', 'hr', 'finance', 'procurement', 'clinic-schedule', 'vaccination', 'quality-management');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'locked', 'inactive');
  CREATE TYPE "public"."enum_media_group" AS ENUM('news', 'notice', 'procurement', 'banner', 'clinic-schedule', 'vaccination', 'doctor', 'department', 'specialty', 'quality', 'other');
  CREATE TYPE "public"."enum_media_access_level" AS ENUM('public', 'internal', 'restricted');
  CREATE TYPE "public"."enum_news_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_notices_level" AS ENUM('normal', 'important', 'urgent');
  CREATE TYPE "public"."enum_notices_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_notices_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__notices_v_version_level" AS ENUM('normal', 'important', 'urgent');
  CREATE TYPE "public"."enum__notices_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__notices_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_procurement_type" AS ENUM('Thông báo mời thầu', 'Kế hoạch lựa chọn nhà thầu', 'Yêu cầu báo giá', 'Mua sắm', 'Kết quả lựa chọn nhà thầu', 'Đính chính');
  CREATE TYPE "public"."enum_procurement_procurement_status" AS ENUM('open', 'closing', 'closed', 'cancelled');
  CREATE TYPE "public"."enum_procurement_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_procurement_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__procurement_v_version_type" AS ENUM('Thông báo mời thầu', 'Kế hoạch lựa chọn nhà thầu', 'Yêu cầu báo giá', 'Mua sắm', 'Kết quả lựa chọn nhà thầu', 'Đính chính');
  CREATE TYPE "public"."enum__procurement_v_version_procurement_status" AS ENUM('open', 'closing', 'closed', 'cancelled');
  CREATE TYPE "public"."enum__procurement_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__procurement_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_departments_unit_type" AS ENUM('clinical', 'paraclinical', 'office', 'other');
  CREATE TYPE "public"."enum_departments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__departments_v_version_unit_type" AS ENUM('clinical', 'paraclinical', 'office', 'other');
  CREATE TYPE "public"."enum__departments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_specialties_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__specialties_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_doctors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__doctors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_schedules_weekly_slots_day_of_week" AS ENUM('2', '3', '4', '5', '6', '7', '8');
  CREATE TYPE "public"."enum_schedules_mode" AS ENUM('daily', 'weekly', 'attachment');
  CREATE TYPE "public"."enum_schedules_schedule_type" AS ENUM('official', 'adjustment');
  CREATE TYPE "public"."enum_vaccinations_entry_type" AS ENUM('announcement', 'campaign', 'vaccine');
  CREATE TYPE "public"."enum_vaccinations_availability" AS ENUM('available', 'coming', 'unavailable');
  CREATE TYPE "public"."enum_vaccination_schedules_schedule_kind" AS ENUM('official', 'adjustment', 'announcement');
  CREATE TYPE "public"."enum_vaccination_schedules_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vaccination_schedules_v_version_schedule_kind" AS ENUM('official', 'adjustment', 'announcement');
  CREATE TYPE "public"."enum__vaccination_schedules_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_vaccines_availability" AS ENUM('available', 'coming', 'unavailable');
  CREATE TYPE "public"."enum_vaccines_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vaccines_v_version_availability" AS ENUM('available', 'coming', 'unavailable');
  CREATE TYPE "public"."enum__vaccines_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_recruitment_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_recruitment_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__recruitment_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__recruitment_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_scope" AS ENUM('news', 'notices', 'procurement', 'recruitment', 'documents');
  CREATE TYPE "public"."enum_feedback_type" AS ENUM('Góp ý', 'Khen ngợi', 'Khiếu nại', 'Khác');
  CREATE TYPE "public"."enum_feedback_status" AS ENUM('new', 'processing', 'done');
  CREATE TYPE "public"."enum_consultations_status" AS ENUM('new', 'processing', 'answered', 'closed');
  CREATE TYPE "public"."enum_feedback_categories_default_priority" AS ENUM('low', 'normal', 'high', 'urgent');
  CREATE TYPE "public"."enum_feedback_cases_priority" AS ENUM('low', 'normal', 'high', 'urgent');
  CREATE TYPE "public"."enum_feedback_cases_status" AS ENUM('new', 'assigned', 'processing', 'waiting', 'resolved', 'closed');
  CREATE TYPE "public"."enum_feedback_actions_action" AS ENUM('received', 'assigned', 'status', 'note', 'response', 'closed');
  CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('text', 'textarea', 'email', 'phone', 'number', 'date', 'select', 'checkbox');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'processing', 'done', 'closed');
  CREATE TYPE "public"."enum_chatbot_conversations_messages_from" AS ENUM('user', 'bot', 'staff');
  CREATE TYPE "public"."enum_survey_template_versions_status" AS ENUM('draft', 'locked');
  CREATE TYPE "public"."enum_survey_questions_type" AS ENUM('rating5', 'single', 'multiple', 'yesno', 'text');
  CREATE TYPE "public"."enum_dynamic_modules_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_dynamic_modules_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dynamic_modules_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__dynamic_modules_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_content_sections_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_content_sections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__content_sections_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__content_sections_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_custom_posts_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum_custom_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__custom_posts_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
  CREATE TYPE "public"."enum__custom_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_import_jobs_module" AS ENUM('services', 'vaccines');
  CREATE TYPE "public"."enum_import_jobs_status" AS ENUM('previewed', 'completed', 'failed', 'rolled-back');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'global-update', 'login', 'other');
  CREATE TYPE "public"."enum_site_settings_service_price_page_rows_per_page" AS ENUM('40', '50');
  CREATE TYPE "public"."enum__site_settings_v_version_service_price_page_rows_per_page" AS ENUM('40', '50');
  CREATE TYPE "public"."enum_navigation_items_children_link_type" AS ENUM('preset', 'reference', 'auto-page', 'auto-section', 'content-section', 'url', 'custom', 'parent');
  CREATE TYPE "public"."enum_navigation_items_children_preset" AS ENUM('/', '/gioi-thieu', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  CREATE TYPE "public"."enum_navigation_items_link_type" AS ENUM('preset', 'reference', 'auto-page', 'auto-section', 'content-section', 'url', 'custom', 'parent');
  CREATE TYPE "public"."enum_navigation_items_preset" AS ENUM('/', '/gioi-thieu', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  CREATE TYPE "public"."enum__navigation_v_version_items_children_link_type" AS ENUM('preset', 'reference', 'auto-page', 'auto-section', 'content-section', 'url', 'custom', 'parent');
  CREATE TYPE "public"."enum__navigation_v_version_items_children_preset" AS ENUM('/', '/gioi-thieu', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  CREATE TYPE "public"."enum__navigation_v_version_items_link_type" AS ENUM('preset', 'reference', 'auto-page', 'auto-section', 'content-section', 'url', 'custom', 'parent');
  CREATE TYPE "public"."enum__navigation_v_version_items_preset" AS ENUM('/', '/gioi-thieu', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  CREATE TYPE "public"."enum_header_contact_cards_icon_type" AS ENUM('phone', 'emergency', 'headset', 'calendar', 'heart', 'info', 'custom');
  CREATE TYPE "public"."enum_header_contact_cards_font_weight" AS ENUM('600', '700', '800', '900');
  CREATE TYPE "public"."enum_header_utility_appearance_time_font_weight" AS ENUM('600', '700', '800', '900');
  CREATE TYPE "public"."enum__header_v_version_contact_cards_icon_type" AS ENUM('phone', 'emergency', 'headset', 'calendar', 'heart', 'info', 'custom');
  CREATE TYPE "public"."enum__header_v_version_contact_cards_font_weight" AS ENUM('600', '700', '800', '900');
  CREATE TYPE "public"."enum__header_v_version_utility_appearance_time_font_weight" AS ENUM('600', '700', '800', '900');
  CREATE TYPE "public"."enum_footer_columns_links_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__footer_v_version_columns_links_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_theme_settings_font_family" AS ENUM('system', 'arial', 'tahoma');
  CREATE TYPE "public"."enum__theme_settings_v_version_font_family" AS ENUM('system', 'arial', 'tahoma');
  CREATE TYPE "public"."enum_homepage_quick_links_visual_mode" AS ENUM('icon', 'image');
  CREATE TYPE "public"."enum_homepage_quick_links_icon" AS ENUM('calendar', 'doctor', 'price', 'insurance', 'hospital', 'map', 'phone', 'document');
  CREATE TYPE "public"."enum_homepage_quick_links_image_fit" AS ENUM('contain', 'cover');
  CREATE TYPE "public"."enum_news_manual_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_dept_manual_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_schedule_manual_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_homepage_sections_schedule_tab_order_tab" AS ENUM('attachments', 'daily', 'weekly');
  CREATE TYPE "public"."enum_vaccine_manual_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_homepage_sections_vaccination_tab_order_tab" AS ENUM('announcements', 'campaigns', 'vaccines');
  CREATE TYPE "public"."enum_homepage_sections_type" AS ENUM('featured-news', 'news-portal', 'organization', 'notices', 'schedules', 'vaccinations', 'procurement', 'science', 'introduction', 'documents', 'content-section', 'custom', 'dynamic-module');
  CREATE TYPE "public"."enum_homepage_sections_image_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum_homepage_sections_button_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_quick_links_visual_mode" AS ENUM('icon', 'image');
  CREATE TYPE "public"."enum__homepage_v_version_quick_links_icon" AS ENUM('calendar', 'doctor', 'price', 'insurance', 'hospital', 'map', 'phone', 'document');
  CREATE TYPE "public"."enum__homepage_v_version_quick_links_image_fit" AS ENUM('contain', 'cover');
  CREATE TYPE "public"."enum__news_manual_v_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__dept_manual_v_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__schedule_manual_v_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__homepage_v_version_sections_schedule_tab_order_tab" AS ENUM('attachments', 'daily', 'weekly');
  CREATE TYPE "public"."enum__vaccine_manual_v_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__homepage_v_version_sections_vaccination_tab_order_tab" AS ENUM('announcements', 'campaigns', 'vaccines');
  CREATE TYPE "public"."enum__homepage_v_version_sections_type" AS ENUM('featured-news', 'news-portal', 'organization', 'notices', 'schedules', 'vaccinations', 'procurement', 'science', 'introduction', 'documents', 'content-section', 'custom', 'dynamic-module');
  CREATE TYPE "public"."enum__homepage_v_version_sections_image_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum__homepage_v_version_sections_button_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_seo_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__seo_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_quick_links_settings_items_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum_quick_links_settings_items_visual_mode" AS ENUM('icon', 'image');
  CREATE TYPE "public"."enum_quick_links_settings_items_icon" AS ENUM('calendar', 'doctor', 'price', 'insurance', 'hospital', 'map', 'phone', 'document');
  CREATE TYPE "public"."enum_quick_links_settings_items_image_fit" AS ENUM('contain', 'cover');
  CREATE TYPE "public"."enum_quick_links_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quick_links_settings_v_version_items_link_mode" AS ENUM('auto-page', 'existing-page', 'internal', 'external');
  CREATE TYPE "public"."enum__quick_links_settings_v_version_items_visual_mode" AS ENUM('icon', 'image');
  CREATE TYPE "public"."enum__quick_links_settings_v_version_items_icon" AS ENUM('calendar', 'doctor', 'price', 'insurance', 'hospital', 'map', 'phone', 'document');
  CREATE TYPE "public"."enum__quick_links_settings_v_version_items_image_fit" AS ENUM('contain', 'cover');
  CREATE TYPE "public"."enum__quick_links_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_permissions_actions" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_users_permissions_actions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_permissions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"module" varchar NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"department_id" integer,
  	"status" "enum_users_status" DEFAULT 'active' NOT NULL,
  	"last_login_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_filename" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"group" "enum_media_group" DEFAULT 'other',
  	"access_level" "enum_media_access_level" DEFAULT 'public' NOT NULL,
  	"uploaded_by_id" integer,
  	"hash" varchar,
  	"duplicate_of_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_article_url" varchar,
  	"sizes_article_width" numeric,
  	"sizes_article_height" numeric,
  	"sizes_article_mime_type" varchar,
  	"sizes_article_filesize" numeric,
  	"sizes_article_filename" varchar
  );
  
  CREATE TABLE "news_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"content" jsonb,
  	"category_ref_id" integer,
  	"category" varchar,
  	"featured" boolean DEFAULT false,
  	"pinned" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"workflow_state" "enum_news_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_category_ref_id" integer,
  	"version_category" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_pinned" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_workflow_state" "enum__news_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "notices_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "notices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"cover_id" integer,
  	"excerpt" varchar,
  	"content" jsonb,
  	"category_ref_id" integer,
  	"level" "enum_notices_level" DEFAULT 'normal',
  	"published_at" timestamp(3) with time zone,
  	"start_at" timestamp(3) with time zone,
  	"expire_at" timestamp(3) with time zone,
  	"pinned" boolean DEFAULT false,
  	"show_on_home" boolean DEFAULT true,
  	"workflow_state" "enum_notices_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_notices_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_notices_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_notices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_category_ref_id" integer,
  	"version_level" "enum__notices_v_version_level" DEFAULT 'normal',
  	"version_published_at" timestamp(3) with time zone,
  	"version_start_at" timestamp(3) with time zone,
  	"version_expire_at" timestamp(3) with time zone,
  	"version_pinned" boolean DEFAULT false,
  	"version_show_on_home" boolean DEFAULT true,
  	"version_workflow_state" "enum__notices_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__notices_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "procurement_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "procurement_change_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "procurement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"cover_id" integer,
  	"excerpt" varchar,
  	"reference_code" varchar,
  	"category_ref_id" integer,
  	"type" "enum_procurement_type",
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"deadline_at" timestamp(3) with time zone,
  	"procurement_status" "enum_procurement_procurement_status" DEFAULT 'open',
  	"contact_unit" varchar,
  	"contact_info" varchar,
  	"workflow_state" "enum_procurement_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_procurement_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_procurement_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_procurement_v_version_change_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_procurement_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_excerpt" varchar,
  	"version_reference_code" varchar,
  	"version_category_ref_id" integer,
  	"version_type" "enum__procurement_v_version_type",
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_deadline_at" timestamp(3) with time zone,
  	"version_procurement_status" "enum__procurement_v_version_procurement_status" DEFAULT 'open',
  	"version_contact_unit" varchar,
  	"version_contact_info" varchar,
  	"version_workflow_state" "enum__procurement_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__procurement_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"number" varchar,
  	"category_ref_id" integer,
  	"category" varchar,
  	"issuer" varchar,
  	"issued_at" timestamp(3) with time zone,
  	"effective_at" timestamp(3) with time zone,
  	"year" numeric,
  	"summary" varchar,
  	"cover_id" integer,
  	"file_id" integer NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_number" varchar,
  	"version_category_ref_id" integer,
  	"version_category" varchar,
  	"version_issuer" varchar,
  	"version_issued_at" timestamp(3) with time zone,
  	"version_effective_at" timestamp(3) with time zone,
  	"version_year" numeric,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_file_id" integer NOT NULL,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "departments_deputy_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "departments_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"kind" varchar DEFAULT 'clinical',
  	"unit_type" "enum_departments_unit_type" DEFAULT 'clinical',
  	"slug" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"functions" jsonb,
  	"activities" jsonb,
  	"achievements" jsonb,
  	"leader" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"location" varchar,
  	"cover_id" integer,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_departments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_departments_v_version_deputy_leaders" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_departments_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_departments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_kind" varchar DEFAULT 'clinical',
  	"version_unit_type" "enum__departments_v_version_unit_type" DEFAULT 'clinical',
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_functions" jsonb,
  	"version_activities" jsonb,
  	"version_achievements" jsonb,
  	"version_leader" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_location" varchar,
  	"version_cover_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_active" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__departments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "specialties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"use_department_name" boolean DEFAULT false,
  	"department_id" integer,
  	"name" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"cover_id" integer,
  	"services" jsonb,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_specialties_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_specialties_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_use_department_name" boolean DEFAULT false,
  	"version_department_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_cover_id" integer,
  	"version_services" jsonb,
  	"version_order" numeric DEFAULT 0,
  	"version_active" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__specialties_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "doctors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"title" varchar,
  	"degree" varchar,
  	"professional_title" varchar,
  	"avatar_id" integer,
  	"department_id" integer,
  	"specialty_ref_id" integer,
  	"specialty" varchar,
  	"license_number" varchar,
  	"bio" jsonb,
  	"expertise" jsonb,
  	"experience" jsonb,
  	"education" jsonb,
  	"achievements" jsonb,
  	"order" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_doctors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_doctors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_degree" varchar,
  	"version_professional_title" varchar,
  	"version_avatar_id" integer,
  	"version_department_id" integer,
  	"version_specialty_ref_id" integer,
  	"version_specialty" varchar,
  	"version_license_number" varchar,
  	"version_bio" jsonb,
  	"version_expertise" jsonb,
  	"version_experience" jsonb,
  	"version_education" jsonb,
  	"version_achievements" jsonb,
  	"version_order" numeric DEFAULT 0,
  	"version_featured" boolean DEFAULT false,
  	"version_active" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__doctors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "schedules_weekly_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_of_week" "enum_schedules_weekly_slots_day_of_week",
  	"doctor_id" integer,
  	"department_id" integer,
  	"start_time" varchar,
  	"end_time" varchar,
  	"room" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "schedules_attachment_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "schedules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Lịch khám bác sĩ' NOT NULL,
  	"summary" varchar,
  	"cover_image_id" integer,
  	"detail_content" jsonb,
  	"mode" "enum_schedules_mode" DEFAULT 'attachment' NOT NULL,
  	"doctor_id" integer,
  	"department_id" integer,
  	"date" timestamp(3) with time zone,
  	"start_time" varchar,
  	"end_time" varchar,
  	"room" varchar,
  	"week_start" timestamp(3) with time zone,
  	"week_end" timestamp(3) with time zone,
  	"schedule_type" "enum_schedules_schedule_type" DEFAULT 'official',
  	"schedule_image_id" integer,
  	"schedule_file_id" integer,
  	"valid_from" timestamp(3) with time zone,
  	"valid_to" timestamp(3) with time zone,
  	"note" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sequence" numeric,
  	"code" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar,
  	"unit" varchar,
  	"insurance_price" numeric,
  	"price" numeric,
  	"note" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_prices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_id" integer NOT NULL,
  	"insurance_price" numeric,
  	"service_price" numeric,
  	"decision_no" varchar,
  	"effective_from" timestamp(3) with time zone NOT NULL,
  	"effective_to" timestamp(3) with time zone,
  	"source_file_name" varchar,
  	"note" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_service_prices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_service_id" integer NOT NULL,
  	"version_insurance_price" numeric,
  	"version_service_price" numeric,
  	"version_decision_no" varchar,
  	"version_effective_from" timestamp(3) with time zone NOT NULL,
  	"version_effective_to" timestamp(3) with time zone,
  	"version_source_file_name" varchar,
  	"version_note" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vaccinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entry_type" "enum_vaccinations_entry_type" DEFAULT 'campaign' NOT NULL,
  	"vaccine_name" varchar NOT NULL,
  	"summary" varchar,
  	"announcement_content" jsonb,
  	"announcement_image_id" integer,
  	"announcement_file_id" integer,
  	"campaign_image_id" integer,
  	"target" varchar,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"start_time" varchar,
  	"end_time" varchar,
  	"location" varchar,
  	"manufacturer" varchar,
  	"origin" varchar,
  	"prevents" varchar,
  	"age_group" varchar,
  	"vaccine_image_id" integer,
  	"detail_content" jsonb,
  	"availability" "enum_vaccinations_availability" DEFAULT 'available',
  	"fee" numeric,
  	"note" varchar,
  	"registration_url" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vaccination_schedules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"schedule_kind" "enum_vaccination_schedules_schedule_kind" DEFAULT 'official',
  	"summary" varchar,
  	"schedule_image_id" integer,
  	"schedule_file_id" integer,
  	"detail_content" jsonb,
  	"target" varchar,
  	"date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"start_time" varchar,
  	"end_time" varchar,
  	"location" varchar,
  	"registration_url" varchar,
  	"note" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_vaccination_schedules_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_vaccination_schedules_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_schedule_kind" "enum__vaccination_schedules_v_version_schedule_kind" DEFAULT 'official',
  	"version_summary" varchar,
  	"version_schedule_image_id" integer,
  	"version_schedule_file_id" integer,
  	"version_detail_content" jsonb,
  	"version_target" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_start_time" varchar,
  	"version_end_time" varchar,
  	"version_location" varchar,
  	"version_registration_url" varchar,
  	"version_note" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__vaccination_schedules_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "vaccines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"name" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"manufacturer" varchar,
  	"origin" varchar,
  	"prevents" varchar,
  	"age_group" varchar,
  	"image_id" integer,
  	"detail_content" jsonb,
  	"availability" "enum_vaccines_availability" DEFAULT 'available',
  	"registration_url" varchar,
  	"note" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_vaccines_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_vaccines_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_code" varchar,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_manufacturer" varchar,
  	"version_origin" varchar,
  	"version_prevents" varchar,
  	"version_age_group" varchar,
  	"version_image_id" integer,
  	"version_detail_content" jsonb,
  	"version_availability" "enum__vaccines_v_version_availability" DEFAULT 'available',
  	"version_registration_url" varchar,
  	"version_note" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__vaccines_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "vaccine_prices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vaccine_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"decision_no" varchar,
  	"effective_from" timestamp(3) with time zone NOT NULL,
  	"effective_to" timestamp(3) with time zone,
  	"note" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_vaccine_prices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_vaccine_id" integer NOT NULL,
  	"version_price" numeric NOT NULL,
  	"version_decision_no" varchar,
  	"version_effective_from" timestamp(3) with time zone NOT NULL,
  	"version_effective_to" timestamp(3) with time zone,
  	"version_note" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "recruitment_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "recruitment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"cover_id" integer,
  	"excerpt" varchar,
  	"category_ref_id" integer,
  	"department_id" integer,
  	"quantity" numeric,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"deadline_at" timestamp(3) with time zone,
  	"attachment_id" integer,
  	"workflow_state" "enum_recruitment_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_recruitment_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_recruitment_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_recruitment_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_excerpt" varchar,
  	"version_category_ref_id" integer,
  	"version_department_id" integer,
  	"version_quantity" numeric,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_deadline_at" timestamp(3) with time zone,
  	"version_attachment_id" integer,
  	"version_workflow_state" "enum__recruitment_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__recruitment_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"content" jsonb,
  	"image_position" "enum_pages_blocks_image_text_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_downloads_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "pages_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"workflow_state" "enum_pages_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"content" jsonb,
  	"image_position" "enum__pages_v_blocks_image_text_image_position" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_workflow_state" "enum__pages_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"scope" "enum_categories_scope" DEFAULT 'news' NOT NULL,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "feedback" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"type" "enum_feedback_type" NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_feedback_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_token" varchar NOT NULL,
  	"question" varchar NOT NULL,
  	"status" "enum_consultations_status" DEFAULT 'new' NOT NULL,
  	"staff_reply" varchar,
  	"answered_at" timestamp(3) with time zone,
  	"internal_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "feedback_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"department_id" integer,
  	"default_priority" "enum_feedback_categories_default_priority" DEFAULT 'normal',
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "feedback_cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"category_id" integer,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"allow_contact" boolean DEFAULT true,
  	"priority" "enum_feedback_cases_priority" DEFAULT 'normal',
  	"status" "enum_feedback_cases_status" DEFAULT 'new' NOT NULL,
  	"department_id" integer,
  	"assignee_id" integer,
  	"due_at" timestamp(3) with time zone,
  	"public_response" varchar,
  	"closed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "feedback_actions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"case_id" integer NOT NULL,
  	"action" "enum_feedback_actions_action" NOT NULL,
  	"note" varchar,
  	"from_status" varchar,
  	"to_status" varchar,
  	"performed_by_id" integer,
  	"public" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" varchar,
  	"keywords" varchar,
  	"active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_forms_fields_type" DEFAULT 'text' NOT NULL,
  	"required" boolean DEFAULT false,
  	"options" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"active" boolean DEFAULT true,
  	"success_message" varchar DEFAULT 'Thông tin đã được tiếp nhận.',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_code" varchar NOT NULL,
  	"form_id" integer NOT NULL,
  	"data" jsonb NOT NULL,
  	"status" "enum_form_submissions_status" DEFAULT 'new',
  	"internal_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chatbot_intents_phrases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_intents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"link_url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"priority" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chatbot_conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" "enum_chatbot_conversations_messages_from",
  	"text" varchar,
  	"at" timestamp(3) with time zone
  );
  
  CREATE TABLE "chatbot_conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"last_message_at" timestamp(3) with time zone,
  	"handoff_requested" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chatbot_unanswered" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"normalized_question" varchar NOT NULL,
  	"count" numeric DEFAULT 1,
  	"last_asked_at" timestamp(3) with time zone,
  	"resolved" boolean DEFAULT false,
  	"intent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"active" boolean DEFAULT true,
  	"current_version_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_template_versions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_id" integer NOT NULL,
  	"version_name" varchar NOT NULL,
  	"status" "enum_survey_template_versions_status" DEFAULT 'draft',
  	"locked_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_template_versions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"survey_questions_id" integer
  );
  
  CREATE TABLE "survey_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "survey_questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"question" varchar NOT NULL,
  	"type" "enum_survey_questions_type" DEFAULT 'rating5' NOT NULL,
  	"required" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"template_version_id" integer NOT NULL,
  	"department_id" integer,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone NOT NULL,
  	"active" boolean DEFAULT true,
  	"anonymous" boolean DEFAULT true,
  	"public_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"campaign_id" integer NOT NULL,
  	"department_id" integer,
  	"max_uses" numeric DEFAULT 1,
  	"used_count" numeric DEFAULT 0,
  	"expires_at" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_responses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"response_code" varchar NOT NULL,
  	"campaign_id" integer NOT NULL,
  	"template_version_id" integer NOT NULL,
  	"survey_code_id" integer,
  	"department_id" integer,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"overall_score" numeric,
  	"comment" varchar,
  	"locked" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_answers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"response_id" integer NOT NULL,
  	"question_id" integer NOT NULL,
  	"question_snapshot" varchar NOT NULL,
  	"value_text" varchar,
  	"score" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "survey_statistics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"campaign_id" integer NOT NULL,
  	"department_id" integer,
  	"response_count" numeric DEFAULT 0,
  	"average_score" numeric,
  	"satisfaction_rate" numeric,
  	"calculated_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from_path" varchar NOT NULL,
  	"to_path" varchar NOT NULL,
  	"source_collection" varchar,
  	"source_id" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "dynamic_modules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"eyebrow" varchar,
  	"description" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"button_label" varchar,
  	"button_url" varchar,
  	"active" boolean DEFAULT true,
  	"workflow_state" "enum_dynamic_modules_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_dynamic_modules_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_dynamic_modules_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_eyebrow" varchar,
  	"version_description" varchar,
  	"version_content" jsonb,
  	"version_image_id" integer,
  	"version_button_label" varchar,
  	"version_button_url" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_workflow_state" "enum__dynamic_modules_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__dynamic_modules_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "content_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"default_image_id" integer,
  	"active" boolean DEFAULT true,
  	"workflow_state" "enum_content_sections_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_content_sections_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_content_sections_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_default_image_id" integer,
  	"version_active" boolean DEFAULT true,
  	"version_workflow_state" "enum__content_sections_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__content_sections_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "custom_posts_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "custom_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_id" integer,
  	"title" varchar,
  	"slug" varchar,
  	"cover_id" integer,
  	"excerpt" varchar,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"pinned" boolean DEFAULT false,
  	"workflow_state" "enum_custom_posts_workflow_state" DEFAULT 'draft',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"exclude_from_sitemap" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_custom_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_custom_posts_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_custom_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_section_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_pinned" boolean DEFAULT false,
  	"version_workflow_state" "enum__custom_posts_v_version_workflow_state" DEFAULT 'draft',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_url" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__custom_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "import_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"module" "enum_import_jobs_module" DEFAULT 'services' NOT NULL,
  	"file_name" varchar NOT NULL,
  	"status" "enum_import_jobs_status" DEFAULT 'completed' NOT NULL,
  	"created_count" numeric DEFAULT 0,
  	"updated_count" numeric DEFAULT 0,
  	"skipped_count" numeric DEFAULT 0,
  	"error_count" numeric DEFAULT 0,
  	"errors" jsonb,
  	"imported_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"summary" varchar NOT NULL,
  	"action" "enum_audit_logs_action" NOT NULL,
  	"resource" varchar NOT NULL,
  	"document_id" varchar,
  	"actor_id" integer,
  	"actor_email" varchar,
  	"actor_role" varchar,
  	"ip" varchar,
  	"user_agent" varchar,
  	"changed_fields" jsonb,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"news_id" integer,
  	"notices_id" integer,
  	"procurement_id" integer,
  	"documents_id" integer,
  	"departments_id" integer,
  	"specialties_id" integer,
  	"doctors_id" integer,
  	"schedules_id" integer,
  	"services_id" integer,
  	"service_prices_id" integer,
  	"vaccinations_id" integer,
  	"vaccination_schedules_id" integer,
  	"vaccines_id" integer,
  	"vaccine_prices_id" integer,
  	"recruitment_id" integer,
  	"pages_id" integer,
  	"categories_id" integer,
  	"feedback_id" integer,
  	"consultations_id" integer,
  	"feedback_categories_id" integer,
  	"feedback_cases_id" integer,
  	"feedback_actions_id" integer,
  	"faqs_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"chatbot_intents_id" integer,
  	"chatbot_conversations_id" integer,
  	"chatbot_unanswered_id" integer,
  	"survey_templates_id" integer,
  	"survey_template_versions_id" integer,
  	"survey_questions_id" integer,
  	"survey_campaigns_id" integer,
  	"survey_codes_id" integer,
  	"survey_responses_id" integer,
  	"survey_answers_id" integer,
  	"survey_statistics_id" integer,
  	"redirects_id" integer,
  	"dynamic_modules_id" integer,
  	"content_sections_id" integer,
  	"custom_posts_id" integer,
  	"import_jobs_id" integer,
  	"audit_logs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_header_contact_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"href" varchar,
  	"extra_text" varchar,
  	"icon_type" varchar DEFAULT 'phone',
  	"custom_icon_id" integer,
  	"background" varchar DEFAULT '#FFFFFF',
  	"border_color" varchar DEFAULT '#E1E7EC',
  	"title_color" varchar DEFAULT '#273B4C',
  	"text_color" varchar DEFAULT '#0756B4',
  	"icon_color" varchar DEFAULT '#075EC2',
  	"icon_background" varchar DEFAULT '#EAF5FF',
  	"extra_text_color" varchar DEFAULT '#557082',
  	"title_font_size" numeric DEFAULT 10,
  	"text_font_size" numeric DEFAULT 17,
  	"font_weight" varchar DEFAULT '800'
  );
  
  CREATE TABLE "site_settings_header_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"platform" varchar NOT NULL,
  	"label" varchar,
  	"url" varchar NOT NULL,
  	"custom_icon_id" integer
  );
  
  CREATE TABLE "site_settings_website_assistant_quick_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_website_assistant_custom_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"keywords" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"link_url" varchar,
  	"open_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hospital_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai' NOT NULL,
  	"logo_id" integer,
  	"header_slogan" varchar DEFAULT 'Điều trị bằng trái tim - Chăm sóc bằng tấm lòng',
  	"header_show_slogan" boolean DEFAULT true,
  	"header_show_utility_bar" boolean DEFAULT true,
  	"header_show_search" boolean DEFAULT true,
  	"header_show_contact_cards" boolean DEFAULT true,
  	"header_sticky_menu" boolean DEFAULT true,
  	"header_utility_appearance_time_prefix" varchar DEFAULT '',
  	"header_utility_appearance_show_calendar_icon" boolean DEFAULT true,
  	"header_utility_appearance_background" varchar DEFAULT 'linear-gradient(90deg,#064a83,#0878d1)',
  	"header_utility_appearance_time_color" varchar DEFAULT '#FFFFFF',
  	"header_utility_appearance_time_font_size" numeric DEFAULT 13,
  	"header_utility_appearance_time_font_weight" varchar DEFAULT '700',
  	"header_brand_appearance_logo_size" numeric DEFAULT 66,
  	"header_brand_appearance_title_font_size" numeric DEFAULT 17,
  	"header_brand_appearance_subtitle_font_size" numeric DEFAULT 13,
  	"header_brand_appearance_header_background_color" varchar DEFAULT '#FFFFFF',
  	"header_brand_appearance_logo_background_color" varchar DEFAULT '#FFFFFF',
  	"header_brand_appearance_title_color" varchar DEFAULT '#143653',
  	"header_brand_appearance_subtitle_color" varchar DEFAULT '#0878D1',
  	"header_brand_appearance_show_logo" boolean DEFAULT true,
  	"header_brand_appearance_show_hospital_name" boolean DEFAULT true,
  	"header_brand_appearance_background_image_id" integer,
  	"header_brand_appearance_background_size" varchar DEFAULT 'cover',
  	"header_brand_appearance_background_position" varchar DEFAULT 'center center',
  	"header_brand_appearance_background_overlay" varchar DEFAULT 'rgba(255,255,255,0.88)',
  	"header_brand_appearance_min_height" numeric DEFAULT 110,
  	"tiktok_url" varchar,
  	"slogan" varchar,
  	"ticker_appearance_enabled" boolean DEFAULT true,
  	"ticker_appearance_background_color" varchar DEFAULT '#FF9F2F',
  	"ticker_appearance_text_color" varchar DEFAULT '#FFFFFF',
  	"ticker_appearance_font_size" numeric DEFAULT 13,
  	"ticker_appearance_duration" numeric DEFAULT 24,
  	"header_banner_id" integer,
  	"header_banner_width" numeric DEFAULT 1300,
  	"header_banner_height" numeric DEFAULT 200,
  	"favicon_id" integer,
  	"hotline" varchar,
  	"emergency_hotline" varchar,
  	"email" varchar,
  	"address" varchar,
  	"working_hours" varchar,
  	"medpro_url" varchar,
  	"zalo_url" varchar,
  	"facebook_url" varchar,
  	"youtube_url" varchar,
  	"google_maps_embed" varchar,
  	"footer_text" varchar,
  	"service_price_page_title" varchar DEFAULT 'Bảng giá dịch vụ',
  	"service_price_page_description" varchar DEFAULT 'Tra cứu giá BHYT và giá dịch vụ được cập nhật trực tiếp từ hệ thống quản trị.',
  	"service_price_page_search_placeholder" varchar DEFAULT 'Nhập tên, mã dịch vụ, nhóm hoặc ghi chú…',
  	"service_price_page_rows_per_page" "enum_site_settings_service_price_page_rows_per_page" DEFAULT '40' NOT NULL,
  	"service_price_page_search_notes" boolean DEFAULT true,
  	"service_price_page_empty_text" varchar DEFAULT 'Không tìm thấy dịch vụ phù hợp.',
  	"website_assistant_enabled" boolean DEFAULT true,
  	"website_assistant_back_to_top_enabled" boolean DEFAULT true,
  	"website_assistant_assistant_logo_id" integer,
  	"website_assistant_assistant_name" varchar DEFAULT 'Trợ lý Thới Lai',
  	"website_assistant_status_text" varchar DEFAULT 'Đang trực tuyến',
  	"website_assistant_greeting" varchar DEFAULT 'Xin chào! Tôi có thể giúp bạn tra cứu lịch khám, bảng giá, tiêm ngừa và thông tin bệnh viện.',
  	"website_assistant_input_placeholder" varchar DEFAULT 'Nhập nội dung cần hỏi…',
  	"website_assistant_notice_text" varchar DEFAULT 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.',
  	"website_assistant_primary_color" varchar DEFAULT '#0878D1',
  	"website_assistant_fallback_response" varchar DEFAULT 'Tôi chưa hiểu rõ câu hỏi. Bạn hãy chọn một mục gợi ý hoặc liên hệ trực tiếp với bệnh viện để được hỗ trợ.',
  	"website_assistant_fallback_link_label" varchar DEFAULT 'Liên hệ bệnh viện',
  	"website_assistant_fallback_link_url" varchar DEFAULT '/lien-he',
  	"brand_primary_color" varchar DEFAULT '#0878D1',
  	"brand_secondary_color" varchar DEFAULT '#FFFFFF',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_header_contact_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"href" varchar,
  	"extra_text" varchar,
  	"icon_type" varchar DEFAULT 'phone',
  	"custom_icon_id" integer,
  	"background" varchar DEFAULT '#FFFFFF',
  	"border_color" varchar DEFAULT '#E1E7EC',
  	"title_color" varchar DEFAULT '#273B4C',
  	"text_color" varchar DEFAULT '#0756B4',
  	"icon_color" varchar DEFAULT '#075EC2',
  	"icon_background" varchar DEFAULT '#EAF5FF',
  	"extra_text_color" varchar DEFAULT '#557082',
  	"title_font_size" numeric DEFAULT 10,
  	"text_font_size" numeric DEFAULT 17,
  	"font_weight" varchar DEFAULT '800',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_header_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"platform" varchar NOT NULL,
  	"label" varchar,
  	"url" varchar NOT NULL,
  	"custom_icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_website_assistant_quick_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_website_assistant_custom_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"keywords" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"link_label" varchar,
  	"link_url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hospital_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai' NOT NULL,
  	"version_logo_id" integer,
  	"version_header_slogan" varchar DEFAULT 'Điều trị bằng trái tim - Chăm sóc bằng tấm lòng',
  	"version_header_show_slogan" boolean DEFAULT true,
  	"version_header_show_utility_bar" boolean DEFAULT true,
  	"version_header_show_search" boolean DEFAULT true,
  	"version_header_show_contact_cards" boolean DEFAULT true,
  	"version_header_sticky_menu" boolean DEFAULT true,
  	"version_header_utility_appearance_time_prefix" varchar DEFAULT '',
  	"version_header_utility_appearance_show_calendar_icon" boolean DEFAULT true,
  	"version_header_utility_appearance_background" varchar DEFAULT 'linear-gradient(90deg,#064a83,#0878d1)',
  	"version_header_utility_appearance_time_color" varchar DEFAULT '#FFFFFF',
  	"version_header_utility_appearance_time_font_size" numeric DEFAULT 13,
  	"version_header_utility_appearance_time_font_weight" varchar DEFAULT '700',
  	"version_header_brand_appearance_logo_size" numeric DEFAULT 66,
  	"version_header_brand_appearance_title_font_size" numeric DEFAULT 17,
  	"version_header_brand_appearance_subtitle_font_size" numeric DEFAULT 13,
  	"version_header_brand_appearance_header_background_color" varchar DEFAULT '#FFFFFF',
  	"version_header_brand_appearance_logo_background_color" varchar DEFAULT '#FFFFFF',
  	"version_header_brand_appearance_title_color" varchar DEFAULT '#143653',
  	"version_header_brand_appearance_subtitle_color" varchar DEFAULT '#0878D1',
  	"version_header_brand_appearance_show_logo" boolean DEFAULT true,
  	"version_header_brand_appearance_show_hospital_name" boolean DEFAULT true,
  	"version_header_brand_appearance_background_image_id" integer,
  	"version_header_brand_appearance_background_size" varchar DEFAULT 'cover',
  	"version_header_brand_appearance_background_position" varchar DEFAULT 'center center',
  	"version_header_brand_appearance_background_overlay" varchar DEFAULT 'rgba(255,255,255,0.88)',
  	"version_header_brand_appearance_min_height" numeric DEFAULT 110,
  	"version_tiktok_url" varchar,
  	"version_slogan" varchar,
  	"version_ticker_appearance_enabled" boolean DEFAULT true,
  	"version_ticker_appearance_background_color" varchar DEFAULT '#FF9F2F',
  	"version_ticker_appearance_text_color" varchar DEFAULT '#FFFFFF',
  	"version_ticker_appearance_font_size" numeric DEFAULT 13,
  	"version_ticker_appearance_duration" numeric DEFAULT 24,
  	"version_header_banner_id" integer,
  	"version_header_banner_width" numeric DEFAULT 1300,
  	"version_header_banner_height" numeric DEFAULT 200,
  	"version_favicon_id" integer,
  	"version_hotline" varchar,
  	"version_emergency_hotline" varchar,
  	"version_email" varchar,
  	"version_address" varchar,
  	"version_working_hours" varchar,
  	"version_medpro_url" varchar,
  	"version_zalo_url" varchar,
  	"version_facebook_url" varchar,
  	"version_youtube_url" varchar,
  	"version_google_maps_embed" varchar,
  	"version_footer_text" varchar,
  	"version_service_price_page_title" varchar DEFAULT 'Bảng giá dịch vụ',
  	"version_service_price_page_description" varchar DEFAULT 'Tra cứu giá BHYT và giá dịch vụ được cập nhật trực tiếp từ hệ thống quản trị.',
  	"version_service_price_page_search_placeholder" varchar DEFAULT 'Nhập tên, mã dịch vụ, nhóm hoặc ghi chú…',
  	"version_service_price_page_rows_per_page" "enum__site_settings_v_version_service_price_page_rows_per_page" DEFAULT '40' NOT NULL,
  	"version_service_price_page_search_notes" boolean DEFAULT true,
  	"version_service_price_page_empty_text" varchar DEFAULT 'Không tìm thấy dịch vụ phù hợp.',
  	"version_website_assistant_enabled" boolean DEFAULT true,
  	"version_website_assistant_back_to_top_enabled" boolean DEFAULT true,
  	"version_website_assistant_assistant_logo_id" integer,
  	"version_website_assistant_assistant_name" varchar DEFAULT 'Trợ lý Thới Lai',
  	"version_website_assistant_status_text" varchar DEFAULT 'Đang trực tuyến',
  	"version_website_assistant_greeting" varchar DEFAULT 'Xin chào! Tôi có thể giúp bạn tra cứu lịch khám, bảng giá, tiêm ngừa và thông tin bệnh viện.',
  	"version_website_assistant_input_placeholder" varchar DEFAULT 'Nhập nội dung cần hỏi…',
  	"version_website_assistant_notice_text" varchar DEFAULT 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.',
  	"version_website_assistant_primary_color" varchar DEFAULT '#0878D1',
  	"version_website_assistant_fallback_response" varchar DEFAULT 'Tôi chưa hiểu rõ câu hỏi. Bạn hãy chọn một mục gợi ý hoặc liên hệ trực tiếp với bệnh viện để được hỗ trợ.',
  	"version_website_assistant_fallback_link_label" varchar DEFAULT 'Liên hệ bệnh viện',
  	"version_website_assistant_fallback_link_url" varchar DEFAULT '/lien-he',
  	"version_brand_primary_color" varchar DEFAULT '#0878D1',
  	"version_brand_secondary_color" varchar DEFAULT '#FFFFFF',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_items_children_link_type" DEFAULT 'preset' NOT NULL,
  	"url" varchar,
  	"preset" "enum_navigation_items_children_preset",
  	"content_section_id" integer,
  	"new_section_title" varchar,
  	"new_section_slug" varchar,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"custom_url" varchar,
  	"icon" varchar,
  	"description" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_items_link_type" DEFAULT 'preset' NOT NULL,
  	"url" varchar,
  	"preset" "enum_navigation_items_preset",
  	"content_section_id" integer,
  	"new_section_title" varchar,
  	"new_section_slug" varchar,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"custom_url" varchar,
  	"icon" varchar,
  	"description" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"notices_id" integer,
  	"procurement_id" integer,
  	"recruitment_id" integer,
  	"documents_id" integer,
  	"departments_id" integer,
  	"specialties_id" integer,
  	"doctors_id" integer
  );
  
  CREATE TABLE "_navigation_v_version_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum__navigation_v_version_items_children_link_type" DEFAULT 'preset' NOT NULL,
  	"url" varchar,
  	"preset" "enum__navigation_v_version_items_children_preset",
  	"content_section_id" integer,
  	"new_section_title" varchar,
  	"new_section_slug" varchar,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"custom_url" varchar,
  	"icon" varchar,
  	"description" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum__navigation_v_version_items_link_type" DEFAULT 'preset' NOT NULL,
  	"url" varchar,
  	"preset" "enum__navigation_v_version_items_preset",
  	"content_section_id" integer,
  	"new_section_title" varchar,
  	"new_section_slug" varchar,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"custom_url" varchar,
  	"icon" varchar,
  	"description" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_navigation_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"notices_id" integer,
  	"procurement_id" integer,
  	"recruitment_id" integer,
  	"documents_id" integer,
  	"departments_id" integer,
  	"specialties_id" integer,
  	"doctors_id" integer
  );
  
  CREATE TABLE "header_contact_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar DEFAULT 'TỔNG ĐÀI HỖ TRỢ' NOT NULL,
  	"text" varchar NOT NULL,
  	"href" varchar,
  	"extra_text" varchar,
  	"icon_type" "enum_header_contact_cards_icon_type" DEFAULT 'phone',
  	"custom_icon_id" integer,
  	"background" varchar DEFAULT '#ffffff',
  	"border_color" varchar DEFAULT '#e1e7ec',
  	"title_color" varchar DEFAULT '#273b4c',
  	"text_color" varchar DEFAULT '#0756b4',
  	"extra_text_color" varchar DEFAULT '#557082',
  	"icon_color" varchar DEFAULT '#075ec2',
  	"icon_background" varchar DEFAULT '#eaf5ff',
  	"title_font_size" numeric DEFAULT 10,
  	"text_font_size" numeric DEFAULT 17,
  	"font_weight" "enum_header_contact_cards_font_weight" DEFAULT '800'
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"logo_id" integer,
  	"hospital_name" varchar DEFAULT 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI',
  	"slogan" varchar DEFAULT 'Tận tâm - Chất lượng - An toàn',
  	"show_slogan" boolean DEFAULT true,
  	"show_utility_bar" boolean DEFAULT true,
  	"show_search" boolean DEFAULT true,
  	"show_hotline" boolean DEFAULT true,
  	"sticky_menu" boolean DEFAULT true,
  	"utility_appearance_time_prefix" varchar DEFAULT '',
  	"utility_appearance_show_calendar_icon" boolean DEFAULT true,
  	"utility_appearance_background" varchar DEFAULT 'linear-gradient(90deg,#064a83,#0878d1)',
  	"utility_appearance_time_background" varchar DEFAULT 'rgba(255,255,255,.14)',
  	"utility_appearance_time_color" varchar DEFAULT '#ffffff',
  	"utility_appearance_time_font_size" numeric DEFAULT 13,
  	"utility_appearance_time_font_weight" "enum_header_utility_appearance_time_font_weight" DEFAULT '800',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_header_v_version_contact_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar DEFAULT 'TỔNG ĐÀI HỖ TRỢ' NOT NULL,
  	"text" varchar NOT NULL,
  	"href" varchar,
  	"extra_text" varchar,
  	"icon_type" "enum__header_v_version_contact_cards_icon_type" DEFAULT 'phone',
  	"custom_icon_id" integer,
  	"background" varchar DEFAULT '#ffffff',
  	"border_color" varchar DEFAULT '#e1e7ec',
  	"title_color" varchar DEFAULT '#273b4c',
  	"text_color" varchar DEFAULT '#0756b4',
  	"extra_text_color" varchar DEFAULT '#557082',
  	"icon_color" varchar DEFAULT '#075ec2',
  	"icon_background" varchar DEFAULT '#eaf5ff',
  	"title_font_size" numeric DEFAULT 10,
  	"text_font_size" numeric DEFAULT 17,
  	"font_weight" "enum__header_v_version_contact_cards_font_weight" DEFAULT '800',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_logo_id" integer,
  	"version_hospital_name" varchar DEFAULT 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI',
  	"version_slogan" varchar DEFAULT 'Tận tâm - Chất lượng - An toàn',
  	"version_show_slogan" boolean DEFAULT true,
  	"version_show_utility_bar" boolean DEFAULT true,
  	"version_show_search" boolean DEFAULT true,
  	"version_show_hotline" boolean DEFAULT true,
  	"version_sticky_menu" boolean DEFAULT true,
  	"version_utility_appearance_time_prefix" varchar DEFAULT '',
  	"version_utility_appearance_show_calendar_icon" boolean DEFAULT true,
  	"version_utility_appearance_background" varchar DEFAULT 'linear-gradient(90deg,#064a83,#0878d1)',
  	"version_utility_appearance_time_background" varchar DEFAULT 'rgba(255,255,255,.14)',
  	"version_utility_appearance_time_color" varchar DEFAULT '#ffffff',
  	"version_utility_appearance_time_font_size" numeric DEFAULT 13,
  	"version_utility_appearance_time_font_weight" "enum__header_v_version_utility_appearance_time_font_weight" DEFAULT '800',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"label" varchar NOT NULL,
  	"link_mode" "enum_footer_columns_links_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"open_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"brand_options_show_logo" boolean DEFAULT true,
  	"brand_options_show_hospital_name" boolean DEFAULT true,
  	"brand_options_show_address" boolean DEFAULT true,
  	"brand_options_show_phone" boolean DEFAULT true,
  	"brand_options_show_emergency_hotline" boolean DEFAULT true,
  	"brand_options_show_email" boolean DEFAULT true,
  	"brand_options_show_working_hours" boolean DEFAULT true,
  	"brand_options_show_description" boolean DEFAULT true,
  	"description" varchar,
  	"show_social" boolean DEFAULT true,
  	"bottom_show_copyright" boolean DEFAULT true,
  	"bottom_copyright" varchar DEFAULT '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai',
  	"bottom_show_right_text" boolean DEFAULT true,
  	"bottom_right_text" varchar DEFAULT 'Cổng thông tin điện tử',
  	"show_mobile_bar" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_v_version_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"label" varchar NOT NULL,
  	"link_mode" "enum__footer_v_version_columns_links_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_brand_options_show_logo" boolean DEFAULT true,
  	"version_brand_options_show_hospital_name" boolean DEFAULT true,
  	"version_brand_options_show_address" boolean DEFAULT true,
  	"version_brand_options_show_phone" boolean DEFAULT true,
  	"version_brand_options_show_emergency_hotline" boolean DEFAULT true,
  	"version_brand_options_show_email" boolean DEFAULT true,
  	"version_brand_options_show_working_hours" boolean DEFAULT true,
  	"version_brand_options_show_description" boolean DEFAULT true,
  	"version_description" varchar,
  	"version_show_social" boolean DEFAULT true,
  	"version_bottom_show_copyright" boolean DEFAULT true,
  	"version_bottom_copyright" varchar DEFAULT '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai',
  	"version_bottom_show_right_text" boolean DEFAULT true,
  	"version_bottom_right_text" varchar DEFAULT 'Cổng thông tin điện tử',
  	"version_show_mobile_bar" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"address" varchar,
  	"hotline" varchar,
  	"emergency_hotline" varchar,
  	"email" varchar,
  	"working_hours" varchar,
  	"google_maps_url" varchar,
  	"google_maps_embed" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_address" varchar,
  	"version_hotline" varchar,
  	"version_emergency_hotline" varchar,
  	"version_email" varchar,
  	"version_working_hours" varchar,
  	"version_google_maps_url" varchar,
  	"version_google_maps_embed" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"facebook_url" varchar,
  	"zalo_url" varchar,
  	"youtube_url" varchar,
  	"tiktok_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_social_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_facebook_url" varchar,
  	"version_zalo_url" varchar,
  	"version_youtube_url" varchar,
  	"version_tiktok_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medpro_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"url" varchar,
  	"label" varchar DEFAULT 'Đặt lịch khám',
  	"open_new_tab" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_medpro_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_url" varchar,
  	"version_label" varchar DEFAULT 'Đặt lịch khám',
  	"version_open_new_tab" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "theme_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_color" varchar DEFAULT '#0878D1',
  	"secondary_color" varchar DEFAULT '#0754A8',
  	"accent_color" varchar DEFAULT '#16A36A',
  	"font_family" "enum_theme_settings_font_family" DEFAULT 'system',
  	"base_font_size" numeric DEFAULT 16,
  	"font_scale" numeric DEFAULT 115,
  	"content_max_width" numeric DEFAULT 1300,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_theme_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_primary_color" varchar DEFAULT '#0878D1',
  	"version_secondary_color" varchar DEFAULT '#0754A8',
  	"version_accent_color" varchar DEFAULT '#16A36A',
  	"version_font_family" "enum__theme_settings_v_version_font_family" DEFAULT 'system',
  	"version_base_font_size" numeric DEFAULT 16,
  	"version_font_scale" numeric DEFAULT 115,
  	"version_content_max_width" numeric DEFAULT 1300,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_banners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"desktop_image_id" integer,
  	"mobile_image_id" integer,
  	"button_label" varchar,
  	"button_url" varchar,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "homepage_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"visual_mode" "enum_homepage_quick_links_visual_mode" DEFAULT 'icon',
  	"icon" "enum_homepage_quick_links_icon" DEFAULT 'calendar',
  	"image_id" integer,
  	"image_fit" "enum_homepage_quick_links_image_fit" DEFAULT 'contain'
  );
  
  CREATE TABLE "homepage_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "content_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "news_manual" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum_news_manual_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "content_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "dept_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "dept_manual" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum_dept_manual_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "dept_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "schedule_manual" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum_schedule_manual_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_sections_schedule_tab_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tab" "enum_homepage_sections_schedule_tab_order_tab",
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "vaccine_manual" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum_vaccine_manual_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_sections_vaccination_tab_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tab" "enum_homepage_sections_vaccination_tab_order_tab",
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "homepage_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_homepage_sections_type",
  	"visible" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"carousel_seconds" numeric DEFAULT 4.5,
  	"featured_item_limit" numeric DEFAULT 16,
  	"organization_image_id" integer,
  	"organization_medpro_enabled" boolean DEFAULT true,
  	"organization_medpro_eyebrow" varchar DEFAULT 'ĐẶT LỊCH KHÁM QUA MEDPRO',
  	"organization_medpro_title" varchar DEFAULT 'Chủ động thời gian – Giảm thời gian chờ đợi',
  	"organization_medpro_bullet1" varchar DEFAULT 'Đặt lịch nhanh chóng',
  	"organization_medpro_bullet2" varchar DEFAULT 'Chọn bác sĩ theo nhu cầu',
  	"organization_medpro_bullet3" varchar DEFAULT 'Nhận nhắc hẹn tự động',
  	"organization_medpro_brand_text" varchar DEFAULT 'Medpro',
  	"organization_medpro_button_label" varchar DEFAULT 'ĐẶT LỊCH NGAY',
  	"organization_medpro_button_url" varchar,
  	"organization_medpro_open_new_tab" boolean DEFAULT true,
  	"organization_medpro_guide_label" varchar DEFAULT 'Hướng dẫn đặt lịch khám',
  	"organization_medpro_guide_url" varchar DEFAULT '/lich-kham',
  	"organization_medpro_background_color" varchar,
  	"linked_content_section_id" integer,
  	"linked_content_limit" numeric DEFAULT 5,
  	"dynamic_module_id" integer,
  	"custom_content" jsonb,
  	"custom_image_id" integer,
  	"image_position" "enum_homepage_sections_image_position" DEFAULT 'left',
  	"button_label" varchar,
  	"button_link_mode" "enum_homepage_sections_button_link_mode" DEFAULT 'internal',
  	"button_page_id" integer,
  	"button_new_page_title" varchar,
  	"button_new_page_slug" varchar,
  	"button_url" varchar,
  	"eyebrow_color" varchar,
  	"title_color" varchar,
  	"description_color" varchar,
  	"background_color" varchar,
  	"eyebrow_size" numeric,
  	"title_size" numeric,
  	"description_size" numeric,
  	"padding_top" numeric DEFAULT 42,
  	"padding_bottom" numeric DEFAULT 42,
  	"content_width" numeric DEFAULT 1180,
  	"heading_gap" numeric DEFAULT 18
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI',
  	"hero_title" varchar DEFAULT 'Chăm sóc sức khỏe tận tâm, thuận tiện và an toàn',
  	"hero_description" varchar,
  	"hero_desktop_image_id" integer,
  	"hero_mobile_image_id" integer,
  	"show_hero_banners" boolean DEFAULT true,
  	"banner_autoplay_seconds" numeric DEFAULT 6,
  	"intro_eyebrow" varchar DEFAULT 'VỀ CHÚNG TÔI',
  	"intro_title" varchar DEFAULT 'Đồng hành cùng sức khỏe cộng đồng',
  	"intro_description" varchar,
  	"intro_image_id" integer,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_homepage_v_version_banners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"desktop_image_id" integer,
  	"mobile_image_id" integer,
  	"button_label" varchar,
  	"button_url" varchar,
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"visual_mode" "enum__homepage_v_version_quick_links_visual_mode" DEFAULT 'icon',
  	"icon" "enum__homepage_v_version_quick_links_icon" DEFAULT 'calendar',
  	"image_id" integer,
  	"image_fit" "enum__homepage_v_version_quick_links_image_fit" DEFAULT 'contain',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_values_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_manual_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum__news_manual_v_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_tabs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_dept_values_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_dept_manual_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum__dept_manual_v_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_dept_tabs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_schedule_manual_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum__schedule_manual_v_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_sections_schedule_tab_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tab" "enum__homepage_v_version_sections_schedule_tab_order_tab",
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vaccine_manual_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum__vaccine_manual_v_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_sections_vaccination_tab_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tab" "enum__homepage_v_version_sections_vaccination_tab_order_tab",
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__homepage_v_version_sections_type",
  	"visible" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"carousel_seconds" numeric DEFAULT 4.5,
  	"featured_item_limit" numeric DEFAULT 16,
  	"organization_image_id" integer,
  	"organization_medpro_enabled" boolean DEFAULT true,
  	"organization_medpro_eyebrow" varchar DEFAULT 'ĐẶT LỊCH KHÁM QUA MEDPRO',
  	"organization_medpro_title" varchar DEFAULT 'Chủ động thời gian – Giảm thời gian chờ đợi',
  	"organization_medpro_bullet1" varchar DEFAULT 'Đặt lịch nhanh chóng',
  	"organization_medpro_bullet2" varchar DEFAULT 'Chọn bác sĩ theo nhu cầu',
  	"organization_medpro_bullet3" varchar DEFAULT 'Nhận nhắc hẹn tự động',
  	"organization_medpro_brand_text" varchar DEFAULT 'Medpro',
  	"organization_medpro_button_label" varchar DEFAULT 'ĐẶT LỊCH NGAY',
  	"organization_medpro_button_url" varchar,
  	"organization_medpro_open_new_tab" boolean DEFAULT true,
  	"organization_medpro_guide_label" varchar DEFAULT 'Hướng dẫn đặt lịch khám',
  	"organization_medpro_guide_url" varchar DEFAULT '/lich-kham',
  	"organization_medpro_background_color" varchar,
  	"linked_content_section_id" integer,
  	"linked_content_limit" numeric DEFAULT 5,
  	"dynamic_module_id" integer,
  	"custom_content" jsonb,
  	"custom_image_id" integer,
  	"image_position" "enum__homepage_v_version_sections_image_position" DEFAULT 'left',
  	"button_label" varchar,
  	"button_link_mode" "enum__homepage_v_version_sections_button_link_mode" DEFAULT 'internal',
  	"button_page_id" integer,
  	"button_new_page_title" varchar,
  	"button_new_page_slug" varchar,
  	"button_url" varchar,
  	"eyebrow_color" varchar,
  	"title_color" varchar,
  	"description_color" varchar,
  	"background_color" varchar,
  	"eyebrow_size" numeric,
  	"title_size" numeric,
  	"description_size" numeric,
  	"padding_top" numeric DEFAULT 42,
  	"padding_bottom" numeric DEFAULT 42,
  	"content_width" numeric DEFAULT 1180,
  	"heading_gap" numeric DEFAULT 18,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI',
  	"version_hero_title" varchar DEFAULT 'Chăm sóc sức khỏe tận tâm, thuận tiện và an toàn',
  	"version_hero_description" varchar,
  	"version_hero_desktop_image_id" integer,
  	"version_hero_mobile_image_id" integer,
  	"version_show_hero_banners" boolean DEFAULT true,
  	"version_banner_autoplay_seconds" numeric DEFAULT 6,
  	"version_intro_eyebrow" varchar DEFAULT 'VỀ CHÚNG TÔI',
  	"version_intro_title" varchar DEFAULT 'Đồng hành cùng sức khỏe cộng đồng',
  	"version_intro_description" varchar,
  	"version_intro_image_id" integer,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "organization_chart_deputy_directors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"photo_id" integer,
  	"responsibility" varchar
  );
  
  CREATE TABLE "organization_chart_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"unit_id" integer NOT NULL
  );
  
  CREATE TABLE "organization_chart_departments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"unit_id" integer NOT NULL
  );
  
  CREATE TABLE "organization_chart" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_title" varchar DEFAULT 'Sơ đồ tổ chức Bệnh viện Đa khoa Khu vực Thới Lai' NOT NULL,
  	"description" varchar DEFAULT 'Cơ cấu tổ chức và hệ thống các khoa, phòng trực thuộc bệnh viện.',
  	"director_name" varchar NOT NULL,
  	"director_title" varchar NOT NULL,
  	"director_photo_id" integer,
  	"director_responsibility" varchar,
  	"appearance_primary_color" varchar DEFAULT '#0878D1',
  	"appearance_director_color" varchar DEFAULT '#075B9E',
  	"appearance_deputy_color" varchar DEFAULT '#0B84D8',
  	"appearance_office_color" varchar DEFAULT '#188B72',
  	"appearance_department_color" varchar DEFAULT '#6B62C8',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_organization_chart_v_version_deputy_directors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"photo_id" integer,
  	"responsibility" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_organization_chart_v_version_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_organization_chart_v_version_departments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_organization_chart_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_page_title" varchar DEFAULT 'Sơ đồ tổ chức Bệnh viện Đa khoa Khu vực Thới Lai' NOT NULL,
  	"version_description" varchar DEFAULT 'Cơ cấu tổ chức và hệ thống các khoa, phòng trực thuộc bệnh viện.',
  	"version_director_name" varchar NOT NULL,
  	"version_director_title" varchar NOT NULL,
  	"version_director_photo_id" integer,
  	"version_director_responsibility" varchar,
  	"version_appearance_primary_color" varchar DEFAULT '#0878D1',
  	"version_appearance_director_color" varchar DEFAULT '#075B9E',
  	"version_appearance_deputy_color" varchar DEFAULT '#0B84D8',
  	"version_appearance_office_color" varchar DEFAULT '#188B72',
  	"version_appearance_department_color" varchar DEFAULT '#6B62C8',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "upload_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_max_m_b" numeric DEFAULT 15 NOT NULL,
  	"schedule_image_max_m_b" numeric DEFAULT 20 NOT NULL,
  	"pdf_max_m_b" numeric DEFAULT 50 NOT NULL,
  	"word_max_m_b" numeric DEFAULT 20 NOT NULL,
  	"excel_max_m_b" numeric DEFAULT 20 NOT NULL,
  	"power_point_max_m_b" numeric DEFAULT 50 NOT NULL,
  	"batch_max_m_b" numeric DEFAULT 100 NOT NULL,
  	"batch_max_files" numeric DEFAULT 20 NOT NULL,
  	"warning_percent" numeric DEFAULT 80 NOT NULL,
  	"block_percent" numeric DEFAULT 95 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "default_media_settings_custom_defaults" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "default_media_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"news_id" integer,
  	"notices_id" integer,
  	"procurement_id" integer,
  	"recruitment_id" integer,
  	"documents_id" integer,
  	"schedules_id" integer,
  	"vaccinations_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_settings_robots_disallow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE "seo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"default_title" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"title_template" varchar DEFAULT '%s | BVĐK Khu vực Thới Lai',
  	"default_description" varchar DEFAULT 'Cổng thông tin Bệnh viện Đa khoa Khu vực Thới Lai.',
  	"default_image_id" integer,
  	"allow_indexing" boolean DEFAULT true,
  	"enable_sitemap" boolean DEFAULT true,
  	"google_site_verification" varchar,
  	"organization_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"_status" "enum_seo_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_seo_settings_v_version_robots_disallow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_seo_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_site_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"version_default_title" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"version_title_template" varchar DEFAULT '%s | BVĐK Khu vực Thới Lai',
  	"version_default_description" varchar DEFAULT 'Cổng thông tin Bệnh viện Đa khoa Khu vực Thới Lai.',
  	"version_default_image_id" integer,
  	"version_allow_indexing" boolean DEFAULT true,
  	"version_enable_sitemap" boolean DEFAULT true,
  	"version_google_site_verification" varchar,
  	"version_organization_name" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"version__status" "enum__seo_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "chatbot_settings_quick_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "chatbot_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"assistant_name" varchar DEFAULT 'Trợ lý Thới Lai',
  	"status_text" varchar DEFAULT 'Đang trực tuyến',
  	"greeting" varchar,
  	"input_placeholder" varchar DEFAULT 'Nhập nội dung cần hỏi…',
  	"fallback_response" varchar DEFAULT 'Tôi chưa tìm thấy câu trả lời phù hợp. Bạn có thể gửi câu hỏi cho tư vấn viên.',
  	"handoff_enabled" boolean DEFAULT true,
  	"log_conversations" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "system_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"maintenance_mode" boolean DEFAULT false,
  	"maintenance_message" varchar DEFAULT 'Hệ thống đang được bảo trì. Vui lòng quay lại sau.',
  	"audit_retention_days" numeric DEFAULT 730,
  	"backup_retention_days" numeric DEFAULT 30,
  	"health_storage_probe" boolean DEFAULT true,
  	"production_checklist_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "schedule_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefer_weekly_image" boolean DEFAULT true,
  	"show_daily_tab" boolean DEFAULT true,
  	"show_weekly_tab" boolean DEFAULT true,
  	"show_attachment_tab" boolean DEFAULT true,
  	"cache_minutes" numeric DEFAULT 5,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "quick_links_settings_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum_quick_links_settings_items_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"visual_mode" "enum_quick_links_settings_items_visual_mode" DEFAULT 'icon',
  	"icon" "enum_quick_links_settings_items_icon" DEFAULT 'calendar',
  	"image_id" integer,
  	"image_fit" "enum_quick_links_settings_items_image_fit" DEFAULT 'contain'
  );
  
  CREATE TABLE "quick_links_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"_status" "enum_quick_links_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_quick_links_settings_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"link_mode" "enum__quick_links_settings_v_version_items_link_mode" DEFAULT 'internal',
  	"linked_page_id" integer,
  	"new_page_title" varchar,
  	"new_page_slug" varchar,
  	"url" varchar,
  	"open_new_tab" boolean DEFAULT false,
  	"visual_mode" "enum__quick_links_settings_v_version_items_visual_mode" DEFAULT 'icon',
  	"icon" "enum__quick_links_settings_v_version_items_icon" DEFAULT 'calendar',
  	"image_id" integer,
  	"image_fit" "enum__quick_links_settings_v_version_items_image_fit" DEFAULT 'contain',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_quick_links_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version__status" "enum__quick_links_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "users_permissions_actions" ADD CONSTRAINT "users_permissions_actions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users_permissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_duplicate_of_id_media_id_fk" FOREIGN KEY ("duplicate_of_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_attachments" ADD CONSTRAINT "news_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_attachments" ADD CONSTRAINT "news_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_attachments" ADD CONSTRAINT "_news_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_attachments" ADD CONSTRAINT "_news_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_category_ref_id_categories_id_fk" FOREIGN KEY ("version_category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notices_attachments" ADD CONSTRAINT "notices_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notices_attachments" ADD CONSTRAINT "notices_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "notices" ADD CONSTRAINT "notices_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notices" ADD CONSTRAINT "notices_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notices" ADD CONSTRAINT "notices_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v_version_attachments" ADD CONSTRAINT "_notices_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v_version_attachments" ADD CONSTRAINT "_notices_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_notices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_parent_id_notices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_version_category_ref_id_categories_id_fk" FOREIGN KEY ("version_category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "procurement_attachments" ADD CONSTRAINT "procurement_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "procurement_attachments" ADD CONSTRAINT "procurement_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."procurement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "procurement_change_log" ADD CONSTRAINT "procurement_change_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."procurement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "procurement" ADD CONSTRAINT "procurement_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "procurement" ADD CONSTRAINT "procurement_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "procurement" ADD CONSTRAINT "procurement_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_procurement_v_version_attachments" ADD CONSTRAINT "_procurement_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_procurement_v_version_attachments" ADD CONSTRAINT "_procurement_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_procurement_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_procurement_v_version_change_log" ADD CONSTRAINT "_procurement_v_version_change_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_procurement_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_procurement_v" ADD CONSTRAINT "_procurement_v_parent_id_procurement_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."procurement"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_procurement_v" ADD CONSTRAINT "_procurement_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_procurement_v" ADD CONSTRAINT "_procurement_v_version_category_ref_id_categories_id_fk" FOREIGN KEY ("version_category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_procurement_v" ADD CONSTRAINT "_procurement_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_parent_id_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_version_category_ref_id_categories_id_fk" FOREIGN KEY ("version_category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_documents_v" ADD CONSTRAINT "_documents_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_deputy_leaders" ADD CONSTRAINT "departments_deputy_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_gallery" ADD CONSTRAINT "departments_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_gallery" ADD CONSTRAINT "departments_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_departments_v_version_deputy_leaders" ADD CONSTRAINT "_departments_v_version_deputy_leaders_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_departments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_departments_v_version_gallery" ADD CONSTRAINT "_departments_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_departments_v_version_gallery" ADD CONSTRAINT "_departments_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_departments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_departments_v" ADD CONSTRAINT "_departments_v_parent_id_departments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_departments_v" ADD CONSTRAINT "_departments_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_departments_v" ADD CONSTRAINT "_departments_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "specialties" ADD CONSTRAINT "specialties_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "specialties" ADD CONSTRAINT "specialties_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "specialties" ADD CONSTRAINT "specialties_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialties_v" ADD CONSTRAINT "_specialties_v_parent_id_specialties_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialties_v" ADD CONSTRAINT "_specialties_v_version_department_id_departments_id_fk" FOREIGN KEY ("version_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialties_v" ADD CONSTRAINT "_specialties_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_specialties_v" ADD CONSTRAINT "_specialties_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialty_ref_id_specialties_id_fk" FOREIGN KEY ("specialty_ref_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_parent_id_doctors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_department_id_departments_id_fk" FOREIGN KEY ("version_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_specialty_ref_id_specialties_id_fk" FOREIGN KEY ("version_specialty_ref_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules_weekly_slots" ADD CONSTRAINT "schedules_weekly_slots_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules_weekly_slots" ADD CONSTRAINT "schedules_weekly_slots_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules_weekly_slots" ADD CONSTRAINT "schedules_weekly_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schedules_attachment_files" ADD CONSTRAINT "schedules_attachment_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules_attachment_files" ADD CONSTRAINT "schedules_attachment_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schedules" ADD CONSTRAINT "schedules_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules" ADD CONSTRAINT "schedules_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules" ADD CONSTRAINT "schedules_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules" ADD CONSTRAINT "schedules_schedule_image_id_media_id_fk" FOREIGN KEY ("schedule_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedules" ADD CONSTRAINT "schedules_schedule_file_id_media_id_fk" FOREIGN KEY ("schedule_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_prices_v" ADD CONSTRAINT "_service_prices_v_parent_id_service_prices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_prices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_prices_v" ADD CONSTRAINT "_service_prices_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_announcement_image_id_media_id_fk" FOREIGN KEY ("announcement_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_announcement_file_id_media_id_fk" FOREIGN KEY ("announcement_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_campaign_image_id_media_id_fk" FOREIGN KEY ("campaign_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_vaccine_image_id_media_id_fk" FOREIGN KEY ("vaccine_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccination_schedules" ADD CONSTRAINT "vaccination_schedules_schedule_image_id_media_id_fk" FOREIGN KEY ("schedule_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccination_schedules" ADD CONSTRAINT "vaccination_schedules_schedule_file_id_media_id_fk" FOREIGN KEY ("schedule_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccination_schedules_v" ADD CONSTRAINT "_vaccination_schedules_v_parent_id_vaccination_schedules_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vaccination_schedules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccination_schedules_v" ADD CONSTRAINT "_vaccination_schedules_v_version_schedule_image_id_media_id_fk" FOREIGN KEY ("version_schedule_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccination_schedules_v" ADD CONSTRAINT "_vaccination_schedules_v_version_schedule_file_id_media_id_fk" FOREIGN KEY ("version_schedule_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccines_v" ADD CONSTRAINT "_vaccines_v_parent_id_vaccines_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vaccines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccines_v" ADD CONSTRAINT "_vaccines_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccine_prices" ADD CONSTRAINT "vaccine_prices_vaccine_id_vaccines_id_fk" FOREIGN KEY ("vaccine_id") REFERENCES "public"."vaccines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccine_prices_v" ADD CONSTRAINT "_vaccine_prices_v_parent_id_vaccine_prices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vaccine_prices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccine_prices_v" ADD CONSTRAINT "_vaccine_prices_v_version_vaccine_id_vaccines_id_fk" FOREIGN KEY ("version_vaccine_id") REFERENCES "public"."vaccines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment_attachments" ADD CONSTRAINT "recruitment_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment_attachments" ADD CONSTRAINT "recruitment_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recruitment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recruitment" ADD CONSTRAINT "recruitment_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment" ADD CONSTRAINT "recruitment_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment" ADD CONSTRAINT "recruitment_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment" ADD CONSTRAINT "recruitment_attachment_id_media_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recruitment" ADD CONSTRAINT "recruitment_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v_version_attachments" ADD CONSTRAINT "_recruitment_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v_version_attachments" ADD CONSTRAINT "_recruitment_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_recruitment_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recruitment_v" ADD CONSTRAINT "_recruitment_v_parent_id_recruitment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recruitment"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v" ADD CONSTRAINT "_recruitment_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v" ADD CONSTRAINT "_recruitment_v_version_category_ref_id_categories_id_fk" FOREIGN KEY ("version_category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v" ADD CONSTRAINT "_recruitment_v_version_department_id_departments_id_fk" FOREIGN KEY ("version_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v" ADD CONSTRAINT "_recruitment_v_version_attachment_id_media_id_fk" FOREIGN KEY ("version_attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recruitment_v" ADD CONSTRAINT "_recruitment_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_items" ADD CONSTRAINT "pages_blocks_downloads_items_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_items" ADD CONSTRAINT "pages_blocks_downloads_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads" ADD CONSTRAINT "pages_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_attachments" ADD CONSTRAINT "pages_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_attachments" ADD CONSTRAINT "pages_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_items" ADD CONSTRAINT "_pages_v_blocks_downloads_items_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_items" ADD CONSTRAINT "_pages_v_blocks_downloads_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads" ADD CONSTRAINT "_pages_v_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_attachments" ADD CONSTRAINT "_pages_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_attachments" ADD CONSTRAINT "_pages_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_categories" ADD CONSTRAINT "feedback_categories_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_cases" ADD CONSTRAINT "feedback_cases_category_id_feedback_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."feedback_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_cases" ADD CONSTRAINT "feedback_cases_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_cases" ADD CONSTRAINT "feedback_cases_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_actions" ADD CONSTRAINT "feedback_actions_case_id_feedback_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."feedback_cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "feedback_actions" ADD CONSTRAINT "feedback_actions_performed_by_id_users_id_fk" FOREIGN KEY ("performed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chatbot_intents_phrases" ADD CONSTRAINT "chatbot_intents_phrases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_intents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_conversations_messages" ADD CONSTRAINT "chatbot_conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chatbot_unanswered" ADD CONSTRAINT "chatbot_unanswered_intent_id_chatbot_intents_id_fk" FOREIGN KEY ("intent_id") REFERENCES "public"."chatbot_intents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_templates" ADD CONSTRAINT "survey_templates_current_version_id_survey_template_versions_id_fk" FOREIGN KEY ("current_version_id") REFERENCES "public"."survey_template_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_template_versions" ADD CONSTRAINT "survey_template_versions_template_id_survey_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."survey_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_template_versions_rels" ADD CONSTRAINT "survey_template_versions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."survey_template_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "survey_template_versions_rels" ADD CONSTRAINT "survey_template_versions_rels_survey_questions_fk" FOREIGN KEY ("survey_questions_id") REFERENCES "public"."survey_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "survey_questions_options" ADD CONSTRAINT "survey_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."survey_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "survey_campaigns" ADD CONSTRAINT "survey_campaigns_template_version_id_survey_template_versions_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."survey_template_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_campaigns" ADD CONSTRAINT "survey_campaigns_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_codes" ADD CONSTRAINT "survey_codes_campaign_id_survey_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."survey_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_codes" ADD CONSTRAINT "survey_codes_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_campaign_id_survey_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."survey_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_template_version_id_survey_template_versions_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."survey_template_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_survey_code_id_survey_codes_id_fk" FOREIGN KEY ("survey_code_id") REFERENCES "public"."survey_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_answers" ADD CONSTRAINT "survey_answers_response_id_survey_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."survey_responses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_answers" ADD CONSTRAINT "survey_answers_question_id_survey_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."survey_questions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_statistics" ADD CONSTRAINT "survey_statistics_campaign_id_survey_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."survey_campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "survey_statistics" ADD CONSTRAINT "survey_statistics_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dynamic_modules" ADD CONSTRAINT "dynamic_modules_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dynamic_modules" ADD CONSTRAINT "dynamic_modules_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dynamic_modules_v" ADD CONSTRAINT "_dynamic_modules_v_parent_id_dynamic_modules_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dynamic_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dynamic_modules_v" ADD CONSTRAINT "_dynamic_modules_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dynamic_modules_v" ADD CONSTRAINT "_dynamic_modules_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_sections" ADD CONSTRAINT "content_sections_default_image_id_media_id_fk" FOREIGN KEY ("default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_sections" ADD CONSTRAINT "content_sections_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_sections_v" ADD CONSTRAINT "_content_sections_v_parent_id_content_sections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_sections_v" ADD CONSTRAINT "_content_sections_v_version_default_image_id_media_id_fk" FOREIGN KEY ("version_default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_sections_v" ADD CONSTRAINT "_content_sections_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_posts_attachments" ADD CONSTRAINT "custom_posts_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_posts_attachments" ADD CONSTRAINT "custom_posts_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."custom_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "custom_posts" ADD CONSTRAINT "custom_posts_section_id_content_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_posts" ADD CONSTRAINT "custom_posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "custom_posts" ADD CONSTRAINT "custom_posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_posts_v_version_attachments" ADD CONSTRAINT "_custom_posts_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_posts_v_version_attachments" ADD CONSTRAINT "_custom_posts_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_custom_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_custom_posts_v" ADD CONSTRAINT "_custom_posts_v_parent_id_custom_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."custom_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_posts_v" ADD CONSTRAINT "_custom_posts_v_version_section_id_content_sections_id_fk" FOREIGN KEY ("version_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_posts_v" ADD CONSTRAINT "_custom_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_custom_posts_v" ADD CONSTRAINT "_custom_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_imported_by_id_users_id_fk" FOREIGN KEY ("imported_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_procurement_fk" FOREIGN KEY ("procurement_id") REFERENCES "public"."procurement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schedules_fk" FOREIGN KEY ("schedules_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_prices_fk" FOREIGN KEY ("service_prices_id") REFERENCES "public"."service_prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccinations_fk" FOREIGN KEY ("vaccinations_id") REFERENCES "public"."vaccinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccination_schedules_fk" FOREIGN KEY ("vaccination_schedules_id") REFERENCES "public"."vaccination_schedules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccines_fk" FOREIGN KEY ("vaccines_id") REFERENCES "public"."vaccines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccine_prices_fk" FOREIGN KEY ("vaccine_prices_id") REFERENCES "public"."vaccine_prices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recruitment_fk" FOREIGN KEY ("recruitment_id") REFERENCES "public"."recruitment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultations_fk" FOREIGN KEY ("consultations_id") REFERENCES "public"."consultations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_categories_fk" FOREIGN KEY ("feedback_categories_id") REFERENCES "public"."feedback_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_cases_fk" FOREIGN KEY ("feedback_cases_id") REFERENCES "public"."feedback_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_feedback_actions_fk" FOREIGN KEY ("feedback_actions_id") REFERENCES "public"."feedback_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chatbot_intents_fk" FOREIGN KEY ("chatbot_intents_id") REFERENCES "public"."chatbot_intents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chatbot_conversations_fk" FOREIGN KEY ("chatbot_conversations_id") REFERENCES "public"."chatbot_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chatbot_unanswered_fk" FOREIGN KEY ("chatbot_unanswered_id") REFERENCES "public"."chatbot_unanswered"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_templates_fk" FOREIGN KEY ("survey_templates_id") REFERENCES "public"."survey_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_template_versions_fk" FOREIGN KEY ("survey_template_versions_id") REFERENCES "public"."survey_template_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_questions_fk" FOREIGN KEY ("survey_questions_id") REFERENCES "public"."survey_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_campaigns_fk" FOREIGN KEY ("survey_campaigns_id") REFERENCES "public"."survey_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_codes_fk" FOREIGN KEY ("survey_codes_id") REFERENCES "public"."survey_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_responses_fk" FOREIGN KEY ("survey_responses_id") REFERENCES "public"."survey_responses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_answers_fk" FOREIGN KEY ("survey_answers_id") REFERENCES "public"."survey_answers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_survey_statistics_fk" FOREIGN KEY ("survey_statistics_id") REFERENCES "public"."survey_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dynamic_modules_fk" FOREIGN KEY ("dynamic_modules_id") REFERENCES "public"."dynamic_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_sections_fk" FOREIGN KEY ("content_sections_id") REFERENCES "public"."content_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_custom_posts_fk" FOREIGN KEY ("custom_posts_id") REFERENCES "public"."custom_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_import_jobs_fk" FOREIGN KEY ("import_jobs_id") REFERENCES "public"."import_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_header_contact_cards" ADD CONSTRAINT "site_settings_header_contact_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_header_contact_cards" ADD CONSTRAINT "site_settings_header_contact_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_header_social_links" ADD CONSTRAINT "site_settings_header_social_links_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_header_social_links" ADD CONSTRAINT "site_settings_header_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_website_assistant_quick_topics" ADD CONSTRAINT "site_settings_website_assistant_quick_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_website_assistant_custom_answers" ADD CONSTRAINT "site_settings_website_assistant_custom_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_header_brand_appearance_background_image_id_media_id_fk" FOREIGN KEY ("header_brand_appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_header_banner_id_media_id_fk" FOREIGN KEY ("header_banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_website_assistant_assistant_logo_id_media_id_fk" FOREIGN KEY ("website_assistant_assistant_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_header_contact_cards" ADD CONSTRAINT "_site_settings_v_version_header_contact_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_header_contact_cards" ADD CONSTRAINT "_site_settings_v_version_header_contact_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_header_social_links" ADD CONSTRAINT "_site_settings_v_version_header_social_links_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_header_social_links" ADD CONSTRAINT "_site_settings_v_version_header_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_website_assistant_quick_topics" ADD CONSTRAINT "_site_settings_v_version_website_assistant_quick_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_website_assistant_custom_answers" ADD CONSTRAINT "_site_settings_v_version_website_assistant_custom_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_header_brand_appearance_background_image_id_media_id_fk" FOREIGN KEY ("version_header_brand_appearance_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_header_banner_id_media_id_fk" FOREIGN KEY ("version_header_banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_website_assistant_assistant_logo_id_media_id_fk" FOREIGN KEY ("version_website_assistant_assistant_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_content_section_id_content_sections_id_fk" FOREIGN KEY ("content_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_content_section_id_content_sections_id_fk" FOREIGN KEY ("content_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_procurement_fk" FOREIGN KEY ("procurement_id") REFERENCES "public"."procurement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_recruitment_fk" FOREIGN KEY ("recruitment_id") REFERENCES "public"."recruitment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items_children" ADD CONSTRAINT "_navigation_v_version_items_children_content_section_id_content_sections_id_fk" FOREIGN KEY ("content_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items_children" ADD CONSTRAINT "_navigation_v_version_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items" ADD CONSTRAINT "_navigation_v_version_items_content_section_id_content_sections_id_fk" FOREIGN KEY ("content_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items" ADD CONSTRAINT "_navigation_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_procurement_fk" FOREIGN KEY ("procurement_id") REFERENCES "public"."procurement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_recruitment_fk" FOREIGN KEY ("recruitment_id") REFERENCES "public"."recruitment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_contact_cards" ADD CONSTRAINT "header_contact_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_contact_cards" ADD CONSTRAINT "header_contact_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_version_contact_cards" ADD CONSTRAINT "_header_v_version_contact_cards_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_version_contact_cards" ADD CONSTRAINT "_header_v_version_contact_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns" ADD CONSTRAINT "_footer_v_version_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_banners" ADD CONSTRAINT "homepage_banners_desktop_image_id_media_id_fk" FOREIGN KEY ("desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_banners" ADD CONSTRAINT "homepage_banners_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_banners" ADD CONSTRAINT "homepage_banners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_quick_links" ADD CONSTRAINT "homepage_quick_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_quick_links" ADD CONSTRAINT "homepage_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stats" ADD CONSTRAINT "homepage_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_values" ADD CONSTRAINT "content_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_manual" ADD CONSTRAINT "news_manual_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_manual" ADD CONSTRAINT "news_manual_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_manual" ADD CONSTRAINT "news_manual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_tabs" ADD CONSTRAINT "content_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dept_values" ADD CONSTRAINT "dept_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dept_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dept_manual" ADD CONSTRAINT "dept_manual_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "dept_manual" ADD CONSTRAINT "dept_manual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dept_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dept_tabs" ADD CONSTRAINT "dept_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schedule_manual" ADD CONSTRAINT "schedule_manual_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_manual" ADD CONSTRAINT "schedule_manual_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_manual" ADD CONSTRAINT "schedule_manual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections_schedule_tab_order"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_sections_schedule_tab_order" ADD CONSTRAINT "homepage_sections_schedule_tab_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vaccine_manual" ADD CONSTRAINT "vaccine_manual_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccine_manual" ADD CONSTRAINT "vaccine_manual_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vaccine_manual" ADD CONSTRAINT "vaccine_manual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections_vaccination_tab_order"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_sections_vaccination_tab_order" ADD CONSTRAINT "homepage_sections_vaccination_tab_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_organization_image_id_media_id_fk" FOREIGN KEY ("organization_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_linked_content_section_id_content_sections_id_fk" FOREIGN KEY ("linked_content_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_dynamic_module_id_dynamic_modules_id_fk" FOREIGN KEY ("dynamic_module_id") REFERENCES "public"."dynamic_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_custom_image_id_media_id_fk" FOREIGN KEY ("custom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_button_page_id_pages_id_fk" FOREIGN KEY ("button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_desktop_image_id_media_id_fk" FOREIGN KEY ("hero_desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_banners" ADD CONSTRAINT "_homepage_v_version_banners_desktop_image_id_media_id_fk" FOREIGN KEY ("desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_banners" ADD CONSTRAINT "_homepage_v_version_banners_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_banners" ADD CONSTRAINT "_homepage_v_version_banners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_quick_links" ADD CONSTRAINT "_homepage_v_version_quick_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_quick_links" ADD CONSTRAINT "_homepage_v_version_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_stats" ADD CONSTRAINT "_homepage_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_values_v" ADD CONSTRAINT "_content_values_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_tabs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_manual_v" ADD CONSTRAINT "_news_manual_v_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_manual_v" ADD CONSTRAINT "_news_manual_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_manual_v" ADD CONSTRAINT "_news_manual_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_tabs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_tabs_v" ADD CONSTRAINT "_content_tabs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dept_values_v" ADD CONSTRAINT "_dept_values_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dept_tabs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dept_manual_v" ADD CONSTRAINT "_dept_manual_v_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_dept_manual_v" ADD CONSTRAINT "_dept_manual_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dept_tabs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dept_tabs_v" ADD CONSTRAINT "_dept_tabs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_schedule_manual_v" ADD CONSTRAINT "_schedule_manual_v_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_schedule_manual_v" ADD CONSTRAINT "_schedule_manual_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_schedule_manual_v" ADD CONSTRAINT "_schedule_manual_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections_schedule_tab_order"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections_schedule_tab_order" ADD CONSTRAINT "_homepage_v_version_sections_schedule_tab_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vaccine_manual_v" ADD CONSTRAINT "_vaccine_manual_v_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccine_manual_v" ADD CONSTRAINT "_vaccine_manual_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vaccine_manual_v" ADD CONSTRAINT "_vaccine_manual_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections_vaccination_tab_order"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections_vaccination_tab_order" ADD CONSTRAINT "_homepage_v_version_sections_vaccination_tab_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections" ADD CONSTRAINT "_homepage_v_version_sections_organization_image_id_media_id_fk" FOREIGN KEY ("organization_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections" ADD CONSTRAINT "_homepage_v_version_sections_linked_content_section_id_content_sections_id_fk" FOREIGN KEY ("linked_content_section_id") REFERENCES "public"."content_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections" ADD CONSTRAINT "_homepage_v_version_sections_dynamic_module_id_dynamic_modules_id_fk" FOREIGN KEY ("dynamic_module_id") REFERENCES "public"."dynamic_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections" ADD CONSTRAINT "_homepage_v_version_sections_custom_image_id_media_id_fk" FOREIGN KEY ("custom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections" ADD CONSTRAINT "_homepage_v_version_sections_button_page_id_pages_id_fk" FOREIGN KEY ("button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_sections" ADD CONSTRAINT "_homepage_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_desktop_image_id_media_id_fk" FOREIGN KEY ("version_hero_desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("version_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_intro_image_id_media_id_fk" FOREIGN KEY ("version_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_chart_deputy_directors" ADD CONSTRAINT "organization_chart_deputy_directors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_chart_deputy_directors" ADD CONSTRAINT "organization_chart_deputy_directors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_chart_offices" ADD CONSTRAINT "organization_chart_offices_unit_id_departments_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_chart_offices" ADD CONSTRAINT "organization_chart_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_chart_departments" ADD CONSTRAINT "organization_chart_departments_unit_id_departments_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_chart_departments" ADD CONSTRAINT "organization_chart_departments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_chart" ADD CONSTRAINT "organization_chart_director_photo_id_media_id_fk" FOREIGN KEY ("director_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_chart_v_version_deputy_directors" ADD CONSTRAINT "_organization_chart_v_version_deputy_directors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_chart_v_version_deputy_directors" ADD CONSTRAINT "_organization_chart_v_version_deputy_directors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_organization_chart_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organization_chart_v_version_offices" ADD CONSTRAINT "_organization_chart_v_version_offices_unit_id_departments_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_chart_v_version_offices" ADD CONSTRAINT "_organization_chart_v_version_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_organization_chart_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organization_chart_v_version_departments" ADD CONSTRAINT "_organization_chart_v_version_departments_unit_id_departments_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_chart_v_version_departments" ADD CONSTRAINT "_organization_chart_v_version_departments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_organization_chart_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organization_chart_v" ADD CONSTRAINT "_organization_chart_v_version_director_photo_id_media_id_fk" FOREIGN KEY ("version_director_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings_custom_defaults" ADD CONSTRAINT "default_media_settings_custom_defaults_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings_custom_defaults" ADD CONSTRAINT "default_media_settings_custom_defaults_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."default_media_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_news_id_media_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_notices_id_media_id_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_procurement_id_media_id_fk" FOREIGN KEY ("procurement_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_recruitment_id_media_id_fk" FOREIGN KEY ("recruitment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_documents_id_media_id_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_schedules_id_media_id_fk" FOREIGN KEY ("schedules_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "default_media_settings" ADD CONSTRAINT "default_media_settings_vaccinations_id_media_id_fk" FOREIGN KEY ("vaccinations_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_settings_robots_disallow" ADD CONSTRAINT "seo_settings_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_settings" ADD CONSTRAINT "seo_settings_default_image_id_media_id_fk" FOREIGN KEY ("default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_seo_settings_v_version_robots_disallow" ADD CONSTRAINT "_seo_settings_v_version_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_seo_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_seo_settings_v" ADD CONSTRAINT "_seo_settings_v_version_default_image_id_media_id_fk" FOREIGN KEY ("version_default_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chatbot_settings_quick_topics" ADD CONSTRAINT "chatbot_settings_quick_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chatbot_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quick_links_settings_items" ADD CONSTRAINT "quick_links_settings_items_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quick_links_settings_items" ADD CONSTRAINT "quick_links_settings_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quick_links_settings_items" ADD CONSTRAINT "quick_links_settings_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quick_links_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quick_links_settings_v_version_items" ADD CONSTRAINT "_quick_links_settings_v_version_items_linked_page_id_pages_id_fk" FOREIGN KEY ("linked_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quick_links_settings_v_version_items" ADD CONSTRAINT "_quick_links_settings_v_version_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quick_links_settings_v_version_items" ADD CONSTRAINT "_quick_links_settings_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quick_links_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_permissions_actions_order_idx" ON "users_permissions_actions" USING btree ("order");
  CREATE INDEX "users_permissions_actions_parent_idx" ON "users_permissions_actions" USING btree ("parent_id");
  CREATE INDEX "users_permissions_order_idx" ON "users_permissions" USING btree ("_order");
  CREATE INDEX "users_permissions_parent_id_idx" ON "users_permissions" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_department_idx" ON "users" USING btree ("department_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_group_idx" ON "media" USING btree ("group");
  CREATE INDEX "media_access_level_idx" ON "media" USING btree ("access_level");
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  CREATE INDEX "media_hash_idx" ON "media" USING btree ("hash");
  CREATE INDEX "media_duplicate_of_idx" ON "media" USING btree ("duplicate_of_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_article_sizes_article_filename_idx" ON "media" USING btree ("sizes_article_filename");
  CREATE INDEX "news_attachments_order_idx" ON "news_attachments" USING btree ("_order");
  CREATE INDEX "news_attachments_parent_id_idx" ON "news_attachments" USING btree ("_parent_id");
  CREATE INDEX "news_attachments_file_idx" ON "news_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_cover_idx" ON "news" USING btree ("cover_id");
  CREATE INDEX "news_category_ref_idx" ON "news" USING btree ("category_ref_id");
  CREATE INDEX "news_seo_image_idx" ON "news" USING btree ("seo_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news_deleted_at_idx" ON "news" USING btree ("deleted_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_version_attachments_order_idx" ON "_news_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_news_v_version_attachments_parent_id_idx" ON "_news_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_attachments_file_idx" ON "_news_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_idx" ON "_news_v" USING btree ("version_cover_id");
  CREATE INDEX "_news_v_version_version_category_ref_idx" ON "_news_v" USING btree ("version_category_ref_id");
  CREATE INDEX "_news_v_version_version_seo_image_idx" ON "_news_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version_deleted_at_idx" ON "_news_v" USING btree ("version_deleted_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "notices_attachments_order_idx" ON "notices_attachments" USING btree ("_order");
  CREATE INDEX "notices_attachments_parent_id_idx" ON "notices_attachments" USING btree ("_parent_id");
  CREATE INDEX "notices_attachments_file_idx" ON "notices_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "notices_slug_idx" ON "notices" USING btree ("slug");
  CREATE INDEX "notices_cover_idx" ON "notices" USING btree ("cover_id");
  CREATE INDEX "notices_category_ref_idx" ON "notices" USING btree ("category_ref_id");
  CREATE INDEX "notices_seo_image_idx" ON "notices" USING btree ("seo_image_id");
  CREATE INDEX "notices_updated_at_idx" ON "notices" USING btree ("updated_at");
  CREATE INDEX "notices_created_at_idx" ON "notices" USING btree ("created_at");
  CREATE INDEX "notices_deleted_at_idx" ON "notices" USING btree ("deleted_at");
  CREATE INDEX "notices__status_idx" ON "notices" USING btree ("_status");
  CREATE INDEX "_notices_v_version_attachments_order_idx" ON "_notices_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_notices_v_version_attachments_parent_id_idx" ON "_notices_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_notices_v_version_attachments_file_idx" ON "_notices_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_notices_v_parent_idx" ON "_notices_v" USING btree ("parent_id");
  CREATE INDEX "_notices_v_version_version_slug_idx" ON "_notices_v" USING btree ("version_slug");
  CREATE INDEX "_notices_v_version_version_cover_idx" ON "_notices_v" USING btree ("version_cover_id");
  CREATE INDEX "_notices_v_version_version_category_ref_idx" ON "_notices_v" USING btree ("version_category_ref_id");
  CREATE INDEX "_notices_v_version_version_seo_image_idx" ON "_notices_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_notices_v_version_version_updated_at_idx" ON "_notices_v" USING btree ("version_updated_at");
  CREATE INDEX "_notices_v_version_version_created_at_idx" ON "_notices_v" USING btree ("version_created_at");
  CREATE INDEX "_notices_v_version_version_deleted_at_idx" ON "_notices_v" USING btree ("version_deleted_at");
  CREATE INDEX "_notices_v_version_version__status_idx" ON "_notices_v" USING btree ("version__status");
  CREATE INDEX "_notices_v_created_at_idx" ON "_notices_v" USING btree ("created_at");
  CREATE INDEX "_notices_v_updated_at_idx" ON "_notices_v" USING btree ("updated_at");
  CREATE INDEX "_notices_v_latest_idx" ON "_notices_v" USING btree ("latest");
  CREATE INDEX "_notices_v_autosave_idx" ON "_notices_v" USING btree ("autosave");
  CREATE INDEX "procurement_attachments_order_idx" ON "procurement_attachments" USING btree ("_order");
  CREATE INDEX "procurement_attachments_parent_id_idx" ON "procurement_attachments" USING btree ("_parent_id");
  CREATE INDEX "procurement_attachments_file_idx" ON "procurement_attachments" USING btree ("file_id");
  CREATE INDEX "procurement_change_log_order_idx" ON "procurement_change_log" USING btree ("_order");
  CREATE INDEX "procurement_change_log_parent_id_idx" ON "procurement_change_log" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "procurement_slug_idx" ON "procurement" USING btree ("slug");
  CREATE INDEX "procurement_cover_idx" ON "procurement" USING btree ("cover_id");
  CREATE INDEX "procurement_reference_code_idx" ON "procurement" USING btree ("reference_code");
  CREATE INDEX "procurement_category_ref_idx" ON "procurement" USING btree ("category_ref_id");
  CREATE INDEX "procurement_seo_image_idx" ON "procurement" USING btree ("seo_image_id");
  CREATE INDEX "procurement_updated_at_idx" ON "procurement" USING btree ("updated_at");
  CREATE INDEX "procurement_created_at_idx" ON "procurement" USING btree ("created_at");
  CREATE INDEX "procurement_deleted_at_idx" ON "procurement" USING btree ("deleted_at");
  CREATE INDEX "procurement__status_idx" ON "procurement" USING btree ("_status");
  CREATE INDEX "_procurement_v_version_attachments_order_idx" ON "_procurement_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_procurement_v_version_attachments_parent_id_idx" ON "_procurement_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_procurement_v_version_attachments_file_idx" ON "_procurement_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_procurement_v_version_change_log_order_idx" ON "_procurement_v_version_change_log" USING btree ("_order");
  CREATE INDEX "_procurement_v_version_change_log_parent_id_idx" ON "_procurement_v_version_change_log" USING btree ("_parent_id");
  CREATE INDEX "_procurement_v_parent_idx" ON "_procurement_v" USING btree ("parent_id");
  CREATE INDEX "_procurement_v_version_version_slug_idx" ON "_procurement_v" USING btree ("version_slug");
  CREATE INDEX "_procurement_v_version_version_cover_idx" ON "_procurement_v" USING btree ("version_cover_id");
  CREATE INDEX "_procurement_v_version_version_reference_code_idx" ON "_procurement_v" USING btree ("version_reference_code");
  CREATE INDEX "_procurement_v_version_version_category_ref_idx" ON "_procurement_v" USING btree ("version_category_ref_id");
  CREATE INDEX "_procurement_v_version_version_seo_image_idx" ON "_procurement_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_procurement_v_version_version_updated_at_idx" ON "_procurement_v" USING btree ("version_updated_at");
  CREATE INDEX "_procurement_v_version_version_created_at_idx" ON "_procurement_v" USING btree ("version_created_at");
  CREATE INDEX "_procurement_v_version_version_deleted_at_idx" ON "_procurement_v" USING btree ("version_deleted_at");
  CREATE INDEX "_procurement_v_version_version__status_idx" ON "_procurement_v" USING btree ("version__status");
  CREATE INDEX "_procurement_v_created_at_idx" ON "_procurement_v" USING btree ("created_at");
  CREATE INDEX "_procurement_v_updated_at_idx" ON "_procurement_v" USING btree ("updated_at");
  CREATE INDEX "_procurement_v_latest_idx" ON "_procurement_v" USING btree ("latest");
  CREATE INDEX "_procurement_v_autosave_idx" ON "_procurement_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "documents_slug_idx" ON "documents" USING btree ("slug");
  CREATE INDEX "documents_number_idx" ON "documents" USING btree ("number");
  CREATE INDEX "documents_category_ref_idx" ON "documents" USING btree ("category_ref_id");
  CREATE INDEX "documents_cover_idx" ON "documents" USING btree ("cover_id");
  CREATE INDEX "documents_file_idx" ON "documents" USING btree ("file_id");
  CREATE INDEX "documents_seo_image_idx" ON "documents" USING btree ("seo_image_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "documents_deleted_at_idx" ON "documents" USING btree ("deleted_at");
  CREATE INDEX "_documents_v_parent_idx" ON "_documents_v" USING btree ("parent_id");
  CREATE INDEX "_documents_v_version_version_slug_idx" ON "_documents_v" USING btree ("version_slug");
  CREATE INDEX "_documents_v_version_version_number_idx" ON "_documents_v" USING btree ("version_number");
  CREATE INDEX "_documents_v_version_version_category_ref_idx" ON "_documents_v" USING btree ("version_category_ref_id");
  CREATE INDEX "_documents_v_version_version_cover_idx" ON "_documents_v" USING btree ("version_cover_id");
  CREATE INDEX "_documents_v_version_version_file_idx" ON "_documents_v" USING btree ("version_file_id");
  CREATE INDEX "_documents_v_version_version_seo_image_idx" ON "_documents_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_documents_v_version_version_updated_at_idx" ON "_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_documents_v_version_version_created_at_idx" ON "_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_documents_v_version_version_deleted_at_idx" ON "_documents_v" USING btree ("version_deleted_at");
  CREATE INDEX "_documents_v_created_at_idx" ON "_documents_v" USING btree ("created_at");
  CREATE INDEX "_documents_v_updated_at_idx" ON "_documents_v" USING btree ("updated_at");
  CREATE INDEX "departments_deputy_leaders_order_idx" ON "departments_deputy_leaders" USING btree ("_order");
  CREATE INDEX "departments_deputy_leaders_parent_id_idx" ON "departments_deputy_leaders" USING btree ("_parent_id");
  CREATE INDEX "departments_gallery_order_idx" ON "departments_gallery" USING btree ("_order");
  CREATE INDEX "departments_gallery_parent_id_idx" ON "departments_gallery" USING btree ("_parent_id");
  CREATE INDEX "departments_gallery_image_idx" ON "departments_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "departments_slug_idx" ON "departments" USING btree ("slug");
  CREATE INDEX "departments_cover_idx" ON "departments" USING btree ("cover_id");
  CREATE INDEX "departments_seo_image_idx" ON "departments" USING btree ("seo_image_id");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE INDEX "departments__status_idx" ON "departments" USING btree ("_status");
  CREATE INDEX "_departments_v_version_deputy_leaders_order_idx" ON "_departments_v_version_deputy_leaders" USING btree ("_order");
  CREATE INDEX "_departments_v_version_deputy_leaders_parent_id_idx" ON "_departments_v_version_deputy_leaders" USING btree ("_parent_id");
  CREATE INDEX "_departments_v_version_gallery_order_idx" ON "_departments_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_departments_v_version_gallery_parent_id_idx" ON "_departments_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_departments_v_version_gallery_image_idx" ON "_departments_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_departments_v_parent_idx" ON "_departments_v" USING btree ("parent_id");
  CREATE INDEX "_departments_v_version_version_slug_idx" ON "_departments_v" USING btree ("version_slug");
  CREATE INDEX "_departments_v_version_version_cover_idx" ON "_departments_v" USING btree ("version_cover_id");
  CREATE INDEX "_departments_v_version_version_seo_image_idx" ON "_departments_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_departments_v_version_version_updated_at_idx" ON "_departments_v" USING btree ("version_updated_at");
  CREATE INDEX "_departments_v_version_version_created_at_idx" ON "_departments_v" USING btree ("version_created_at");
  CREATE INDEX "_departments_v_version_version__status_idx" ON "_departments_v" USING btree ("version__status");
  CREATE INDEX "_departments_v_created_at_idx" ON "_departments_v" USING btree ("created_at");
  CREATE INDEX "_departments_v_updated_at_idx" ON "_departments_v" USING btree ("updated_at");
  CREATE INDEX "_departments_v_latest_idx" ON "_departments_v" USING btree ("latest");
  CREATE INDEX "specialties_department_idx" ON "specialties" USING btree ("department_id");
  CREATE UNIQUE INDEX "specialties_slug_idx" ON "specialties" USING btree ("slug");
  CREATE INDEX "specialties_cover_idx" ON "specialties" USING btree ("cover_id");
  CREATE INDEX "specialties_seo_image_idx" ON "specialties" USING btree ("seo_image_id");
  CREATE INDEX "specialties_updated_at_idx" ON "specialties" USING btree ("updated_at");
  CREATE INDEX "specialties_created_at_idx" ON "specialties" USING btree ("created_at");
  CREATE INDEX "specialties__status_idx" ON "specialties" USING btree ("_status");
  CREATE INDEX "_specialties_v_parent_idx" ON "_specialties_v" USING btree ("parent_id");
  CREATE INDEX "_specialties_v_version_version_department_idx" ON "_specialties_v" USING btree ("version_department_id");
  CREATE INDEX "_specialties_v_version_version_slug_idx" ON "_specialties_v" USING btree ("version_slug");
  CREATE INDEX "_specialties_v_version_version_cover_idx" ON "_specialties_v" USING btree ("version_cover_id");
  CREATE INDEX "_specialties_v_version_version_seo_image_idx" ON "_specialties_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_specialties_v_version_version_updated_at_idx" ON "_specialties_v" USING btree ("version_updated_at");
  CREATE INDEX "_specialties_v_version_version_created_at_idx" ON "_specialties_v" USING btree ("version_created_at");
  CREATE INDEX "_specialties_v_version_version__status_idx" ON "_specialties_v" USING btree ("version__status");
  CREATE INDEX "_specialties_v_created_at_idx" ON "_specialties_v" USING btree ("created_at");
  CREATE INDEX "_specialties_v_updated_at_idx" ON "_specialties_v" USING btree ("updated_at");
  CREATE INDEX "_specialties_v_latest_idx" ON "_specialties_v" USING btree ("latest");
  CREATE UNIQUE INDEX "doctors_slug_idx" ON "doctors" USING btree ("slug");
  CREATE INDEX "doctors_avatar_idx" ON "doctors" USING btree ("avatar_id");
  CREATE INDEX "doctors_department_idx" ON "doctors" USING btree ("department_id");
  CREATE INDEX "doctors_specialty_ref_idx" ON "doctors" USING btree ("specialty_ref_id");
  CREATE INDEX "doctors_seo_image_idx" ON "doctors" USING btree ("seo_image_id");
  CREATE INDEX "doctors_updated_at_idx" ON "doctors" USING btree ("updated_at");
  CREATE INDEX "doctors_created_at_idx" ON "doctors" USING btree ("created_at");
  CREATE INDEX "doctors__status_idx" ON "doctors" USING btree ("_status");
  CREATE INDEX "_doctors_v_parent_idx" ON "_doctors_v" USING btree ("parent_id");
  CREATE INDEX "_doctors_v_version_version_slug_idx" ON "_doctors_v" USING btree ("version_slug");
  CREATE INDEX "_doctors_v_version_version_avatar_idx" ON "_doctors_v" USING btree ("version_avatar_id");
  CREATE INDEX "_doctors_v_version_version_department_idx" ON "_doctors_v" USING btree ("version_department_id");
  CREATE INDEX "_doctors_v_version_version_specialty_ref_idx" ON "_doctors_v" USING btree ("version_specialty_ref_id");
  CREATE INDEX "_doctors_v_version_version_seo_image_idx" ON "_doctors_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_doctors_v_version_version_updated_at_idx" ON "_doctors_v" USING btree ("version_updated_at");
  CREATE INDEX "_doctors_v_version_version_created_at_idx" ON "_doctors_v" USING btree ("version_created_at");
  CREATE INDEX "_doctors_v_version_version__status_idx" ON "_doctors_v" USING btree ("version__status");
  CREATE INDEX "_doctors_v_created_at_idx" ON "_doctors_v" USING btree ("created_at");
  CREATE INDEX "_doctors_v_updated_at_idx" ON "_doctors_v" USING btree ("updated_at");
  CREATE INDEX "_doctors_v_latest_idx" ON "_doctors_v" USING btree ("latest");
  CREATE INDEX "schedules_weekly_slots_order_idx" ON "schedules_weekly_slots" USING btree ("_order");
  CREATE INDEX "schedules_weekly_slots_parent_id_idx" ON "schedules_weekly_slots" USING btree ("_parent_id");
  CREATE INDEX "schedules_weekly_slots_doctor_idx" ON "schedules_weekly_slots" USING btree ("doctor_id");
  CREATE INDEX "schedules_weekly_slots_department_idx" ON "schedules_weekly_slots" USING btree ("department_id");
  CREATE INDEX "schedules_attachment_files_order_idx" ON "schedules_attachment_files" USING btree ("_order");
  CREATE INDEX "schedules_attachment_files_parent_id_idx" ON "schedules_attachment_files" USING btree ("_parent_id");
  CREATE INDEX "schedules_attachment_files_file_idx" ON "schedules_attachment_files" USING btree ("file_id");
  CREATE INDEX "schedules_cover_image_idx" ON "schedules" USING btree ("cover_image_id");
  CREATE INDEX "schedules_doctor_idx" ON "schedules" USING btree ("doctor_id");
  CREATE INDEX "schedules_department_idx" ON "schedules" USING btree ("department_id");
  CREATE INDEX "schedules_date_idx" ON "schedules" USING btree ("date");
  CREATE INDEX "schedules_schedule_image_idx" ON "schedules" USING btree ("schedule_image_id");
  CREATE INDEX "schedules_schedule_file_idx" ON "schedules" USING btree ("schedule_file_id");
  CREATE INDEX "schedules_updated_at_idx" ON "schedules" USING btree ("updated_at");
  CREATE INDEX "schedules_created_at_idx" ON "schedules" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_code_idx" ON "services" USING btree ("code");
  CREATE INDEX "services_name_idx" ON "services" USING btree ("name");
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "service_prices_service_idx" ON "service_prices" USING btree ("service_id");
  CREATE INDEX "service_prices_decision_no_idx" ON "service_prices" USING btree ("decision_no");
  CREATE INDEX "service_prices_effective_from_idx" ON "service_prices" USING btree ("effective_from");
  CREATE INDEX "service_prices_effective_to_idx" ON "service_prices" USING btree ("effective_to");
  CREATE INDEX "service_prices_active_idx" ON "service_prices" USING btree ("active");
  CREATE INDEX "service_prices_updated_at_idx" ON "service_prices" USING btree ("updated_at");
  CREATE INDEX "service_prices_created_at_idx" ON "service_prices" USING btree ("created_at");
  CREATE INDEX "_service_prices_v_parent_idx" ON "_service_prices_v" USING btree ("parent_id");
  CREATE INDEX "_service_prices_v_version_version_service_idx" ON "_service_prices_v" USING btree ("version_service_id");
  CREATE INDEX "_service_prices_v_version_version_decision_no_idx" ON "_service_prices_v" USING btree ("version_decision_no");
  CREATE INDEX "_service_prices_v_version_version_effective_from_idx" ON "_service_prices_v" USING btree ("version_effective_from");
  CREATE INDEX "_service_prices_v_version_version_effective_to_idx" ON "_service_prices_v" USING btree ("version_effective_to");
  CREATE INDEX "_service_prices_v_version_version_active_idx" ON "_service_prices_v" USING btree ("version_active");
  CREATE INDEX "_service_prices_v_version_version_updated_at_idx" ON "_service_prices_v" USING btree ("version_updated_at");
  CREATE INDEX "_service_prices_v_version_version_created_at_idx" ON "_service_prices_v" USING btree ("version_created_at");
  CREATE INDEX "_service_prices_v_created_at_idx" ON "_service_prices_v" USING btree ("created_at");
  CREATE INDEX "_service_prices_v_updated_at_idx" ON "_service_prices_v" USING btree ("updated_at");
  CREATE INDEX "vaccinations_announcement_image_idx" ON "vaccinations" USING btree ("announcement_image_id");
  CREATE INDEX "vaccinations_announcement_file_idx" ON "vaccinations" USING btree ("announcement_file_id");
  CREATE INDEX "vaccinations_campaign_image_idx" ON "vaccinations" USING btree ("campaign_image_id");
  CREATE INDEX "vaccinations_vaccine_image_idx" ON "vaccinations" USING btree ("vaccine_image_id");
  CREATE INDEX "vaccinations_updated_at_idx" ON "vaccinations" USING btree ("updated_at");
  CREATE INDEX "vaccinations_created_at_idx" ON "vaccinations" USING btree ("created_at");
  CREATE INDEX "vaccination_schedules_schedule_image_idx" ON "vaccination_schedules" USING btree ("schedule_image_id");
  CREATE INDEX "vaccination_schedules_schedule_file_idx" ON "vaccination_schedules" USING btree ("schedule_file_id");
  CREATE INDEX "vaccination_schedules_date_idx" ON "vaccination_schedules" USING btree ("date");
  CREATE INDEX "vaccination_schedules_active_idx" ON "vaccination_schedules" USING btree ("active");
  CREATE INDEX "vaccination_schedules_updated_at_idx" ON "vaccination_schedules" USING btree ("updated_at");
  CREATE INDEX "vaccination_schedules_created_at_idx" ON "vaccination_schedules" USING btree ("created_at");
  CREATE INDEX "vaccination_schedules_deleted_at_idx" ON "vaccination_schedules" USING btree ("deleted_at");
  CREATE INDEX "vaccination_schedules__status_idx" ON "vaccination_schedules" USING btree ("_status");
  CREATE INDEX "_vaccination_schedules_v_parent_idx" ON "_vaccination_schedules_v" USING btree ("parent_id");
  CREATE INDEX "_vaccination_schedules_v_version_version_schedule_image_idx" ON "_vaccination_schedules_v" USING btree ("version_schedule_image_id");
  CREATE INDEX "_vaccination_schedules_v_version_version_schedule_file_idx" ON "_vaccination_schedules_v" USING btree ("version_schedule_file_id");
  CREATE INDEX "_vaccination_schedules_v_version_version_date_idx" ON "_vaccination_schedules_v" USING btree ("version_date");
  CREATE INDEX "_vaccination_schedules_v_version_version_active_idx" ON "_vaccination_schedules_v" USING btree ("version_active");
  CREATE INDEX "_vaccination_schedules_v_version_version_updated_at_idx" ON "_vaccination_schedules_v" USING btree ("version_updated_at");
  CREATE INDEX "_vaccination_schedules_v_version_version_created_at_idx" ON "_vaccination_schedules_v" USING btree ("version_created_at");
  CREATE INDEX "_vaccination_schedules_v_version_version_deleted_at_idx" ON "_vaccination_schedules_v" USING btree ("version_deleted_at");
  CREATE INDEX "_vaccination_schedules_v_version_version__status_idx" ON "_vaccination_schedules_v" USING btree ("version__status");
  CREATE INDEX "_vaccination_schedules_v_created_at_idx" ON "_vaccination_schedules_v" USING btree ("created_at");
  CREATE INDEX "_vaccination_schedules_v_updated_at_idx" ON "_vaccination_schedules_v" USING btree ("updated_at");
  CREATE INDEX "_vaccination_schedules_v_latest_idx" ON "_vaccination_schedules_v" USING btree ("latest");
  CREATE UNIQUE INDEX "vaccines_code_idx" ON "vaccines" USING btree ("code");
  CREATE INDEX "vaccines_name_idx" ON "vaccines" USING btree ("name");
  CREATE UNIQUE INDEX "vaccines_slug_idx" ON "vaccines" USING btree ("slug");
  CREATE INDEX "vaccines_image_idx" ON "vaccines" USING btree ("image_id");
  CREATE INDEX "vaccines_active_idx" ON "vaccines" USING btree ("active");
  CREATE INDEX "vaccines_updated_at_idx" ON "vaccines" USING btree ("updated_at");
  CREATE INDEX "vaccines_created_at_idx" ON "vaccines" USING btree ("created_at");
  CREATE INDEX "vaccines_deleted_at_idx" ON "vaccines" USING btree ("deleted_at");
  CREATE INDEX "vaccines__status_idx" ON "vaccines" USING btree ("_status");
  CREATE INDEX "_vaccines_v_parent_idx" ON "_vaccines_v" USING btree ("parent_id");
  CREATE INDEX "_vaccines_v_version_version_code_idx" ON "_vaccines_v" USING btree ("version_code");
  CREATE INDEX "_vaccines_v_version_version_name_idx" ON "_vaccines_v" USING btree ("version_name");
  CREATE INDEX "_vaccines_v_version_version_slug_idx" ON "_vaccines_v" USING btree ("version_slug");
  CREATE INDEX "_vaccines_v_version_version_image_idx" ON "_vaccines_v" USING btree ("version_image_id");
  CREATE INDEX "_vaccines_v_version_version_active_idx" ON "_vaccines_v" USING btree ("version_active");
  CREATE INDEX "_vaccines_v_version_version_updated_at_idx" ON "_vaccines_v" USING btree ("version_updated_at");
  CREATE INDEX "_vaccines_v_version_version_created_at_idx" ON "_vaccines_v" USING btree ("version_created_at");
  CREATE INDEX "_vaccines_v_version_version_deleted_at_idx" ON "_vaccines_v" USING btree ("version_deleted_at");
  CREATE INDEX "_vaccines_v_version_version__status_idx" ON "_vaccines_v" USING btree ("version__status");
  CREATE INDEX "_vaccines_v_created_at_idx" ON "_vaccines_v" USING btree ("created_at");
  CREATE INDEX "_vaccines_v_updated_at_idx" ON "_vaccines_v" USING btree ("updated_at");
  CREATE INDEX "_vaccines_v_latest_idx" ON "_vaccines_v" USING btree ("latest");
  CREATE INDEX "vaccine_prices_vaccine_idx" ON "vaccine_prices" USING btree ("vaccine_id");
  CREATE INDEX "vaccine_prices_effective_from_idx" ON "vaccine_prices" USING btree ("effective_from");
  CREATE INDEX "vaccine_prices_effective_to_idx" ON "vaccine_prices" USING btree ("effective_to");
  CREATE INDEX "vaccine_prices_active_idx" ON "vaccine_prices" USING btree ("active");
  CREATE INDEX "vaccine_prices_updated_at_idx" ON "vaccine_prices" USING btree ("updated_at");
  CREATE INDEX "vaccine_prices_created_at_idx" ON "vaccine_prices" USING btree ("created_at");
  CREATE INDEX "_vaccine_prices_v_parent_idx" ON "_vaccine_prices_v" USING btree ("parent_id");
  CREATE INDEX "_vaccine_prices_v_version_version_vaccine_idx" ON "_vaccine_prices_v" USING btree ("version_vaccine_id");
  CREATE INDEX "_vaccine_prices_v_version_version_effective_from_idx" ON "_vaccine_prices_v" USING btree ("version_effective_from");
  CREATE INDEX "_vaccine_prices_v_version_version_effective_to_idx" ON "_vaccine_prices_v" USING btree ("version_effective_to");
  CREATE INDEX "_vaccine_prices_v_version_version_active_idx" ON "_vaccine_prices_v" USING btree ("version_active");
  CREATE INDEX "_vaccine_prices_v_version_version_updated_at_idx" ON "_vaccine_prices_v" USING btree ("version_updated_at");
  CREATE INDEX "_vaccine_prices_v_version_version_created_at_idx" ON "_vaccine_prices_v" USING btree ("version_created_at");
  CREATE INDEX "_vaccine_prices_v_created_at_idx" ON "_vaccine_prices_v" USING btree ("created_at");
  CREATE INDEX "_vaccine_prices_v_updated_at_idx" ON "_vaccine_prices_v" USING btree ("updated_at");
  CREATE INDEX "recruitment_attachments_order_idx" ON "recruitment_attachments" USING btree ("_order");
  CREATE INDEX "recruitment_attachments_parent_id_idx" ON "recruitment_attachments" USING btree ("_parent_id");
  CREATE INDEX "recruitment_attachments_file_idx" ON "recruitment_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "recruitment_slug_idx" ON "recruitment" USING btree ("slug");
  CREATE INDEX "recruitment_cover_idx" ON "recruitment" USING btree ("cover_id");
  CREATE INDEX "recruitment_category_ref_idx" ON "recruitment" USING btree ("category_ref_id");
  CREATE INDEX "recruitment_department_idx" ON "recruitment" USING btree ("department_id");
  CREATE INDEX "recruitment_attachment_idx" ON "recruitment" USING btree ("attachment_id");
  CREATE INDEX "recruitment_seo_image_idx" ON "recruitment" USING btree ("seo_image_id");
  CREATE INDEX "recruitment_updated_at_idx" ON "recruitment" USING btree ("updated_at");
  CREATE INDEX "recruitment_created_at_idx" ON "recruitment" USING btree ("created_at");
  CREATE INDEX "recruitment_deleted_at_idx" ON "recruitment" USING btree ("deleted_at");
  CREATE INDEX "recruitment__status_idx" ON "recruitment" USING btree ("_status");
  CREATE INDEX "_recruitment_v_version_attachments_order_idx" ON "_recruitment_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_recruitment_v_version_attachments_parent_id_idx" ON "_recruitment_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_recruitment_v_version_attachments_file_idx" ON "_recruitment_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_recruitment_v_parent_idx" ON "_recruitment_v" USING btree ("parent_id");
  CREATE INDEX "_recruitment_v_version_version_slug_idx" ON "_recruitment_v" USING btree ("version_slug");
  CREATE INDEX "_recruitment_v_version_version_cover_idx" ON "_recruitment_v" USING btree ("version_cover_id");
  CREATE INDEX "_recruitment_v_version_version_category_ref_idx" ON "_recruitment_v" USING btree ("version_category_ref_id");
  CREATE INDEX "_recruitment_v_version_version_department_idx" ON "_recruitment_v" USING btree ("version_department_id");
  CREATE INDEX "_recruitment_v_version_version_attachment_idx" ON "_recruitment_v" USING btree ("version_attachment_id");
  CREATE INDEX "_recruitment_v_version_version_seo_image_idx" ON "_recruitment_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_recruitment_v_version_version_updated_at_idx" ON "_recruitment_v" USING btree ("version_updated_at");
  CREATE INDEX "_recruitment_v_version_version_created_at_idx" ON "_recruitment_v" USING btree ("version_created_at");
  CREATE INDEX "_recruitment_v_version_version_deleted_at_idx" ON "_recruitment_v" USING btree ("version_deleted_at");
  CREATE INDEX "_recruitment_v_version_version__status_idx" ON "_recruitment_v" USING btree ("version__status");
  CREATE INDEX "_recruitment_v_created_at_idx" ON "_recruitment_v" USING btree ("created_at");
  CREATE INDEX "_recruitment_v_updated_at_idx" ON "_recruitment_v" USING btree ("updated_at");
  CREATE INDEX "_recruitment_v_latest_idx" ON "_recruitment_v" USING btree ("latest");
  CREATE INDEX "_recruitment_v_autosave_idx" ON "_recruitment_v" USING btree ("autosave");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_downloads_items_order_idx" ON "pages_blocks_downloads_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_items_parent_id_idx" ON "pages_blocks_downloads_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_items_file_idx" ON "pages_blocks_downloads_items" USING btree ("file_id");
  CREATE INDEX "pages_blocks_downloads_order_idx" ON "pages_blocks_downloads" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_parent_id_idx" ON "pages_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_path_idx" ON "pages_blocks_downloads" USING btree ("_path");
  CREATE INDEX "pages_attachments_order_idx" ON "pages_attachments" USING btree ("_order");
  CREATE INDEX "pages_attachments_parent_id_idx" ON "pages_attachments" USING btree ("_parent_id");
  CREATE INDEX "pages_attachments_file_idx" ON "pages_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_downloads_items_order_idx" ON "_pages_v_blocks_downloads_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_items_parent_id_idx" ON "_pages_v_blocks_downloads_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_items_file_idx" ON "_pages_v_blocks_downloads_items" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_downloads_order_idx" ON "_pages_v_blocks_downloads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_parent_id_idx" ON "_pages_v_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_path_idx" ON "_pages_v_blocks_downloads" USING btree ("_path");
  CREATE INDEX "_pages_v_version_attachments_order_idx" ON "_pages_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_pages_v_version_attachments_parent_id_idx" ON "_pages_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_attachments_file_idx" ON "_pages_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories_deleted_at_idx" ON "categories" USING btree ("deleted_at");
  CREATE INDEX "feedback_updated_at_idx" ON "feedback" USING btree ("updated_at");
  CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");
  CREATE UNIQUE INDEX "consultations_public_token_idx" ON "consultations" USING btree ("public_token");
  CREATE INDEX "consultations_updated_at_idx" ON "consultations" USING btree ("updated_at");
  CREATE INDEX "consultations_created_at_idx" ON "consultations" USING btree ("created_at");
  CREATE UNIQUE INDEX "feedback_categories_name_idx" ON "feedback_categories" USING btree ("name");
  CREATE INDEX "feedback_categories_department_idx" ON "feedback_categories" USING btree ("department_id");
  CREATE INDEX "feedback_categories_updated_at_idx" ON "feedback_categories" USING btree ("updated_at");
  CREATE INDEX "feedback_categories_created_at_idx" ON "feedback_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "feedback_cases_code_idx" ON "feedback_cases" USING btree ("code");
  CREATE INDEX "feedback_cases_category_idx" ON "feedback_cases" USING btree ("category_id");
  CREATE INDEX "feedback_cases_department_idx" ON "feedback_cases" USING btree ("department_id");
  CREATE INDEX "feedback_cases_assignee_idx" ON "feedback_cases" USING btree ("assignee_id");
  CREATE INDEX "feedback_cases_updated_at_idx" ON "feedback_cases" USING btree ("updated_at");
  CREATE INDEX "feedback_cases_created_at_idx" ON "feedback_cases" USING btree ("created_at");
  CREATE INDEX "feedback_actions_case_idx" ON "feedback_actions" USING btree ("case_id");
  CREATE INDEX "feedback_actions_performed_by_idx" ON "feedback_actions" USING btree ("performed_by_id");
  CREATE INDEX "feedback_actions_updated_at_idx" ON "feedback_actions" USING btree ("updated_at");
  CREATE INDEX "feedback_actions_created_at_idx" ON "feedback_actions" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_slug_idx" ON "forms" USING btree ("slug");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "form_submissions_public_code_idx" ON "form_submissions" USING btree ("public_code");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "chatbot_intents_phrases_order_idx" ON "chatbot_intents_phrases" USING btree ("_order");
  CREATE INDEX "chatbot_intents_phrases_parent_id_idx" ON "chatbot_intents_phrases" USING btree ("_parent_id");
  CREATE INDEX "chatbot_intents_updated_at_idx" ON "chatbot_intents" USING btree ("updated_at");
  CREATE INDEX "chatbot_intents_created_at_idx" ON "chatbot_intents" USING btree ("created_at");
  CREATE INDEX "chatbot_conversations_messages_order_idx" ON "chatbot_conversations_messages" USING btree ("_order");
  CREATE INDEX "chatbot_conversations_messages_parent_id_idx" ON "chatbot_conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "chatbot_conversations_session_id_idx" ON "chatbot_conversations" USING btree ("session_id");
  CREATE INDEX "chatbot_conversations_updated_at_idx" ON "chatbot_conversations" USING btree ("updated_at");
  CREATE INDEX "chatbot_conversations_created_at_idx" ON "chatbot_conversations" USING btree ("created_at");
  CREATE INDEX "chatbot_unanswered_normalized_question_idx" ON "chatbot_unanswered" USING btree ("normalized_question");
  CREATE INDEX "chatbot_unanswered_intent_idx" ON "chatbot_unanswered" USING btree ("intent_id");
  CREATE INDEX "chatbot_unanswered_updated_at_idx" ON "chatbot_unanswered" USING btree ("updated_at");
  CREATE INDEX "chatbot_unanswered_created_at_idx" ON "chatbot_unanswered" USING btree ("created_at");
  CREATE UNIQUE INDEX "survey_templates_slug_idx" ON "survey_templates" USING btree ("slug");
  CREATE INDEX "survey_templates_current_version_idx" ON "survey_templates" USING btree ("current_version_id");
  CREATE INDEX "survey_templates_updated_at_idx" ON "survey_templates" USING btree ("updated_at");
  CREATE INDEX "survey_templates_created_at_idx" ON "survey_templates" USING btree ("created_at");
  CREATE INDEX "survey_template_versions_template_idx" ON "survey_template_versions" USING btree ("template_id");
  CREATE INDEX "survey_template_versions_updated_at_idx" ON "survey_template_versions" USING btree ("updated_at");
  CREATE INDEX "survey_template_versions_created_at_idx" ON "survey_template_versions" USING btree ("created_at");
  CREATE INDEX "survey_template_versions_rels_order_idx" ON "survey_template_versions_rels" USING btree ("order");
  CREATE INDEX "survey_template_versions_rels_parent_idx" ON "survey_template_versions_rels" USING btree ("parent_id");
  CREATE INDEX "survey_template_versions_rels_path_idx" ON "survey_template_versions_rels" USING btree ("path");
  CREATE INDEX "survey_template_versions_rels_survey_questions_id_idx" ON "survey_template_versions_rels" USING btree ("survey_questions_id");
  CREATE INDEX "survey_questions_options_order_idx" ON "survey_questions_options" USING btree ("_order");
  CREATE INDEX "survey_questions_options_parent_id_idx" ON "survey_questions_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "survey_questions_code_idx" ON "survey_questions" USING btree ("code");
  CREATE INDEX "survey_questions_updated_at_idx" ON "survey_questions" USING btree ("updated_at");
  CREATE INDEX "survey_questions_created_at_idx" ON "survey_questions" USING btree ("created_at");
  CREATE UNIQUE INDEX "survey_campaigns_slug_idx" ON "survey_campaigns" USING btree ("slug");
  CREATE INDEX "survey_campaigns_template_version_idx" ON "survey_campaigns" USING btree ("template_version_id");
  CREATE INDEX "survey_campaigns_department_idx" ON "survey_campaigns" USING btree ("department_id");
  CREATE INDEX "survey_campaigns_updated_at_idx" ON "survey_campaigns" USING btree ("updated_at");
  CREATE INDEX "survey_campaigns_created_at_idx" ON "survey_campaigns" USING btree ("created_at");
  CREATE UNIQUE INDEX "survey_codes_code_idx" ON "survey_codes" USING btree ("code");
  CREATE INDEX "survey_codes_campaign_idx" ON "survey_codes" USING btree ("campaign_id");
  CREATE INDEX "survey_codes_department_idx" ON "survey_codes" USING btree ("department_id");
  CREATE INDEX "survey_codes_updated_at_idx" ON "survey_codes" USING btree ("updated_at");
  CREATE INDEX "survey_codes_created_at_idx" ON "survey_codes" USING btree ("created_at");
  CREATE UNIQUE INDEX "survey_responses_response_code_idx" ON "survey_responses" USING btree ("response_code");
  CREATE INDEX "survey_responses_campaign_idx" ON "survey_responses" USING btree ("campaign_id");
  CREATE INDEX "survey_responses_template_version_idx" ON "survey_responses" USING btree ("template_version_id");
  CREATE INDEX "survey_responses_survey_code_idx" ON "survey_responses" USING btree ("survey_code_id");
  CREATE INDEX "survey_responses_department_idx" ON "survey_responses" USING btree ("department_id");
  CREATE INDEX "survey_responses_updated_at_idx" ON "survey_responses" USING btree ("updated_at");
  CREATE INDEX "survey_responses_created_at_idx" ON "survey_responses" USING btree ("created_at");
  CREATE INDEX "survey_answers_response_idx" ON "survey_answers" USING btree ("response_id");
  CREATE INDEX "survey_answers_question_idx" ON "survey_answers" USING btree ("question_id");
  CREATE INDEX "survey_answers_updated_at_idx" ON "survey_answers" USING btree ("updated_at");
  CREATE INDEX "survey_answers_created_at_idx" ON "survey_answers" USING btree ("created_at");
  CREATE INDEX "survey_statistics_campaign_idx" ON "survey_statistics" USING btree ("campaign_id");
  CREATE INDEX "survey_statistics_department_idx" ON "survey_statistics" USING btree ("department_id");
  CREATE INDEX "survey_statistics_updated_at_idx" ON "survey_statistics" USING btree ("updated_at");
  CREATE INDEX "survey_statistics_created_at_idx" ON "survey_statistics" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_path_idx" ON "redirects" USING btree ("from_path");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_deleted_at_idx" ON "redirects" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "dynamic_modules_slug_idx" ON "dynamic_modules" USING btree ("slug");
  CREATE INDEX "dynamic_modules_image_idx" ON "dynamic_modules" USING btree ("image_id");
  CREATE INDEX "dynamic_modules_seo_image_idx" ON "dynamic_modules" USING btree ("seo_image_id");
  CREATE INDEX "dynamic_modules_updated_at_idx" ON "dynamic_modules" USING btree ("updated_at");
  CREATE INDEX "dynamic_modules_created_at_idx" ON "dynamic_modules" USING btree ("created_at");
  CREATE INDEX "dynamic_modules_deleted_at_idx" ON "dynamic_modules" USING btree ("deleted_at");
  CREATE INDEX "dynamic_modules__status_idx" ON "dynamic_modules" USING btree ("_status");
  CREATE INDEX "_dynamic_modules_v_parent_idx" ON "_dynamic_modules_v" USING btree ("parent_id");
  CREATE INDEX "_dynamic_modules_v_version_version_slug_idx" ON "_dynamic_modules_v" USING btree ("version_slug");
  CREATE INDEX "_dynamic_modules_v_version_version_image_idx" ON "_dynamic_modules_v" USING btree ("version_image_id");
  CREATE INDEX "_dynamic_modules_v_version_version_seo_image_idx" ON "_dynamic_modules_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_dynamic_modules_v_version_version_updated_at_idx" ON "_dynamic_modules_v" USING btree ("version_updated_at");
  CREATE INDEX "_dynamic_modules_v_version_version_created_at_idx" ON "_dynamic_modules_v" USING btree ("version_created_at");
  CREATE INDEX "_dynamic_modules_v_version_version_deleted_at_idx" ON "_dynamic_modules_v" USING btree ("version_deleted_at");
  CREATE INDEX "_dynamic_modules_v_version_version__status_idx" ON "_dynamic_modules_v" USING btree ("version__status");
  CREATE INDEX "_dynamic_modules_v_created_at_idx" ON "_dynamic_modules_v" USING btree ("created_at");
  CREATE INDEX "_dynamic_modules_v_updated_at_idx" ON "_dynamic_modules_v" USING btree ("updated_at");
  CREATE INDEX "_dynamic_modules_v_latest_idx" ON "_dynamic_modules_v" USING btree ("latest");
  CREATE INDEX "_dynamic_modules_v_autosave_idx" ON "_dynamic_modules_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "content_sections_slug_idx" ON "content_sections" USING btree ("slug");
  CREATE INDEX "content_sections_default_image_idx" ON "content_sections" USING btree ("default_image_id");
  CREATE INDEX "content_sections_seo_image_idx" ON "content_sections" USING btree ("seo_image_id");
  CREATE INDEX "content_sections_updated_at_idx" ON "content_sections" USING btree ("updated_at");
  CREATE INDEX "content_sections_created_at_idx" ON "content_sections" USING btree ("created_at");
  CREATE INDEX "content_sections_deleted_at_idx" ON "content_sections" USING btree ("deleted_at");
  CREATE INDEX "content_sections__status_idx" ON "content_sections" USING btree ("_status");
  CREATE INDEX "_content_sections_v_parent_idx" ON "_content_sections_v" USING btree ("parent_id");
  CREATE INDEX "_content_sections_v_version_version_slug_idx" ON "_content_sections_v" USING btree ("version_slug");
  CREATE INDEX "_content_sections_v_version_version_default_image_idx" ON "_content_sections_v" USING btree ("version_default_image_id");
  CREATE INDEX "_content_sections_v_version_version_seo_image_idx" ON "_content_sections_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_content_sections_v_version_version_updated_at_idx" ON "_content_sections_v" USING btree ("version_updated_at");
  CREATE INDEX "_content_sections_v_version_version_created_at_idx" ON "_content_sections_v" USING btree ("version_created_at");
  CREATE INDEX "_content_sections_v_version_version_deleted_at_idx" ON "_content_sections_v" USING btree ("version_deleted_at");
  CREATE INDEX "_content_sections_v_version_version__status_idx" ON "_content_sections_v" USING btree ("version__status");
  CREATE INDEX "_content_sections_v_created_at_idx" ON "_content_sections_v" USING btree ("created_at");
  CREATE INDEX "_content_sections_v_updated_at_idx" ON "_content_sections_v" USING btree ("updated_at");
  CREATE INDEX "_content_sections_v_latest_idx" ON "_content_sections_v" USING btree ("latest");
  CREATE INDEX "_content_sections_v_autosave_idx" ON "_content_sections_v" USING btree ("autosave");
  CREATE INDEX "custom_posts_attachments_order_idx" ON "custom_posts_attachments" USING btree ("_order");
  CREATE INDEX "custom_posts_attachments_parent_id_idx" ON "custom_posts_attachments" USING btree ("_parent_id");
  CREATE INDEX "custom_posts_attachments_file_idx" ON "custom_posts_attachments" USING btree ("file_id");
  CREATE INDEX "custom_posts_section_idx" ON "custom_posts" USING btree ("section_id");
  CREATE UNIQUE INDEX "custom_posts_slug_idx" ON "custom_posts" USING btree ("slug");
  CREATE INDEX "custom_posts_cover_idx" ON "custom_posts" USING btree ("cover_id");
  CREATE INDEX "custom_posts_seo_image_idx" ON "custom_posts" USING btree ("seo_image_id");
  CREATE INDEX "custom_posts_updated_at_idx" ON "custom_posts" USING btree ("updated_at");
  CREATE INDEX "custom_posts_created_at_idx" ON "custom_posts" USING btree ("created_at");
  CREATE INDEX "custom_posts_deleted_at_idx" ON "custom_posts" USING btree ("deleted_at");
  CREATE INDEX "custom_posts__status_idx" ON "custom_posts" USING btree ("_status");
  CREATE INDEX "_custom_posts_v_version_attachments_order_idx" ON "_custom_posts_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_custom_posts_v_version_attachments_parent_id_idx" ON "_custom_posts_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_custom_posts_v_version_attachments_file_idx" ON "_custom_posts_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_custom_posts_v_parent_idx" ON "_custom_posts_v" USING btree ("parent_id");
  CREATE INDEX "_custom_posts_v_version_version_section_idx" ON "_custom_posts_v" USING btree ("version_section_id");
  CREATE INDEX "_custom_posts_v_version_version_slug_idx" ON "_custom_posts_v" USING btree ("version_slug");
  CREATE INDEX "_custom_posts_v_version_version_cover_idx" ON "_custom_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_custom_posts_v_version_version_seo_image_idx" ON "_custom_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_custom_posts_v_version_version_updated_at_idx" ON "_custom_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_custom_posts_v_version_version_created_at_idx" ON "_custom_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_custom_posts_v_version_version_deleted_at_idx" ON "_custom_posts_v" USING btree ("version_deleted_at");
  CREATE INDEX "_custom_posts_v_version_version__status_idx" ON "_custom_posts_v" USING btree ("version__status");
  CREATE INDEX "_custom_posts_v_created_at_idx" ON "_custom_posts_v" USING btree ("created_at");
  CREATE INDEX "_custom_posts_v_updated_at_idx" ON "_custom_posts_v" USING btree ("updated_at");
  CREATE INDEX "_custom_posts_v_latest_idx" ON "_custom_posts_v" USING btree ("latest");
  CREATE INDEX "_custom_posts_v_autosave_idx" ON "_custom_posts_v" USING btree ("autosave");
  CREATE INDEX "import_jobs_imported_by_idx" ON "import_jobs" USING btree ("imported_by_id");
  CREATE INDEX "import_jobs_updated_at_idx" ON "import_jobs" USING btree ("updated_at");
  CREATE INDEX "import_jobs_created_at_idx" ON "import_jobs" USING btree ("created_at");
  CREATE INDEX "audit_logs_summary_idx" ON "audit_logs" USING btree ("summary");
  CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
  CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");
  CREATE INDEX "audit_logs_document_id_idx" ON "audit_logs" USING btree ("document_id");
  CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_id");
  CREATE INDEX "audit_logs_actor_email_idx" ON "audit_logs" USING btree ("actor_email");
  CREATE INDEX "audit_logs_actor_role_idx" ON "audit_logs" USING btree ("actor_role");
  CREATE INDEX "audit_logs_ip_idx" ON "audit_logs" USING btree ("ip");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_notices_id_idx" ON "payload_locked_documents_rels" USING btree ("notices_id");
  CREATE INDEX "payload_locked_documents_rels_procurement_id_idx" ON "payload_locked_documents_rels" USING btree ("procurement_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_specialties_id_idx" ON "payload_locked_documents_rels" USING btree ("specialties_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_id_idx" ON "payload_locked_documents_rels" USING btree ("doctors_id");
  CREATE INDEX "payload_locked_documents_rels_schedules_id_idx" ON "payload_locked_documents_rels" USING btree ("schedules_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_service_prices_id_idx" ON "payload_locked_documents_rels" USING btree ("service_prices_id");
  CREATE INDEX "payload_locked_documents_rels_vaccinations_id_idx" ON "payload_locked_documents_rels" USING btree ("vaccinations_id");
  CREATE INDEX "payload_locked_documents_rels_vaccination_schedules_id_idx" ON "payload_locked_documents_rels" USING btree ("vaccination_schedules_id");
  CREATE INDEX "payload_locked_documents_rels_vaccines_id_idx" ON "payload_locked_documents_rels" USING btree ("vaccines_id");
  CREATE INDEX "payload_locked_documents_rels_vaccine_prices_id_idx" ON "payload_locked_documents_rels" USING btree ("vaccine_prices_id");
  CREATE INDEX "payload_locked_documents_rels_recruitment_id_idx" ON "payload_locked_documents_rels" USING btree ("recruitment_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_id");
  CREATE INDEX "payload_locked_documents_rels_consultations_id_idx" ON "payload_locked_documents_rels" USING btree ("consultations_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_categories_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_cases_id");
  CREATE INDEX "payload_locked_documents_rels_feedback_actions_id_idx" ON "payload_locked_documents_rels" USING btree ("feedback_actions_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_chatbot_intents_id_idx" ON "payload_locked_documents_rels" USING btree ("chatbot_intents_id");
  CREATE INDEX "payload_locked_documents_rels_chatbot_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("chatbot_conversations_id");
  CREATE INDEX "payload_locked_documents_rels_chatbot_unanswered_id_idx" ON "payload_locked_documents_rels" USING btree ("chatbot_unanswered_id");
  CREATE INDEX "payload_locked_documents_rels_survey_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_templates_id");
  CREATE INDEX "payload_locked_documents_rels_survey_template_versions_i_idx" ON "payload_locked_documents_rels" USING btree ("survey_template_versions_id");
  CREATE INDEX "payload_locked_documents_rels_survey_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_questions_id");
  CREATE INDEX "payload_locked_documents_rels_survey_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_survey_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_codes_id");
  CREATE INDEX "payload_locked_documents_rels_survey_responses_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_responses_id");
  CREATE INDEX "payload_locked_documents_rels_survey_answers_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_answers_id");
  CREATE INDEX "payload_locked_documents_rels_survey_statistics_id_idx" ON "payload_locked_documents_rels" USING btree ("survey_statistics_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_dynamic_modules_id_idx" ON "payload_locked_documents_rels" USING btree ("dynamic_modules_id");
  CREATE INDEX "payload_locked_documents_rels_content_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("content_sections_id");
  CREATE INDEX "payload_locked_documents_rels_custom_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("custom_posts_id");
  CREATE INDEX "payload_locked_documents_rels_import_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("import_jobs_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_header_contact_cards_order_idx" ON "site_settings_header_contact_cards" USING btree ("_order");
  CREATE INDEX "site_settings_header_contact_cards_parent_id_idx" ON "site_settings_header_contact_cards" USING btree ("_parent_id");
  CREATE INDEX "site_settings_header_contact_cards_custom_icon_idx" ON "site_settings_header_contact_cards" USING btree ("custom_icon_id");
  CREATE INDEX "site_settings_header_social_links_order_idx" ON "site_settings_header_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_header_social_links_parent_id_idx" ON "site_settings_header_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_header_social_links_custom_icon_idx" ON "site_settings_header_social_links" USING btree ("custom_icon_id");
  CREATE INDEX "site_settings_website_assistant_quick_topics_order_idx" ON "site_settings_website_assistant_quick_topics" USING btree ("_order");
  CREATE INDEX "site_settings_website_assistant_quick_topics_parent_id_idx" ON "site_settings_website_assistant_quick_topics" USING btree ("_parent_id");
  CREATE INDEX "site_settings_website_assistant_custom_answers_order_idx" ON "site_settings_website_assistant_custom_answers" USING btree ("_order");
  CREATE INDEX "site_settings_website_assistant_custom_answers_parent_id_idx" ON "site_settings_website_assistant_custom_answers" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_header_brand_appearance_header_brand_appea_idx" ON "site_settings" USING btree ("header_brand_appearance_background_image_id");
  CREATE INDEX "site_settings_header_banner_idx" ON "site_settings" USING btree ("header_banner_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_website_assistant_website_assistant_assist_idx" ON "site_settings" USING btree ("website_assistant_assistant_logo_id");
  CREATE INDEX "_site_settings_v_version_header_contact_cards_order_idx" ON "_site_settings_v_version_header_contact_cards" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_header_contact_cards_parent_id_idx" ON "_site_settings_v_version_header_contact_cards" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_header_contact_cards_custom_ico_idx" ON "_site_settings_v_version_header_contact_cards" USING btree ("custom_icon_id");
  CREATE INDEX "_site_settings_v_version_header_social_links_order_idx" ON "_site_settings_v_version_header_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_header_social_links_parent_id_idx" ON "_site_settings_v_version_header_social_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_header_social_links_custom_icon_idx" ON "_site_settings_v_version_header_social_links" USING btree ("custom_icon_id");
  CREATE INDEX "_site_settings_v_version_website_assistant_quick_topics_order_idx" ON "_site_settings_v_version_website_assistant_quick_topics" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_website_assistant_quick_topics_parent_id_idx" ON "_site_settings_v_version_website_assistant_quick_topics" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_website_assistant_custom_answers_order_idx" ON "_site_settings_v_version_website_assistant_custom_answers" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_website_assistant_custom_answers_parent_id_idx" ON "_site_settings_v_version_website_assistant_custom_answers" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_header_brand_appearance_version_idx" ON "_site_settings_v" USING btree ("version_header_brand_appearance_background_image_id");
  CREATE INDEX "_site_settings_v_version_version_header_banner_idx" ON "_site_settings_v" USING btree ("version_header_banner_id");
  CREATE INDEX "_site_settings_v_version_version_favicon_idx" ON "_site_settings_v" USING btree ("version_favicon_id");
  CREATE INDEX "_site_settings_v_version_website_assistant_version_websi_idx" ON "_site_settings_v" USING btree ("version_website_assistant_assistant_logo_id");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "navigation_items_children_order_idx" ON "navigation_items_children" USING btree ("_order");
  CREATE INDEX "navigation_items_children_parent_id_idx" ON "navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_children_content_section_idx" ON "navigation_items_children" USING btree ("content_section_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_content_section_idx" ON "navigation_items" USING btree ("content_section_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_pages_id_idx" ON "navigation_rels" USING btree ("pages_id");
  CREATE INDEX "navigation_rels_news_id_idx" ON "navigation_rels" USING btree ("news_id");
  CREATE INDEX "navigation_rels_notices_id_idx" ON "navigation_rels" USING btree ("notices_id");
  CREATE INDEX "navigation_rels_procurement_id_idx" ON "navigation_rels" USING btree ("procurement_id");
  CREATE INDEX "navigation_rels_recruitment_id_idx" ON "navigation_rels" USING btree ("recruitment_id");
  CREATE INDEX "navigation_rels_documents_id_idx" ON "navigation_rels" USING btree ("documents_id");
  CREATE INDEX "navigation_rels_departments_id_idx" ON "navigation_rels" USING btree ("departments_id");
  CREATE INDEX "navigation_rels_specialties_id_idx" ON "navigation_rels" USING btree ("specialties_id");
  CREATE INDEX "navigation_rels_doctors_id_idx" ON "navigation_rels" USING btree ("doctors_id");
  CREATE INDEX "_navigation_v_version_items_children_order_idx" ON "_navigation_v_version_items_children" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_items_children_parent_id_idx" ON "_navigation_v_version_items_children" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_items_children_content_section_idx" ON "_navigation_v_version_items_children" USING btree ("content_section_id");
  CREATE INDEX "_navigation_v_version_items_order_idx" ON "_navigation_v_version_items" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_items_parent_id_idx" ON "_navigation_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_items_content_section_idx" ON "_navigation_v_version_items" USING btree ("content_section_id");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_rels_order_idx" ON "_navigation_v_rels" USING btree ("order");
  CREATE INDEX "_navigation_v_rels_parent_idx" ON "_navigation_v_rels" USING btree ("parent_id");
  CREATE INDEX "_navigation_v_rels_path_idx" ON "_navigation_v_rels" USING btree ("path");
  CREATE INDEX "_navigation_v_rels_pages_id_idx" ON "_navigation_v_rels" USING btree ("pages_id");
  CREATE INDEX "_navigation_v_rels_news_id_idx" ON "_navigation_v_rels" USING btree ("news_id");
  CREATE INDEX "_navigation_v_rels_notices_id_idx" ON "_navigation_v_rels" USING btree ("notices_id");
  CREATE INDEX "_navigation_v_rels_procurement_id_idx" ON "_navigation_v_rels" USING btree ("procurement_id");
  CREATE INDEX "_navigation_v_rels_recruitment_id_idx" ON "_navigation_v_rels" USING btree ("recruitment_id");
  CREATE INDEX "_navigation_v_rels_documents_id_idx" ON "_navigation_v_rels" USING btree ("documents_id");
  CREATE INDEX "_navigation_v_rels_departments_id_idx" ON "_navigation_v_rels" USING btree ("departments_id");
  CREATE INDEX "_navigation_v_rels_specialties_id_idx" ON "_navigation_v_rels" USING btree ("specialties_id");
  CREATE INDEX "_navigation_v_rels_doctors_id_idx" ON "_navigation_v_rels" USING btree ("doctors_id");
  CREATE INDEX "header_contact_cards_order_idx" ON "header_contact_cards" USING btree ("_order");
  CREATE INDEX "header_contact_cards_parent_id_idx" ON "header_contact_cards" USING btree ("_parent_id");
  CREATE INDEX "header_contact_cards_custom_icon_idx" ON "header_contact_cards" USING btree ("custom_icon_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "_header_v_version_contact_cards_order_idx" ON "_header_v_version_contact_cards" USING btree ("_order");
  CREATE INDEX "_header_v_version_contact_cards_parent_id_idx" ON "_header_v_version_contact_cards" USING btree ("_parent_id");
  CREATE INDEX "_header_v_version_contact_cards_custom_icon_idx" ON "_header_v_version_contact_cards" USING btree ("custom_icon_id");
  CREATE INDEX "_header_v_version_version_logo_idx" ON "_header_v" USING btree ("version_logo_id");
  CREATE INDEX "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");
  CREATE INDEX "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_linked_page_idx" ON "footer_columns_links" USING btree ("linked_page_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_columns_links_order_idx" ON "_footer_v_version_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_links_parent_id_idx" ON "_footer_v_version_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_columns_links_linked_page_idx" ON "_footer_v_version_columns_links" USING btree ("linked_page_id");
  CREATE INDEX "_footer_v_version_columns_order_idx" ON "_footer_v_version_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_parent_id_idx" ON "_footer_v_version_columns" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_contact_settings_v_created_at_idx" ON "_contact_settings_v" USING btree ("created_at");
  CREATE INDEX "_contact_settings_v_updated_at_idx" ON "_contact_settings_v" USING btree ("updated_at");
  CREATE INDEX "_social_settings_v_created_at_idx" ON "_social_settings_v" USING btree ("created_at");
  CREATE INDEX "_social_settings_v_updated_at_idx" ON "_social_settings_v" USING btree ("updated_at");
  CREATE INDEX "_medpro_settings_v_created_at_idx" ON "_medpro_settings_v" USING btree ("created_at");
  CREATE INDEX "_medpro_settings_v_updated_at_idx" ON "_medpro_settings_v" USING btree ("updated_at");
  CREATE INDEX "_theme_settings_v_created_at_idx" ON "_theme_settings_v" USING btree ("created_at");
  CREATE INDEX "_theme_settings_v_updated_at_idx" ON "_theme_settings_v" USING btree ("updated_at");
  CREATE INDEX "homepage_banners_order_idx" ON "homepage_banners" USING btree ("_order");
  CREATE INDEX "homepage_banners_parent_id_idx" ON "homepage_banners" USING btree ("_parent_id");
  CREATE INDEX "homepage_banners_desktop_image_idx" ON "homepage_banners" USING btree ("desktop_image_id");
  CREATE INDEX "homepage_banners_mobile_image_idx" ON "homepage_banners" USING btree ("mobile_image_id");
  CREATE INDEX "homepage_quick_links_order_idx" ON "homepage_quick_links" USING btree ("_order");
  CREATE INDEX "homepage_quick_links_parent_id_idx" ON "homepage_quick_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_quick_links_image_idx" ON "homepage_quick_links" USING btree ("image_id");
  CREATE INDEX "homepage_stats_order_idx" ON "homepage_stats" USING btree ("_order");
  CREATE INDEX "homepage_stats_parent_id_idx" ON "homepage_stats" USING btree ("_parent_id");
  CREATE INDEX "content_values_order_idx" ON "content_values" USING btree ("_order");
  CREATE INDEX "content_values_parent_id_idx" ON "content_values" USING btree ("_parent_id");
  CREATE INDEX "news_manual_order_idx" ON "news_manual" USING btree ("_order");
  CREATE INDEX "news_manual_parent_id_idx" ON "news_manual" USING btree ("_parent_id");
  CREATE INDEX "news_manual_linked_page_idx" ON "news_manual" USING btree ("linked_page_id");
  CREATE INDEX "news_manual_image_idx" ON "news_manual" USING btree ("image_id");
  CREATE INDEX "content_tabs_order_idx" ON "content_tabs" USING btree ("_order");
  CREATE INDEX "content_tabs_parent_id_idx" ON "content_tabs" USING btree ("_parent_id");
  CREATE INDEX "dept_values_order_idx" ON "dept_values" USING btree ("_order");
  CREATE INDEX "dept_values_parent_id_idx" ON "dept_values" USING btree ("_parent_id");
  CREATE INDEX "dept_manual_order_idx" ON "dept_manual" USING btree ("_order");
  CREATE INDEX "dept_manual_parent_id_idx" ON "dept_manual" USING btree ("_parent_id");
  CREATE INDEX "dept_manual_linked_page_idx" ON "dept_manual" USING btree ("linked_page_id");
  CREATE INDEX "dept_tabs_order_idx" ON "dept_tabs" USING btree ("_order");
  CREATE INDEX "dept_tabs_parent_id_idx" ON "dept_tabs" USING btree ("_parent_id");
  CREATE INDEX "schedule_manual_order_idx" ON "schedule_manual" USING btree ("_order");
  CREATE INDEX "schedule_manual_parent_id_idx" ON "schedule_manual" USING btree ("_parent_id");
  CREATE INDEX "schedule_manual_linked_page_idx" ON "schedule_manual" USING btree ("linked_page_id");
  CREATE INDEX "schedule_manual_image_idx" ON "schedule_manual" USING btree ("image_id");
  CREATE INDEX "homepage_sections_schedule_tab_order_order_idx" ON "homepage_sections_schedule_tab_order" USING btree ("_order");
  CREATE INDEX "homepage_sections_schedule_tab_order_parent_id_idx" ON "homepage_sections_schedule_tab_order" USING btree ("_parent_id");
  CREATE INDEX "vaccine_manual_order_idx" ON "vaccine_manual" USING btree ("_order");
  CREATE INDEX "vaccine_manual_parent_id_idx" ON "vaccine_manual" USING btree ("_parent_id");
  CREATE INDEX "vaccine_manual_linked_page_idx" ON "vaccine_manual" USING btree ("linked_page_id");
  CREATE INDEX "vaccine_manual_image_idx" ON "vaccine_manual" USING btree ("image_id");
  CREATE INDEX "homepage_sections_vaccination_tab_order_order_idx" ON "homepage_sections_vaccination_tab_order" USING btree ("_order");
  CREATE INDEX "homepage_sections_vaccination_tab_order_parent_id_idx" ON "homepage_sections_vaccination_tab_order" USING btree ("_parent_id");
  CREATE INDEX "homepage_sections_order_idx" ON "homepage_sections" USING btree ("_order");
  CREATE INDEX "homepage_sections_parent_id_idx" ON "homepage_sections" USING btree ("_parent_id");
  CREATE INDEX "homepage_sections_organization_image_idx" ON "homepage_sections" USING btree ("organization_image_id");
  CREATE INDEX "homepage_sections_linked_content_section_idx" ON "homepage_sections" USING btree ("linked_content_section_id");
  CREATE INDEX "homepage_sections_dynamic_module_idx" ON "homepage_sections" USING btree ("dynamic_module_id");
  CREATE INDEX "homepage_sections_custom_image_idx" ON "homepage_sections" USING btree ("custom_image_id");
  CREATE INDEX "homepage_sections_button_page_idx" ON "homepage_sections" USING btree ("button_page_id");
  CREATE INDEX "homepage_hero_hero_desktop_image_idx" ON "homepage" USING btree ("hero_desktop_image_id");
  CREATE INDEX "homepage_hero_hero_mobile_image_idx" ON "homepage" USING btree ("hero_mobile_image_id");
  CREATE INDEX "homepage_intro_intro_image_idx" ON "homepage" USING btree ("intro_image_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "_homepage_v_version_banners_order_idx" ON "_homepage_v_version_banners" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_banners_parent_id_idx" ON "_homepage_v_version_banners" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_banners_desktop_image_idx" ON "_homepage_v_version_banners" USING btree ("desktop_image_id");
  CREATE INDEX "_homepage_v_version_banners_mobile_image_idx" ON "_homepage_v_version_banners" USING btree ("mobile_image_id");
  CREATE INDEX "_homepage_v_version_quick_links_order_idx" ON "_homepage_v_version_quick_links" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_quick_links_parent_id_idx" ON "_homepage_v_version_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_quick_links_image_idx" ON "_homepage_v_version_quick_links" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_stats_order_idx" ON "_homepage_v_version_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_stats_parent_id_idx" ON "_homepage_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_content_values_v_order_idx" ON "_content_values_v" USING btree ("_order");
  CREATE INDEX "_content_values_v_parent_id_idx" ON "_content_values_v" USING btree ("_parent_id");
  CREATE INDEX "_news_manual_v_order_idx" ON "_news_manual_v" USING btree ("_order");
  CREATE INDEX "_news_manual_v_parent_id_idx" ON "_news_manual_v" USING btree ("_parent_id");
  CREATE INDEX "_news_manual_v_linked_page_idx" ON "_news_manual_v" USING btree ("linked_page_id");
  CREATE INDEX "_news_manual_v_image_idx" ON "_news_manual_v" USING btree ("image_id");
  CREATE INDEX "_content_tabs_v_order_idx" ON "_content_tabs_v" USING btree ("_order");
  CREATE INDEX "_content_tabs_v_parent_id_idx" ON "_content_tabs_v" USING btree ("_parent_id");
  CREATE INDEX "_dept_values_v_order_idx" ON "_dept_values_v" USING btree ("_order");
  CREATE INDEX "_dept_values_v_parent_id_idx" ON "_dept_values_v" USING btree ("_parent_id");
  CREATE INDEX "_dept_manual_v_order_idx" ON "_dept_manual_v" USING btree ("_order");
  CREATE INDEX "_dept_manual_v_parent_id_idx" ON "_dept_manual_v" USING btree ("_parent_id");
  CREATE INDEX "_dept_manual_v_linked_page_idx" ON "_dept_manual_v" USING btree ("linked_page_id");
  CREATE INDEX "_dept_tabs_v_order_idx" ON "_dept_tabs_v" USING btree ("_order");
  CREATE INDEX "_dept_tabs_v_parent_id_idx" ON "_dept_tabs_v" USING btree ("_parent_id");
  CREATE INDEX "_schedule_manual_v_order_idx" ON "_schedule_manual_v" USING btree ("_order");
  CREATE INDEX "_schedule_manual_v_parent_id_idx" ON "_schedule_manual_v" USING btree ("_parent_id");
  CREATE INDEX "_schedule_manual_v_linked_page_idx" ON "_schedule_manual_v" USING btree ("linked_page_id");
  CREATE INDEX "_schedule_manual_v_image_idx" ON "_schedule_manual_v" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_sections_schedule_tab_order_order_idx" ON "_homepage_v_version_sections_schedule_tab_order" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_sections_schedule_tab_order_parent_id_idx" ON "_homepage_v_version_sections_schedule_tab_order" USING btree ("_parent_id");
  CREATE INDEX "_vaccine_manual_v_order_idx" ON "_vaccine_manual_v" USING btree ("_order");
  CREATE INDEX "_vaccine_manual_v_parent_id_idx" ON "_vaccine_manual_v" USING btree ("_parent_id");
  CREATE INDEX "_vaccine_manual_v_linked_page_idx" ON "_vaccine_manual_v" USING btree ("linked_page_id");
  CREATE INDEX "_vaccine_manual_v_image_idx" ON "_vaccine_manual_v" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_sections_vaccination_tab_order_order_idx" ON "_homepage_v_version_sections_vaccination_tab_order" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_sections_vaccination_tab_order_parent_id_idx" ON "_homepage_v_version_sections_vaccination_tab_order" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_sections_order_idx" ON "_homepage_v_version_sections" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_sections_parent_id_idx" ON "_homepage_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_sections_organization_image_idx" ON "_homepage_v_version_sections" USING btree ("organization_image_id");
  CREATE INDEX "_homepage_v_version_sections_linked_content_section_idx" ON "_homepage_v_version_sections" USING btree ("linked_content_section_id");
  CREATE INDEX "_homepage_v_version_sections_dynamic_module_idx" ON "_homepage_v_version_sections" USING btree ("dynamic_module_id");
  CREATE INDEX "_homepage_v_version_sections_custom_image_idx" ON "_homepage_v_version_sections" USING btree ("custom_image_id");
  CREATE INDEX "_homepage_v_version_sections_button_page_idx" ON "_homepage_v_version_sections" USING btree ("button_page_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_desktop_image_idx" ON "_homepage_v" USING btree ("version_hero_desktop_image_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_mobile_image_idx" ON "_homepage_v" USING btree ("version_hero_mobile_image_id");
  CREATE INDEX "_homepage_v_version_intro_version_intro_image_idx" ON "_homepage_v" USING btree ("version_intro_image_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "organization_chart_deputy_directors_order_idx" ON "organization_chart_deputy_directors" USING btree ("_order");
  CREATE INDEX "organization_chart_deputy_directors_parent_id_idx" ON "organization_chart_deputy_directors" USING btree ("_parent_id");
  CREATE INDEX "organization_chart_deputy_directors_photo_idx" ON "organization_chart_deputy_directors" USING btree ("photo_id");
  CREATE INDEX "organization_chart_offices_order_idx" ON "organization_chart_offices" USING btree ("_order");
  CREATE INDEX "organization_chart_offices_parent_id_idx" ON "organization_chart_offices" USING btree ("_parent_id");
  CREATE INDEX "organization_chart_offices_unit_idx" ON "organization_chart_offices" USING btree ("unit_id");
  CREATE INDEX "organization_chart_departments_order_idx" ON "organization_chart_departments" USING btree ("_order");
  CREATE INDEX "organization_chart_departments_parent_id_idx" ON "organization_chart_departments" USING btree ("_parent_id");
  CREATE INDEX "organization_chart_departments_unit_idx" ON "organization_chart_departments" USING btree ("unit_id");
  CREATE INDEX "organization_chart_director_director_photo_idx" ON "organization_chart" USING btree ("director_photo_id");
  CREATE INDEX "_organization_chart_v_version_deputy_directors_order_idx" ON "_organization_chart_v_version_deputy_directors" USING btree ("_order");
  CREATE INDEX "_organization_chart_v_version_deputy_directors_parent_id_idx" ON "_organization_chart_v_version_deputy_directors" USING btree ("_parent_id");
  CREATE INDEX "_organization_chart_v_version_deputy_directors_photo_idx" ON "_organization_chart_v_version_deputy_directors" USING btree ("photo_id");
  CREATE INDEX "_organization_chart_v_version_offices_order_idx" ON "_organization_chart_v_version_offices" USING btree ("_order");
  CREATE INDEX "_organization_chart_v_version_offices_parent_id_idx" ON "_organization_chart_v_version_offices" USING btree ("_parent_id");
  CREATE INDEX "_organization_chart_v_version_offices_unit_idx" ON "_organization_chart_v_version_offices" USING btree ("unit_id");
  CREATE INDEX "_organization_chart_v_version_departments_order_idx" ON "_organization_chart_v_version_departments" USING btree ("_order");
  CREATE INDEX "_organization_chart_v_version_departments_parent_id_idx" ON "_organization_chart_v_version_departments" USING btree ("_parent_id");
  CREATE INDEX "_organization_chart_v_version_departments_unit_idx" ON "_organization_chart_v_version_departments" USING btree ("unit_id");
  CREATE INDEX "_organization_chart_v_version_director_version_director__idx" ON "_organization_chart_v" USING btree ("version_director_photo_id");
  CREATE INDEX "_organization_chart_v_created_at_idx" ON "_organization_chart_v" USING btree ("created_at");
  CREATE INDEX "_organization_chart_v_updated_at_idx" ON "_organization_chart_v" USING btree ("updated_at");
  CREATE INDEX "default_media_settings_custom_defaults_order_idx" ON "default_media_settings_custom_defaults" USING btree ("_order");
  CREATE INDEX "default_media_settings_custom_defaults_parent_id_idx" ON "default_media_settings_custom_defaults" USING btree ("_parent_id");
  CREATE INDEX "default_media_settings_custom_defaults_image_idx" ON "default_media_settings_custom_defaults" USING btree ("image_id");
  CREATE INDEX "default_media_settings_news_idx" ON "default_media_settings" USING btree ("news_id");
  CREATE INDEX "default_media_settings_notices_idx" ON "default_media_settings" USING btree ("notices_id");
  CREATE INDEX "default_media_settings_procurement_idx" ON "default_media_settings" USING btree ("procurement_id");
  CREATE INDEX "default_media_settings_recruitment_idx" ON "default_media_settings" USING btree ("recruitment_id");
  CREATE INDEX "default_media_settings_documents_idx" ON "default_media_settings" USING btree ("documents_id");
  CREATE INDEX "default_media_settings_schedules_idx" ON "default_media_settings" USING btree ("schedules_id");
  CREATE INDEX "default_media_settings_vaccinations_idx" ON "default_media_settings" USING btree ("vaccinations_id");
  CREATE INDEX "seo_settings_robots_disallow_order_idx" ON "seo_settings_robots_disallow" USING btree ("_order");
  CREATE INDEX "seo_settings_robots_disallow_parent_id_idx" ON "seo_settings_robots_disallow" USING btree ("_parent_id");
  CREATE INDEX "seo_settings_default_image_idx" ON "seo_settings" USING btree ("default_image_id");
  CREATE INDEX "seo_settings__status_idx" ON "seo_settings" USING btree ("_status");
  CREATE INDEX "_seo_settings_v_version_robots_disallow_order_idx" ON "_seo_settings_v_version_robots_disallow" USING btree ("_order");
  CREATE INDEX "_seo_settings_v_version_robots_disallow_parent_id_idx" ON "_seo_settings_v_version_robots_disallow" USING btree ("_parent_id");
  CREATE INDEX "_seo_settings_v_version_version_default_image_idx" ON "_seo_settings_v" USING btree ("version_default_image_id");
  CREATE INDEX "_seo_settings_v_version_version__status_idx" ON "_seo_settings_v" USING btree ("version__status");
  CREATE INDEX "_seo_settings_v_created_at_idx" ON "_seo_settings_v" USING btree ("created_at");
  CREATE INDEX "_seo_settings_v_updated_at_idx" ON "_seo_settings_v" USING btree ("updated_at");
  CREATE INDEX "_seo_settings_v_latest_idx" ON "_seo_settings_v" USING btree ("latest");
  CREATE INDEX "chatbot_settings_quick_topics_order_idx" ON "chatbot_settings_quick_topics" USING btree ("_order");
  CREATE INDEX "chatbot_settings_quick_topics_parent_id_idx" ON "chatbot_settings_quick_topics" USING btree ("_parent_id");
  CREATE INDEX "quick_links_settings_items_order_idx" ON "quick_links_settings_items" USING btree ("_order");
  CREATE INDEX "quick_links_settings_items_parent_id_idx" ON "quick_links_settings_items" USING btree ("_parent_id");
  CREATE INDEX "quick_links_settings_items_linked_page_idx" ON "quick_links_settings_items" USING btree ("linked_page_id");
  CREATE INDEX "quick_links_settings_items_image_idx" ON "quick_links_settings_items" USING btree ("image_id");
  CREATE INDEX "quick_links_settings__status_idx" ON "quick_links_settings" USING btree ("_status");
  CREATE INDEX "_quick_links_settings_v_version_items_order_idx" ON "_quick_links_settings_v_version_items" USING btree ("_order");
  CREATE INDEX "_quick_links_settings_v_version_items_parent_id_idx" ON "_quick_links_settings_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_quick_links_settings_v_version_items_linked_page_idx" ON "_quick_links_settings_v_version_items" USING btree ("linked_page_id");
  CREATE INDEX "_quick_links_settings_v_version_items_image_idx" ON "_quick_links_settings_v_version_items" USING btree ("image_id");
  CREATE INDEX "_quick_links_settings_v_version_version__status_idx" ON "_quick_links_settings_v" USING btree ("version__status");
  CREATE INDEX "_quick_links_settings_v_created_at_idx" ON "_quick_links_settings_v" USING btree ("created_at");
  CREATE INDEX "_quick_links_settings_v_updated_at_idx" ON "_quick_links_settings_v" USING btree ("updated_at");
  CREATE INDEX "_quick_links_settings_v_latest_idx" ON "_quick_links_settings_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_permissions_actions" CASCADE;
  DROP TABLE "users_permissions" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "news_attachments" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v_version_attachments" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "notices_attachments" CASCADE;
  DROP TABLE "notices" CASCADE;
  DROP TABLE "_notices_v_version_attachments" CASCADE;
  DROP TABLE "_notices_v" CASCADE;
  DROP TABLE "procurement_attachments" CASCADE;
  DROP TABLE "procurement_change_log" CASCADE;
  DROP TABLE "procurement" CASCADE;
  DROP TABLE "_procurement_v_version_attachments" CASCADE;
  DROP TABLE "_procurement_v_version_change_log" CASCADE;
  DROP TABLE "_procurement_v" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "_documents_v" CASCADE;
  DROP TABLE "departments_deputy_leaders" CASCADE;
  DROP TABLE "departments_gallery" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "_departments_v_version_deputy_leaders" CASCADE;
  DROP TABLE "_departments_v_version_gallery" CASCADE;
  DROP TABLE "_departments_v" CASCADE;
  DROP TABLE "specialties" CASCADE;
  DROP TABLE "_specialties_v" CASCADE;
  DROP TABLE "doctors" CASCADE;
  DROP TABLE "_doctors_v" CASCADE;
  DROP TABLE "schedules_weekly_slots" CASCADE;
  DROP TABLE "schedules_attachment_files" CASCADE;
  DROP TABLE "schedules" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "service_prices" CASCADE;
  DROP TABLE "_service_prices_v" CASCADE;
  DROP TABLE "vaccinations" CASCADE;
  DROP TABLE "vaccination_schedules" CASCADE;
  DROP TABLE "_vaccination_schedules_v" CASCADE;
  DROP TABLE "vaccines" CASCADE;
  DROP TABLE "_vaccines_v" CASCADE;
  DROP TABLE "vaccine_prices" CASCADE;
  DROP TABLE "_vaccine_prices_v" CASCADE;
  DROP TABLE "recruitment_attachments" CASCADE;
  DROP TABLE "recruitment" CASCADE;
  DROP TABLE "_recruitment_v_version_attachments" CASCADE;
  DROP TABLE "_recruitment_v" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_downloads_items" CASCADE;
  DROP TABLE "pages_blocks_downloads" CASCADE;
  DROP TABLE "pages_attachments" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_items" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads" CASCADE;
  DROP TABLE "_pages_v_version_attachments" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "feedback" CASCADE;
  DROP TABLE "consultations" CASCADE;
  DROP TABLE "feedback_categories" CASCADE;
  DROP TABLE "feedback_cases" CASCADE;
  DROP TABLE "feedback_actions" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "chatbot_intents_phrases" CASCADE;
  DROP TABLE "chatbot_intents" CASCADE;
  DROP TABLE "chatbot_conversations_messages" CASCADE;
  DROP TABLE "chatbot_conversations" CASCADE;
  DROP TABLE "chatbot_unanswered" CASCADE;
  DROP TABLE "survey_templates" CASCADE;
  DROP TABLE "survey_template_versions" CASCADE;
  DROP TABLE "survey_template_versions_rels" CASCADE;
  DROP TABLE "survey_questions_options" CASCADE;
  DROP TABLE "survey_questions" CASCADE;
  DROP TABLE "survey_campaigns" CASCADE;
  DROP TABLE "survey_codes" CASCADE;
  DROP TABLE "survey_responses" CASCADE;
  DROP TABLE "survey_answers" CASCADE;
  DROP TABLE "survey_statistics" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "dynamic_modules" CASCADE;
  DROP TABLE "_dynamic_modules_v" CASCADE;
  DROP TABLE "content_sections" CASCADE;
  DROP TABLE "_content_sections_v" CASCADE;
  DROP TABLE "custom_posts_attachments" CASCADE;
  DROP TABLE "custom_posts" CASCADE;
  DROP TABLE "_custom_posts_v_version_attachments" CASCADE;
  DROP TABLE "_custom_posts_v" CASCADE;
  DROP TABLE "import_jobs" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_header_contact_cards" CASCADE;
  DROP TABLE "site_settings_header_social_links" CASCADE;
  DROP TABLE "site_settings_website_assistant_quick_topics" CASCADE;
  DROP TABLE "site_settings_website_assistant_custom_answers" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_header_contact_cards" CASCADE;
  DROP TABLE "_site_settings_v_version_header_social_links" CASCADE;
  DROP TABLE "_site_settings_v_version_website_assistant_quick_topics" CASCADE;
  DROP TABLE "_site_settings_v_version_website_assistant_custom_answers" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "navigation_items_children" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "_navigation_v_version_items_children" CASCADE;
  DROP TABLE "_navigation_v_version_items" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "_navigation_v_rels" CASCADE;
  DROP TABLE "header_contact_cards" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "_header_v_version_contact_cards" CASCADE;
  DROP TABLE "_header_v" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v_version_columns_links" CASCADE;
  DROP TABLE "_footer_v_version_columns" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "contact_settings" CASCADE;
  DROP TABLE "_contact_settings_v" CASCADE;
  DROP TABLE "social_settings" CASCADE;
  DROP TABLE "_social_settings_v" CASCADE;
  DROP TABLE "medpro_settings" CASCADE;
  DROP TABLE "_medpro_settings_v" CASCADE;
  DROP TABLE "theme_settings" CASCADE;
  DROP TABLE "_theme_settings_v" CASCADE;
  DROP TABLE "homepage_banners" CASCADE;
  DROP TABLE "homepage_quick_links" CASCADE;
  DROP TABLE "homepage_stats" CASCADE;
  DROP TABLE "content_values" CASCADE;
  DROP TABLE "news_manual" CASCADE;
  DROP TABLE "content_tabs" CASCADE;
  DROP TABLE "dept_values" CASCADE;
  DROP TABLE "dept_manual" CASCADE;
  DROP TABLE "dept_tabs" CASCADE;
  DROP TABLE "schedule_manual" CASCADE;
  DROP TABLE "homepage_sections_schedule_tab_order" CASCADE;
  DROP TABLE "vaccine_manual" CASCADE;
  DROP TABLE "homepage_sections_vaccination_tab_order" CASCADE;
  DROP TABLE "homepage_sections" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "_homepage_v_version_banners" CASCADE;
  DROP TABLE "_homepage_v_version_quick_links" CASCADE;
  DROP TABLE "_homepage_v_version_stats" CASCADE;
  DROP TABLE "_content_values_v" CASCADE;
  DROP TABLE "_news_manual_v" CASCADE;
  DROP TABLE "_content_tabs_v" CASCADE;
  DROP TABLE "_dept_values_v" CASCADE;
  DROP TABLE "_dept_manual_v" CASCADE;
  DROP TABLE "_dept_tabs_v" CASCADE;
  DROP TABLE "_schedule_manual_v" CASCADE;
  DROP TABLE "_homepage_v_version_sections_schedule_tab_order" CASCADE;
  DROP TABLE "_vaccine_manual_v" CASCADE;
  DROP TABLE "_homepage_v_version_sections_vaccination_tab_order" CASCADE;
  DROP TABLE "_homepage_v_version_sections" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "organization_chart_deputy_directors" CASCADE;
  DROP TABLE "organization_chart_offices" CASCADE;
  DROP TABLE "organization_chart_departments" CASCADE;
  DROP TABLE "organization_chart" CASCADE;
  DROP TABLE "_organization_chart_v_version_deputy_directors" CASCADE;
  DROP TABLE "_organization_chart_v_version_offices" CASCADE;
  DROP TABLE "_organization_chart_v_version_departments" CASCADE;
  DROP TABLE "_organization_chart_v" CASCADE;
  DROP TABLE "upload_settings" CASCADE;
  DROP TABLE "default_media_settings_custom_defaults" CASCADE;
  DROP TABLE "default_media_settings" CASCADE;
  DROP TABLE "seo_settings_robots_disallow" CASCADE;
  DROP TABLE "seo_settings" CASCADE;
  DROP TABLE "_seo_settings_v_version_robots_disallow" CASCADE;
  DROP TABLE "_seo_settings_v" CASCADE;
  DROP TABLE "chatbot_settings_quick_topics" CASCADE;
  DROP TABLE "chatbot_settings" CASCADE;
  DROP TABLE "system_settings" CASCADE;
  DROP TABLE "schedule_settings" CASCADE;
  DROP TABLE "quick_links_settings_items" CASCADE;
  DROP TABLE "quick_links_settings" CASCADE;
  DROP TABLE "_quick_links_settings_v_version_items" CASCADE;
  DROP TABLE "_quick_links_settings_v" CASCADE;
  DROP TYPE "public"."enum_users_permissions_actions";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_media_group";
  DROP TYPE "public"."enum_media_access_level";
  DROP TYPE "public"."enum_news_workflow_state";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_workflow_state";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_notices_level";
  DROP TYPE "public"."enum_notices_workflow_state";
  DROP TYPE "public"."enum_notices_status";
  DROP TYPE "public"."enum__notices_v_version_level";
  DROP TYPE "public"."enum__notices_v_version_workflow_state";
  DROP TYPE "public"."enum__notices_v_version_status";
  DROP TYPE "public"."enum_procurement_type";
  DROP TYPE "public"."enum_procurement_procurement_status";
  DROP TYPE "public"."enum_procurement_workflow_state";
  DROP TYPE "public"."enum_procurement_status";
  DROP TYPE "public"."enum__procurement_v_version_type";
  DROP TYPE "public"."enum__procurement_v_version_procurement_status";
  DROP TYPE "public"."enum__procurement_v_version_workflow_state";
  DROP TYPE "public"."enum__procurement_v_version_status";
  DROP TYPE "public"."enum_departments_unit_type";
  DROP TYPE "public"."enum_departments_status";
  DROP TYPE "public"."enum__departments_v_version_unit_type";
  DROP TYPE "public"."enum__departments_v_version_status";
  DROP TYPE "public"."enum_specialties_status";
  DROP TYPE "public"."enum__specialties_v_version_status";
  DROP TYPE "public"."enum_doctors_status";
  DROP TYPE "public"."enum__doctors_v_version_status";
  DROP TYPE "public"."enum_schedules_weekly_slots_day_of_week";
  DROP TYPE "public"."enum_schedules_mode";
  DROP TYPE "public"."enum_schedules_schedule_type";
  DROP TYPE "public"."enum_vaccinations_entry_type";
  DROP TYPE "public"."enum_vaccinations_availability";
  DROP TYPE "public"."enum_vaccination_schedules_schedule_kind";
  DROP TYPE "public"."enum_vaccination_schedules_status";
  DROP TYPE "public"."enum__vaccination_schedules_v_version_schedule_kind";
  DROP TYPE "public"."enum__vaccination_schedules_v_version_status";
  DROP TYPE "public"."enum_vaccines_availability";
  DROP TYPE "public"."enum_vaccines_status";
  DROP TYPE "public"."enum__vaccines_v_version_availability";
  DROP TYPE "public"."enum__vaccines_v_version_status";
  DROP TYPE "public"."enum_recruitment_workflow_state";
  DROP TYPE "public"."enum_recruitment_status";
  DROP TYPE "public"."enum__recruitment_v_version_workflow_state";
  DROP TYPE "public"."enum__recruitment_v_version_status";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_position";
  DROP TYPE "public"."enum_pages_workflow_state";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_position";
  DROP TYPE "public"."enum__pages_v_version_workflow_state";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_categories_scope";
  DROP TYPE "public"."enum_feedback_type";
  DROP TYPE "public"."enum_feedback_status";
  DROP TYPE "public"."enum_consultations_status";
  DROP TYPE "public"."enum_feedback_categories_default_priority";
  DROP TYPE "public"."enum_feedback_cases_priority";
  DROP TYPE "public"."enum_feedback_cases_status";
  DROP TYPE "public"."enum_feedback_actions_action";
  DROP TYPE "public"."enum_forms_fields_type";
  DROP TYPE "public"."enum_form_submissions_status";
  DROP TYPE "public"."enum_chatbot_conversations_messages_from";
  DROP TYPE "public"."enum_survey_template_versions_status";
  DROP TYPE "public"."enum_survey_questions_type";
  DROP TYPE "public"."enum_dynamic_modules_workflow_state";
  DROP TYPE "public"."enum_dynamic_modules_status";
  DROP TYPE "public"."enum__dynamic_modules_v_version_workflow_state";
  DROP TYPE "public"."enum__dynamic_modules_v_version_status";
  DROP TYPE "public"."enum_content_sections_workflow_state";
  DROP TYPE "public"."enum_content_sections_status";
  DROP TYPE "public"."enum__content_sections_v_version_workflow_state";
  DROP TYPE "public"."enum__content_sections_v_version_status";
  DROP TYPE "public"."enum_custom_posts_workflow_state";
  DROP TYPE "public"."enum_custom_posts_status";
  DROP TYPE "public"."enum__custom_posts_v_version_workflow_state";
  DROP TYPE "public"."enum__custom_posts_v_version_status";
  DROP TYPE "public"."enum_import_jobs_module";
  DROP TYPE "public"."enum_import_jobs_status";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_site_settings_service_price_page_rows_per_page";
  DROP TYPE "public"."enum__site_settings_v_version_service_price_page_rows_per_page";
  DROP TYPE "public"."enum_navigation_items_children_link_type";
  DROP TYPE "public"."enum_navigation_items_children_preset";
  DROP TYPE "public"."enum_navigation_items_link_type";
  DROP TYPE "public"."enum_navigation_items_preset";
  DROP TYPE "public"."enum__navigation_v_version_items_children_link_type";
  DROP TYPE "public"."enum__navigation_v_version_items_children_preset";
  DROP TYPE "public"."enum__navigation_v_version_items_link_type";
  DROP TYPE "public"."enum__navigation_v_version_items_preset";
  DROP TYPE "public"."enum_header_contact_cards_icon_type";
  DROP TYPE "public"."enum_header_contact_cards_font_weight";
  DROP TYPE "public"."enum_header_utility_appearance_time_font_weight";
  DROP TYPE "public"."enum__header_v_version_contact_cards_icon_type";
  DROP TYPE "public"."enum__header_v_version_contact_cards_font_weight";
  DROP TYPE "public"."enum__header_v_version_utility_appearance_time_font_weight";
  DROP TYPE "public"."enum_footer_columns_links_link_mode";
  DROP TYPE "public"."enum__footer_v_version_columns_links_link_mode";
  DROP TYPE "public"."enum_theme_settings_font_family";
  DROP TYPE "public"."enum__theme_settings_v_version_font_family";
  DROP TYPE "public"."enum_homepage_quick_links_visual_mode";
  DROP TYPE "public"."enum_homepage_quick_links_icon";
  DROP TYPE "public"."enum_homepage_quick_links_image_fit";
  DROP TYPE "public"."enum_news_manual_link_mode";
  DROP TYPE "public"."enum_dept_manual_link_mode";
  DROP TYPE "public"."enum_schedule_manual_link_mode";
  DROP TYPE "public"."enum_homepage_sections_schedule_tab_order_tab";
  DROP TYPE "public"."enum_vaccine_manual_link_mode";
  DROP TYPE "public"."enum_homepage_sections_vaccination_tab_order_tab";
  DROP TYPE "public"."enum_homepage_sections_type";
  DROP TYPE "public"."enum_homepage_sections_image_position";
  DROP TYPE "public"."enum_homepage_sections_button_link_mode";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_quick_links_visual_mode";
  DROP TYPE "public"."enum__homepage_v_version_quick_links_icon";
  DROP TYPE "public"."enum__homepage_v_version_quick_links_image_fit";
  DROP TYPE "public"."enum__news_manual_v_link_mode";
  DROP TYPE "public"."enum__dept_manual_v_link_mode";
  DROP TYPE "public"."enum__schedule_manual_v_link_mode";
  DROP TYPE "public"."enum__homepage_v_version_sections_schedule_tab_order_tab";
  DROP TYPE "public"."enum__vaccine_manual_v_link_mode";
  DROP TYPE "public"."enum__homepage_v_version_sections_vaccination_tab_order_tab";
  DROP TYPE "public"."enum__homepage_v_version_sections_type";
  DROP TYPE "public"."enum__homepage_v_version_sections_image_position";
  DROP TYPE "public"."enum__homepage_v_version_sections_button_link_mode";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_seo_settings_status";
  DROP TYPE "public"."enum__seo_settings_v_version_status";
  DROP TYPE "public"."enum_quick_links_settings_items_link_mode";
  DROP TYPE "public"."enum_quick_links_settings_items_visual_mode";
  DROP TYPE "public"."enum_quick_links_settings_items_icon";
  DROP TYPE "public"."enum_quick_links_settings_items_image_fit";
  DROP TYPE "public"."enum_quick_links_settings_status";
  DROP TYPE "public"."enum__quick_links_settings_v_version_items_link_mode";
  DROP TYPE "public"."enum__quick_links_settings_v_version_items_visual_mode";
  DROP TYPE "public"."enum__quick_links_settings_v_version_items_icon";
  DROP TYPE "public"."enum__quick_links_settings_v_version_items_image_fit";
  DROP TYPE "public"."enum__quick_links_settings_v_version_status";`)
}
