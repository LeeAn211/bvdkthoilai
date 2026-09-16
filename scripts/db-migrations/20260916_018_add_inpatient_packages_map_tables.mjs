export const id = '20260916_018_add_inpatient_packages_map_tables'
export const description = 'Tạo các bảng và cột quản trị 3 trang mới: Điều trị nội trú (ip_), Gói khám (chk_), Sơ đồ bệnh viện (hm_)'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các kiểu enum nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ip_not_align') THEN
        CREATE TYPE public."ip_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pkg_not_align') THEN
        CREATE TYPE public."pkg_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'map_not_align') THEN
        CREATE TYPE public."map_not_align" AS ENUM ('left', 'center', 'justify');
      END IF;
    END $$;
  `)

  // 2. Bổ sung các cột vào site_settings và _site_settings_v
  await client.query(`
    ALTER TABLE public."site_settings"
      ADD COLUMN IF NOT EXISTS "inpatient_page_eyebrow" varchar DEFAULT 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
      ADD COLUMN IF NOT EXISTS "inpatient_page_title" varchar DEFAULT 'Hướng dẫn Điều trị Nội trú',
      ADD COLUMN IF NOT EXISTS "inpatient_page_description" varchar DEFAULT 'Thông tin chi tiết về thủ tục nhập viện, đồ dùng cần chuẩn bị, quy định buồng bệnh, giờ thăm bệnh và chế độ dinh dưỡng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "inpatient_page_show_notice_banner" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "inpatient_page_notice_title" varchar DEFAULT 'Nội quy buồng bệnh và an toàn người bệnh',
      ADD COLUMN IF NOT EXISTS "inpatient_page_notice_content" varchar DEFAULT '• Mỗi người bệnh được tối đa 01 người thân ở lại chăm sóc và phải đeo thẻ nuôi bệnh.
• Giữ gìn trật tự chung, tuyệt đối không hút thuốc lá trong khuôn viên bệnh viện.
• Bệnh viện phục vụ chế độ ăn bệnh lý đạt chuẩn an toàn vệ sinh thực phẩm.',
      ADD COLUMN IF NOT EXISTS "inpatient_page_notice_align" public."ip_not_align" DEFAULT 'left',

      ADD COLUMN IF NOT EXISTS "checkup_packages_page_eyebrow" varchar DEFAULT 'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE',
      ADD COLUMN IF NOT EXISTS "checkup_packages_page_title" varchar DEFAULT 'Gói Khám Sức khỏe & Tầm soát Bệnh lý',
      ADD COLUMN IF NOT EXISTS "checkup_packages_page_description" varchar DEFAULT 'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "checkup_packages_page_show_notice_banner" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "checkup_packages_page_notice_title" varchar DEFAULT 'Lưu ý quan trọng trước khi đi khám sức khỏe',
      ADD COLUMN IF NOT EXISTS "checkup_packages_page_notice_content" varchar DEFAULT '• Nhịn ăn sáng từ 8 - 10 tiếng nếu gói khám có xét nghiệm đường huyết, mỡ máu.
• Uống nhiều nước lọc và nhịn tiểu trước khi làm siêu âm ổ bụng.
• Không sử dụng rượu bia, chất kích thích 24 giờ trước khi khám.',
      ADD COLUMN IF NOT EXISTS "checkup_packages_page_notice_align" public."pkg_not_align" DEFAULT 'left',

      ADD COLUMN IF NOT EXISTS "hospital_map_page_eyebrow" varchar DEFAULT 'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH',
      ADD COLUMN IF NOT EXISTS "hospital_map_page_title" varchar DEFAULT 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
      ADD COLUMN IF NOT EXISTS "hospital_map_page_description" varchar DEFAULT 'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "hospital_map_page_show_notice_banner" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "hospital_map_page_notice_title" varchar DEFAULT 'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển',
      ADD COLUMN IF NOT EXISTS "hospital_map_page_notice_content" varchar DEFAULT '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.
• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.',
      ADD COLUMN IF NOT EXISTS "hospital_map_page_notice_align" public."map_not_align" DEFAULT 'left';

    ALTER TABLE public."_site_settings_v"
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_eyebrow" varchar DEFAULT 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_title" varchar DEFAULT 'Hướng dẫn Điều trị Nội trú',
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_description" varchar DEFAULT 'Thông tin chi tiết về thủ tục nhập viện, đồ dùng cần chuẩn bị, quy định buồng bệnh, giờ thăm bệnh và chế độ dinh dưỡng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_show_notice_banner" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_notice_title" varchar DEFAULT 'Nội quy buồng bệnh và an toàn người bệnh',
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_notice_content" varchar DEFAULT '• Mỗi người bệnh được tối đa 01 người thân ở lại chăm sóc và phải đeo thẻ nuôi bệnh.
• Giữ gìn trật tự chung, tuyệt đối không hút thuốc lá trong khuôn viên bệnh viện.
• Bệnh viện phục vụ chế độ ăn bệnh lý đạt chuẩn an toàn vệ sinh thực phẩm.',
      ADD COLUMN IF NOT EXISTS "version_inpatient_page_notice_align" public."ip_not_align" DEFAULT 'left',

      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_eyebrow" varchar DEFAULT 'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE',
      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_title" varchar DEFAULT 'Gói Khám Sức khỏe & Tầm soát Bệnh lý',
      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_description" varchar DEFAULT 'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_show_notice_banner" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_notice_title" varchar DEFAULT 'Lưu ý quan trọng trước khi đi khám sức khỏe',
      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_notice_content" varchar DEFAULT '• Nhịn ăn sáng từ 8 - 10 tiếng nếu gói khám có xét nghiệm đường huyết, mỡ máu.
• Uống nhiều nước lọc và nhịn tiểu trước khi làm siêu âm ổ bụng.
• Không sử dụng rượu bia, chất kích thích 24 giờ trước khi khám.',
      ADD COLUMN IF NOT EXISTS "version_checkup_packages_page_notice_align" public."pkg_not_align" DEFAULT 'left',

      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_eyebrow" varchar DEFAULT 'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH',
      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_title" varchar DEFAULT 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_description" varchar DEFAULT 'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_show_notice_banner" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_notice_title" varchar DEFAULT 'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển',
      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_notice_content" varchar DEFAULT '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.
• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.',
      ADD COLUMN IF NOT EXISTS "version_hospital_map_page_notice_align" public."map_not_align" DEFAULT 'left';
  `)

  // 3. Tạo các bảng chính & version cho Trang Hướng dẫn Điều trị Nội trú (ip_steps, ip_hours, ip_items)
  await client.query(`
    -- ip_steps
    CREATE TABLE IF NOT EXISTS public."ip_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "step" numeric NOT NULL,
      "title" varchar NOT NULL,
      "location" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "note" varchar
    );
    CREATE INDEX IF NOT EXISTS "ip_steps_order_idx" ON public."ip_steps" ("_order");
    CREATE INDEX IF NOT EXISTS "ip_steps_parent_id_idx" ON public."ip_steps" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ip_steps_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "step" numeric NOT NULL,
      "title" varchar NOT NULL,
      "location" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "note" varchar,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_ip_steps_v_order_idx" ON public."_ip_steps_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ip_steps_v_parent_id_idx" ON public."_ip_steps_v" ("_parent_id");

    -- ip_hours
    CREATE TABLE IF NOT EXISTS public."ip_hours" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "session" varchar NOT NULL,
      "time_range" varchar NOT NULL,
      "note" varchar
    );
    CREATE INDEX IF NOT EXISTS "ip_hours_order_idx" ON public."ip_hours" ("_order");
    CREATE INDEX IF NOT EXISTS "ip_hours_parent_id_idx" ON public."ip_hours" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ip_hours_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "session" varchar NOT NULL,
      "time_range" varchar NOT NULL,
      "note" varchar,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_ip_hours_v_order_idx" ON public."_ip_hours_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ip_hours_v_parent_id_idx" ON public."_ip_hours_v" ("_parent_id");

    -- ip_items
    CREATE TABLE IF NOT EXISTS public."ip_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '🎒',
      "category" varchar NOT NULL,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "ip_items_order_idx" ON public."ip_items" ("_order");
    CREATE INDEX IF NOT EXISTS "ip_items_parent_id_idx" ON public."ip_items" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_ip_items_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '🎒',
      "category" varchar NOT NULL,
      "title" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_ip_items_v_order_idx" ON public."_ip_items_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_ip_items_v_parent_id_idx" ON public."_ip_items_v" ("_parent_id");
  `)

  // 4. Tạo các bảng chính & version cho Gói khám sức khỏe (chk_pkgs)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."chk_pkgs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "badge" varchar,
      "title" varchar NOT NULL,
      "target_user" varchar NOT NULL,
      "price_text" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "features" varchar NOT NULL,
      "button_text" varchar DEFAULT 'Đăng ký gói khám',
      "button_link" varchar DEFAULT '/dat-lich-kham'
    );
    CREATE INDEX IF NOT EXISTS "chk_pkgs_order_idx" ON public."chk_pkgs" ("_order");
    CREATE INDEX IF NOT EXISTS "chk_pkgs_parent_id_idx" ON public."chk_pkgs" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_chk_pkgs_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "badge" varchar,
      "title" varchar NOT NULL,
      "target_user" varchar NOT NULL,
      "price_text" varchar NOT NULL,
      "desc" varchar NOT NULL,
      "features" varchar NOT NULL,
      "button_text" varchar DEFAULT 'Đăng ký gói khám',
      "button_link" varchar DEFAULT '/dat-lich-kham',
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_chk_pkgs_v_order_idx" ON public."_chk_pkgs_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_chk_pkgs_v_parent_id_idx" ON public."_chk_pkgs_v" ("_parent_id");
  `)

  // 5. Tạo các bảng chính & version cho Sơ đồ bệnh viện (hm_floors, hm_facils)
  await client.query(`
    -- hm_floors
    CREATE TABLE IF NOT EXISTS public."hm_floors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "floor_name" varchar NOT NULL,
      "overview" varchar NOT NULL,
      "rooms" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "hm_floors_order_idx" ON public."hm_floors" ("_order");
    CREATE INDEX IF NOT EXISTS "hm_floors_parent_id_idx" ON public."hm_floors" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_hm_floors_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "floor_name" varchar NOT NULL,
      "overview" varchar NOT NULL,
      "rooms" varchar NOT NULL,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_hm_floors_v_order_idx" ON public."_hm_floors_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hm_floors_v_parent_id_idx" ON public."_hm_floors_v" ("_parent_id");

    -- hm_facils
    CREATE TABLE IF NOT EXISTS public."hm_facils" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📍',
      "name" varchar NOT NULL,
      "location" varchar NOT NULL,
      "hours" varchar DEFAULT '24/24 hoặc Giờ hành chính',
      "desc" varchar
    );
    CREATE INDEX IF NOT EXISTS "hm_facils_order_idx" ON public."hm_facils" ("_order");
    CREATE INDEX IF NOT EXISTS "hm_facils_parent_id_idx" ON public."hm_facils" ("_parent_id");

    CREATE TABLE IF NOT EXISTS public."_hm_facils_v" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "icon" varchar DEFAULT '📍',
      "name" varchar NOT NULL,
      "location" varchar NOT NULL,
      "hours" varchar DEFAULT '24/24 hoặc Giờ hành chính',
      "desc" varchar,
      "_uuid" varchar
    );
    CREATE INDEX IF NOT EXISTS "_hm_facils_v_order_idx" ON public."_hm_facils_v" ("_order");
    CREATE INDEX IF NOT EXISTS "_hm_facils_v_parent_id_idx" ON public."_hm_facils_v" ("_parent_id");
  `)
}

export async function verify({ client }) {
  const tables = ['ip_steps', 'ip_hours', 'ip_items', 'chk_pkgs', 'hm_floors', 'hm_facils']
  for (const t of tables) {
    const res = await client.query(`SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1;`, [t])
    if (res.rowCount === 0) {
      throw new Error(`Chưa tìm thấy bảng ${t} sau khi thực thi migration.`)
    }
  }
}
