# CURRENT-TASK

## Mục tiêu
Thiết kế lại mobile menu kiểu medpro.vn: hamburger ☰ ở top bar, bấm mở toàn bộ menu.

## Trạng thái: HOÀN THÀNH

## Files liên quan
- src/components/MobileTopBar.tsx [NEW]
- src/components/SiteHeader.tsx
- src/app/styles/mobile-medpro.css

## Kết quả
- Top bar mobile gradient xanh 56px, fixed, có logo + tên BV + nút gọi + hamburger ☰
- Hamburger mở panel slide-down với quick actions + accordion nav
- Desktop header hoàn toàn ẩn trên mobile < 900px
- Server biên dịch thành công, không lỗi

## Việc còn lại
- Người dùng cần tự kiểm tra trên điện thoại thật hoặc DevTools mobile mode (F12)
- Nếu cần điều chỉnh kích thước font / màu / layout, báo để sửa tiếp
