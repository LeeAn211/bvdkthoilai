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

## 4. Tuyệt đối không đưa tên đơn vị / bệnh viện khác vào hệ thống (MANDATE BẮT BUỘC):
- **TUYỆT ĐỐI KHÔNG BAO GIỜ** được điền, hiển thị hoặc gắn tên của bất kỳ đơn vị, bệnh viện hay tổ chức y tế nào khác (như Bạch Mai, Chợ Rẫy, v.v.) vào giao diện website, Admin CMS, label, placeholder hay mô tả trường của Bệnh viện Đa khoa Khu vực Thới Lai.
- Mọi mẫu thiết kế tham khảo chỉ dùng để áp dụng cấu trúc giao diện y tế hiện đại, văn bản và nhãn hiển thị phải luôn luôn thuộc về và đại diện cho **Bệnh viện Đa khoa Khu vực Thới Lai**.

## 5. Nguyên tắc bắt buộc đối với Trang Lịch làm việc và các Khối nội dung động trong Admin CMS (MANDATE BẮT BUỘC):
- **5.1. Đưa toàn bộ vào Admin CMS (Không hardcode giao diện)**:
  - Mọi nội dung, hình nền, biểu tượng (icon), liên kết tab, khung giờ, và ghi chú của trang Lịch làm việc (`/lich-lam-viec`) cũng như các khối thông tin dịch vụ **BẮT BUỘC PHẢI ĐƯỢC QUẢN LÝ 100% TỪ ADMIN CMS**.
  - Không được hardcode văn bản cố định ngoài frontend nếu chưa có trường tương ứng trong Global/Collection schema.
- **5.2. Quyền bật/tắt độc lập từng ô thông tin (Granular Toggles)**:
  - Tất cả các khối lớn (Banner Cấp cứu, Khối thông báo, Khối liên kết, Khối lưu ý) VÀ từng phần tử con (từng ô khoa phòng, từng mốc giờ, từng thẻ link, từng dòng lưu ý) **BẮT BUỘC phải có trường checkbox `enabled` riêng biệt** để người quản trị có thể bật/tắt tùy ý những mục chưa sử dụng tới.
- **5.3. Định dạng và thẩm mỹ linh hoạt trên từng ô (Styling Controls)**:
  - Từng ô nội dung phải hỗ trợ đầy đủ các tùy chọn:
    - **Canh lề (`textAlign`)**: Canh trái, Canh giữa, Canh phải, Canh đều 2 bên (Justify).
    - **Tự do xuống dòng (Multiline)**: Toàn bộ các vùng nhập văn bản, ghi chú, mô tả phải giữ nguyên định dạng ngắt dòng khi gõ phím Enter (`white-space: pre-line`).
    - **Màu sắc chữ (`titleColor`, `textColor`, `noteColor`)**: Đa dạng tông màu chuẩn y tế (Đen đậm, Xanh dương đậm Navy, Xanh y tế Primary Blue, Xanh lá, Đỏ nổi bật, Xám đậm).
    - **Kích thước cỡ chữ (`titleSize`, `textSize`, `noteSize`)**: Chuẩn, Lớn, Rất lớn, hoặc Nhỏ vừa.
- **5.4. Chống lỗi rớt từ mồ côi (No Orphan Words)**:
  - Tiêu đề Hero và tiêu đề các ô thông tin phải áp dụng `text-wrap: balance` và chiều rộng khung hợp lý, tuyệt đối không để xảy ra hiện tượng rớt 1 từ lẻ loi xuống hàng mới (như chữ "bệnh" rớt riêng một dòng).
- **5.5. An toàn cơ sở dữ liệu PostgreSQL (`dbName` Optimization)**:
  - Khi thêm các trường mảng, bảng phụ, hoặc quan hệ lồng nhau vào Payload CMS, **BẮT BUỘC phải đặt `dbName` ngắn gọn (< 63 ký tự)** và không kích hoạt `versions` không cần thiết trên Global để ngăn ngừa lỗi PostgreSQL Identifier length limit khiến server bị treo.

## 6. Chiến lược đồng bộ Cơ sở dữ liệu xuyên suốt dự án (DATABASE SYNC MANDATE):
- **Đồng bộ hóa trực tiếp qua `PAYLOAD_DB_PUSH=true`**:
  - Trong suốt quá trình phát triển và hoàn thiện dự án, hệ thống áp dụng cơ chế tự động đồng bộ Schema trực tiếp giữa mã nguồn và cơ sở dữ liệu Neon DB thông qua `PAYLOAD_DB_PUSH=true`.
  - Tuyệt đối không tạo các tệp migration thủ công (`migrate:create`) phức tạp gây xung đột hoặc lỗi schema (`relation does not exist`, `column does not exist`) giữa local và VPS/Railway.
  - Cả môi trường Local và Railway VPS đều kết nối chung vào Neon PostgreSQL với biến môi trường `PAYLOAD_DB_PUSH=true`. Khi deploy hoặc khởi động, Payload CMS sẽ tự động khớp cấu trúc bảng, thêm cột, tạo quan hệ an toàn và tức thì.

## 7. Git workflow (LOW-TOKEN & SAFETY MANDATE)
- Khi được yêu cầu commit/push, chỉ kiểm tra `git status` và diff của các file đã thay đổi.
- Không quét hoặc đọc lại toàn bộ repository nếu không cần thiết.
- Luôn tôn trọng `.gitignore` hiện có của dự án.
- Tuyệt đối không commit `.env`, secret, token, password, database dump hoặc file chứa thông tin nhạy cảm.
- Nếu phát hiện file nhạy cảm đang được Git track, phải dừng thao tác push và báo rõ trước khi tiếp tục.
- Không tự ý sửa thêm code nếu yêu cầu chỉ là commit/push.
- Commit message phải ngắn gọn, đúng nội dung thay đổi.
- Push lên branch hiện tại, trừ khi người dùng yêu cầu branch khác.

## 8. Task continuity / bàn giao giữa các AI agent
- Khi bắt đầu phiên làm việc mới, đọc `CURRENT-TASK.md` nếu file tồn tại và có tác vụ đang mở.
- Chỉ đọc `HANDOFF.md` khi cần tiếp tục công việc từ agent/phiên trước hoặc khi `CURRENT-TASK.md` yêu cầu.
- Khi bắt đầu hoặc thay đổi đáng kể một tác vụ, cập nhật `CURRENT-TASK.md` ngắn gọn: mục tiêu, trạng thái, file liên quan, việc còn lại và bước tiếp theo.
- Khi dừng giữa chừng hoặc chuyển sang agent/công cụ khác, cập nhật `HANDOFF.md` với quyết định đã chốt, phần đã làm, lỗi còn lại và bước tiếp theo.
- Khi tác vụ hoàn tất, đánh dấu hoàn thành trong `CURRENT-TASK.md`; không giữ trạng thái cũ gây hiểu nhầm cho phiên sau.
- Không dùng `CURRENT-TASK.md` hoặc `HANDOFF.md` thay cho `CHANGELOG.md`; `CHANGELOG.md` vẫn là nhật ký thay đổi chính thức.
- Không đọc toàn bộ `CHANGELOG.md` chỉ để khôi phục ngữ cảnh tác vụ hiện tại.
