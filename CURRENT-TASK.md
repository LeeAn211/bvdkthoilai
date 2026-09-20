# CURRENT TASK

## Trạng thái
HOÀN THÀNH — SỬA LỖI BUILD DB SCHEMA CONTRACT

## Hiện tượng
- Linux builder chạy `payload generate:db-schema` thành công nhưng dừng ở bước kiểm tra DB schema contract.
- Contract migration 058 được seal từ schema đồng bộ thủ công do máy Windows trước đó gặp lỗi `uv_os_get_passwd ENOMEM`.

## Nguyên nhân
- Schema Payload sinh thực tế đã bỏ các khai báo quick-link cũ và bổ sung default cho các mẫu trả lời chatbot.
- Hash schema thật trên builder vì vậy khác hash đã seal trước đó.

## Đã sửa
1. Chạy Payload generator thành công ngoài sandbox để lấy đúng schema nguồn.
2. Không xóa các bảng quick-link cũ nhằm bảo toàn dữ liệu.
3. Tạo migration `20260920_059_reconcile_generated_schema` đồng bộ default chatbot.
4. Seal schema contract bằng migration 059.
5. Áp dụng và xác minh migration 059 trên database local.

## Validation
- `npm.cmd run prebuild`: PASS.
- `npm.cmd run db:migrate:deploy`: PASS.
- `npm.cmd run build`: PASS.
- Next.js biên dịch, TypeScript và tạo đủ 44 trang tĩnh thành công.
