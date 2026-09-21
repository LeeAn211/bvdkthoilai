# CURRENT TASK — Thiết kế và tích hợp thống kê truy cập website & biểu đồ Admin Dashboard

## Trạng thái: ✅ HOÀN THÀNH

## Các công việc đã thực hiện:

1. **Cơ sở dữ liệu & Migration**:
   - Viết migration `20260921_060_add_visit_statistics.mjs`:
     - Bảng `site_visits_summary`: Tổng lượt xem, tổng lượt truy cập, offset khởi tạo ban đầu.
     - Bảng `site_visits_daily`: Thống kê theo ngày (YYYY-MM-DD), views và unique visits.
     - Cột `views` cho các bài viết `news`, `notices`, `clinical_protocols`.
     - Cột cấu hình `visit_stats_*` trong `footer` và `_footer_v`.
     - Cột cấu hình `dashboard_settings_*` trong `system_settings`.
   - Chạy `payload generate:types`, `payload generate:db-schema`, `db:schema:seal` và `db:migrate:deploy` thành công.

2. **API Đếm & Thống kê (`/api/site-visits`)**:
   - `POST`: Nhận diện phiên truy cập dựa trên client IP + UA, đánh dấu phiên online (cửa sổ 5 phút), tự động tăng `views` và `unique_visits` trong DB.
   - `GET`: Trả về số người đang online, hôm nay, tháng này, tổng lượt xem và dữ liệu lịch sử 14 ngày gần nhất để vẽ biểu đồ.

3. **Giao diện ngoài Website (Chân trang - `SiteFooter`)**:
   - Tạo component [`src/components/SiteVisitStats.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/SiteVisitStats.tsx) và [`SiteVisitStats.module.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/SiteVisitStats.module.css).
   - Tích hợp vào [`src/components/SiteFooter.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/SiteFooter.tsx) với hiệu ứng đèn pulsing xanh cho "Đang online", định dạng số tiếng Việt rõ ràng.
   - Hỗ trợ đầy đủ bật/tắt từng chỉ số trong CMS Global `Footer`.

4. **Biểu đồ phân tích trong Admin Dashboard**:
   - Thêm khối **"Lưu lượng truy cập Website"** vào [`AdminCharts.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/admin/AdminCharts.tsx):
     - 4 thẻ KPI: Đang trực tuyến (realtime live badge), Hôm nay, Tháng này, Tổng tích lũy.
     - Biểu đồ cột SVG hiển thị xu hướng truy cập các ngày gần nhất với tooltip trực quan.
   - Tích hợp bộ tùy chỉnh bật/tắt và di chuyển thứ tự biểu đồ trong [`AdminDashboardCustomizer.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/admin/AdminDashboardCustomizer.tsx).
   - Truy vấn và đẩy dữ liệu thực tế từ DB qua [`AdminDashboard.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/admin/AdminDashboard.tsx) và [`AdminDashboardClient.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/admin/AdminDashboardClient.tsx).

5. **Thống kê Nội dung & Bài viết được xem nhiều nhất (Top Viewed Content)**:
   - Tự động ghi nhận lượt xem bài viết thông qua component [`ArticleViewTracker.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/ArticleViewTracker.tsx) (có cơ chế sessionStorage debounce chống spam F5).
   - Tích hợp tracker vào [`ArticleDetailTemplate.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/ArticleDetailTemplate.tsx), trang chi tiết Tin tức, Thông báo và Phác đồ điều trị.
   - Thêm cột `views` vào danh sách quản trị Payload CMS cho `News`, `Notices`, `ClinicalProtocols`.
   - Bổ sung **Bảng xếp hạng Top bài viết** vào [`AdminCharts.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/admin/AdminCharts.tsx) ngay dưới biểu đồ lưu lượng: hiển thị Top bài xem nhiều nhất kèm huy hiệu hạng 1, 2, 3, phân loại bài viết, thanh phần trăm và số lượt xem trực quan.

6. **Điền nội dung mẫu chân trang (Footer) vào Admin**:
   - Cập nhật mô tả bệnh viện chuẩn mực tại chân trang.
   - Điền đầy đủ 3 nhóm cột với 17 liên kết y tế tiêu chuẩn:
     - *Dành cho người bệnh* (Đặt lịch khám, Quy trình khám bệnh, Giờ làm việc, Lịch khám & Trực cấp cứu, Bảng giá viện phí, Hướng dẫn BHYT).
     - *Thông tin bệnh viện* (Giới thiệu, Sơ đồ tổ chức & Khoa phòng, Đội ngũ bác sĩ, Tin tức y tế, Thông báo điều hành, Đấu thầu - Mua sắm).
     - *Hỗ trợ & Tra cứu* (Hỏi đáp y tế, Khảo sát sự hài lòng, Góp ý - Phản ánh, Văn bản - Biểu mẫu, Tìm kiếm cổng thông tin).
   - Thiết lập cấu hình bản quyền `© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai` và bật đầy đủ các khối thương hiệu, thống kê truy cập.

7. **Tối ưu giao diện Logo, Slogan và Địa chỉ**:
   - Thiết kế Logo dạng huy hiệu tròn viền nổi: Bỏ khoảng đệm (`padding: 0`), dùng `object-fit: cover` và `overflow: hidden` để hình ảnh biểu trưng lấp đầy toàn bộ khung tròn 100%, vòng tròn bên ngoài bo sát liền mạch với viền logo, tạo cảm giác trọn vẹn, sắc nét và chuyên nghiệp.
   - Tinh chỉnh phân cấp thị giác (visual hierarchy): Tên bệnh viện (16px, font-weight 800) làm tâm điểm chính, Slogan được thu nhỏ lại tinh tế (11px, font-weight 600, màu xanh băng thanh lịch `#7dd3fc`, khoảng cách giãn 3px), tạo bố cục gọn gàng, trang nhã chuẩn y tế.
   - Xử lý Slogan và Địa chỉ trụ sở bệnh viện không bị ngắt hoặc rớt dòng bất thường trên màn hình desktop (`white-space: nowrap`, tối ưu độ rộng cột thông tin bệnh viện).

8. **Tích hợp Quản trị Thanh tiện ích nhanh & Cấp cứu (Quick Bar)**:
   - Thêm nhóm cấu hình `quickBar` vào Admin Global `Footer`:
     - Công tắc bật/tắt toàn bộ thanh tiện ích nhanh ở đầu chân trang.
     - 4 công tắc độc lập: *Hiện thẻ Cấp cứu 24/24*, *Hiện nút Đặt khám trực tuyến*, *Hiện nút Quy trình khám*, *Hiện nút Góp ý & Liên hệ*.
     - Các trường nhập linh hoạt: *Nhãn thẻ cấp cứu*, *Số điện thoại cấp cứu riêng*, *Tên nút & Đường dẫn Quy trình*, *Tên nút & Đường dẫn Góp ý*.
   - Hoàn thành migration `20260921_061_add_footer_quick_bar`, seal schema contract và deploy an toàn.

6. **Tối ưu thiết kế Bảng xếp hạng Top bài viết (Admin Dashboard)**:
   - Tách khối danh sách Top bài viết ra khỏi cột hẹp để hiển thị dàn đều toàn chiều rộng thẻ card.
   - Thiết kế dạng danh sách phẳng hiện đại: Huy hiệu thứ hạng (Rank 1, 2, 3 nổi bật) -> Tag phân loại (Tin tức, Thông báo, Phác đồ) -> Tiêu đề bài viết (tự động cắt gọn dấu ... khi dài) -> Thanh tiến trình lượt xem trực quan -> Số lượt xem kèm icon mắt xanh.
   - Loại bỏ chuỗi slug dư thừa gây vỡ layout và rớt dòng ký tự.

7. **Kiểm tra**:
   - `npm run validate:site-shell`: ✅ 14/14 PASS.
   - `npm run typecheck`: ✅ Pass 100% không có lỗi.
   - Test API `/api/site-visits`: ✅ Trả về 200 OK và dữ liệu đầy đủ.
