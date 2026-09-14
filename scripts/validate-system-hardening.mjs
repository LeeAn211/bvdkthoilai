import fs from 'node:fs'

const checks = [
  ['AuditLogs collection', 'src/collections/AuditLogs.ts', "slug: 'audit-logs'"],
  ['Audit immutable create false', 'src/collections/AuditLogs.ts', 'create: () => false'],
  ['Generic collection audit', 'src/lib/audit.ts', 'withAudit'],
  ['Generic global audit', 'src/lib/audit.ts', 'withGlobalAudit'],
  ['Media read enforcement', 'src/access/index.ts', 'mediaReadAccess'],
  ['Media trash', 'src/collections/Media.ts', 'trash: true'],
  ['Media SHA-256', 'src/collections/Media.ts', "createHash('sha256')"],
  ['Media duplicate detection', 'src/collections/Media.ts', 'duplicateOf'],
  ['Upload settings enforcement', 'src/collections/Media.ts', "slug: 'upload-settings'"],
  ['Storage threshold enforcement', 'src/collections/Media.ts', 'blockPercent'],
  ['Health DB + storage', 'src/app/(frontend)/api/health/route.ts', 'storageProbe'],
  ['CSP security header', 'next.config.mjs', 'Content-Security-Policy'],
  ['HSTS production', 'next.config.mjs', 'Strict-Transport-Security'],
  ['GraphQL disabled', 'payload.config.ts', 'graphQL: { disable: true }'],
  ['System settings', 'src/globals/SystemSettings.ts', "slug: 'system-settings'"],
  ['Schedule settings', 'src/globals/ScheduleSettings.ts', "slug: 'schedule-settings'"],
  ['Backup checksum', 'scripts/backup.sh', 'SHA256SUMS'],
  ['Backup verification', 'scripts/verify-backup.sh', 'pg_restore --list'],
  ['Restore verifies backup', 'scripts/restore.sh', 'verify-backup.sh'],
]

let failed = 0
for (const [name, file, needle] of checks) {
  const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const ok = content.includes(needle)
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${name}`)
  if (!ok) failed++
}
console.log(`\nSystem Hardening: ${checks.length - failed}/${checks.length} PASS`)
if (failed) process.exit(1)
