import fs from 'node:fs'

const checks = [
  ['src/lib/managedLinks.ts', 'findOrCreatePage'],
  ['src/lib/managedLinks.ts', "collection: 'pages'"],
  ['src/globals/Navigation.ts', "value: 'auto-page'"],
  ['src/globals/Navigation.ts', 'resolveNavigationItem'],
  ['src/globals/QuickLinksSettings.ts', "value: 'existing-page'"],
  ['src/globals/QuickLinksSettings.ts', 'resolveSmartLink'],
  ['src/globals/Homepage.ts', 'smartLinkFields'],
  ['src/globals/Homepage.ts', 'buttonLinkMode'],
  ['src/globals/Homepage.ts', 'resolveHomepageLinks'],
  ['src/lib/navigation.ts', "recruitment: '/tuyen-dung'"],
]
let ok = 0
for (const [file, needle] of checks) {
  const text = fs.readFileSync(file, 'utf8')
  const pass = text.includes(needle)
  console.log(`${pass ? 'PASS' : 'FAIL'} ${file}: ${needle}`)
  if (pass) ok++
}
console.log(`Smart link validation: ${ok}/${checks.length} PASS`)
if (ok !== checks.length) process.exit(1)
