export const id = '20260921_061_add_footer_quick_bar'
export const description = 'Thêm các cột cấu hình thanh tiện ích nhanh quickBar vào bảng footer và _footer_v'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."footer"
      ADD COLUMN IF NOT EXISTS "quick_bar_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "quick_bar_show_emergency" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "quick_bar_show_booking" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "quick_bar_show_guide" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "quick_bar_show_feedback" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "quick_bar_emergency_label" character varying,
      ADD COLUMN IF NOT EXISTS "quick_bar_emergency_phone" character varying,
      ADD COLUMN IF NOT EXISTS "quick_bar_guide_label" character varying,
      ADD COLUMN IF NOT EXISTS "quick_bar_guide_url" character varying,
      ADD COLUMN IF NOT EXISTS "quick_bar_feedback_label" character varying,
      ADD COLUMN IF NOT EXISTS "quick_bar_feedback_url" character varying;

    ALTER TABLE public."_footer_v"
      ADD COLUMN IF NOT EXISTS "version_quick_bar_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_show_emergency" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_show_booking" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_show_guide" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_show_feedback" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_emergency_label" character varying,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_emergency_phone" character varying,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_guide_label" character varying,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_guide_url" character varying,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_feedback_label" character varying,
      ADD COLUMN IF NOT EXISTS "version_quick_bar_feedback_url" character varying;
  `)
}

export async function verify({ client }) {
  const footerCheck = await client.query(`
    SELECT COUNT(*)::int AS count FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'footer'
      AND column_name IN (
        'quick_bar_enabled',
        'quick_bar_show_emergency',
        'quick_bar_show_booking',
        'quick_bar_show_guide',
        'quick_bar_show_feedback'
      );
  `)
  if (footerCheck.rows[0]?.count !== 5) {
    throw new Error('Thiếu cột quick_bar trong bảng footer.')
  }
}
