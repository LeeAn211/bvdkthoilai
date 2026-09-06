import pg from 'pg'
import fs from 'node:fs'

// Nạp .env.local/.env khi script chạy trực tiếp bằng node.
for (const envFile of ['.env.local', '.env']) {
  if (!fs.existsSync(envFile)) continue
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}

const { Pool } = pg
const apply = process.argv.includes('--apply')
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('Thiếu DATABASE_URL. Không thực hiện thay đổi.')
  process.exit(1)
}

const pool = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 8000 })

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'noi-dung'
}

async function uniqueVaccineSlug(client, name) {
  const base = slugify(name)
  let candidate = base
  let suffix = 2
  while ((await client.query('SELECT 1 FROM vaccines WHERE slug = $1 LIMIT 1', [candidate])).rowCount) {
    candidate = `${base}-${suffix++}`
  }
  return candidate
}

async function audit(client) {
  const legacy = await client.query(`
    SELECT entry_type, COUNT(*)::int AS total
    FROM vaccinations
    GROUP BY entry_type
    ORDER BY entry_type
  `)
  const specialty = await client.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (
        WHERE COALESCE(s.use_department_name, false) = true
          OR (d.id IS NOT NULL AND s.slug IS NOT NULL AND d.slug IS NOT NULL AND s.slug = d.slug)
          OR (d.id IS NOT NULL AND lower(btrim(s.name)) = lower(btrim(d.name)))
      )::int AS legacy_clones
    FROM specialties s
    LEFT JOIN departments d ON d.id = s.department_id
  `)
  const quick = await client.query(`
    SELECT
      (SELECT COUNT(*)::int FROM homepage_quick_links) AS legacy_homepage_quick_links,
      (SELECT COUNT(*)::int FROM quick_links_settings_items) AS canonical_quick_links
  `)
  const canonicalVaccination = await client.query(`
    SELECT
      (SELECT COUNT(*)::int FROM vaccines) AS vaccines,
      (SELECT COUNT(*)::int FROM vaccination_schedules) AS vaccination_schedules
  `)
  return {
    legacyVaccinations: legacy.rows,
    specialties: specialty.rows[0],
    quickLinks: quick.rows[0],
    canonicalVaccination: canonicalVaccination.rows[0],
  }
}

const client = await pool.connect()
try {
  const before = await audit(client)
  console.log('\n=== KIỂM TRA TRƯỚC MIGRATION ===')
  console.table(before.legacyVaccinations)
  console.table([before.specialties])
  console.table([before.quickLinks])
  console.table([before.canonicalVaccination])

  if (!apply) {
    console.log('\nDRY-RUN: chưa thay đổi dữ liệu.')
    console.log('Muốn thực hiện migration: npm run migrate:legacy -- --apply')
    process.exitCode = 0
  } else {
    await client.query('BEGIN')

    const legacyRows = (await client.query('SELECT * FROM vaccinations ORDER BY id')).rows
    let insertedVaccines = 0
    let insertedVaccinePrices = 0
    let insertedSchedules = 0

    for (const row of legacyRows) {
      if (row.entry_type === 'vaccine') {
        const exists = await client.query(
          'SELECT id FROM vaccines WHERE lower(btrim(name)) = lower(btrim($1)) AND deleted_at IS NULL LIMIT 1',
          [row.vaccine_name],
        )
        let vaccineId = exists.rows?.[0]?.id
        if (!vaccineId) {
          const slug = await uniqueVaccineSlug(client, row.vaccine_name)
          const inserted = await client.query(`
            INSERT INTO vaccines
              (name, slug, summary, manufacturer, origin, prevents, age_group, image_id, detail_content,
               availability, registration_url, note, active, created_at, updated_at, _status)
            VALUES
              ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'published')
            RETURNING id
          `, [
            row.vaccine_name, slug, row.summary, row.manufacturer, row.origin, row.prevents, row.age_group,
            row.vaccine_image_id, row.detail_content, row.availability || 'available', row.registration_url,
            row.note, row.active !== false, row.created_at, row.updated_at,
          ])
          vaccineId = inserted.rows[0].id
          insertedVaccines++
        }
        if (row.fee != null && vaccineId) {
          const priceExists = await client.query(`
            SELECT id FROM vaccine_prices
            WHERE vaccine_id = $1 AND price = $2 AND effective_to IS NULL
            LIMIT 1
          `, [vaccineId, row.fee])
          if (!priceExists.rowCount) {
            await client.query(`
              INSERT INTO vaccine_prices
                (vaccine_id, price, effective_from, note, active, created_at, updated_at)
              VALUES ($1,$2,$3,$4,$5,$6,$7)
            `, [
              vaccineId, row.fee, row.created_at || new Date(),
              row.note ? `Chuyển từ dữ liệu tiêm ngừa cũ: ${row.note}` : 'Chuyển từ dữ liệu tiêm ngừa cũ',
              row.active !== false, row.created_at || new Date(), row.updated_at || new Date(),
            ])
            insertedVaccinePrices++
          }
        }
      } else {
        const kind = row.entry_type === 'announcement' ? 'announcement' : 'official'
        const imageId = row.entry_type === 'announcement' ? row.announcement_image_id : row.campaign_image_id
        const detailContent = row.entry_type === 'announcement' ? row.announcement_content : row.detail_content
        const exists = await client.query(`
          SELECT id FROM vaccination_schedules
          WHERE lower(btrim(title)) = lower(btrim($1))
            AND COALESCE(date::date, DATE '1900-01-01') = COALESCE($2::timestamptz::date, DATE '1900-01-01')
            AND deleted_at IS NULL
          LIMIT 1
        `, [row.vaccine_name, row.date])
        if (!exists.rowCount) {
          await client.query(`
            INSERT INTO vaccination_schedules
              (title, schedule_kind, summary, schedule_image_id, schedule_file_id, detail_content, target,
               date, end_date, start_time, end_time, location, registration_url, note, active,
               created_at, updated_at, _status)
            VALUES
              ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'published')
          `, [
            row.vaccine_name, kind, row.summary, imageId, row.announcement_file_id, detailContent, row.target,
            row.date, row.end_date, row.start_time, row.end_time, row.location, row.registration_url, row.note,
            row.active !== false, row.created_at, row.updated_at,
          ])
          insertedSchedules++
        }
      }
    }

    const hiddenClones = await client.query(`
      UPDATE specialties s
      SET active = false, updated_at = now()
      FROM departments d
      WHERE d.id = s.department_id
        AND s.active IS DISTINCT FROM false
        AND (
          COALESCE(s.use_department_name, false) = true
          OR (s.slug IS NOT NULL AND d.slug IS NOT NULL AND s.slug = d.slug)
          OR lower(btrim(s.name)) = lower(btrim(d.name))
        )
      RETURNING s.id, s.name
    `)

    await client.query('COMMIT')
    console.log(`\nĐã chuyển ${insertedVaccines} vắc xin, ${insertedVaccinePrices} mức giá và ${insertedSchedules} lịch/thông báo tiêm chủng.`)
    console.log(`Đã ẩn ${hiddenClones.rowCount} Chuyên khoa legacy trùng tên Khoa/Phòng (không xóa bản ghi).`)

    const after = await audit(client)
    console.log('\n=== KIỂM TRA SAU MIGRATION ===')
    console.table(after.canonicalVaccination)
    console.table([after.specialties])
  }
} catch (error) {
  if (apply) {
    try { await client.query('ROLLBACK') } catch {}
  }
  console.error('\nMigration thất bại. Đã rollback nếu đang ở chế độ --apply.')
  console.error(error)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
