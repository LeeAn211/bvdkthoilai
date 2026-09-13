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

---

## 6. Kiểm tra trước khi sửa

/bvdkweb

Đọc AGENTS.md và CURRENT-TASK.md.
Kiểm tra nguyên nhân lỗi trước, chưa sửa ngay.
Chỉ ra file liên quan, nguyên nhân có khả năng nhất và phương án sửa tối thiểu.

---

## 7. Chỉ sửa giao diện, không ảnh hưởng phần khác

/bvdkweb

Chỉ chỉnh giao diện phần sau:
[ghi khu vực cần sửa]

Không thay đổi logic, route, schema hoặc dữ liệu.
Kiểm tra desktop và mobile.

---

## 8. Sửa Payload / Admin CMS

/bvdkweb

Đọc AGENTS.md và docs/ai/payload-rules.md.
Sửa phần Payload/Admin sau:
[ghi yêu cầu]

Không xóa field có dữ liệu.
Không đổi slug/collection name nếu không cần.
Sau khi sửa chạy generate:types, generate:importmap và typecheck.

---

## 9. Kiểm tra regression sau khi sửa

/bvdkweb

Đọc docs/ai/regression-checklist.md.
Kiểm tra các phần có thể bị ảnh hưởng bởi thay đổi vừa làm.
Chỉ sửa nếu phát hiện regression trực tiếp liên quan.

---

## 10. Refactor / tối ưu code nhưng không đổi chức năng

/bvdkweb

Refactor phần sau để code gọn hơn nhưng không thay đổi hành vi:
[ghi khu vực]

Ưu tiên tái sử dụng component/util hiện có.
Không mở rộng phạm vi.

---

## 11. Kiểm tra trước khi deploy

/bvdkweb

Đọc docs/ai/production-safety.md.
Kiểm tra project trước khi deploy.
Không thay đổi database production.
Chạy các kiểm tra cần thiết và báo rõ lỗi còn lại.

---

## 12. Bàn giao cho agent khác

/bvdkweb

Cập nhật CURRENT-TASK.md và HANDOFF.md để agent khác có thể tiếp tục ngay.
Ghi rõ:
- đã làm gì
- file đã sửa
- lỗi còn lại
- bước tiếp theo
- quyết định quan trọng

---

## 13. Tóm tắt trạng thái dự án

/bvdkweb

Đọc CURRENT-TASK.md, HANDOFF.md và DECISIONS.md.
Tóm tắt ngắn:
- đang làm gì
- đã hoàn thành gì
- còn gì chưa làm
- bước tiếp theo
Không đọc toàn bộ CHANGELOG.md.
