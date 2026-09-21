# CURRENT TASK — Chẩn đoán lỗi truy vấn Homepage trên Railway

## Trạng thái: HOÀN THÀNH

## Kết luận

- File log mới chỉ có câu SQL và `params: 1`, không có PostgreSQL cause.
- Chạy lại nguyên câu SQL từ log qua `DATABASE_URL` hiện tại ở transaction read-only:
  PASS (`query: ok`).
- Schema `homepage` hiện tại không thiếu cột; lỗi đã gửi là log cũ hoặc lỗi kết nối
  pooled thoáng qua, không phải migration 060/061 thất bại.

## Đã thực hiện

1. Giữ runtime database gate trong `scripts/db-migrate.mjs`.
2. Sửa logger Homepage để đi đến cause sâu nhất.
3. Log mới chỉ ghi các trường hữu ích: name, SQLSTATE code, message, detail,
   table và column; không đổ toàn bộ SQL dài.
4. Script chẩn đoán tạm đã được xóa, không đưa vào repository.

## Kiểm tra

- Truy vấn Homepage production-compatible qua DATABASE_URL: PASS.
- `npm.cmd run typecheck`: PASS.
- `git diff --check`: PASS (chỉ có cảnh báo LF/CRLF trên Windows).
