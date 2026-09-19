# DECISIONS

## 2026-09-19 — Least privilege cho các Global điều khiển toàn website

- Quyết định: Ba vai trò quản trị cấp cao (`super-admin`, `system-admin`, `admin`) tiếp tục có toàn quyền. `site-settings` không cấp quyền sửa mặc định cho bất kỳ role nghiệp vụ nào; `homepage` và `navigation` chỉ cấp quyền sửa mặc định cho `editor`/`reviewer`; `board` chỉ có quyền xem. Mọi ngoại lệ cho role nghiệp vụ phải được cấp rõ ràng qua ma trận permission của tài khoản.
- Lý do: Các Global này có blast radius toàn website; quyền sửa mặc định theo mọi role làm một tài khoản nghiệp vụ bị chiếm quyền có thể thay đổi nhận diện, menu hoặc toàn bộ trang chủ.
- Không chọn: Giữ default edit cho HR, tài chính, đấu thầu, lịch khám, tiêm chủng, quản lý chất lượng hoặc khoa/phòng chỉ để tương thích hành vi cũ.
- Tác động: Thu hẹp quyền mặc định nhưng không xóa cơ chế explicit permission và không thay đổi schema/database. Đây là điều chỉnh bảo mật cho quyết định ma trận quyền ngày 2026-09-14.

## 2026-09-18 — Chuẩn hóa bắt buộc công tắc bật/tắt độc lập và hỗ trợ thêm mới khối nội dung tùy biến (Custom Blocks) cho toàn bộ trang Admin CMS
- Quyết định:
  1. **Công tắc Bật/Tắt độc lập (Granular Toggles)**: Mọi khối nội dung lớn và từng phần tử con (cards, items, links, banner) trên tất cả các trang khi đưa vào hoặc nâng cấp trong Admin CMS **bắt buộc phải có trường checkbox `enabled` riêng biệt** để người quản trị chủ động ẩn/hiện theo nhu cầu thực tế.
  2. **Khối Bài viết Chi tiết (Detailed Article RichText)**: Các trang nội dung phải có khối bài viết chi tiết với trình soạn thảo RichText để biên soạn nội dung chuyên sâu trực tiếp từ CMS.
  3. **Thêm mới khối tùy biến không giới hạn (`customBlocks`)**: Mọi trang nội dung/chức năng phải hỗ trợ mảng `customBlocks` cho phép quản trị viên tự do thêm không giới hạn các khối nội dung mới (tiêu đề, mô tả, RichText, canh lề) trực tiếp trong CMS.
  4. **Cơ chế Fallback an toàn 2 lớp**: Luôn đảm bảo nếu CMS chưa nhập hoặc tắt bớt khối thì giao diện vẫn render đẹp mắt, không bao giờ lỗi runtime hoặc trắng trang.
- Lý do: Đáp ứng nhu cầu quản trị linh hoạt của bệnh viện, không phải phụ thuộc vào lập trình viên mỗi khi muốn tạm ẩn một dịch vụ hoặc bổ sung thêm một thông báo/nội dung mới trên trang.
- Không chọn: Hardcode thứ tự và số lượng khối cố định ngoài frontend khiến người quản trị không thể linh hoạt điều chỉnh nội dung hiển thị.
- Tác động: Cập nhật thành điều khoản bắt buộc trong `AGENTS.md` (Mục 13.2). Mọi tính năng trang mới hoặc chỉnh sửa trang cũ bắt buộc phải áp dụng chuẩn này.

## 2026-09-17 — Tách độc lập các trang chức năng/nội dung ra khỏi SiteSettings sang Global/Collection chuyên trách
- Quyết định: 
  1. Tất cả các trang nội dung, trang quy trình, hướng dẫn, tiện ích, dịch vụ y tế mới (hoặc nâng cấp) **TUYỆT ĐỐI KHÔNG NHỒI NHÉT VÀO SiteSettings** ("Cấu hình Website & Nhận diện").
  2. Mục `SiteSettings` chỉ giữ đúng chức năng cốt lõi toàn cục: Nhận diện thương hiệu (Logo, Tên BV, Slogan, Khẩu hiệu), Header, Footer, Chữ chạy Ticker, Cấu hình SMTP, Bản đồ Google Maps.
  3. Mọi trang mới bắt buộc phải tạo thành **Global hoặc Collection độc lập riêng biệt** và xếp vào đúng phân nhóm nghiệp vụ y tế trực quan trong Admin CMS (ví dụ: `🏥 Khám bệnh & Dịch vụ Y tế`, `💬 Chăm sóc người bệnh & Khảo sát`, `🛡️ Quản trị & Hệ thống`,...).
  4. Mọi trang mới phải có đầy đủ: Banner Hero, Bảng thông báo/lưu ý (Notice Banner) hỗ trợ xuống dòng tự do, Granular Toggles (checkbox enabled/show cho từng khối/widget con), và cơ chế Fallback an toàn 2 lớp chống trắng trang.
  5. Luôn đóng gói Database Migration tự động (`scripts/db-migrations/`), seal schema contract (`db:schema:seal`) và verify (`db:schema:check`) để tự động hóa 100% khi deploy Railway/VPS mà không cần gõ SQL thủ công.
- Lý do: Tránh làm phình to bảng `site_settings` gây nghẽn Drizzle introspection, giúp cây menu Admin CMS khoa học, dễ phân quyền granular cho từng khoa phòng/cán bộ chuyên trách quản trị đúng trang của mình.
- Không chọn: Tiếp tục gộp chung tất cả các trang vào một file `SiteSettings.ts` khổng lồ khiến menu Admin rối rắm và khó kiểm soát quyền hạn.
- Tác động: Cập nhật thành quy định bắt buộc vĩnh viễn tại Mục 13 trong `AGENTS.md`. Mọi AI agent và lập trình viên tiếp theo bắt buộc phải tuân thủ nghiêm ngặt khi xây dựng trang mới.

## 2026-09-15 — Chiến lược triển khai Production lên VPS (DevOps Strategy: Coolify & Docker)

- Quyết định: Chọn giải pháp **Coolify (Self-hosted PaaS trên nền tảng Docker)** làm phương án chính thức để triển khai hệ thống lên máy chủ VPS riêng biệt hoặc máy chủ dùng chung trong tương lai. Chi tiết lưu tại `docs/CHIEN-LUOC-TRIEN-KHAI-VPS.md`.
- Lý do: Đóng gói Docker container đồng nhất 100% môi trường dev/staging/prod, hỗ trợ cơ chế Rolling Update (Zero Downtime), có giao diện quản trị web trực quan, tích hợp sẵn tính năng tự động sao lưu database hàng ngày và tự động kéo code build/deploy ngay khi `git push origin main`.
- Không chọn: Chạy trực tiếp Node.js/PM2 thủ công trên VPS vì dễ bị xung đột phiên bản phần mềm hệ thống, dễ gây nghẽn CPU/RAM làm gián đoạn website khi đang build (`npm run build`), và khó theo dõi log giám sát.
- Tác động: Duy trì chất lượng tệp `Dockerfile` và script tự động migration `db-migrate.mjs` luôn sẵn sàng để triển khai lập tức khi có hạ tầng VPS từ bệnh viện.

## 2026-09-15 — Phòng thủ nhiều lớp cho GitHub → Railway → Neon

- Quyết định: `npm start` phải tự chạy migration idempotent ở `prestart`; Railway Pre-Deploy vẫn được dùng như lớp chạy sớm nhưng không còn là điểm cấu hình duy nhất quyết định database có được đồng bộ hay không.
- Quyết định: Mỗi Payload DB schema được gắn SHA-256 với migration mới nhất trong `scripts/db-schema-contract.json`; `prebuild` sinh lại schema và từ chối build nếu contract không khớp.
- Quyết định: Runtime có thể dùng Neon pooled `DATABASE_URL`, nhưng migration/DDL ưu tiên `DATABASE_MIGRATION_URL` hoặc `DATABASE_URL_UNPOOLED` và production từ chối hostname `-pooler`.
- Lý do: Push Git chỉ chuyển code; ba lớp build contract → migration startup → healthcheck bảo đảm code mới không nhận traffic trên schema Neon cũ, đồng thời Direct connection tránh giới hạn PgBouncer khi chạy DDL/advisory lock.
- Không chọn: Bật `PAYLOAD_DB_PUSH=true` trên production hoặc tự sao chép toàn bộ dữ liệu local lên Neon, vì hai cách này có thể phá/ghi đè dữ liệu thật.
- Tác động: Mọi thay đổi field/enum/bảng phải có migration mới, `generate:db-schema`, `db:schema:seal` và validation trước khi push; dữ liệu hệ thống mặc định/backfill phải viết idempotent trong migration.

## 2026-09-14 — Migration PostgreSQL bất biến trước khi triển khai Railway

- Quyết định: Quản lý schema production bằng các migration có phiên bản trong `scripts/db-migrations/`, ghi trạng thái và checksum vào `public.bvdk_schema_migrations`, dùng PostgreSQL advisory lock để chống hai deployment chạy đồng thời, và verify lại schema sau mỗi lần chạy.
- Quy trình triển khai ban đầu dùng Railway Pre-Deploy và `prestart` verify. Từ quyết định 2026-09-15, `prestart` tự apply + verify để loại bỏ phụ thuộc vào cấu hình Dashboard; luôn giữ `PAYLOAD_DB_PUSH=false` trên production.
- Lý do: Schema phải được cập nhật trước khi code mới nhận traffic, lỗi migration phải trả exit code khác 0 để Railway giữ deployment cũ, đồng thời checksum ngăn sửa ngược migration đã áp dụng.
- Không chọn: Tự động bật Payload schema push trên production, chạy SQL thủ công không ghi phiên bản, hoặc migration phá dữ liệu trong cùng lần deploy.
- Tác động: Mọi thay đổi field/enum/bảng mới phải đi kèm migration additive, id duy nhất và hàm `verify`; thay đổi lớn dùng chiến lược expand → backfill → contract qua nhiều deployment. Không thêm `railway.json` legacy; cấu hình Pre-Deploy trong Railway Dashboard hoặc IaC `.railway/railway.ts` sau khi liên kết dự án.

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

## 2026-09-14 — Phân quyền Admin theo ma trận module và thao tác

- Quyết định: Giữ quyền mặc định theo vai trò để tương thích dữ liệu cũ, đồng thời cho phép bật `useCustomPermissions` trên từng tài khoản để chỉ cấp đúng module/thao tác đã tích trong ma trận checkbox. Các vai trò `super-admin`, `system-admin`, `admin` luôn có toàn quyền làm lối khôi phục an toàn.
- Lý do: Cơ chế quyền bổ sung cũ không thể thu hồi quyền mặc định và trường module nhập tay dễ sai. Ma trận chuẩn hóa giúp phân quyền theo nhu cầu thực tế, đồng thời access server và menu Admin dùng chung một kết quả kiểm tra.
- Không chọn: Thay toàn bộ quyền cũ bằng cấu trúc bảng mới hoặc cho phép thu hồi quyền của ba vai trò quản trị cấp cao, vì dễ làm mất tương thích dữ liệu và tự khóa hệ thống.
- Tác động: Thay đổi role/status/phạm vi/ma trận quyền sẽ xóa phiên đăng nhập cũ của tài khoản để JWT và menu nhận quyền mới ngay; khi triển khai database mới phải có cột `users.use_custom_permissions boolean default false`.

Không dùng file này thay cho `CHANGELOG.md`; chỉ ghi các quyết định có tính định hướng lâu dài.

