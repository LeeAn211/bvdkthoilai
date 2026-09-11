import fs from 'node:fs'
const checks = [
  ['Payload brute-force lock', 'src/collections/Users.ts', 'maxLoginAttempts: 5'],
  ['Turnstile server verify', 'src/lib/request-security.ts', 'challenges.cloudflare.com/turnstile/v0/siteverify'],
  ['ExcelJS import', 'src/app/(frontend)/api/services-import/route.ts', "from 'exceljs'"],
  ['Docker localhost bind', 'docker-compose.yml', '127.0.0.1:3000:3000'],
  ['Docker non-root', 'Dockerfile', 'USER node'],
  ['Nginx login limiter', 'deploy/nginx/benhvien.conf', 'zone=site_login'],
  ['Nginx trusted IP overwrite', 'deploy/nginx/bv-proxy.conf', 'X-Forwarded-For $remote_addr'],
]
let failed = false
for (const [name,file,needle] of checks) {
  const ok = fs.existsSync(file) && fs.readFileSync(file,'utf8').includes(needle)
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed = true
}
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'))
if (pkg.dependencies?.xlsx) { console.log('FAIL legacy xlsx dependency'); failed = true } else console.log('PASS legacy xlsx removed')
if (fs.existsSync('src/app/(frontend)/api/auth-check/route.ts')) { console.log('FAIL auth-check still present'); failed = true } else console.log('PASS auth-check removed')
process.exit(failed ? 1 : 0)
