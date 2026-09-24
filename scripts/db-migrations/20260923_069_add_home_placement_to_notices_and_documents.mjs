export const id = '20260923_069_add_home_placement_to_notices_and_documents'
export const description = 'Thêm enum và cột home_placement cho notices, documents và các bảng version tương ứng'
export const transactional = false

export async function up({ client }) {
  // 1. Tạo các enum types nếu chưa tồn tại
  try {
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_notices_home_placement" AS ENUM ('notices', 'warning', 'both');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
  } catch (err) {
    console.warn('Lưu ý khi tạo enum_notices_home_placement:', err.message)
  }

  try {
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "enum__notices_v_version_home_placement" AS ENUM ('notices', 'warning', 'both');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
  } catch (err) {
    console.warn('Lưu ý khi tạo enum__notices_v_version_home_placement:', err.message)
  }

  try {
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_documents_home_placement" AS ENUM ('documents', 'legal', 'both');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
  } catch (err) {
    console.warn('Lưu ý khi tạo enum_documents_home_placement:', err.message)
  }

  try {
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "enum__documents_v_version_home_placement" AS ENUM ('documents', 'legal', 'both');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
  } catch (err) {
    console.warn('Lưu ý khi tạo enum__documents_v_version_home_placement:', err.message)
  }

  // 2. Thêm cột home_placement vào bảng notices và _notices_v
  await client.query(`
    ALTER TABLE public."notices"
      ADD COLUMN IF NOT EXISTS "home_placement" "enum_notices_home_placement" DEFAULT 'notices';
  `)

  await client.query(`
    ALTER TABLE public."_notices_v"
      ADD COLUMN IF NOT EXISTS "version_home_placement" "enum__notices_v_version_home_placement" DEFAULT 'notices';
  `)

  // 3. Thêm cột show_on_home và home_placement vào bảng documents và _documents_v
  await client.query(`
    ALTER TABLE public."documents"
      ADD COLUMN IF NOT EXISTS "show_on_home" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "home_placement" "enum_documents_home_placement" DEFAULT 'documents';
  `)

  await client.query(`
    ALTER TABLE public."_documents_v"
      ADD COLUMN IF NOT EXISTS "version_show_on_home" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_home_placement" "enum__documents_v_version_home_placement" DEFAULT 'documents';
  `)
}

export async function verify({ client }) {
  // Kiểm tra cột bảng notices
  const { rowCount: countNoticesCol } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'notices' AND column_name = 'home_placement';
  `)
  if (countNoticesCol === 0) {
    throw new Error('Verification failed: notices.home_placement column is missing')
  }

  // Kiểm tra cột bảng _notices_v
  const { rowCount: countNoticesVCol } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = '_notices_v' AND column_name = 'version_home_placement';
  `)
  if (countNoticesVCol === 0) {
    throw new Error('Verification failed: _notices_v.version_home_placement column is missing')
  }

  // Kiểm tra cột bảng documents
  const { rows: docCols } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name IN ('show_on_home', 'home_placement');
  `)
  if (docCols.length < 2) {
    throw new Error('Verification failed: documents table is missing show_on_home or home_placement column')
  }

  // Kiểm tra cột bảng _documents_v
  const { rows: docVCols } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = '_documents_v' AND column_name IN ('version_show_on_home', 'version_home_placement');
  `)
  if (docVCols.length < 2) {
    throw new Error('Verification failed: _documents_v table is missing version_show_on_home or version_home_placement column')
  }
}
