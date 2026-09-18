import fs from 'fs';
import path from 'path';

function searchDir(dir, pattern, label) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.next' || f === '.git' || f === 'db-migrations') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full, pattern, label);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      if (pattern.test(content)) {
        console.log(`[${label}] MATCH in:`, full);
      }
    }
  }
}

console.log('Searching for dummy / sample patterns in src...');
// Search for hospital names not belonging to Thoi Lai
searchDir('src', /Bạch Mai|Chợ Rẫy|Từ Dũ|Việt Đức/i, 'Wrong Hospital Name');
// Search for dummy doctor titles or names
searchDir('src', /Nguyễn Văn A|Trần Thị B|Lê Văn C/i, 'Dummy Person Names');
// Search for fake phone numbers like 0123456789 or 0909000000
searchDir('src', /0123456789|0909000000|0987654321/i, 'Dummy Phone');
// Search for fake emails like example@|test@
searchDir('src', /example\.com|test@test/i, 'Dummy Email');

console.log('Done scanning.');
