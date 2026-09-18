export const id = '20260918_038_sync_chatbot_settings_enhancements'
export const description = 'Bổ sung assistant_logo_id, primary_color, notice_text, fallback_link và tạo bảng cb_quick_topics cho chatbot_settings'
export const transactional = false

export async function up({ client }) {
  // 1. Bổ sung các cột mới vào chatbot_settings
  await client.query(`
    ALTER TABLE public."chatbot_settings"
      ADD COLUMN IF NOT EXISTS "back_to_top_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "assistant_logo_id" integer,
      ADD COLUMN IF NOT EXISTS "notice_text" varchar DEFAULT 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.',
      ADD COLUMN IF NOT EXISTS "primary_color" varchar DEFAULT '#0878D1',
      ADD COLUMN IF NOT EXISTS "fallback_link_label" varchar DEFAULT 'Liên hệ bệnh viện',
      ADD COLUMN IF NOT EXISTS "fallback_link_url" varchar DEFAULT '/lien-he';
  `)

  // 2. Tạo index cho assistant_logo_id nếu chưa có
  await client.query(`
    CREATE INDEX IF NOT EXISTS "chatbot_settings_assistant_logo_idx" 
      ON public."chatbot_settings" ("assistant_logo_id");
  `)

  // 3. Khóa ngoại assistant_logo_id -> media(id)
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chatbot_settings_assistant_logo_id_media_id_fk' 
        AND table_name = 'chatbot_settings'
      ) THEN
        ALTER TABLE public."chatbot_settings"
          ADD CONSTRAINT "chatbot_settings_assistant_logo_id_media_id_fk"
          FOREIGN KEY ("assistant_logo_id") REFERENCES public."media"("id") ON DELETE SET NULL;
      END IF;
    END $$;
  `)

  // 4. Tạo bảng cb_quick_topics cho các nút hỏi nhanh của chatbot
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."cb_quick_topics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "cb_quick_topics_order_idx" ON public."cb_quick_topics" ("_order");
    CREATE INDEX IF NOT EXISTS "cb_quick_topics_parent_id_idx" ON public."cb_quick_topics" ("_parent_id");

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'cb_quick_topics_parent_id_fk' 
        AND table_name = 'cb_quick_topics'
      ) THEN
        ALTER TABLE public."cb_quick_topics"
          ADD CONSTRAINT "cb_quick_topics_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES public."chatbot_settings"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // 1. Kiểm tra các cột trong chatbot_settings
  const columnCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'chatbot_settings' 
      AND column_name IN ('assistant_logo_id', 'primary_color', 'notice_text', 'fallback_link_label');
  `)
  if (columnCheck.rowCount < 4) {
    throw new Error('Chưa tìm thấy đầy đủ các cột mới trong bảng chatbot_settings.')
  }

  // 2. Kiểm tra bảng cb_quick_topics
  const tableCheck = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'cb_quick_topics';
  `)
  if (tableCheck.rowCount === 0) {
    throw new Error('Chưa tìm thấy bảng cb_quick_topics trong PostgreSQL.')
  }
}
