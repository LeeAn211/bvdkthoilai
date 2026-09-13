# PROMPTS NHANH

## 1. Tiếp tục công việc hiện tại

/bvdkweb

Đọc AGENTS.md, CURRENT-TASK.md và HANDOFF.md.
Tóm tắt ngắn trạng thái hiện tại, sau đó tiếp tục đúng bước tiếp theo đang ghi trong CURRENT-TASK.md.
Không mở rộng phạm vi nếu chưa cần.

---

## 2. Bắt đầu công việc mới

/bvdkweb

Đọc AGENTS.md trước.
Tạo hoặc cập nhật CURRENT-TASK.md cho yêu cầu mới này rồi thực hiện.

Yêu cầu mới:
[ghi yêu cầu tại đây]

---

## 3. Chỉ sửa một lỗi cụ thể

/bvdkweb

Đọc AGENTS.md.
Chỉ sửa lỗi sau, không thay đổi phần khác nếu không cần:

[ghi lỗi tại đây]

Cập nhật CURRENT-TASK.md và CHANGELOG.md sau khi hoàn thành.

---

## 4. Chuẩn hóa trang chi tiết

/bvdkweb

Đọc AGENTS.md và docs/ai/detail-page-ui.md.
Chuẩn hóa trang chi tiết theo layout/component dùng chung.
Không đổi route, slug hoặc dữ liệu Payload.
Kiểm tra desktop/mobile và cập nhật CHANGELOG.md.

---

## 5. Commit và push GitHub

/bvdkweb

Chỉ kiểm tra git status và diff các file đã thay đổi.
Không đọc lại toàn bộ repository.
Commit message ngắn gọn, không commit file nhạy cảm.
Push lên branch hiện tại.
