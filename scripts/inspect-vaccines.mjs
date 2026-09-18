import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const { Client } = pg;
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile(path.resolve('.env.local'));
  loadEnvFile(path.resolve('.env'));
  const connectionString = process.env.DATABASE_MIGRATION_URL?.trim() || process.env.DATABASE_URL?.trim();
  const client = new Client({ connectionString });
  await client.connect();

  const res = await client.query('SELECT * FROM vaccinations LIMIT 10');
  console.log('Legacy vaccinations rows count:', res.rows.length);
  if (res.rows.length > 0) {
    console.log('Sample legacy row:', res.rows[0]);
  }

  const vaxRows = await client.query('SELECT * FROM vaccines');
  console.log('Vaccines count:', vaxRows.rows.length);
  console.log('All Vaccines in DB:', vaxRows.rows);

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
