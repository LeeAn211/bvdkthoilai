# CURRENT TASK — Bổ Sung Công Tắc Bật/Tắt Lấy Tin Ngoài & Tối Ưu An Toàn Hệ Thống

## Trạng thái: HOÀN THÀNH

## Bối cảnh & Yêu cầu
- Yêu cầu người dùng: Chỗ lấy thông tin bài viết từ các đường liên kết bên ngoài (Sở Y tế Cần Thơ, Website khác, RSS Feed), chỉ khi quản trị viên chủ động BẬT lên thì hệ thống mới kết nối mạng ra ngoài để lấy tin; khi TẮT thì tuyệt đối không kết nối ra bên ngoài để tránh ảnh hưởng đến hiệu năng, độ trễ và độ ổn định của hệ thống.
- Vấn đề phát hiện: Trước đây, `src/app/(frontend)/page.tsx` gọi hàm `getCanThoHealthDeptNews(12)` trực tiếp trong `Promise.all` gốc ở mỗi lượt tải trang chủ, kể cả khi khối giao diện này không được bật hoặc bị ẩn, dẫn đến việc liên tục phát sinh HTTP request ra mạng ngoài và sinh log lỗi khi mạng ngoài quá tải/chặn bot.

## Đã triển khai
1. **Thêm công tắc quản trị trong Payload CMS (`src/globals/Homepage.ts`)**:
   - `enableExternalFetch` (Mặc định: `false` / TẮT): Công tắc cấp mục cho `cantho-health-dept`. Khi TẮT, hệ thống hoàn toàn không gọi HTTP ra bên ngoài, trả về dữ liệu fallback nội bộ tức thì (0ms).
   - `autoFetchEnabled` (Mặc định: `false` / TẮT): Công tắc chi tiết theo từng Tab liên kết (áp dụng cho Tab Sở Y tế và Tab RSS/Website tự động).
2. **Loại bỏ fetch ngầm tại `src/app/(frontend)/page.tsx`**:
   - Gỡ bỏ hoàn toàn lệnh gọi `getCanThoHealthDeptNews(12)` khỏi `Promise.all` ban đầu của trang chủ.
   - Chỉ khi `healthDeptSection?.enableExternalFetch === true` VÀ các tab liên quan cho phép fetch thì mới thực hiện `getCanThoHealthDeptNews` hoặc `fetchAutoLinkedNews`.
   - Khi tắt, dùng ngay `FALLBACK_ITEMS` tĩnh an toàn mà không phát sinh bất kỳ kết nối mạng ngoài nào.
3. **Cơ chế chống spam mạng tại `src/lib/canthoHealthDept.ts` & `src/lib/autoLinkedNews.ts`**:
   - Hỗ trợ tùy chọn `skipFetch`.
   - Cơ chế cooldown 5 phút khi gặp lỗi mạng ngoài để tránh gửi request dồn dập.
4. **Database Migration & Schema Seal**:
   - Migration `20260925_077_add_external_fetch_toggles_to_homepage.mjs` bổ sung các cột boolean an toàn cho bảng `homepage_sections`, `_homepage_v_version_sections`, `hp_linked_tabs`, `_hp_linked_tabs_v`.
   - Khóa hợp đồng DB schema contract snapshot 077 (`scripts/db-schema-contract.json`).
   - Đã deploy và verify qua `npm run db:migrate:deploy`.

## Kiểm tra chất lượng (Verification)
- `npm run typecheck`: PASS (0 lỗi).
- `node scripts/validate-db-migrations.mjs`: PASS 338/338 checks.
- `npm run db:schema:check`: PASS (hợp đồng 077 hợp lệ).
- Khi TẮT công tắc: Hệ thống phản hồi ngay lập tức, không gửi request mạng ngoài, không log lỗi.
