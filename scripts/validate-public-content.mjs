import fs from 'node:fs'

const checks = [
  ['Categories collection', 'src/collections/Categories.ts', /slug:\s*'categories'/],
  ['Redirects collection', 'src/collections/Redirects.ts', /slug:\s*'redirects'/],
  ['Default media global', 'src/globals/DefaultMediaSettings.ts', /slug:\s*'default-media-settings'/],
  ['Editable auto slug', 'src/fields/common.ts', /Có thể chỉnh thủ công/],
  ['Workflow fields', 'src/fields/common.ts', /workflowState/],
  ['Workflow server access', 'src/access/index.ts', /workflowUpdateAccess/],
  ['Trash-safe delete access', 'src/access/index.ts', /contentDeleteAccess/],
  ['News trash', 'src/collections/News.ts', /trash:\s*true/],
  ['Notices trash', 'src/collections/Notices.ts', /trash:\s*true/],
  ['Procurement trash', 'src/collections/Procurement.ts', /trash:\s*true/],
  ['Recruitment trash', 'src/collections/Recruitment.ts', /trash:\s*true/],
  ['Documents trash', 'src/collections/Documents.ts', /trash:\s*true/],
  ['Pages trash', 'src/collections/Pages.ts', /trash:\s*true/],
  ['Slug redirect hook', 'src/hooks/contentWorkflow.ts', /createSlugRedirect/],
  ['Dynamic 301 resolver', 'src/app/(frontend)/[...path]/page.tsx', /permanentRedirect/],
  ['Fallback media helper', 'src/lib/defaultMedia.ts', /getDefaultContentMedia/],
  ['News category relation', 'src/collections/News.ts', /categoryRelationshipField\('news'\)/],
  ['Notice category relation', 'src/collections/Notices.ts', /categoryRelationshipField\('notices'\)/],
  ['Procurement category relation', 'src/collections/Procurement.ts', /categoryRelationshipField\('procurement'\)/],
  ['Recruitment category relation', 'src/collections/Recruitment.ts', /categoryRelationshipField\('recruitment'\)/],
  ['Documents category relation', 'src/collections/Documents.ts', /categoryRelationshipField\('documents'\)/],
]

let pass = 0
for (const [label, file, pattern] of checks) {
  const exists = fs.existsSync(file)
  const text = exists ? fs.readFileSync(file, 'utf8') : ''
  const ok = exists && pattern.test(text)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (ok) pass++
}
console.log(`\n${pass}/${checks.length} PASS`)
if (pass !== checks.length) process.exit(1)
console.log('Public Content static validation: PASS')
