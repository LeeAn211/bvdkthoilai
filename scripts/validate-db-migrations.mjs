import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const migrationDirectory = path.join(root, 'scripts/db-migrations')
const packageJSON = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const runner = fs.readFileSync(path.join(root, 'scripts/db-migrate.mjs'), 'utf8')
const schemaContractModule = fs.readFileSync(path.join(root, 'scripts/db-schema-contract.mjs'), 'utf8')
const schemaContract = JSON.parse(fs.readFileSync(path.join(root, 'scripts/db-schema-contract.json'), 'utf8'))
const railwayGuide = fs.readFileSync(path.join(root, 'docs/RAILWAY-DEPLOYMENT.md'), 'utf8')
const siteSettings = fs.readFileSync(path.join(root, 'src/globals/SiteSettings.ts'), 'utf8')
const homepage = fs.readFileSync(path.join(root, 'src/globals/Homepage.ts'), 'utf8')
const hospitalHistory = fs.readFileSync(path.join(root, 'src/globals/HospitalHistory.ts'), 'utf8')
const generatedSchema = fs.readFileSync(path.join(root, 'src/payload-generated-schema.ts'), 'utf8')
const dockerfile = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8')
const dockerignore = fs.readFileSync(path.join(root, '.dockerignore'), 'utf8')
const githubQualityGate = fs.readFileSync(path.join(root, '.github/workflows/quality-gate.yml'), 'utf8')

const checks = []
const check = (label, condition) => checks.push([label, Boolean(condition)])

check('Migration deploy script', packageJSON.scripts['db:migrate:deploy'] === 'node scripts/db-migrate.mjs')
check('Migration status script', packageJSON.scripts['db:migrate:status']?.includes('--status'))
check('Migration dry-run script', packageJSON.scripts['db:migrate:dry-run']?.includes('--dry-run'))
check('Migration verify script', packageJSON.scripts['db:migrate:verify']?.includes('--verify-only'))
check('Production start applies migrations automatically', packageJSON.scripts.prestart === 'node scripts/db-migrate.mjs')
check('Docker runtime uses npm start lifecycle', /CMD\s*\[\s*"npm"\s*,\s*"start"\s*\]/.test(dockerfile))
check('Docker context includes migration files', !/^scripts(?:\/|$)|db-migrations|db-schema-contract/m.test(dockerignore))
check('GitHub quality gate checks DB contract', githubQualityGate.includes('npm run db:schema:check') && githubQualityGate.includes('npm run validate:all'))
check('Build regenerates and validates DB schema', packageJSON.scripts.prebuild?.includes('payload generate:db-schema') && packageJSON.scripts.prebuild?.includes('validate-db-schema-contract.mjs'))
check('Schema contract check script', packageJSON.scripts['db:schema:check'] === 'node scripts/validate-db-schema-contract.mjs')
check('Schema contract seal script', packageJSON.scripts['db:schema:seal'] === 'node scripts/seal-db-schema.mjs')
check('Runner uses advisory lock', runner.includes('pg_try_advisory_lock'))
check('Runner verifies checksum', runner.includes("createHash('sha256')") && runner.includes('đã bị sửa sau khi áp dụng'))
check('Runner fails deployment on error', runner.includes('process.exitCode = 1'))
check('Runner has migration ledger', runner.includes('bvdk_schema_migrations'))
check('Runner validates schema contract', runner.includes('assertSchemaContract'))
check('Runner supports direct Neon migration URL', runner.includes('DATABASE_MIGRATION_URL') && runner.includes('DATABASE_URL_UNPOOLED'))
check('Schema contract prevents reusing a migration', schemaContractModule.includes('Không được dùng lại migration'))
check('Railway guide has Pre-Deploy command', railwayGuide.includes('npm run db:migrate:deploy'))
check('Railway guide keeps schema push off', railwayGuide.includes('PAYLOAD_DB_PUSH=false'))
check('Railway guide has healthcheck', railwayGuide.includes('/api/health'))
check('Site assistant nested tables use short dbName', siteSettings.includes("dbName: 'site_assistant_topics'") && siteSettings.includes("dbName: 'site_assistant_answers'"))
check('Homepage vaccination tabs use short dbName', homepage.includes("dbName: 'homepage_vax_tabs'"))
check('Hospital history core values use short dbName', hospitalHistory.includes("dbName: 'history_core_values'"))

const generatedIdentifiers = [
  ...[...generatedSchema.matchAll(/\bindex\(\s*"([^"]+)"/g)].map((match) => match[1]),
  ...[...generatedSchema.matchAll(/\bname:\s*"([^"]+_(?:fk|pkey))"/g)].map((match) => match[1]),
]
check(
  'Generated PostgreSQL index and constraint identifiers fit 63 bytes',
  generatedIdentifiers.length > 0 && generatedIdentifiers.every((name) => Buffer.byteLength(name, 'utf8') <= 63),
)

const migrationFiles = fs.readdirSync(migrationDirectory)
  .filter((fileName) => fileName.endsWith('.mjs'))
  .sort()

check('At least one versioned migration', migrationFiles.length > 0)
check(
  'Migration filenames are ordered and valid',
  migrationFiles.every((fileName) => /^\d{8}_\d{3}_[a-z0-9_]+\.mjs$/.test(fileName)),
)

const ids = []
for (const fileName of migrationFiles) {
  const filePath = path.join(migrationDirectory, fileName)
  const source = fs.readFileSync(filePath, 'utf8')
  const migration = await import(pathToFileURL(filePath).href)
  const expectedID = fileName.slice(0, -4)
  ids.push(migration.id)

  check(`${fileName}: id khớp tên file`, migration.id === expectedID)
  check(`${fileName}: có description`, typeof migration.description === 'string' && migration.description.length > 0)
  check(`${fileName}: có up + verify`, typeof migration.up === 'function' && typeof migration.verify === 'function')
  check(`${fileName}: không có SQL phá dữ liệu`, !/\b(DROP|TRUNCATE)\b/i.test(source))
}

check('Migration IDs are unique', new Set(ids).size === ids.length)
check('Schema contract points to latest migration', schemaContract.migrationId === ids.at(-1))

let passed = 0
for (const [label, ok] of checks) {
  if (ok) passed += 1
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${label}`)
}

console.log(`\nDatabase migrations: ${passed}/${checks.length} PASS`)
if (passed !== checks.length) process.exit(1)
