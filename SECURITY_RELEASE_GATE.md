# SECURITY RELEASE GATE

**Ngày tái kiểm chứng:** 2026-09-19  
**Cơ sở:** `FULL_PROJECT_AUDIT.md`, `SECOND_AUDIT.md`, mã nguồn hiện tại sau PR-01–PR-08  
**Phạm vi:** 1 P0 và 8 nhóm P1 đã xác nhận ở audit vòng 2  
**Quyết định hiện tại:** **HOLD — chưa phát hành production**

## 1. Kết quả tái kiểm chứng mã nguồn

| Finding | Trạng thái code | Bằng chứng kiểm soát hiện tại |
|---|---|---|
| AUDIT-001 — secret/Global public | MITIGATED IN CODE; OPERATION OPEN | SMTP/Gemini chỉ đọc environment; field credential không cho create/read/update; PIN không cho public read; migration 049/050 đã đóng gói nhưng chưa deploy. |
| AUDIT-002 — export lịch hẹn public | CLOSED IN CODE | Bắt buộc session + `appointments.export`, giới hạn ngày/5.000 dòng và audit log. |
| AUDIT-003 — survey PII/free-text public | CLOSED IN CODE | Public chỉ nhận aggregate có suppression; chi tiết/export yêu cầu quyền `surveys`. |
| AUDIT-004 — template mutation anonymous | CLOSED IN CODE | POST/DELETE yêu cầu session và quyền; GET public chỉ trả dữ liệu công khai. |
| AUDIT-005 — AI OCR public/unbounded | CLOSED IN CODE | `schedules.import`, body/file/MIME/signature limit, rate limit, timeout, output bounds và error redaction. |
| SECOND-001 — feedback phone-only | CLOSED IN CODE | Bắt buộc mã tiếp nhận + số điện thoại, response đồng nhất và rate limit nhiều chiều. |
| SECOND-002 — direct survey create | CLOSED IN CODE | `survey-responses` và `survey-answers` từ chối collection create; chỉ custom submit route dùng privileged Local API sau validation/Turnstile. |
| SECOND-003 — PIN/internal ở client | CLOSED IN CODE; MIGRATION OPEN | PIN xác minh server-side, HMAC token 5 phút, internal cần quyền, file qua proxy; hook/migration chuyển media protected sang restricted. |
| SECOND-004 — quyền Global quá rộng | CLOSED IN CODE | Site Settings không có default edit cho role nghiệp vụ; Homepage/Navigation chỉ editor/reviewer edit mặc định; ngoại lệ phải cấp explicit permission. |

Không phát hiện đường P0/P1 cũ còn mở ở mã nguồn hiện tại. Kết luận này không xác nhận trạng thái credential, dữ liệu hoặc cấu hình trên production.

## 2. Blocker bắt buộc trước production

- [ ] Revoke/rotate SMTP credential từng xuất hiện trong source/history.
- [ ] Revoke/rotate Gemini API key cũ nếu từng được sử dụng hoặc phân phối.
- [ ] Tạo và cấu hình secret production mới: `SMTP_PASS`, `GEMINI_API_KEY`, `DOCUMENT_ACCESS_SECRET` (tối thiểu 32 ký tự ngẫu nhiên) và `DOCUMENT_DEFAULT_PIN` nếu dùng PIN mặc định.
- [ ] Xác nhận `PAYLOAD_SECRET` production mạnh, riêng biệt và tối thiểu 32 ký tự.
- [ ] Rà Git history, build artifact, Railway/VPS variables và log cũ; coi mọi credential từng commit là compromised.
- [ ] Tạo backup PostgreSQL có checksum và kiểm tra khả năng đọc backup trước khi migration.
- [ ] Chạy migration 049 và 050 trên staging/production bằng `npm run db:migrate:deploy` sau khi backup được xác nhận.
- [ ] Chạy `npm run db:migrate:status` và `npm run db:migrate:verify`; yêu cầu 0 pending và verify thành công.
- [ ] Xác nhận `PAYLOAD_DB_PUSH=false` trên môi trường đích.

## 3. Smoke test bắt buộc sau deploy

- [ ] Anonymous gọi appointment export, survey export và AI OCR nhận 401.
- [ ] User đăng nhập nhưng thiếu quyền nhận 403 ở các endpoint trên.
- [ ] Anonymous POST trực tiếp Payload REST vào `survey-responses`/`survey-answers` bị từ chối.
- [ ] Public survey statistics không chứa PII, free-text hoặc nhóm nhỏ chưa suppression.
- [ ] Feedback không thể tra cứu chỉ bằng số điện thoại.
- [ ] Tài liệu `pin` không lộ PIN/direct media URL; PIN sai bị từ chối và PIN đúng mở được file qua token.
- [ ] Tài liệu `internal` từ chối anonymous/user thiếu quyền; user đúng quyền xem được.
- [ ] Tài liệu `locked` không thể lấy file; media protected không truy cập trực tiếp công khai.
- [ ] Role HR/finance/procurement/department/schedule/vaccination/quality không sửa được Site Settings, Navigation, Homepage nếu chưa có explicit permission.
- [ ] Header, footer, homepage, trang văn bản/phác đồ và Payload Admin hoạt động bình thường trên desktop/mobile.

## 4. Quality gate

- [x] `npm run validate:all` — đạt ngày 2026-09-19.
- [x] `npm run typecheck` — đạt ngày 2026-09-19.
- [x] `npm run db:schema:check` — contract hợp lệ tới migration 050.
- [x] `npm run build` — local production build đạt ngày 2026-09-19, schema contract migration 050 hợp lệ; local không cấu hình SMTP adapter.
- [ ] Chạy lại `npm run build` trong CI/staging với bộ biến môi trường production thực tế (không in secret ra log).
- [ ] Kiểm tra HTTP/browser runtime và ma trận role trên staging

## 5. Điều kiện GO

Chỉ chuyển từ **HOLD** sang **GO** khi toàn bộ blocker mục 2, smoke test mục 3 và quality gate mục 4 đều hoàn thành, có bằng chứng backup/rotation/migration và không còn credential cũ hoạt động. Không dùng việc code đã merge hoặc build thành công để thay thế các bước vận hành này.

## 6. Rủi ro còn lại không thuộc P0/P1 đã đóng

- Template khảo sát lưu bằng filesystem vẫn có rủi ro không bền vững trên môi trường ephemeral/multi-replica; mutation đã được khóa quyền nhưng nên chuyển sang CMS/database ở đợt cải tiến riêng.
- Rate limit hiện là bộ nhớ theo process; triển khai nhiều replica cần rate-limit store dùng chung nếu lưu lượng hoặc mức đe dọa tăng.
- Không thể ngăn tuyệt đối người đã được phép xem nội dung trên trình duyệt chụp màn hình hoặc ghi lại dữ liệu; overlay/UI chỉ là lớp hỗ trợ, authorization server-side mới là ranh giới bảo mật.
