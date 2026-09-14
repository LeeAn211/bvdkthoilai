import fs from 'node:fs'

const checks = [
  ['Specialties collection', 'src/collections/Specialties.ts', "slug: 'specialties'"],
  ['Specialties -> department', 'src/collections/Specialties.ts', "relationTo: 'departments'"],
  ['Doctors -> specialtyRef', 'src/collections/Doctors.ts', "name: 'specialtyRef'"],
  ['Doctors department scope', 'src/collections/Doctors.ts', "organizationDepartmentScopedAccess('doctors', 'edit')"],
  ['Departments own scope', 'src/collections/Departments.ts', "ownDepartmentRecordAccess('edit')"],
  ['Department normalized type', 'src/collections/Departments.ts', "name: 'unitType'"],
  ['Specialties registered', 'payload.config.ts', 'Departments, Specialties, Doctors'],
  ['Navigation specialties reference', 'src/globals/Navigation.ts', "'specialties'"],
  ['Navigation specialty preset', 'src/globals/Navigation.ts', "value: '/chuyen-khoa'"],
  ['Navigation department canonical', 'src/globals/Navigation.ts', "value: '/khoa-phong'"],
  ['Menu resolver specialties', 'src/lib/navigation.ts', "specialties: '/chuyen-khoa'"],
  ['Specialty list route', 'src/app/(frontend)/chuyen-khoa/page.tsx', "collection: 'specialties'"],
  ['Specialty detail route', 'src/app/(frontend)/chuyen-khoa/[slug]/page.tsx', "specialtyRef"],
  ['Department canonical list', 'src/app/(frontend)/khoa-phong/page.tsx', "collection: 'departments'"],
  ['Department canonical detail', 'src/app/(frontend)/khoa-phong/[slug]/page.tsx', "collection: 'specialties'"],
  ['Doctor uses specialty relationship', 'src/app/(frontend)/bac-si/page.tsx', 'specialtyRef'],
  ['Sitemap specialties', 'src/app/(frontend)/sitemap.ts', "collection: 'specialties'"],
  ['Organization validator script', 'package.json', 'validate:organization'],
]

let pass = 0
for (const [name, file, needle] of checks) {
  const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const ok = content.includes(needle)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (ok) pass++
}
console.log(`\nOrganization: ${pass}/${checks.length} PASS`)
if (pass !== checks.length) process.exit(1)
