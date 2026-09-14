# v4.4.27 - Chuẩn hóa Header & Nhận diện

## Mục tiêu
- Logo bệnh viện nằm ngay trong `Header & Nhận diện` và dùng chung cho Header/Footer.
- Facebook, Zalo, YouTube, TikTok quản lý duy nhất tại `Header & Nhận diện`.
- Mỗi mạng xã hội có thể dùng icon mặc định hoặc tải icon riêng.
- Cấp cứu, Tổng đài hỗ trợ và các ô liên hệ nhanh quản lý tại `Header & Nhận diện`; mỗi ô có thể đổi icon hoặc tải icon riêng.
- Mục `Mạng xã hội` cũ được ẩn khỏi Admin để tránh trùng lặp nhưng dữ liệu cũ vẫn giữ nguyên làm fallback.
- Các URL mạng xã hội cũ trong `site-settings` được ẩn khỏi form để tránh nhập cùng thông tin ở nhiều nơi.
- Footer chỉ còn công tắc bật/tắt mạng xã hội; icon/link lấy chung từ Header & Nhận diện.

## Nơi cấu hình
Admin -> Trang chủ & Giao diện -> Header & Nhận diện

Các vùng chính:
1. Tên bệnh viện + Logo bệnh viện + Slogan.
2. Nhận diện: Logo, tên bệnh viện, slogan và nền Header.
3. Cấp cứu / Tổng đài / Liên hệ nhanh.
4. Icon mạng xã hội dùng chung Header + Footer.

## Database
Không có migration, không xóa dữ liệu, không bật DB push. Các field đã tồn tại từ v4.4.26; bản này chủ yếu chuẩn hóa vị trí hiển thị và nguồn quản trị.
