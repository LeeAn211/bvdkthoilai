import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function clean() {
  try {
    const res = await pool.query("DELETE FROM expert_items WHERE (name IS NULL OR name = '') AND doctor_ref_id IS NULL;");
    console.log('DELETED EMPTY EXPERT ITEMS:', res.rowCount);
  } catch (e) {
    console.log('Error cleaning expert_items:', e.message);
  }
  try {
    const res2 = await pool.query("DELETE FROM _expert_items_v WHERE (name IS NULL OR name = '') AND doctor_ref_id IS NULL;");
    console.log('DELETED EMPTY _EXPERT_ITEMS_V:', res2.rowCount);
  } catch (e) {
    console.log('Error cleaning _expert_items_v:', e.message);
  }
  await pool.end();
}

clean();
