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

## 2026-09-14 — Chuẩn hóa mẫu thiết kế Hero Banner (Page Hero Design System) cho toàn bộ website
- Quyết định: Thống nhất một mẫu Hero Banner duy nhất cho toàn bộ các trang nội dung, danh mục, tra cứu hiện tại và tất cả trang phát triển tiếp theo; chuẩn hóa thông qua component `@/components/PageHero`.
- Quy cách chuẩn:
  1. Breadcrumb: `Trang chủ / <Tên trang>` (`#bae6fd`, link `#e0f2fe`, hover `#ffffff`).
  2. Kích thước: Padding nhỏ gọn `22px 0 20px`, ôm sát nội dung.
  3. Màu nền: Gradient 3 lớp `#072b4c` -> `#0754a8` -> `#0878d1` + vầng sáng vi mô `radial-gradient`.
  4. Typography: Tiêu đề `26px` (mobile `24px`), font-weight `800`, màu trắng. Mô tả `14px`, màu `#e2f1fc`, `max-width: 1000px`, `text-wrap: balance` chống rớt từ mồ côi.
- Lý do: Loại bỏ sự rời rạc giữa các trang, tạo nhận diện thương hiệu y tế cao cấp, tiết kiệm diện tích màn hình để người dùng lập tức tiếp cận nội dung chính bên dưới mà không phải cuộn quá nhiều.
- Không chọn: Mỗi trang tự viết banner hero riêng lẻ với màu sắc, kích thước và padding khác nhau gây mất đồng bộ và rối mắt.
- Tác động: Mọi trang mới hoặc trang refactor sau này đều phải áp dụng component `<PageHero />` theo đúng quy chuẩn Mục 12 trong `AGENTS.md`.

## 2026-09-14 — Bắt buộc đưa toàn bộ trang mới vào hệ thống quản trị Admin CMS
- Quyết định: Thiết kế bất kỳ trang giao diện mới nào (như trang quy trình, tra cứu, hướng dẫn, tiện ích) đều bắt buộc phải đưa nhóm cấu hình quản trị tương ứng vào Admin CMS (trong `SiteSettings.ts` hoặc Global chuyên trách), không được hardcode giao diện tĩnh.
- Quy cách chuẩn:
  1. Hero Banner: `eyebrow`, `title`, `description`.
  2. Bảng thông báo lưu ý đầu trang: Checkbox bật/tắt, tiêu đề, nội dung xuống dòng tự do (`white-space: pre-line`), canh lề văn bản.
  3. Granular Toggles: Checkbox bật/tắt độc lập từng khối nội dung/widget con trên trang.
  4. Đồng bộ DB: Luôn chạy SQL an toàn (`IF NOT EXISTS`) đồng bộ cột và enum trong PostgreSQL, giữ `PAYLOAD_DB_PUSH=false`.
- Lý do: Đảm bảo Ban Giám đốc và cán bộ quản trị website có toàn quyền cập nhật thông tin, thay đổi câu chữ và điều chỉnh hiển thị mà không cần can thiệp vào mã nguồn lập trình.
- Không chọn: Hardcode văn bản và cấu trúc tĩnh ngoài mã nguồn frontend, khiến quản trị viên không thể chỉnh sửa khi bệnh viện có thay đổi chính sách/thời gian.
- Tác động: Bổ sung Mục 13 vào `AGENTS.md`, ràng buộc mọi agent và lập trình viên phải thực hiện song song việc thiết kế giao diện và tích hợp quản trị Admin CMS.

## 2026-09-14 — Chống lệch tên cột Database & Cô lập lỗi tải dữ liệu (Field Integrity & Fault Isolation)
- Quyết định: 
  1. Khi thêm trường mới vào Group/Fieldset của Payload CMS, tên cột PostgreSQL luôn tuân theo quy tắc `<group_name>_<field_name>`. Tuyệt đối không đặt `dbName` tùy tiện ở trường con trong group để tránh Drizzle ORM sinh câu lệnh SELECT lệch với tên cột vật lý.
  2. Bắt buộc test truy vấn `getGlobal` / `find` ngay sau khi tạo trường mới để đảm bảo Drizzle kết nối thành công trước khi kết thúc task.
  3. Trên Trang chủ (`page.tsx`), áp dụng cơ chế cô lập lỗi độc lập (fault isolation) cho từng promise truy vấn (`.catch(...)`) để một lỗi cấu hình nhỏ ở một trang phụ không bao giờ được làm sập hay ẩn các section khác của Trang chủ.
- Lý do: Ngăn chặn lỗi cascade khiến dữ liệu trang chủ bị rơi vào fallback hoặc gián đoạn hiển thị các chuyên mục quan trọng của bệnh viện.
- Không chọn: Để `Promise.all` gộp chung mà không catch riêng lẻ; đặt `dbName` tùy ý trên các field con của group.
- Tác động: Ghi thành Mục 14 bắt buộc trong `AGENTS.md`.

Không dùng file này thay cho `CHANGELOG.md`; chỉ ghi các quyết định có tính định hướng lâu dài.

