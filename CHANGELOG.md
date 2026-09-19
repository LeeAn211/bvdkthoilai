# CHANGELOG

> Nhật ký gọn cho các milestone hiện tại. Lịch sử chi tiết trước ngày 19/09/2026 được lưu tại `docs/history/CHANGELOG-through-2026-09-19.md` và trong Git history.

## 2026-09-19 — Tùy biến tiêu đề cột Lịch Điều dưỡng & Nổi bật Thường trực Ban Giám Đốc
- Cho phép tùy chỉnh tiêu đề và mô tả phụ các cột Khoa/Phòng, Hành chánh, Tăng cường hoặc kích hoạt thêm Cột thứ 4 linh hoạt trong CMS.
- Tạo migration `20260919_054_add_custom_columns_to_nurse_schedules` và cập nhật frontend `NurseScheduleView` co giãn 3-4 cột mượt mà.
- Nổi bật hàng Thường trực Ban Giám Đốc (24/7) Bs Trần Quốc Luận trên bảng Lịch trực cấp cứu tuần theo phong cách lãnh đạo trang trọng.
- Đồng bộ kiểu hiển thị danh sách bác sĩ (lịch ngày) sang thẻ dòng viền trái sắc nét như phong cách lịch điều dưỡng.

## 2026-09-19 — Tách riêng Hình thức đăng lịch Điều dưỡng & Bố cục Tabs trong Admin
- Bổ sung tùy chọn `mode: 'nurse'` riêng biệt trong "Hình thức đăng lịch" của Collection `Schedules`.
- Tổ chức toàn bộ form quản trị `Schedules` thành các Tabs chuyên biệt: Thông tin chung, Phân công Bác sĩ, Phân công Điều dưỡng - NHS, Lịch trực Cấp cứu, Tệp đính kèm.
- Frontend: Tự động phân loại tab chuyên mục `Lịch Điều dưỡng - NHS` riêng biệt ngoài trang danh sách và kích hoạt view chuyên dụng ở trang chi tiết.
- Tạo migration `20260919_053_add_nurse_to_schedules_mode` thêm enum an toàn, sinh schema và seal schema contract.

## 2026-09-19 — Bổ sung Lịch Điều dưỡng - Nữ hộ sinh (ĐD - NHS) & Quét ảnh AI / Excel
- Thêm cấu trúc Lịch Điều dưỡng phân chia 3 cột: Khoa/Phòng, Hành chánh, Tăng cường và Ghi chú nghỉ phép.
- Hỗ trợ tải mẫu Excel chuẩn, upload file Excel tự động điền form (`nurseScheduleExcelParser`).
- Tích hợp Gemini Vision AI OCR (`/api/ai-nurse-ocr`) quét ảnh chụp bảng lịch tự động điền form.
- Tạo component hiển thị frontend `NurseScheduleView` trang nhã, đúng phong cách y tế.
- Tạo migration an toàn `20260919_052_add_nurse_schedule_fields_to_schedules` và seal schema contract.

## 2026-09-19 — Tối ưu AI context / low-token

- Rút gọn `AGENTS.md`, `CURRENT-TASK.md`, `HANDOFF.md` và skill `bvdkweb`.
- Chuyển quy tắc chuyên sâu sang `docs/ai/` để chỉ nạp theo loại task.
- Chuyển các báo cáo audit cũ sang `docs/audits/archive/`.
- Bổ sung ignore cho TypeScript cache/temp; bỏ `tsconfig.tsbuildinfo` và file `-s` khỏi tracking.
- Không thay đổi source website, Payload schema hoặc dữ liệu PostgreSQL.
