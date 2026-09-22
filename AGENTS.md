<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BVDK THỚI LAI — CORE AGENT RULES

## 1. Project identity
- Website: **Bệnh viện Đa khoa Khu vực Thới Lai**.
- Không đưa tên bệnh viện/đơn vị khác vào nội dung thật, label, placeholder hoặc dữ liệu mẫu.
- Không thay đổi ngoài phạm vi yêu cầu hiện tại.

## 2. Context loading — LOW TOKEN
Khi bắt đầu task:
1. Đọc `CURRENT-TASK.md`.
2. Đọc file trực tiếp cần sửa.
3. Chỉ đọc dependency trực tiếp khi cần.
4. Chỉ đọc tài liệu `docs/ai/` đúng loại task.

Không mặc định đọc:
- `CHANGELOG.md`
- `DECISIONS.md`
- `HANDOFF.md`
- `docs/audits/archive/`
- toàn bộ repository

Chỉ đọc `HANDOFF.md` khi tiếp tục task từ agent/phiên khác.
Chỉ đọc `DECISIONS.md` khi task có khả năng thay đổi kiến trúc/quy ước đã chốt.

## 3. Reference routing
- Payload/Admin/schema → `docs/ai/payload-rules.md`
- Admin form UX → `docs/ai/admin-form-ui.md`
- Database/migration → `docs/ai/database.md`
- Detail page/Hero UI → `docs/ai/detail-page-ui.md`
- Debugging → `docs/ai/debugging.md`
- Regression → `docs/ai/regression-checklist.md`
- Production/VPS/deploy → `docs/ai/production-safety.md`
- Source conflict → `docs/ai/source-of-truth.md`
- Changelog → `docs/ai/changelog-policy.md`

Không đọc tất cả reference cùng lúc.

## 4. Scope control
- Ưu tiên thay đổi nhỏ nhất có thể.
- Không refactor diện rộng nếu lỗi cục bộ.
- Không tự thêm tính năng ngoài yêu cầu.
- Không quét toàn dự án cho task nhỏ.
- Chỉ mở rộng scope khi vấn đề khác trực tiếp chặn task.

## 5. CMS / content
- Ưu tiên nội dung quản trị từ Payload CMS thay vì hardcode.
- Trang mới có cấu hình riêng phải dùng Global/Collection phù hợp; không nhồi vào `SiteSettings`.
- Nội dung động cần bật/tắt độc lập khi nghiệp vụ yêu cầu.
- Ảnh chân dung/bác sĩ phải giữ tỷ lệ, không méo; dùng `object-fit` phù hợp.

Chi tiết schema/Payload chỉ đọc `docs/ai/payload-rules.md` khi task liên quan.

## 6. Database safety
- Local mặc định: `PAYLOAD_DB_PUSH=false`.
- Thay đổi schema phải có migration và schema contract theo quy trình dự án.
- Không tự chạy migration production.
- Không reset/drop/truncate dữ liệu.
- Không commit `.env`, secret, token, password hoặc database dump.

Chi tiết chỉ đọc `docs/ai/database.md` khi task liên quan database/schema.

## 7. Git
- Khi commit/push, chỉ kiểm tra status/diff của file liên quan.
- Không đọc lại toàn repository.
- Không commit cache/build/temp.
- Nếu phát hiện secret đang track, dừng push và báo người dùng.
- Push branch hiện tại trừ khi người dùng yêu cầu khác.

## 8. Validation
Chạy kiểm tra nhỏ nhất phù hợp:
- CSS/text/UI nhỏ → target file; typecheck khi cần.
- Feature → component/type liên quan + targeted validation.
- Schema → generate cần thiết + schema/migration check + typecheck.
- Release/deploy → mới dùng full build / `validate:all`.

Không chạy `npm run build` sau mọi thay đổi nhỏ.

## 9. Task memory
`CURRENT-TASK.md` chỉ chứa **task hiện tại**.
- Task mới → ghi đè task cũ, không append lịch sử.
- Giữ khoảng 20–60 dòng.
- Khi hoàn tất, ghi kết quả ngắn gọn; task tiếp theo sẽ thay nội dung.

## 10. Changelog
Chỉ cập nhật `CHANGELOG.md` khi:
- hoàn thành feature/task có ý nghĩa;
- thay đổi schema/database;
- fix lỗi quan trọng.

Mỗi entry khoảng 5–15 dòng.
Không đọc toàn bộ changelog mặc định.
Git history là nguồn chi tiết cho các thay đổi cũ.

## 11. Handoff
Chỉ cập nhật `HANDOFF.md` khi:
- dừng giữa task;
- chuyển agent/IDE/công cụ;
- cần agent khác tiếp tục ngay.

Không dùng HANDOFF như nhật ký.

## 12. Definition of Done
Task hoàn thành khi:
- yêu cầu chính hoạt động;
- không thay đổi ngoài scope;
- validation phù hợp đã đạt;
- `CURRENT-TASK.md` phản ánh trạng thái cuối;
- CHANGELOG chỉ cập nhật nếu task đáng ghi nhận;
- HANDOFF chỉ cập nhật nếu có bàn giao.
