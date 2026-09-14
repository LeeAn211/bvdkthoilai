import pg from 'pg'
import fs from 'node:fs'

for (const envFile of ['.env.local', '.env']) {
  if (!fs.existsSync(envFile)) continue
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
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
const client = await pool.connect()

async function counts() {
  const result = await client.query(`
    SELECT * FROM (
      SELECT 'departments' AS collection,
        (SELECT COUNT(*)::int FROM departments) AS base_rows,
        (SELECT COUNT(*)::int FROM _departments_v) AS version_rows,
        (SELECT COUNT(*)::int FROM departments d WHERE NOT EXISTS (
          SELECT 1 FROM _departments_v v WHERE v.parent_id = d.id AND v.latest IS TRUE
        )) AS missing_latest
      UNION ALL
      SELECT 'doctors',
        (SELECT COUNT(*)::int FROM doctors),
        (SELECT COUNT(*)::int FROM _doctors_v),
        (SELECT COUNT(*)::int FROM doctors d WHERE NOT EXISTS (
          SELECT 1 FROM _doctors_v v WHERE v.parent_id = d.id AND v.latest IS TRUE
        ))
      UNION ALL
      SELECT 'vaccines',
        (SELECT COUNT(*)::int FROM vaccines WHERE deleted_at IS NULL),
        (SELECT COUNT(*)::int FROM _vaccines_v),
        (SELECT COUNT(*)::int FROM vaccines d WHERE d.deleted_at IS NULL AND NOT EXISTS (
          SELECT 1 FROM _vaccines_v v WHERE v.parent_id = d.id AND v.latest IS TRUE
        ))
      UNION ALL
      SELECT 'vaccination_schedules',
        (SELECT COUNT(*)::int FROM vaccination_schedules WHERE deleted_at IS NULL),
        (SELECT COUNT(*)::int FROM _vaccination_schedules_v),
        (SELECT COUNT(*)::int FROM vaccination_schedules d WHERE d.deleted_at IS NULL AND NOT EXISTS (
          SELECT 1 FROM _vaccination_schedules_v v WHERE v.parent_id = d.id AND v.latest IS TRUE
        ))
      UNION ALL
      SELECT 'vaccine_prices',
        (SELECT COUNT(*)::int FROM vaccine_prices),
        (SELECT COUNT(*)::int FROM _vaccine_prices_v),
        (SELECT COUNT(*)::int FROM vaccine_prices d WHERE NOT EXISTS (
          SELECT 1 FROM _vaccine_prices_v v WHERE v.parent_id = d.id
        ))
    ) x ORDER BY collection
  `)
  return result.rows
}

async function repairDepartments() {
  const rows = (await client.query(`
    SELECT d.* FROM departments d
    WHERE NOT EXISTS (SELECT 1 FROM _departments_v v WHERE v.parent_id=d.id AND v.latest IS TRUE)
    ORDER BY d.id
  `)).rows
  let inserted = 0
  for (const d of rows) {
    await client.query('UPDATE _departments_v SET latest=false WHERE parent_id=$1 AND latest IS TRUE', [d.id])
    const v = await client.query(`
      INSERT INTO _departments_v (
        parent_id, version_name, version_kind, version_unit_type, version_slug, version_summary,
        version_content, version_functions, version_activities, version_achievements, version_leader,
        version_phone, version_email, version_location, version_cover_id, version_order, version_active,
        version_seo_title, version_seo_description, version_seo_image_id, version_updated_at,
        version_created_at, version__status, created_at, updated_at, latest,
        version_canonical_url, version_no_index, version_exclude_from_sitemap
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
        $23::public.enum__departments_v_version_status,$24,$25,true,$26,$27,$28
      ) RETURNING id
    `, [d.id,d.name,d.kind,d.unit_type,d.slug,d.summary,d.content,d.functions,d.activities,d.achievements,d.leader,
      d.phone,d.email,d.location,d.cover_id,d.order,d.active,d.seo_title,d.seo_description,d.seo_image_id,
      d.updated_at,d.created_at,d._status || 'published',d.created_at,d.updated_at,d.canonical_url,d.no_index,d.exclude_from_sitemap])
    const versionID = v.rows[0].id
    await client.query(`INSERT INTO _departments_v_version_deputy_leaders (_order,_parent_id,name,title,_uuid)
      SELECT _order,$1,name,title,id FROM departments_deputy_leaders WHERE _parent_id=$2 ORDER BY _order`, [versionID,d.id])
    await client.query(`INSERT INTO _departments_v_version_gallery (_order,_parent_id,image_id,caption,_uuid)
      SELECT _order,$1,image_id,caption,id FROM departments_gallery WHERE _parent_id=$2 ORDER BY _order`, [versionID,d.id])
    inserted++
  }
  return inserted
}

async function repairDoctors() {
  const r = await client.query(`
    INSERT INTO _doctors_v (
      parent_id,version_name,version_slug,version_title,version_degree,version_professional_title,
      version_avatar_id,version_department_id,version_specialty_ref_id,version_specialty,version_license_number,
      version_bio,version_expertise,version_experience,version_education,version_achievements,version_order,
      version_featured,version_active,version_seo_title,version_seo_description,version_seo_image_id,
      version_updated_at,version_created_at,version__status,created_at,updated_at,latest,
      version_canonical_url,version_no_index,version_exclude_from_sitemap
    )
    SELECT d.id,d.name,d.slug,d.title,d.degree,d.professional_title,d.avatar_id,d.department_id,d.specialty_ref_id,
      d.specialty,d.license_number,d.bio,d.expertise,d.experience,d.education,d.achievements,d."order",d.featured,d.active,
      d.seo_title,d.seo_description,d.seo_image_id,d.updated_at,d.created_at,
      COALESCE(d._status::text,'published')::public.enum__doctors_v_version_status,d.created_at,d.updated_at,true,
      d.canonical_url,d.no_index,d.exclude_from_sitemap
    FROM doctors d
    WHERE NOT EXISTS (SELECT 1 FROM _doctors_v v WHERE v.parent_id=d.id AND v.latest IS TRUE)
    RETURNING id
  `)
  return r.rowCount
}

async function repairVaccines() {
  const r = await client.query(`
    INSERT INTO _vaccines_v (
      parent_id,version_code,version_name,version_slug,version_summary,version_manufacturer,version_origin,
      version_prevents,version_age_group,version_image_id,version_detail_content,version_availability,
      version_registration_url,version_note,version_active,version_updated_at,version_created_at,
      version_deleted_at,version__status,created_at,updated_at,latest
    )
    SELECT d.id,d.code,d.name,d.slug,d.summary,d.manufacturer,d.origin,d.prevents,d.age_group,d.image_id,
      d.detail_content,d.availability::text::public.enum__vaccines_v_version_availability,d.registration_url,d.note,
      d.active,d.updated_at,d.created_at,d.deleted_at,
      COALESCE(d._status::text,'published')::public.enum__vaccines_v_version_status,d.created_at,d.updated_at,true
    FROM vaccines d
    WHERE d.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM _vaccines_v v WHERE v.parent_id=d.id AND v.latest IS TRUE)
    RETURNING id
  `)
  return r.rowCount
}

async function repairVaccinationSchedules() {
  const r = await client.query(`
    INSERT INTO _vaccination_schedules_v (
      parent_id,version_title,version_schedule_kind,version_summary,version_schedule_image_id,
      version_schedule_file_id,version_detail_content,version_target,version_date,version_end_date,
      version_start_time,version_end_time,version_location,version_registration_url,version_note,
      version_active,version_updated_at,version_created_at,version_deleted_at,version__status,
      created_at,updated_at,latest
    )
    SELECT d.id,d.title,d.schedule_kind::text::public.enum__vaccination_schedules_v_version_schedule_kind,
      d.summary,d.schedule_image_id,d.schedule_file_id,d.detail_content,d.target,d.date,d.end_date,d.start_time,
      d.end_time,d.location,d.registration_url,d.note,d.active,d.updated_at,d.created_at,d.deleted_at,
      COALESCE(d._status::text,'published')::public.enum__vaccination_schedules_v_version_status,
      d.created_at,d.updated_at,true
    FROM vaccination_schedules d
    WHERE d.deleted_at IS NULL AND NOT EXISTS (
      SELECT 1 FROM _vaccination_schedules_v v WHERE v.parent_id=d.id AND v.latest IS TRUE
    )
    RETURNING id
  `)
  return r.rowCount
}

async function repairVaccinePrices() {
  const r = await client.query(`
    INSERT INTO _vaccine_prices_v (
      parent_id,version_vaccine_id,version_price,version_decision_no,version_effective_from,
      version_effective_to,version_note,version_active,version_updated_at,version_created_at,created_at,updated_at
    )
    SELECT d.id,d.vaccine_id,d.price,d.decision_no,d.effective_from,d.effective_to,d.note,d.active,
      d.updated_at,d.created_at,d.created_at,d.updated_at
    FROM vaccine_prices d
    WHERE NOT EXISTS (SELECT 1 FROM _vaccine_prices_v v WHERE v.parent_id=d.id)
    RETURNING id
  `)
  return r.rowCount
}

try {
  console.log('\n=== KIỂM TRA PAYLOAD VERSION VISIBILITY ===')
  console.table(await counts())
  if (!apply) {
    console.log('\nDRY-RUN: chưa thay đổi dữ liệu.')
    console.log('Để sửa hiển thị Admin: npm run repair:visibility -- --apply')
  } else {
    await client.query('BEGIN')
    const result = {
      departments: await repairDepartments(),
      doctors: await repairDoctors(),
      vaccines: await repairVaccines(),
      vaccination_schedules: await repairVaccinationSchedules(),
      vaccine_prices: await repairVaccinePrices(),
    }
    await client.query('COMMIT')
    console.log('\n=== ĐÃ TẠO VERSION PAYLOAD CÒN THIẾU ===')
    console.table([result])
    console.log('\n=== KIỂM TRA SAU SỬA ===')
    console.table(await counts())
    console.log('\nKhông xóa bảng, không đổi ID dữ liệu gốc, không bật DB push.')
  }
} catch (error) {
  if (apply) {
    try { await client.query('ROLLBACK') } catch {}
  }
  console.error('\nSửa visibility thất bại. Đã rollback nếu đang --apply.')
  console.error(error)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
