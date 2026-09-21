# CURRENT TASK — Chặn lỗi lệch database khi deploy Railway

## Trạng thái: HOÀN THÀNH

## Phạm vi

- Phân tích log Railway: migration Direct URL thành công nhưng truy vấn Payload qua
  `DATABASE_URL` vẫn thất bại sau khi Next.js khởi động.
- Không thay đổi schema và không thao tác dữ liệu production.

## Đã thực hiện

1. Bổ sung runtime database gate vào `scripts/db-migrate.mjs`.
2. Đối chiếu Neon endpoint, database và user giữa URL pooled và URL direct.
3. Sau migration, kết nối lại bằng chính `DATABASE_URL` của Payload.
4. Kiểm tra ledger có migration mới nhất và chạy verify schema qua pooled connection.
5. Chuẩn hóa lỗi database theo nguyên nhân sâu nhất, tránh chỉ in câu SQL dài.
6. Cập nhật validation migration và tài liệu Railway.

## Kiểm tra

- `node --check scripts/db-migrate.mjs`: PASS.
- `npm.cmd run validate:migrations`: PASS 274/274.
- DB schema contract behavior: PASS 4/4.
- `git diff --check`: PASS (chỉ có cảnh báo LF/CRLF của Git trên Windows).

## Triển khai tiếp theo

- Rotate mật khẩu Neon đã bị lộ, cập nhật cả hai URL trên Railway.
- Commit/push thay đổi và Redeploy; log phải có `Runtime DATABASE_URL verified`.
