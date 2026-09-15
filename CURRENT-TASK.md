# CURRENT TASK

## Mục tiêu

Đóng gói migration 010 và đồng bộ triệt để toàn bộ các cột còn thiếu giữa Payload CMS schema và PostgreSQL (Neon) cho `our_experts`, `advanced_techniques`, `contact_settings`, chấm dứt hoàn toàn tình trạng thiếu cột lẻ tẻ khi chạy trên web.

## Trạng thái

- **Hoàn thành** lúc 13:20 ngày 2026-09-15 (Asia/Saigon).
- **Đã tạo và triển khai migration `20260915_010_sync_all_remaining_collection_and_global_columns`**:
  - Bổ sung các cột `enable_link`, `url`, `open_new_tab` cho `our_experts` và `_our_experts_v`.
  - Bổ sung `enable_link`, `custom_url`, `show_cover_in_detail` cho `advanced_techniques` và `_advanced_techniques_v`.
  - Bổ sung `notice_text_align`, `ct_not_align` cho `contact_settings` và `_contact_settings_v`.
  - Đảm bảo các kiểu ENUM: `enum_our_experts_image_fit`, `enum_advanced_techniques_image_fit`, `ct_not_align`.
  - Quét toàn diện 249 bảng và 3,886 cột: **0 cột thiếu, 0 bảng thiếu**.
  - Đã seal schema contract và deploy migration thành công (10/10 applied, 0 pending).
  - Đã chạy `npm run build` thành công 100% không có cảnh báo hay lỗi.
  - Tự động chạy an toàn khi Railway deploy lên Neon (`prestart`).



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
