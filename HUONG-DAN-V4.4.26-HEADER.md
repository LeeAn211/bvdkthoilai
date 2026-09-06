# Hướng dẫn v4.4.26 - Header & Nhận diện

## 1. Vì sao trước đây Header báo “Không tìm thấy”?
Bản trước đăng ký Global mới có slug `header` trong source nhưng database ổn định đang chạy với `push: false`, nên cấu trúc lưu trữ của Global này chưa được tạo. Frontend có fallback nên vẫn hiển thị, còn Admin `/admin/globals/header` không dùng được.

v4.4.26 chuyển cấu hình Header về Global `site-settings` đang tồn tại, đồng thời bổ sung các cột/bảng con cần thiết bằng script thủ công an toàn.

## 2. Chạy trước khi mở website
1. Sao lưu database.
2. Kiểm tra:
   `npm run audit:header-settings`
3. Áp dụng:
   `npm run upgrade:header-settings -- --apply`
4. Chạy website:
   `npm run dev`

## 3. Vào Admin
Mở **Trang chủ & Giao diện → Header & Nhận diện**.
Route đúng là `/admin/globals/site-settings`.

Có thể chỉnh:
- Tên bệnh viện, slogan, logo.
- Hiện/ẩn tên, logo, slogan, thanh ngày giờ, ô tìm kiếm, khối liên hệ nhanh.
- Màu nền hoặc ảnh nền Header; kiểu phủ ảnh, vị trí ảnh, lớp phủ.
- Thêm/xóa/ẩn/hiện/sắp xếp các ô liên hệ nhanh; icon mặc định hoặc upload icon riêng.
- Thêm/xóa/ẩn/hiện/sắp xếp Facebook, Zalo, YouTube, TikTok hoặc mạng xã hội tùy chỉnh.
- Danh sách mạng xã hội mới được dùng đồng bộ ở Header và Footer.
