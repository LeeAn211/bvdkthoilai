import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'homepage_sections' AND column_name = 'font_family'
      ) THEN
        ALTER TABLE "homepage_sections" ADD COLUMN "font_family" varchar;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = '_homepage_v_version_sections' AND column_name = 'font_family'
      ) THEN
        ALTER TABLE "_homepage_v_version_sections" ADD COLUMN "font_family" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "homepage_sections" DROP COLUMN IF EXISTS "font_family";
    ALTER TABLE "_homepage_v_version_sections" DROP COLUMN IF EXISTS "font_family";
  `)
}
