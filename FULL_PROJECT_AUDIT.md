# FULL PROJECT AUDIT

## Project

Website Bệnh viện Đa khoa Khu vực Thới Lai

## Audit Date

2026-09-19 (Asia/Saigon)

## Audit Mode

- `AUDIT_MODE = READ_ONLY`
- `DATABASE_MODE = READ_ONLY`
- `AUTO_FIX = OFF`
- `MIGRATION_EXECUTION = OFF`
- Không sửa code, không thay đổi database, không chạy migration.
- File duy nhất được tạo là báo cáo này theo yêu cầu.

## Stack

- Next.js 16.3.5, App Router
- React / React DOM 19.2.8
- TypeScript 5.9.3
- Payload CMS 3.89.0
- `@payloadcms/db-postgres` 3.89.0, `pg` 8.20.0
- PostgreSQL 16 trong Docker Compose
- Node.js 24.20.0; npm 11.19.0
- ExcelJS 4.4.0, Sharp 0.35.4, Nodemailer 10.0.10

## Git

- Branch: `main`
- Commit: `f32a8e0 feat: bao mat PDF overlay, thiet ke lai trang van-ban/phac-do, breadcrumb lich-kham, sua nhan muc do thong bao, tat scroll-snap mobile, fix experts carousel mobile`
- Working tree trước audit: sạch
- Working tree trước khi tạo báo cáo: sạch

## Repository Map

- 50 file collection, 34 file global.
- 59 page routes, 22 route handlers.
- 48 migration có thứ tự từ `20260914_001` đến `20260919_048`.
- Luồng chính: Browser → Next.js App Router / Payload REST → Payload CMS → PostgreSQL; media dùng local disk hoặc R2.
- Có Docker, Nginx, Railway/Neon deployment guides, migration runner, backup/restore scripts và health endpoint.

## Commands Executed

- Git: `git status --short`, `git branch --show-current`, `git log -1 --oneline`, diff/stat và tracked-file inspection.
- Repository mapping bằng `rg --files`, `rg`, PowerShell read-only inspection.
- `node --version`, `npm --version`, `npm ls --depth=0`.
- `npx tsc --noEmit --incremental false`.
- `npm audit --omit=dev`.
- Các validator tĩnh: config, foundation, site shell, public content, patient services, organization, homepage/SEO/search, chatbot/forms/feedback, quality surveys, migrations, schema contract, system hardening, UAT, production security, content consistency, smart links, import map.
- Kiểm tra cổng local 3000–3010; không có server đang lắng nghe.
- Đọc hướng dẫn Next.js 16 đi kèm package cho Route Handlers và deployment.

## Commands Skipped for Safety

- `npm run build`: không chạy vì `prebuild` gọi ba generator Payload và ghi generated files; `next build` cũng ghi `.next`.
- `npm run dev`: không chạy vì `predev` ghi import map và generated types; runtime có thể kết nối database thật.
- `payload generate:*`: có ghi file.
- `db:migrate:*`, migrate, seed, repair, import, restore: có thể đọc/ghi database; không chạy.
- HTTP/page/browser/mobile test: không có server local đang chạy; không tự khởi động vì yêu cầu read-only.
- CRUD/upload tests: cần database test riêng.

# Executive Summary

- Critical (P0): 1
- High (P1): 4
- Medium (P2): 4
- Low (P3): 3
- Improvement (P4): 1

Dự án **NOT_READY** cho triển khai có kiểm soát tại thời điểm audit. Nguyên nhân chính là secret thật được hard-code và có thể đọc công khai qua Payload Global API, cùng nhiều endpoint xuất dữ liệu nhạy cảm hoặc thay đổi dữ liệu không xác thực. TypeScript và dependency audit đạt, nhưng production build/runtime chưa được phép xác minh trong chế độ read-only.

# Production Blockers

1. Thu hồi/rotate ngay SMTP app password đã commit; xem cả lịch sử Git và hệ thống triển khai.
2. Không cho phép public read đối với SMTP password, PIN tài liệu và Gemini API key; secret phải chuyển sang environment/secret manager và field-level access phải chặn response.
3. Bảo vệ endpoint xuất lịch hẹn, xuất/thống kê khảo sát và quản lý survey template bằng authentication + authorization.
4. Bảo vệ endpoint AI OCR để tránh sử dụng trái phép quota/API key.
5. Sau khi sửa, phải chạy build/runtime/HTTP test trong môi trường staging với database clone và secret đã rotate.

# Findings

## AUDIT-001

Severity: P0 CRITICAL

Category: Security / Secrets / Payload Global

File:
`.env.example`; `src/globals/SiteSettings.ts`; `src/globals/ScheduleSettings.ts`; `src/app/(payload)/api/[...slug]/route.ts`

Location:
`.env.example:32`; `SiteSettings.ts:145, 1801-1889`; `ScheduleSettings.ts:8, 223-229`; Payload REST route lines 11-15

Status:
CONFIRMED

### Problem

Một SMTP app password có hình thức secret thật được commit trong `.env.example` và làm `defaultValue` trong schema. `site-settings` cho phép public read và còn chứa SMTP password cùng PIN tài liệu mặc định. `schedule-settings` cũng public read và chứa Gemini API key. Không có field-level read access để loại các trường này khỏi response.

### Evidence

- Secret dài 16 ký tự, không phải placeholder; `git log -S` xác nhận giá trị xuất hiện trong lịch sử Git.
- `SiteSettings.access.read` và `ScheduleSettings.access.read` đều trả `true`.
- Payload REST catch-all đăng ký `REST_GET`, do đó Global API tuân theo public read.
- SMTP password và PIN được đặt trực tiếp làm default; Gemini key là field text thường.

### Cause

Trộn cấu hình công khai và secret vào cùng Global, thiếu field-level access, đồng thời đưa credential thật vào source/template.

### Impact

Chiếm dụng tài khoản SMTP, gửi thư giả mạo/spam, lộ mã truy cập tài liệu nội bộ, lộ hoặc tiêu thụ Gemini quota. Secret trong lịch sử Git vẫn còn nguy hiểm ngay cả khi chỉ sửa file hiện tại.

### Reproduction

Đọc source và gọi Payload Global REST GET khi ứng dụng chạy; không cần đăng nhập theo access hiện tại. Runtime HTTP chưa được gọi trong audit để tránh khởi động hệ thống.

### Recommended Fix

Rotate credential ngay; xóa secret khỏi source/default và purge lịch sử nếu repository từng được chia sẻ. Chuyển secret sang environment/secret manager. Tách public settings và private settings hoặc đặt field access `read` chỉ cho quản trị phù hợp; không trả secret về client/Admin list. Thay PIN mặc định đã lộ.

### Risk of Fix
Medium

### Data Risk
High

### Requires Database Write
Yes — nếu database đã lưu default/credential cũ

### Requires Migration
Needs verification; schema có thể giữ field nhưng dữ liệu cần rotate/cleanup có kiểm soát

## AUDIT-002

Severity: P1 HIGH

Category: Security / Authorization / Personal Data

File:
`src/app/(frontend)/api/appointments-export/route.ts`

Location:
lines 41-62, 157-190, 260

Status:
CONFIRMED

### Problem

GET export lịch hẹn không xác thực hoặc kiểm tra quyền, nhưng dùng `overrideAccess: true`, tải tối đa 10.000 hồ sơ và xuất họ tên, điện thoại, email, ngày sinh, địa chỉ, triệu chứng.

### Evidence

Handler đi thẳng từ `GET` sang `payload.find`; không có `payload.auth`/`hasModulePermission`. Các cột dữ liệu cá nhân được ghi vào XLSX.

### Cause

Endpoint dành cho Admin được đặt trong public route tree mà thiếu authorization guard.

### Impact

Người không đăng nhập có thể tải dữ liệu cá nhân/sức khỏe của người đặt lịch.

### Reproduction

GET `/api/appointments-export` trên một deployment có dữ liệu.

### Recommended Fix

Xác thực Payload session và yêu cầu quyền `appointments.export` trước mọi query; bỏ `overrideAccess` nếu không cần; audit log thao tác export và giới hạn/filter hợp lý.

### Risk of Fix
Low

### Data Risk
High

### Requires Database Write
No

### Requires Migration
No

## AUDIT-003

Severity: P1 HIGH

Category: Security / Authorization / Survey Data

File:
`src/app/(frontend)/api/surveys/export/route.ts`; `src/app/(frontend)/api/surveys/statistics/route.ts`

Location:
export lines 10, 58-62, 149-201, 209-328, 429-441; statistics lines 4, 43-59, 119-134, 249-322

Status:
CONFIRMED

### Problem

Hai GET endpoint không xác thực nhưng vượt access control để đọc survey responses và feedback cases. Export chứa tên người tham gia, thông tin nhân khẩu, khoa/phòng, câu trả lời và ý kiến; statistics trả phản hồi gần đây và nội dung comment.

### Evidence

Không có auth/permission guard; nhiều query có `overrideAccess: true`; response/XLSX chứa nội dung phản hồi thực.

### Cause

API phục vụ dashboard Admin không được tách khỏi public survey APIs.

### Impact

Rò rỉ ý kiến người bệnh, thông tin khảo sát và dữ liệu vận hành chất lượng bệnh viện.

### Reproduction

GET `/api/surveys/export?...` hoặc `/api/surveys/statistics?...` mà không có session.

### Recommended Fix

Bắt buộc session và quyền `surveys.export`/`surveys.view`; chỉ cung cấp một endpoint public aggregate đã loại comment/identifier nếu nghiệp vụ cần công khai.

### Risk of Fix
Low

### Data Risk
High

### Requires Database Write
No

### Requires Migration
No

## AUDIT-004

Severity: P1 HIGH

Category: Security / Authorization / Data Integrity

File:
`src/app/(frontend)/api/surveys/templates/route.ts`; `src/lib/savedSurveyTemplatesStore.ts`

Location:
route lines 10-175; store lines 19-25, 43-70

Status:
CONFIRMED

### Problem

GET/POST/DELETE quản lý survey template không xác thực. POST và DELETE ghi đồng bộ trực tiếp vào `src/data/savedSurveyTemplates.json`.

### Evidence

Không có auth guard; `saveSurveyTemplate` và `deleteSavedSurveyTemplate` gọi `fs.writeFileSync`. GET còn đọc campaign bằng `overrideAccess: true`.

### Cause

Lưu dữ liệu vận hành vào source filesystem và thiếu authorization.

### Impact

Bất kỳ người dùng Internet nào cũng có thể thêm/xóa template; có nguy cơ làm đầy disk, race condition/mất cập nhật, không hoạt động trên filesystem read-only/ephemeral và không đồng bộ giữa nhiều replica.

### Reproduction

POST JSON hoặc DELETE `/api/surveys/templates?id=...` không cần session.

### Recommended Fix

Đưa template vào Payload collection có access control; yêu cầu quyền `surveys.create/edit/delete`; thêm validation/limit và tránh synchronous source writes.

### Risk of Fix
Medium

### Data Risk
Medium

### Requires Database Write
Yes — khi chuyển dữ liệu hiện có vào collection

### Requires Migration
Yes

## AUDIT-005

Severity: P1 HIGH

Category: Security / External API Abuse / Resource Exhaustion

File:
`src/app/api/ai-schedule-ocr/route.ts`

Location:
lines 5-35, 125-154

Status:
CONFIRMED

### Problem

AI OCR POST không xác thực, không rate limit, không giới hạn kích thước/MIME; dùng server Gemini key hoặc key từ public-readable Global và gửi file lên API bên thứ ba.

### Evidence

Handler đọc toàn bộ `File` vào buffer/base64 và thử tuần tự bốn model. Không có auth, permission, content-length/file-size hoặc MIME allowlist.

### Cause

Chức năng Admin được công bố như API công khai.

### Impact

Lạm dụng quota/chi phí, memory pressure/DoS và gửi dữ liệu tùy ý tới dịch vụ ngoài.

### Reproduction

POST multipart tới `/api/ai-schedule-ocr` không có session.

### Recommended Fix

Yêu cầu quyền lịch/import, giới hạn kích thước và MIME thực, rate limit phân tán, timeout/abort cho fetch, chỉ dùng secret phía server và không nhận API key từ client trừ khi có yêu cầu nghiệp vụ rõ ràng.

### Risk of Fix
Low

### Data Risk
Medium

### Requires Database Write
No

### Requires Migration
No

## AUDIT-006

Severity: P2 MEDIUM

Category: Security / TLS

File:
`payload.config.ts`

Location:
Nodemailer transport, `tls.rejectUnauthorized: false`

Status:
CONFIRMED

### Problem

SMTP TLS certificate verification bị tắt trên mọi môi trường.

### Evidence

Transport cấu hình trực tiếp `rejectUnauthorized: false`.

### Cause

Workaround kết nối được áp dụng toàn cục thay vì cài CA/cấu hình TLS đúng.

### Impact

Tăng rủi ro man-in-the-middle và lộ SMTP credential/nội dung email.

### Reproduction

Khởi tạo SMTP adapter khi có đủ SMTP env.

### Recommended Fix

Bật xác minh chứng chỉ trong production; chỉ cho phép ngoại lệ development có điều kiện và tài liệu hóa.

### Risk of Fix
Medium

### Data Risk
Medium

### Requires Database Write
No

### Requires Migration
No

## AUDIT-007

Severity: P2 MEDIUM

Category: Security / Availability

File:
`src/app/(frontend)/api/emergency-import/route.ts`

Location:
lines 6-25

Status:
CONFIRMED

### Problem

Endpoint parse Excel 20 MB không xác thực/rate-limit. Đây là tác vụ CPU/memory đáng kể và chỉ kiểm tra extension/size khai báo từ File.

### Evidence

POST công khai tải workbook vào memory rồi parse bằng ExcelJS; không có auth signal.

### Cause

Tiện ích Admin được triển khai trên public API namespace.

### Impact

Có thể bị dùng để gây tải cao hoặc khai thác parser; không trực tiếp ghi database.

### Reproduction

Gửi lặp multipart `.xlsx` tới `/api/emergency-import`.

### Recommended Fix

Yêu cầu quyền import lịch, rate limit, xác minh ZIP/XLSX signature và đặt timeout/concurrency limit.

### Risk of Fix
Low

### Data Risk
Low

### Requires Database Write
No

### Requires Migration
No

## AUDIT-008

Severity: P2 MEDIUM

Category: Database / Migration Safety

File:
`scripts/db-migrations/20260918_032_fix_patient_care_globals_cascade_fk_and_columns.mjs`; `scripts/validate-db-migrations.mjs`

Location:
migration 032 lines 3-121

Status:
CONFIRMED

### Problem

Migration 032 đặt `transactional = false` nhưng thực hiện chuỗi DROP/ADD constraint, ALTER nullable và UPDATE backfill. Nếu lỗi giữa chừng, schema/data có thể ở trạng thái áp dụng một phần. Validator cũng báo FAIL vì heuristic coi DROP constraint/DROP NOT NULL là SQL phá dữ liệu.

### Evidence

Kết quả validator: 219/221 PASS; migration 020 và 032 bị flag. Migration 020 chỉ DROP NOT NULL nên là false positive của validator; migration 032 thực sự có chuỗi DDL/DML không transaction.

### Cause

Tắt transaction cho migration nhiều bước mà không có resume/compensation chi tiết.

### Impact

Deploy có thể dừng với schema trung gian; migration startup tiếp theo cần xử lý trạng thái đó an toàn.

### Reproduction

Review source; không chạy migration theo yêu cầu.

### Recommended Fix

Xác minh lý do bắt buộc non-transactional. Nếu không bắt buộc, dùng transaction; nếu bắt buộc, chia migration idempotent nhỏ hơn, verify từng bước và có runbook rollback/restore. Cải tiến validator để phân biệt DROP constraint/NOT NULL với DROP data-bearing object.

### Risk of Fix
High

### Data Risk
Medium

### Requires Database Write
Yes, chỉ khi remediate/test trên DB clone

### Requires Migration
Possibly

## AUDIT-009

Severity: P2 MEDIUM

Category: Security / Rate Limiting

File:
`src/lib/request-security.ts`

Location:
lines 1-28

Status:
CONFIRMED

### Problem

Rate limiter là `Map` trong memory từng process; không chia sẻ giữa replicas và reset khi restart. `bodyIsTooLarge` chỉ dựa vào `Content-Length`, nên chunked/missing header vượt qua bước precheck.

### Evidence

Bucket module-global và client IP lấy từ proxy headers; body limit trả false khi header vắng/0.

### Cause

Biện pháp bảo vệ mức ứng dụng tối giản được dùng như control chính.

### Impact

Giới hạn có thể bị bypass trên multi-instance/restart và request body có thể tiêu thụ memory trước khi validation hậu kỳ.

### Reproduction

Gửi request qua nhiều replica hoặc không có `Content-Length`.

### Recommended Fix

Dùng limiter chia sẻ (Redis/provider/gateway), giới hạn body tại Nginx/platform và vẫn kiểm tra kích thước thực sau parse/stream.

### Risk of Fix
Medium

### Data Risk
Low

### Requires Database Write
No

### Requires Migration
No

## AUDIT-010

Severity: P3 LOW

Category: Code Quality / Tooling

File:
`package.json`

Location:
scripts

Status:
CONFIRMED

### Problem

Không có lint script hoặc ESLint dependency/config rõ ràng (`LINT_SCRIPT_NOT_CONFIGURED`).

### Evidence

`package.json` có typecheck và nhiều validator nhưng không có `lint`.

### Cause

Quality gate dựa chủ yếu vào TypeScript và string-based validators.

### Impact

Hook dependency, accessibility lint và nhiều code smell không được kiểm tra tự động.

### Reproduction

Đọc scripts/dependencies.

### Recommended Fix

Bổ sung lint phù hợp Next 16 và CI sau khi audit/fix được cho phép.

### Risk of Fix
Low

### Data Risk
None

### Requires Database Write
No

### Requires Migration
No

## AUDIT-011

Severity: P3 LOW

Category: Regression / Static Validators

File:
`scripts/validate-site-shell.mjs`; `scripts/validate-content-consistency.mjs`; các file mà validator tham chiếu

Location:
validator outputs

Status:
NEEDS_VERIFICATION

### Problem

Site shell đạt 12/14: fail quản lý Header & Nhận diện và menu hover. Content consistency fail hiển thị ngày đăng đồng bộ và Footer đủ địa chỉ/điện thoại/email/giờ làm việc.

### Evidence

Output trực tiếp từ validator tĩnh trong audit.

### Cause

Có thể là regression thực hoặc validator string-based đã cũ sau refactor.

### Impact

Rủi ro UI/navigation/content consistency thấp đến trung bình; chưa thể xác nhận không có browser/runtime.

### Reproduction

Chạy hai validator tương ứng.

### Recommended Fix

Đối chiếu từng assertion với UI runtime và cập nhật code hoặc validator; không sửa mù theo string match.

### Risk of Fix
Low

### Data Risk
None

### Requires Database Write
No

### Requires Migration
No

## AUDIT-012

Severity: P3 LOW

Category: Deployment / Reproducibility

File:
`Dockerfile`

Location:
deps and runner stages

Status:
CONFIRMED

### Problem

Deps stage chỉ copy `package.json` và chạy `npm install`, không copy lockfile/không dùng `npm ci`. Runner copy toàn bộ `/app` từ builder thay vì standalone/minimal runtime.

### Evidence

Dockerfile lines tương ứng; Next 16 bundled docs khuyến nghị standalone image cho production Docker tối giản.

### Cause

Docker build ưu tiên đơn giản thay vì reproducibility và image minimization.

### Impact

Dependency tree có thể thay đổi giữa builds do caret ranges; image lớn và chứa source/build tooling không cần thiết.

### Reproduction

Review Dockerfile; không build image.

### Recommended Fix

Copy `package-lock.json`, dùng `npm ci`, cân nhắc `output: 'standalone'` và chỉ copy runtime artifacts/migrations cần thiết.

### Risk of Fix
Medium

### Data Risk
None

### Requires Database Write
No

### Requires Migration
No

## AUDIT-013

Severity: P4 IMPROVEMENT

Category: Performance / Images

File:
Nhiều component/page frontend

Location:
Khoảng 50+ vị trí `<img>` được static scan phát hiện

Status:
NEEDS_VERIFICATION

### Problem

Phần lớn ảnh dùng `<img>` thay vì `next/image`. Một số ảnh có lazy loading/size CSS, nhưng chưa có build/browser metrics để kết luận mức ảnh hưởng.

### Evidence

Static scan phát hiện nhiều ảnh ở homepage, carousel, detail pages, header/footer và RichText.

### Cause

Media động từ Payload và thiết kế hiện tại ưu tiên URL trực tiếp.

### Impact

Có thể bỏ lỡ tối ưu responsive image, kích thước tải và chống layout shift.

### Reproduction

Static scan; cần Lighthouse/network test để định lượng.

### Recommended Fix

Ưu tiên chuyển ảnh hero/card/doctor quan trọng sang `next/image` với `sizes`; giữ `<img>` nơi blob/data/export hoặc yêu cầu đặc biệt. Đo trước và sau.

### Risk of Fix
Medium

### Data Risk
None

### Requires Database Write
No

### Requires Migration
No

# Build Result

**SKIPPED_FOR_SAFETY.** `npm run build` kích hoạt `prebuild` và ghi `payload-types.ts`, import map, generated DB schema và `.next`. Không thể xác nhận production build trong audit read-only. Đây là một khoảng trống bắt buộc phải đóng trên staging/CI trước deploy.

# TypeScript Result

**PASS.** `npx tsc --noEmit --incremental false` hoàn tất với exit code 0, không ghi incremental cache.

# Lint Result

**NOT_CONFIGURED.** Không có script lint.

# Dependency Result

- `npm ls --depth=0`: dependency tree hợp lệ.
- `npm audit --omit=dev`: 0 vulnerability tại thời điểm audit.
- Không chạy audit fix hoặc nâng version.

# Security Result

**FAIL.** Một P0 secret exposure và bốn P1 authorization/API-abuse findings. Security headers tương đối đầy đủ: CSP, nosniff, referrer policy, permissions policy, frame protection và production HSTS; GraphQL tắt. Tuy nhiên các header không bù được access-control failures.

# Database Result

- Không kết nối hoặc truy vấn database thật.
- Schema contract trỏ đúng migration 048 và validator contract PASS.
- Migration validator đạt 219/221; migration 020 bị heuristic flag do `DROP NOT NULL` (false positive), migration 032 cần review vì non-transactional multi-step DDL/DML.
- Startup tự chạy migration qua `prestart`; có advisory lock/checksum/timeout, nhưng production vẫn cần backup, rollback/restore runbook và staging verification.
- Trạng thái applied/pending thực tế: chưa xác minh vì không chạy status/query database.

# Payload Result

- Cấu hình đăng ký đầy đủ collections/globals; access module/department nhìn chung có cấu trúc tốt.
- Media có MIME allowlist, size policy, hash, duplicate detection, access level và security response headers.
- Lỗi nghiêm trọng nằm ở public-readable Globals chứa secret và custom route handlers dùng `overrideAccess` không có guard.
- Generated import map tồn tại và validator PASS; không regenerate trong read-only audit.

# Next.js Result

- App Router, robots, sitemap, metadata, security headers và preview secret route hiện diện.
- 22 route handlers đã được rà auth signals; public submission endpoints được phân biệt với endpoint Admin. Các finding chỉ ghi khi call chain xác nhận dữ liệu/quota nhạy cảm.
- Không phát hiện `dangerouslySetInnerHTML`, `eval` hay `new Function` trong source scan đã thực hiện.
- Production behavior chưa được build/runtime verify.

# UI / Accessibility Result

- Chỉ kiểm tra tĩnh; chưa có screenshot/browser ở 7 viewport chuẩn do không có server local.
- Alt text nhìn chung hiện diện ở các `<img>` được rà; icon trang trí thường dùng `alt=""` hợp lý.
- 37/58 page files tham chiếu `PageHero`; con số còn lại gồm detail/dynamic pages nên không tự động kết luận vi phạm.
- Không thể xác nhận overflow, focus order, contrast, keyboard navigation, z-index hoặc responsive behavior.

# SEO Result

- Validator homepage/SEO/search: 20/20 PASS.
- Có dynamic robots/sitemap, canonical/noindex fields và metadata global.
- Không có runtime crawl để tìm duplicate/missing metadata theo dữ liệu thật.

# Performance Result

- Không có bundle/build metrics nên không bịa số liệu.
- 54 client component markers và nhiều `<img>` cần đo runtime trước khi tối ưu.
- Một số query có limit lớn (export 10.000) là hợp lý cho export nhưng cần auth, streaming/pagination hoặc job queue khi dữ liệu tăng.
- In-memory rate limiter không phù hợp multi-instance.

# Error Handling Result

- Nhiều route có fallback thân thiện; homepage đã cô lập lỗi query riêng.
- Có nhiều catch rỗng/ghi console và endpoint trả `error.message`; cần rà tránh lộ chi tiết provider/parser sau khi khóa các P1.
- `services-import` bắt lỗi theo từng dòng nhưng có thể tạo dữ liệu một phần; đây là hành vi cần transaction/job semantics nếu nghiệp vụ yêu cầu all-or-nothing.

# Audit Round 2

- Đã đọc lại độc lập evidence của toàn bộ P0/P1.
- Xác nhận public access của Globals nối tới Payload REST catch-all.
- Xác nhận appointment export thực sự chứa PII và không có auth.
- Xác nhận survey export/statistics đọc collection nhạy cảm bằng `overrideAccess`.
- Xác nhận survey template POST/DELETE ghi file và không auth.
- Xác nhận AI OCR không auth/rate limit/file limits và dùng server-side key.
- Loại khỏi P1 các public submission endpoints (appointments, feedback, forms, surveys) vì việc cho phép submit là chủ đích; các endpoint này chỉ được ghi nhận trong phần rate-limit/body-limit chung khi có bằng chứng.
- Migration 020 được hạ thành false positive của heuristic; không báo như lỗi độc lập.

# Recommendations

1. Incident response: rotate SMTP/Gemini/PIN, rà access logs, deployment secrets và lịch sử Git.
2. Sửa P1 theo nhóm nhỏ: export endpoints → survey template → AI/import; mỗi nhóm có auth/permission tests.
3. Tạo staging DB clone, backup xác nhận, rồi kiểm thử migration/status/verify và production build.
4. Chạy HTTP/browser regression ở desktop/tablet/mobile, gồm Admin role matrix và kiểm tra endpoint anonymous phải trả 401/403.
5. Bổ sung automated authorization tests cho mọi route dùng `overrideAccess: true`.
6. Bổ sung lint và dependency/build gates có artifact isolation trong CI.

# Final Audit Checklist

- [x] Repository mapped
- [x] package.json checked
- [x] Next config checked
- [x] Payload config checked
- [x] Collections checked (static/access-focused)
- [x] Globals checked (static/access-focused)
- [x] Hooks checked (targeted static review)
- [x] Access control checked
- [x] TypeScript checked
- [ ] Lint checked — script không được cấu hình
- [ ] Build checked — bị bỏ qua vì prebuild/build ghi generated files và `.next`
- [x] Dependencies checked
- [x] Security checked
- [x] Database schema reviewed (source/contract only)
- [x] Migrations reviewed (static; không execute)
- [ ] Runtime checked — không có server; không khởi động do predev ghi file/DB uncertainty
- [ ] Main routes checked — không có server local
- [ ] UI checked — cần browser runtime
- [ ] Mobile checked — cần browser runtime
- [x] Performance checked (static only)
- [x] Production readiness checked
- [x] P0/P1 reverified
- [x] False positives reviewed
- [x] FULL_PROJECT_AUDIT.md completed

# Findings Summary

| ID | Severity | Category | Module | File | Problem | Status |
|---|---|---|---|---|---|---|
| AUDIT-001 | P0 | Secrets / Access | Payload Globals | `.env.example`, Site/Schedule settings | Secret hard-code và public-readable | CONFIRMED |
| AUDIT-002 | P1 | Authorization / PII | Appointments | appointments export route | Xuất dữ liệu người bệnh không auth | CONFIRMED |
| AUDIT-003 | P1 | Authorization / Privacy | Surveys | survey export/statistics routes | Đọc phản hồi nhạy cảm không auth | CONFIRMED |
| AUDIT-004 | P1 | Authorization / Integrity | Surveys | templates route/store | Ghi/xóa template source file không auth | CONFIRMED |
| AUDIT-005 | P1 | API abuse / DoS | Schedule OCR | AI OCR route | Dùng Gemini quota công khai, không limits | CONFIRMED |
| AUDIT-006 | P2 | TLS | Email | payload config | Tắt certificate verification | CONFIRMED |
| AUDIT-007 | P2 | Availability | Schedule import | emergency import route | Parser 20 MB công khai | CONFIRMED |
| AUDIT-008 | P2 | Migration safety | Database | migration 032 | Non-transactional multi-step DDL/DML | CONFIRMED |
| AUDIT-009 | P2 | Rate limiting | Public APIs | request-security | Limiter per-process, body precheck bypassable | CONFIRMED |
| AUDIT-010 | P3 | Tooling | Project | package.json | Không có lint | CONFIRMED |
| AUDIT-011 | P3 | Regression | UI/content | validators | 4 static checks fail | NEEDS_VERIFICATION |
| AUDIT-012 | P3 | Deployment | Docker | Dockerfile | Install không lock/runner quá lớn | CONFIRMED |
| AUDIT-013 | P4 | Performance | Frontend images | multiple | Nhiều `<img>`, cần đo để tối ưu | NEEDS_VERIFICATION |

# Final Status

**NOT_READY**

Không phát hiện thêm lỗi trong phạm vi các kiểm tra đã thực hiện. Kết luận này không bao gồm production build, runtime, database state, CRUD, HTTP routes hoặc browser/mobile verification vì các phần đó bị giới hạn bởi yêu cầu read-only và không có server staging đang chạy.
