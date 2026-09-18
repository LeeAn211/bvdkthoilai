/**
 * GIẢI PHÁP: Xóa toàn bộ dữ liệu cũ đã seed thủ công và để Payload tự tạo lại
 * qua Admin UI hoặc updateGlobal API để đảm bảo compatibility hoàn toàn.
 * 
 * Chiến lược:
 * 1. Backup dữ liệu hiện tại
 * 2. Xóa toàn bộ record từ tất cả global settings tables
 * 3. Để Payload tự tạo record với cơ chế upsert của nó
 * 4. Restore dữ liệu bằng Payload API
 */

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

// Backup current data first
console.log('=== Step 1: Backup current data ===');
const backup = {};

const tables = [
  'patient_portal_settings',
  'pps_sub_tabs',
  'pps_commits',
  'pps_svc_groups', 
  'pps_svc_items',
  'pps_custom_blocks',
];

for (const table of tables) {
  const r = await client.query(`SELECT * FROM "${table}"`);
  backup[table] = r.rows;
  console.log(`Backed up ${r.rows.length} rows from ${table}`);
}

// Write backup to file
import { writeFileSync } from 'fs';
writeFileSync('scripts/backup-pps-data.json', JSON.stringify(backup, null, 2), 'utf8');
console.log('Backup saved to scripts/backup-pps-data.json');

// Step 2: DELETE all data from patient_portal_settings (cascade will clean up sub-tables)
console.log('\n=== Step 2: Delete all records ===');
await client.query('DELETE FROM patient_portal_settings');
console.log('Deleted all records from patient_portal_settings (cascade deleted sub-tables)');

// Step 3: Reset sequences
console.log('\n=== Step 3: Reset sequences ===');
await client.query(`SELECT setval('patient_portal_settings_id_seq', 1, false)`);
console.log('Reset patient_portal_settings_id_seq to start fresh from 1');

// Verify
const verify = await client.query('SELECT COUNT(*) FROM patient_portal_settings');
console.log('Remaining records in patient_portal_settings:', verify.rows[0].count);

await client.end();

console.log('\n=== DONE ===');
console.log('Now run the dev server and let Payload create the global record naturally.');
console.log('Then restore data using: node scripts/restore-pps-data.mjs');
