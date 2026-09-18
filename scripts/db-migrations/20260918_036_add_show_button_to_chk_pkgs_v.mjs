export const id = '20260918_036_add_show_button_to_chk_pkgs_v'
export const description = 'Thêm cột show_button cho bảng phiên bản _chk_pkgs_v'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_chk_pkgs_v') THEN
        ALTER TABLE public."_chk_pkgs_v"
          ADD COLUMN IF NOT EXISTS "show_button" boolean DEFAULT true;
        
        UPDATE public."_chk_pkgs_v"
        SET "show_button" = true
        WHERE "show_button" IS NULL;
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const check = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = '_chk_pkgs_v' AND column_name = 'show_button'
  `)
  if (check.rows.length === 0) {
    throw new Error('Chưa tìm thấy cột show_button trong bảng _chk_pkgs_v.')
  }
}
