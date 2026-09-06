import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('src/app/(payload)/admin/importMap.js')

if (!fs.existsSync(file)) {
  console.error(`Missing Payload import map: ${file}`)
  console.error('Run: npm run generate:importmap')
  process.exit(1)
}

const text = fs.readFileSync(file, 'utf8')

if (!text.includes('importMap') || text.includes('export const importMap = {}')) {
  console.error('Payload import map exists but appears empty/stale.')
  console.error('Run: npm run generate:importmap')
  process.exit(1)
}

console.log('Payload import map exists and is populated.')
