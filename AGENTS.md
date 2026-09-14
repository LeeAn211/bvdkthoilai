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
- **6.1. Quy định về `PAYLOAD_DB_PUSH` trên môi trường Local:**
  - Ở môi trường Local thông thường, giữ `PAYLOAD_DB_PUSH=false` trong `.env` để Next.js khởi động tức thì (`✓ Ready in ~300ms`), ngăn chặn việc Drizzle Introspection quét toàn bộ cơ sở dữ liệu (`information_schema.table_constraints`) gây nghẽn pool kết nối hoặc lỗi timeout (`Error: timeout exceeded when trying to connect / table_name = 'site_settings'`).
- **6.2. Quy trình BẮT BUỘC khi thêm trường mới (`field`) hoặc thêm giá trị vào trường lựa chọn (`select` / `enum`):**
  - Trong PostgreSQL, các trường `select` của Payload CMS được lưu dưới dạng kiểu `enum` tĩnh (ví dụ `enum_our_experts_image_fit`, `enum_expert_items_image_fit`).
  - Khi thêm trường mới (như boolean, text, relationship) hoặc thêm tùy chọn vào trường select:
    1. **BẮT BUỘC phải chạy câu lệnh đồng bộ Schema an toàn vào PostgreSQL trước hoặc song song:**
       - Đối với cột mới: `ALTER TABLE <table_name> ADD COLUMN IF NOT EXISTS <column_name> <type> DEFAULT <default_value>;`
       - Đối với giá trị enum mới: `ALTER TYPE <enum_name> ADD VALUE IF NOT EXISTS '<new_value>';`
    2. Tuyệt đối không để `PAYLOAD_DB_PUSH=true` treo khi Drizzle cố gắng tái tạo kiểu enum trên PostgreSQL local (nhất là các phiên bản có giới hạn introspection).
    3. Sau khi cập nhật cột/enum thành công, giữ `PAYLOAD_DB_PUSH=false` để server chạy mượt mà và ổn định.
- **6.3. Tính nhất quán và an toàn dữ liệu:**
  - Tuyệt đối không tạo các tệp migration thủ công phức tạp (`migrate:create`) gây xung đột hoặc lỗi schema giữa local và production.
  - Khi triển khai lên môi trường VPS/Railway, nếu schema có bổ sung cột/enum mới, cần đảm bảo migration SQL an toàn tương tự được áp dụng đồng bộ trọn vẹn.

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

## 9. Definition of Done
Một task chỉ được xem là hoàn thành khi:
- Yêu cầu chính đã hoạt động đúng.
- Không cố ý làm hỏng hoặc thay đổi hành vi ngoài phạm vi yêu cầu.
- Đã chạy kiểm tra phù hợp với mức thay đổi.
- Đã cập nhật `CURRENT-TASK.md` với trạng thái cuối cùng.
- Đã cập nhật `CHANGELOG.md` nếu có thay đổi code, UI, cấu hình, logic hoặc schema.
- Nếu dừng giữa chừng hoặc bàn giao, đã cập nhật `HANDOFF.md`.
- Nếu có quyết định kiến trúc/quy ước dài hạn mới, đã cập nhật `DECISIONS.md`.

## 10. Scope control
- Không tự thêm tính năng ngoài yêu cầu hiện tại.
- Nếu phát hiện vấn đề khác không chặn task, ghi ngắn gọn vào `CURRENT-TASK.md` mục `Phát hiện thêm` và không tự sửa.
- Chỉ mở rộng phạm vi khi vấn đề đó chặn trực tiếp task hiện tại hoặc người dùng yêu cầu.
- Không refactor diện rộng chỉ để xử lý một lỗi nhỏ.
- Ưu tiên thay đổi nhỏ, có thể kiểm tra và dễ hoàn nguyên.

## 11. Decision log
- `DECISIONS.md` lưu các quyết định kiến trúc/quy ước đã chốt và lý do lựa chọn.
- Chỉ đọc `DECISIONS.md` khi task có khả năng thay đổi kiến trúc, quy ước hoặc quyết định đã tồn tại; không đọc mặc định cho mọi task.
- Không tự đảo ngược quyết định đã ghi nếu không có lý do kỹ thuật rõ ràng hoặc yêu cầu mới.
- `DECISIONS.md` không thay thế `CHANGELOG.md`.

## 12. Chuẩn mực thiết kế Hero Banner cho toàn bộ các trang nội dung (MANDATORY PAGE HERO DESIGN SYSTEM):
- **12.1. Mẫu thiết kế chuẩn mực thống nhất**:
  - Mọi trang danh mục, tra cứu, nội dung chuyên đề (như `/bac-si`, `/tin-tuc`, `/thong-bao`, `/dau-thau-mua-sam`, `/bang-gia`, `/van-ban`, `/chuyen-khoa`, `/lich-kham`, `/ky-thuat-chuyen-sau`, v.v.) và **TẤT CẢ CÁC THIẾT KẾ TRANG TIẾP THEO BẮT BUỘC PHẢI DÙNG CHUNG MẪU THIẾT KẾ HERO BANNER NÀY**.
  - **Component bắt buộc**: Dùng `<PageHero eyebrow="..." title="..." description="..." breadcrumb="..." />` từ `@/components/PageHero`.
- **12.2. Các thông số quy chuẩn bắt buộc**:
  - **Thanh Breadcrumb điều hướng**: Bắt buộc có dòng dẫn đường `Trang chủ / <Tên mục>` (`<nav className="page-hero-breadcrumb"> <Link href="/">Trang chủ</Link> / <span>{label}</span> </nav>`). Màu chữ `#bae6fd`, link `#e0f2fe`, hover sáng trắng `#ffffff` và gạch chân nhẹ.
  - **Khoảng cách & Kích thước (Compact & Balanced)**: Padding chuẩn y tế nhỏ gọn **`22px 0 20px`**, ôm sát nội dung, tuyệt đối không để khoảng đệm quá cao (không dùng padding > 40px) gây lãng phí diện tích màn hình.
  - **Màu nền Gradient nhận diện thương hiệu 3 lớp**: Bắt buộc dùng `linear-gradient(135deg, #072b4c 0%, #0754a8 55%, #0878d1 100%)` kết hợp hiệu ứng vầng sáng vi mô `radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 70%)` ở góc phải. Viền dưới mờ `1px solid rgba(255, 255, 255, 0.12)`.
  - **Tiêu đề (`h1`)**: Cỡ chữ chuẩn `26px`, font-weight `800`, màu trắng `#ffffff`, line-height `1.25`, áp dụng `text-wrap: balance`. Trên mobile responsive tối đa `24px`.
  - **Dòng mô tả (`p`)**: Cỡ chữ `14px`, màu xanh sáng `#e2f1fc`, line-height `1.5`, chiều rộng khung `max-width: 1000px`, trải dài tự nhiên và **tuyệt đối không để rớt từ mồ côi**.
  - **Nhãn Eyebrow**: Nếu có, in hoa thanh thoát (`12px`, font-weight `700`, màu `#bae6fd`, letter-spacing `0.5px`).

## 13. Nguyên tắc bắt buộc: Thiết kế trang xong PHẢI đưa vào Admin CMS (MANDATORY ADMIN CMS INTEGRATION):
- **13.1. Bắt buộc 100% trang mới phải quản trị được từ Admin CMS**:
  - Mỗi khi thiết kế hoặc xây dựng bất kỳ trang nào (trang danh mục, trang chức năng, trang hướng dẫn, v.v.), **TUYỆT ĐỐI KHÔNG ĐƯỢC DỪNG LẠI Ở VIỆC HARDCODE GIAO DIỆN**.
  - Bắt buộc phải đưa cấu hình quản trị của trang đó vào Admin CMS (Global `SiteSettings.ts` hoặc Global riêng tương ứng).
- **13.2. Các mục tối thiểu bắt buộc phải đưa vào Admin CMS**:
  - **Phần Banner Hero đầu trang**: `eyebrow` (nhãn nhỏ), `title` (tiêu đề trang), `description` (đoạn mô tả).
  - **Bảng Thông báo / Lưu ý quan trọng (Notice Banner)**: Checkbox bật/tắt (`showNoticeBanner`), `noticeTitle`, `noticeContent` (hỗ trợ xuống dòng tự do `white-space: pre-line`), `noticeAlign` (canh trái/giữa/đều).
  - **Công tắc bật/tắt độc lập từng khối (Granular Toggles)**: Tất cả các khối nội dung, danh mục, checklist, banner liên kết hoặc widget phụ trên trang đều phải có checkbox `show...` riêng biệt để người quản trị có thể chủ động ẩn/hiện theo nhu cầu thực tế.
- **13.3. Quy trình đồng bộ Database an toàn đi kèm**:
  - Khi thêm trường cấu hình mới vào Global, phải tuân thủ nghiêm ngặt **Mục 6 (DATABASE SYNC MANDATE)**:
    - Thêm cột bằng SQL an toàn (`ALTER TABLE <table_name> ADD COLUMN IF NOT EXISTS ...`).
    - Thêm kiểu enum nếu có bằng SQL an toàn (`IF NOT EXISTS`).
    - Giữ `PAYLOAD_DB_PUSH=false` để server chạy mượt mà, không gián đoạn kết nối.

## 14. Nguyên tắc bắt buộc: Chống lệch tên cột Database & Cô lập lỗi tải dữ liệu (DATABASE FIELD INTEGRITY & FAULT ISOLATION MANDATE):
- **14.1. Quy tắc đặt tên cột khi định nghĩa schema Payload CMS**:
  - Khi thêm trường vào một Group hoặc Fieldset trong Payload CMS (ví dụ group `examinationFlowPage` chứa trường `noticeAlign`):
    - **Tên cột vật lý trong PostgreSQL do Drizzle sinh ra luôn có dạng**: `<group_name>_<field_name>` (ví dụ `examination_flow_page_notice_align`).
    - **TUYỆT ĐỐI KHÔNG ĐẶT `dbName` TÙY TIỆN TRÊN TRƯỜNG CON CỦA GROUP** nếu không thật sự cần thiết, vì `dbName` trên trường con có thể bị Drizzle ghép tiền tố hoặc bỏ qua gây lệch tên cột giữa Drizzle query và lệnh SQL thực thi.
    - Nếu buộc phải chỉ định `dbName`, phải kiểm tra chính xác câu lệnh SQL `SELECT` mà Drizzle ORM sinh ra để thêm đúng tên cột đó vào database.
- **14.2. Bắt buộc kiểm tra truy vấn dữ liệu (`getGlobal` / `find`) ngay sau khi thêm trường**:
  - Sau khi thêm bất kỳ trường nào vào Global (`SiteSettings.ts`, `Footer.ts`, `ContactSettings.ts`, v.v.):
    - **BẮT BUỘC PHẢI CHẠY KIỂM TRA TRUY VẤN** (bằng script test hoặc truy cập trang quản trị) để xác nhận Drizzle ORM truy vấn bảng thành công, không gặp lỗi `column does not exist`.
    - Phải đồng bộ cả bảng chính (ví dụ `site_settings`) VÀ bảng phiên bản (ví dụ `_site_settings_v` với tiền tố `version_<column_name>`).
- **14.3. Nguyên tắc cô lập lỗi tải dữ liệu trên Trang chủ (Fault Isolation)**:
  - Trên Trang chủ (`src/app/(frontend)/page.tsx`), các truy vấn `getHomepage()`, `getGlobal('site-settings')`, các Collection (`news`, `notices`, `specialties`, v.v.) **BẮT BUỘC PHẢI ĐƯỢC CÔ LẬP LỖI ĐỘC LẬP** (dùng `.catch(...)` riêng từng promise thay vì để 1 lỗi nhỏ ở `site-settings` làm đổ vỡ toàn bộ khối `Promise.all` khiến biến `home.sections` bị mất).
  - Không bao giờ để lỗi cấu hình của 1 trang phụ làm biến mất các section trên Trang chủ.



