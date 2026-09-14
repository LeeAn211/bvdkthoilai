import pg from 'pg'
import fs from 'node:fs'

for (const envFile of ['.env.local', '.env']) {
  if (!fs.existsSync(envFile)) continue
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}

const databaseURL = process.env.DATABASE_URL

if (!databaseURL) {
  console.log('[repair-delete] Bỏ qua: chưa có DATABASE_URL.')
  process.exit(0)
}

const quote = (value) => `"${String(value).replaceAll('"', '""')}"`
const client = new pg.Client({ connectionString: databaseURL, connectionTimeoutMillis: 8000 })

try {
  await client.connect()
  // Không chờ vô hạn nếu database đang bị session khác giữ lock.
  await client.query("SET lock_timeout = '5s'")
  await client.query("SET statement_timeout = '30s'")
  const { rows } = await client.query(`
    SELECT
      con.conname AS constraint_name,
      child_ns.nspname AS child_schema,
      child.relname AS child_table,
      parent.relname AS parent_table,
      pg_get_constraintdef(con.oid, true) AS definition
    FROM pg_constraint con
    JOIN pg_class child ON child.oid = con.conrelid
    JOIN pg_namespace child_ns ON child_ns.oid = child.relnamespace
    JOIN pg_class parent ON parent.oid = con.confrelid
    JOIN pg_namespace parent_ns ON parent_ns.oid = parent.relnamespace
    WHERE con.contype = 'f'
      AND child_ns.nspname = parent_ns.nspname
      AND child_ns.nspname NOT IN ('pg_catalog', 'information_schema')
      AND child_ns.nspname NOT LIKE 'pg_toast%'
      AND con.confdeltype <> 'c'
      AND (
        child.relname LIKE parent.relname || '\_%' ESCAPE '\\'
        OR child.relname LIKE '\_' || parent.relname || '\_v%' ESCAPE '\\'
        OR child.relname LIKE '%\_rels' ESCAPE '\\'
      )
  `)

  await client.query('BEGIN')
  try {
    for (const row of rows) {
      const definition = / ON DELETE /i.test(row.definition)
        ? row.definition.replace(/ ON DELETE (NO ACTION|RESTRICT|CASCADE|SET NULL|SET DEFAULT)/i, ' ON DELETE CASCADE')
        : `${row.definition} ON DELETE CASCADE`

      await client.query(
        `ALTER TABLE ${quote(row.child_schema)}.${quote(row.child_table)} ` +
        `DROP CONSTRAINT ${quote(row.constraint_name)}, ` +
        `ADD CONSTRAINT ${quote(row.constraint_name)} ${definition}`,
      )
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  }

  console.log(`[repair-delete] Đã kiểm tra, sửa ${rows.length} ràng buộc xóa dữ liệu cũ (bảng con, quan hệ và lịch sử phiên bản).`)
} catch (error) {
  console.error('[repair-delete] Không thể sửa ràng buộc:', error?.message || error)
  process.exitCode = 1
} finally {
  await client.end().catch(() => undefined)
}
