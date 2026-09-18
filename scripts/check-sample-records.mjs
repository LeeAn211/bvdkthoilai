import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const tables = [
    'news', 'notices', 'procurements', 'documents', 'faqs', 
    'departments', 'specialties', 'services', 'vaccines',
    'surveys', 'quick_links', 'homepage_sections', 'site_settings'
  ];
  for (const t of tables) {
    try {
      const r = await pool.query(`SELECT count(*) FROM "${t}";`);
      console.log(t, 'COUNT:', r.rows[0].count);
    } catch (e) {
      console.log(t, 'ERR:', e.message);
    }
  }
  await pool.end();
}
check();
