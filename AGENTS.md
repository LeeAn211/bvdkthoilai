<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# QUY TẮC BẮT BUỘC DỰ ÁN (PROJECT CORE MANDATES)

## 1. Thứ tự hiển thị Lãnh đạo / Ban Giám đốc:
- Trên tất cả các trang hiển thị danh sách bác sĩ (trang chủ, trang `/bac-si`, các carousel chuyên gia, v.v.):
  - **Ban Giám đốc BỆNH VIỆN LUÔN LUÔN ĐƯỢC ƯU TIÊN HIỂN THỊ TRANG ĐẦU TIÊN, SẮP XẾP TỪ TRÊN XUỐNG DƯỚI.**
  - Thứ tự bắt buộc: **Giám đốc bệnh viện** -> **Phó Giám đốc bệnh viện** -> **Trưởng/Phó các Khoa, Phòng** -> **Bác sĩ**.

## 2. Quy cách hiển thị hình ảnh chân dung / bác sĩ:
- **Tất cả ảnh đại diện, ảnh bác sĩ trên toàn bộ dự án PHẢI TỰ ĐỘNG FIX VỪA KHUNG VÀ TUYỆT ĐỐI KHÔNG BỊ BIẾN DẠNG (không méo, không kéo dẹt, không co bóp tỉ lệ).**
- Bắt buộc áp dụng tỷ lệ khung chuẩn (ví dụ tỷ lệ đứng 3:4 hoặc 1:1.25) với:
  - `object-fit: cover` hoặc `object-fit: contain`
  - `object-position: top center` hoặc `center center`
- Khung ảnh phải có `overflow: hidden`, bảo toàn nguyên vẹn tỷ lệ ảnh gốc của thầy thuốc/bác sĩ.

## 3. Ghi chép nhật ký thay đổi và cấu trúc Database (BẮT BUỘC):
- **Mỗi lần thực hiện bất kỳ thay đổi nào theo yêu cầu (code, giao diện, cấu hình, logic)**: Bắt buộc phải cập nhật ngay vào tệp `CHANGELOG.md` ở thư mục gốc dự án.
- **Nội dung ghi chép bao gồm**:
  - Thời gian, tóm tắt yêu cầu.
  - Các tệp tin code/giao diện đã chỉnh sửa (`Files Modified`).
  - **Thay đổi Database/Collections/Schema (nếu có)**: Các trường mới thêm, thay đổi kiểu dữ liệu, quan hệ bảng, hoặc migration để khi chuyển sang máy khác/server khác có thể đồng bộ trọn vẹn.

