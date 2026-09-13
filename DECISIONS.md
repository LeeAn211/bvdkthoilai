# DECISIONS

Ghi lại các quyết định kiến trúc hoặc quy ước đã chốt để agent sau không tự đảo ngược nếu không có lý do rõ ràng.

Mỗi mục nên ngắn gọn theo mẫu:

## YYYY-MM-DD — Tên quyết định
- Quyết định:
- Lý do:
- Không chọn:
- Tác động:

## 2026-09-13 — Chuẩn hóa Payload Admin Form trước khi custom sâu
- Quyết định: Dùng schema-native UI của Payload (`tabs`, `row`, `sidebar`, `collapsible`, mô tả/placeholder) và helper dùng chung để chuẩn hóa form Collection; lấy `Doctors` làm Collection mẫu đầu tiên.
- Lý do: Giảm độ khó khi nhập dữ liệu, đồng bộ giao diện Admin, tránh sửa từng Collection thủ công và giữ khả năng nâng cấp Payload dễ hơn.
- Không chọn: Custom toàn bộ Payload Admin bằng React/CSS riêng ngay từ đầu hoặc sửa đồng loạt tất cả Collection trước khi có mẫu chuẩn.
- Tác động: Các thay đổi Admin form sau này phải tham khảo `docs/ai/admin-form-ui.md`; chỉ custom sâu khi schema-native UI không đáp ứng được yêu cầu.

Không dùng file này thay cho `CHANGELOG.md`; chỉ ghi các quyết định có tính định hướng lâu dài.
