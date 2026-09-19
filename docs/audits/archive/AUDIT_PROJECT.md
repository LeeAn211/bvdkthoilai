# AUDIT_PROJECT.md
# FULL PROJECT AUDIT STANDARD
## Bệnh viện Đa khoa khu vực Thới Lai

> Mục đích: Hướng dẫn AI/Agent thực hiện kiểm tra toàn diện repository hiện tại theo chế độ **READ-ONLY AUDIT trước, sửa sau**.
>
> Dự án mục tiêu: Website Bệnh viện Đa khoa khu vực Thới Lai  
> Stack chính: Next.js + TypeScript + Payload CMS + PostgreSQL  
> Nguyên tắc ưu tiên: **Không mất dữ liệu, không phá schema, không thay đổi nghiệp vụ đang hoạt động, không kết luận khi chưa kiểm chứng.**

---

# 1. VAI TRÒ CỦA AI

Bạn đang đóng vai:

- Senior Full-Stack Engineer
- Software Auditor
- Next.js Specialist
- Payload CMS Specialist
- PostgreSQL Reviewer
- Security Reviewer
- QA Engineer
- Performance Reviewer

Nhiệm vụ là **kiểm tra toàn bộ dự án**, tìm lỗi thực tế, rủi ro tiềm ẩn, lỗi cấu hình, lỗi logic, lỗi bảo mật, lỗi dữ liệu, lỗi production và các điểm cần cải tiến.

Không được chỉ kiểm tra các file đang mở.

Phải khảo sát repository trước khi kết luận.

---

# 2. CHẾ ĐỘ LÀM VIỆC MẶC ĐỊNH

Mặc định toàn bộ quá trình audit chạy ở chế độ:

```text
AUDIT_MODE = READ_ONLY
DATABASE_MODE = READ_ONLY
AUTO_FIX = OFF
MIGRATION_EXECUTION = OFF
DEPENDENCY_MAJOR_UPGRADE = OFF
PRODUCTION_DATA_WRITE = OFF
```

AI **không được sửa code ngay khi phát hiện lỗi**.

Quy trình bắt buộc:

```text
DISCOVER
   ↓
AUDIT
   ↓
VERIFY
   ↓
REPORT
   ↓
REVIEW
   ↓
FIX (chỉ khi được cho phép)
   ↓
RETEST
```

---

# 3. QUY TẮC BẢO VỆ DỮ LIỆU TUYỆT ĐỐI

Đây là dự án có thể đang kết nối với dữ liệu thật.

## 3.1. Chỉ đọc database

Không được tự ý thực hiện các thao tác:

```sql
INSERT
UPDATE
DELETE
DROP
TRUNCATE
ALTER
CREATE DATABASE
DROP DATABASE
```

Không được:

- reset database;
- seed database;
- rollback database;
- xóa dữ liệu;
- sửa dữ liệu;
- tạo dữ liệu test trên database hiện tại;
- đồng bộ schema bằng lệnh có khả năng ghi;
- chạy migration;
- rollback migration.

## 3.2. Các lệnh bị cấm tự động

Không tự động chạy:

```bash
payload migrate
payload migrate:down
payload migrate:fresh
db push
db reset
prisma migrate
prisma db push
npm audit fix
npm audit fix --force
```

Nếu package.json có script mang tên tương tự:

```text
seed
reset
drop
migrate
rollback
sync
init-db
setup-db
cleanup
repair-db
```

phải **đọc script trước**.

Nếu có khả năng WRITE → không chạy.

## 3.3. Migration

Được phép:

- đọc file migration;
- phân tích UP/DOWN;
- tìm DROP/ALTER;
- tìm migration không đảo ngược được;
- tìm nguy cơ mất dữ liệu;
- so sánh logic migration với schema source.

Không được thực thi migration khi chưa được cho phép.

## 3.4. Payload CMS

Không tạo/sửa/xóa dữ liệu thật trong:

- Collections;
- Globals;
- Media;
- Users;
- Posts;
- Notices;
- Procurement;
- Price Lists;
- Schedules;
- Settings.

Nếu cần test CRUD, chỉ ghi vào báo cáo:

```text
REQUIRES_TEST_DATABASE
```

## 3.5. Environment

Không được tự ý thay:

```text
.env
.env.local
.env.production
DATABASE_URL
PAYLOAD_SECRET
API_KEY
TOKEN
SMTP credentials
```

Không hiển thị toàn bộ giá trị secret trong báo cáo.

Ví dụ đúng:

```text
DATABASE_URL=postgresql://***:***@***
```

---

# 4. QUY TẮC BẢO VỆ SOURCE CODE

Trước khi audit, kiểm tra:

```bash
git status
git branch --show-current
git log -1 --oneline
```

Khuyến nghị chạy audit trên branch riêng:

```bash
git checkout -b ai-full-audit
```

Nếu branch đã tồn tại thì không tạo lại.

Không được:

- force push;
- xóa branch;
- rewrite history;
- git reset --hard nếu chưa được người dùng cho phép;
- xóa hàng loạt file;
- thay đổi cấu trúc lớn trong giai đoạn audit.

---

# 5. NGUYÊN TẮC THỰC THI COMMAND

Trước mỗi command, phân loại:

```text
SAFE_READ
SAFE_BUILD
GENERATED_FILE_WRITE
SOURCE_WRITE
DATABASE_WRITE
DANGEROUS
```

Ví dụ:

```text
git status                → SAFE_READ
npm run build             → SAFE_BUILD
npx tsc --noEmit          → SAFE_READ
payload generate:types    → GENERATED_FILE_WRITE
payload migrate           → DATABASE_WRITE
npm audit fix --force     → DANGEROUS
```

Nếu command thuộc:

```text
DATABASE_WRITE
DANGEROUS
```

→ KHÔNG ĐƯỢC CHẠY.

---

# 6. PHẠM VI DỰ ÁN PHẢI KIỂM TRA

Không bỏ qua thư mục chỉ vì tên không quen thuộc.

Phải xác định và kiểm tra nếu tồn tại:

```text
src/
app/
pages/
components/
collections/
globals/
blocks/
fields/
hooks/
access/
lib/
utils/
services/
api/
routes/
middleware/
public/
scripts/
migrations/
tests/
styles/
payload.config.*
next.config.*
tsconfig.json
package.json
.env.example
Dockerfile
docker-compose.*
eslint*
postcss*
tailwind*
```

Không audit:

```text
node_modules/
.next/
dist/
build/
coverage/
.git/
```

trừ khi cần kiểm tra artifact hoặc cache lỗi.

---

# 7. GIAI ĐOẠN 1 — DISCOVERY / KHẢO SÁT REPOSITORY

Trước khi tìm lỗi, phải lập bản đồ hệ thống.

## 7.1. Đọc cấu hình

Kiểm tra:

```text
package.json
next.config.*
tsconfig.json
payload.config.*
eslint config
environment templates
Dockerfile
docker-compose
database adapter
storage adapter
email adapter
```

## 7.2. Xác định phiên bản

Ghi rõ:

- Node.js;
- npm/pnpm/yarn;
- Next.js;
- React;
- TypeScript;
- Payload CMS;
- PostgreSQL adapter;
- database package;
- image library;
- authentication packages;
- UI libraries.

## 7.3. Xác định kiến trúc

Lập danh sách:

- Collections;
- Globals;
- Blocks;
- Routes;
- APIs;
- Middleware;
- Hooks;
- Access controls;
- Admin custom components;
- Public pages;
- Client components;
- Server components;
- Scheduled/background logic nếu có.

## 7.4. Xác định luồng dữ liệu

Ít nhất phải hiểu:

```text
Browser
→ Next.js
→ Payload CMS
→ PostgreSQL
→ Response
```

và các luồng đặc biệt như:

```text
Admin → Payload → Collection
Homepage → Global/Collection → Render
Upload → Media → Storage → Database
```

---

# 8. GIAI ĐOẠN 2 — STATIC ANALYSIS

Tìm toàn repository:

```text
TODO
FIXME
HACK
XXX
debugger
console.log
console.error
@ts-ignore
@ts-expect-error
eslint-disable
any
unknown
dangerouslySetInnerHTML
eval(
new Function(
process.env
DATABASE_URL
PAYLOAD_SECRET
API_KEY
TOKEN
PASSWORD
SECRET
PRIVATE_KEY
```

Không coi mọi kết quả là lỗi.

Phải kiểm chứng context.

---

# 9. GIAI ĐOẠN 3 — TYPESCRIPT

Ưu tiên chạy:

```bash
npx tsc --noEmit
```

Nếu dự án có script riêng thì sử dụng script phù hợp.

Kiểm tra:

- compile errors;
- implicit any;
- unsafe cast;
- nullable errors;
- optional chaining thiếu;
- undefined handling;
- incorrect generic;
- Promise type;
- async return;
- React props;
- Payload generated types;
- stale generated types.

Không được sửa hàng loạt bằng cách ép:

```ts
as any
// @ts-ignore
```

chỉ để làm hết lỗi.

---

# 10. GIAI ĐOẠN 4 — ESLINT / CODE QUALITY

Nếu có lint script:

```bash
npm run lint
```

Kiểm tra:

- unused import;
- unused variable;
- dead code;
- unreachable code;
- duplicate code;
- hook dependency;
- unsafe pattern;
- inconsistent async;
- missing return;
- error swallowing.

Nếu `npm run lint` không tồn tại, ghi rõ:

```text
LINT_SCRIPT_NOT_CONFIGURED
```

Không tự thêm ESLint config trong giai đoạn audit.

---

# 11. GIAI ĐOẠN 5 — NEXT.JS AUDIT

Kiểm tra theo phiên bản Next.js thực tế của dự án.

## 11.1. App Router

Kiểm tra:

- layout;
- page;
- loading;
- error;
- not-found;
- route;
- metadata;
- sitemap;
- robots;
- dynamic routes.

## 11.2. Server / Client boundary

Tìm:

- `"use client"` không cần thiết;
- client component quá lớn;
- server-only code bị import vào client;
- process.env secret dùng trong client;
- browser API dùng trong server;
- hook React dùng trong Server Component.

## 11.3. Data fetching

Kiểm tra:

- fetch cache;
- revalidate;
- dynamic;
- force-dynamic;
- no-store;
- duplicated fetch;
- waterfalls;
- stale data;
- infinite request loops.

## 11.4. Hydration

Tìm:

- Date/Time render khác server/client;
- random values;
- browser-only state;
- DOM nesting sai;
- conditional markup gây mismatch.

## 11.5. Image

Kiểm tra:

- next/image;
- width/height;
- fill;
- sizes;
- priority;
- ảnh quá lớn;
- ảnh thiếu alt;
- domain config;
- remotePatterns.

## 11.6. Cache

Kiểm tra đặc biệt:

- custom Cache-Control;
- headers;
- caching development;
- caching production;
- static/dynamic mismatch.

## 11.7. Next config

Tìm:

- option deprecated;
- experimental option cũ;
- config không còn tác dụng;
- security header thiếu;
- output config;
- image config;
- redirect/rewrite lỗi.

---

# 12. GIAI ĐOẠN 6 — PAYLOAD CMS AUDIT

Kiểm tra toàn bộ:

```text
Collections
Globals
Fields
Blocks
Hooks
Access
Endpoints
Admin customization
Plugins
Uploads
Auth
Versions
Drafts
```

## 12.1. Collections

Với mỗi collection kiểm tra:

- slug;
- labels;
- admin.useAsTitle;
- access;
- auth;
- timestamps;
- versions;
- drafts;
- defaultSort;
- indexes;
- hooks;
- fields.

## 12.2. Fields

Tìm:

- duplicate field name;
- required không hợp lý;
- defaultValue sai;
- relationship sai collection;
- hasMany sai;
- select options trùng;
- textarea/text nhầm;
- missing validation;
- invalid min/max;
- condition logic lỗi.

## 12.3. Relationship

Kiểm tra:

- relationTo tồn tại;
- relation vòng;
- orphan references;
- populate sâu quá mức;
- N+1;
- missing access control.

## 12.4. Hooks

Kiểm tra:

```text
beforeValidate
beforeChange
afterChange
beforeRead
afterRead
beforeDelete
afterDelete
```

Tìm:

- recursion;
- update trong afterChange gây loop;
- side effect không kiểm soát;
- async không await;
- throw lỗi làm hỏng transaction;
- ghi database ngoài ý muốn.

## 12.5. Access control

Kiểm tra:

- create;
- read;
- update;
- delete;
- admin-only fields;
- user role;
- public read;
- authenticated read.

Đặc biệt tìm:

```text
() => true
```

ở nơi có dữ liệu không nên public.

## 12.6. Versions / Drafts

Kiểm tra:

- draft;
- publishedAt;
- autosave;
- version cleanup;
- access draft;
- frontend có lấy nhầm draft không.

## 12.7. Uploads / Media

Kiểm tra:

- mime type;
- extension;
- file size;
- image sizes;
- filename;
- duplicate file;
- path;
- public URL;
- delete behavior;
- orphan media.

## 12.8. Admin

Kiểm tra:

- login;
- logout;
- dashboard;
- navigation;
- role visibility;
- custom components;
- importMap.

---

# 13. GIAI ĐOẠN 7 — POSTGRESQL AUDIT

## 13.1. Schema

Kiểm tra:

- primary keys;
- foreign keys;
- indexes;
- unique constraints;
- nullable;
- enums;
- timestamps;
- cascade;
- relationship tables.

## 13.2. Migration

Với từng migration quan trọng:

- mô tả mục đích;
- thao tác UP;
- thao tác DOWN;
- reversible hay không;
- nguy cơ mất dữ liệu;
- lock table;
- migration chậm;
- duplicate migration;
- schema drift.

## 13.3. Query

Tìm:

- SELECT * không cần thiết;
- N+1;
- query trong loop;
- missing pagination;
- full table scan;
- sort không index;
- wildcard search;
- relationship depth quá cao.

## 13.4. Production safety

Tìm:

- auto migration khi startup;
- schema push tự động;
- destructive sync;
- seed production.

---

# 14. GIAI ĐOẠN 8 — SECURITY AUDIT

Kiểm tra theo thực tế source.

## 14.1. Authentication

Tìm:

- route admin không bảo vệ;
- session không xác minh;
- weak auth flow;
- token leak;
- logout không clear session;
- privilege escalation.

## 14.2. Authorization

Phải phân biệt:

```text
Authenticated
≠
Authorized
```

Kiểm tra từng CRUD endpoint.

## 14.3. Injection

Tìm:

- SQL injection;
- command injection;
- template injection;
- unsafe dynamic query.

## 14.4. XSS

Kiểm tra:

```text
dangerouslySetInnerHTML
HTML từ CMS
RichText
user input
query params
```

## 14.5. Upload security

Kiểm tra:

- executable upload;
- SVG;
- double extension;
- MIME mismatch;
- oversized file;
- malicious filename.

## 14.6. Secrets

Tìm secret hard-code.

Không ghi secret đầy đủ vào report.

## 14.7. Headers

Kiểm tra:

- CSP;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- HSTS khi production HTTPS;
- frame protection.

## 14.8. CORS

Kiểm tra:

```text
Access-Control-Allow-Origin: *
```

nếu API chứa dữ liệu cần hạn chế.

---

# 15. GIAI ĐOẠN 9 — DEPENDENCY AUDIT

Được phép chạy:

```bash
npm audit
```

Không chạy:

```bash
npm audit fix
npm audit fix --force
```

Kiểm tra:

- vulnerabilities;
- deprecated packages;
- duplicate packages;
- peer dependency;
- unsupported Node version;
- abandoned package;
- major version drift.

Không tự động nâng major version.

---

# 16. GIAI ĐOẠN 10 — BUILD AUDIT

Ưu tiên:

```bash
npm run build
```

Phải đọc toàn bộ output.

Không chỉ dựa vào exit code.

Tìm:

- warning;
- deprecated API;
- dynamic server usage;
- missing env;
- image warning;
- route generation;
- prerender error;
- type error;
- bundle warning.

Nếu build fail:

1. ghi lỗi gốc đầu tiên;
2. xác định lỗi dây chuyền;
3. không liệt kê 50 lỗi hậu quả như 50 lỗi độc lập.

---

# 17. GIAI ĐOẠN 11 — PAYLOAD GENERATED FILES

Nếu cần kiểm tra:

```bash
payload generate:types
payload generate:importmap
```

Lưu ý:

Các lệnh này có thể thay đổi file generated.

Trước khi chạy:

```bash
git status
```

Sau khi chạy:

```bash
git diff
git status
```

Phân loại:

```text
GENERATED_FILE_WRITE
```

Không commit tự động.

---

# 18. GIAI ĐOẠN 12 — RUNTIME AUDIT

Chỉ thực hiện nếu có thể chạy local an toàn.

Ví dụ:

```bash
npm run dev
```

Kiểm tra terminal:

- runtime exception;
- unhandled promise rejection;
- warning;
- database connection;
- missing env;
- email adapter warning;
- cache warning;
- importMap warning.

Không test ghi dữ liệu trên database thật.

---

# 19. GIAI ĐOẠN 13 — HTTP / PAGE AUDIT

Kiểm tra các trang chính nếu có thể.

Tối thiểu:

```text
/
news
notices
procurement
price-list
vaccination
doctor-schedule
departments
organization
contact
admin
```

Tên route thực tế phải lấy từ repository.

Kiểm tra:

- 200;
- 404;
- 500;
- redirect loop;
- broken link;
- missing asset;
- broken image;
- empty page;
- server exception.

---

# 20. GIAI ĐOẠN 14 — WEBSITE BỆNH VIỆN: BUSINESS MODULE AUDIT

Phải kiểm tra các module thực tế nếu tồn tại.

## 20.1. Trang chủ

- dữ liệu lấy từ CMS;
- không hard-code dữ liệu đáng lẽ quản lý từ Admin;
- slider;
- banner;
- tin tức;
- thông báo;
- đấu thầu;
- mua sắm;
- lịch;
- tổ chức;
- liên kết.

## 20.2. Tin tức

- thumbnail bắt buộc;
- slug;
- publishedAt;
- draft/publish;
- category;
- pagination;
- detail page;
- SEO.

## 20.3. Thông báo

- thời gian bắt đầu;
- thời gian kết thúc;
- pinned;
- level;
- expired notice;
- attachment.

## 20.4. Đấu thầu / Mua sắm

Kiểm tra:

- tách đúng module;
- file đính kèm;
- ngày đăng;
- trạng thái;
- search/filter.

## 20.5. Bảng giá

Kiểm tra:

```text
STT
Mã DV
Tên DV
Giá BHYT
Giá DV
Ghi chú
```

Tìm:

- lỗi import Excel;
- duplicate;
- number parsing;
- currency;
- pagination;
- search;
- Unicode.

## 20.6. Lịch tiêm ngừa

Kiểm tra:

- Đính kèm;
- Ngày;
- Tuần;
- trạng thái lịch;
- dữ liệu rỗng;
- responsive.

## 20.7. Lịch khám

Kiểm tra:

- theo ngày;
- theo tuần;
- bác sĩ;
- khoa;
- phòng;
- ngày nghỉ;
- lịch trống.

## 20.8. Lịch trực / Phân công

Kiểm tra:

- lãnh đạo;
- cấp cứu;
- khoa/phòng;
- thứ/ngày;
- bảng mobile;
- file đính kèm nếu có.

## 20.9. Tổ chức bệnh viện

Kiểm tra:

- khoa;
- phòng;
- chuyên khoa;
- hierarchy;
- duplicate.

## 20.10. Chatbot

Kiểm tra:

- script;
- input sanitization;
- fallback;
- link;
- dữ liệu nhạy cảm;
- spam.

## 20.11. Media

Kiểm tra:

- upload;
- reuse;
- orphan;
- delete;
- thumbnail;
- tối ưu ảnh.

---

# 21. GIAI ĐOẠN 15 — UI / UX AUDIT

Kiểm tra:

```text
Desktop
Tablet
Mobile
```

Các kích thước tham khảo:

```text
1920×1080
1366×768
1024×768
768×1024
430×932
390×844
360×800
```

Tìm:

- overflow-x;
- text bị cắt;
- button bị che;
- modal ngoài màn hình;
- dropdown sai vị trí;
- table không scroll;
- header quá cao;
- banner méo;
- logo mờ;
- spacing lệch;
- footer lỗi;
- sticky bị đè;
- z-index lỗi.

---

# 22. GIAI ĐOẠN 16 — ACCESSIBILITY

Kiểm tra:

- semantic HTML;
- heading hierarchy;
- alt;
- aria-label;
- button vs div;
- keyboard navigation;
- focus state;
- form labels;
- contrast;
- skip links nếu cần;
- screen reader basics.

---

# 23. GIAI ĐOẠN 17 — SEO

Kiểm tra:

- title;
- description;
- canonical;
- robots;
- sitemap;
- Open Graph;
- Twitter meta;
- structured data;
- duplicate title;
- missing metadata;
- noindex ngoài ý muốn.

---

# 24. GIAI ĐOẠN 18 — PERFORMANCE

Tìm:

- excessive client components;
- heavy JS;
- large dependencies;
- duplicate packages;
- image quá lớn;
- no lazy loading;
- repeated query;
- unnecessary rerender;
- deep Payload relationships;
- inefficient loops;
- no pagination;
- fetch waterfall.

Nếu có số liệu build/bundle, ghi vào report.

Không bịa số liệu nếu tool không cung cấp.

---

# 25. GIAI ĐOẠN 19 — ERROR HANDLING

Tìm:

```ts
try {
} catch {
}
```

hoặc:

```ts
catch (e) {
  console.log(e)
}
```

nhưng không xử lý.

Kiểm tra:

- API error response;
- user-friendly message;
- fallback UI;
- retry;
- timeout;
- database error;
- upload error;
- invalid form.

---

# 26. GIAI ĐOẠN 20 — EDGE CASES

Bắt buộc nghĩ đến:

```text
null
undefined
""
0
false
[]
{}
very long text
special characters
Vietnamese Unicode
emoji
invalid date
future date
expired date
duplicate slug
missing image
deleted relationship
slow database
network failure
```

---

# 27. GIAI ĐOẠN 21 — DUPLICATE / DEAD CODE

Tìm:

- file không import;
- component không dùng;
- function không gọi;
- CSS không dùng;
- package không dùng;
- copy-paste logic;
- route cũ;
- backup source file trong src;
- file `.old`, `.bak`, `copy`.

Không tự xóa.

Chỉ ghi báo cáo.

---

# 28. GIAI ĐOẠN 22 — LOGGING

Tìm:

```text
console.log
console.error
console.warn
```

Phân loại:

- development;
- production;
- debug;
- sensitive log.

Tìm dữ liệu nhạy cảm trong log:

- password;
- token;
- secret;
- database URL;
- user session.

---

# 29. GIAI ĐOẠN 23 — EMAIL

Nếu Payload cảnh báo:

```text
No email adapter provided
```

không mặc định coi là CRITICAL.

Phải xác định dự án có thực sự cần:

- reset password;
- verification email;
- contact form;
- notification;
- SMTP.

Sau đó mới đánh severity.

---

# 30. GIAI ĐOẠN 24 — DOCKER / DEPLOYMENT

Nếu dự án có Docker:

Kiểm tra:

- base image;
- Node version;
- multi-stage build;
- secret trong Dockerfile;
- ARG vs ENV;
- DATABASE_URL;
- file copy;
- standalone output;
- healthcheck;
- non-root user;
- image size.

Không build/push production image nếu chưa được cho phép.

---

# 31. GIAI ĐOẠN 25 — PRODUCTION READINESS

Kiểm tra:

- production env;
- database backup;
- migration plan;
- rollback plan;
- health check;
- logs;
- restart;
- persistent storage;
- HTTPS;
- domain;
- reverse proxy;
- rate limit;
- error page;
- backup strategy.

Phân loại riêng:

```text
PRODUCTION_BLOCKER
```

nếu lỗi có thể làm site không chạy hoặc mất dữ liệu khi deploy.

---

# 32. SEVERITY

Sử dụng duy nhất hệ thống sau.

## P0 — CRITICAL

Ví dụ:

- nguy cơ mất dữ liệu;
- database corruption;
- remote code execution;
- auth bypass;
- secret public;
- production không khởi động;
- migration phá dữ liệu.

## P1 — HIGH

Ví dụ:

- chức năng chính không hoạt động;
- quyền truy cập sai;
- dữ liệu hiển thị sai nghiêm trọng;
- API protected bị public;
- build production fail.

## P2 — MEDIUM

Ví dụ:

- chức năng lỗi trong một số trường hợp;
- validation thiếu;
- performance đáng kể;
- error handling kém.

## P3 — LOW

Ví dụ:

- warning;
- code smell nhỏ;
- UX nhỏ;
- accessibility nhỏ.

## P4 — IMPROVEMENT

Không phải bug.

Ví dụ:

- refactor;
- cleanup;
- tối ưu;
- nâng chất lượng code.

---

# 33. KHÔNG ĐƯỢC THỔI PHỒNG SEVERITY

Không được đánh P0/P1 chỉ vì:

```text
console.log
unused import
thiếu alt nhỏ
deprecated package chưa gây lỗi
```

Severity phải dựa trên:

```text
Impact × Likelihood
```

---

# 34. FALSE POSITIVE CONTROL

Mỗi lỗi trước khi thêm report phải kiểm tra:

1. Code có thực sự được dùng không?
2. Có route nào gọi tới không?
3. Có config khác override không?
4. Có type generated giải quyết không?
5. Có phải behavior có chủ đích không?
6. Có tái hiện được không?

Nếu chưa chắc:

```text
Status: NEEDS_VERIFICATION
```

Không khẳng định là bug.

---

# 35. FORMAT MỖI PHÁT HIỆN

Mỗi finding phải có:

```markdown
## AUDIT-001

Severity: P1 HIGH

Category: Payload / Security

File:
src/...

Location:
line ... / function ...

Status:
CONFIRMED

### Problem
...

### Evidence
...

### Cause
...

### Impact
...

### Reproduction
...

### Recommended Fix
...

### Risk of Fix
Low / Medium / High

### Data Risk
None / Low / Medium / High

### Requires Database Write
No

### Requires Migration
No
```

---

# 36. FILE BÁO CÁO

Tạo:

```text
FULL_PROJECT_AUDIT.md
```

Không ghi đè file này nếu người dùng yêu cầu giữ lịch sử.

Có thể sử dụng:

```text
FULL_PROJECT_AUDIT_01.md
FULL_PROJECT_AUDIT_02.md
```

---

# 37. CẤU TRÚC FULL_PROJECT_AUDIT.md

```markdown
# FULL PROJECT AUDIT

## Project
...

## Audit Date
...

## Stack
...

## Git
Branch:
Commit:

## Environment
Node:
npm:
Next:
Payload:
PostgreSQL:

## Commands Executed
...

## Commands Skipped for Safety
...

# Executive Summary

Critical:
High:
Medium:
Low:
Improvement:

# Production Blockers

...

# Findings

...

# Build Result

...

# TypeScript Result

...

# Security Result

...

# Database Result

...

# Payload Result

...

# Next.js Result

...

# UI Result

...

# Performance Result

...

# Recommendations

...

# Final Status

NOT_READY
or
READY_WITH_WARNINGS
or
READY_FOR_CONTROLLED_DEPLOYMENT
```

Không sử dụng `READY_FOR_PRODUCTION` nếu chưa thực hiện đủ production verification.

---

# 38. BẢNG TỔNG HỢP FINDINGS

Cuối báo cáo tạo bảng:

```markdown
| ID | Severity | Category | Module | File | Problem | Status |
|---|---|---|---|---|---|---|
| AUDIT-001 | P1 | Security | Admin | ... | ... | CONFIRMED |
```

---

# 39. AUDIT ROUND 2 — KIỂM TRA CHÉO

Sau audit vòng 1, thực hiện vòng 2.

Mục tiêu:

- kiểm tra từng P0/P1;
- tìm false positive;
- tìm lỗi bị bỏ sót;
- kiểm tra call chain;
- kiểm tra root cause.

Không copy kết luận vòng 1 một cách máy móc.

Phải tự đọc code lại.

---

# 40. SECOND AGENT REVIEW

Nếu sử dụng AI/Agent khác:

Agent thứ hai phải được yêu cầu:

```text
Bạn là reviewer độc lập.

Không tin hoàn toàn vào FULL_PROJECT_AUDIT.md.

Hãy coi repository này như dự án bạn chưa từng thấy.

Kiểm chứng:
- P0
- P1
- security
- database
- Payload access
- migration
- Next.js production behavior

Tạo SECOND_AUDIT.md.
```

---

# 41. QUY TẮC SỬA LỖI

Chỉ bắt đầu sửa khi người dùng cho phép.

Thứ tự:

```text
P0
↓
P1
↓
P2
↓
P3
↓
P4
```

Không sửa nhiều nhóm cùng lúc nếu chưa kiểm chứng.

---

# 42. MỖI LỖI CHỈ SỬA TỐI THIỂU CẦN THIẾT

Không:

- rewrite toàn project;
- thay framework;
- thay CMS;
- đổi database;
- refactor hàng trăm file;
- nâng major dependency ngoài yêu cầu.

Ưu tiên:

```text
Minimal
Safe
Reversible
Testable
```

---

# 43. SAU MỖI BATCH FIX

Chạy lại tối thiểu:

```bash
npx tsc --noEmit
npm run build
```

và test liên quan.

Nếu có lint:

```bash
npm run lint
```

---

# 44. KIỂM TRA REGRESSION

Sau sửa phải kiểm tra chức năng không liên quan trực tiếp nhưng có cùng dependency.

Ví dụ:

```text
Sửa Media
→ kiểm tra News
→ Notices
→ Banner
→ Departments
```

---

# 45. DATABASE TESTING SAU NÀY

Nếu cần test migration hoặc CRUD:

Không dùng DB production.

Tạo database test/clone riêng.

Ví dụ:

```text
production:
bvdk_thoilai

test:
bvdk_thoilai_test
```

Chỉ database test mới được phép:

- INSERT;
- UPDATE;
- DELETE;
- migration;
- rollback;
- seed.

---

# 46. BACKUP TRƯỚC THAY ĐỔI DATABASE

Trước mọi thao tác có khả năng ghi dữ liệu thật:

Phải có:

```text
DATABASE_BACKUP_CONFIRMED = YES
```

Nếu chưa có xác nhận:

```text
STOP_DATABASE_WRITE
```

---

# 47. STOP CONDITIONS

AI phải dừng thao tác nguy hiểm nếu gặp:

- command sẽ DROP;
- command sẽ ALTER production;
- migration destructive;
- secret exposure;
- database mismatch lớn;
- git working tree có thay đổi không rõ nguồn;
- production DB chưa backup;
- script không rõ chức năng.

Không cần dừng toàn bộ audit.

Chỉ bỏ qua thao tác nguy hiểm và tiếp tục phần read-only.

---

# 48. KHÔNG ĐƯỢC KẾT LUẬN QUÁ SỚM

Không được nói:

```text
Dự án hoàn toàn không có lỗi.
```

Chỉ được nói:

```text
Không phát hiện thêm lỗi trong phạm vi các kiểm tra đã thực hiện.
```

Phải ghi những phần chưa kiểm tra được.

---

# 49. FINAL AUDIT CHECKLIST

Trước khi kết thúc, đánh dấu:

```text
[ ] Repository mapped
[ ] package.json checked
[ ] Next config checked
[ ] Payload config checked
[ ] Collections checked
[ ] Globals checked
[ ] Hooks checked
[ ] Access control checked
[ ] TypeScript checked
[ ] Lint checked
[ ] Build checked
[ ] Dependencies checked
[ ] Security checked
[ ] Database schema reviewed
[ ] Migrations reviewed
[ ] Runtime checked
[ ] Main routes checked
[ ] UI checked
[ ] Mobile checked
[ ] Performance checked
[ ] Production readiness checked
[ ] P0/P1 reverified
[ ] False positives reviewed
[ ] FULL_PROJECT_AUDIT.md completed
```

Mục nào chưa thực hiện phải ghi nguyên nhân.

---

# 50. CÂU LỆNH KHỞI ĐỘNG AUDIT CHO AI

Khi người dùng nói:

```text
Đọc AUDIT_PROJECT.md và bắt đầu kiểm tra toàn bộ dự án.
```

AI phải:

1. đọc toàn bộ file này;
2. xác nhận audit đang ở READ-ONLY;
3. kiểm tra Git;
4. khảo sát repository;
5. đọc package.json;
6. xác định stack;
7. lập kế hoạch audit;
8. thực hiện từng phase;
9. không sửa code;
10. tạo `FULL_PROJECT_AUDIT.md`.

---

# 51. CÂU LỆNH AUDIT VÒNG 2

```text
Đọc AUDIT_PROJECT.md và FULL_PROJECT_AUDIT.md.

Thực hiện audit vòng 2 độc lập.

Kiểm chứng lại toàn bộ P0/P1.
Tìm false positive.
Tìm lỗi vòng 1 bỏ sót.
Không sửa code.

Cập nhật báo cáo hoặc tạo SECOND_AUDIT.md.
```

---

# 52. CÂU LỆNH BẮT ĐẦU SỬA

Chỉ khi người dùng ra lệnh:

```text
Bắt đầu sửa P0 theo AUDIT_PROJECT.md.
```

AI mới được sửa.

Sau đó:

```text
Bắt đầu sửa P1 theo AUDIT_PROJECT.md.
```

Không tự động chuyển sang nhóm tiếp theo nếu có rủi ro cao.

---

# 53. MỤC TIÊU CUỐI CÙNG

Mục tiêu không phải:

```text
0 warnings bằng mọi giá
```

Mục tiêu là:

```text
Không P0
Không P1 chưa xử lý
Build ổn định
TypeScript ổn định
Access control đúng
Không nguy cơ mất dữ liệu
Không lộ secret
Migration kiểm soát được
Runtime ổn định
UI chính hoạt động
Có kế hoạch rollback
Có backup database
```

---

# END OF AUDIT STANDARD

**Nguyên tắc cuối cùng:**

> Khi không chắc một thao tác có làm thay đổi dữ liệu hay không, hãy coi nó là thao tác ghi và KHÔNG chạy cho đến khi được người dùng cho phép.
