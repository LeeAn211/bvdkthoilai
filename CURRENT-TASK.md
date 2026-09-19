# CURRENT TASK

## Trang thai: HOÀN THÀNH - NÂNG CẤP TOÀN DIỆN ADMIN CHUYÊN KHOA (2 ẢNH LỚN/NHỎ & ICON TÙY BIẾN/DANH SÁCH)

### Đã hoàn thành theo yêu cầu người dùng:
1. **Quản trị 2 ảnh (Ảnh chính lớn + Ảnh phụ nhỏ 3D):**
   - Đưa vào Admin CMS (`Specialties.ts`):
     - `cover`: 🖼️ Ảnh đại diện chính (Ảnh lớn ở trên).
     - `subCover`: 🖼️ Ảnh phụ nổi 3D (Ảnh nhỏ góc dưới phải).
   - Khi hover/focus vào chuyên khoa nào trên trang chủ:
     - Ảnh lớn bên phải tự động chuyển sang ảnh chính (`cover`).
     - Ảnh nhỏ nổi 3D tự động chuyển sang ảnh phụ (`subCover`).
     - Nếu chưa upload ảnh, hệ thống tự động nạp ảnh nghệ thuật chuyên ngành mặc định cực đẹp.

2. **Quản trị Icon 2 chế độ linh hoạt:**
   - **Chế độ 1 - Chọn từ danh mục có sẵn (`icon`):** Cấp cứu & Hồi sức, Chẩn đoán hình ảnh, Xét nghiệm, Nhi khoa, Ngoại khoa, Nội khoa, Dược, Răng hàm mặt, YHCT & Phục hồi chức năng.
   - **Chế độ 2 - Tự tải ảnh Icon riêng (`iconCustomUpload`):** Cho phép tải lên file ảnh icon riêng (PNG/SVG nền trong suốt). Hệ thống tự động ưu tiên icon tải lên.

3. **Đóng gói Database Migration 045 chuẩn mực (Mandates 6, 14, 15):**
   - File migration: `scripts/db-migrations/20260919_045_add_sub_cover_and_custom_icon_to_specialties.mjs`.
   - Bổ sung các cột `sub_cover_id`, `icon_custom_upload_id` vào `specialties` và `version_sub_cover_id`, `version_icon_custom_upload_id` vào `_specialties_v`.
   - Đã seal DB schema contract (`npm run db:schema:seal`), check hợp lệ (`npm run db:schema:check`) và deploy an toàn tại local (45 applied, 0 pending), `PAYLOAD_DB_PUSH=false`.

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
