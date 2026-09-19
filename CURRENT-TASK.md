# CURRENT TASK

## Trạng thái: HOÀN THÀNH — TÁCH RIÊNG HOTLINE CẤP CỨU VÀ SỐ TƯ VẤN TRONG ADMIN CMS

- Mục tiêu:
  1. Tách riêng 2 số điện thoại: **Số điện thoại Cấp cứu 24/24** và **Số điện thoại Hỗ trợ tư vấn / Tổng đài tiếp đón** trong Admin CMS để quản trị viên dễ dàng cấu hình độc lập.
  2. Đồng bộ hiển thị trên Header, Mobile Quick Drawer (`MobileTopBar`) và Thanh điều hướng chân trang di động (`MobileBottomNav`).
  3. **Ràng buộc Git**: Giữ tại máy local, **chưa đưa lên GitHub** cho đến khi có yêu cầu cụ thể từ người dùng.
- Đã hoàn thành:
  - `src/globals/SiteSettings.ts`: Gom 2 trường `emergencyHotline` và `hotline` vào 1 hàng ngang (row 50/50), đặt label nhận diện trực quan:
    - `emergencyHotline`: "🚨 Số điện thoại CẤP CỨU 24/24 (Đường dây nóng khẩn cấp)"
    - `hotline`: "📞 Số điện thoại HỖ TRỢ TƯ VẤN / Tổng đài tiếp đón"
  - `src/globals/ContactSettings.ts`: Gom 2 trường vào row 50/50 tương tự trong mục Thông tin liên hệ cơ bản.
  - `src/components/MobileTopBar.tsx`: Thêm prop `emergencyHotline`, tách `cleanEmergency` cho nút Cấp cứu và `cleanPhone` cho số tư vấn.
  - `src/components/SiteHeader.tsx`: Truyền độc lập `emergency` và `hotline` vào `MobileTopBar`.
  - `src/components/MobileBottomNav.tsx`: Thêm prop `emergencyHotline`, nút Cấp cứu ưu tiên gọi đúng số Cấp cứu.
  - `src/app/(frontend)/layout.tsx`: Truyền cả 2 số vào `MobileBottomNav`.
- Kiểm tra:
  - `npx tsc --noEmit` hoàn tất: mã thoát 0, không có bất kỳ lỗi TypeScript nào.
  - `npm run db:schema:check`: Schema contract hợp lệ với migration `20260919_051_site_settings_hotline_defaults`.
  - `npm run build`: Production build hoàn thành xuất sắc 42/42 static pages.
- Database/Schema:
  - Tạo migration `scripts/db-migrations/20260919_051_site_settings_hotline_defaults.mjs` cập nhật default cho các cột hotline.
  - Đã seal schema contract vào `scripts/db-schema-contract.json`.
- Git: Sẵn sàng commit và push lên GitHub.

---

- Mục tiêu: xác nhận production build với remediation PR-01–PR-08 và schema contract migration 050.
- An toàn: đã xác nhận local `PAYLOAD_DB_PUSH=false`; không chạy migration, seed hoặc thao tác ghi database.
- Giới hạn: build local không thay thế staging runtime, secret rotation, backup và migration verification.
- Kết quả: `npm run build` đạt; Next.js compile/TypeScript thành công và generate đủ 42/42 static pages; schema contract migration 050 hợp lệ.
- Ghi chú: local không có `SMTP_PASS`, nên build dùng console email adapter; môi trường production phải cấu hình SMTP secret đã rotate.
- Database: `PAYLOAD_DB_PUSH=false`; không chạy migration hoặc thay đổi database.
- Bước tiếp theo: thực hiện các blocker vận hành còn lại trong `SECURITY_RELEASE_GATE.md` trên staging/production (rotation, backup, migration 049/050, HTTP/role smoke tests).

---

## Trạng thái: HOÀN THÀNH STATIC RE-AUDIT — SECURITY RELEASE VẪN HOLD

- Mục tiêu: kiểm chứng độc lập lại toàn bộ 1 P0/8 P1 sau PR-01–PR-08 và lập checklist phát hành có điều kiện.
- Phạm vi: source/field access/custom API/Payload REST, migration contract, static quality gates và tài liệu vận hành.
- Không thực hiện: không truy cập production, không rotate credential thay người dùng, không backup hay chạy migration/database.
- Kết quả: 8 nhóm P1 đã có code control và không thấy đường cũ còn mở; P0 chỉ đóng phần code, vẫn chờ rotate/revoke credential và deploy migration 049/050.
- Artifact: `SECURITY_RELEASE_GATE.md` ghi đầy đủ blocker, smoke test và điều kiện GO.
- Kiểm tra: `validate:all`, TypeScript, schema contract và diff check đạt; migration validation 229/229.
- Database/production: chưa truy cập, chưa backup, chưa chạy migration, chưa rotate credential.
- Bước tiếp theo: người vận hành hoàn tất mục 2–4 trong `SECURITY_RELEASE_GATE.md` trên staging/production; chỉ sau đó mới đánh giá GO.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-08: LEAST-PRIVILEGE GLOBALS

- Mục tiêu: thu hẹp quyền mặc định với Site Settings, Navigation và Homepage; role nghiệp vụ chỉ được truy cập khi có explicit custom permission.
- Chính sách: Site Settings không có default edit ngoài elevated admin; Homepage/Navigation chỉ editor/reviewer mặc định được edit; board chỉ view.
- Database/schema: không thay đổi schema, không chạy migration.
- Đã hoàn thành: Site Settings không còn default edit cho role nghiệp vụ; Homepage/Navigation edit mặc định chỉ editor/reviewer, board chỉ view; explicit custom permission vẫn hoạt động.
- Kiểm tra: TypeScript và foundation đạt; system-hardening 28/28; `git diff --check` đạt.
- Quyết định dài hạn: đã ghi vào `DECISIONS.md`.
- Bước tiếp theo: rà lại toàn bộ P0/P1 sau PR-01 đến PR-08, đối chiếu endpoint/field access còn sót và lập release gate vận hành cho secret rotation + migration 049/050.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-07: AI OCR ACCESS & RESOURCE CONTROLS

- Mục tiêu: khóa AI lịch trực OCR bằng session/quyền `schedules.import`; giới hạn request, MIME, file size, tần suất và timeout Gemini.
- Phạm vi: route `ai-schedule-ocr`, UI chọn ảnh Admin và regression check system hardening.
- Database/schema: không thay đổi schema, không chạy migration.
- Đã hoàn thành: auth + `schedules.import`, body/file/MIME/signature limits, rate limit theo user/IP, Gemini timeout/output limit, response redaction, output bounds và audit log.
- Kiểm tra: TypeScript đạt; system-hardening 25/25; `git diff --check` đạt.
- Bước tiếp theo: PR-08 thu hẹp quyền mặc định của role nghiệp vụ đối với Site Settings, Navigation và Homepage theo least privilege.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-06: SURVEY INGESTION BOUNDARY

- Mục tiêu: chặn tạo trực tiếp phiếu/câu trả lời khảo sát qua Payload REST; chỉ custom submit route đã kiểm tra body, rate limit và Turnstile được ghi dữ liệu bằng server-side privileged operation.
- Phạm vi: `SurveyResponses`, `SurveyAnswers`, route submit và kiểm tra hồi quy API/TypeScript.
- Database/schema: không thay đổi schema, không chạy migration.
- Đã hoàn thành: hai collection response/answer từ chối mọi direct create; public submission chỉ ghi qua custom route đã kiểm tra bằng privileged Local API.
- Kiểm tra: TypeScript, quality-surveys và `git diff --check` đạt; bổ sung regression check riêng cho ingestion boundary.
- Bước tiếp theo: PR-07 bảo vệ AI OCR bằng authentication, permission, MIME/size/rate limit và timeout/quota controls.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-05: DOCUMENT ACCESS SERVER-SIDE

- Mục tiêu: không serialize PIN/direct protected media URL; xác minh PIN/internal access ở server và cấp token ngắn hạn để stream file.
- Phạm vi: Documents, ClinicalProtocols, SiteSettings PIN field access, detail pages/component, document access/file API, media restriction hook và migration 050.
- Database: chỉ tạo/seal migration; không deploy migration trong lượt này.
- Đã hoàn thành: HMAC token 5 phút, server-side PIN/internal authorization, file proxy R2/local, khóa field PIN, loại PIN/direct media URL khỏi client, hook media restricted và migration 050.
- Kiểm tra: TypeScript và DB schema contract đạt; migration 050 hợp lệ. `validate:migrations` còn 2 lỗi legacy ở migration 020/032, không phát sinh từ PR-05.
- Chưa thực hiện: chưa cấu hình secret production, chưa deploy migration 049/050, chưa thay đổi database.
- Bước tiếp theo: cấu hình `DOCUMENT_ACCESS_SECRET`/`DOCUMENT_DEFAULT_PIN` trên môi trường đích, backup DB, rồi chạy migration 049/050 theo quy trình vận hành được phê duyệt.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-04: TRA CỨU PHẢN ÁNH

- Mục tiêu: xóa tra cứu phone-only; bắt buộc mã tiếp nhận + số điện thoại và dùng response đồng nhất chống enumeration.
- File chính: `src/app/(frontend)/api/feedback/route.ts`, `src/components/FeedbackLookup.tsx`.
- Database/schema: không thay đổi schema, không chạy migration.
- Đã hoàn thành: xóa phone-only API/UI, bắt buộc code + phone, response không khớp đồng nhất, rate limit theo IP và fingerprint cặp tra cứu.
- Kiểm tra: TypeScript và `git diff --check` đạt; không còn frontend caller phone-only.
- Bước tiếp theo: PR-05 chuyển bảo vệ tài liệu/PIN hoàn toàn sang server-side.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-03: SURVEY PUBLIC/ADMIN SEPARATION

- Mục tiêu: public chỉ nhận thống kê tổng hợp đã giảm nguy cơ tái nhận dạng; export, recent comments và template management yêu cầu quyền `surveys`.
- File chính: survey statistics/export/templates routes, `PublicSurveyStatistics`, `SurveyQuickToolbar`.
- Database/schema: không thay đổi schema, không chạy migration.
- Đã hoàn thành: public aggregate có suppression nhóm nhỏ; recent comments/export/template details và mutations được khóa bằng quyền `surveys`; gỡ public export UI; thêm export limit/audit.
- Kiểm tra: TypeScript và `git diff --check` đạt.
- Bước tiếp theo: PR-04 sửa tra cứu phản ánh phone-only bằng cơ chế xác minh an toàn.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING PR-02: EXPORT LỊCH HẸN

- Mục tiêu: bắt buộc xác thực và quyền `appointments.export`, giới hạn khoảng ngày/số bản ghi và ghi audit log cho export chứa dữ liệu cá nhân.
- File chính: `src/app/(frontend)/api/appointments-export/route.ts`, `src/components/admin/AppointmentsDashboard.tsx`.
- Database/schema: không thay đổi schema, không chạy migration.
- Đã hoàn thành: authorization theo `appointments.export`, validation status/ngày, giới hạn 366 ngày và 5.000 bản ghi, audit log, nhãn UI 90 ngày.
- Kiểm tra: TypeScript và `git diff --check` đạt.
- Bước tiếp theo: PR-03 tách API khảo sát public aggregate khỏi export/PII dành cho admin.

---

## Trạng thái: HOÀN THÀNH CODE — SECURITY HARDENING ĐỢT 0 + PR-01; CHỜ VẬN HÀNH

- Mục tiêu: khóa đường lộ credential SMTP/Gemini, chuyển runtime sang environment-only và đóng gói migration làm sạch dữ liệu legacy.
- Phạm vi hiện tại: `.env.example`, `SiteSettings`, `ScheduleSettings`, API OCR, generated Payload schema/types, migration 049 và kiểm thử liên quan.
- Không thực hiện: rotate credential trên dịch vụ bên ngoài, deploy production hoặc chạy migration vào database.
- Đã hoàn thành: khóa field credential legacy, chuyển OCR sang environment-only, tạo/seal migration 049 và kiểm tra tĩnh.
- Chưa thực hiện: migration chưa deploy; credential cũ chưa được revoke/rotate trên nhà cung cấp.
- Bước tiếp theo: backup database, rotate credential, cấu hình secret mới trên staging/production, sau đó chạy migration 049 và verify trước khi sang PR-02.

---
 
## Trạng thái: HOÀN THÀNH - KHÓA CHUỘT PHẢI TRÌNH XEM PDF & THIẾT KẾ LẠI TRANG CHI TIẾT VĂN BẢN / PHÁC ĐỒ

### Đã hoàn thành theo yêu cầu người dùng:
1. **Bảo mật Overlay Trình xem PDF (khoá chuột phải hoàn toàn):**
   - Thêm `viewerSecurityOverlay` bao phủ toàn vùng iframe khi `!canDownload`.
   - Overlay trong suốt (`background: transparent`, `z-index: 10`) chặn sự kiện `contextmenu` — menu "Lưu dưới dạng / In" của Chrome/Edge không còn xuất hiện dù click chuột phải trực tiếp vào PDF.
   - Thêm prop `hideHeader?: boolean` vào `DocumentDetailView` để ẩn tiêu đề bên trong khi nhúng vào `ArticleDetailTemplate`.
2. **Thiết kế lại trang chi tiết Văn bản (`/van-ban/[slug]`) giống trang chi tiết tin tức:**
   - Dùng `ArticleDetailTemplate` chuẩn y tế: Hero xanh gradient thương hiệu + breadcrumb + layout 3 cột (share / content / sidebar).
   - `DocumentDetailView doc={docData} hideHeader` nhúng vào `customBodyTop` – tiêu đề nằm trên dải Hero, nội dung bảo mật nằm trong cột chính.
   - Sidebar: Văn bản mới nhất + Banner CMS.
   - Khối Văn bản liên quan dưới chân trang.
3. **Thiết kế lại trang chi tiết Phác đồ điều trị (`/phac-do-dieu-tri/[slug]`) giống trang chi tiết tin tức:**
   - Cùng cấu trúc `ArticleDetailTemplate` — breadcrumb `Trang chủ / Phác đồ điều trị / Chuyên khoa`.
   - Sidebar: Phác đồ mới nhất + Banner CMS.
4. **Kiểm tra chất lượng:**
   - `npx tsc --noEmit`: **0 lỗi TypeScript**.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

---



### Đã hoàn thành theo yêu cầu người dùng:
1. **Bổ sung trường cấu hình số cột linh hoạt trong Admin CMS (`Homepage.ts`):**
   - Thêm trường lựa chọn `documentColumns` vào các section văn bản (`type === 'documents'`) trong Trang chủ (`Homepage.ts`).
   - Cung cấp 3 tùy chọn trực quan:
     + **3 nội dung / hàng (Mặc định)**: Bố cục 3 cột hồ sơ truyền thống, chữ to rộng rãi.
     + **4 nội dung / hàng (Gọn gàng)**: Hiển thị 4 thẻ văn bản cân đối trên 1 hàng.
     + **5 nội dung / hàng (Tối ưu mật độ)**: Hiển thị 5 thẻ văn bản trên 1 hàng, hiển thị tối đa nhiều văn bản mà không bị tràn dọc.
2. **Tối ưu CSS & Giao diện thích ứng (Responsive Layout):**
   - Lưới thẻ `.homeDocDossierGrid` tự động nhận class `cols-3`, `cols-4`, `cols-5` tương ứng cấu hình trong Admin.
   - Khi ở chế độ 4 hoặc 5 cột:
     + Tự động tinh chỉnh tỉ lệ padding thẻ (`12px 14px` cho header, `10px 14px` cho body, `8px 14px` cho footer).
     + Kích thước icon đính kèm PDF co giãn vừa vặn (`38px x 42px` cho 5 cột).
     + Tiêu đề văn bản `13.5px`, tóm tắt nội dung `11.5px` tinh gọn, vừa khít khung thẻ, không rớt từ mồ côi.
     + Responsive mượt mà: Màn hình lớn (>=1200px) đủ 5 cột; Màn hình laptop (<1200px) tự động co về 4 cột; Màn hình tablet (<=992px) co về 2 cột; Màn hình điện thoại (<=640px) hiển thị 1 cột.
3. **Đóng gói Database Migration 048 chuẩn mực (Mandates 6, 14, 15):**
   - File migration: `scripts/db-migrations/20260919_048_add_document_columns_to_homepage_sections.mjs`.
   - Tạo enum `enum_homepage_sections_document_columns` (`'3'`, `'4'`, `'5'`) và enum bảng version.
   - Thêm cột `document_columns` vào bảng `homepage_sections` và `_homepage_v_version_sections`.
   - Đã sinh lại schema, seal DB schema contract và deploy an toàn (48 applied, 0 pending), `PAYLOAD_DB_PUSH=false`.
4. **Tuân thủ chỉ thị cốt lõi:**
   - **TUYỆT ĐỐI KHÔNG ĐƯA LÊN GITHUB** theo yêu cầu người dùng.
5. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: Đạt **0 lỗi TypeScript**.
   - `npm run validate:homepage-seo-search`: **20/20 checks PASS**.
   - HTTP localhost:3000: **200 OK**.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md) và [CURRENT-TASK.md](file:///j:/bvdkthoilai-main/CURRENT-TASK.md).

4. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Kiểm tra HTTP live response: 200 OK.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

3. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Đã kiểm tra trực tiếp phản hồi HTTP localhost:3000: Render đầy đủ khối ghép đôi, 10 thẻ thông báo và 4 thẻ gói thầu mua sắm.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

3. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

4. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

4. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

3. **Điều hướng chuẩn y tế:**
   - Thanh điều hướng gồm 2 nút tròn `<` và `>` canh giữa sắc nét, kết hợp bộ đếm vị trí trang.

4. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

3. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

4. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

3. **Kiểm tra chất lượng:**
   - `npx tsc --noEmit`: 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).

3. **Đóng gói Database Migration 043 chuẩn mực (Mandates 6, 14, 15):**
   - File migration: `scripts/db-migrations/20260919_043_add_expert_display_layout_to_homepage.mjs`.
   - Tạo enum `enum_homepage_sections_expert_display_layout` và `enum__homepage_v_version_sections_expert_display_layout`.
   - Thêm cột `expert_display_layout` vào bảng `homepage_sections` và `_homepage_v_version_sections`.
   - Đã seal DB schema và migrate thành công (43 applied, 0 pending).

4. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: Đạt 0 lỗi TypeScript.
   - `npm run validate:homepage-seo-search`: 20/20 checks PASS.
   - Cập nhật đầy đủ vào [CHANGELOG.md](file:///j:/bvdkthoilai-main/CHANGELOG.md).
3. **Lịch trực - Lịch khám bệnh** (`ScheduleExplorer.tsx` & `schedules` trong `page.tsx`):
   - Áp dụng đầy đủ cho Lịch trực cấp cứu, Lịch đính kèm, Lịch theo ngày và theo tuần.
4. **Thông tin tiêm ngừa** (`VaccinationTabs.tsx`):
   - Tab **"Thông báo lịch tiêm"** và tab **"Tiêm ngừa theo đợt"** dùng chuẩn `editorialHeroCard` + `editorialRowList`.
   - Tab **"Các loại vắc xin"** giữ nguyên dạng 3 card chuyên dụng có giá tiêm và nút đăng ký.
5. **Hoạt động khoa học** (`HomeScienceTabs.tsx` & `science` trong `page.tsx`):
   - Chuyển `ScienceCard` sang mô hình `editorialHeroCard` + `editorialRowItem` với icon `🔬` tinh tế.
6. **Kiểm tra chất lượng**:
   - `npx tsc --noEmit`: Đạt 0 lỗi.
   - Cập nhật đầy đủ `CHANGELOG.md` và `CURRENT-TASK.md`.

## Tong ket 4 Dot Toi uu He thong Admin CMS:
1. **ĐỢT 1: HỢP NHẤT CHATBOT & KHẢO SÁT & GÓP Ý**:
   - Chuyển toàn bộ cấu hình giao diện, logo, màu sắc, phím tắt vào `ChatbotSettings.ts`.
   - Ẩn nhóm `websiteAssistant` trùng lặp trong `SiteSettings.ts`.
   - Gộp `SurveyResponses` vào trung tâm `SurveyCampaigns` kèm nút mở bảng thô.
   - Ẩn `FeedbackCases` trùng lặp, giữ `Feedback` làm trung tâm quản lý tiếp nhận phản ánh duy nhất.
   - Đóng gói & triển khai Migration Database 038 an toàn.

2. **ĐỢT 2: KHÁM BỆNH & DỊCH VỤ Y TẾ**:
   - Ẩn `ServicePrices` khỏi menu ngoài, tích hợp nút "Xem lịch sử biến động giá" trực tiếp trên thanh công cụ `ServicesExcelImport`.
   - Ẩn `VaccinePrices` khỏi menu ngoài, tập trung nhập giá vắc xin trực tiếp trong `Vaccines`.
   - Nhóm Khám bệnh trở nên mạch lạc và rõ ràng.

3. **ĐỢT 3: TỔ CHỨC NHÂN SỰ & CHUYÊN KHOA**:
   - Ẩn `OurExperts` khỏi menu, chấm dứt việc nhập bác sĩ 2 lần.
   - Nâng cấp `Doctors.ts` thành **"Đội ngũ Bác sĩ & Chuyên gia"** kèm cột công tắc `showOnHome` ở bảng ngoài.
   - Ẩn `ScientificActivityGroups` khỏi menu chính, giữ `ScientificActivities` làm trung tâm bài viết nghiên cứu.

4. **ĐỢT 4: TRANG CHỦ & CẤU HÌNH WEBSITE (SITESETTINGS)**:
   - Ẩn các nhóm trang con cũ khỏi `SiteSettings` (`lichTrucPage`, `scienceActivityPage`, `clinicalProtocolPage`).
   - Đưa `SiteSettings` về đúng chức năng cốt lõi: Nhận diện thương hiệu (Logo, Tên viện, Slogan, Màu sắc, Hotline, Email SMTP, Bản đồ, Mã PIN bảo mật).
   - 100% dữ liệu database được bảo toàn nguyên vẹn.

## Kiem thu chat luong:
- `npm run typecheck`: **0 loi**.
- `npm run db:schema:check` & `npm run db:migrate:status`: **Hop le 100% (38 applied, 0 pending)**.



## Da hoan thanh
1. Cấu hình Schema Admin CMS (Mandate 13.2):
   - Thêm nhóm `contentBlock` (gồm `enabled`, `title`, `subtitle`, `content` RichText, `textAlign`) với tiêu đề và mô tả mẫu chuẩn y tế Bệnh viện Đa khoa Khu vực Thới Lai.
   - Thêm mảng `customBlocks` (`dbName` ngắn gọn < 60 ký tự: `pps_custom_blocks`, `efs_custom_blocks`, `igs_custom_blocks`, `cps_custom_blocks`, `hms_custom_blocks`, `hqs_custom_blocks`) cho phép thêm không giới hạn các khối bài viết bổ sung.
2. Đóng gói Migration Database 031 (Mandate 6 & 15):
   - Sinh schema mới: `npm run generate:db-schema` (tạo `src/payload-generated-schema.ts`).
   - Tạo Migration `scripts/db-migrations/20260918_031_add_content_and_custom_blocks_to_patient_care_globals.mjs` tạo đầy đủ cột, bảng phụ mảng, enum và verify.
   - Seal contract: `npm run db:schema:seal -- 20260918_031_add_content_and_custom_blocks_to_patient_care_globals`.
   - Kiểm tra contract: `npm run db:schema:check` (hợp lệ 100%).
   - Triển khai an toàn: `npm run db:migrate:deploy` (31 applied, 0 pending).
3. Đóng gói Migration Database 032 - Sửa triệt để lỗi lưu Global (Mandate 6, 14 & 15):
   - Thiết lập ràng buộc `ON DELETE CASCADE` cho tất cả các bảng mảng con lồng nhau (`pps_svc_items`, `examination_flow_settings_flow_tabs_steps`, `ef_steps`), ngăn chặn lỗi duplicate key `23505` (ValidationError: Lỗi - Field sau không hợp lệ: id).
   - Gỡ bỏ `NOT NULL` (DROP NOT NULL) trên các cột cũ của `hospital_map_settings_floors` (`level`, `name`, `departments`) và `checkup_packages_settings_packages` (`name`, `target`, `price`, `features`).
   - Bổ sung 4 cột toggle cho `hospital_quality_settings` (`show_quality_cards`, `show_dimensions`, `show_programs`, `show_feedback_box`) và đồng bộ các cột `val`, `unit`, `code`, `title`, `percent`, `highlights`.
   - Tạo Migration `scripts/db-migrations/20260918_032_fix_patient_care_globals_cascade_fk_and_columns.mjs`.
   - Seal contract: `npm run db:schema:seal -- 20260918_032_fix_patient_care_globals_cascade_fk_and_columns`.
   - Kiểm tra contract: `npm run db:schema:check` (hợp lệ 100%).
   - Triển khai: `npm run db:migrate:deploy` (32 applied, 0 pending).
4. Giao diện Frontend & Styling:
   - Thêm CSS chuẩn y tế trong `src/app/styles/patient-care.css`: `.patientCareArticleCard`, `.patientCareCustomBlockCard`, `.patientCareCustomKicker`,...
   - Cập nhật 5 trang frontend (`/dieu-tri-noi-tru`, `/goi-kham`, `/so-do-benh-vien`, `/quy-trinh-kham-benh`, `/danh-cho-nguoi-benh`, `/chat-luong-benh-vien`) render bài viết RichText và danh sách customBlocks linh hoạt theo cấu hình CMS.
5. Kiểm thử chất lượng toàn diện:
   - Toàn bộ 6/6 Global cập nhật `updateGlobal` thành công 100% (0 lỗi).
   - `npm run typecheck` đạt 0 lỗi.
   - Toàn bộ 6 trang Admin CMS đều trả về HTTP 200 OK.
   - Toàn bộ 6 trang Frontend đều trả về HTTP 200 OK và hiển thị bài viết chi tiết mượt mà.

## File lien quan
- `src/globals/PatientPortalSettings.ts` [MODIFY]
- `src/globals/InpatientGuideSettings.ts` [MODIFY]
- `src/globals/CheckupPackagesSettings.ts` [MODIFY]
- `src/globals/HospitalMapSettings.ts` [MODIFY]
- `src/globals/ExaminationFlowSettings.ts` [MODIFY]
- `src/globals/HospitalQualitySettings.ts` [MODIFY]
- `scripts/db-migrations/20260918_031_add_content_and_custom_blocks_to_patient_care_globals.mjs` [NEW]
- `scripts/db-migrations/20260918_032_fix_patient_care_globals_cascade_fk_and_columns.mjs` [NEW]
- `scripts/db-schema-contract.json` [MODIFY]
- `src/payload-generated-schema.ts` [MODIFY]
- `src/app/styles/patient-care.css` [MODIFY]
- `src/app/(frontend)/dieu-tri-noi-tru/page.tsx` [MODIFY]
- `src/app/(frontend)/goi-kham/page.tsx` [MODIFY]
- `src/app/(frontend)/so-do-benh-vien/page.tsx` [MODIFY]
- `src/app/(frontend)/quy-trinh-kham-benh/page.tsx` [MODIFY]
- `src/app/(frontend)/danh-cho-nguoi-benh/page.tsx` [MODIFY]
- `src/app/(frontend)/chat-luong-benh-vien/page.tsx` [MODIFY]
- `CURRENT-TASK.md` [MODIFY]
- `CHANGELOG.md` [MODIFY]

## Viec con lai
Khong
