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

// Find all global settings tables (they have an id sequence)
console.log('=== Checking all global table sequences ===');

const globals = [
  'patient_portal_settings',
  'inpatient_guide_settings', 
  'checkup_packages_settings',
  'hospital_map_settings',
  'examination_flow_settings',
  'hospital_quality_settings',
  'site_settings',
  'header_settings',
  'footer_settings',
];

for (const table of globals) {
  try {
    // Get max ID in table
    const r1 = await client.query(`SELECT MAX(id) as max_id FROM "${table}"`);
    const maxId = r1.rows[0]?.max_id;
    
    // Get current sequence value
    const seqName = `${table}_id_seq`;
    let seqVal = null;
    try {
      const r2 = await client.query(`SELECT last_value FROM "${seqName}"`);
      seqVal = r2.rows[0]?.last_value;
    } catch (e) {
      seqVal = 'NO_SEQ';
    }
    
    console.log(`${table}: max_id=${maxId}, seq_last=${seqVal}, CONFLICT=${maxId >= seqVal}`);
    
    // Fix sequence if needed
    if (maxId !== null && maxId !== undefined && seqVal !== 'NO_SEQ') {
      await client.query(`SELECT setval('${seqName}', GREATEST(${maxId}, 1), true)`);
      console.log(`  -> Fixed: sequence now at ${maxId}`);
    }
  } catch (e) {
    console.log(`${table}: ERROR - ${e.message.substring(0, 80)}`);
  }
}

console.log('\n=== Done fixing sequences ===');
await client.end();
