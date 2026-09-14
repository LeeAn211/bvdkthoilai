import process from 'node:process'

const errors = []
const warnings = []
const ok = []

const need = (name) => {
  const v = process.env[name]?.trim()
  if (!v) errors.push(`Thiếu ${name}`)
  else ok.push(`${name} đã cấu hình`)
  return v || ''
}

const node = process.versions.node.split('.').map(Number)
if (node[0] < 20 || (node[0] === 20 && node[1] < 9)) errors.push(`Node.js ${process.versions.node} quá cũ; yêu cầu >=20.9.0`)
else ok.push(`Node.js ${process.versions.node}`)

if (process.env.NODE_ENV !== 'production') warnings.push(`NODE_ENV hiện là "${process.env.NODE_ENV || '(trống)'}"; khi deploy phải là production`)
else ok.push('NODE_ENV=production')

const site = need('NEXT_PUBLIC_SITE_URL')
if (site) {
  try {
    const u = new URL(site)
    if (u.protocol !== 'https:') errors.push('NEXT_PUBLIC_SITE_URL phải dùng https:// trên Production')
    if (u.pathname !== '/' || u.search || u.hash) warnings.push('NEXT_PUBLIC_SITE_URL nên chỉ chứa origin, không kèm path/query/hash')
  } catch { errors.push('NEXT_PUBLIC_SITE_URL không phải URL hợp lệ') }
}

const db = need('DATABASE_URL')
if (db && !/^postgres(ql)?:\/\//i.test(db)) errors.push('DATABASE_URL phải là PostgreSQL URL')

for (const name of ['PAYLOAD_SECRET', 'PREVIEW_SECRET']) {
  const value = need(name)
  if (value && value.length < 32) errors.push(`${name} phải có ít nhất 32 ký tự`)
  if (/CHANGE_ME|development-only|password|secret/i.test(value)) errors.push(`${name} còn giá trị mẫu/yếu`)
}

if (process.env.SEED_ADMIN_PASSWORD && process.env.SEED_ADMIN_PASSWORD.length < 12) warnings.push('SEED_ADMIN_PASSWORD nên có ít nhất 12 ký tự nếu dùng seed')

for (const line of ok) console.log(`PASS - ${line}`)
for (const line of warnings) console.warn(`WARN - ${line}`)
for (const line of errors) console.error(`FAIL - ${line}`)

if (errors.length) {
  console.error(`\nProduction preflight: FAIL (${errors.length} lỗi, ${warnings.length} cảnh báo)`)
  process.exit(1)
}
console.log(`\nProduction preflight: PASS (${warnings.length} cảnh báo)`)
