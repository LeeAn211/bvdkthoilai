# CURRENT TASK

## Mục tiêu

Đóng gói migration và đồng bộ triệt để bảng quan hệ `_specialties_v_version_sidebar_banners` cùng bảng `specialties_sidebar_banners` và các cột cấu hình chi tiết chuyên khoa để giải quyết dứt điểm lỗi query draft version khi deploy/truy cập web.

## Trạng thái

- **Hoàn thành** lúc 12:47 ngày 2026-09-15 (Asia/Saigon).
- **Đã tạo và triển khai migration `20260915_009_create_specialties_sidebar_banners_tables`**:
  - Tạo bảng `specialties_sidebar_banners` và `_specialties_v_version_sidebar_banners` với đầy đủ khóa ngoại `CASCADE`, `id`, `_order`, `_parent_id`, `image_id`, `_uuid` và index.
  - Đồng bộ an toàn 17 cột cấu hình trang chi tiết chuyên khoa trên cả 2 bảng `specialties` và `_specialties_v`.
  - Đã seal schema contract và deploy migration thành công (9/9 applied, 0 pending).
  - Tự động chạy an toàn khi Railway deploy lên Neon (`prestart`).
- Toàn bộ kiểm tra contract và migration đều PASS 100%.



## Phạm vi

- Tự động chạy migration idempotent khi container Railway khởi động.
- Thêm schema contract/hash để phát hiện thay đổi Payload schema không có migration tương ứng.
- Tích hợp kiểm tra vào build/start và tài liệu quy trình GitHub–Railway–Neon.
- Kiểm tra Docker image/runtime, migration status, typecheck, regression và production build.

## Nguyên tắc an toàn

- **LƯU Ý QUAN TRỌNG (YÊU CẦU NGƯỜI DÙNG)**: Tạm thời KHÔNG commit/push lên GitHub. Chỉ thực hiện push khi người dùng yêu cầu rõ ràng.
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
