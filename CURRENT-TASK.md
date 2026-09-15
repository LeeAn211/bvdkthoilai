# CURRENT TASK

## Mục tiêu

1. Điều chỉnh thanh tiện ích trên cùng (Utility Bar) trên điện thoại: Ngày & Giờ nằm bên TRÁI; cụm Mạng xã hội và ô Tìm kiếm nằm ở góc PHẢI.
2. Menu trên điện thoại thiết kế kiểu xổ xuống (dropdown) tự nhiên neo ngay dưới từng mục cha như trên Desktop: Cố định vị trí menu khi bấm xổ xuống, nếu nội dung dài thì có thanh cuộn ngang để lướt, không làm menu bị nhảy/di chuyển lên xuống toàn màn hình.

## Trạng thái

- **Hoàn thành** lúc 19:35 ngày 2026-09-15 (Asia/Saigon).
- **Chi tiết đã xử lý:**
  - `MobileNavHeader.tsx`: Loại bỏ header phụ và lớp phủ backdrop, giữ cấu trúc menu dropdown gọn nhẹ, click mở/đóng trực quan.
  - `SiteHeader.module.css` & `globals.css`:
    - Menu dropdown trên mobile định vị `position: absolute !important; top: 100% !important; left: 0 !important; width: 250px;`, neo chuẩn xác bên dưới mục cha đang được chọn, thanh menu cuộn ngang tự nhiên mượt mà (`overflow-x: auto`), không làm dịch chuyển lên xuống khung trang.
    - Thanh trên cùng: Đổi vị trí flexbox: Ngày & Giờ ở bên TRÁI (`order: 1`), Mạng xã hội & Ô tìm kiếm ở góc PHẢI (`order: 2`).
  - `npm run typecheck`: Pass 100%.
  - `npm run build`: Thành công 100% (45/45 static pages).

- **Chi tiết các hạng mục đã hoàn tất:**
  1. **Thanh tiện ích trên cùng (Utility Bar)**: Hiển thị đầy đủ ngày giờ thời gian thực (`CurrentWeekdayTime`), các biểu tượng mạng xã hội (Facebook, Zalo, YouTube...) và ô tìm kiếm toàn diện trên giao diện điện thoại.
  2. **Logo và Tên Bệnh viện**: Logo kích thước 58px nổi bật với bo góc và viền đổ bóng nhẹ, tên bệnh viện và câu slogan được bố trí cân đối sang trọng, căn chỉnh lề trái đồng nhất, chống rớt từ mồ côi.
  3. **Menu Navigation xổ xuống**: Tách component client `MobileNavHeader` hỗ trợ chạm/click mở menu con nhẹ nhàng, mũi tên xoay chỉ báo, đóng menu mượt mà khi chạm ra ngoài hoặc click chọn mục con, giao diện dropdown có viền bo tròn đổ bóng nổi bật.
  4. Đã chạy `npm run typecheck` thành công 100% (code 0).

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
