export const id = '20260922_062_allow_multiple_specialties_for_clinical_protocols'
export const description = 'Tạo các bảng quan hệ clinical_protocols_rels và _clinical_protocols_v_rels để hỗ trợ chọn nhiều Chuyên khoa cho Phác đồ điều trị'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo bảng clinical_protocols_rels
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."clinical_protocols_rels" (
      "id" serial PRIMARY KEY,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" character varying NOT NULL,
      "specialties_id" integer,
      CONSTRAINT "clinical_protocols_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES public."clinical_protocols"("id") ON DELETE CASCADE,
      CONSTRAINT "clinical_protocols_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES public."specialties"("id") ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "clinical_protocols_rels_order_idx" ON public."clinical_protocols_rels" ("order");
    CREATE INDEX IF NOT EXISTS "clinical_protocols_rels_parent_idx" ON public."clinical_protocols_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "clinical_protocols_rels_path_idx" ON public."clinical_protocols_rels" ("path");
    CREATE INDEX IF NOT EXISTS "clinical_protocols_rels_specialties_id_idx" ON public."clinical_protocols_rels" ("specialties_id");
  `)

  // 2. Tạo bảng _clinical_protocols_v_rels
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_clinical_protocols_v_rels" (
      "id" serial PRIMARY KEY,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" character varying NOT NULL,
      "specialties_id" integer,
      CONSTRAINT "_clinical_protocols_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES public."_clinical_protocols_v"("id") ON DELETE CASCADE,
      CONSTRAINT "_clinical_protocols_v_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES public."specialties"("id") ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "_clinical_protocols_v_rels_order_idx" ON public."_clinical_protocols_v_rels" ("order");
    CREATE INDEX IF NOT EXISTS "_clinical_protocols_v_rels_parent_idx" ON public."_clinical_protocols_v_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_clinical_protocols_v_rels_path_idx" ON public."_clinical_protocols_v_rels" ("path");
    CREATE INDEX IF NOT EXISTS "_clinical_protocols_v_rels_specialties_id_idx" ON public."_clinical_protocols_v_rels" ("specialties_id");
  `)

  // 3. Di chuyển dữ liệu cũ từ cột specialty_id (nếu có) sang bảng rels mới để bảo toàn dữ liệu
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'clinical_protocols' AND column_name = 'specialty_id'
      ) THEN
        INSERT INTO public."clinical_protocols_rels" ("order", "parent_id", "path", "specialties_id")
        SELECT 1, "id", 'specialty', "specialty_id"
        FROM public."clinical_protocols"
        WHERE "specialty_id" IS NOT NULL
        ON CONFLICT DO NOTHING;
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = '_clinical_protocols_v' AND column_name = 'version_specialty_id'
      ) THEN
        INSERT INTO public."_clinical_protocols_v_rels" ("order", "parent_id", "path", "specialties_id")
        SELECT 1, "id", 'version_specialty', "version_specialty_id"
        FROM public."_clinical_protocols_v"
        WHERE "version_specialty_id" IS NOT NULL
        ON CONFLICT DO NOTHING;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const checkRes = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('clinical_protocols_rels', '_clinical_protocols_v_rels');
  `)

  if (checkRes.rowCount !== 2) {
    throw new Error('Chưa tạo đủ 2 bảng quan hệ clinical_protocols_rels và _clinical_protocols_v_rels.')
  }
}
