export const id = '20260920_058_consultation_live_chat'
export const description = 'Nâng tư vấn trực tuyến thành hội thoại nhiều tin nhắn giữa người dùng và tư vấn viên'

export async function up({ client }) {
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE public."enum_consult_msgs_sender" AS ENUM ('user', 'staff', 'system');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE public."consultations"
      ADD COLUMN IF NOT EXISTS "last_message_at" timestamp(3) with time zone;

    CREATE TABLE IF NOT EXISTS public."consult_msgs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "sender" public."enum_consult_msgs_sender" NOT NULL DEFAULT 'staff',
      "text" varchar NOT NULL,
      "sent_at" timestamp(3) with time zone NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "consult_msgs_order_idx" ON public."consult_msgs" ("_order");
    CREATE INDEX IF NOT EXISTS "consult_msgs_parent_id_idx" ON public."consult_msgs" ("_parent_id");

    DO $$ BEGIN
      ALTER TABLE public."consult_msgs"
        ADD CONSTRAINT "consult_msgs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES public."consultations"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    INSERT INTO public."consult_msgs" ("_order", "_parent_id", "id", "sender", "text", "sent_at")
    SELECT 0, c.id, md5(c.id::text || ':legacy:user'), 'user', c.question, c.created_at
    FROM public."consultations" c
    WHERE c.question IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM public."consult_msgs" m WHERE m."_parent_id" = c.id);

    INSERT INTO public."consult_msgs" ("_order", "_parent_id", "id", "sender", "text", "sent_at")
    SELECT 1, c.id, md5(c.id::text || ':legacy:staff'), 'staff', c.staff_reply, COALESCE(c.answered_at, c.updated_at)
    FROM public."consultations" c
    WHERE c.staff_reply IS NOT NULL AND btrim(c.staff_reply) <> ''
      AND NOT EXISTS (SELECT 1 FROM public."consult_msgs" m WHERE m."_parent_id" = c.id AND m.sender = 'staff');

    UPDATE public."consultations"
    SET "last_message_at" = COALESCE("answered_at", "updated_at", "created_at")
    WHERE "last_message_at" IS NULL;
  `)
}

export async function verify({ client }) {
  const table = await client.query(`SELECT to_regclass('public.consult_msgs') AS name`)
  if (!table.rows[0]?.name) throw new Error('Chưa tạo bảng hội thoại tư vấn consult_msgs.')
  const column = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'consultations' AND column_name = 'last_message_at'
  `)
  if (column.rowCount !== 1) throw new Error('Thiếu cột last_message_at của tư vấn trực tuyến.')
}
