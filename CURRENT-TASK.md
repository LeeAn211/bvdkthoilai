# CURRENT TASK

## Trang thai: HOÀN THÀNH - KHẮC PHỤC HIỂN THỊ PHÂN CHIA TAB KHỐI CỔNG THÔNG TIN BỆNH VIỆN & THÔNG TIN KHÁM BỆNH (LỊCH KHÁM BỆNH)

### Đã hoàn thành theo yêu cầu người dùng:
1. **Khắc phục hiển thị phân chia theo từng Tab cho CỔNG THÔNG TIN BỆNH VIỆN (`src/app/(frontend)/page.tsx`):**
   - Thay thế việc kết xuất danh sách phẳng `renderEditorialSection` bằng `<HomeNewsTabs>` hoàn chỉnh.
   - Nhận diện chuyên mục chuẩn y tế bằng `categoryName(article)` (đồng bộ giữa `categoryRef` và `category`).
   - Tự động hiển thị các Tab chuyên mục (Tin bệnh viện, Tin y tế, Kiến thức sức khỏe, Hoạt động đoàn thể, hoặc các chuyên mục cấu hình trong CMS), phân loại từng bài viết vào đúng Tab chuyên mục thay vì gộp chung một danh sách.
   - Áp dụng đầy đủ chuẩn thiết kế **Phương án 3 (Tỷ lệ vàng gọn gàng)**: thẻ chính nổi bật bên trái (`editorialHeroCard`) và danh sách các tin kế tiếp bên phải (`editorialRowList`).

2. **Khắc phục hiển thị phân chia theo từng Tab cho THÔNG TIN KHÁM BỆNH - Lịch khám bệnh (`src/components/ScheduleExplorer.tsx` & `src/app/(frontend)/page.tsx`):**
   - Đảm bảo thanh chuyển Tab luôn hiển thị đầy đủ các tab chuẩn y tế:
     + **Lịch trực cấp cứu**
     + **Theo ngày** (kèm bộ lọc chọn ngày trực quan)
     + **Theo tuần**
     + **Lịch đính kèm** (ảnh/file bảng lịch)
   - Loại bỏ đoạn code lọc triệt tiêu các tab rỗng khiến thanh tab bị ẩn đi khi một số loại lịch chưa có bài. Giờ đây tất cả các tab luôn hiển thị trực quan, tab đầu tiên có dữ liệu được chọn mặc định; nếu bấm vào tab chưa có dữ liệu sẽ hiển thị thông báo rỗng nhẹ nhàng (`Chưa có lịch...`).
   - Đảm bảo các bài viết / lịch thuộc mode nào hiển thị đúng vào tab đó, không bị gộp lẫn vào nhau.

3. **Kiểm tra chất lượng & Tiêu chuẩn:**
   - `npx tsc --noEmit`: Đạt 0 lỗi biên dịch TypeScript.
   - Tuân thủ nghiêm ngặt Quy tắc Bắt buộc Dự án (Mandates 1, 2, 4, 5, 8, 9).
2. **Tài liệu - Văn bản & Đấu thầu - Mua sắm** (`documents` & `procurement` trong `page.tsx`):
   - Đã đồng bộ qua hàm `renderEditorialSection` dùng layout `editorialVariant3`.
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
