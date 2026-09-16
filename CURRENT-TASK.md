# TÁC VỤ HIỆN TẠI (CURRENT TASK)

- **Mục tiêu**: Nâng cấp thanh điều hướng trên điện thoại di động (mobile) theo tiêu chuẩn y tế thẩm mỹ và trải nghiệm cao nhất: Thanh top bar 1 dòng 48px cố định (không trôi, không xô lệch) kết hợp Nút "DANH MỤC" mở bảng Drawer trượt với các nhóm Accordion đóng/mở êm ái.
- **Trạng thái**: Đã hoàn thành (COMPLETED)
- **Tập tin liên quan**:
  - `src/components/MobileNavHeader.tsx`
  - `src/components/SiteHeader.module.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`
- **Kết quả xác minh**:
  - Không còn hiện tượng cuộn ngang trôi dạt hay bẻ gãy 2-3 dòng thô kệch.
  - Desktop giữ nguyên 100% giao diện truyền thống với menu dropdown thả xuống.
  - Mobile sở hữu thanh điều hướng 1 dòng tinh gọn cùng bảng Drawer trượt mượt mà, đầy đủ các mục con phân cấp rõ ràng.
  - `npm run typecheck`: 0 lỗi TypeScript.

## Trạng thái

- **Hoàn thành** lúc 16:25 ngày 2026-09-16 (Asia/Saigon).
- **Chi tiết đã xử lý:**
  1. **Tạo Global `PatientPortalSettings` (`patient-portal-settings`)**:
     - Cấu hình Hero & Notice Banner (tiêu đề, nội dung xuống dòng tự do, căn lề).
     - Quản lý danh sách Tab Sub-Nav: bật/tắt `enabled`, label, href, icon, badge.
     - Quản lý Khối cam kết phục vụ (`commitmentsSection`): bật/tắt toàn khối và từng cam kết.
     - Quản lý Khối dịch vụ y tế (`serviceGroups` & `serviceItems`): bật/tắt từng nhóm chuyên mục và từng thẻ dịch vụ con, cho phép thêm nhóm/thẻ mới tùy ý.
     - Quản lý Khối Banner kêu gọi hành động (`ctaSection`).
  2. **Database Migration & Schema Contract (`20260916_016_create_patient_portal_settings_tables`)**:
     - Bảng `patient_portal_settings` và các bảng con `pps_sub_tabs`, `pps_commits`, `pps_svc_groups`, `pps_svc_items`.
     - Tên bảng và tên cột tuân thủ < 63 ký tự, khóa ngoại ON DELETE CASCADE.
     - Schema contract đã được sealed (`npm run db:schema:seal`), chạy migration deploy thành công 16/16 applied.
  3. **Cập nhật Frontend Components**:
     - `src/components/PatientCareSubNav.tsx`: Tự động lấy cấu hình tab từ CMS, áp dụng đồng bộ cho toàn bộ các trang con.
     - `src/app/(frontend)/danh-cho-nguoi-benh/page.tsx`: Render 100% động từ CMS với cơ chế fallback an toàn.
  4. **Kiểm thử**:
     - `npm run typecheck`: 0 errors.
     - `npm run db:migrate:status`: 16 applied, 0 pending.

- **Chi tiết đã xử lý:**
  1. **Đưa toàn bộ Biểu đồ Thống kê lên trên các ô phân hệ**:
     - Cập nhật vị trí render trong `AdminDashboardClient.tsx`: Biểu đồ `AdminCharts` được đặt ngay phía trên cụm Tab phân hệ (`tabNavContainer`) và lưới thẻ thống kê (`statsGrid`).
     - Người quản lý và Ban Giám đốc khi đăng nhập sẽ thấy ngay toàn bộ biểu đồ xu hướng xuất bản, phân bổ nhân lực, chỉ số hài lòng và cam kết chất lượng bệnh viện.
  2. **Đồng bộ số liệu THỰC TẾ 100% từ Database (không tự ý thêm ảo)**:
     - Truy vấn trực tiếp danh sách khoa/phòng (`departments`) và quan hệ công tác của bác sĩ (`doctors`) để tính chính xác tỷ lệ và số lượng bác sĩ từng khoa.
     - Tỷ lệ giải quyết phản ánh CSKH (SLA) được tính theo tỷ lệ thực tế giữa số thư đã xử lý và tổng số thư người bệnh gửi.
     - Cơ cấu phác đồ điều trị tính toán theo số lượng phác đồ chuẩn Bộ Y tế thực tế trong hệ thống.
  3. **Đã kiểm tra TypeScript (`npm run typecheck`)**: Hoàn tất 100% (0 errors).




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
