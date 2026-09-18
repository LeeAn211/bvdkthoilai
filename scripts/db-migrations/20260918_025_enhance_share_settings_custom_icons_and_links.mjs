export const id = '20260918_025_enhance_share_settings_custom_icons_and_links'
export const description = 'Bổ sung các trường icon và link tùy chỉnh cho Facebook, Zalo, Copy, Print và tạo bảng ads_share_btns cho phép thêm không giới hạn các nút icon chia sẻ'
export const transactional = false

export async function up({ client }) {
  // 1. Bổ sung các cột icon tùy chỉnh và link tùy chỉnh vào bảng article_detail_settings
  await client.query(`
    ALTER TABLE public."article_detail_settings"
      ADD COLUMN IF NOT EXISTS "share_settings_facebook_custom_icon_id" integer,
      ADD COLUMN IF NOT EXISTS "share_settings_facebook_url_template" varchar DEFAULT 'https://www.facebook.com/sharer/sharer.php?u={url}',
      ADD COLUMN IF NOT EXISTS "share_settings_zalo_custom_icon_id" integer,
      ADD COLUMN IF NOT EXISTS "share_settings_zalo_url_template" varchar DEFAULT 'https://zalo.me',
      ADD COLUMN IF NOT EXISTS "share_settings_copy_link_custom_icon_id" integer,
      ADD COLUMN IF NOT EXISTS "share_settings_print_custom_icon_id" integer;
  `)

  // 2. Tạo bảng ads_share_btns cho mảng các nút icon chia sẻ tùy chỉnh
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."ads_share_btns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "enabled" boolean DEFAULT true,
      "title" varchar NOT NULL,
      "custom_icon_id" integer,
      "share_url_template" varchar NOT NULL,
      "open_new_tab" boolean DEFAULT true
    );

    CREATE INDEX IF NOT EXISTS "ads_share_btns_order_idx" ON public."ads_share_btns" ("_order");
    CREATE INDEX IF NOT EXISTS "ads_share_btns_parent_id_idx" ON public."ads_share_btns" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "ads_share_btns_custom_icon_idx" ON public."ads_share_btns" ("custom_icon_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'ads_share_btns_parent_id_fk'
      ) THEN
        ALTER TABLE public."ads_share_btns"
          ADD CONSTRAINT "ads_share_btns_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."article_detail_settings" ("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // Kiểm tra cột mới trên bảng article_detail_settings
  const colRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'article_detail_settings' AND column_name = 'share_settings_facebook_custom_icon_id';
  `)
  if (colRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột share_settings_facebook_custom_icon_id trong article_detail_settings.')
  }

  // Kiểm tra bảng ads_share_btns
  const tableRes = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ads_share_btns';
  `)
  if (tableRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng ads_share_btns trong PostgreSQL.')
  }
}
