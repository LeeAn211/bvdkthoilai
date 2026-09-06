import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve('src/collections')
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.ts'))
const failures = []

for (const file of files) {
  const full = path.join(dir, file)
  const source = fs.readFileSync(full, 'utf8')
  const drafts = /versions\s*:\s*\{[\s\S]*?drafts\s*:/.test(source)
  const businessStatus = /name\s*:\s*['"]status['"]/.test(source)

  if (drafts && businessStatus) {
    failures.push(`${file}: contains drafts plus a custom field named "status"`)
  }
}

if (failures.length) {
  console.error('Payload config audit failed:')
  failures.forEach((x) => console.error(`- ${x}`))
  process.exit(1)
}

console.log('Payload config audit passed.')
