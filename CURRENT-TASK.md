# CURRENT TASK — Khắc phục triệt để lỗi ETIMEDOUT Neon khi khởi động (Auto-Retry Cold Boot)

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. [`scripts/db-migrate.mjs`](file:///f:/20.9%20web/bvdkthoilai-main/scripts/db-migrate.mjs):
   - Thêm hàm `connectWithRetry` hỗ trợ xử lý đặc thù của **Neon Serverless**: Khi database đang ở trạng thái ngủ (Auto-suspend / Scale to Zero) hoặc mạng quốc tế trễ, script sẽ không văng lỗi sập container mà kiên nhẫn thử lại tối đa 5 lần (mỗi lần chờ 3 giây) để Neon kịp khởi động engine.
   - Áp dụng `connectWithRetry` cho cả **Migration Database connection** và **Runtime Database verification**.
   - Bắt các mã lỗi rớt mạng đặc trưng (`ETIMEDOUT`, `ECONNRESET`, `57P01`) và in log thông báo rõ ràng (`⏳ Database (Neon) đang thức dậy...`).
2. Giao diện trang **Bảng giá dịch vụ** ([`src/app/(frontend)/bang-gia/page.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/bang-gia/page.tsx) & [`src/app/(frontend)/bang-gia/bang-gia.module.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/bang-gia/bang-gia.module.css)):
   - Đã tối ưu xong định dạng gọn gàng (Compact table), giá BHYT xanh dương canh giữa, giá dịch vụ đỏ canh giữa, bỏ đơn vị tính "Lần".

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi).
