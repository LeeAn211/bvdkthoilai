export const id = '20260919_052_add_nurse_schedule_fields_to_schedules'
export const description = 'Thêm cấu trúc lịch điều dưỡng ĐD - NHS (daily_schedule_type, nurse_general_note, bảng schedules_nurse_assignments) vào schedules'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo enum cho icon khoa phòng điều dưỡng nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_schedules_nurse_assignments_department_icon') THEN
        CREATE TYPE public.enum_schedules_nurse_assignments_department_icon AS ENUM (
          'stethoscope', 'ambulance', 'bed', 'mortar', 'scalpel',
          'baby', 'virus', 'clinic', 'tooth', 'ultrasound'
        );
      END IF;
    END $$;
  `)

  // 2. Tạo enum cho daily_schedule_type nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_schedules_daily_schedule_type') THEN
        CREATE TYPE public.enum_schedules_daily_schedule_type AS ENUM ('doctor', 'nurse');
      END IF;
    END $$;
  `)

  // 3. Thêm các cột vào bảng schedules
  await client.query(`
    ALTER TABLE public."schedules"
      ADD COLUMN IF NOT EXISTS "daily_schedule_type" public.enum_schedules_daily_schedule_type DEFAULT 'doctor',
      ADD COLUMN IF NOT EXISTS "nurse_general_note" varchar;
  `)

  // 4. Tạo bảng schedules_nurse_assignments nếu chưa có
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."schedules_nurse_assignments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "department_name" varchar,
      "department_icon" public.enum_schedules_nurse_assignments_department_icon DEFAULT 'stethoscope',
      "administrative_staff" varchar,
      "reinforcement_staff" varchar,
      "note" varchar
    );
  `)

  // 5. Thêm Foreign key và Index cho schedules_nurse_assignments
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'schedules_nurse_assignments_parent_id_fk'
      ) THEN
        ALTER TABLE public."schedules_nurse_assignments"
        ADD CONSTRAINT "schedules_nurse_assignments_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES public."schedules"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await client.query(`
    CREATE INDEX IF NOT EXISTS "schedules_nurse_assignments_order_idx" ON public."schedules_nurse_assignments" ("_order");
    CREATE INDEX IF NOT EXISTS "schedules_nurse_assignments_parent_id_idx" ON public."schedules_nurse_assignments" ("_parent_id");
  `)
}

export async function verify({ client }) {
  const checkCol = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'schedules' AND column_name IN ('daily_schedule_type', 'nurse_general_note')
  `)
  if (checkCol.rows.length < 2) {
    throw new Error('Migration 052 verify thất bại: chưa tìm thấy các cột mới trong bảng schedules.')
  }

  const checkTable = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'schedules_nurse_assignments'
  `)
  if (checkTable.rows.length === 0) {
    throw new Error('Migration 052 verify thất bại: chưa tìm thấy bảng schedules_nurse_assignments.')
  }
}
