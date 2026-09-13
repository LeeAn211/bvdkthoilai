import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "scientific_activity_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );

  INSERT INTO "scientific_activity_groups" ("name", "slug", "description", "order", "active") VALUES
    ('Đào tạo – Tập huấn', 'dao-tao-tap-huan', 'Các hoạt động đào tạo và tập huấn chuyên môn.', 10, true),
    ('Hội nghị – Hội thảo', 'hoi-nghi-hoi-thao', 'Các hội nghị, hội thảo và sinh hoạt khoa học.', 20, true),
    ('Kiến thức y khoa', 'kien-thuc-y-khoa', 'Thông tin và kiến thức chuyên môn y khoa.', 30, true),
    ('Thông tin cho người bệnh', 'thong-tin-cho-nguoi-benh', 'Thông tin chuyên môn dành cho người bệnh và cộng đồng.', 40, true);
  
  ALTER TABLE "scientific_activities" ADD COLUMN "category_group_id" integer;
  ALTER TABLE "_scientific_activities_v" ADD COLUMN "version_category_group_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "scientific_activity_groups_id" integer;
  CREATE UNIQUE INDEX "scientific_activity_groups_slug_idx" ON "scientific_activity_groups" USING btree ("slug");
  CREATE INDEX "scientific_activity_groups_updated_at_idx" ON "scientific_activity_groups" USING btree ("updated_at");
  CREATE INDEX "scientific_activity_groups_created_at_idx" ON "scientific_activity_groups" USING btree ("created_at");
  CREATE INDEX "scientific_activity_groups_deleted_at_idx" ON "scientific_activity_groups" USING btree ("deleted_at");
  ALTER TABLE "scientific_activities" ADD CONSTRAINT "scientific_activities_category_group_id_scientific_activity_groups_id_fk" FOREIGN KEY ("category_group_id") REFERENCES "public"."scientific_activity_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scientific_activities_v" ADD CONSTRAINT "_scientific_activities_v_version_category_group_id_scientific_activity_groups_id_fk" FOREIGN KEY ("version_category_group_id") REFERENCES "public"."scientific_activity_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scientific_activity_groups_fk" FOREIGN KEY ("scientific_activity_groups_id") REFERENCES "public"."scientific_activity_groups"("id") ON DELETE cascade ON UPDATE no action;

  UPDATE "scientific_activities" AS activity
  SET "category_group_id" = groups."id"
  FROM "scientific_activity_groups" AS groups
  WHERE groups."slug" = CASE activity."category"::text
    WHEN 'Đào tạo – Tập huấn' THEN 'dao-tao-tap-huan'
    WHEN 'Hội nghị – Hội thảo' THEN 'hoi-nghi-hoi-thao'
    WHEN 'Kiến thức y khoa' THEN 'kien-thuc-y-khoa'
    WHEN 'Thông tin cho người bệnh' THEN 'thong-tin-cho-nguoi-benh'
    ELSE NULL
  END;

  UPDATE "_scientific_activities_v" AS activity_version
  SET "version_category_group_id" = groups."id"
  FROM "scientific_activity_groups" AS groups
  WHERE groups."slug" = CASE activity_version."version_category"::text
    WHEN 'Đào tạo – Tập huấn' THEN 'dao-tao-tap-huan'
    WHEN 'Hội nghị – Hội thảo' THEN 'hoi-nghi-hoi-thao'
    WHEN 'Kiến thức y khoa' THEN 'kien-thuc-y-khoa'
    WHEN 'Thông tin cho người bệnh' THEN 'thong-tin-cho-nguoi-benh'
    ELSE NULL
  END;

  CREATE INDEX "scientific_activities_category_group_idx" ON "scientific_activities" USING btree ("category_group_id");
  CREATE INDEX "_scientific_activities_v_version_version_category_group_idx" ON "_scientific_activities_v" USING btree ("version_category_group_id");
  CREATE INDEX "payload_locked_documents_rels_scientific_activity_groups_idx" ON "payload_locked_documents_rels" USING btree ("scientific_activity_groups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "scientific_activities" DROP CONSTRAINT IF EXISTS "scientific_activities_category_group_id_scientific_activity_groups_id_fk";
  ALTER TABLE "_scientific_activities_v" DROP CONSTRAINT IF EXISTS "_scientific_activities_v_version_category_group_id_scientific_activity_groups_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_scientific_activity_groups_fk";
  DROP INDEX IF EXISTS "scientific_activities_category_group_idx";
  DROP INDEX IF EXISTS "_scientific_activities_v_version_version_category_group_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_scientific_activity_groups_idx";
  ALTER TABLE "scientific_activities" DROP COLUMN IF EXISTS "category_group_id";
  ALTER TABLE "_scientific_activities_v" DROP COLUMN IF EXISTS "version_category_group_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "scientific_activity_groups_id";
  DROP TABLE IF EXISTS "scientific_activity_groups" CASCADE;`)
}
