# CURRENT TASK — Sửa lỗi Payload Admin document lock của Site Settings

## Trạng thái: HOÀN THÀNH

## Nguyên nhân

- Payload 3.89 phát sinh race condition khi tạo `payload_locked_documents` và hàng
  quan hệ người dùng, gây lỗi FK `payload_locked_documents_rels_parent_fk`.
- Lỗi xảy ra dù chỉ có một quản trị viên; không phải xung đột nhiều người dùng.

## Đã thực hiện

1. Đặt `lockDocuments: false` chỉ cho Global `site-settings`.
2. Giữ nguyên versions của `site-settings` và lock của các nội dung khác.
3. Xóa đúng một khóa tạm cũ của `site-settings` (ID 78); FK cascade chỉ dọn hàng
   quan hệ lock, không tác động nội dung CMS.
4. Không thay đổi schema database, không cần migration.

## Kiểm tra

- `npm.cmd run typecheck`: PASS.
- `git diff --check`: PASS (chỉ có cảnh báo LF/CRLF trên Windows).
- `generate:types` bị chặn bởi lỗi môi trường Windows `uv_os_get_passwd ENOMEM`
  trước khi Payload CLI chạy; thay đổi không tác động cấu trúc type/schema.

## Triển khai

- Commit/push lên `main`, sau đó Railway redeploy.
