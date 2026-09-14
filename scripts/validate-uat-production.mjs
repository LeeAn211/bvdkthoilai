import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const exists = (p) => fs.existsSync(path.join(root, p))
const checks = []
const check = (name, ok) => checks.push([name, !!ok])

const pkg = JSON.parse(read('package.json'))
const payload = read('payload.config.ts')
const next = read('next.config.mjs')
const health = read('src/app/(frontend)/api/health/route.ts')

check('Version v4.2.x', /^4\.2\./.test(String(pkg.version)))
check('Production env template', exists('.env.production.example'))
check('Production preflight script', exists('scripts/preflight-production.mjs') && pkg.scripts['preflight:production'])
check('Production smoke script', exists('scripts/smoke-production.mjs') && pkg.scripts['smoke:production'])
check('Validate all script', !!pkg.scripts['validate:all'])
check('Deploy check script', !!pkg.scripts['deploy:check'])
check('Production DB schema push disabled', payload.includes("push: process.env.NODE_ENV !== 'production'"))
check('Production secret validation', payload.includes('PAYLOAD_SECRET') && payload.includes('length < 32'))
check('GraphQL disabled', payload.includes('graphQL: { disable: true }'))
check('CSP header', next.includes('Content-Security-Policy'))
check('HSTS production', next.includes('Strict-Transport-Security') && next.includes('isProduction'))
check('Admin/API noindex', next.includes("'/admin/:path*'") && next.includes("'/api/:path*'"))
check('Health checks database', health.includes("collection: 'users'") && health.includes('checks.database'))
check('Health checks storage', health.includes('storageProbe') && health.includes('checks.storage'))
check('Backup verify script', exists('scripts/verify-backup.sh'))
check('Restore verification', exists('scripts/restore.sh') && read('scripts/restore.sh').includes('verify-backup.sh'))
check('UAT checklist', exists('UAT-PRODUCTION-CHECKLIST.md'))
check('Deployment guide', exists('PRODUCTION-DEPLOYMENT.md'))
check('Docker healthcheck', read('docker-compose.yml').includes('/api/health'))
check('Core route: feedback lookup', exists('src/app/(frontend)/gop-y/tra-cuu/page.tsx'))
check('Core route: survey', exists('src/app/(frontend)/khao-sat/[slug]/page.tsx'))
check('Core route: specialties', exists('src/app/(frontend)/chuyen-khoa/[slug]/page.tsx'))
check('Robots route', exists('src/app/(frontend)/robots.ts') || exists('src/app/robots.ts'))
check('Sitemap route', exists('src/app/(frontend)/sitemap.ts') || exists('src/app/sitemap.ts'))

let pass = 0
for (const [name, ok] of checks) {
  if (ok) pass++
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${name}`)
}
console.log(`\nUAT / Production static readiness: ${pass}/${checks.length} PASS`)
if (pass !== checks.length) process.exit(1)
