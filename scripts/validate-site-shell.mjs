import fs from 'node:fs'
const checks = [
 ['Global SiteSettings quản lý Header & Nhận diện', 'src/globals/SiteSettings.ts', "label: 'Header & Nhận diện'"],
 ['Global Navigation', 'src/globals/Navigation.ts', "slug: 'navigation'"],
 ['Global Footer', 'src/globals/Footer.ts', "slug: 'footer'"],
 ['Global Contact', 'src/globals/ContactSettings.ts', "slug: 'contact-settings'"],
 ['Global Social tương thích dữ liệu cũ', 'src/globals/SocialSettings.ts', "slug: 'social-settings'"],
 ['Global Medpro', 'src/globals/MedproSettings.ts', "slug: 'medpro-settings'"],
 ['Global Theme', 'src/globals/ThemeSettings.ts', "slug: 'theme-settings'"],
 ['Header frontend đọc SiteSettings', 'src/components/SiteHeader.tsx', "getGlobal('site-settings')"],
 ['Header không còn phụ thuộc global header lỗi', 'src/components/SiteHeader.tsx', "getGlobal('header')"],
 ['Header frontend reads Contact global', 'src/components/SiteHeader.tsx', "getGlobal('contact-settings')"],
 ['Footer frontend reads Footer global', 'src/components/SiteFooter.tsx', "getGlobal('footer')"],
 ['Footer supports CURRENT_YEAR', 'src/components/SiteFooter.tsx', "{CURRENT_YEAR}"],
 ['Menu parent without link', 'src/globals/Navigation.ts', "value: 'parent'"],
 ['Menu hover preserved', 'src/components/SiteHeader.tsx', 'className="navDropdown"'],
]
let failed=0
for (const [name,file,text] of checks) {
  const content=fs.existsSync(file)?fs.readFileSync(file,'utf8'):''
  const ok=name.includes('không còn phụ thuộc') ? !content.includes(text) : content.includes(text)
  console.log(`${ok?'PASS':'FAIL'} - ${name}`); if(!ok) failed++
}
console.log(`\n${checks.length-failed}/${checks.length} PASS`)
if(failed) process.exit(1)
