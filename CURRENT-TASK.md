# CURRENT TASK

## Mục tiêu

1. Hỗ trợ bật/tắt độc lập từng ô thông tin (Granular Toggles) trên mẫu bài viết chi tiết chung `ArticleDetailTemplate`.
2. Tắt dòng "Nguồn bài viết" cho Kỹ thuật chuyên sâu (`/ky-thuat-chuyen-sau/[slug]`), giữ bật các khối khác.
3. Cung cấp nhóm cấu hình `techniqueOptions` và mở rộng `displayOptions` trong Admin CMS để người quản trị có thể bật/tắt tùy ý mọi khối nội dung.

## Trạng thái

- **Hoàn thành** lúc 09:54 ngày 2026-09-16 (Asia/Saigon).
- **Chi tiết đã xử lý:**
  - `ThemeSettings.ts`: Bổ sung nhóm `techniqueOptions` cho Kỹ thuật chuyên sâu (mặc định `showSource = false`), mở rộng `displayOptions` dùng chung, thêm `applyAdvancedTechniques`.
  - Migration `20260916_013_add_detail_layout_granular_toggles.mjs`: Thêm 25 cột vào `theme_settings` và `_theme_settings_v`. Đã seal contract và deploy (13/13 applied).
  - `ArticleDetailTemplate.tsx`: Hỗ trợ toàn bộ props bật/tắt độc lập từng khối (Breadcrumb, Ngày, Lượt xem, Chuyên khoa, Highlights, Excerpt, Nguồn, Chia sẻ, Sidebar, Tin mới, Banner, Tin liên quan, Nút quay lại). Tự động co giãn layout grid khi tắt Sidebar hoặc Cột trái.
  - `ky-thuat-chuyen-sau/[slug]/page.tsx`: Kết nối `techniqueOptions`, mặc định ẩn dòng "Nguồn bài viết", các khối khác giữ bật và có thể bật/tắt linh hoạt từ Admin CMS.
  - `npm run db:schema:check`: Pass contract hợp lệ.
  - `npm run db:migrate:status`: Pass 13/13 applied, 0 pending.
  - `npm run typecheck`: Pass 100% (0 errors).




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
