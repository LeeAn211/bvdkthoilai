# CURRENT TASK

## Trang thai: HOAN THANH - TÁI THIẾT KẾ KHỐI THÔNG BÁO THEO PHƯƠNG ÁN 3 (1 THẺ LỚN TRÁI + LIST HÀNG NGANG PHẢI)

### Đã hoàn thành:
1. **Triển khai Bố cục Phương án 3 cho Khối Thông báo & Editorial Grid**:
   - Chỉnh sửa `renderEditorialSection` cho mẫu `editorial-grid` trong `src/app/(frontend)/page.tsx`.
   - **Cột trái (1 Thẻ Lớn Nổi Bật - `editorialHeroCard`)**:
     - Tỷ lệ khung ảnh `16:9.6` góc bo 16px, badge danh mục nổi bật góc dưới ảnh.
     - Xóa triệt để lỗi dấu phẩy thừa trước ngày tháng (biểu tượng lịch SVG + ngày đăng rõ ràng).
     - Tiêu đề `h3` cỡ 18px đậm đà `#0f2e47`, đoạn tóm tắt 3 dòng, nút "Xem chi tiết thông báo →".
   - **Cột phải (Danh sách 4 hàng ngang - `editorialRowList`)**:
     - 4 thông báo phụ xếp hàng ngang gọn gàng, chia đều theo chiều cao cột trái.
     - Thumbnail 96x72px bên trái, badge chuyên mục nhỏ + ngày tháng, tiêu đề 2 dòng đậm đà, nút mũi tên tròn chỉ báo điều hướng.
2. **Cập nhật Styling & Responsive trong `30-home-editorial.css`**:
   - Cân đối tỷ lệ 2 cột `1.15fr : 1fr` với gap 22px, không còn khoảng trống thừa thị giác.
   - Hỗ trợ dàn 1 cột mượt mà trên Tablet (< 900px) và thu gọn thông số trên Mobile (< 600px).
3. **Kiểm tra chất lượng**:
   - `npx tsc --noEmit`: Đạt 0 lỗi.
   - Ghi nhận đầy đủ vào `CHANGELOG.md` theo Core Mandates.

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
