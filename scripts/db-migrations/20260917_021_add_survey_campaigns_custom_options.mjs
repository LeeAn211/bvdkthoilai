export const id = '20260917_021_add_survey_campaigns_custom_options'
export const description = 'Bổ sung các cột tùy chọn danh mục riêng trực tiếp vào bảng survey_campaigns'
export const transactional = false

export async function up({ client }) {
  // Thêm các cột custom_options vào bảng survey_campaigns
  await client.query(`
    ALTER TABLE public."survey_campaigns"
      ADD COLUMN IF NOT EXISTS "custom_options_outpatient_clinics" varchar,
      ADD COLUMN IF NOT EXISTS "custom_options_inpatient_departments" varchar,
      ADD COLUMN IF NOT EXISTS "custom_options_staff_positions" varchar,
      ADD COLUMN IF NOT EXISTS "custom_options_staff_unit_types" varchar,
      ADD COLUMN IF NOT EXISTS "custom_options_staff_departments" varchar,
      ADD COLUMN IF NOT EXISTS "custom_options_area_suggestions" varchar;
  `)
}

export async function verify({ client }) {
  const check = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'survey_campaigns' AND column_name IN (
      'custom_options_outpatient_clinics',
      'custom_options_inpatient_departments',
      'custom_options_staff_positions',
      'custom_options_staff_unit_types',
      'custom_options_staff_departments',
      'custom_options_area_suggestions'
    );
  `)
  if (check.rows.length < 6) {
    throw new Error('Verification failed: custom_options columns missing in survey_campaigns')
  }
}
