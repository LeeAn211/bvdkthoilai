import { readFileSync } from 'fs';
import pg from 'pg';
const { Client } = pg;

const env = readFileSync('.env', 'utf8');
let conn = '';
for (const line of env.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) conn = line.replace('DATABASE_URL=', '').trim();
}

const client = new Client({ connectionString: conn });
await client.connect();

const r1 = await client.query('SELECT * FROM pps_svc_groups');
console.log('pps_svc_groups:', JSON.stringify(r1.rows, null, 2));

const r2 = await client.query('SELECT id, _order, _parent_id, title FROM pps_svc_items');
console.log('pps_svc_items count:', r2.rowCount);
console.log('pps_svc_items sample:', r2.rows.slice(0, 4));

const r3 = await client.query('SELECT id, _order, key FROM pps_sub_tabs');
console.log('pps_sub_tabs count:', r3.rowCount);

const r4 = await client.query('SELECT * FROM patient_portal_settings');
console.log('patient_portal_settings:', r4.rows.map(r => ({ id: r.id, updated_at: r.updated_at })));

await client.end();
