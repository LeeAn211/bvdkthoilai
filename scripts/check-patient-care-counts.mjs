import fs from 'fs';
import { Client } from 'pg';

const env = fs.readFileSync('.env', 'utf8');
let conn = '';
for (const line of env.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) conn = line.replace('DATABASE_URL=', '').trim();
}
const client = new Client({ connectionString: conn });

async function checkRows() {
  await client.connect();
  const tables = [
    'patient_portal_settings',
    'pps_sub_tabs',
    'pps_commits',
    'pps_svc_groups',
    'pps_svc_items',
    'examination_flow_settings',
    'examination_flow_settings_flow_tabs',
    'examination_flow_settings_checklists',
    'examination_flow_settings_priorities',
    'hospital_quality_settings',
    'hospital_quality_settings_stat_cards',
    'hospital_quality_settings_dimensions',
    'hospital_quality_settings_programs'
  ];
  for (const t of tables) {
    try {
      const res = await client.query(`SELECT count(*) FROM "${t}"`);
      console.log(t, ':', res.rows[0].count);
    } catch(e) {
      console.log(t, 'ERROR:', e.message);
    }
  }
  await client.end();
}
checkRows().catch(console.error);
