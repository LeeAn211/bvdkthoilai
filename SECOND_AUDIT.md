# SECOND PROJECT AUDIT — Vòng 2 độc lập

**Ngày audit:** 2026-09-19  
**Phạm vi:** Kiểm chứng độc lập toàn bộ P0/P1 trong `FULL_PROJECT_AUDIT.md`, tìm false positive và lỗi vòng 1 bỏ sót  
**Chế độ:** READ-ONLY — không sửa code, không thay đổi database, không chạy migration  
**Kết luận:** **NOT READY FOR PRODUCTION**

---

## 1. Tóm tắt điều hành

Audit vòng 2 xác nhận dự án vẫn còn blocker trước production:

- **1 P0 được xác nhận ở cấp mã nguồn/cấu hình**: credential/PIN nằm trong source và các Global chứa bí mật có quyền đọc công khai qua Payload API.
- **8 P1 đang hoạt động ở cấp thiết kế/mã nguồn**: 4 nhóm đã có trong vòng 1 và 4 nhóm bị bỏ sót.
- Có một số kết luận vòng 1 đúng về rủi ro nhưng mô tả phạm vi hoặc nguyên nhân chưa chính xác. Đặc biệt, API thống kê khảo sát và GET template được frontend công khai sử dụng; lỗi thực tế là dữ liệu trả về quá rộng và quyền ghi/xóa không được bảo vệ.
- Hai mục P2 vòng 1 bị đánh giá quá cao: endpoint import cấp cứu không có call chain trong repository; migration `032` có khả năng retry tốt hơn mô tả vòng 1.

Không có code, cấu hình, schema hoặc database nào được thay đổi trong audit này. File này là artifact duy nhất được tạo.

### Tổng hợp blocker sau vòng 2

| Mức | Số nhóm | Trạng thái |
|---|---:|---|
| P0 | 1 | CONFIRMED ở source/schema; hiệu lực credential và dữ liệu DB cần kiểm tra runtime |
| P1 | 8 | CONFIRMED ở code path |
| Kết luận release | — | **NOT READY** |

---

## 2. Phương pháp và giới hạn

Đã thực hiện:

- Đọc toàn bộ `AUDIT_PROJECT.md` và `FULL_PROJECT_AUDIT.md`.
- Lập lại inventory các route handler tùy chỉnh và Payload REST catch-all.
- Truy ngược route tới collection/global access control, frontend caller và nơi ghi file.
- Kiểm tra riêng các điểm P0/P1, không dựa vào kết luận vòng 1.
- Tìm các endpoint hoặc access path có thể đi vòng qua validation/captcha/rate limit.
- Rà lại logic bảo vệ tài liệu, phân quyền module và dữ liệu cá nhân trả về cho client.

Không thực hiện:

- Không khởi động ứng dụng, không gửi request vào hệ thống đang chạy.
- Không kết nối hoặc truy vấn database.
- Không kiểm tra hiệu lực thực tế của credential.
- Không chạy migration, build hoặc lệnh có side effect.

Vì vậy, “CONFIRMED” trong báo cáo này nghĩa là đường lỗi tồn tại rõ ràng trong source và có thể được kích hoạt theo routing/access model hiện tại. Những nội dung phụ thuộc dữ liệu production hoặc trạng thái hạ tầng được ghi rõ là `NEEDS_RUNTIME_VERIFICATION`.

---

## 3. Kiểm chứng toàn bộ P0/P1 vòng 1

| ID vòng 1 | Mức | Kết quả vòng 2 | Nhận định |
|---|---|---|---|
| AUDIT-001 | P0 | **UPHELD / CONFIRMED** | Bí mật/PIN xuất hiện trong source; `site-settings` và `schedule-settings` cho phép public read, trong khi chứa trường nhạy cảm. Hiệu lực credential hiện tại và giá trị DB cần xác minh runtime. |
| AUDIT-002 | P1 | **UPHELD / CONFIRMED** | Export lịch hẹn không xác thực, dùng `overrideAccess: true`, trả dữ liệu cá nhân và triệu chứng. |
| AUDIT-003 | P1 | **UPHELD WITH CORRECTION** | Endpoint được frontend công khai gọi có chủ đích; lỗi chính là export/thống kê công khai trả dữ liệu nhận dạng, nhân khẩu học và bình luận quá rộng, không chỉ đơn giản là “thiếu auth cho dashboard admin”. |
| AUDIT-004 | P1 | **PARTIALLY UPHELD** | POST/DELETE template không xác thực và ghi filesystem: xác nhận. GET template công khai là call path có chủ đích và không tự nó tạo thành P1. |
| AUDIT-005 | P1 | **UPHELD / CONFIRMED** | OCR AI không auth, không giới hạn kích thước/MIME rõ ràng và có thể tiêu thụ tài nguyên/chi phí bên thứ ba. |

### AUDIT-001 — Source secret và Global công khai

**Evidence**

- `.env.example` chứa SMTP app password không phải placeholder. Giá trị cụ thể không được lặp lại trong báo cáo.
- `src/globals/SiteSettings.ts` cấu hình `access.read: () => true` nhưng cùng Global có nhóm SMTP password và PIN mặc định tài liệu.
- `src/globals/ScheduleSettings.ts` cho phép public read nhưng có trường `geminiApiKey`.
- `src/app/(payload)/api/[...slug]/route.ts` công bố Payload REST handlers, nên quyền read của Global là ranh giới bảo mật thực tế.

**Impact**

- Client ẩn trường không thay thế server-side field access.
- Bí mật có thể bị lộ qua Global API, serialization hoặc lịch sử version nếu Payload cho truy cập các version tương ứng.
- Credential đã từng nằm trong Git phải được xem là compromised cho tới khi được rotate và kiểm tra lịch sử.

**Qualification**

- P0 được xác nhận cho việc lưu bí mật trong source và thiết kế public-read Global.
- Chưa thể xác nhận credential còn hiệu lực hoặc DB production đang chứa giá trị nào vì audit không truy cập runtime/database.

**Recommended fix**

- Rotate credential; xóa giá trị thật khỏi template và lịch sử phân phối thích hợp.
- Di chuyển secret sang secret manager/environment.
- Chặn read ở server/field level cho mọi trường nhạy cảm; rà cả Global versions.

### AUDIT-002 — Export lịch hẹn công khai

**Evidence**

- `src/app/(frontend)/api/appointments-export/route.ts` xử lý GET không kiểm tra session/role.
- Query dùng `overrideAccess: true`, lấy số lượng lớn bản ghi.
- File export bao gồm họ tên, điện thoại, email, ngày sinh, địa chỉ và triệu chứng.

**Impact**

- Người dùng ẩn danh có thể tải dữ liệu cá nhân và dữ liệu sức khỏe.

**Recommended fix**

- Bắt buộc xác thực và module permission phù hợp trước khi query.
- Không dùng `overrideAccess` nếu không thật sự cần; thêm audit log và giới hạn khoảng thời gian/export size.

### AUDIT-003 — Export và thống kê khảo sát công khai quá mức

**Evidence**

- `PublicSurveyStatistics.tsx` công khai gọi statistics, templates và mở export; do đó đây không chỉ là endpoint admin bị quên auth.
- Export chứa tên người tham gia, thông tin nhân khẩu học, khoa/phòng, câu trả lời và bình luận.
- Statistics trả cả các bình luận gần đây từ dữ liệu khảo sát/phản ánh.

**Impact**

- Dữ liệu có thể tái nhận dạng người bệnh/người phản ánh dù dashboard được thiết kế công khai.

**Recommended fix**

- Tách endpoint public đã aggregate/anonymize khỏi endpoint export chi tiết dành cho admin.
- Loại PII, free-text và tập dữ liệu nhỏ có nguy cơ tái nhận dạng khỏi response public.
- Bảo vệ export chi tiết bằng role/module permission.

### AUDIT-004 — Ghi/xóa template khảo sát không xác thực

**Evidence**

- POST và DELETE trong `src/app/(frontend)/api/surveys/templates/route.ts` không kiểm tra auth/permission.
- `src/lib/savedSurveyTemplatesStore.ts` ghi đồng bộ vào `src/data/savedSurveyTemplates.json`.
- Frontend công khai dùng GET để đọc template; vì vậy GET không được coi là lỗi P1 nếu template vốn là nội dung public.

**Impact**

- Người ẩn danh có thể sửa hoặc xóa template.
- Ghi vào source filesystem không bền vững trên môi trường read-only/ephemeral và không nhất quán giữa replicas.

**Recommended fix**

- Giữ GET public chỉ khi dữ liệu đã được xác định là public; bắt buộc auth + permission cho POST/DELETE.
- Lưu template trong datastore/CMS có concurrency control và audit trail.

### AUDIT-005 — AI OCR công khai, không có resource controls đầy đủ

**Evidence**

- `src/app/api/ai-schedule-ocr/route.ts` không kiểm tra session/role.
- Route đọc toàn bộ file vào memory/base64 và gọi dịch vụ AI; không thấy giới hạn file size/MIME đầy đủ.
- Admin component là caller được tìm thấy, cho thấy route này không cần công khai cho người ẩn danh.

**Impact**

- Lạm dụng chi phí API, memory/CPU và quota; có thể gửi nội dung không mong muốn tới nhà cung cấp AI.

**Recommended fix**

- Yêu cầu quyền admin/module, giới hạn MIME/size, rate limit theo user và kiểm soát timeout/quota.

---

## 4. Các P1 vòng 1 bỏ sót

### SECOND-001 — Tra cứu phản ánh bằng số điện thoại làm lộ nội dung khi không có mã

**Severity:** P1 HIGH  
**Confidence:** CONFIRMED

**Evidence**

- GET trong `src/app/(frontend)/api/feedback/route.ts` chấp nhận số điện thoại; khi không có mã tra cứu, route query cả feedback và feedback cases bằng số điện thoại với `overrideAccess`.
- Response có thể trả nhiều mục gồm mã, tên, tiêu đề, toàn bộ nội dung phản ánh, phản hồi công khai, ngày và trạng thái.
- `src/components/FeedbackLookup.tsx` chủ động cung cấp luồng “quên mã” chỉ dùng số điện thoại.

**Exploit scenario**

- Kẻ tấn công biết hoặc đoán được số điện thoại của một người có thể xem lịch sử và nội dung phản ánh mà không cần OTP hay bằng chứng sở hữu số điện thoại.

**Impact**

- Lộ PII, nội dung khiếu nại/phản ánh và quan hệ với bệnh viện.

**Recommended fix**

- Không trả nội dung theo phone-only; yêu cầu mã ngẫu nhiên mạnh hoặc OTP xác minh quyền sở hữu.
- Trả response tối thiểu, không xác nhận sự tồn tại của hồ sơ ngoài luồng xác minh.
- Áp dụng rate limit chống enumeration theo nhiều chiều.

### SECOND-002 — Payload REST cho phép tạo dữ liệu khảo sát trực tiếp, đi vòng validation/Turnstile

**Severity:** P1 HIGH  
**Confidence:** CONFIRMED

**Evidence**

- Payload REST catch-all công bố POST.
- `src/collections/SurveyResponses.ts` cho phép `create: () => true`.
- `src/collections/SurveyAnswers.ts` cũng cho phép anonymous create.
- Các collection endpoint này không trùng với custom `/api/surveys/submit`, nên client có thể gọi trực tiếp `/api/survey-responses` và `/api/survey-answers`.
- Validation, rate limit và Turnstile của custom submit route không tạo ranh giới bảo vệ cho direct collection API.

**Exploit scenario**

- Người ẩn danh gửi trực tiếp Payload REST request để tạo response/answer hàng loạt hoặc gắn answer vào ID tùy chọn, bỏ qua luồng submit được kiểm soát.

**Impact**

- Ô nhiễm dữ liệu khảo sát, sai lệch thống kê, spam và phá vỡ tính toàn vẹn quan hệ response/answer.

**Recommended fix**

- Tắt anonymous create ở collection level; custom route có kiểm soát dùng server-side privileged operation sau validation.
- Thêm server hooks/invariants để không thể bỏ qua bằng bất kỳ API path nào.

### SECOND-003 — PIN tài liệu ở client và chế độ `internal` không được cưỡng chế server-side

**Severity:** P1 HIGH  
**Confidence:** CONFIRMED

**Evidence**

- `Documents` và `ClinicalProtocols` cho phép public read dù có `accessMode`, `pinCode` và file relation.
- Các trang chi tiết lấy `pinCode`, PIN mặc định và URL file rồi truyền vào client component `DocumentDetailView`.
- Client component tự so sánh PIN; PIN đúng vì thế được serialize tới browser và có thể đọc bằng devtools/network payload.
- Điều kiện `canAccessDocument` chỉ xử lý PIN và locked; không thấy cưỡng chế riêng cho `accessMode === 'internal'`.
- Media mặc định có thể là public nếu quản trị viên không chủ động đặt access level hạn chế.

**Exploit scenario**

- Người dùng lấy PIN từ client payload hoặc gọi collection API để lấy metadata/file relation, sau đó truy cập file trực tiếp. Tài liệu `internal` có thể được UI coi như truy cập được.

**Impact**

- Cơ chế PIN không tạo bảo mật thực; tài liệu nội bộ/hạn chế có nguy cơ bị truy cập công khai.

**Recommended fix**

- Thực thi authorization và PIN verification ở server, phát URL/token ngắn hạn sau xác minh.
- Không bao giờ serialize PIN/hash xác minh hoặc direct private file URL tới client trước khi cấp quyền.
- Áp access rule nhất quán cho document record, protocol record và media file.

### SECOND-004 — Quyền mặc định cho phép nhiều role không liên quan sửa Site Settings chứa trường nhạy cảm

**Severity:** P1 HIGH  
**Confidence:** CONFIRMED ở code policy

**Evidence**

- `src/access/index.ts` cấp quyền mặc định `edit` cho module `site-settings`, `homepage` và `navigation` tới hầu hết role active, gồm các role nghiệp vụ không liên quan trực tiếp đến quản trị hệ thống.
- `Users` mặc định không bật custom permissions, nên các quyền rộng này là đường thực thi mặc định.
- `SiteSettings` dùng `moduleAccess('site-settings', 'edit')` cho update nhưng chứa cả cấu hình SMTP/password và PIN tài liệu mặc định.

**Exploit scenario**

- Tài khoản role nghiệp vụ bị chiếm quyền hoặc người dùng nội bộ vượt phạm vi công việc có thể sửa nhận diện, điều hướng và cấu hình chứa secret/PIN.

**Impact**

- Privilege escalation theo chiều ngang, phá giao diện/nội dung toàn site, thay đổi cấu hình nhạy cảm và mở rộng blast radius của một tài khoản cấp thấp.

**Recommended fix**

- Áp least privilege; chỉ role quản trị hệ thống được sửa Global nhạy cảm.
- Tách secret khỏi SiteSettings và thêm field-level access.
- Bắt buộc explicit permission cho role nghiệp vụ thay vì default allow rộng.

---

## 5. False positive và điều chỉnh kết luận vòng 1

### 5.1 GET survey templates — false positive về phạm vi

GET template được `PublicSurveyStatistics` sử dụng công khai. Không có bằng chứng rằng bản thân nội dung template là bí mật. Vì vậy:

- **Không giữ P1 cho GET**.
- **Giữ P1 cho POST/DELETE** vì đây là mutation không auth.

### 5.2 Survey statistics/export — đúng rủi ro, cần sửa nguyên nhân

Vòng 1 mô tả đây chủ yếu là admin API thiếu auth. Call chain cho thấy thống kê là một tính năng public có chủ đích. Kết luận chính xác hơn:

- Public aggregate statistics có thể hợp lệ.
- Response hiện tại chứa dữ liệu chi tiết/free-text/PII quá mức.
- Export chi tiết phải tách khỏi public endpoint và được bảo vệ.

### 5.3 Emergency import — hạ từ CONFIRMED P2 xuống NEEDS_VERIFICATION/P3

Endpoint import vẫn không auth và có thể gọi nếu route được deploy, nhưng không tìm thấy caller nào trong repository. Không đủ bằng chứng để kết luận đây là luồng production đang hoạt động hoặc mang cùng mức P2 như vòng 1.

**Kết luận vòng 2:** route dư thừa/nguy hiểm cần đóng hoặc bảo vệ, nhưng mức khai thác thực tế cần runtime route verification.

### 5.4 Migration `032` — P2 vòng 1 bị đánh giá quá cao

`transactional = false` tạo rủi ro vận hành, nhưng runner chỉ ghi migration ledger sau `up` và `verify`; các thao tác được xem xét phần lớn có tính retry/idempotent. Nếu dừng giữa chừng, lần chạy sau có khả năng tiếp tục an toàn hơn mô tả vòng 1.

**Kết luận vòng 2:** không xác nhận P2 theo bằng chứng hiện có; giữ P3/operational hardening và cần thử nghiệm failure injection trên bản sao database.

### 5.5 Hiệu lực credential — giới hạn bằng chứng

Việc secret xuất hiện trong source và public-readable schema là xác nhận. Việc credential đó hiện còn hoạt động, hoặc production DB chứa đúng giá trị, **không thể kết luận trong audit read-only không truy cập runtime**.

---

## 6. Các điểm cần xác minh runtime trước release

Các mục sau không làm giảm blocker đã xác nhận:

1. Gọi thử Payload Global REST với anonymous session và kiểm tra field-level serialization thực tế.
2. Kiểm tra Global version endpoints có trả lịch sử secret/PIN không.
3. Xác định media liên kết với tài liệu protected đang có `accessLevel` nào và có URL công khai trực tiếp không.
4. Kiểm tra route precedence đối với các URL có thể giao nhau giữa custom route và Payload catch-all.
5. Kiểm tra credential đã rotate/revoke chưa mà không ghi giá trị vào log hoặc report.
6. Thử failure/retry migration trên database clone, không dùng production.

---

## 7. Thứ tự xử lý đề xuất

### Gate 1 — P0

1. Rotate toàn bộ credential đã xuất hiện trong source/history.
2. Chặn public read và field serialization cho SMTP password, Gemini/API key và PIN.
3. Rà dữ liệu version/history và artifact build/deploy có chứa secret.

### Gate 2 — P1 data exposure

1. Bảo vệ export lịch hẹn.
2. Tách public survey aggregate khỏi export/PII/free-text.
3. Sửa tra cứu phản ánh phone-only bằng cơ chế xác minh sở hữu.
4. Đưa bảo vệ tài liệu hoàn toàn về server và bảo vệ media.

### Gate 3 — P1 integrity/authorization

1. Chặn anonymous template POST/DELETE.
2. Chặn direct anonymous create cho survey collections.
3. Bảo vệ AI OCR và đặt resource limits.
4. Thu hẹp quyền mặc định của các role đối với Site Settings/navigation/homepage.

Sau khi sửa, cần audit regression độc lập cả custom API lẫn Payload REST API. Chỉ UI testing là không đủ.

---

## 8. Kết luận cuối

**Quyết định vòng 2: NOT READY FOR PRODUCTION.**

Lý do trực tiếp:

- P0 về secret/public Global chưa được loại bỏ.
- Có nhiều P1 cho phép anonymous export/lookup dữ liệu cá nhân hoặc đi vòng validation.
- Bảo vệ tài liệu bằng PIN đang nằm ở client và chế độ nội bộ không được cưỡng chế đầy đủ ở server.
- Mô hình quyền mặc định cấp quyền chỉnh sửa cấu hình quá rộng.

Một số false positive/phạm vi quá rộng của vòng 1 đã được điều chỉnh, nhưng các điều chỉnh đó không thay đổi quyết định release vì các blocker P0/P1 còn lại được xác nhận độc lập và có thêm P1 mới.
