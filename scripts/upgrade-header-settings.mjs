import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 1) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(path.resolve('.env.local'))
loadEnvFile(path.resolve('.env'))

const apply = process.argv.includes('--apply')
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('Không tìm thấy DATABASE_URL trong .env/.env.local')
  process.exit(1)
}

const client = new pg.Client({ connectionString, connectionTimeoutMillis: 8000 })

const baseColumns = [
  ['header_slogan', "character varying DEFAULT 'Điều trị bằng trái tim - Chăm sóc bằng tấm lòng'"],
  ['header_show_slogan', 'boolean DEFAULT true'],
  ['header_show_utility_bar', 'boolean DEFAULT true'],
  ['header_show_search', 'boolean DEFAULT true'],
  ['header_show_contact_cards', 'boolean DEFAULT true'],
  ['header_sticky_menu', 'boolean DEFAULT true'],
  ['tiktok_url', 'character varying'],
  ['header_utility_appearance_time_prefix', "character varying DEFAULT ''"],
  ['header_utility_appearance_show_calendar_icon', 'boolean DEFAULT true'],
  ['header_utility_appearance_background', "character varying DEFAULT 'linear-gradient(90deg,#064a83,#0878d1)'"],
  ['header_utility_appearance_time_color', "character varying DEFAULT '#FFFFFF'"],
  ['header_utility_appearance_time_font_size', 'numeric DEFAULT 13'],
  ['header_utility_appearance_time_font_weight', "character varying DEFAULT '700'"],
  ['header_brand_appearance_show_logo', 'boolean DEFAULT true'],
  ['header_brand_appearance_show_hospital_name', 'boolean DEFAULT true'],
  ['header_brand_appearance_background_image_id', 'integer'],
  ['header_brand_appearance_background_size', "character varying DEFAULT 'cover'"],
  ['header_brand_appearance_background_position', "character varying DEFAULT 'center center'"],
  ['header_brand_appearance_background_overlay', "character varying DEFAULT 'rgba(255,255,255,0.88)'"],
  ['header_brand_appearance_min_height', 'numeric DEFAULT 110'],
]

const contactCardColumns = `
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id character varying NOT NULL,
  visible boolean DEFAULT true,
  title character varying NOT NULL,
  text character varying NOT NULL,
  href character varying,
  extra_text character varying,
  icon_type character varying DEFAULT 'phone',
  custom_icon_id integer,
  background character varying DEFAULT '#FFFFFF',
  border_color character varying DEFAULT '#E1E7EC',
  title_color character varying DEFAULT '#273B4C',
  text_color character varying DEFAULT '#0756B4',
  icon_color character varying DEFAULT '#075EC2',
  icon_background character varying DEFAULT '#EAF5FF',
  extra_text_color character varying DEFAULT '#557082',
  title_font_size numeric DEFAULT 10,
  text_font_size numeric DEFAULT 17,
  font_weight character varying DEFAULT '800',
  CONSTRAINT site_settings_header_contact_cards_pkey PRIMARY KEY (id)
`

const socialColumns = `
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id character varying NOT NULL,
  visible boolean DEFAULT true,
  platform character varying NOT NULL,
  label character varying,
  url character varying NOT NULL,
  custom_icon_id integer,
  CONSTRAINT site_settings_header_social_links_pkey PRIMARY KEY (id)
`

const versionContactColumns = `
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id SERIAL PRIMARY KEY,
  visible boolean DEFAULT true,
  title character varying NOT NULL,
  text character varying NOT NULL,
  href character varying,
  extra_text character varying,
  icon_type character varying DEFAULT 'phone',
  custom_icon_id integer,
  background character varying DEFAULT '#FFFFFF',
  border_color character varying DEFAULT '#E1E7EC',
  title_color character varying DEFAULT '#273B4C',
  text_color character varying DEFAULT '#0756B4',
  icon_color character varying DEFAULT '#075EC2',
  icon_background character varying DEFAULT '#EAF5FF',
  extra_text_color character varying DEFAULT '#557082',
  title_font_size numeric DEFAULT 10,
  text_font_size numeric DEFAULT 17,
  font_weight character varying DEFAULT '800',
  _uuid character varying
`

const versionSocialColumns = `
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  id SERIAL PRIMARY KEY,
  visible boolean DEFAULT true,
  platform character varying NOT NULL,
  label character varying,
  url character varying NOT NULL,
  custom_icon_id integer,
  _uuid character varying
`

async function audit() {
  const tables = ['site_settings','_site_settings_v','site_settings_header_contact_cards','site_settings_header_social_links','_site_settings_v_version_header_contact_cards','_site_settings_v_version_header_social_links']
  console.log('\nKIỂM TRA CẤU TRÚC HEADER SETTINGS')
  for (const table of tables) {
    const r = await client.query(`SELECT to_regclass($1) IS NOT NULL AS exists`, [`public.${table}`])
    console.log(`${table}: ${r.rows[0].exists ? 'Có' : 'Chưa có'}`)
  }
  const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings'`)
  const set = new Set(cols.rows.map(r => r.column_name))
  const missing = baseColumns.filter(([name]) => !set.has(name)).map(([name]) => name)
  console.log(`Cột mới còn thiếu trong site_settings: ${missing.length}`)
  if (missing.length) console.log(' - ' + missing.join('\n - '))
}

async function upgrade() {
  await client.query('BEGIN')
  try {
    for (const [name, type] of baseColumns) {
      await client.query(`ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS ${name} ${type}`)
      await client.query(`ALTER TABLE public._site_settings_v ADD COLUMN IF NOT EXISTS version_${name} ${type}`)
    }
    await client.query(`CREATE TABLE IF NOT EXISTS public.site_settings_header_contact_cards (${contactCardColumns})`)
    await client.query(`CREATE TABLE IF NOT EXISTS public.site_settings_header_social_links (${socialColumns})`)
    await client.query(`CREATE TABLE IF NOT EXISTS public._site_settings_v_version_header_contact_cards (${versionContactColumns})`)
    await client.query(`CREATE TABLE IF NOT EXISTS public._site_settings_v_version_header_social_links (${versionSocialColumns})`)
    await client.query(`CREATE INDEX IF NOT EXISTS site_settings_header_contact_cards_parent_idx ON public.site_settings_header_contact_cards (_parent_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS site_settings_header_social_links_parent_idx ON public.site_settings_header_social_links (_parent_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS site_settings_v_header_contact_cards_parent_idx ON public._site_settings_v_version_header_contact_cards (_parent_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS site_settings_v_header_social_links_parent_idx ON public._site_settings_v_version_header_social_links (_parent_id)`)
    await client.query('COMMIT')
    console.log('\nĐã cập nhật cấu trúc Header & Nhận diện. Không xóa dữ liệu cũ.')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  }
}

try {
  await client.connect()
  await audit()
  if (!apply) {
    console.log('\nĐây là chế độ kiểm tra. Muốn áp dụng: npm run upgrade:header-settings -- --apply')
  } else {
    await upgrade()
    await audit()
  }
} catch (err) {
  console.error('\nLỗi:', err?.message || err)
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
