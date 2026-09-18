import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function clean() {
  try {
    const res = await pool.query("DELETE FROM tech_items WHERE technique_ref_id IS NULL;");
    console.log('DELETED DUMMY TECH ITEMS:', res.rowCount);
  } catch (e) {
    console.log('Error cleaning tech_items:', e.message);
  }
  try {
    const res2 = await pool.query("DELETE FROM _tech_items_v WHERE technique_ref_id IS NULL;");
    console.log('DELETED DUMMY _TECH_ITEMS_V:', res2.rowCount);
  } catch (e) {
    console.log('Error cleaning _tech_items_v:', e.message);
  }
  await pool.end();
}

clean();
