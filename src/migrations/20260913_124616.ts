import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_documents_text_align" AS ENUM('left', 'center', 'right', 'justify');
  CREATE TYPE "public"."enum_documents_title_color" AS ENUM('default', 'navy', 'blue', 'green', 'red');
  CREATE TYPE "public"."enum_documents_title_size" AS ENUM('normal', 'large', 'xlarge');
  CREATE TYPE "public"."enum_documents_summary_color" AS ENUM('default', 'slate', 'dark');
  CREATE TYPE "public"."enum_documents_summary_size" AS ENUM('normal', 'large', 'small');
  CREATE TYPE "public"."enum__documents_v_version_text_align" AS ENUM('left', 'center', 'right', 'justify');
  CREATE TYPE "public"."enum__documents_v_version_title_color" AS ENUM('default', 'navy', 'blue', 'green', 'red');
  CREATE TYPE "public"."enum__documents_v_version_title_size" AS ENUM('normal', 'large', 'xlarge');
  CREATE TYPE "public"."enum__documents_v_version_summary_color" AS ENUM('default', 'slate', 'dark');
  CREATE TYPE "public"."enum__documents_v_version_summary_size" AS ENUM('normal', 'large', 'small');
  CREATE TYPE "public"."enum_clinical_protocols_text_align" AS ENUM('left', 'center', 'right', 'justify');
  CREATE TYPE "public"."enum_clinical_protocols_title_color" AS ENUM('default', 'navy', 'blue', 'green', 'red');
  CREATE TYPE "public"."enum_clinical_protocols_title_size" AS ENUM('normal', 'large', 'xlarge');
  CREATE TYPE "public"."enum_clinical_protocols_summary_color" AS ENUM('default', 'slate', 'dark');
  CREATE TYPE "public"."enum_clinical_protocols_summary_size" AS ENUM('normal', 'large', 'small');
  CREATE TYPE "public"."enum__clinical_protocols_v_version_text_align" AS ENUM('left', 'center', 'right', 'justify');
  CREATE TYPE "public"."enum__clinical_protocols_v_version_title_color" AS ENUM('default', 'navy', 'blue', 'green', 'red');
  CREATE TYPE "public"."enum__clinical_protocols_v_version_title_size" AS ENUM('normal', 'large', 'xlarge');
  CREATE TYPE "public"."enum__clinical_protocols_v_version_summary_color" AS ENUM('default', 'slate', 'dark');
  CREATE TYPE "public"."enum__clinical_protocols_v_version_summary_size" AS ENUM('normal', 'large', 'small');
  CREATE TYPE "public"."menu_font_weight" AS ENUM('400', '600', '700', '800', '900');
  CREATE TYPE "public"."menu_text_transform" AS ENUM('uppercase', 'none', 'capitalize');
  CREATE TYPE "public"."menu_font_family" AS ENUM('inherit', 'Arial, Helvetica, sans-serif', '"Segoe UI", Roboto, sans-serif', '"Montserrat", sans-serif', '"Roboto", sans-serif', '"Be Vietnam Pro", sans-serif');
  CREATE TYPE "public"."menu_justify_content" AS ENUM('space-between', 'center', 'flex-start', 'flex-end', 'space-around');
  CREATE TYPE "public"."menu_anim_style" AS ENUM('slide-down', 'zoom-in', 'fade-in', 'flip-in');
  CREATE TYPE "public"."menu_anim_speed" AS ENUM('0.15s', '0.22s', '0.35s');
  CREATE TYPE "public"."sp_not_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."vc_not_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."ft_col_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_fn_sources_source" AS ENUM('news', 'news-category', 'notices', 'procurement', 'schedules', 'documents');
  CREATE TYPE "public"."enum_homepage_sections_featured_filter_mode" AS ENUM('all', 'only-featured');
  CREATE TYPE "public"."enum_homepage_sections_featured_card_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__fn_sources_v_source" AS ENUM('news', 'news-category', 'notices', 'procurement', 'schedules', 'documents');
  CREATE TYPE "public"."enum__homepage_v_version_sections_featured_filter_mode" AS ENUM('all', 'only-featured');
  CREATE TYPE "public"."enum__homepage_v_version_sections_featured_card_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."hist_milestone_align" AS ENUM('left', 'justify', 'center');
  CREATE TYPE "public"."hist_icon_type" AS ENUM('heart', 'star', 'caduceus', 'handshake', 'shield', 'lightbulb', 'custom');
  CREATE TYPE "public"."hist_hero_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."hist_lead_align" AS ENUM('left', 'justify', 'center');
  CREATE TYPE "public"."hist_font_family" AS ENUM('inherit', 'Arial, Helvetica, sans-serif', '"Segoe UI", Roboto, sans-serif', '"Montserrat", sans-serif', '"Roboto", sans-serif', '"Be Vietnam Pro", sans-serif');
  CREATE TYPE "public"."ab_cp_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."ab_fc_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."ab_hero_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."ab_cm_align" AS ENUM('center', 'left', 'justify');
  CREATE TYPE "public"."wh_ms_align" AS ENUM('left', 'center', 'right', 'justify');
  CREATE TYPE "public"."wh_ms_tcolor" AS ENUM('default', 'green', 'navy', 'red');
  CREATE TYPE "public"."wh_ms_tsize" AS ENUM('normal', 'large', 'xlarge');
  CREATE TYPE "public"."wh_ms_dcolor" AS ENUM('default', 'black', 'navy');
  CREATE TYPE "public"."wh_ms_dsize" AS ENUM('normal', 'large');
  CREATE TYPE "public"."wh_dept_icon" AS ENUM('stethoscope', 'calendar', 'syringe', 'flask', 'card', 'building', 'heart', 'clock', 'custom');
  CREATE TYPE "public"."wh_dept_badge_color" AS ENUM('blue', 'teal', 'amber', 'red', 'emerald');
  CREATE TYPE "public"."wh_dept_align" AS ENUM('left', 'center', 'right', 'justify');
  CREATE TYPE "public"."wh_dept_tcolor" AS ENUM('default', 'navy', 'blue', 'green', 'red', 'slate');
  CREATE TYPE "public"."wh_dept_tsize" AS ENUM('small', 'normal', 'large', 'xlarge');
  CREATE TYPE "public"."wh_dept_ncolor" AS ENUM('default', 'navy', 'green', 'red');
  CREATE TYPE "public"."wh_dept_nsize" AS ENUM('normal', 'large');
  CREATE TYPE "public"."wh_link_icon" AS ENUM('home', 'calendar', 'clock', 'paperclip', 'ambulance', 'fileText');
  CREATE TYPE "public"."wh_link_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."wh_link_tcolor" AS ENUM('default', 'blue', 'navy', 'red');
  CREATE TYPE "public"."wh_link_tsize" AS ENUM('normal', 'large');
  CREATE TYPE "public"."wh_note_align" AS ENUM('left', 'justify');
  CREATE TYPE "public"."wh_note_tcolor" AS ENUM('default', 'black', 'navy', 'red');
  CREATE TYPE "public"."wh_note_tsize" AS ENUM('normal', 'large');
  CREATE TYPE "public"."enum_working_hours_settings_hero_title_size" AS ENUM('default', 'compact', 'large');
  CREATE TYPE "public"."enum_working_hours_settings_hero_title_color" AS ENUM('white', 'yellow', 'cyan');
  CREATE TYPE "public"."enum_working_hours_settings_hero_bg_type" AS ENUM('gradient', 'image', 'solid');
  CREATE TYPE "public"."enum_working_hours_settings_hero_bg_gradient" AS ENUM('blue-teal', 'ocean-navy', 'teal-emerald', 'royal-blue', 'slate-blue');
  CREATE TYPE "public"."enum_working_hours_settings_hero_overlay_opacity" AS ENUM('medium', 'dark', 'light');
  CREATE TYPE "public"."enum_working_hours_settings_emergency_banner_text_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."enum_working_hours_settings_emergency_banner_title_size" AS ENUM('normal', 'large', 'xlarge');
  CREATE TYPE "public"."enum_working_hours_settings_emergency_banner_desc_size" AS ENUM('normal', 'large');
  CREATE TYPE "public"."sch_n_align" AS ENUM('left', 'justify');
  CREATE TYPE "public"."sch_n_tcolor" AS ENUM('default', 'black', 'navy', 'red');
  CREATE TYPE "public"."sch_n_tsize" AS ENUM('normal', 'large');
  CREATE TYPE "public"."enum_schedule_settings_hero_title_size" AS ENUM('default', 'compact', 'large');
  CREATE TYPE "public"."enum_schedule_settings_hero_title_color" AS ENUM('white', 'yellow', 'cyan');
  CREATE TYPE "public"."enum_schedule_settings_hero_bg_type" AS ENUM('gradient', 'image', 'solid');
  CREATE TYPE "public"."enum_schedule_settings_hero_bg_gradient" AS ENUM('blue-teal', 'ocean-navy', 'teal-emerald', 'royal-blue');
  CREATE TYPE "public"."enum_schedule_settings_hero_overlay_opacity" AS ENUM('medium', 'dark', 'light');
  CREATE TYPE "public"."enum_schedule_settings_quick_notice_text_align" AS ENUM('left', 'center', 'justify');
  CREATE TYPE "public"."enum_schedule_settings_quick_notice_title_color" AS ENUM('red', 'navy', 'green');
  ALTER TYPE "public"."enum_categories_scope" ADD VALUE 'clinical-protocols';
  ALTER TYPE "public"."enum_navigation_items_children_preset" ADD VALUE '/phac-do-dieu-tri' BEFORE '/tuyen-dung';
  ALTER TYPE "public"."enum_navigation_items_preset" ADD VALUE '/phac-do-dieu-tri' BEFORE '/tuyen-dung';
  ALTER TYPE "public"."enum__navigation_v_version_items_children_preset" ADD VALUE '/phac-do-dieu-tri' BEFORE '/tuyen-dung';
  ALTER TYPE "public"."enum__navigation_v_version_items_preset" ADD VALUE '/phac-do-dieu-tri' BEFORE '/tuyen-dung';
  CREATE TABLE "clinical_protocols" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"code" varchar,
  	"specialty_id" integer,
  	"document_type" varchar DEFAULT 'Phác đồ điều trị',
  	"issuer" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"signer" varchar,
  	"issued_at" timestamp(3) with time zone,
  	"effective_at" timestamp(3) with time zone,
  	"summary" varchar,
  	"content" jsonb,
  	"allow_download" boolean DEFAULT true,
  	"prevent_copy" boolean DEFAULT false,
  	"show_viewer" boolean DEFAULT true,
  	"text_align" "enum_clinical_protocols_text_align" DEFAULT 'left',
  	"title_color" "enum_clinical_protocols_title_color" DEFAULT 'default',
  	"title_size" "enum_clinical_protocols_title_size" DEFAULT 'normal',
  	"summary_color" "enum_clinical_protocols_summary_color" DEFAULT 'default',
  	"summary_size" "enum_clinical_protocols_summary_size" DEFAULT 'normal',
  	"file_id" integer NOT NULL,
  	"cover_id" integer,
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
  
  CREATE TABLE "_clinical_protocols_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_code" varchar,
  	"version_specialty_id" integer,
  	"version_document_type" varchar DEFAULT 'Phác đồ điều trị',
  	"version_issuer" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
  	"version_signer" varchar,
  	"version_issued_at" timestamp(3) with time zone,
  	"version_effective_at" timestamp(3) with time zone,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_allow_download" boolean DEFAULT true,
  	"version_prevent_copy" boolean DEFAULT false,
  	"version_show_viewer" boolean DEFAULT true,
  	"version_text_align" "enum__clinical_protocols_v_version_text_align" DEFAULT 'left',
  	"version_title_color" "enum__clinical_protocols_v_version_title_color" DEFAULT 'default',
  	"version_title_size" "enum__clinical_protocols_v_version_title_size" DEFAULT 'normal',
  	"version_summary_color" "enum__clinical_protocols_v_version_summary_color" DEFAULT 'default',
  	"version_summary_size" "enum__clinical_protocols_v_version_summary_size" DEFAULT 'normal',
  	"version_file_id" integer NOT NULL,
  	"version_cover_id" integer,
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
  
  CREATE TABLE "fn_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_fn_sources_source",
  	"category_ref_id" integer,
  	"category_name" varchar,
  	"custom_badge" varchar,
  	"limit" numeric DEFAULT 6,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "_fn_sources_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__fn_sources_v_source",
  	"category_ref_id" integer,
  	"category_name" varchar,
  	"custom_badge" varchar,
  	"limit" numeric DEFAULT 6,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "hospital_history_quick_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "hospital_history_journey_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"is_highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "_hospital_history_v_version_quick_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_hospital_history_v_version_journey_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step_number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"is_highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "wh_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"time" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar,
  	"highlight" boolean DEFAULT false,
  	"text_align" "wh_ms_align" DEFAULT 'left',
  	"title_color" "wh_ms_tcolor" DEFAULT 'default',
  	"title_size" "wh_ms_tsize" DEFAULT 'normal',
  	"desc_color" "wh_ms_dcolor" DEFAULT 'default',
  	"desc_size" "wh_ms_dsize" DEFAULT 'normal'
  );
  
  CREATE TABLE "wh_dept_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "wh_depts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"icon_type" "wh_dept_icon" DEFAULT 'stethoscope',
  	"custom_icon_text" varchar,
  	"badge_color" "wh_dept_badge_color" DEFAULT 'blue',
  	"text_align" "wh_dept_align" DEFAULT 'left',
  	"title_color" "wh_dept_tcolor" DEFAULT 'default',
  	"title_size" "wh_dept_tsize" DEFAULT 'normal',
  	"note" varchar,
  	"note_color" "wh_dept_ncolor" DEFAULT 'default',
  	"note_size" "wh_dept_nsize" DEFAULT 'normal'
  );
  
  CREATE TABLE "wh_sched_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"url" varchar NOT NULL,
  	"icon_type" "wh_link_icon" DEFAULT 'calendar',
  	"is_emergency" boolean DEFAULT false,
  	"text_align" "wh_link_align" DEFAULT 'left',
  	"title_color" "wh_link_tcolor" DEFAULT 'default',
  	"title_size" "wh_link_tsize" DEFAULT 'normal'
  );
  
  CREATE TABLE "wh_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"bold_prefix" varchar,
  	"content" varchar NOT NULL,
  	"text_align" "wh_note_align" DEFAULT 'left',
  	"text_color" "wh_note_tcolor" DEFAULT 'default',
  	"text_size" "wh_note_tsize" DEFAULT 'normal'
  );
  
  CREATE TABLE "working_hours_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge_text" varchar DEFAULT 'THÔNG BÁO CHÍNH THỨC TỪ BỆNH VIỆN',
  	"hero_title" varchar DEFAULT 'Thời gian Tiếp nhận & Khám chữa bệnh' NOT NULL,
  	"hero_title_size" "enum_working_hours_settings_hero_title_size" DEFAULT 'default',
  	"hero_title_color" "enum_working_hours_settings_hero_title_color" DEFAULT 'white',
  	"hero_slogan" varchar DEFAULT 'Nhằm nâng cao chất lượng phục vụ, tối ưu quy trình khám bệnh, rút ngắn thời gian chờ đợi và đáp ứng tốt hơn nhu cầu chăm sóc sức khỏe của người dân, Bệnh viện Đa khoa Khu vực Thới Lai điều chỉnh thời gian tiếp nhận từ 06:00 và bắt đầu khám bệnh từ 06:30.',
  	"hero_bg_type" "enum_working_hours_settings_hero_bg_type" DEFAULT 'gradient',
  	"hero_bg_gradient" "enum_working_hours_settings_hero_bg_gradient" DEFAULT 'blue-teal',
  	"hero_bg_image_id" integer,
  	"hero_overlay_opacity" "enum_working_hours_settings_hero_overlay_opacity" DEFAULT 'medium',
  	"hero_show_primary_btn" boolean DEFAULT true,
  	"hero_primary_btn_text" varchar DEFAULT 'Xem khung giờ khám mới',
  	"hero_primary_btn_link" varchar DEFAULT '#kham-benh',
  	"hero_show_secondary_btn" boolean DEFAULT true,
  	"hero_secondary_btn_text" varchar DEFAULT 'Tra cứu lịch trực tuần & ca kíp',
  	"hero_secondary_btn_link" varchar DEFAULT '/lich-kham',
  	"announcement_enabled" boolean DEFAULT true,
  	"announcement_badge" varchar DEFAULT 'THÔNG BÁO ĐIỀU CHỈNH THỜI GIAN TIẾP NHẬN & KHÁM BỆNH',
  	"announcement_effective_date" varchar DEFAULT 'Kể từ ngày 10 tháng 8 năm 2026',
  	"announcement_intro_text" varchar DEFAULT 'Nhằm nâng cao chất lượng phục vụ, tối ưu quy trình khám bệnh, rút ngắn thời gian chờ đợi và đáp ứng tốt hơn nhu cầu chăm sóc sức khỏe của người dân, kể từ ngày 10 tháng 8 năm 2026, Bệnh viện Đa khoa Khu vực Thới Lai điều chỉnh thời gian tiếp nhận và khám bệnh như sau:',
  	"announcement_closing_text" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng thông báo để quý bà con chủ động sắp xếp thời gian đến khám, chữa bệnh. Kính mong quý bà con chia sẻ thông tin để nhiều người cùng biết.',
  	"emergency_banner_enabled" boolean DEFAULT true,
  	"emergency_banner_text_align" "enum_working_hours_settings_emergency_banner_text_align" DEFAULT 'left',
  	"emergency_banner_title" varchar DEFAULT 'KHOA CẤP CỨU HOẠT ĐỘNG 24/24 (24/7)',
  	"emergency_banner_title_size" "enum_working_hours_settings_emergency_banner_title_size" DEFAULT 'normal',
  	"emergency_banner_description" varchar DEFAULT 'Tiếp nhận, xử trí cấp cứu mọi trường hợp khẩn cấp liên tục tất cả các ngày trong tuần, thứ Bảy, Chủ Nhật và ngày Lễ.',
  	"emergency_banner_desc_size" "enum_working_hours_settings_emergency_banner_desc_size" DEFAULT 'normal',
  	"emergency_banner_hotline" varchar DEFAULT '0292 3686 115',
  	"emergency_banner_button_label" varchar DEFAULT 'HOTLINE CẤP CỨU: 0292 3686 115',
  	"schedule_links_section_enabled" boolean DEFAULT true,
  	"schedule_links_section_title" varchar DEFAULT 'Tra cứu Lịch phân công & Trực theo từng chuyên mục',
  	"schedule_links_section_description" varchar DEFAULT 'Chọn ngay liên kết tương ứng bên dưới để chuyển trực tiếp đến đúng Tab hiển thị trên hệ thống lịch của bệnh viện:',
  	"notes_section_enabled" boolean DEFAULT true,
  	"notes_section_title" varchar DEFAULT 'LƯU Ý DÀNH CHO NGƯỜI BỆNH VÀ THÂN NHÂN',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "sch_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"bold_prefix" varchar,
  	"content" varchar NOT NULL,
  	"text_align" "sch_n_align" DEFAULT 'left',
  	"text_color" "sch_n_tcolor" DEFAULT 'default',
  	"text_size" "sch_n_tsize" DEFAULT 'normal'
  );
  
  ALTER TABLE "homepage_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum_homepage_sections_schedule_tab_order_tab";
  CREATE TYPE "public"."enum_homepage_sections_schedule_tab_order_tab" AS ENUM('emergency', 'daily', 'weekly', 'attachments');
  ALTER TABLE "homepage_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE "public"."enum_homepage_sections_schedule_tab_order_tab" USING "tab"::"public"."enum_homepage_sections_schedule_tab_order_tab";
  ALTER TABLE "_homepage_v_version_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum__homepage_v_version_sections_schedule_tab_order_tab";
  CREATE TYPE "public"."enum__homepage_v_version_sections_schedule_tab_order_tab" AS ENUM('emergency', 'daily', 'weekly', 'attachments');
  ALTER TABLE "_homepage_v_version_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE "public"."enum__homepage_v_version_sections_schedule_tab_order_tab" USING "tab"::"public"."enum__homepage_v_version_sections_schedule_tab_order_tab";
  ALTER TABLE "hospital_history" ALTER COLUMN "eyebrow" SET DEFAULT 'LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN';
  ALTER TABLE "_hospital_history_v" ALTER COLUMN "version_eyebrow" SET DEFAULT 'LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN';
  ALTER TABLE "about_page" ALTER COLUMN "core_principles_title" SET DEFAULT 'Chức năng & Nhiệm vụ trọng tâm';
  ALTER TABLE "about_page" ALTER COLUMN "core_principles_subtitle" SET DEFAULT 'Thực hiện chức năng khám chữa bệnh đa khoa, cấp cứu và chăm sóc sức khỏe nhân dân toàn diện theo quy chuẩn của Bộ Y tế và Sở Y tế TP. Cần Thơ.';
  ALTER TABLE "_about_page_v" ALTER COLUMN "version_core_principles_title" SET DEFAULT 'Chức năng & Nhiệm vụ trọng tâm';
  ALTER TABLE "_about_page_v" ALTER COLUMN "version_core_principles_subtitle" SET DEFAULT 'Thực hiện chức năng khám chữa bệnh đa khoa, cấp cứu và chăm sóc sức khỏe nhân dân toàn diện theo quy chuẩn của Bộ Y tế và Sở Y tế TP. Cần Thơ.';
  ALTER TABLE "documents" ADD COLUMN "document_type" varchar;
  ALTER TABLE "documents" ADD COLUMN "signer" varchar;
  ALTER TABLE "documents" ADD COLUMN "content" jsonb;
  ALTER TABLE "documents" ADD COLUMN "allow_download" boolean DEFAULT true;
  ALTER TABLE "documents" ADD COLUMN "prevent_copy" boolean DEFAULT false;
  ALTER TABLE "documents" ADD COLUMN "show_viewer" boolean DEFAULT true;
  ALTER TABLE "documents" ADD COLUMN "text_align" "enum_documents_text_align" DEFAULT 'left';
  ALTER TABLE "documents" ADD COLUMN "title_color" "enum_documents_title_color" DEFAULT 'default';
  ALTER TABLE "documents" ADD COLUMN "title_size" "enum_documents_title_size" DEFAULT 'normal';
  ALTER TABLE "documents" ADD COLUMN "summary_color" "enum_documents_summary_color" DEFAULT 'default';
  ALTER TABLE "documents" ADD COLUMN "summary_size" "enum_documents_summary_size" DEFAULT 'normal';
  ALTER TABLE "_documents_v" ADD COLUMN "version_document_type" varchar;
  ALTER TABLE "_documents_v" ADD COLUMN "version_signer" varchar;
  ALTER TABLE "_documents_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_documents_v" ADD COLUMN "version_allow_download" boolean DEFAULT true;
  ALTER TABLE "_documents_v" ADD COLUMN "version_prevent_copy" boolean DEFAULT false;
  ALTER TABLE "_documents_v" ADD COLUMN "version_show_viewer" boolean DEFAULT true;
  ALTER TABLE "_documents_v" ADD COLUMN "version_text_align" "enum__documents_v_version_text_align" DEFAULT 'left';
  ALTER TABLE "_documents_v" ADD COLUMN "version_title_color" "enum__documents_v_version_title_color" DEFAULT 'default';
  ALTER TABLE "_documents_v" ADD COLUMN "version_title_size" "enum__documents_v_version_title_size" DEFAULT 'normal';
  ALTER TABLE "_documents_v" ADD COLUMN "version_summary_color" "enum__documents_v_version_summary_color" DEFAULT 'default';
  ALTER TABLE "_documents_v" ADD COLUMN "version_summary_size" "enum__documents_v_version_summary_size" DEFAULT 'normal';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clinical_protocols_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_font_size" numeric DEFAULT 14;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_font_weight" "menu_font_weight" DEFAULT '700';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_text_transform" "menu_text_transform" DEFAULT 'uppercase';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_font_family" "menu_font_family" DEFAULT 'inherit';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_letter_spacing" numeric DEFAULT 0;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_height" numeric DEFAULT 56;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_justify_content" "menu_justify_content" DEFAULT 'space-between';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_item_spacing" numeric DEFAULT 8;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_border_radius" numeric DEFAULT 0;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_item_border_radius" numeric DEFAULT 6;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_background" varchar DEFAULT '#075db8';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_gradient_end" varchar DEFAULT '#006bc7';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_text_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_hover_text_color" varchar DEFAULT '#FFE272';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_hover_background" varchar DEFAULT 'rgba(255,255,255,0.1)';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_active_indicator_color" varchar DEFAULT '#FFD24D';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_width" numeric DEFAULT 250;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_font_size" numeric DEFAULT 14;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_border_radius" numeric DEFAULT 12;
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_background" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_text_color" varchar DEFAULT '#1e3a5f';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_border_color" varchar DEFAULT '#e2e8f0';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_hover_background" varchar DEFAULT '#f0f7ff';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_hover_text_color" varchar DEFAULT '#075db8';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_dropdown_arrow_color" varchar DEFAULT '#94a3b8';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_animation_style" "menu_anim_style" DEFAULT 'slide-down';
  ALTER TABLE "site_settings" ADD COLUMN "header_menu_appearance_animation_speed" "menu_anim_speed" DEFAULT '0.22s';
  ALTER TABLE "site_settings" ADD COLUMN "service_price_page_show_notice_banner" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "service_price_page_notice_title" varchar DEFAULT 'Lưu ý về giá khám chữa bệnh BHYT và Viện phí';
  ALTER TABLE "site_settings" ADD COLUMN "service_price_page_notice_content" varchar DEFAULT '• Bảng giá dịch vụ khám bệnh, chữa bệnh được thực hiện công khai theo đúng quy định hiện hành của Bộ Y tế.
  • Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả theo quy định.
  • Các dịch vụ kỹ thuật cao, dịch vụ theo yêu cầu được tư vấn rõ ràng trước khi thực hiện.';
  ALTER TABLE "site_settings" ADD COLUMN "service_price_page_notice_align" "sp_not_align" DEFAULT 'left';
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_eyebrow" varchar DEFAULT 'TIÊM NGỪA AN TOÀN';
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_title" varchar DEFAULT 'Thông tin tiêm ngừa';
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_description" varchar DEFAULT 'Theo dõi thông báo lịch tiêm, các đợt tiêm và danh mục vắc xin tại bệnh viện.';
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_show_notice_banner" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_notice_title" varchar DEFAULT 'Quy trình và An toàn Tiêm chủng tại Bệnh viện';
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_notice_content" varchar DEFAULT '• Người đến tiêm chủng được khám sàng lọc trước tiêm và tư vấn chỉ định vắc xin phù hợp.
  • Theo dõi sức khỏe ít nhất 30 phút sau tiêm tại phòng theo dõi của bệnh viện.
  • Vui lòng mang theo sổ tiêm chủng hoặc ứng dụng tiêm chủng điện tử khi đến tiêm.';
  ALTER TABLE "site_settings" ADD COLUMN "vaccination_page_notice_align" "vc_not_align" DEFAULT 'left';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_font_size" numeric DEFAULT 14;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_font_weight" "menu_font_weight" DEFAULT '700';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_text_transform" "menu_text_transform" DEFAULT 'uppercase';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_font_family" "menu_font_family" DEFAULT 'inherit';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_letter_spacing" numeric DEFAULT 0;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_height" numeric DEFAULT 56;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_justify_content" "menu_justify_content" DEFAULT 'space-between';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_item_spacing" numeric DEFAULT 8;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_border_radius" numeric DEFAULT 0;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_item_border_radius" numeric DEFAULT 6;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_background" varchar DEFAULT '#075db8';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_gradient_end" varchar DEFAULT '#006bc7';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_text_color" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_hover_text_color" varchar DEFAULT '#FFE272';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_hover_background" varchar DEFAULT 'rgba(255,255,255,0.1)';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_active_indicator_color" varchar DEFAULT '#FFD24D';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_width" numeric DEFAULT 250;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_font_size" numeric DEFAULT 14;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_border_radius" numeric DEFAULT 12;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_background" varchar DEFAULT '#FFFFFF';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_text_color" varchar DEFAULT '#1e3a5f';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_border_color" varchar DEFAULT '#e2e8f0';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_hover_background" varchar DEFAULT '#f0f7ff';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_hover_text_color" varchar DEFAULT '#075db8';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_dropdown_arrow_color" varchar DEFAULT '#94a3b8';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_animation_style" "menu_anim_style" DEFAULT 'slide-down';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_header_menu_appearance_animation_speed" "menu_anim_speed" DEFAULT '0.22s';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_service_price_page_show_notice_banner" boolean DEFAULT true;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_service_price_page_notice_title" varchar DEFAULT 'Lưu ý về giá khám chữa bệnh BHYT và Viện phí';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_service_price_page_notice_content" varchar DEFAULT '• Bảng giá dịch vụ khám bệnh, chữa bệnh được thực hiện công khai theo đúng quy định hiện hành của Bộ Y tế.
  • Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả theo quy định.
  • Các dịch vụ kỹ thuật cao, dịch vụ theo yêu cầu được tư vấn rõ ràng trước khi thực hiện.';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_service_price_page_notice_align" "sp_not_align" DEFAULT 'left';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_eyebrow" varchar DEFAULT 'TIÊM NGỪA AN TOÀN';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_title" varchar DEFAULT 'Thông tin tiêm ngừa';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_description" varchar DEFAULT 'Theo dõi thông báo lịch tiêm, các đợt tiêm và danh mục vắc xin tại bệnh viện.';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_show_notice_banner" boolean DEFAULT true;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_notice_title" varchar DEFAULT 'Quy trình và An toàn Tiêm chủng tại Bệnh viện';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_notice_content" varchar DEFAULT '• Người đến tiêm chủng được khám sàng lọc trước tiêm và tư vấn chỉ định vắc xin phù hợp.
  • Theo dõi sức khỏe ít nhất 30 phút sau tiêm tại phòng theo dõi của bệnh viện.
  • Vui lòng mang theo sổ tiêm chủng hoặc ứng dụng tiêm chủng điện tử khi đến tiêm.';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_vaccination_page_notice_align" "vc_not_align" DEFAULT 'left';
  ALTER TABLE "footer_columns" ADD COLUMN "text_align" "ft_col_align" DEFAULT 'left';
  ALTER TABLE "_footer_v_version_columns" ADD COLUMN "text_align" "ft_col_align" DEFAULT 'left';
  ALTER TABLE "homepage_sections" ADD COLUMN "featured_filter_mode" "enum_homepage_sections_featured_filter_mode" DEFAULT 'all';
  ALTER TABLE "homepage_sections" ADD COLUMN "featured_see_all_url" varchar DEFAULT '/tin-tuc';
  ALTER TABLE "homepage_sections" ADD COLUMN "featured_card_fit" "enum_homepage_sections_featured_card_fit" DEFAULT 'cover';
  ALTER TABLE "homepage" ADD COLUMN "enable_section_scroll_snap" boolean DEFAULT true;
  ALTER TABLE "_homepage_v_version_sections" ADD COLUMN "featured_filter_mode" "enum__homepage_v_version_sections_featured_filter_mode" DEFAULT 'all';
  ALTER TABLE "_homepage_v_version_sections" ADD COLUMN "featured_see_all_url" varchar DEFAULT '/tin-tuc';
  ALTER TABLE "_homepage_v_version_sections" ADD COLUMN "featured_card_fit" "enum__homepage_v_version_sections_featured_card_fit" DEFAULT 'cover';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_enable_section_scroll_snap" boolean DEFAULT true;
  ALTER TABLE "organization_chart_deputy_directors" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "organization_chart" ADD COLUMN "show_leadership_section" boolean DEFAULT true;
  ALTER TABLE "organization_chart" ADD COLUMN "leadership_title" varchar DEFAULT 'Ban Lãnh đạo Bệnh Viện';
  ALTER TABLE "organization_chart" ADD COLUMN "show_tree_section" boolean DEFAULT true;
  ALTER TABLE "organization_chart" ADD COLUMN "tree_title" varchar DEFAULT 'Sơ đồ tổ chức bộ máy';
  ALTER TABLE "organization_chart" ADD COLUMN "director_enabled" boolean DEFAULT true;
  ALTER TABLE "_organization_chart_v_version_deputy_directors" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "_organization_chart_v" ADD COLUMN "version_show_leadership_section" boolean DEFAULT true;
  ALTER TABLE "_organization_chart_v" ADD COLUMN "version_leadership_title" varchar DEFAULT 'Ban Lãnh đạo Bệnh Viện';
  ALTER TABLE "_organization_chart_v" ADD COLUMN "version_show_tree_section" boolean DEFAULT true;
  ALTER TABLE "_organization_chart_v" ADD COLUMN "version_tree_title" varchar DEFAULT 'Sơ đồ tổ chức bộ máy';
  ALTER TABLE "_organization_chart_v" ADD COLUMN "version_director_enabled" boolean DEFAULT true;
  ALTER TABLE "hospital_history_milestones" ADD COLUMN "text_align" "hist_milestone_align" DEFAULT 'left';
  ALTER TABLE "hospital_history_core_values_values_list" ADD COLUMN "icon_type" "hist_icon_type" DEFAULT 'heart';
  ALTER TABLE "hospital_history_core_values_values_list" ADD COLUMN "custom_icon_id" integer;
  ALTER TABLE "hospital_history" ADD COLUMN "show_hero" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "hero_min_height" numeric DEFAULT 380;
  ALTER TABLE "hospital_history" ADD COLUMN "hero_align" "hist_hero_align" DEFAULT 'left';
  ALTER TABLE "hospital_history" ADD COLUMN "show_quick_stats" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "show_lead" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "lead_align" "hist_lead_align" DEFAULT 'left';
  ALTER TABLE "hospital_history" ADD COLUMN "lead_font_size" numeric DEFAULT 18;
  ALTER TABLE "hospital_history" ADD COLUMN "show_timeline" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "timeline_kicker" varchar DEFAULT 'DÒNG THỜI GIAN';
  ALTER TABLE "hospital_history" ADD COLUMN "timeline_title" varchar DEFAULT 'Những dấu mốc phát triển tiêu biểu';
  ALTER TABLE "hospital_history" ADD COLUMN "timeline_desc" varchar DEFAULT 'Hành trình xây dựng và phát triển của Bệnh viện Đa khoa khu vực Thới Lai qua các thời kỳ.';
  ALTER TABLE "hospital_history" ADD COLUMN "show_core_values" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "core_values_kicker" varchar DEFAULT 'KIM CHỈ NAM HÀNH ĐỘNG';
  ALTER TABLE "hospital_history" ADD COLUMN "core_values_title" varchar DEFAULT 'Sứ mệnh – Tầm nhìn – Giá trị cốt lõi';
  ALTER TABLE "hospital_history" ADD COLUMN "core_values_desc" varchar DEFAULT 'Những định hướng nền tảng để tập thể viên chức, người lao động Bệnh viện Đa khoa khu vực Thới Lai không ngừng nâng cao chất lượng phục vụ người bệnh.';
  ALTER TABLE "hospital_history" ADD COLUMN "show_journey" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "journey_kicker" varchar DEFAULT 'HÀNH TRÌNH TIẾP NỐI';
  ALTER TABLE "hospital_history" ADD COLUMN "journey_title" varchar DEFAULT 'Kế thừa và Vươn tầm phát triển';
  ALTER TABLE "hospital_history" ADD COLUMN "journey_desc" varchar DEFAULT 'Trải qua nhiều giai đoạn tổ chức và phát triển, mỗi giai đoạn đều đánh dấu một bước chuyển quan trọng trong quá trình xây dựng hệ thống y tế phục vụ Nhân dân.';
  ALTER TABLE "hospital_history" ADD COLUMN "journey_bottom_text" varchar DEFAULT 'Bệnh viện Đa khoa khu vực Thới Lai hôm nay tiếp tục kế thừa những giá trị đã được xây dựng qua nhiều thế hệ cán bộ, viên chức và người lao động; đồng thời không ngừng đổi mới, nâng cao chất lượng chuyên môn, ứng dụng công nghệ và cải tiến phong cách phục vụ, hướng đến mục tiêu chăm sóc sức khỏe người dân ngày càng tốt hơn.';
  ALTER TABLE "hospital_history" ADD COLUMN "show_achievements" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "achievements_kicker" varchar DEFAULT 'THÀNH QUẢ ĐẠT ĐƯỢC';
  ALTER TABLE "hospital_history" ADD COLUMN "achievements_title" varchar DEFAULT 'Thành tựu tiêu biểu';
  ALTER TABLE "hospital_history" ADD COLUMN "achievements_desc" varchar DEFAULT 'Ghi nhận những đóng góp bền bỉ vì sự nghiệp bảo vệ, chăm sóc và nâng cao sức khỏe cộng đồng.';
  ALTER TABLE "hospital_history" ADD COLUMN "show_content" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "show_cta" boolean DEFAULT true;
  ALTER TABLE "hospital_history" ADD COLUMN "cta_title" varchar DEFAULT 'Tiếp tục phát triển vì sức khỏe của bạn và gia đình';
  ALTER TABLE "hospital_history" ADD COLUMN "cta_desc" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng đồng hành, lắng nghe và phục vụ với sự chuyên nghiệp, tận tình nhất.';
  ALTER TABLE "hospital_history" ADD COLUMN "cta_btn_primary_text" varchar DEFAULT 'Xem Sơ đồ tổ chức →';
  ALTER TABLE "hospital_history" ADD COLUMN "cta_btn_primary_url" varchar DEFAULT '/so-do-to-chuc';
  ALTER TABLE "hospital_history" ADD COLUMN "cta_btn_secondary_text" varchar DEFAULT 'Danh sách Khoa – Phòng';
  ALTER TABLE "hospital_history" ADD COLUMN "cta_btn_secondary_url" varchar DEFAULT '/khoa-phong';
  ALTER TABLE "hospital_history" ADD COLUMN "primary_color" varchar DEFAULT '#0878D1';
  ALTER TABLE "hospital_history" ADD COLUMN "accent_color" varchar DEFAULT '#16A36A';
  ALTER TABLE "hospital_history" ADD COLUMN "heading_color" varchar DEFAULT '#102a43';
  ALTER TABLE "hospital_history" ADD COLUMN "text_color" varchar DEFAULT '#486581';
  ALTER TABLE "hospital_history" ADD COLUMN "card_bg_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "hospital_history" ADD COLUMN "font_family" "hist_font_family" DEFAULT 'inherit';
  ALTER TABLE "hospital_history" ADD COLUMN "card_padding" numeric DEFAULT 24;
  ALTER TABLE "_hospital_history_v_version_milestones" ADD COLUMN "text_align" "hist_milestone_align" DEFAULT 'left';
  ALTER TABLE "_hospital_history_v_version_core_values_values_list" ADD COLUMN "icon_type" "hist_icon_type" DEFAULT 'heart';
  ALTER TABLE "_hospital_history_v_version_core_values_values_list" ADD COLUMN "custom_icon_id" integer;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_hero" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_hero_min_height" numeric DEFAULT 380;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_hero_align" "hist_hero_align" DEFAULT 'left';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_quick_stats" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_lead" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_lead_align" "hist_lead_align" DEFAULT 'left';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_lead_font_size" numeric DEFAULT 18;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_timeline" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_timeline_kicker" varchar DEFAULT 'DÒNG THỜI GIAN';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_timeline_title" varchar DEFAULT 'Những dấu mốc phát triển tiêu biểu';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_timeline_desc" varchar DEFAULT 'Hành trình xây dựng và phát triển của Bệnh viện Đa khoa khu vực Thới Lai qua các thời kỳ.';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_core_values" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_core_values_kicker" varchar DEFAULT 'KIM CHỈ NAM HÀNH ĐỘNG';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_core_values_title" varchar DEFAULT 'Sứ mệnh – Tầm nhìn – Giá trị cốt lõi';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_core_values_desc" varchar DEFAULT 'Những định hướng nền tảng để tập thể viên chức, người lao động Bệnh viện Đa khoa khu vực Thới Lai không ngừng nâng cao chất lượng phục vụ người bệnh.';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_journey" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_journey_kicker" varchar DEFAULT 'HÀNH TRÌNH TIẾP NỐI';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_journey_title" varchar DEFAULT 'Kế thừa và Vươn tầm phát triển';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_journey_desc" varchar DEFAULT 'Trải qua nhiều giai đoạn tổ chức và phát triển, mỗi giai đoạn đều đánh dấu một bước chuyển quan trọng trong quá trình xây dựng hệ thống y tế phục vụ Nhân dân.';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_journey_bottom_text" varchar DEFAULT 'Bệnh viện Đa khoa khu vực Thới Lai hôm nay tiếp tục kế thừa những giá trị đã được xây dựng qua nhiều thế hệ cán bộ, viên chức và người lao động; đồng thời không ngừng đổi mới, nâng cao chất lượng chuyên môn, ứng dụng công nghệ và cải tiến phong cách phục vụ, hướng đến mục tiêu chăm sóc sức khỏe người dân ngày càng tốt hơn.';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_achievements" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_achievements_kicker" varchar DEFAULT 'THÀNH QUẢ ĐẠT ĐƯỢC';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_achievements_title" varchar DEFAULT 'Thành tựu tiêu biểu';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_achievements_desc" varchar DEFAULT 'Ghi nhận những đóng góp bền bỉ vì sự nghiệp bảo vệ, chăm sóc và nâng cao sức khỏe cộng đồng.';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_content" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_show_cta" boolean DEFAULT true;
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_cta_title" varchar DEFAULT 'Tiếp tục phát triển vì sức khỏe của bạn và gia đình';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_cta_desc" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng đồng hành, lắng nghe và phục vụ với sự chuyên nghiệp, tận tình nhất.';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_cta_btn_primary_text" varchar DEFAULT 'Xem Sơ đồ tổ chức →';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_cta_btn_primary_url" varchar DEFAULT '/so-do-to-chuc';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_cta_btn_secondary_text" varchar DEFAULT 'Danh sách Khoa – Phòng';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_cta_btn_secondary_url" varchar DEFAULT '/khoa-phong';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_primary_color" varchar DEFAULT '#0878D1';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_accent_color" varchar DEFAULT '#16A36A';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_heading_color" varchar DEFAULT '#102a43';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_text_color" varchar DEFAULT '#486581';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_card_bg_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_font_family" "hist_font_family" DEFAULT 'inherit';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_card_padding" numeric DEFAULT 24;
  ALTER TABLE "about_page_stats" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "about_page_core_principles_items" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "about_page_core_principles_items" ADD COLUMN "text_align" "ab_cp_align" DEFAULT 'left';
  ALTER TABLE "about_page_facilities_items" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "about_page_facilities_items" ADD COLUMN "text_align" "ab_fc_align" DEFAULT 'left';
  ALTER TABLE "about_page_related_links_links" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "about_page" ADD COLUMN "hero_enabled" boolean DEFAULT true;
  ALTER TABLE "about_page" ADD COLUMN "hero_text_align" "ab_hero_align" DEFAULT 'left';
  ALTER TABLE "about_page" ADD COLUMN "core_principles_enabled" boolean DEFAULT true;
  ALTER TABLE "about_page" ADD COLUMN "facilities_enabled" boolean DEFAULT true;
  ALTER TABLE "about_page" ADD COLUMN "commitment_enabled" boolean DEFAULT true;
  ALTER TABLE "about_page" ADD COLUMN "commitment_text_align" "ab_cm_align" DEFAULT 'center';
  ALTER TABLE "about_page" ADD COLUMN "related_links_enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v_version_stats" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v_version_core_principles_items" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v_version_core_principles_items" ADD COLUMN "text_align" "ab_cp_align" DEFAULT 'left';
  ALTER TABLE "_about_page_v_version_facilities_items" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v_version_facilities_items" ADD COLUMN "text_align" "ab_fc_align" DEFAULT 'left';
  ALTER TABLE "_about_page_v_version_related_links_links" ADD COLUMN "enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_hero_enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_hero_text_align" "ab_hero_align" DEFAULT 'left';
  ALTER TABLE "_about_page_v" ADD COLUMN "version_core_principles_enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_facilities_enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_commitment_enabled" boolean DEFAULT true;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_commitment_text_align" "ab_cm_align" DEFAULT 'center';
  ALTER TABLE "_about_page_v" ADD COLUMN "version_related_links_enabled" boolean DEFAULT true;
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_eyebrow" varchar DEFAULT 'KHÁM CHỮA BỆNH & TRỰC BỆNH VIỆN';
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_title" varchar DEFAULT 'Lịch khám & Lịch trực bệnh viện' NOT NULL;
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_title_size" "enum_schedule_settings_hero_title_size" DEFAULT 'default';
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_title_color" "enum_schedule_settings_hero_title_color" DEFAULT 'white';
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_description" varchar DEFAULT 'Tra cứu lịch phân công bác sĩ khám bệnh, lịch trực cấp cứu 24/24 và lịch trực tuần của Bệnh viện Đa khoa Khu vực Thới Lai.';
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_bg_type" "enum_schedule_settings_hero_bg_type" DEFAULT 'gradient';
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_bg_gradient" "enum_schedule_settings_hero_bg_gradient" DEFAULT 'blue-teal';
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_bg_image_id" integer;
  ALTER TABLE "schedule_settings" ADD COLUMN "hero_overlay_opacity" "enum_schedule_settings_hero_overlay_opacity" DEFAULT 'medium';
  ALTER TABLE "schedule_settings" ADD COLUMN "quick_notice_enabled" boolean DEFAULT true;
  ALTER TABLE "schedule_settings" ADD COLUMN "quick_notice_text_align" "enum_schedule_settings_quick_notice_text_align" DEFAULT 'left';
  ALTER TABLE "schedule_settings" ADD COLUMN "quick_notice_title" varchar DEFAULT 'Khoa Cấp cứu tiếp nhận bệnh nhân 24/24 tất cả các ngày trong tuần';
  ALTER TABLE "schedule_settings" ADD COLUMN "quick_notice_title_color" "enum_schedule_settings_quick_notice_title_color" DEFAULT 'red';
  ALTER TABLE "schedule_settings" ADD COLUMN "quick_notice_content" varchar DEFAULT 'Lịch trực cấp cứu và danh sách bác sĩ thường trực 24/7 được cập nhật thường xuyên. Trường hợp khẩn cấp, vui lòng liên hệ ngay đường dây nóng cấp cứu để được hỗ trợ kịp thời.';
  ALTER TABLE "schedule_settings" ADD COLUMN "quick_notice_hotline" varchar DEFAULT '0292 3686 115';
  ALTER TABLE "schedule_settings" ADD COLUMN "notes_section_enabled" boolean DEFAULT true;
  ALTER TABLE "schedule_settings" ADD COLUMN "notes_section_title" varchar DEFAULT 'LƯU Ý QUAN TRỌNG KHI ĐẾN KHÁM BỆNH';
  ALTER TABLE "clinical_protocols" ADD CONSTRAINT "clinical_protocols_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clinical_protocols" ADD CONSTRAINT "clinical_protocols_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clinical_protocols" ADD CONSTRAINT "clinical_protocols_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clinical_protocols" ADD CONSTRAINT "clinical_protocols_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clinical_protocols_v" ADD CONSTRAINT "_clinical_protocols_v_parent_id_clinical_protocols_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clinical_protocols"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clinical_protocols_v" ADD CONSTRAINT "_clinical_protocols_v_version_specialty_id_specialties_id_fk" FOREIGN KEY ("version_specialty_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clinical_protocols_v" ADD CONSTRAINT "_clinical_protocols_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clinical_protocols_v" ADD CONSTRAINT "_clinical_protocols_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clinical_protocols_v" ADD CONSTRAINT "_clinical_protocols_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fn_sources" ADD CONSTRAINT "fn_sources_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fn_sources" ADD CONSTRAINT "fn_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_fn_sources_v" ADD CONSTRAINT "_fn_sources_v_category_ref_id_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_fn_sources_v" ADD CONSTRAINT "_fn_sources_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hospital_history_quick_stats" ADD CONSTRAINT "hospital_history_quick_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hospital_history"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hospital_history_journey_steps" ADD CONSTRAINT "hospital_history_journey_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hospital_history"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hospital_history_v_version_quick_stats" ADD CONSTRAINT "_hospital_history_v_version_quick_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hospital_history_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_hospital_history_v_version_journey_steps" ADD CONSTRAINT "_hospital_history_v_version_journey_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_hospital_history_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wh_milestones" ADD CONSTRAINT "wh_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."working_hours_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wh_dept_rows" ADD CONSTRAINT "wh_dept_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wh_depts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wh_depts" ADD CONSTRAINT "wh_depts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."working_hours_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wh_sched_links" ADD CONSTRAINT "wh_sched_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."working_hours_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wh_notes" ADD CONSTRAINT "wh_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."working_hours_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "working_hours_settings" ADD CONSTRAINT "working_hours_settings_hero_bg_image_id_media_id_fk" FOREIGN KEY ("hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sch_notes" ADD CONSTRAINT "sch_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schedule_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "clinical_protocols_slug_idx" ON "clinical_protocols" USING btree ("slug");
  CREATE INDEX "clinical_protocols_code_idx" ON "clinical_protocols" USING btree ("code");
  CREATE INDEX "clinical_protocols_specialty_idx" ON "clinical_protocols" USING btree ("specialty_id");
  CREATE INDEX "clinical_protocols_file_idx" ON "clinical_protocols" USING btree ("file_id");
  CREATE INDEX "clinical_protocols_cover_idx" ON "clinical_protocols" USING btree ("cover_id");
  CREATE INDEX "clinical_protocols_seo_image_idx" ON "clinical_protocols" USING btree ("seo_image_id");
  CREATE INDEX "clinical_protocols_updated_at_idx" ON "clinical_protocols" USING btree ("updated_at");
  CREATE INDEX "clinical_protocols_created_at_idx" ON "clinical_protocols" USING btree ("created_at");
  CREATE INDEX "clinical_protocols_deleted_at_idx" ON "clinical_protocols" USING btree ("deleted_at");
  CREATE INDEX "_clinical_protocols_v_parent_idx" ON "_clinical_protocols_v" USING btree ("parent_id");
  CREATE INDEX "_clinical_protocols_v_version_version_slug_idx" ON "_clinical_protocols_v" USING btree ("version_slug");
  CREATE INDEX "_clinical_protocols_v_version_version_code_idx" ON "_clinical_protocols_v" USING btree ("version_code");
  CREATE INDEX "_clinical_protocols_v_version_version_specialty_idx" ON "_clinical_protocols_v" USING btree ("version_specialty_id");
  CREATE INDEX "_clinical_protocols_v_version_version_file_idx" ON "_clinical_protocols_v" USING btree ("version_file_id");
  CREATE INDEX "_clinical_protocols_v_version_version_cover_idx" ON "_clinical_protocols_v" USING btree ("version_cover_id");
  CREATE INDEX "_clinical_protocols_v_version_version_seo_image_idx" ON "_clinical_protocols_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_clinical_protocols_v_version_version_updated_at_idx" ON "_clinical_protocols_v" USING btree ("version_updated_at");
  CREATE INDEX "_clinical_protocols_v_version_version_created_at_idx" ON "_clinical_protocols_v" USING btree ("version_created_at");
  CREATE INDEX "_clinical_protocols_v_version_version_deleted_at_idx" ON "_clinical_protocols_v" USING btree ("version_deleted_at");
  CREATE INDEX "_clinical_protocols_v_created_at_idx" ON "_clinical_protocols_v" USING btree ("created_at");
  CREATE INDEX "_clinical_protocols_v_updated_at_idx" ON "_clinical_protocols_v" USING btree ("updated_at");
  CREATE INDEX "fn_sources_order_idx" ON "fn_sources" USING btree ("_order");
  CREATE INDEX "fn_sources_parent_id_idx" ON "fn_sources" USING btree ("_parent_id");
  CREATE INDEX "fn_sources_category_ref_idx" ON "fn_sources" USING btree ("category_ref_id");
  CREATE INDEX "_fn_sources_v_order_idx" ON "_fn_sources_v" USING btree ("_order");
  CREATE INDEX "_fn_sources_v_parent_id_idx" ON "_fn_sources_v" USING btree ("_parent_id");
  CREATE INDEX "_fn_sources_v_category_ref_idx" ON "_fn_sources_v" USING btree ("category_ref_id");
  CREATE INDEX "hospital_history_quick_stats_order_idx" ON "hospital_history_quick_stats" USING btree ("_order");
  CREATE INDEX "hospital_history_quick_stats_parent_id_idx" ON "hospital_history_quick_stats" USING btree ("_parent_id");
  CREATE INDEX "hospital_history_journey_steps_order_idx" ON "hospital_history_journey_steps" USING btree ("_order");
  CREATE INDEX "hospital_history_journey_steps_parent_id_idx" ON "hospital_history_journey_steps" USING btree ("_parent_id");
  CREATE INDEX "_hospital_history_v_version_quick_stats_order_idx" ON "_hospital_history_v_version_quick_stats" USING btree ("_order");
  CREATE INDEX "_hospital_history_v_version_quick_stats_parent_id_idx" ON "_hospital_history_v_version_quick_stats" USING btree ("_parent_id");
  CREATE INDEX "_hospital_history_v_version_journey_steps_order_idx" ON "_hospital_history_v_version_journey_steps" USING btree ("_order");
  CREATE INDEX "_hospital_history_v_version_journey_steps_parent_id_idx" ON "_hospital_history_v_version_journey_steps" USING btree ("_parent_id");
  CREATE INDEX "wh_milestones_order_idx" ON "wh_milestones" USING btree ("_order");
  CREATE INDEX "wh_milestones_parent_id_idx" ON "wh_milestones" USING btree ("_parent_id");
  CREATE INDEX "wh_dept_rows_order_idx" ON "wh_dept_rows" USING btree ("_order");
  CREATE INDEX "wh_dept_rows_parent_id_idx" ON "wh_dept_rows" USING btree ("_parent_id");
  CREATE INDEX "wh_depts_order_idx" ON "wh_depts" USING btree ("_order");
  CREATE INDEX "wh_depts_parent_id_idx" ON "wh_depts" USING btree ("_parent_id");
  CREATE INDEX "wh_sched_links_order_idx" ON "wh_sched_links" USING btree ("_order");
  CREATE INDEX "wh_sched_links_parent_id_idx" ON "wh_sched_links" USING btree ("_parent_id");
  CREATE INDEX "wh_notes_order_idx" ON "wh_notes" USING btree ("_order");
  CREATE INDEX "wh_notes_parent_id_idx" ON "wh_notes" USING btree ("_parent_id");
  CREATE INDEX "working_hours_settings_hero_hero_bg_image_idx" ON "working_hours_settings" USING btree ("hero_bg_image_id");
  CREATE INDEX "sch_notes_order_idx" ON "sch_notes" USING btree ("_order");
  CREATE INDEX "sch_notes_parent_id_idx" ON "sch_notes" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clinical_protocols_fk" FOREIGN KEY ("clinical_protocols_id") REFERENCES "public"."clinical_protocols"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hospital_history_core_values_values_list" ADD CONSTRAINT "hospital_history_core_values_values_list_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hospital_history_v_version_core_values_values_list" ADD CONSTRAINT "_hospital_history_v_version_core_values_values_list_custom_icon_id_media_id_fk" FOREIGN KEY ("custom_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schedule_settings" ADD CONSTRAINT "schedule_settings_hero_bg_image_id_media_id_fk" FOREIGN KEY ("hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_clinical_protocols_id_idx" ON "payload_locked_documents_rels" USING btree ("clinical_protocols_id");
  CREATE INDEX "hospital_history_core_values_values_list_custom_icon_idx" ON "hospital_history_core_values_values_list" USING btree ("custom_icon_id");
  CREATE INDEX "_hospital_history_v_version_core_values_values_list_cust_idx" ON "_hospital_history_v_version_core_values_values_list" USING btree ("custom_icon_id");
  CREATE INDEX "schedule_settings_hero_hero_bg_image_idx" ON "schedule_settings" USING btree ("hero_bg_image_id");
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "appearance_primary_color";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "appearance_accent_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_appearance_primary_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_appearance_accent_color";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clinical_protocols" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_clinical_protocols_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fn_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_fn_sources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hospital_history_quick_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "hospital_history_journey_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hospital_history_v_version_quick_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_hospital_history_v_version_journey_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wh_milestones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wh_dept_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wh_depts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wh_sched_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wh_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "working_hours_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sch_notes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "clinical_protocols" CASCADE;
  DROP TABLE "_clinical_protocols_v" CASCADE;
  DROP TABLE "fn_sources" CASCADE;
  DROP TABLE "_fn_sources_v" CASCADE;
  DROP TABLE "hospital_history_quick_stats" CASCADE;
  DROP TABLE "hospital_history_journey_steps" CASCADE;
  DROP TABLE "_hospital_history_v_version_quick_stats" CASCADE;
  DROP TABLE "_hospital_history_v_version_journey_steps" CASCADE;
  DROP TABLE "wh_milestones" CASCADE;
  DROP TABLE "wh_dept_rows" CASCADE;
  DROP TABLE "wh_depts" CASCADE;
  DROP TABLE "wh_sched_links" CASCADE;
  DROP TABLE "wh_notes" CASCADE;
  DROP TABLE "working_hours_settings" CASCADE;
  DROP TABLE "sch_notes" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clinical_protocols_fk";
  
  ALTER TABLE "hospital_history_core_values_values_list" DROP CONSTRAINT "hospital_history_core_values_values_list_custom_icon_id_media_id_fk";
  
  ALTER TABLE "_hospital_history_v_version_core_values_values_list" DROP CONSTRAINT "_hospital_history_v_version_core_values_values_list_custom_icon_id_media_id_fk";
  
  ALTER TABLE "schedule_settings" DROP CONSTRAINT "schedule_settings_hero_bg_image_id_media_id_fk";
  
  ALTER TABLE "categories" ALTER COLUMN "scope" SET DATA TYPE text;
  ALTER TABLE "categories" ALTER COLUMN "scope" SET DEFAULT 'news'::text;
  DROP TYPE IF EXISTS "public"."enum_categories_scope";
  CREATE TYPE "public"."enum_categories_scope" AS ENUM('news', 'notices', 'procurement', 'recruitment', 'documents');
  ALTER TABLE "categories" ALTER COLUMN "scope" SET DEFAULT 'news'::"public"."enum_categories_scope";
  ALTER TABLE "categories" ALTER COLUMN "scope" SET DATA TYPE "public"."enum_categories_scope" USING "scope"::"public"."enum_categories_scope";
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum_navigation_items_children_preset";
  CREATE TYPE "public"."enum_navigation_items_children_preset" AS ENUM('/', '/gioi-thieu', '/gioi-thieu/lich-su-phat-trien', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/hoat-dong-khoa-hoc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  ALTER TABLE "navigation_items_children" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_navigation_items_children_preset" USING "preset"::"public"."enum_navigation_items_children_preset";
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum_navigation_items_preset";
  CREATE TYPE "public"."enum_navigation_items_preset" AS ENUM('/', '/gioi-thieu', '/gioi-thieu/lich-su-phat-trien', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/hoat-dong-khoa-hoc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  ALTER TABLE "navigation_items" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_navigation_items_preset" USING "preset"::"public"."enum_navigation_items_preset";
  ALTER TABLE "_navigation_v_version_items_children" ALTER COLUMN "preset" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum__navigation_v_version_items_children_preset";
  CREATE TYPE "public"."enum__navigation_v_version_items_children_preset" AS ENUM('/', '/gioi-thieu', '/gioi-thieu/lich-su-phat-trien', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/hoat-dong-khoa-hoc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  ALTER TABLE "_navigation_v_version_items_children" ALTER COLUMN "preset" SET DATA TYPE "public"."enum__navigation_v_version_items_children_preset" USING "preset"::"public"."enum__navigation_v_version_items_children_preset";
  ALTER TABLE "_navigation_v_version_items" ALTER COLUMN "preset" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum__navigation_v_version_items_preset";
  CREATE TYPE "public"."enum__navigation_v_version_items_preset" AS ENUM('/', '/gioi-thieu', '/gioi-thieu/lich-su-phat-trien', '/so-do-to-chuc', '/khoa-phong', '/chuyen-khoa', '/bac-si', '/tin-tuc', '/hoat-dong-khoa-hoc', '/thong-bao', '/lich-kham', '/bang-gia', '/tiem-chung', '/dau-thau-mua-sam', '/van-ban', '/tuyen-dung', '/trang/kham-bhyt', '/lien-he');
  ALTER TABLE "_navigation_v_version_items" ALTER COLUMN "preset" SET DATA TYPE "public"."enum__navigation_v_version_items_preset" USING "preset"::"public"."enum__navigation_v_version_items_preset";
  ALTER TABLE "homepage_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum_homepage_sections_schedule_tab_order_tab";
  CREATE TYPE "public"."enum_homepage_sections_schedule_tab_order_tab" AS ENUM('attachments', 'daily', 'weekly');
  ALTER TABLE "homepage_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE "public"."enum_homepage_sections_schedule_tab_order_tab" USING "tab"::"public"."enum_homepage_sections_schedule_tab_order_tab";
  ALTER TABLE "_homepage_v_version_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE text;
  DROP TYPE IF EXISTS "public"."enum__homepage_v_version_sections_schedule_tab_order_tab";
  CREATE TYPE "public"."enum__homepage_v_version_sections_schedule_tab_order_tab" AS ENUM('attachments', 'daily', 'weekly');
  ALTER TABLE "_homepage_v_version_sections_schedule_tab_order" ALTER COLUMN "tab" SET DATA TYPE "public"."enum__homepage_v_version_sections_schedule_tab_order_tab" USING "tab"::"public"."enum__homepage_v_version_sections_schedule_tab_order_tab";
  DROP INDEX "payload_locked_documents_rels_clinical_protocols_id_idx";
  DROP INDEX "hospital_history_core_values_values_list_custom_icon_idx";
  DROP INDEX "_hospital_history_v_version_core_values_values_list_cust_idx";
  DROP INDEX "schedule_settings_hero_hero_bg_image_idx";
  ALTER TABLE "hospital_history" ALTER COLUMN "eyebrow" SET DEFAULT 'HÀNH TRÌNH PHÁT TRIỂN';
  ALTER TABLE "_hospital_history_v" ALTER COLUMN "version_eyebrow" SET DEFAULT 'HÀNH TRÌNH PHÁT TRIỂN';
  ALTER TABLE "about_page" ALTER COLUMN "core_principles_title" SET DEFAULT 'Giá trị cốt lõi & Văn hóa phục vụ';
  ALTER TABLE "about_page" ALTER COLUMN "core_principles_subtitle" SET DEFAULT 'Lấy người bệnh làm trung tâm trong mọi quyết định chuyên môn và quy trình chăm sóc y tế.';
  ALTER TABLE "_about_page_v" ALTER COLUMN "version_core_principles_title" SET DEFAULT 'Giá trị cốt lõi & Văn hóa phục vụ';
  ALTER TABLE "_about_page_v" ALTER COLUMN "version_core_principles_subtitle" SET DEFAULT 'Lấy người bệnh làm trung tâm trong mọi quyết định chuyên môn và quy trình chăm sóc y tế.';
  ALTER TABLE "hospital_history" ADD COLUMN "appearance_primary_color" varchar DEFAULT '#0878D1';
  ALTER TABLE "hospital_history" ADD COLUMN "appearance_accent_color" varchar DEFAULT '#16A36A';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_appearance_primary_color" varchar DEFAULT '#0878D1';
  ALTER TABLE "_hospital_history_v" ADD COLUMN "version_appearance_accent_color" varchar DEFAULT '#16A36A';
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "document_type";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "signer";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "content";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "allow_download";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "prevent_copy";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "show_viewer";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "title_color";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "title_size";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "summary_color";
  ALTER TABLE "documents" DROP COLUMN IF EXISTS "summary_size";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_document_type";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_signer";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_content";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_allow_download";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_prevent_copy";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_show_viewer";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_text_align";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_title_color";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_title_size";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_summary_color";
  ALTER TABLE "_documents_v" DROP COLUMN IF EXISTS "version_summary_size";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "clinical_protocols_id";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_font_size";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_font_weight";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_text_transform";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_font_family";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_letter_spacing";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_height";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_justify_content";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_item_spacing";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_border_radius";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_item_border_radius";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_background";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_gradient_end";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_text_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_hover_text_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_hover_background";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_active_indicator_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_width";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_font_size";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_border_radius";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_background";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_text_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_border_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_hover_background";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_hover_text_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_dropdown_arrow_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_animation_style";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "header_menu_appearance_animation_speed";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "service_price_page_show_notice_banner";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "service_price_page_notice_title";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "service_price_page_notice_content";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "service_price_page_notice_align";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_title";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_description";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_show_notice_banner";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_notice_title";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_notice_content";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "vaccination_page_notice_align";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_font_size";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_font_weight";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_text_transform";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_font_family";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_letter_spacing";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_height";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_justify_content";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_item_spacing";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_border_radius";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_item_border_radius";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_background";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_gradient_end";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_text_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_hover_text_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_hover_background";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_active_indicator_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_width";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_font_size";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_border_radius";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_background";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_text_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_border_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_hover_background";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_hover_text_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_dropdown_arrow_color";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_animation_style";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_header_menu_appearance_animation_speed";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_service_price_page_show_notice_banner";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_service_price_page_notice_title";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_service_price_page_notice_content";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_service_price_page_notice_align";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_eyebrow";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_title";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_description";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_show_notice_banner";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_notice_title";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_notice_content";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_vaccination_page_notice_align";
  ALTER TABLE "footer_columns" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "_footer_v_version_columns" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "homepage_sections" DROP COLUMN IF EXISTS "featured_filter_mode";
  ALTER TABLE "homepage_sections" DROP COLUMN IF EXISTS "featured_see_all_url";
  ALTER TABLE "homepage_sections" DROP COLUMN IF EXISTS "featured_card_fit";
  ALTER TABLE "homepage" DROP COLUMN IF EXISTS "enable_section_scroll_snap";
  ALTER TABLE "_homepage_v_version_sections" DROP COLUMN IF EXISTS "featured_filter_mode";
  ALTER TABLE "_homepage_v_version_sections" DROP COLUMN IF EXISTS "featured_see_all_url";
  ALTER TABLE "_homepage_v_version_sections" DROP COLUMN IF EXISTS "featured_card_fit";
  ALTER TABLE "_homepage_v" DROP COLUMN IF EXISTS "version_enable_section_scroll_snap";
  ALTER TABLE "organization_chart_deputy_directors" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "organization_chart" DROP COLUMN IF EXISTS "show_leadership_section";
  ALTER TABLE "organization_chart" DROP COLUMN IF EXISTS "leadership_title";
  ALTER TABLE "organization_chart" DROP COLUMN IF EXISTS "show_tree_section";
  ALTER TABLE "organization_chart" DROP COLUMN IF EXISTS "tree_title";
  ALTER TABLE "organization_chart" DROP COLUMN IF EXISTS "director_enabled";
  ALTER TABLE "_organization_chart_v_version_deputy_directors" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "_organization_chart_v" DROP COLUMN IF EXISTS "version_show_leadership_section";
  ALTER TABLE "_organization_chart_v" DROP COLUMN IF EXISTS "version_leadership_title";
  ALTER TABLE "_organization_chart_v" DROP COLUMN IF EXISTS "version_show_tree_section";
  ALTER TABLE "_organization_chart_v" DROP COLUMN IF EXISTS "version_tree_title";
  ALTER TABLE "_organization_chart_v" DROP COLUMN IF EXISTS "version_director_enabled";
  ALTER TABLE "hospital_history_milestones" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "hospital_history_core_values_values_list" DROP COLUMN IF EXISTS "icon_type";
  ALTER TABLE "hospital_history_core_values_values_list" DROP COLUMN IF EXISTS "custom_icon_id";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_hero";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "hero_min_height";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "hero_align";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_quick_stats";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_lead";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "lead_align";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "lead_font_size";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_timeline";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "timeline_kicker";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "timeline_title";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "timeline_desc";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_core_values";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "core_values_kicker";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "core_values_title";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "core_values_desc";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_journey";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "journey_kicker";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "journey_title";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "journey_desc";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "journey_bottom_text";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_achievements";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "achievements_kicker";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "achievements_title";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "achievements_desc";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_content";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "show_cta";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "cta_title";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "cta_desc";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "cta_btn_primary_text";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "cta_btn_primary_url";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "cta_btn_secondary_text";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "cta_btn_secondary_url";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "primary_color";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "accent_color";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "text_color";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "card_bg_color";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "font_family";
  ALTER TABLE "hospital_history" DROP COLUMN IF EXISTS "card_padding";
  ALTER TABLE "_hospital_history_v_version_milestones" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "_hospital_history_v_version_core_values_values_list" DROP COLUMN IF EXISTS "icon_type";
  ALTER TABLE "_hospital_history_v_version_core_values_values_list" DROP COLUMN IF EXISTS "custom_icon_id";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_hero";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_hero_min_height";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_hero_align";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_quick_stats";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_lead";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_lead_align";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_lead_font_size";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_timeline";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_timeline_kicker";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_timeline_title";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_timeline_desc";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_core_values";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_core_values_kicker";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_core_values_title";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_core_values_desc";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_journey";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_journey_kicker";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_journey_title";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_journey_desc";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_journey_bottom_text";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_achievements";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_achievements_kicker";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_achievements_title";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_achievements_desc";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_content";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_show_cta";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_cta_title";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_cta_desc";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_cta_btn_primary_text";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_cta_btn_primary_url";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_cta_btn_secondary_text";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_cta_btn_secondary_url";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_primary_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_accent_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_heading_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_text_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_card_bg_color";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_font_family";
  ALTER TABLE "_hospital_history_v" DROP COLUMN IF EXISTS "version_card_padding";
  ALTER TABLE "about_page_stats" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "about_page_core_principles_items" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "about_page_core_principles_items" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "about_page_facilities_items" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "about_page_facilities_items" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "about_page_related_links_links" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "hero_enabled";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "hero_text_align";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "core_principles_enabled";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "facilities_enabled";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "commitment_enabled";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "commitment_text_align";
  ALTER TABLE "about_page" DROP COLUMN IF EXISTS "related_links_enabled";
  ALTER TABLE "_about_page_v_version_stats" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "_about_page_v_version_core_principles_items" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "_about_page_v_version_core_principles_items" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "_about_page_v_version_facilities_items" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "_about_page_v_version_facilities_items" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "_about_page_v_version_related_links_links" DROP COLUMN IF EXISTS "enabled";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_hero_enabled";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_hero_text_align";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_core_principles_enabled";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_facilities_enabled";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_commitment_enabled";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_commitment_text_align";
  ALTER TABLE "_about_page_v" DROP COLUMN IF EXISTS "version_related_links_enabled";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_eyebrow";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_title";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_title_size";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_title_color";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_description";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_bg_type";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_bg_gradient";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_bg_image_id";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "hero_overlay_opacity";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "quick_notice_enabled";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "quick_notice_text_align";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "quick_notice_title";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "quick_notice_title_color";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "quick_notice_content";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "quick_notice_hotline";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "notes_section_enabled";
  ALTER TABLE "schedule_settings" DROP COLUMN IF EXISTS "notes_section_title";
  DROP TYPE IF EXISTS "public"."enum_documents_text_align";
  DROP TYPE IF EXISTS "public"."enum_documents_title_color";
  DROP TYPE IF EXISTS "public"."enum_documents_title_size";
  DROP TYPE IF EXISTS "public"."enum_documents_summary_color";
  DROP TYPE IF EXISTS "public"."enum_documents_summary_size";
  DROP TYPE IF EXISTS "public"."enum__documents_v_version_text_align";
  DROP TYPE IF EXISTS "public"."enum__documents_v_version_title_color";
  DROP TYPE IF EXISTS "public"."enum__documents_v_version_title_size";
  DROP TYPE IF EXISTS "public"."enum__documents_v_version_summary_color";
  DROP TYPE IF EXISTS "public"."enum__documents_v_version_summary_size";
  DROP TYPE IF EXISTS "public"."enum_clinical_protocols_text_align";
  DROP TYPE IF EXISTS "public"."enum_clinical_protocols_title_color";
  DROP TYPE IF EXISTS "public"."enum_clinical_protocols_title_size";
  DROP TYPE IF EXISTS "public"."enum_clinical_protocols_summary_color";
  DROP TYPE IF EXISTS "public"."enum_clinical_protocols_summary_size";
  DROP TYPE IF EXISTS "public"."enum__clinical_protocols_v_version_text_align";
  DROP TYPE IF EXISTS "public"."enum__clinical_protocols_v_version_title_color";
  DROP TYPE IF EXISTS "public"."enum__clinical_protocols_v_version_title_size";
  DROP TYPE IF EXISTS "public"."enum__clinical_protocols_v_version_summary_color";
  DROP TYPE IF EXISTS "public"."enum__clinical_protocols_v_version_summary_size";
  DROP TYPE IF EXISTS "public"."menu_font_weight";
  DROP TYPE IF EXISTS "public"."menu_text_transform";
  DROP TYPE IF EXISTS "public"."menu_font_family";
  DROP TYPE IF EXISTS "public"."menu_justify_content";
  DROP TYPE IF EXISTS "public"."menu_anim_style";
  DROP TYPE IF EXISTS "public"."menu_anim_speed";
  DROP TYPE IF EXISTS "public"."sp_not_align";
  DROP TYPE IF EXISTS "public"."vc_not_align";
  DROP TYPE IF EXISTS "public"."ft_col_align";
  DROP TYPE IF EXISTS "public"."enum_fn_sources_source";
  DROP TYPE IF EXISTS "public"."enum_homepage_sections_featured_filter_mode";
  DROP TYPE IF EXISTS "public"."enum_homepage_sections_featured_card_fit";
  DROP TYPE IF EXISTS "public"."enum__fn_sources_v_source";
  DROP TYPE IF EXISTS "public"."enum__homepage_v_version_sections_featured_filter_mode";
  DROP TYPE IF EXISTS "public"."enum__homepage_v_version_sections_featured_card_fit";
  DROP TYPE IF EXISTS "public"."hist_milestone_align";
  DROP TYPE IF EXISTS "public"."hist_icon_type";
  DROP TYPE IF EXISTS "public"."hist_hero_align";
  DROP TYPE IF EXISTS "public"."hist_lead_align";
  DROP TYPE IF EXISTS "public"."hist_font_family";
  DROP TYPE IF EXISTS "public"."ab_cp_align";
  DROP TYPE IF EXISTS "public"."ab_fc_align";
  DROP TYPE IF EXISTS "public"."ab_hero_align";
  DROP TYPE IF EXISTS "public"."ab_cm_align";
  DROP TYPE IF EXISTS "public"."wh_ms_align";
  DROP TYPE IF EXISTS "public"."wh_ms_tcolor";
  DROP TYPE IF EXISTS "public"."wh_ms_tsize";
  DROP TYPE IF EXISTS "public"."wh_ms_dcolor";
  DROP TYPE IF EXISTS "public"."wh_ms_dsize";
  DROP TYPE IF EXISTS "public"."wh_dept_icon";
  DROP TYPE IF EXISTS "public"."wh_dept_badge_color";
  DROP TYPE IF EXISTS "public"."wh_dept_align";
  DROP TYPE IF EXISTS "public"."wh_dept_tcolor";
  DROP TYPE IF EXISTS "public"."wh_dept_tsize";
  DROP TYPE IF EXISTS "public"."wh_dept_ncolor";
  DROP TYPE IF EXISTS "public"."wh_dept_nsize";
  DROP TYPE IF EXISTS "public"."wh_link_icon";
  DROP TYPE IF EXISTS "public"."wh_link_align";
  DROP TYPE IF EXISTS "public"."wh_link_tcolor";
  DROP TYPE IF EXISTS "public"."wh_link_tsize";
  DROP TYPE IF EXISTS "public"."wh_note_align";
  DROP TYPE IF EXISTS "public"."wh_note_tcolor";
  DROP TYPE IF EXISTS "public"."wh_note_tsize";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_hero_title_size";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_hero_title_color";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_hero_bg_type";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_hero_bg_gradient";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_hero_overlay_opacity";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_emergency_banner_text_align";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_emergency_banner_title_size";
  DROP TYPE IF EXISTS "public"."enum_working_hours_settings_emergency_banner_desc_size";
  DROP TYPE IF EXISTS "public"."sch_n_align";
  DROP TYPE IF EXISTS "public"."sch_n_tcolor";
  DROP TYPE IF EXISTS "public"."sch_n_tsize";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_hero_title_size";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_hero_title_color";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_hero_bg_type";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_hero_bg_gradient";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_hero_overlay_opacity";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_quick_notice_text_align";
  DROP TYPE IF EXISTS "public"."enum_schedule_settings_quick_notice_title_color";`)
}
