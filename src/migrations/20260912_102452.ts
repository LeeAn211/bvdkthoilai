import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_scientific_activities_category" AS ENUM('Đào tạo – Tập huấn', 'Hội nghị – Hội thảo', 'Kiến thức y khoa', 'Thông tin cho người bệnh');
    CREATE TYPE "public"."enum_scientific_activities_layout_template" AS ENUM('default', 'bachmai', 'classic');
    CREATE TYPE "public"."enum_scientific_activities_cover_fit" AS ENUM('cover', 'contain');
    CREATE TYPE "public"."enum_scientific_activities_cover_position" AS ENUM('top', 'center', 'bottom');
    CREATE TYPE "public"."enum_scientific_activities_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
    CREATE TYPE "public"."enum_scientific_activities_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__scientific_activities_v_version_category" AS ENUM('Đào tạo – Tập huấn', 'Hội nghị – Hội thảo', 'Kiến thức y khoa', 'Thông tin cho người bệnh');
    CREATE TYPE "public"."enum__scientific_activities_v_version_layout_template" AS ENUM('default', 'bachmai', 'classic');
    CREATE TYPE "public"."enum__scientific_activities_v_version_cover_fit" AS ENUM('cover', 'contain');
    CREATE TYPE "public"."enum__scientific_activities_v_version_cover_position" AS ENUM('top', 'center', 'bottom');
    CREATE TYPE "public"."enum__scientific_activities_v_version_workflow_state" AS ENUM('draft', 'submitted', 'approved', 'published', 'hidden');
    CREATE TYPE "public"."enum__scientific_activities_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "scientific_activities_attachments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "file_id" integer
    );

    CREATE TABLE "scientific_activities" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "slug" varchar,
      "excerpt" varchar,
      "category" "enum_scientific_activities_category" DEFAULT 'Đào tạo – Tập huấn',
      "cover_id" integer,
      "content" jsonb,
      "featured" boolean DEFAULT false,
      "published_at" timestamp(3) with time zone,
      "source" varchar,
      "layout_template" "enum_scientific_activities_layout_template" DEFAULT 'default',
      "cover_fit" "enum_scientific_activities_cover_fit" DEFAULT 'cover',
      "cover_position" "enum_scientific_activities_cover_position" DEFAULT 'top',
      "workflow_state" "enum_scientific_activities_workflow_state" DEFAULT 'draft',
      "seo_title" varchar,
      "seo_description" varchar,
      "seo_image_id" integer,
      "canonical_url" varchar,
      "no_index" boolean DEFAULT false,
      "exclude_from_sitemap" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone,
      "_status" "enum_scientific_activities_status" DEFAULT 'draft'
    );

    CREATE TABLE "_scientific_activities_v_version_attachments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "file_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE "_scientific_activities_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_excerpt" varchar,
      "version_category" "enum__scientific_activities_v_version_category" DEFAULT 'Đào tạo – Tập huấn',
      "version_cover_id" integer,
      "version_content" jsonb,
      "version_featured" boolean DEFAULT false,
      "version_published_at" timestamp(3) with time zone,
      "version_source" varchar,
      "version_layout_template" "enum__scientific_activities_v_version_layout_template" DEFAULT 'default',
      "version_cover_fit" "enum__scientific_activities_v_version_cover_fit" DEFAULT 'cover',
      "version_cover_position" "enum__scientific_activities_v_version_cover_position" DEFAULT 'top',
      "version_workflow_state" "enum__scientific_activities_v_version_workflow_state" DEFAULT 'draft',
      "version_seo_title" varchar,
      "version_seo_description" varchar,
      "version_seo_image_id" integer,
      "version_canonical_url" varchar,
      "version_no_index" boolean DEFAULT false,
      "version_exclude_from_sitemap" boolean DEFAULT false,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "version__status" "enum__scientific_activities_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "scientific_activities_id" integer;
    ALTER TABLE "navigation_rels" ADD COLUMN "scientific_activities_id" integer;
    ALTER TABLE "_navigation_v_rels" ADD COLUMN "scientific_activities_id" integer;

    ALTER TABLE "scientific_activities_attachments" ADD CONSTRAINT "scientific_activities_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "scientific_activities_attachments" ADD CONSTRAINT "scientific_activities_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scientific_activities"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "scientific_activities" ADD CONSTRAINT "scientific_activities_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "scientific_activities" ADD CONSTRAINT "scientific_activities_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_scientific_activities_v_version_attachments" ADD CONSTRAINT "_scientific_activities_v_version_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_scientific_activities_v_version_attachments" ADD CONSTRAINT "_scientific_activities_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_scientific_activities_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_scientific_activities_v" ADD CONSTRAINT "_scientific_activities_v_parent_id_scientific_activities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."scientific_activities"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_scientific_activities_v" ADD CONSTRAINT "_scientific_activities_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_scientific_activities_v" ADD CONSTRAINT "_scientific_activities_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scientific_activities_fk" FOREIGN KEY ("scientific_activities_id") REFERENCES "public"."scientific_activities"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_scientific_activities_fk" FOREIGN KEY ("scientific_activities_id") REFERENCES "public"."scientific_activities"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_scientific_activities_fk" FOREIGN KEY ("scientific_activities_id") REFERENCES "public"."scientific_activities"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "scientific_activities_attachments_order_idx" ON "scientific_activities_attachments" USING btree ("_order");
    CREATE INDEX "scientific_activities_attachments_parent_id_idx" ON "scientific_activities_attachments" USING btree ("_parent_id");
    CREATE INDEX "scientific_activities_attachments_file_idx" ON "scientific_activities_attachments" USING btree ("file_id");
    CREATE UNIQUE INDEX "scientific_activities_slug_idx" ON "scientific_activities" USING btree ("slug");
    CREATE INDEX "scientific_activities_cover_idx" ON "scientific_activities" USING btree ("cover_id");
    CREATE INDEX "scientific_activities_seo_image_idx" ON "scientific_activities" USING btree ("seo_image_id");
    CREATE INDEX "scientific_activities_updated_at_idx" ON "scientific_activities" USING btree ("updated_at");
    CREATE INDEX "scientific_activities_created_at_idx" ON "scientific_activities" USING btree ("created_at");
    CREATE INDEX "scientific_activities_deleted_at_idx" ON "scientific_activities" USING btree ("deleted_at");
    CREATE INDEX "scientific_activities__status_idx" ON "scientific_activities" USING btree ("_status");
    CREATE INDEX "_scientific_activities_v_version_attachments_order_idx" ON "_scientific_activities_v_version_attachments" USING btree ("_order");
    CREATE INDEX "_scientific_activities_v_version_attachments_parent_id_idx" ON "_scientific_activities_v_version_attachments" USING btree ("_parent_id");
    CREATE INDEX "_scientific_activities_v_version_attachments_file_idx" ON "_scientific_activities_v_version_attachments" USING btree ("file_id");
    CREATE INDEX "_scientific_activities_v_parent_idx" ON "_scientific_activities_v" USING btree ("parent_id");
    CREATE INDEX "_scientific_activities_v_version_version_slug_idx" ON "_scientific_activities_v" USING btree ("version_slug");
    CREATE INDEX "_scientific_activities_v_version_version_cover_idx" ON "_scientific_activities_v" USING btree ("version_cover_id");
    CREATE INDEX "_scientific_activities_v_version_version_seo_image_idx" ON "_scientific_activities_v" USING btree ("version_seo_image_id");
    CREATE INDEX "_scientific_activities_v_version_version_updated_at_idx" ON "_scientific_activities_v" USING btree ("version_updated_at");
    CREATE INDEX "_scientific_activities_v_version_version_created_at_idx" ON "_scientific_activities_v" USING btree ("version_created_at");
    CREATE INDEX "_scientific_activities_v_version_version_deleted_at_idx" ON "_scientific_activities_v" USING btree ("version_deleted_at");
    CREATE INDEX "_scientific_activities_v_version_version__status_idx" ON "_scientific_activities_v" USING btree ("version__status");
    CREATE INDEX "_scientific_activities_v_created_at_idx" ON "_scientific_activities_v" USING btree ("created_at");
    CREATE INDEX "_scientific_activities_v_updated_at_idx" ON "_scientific_activities_v" USING btree ("updated_at");
    CREATE INDEX "_scientific_activities_v_latest_idx" ON "_scientific_activities_v" USING btree ("latest");
    CREATE INDEX "_scientific_activities_v_autosave_idx" ON "_scientific_activities_v" USING btree ("autosave");
    CREATE INDEX "payload_locked_documents_rels_scientific_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("scientific_activities_id");
    CREATE INDEX "navigation_rels_scientific_activities_id_idx" ON "navigation_rels" USING btree ("scientific_activities_id");
    CREATE INDEX "_navigation_v_rels_scientific_activities_id_idx" ON "_navigation_v_rels" USING btree ("scientific_activities_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_scientific_activities_id_idx";
    DROP INDEX IF EXISTS "navigation_rels_scientific_activities_id_idx";
    DROP INDEX IF EXISTS "_navigation_v_rels_scientific_activities_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_scientific_activities_fk";
    ALTER TABLE "navigation_rels" DROP CONSTRAINT IF EXISTS "navigation_rels_scientific_activities_fk";
    ALTER TABLE "_navigation_v_rels" DROP CONSTRAINT IF EXISTS "_navigation_v_rels_scientific_activities_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "scientific_activities_id";
    ALTER TABLE "navigation_rels" DROP COLUMN IF EXISTS "scientific_activities_id";
    ALTER TABLE "_navigation_v_rels" DROP COLUMN IF EXISTS "scientific_activities_id";
    DROP TABLE IF EXISTS "scientific_activities_attachments" CASCADE;
    DROP TABLE IF EXISTS "_scientific_activities_v_version_attachments" CASCADE;
    DROP TABLE IF EXISTS "_scientific_activities_v" CASCADE;
    DROP TABLE IF EXISTS "scientific_activities" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_scientific_activities_category";
    DROP TYPE IF EXISTS "public"."enum_scientific_activities_layout_template";
    DROP TYPE IF EXISTS "public"."enum_scientific_activities_cover_fit";
    DROP TYPE IF EXISTS "public"."enum_scientific_activities_cover_position";
    DROP TYPE IF EXISTS "public"."enum_scientific_activities_workflow_state";
    DROP TYPE IF EXISTS "public"."enum_scientific_activities_status";
    DROP TYPE IF EXISTS "public"."enum__scientific_activities_v_version_category";
    DROP TYPE IF EXISTS "public"."enum__scientific_activities_v_version_layout_template";
    DROP TYPE IF EXISTS "public"."enum__scientific_activities_v_version_cover_fit";
    DROP TYPE IF EXISTS "public"."enum__scientific_activities_v_version_cover_position";
    DROP TYPE IF EXISTS "public"."enum__scientific_activities_v_version_workflow_state";
    DROP TYPE IF EXISTS "public"."enum__scientific_activities_v_version_status";
  `)
}
