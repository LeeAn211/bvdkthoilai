# CURRENT-TASK

## Mục tiêu
1. Thêm nút chuyển qua lại (Next / Prev) và dots pagination cho phần "Chuyên gia của chúng tôi" trên điện thoại.
2. Thêm thanh menu điều hướng ở dưới cuối màn hình (Bottom Navigation Bar) kiểu medpro.vn trên điện thoại.

## Trạng thái: HOÀN THÀNH

## Files liên quan
- src/components/OurExpertsCarousel.tsx
- src/components/OurExpertsCarousel.module.css
- src/components/MobileBottomNav.tsx [NEW]
- src/app/(frontend)/layout.tsx
- src/app/styles/mobile-medpro.css
- CHANGELOG.md

## Kết quả
- Carousel "Chuyên gia của chúng tôi" trên mobile có nút Prev/Next cỡ 46px dễ bấm, đi kèm dải chấm tròn chỉ báo (dots pagination) hiển thị slide hiện tại và hỗ trợ bấm chọn slide trực tiếp.
- Thanh Bottom Navigation Bar cố định ở đáy màn hình trên mobile (< 900px) gồm 4 tab tiện ích chuẩn Medpro: Trang chủ, Lịch khám, Đặt khám (nút FAB nổi bật ở giữa), Cấp cứu 24/7.
- Tự động bù trừ khoảng đệm chân trang (`body padding-bottom` + `safe-area-inset-bottom`) để nội dung không bị che khuất.
- TypeScript typecheck đạt 0 lỗi, dev server phản hồi HTTP 200 OK.
