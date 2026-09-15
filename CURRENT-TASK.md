# CURRENT TASK

## Mục tiêu

Khép kín luồng GitHub → Railway → Neon để mỗi bản deploy tự áp dụng schema mới trước khi Next.js khởi động, đồng thời chặn rõ ràng bản deploy nếu code thay đổi schema nhưng thiếu migration.

## Trạng thái

- **Hoàn thành** lúc 07:12 ngày 2026-09-15 (Asia/Saigon).
- `npm start` tự apply + verify migration trước khi Next.js mở cổng; không còn phụ thuộc hoàn toàn vào Railway Pre-Deploy.
- Build sinh lại Payload DB schema và kiểm tra schema contract; thay schema thiếu migration sẽ bị chặn.
- Neon runtime hỗ trợ pooled URL, migration bắt buộc Direct URL; GitHub quality gate kiểm tra contract/TypeScript/regression.
- Database trong `.env` local đang trỏ `localhost`; không tự ý kết nối hoặc thay đổi Neon production.

## Phạm vi

- Tự động chạy migration idempotent khi container Railway khởi động.
- Thêm schema contract/hash để phát hiện thay đổi Payload schema không có migration tương ứng.
- Tích hợp kiểm tra vào build/start và tài liệu quy trình GitHub–Railway–Neon.
- Kiểm tra Docker image/runtime, migration status, typecheck, regression và production build.

## Nguyên tắc an toàn

- Không bật `PAYLOAD_DB_PUSH` trên production.
- Không drop/reset/truncate hoặc sao chép đè dữ liệu Neon.
- Migration có lỗi hoặc schema thiếu migration phải làm deployment mới thất bại trước khi nhận traffic.

## Cấu hình người dùng cần đặt một lần trên Railway

- `DATABASE_URL`: Neon pooled URL cho ứng dụng.
- `DATABASE_MIGRATION_URL`: Neon Direct connection string, hostname không có `-pooler`.
- `PAYLOAD_DB_PUSH=false`.
- Start Command để trống hoặc `npm start`; tuyệt đối không đặt trực tiếp `next start`.
- Khuyến nghị Pre-Deploy Command `npm run db:migrate:deploy` và healthcheck `/api/health`.

## Kết quả kiểm tra

- Schema contract behavior 4/4 PASS; Neon pooled-only bị chặn, pooled + Direct preflight PASS.
- Database local 3 applied/0 pending, verify PASS.
- Typecheck PASS; regression 243/243 PASS.
- Production build PASS 45 trang; production `/api/health` và `/admin` HTTP 200.

## Phát hiện thêm

- Payload vẫn cảnh báo chưa cấu hình email adapter; không ảnh hưởng migration hoặc việc đọc/ghi Neon, chỉ ảnh hưởng khi cần gửi email thật.
