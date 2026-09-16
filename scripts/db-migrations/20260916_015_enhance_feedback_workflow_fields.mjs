export const id = '20260916_015_enhance_feedback_workflow_fields'
export const description = 'Thêm các trường quy trình xử lý phản ánh (code, response, resolution_note, handled_by, resolved_at) vào bảng feedback'
export const transactional = false

export async function up({ client }) {
  // Thêm các cột mới vào bảng feedback
  await client.query(`
    ALTER TABLE public."feedback"
    ADD COLUMN IF NOT EXISTS "code" varchar,
    ADD COLUMN IF NOT EXISTS "response" text,
    ADD COLUMN IF NOT EXISTS "resolution_note" text,
    ADD COLUMN IF NOT EXISTS "handled_by_id" integer,
    ADD COLUMN IF NOT EXISTS "resolved_at" timestamp with time zone;
  `)

  // Thêm index cho code để tra cứu tức thì
  await client.query(`
    CREATE INDEX IF NOT EXISTS "idx_feedback_code" ON public."feedback" ("code");
  `)

  // Cập nhật foreign key cho handled_by_id trỏ tới users nếu có bảng users
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'feedback_handled_by_id_users_id_fk'
      ) THEN
        ALTER TABLE public."feedback"
        ADD CONSTRAINT "feedback_handled_by_id_users_id_fk"
        FOREIGN KEY ("handled_by_id") REFERENCES public."users"("id") ON DELETE SET NULL;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'feedback' 
      AND column_name = 'response';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột response trong bảng feedback.')
  }
}
