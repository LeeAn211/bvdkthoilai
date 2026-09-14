import pg from 'pg'

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:Nguyentanan1707%40@localhost:5432/thoi_lai_hospital',
})

const queries = [
  "ALTER TABLE notices ADD COLUMN IF NOT EXISTS cover_fit VARCHAR DEFAULT 'cover';",
  "ALTER TABLE notices ADD COLUMN IF NOT EXISTS cover_position VARCHAR DEFAULT 'top';",
  "ALTER TABLE news ADD COLUMN IF NOT EXISTS cover_fit VARCHAR DEFAULT 'cover';",
  "ALTER TABLE news ADD COLUMN IF NOT EXISTS cover_position VARCHAR DEFAULT 'top';",
  "ALTER TABLE procurement ADD COLUMN IF NOT EXISTS cover_fit VARCHAR DEFAULT 'cover';",
  "ALTER TABLE procurement ADD COLUMN IF NOT EXISTS cover_position VARCHAR DEFAULT 'top';",
  "ALTER TABLE _notices_v ADD COLUMN IF NOT EXISTS version_cover_fit VARCHAR DEFAULT 'cover';",
  "ALTER TABLE _notices_v ADD COLUMN IF NOT EXISTS version_cover_position VARCHAR DEFAULT 'top';",
  "ALTER TABLE _news_v ADD COLUMN IF NOT EXISTS version_cover_fit VARCHAR DEFAULT 'cover';",
  "ALTER TABLE _news_v ADD COLUMN IF NOT EXISTS version_cover_position VARCHAR DEFAULT 'top';",
  "ALTER TABLE _procurement_v ADD COLUMN IF NOT EXISTS version_cover_fit VARCHAR DEFAULT 'cover';",
  "ALTER TABLE _procurement_v ADD COLUMN IF NOT EXISTS version_cover_position VARCHAR DEFAULT 'top';"
]

async function run() {
  const client = await pool.connect()
  try {
    for (const q of queries) {
      await client.query(q)
      console.log('✓ Executed:', q)
    }
    console.log('\n--> Tất cả các cột database theo CHANGELOG.md đã được cập nhật thành công!')
  } catch (e) {
    console.error('Error executing query:', e)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
