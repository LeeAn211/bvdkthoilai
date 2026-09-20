export const id = '20260920_057_add_booking_route_switch'
export const description = 'Thêm công tắc chuyển nút đặt lịch giữa Medpro và form tại cơ sở'

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."medpro_settings"
      ADD COLUMN IF NOT EXISTS "use_facility_booking" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "facility_url" varchar DEFAULT '/dat-lich-kham';
    ALTER TABLE public."_medpro_settings_v"
      ADD COLUMN IF NOT EXISTS "version_use_facility_booking" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "version_facility_url" varchar DEFAULT '/dat-lich-kham';
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND (
      (table_name = 'medpro_settings' AND column_name IN ('use_facility_booking', 'facility_url')) OR
      (table_name = '_medpro_settings_v' AND column_name IN ('version_use_facility_booking', 'version_facility_url'))
    )
  `)
  if (result.rowCount !== 4) throw new Error('Thiếu trường chuyển đổi luồng đặt lịch Medpro/cơ sở.')
}
