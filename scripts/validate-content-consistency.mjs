import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const checks = []
const add = (name, ok) => checks.push({ name, ok })

const common = read('src/fields/common.ts')
add('Slug tự sinh + cảnh báo trùng dùng chung', common.includes('collectionSlug?: string') && common.includes('đã tồn tại. Vui lòng chỉnh slug'))

const specialties = read('src/collections/Specialties.ts')
add('Chuyên khoa dùng slug chuẩn dùng chung', specialties.includes("slugField('name', 'specialties')"))

for (const [file, slug] of [
  ['News.ts','news'], ['Notices.ts','notices'], ['Procurement.ts','procurement'], ['Recruitment.ts','recruitment'],
  ['Departments.ts','departments'], ['Doctors.ts','doctors'], ['Documents.ts','documents'], ['Pages.ts','pages'],
  ['Vaccines.ts','vaccines'], ['Forms.ts','forms'], ['Categories.ts','categories'],
]) {
  add(`${file} có slug tự sinh/cảnh báo trùng`, read(`src/collections/${file}`).includes(`'${slug}')`))
}

const homepage = read('src/globals/Homepage.ts')
add('Mọi section trang chủ có công tắc visible', homepage.includes("name: 'visible'") && homepage.includes('Hiển thị section trên trang chủ'))

const search = read('src/components/SearchFilter.tsx')
add('Danh sách nội dung hiển thị Ngày đăng đồng bộ', search.includes("'Ngày đăng: '"))

const footer = read('src/components/SiteFooter.tsx')
add('Footer có địa chỉ/điện thoại/email/giờ làm việc', ['Địa chỉ:', 'Điện thoại:', 'Email:', 'Thời gian làm việc:'].every(x => footer.includes(x)))

const header = read('src/components/SiteHeader.tsx')
add('Header tiện ích chỉ dùng thời gian + kênh xã hội/tìm kiếm', header.includes('<CurrentWeekdayTime') && !header.includes('utilityAddress'))

const failed = checks.filter(x => !x.ok)
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`)
if (failed.length) process.exit(1)
console.log(`\nContent consistency: ${checks.length}/${checks.length} PASS`)
