import pg from 'pg'
const { Client } = pg

async function run() {
  const c = new Client({
    connectionString: process.env.DATABASE_URL,
  })
  await c.connect()

  console.log('Adding detail page toggles to specialties...')
  await c.query(`
    ALTER TABLE specialties
      ADD COLUMN IF NOT EXISTS show_department_card boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_booking_card boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_notice_box boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS custom_booking_title varchar,
      ADD COLUMN IF NOT EXISTS custom_booking_desc text,
      ADD COLUMN IF NOT EXISTS custom_booking_button_label varchar,
      ADD COLUMN IF NOT EXISTS custom_booking_button_url varchar,
      ADD COLUMN IF NOT EXISTS custom_hotline varchar,
      ADD COLUMN IF NOT EXISTS custom_notice_text text,
      ADD COLUMN IF NOT EXISTS show_cover_image boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_summary_lead boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_content_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_services_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_doctors_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_protocols_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_related_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS sidebar_banners_json text;
  `)

  console.log('Adding detail page toggles to _specialties_v...')
  await c.query(`
    ALTER TABLE _specialties_v
      ADD COLUMN IF NOT EXISTS version_show_department_card boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_booking_card boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_notice_box boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_custom_booking_title varchar,
      ADD COLUMN IF NOT EXISTS version_custom_booking_desc text,
      ADD COLUMN IF NOT EXISTS version_custom_booking_button_label varchar,
      ADD COLUMN IF NOT EXISTS version_custom_booking_button_url varchar,
      ADD COLUMN IF NOT EXISTS version_custom_hotline varchar,
      ADD COLUMN IF NOT EXISTS version_custom_notice_text text,
      ADD COLUMN IF NOT EXISTS version_show_cover_image boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_summary_lead boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_content_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_services_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_doctors_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_protocols_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_show_related_section boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS version_sidebar_banners_json text;
  `)

  console.log('Columns added successfully!')
  await c.end()
}

run().catch(console.error)
