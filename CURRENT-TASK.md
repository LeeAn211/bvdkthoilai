# CURRENT-TASK

## Mục tiêu
Tách độc lập toàn bộ các trang nội dung bài viết và cấu hình dành cho người bệnh ra khỏi mục "Cấu hình Website & Nhận diện" (`SiteSettings`), chuyển sang đúng các phân nhóm chuyên môn trong Admin CMS (`🏥 Khám bệnh & Dịch vụ Y tế` và `💬 Chăm sóc người bệnh & Khảo sát`), đồng thời ẩn/dọn sạch các trường này trong `SiteSettings`.

## Trạng thái: HOÀN THÀNH

## Files liên quan
- `src/globals/ExaminationFlowSettings.ts` [NEW]
- `src/globals/InpatientGuideSettings.ts` [NEW]
- `src/globals/CheckupPackagesSettings.ts` [NEW]
- `src/globals/HospitalMapSettings.ts` [NEW]
- `src/globals/HospitalQualitySettings.ts` [NEW]
- `src/globals/SurveyPageSettings.ts` [NEW]
- `src/globals/FaqPageSettings.ts` [NEW]
- `src/globals/FormsPageSettings.ts` [NEW]
- `src/globals/FeedbackPageSettings.ts` [NEW]
- `src/globals/SiteSettings.ts` [MODIFY]
- `payload.config.ts` [MODIFY]
- `src/app/(frontend)/quy-trinh-kham-benh/page.tsx` [MODIFY]
- `src/app/(frontend)/dieu-tri-noi-tru/page.tsx` [MODIFY]
- `src/app/(frontend)/goi-kham/page.tsx` [MODIFY]
- `src/app/(frontend)/so-do-benh-vien/page.tsx` [MODIFY]
- `src/app/(frontend)/chat-luong-benh-vien/page.tsx` [MODIFY]
- `src/app/(frontend)/khao-sat/page.tsx` [MODIFY]
- `src/app/(frontend)/khao-sat/ngoai-tru/page.tsx` [MODIFY]
- `src/app/(frontend)/khao-sat/noi-tru/page.tsx` [MODIFY]
- `src/app/(frontend)/khao-sat/nhan-vien/page.tsx` [MODIFY]
- `src/app/(frontend)/hoi-dap/page.tsx` [MODIFY]
- `src/app/(frontend)/bieu-mau/page.tsx` [MODIFY]
- `src/app/(frontend)/gop-y/page.tsx` [MODIFY]
- `scripts/db-migrations/20260917_022_create_independent_patient_care_globals_tables.mjs` [NEW]
- `scripts/db-schema-contract.json` [MODIFY]
- `CHANGELOG.md` [MODIFY]
- `CURRENT-TASK.md` [MODIFY]

## Kết quả đạt được
1. **Tách riêng 9 mục Global độc lập vào đúng phân nhóm chuẩn y tế trong Admin CMS:**
   - **Phân nhóm `🏥 Khám bệnh & Dịch vụ Y tế`:**
     - `Trang Quy trình Khám bệnh` (`examination-flow-settings`)
     - `Trang Hướng dẫn Điều trị Nội trú` (`inpatient-guide-settings`)
     - `Trang Gói Khám Sức khỏe & Tầm soát` (`checkup-packages-settings`)
     - `Trang Sơ đồ & Chỉ dẫn Khoa/Phòng` (`hospital-map-settings`)
     - `Trang Cổng người bệnh` (`patient-portal-settings`)
   - **Phân nhóm `💬 Chăm sóc người bệnh & Khảo sát`:**
     - `Trang Chất lượng Bệnh viện` (`hospital-quality-settings`)
     - `Trang Khảo sát Ý kiến` (`survey-page-settings`)
     - `Trang Hỏi đáp Y tế (FAQ)` (`faq-page-settings`)
     - `Trang Biểu mẫu Điện tử` (`forms-page-settings`)
     - `Trang Góp ý – Phản ánh` (`feedback-page-settings`)
2. **Dọn sạch mục "Cấu hình Website & Nhận diện" (`SiteSettings`):**
   - Đã đặt `admin: { hidden: true }` cho toàn bộ các group: `examinationFlowPage`, `qualityPage`, `surveyPage`, `faqPage`, `formsPage`, `patientPortalPage`, `inpatientPage`, `checkupPackagesPage`, `hospitalMapPage`.
   - Admin CMS mục "Cấu hình Website & Nhận diện" giờ đây thanh thoát, chuyên biệt chỉ dành cho: Logo, Tên BV, Slogan, Header, Footer, Chữ chạy Ticker, Email SMTP, Google Maps.
3. **Cơ chế tải dữ liệu Frontend với fallback 2 lớp an toàn:**
   - Các trang frontend ưu tiên đọc dữ liệu từ Global độc lập mới tương ứng.
   - Nếu Global mới chưa có dữ liệu cấu hình, tự động fallback về dữ liệu trong `siteSettings` hoặc dữ liệu mẫu y tế mặc định.
4. **Đồng bộ Cơ sở dữ liệu và Schema Contract tự động:**
   - Tạo migration `20260917_022_create_independent_patient_care_globals_tables.mjs`.
   - Đã deploy và verify thành công trên PostgreSQL.
   - Seal schema contract và kiểm tra `npm run db:schema:check` đạt 100% hợp lệ.
   - Toàn bộ các trang frontend và trang Admin `/admin` đều phản hồi mã `200 OK`.
