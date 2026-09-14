import fs from 'node:fs'

const checks = [
  ['Homepage no afterRead re-seed', 'src/globals/Homepage.ts', text => !text.includes('missingSections') && !text.includes('afterRead: [')],
  ['Homepage sections default only', 'src/globals/Homepage.ts', text => text.includes('defaultValue: defaultHomepageSections')],
  ['Homepage dynamic ordering', 'src/app/(frontend)/page.tsx', text => text.includes('configuredSections.map') && text.includes("if (type === 'featured-news')")],
  ['Deleted built-in block stays deleted', 'src/app/(frontend)/page.tsx', text => !text.includes('style={sectionStyle(\'featured-news\')}')],
  ['Dynamic modules collection', 'src/collections/DynamicModules.ts', text => text.includes("slug: 'dynamic-modules'")],
  ['Dynamic module homepage relationship', 'src/globals/Homepage.ts', text => text.includes("relationTo: 'dynamic-modules'")],
  ['Dynamic module frontend render', 'src/app/(frontend)/page.tsx', text => text.includes("type === 'dynamic-module'")],
  ['SEO settings global', 'src/globals/SeoSettings.ts', text => text.includes("slug: 'seo-settings'")],
  ['SEO settings registered', 'payload.config.ts', text => text.includes('SeoSettings') && text.includes('DynamicModules')],
  ['Canonical field', 'src/fields/common.ts', text => text.includes("name: 'canonicalUrl'")],
  ['Noindex field', 'src/fields/common.ts', text => text.includes("name: 'noIndex'")],
  ['Sitemap exclusion field', 'src/fields/common.ts', text => text.includes("name: 'excludeFromSitemap'")],
  ['Dynamic robots', 'src/app/(frontend)/robots.ts', text => text.includes("getGlobal('seo-settings')")],
  ['Dynamic sitemap', 'src/app/(frontend)/sitemap.ts', text => text.includes('excludeFromSitemap') && text.includes("collection: 'specialties'")],
  ['Expanded site search', 'src/app/(frontend)/tim-kiem/page.tsx', text => text.includes("collection: 'doctors'") && text.includes("collection: 'services'") && text.includes("collection: 'vaccines'")],
  ['Search noindex', 'src/app/(frontend)/tim-kiem/page.tsx', text => text.includes('robots: { index: false')],
  ['Preview enable route', 'src/app/api/preview/route.ts', text => text.includes('draft.enable()') && text.includes('PREVIEW_SECRET')],
  ['Preview exit route', 'src/app/api/exit-preview/route.ts', text => text.includes('draft.disable()')],
  ['Homepage preview-aware fetch', 'src/lib/payload.ts', text => text.includes('draftMode') && text.includes("slug: 'homepage'") && text.includes('draft: draft.isEnabled')],
  ['Global SEO metadata', 'src/app/(frontend)/layout.tsx', text => text.includes('generateMetadata') && text.includes("getGlobal('seo-settings')")],
]

let pass = 0
for (const [label, file, test] of checks) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const ok = Boolean(text) && test(text)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (ok) pass++
}
console.log(`\nHomepage / SEO / Search: ${pass}/${checks.length} PASS`)
if (pass !== checks.length) process.exit(1)
