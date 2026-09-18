export const id = '20260918_032_fix_patient_care_globals_cascade_fk_and_columns'
export const description = 'Thêm ràng buộc CASCADE cho các bảng mảng lồng nhau (pps_svc_items, ef_steps, ef_tabs_steps), sửa ràng buộc NOT NULL cũ và bổ sung các cột thiếu cho các Global Chăm sóc người bệnh'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm ràng buộc ON DELETE CASCADE cho pps_svc_items trỏ về pps_svc_groups
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pps_svc_items')
         AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pps_svc_groups') THEN
        ALTER TABLE public."pps_svc_items" DROP CONSTRAINT IF EXISTS "pps_svc_items_parent_fk";
        ALTER TABLE public."pps_svc_items"
          ADD CONSTRAINT "pps_svc_items_parent_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."pps_svc_groups"("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 2. Thêm ràng buộc ON DELETE CASCADE cho examination_flow_settings_flow_tabs_steps và ef_steps
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'examination_flow_settings_flow_tabs_steps')
         AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'examination_flow_settings_flow_tabs') THEN
        ALTER TABLE public."examination_flow_settings_flow_tabs_steps" DROP CONSTRAINT IF EXISTS "ef_tabs_steps_parent_fk";
        ALTER TABLE public."examination_flow_settings_flow_tabs_steps"
          ADD CONSTRAINT "ef_tabs_steps_parent_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."examination_flow_settings_flow_tabs"("id")
          ON DELETE CASCADE;
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ef_steps')
         AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ef_tabs') THEN
        ALTER TABLE public."ef_steps" DROP CONSTRAINT IF EXISTS "ef_steps_parent_fk";
        ALTER TABLE public."ef_steps"
          ADD CONSTRAINT "ef_steps_parent_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES public."ef_tabs"("id")
          ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  // 3. Sửa các ràng buộc NOT NULL cũ trên bảng hospital_map_settings_floors
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hospital_map_settings_floors') THEN
        ALTER TABLE public."hospital_map_settings_floors" ALTER COLUMN "level" DROP NOT NULL;
        ALTER TABLE public."hospital_map_settings_floors" ALTER COLUMN "name" DROP NOT NULL;
        ALTER TABLE public."hospital_map_settings_floors" ALTER COLUMN "departments" DROP NOT NULL;
      END IF;
    END $$;
  `)

  // 4. Sửa các ràng buộc NOT NULL cũ trên bảng checkup_packages_settings_packages
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'checkup_packages_settings_packages') THEN
        ALTER TABLE public."checkup_packages_settings_packages" ALTER COLUMN "name" DROP NOT NULL;
        ALTER TABLE public."checkup_packages_settings_packages" ALTER COLUMN "target" DROP NOT NULL;
        ALTER TABLE public."checkup_packages_settings_packages" ALTER COLUMN "price" DROP NOT NULL;
        ALTER TABLE public."checkup_packages_settings_packages" ALTER COLUMN "features" DROP NOT NULL;
      END IF;
    END $$;
  `)

  // 5. Bổ sung các cột toggle cho hospital_quality_settings
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hospital_quality_settings') THEN
        ALTER TABLE public."hospital_quality_settings"
          ADD COLUMN IF NOT EXISTS "show_quality_cards" boolean DEFAULT true,
          ADD COLUMN IF NOT EXISTS "show_dimensions" boolean DEFAULT true,
          ADD COLUMN IF NOT EXISTS "show_programs" boolean DEFAULT true,
          ADD COLUMN IF NOT EXISTS "show_feedback_box" boolean DEFAULT true;
      END IF;
    END $$;
  `)

  // 6. Bổ sung các cột và xử lý NOT NULL cho các bảng con của hospital_quality_settings
  await client.query(`
    DO $$
    BEGIN
      -- stat_cards
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hospital_quality_settings_stat_cards') THEN
        ALTER TABLE public."hospital_quality_settings_stat_cards"
          ADD COLUMN IF NOT EXISTS "val" varchar,
          ADD COLUMN IF NOT EXISTS "unit" varchar;
        
        ALTER TABLE public."hospital_quality_settings_stat_cards" ALTER COLUMN "value" DROP NOT NULL;

        UPDATE public."hospital_quality_settings_stat_cards"
          SET "val" = "value"
          WHERE "val" IS NULL AND "value" IS NOT NULL;

        UPDATE public."hospital_quality_settings_stat_cards"
          SET "unit" = "subtext"
          WHERE "unit" IS NULL AND "subtext" IS NOT NULL;
      END IF;

      -- dimensions
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hospital_quality_settings_dimensions') THEN
        ALTER TABLE public."hospital_quality_settings_dimensions"
          ADD COLUMN IF NOT EXISTS "code" varchar,
          ADD COLUMN IF NOT EXISTS "title" varchar,
          ADD COLUMN IF NOT EXISTS "percent" numeric;

        ALTER TABLE public."hospital_quality_settings_dimensions" ALTER COLUMN "name" DROP NOT NULL;

        UPDATE public."hospital_quality_settings_dimensions"
          SET "title" = "name"
          WHERE "title" IS NULL AND "name" IS NOT NULL;

        UPDATE public."hospital_quality_settings_dimensions" SET
          "code" = CASE "_order"
            WHEN 1 THEN 'PHẦN A'
            WHEN 2 THEN 'PHẦN B'
            WHEN 3 THEN 'PHẦN C'
            WHEN 4 THEN 'PHẦN D'
            WHEN 5 THEN 'PHẦN E'
            ELSE 'PHẦN ' || "_order"
          END,
          "percent" = CASE "_order"
            WHEN 1 THEN 85.0
            WHEN 2 THEN 83.6
            WHEN 3 THEN 87.0
            WHEN 4 THEN 82.4
            WHEN 5 THEN 84.0
            ELSE 80.0
          END
        WHERE "code" IS NULL OR "percent" IS NULL;
      END IF;

      -- programs
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hospital_quality_settings_programs') THEN
        ALTER TABLE public."hospital_quality_settings_programs"
          ADD COLUMN IF NOT EXISTS "highlights" text;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  // Kiểm tra foreign key pps_svc_items_parent_fk
  const fkRes = await client.query(`
    SELECT tc.constraint_name, rc.delete_rule
    FROM information_schema.table_constraints tc
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    WHERE tc.table_name = 'pps_svc_items'
      AND tc.constraint_name = 'pps_svc_items_parent_fk';
  `)
  if (fkRes.rowCount === 0 || fkRes.rows[0].delete_rule !== 'CASCADE') {
    throw new Error('Chưa thiết lập ràng buộc ON DELETE CASCADE cho pps_svc_items')
  }

  // Kiểm tra các cột trong hospital_quality_settings
  const colRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'hospital_quality_settings'
      AND column_name = 'show_quality_cards';
  `)
  if (colRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột show_quality_cards trong bảng hospital_quality_settings')
  }
}
