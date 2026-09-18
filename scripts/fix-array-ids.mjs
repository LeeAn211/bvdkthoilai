import fs from 'fs';
import crypto from 'crypto';
import { Client } from 'pg';

const env = fs.readFileSync('.env', 'utf8');
let conn = '';
for (const line of env.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) conn = line.replace('DATABASE_URL=', '').trim();
}
const client = new Client({ connectionString: conn });

function genId() {
  return crypto.randomBytes(12).toString('hex');
}

async function fixAllIds() {
  await client.connect();
  const tables = [
    'pps_sub_tabs',
    'pps_commits',
    'pps_svc_groups',
    'pps_svc_items',
    'hospital_map_settings_floors',
    'hospital_map_settings_facilities',
    'checkup_packages_settings_packages',
    'inpatient_guide_settings_admission_steps',
    'inpatient_guide_settings_visiting_hours',
    'inpatient_guide_settings_belongings_checklist',
    'examination_flow_settings_flow_tabs',
    'examination_flow_settings_checklists',
    'examination_flow_settings_priorities',
    'hospital_quality_settings_stat_cards',
    'hospital_quality_settings_dimensions',
    'hospital_quality_settings_programs',
    'feedback_page_settings_info_boxes',
    'survey_page_settings_info_boxes',
    'forms_page_settings_info_boxes'
  ];

  for (const t of tables) {
    const rows = await client.query(`SELECT id FROM "${t}"`);
    for (const r of rows.rows) {
      if (r.id.includes('-') || r.id.length !== 24) {
        const newId = genId();
        await client.query(`UPDATE "${t}" SET id = $1 WHERE id = $2`, [newId, r.id]);
        if (t === 'examination_flow_settings_flow_tabs') {
          await client.query('UPDATE examination_flow_settings_flow_tabs_steps SET _parent_id = $1 WHERE _parent_id = $2', [newId, r.id]);
        }
        if (t === 'pps_svc_groups') {
          await client.query('UPDATE pps_svc_items SET _parent_id = $1 WHERE _parent_id = $2', [newId, r.id]);
        }
      }
    }
    console.log('Fixed IDs for:', t);
  }

  // Steps
  const steps = await client.query('SELECT id FROM examination_flow_settings_flow_tabs_steps');
  for (const s of steps.rows) {
    if (s.id.includes('-') || s.id.length !== 24) {
      await client.query('UPDATE examination_flow_settings_flow_tabs_steps SET id = $1 WHERE id = $2', [genId(), s.id]);
    }
  }
  console.log('Fixed IDs for examination_flow_settings_flow_tabs_steps');

  await client.end();
  console.log('All array item IDs fixed to valid Payload 24-char hex ObjectIDs!');
}

fixAllIds().catch(console.error);
