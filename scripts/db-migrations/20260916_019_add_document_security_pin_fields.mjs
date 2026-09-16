export const id = '20260916_019_add_document_security_pin_fields'
export const description = 'Thêm chế độ bảo mật access_mode (public, pin, internal, locked), mã pin_code cho phác đồ điều trị, văn bản và default_document_pin cho site_settings'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo kiểu enum doc_access_mode nếu chưa có
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_clinical_protocols_access_mode') THEN
        CREATE TYPE public."enum_clinical_protocols_access_mode" AS ENUM ('public', 'pin', 'internal', 'locked');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_documents_access_mode') THEN
        CREATE TYPE public."enum_documents_access_mode" AS ENUM ('public', 'pin', 'internal', 'locked');
      END IF;
    END $$;
  `)

  // 2. Thêm cột vào clinical_protocols và _clinical_protocols_v
  await client.query(`
    ALTER TABLE public."clinical_protocols"
      ADD COLUMN IF NOT EXISTS "access_mode" public."enum_clinical_protocols_access_mode" DEFAULT 'public',
      ADD COLUMN IF NOT EXISTS "pin_code" varchar;

    ALTER TABLE public."_clinical_protocols_v"
      ADD COLUMN IF NOT EXISTS "version_access_mode" public."enum_clinical_protocols_access_mode" DEFAULT 'public',
      ADD COLUMN IF NOT EXISTS "version_pin_code" varchar;
  `)

  // 3. Thêm cột vào documents và _documents_v
  await client.query(`
    ALTER TABLE public."documents"
      ADD COLUMN IF NOT EXISTS "access_mode" public."enum_documents_access_mode" DEFAULT 'public',
      ADD COLUMN IF NOT EXISTS "pin_code" varchar;

    ALTER TABLE public."_documents_v"
      ADD COLUMN IF NOT EXISTS "version_access_mode" public."enum_documents_access_mode" DEFAULT 'public',
      ADD COLUMN IF NOT EXISTS "version_pin_code" varchar;
  `)

  // 4. Thêm default_document_pin vào site_settings và _site_settings_v
  await client.query(`
    ALTER TABLE public."site_settings"
      ADD COLUMN IF NOT EXISTS "default_document_pin" varchar DEFAULT 'BVTL2026';

    ALTER TABLE public."_site_settings_v"
      ADD COLUMN IF NOT EXISTS "version_default_document_pin" varchar DEFAULT 'BVTL2026';
  `)
}

export async function verify({ client }) {
  const checkCP = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'clinical_protocols' AND column_name IN ('access_mode', 'pin_code');
  `)
  if (checkCP.rows.length < 2) {
    throw new Error('Verification failed: columns missing in clinical_protocols')
  }

  const checkDoc = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name IN ('access_mode', 'pin_code');
  `)
  if (checkDoc.rows.length < 2) {
    throw new Error('Verification failed: columns missing in documents')
  }

  const checkSite = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'default_document_pin';
  `)
  if (checkSite.rows.length < 1) {
    throw new Error('Verification failed: default_document_pin missing in site_settings')
  }
}
