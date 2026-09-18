import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;

const lines = fs.readFileSync('.env', 'utf8').split('\n');
let dbUrl = '';
for (const l of lines) {
  if (l.startsWith('DATABASE_URL=')) {
    dbUrl = l.replace('DATABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
  }
}
const pool = new Pool({ connectionString: dbUrl });

async function check() {
  const h = await pool.query('SELECT * FROM hospital_history LIMIT 1');
  console.log('hospital_history exists, rows:', h.rows.length);
  if (h.rows.length > 0) {
    const row = h.rows[0];
    for (const [k, v] of Object.entries(row)) {
      if (k.includes('core') || k.includes('mission') || k.includes('show') || k.includes('value')) {
        console.log(k, '=>', v);
      }
    }
  }
  const vals = await pool.query('SELECT * FROM history_core_values');
  console.log('history_core_values rows count:', vals.rows.length);
  console.log('history_core_values data:', JSON.stringify(vals.rows, null, 2));

  await pool.end();
}

check().catch(e => {
  console.error('Error:', e.message);
  pool.end();
});
