export const id = '20260923_071_create_health_warnings'
export const description = 'Tạo bảng health_warnings, health_warnings_attachments, _health_warnings_v, _health_warnings_v_version_attachments và enum types'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các enum types nếu chưa tồn tại
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "enum_health_warnings_level" AS ENUM ('urgent', 'important', 'normal');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_health_warnings_layout_template" AS ENUM ('default', 'bachmai', 'classic');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_health_warnings_cover_fit" AS ENUM ('contain', 'cover-top', 'cover-center', 'cover-bottom', 'cover', 'fill');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_health_warnings_cover_position" AS ENUM ('top', 'center', 'bottom');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_health_warnings_workflow_state" AS ENUM ('draft', 'submitted', 'approved', 'published', 'hidden');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum_health_warnings_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__health_warnings_v_version_level" AS ENUM ('urgent', 'important', 'normal');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__health_warnings_v_version_layout_template" AS ENUM ('default', 'bachmai', 'classic');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__health_warnings_v_version_cover_fit" AS ENUM ('contain', 'cover-top', 'cover-center', 'cover-bottom', 'cover', 'fill');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__health_warnings_v_version_cover_position" AS ENUM ('top', 'center', 'bottom');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__health_warnings_v_version_workflow_state" AS ENUM ('draft', 'submitted', 'approved', 'published', 'hidden');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "enum__health_warnings_v_version_status" AS ENUM ('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 2. Tạo bảng health_warnings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."health_warnings" (
      "id" serial PRIMARY KEY,
      "title" varchar,
      "slug" varchar,
      "category_ref_id" integer,
      "level" "enum_health_warnings_level" DEFAULT 'urgent',
      "excerpt" varchar,
      "cover_id" integer,
      "content" jsonb,
      "layout_template" "enum_health_warnings_layout_template" DEFAULT 'default',
      "source" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
      "show_source" boolean DEFAULT true,
      "cover_fit" "enum_health_warnings_cover_fit" DEFAULT 'cover',
      "cover_position" "enum_health_warnings_cover_position" DEFAULT 'top',
      "seo_title" varchar,
      "canonical_url" varchar,
      "seo_description" varchar,
      "seo_image_id" integer,
      "no_index" boolean DEFAULT false,
      "exclude_from_sitemap" boolean DEFAULT false,
      "pinned" boolean DEFAULT false,
      "show_on_home" boolean DEFAULT true,
      "published_at" timestamp(3) with time zone,
      "views" numeric DEFAULT 0,
      "workflow_state" "enum_health_warnings_workflow_state" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone,
      "_status" "enum_health_warnings_status" DEFAULT 'draft',
      CONSTRAINT "health_warnings_category_ref_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES public."categories"("id") ON DELETE SET NULL,
      CONSTRAINT "health_warnings_cover_id_fk" FOREIGN KEY ("cover_id") REFERENCES public."media"("id") ON DELETE SET NULL,
      CONSTRAINT "health_warnings_seo_image_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES public."media"("id") ON DELETE SET NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "health_warnings_slug_idx" ON public."health_warnings" ("slug");
    CREATE INDEX IF NOT EXISTS "health_warnings_category_ref_idx" ON public."health_warnings" ("category_ref_id");
    CREATE INDEX IF NOT EXISTS "health_warnings_cover_idx" ON public."health_warnings" ("cover_id");
    CREATE INDEX IF NOT EXISTS "health_warnings_seo_image_idx" ON public."health_warnings" ("seo_image_id");
    CREATE INDEX IF NOT EXISTS "health_warnings_updated_at_idx" ON public."health_warnings" ("updated_at");
    CREATE INDEX IF NOT EXISTS "health_warnings_created_at_idx" ON public."health_warnings" ("created_at");
    CREATE INDEX IF NOT EXISTS "health_warnings_deleted_at_idx" ON public."health_warnings" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "health_warnings__status_idx" ON public."health_warnings" ("_status");
  `)

  // 3. Tạo bảng health_warnings_attachments
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."health_warnings_attachments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY,
      "label" varchar,
      "file_id" integer,
      CONSTRAINT "health_warnings_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."health_warnings"("id") ON DELETE CASCADE,
      CONSTRAINT "health_warnings_attachments_file_id_fk" FOREIGN KEY ("file_id") REFERENCES public."media"("id") ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS "health_warnings_attachments_order_idx" ON public."health_warnings_attachments" ("_order");
    CREATE INDEX IF NOT EXISTS "health_warnings_attachments_parent_id_idx" ON public."health_warnings_attachments" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "health_warnings_attachments_file_idx" ON public."health_warnings_attachments" ("file_id");
  `)

  // 4. Tạo bảng _health_warnings_v (Version tracking)
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_health_warnings_v" (
      "id" serial PRIMARY KEY,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_category_ref_id" integer,
      "version_level" "enum__health_warnings_v_version_level" DEFAULT 'urgent',
      "version_excerpt" varchar,
      "version_cover_id" integer,
      "version_content" jsonb,
      "version_layout_template" "enum__health_warnings_v_version_layout_template" DEFAULT 'default',
      "version_source" varchar DEFAULT 'Bệnh viện Đa khoa Khu vực Thới Lai',
      "version_show_source" boolean DEFAULT true,
      "version_cover_fit" "enum__health_warnings_v_version_cover_fit" DEFAULT 'cover',
      "version_cover_position" "enum__health_warnings_v_version_cover_position" DEFAULT 'top',
      "version_seo_title" varchar,
      "version_canonical_url" varchar,
      "version_seo_description" varchar,
      "version_seo_image_id" integer,
      "version_no_index" boolean DEFAULT false,
      "version_exclude_from_sitemap" boolean DEFAULT false,
      "version_pinned" boolean DEFAULT false,
      "version_show_on_home" boolean DEFAULT true,
      "version_published_at" timestamp(3) with time zone,
      "version_views" numeric DEFAULT 0,
      "version_workflow_state" "enum__health_warnings_v_version_workflow_state" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "version__status" "enum__health_warnings_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean,
      CONSTRAINT "_health_warnings_v_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES public."health_warnings"("id") ON DELETE SET NULL,
      CONSTRAINT "_health_warnings_v_category_ref_id_fk" FOREIGN KEY ("version_category_ref_id") REFERENCES public."categories"("id") ON DELETE SET NULL,
      CONSTRAINT "_health_warnings_v_cover_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES public."media"("id") ON DELETE SET NULL,
      CONSTRAINT "_health_warnings_v_seo_image_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES public."media"("id") ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS "_health_warnings_v_parent_idx" ON public."_health_warnings_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_slug_idx" ON public."_health_warnings_v" ("version_slug");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_category_ref_idx" ON public."_health_warnings_v" ("version_category_ref_id");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_cover_idx" ON public."_health_warnings_v" ("version_cover_id");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_seo_image_idx" ON public."_health_warnings_v" ("version_seo_image_id");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_updated_at_idx" ON public."_health_warnings_v" ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_created_at_idx" ON public."_health_warnings_v" ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version_deleted_at_idx" ON public."_health_warnings_v" ("version_deleted_at");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_version__status_idx" ON public."_health_warnings_v" ("version__status");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_created_at_idx" ON public."_health_warnings_v" ("created_at");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_updated_at_idx" ON public."_health_warnings_v" ("updated_at");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_latest_idx" ON public."_health_warnings_v" ("latest");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_autosave_idx" ON public."_health_warnings_v" ("autosave");
  `)

  // 5. Tạo bảng _health_warnings_v_version_attachments
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_health_warnings_v_version_attachments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY,
      "label" varchar,
      "file_id" integer,
      "_uuid" varchar,
      CONSTRAINT "_health_warnings_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES public."_health_warnings_v"("id") ON DELETE CASCADE,
      CONSTRAINT "_health_warnings_v_version_attachments_file_id_fk" FOREIGN KEY ("file_id") REFERENCES public."media"("id") ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_attachments_order_idx" ON public."_health_warnings_v_version_attachments" ("_order");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_attachments_parent_id_idx" ON public."_health_warnings_v_version_attachments" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_health_warnings_v_version_attachments_file_idx" ON public."_health_warnings_v_version_attachments" ("file_id");
  `)

  // 6. Chuyển dữ liệu bài cảnh báo cũ từ notices sang health_warnings (nếu có)
  await client.query(`
    INSERT INTO public."health_warnings" (
      "title", "slug", "category_ref_id", "level", "excerpt", "cover_id", "content",
      "layout_template", "source", "show_source", "cover_fit", "cover_position",
      "seo_title", "canonical_url", "seo_description", "seo_image_id",
      "no_index", "exclude_from_sitemap", "pinned", "show_on_home", "published_at",
      "views", "workflow_state", "updated_at", "created_at", "_status"
    )
    SELECT
      n."title",
      n."slug",
      n."category_ref_id",
      CASE 
        WHEN n."level"::text = 'important' THEN 'important'::enum_health_warnings_level
        WHEN n."level"::text = 'normal' THEN 'normal'::enum_health_warnings_level
        ELSE 'urgent'::enum_health_warnings_level
      END,
      n."excerpt",
      n."cover_id",
      n."content",
      COALESCE(n."layout_template"::text, 'default')::enum_health_warnings_layout_template,
      COALESCE(n."source", 'Bệnh viện Đa khoa Khu vực Thới Lai'),
      COALESCE(n."show_source", true),
      COALESCE(n."cover_fit"::text, 'cover')::enum_health_warnings_cover_fit,
      COALESCE(n."cover_position"::text, 'top')::enum_health_warnings_cover_position,
      n."seo_title",
      n."canonical_url",
      n."seo_description",
      n."seo_image_id",
      COALESCE(n."no_index", false),
      COALESCE(n."exclude_from_sitemap", false),
      COALESCE(n."pinned", false),
      true,
      COALESCE(n."published_at", n."start_at", now()),
      COALESCE(n."views", 0),
      COALESCE(n."workflow_state"::text, 'published')::enum_health_warnings_workflow_state,
      n."updated_at",
      n."created_at",
      COALESCE(n."_status"::text, 'published')::enum_health_warnings_status
    FROM public."notices" n
    WHERE n."home_placement" IN ('warning', 'both')
       OR n."level"::text IN ('urgent', 'important')
    ON CONFLICT ("slug") DO NOTHING;
  `)

  // 7. Thêm cột health_warnings_id vào bảng payload_locked_documents_rels (hệ thống document locking của Payload)
  await client.query(`
    ALTER TABLE public."payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "health_warnings_id" integer;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_health_warnings_id_idx"
      ON public."payload_locked_documents_rels" ("health_warnings_id");

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_health_warnings_fk'
          AND table_name = 'payload_locked_documents_rels'
      ) THEN
        ALTER TABLE public."payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_health_warnings_fk"
          FOREIGN KEY ("health_warnings_id") REFERENCES public."health_warnings"("id") ON DELETE CASCADE;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('health_warnings', 'health_warnings_attachments', '_health_warnings_v', '_health_warnings_v_version_attachments');
  `)

  if (rows.length < 4) {
    throw new Error(`Verification failed: Expected 4 tables, found ${rows.length}`)
  }
}
