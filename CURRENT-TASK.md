# CURRENT TASK

## Mục tiêu

1. Sửa triệt để menu xổ xuống (dropdown) trên mobile: Tránh kẹt trong thanh cuộn ngang, mở dạng panel phủ toàn chiều ngang màn hình kèm backdrop mờ và nút đóng nhanh, chạm bấm tức thì không cần vuốt.
2. Đưa ngày giờ thời gian thực lên góc phải thanh tiện ích trên cùng (Utility Bar) trên điện thoại giống như desktop.

## Trạng thái

- **Hoàn thành** lúc 18:35 ngày 2026-09-15 (Asia/Saigon).
- **Chi tiết đã xử lý:**
  - `MobileNavHeader.tsx`:
    - Thêm header `navDropdownMobileHeader` với tiêu đề mục cha và nút đóng ✕.
    - Danh sách `navDropdownInnerList` hỗ trợ cuộn dọc độc lập khi danh mục dài.
    - Thêm lớp phủ nền mờ `mobileDropdownBackdrop` che phủ nền khi mở dropdown và đóng khi chạm ra ngoài.
  - `CurrentWeekdayTime.tsx`:
    - Tạo 2 chế độ hiển thị: nhãn đầy đủ `utilityTimeFull` cho màn hình lớn và nhãn rút gọn tinh tế `utilityTimeCompact` (`T3, 15/09 • 18:35`) vừa vặn góc phải mobile.
  - `SiteHeader.module.css` & `globals.css`:
    - Menu con trên mobile chuyển sang `position: fixed; left: 8px; right: 8px; top: 56px; z-index: 9999;` tránh hoàn toàn việc bị cắt xén hoặc kẹt trong overflow cuộn ngang của thanh menu.
    - Thanh trên cùng: Đảo vị trí với flexbox, bên trái là icon MXH + tìm kiếm (`order: 1`), bên phải là ngày giờ thời gian thực (`order: 2`).
  - `npm run typecheck`: Kết quả **Code 0 - Pass 100%**.

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
