import process from 'node:process'

const base = (process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
const paths = [
  '/', '/tin-tuc', '/thong-bao', '/dau-thau-mua-sam', '/tuyen-dung', '/van-ban',
  '/bang-gia', '/lich-kham', '/tiem-chung', '/khoa-phong', '/chuyen-khoa', '/bac-si',
  '/tim-kiem', '/gop-y', '/gop-y/tra-cuu', '/robots.txt', '/sitemap.xml', '/api/health',
]

let failed = 0
for (const path of paths) {
  try {
    const res = await fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(10000) })
    const accepted = res.status >= 200 && res.status < 400
    if (!accepted) failed++
    console.log(`${accepted ? 'PASS' : 'FAIL'} ${String(res.status).padStart(3)} ${path}`)
    if (path === '/api/health' && accepted) {
      const data = await res.json().catch(() => null)
      if (!data || data.status !== 'ok' || data.checks?.database !== 'ok') {
        failed++
        console.log('FAIL     /api/health không xác nhận database=ok')
      }
    }
  } catch (e) {
    failed++
    console.log(`FAIL --- ${path} (${e?.message || 'network error'})`)
  }
}

// Security headers on homepage
try {
  const res = await fetch(`${base}/`, { signal: AbortSignal.timeout(10000) })
  const required = ['content-security-policy', 'x-content-type-options', 'referrer-policy', 'permissions-policy']
  for (const h of required) {
    const present = !!res.headers.get(h)
    if (!present) failed++
    console.log(`${present ? 'PASS' : 'FAIL'} header ${h}`)
  }
  if (base.startsWith('https://')) {
    const hsts = !!res.headers.get('strict-transport-security')
    if (!hsts) failed++
    console.log(`${hsts ? 'PASS' : 'FAIL'} header strict-transport-security`)
  }
} catch (e) {
  failed++
  console.log(`FAIL security headers (${e?.message || 'network error'})`)
}

if (failed) {
  console.error(`\nProduction smoke test: FAIL (${failed} lỗi)`)
  process.exit(1)
}
console.log('\nProduction smoke test: PASS')
