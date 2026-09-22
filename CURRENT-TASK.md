# CURRENT TASK — Khắc phục lỗi cắt chữ thẻ lịch khám bệnh trên điện thoại

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. **Khắc phục lỗi cắt chữ trên mobile** ([`src/app/styles/30-home-editorial.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/styles/30-home-editorial.css)):
   - Loại bỏ thuộc tính `text-wrap: balance` gây co ngắn và cắt mép chữ trên các màn hình di động hẹp (iPhone / Android).
   - Thêm `overflow-wrap: anywhere`, `word-break: break-word` và `line-clamp: 2` cho `.editorialHeroTitle` và `.editorialRowTitle` để các chuỗi ngày tháng liền nhau (ví dụ: `21/9-27/9/2026`) tự động xuống dòng an toàn, không bị tràn ra ngoài viền phải thẻ.
   - Cho phép `.editorialHeroDate` ngắt dòng linh hoạt với `flex-wrap: wrap` và `overflow-wrap: anywhere`.
   - Tinh chỉnh padding thẻ `.editorialHeroBody` trên màn hình nhỏ từ `16px 18px 18px` thành `14px 14px 16px`, tăng diện tích hiển thị nội dung và tránh va chạm với nút chat / viền mép điện thoại.

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi).



