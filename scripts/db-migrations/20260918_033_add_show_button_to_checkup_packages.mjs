export const id = '20260918_033_add_show_button_to_checkup_packages'
export const description = 'Thêm cột show_button cho bảng checkup_packages_settings_packages và chk_pkgs'
export const transactional = false

export async function up({ client }) {
  // 1. Thêm cột show_button vào bảng checkup_packages_settings_packages
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'checkup_packages_settings_packages') THEN
        ALTER TABLE public."checkup_packages_settings_packages"
          ADD COLUMN IF NOT EXISTS "show_button" boolean DEFAULT true;
        
        UPDATE public."checkup_packages_settings_packages"
        SET "show_button" = true
        WHERE "show_button" IS NULL;
      END IF;
    END $$;
  `)

  // 2. Thêm cột show_button vào bảng chk_pkgs nếu tồn tại
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chk_pkgs') THEN
        ALTER TABLE public."chk_pkgs"
          ADD COLUMN IF NOT EXISTS "show_button" boolean DEFAULT true;
        
        UPDATE public."chk_pkgs"
        SET "show_button" = true
        WHERE "show_button" IS NULL;
      END IF;
    END $$;
  `)

  // 3. Thêm vào bảng version nếu tồn tại
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_site_settings_v_version_checkup_packages_page_packages') THEN
        ALTER TABLE public."_site_settings_v_version_checkup_packages_page_packages"
          ADD COLUMN IF NOT EXISTS "show_button" boolean DEFAULT true;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const check = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'checkup_packages_settings_packages' AND column_name = 'show_button'
  `)
  if (check.rows.length === 0) {
    throw new Error('Chưa tìm thấy cột show_button trong bảng checkup_packages_settings_packages.')
  }
}
