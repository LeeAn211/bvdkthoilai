# NHẬT KÝ THAY ĐỔI DỰ ÁN (PROJECT CHANGELOG & DATABASE UPDATES)

## [2026-09-16] - Thiết kế Tối ưu Trải nghiệm Mobile Chuẩn Medpro.vn: Clean Header & Bottom Action Bar 5 Tab

- **Thời gian thực hiện:** 20:05 (Asia/Saigon)
- **Yêu cầu:** 
  1. Khắc phục dứt điểm hiện tượng lỗi giao diện trên điện thoại hiển thị thanh menu và thanh "Danh mục điều hướng" bị đè lấn chồng chéo lên banner và dải thông báo chạy chữ.
  2. Tái cấu trúc chuẩn trải nghiệm người dùng theo mô hình ứng dụng y tế thông minh Medpro.vn trên điện thoại:
     - **Phần Header đầu trang**: Ẩn triệt để thanh menu ngang cồng kềnh trên mobile (`max-width: 900px`), giữ lại phần Masthead nhận diện thương hiệu bệnh viện sạch sẽ, trang nhã.
     - **Thanh Bottom Action Bar cố định dưới đáy**: Nâng cấp lên layout 5 tab chuẩn Medpro:
       1. **Trang chủ**: Về trang chủ bệnh viện.
       2. **Lịch khám**: Xem lịch khám, lịch trực bác sĩ.
       3. **Đặt khám**: Nút FAB nổi bật ở trung tâm với vòng tròn xanh gradient và icon dấu `+`, dẫn trực tiếp đến cổng đặt khám Medpro.
       4. **Danh mục**: Nút icon ☰ mở bảng Drawer trượt mượt mà chứa đầy đủ toàn bộ hệ thống menu, khoa phòng, dịch vụ với Accordion đa tầng.
       5. **Cấp cứu**: Nút đỏ gọi trực tiếp số điện thoại cấp cứu 24/7 của bệnh viện.
- **Nội dung thực hiện:**
  - `src/components/MobileBottomBar.tsx` (MỚI):
    - Client component 5 tab chuẩn phong cách Medpro.vn, tích hợp nút FAB Đặt khám nhô cao và nút Danh mục phát sự kiện tùy biến `toggle-mobile-drawer`.
  - `src/components/SiteFooter.tsx`:
    - Thay thế thanh action bar cũ bằng `MobileBottomBar`, truyền động URL đặt khám Medpro và số hotline cấp cứu.
  - `src/components/MobileNavHeader.tsx`:
    - Bổ sung Event Listener lắng nghe các sự kiện `toggle-mobile-drawer`, `open-mobile-drawer`, `close-mobile-drawer` để điều khiển Drawer đóng/mở mượt mà từ Bottom Bar.
  - `src/app/styles/mobile-medpro.css` (MỚI):
    - Ẩn hoàn toàn `.mainHeader` trên màn hình nhỏ (< 900px) để loại bỏ mọi xung đột hiển thị.
    - Định kiểu thanh 5 tab cố định dưới đáy, nút FAB Đặt khám, và toàn bộ Drawer trượt từ cạnh phải có backdrop blur cao cấp.
  - `src/app/(frontend)/layout.tsx`:
    - Tích hợp `mobile-medpro.css` vào hệ thống styles của toàn bộ website.
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: Đạt 0 lỗi TypeScript.
  - Giao diện mobile chuẩn mực, sạch đẹp, không còn lỗi chồng lấn, mang lại trải nghiệm giống hoàn toàn ứng dụng Medpro.



- **Thời gian thực hiện:** 19:30 (Asia/Saigon)
- **Yêu cầu:** 
  1. Khắc phục dứt điểm hiện tượng thanh menu trên điện thoại bị di chuyển ngang, trôi dạt hoặc gãy dòng cồng kềnh khi có nhiều menu.
  2. Áp dụng chuẩn thiết kế tốt nhất và thẩm mỹ nhất cho website bệnh viện:
     - Thanh điều hướng mobile chỉ chiếm 1 hàng cố định nhỏ gọn 48px với nút "Trang chủ" và nút nổi bật **"DANH MỤC"**.
     - Khi bấm vào "DANH MỤC", một bảng Drawer trượt ra mượt mà từ cạnh phải màn hình với nền mờ cao cấp (`backdrop-filter`).
     - Các chuyên mục lớn được phân cấp rõ ràng; các chuyên mục có cấp con (như Tổ chức, Tin tức...) hỗ trợ đóng/mở dạng Accordion (+ / -) nhẹ nhàng, tiện lợi, không trôi trượt.
     - Phía dưới Drawer có sẵn nút liên hệ khẩn cấp "CẤP CỨU 24/7: 02923.686.115".
- **Nội dung thực hiện:**
  - `src/components/MobileNavHeader.tsx`:
    - Bổ sung `mobileBarRow` dành riêng cho điện thoại (< 900px) với nút Trang chủ và nút kích hoạt Drawer.
    - Xây dựng component `mobileDrawerWrap` với hiệu ứng trượt cubic-bezier, header mang nhận diện thương hiệu bệnh viện, danh sách danh mục Accordion đóng/mở từng nhóm và nút gọi cấp cứu nhanh.
    - Thêm cơ chế khóa cuộn trang (`body.style.overflow = 'hidden'`) khi Drawer đang mở để trải nghiệm lướt menu mượt mà tuyệt đối.
  - `src/components/SiteHeader.module.css`:
    - Định nghĩa bộ CSS chuyên dụng cho Mobile Bar Row và Mobile Drawer (`mobileDrawerBackdrop`, `mobileDrawerWrap`, `drawerGroup`, `drawerSubList`).
    - Bảo toàn 100% giao diện desktop (`min-width: 901px`).
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: Đạt 0 lỗi TypeScript.
  - Giao diện mobile hiển thị sang trọng, cố định, không trôi dạt, mở đóng danh mục trơn tru.


## [2026-09-16] - Áp dụng Cơ chế Kế thừa Thông tin Đơn vị Dùng chung (Global Fallback) cho Toàn bộ Website

- **Thời gian thực hiện:** 19:15 (Asia/Saigon)
- **Yêu cầu:** 
  1. Áp dụng đồng bộ cho toàn bộ hệ thống website: Nếu từng bài viết, tài liệu, gói thầu, hoạt động khoa học, tuyển dụng hoặc bác sĩ có nhập thông tin đơn vị/nguồn/cơ quan ban hành riêng thì hiển thị thông tin riêng đó.
  2. Nếu không nhập (để trống), hệ thống tự động kế thừa thông tin chung của đơn vị được cấu hình trong Admin CMS (`SiteSettings.hospitalName`, `contact-settings`, v.v.).
  3. Khi quản trị viên thay đổi Tên đơn vị / Bệnh viện trong Admin CMS, toàn bộ các mục không nhập riêng trên toàn trang web sẽ tự động cập nhật ngay lập tức theo tên mới.
- **Nội dung thực hiện:**
  - `src/components/ArticleDetailTemplate.tsx`:
    - Bổ sung prop `hospitalName?: string` vào giao diện template chuẩn.
    - Cập nhật logic phân giải nguồn bài viết: `finalSourceName = sourceName || hospitalName || displayConfig?.defaultSourceName || 'Bệnh viện Đa khoa Khu vực Thới Lai'`.
  - `src/app/(frontend)/tin-tuc/[slug]/page.tsx`: Truy vấn `site-settings` và truyền `hospitalName` động vào template bài viết tin tức.
  - `src/app/(frontend)/thong-bao/[slug]/page.tsx`: Truy vấn `site-settings` và truyền `hospitalName` động vào template bài thông báo.
  - `src/app/(frontend)/dau-thau-mua-sam/[slug]/page.tsx`: Phân giải `contactUnit` tự động fallback theo `siteSettings.hospitalName`, truyền `hospitalName` động vào template.
  - `src/app/(frontend)/hoat-dong-khoa-hoc/[slug]/page.tsx`: Truy vấn `site-settings` và truyền `hospitalName` động vào template hoạt động khoa học.
  - `src/app/(frontend)/tuyen-dung/[slug]/page.tsx`: Tự động kế thừa `hospitalName` cho trường Khoa/Phòng phụ trách và nguồn bài viết tuyển dụng.
  - `src/app/(frontend)/noi-dung/[sectionSlug]/[slug]/page.tsx`: Truy vấn `site-settings` và truyền `hospitalName` động cho mọi custom post.
  - `src/app/(frontend)/[...path]/page.tsx`: Truy vấn `site-settings` và truyền `hospitalName` động cho mọi routing đa cấp.
  - `src/app/(frontend)/bac-si/page.tsx` & `src/app/(frontend)/bac-si/[slug]/page.tsx`: Subtitle, đơn vị công tác và phần trích yếu bio của bác sĩ tự động kế thừa `siteSettings.hospitalName` khi chưa chọn khoa phòng.
  - `src/app/(frontend)/so-do-to-chuc/page.tsx`: Mô tả PageHero tự động kế thừa `siteSettings.hospitalName`.
  - `src/app/(frontend)/gioi-thieu/page.tsx`: Đoạn giới thiệu tổng quan tự động kế thừa `siteSettings.hospitalName`.
  - `src/app/(frontend)/lich-kham/page.tsx`: Mô tả PageHero tra cứu lịch khám tự động kế thừa `siteSettings.hospitalName`.
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: 0 lỗi TypeScript.
  - Không có bất kỳ lỗi biên dịch runtime nào.

## [2026-09-16] - Tách riêng Chuyên trang Phác đồ điều trị khỏi Văn bản và Bổ sung Menu con chuyên biệt

- **Thời gian thực hiện:** 18:55 (Asia/Saigon)
- **Yêu cầu:** 
  1. Tách riêng phần Phác đồ điều trị với phần Văn bản: Trang `/van-ban` chỉ quản lý và hiển thị các văn bản hành chính, quyết định, quy chế, biểu mẫu; không hiển thị lẫn phác đồ chuyên môn.
  2. Trang `/phac-do-dieu-tri` hiển thị toàn bộ tất cả phác đồ điều trị chuyên môn, nâng cấp giao diện tra cứu dạng Bảng công văn chuẩn y tế (`DocumentDirectoryView`) có lọc theo Chuyên khoa (Nội, Ngoại, Sản, Nhi, Cấp cứu...).
  3. Bổ sung liên kết Menu con chuyên biệt cho "Phác đồ điều trị" trên thanh điều hướng chính (`SiteHeader.tsx`) tại cả mục "Tổ chức & Chuyên khoa" và "Tin tức & Công khai" để bác sĩ, người dùng truy cập trực tiếp 1-click.
- **Nội dung thực hiện:**
  - `Tự động thừa kế thông tin đơn vị dùng chung`: Trên các trang chi tiết và danh mục Phác đồ điều trị (`/phac-do-dieu-tri`), Văn bản (`/van-ban`), nếu bài viết không nhập cơ quan ban hành (`issuer`), hệ thống tự động lấy tên đơn vị mặc định từ trường `hospitalName` trong Cài đặt Hệ thống (`SiteSettings.ts`). Khi người quản trị đổi tên bệnh viện ở cài đặt chung, tất cả bài viết chưa nhập sẽ tự động cập nhật đồng bộ.
  - `src/components/MobileNavHeader.tsx`: Loại bỏ hoàn toàn dòng liên kết mặc định `Xem tất cả {item.label}` trong bảng menu con (`navDropdown`) để menu gọn gàng, người dùng bấm trực tiếp vào từng mục con mong muốn.
  - `src/components/SiteHeader.tsx`: Bổ sung menu con "Phác đồ điều trị" (`/phac-do-dieu-tri`) vào khối danh mục Tổ chức & Chuyên khoa và khối Tin tức & Công khai.
  - `src/app/(frontend)/van-ban/page.tsx`: Loại bỏ truy vấn gộp sang collection `clinical-protocols`, bảo toàn tính độc lập của kho văn bản điều hành.
  - `src/app/(frontend)/phac-do-dieu-tri/page.tsx`: Nâng cấp toàn diện sử dụng component `DocumentDirectoryView`, hiển thị đầy đủ số hiệu, chuyên khoa áp dụng, ngày ban hành, huy hiệu bảo mật `🔒 Mã PIN` / `Chỉ xem` và chế độ xem linh hoạt (Bảng danh sách hoặc Lưới thẻ).
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: 0 lỗi TypeScript.
  - HTTP 200 OK trên cả `/van-ban` và `/phac-do-dieu-tri`.

## [2026-09-16] - Triển khai Cơ chế Bảo mật Mã PIN & Chế độ Cho xem trực tuyến nhưng Cấm tải về cho Phác đồ điều trị và Văn bản

- **Thời gian thực hiện:** 18:47 (Asia/Saigon)
- **Yêu cầu:**
  1. Xử lý yêu cầu chỉ cho phép một số người được tải về hoặc copy các file phác đồ điều trị và văn bản khi website chưa có cổng đăng nhập riêng cho nhân viên.
  2. Triển khai phương án tối ưu: Mã PIN xác thực nội bộ kết hợp hệ thống chặn toàn diện xem trước, tải file, in PDF và chống copy chữ.
  3. Hỗ trợ đầy đủ công tắc linh hoạt: "Cho xem tài liệu nhưng KHÔNG ĐƯỢC TẢI VỀ" (`allowDownload` bật/tắt độc lập với `showViewer`).
  4. Nếu tài liệu cài mã PIN: Chặn hoàn toàn trình xem trước (iframe), chặn nút Tải về, chặn in (`Ctrl + P` / `@media print`), chặn chuột phải và chặn sao chép (`Ctrl + C`, `Ctrl + S`).
- **Nội dung thực hiện:**
  - **1. Mở rộng CMS Schema (`ClinicalProtocols.ts`, `Documents.ts`, `SiteSettings.ts`)**:
    - `accessMode`: 'public' (Công khai), 'pin' (Yêu cầu Mã PIN bảo mật), 'internal' (Nội bộ y tế), 'locked' (Khóa hoàn toàn chỉ xem trích yếu).
    - `pinCode`: Mã PIN riêng cho từng phác đồ/văn bản (nếu để trống tự động nhận mã PIN chung của viện).
    - `allowDownload`: Công tắc bật/tắt quyền tải file (Tắt: người dùng xem được tài liệu nhưng không thể tải file gốc).
    - `showViewer`: Công tắc bật/tắt trình đọc tài liệu PDF/Word trực tuyến.
    - `preventCopy`: Bật để kích hoạt chặn chọn chữ, chặn chuột phải, chặn phím tắt.
    - `defaultDocumentPin`: Cấu hình Mã PIN chung toàn viện trong Cài đặt Hệ thống (`SiteSettings.ts`, mặc định `BVTL2026`).
  - **2. Database Migration & Schema Contract (`20260916_019_add_document_security_pin_fields`)**:
    - Tạo các kiểu enum PostgreSQL: `enum_clinical_protocols_access_mode`, `enum_documents_access_mode`.
    - Thêm các cột `access_mode`, `pin_code` vào `clinical_protocols`, `_clinical_protocols_v`, `documents`, `_documents_v`.
    - Thêm cột `default_document_pin` vào `site_settings`, `_site_settings_v`.
    - Sinh lại schema Payload: `npm run generate:db-schema`.
    - Seal schema contract: `npm run db:schema:seal -- 20260916_019_add_document_security_pin_fields`.
    - Triển khai migration: `npm run db:migrate:deploy` (19 applied, 0 pending).
  - **3. Cập nhật Frontend Components**:
    - `DocumentProtection.tsx`: Nâng cấp chặn phím tắt `Ctrl + P`, chặn sự kiện `window.onbeforeprint`, ẩn hoàn toàn nội dung khi cố tình in thông qua `@media print`.
    - `DocumentDetailView.tsx`: Tích hợp màn hình khóa bảo mật `lockedViewerCard` và form xác thực mã PIN, modal mở khóa nhanh khi bấm Tải về, lưu phiên làm việc trong `sessionStorage`, kiểm soát quyền tải độc lập `canDownload`.
    - `DocumentDirectoryView.tsx`: Thêm nhãn nhận diện `🔒 Mã PIN` và `Chỉ xem` ngay tại bảng danh sách văn bản và phác đồ.
    - `van-ban/[slug]/page.tsx` & `phac-do-dieu-tri/[slug]/page.tsx`: Kết nối và nạp mã PIN mặc định từ `SiteSettings`.
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: 0 lỗi TypeScript.
  - `npm run db:schema:check`: Schema contract hợp lệ (Migration 019).
  - `npm run db:migrate:deploy`: 19/19 applied thành công.
  - HTTP status `/van-ban` & `/phac-do-dieu-tri`: 200 OK.

## [2026-09-16] - Thiết kế và tích hợp tự động 3 trang chuyên mục người bệnh: Nội trú, Gói khám, Sơ đồ bệnh viện

- **Thời gian thực hiện:** 18:12 (Asia/Saigon)
- **Yêu cầu:** 
  1. Thiết kế 3 trang chuyên mục quan trọng và cần thiết nhất cho người bệnh:
     - Hướng dẫn Nhập viện & Điều trị Nội trú (`/dieu-tri-noi-tru`)
     - Gói Khám Sức khỏe & Tầm soát Bệnh lý (`/goi-kham`)
     - Sơ đồ Chỉ dẫn Khoa/Phòng & Tiện ích công cộng (`/so-do-benh-vien`)
  2. Tự động gắn các tab mới vào thanh điều hướng nhanh `PatientCareSubNav` xuyên suốt tất cả các trang người bệnh.
  3. Tự động gắn các thẻ dịch vụ tiện ích mới vào Cổng người bệnh `/danh-cho-nguoi-benh`.
  4. Quản trị 100% nội dung, tiêu đề, thông báo, các bước, giá gói khám, khoa phòng từ Admin CMS (`SiteSettings.ts`).
  5. Đóng gói database migration tự động, tuân thủ nghiêm ngặt quy chuẩn PostgreSQL và schema contract.
- **Nội dung thực hiện:**
  - **1. Mở rộng CMS Schema trong Global `SiteSettings.ts` (`src/globals/SiteSettings.ts`)**:
    - Nhóm `inpatientPage`: Tiêu đề, mô tả, thông báo lưu ý (`ip_not_align`), quy trình 4 bước nhập viện (`ip_steps`), 3 khung giờ thăm bệnh (`ip_hours`), danh mục đồ dùng cá nhân & trang thiết bị BV cấp phát (`ip_items`).
    - Nhóm `checkupPackagesPage`: Tiêu đề, mô tả, thông báo lưu ý trước khi khám (`pkg_not_align`), danh sách các gói khám sức khỏe (`chk_pkgs`) với huy hiệu, đối tượng, giá niêm yết, danh mục kỹ thuật và nút đăng ký.
    - Nhóm `hospitalMapPage`: Tiêu đề, mô tả, thông báo chỉ dẫn (`map_not_align`), danh sách sơ đồ phân tầng khoa phòng (`hm_floors`), và các tiện ích công cộng (`hm_facils`: Nhà thuốc GPP, Cổng Cấp cứu 24/24, Căn tin, ATM, Bãi xe, Xe lăn miễn phí).
  - **2. Database Migration & Schema Contract (`20260916_018_add_inpatient_packages_map_tables`)**:
    - Tạo các kiểu enum PostgreSQL an toàn: `ip_not_align`, `pkg_not_align`, `map_not_align`.
    - Bổ sung các cột vào `site_settings` và `_site_settings_v`: `inpatient_page_...`, `checkup_packages_page_...`, `hospital_map_page_...`.
    - Tạo 6 bảng vật lý chính và 6 bảng phiên bản lịch sử: `ip_steps`, `ip_hours`, `ip_items`, `chk_pkgs`, `hm_floors`, `hm_facils` và `_v`.
    - Sinh lại schema: `npm run generate:db-schema` (cập nhật `src/payload-generated-schema.ts`).
    - Seal schema contract: `npm run db:schema:seal -- 20260916_018_add_inpatient_packages_map_tables`.
    - Triển khai migration thành công: `npm run db:migrate:deploy` (18 applied, 0 pending).
  - **3. Tự động gắn vào hệ thống (Auto-linking)**:
    - `src/components/PatientCareSubNav.tsx`: Tự động gắn thêm 3 tab `noi-tru`, `goi-kham`, `so-do`.
    - `src/app/(frontend)/danh-cho-nguoi-benh/page.tsx`: Tự động bổ sung 3 thẻ card tiện ích mới vào danh mục dịch vụ.
  - **4. Xây dựng giao diện Frontend chuẩn y tế**:
    - `src/app/(frontend)/dieu-tri-noi-tru/page.tsx`: Giao diện chuẩn với Hero banner, Notice banner, timeline 4 bước nhập viện, thẻ khung giờ thăm bệnh, checklist đồ dùng và banner hotline.
    - `src/app/(frontend)/goi-kham/page.tsx`: Giao diện thẻ gói khám hiện đại với giá niêm yết, checklist kỹ thuật, huy hiệu nổi bật và nút đăng ký khám.
    - `src/app/(frontend)/so-do-benh-vien/page.tsx`: Giao diện phân tầng khoa phòng và lưới tiện ích công cộng (giờ mở cửa, vị trí).
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: 0 lỗi TypeScript.
  - `npm run db:schema:check`: Schema contract hợp lệ.
  - `npm run db:migrate:status`: 18/18 applied.
  - HTTP status cả 3 trang mới và portal: 200 OK.

## [2026-09-16] - Đưa toàn bộ bài viết, nội dung các tab và khối thông tin Dành cho người bệnh vào Admin CMS

- **Thời gian thực hiện:** 17:00 (Asia/Saigon)
- **Yêu cầu:** 
  1. Đưa toàn bộ nội dung bài viết, các bước hướng dẫn, chỉ số chất lượng, khối thông tin trên tất cả các tab thuộc khối Dành cho người bệnh vào Admin CMS để người quản trị có thể tự do chỉnh sửa, bật/tắt hoặc thêm mới.
  2. Áp dụng cho các trang: Quy trình khám bệnh (`/quy-trinh-kham-benh`), Chất lượng bệnh viện (`/chat-luong-benh-vien`), Góp ý phản ánh (`/gop-y` & `/gop-y/tra-cuu`), Khảo sát (`/khao-sat`), Biểu mẫu điện tử (`/bieu-mau`).
  3. Bổ sung đồng bộ tab Quy trình khám bệnh vào thanh chuyển hướng `PatientCareSubNav`.
- **Nội dung thực hiện:**
  - **1. Mở rộng CMS Schema trong Global `SiteSettings.ts` (`src/globals/SiteSettings.ts`)**:
    - `examinationFlowPage`: Bổ sung quản trị các tab quy trình `flowTabs` (bảng `ef_tabs`, `ef_steps`) với các bước chi tiết (`step`, `title`, `location`, `timeEstimate`, `desc`, `actions`, `note`, `isHighlight`, `isEmergency`), danh mục giấy tờ `checklists` (bảng `ef_checks`), danh mục đối tượng ưu tiên `priorities` (bảng `ef_prios`).
    - `qualityPage`: Bổ sung quản trị 4 thẻ chỉ số chất lượng `statCards` (bảng `qp_stats`), 5 nhóm tiêu chuẩn Bộ Y tế `dimensions` (bảng `qp_dims`), và các chương trình cải tiến `programs` (bảng `qp_progs` với enum `qp_icon_t`).
    - `surveyPage`: Bổ sung quản trị các khối nguyên tắc/tiện ích khảo sát `infoBoxes` (bảng `sv_boxes`).
    - `formsPage`: Bổ sung quản trị các khối tiện ích biểu mẫu `infoBoxes` (bảng `fm_boxes`).
    - `feedbackPage`: Tạo mới nhóm quản trị trang Góp ý - Phản ánh gồm Hero banner, Notice banner (`fb_not_align`), và các khối thông tin tiện ích `infoBoxes` (bảng `fb_boxes`).
  - **2. Database Migration & Schema Contract (`20260916_017_add_patient_care_content_tables`)**:
    - Tạo các kiểu enum PostgreSQL: `qp_icon_t` ('blue', 'green', 'amber'), `fb_not_align` ('left', 'center', 'justify').
    - Thêm các cột cho `site_settings` và `_site_settings_v`: `feedback_page_eyebrow`, `feedback_page_title`, `feedback_page_description`, `feedback_page_show_notice_banner`, `feedback_page_notice_title`, `feedback_page_notice_content`, `feedback_page_notice_align`.
    - Tạo 10 bảng vật lý chính và 10 bảng phiên bản lịch sử: `ef_tabs`, `ef_steps`, `ef_checks`, `ef_prios`, `qp_stats`, `qp_dims`, `qp_progs`, `sv_boxes`, `fm_boxes`, `fb_boxes` và `_v`.
    - Sinh lại schema Drizzle: `npm run generate:db-schema` (cập nhật `src/payload-generated-schema.ts`).
    - Seal schema contract: `npm run db:schema:seal -- 20260916_017_add_patient_care_content_tables`.
    - Triển khai migration an toàn: `npm run db:migrate:deploy` (17 applied, 0 pending).
  - **3. Cập nhật thanh điều hướng `PatientCareSubNav.tsx`**:
    - Bổ sung tab Quy trình khám (`key: 'quy-trinh'`, `href: '/quy-trinh-kham-benh'`, `icon: '🩺'`) vào danh sách mặc định.
  - **4. Cập nhật giao diện & logic hiển thị động trên Frontend**:
    - `src/app/(frontend)/quy-trinh-kham-benh/page.tsx`: Thêm `PatientCareSubNav activeKey="quy-trinh"`.
    - `src/app/(frontend)/quy-trinh-kham-benh/ExaminationFlowView.tsx`: Hiển thị động các tab quy trình `flowTabs`, các bước `steps`, `checklists`, `priorities` từ CMS với fallback mặc định chuẩn xác.
    - `src/app/(frontend)/chat-luong-benh-vien/page.tsx`: Hiển thị động các thẻ chỉ số `statCards`, tiêu chuẩn `dimensions`, và chương trình hành động `programs` từ CMS.
    - `src/app/(frontend)/gop-y/page.tsx`: Hiển thị Hero banner, Notice banner, và các khối `infoBoxes` từ CMS.
    - `src/app/(frontend)/khao-sat/page.tsx`: Hiển thị động 3 khối nguyên tắc từ `surveyConf.infoBoxes`.
    - `src/app/(frontend)/bieu-mau/page.tsx`: Hiển thị động 3 khối tiện ích từ `formsConf.infoBoxes`.
- **Kiểm thử & Xác nhận:**
  - `npm run typecheck`: 0 errors.
  - `npm run db:schema:check`: Valid contract.
  - `npm run db:migrate:status`: 17/17 applied.
  - Kiểm tra HTTP response các routes: 200 OK.

## [2026-09-16] - Đưa toàn bộ cấu hình trang Dành cho người bệnh (/danh-cho-nguoi-benh) và thanh Sub-Nav vào Admin CMS

- **Thời gian thực hiện:** 16:25 (Asia/Saigon)
- **Yêu cầu:** 
  1. Trang `http://localhost:3000/danh-cho-nguoi-benh`: Toàn bộ các thẻ danh mục, dịch vụ y tế, cam kết phục vụ, banner hành động và thanh chuyển tab con (Sub-Nav) phải quản trị được 100% từ Admin CMS.
  2. Bật/tắt tùy ý từng tab (`enabled`), cho phép đổi tên, icon, đường dẫn, badge, cũng như thêm/bớt các tab mới theo nhu cầu thực tế.
  3. Bật/tắt tùy ý từng nhóm dịch vụ và từng thẻ dịch vụ con, cho phép tạo thêm nhóm dịch vụ mới hoặc thêm dịch vụ mới bất kỳ lúc nào.
- **Nội dung thực hiện:**
  - **1. Tạo Global `PatientPortalSettings` (`src/globals/PatientPortalSettings.ts`)**:
    - Nhóm: `🏥 Khám bệnh & Dịch vụ Y tế`, slug: `patient-portal-settings`.
    - `hero`: Cấu hình nhãn `eyebrow`, tiêu đề `title`, mô tả `description`, cùng khối thông báo nổi bật (`showNoticeBanner`, `noticeTitle`, `noticeContent` với `white-space: pre-line`, `noticeAlign`).
    - `subNavTabs` (bảng phụ `pps_sub_tabs`): Danh sách tab Sub-Nav với `enabled`, `key`, `label`, `href`, `icon`, `badge`. Quản trị viên có thể ẩn/hiện, sửa đổi hoặc thêm mới các tab điều hướng.
    - `commitmentsSection` (bảng phụ `pps_commits`): Nhóm cam kết phục vụ với toggle bật/tắt toàn khối và từng cam kết (`enabled`, `icon`, `title`, `desc`).
    - `serviceGroups` (bảng phụ `pps_svc_groups` lồng `pps_svc_items`): Quản lý các nhóm dịch vụ và các thẻ dịch vụ con với quyền bật/tắt độc lập, tiêu đề nhóm, tiêu đề thẻ, mô tả, huy hiệu (`badge`, `badgeType`), icon và liên kết.
    - `ctaSection`: Khối banner kêu gọi hành động với toggle `enabled`, tiêu đề, mô tả (hỗ trợ biến mẫu `{{HOTLINE}}`, `{{EMERGENCY_HOTLINE}}`), nút gọi khẩn cấp và nút liên hệ tư vấn.
  - **2. Đăng ký vào Payload CMS (`payload.config.ts`)**:
    - Import `PatientPortalSettings` vào danh sách `globals`.
    - Phân quyền module: `globalPermissionModules['patient-portal-settings'] = 'site-settings'`.
  - **3. Database Migration & Schema Contract (`20260916_016_create_patient_portal_settings_tables`)**:
    - Định nghĩa các bảng vật lý: `patient_portal_settings`, `pps_sub_tabs`, `pps_commits`, `pps_svc_groups`, `pps_svc_items`.
    - Tối ưu tên bảng và cột < 63 ký tự, hỗ trợ khóa ngoại cascade sạch sẽ.
    - Sinh lại schema: `npm run generate:db-schema` (cập nhật `src/payload-generated-schema.ts`).
    - Tạo migration: `scripts/db-migrations/20260916_016_create_patient_portal_settings_tables.mjs`.
    - Seal schema contract: `npm run db:schema:seal -- 20260916_016_create_patient_portal_settings_tables`.
    - Chạy migration: `npm run db:migrate:deploy` (16 applied, 0 pending).
  - **4. Nâng cấp Component `PatientCareSubNav.tsx`**:
    - Truy vấn danh sách tab từ Global `patient-portal-settings`.
    - Tự động lọc các tab có `enabled !== false`.
    - Có cơ chế fallback dữ liệu mặc định an toàn nếu CMS chưa có cấu hình.
    - Đồng bộ tab tự động trên toàn bộ các trang con: `/khao-sat`, `/gop-y`, `/hoi-dap`, `/bieu-mau`, `/chat-luong-benh-vien`, `/lien-he`.
  - **5. Nâng cấp Trang `src/app/(frontend)/danh-cho-nguoi-benh/page.tsx`**:
    - Đọc toàn bộ cấu hình từ `patient-portal-settings` và hiển thị động theo đúng cài đặt Admin CMS.
    - Hỗ trợ đầy đủ các tính năng: bật/tắt notice banner, căn lề, lọc dịch vụ theo tab, bật/tắt từng nhóm và thẻ dịch vụ, thay thế số hotline tự động trong CTA banner.
- **Kiểm thử:**
  - `npm run typecheck`: 0 errors.
  - `npm run db:schema:check`: Valid contract.
  - `npm run db:migrate:status`: 16/16 applied.


- **Thời gian thực hiện:** 13:50 (Asia/Saigon)
- **Yêu cầu:** 
  1. Giải quyết trường hợp người bệnh / thân nhân không nhớ hoặc làm mất Mã tra cứu (`GY-2026-XXXX`).
  2. Bổ sung các kênh liên hệ hỗ trợ trực tiếp khi cần cấp lại mã hoặc giải đáp khẩn cấp: Hotline CSKH, Zalo Official Account và Trang Fanpage Facebook chính thức của Bệnh viện.
- **Nội dung thực hiện:**
  - `src/app/(frontend)/api/feedback/route.ts`:
    - Nâng cấp phương thức `GET`: Cho phép tra cứu linh hoạt khi không có tham số `code`.
    - Khi người dùng chỉ nhập Số điện thoại, hệ thống tự động quét toàn bộ hồ sơ phản ánh đã gửi từ số điện thoại đó trên cả 2 collection (`feedback` & `feedbackCases`), hợp nhất và sắp xếp theo thứ tự mới nhất gửi về dạng danh sách.
    - Khi có cả `code` và `phone`, trả về chi tiết hồ sơ cụ thể và dòng thời gian xử lý.
  - `src/components/FeedbackLookup.tsx` & `FeedbackLookup.module.css`:
    - Bổ sung thanh chuyển đổi (Tabs) trực quan giữa 2 chế độ:
      - **"Tra cứu theo Mã tiếp nhận"**: Dành cho người có lưu mã tra cứu.
      - **"Quên mã tra cứu? Tìm theo Số điện thoại"**: Dành cho người không nhớ mã, chỉ cần điền số điện thoại để xem toàn bộ lịch sử phản ánh của mình.
    - Khi tìm theo số điện thoại, hệ thống liệt kê danh sách thẻ hồ sơ với mã định danh, ngày gửi, tiêu đề, trạng thái và nút *"Xem câu trả lời của Bệnh viện →"* để xem chi tiết từng hồ sơ.
    - Bổ sung khối hỗ trợ trực tiếp: **"Bạn cần hỗ trợ cấp lại mã hoặc giải đáp trực tiếp?"** với 3 kênh chính thức:
      - **Tổng đài CSKH (Hotline)**: Gọi điện thoại tức thì `02923 689 115`.
      - **Zalo Bệnh viện**: Liên kết nhắn tin tư vấn trực tuyến.
      - **Facebook Fanpage**: Trang Fanpage chính thức của Bệnh viện Đa khoa Khu vực Thới Lai.
  - `src/app/(frontend)/gop-y/tra-cuu/page.tsx`:
    - Lấy cấu hình hotline, link Zalo và Facebook từ Admin CMS (`SiteSettings`, `ContactSettings`, `SocialSettings`) truyền vào component tra cứu.
- **Kiểm thử:**
  - Chạy `npm run typecheck`: Hoàn tất 100% (0 errors).
  - Kiểm thử API tra cứu theo số điện thoại không cần mã: HTTP 200 trả về danh sách hồ sơ đầy đủ.


- **Thời gian thực hiện:** 13:30 (Asia/Saigon)
- **Yêu cầu:** 
  1. Kiểm tra quy trình Phản hồi người bệnh: Trong Admin trước đây chỉ có thông tin cơ bản và ô trạng thái ("Mới", "Đang xử lý", "Đã xử lý") nhưng không có chỗ ghi nhận biện pháp xử lý, ghi chú nội bộ và câu trả lời chính thức gửi người bệnh.
  2. Khắc phục phần Tra cứu thông tin phản hồi (`/gop-y/tra-cuu`) chưa trả về đúng và đầy đủ thông tin (chưa hiển thị câu trả lời và cập nhật tiến độ tương ứng).
- **Nguyên nhân kỹ thuật:**
  - Collection `feedback` chỉ có các trường cơ bản (`name`, `phone`, `email`, `type`, `message`, `status`), thiếu hẳn các trường nghiệp vụ bệnh viện: `code`, `response`, `resolutionNote`, `handledBy`, `resolvedAt`.
  - Chưa có cơ chế đồng bộ 2 chiều giữa collection `feedback` (quản trị tiếp nhận) và collection `feedbackCases` / `feedbackActions` (hồ sơ theo dõi dòng thời gian). Khi cán bộ cập nhật trạng thái hoặc câu trả lời trong `feedback`, hệ thống tra cứu `feedbackCases` không nhận được kết quả.
  - Giao diện tra cứu `/gop-y/tra-cuu` chỉ hiển thị dạng văn bản thô sơ, chưa làm nổi bật thẻ phản hồi chính thức của Ban Giám đốc và chưa có hướng dẫn trạng thái trực quan.
- **Nội dung thực hiện:**
  - **1. Nâng cấp Collection `Feedback.ts`**:
    - Bổ sung nhóm trường quản lý chuyên nghiệp trong Admin:
      - `code`: Mã tra cứu phản ánh định danh duy nhất (ví dụ `GY-2026-XXXX`).
      - `status`: Trạng thái xử lý rõ ràng (*Mới tiếp nhận*, *Đang xác minh & Xử lý*, *Đã giải quyết & Phản hồi*).
      - `handledBy`: Cán bộ / Lãnh đạo phụ trách xử lý (liên kết bảng `users`).
      - `resolvedAt`: Thời điểm hoàn tất giải quyết (tự động điền ngày giờ khi chọn "Đã giải quyết").
      - `response`: Nội dung phản hồi chính thức gửi cho người bệnh (công khai khi tra cứu).
      - `resolutionNote`: Ghi chú & biện pháp xử lý nghiệp vụ nội bộ (bảo mật nội bộ).
    - Thêm hooks đồng bộ 2 chiều: Khi cán bộ xử lý hoặc nhập câu trả lời trong `feedback`, tự động cập nhật sang `feedbackCases` và tự động ghi nhật ký vào dòng thời gian `feedbackActions`.
  - **2. Đồng bộ ngược trong `FeedbackCases.ts`**:
    - Khi cập nhật trạng thái hoặc câu trả lời trong `feedbackCases`, tự động đồng bộ sang bản ghi tương ứng trong `feedback`.
  - **3. Database Migration & Schema Contract (`20260916_015_enhance_feedback_workflow_fields`)**:
    - Tạo migration an toàn bổ sung 5 cột mới vào bảng `feedback`: `code`, `response`, `resolution_note`, `handled_by_id`, `resolved_at` cùng index cho `code` và khóa ngoại `handled_by_id`.
    - Sinh lại schema và seal contract: `npm run db:schema:seal -- 20260916_015_enhance_feedback_workflow_fields`.
    - Triển khai và xác minh migration thành công: `npm run db:migrate:deploy`.
  - **4. Nâng cấp API `src/app/(frontend)/api/feedback/route.ts`**:
    - `POST`: Đồng bộ lưu mã tra cứu `code` vào cả `feedbackCases` và `feedback`.
    - `GET`: Tra cứu đồng thời cả 2 nguồn, ưu tiên câu trả lời chính thức mới nhất, tự động liên kết dòng thời gian xử lý và trả về đầy đủ họ tên, tiêu đề, nội dung, thời gian giải quyết.
  - **5. Nâng cấp Giao diện Tra cứu (`src/components/FeedbackLookup.tsx` & `FeedbackLookup.module.css`)**:
    - Thiết kế giao diện y tế cao cấp, chuyên nghiệp:
      - Ô nhập Mã tra cứu và Số điện thoại với nhãn rõ ràng, xác thực và xử lý lỗi chi tiết.
      - Thẻ kết quả định danh: Mã hồ sơ nổi bật, Huy hiệu trạng thái phân biệt màu sắc (*Mới tiếp nhận*, *Đang xử lý & Xác minh*, *Đã giải quyết*).
      - Hộp thông tin ý kiến người bệnh kèm thời gian gửi.
      - **Khối Phản hồi chính thức từ Bệnh viện Đa khoa Khu vực Thới Lai**: Viền xanh y tế nổi bật, biểu tượng xác thực tích xanh và hiển thị đầy đủ văn bản giải đáp của bệnh viện.
      - Dòng thời gian (Timeline) các mốc tiếp nhận, xử lý và phản hồi trực quan.
- **Kiểm thử & Xác nhận:**
  - Đã chạy kiểm tra tra cứu thử nghiệm với mã tiếp nhận thực tế qua API `GET /api/feedback`: Trả về chuẩn HTTP 200 đầy đủ thông tin người gửi, câu trả lời chính thức của Bệnh viện và mốc thời gian giải quyết.
  - Chạy `npm run typecheck`: 100% đạt chuẩn (0 lỗi).


- **Thời gian thực hiện:** 13:14 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi khi người dùng điền form "Gửi ý kiến phản ánh & Góp ý" trên trang `/lien-he` bị báo lỗi đỏ *"Không thể xử lý yêu cầu"*.
- **Nguyên nhân kỹ thuật:**
  - Trong `src/app/(frontend)/api/feedback/route.ts`, khi form người dùng gửi không chọn nhóm phản ánh (`category` là chuỗi rỗng `""`), hàm `Number("")` trả về số `0`. Khi chèn vào PostgreSQL (`category_id = 0`), khóa ngoại (foreign key) liên kết tới bảng `feedback_categories` bị lỗi vi phạm ràng buộc toàn vẹn cơ sở dữ liệu (`foreign key violation`), khiến server trả về lỗi 500.
- **Nội dung khắc phục:**
  - `src/app/(frontend)/api/feedback/route.ts`:
    - Chuẩn hóa kiểm tra `category`: chỉ gán `category_id` khi có giá trị số nguyên dương hợp lệ (`Number.isFinite(categoryID) && categoryID > 0`), ngược lại gán `undefined` để PostgreSQL nhận giá trị `NULL`.
    - Đồng thời tự động đồng bộ bản ghi vào cả 2 collection: `feedbackCases` (để cấp mã tra cứu cho người bệnh theo dõi tiến độ) và `feedback` (để hiển thị tức thì trên Admin Dashboard, Hộp thư phản ánh và thanh cảnh báo khẩn).
  - `src/components/FeedbackForm.tsx`:
    - Khắc phục lỗi React SyntheticEvent `Cannot read properties of null (reading 'reset')`: Lưu tham chiếu `formElement = e.currentTarget` trước khi gọi `await fetch(...)` bất đồng bộ để reset form an toàn sau khi gửi thành công.
  - Đã gửi request kiểm thử thành công: HTTP 200 `{ ok: true, code: "GY-2026-..." }`.
  - TypeScript typecheck đạt 100% (0 errors).

## [2026-09-16] - Cho phép di chuyển tùy ý các khối biểu đồ phân tích và Tách khoảng cách khối Phím tắt tạo mới & Điều hành nhanh

- **Thời gian thực hiện:** 13:08 (Asia/Saigon)
- **Yêu cầu:** 
  1. Cho phép di chuyển tùy ý vị trí các khối biểu đồ & phân tích theo nhu cầu của người quản lý.
  2. Sửa lỗi khối "Phác đồ điều trị vừa cập nhật" và "Ý kiến người bệnh chờ xử lý" bị dính sát vào khối "Phím tắt tạo mới & Điều hành nhanh", tạo khoảng cách rõ ràng, đẹp mắt.
- **Nội dung thực hiện:**
  - `src/components/admin/AdminDashboard.module.css`:
    - Bổ sung khoảng cách tách biệt `margin-top: 20px` cho `.quickCommandsSection` (Phím tắt tạo mới & Điều hành nhanh) để tách rời hoàn toàn với 2 luồng hoạt động bên trên, đảm bảo bố cục thông thoáng, có nhịp điệu phân vùng rõ rệt.
  - `src/components/admin/AdminDashboardCustomizer.tsx`:
    - Bổ sung trường `chartOrder` vào cấu hình lưu trữ `ChartVisibility` và `localStorage`.
    - Thêm cơ chế nút di chuyển lên/xuống (`▲` / `▼`) cho từng cụm khối biểu đồ & phân tích trong tab **"Biểu đồ phân tích"**:
      - Khối Cơ cấu tài nguyên số & Quy trình CSKH
      - Khối Xu hướng xuất bản tin bài & Phân bổ nhân lực khoa phòng
      - Khối Chỉ số hài lòng người bệnh & Cam kết xử lý SLA
      - Khối Tải lượng khám, cấp cứu 24/7 & Phân bổ phác đồ điều trị
    - Hỗ trợ lưu trữ thứ tự tùy biến vào `localStorage` và khôi phục mặc định khi nhấn "Khôi phục mặc định".
  - `src/components/admin/AdminCharts.tsx`:
    - Chuyển đổi cơ chế render các khối biểu đồ sang dạng `rowNodesMap` và hiển thị theo thứ tự mảng `chartOrder` được người quản trị sắp xếp.
  - `src/components/admin/AdminDashboardClient.tsx`:
    - Truyền tham số `chartOrder={charts.chartOrder}` vào component `<AdminCharts />`.
  - Kiểm tra kiểu dữ liệu TypeScript (`npm run typecheck`): Hoàn tất thành công 100% (0 errors).
  - Dev server Next.js cập nhật trực tiếp.

## [2026-09-16] - Bo viền khung độc lập cho từng ô tài nguyên & phản ánh, dãn cách khoảng cách và loại bỏ khối dữ liệu trùng lặp

- **Thời gian thực hiện:** 12:59 (Asia/Saigon)
- **Yêu cầu:** 
  1. Thêm khung bo viền riêng (`border`, `border-radius`, `padding`, `background`) cho từng ô trong khối "Cơ cấu tài nguyên bệnh viện" và "Quy trình xử lý phản ánh" để các ô không bị dính sát vào nhau.
  2. Rà soát toàn bộ Dashboard xem có thông tin nào bị trùng lặp không, nếu có thì loại bỏ để giao diện tinh gọn, không dư thừa.
- **Nội dung thực hiện:**
  - `src/components/admin/AdminCharts.module.css`:
    - **Bo viền & Tách biệt từng ô trong "Cơ cấu tài nguyên bệnh viện"**: Cập nhật `.breakdownRow` thành dạng thẻ card độc lập với `background: #f8fafc`, `border: 1px solid #e2e8f0`, `border-radius: 10px`, khoảng đệm `padding: 10px 14px`, và tăng `gap: 8px` giữa các ô trong danh sách, kết hợp hiệu ứng hover chuyển màu nhẹ và dịch chuyển `translateX(2px)` khi rê chuột.
    - **Bo viền & Dãn cách từng dòng trạng thái trong "Quy trình xử lý phản ánh"**: Cập nhật `.legendRow` thành dạng ô/thẻ riêng biệt với viền `1px solid #e2e8f0`, nền xám nhạt cao cấp `background: #f8fafc`, bo góc tròn `10px`, padding `10px 14px`, tăng khoảng trống giữa biểu đồ Donut và danh sách trạng thái phản ánh để không còn cảm giác chen chúc hay dính liền khối.
  - `src/components/admin/AdminDashboard.tsx`:
    - **Rà soát và loại bỏ trùng lặp thông tin**:
      - Phát hiện khối *"Năng lực số bệnh viện & Dữ liệu cốt lõi"* (`masterGrid`) ở phần cuối trang bị trùng lặp 100% với 6 chỉ số đã có sẵn trên thanh **Live Metrics Command Bar** ở đầu trang (Phác đồ điều trị, Bác sĩ & Nhân sự, Dịch vụ kỹ thuật, Khoa phòng, Media, Audit Logs) và các thẻ phân hệ chi tiết.
      - Tiến hành **loại bỏ hoàn toàn khối `masterGrid` trùng lặp**, giữ lại 2 dòng hoạt động thực tế mới nhất ("Phác đồ điều trị vừa cập nhật", "Ý kiến người bệnh chờ xử lý") cùng bảng phím tắt nhanh "Truy cập tác vụ nhanh" giúp giao diện trang quản trị ngắn gọn, khoa học và không bị thừa dữ liệu.
  - Kiểm tra kiểu dữ liệu TypeScript (`npm run typecheck`): Hoàn tất thành công 100% (0 errors).
  - Dev server Next.js phản hồi tức thì với giao diện mới.

## [2026-09-16] - Đưa khối Cơ cấu tài nguyên & Quy trình phản ánh lên trên, Bổ sung tùy chọn thống kê và Nâng cấp thiết kế Phác đồ điều trị chuẩn

- **Thời gian thực hiện:** 12:26 (Asia/Saigon)
- **Yêu cầu:** 
  1. Đưa 2 khối "Cơ cấu tài nguyên bệnh viện" và "Quy trình xử lý phản ánh" lên phía trên cùng khu vực biểu đồ.
  2. Bổ sung tùy chọn bật/tắt 2 khối này vào bảng "Tùy chỉnh thống kê Dashboard".
  3. Thiết kế lại phần "Phân bổ Phác đồ điều trị chuẩn" theo tiêu chuẩn thẩm mỹ y tế chuyên nghiệp, hiện đại.
  4. Minh bạch và làm rõ nguồn số liệu thống kê của "Chỉ số hài lòng người bệnh" và "Cam kết xử lý phản ánh (SLA)".
- **Nội dung thực hiện:**
  - `src/components/admin/AdminCharts.tsx` & `src/components/admin/AdminCharts.module.css`:
    - **Đưa 2 khối Bento lên cụm Biểu đồ trên**: Tích hợp trực tiếp 2 thẻ *"Cơ cấu tài nguyên bệnh viện"* (với thanh tiến trình phân bổ bài viết, phác đồ, văn bản...) và *"Quy trình xử lý phản ánh"* (với biểu đồ tròn donut, phân loại Mới - Đang xử lý - Đã giải quyết) vào Hàng 4 của `AdminCharts` phía trên các tab phân hệ quản trị.
    - **Thiết kế lại hoàn toàn "Phân bổ Phác đồ điều trị chuẩn"**: Thay thế dạng danh sách text đơn điệu cũ bằng hệ thống thẻ card chuyên môn cao cấp (`.protocolCardNew`), bao gồm:
      - Nhãn tag chuyên khoa định danh (Cấp cứu 24/7, Nội - Nhi, Phẫu thuật, Sản khoa, Đông y, Xét nghiệm).
      - Thanh track tiến trình bo góc mượt mà (`.protocolTrackFill`) đồng bộ màu nhận diện của từng khối.
      - Hiển thị song song số lượng phác đồ ban hành và tỷ trọng phần trăm chuẩn xác.
  - `src/components/admin/AdminDashboard.tsx`:
    - Loại bỏ việc hiển thị 2 thẻ Bento ở vị trí bên dưới phân hệ trong `bentoContentNode` để tránh trùng lặp.
    - Chuyển tiếp các thông số `contentBreakdown`, `totalContent`, `totalFeedback`, `feedbackNew`, v.v. vào `AdminDashboardClient` để cung cấp cho `AdminCharts`.
  - `src/components/admin/AdminDashboardClient.tsx`:
    - Tiếp nhận props và truyền đầy đủ vào `<AdminCharts ... />` cùng các công tắc bật/tắt `showResourceStructure` và `showFeedbackDonut`.
  - `src/components/admin/AdminDashboardCustomizer.tsx`:
    - Mở rộng giao diện tùy biến với 2 công tắc gạt độc lập cho 2 khối này trong bảng "Tùy chỉnh thống kê Dashboard".
  - Kiểm tra kiểu dữ liệu TypeScript (`npm run typecheck`): Hoàn tất thành công 100% (0 errors).
  - Dev server Next.js đang chạy ổn định và cập nhật tức thì.

- **Thời gian thực hiện:** 12:04 (Asia/Saigon)
- **Yêu cầu:** Kiểm tra lại còn thiếu biểu đồ thống kê nào chưa có thì tạo thêm và lấy số liệu thống kê thật 100% từ cơ sở dữ liệu, không tự ý thêm dữ liệu ảo; đưa toàn bộ các biểu đồ thống kê lên phía trên trước các ô phân hệ.
- **Nội dung thực hiện:**
  - `src/components/admin/AdminDashboardClient.tsx`:
    - Di chuyển component `AdminCharts` lên trên vị trí các tab phân hệ (`tabNavContainer`) và lưới thống kê (`statsGrid`). Người quản lý khi vừa mở trang sẽ thấy ngay toàn bộ biểu đồ trực quan xu hướng và năng lực bệnh viện trước khi đi vào từng phân hệ chi tiết.
  - `src/components/admin/AdminDashboard.tsx`:
    - Thay thế toàn bộ số liệu ước tính của biểu đồ phân bổ nhân lực khoa phòng bằng **số liệu thống kê thực tế 100%** truy vấn trực tiếp từ bảng `departments` và quan hệ của `doctors`.
    - Tính toán chính xác tỷ lệ giải quyết phản ánh (SLA) dựa trên số lượng thư đã xử lý thực tế `feedbackDone / totalFeedback`.
    - Tính toán cơ cấu phác đồ điều trị thực tế theo số lượng phác đồ chuẩn Bộ Y tế đã ban hành trong cơ sở dữ liệu.
  - Kiểm tra TypeScript (`npm run typecheck`): Hoàn tất thành công 100% (0 errors).

## [2026-09-16] - Mở rộng Trung tâm Cảnh báo & Tiếp nhận Xử lý nhanh trên đầu Admin Dashboard

- **Thời gian thực hiện:** 11:55 (Asia/Saigon)
- **Yêu cầu:** 
  1. Hiển thị thêm thông báo phản hồi: Tư vấn trực tuyến, Đặt lịch khám tại cơ sở, Thư góp ý / Phản hồi người bệnh và các nội dung có cảnh báo để người quản lý có thể kiểm tra nhanh được.
  2. Khắc phục cảnh báo React: `Each child in a list should have a unique "key" prop. Check the render method of AdminDashboardClient. It was passed a child from AdminDashboard`.
- **Nội dung thực hiện:**
  - `src/components/admin/AdminDashboard.tsx`:
    - Bổ sung `key="pending-triage-banner-node"` vào phần tử gốc `div.pendingTriageBanner` khi truyền qua prop `pendingTriageNode` vào `AdminDashboardClient`, khắc phục hoàn toàn cảnh báo React key trong danh sách render.
    - Tích hợp thêm truy vấn danh sách phiếu khám hẹn mới (`appointments` với trạng thái `pending`/`new`), thư phản ánh & khiếu nại mới (`feedback` với trạng thái `new`/`processing`), và câu hỏi tư vấn sức khỏe trực tuyến (`consultations` với trạng thái `new`/`processing`).
    - Nâng cấp khối trên cùng thành **Trung tâm Cảnh báo & Tiếp nhận Xử lý nhanh** (`pendingTriageBanner`) hiển thị tổng hợp toàn bộ các đầu việc cần xử lý ngay (Bài viết chờ duyệt xuất bản, Lịch khám chờ gọi xác nhận, Phản ánh / khiếu nại của người bệnh, Câu hỏi tư vấn y tế trực tuyến).
    - Từng ô mục tiêu hiển thị trực quan mức độ ưu tiên theo màu sắc (Đỏ: Khiếu nại/Phản ánh, Cam: Đặt lịch khám, Xanh: Tư vấn trực tuyến, Vàng: Bài viết chờ duyệt).
  - `src/components/admin/AdminDashboard.module.css`:
    - Bổ sung các class màu phân cấp mức độ cảnh báo: `.pendingTriageItemDanger`, `.pendingTriageItemUrgent`, `.pendingTriageItemInfo` với hiệu ứng viền, nền và nút bấm tương ứng.
  - Kiểm tra kiểu dữ liệu TypeScript (`npm run typecheck`): Hoàn tất thành công 100% (0 errors).

- **Thời gian thực hiện:** 11:39 (Asia/Saigon)
- **Yêu cầu:** 
  1. Cho phép bật/tắt phần "Nguồn bài viết" trong từng bài viết riêng biệt (độc lập giữa các bài).
  2. Những bài viết chờ duyệt / đã gửi duyệt (`workflowState = 'submitted'`) thì hiển thị trực tiếp lên vị trí trên cùng đầu trang Admin CMS Dashboard để ban quản trị/lãnh đạo nhìn thấy tức thì và duyệt xuất bản nhanh.
  3. Trong phần nội dung chi tiết kỹ thuật chuyên sâu (`/ky-thuat-chuyen-sau/[slug]`), sửa lỗi bị hiển thị 2 lần đường gạch ngang ở dưới trước nút quay lại.
- **Nội dung thực hiện:**
  - **1. Bật/tắt nguồn bài viết trong từng bài viết riêng biệt (`showSource`)**:
    - `src/fields/common.ts`: Bổ sung helper field `showSourceField(defaultValue = true)` thuộc tab "Cài đặt & SEO".
    - Tích hợp trường `showSource` vào tất cả các Collection bài viết:
      - `src/collections/News.ts` (mặc định `true`)
      - `src/collections/Notices.ts` (mặc định `true`)
      - `src/collections/Procurement.ts` (mặc định `true`)
      - `src/collections/CustomPosts.ts` (mặc định `true`)
      - `src/collections/Recruitment.ts` (mặc định `true`)
      - `src/collections/ScientificActivities.ts` (mặc định `true`)
      - `src/collections/AdvancedTechniques.ts` (mặc định `false`, có thể bật lại tùy ý)
    - Cập nhật logic hiển thị bài viết chi tiết tại:
      - `src/app/(frontend)/tin-tuc/[slug]/page.tsx`
      - `src/app/(frontend)/thong-bao/[slug]/page.tsx`
      - `src/app/(frontend)/dau-thau-mua-sam/[slug]/page.tsx`
      - `src/app/(frontend)/tuyen-dung/[slug]/page.tsx`
      - `src/app/(frontend)/noi-dung/[sectionSlug]/[slug]/page.tsx`
      - `src/app/(frontend)/hoat-dong-khoa-hoc/[slug]/page.tsx`
      - `src/app/(frontend)/[...path]/page.tsx`
      - `src/app/(frontend)/ky-thuat-chuyen-sau/[slug]/page.tsx`
      - Ưu tiên công tắc riêng của từng bài: Nếu bài viết có cài đặt `showSource !== undefined`, website sẽ ưu tiên giá trị này; nếu chưa cấu hình thì dùng cấu hình chung `themeSettings`.
    - **Database & Migration**:
      - Tạo file migration chuẩn `scripts/db-migrations/20260916_014_add_per_post_show_source.mjs` thêm cột `show_source` vào 7 bảng và 7 bảng phiên bản (`_v`).
      - Chạy `npm run generate:db-schema`, seal contract `20260916_014_add_per_post_show_source` và deploy thành công vào PostgreSQL.
  - **2. Hiển thị thông báo và danh sách bài viết chờ duyệt trên Admin CMS Dashboard**:
    - `src/components/admin/AdminDashboard.tsx`:
      - Thêm truy vấn đếm và lấy danh sách các bài viết ở trạng thái chờ duyệt (`workflowState: 'submitted'`) từ các phân hệ: Tin tức, Thông báo, Đấu thầu, Tuyển dụng, Chuyên đề động, Sinh hoạt khoa học.
      - Hiển thị khối thông báo nổi bật màu hổ phách (`pendingTriageBanner`) ngay phía trên Bento Grid điều hành khi có bài viết đang chờ duyệt, hiển thị rõ số lượng bài và danh sách bài viết kèm chuyên mục, tiêu đề, thời gian gửi và nút "Duyệt bài →" dẫn thẳng vào trang biên tập bài viết đó.
      - Cập nhật huy hiệu (badge) trạng thái cảnh báo trên các thẻ chỉ số cốt lõi (`news`, `notices`, `procurement`, `recruitment` hiển thị "X chờ duyệt").
  - **3. Khắc phục hiển thị 2 lần gạch ngang ở trang chi tiết kỹ thuật chuyên sâu**:
    - `src/app/(frontend)/ky-thuat-chuyen-sau/[slug]/page.tsx`:
      - Xóa bỏ thẻ `div` bọc ngoài có `borderTop` trùng lặp trước nút quay lại, vì component `ArticleDetailTemplate` đã có đường kẻ ngăn cách chuẩn.
      - Xóa bỏ ký tự mũi tên lặp lại `←` trong label `backToListLabel`.
  - **Files Modified:**
    - `src/fields/common.ts`
    - `src/collections/News.ts`
    - `src/collections/Notices.ts`
    - `src/collections/Procurement.ts`
    - `src/collections/CustomPosts.ts`
    - `src/collections/Recruitment.ts`
    - `src/collections/ScientificActivities.ts`
    - `src/collections/AdvancedTechniques.ts`
    - `src/app/(frontend)/tin-tuc/[slug]/page.tsx`
    - `src/app/(frontend)/thong-bao/[slug]/page.tsx`
    - `src/app/(frontend)/dau-thau-mua-sam/[slug]/page.tsx`
    - `src/app/(frontend)/tuyen-dung/[slug]/page.tsx`
    - `src/app/(frontend)/noi-dung/[sectionSlug]/[slug]/page.tsx`
    - `src/app/(frontend)/hoat-dong-khoa-hoc/[slug]/page.tsx`
    - `src/app/(frontend)/[...path]/page.tsx`
    - `src/app/(frontend)/ky-thuat-chuyen-sau/[slug]/page.tsx`
    - `src/components/admin/AdminDashboard.tsx`
    - `src/components/admin/AdminDashboard.module.css`
    - `scripts/db-migrations/20260916_014_add_per_post_show_source.mjs`
    - `scripts/db-schema-contract.json`
    - `src/payload-generated-schema.ts`
    - `src/payload-types.ts`
    - `CHANGELOG.md`
    - `CURRENT-TASK.md`


- **Thời gian thực hiện:** 10:41 (Asia/Saigon)
- **Yêu cầu:** Khắc phục cảnh báo SSL mode của PostgreSQL driver và lỗi `connect ENETUNREACH 2607:f8b0:4004:c06::6c:465 - Error verifying Nodemailer transport`.
- **Nội dung thực hiện:**
  - `payload.config.ts`:
    - Thêm `skipVerify: true` vào cấu hình `nodemailerAdapter` để ngăn chặn Payload tự động gọi verify socket blocking lúc khởi động, loại bỏ hoàn toàn lỗi crash/warning khi mạng không hỗ trợ kết nối trực tiếp đến SMTP server.
    - Bổ sung `family: 4` vào `transport` Nodemailer để ép buộc ưu tiên tuyệt đối giao thức IPv4 khi resolve domain `smtp.gmail.com`, giải quyết triệt để lỗi mạng `ENETUNREACH` trên các hạ tầng mạng chưa hỗ trợ định tuyến IPv6.
- **Files Modified:**
  - `payload.config.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-16] - Bổ sung công tắc bật/tắt độc lập từng khối nội dung bài viết chi tiết & Tắt nguồn bài viết Kỹ thuật chuyên sâu

- **Thời gian thực hiện:** 09:54 (Asia/Saigon)
- **Yêu cầu:** 
  1. Sử dụng mẫu thiết kế chung (`ArticleDetailTemplate`), nhưng cho phép người quản trị bật/tắt tùy ý từng khối nội dung trên bài viết chi tiết (Granular Toggles).
  2. Cụ thể: Tắt dòng "Nguồn bài viết" cho Kỹ thuật chuyên sâu, trong khi các phần khác vẫn bật bình thường.
  3. Áp dụng khả năng bật/tắt độc lập này cho tất cả các khối khác (Breadcrumb, Ngày đăng, Lượt xem, Chuyên khoa/Khoa phòng, Highlights, Ưu điểm, Sidebar, Banner, Tin liên quan, Nút quay lại...).
- **Nội dung thực hiện:**
  - **Admin CMS (`ThemeSettings.ts`)**:
    - Bổ sung nhóm `techniqueOptions` (Cài đặt hiển thị riêng cho Kỹ thuật chuyên sâu):
      - `showSource`: Mặc định **TẮT** (`false`) cho Kỹ thuật chuyên sâu theo đúng yêu cầu người dùng, có thể bật lại tùy ý.
      - Hỗ trợ công tắc độc lập cho: `showBreadcrumbs`, `showDate`, `showViews`, `showCategory`, `showHighlights`, `showAdvantages`, `showCoverInDetail`, `showShareButtons`, `showSidebar`, `showSidebarLatest`, `showSidebarBanners`, `showRelatedSection`, `showBackToList`, `sourceName`, `sidebarLatestTitle`, `relatedSectionTitle`.
    - Mở rộng nhóm `displayOptions` (Dùng chung toàn hệ thống) với đầy đủ công tắc cho từng khối.
    - Thêm `applyAdvancedTechniques` vào phạm vi cấu hình giao diện.
  - **Database & Schema Contract**:
    - Tạo và thực thi Migration `20260916_013_add_detail_layout_granular_toggles.mjs` thêm 25 cột vào `theme_settings` và 25 cột vào `_theme_settings_v`.
    - Đã seal contract và deploy migration thành công (13/13 applied, 0 pending).
  - **Component `ArticleDetailTemplate`**:
    - Bổ sung các props granular: `showBreadcrumbs`, `showDate`, `showViews`, `showCategory`, `showHighlights`, `showExcerpt`, `showSource`, `showShareButtons`, `showSidebar`, `showSidebarLatest`, `showSidebarBanners`, `showRelatedSection`, `showBackToList`.
    - Tự động điều chỉnh layout CSS (`postDetailLayoutFull`, `postDetailLayoutNoRight`, `postDetailLayoutNoLeft`) khi tắt Sidebar hoặc tắt cột chia sẻ.
  - **Trang Kỹ thuật chuyên sâu (`ky-thuat-chuyen-sau/[slug]/page.tsx`)**:
    - Kết nối với `techniqueOptions` từ `theme-settings`. Mặc định `showSource = false` (không hiển thị dòng "Nguồn: Bệnh viện..." ở cuối bài kỹ thuật chuyên sâu), các khối khác hiển thị đầy đủ và có thể bật/tắt linh hoạt từ Admin CMS.
  - **Kiểm tra**:
    - `npm run db:schema:check`: Pass contract hợp lệ (`20260916_013_add_detail_layout_granular_toggles`).
    - `npm run db:migrate:status`: Pass 13/13 applied, 0 pending.
    - `npm run typecheck`: Pass 100% (0 errors).
- **Files Modified:**
  - `src/globals/ThemeSettings.ts`
  - `src/components/ArticleDetailTemplate.tsx`
  - `src/components/ArticleDetailTemplate.module.css`
  - `src/app/(frontend)/ky-thuat-chuyen-sau/[slug]/page.tsx`
  - `scripts/db-migrations/20260916_013_add_detail_layout_granular_toggles.mjs`
  - `src/payload-generated-schema.ts`
  - `scripts/db-schema-contract.json`
  - `src/payload-types.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-16] - Đưa nội dung chữ chạy vào Admin CMS & Thiết kế lại trang chi tiết Kỹ thuật chuyên sâu

- **Thời gian thực hiện:** 07:58 (Asia/Saigon)
- **Yêu cầu:**
  1. Thêm trường quản trị nội dung dòng chữ chạy ngang (ticker marquee) vào Admin CMS để người quản trị có thể thay đổi tùy ý.
  2. Thiết kế lại trang chi tiết bài viết Kỹ thuật chuyên sâu (`/ky-thuat-chuyen-sau/[slug]`) theo giao diện chuẩn, đồng bộ và chuyên nghiệp giống như trang chi tiết Tin tức (`/tin-tuc/[slug]`).
- **Nội dung thực hiện:**
  - **Quản lý nội dung chữ chạy trong Admin CMS (`SiteSettings.ts`, `SiteHeader.tsx`)**:
    - Bổ sung trường `text` (Nội dung chữ chạy trên website) vào trực tiếp nhóm `tickerAppearance` (Cài đặt thanh chữ chạy - Marquee) trong `src/globals/SiteSettings.ts`, với giá trị mặc định là `"Chào mừng đến với Cổng thông tin Bệnh viện Đa khoa khu vực Thới Lai"`.
    - Ẩn trường cũ `slogan` và giữ cơ chế fallback an toàn `tickerSettings.text || settings?.slogan || 'Chào mừng...'` trong `src/components/SiteHeader.tsx`.
    - Tạo và thực thi Migration `20260916_012_add_ticker_appearance_text.mjs`: bổ sung cột `ticker_appearance_text` vào `site_settings` và `version_ticker_appearance_text` vào `_site_settings_v`, tự động đồng bộ dữ liệu hiện có.
    - Đã seal schema contract và deploy migration thành công (12/12 applied, 0 pending).
  - **Nâng cấp trang chi tiết Kỹ thuật chuyên sâu (`ArticleDetailTemplate.tsx`, `ky-thuat-chuyen-sau/[slug]/page.tsx`)**:
    - Mở rộng `ArticleDetailTemplateProps` hỗ trợ các slot nội dung linh hoạt: `customBodyTop`, `customBodyBottom`, `children`.
    - Tái cấu trúc toàn diện trang `src/app/(frontend)/ky-thuat-chuyen-sau/[slug]/page.tsx` sử dụng `ArticleDetailTemplate`:
      - Breadcrumbs dẫn đường chuẩn y tế: `Trang chủ` / `Kỹ thuật chuyên sâu` / `[Tên Khoa/Phòng]` / `[Tiêu đề kỹ thuật]`.
      - Thanh metadata: Ngày đăng, số lượt xem, nhãn chuyên khoa (có liên kết đến trang Khoa/Phòng).
      - Bảng thông tin nổi bật (highlights): Khoa/Phòng phụ trách, Bác sĩ/Nhân sự chuyên môn, Tiêu chuẩn phân loại, Đối tượng chỉ định.
      - Khối ảnh đại diện kỹ thuật (nếu bật `showCoverInDetail`) và khối "Ưu điểm vượt trội của kỹ thuật" được bo góc, viền xanh y tế sang trọng.
      - Cột Sidebar bên phải: Khối "Kỹ thuật chuyên sâu khác" và hệ thống banner tiện ích đặt lịch khám Medpro, bảng giá, tiêm chủng đồng bộ từ `theme-settings`.
      - Khối "Kỹ thuật cùng chuyên mục" dưới chân trang giúp tăng khả năng giữ chân người đọc.
      - Nút quay lại trang chủ / danh sách kỹ thuật (`BackToList`).
      - **Ẩn khối Tóm tắt / Mô tả ngắn trong bài viết chi tiết**: Khối trích dẫn Sapo (`postDetailExcerpt`) mặc định không hiển thị lặp lại trong nội dung bài viết (`showExcerpt: false`), đảm bảo phần tóm tắt chỉ dành cho thẻ xem trước/mạng xã hội và bài viết bắt đầu trực tiếp vào nội dung chính.
  - **Kiểm tra**:
    - `npm run db:schema:check`: Pass contract hợp lệ (`20260916_012_add_ticker_appearance_text`).
    - `npm run db:migrate:status`: Pass 12 applied / 0 pending.
    - `npm run typecheck`: Pass 100% (0 errors).
- **Files Modified:**
  - `src/globals/SiteSettings.ts`
  - `src/components/SiteHeader.tsx`
  - `src/components/ArticleDetailTemplate.tsx`
  - `src/app/(frontend)/ky-thuat-chuyen-sau/[slug]/page.tsx`
  - `scripts/db-migrations/20260916_012_add_ticker_appearance_text.mjs`
  - `src/payload-generated-schema.ts`
  - `scripts/db-schema-contract.json`
  - `src/payload-types.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-16] - Khắc phục cảnh báo Next.js missing-data-scroll-behavior trên thẻ <html>

- **Thời gian thực hiện:** 07:51 (Asia/Saigon)
- **Yêu cầu:** Khắc phục cảnh báo browser console: `Detected scroll-behavior: smooth on the <html> element. To disable smooth scrolling during route transitions, add data-scroll-behavior="smooth" to your <html> element.`
- **Nội dung thực hiện:**
  - Bổ sung thuộc tính `data-scroll-behavior="smooth"` vào thẻ `<html lang="vi">` trong `src/app/(frontend)/layout.tsx` theo chuẩn Next.js App Router, giúp điều hướng trang (route transitions) mượt mà và không gây giật cuộn ngoài ý muốn.
- **Files Modified:**
  - `src/app/(frontend)/layout.tsx`
  - `CHANGELOG.md`

## [2026-09-16] - Hiển thị 4 ô cho Chuyên gia của chúng tôi & Kỹ thuật chuyên sâu trên Desktop, giữ nguyên mặc định Mobile

- **Thời gian thực hiện:** 07:41 (Asia/Saigon)
- **Yêu cầu:** 
  1. Khắc phục cảnh báo React duplicate key: `Encountered two children with the same key, '1'` khi các thẻ trong carousel lặp vòng tuần hoàn.
  2. Khắc phục khối Kỹ thuật chuyên sâu hiển thị đủ 4 ô trên desktop (trước đó nhận cấu hình cũ 3 thẻ từ database).
- **Nội dung thực hiện:**
  - **Khắc phục trùng lặp key React (`OurExpertsCarousel.tsx` & `AdvancedTechniquesCarousel.tsx`)**:
    - Chuyển `const key = item.id || ...` sang `const key = `${item.id ?? 'item'}-slot-${idx}``. Khi danh sách chuyên gia hoặc kỹ thuật có ít hơn 4 mục và phải lặp thẻ để lấp đầy 4 ô trên desktop, key luôn kèm chỉ số render `idx` đảm bảo 100% duy nhất, loại bỏ hoàn toàn lỗi cảnh báo của React.
  - **Đảm bảo 4 ô trên Desktop cho Kỹ thuật chuyên sâu (`page.tsx` & `AdvancedTechniquesCarousel.tsx`)**:
    - Trong `src/app/(frontend)/page.tsx`: Gán trực tiếp `itemsPerView={4}` (thay vì phụ thuộc vào trường `techniqueItemsPerView` có thể đang lưu giá trị 3 trong database).
    - Trong `AdvancedTechniquesCarousel.tsx`: Thiết lập `targetPerView = itemsPerView && itemsPerView >= 4 ? itemsPerView : 4` đảm bảo luôn đạt tối thiểu 4 ô trên màn hình lớn.
  - **Kiểm tra**:
    - `npm run typecheck`: Pass 100% (0 errors).
- **Files Modified:**
  - `src/components/AdvancedTechniquesCarousel.tsx`
  - `src/components/AdvancedTechniquesCarousel.module.css`
  - `src/components/OurExpertsCarousel.tsx`
  - `src/components/OurExpertsCarousel.module.css`
  - `src/app/(frontend)/page.tsx`
  - `src/globals/Homepage.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-16] - Sửa lỗi "Something went wrong" khi chọn Cách hiển thị ảnh đại diện (cover-bottom, cover-top, cover-center, fill)

- **Thời gian thực hiện:** 07:22 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi không lưu được bài viết khi thay đổi tùy chọn "Cách hiển thị ảnh đại diện trên thẻ / trang chủ" (báo lỗi "Something went wrong" trên mọi loại nội dung).
- **Nguyên nhân cốt lõi:**
  - Trong PostgreSQL, các trường select của Payload CMS (`coverFit`, `imageFit`, `coverPosition`) được lưu dưới dạng kiểu `enum` tĩnh (ví dụ `enum_news_cover_fit`, `enum__news_v_version_cover_fit`, `enum_notices_cover_fit`, v.v.).
  - Khi schema TypeScript mở rộng thêm các giá trị mới (`cover-bottom`, `cover-top`, `cover-center`, `fill`), cơ sở dữ liệu trên Neon (Railway) chưa được chạy migration bổ sung các giá trị này vào enum PostgreSQL. Khi người dùng chọn bất kỳ giá trị mới nào (như `cover-bottom`), PostgreSQL ném lỗi `invalid input value for enum ...: "cover-bottom"` khiến Payload CMS báo lỗi "Something went wrong" và không thể lưu bài viết.
  - Một số collection (`Procurement`, `ScientificActivities` qua `common.ts`) trước đó chỉ có 2 tùy chọn cũ (`cover`, `contain`), thiếu tính đồng nhất với Tin tức, Thông báo, Tuyển dụng.
- **Nội dung thực hiện:**
  - **Tạo và triển khai Migration `20260916_011_sync_all_cover_fit_and_image_fit_enums.mjs`**:
    - Đồng bộ tất cả giá trị `['contain', 'cover', 'cover-top', 'cover-center', 'cover-bottom', 'fill']` vào toàn bộ 24 kiểu enum fit (tường minh và quét động) trên cả bảng chính và bảng phiên bản (`_v`): `enum_news_cover_fit`, `enum__news_v_version_cover_fit`, `enum_notices_cover_fit`, `enum__notices_v_version_cover_fit`, `enum_procurement_cover_fit`, `enum__procurement_v_version_cover_fit`, `enum_recruitment_cover_fit`, `enum__recruitment_v_version_cover_fit`, `enum_scientific_activities_cover_fit`, `enum__scientific_activities_v_version_cover_fit`, `enum_specialties_cover_fit`, `enum_our_experts_image_fit`, `enum_advanced_techniques_image_fit`, `enum_expert_items_image_fit`, `enum_tech_items_image_fit`, v.v.
    - Đồng bộ tất cả giá trị vị trí `['top', 'center', 'bottom']` vào toàn bộ các enum `cover_position`.
    - Đảm bảo tất cả các cột tồn tại trên bảng chính và bảng phiên bản.
  - **Đồng bộ Schema TypeScript**:
    - `src/fields/common.ts`: Bổ sung đủ 6 tùy chọn cho `imageDisplayFields` (`coverFit`).
    - `src/collections/Procurement.ts`: Bổ sung đủ 6 tùy chọn cho `coverFit`.
    - `src/collections/OurExperts.ts`: Bổ sung tùy chọn `cover` cho `imageFit`.
    - `src/collections/AdvancedTechniques.ts`: Bổ sung tùy chọn `cover` cho `imageFit`.
  - **Đóng gói Contract Schema**:
    - Sinh lại schema Drizzle: `npm run generate:db-schema` (cập nhật `src/payload-generated-schema.ts`).
    - Seal schema contract: `npm run db:schema:seal -- 20260916_011_sync_all_cover_fit_and_image_fit_enums`.
    - Chạy migration deploy thành công: 11 applied, 0 pending.
    - Sinh lại TS types: `npm run generate:types`.
    - Kiểm tra `npm run typecheck`: Pass 100% (0 errors).
- **Files Modified:**
  - `src/fields/common.ts`
  - `src/collections/Procurement.ts`
  - `src/collections/OurExperts.ts`
  - `src/collections/AdvancedTechniques.ts`
  - `scripts/db-migrations/20260916_011_sync_all_cover_fit_and_image_fit_enums.mjs`
  - `src/payload-generated-schema.ts`
  - `src/payload-schema-contract.json`
  - `src/payload-types.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-16] - Khắc phục Cảnh báo Next.js Standalone và Lỗi Nodemailer ETIMEDOUT trên Railway

- **Thời gian thực hiện:** 07:05 (Asia/Saigon)
- **Yêu cầu / Lỗi phát hiện từ log Railway:**
  1. Cảnh báo: `⚠ "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.`
  2. Lỗi gây treo/crash container khi deploy: `Error: Connection timeout ... code: 'ETIMEDOUT', command: 'CONN' ... msg: 'Error verifying Nodemailer transport.'`
- **Nguyên nhân:**
  1. `next.config.mjs` bật cấu hình `output: 'standalone'` trong khi `Dockerfile` và `package.json` khởi chạy bằng `CMD ["npm", "start"]` (thực thi `prestart` chạy db-migrate rồi gọi `next start`). Next.js 16 phát sinh cảnh báo không tương thích.
  2. `payload.config.ts` trước đó có fallback cứng thông tin SMTP Gmail cá nhân (`leean170792@gmail.com`). Khi chạy trên container đám mây của Railway, các kết nối outbound tới cổng 587/SMTP Gmail bị chặn hoặc timeout, khiến Nodemailer adapter trong Payload liên tục thử verify kết nối và ném lỗi `ETIMEDOUT`.
- **Nội dung thực hiện:**
  - `next.config.mjs`: Loại bỏ `output: 'standalone'`, giúp Next.js tương thích 100% với `next start` và `Dockerfile`, không còn cảnh báo sai cấu hình output.
  - `payload.config.ts`: Chỉ kích hoạt `nodemailerAdapter` khi cả hai biến môi trường `SMTP_USER` và `SMTP_PASS` được cung cấp rõ ràng (`smtpConfigured = Boolean(process.env.SMTP_PASS && process.env.SMTP_USER)`), loại bỏ hoàn toàn fallback cứng. Nếu người dùng chưa cấu hình SMTP thực tế, Payload sẽ chạy an toàn mà không verify Nodemailer, giải quyết dứt điểm lỗi `ETIMEDOUT`.
- **Kiểm tra:**
  - `npm run typecheck`: Pass 100% (0 errors).
- **Files Modified:**
  - `next.config.mjs`
  - `payload.config.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Tối ưu Menu Dropdown như Desktop và Điều chỉnh Vị trí Ngày Giờ trên Điện thoại

- **Thời gian thực hiện:** 19:35 (Asia/Saigon)
- **Yêu cầu:**
  1. Thanh trên cùng (Utility Bar) trên điện thoại: Ngày & Giờ chuyển sang nằm bên TRÁI; cụm Mạng xã hội và ô Tìm kiếm chuyển sang góc PHẢI.
  2. Menu trên điện thoại: Thiết kế kiểu xổ xuống (dropdown) tự nhiên neo ngay dưới từng mục cha như desktop, cố định vị trí khi bấm xổ xuống; nếu vượt quá chiều ngang thì có thanh cuộn ngang để lướt, không làm menu bị nhảy/di chuyển lên xuống toàn màn hình.
- **Nội dung thực hiện:**
  - **Menu Dropdown trên Mobile (`MobileNavHeader.tsx` & `SiteHeader.module.css`)**:
    - Chuyển `navDropdown` trên mobile về định vị neo trực tiếp dưới thẻ mục cha (`position: absolute !important; top: 100% !important; left: 0 !important; width: 250px; z-index: 120`).
    - Menu chính (`mainHeader`) giữ cuộn ngang mượt mà (`overflow-x: auto; -webkit-overflow-scrolling: touch;`), các thẻ cha (`navItem`) giữ `position: relative` để khi bấm vào mở menu con ngay dưới chân mục đó như trên desktop mà không làm nhảy giao diện.
    - Loại bỏ header và modal backdrop toàn màn hình, đưa trải nghiệm dropdown về gọn gàng, tự nhiên và chuyên nghiệp.
  - **Đổi vị trí Thanh tiện ích trên Mobile (`SiteHeader.module.css` & `globals.css`)**:
    - Cụm Ngày & Giờ (`utilityGroup.utilityContact`): Đặt `order: 1` căn trái (`justify-content: flex-start; text-align: left;`).
    - Cụm Mạng xã hội & Ô tìm kiếm (`utilityGroup.utilityRight`): Đặt `order: 2` căn phải (`justify-content: flex-end;`).
  - **Kiểm tra**:
    - `npm run typecheck`: Pass 100%.
    - `npm run build`: Thành công 100% (45/45 static pages).
- **Files Modified:**
  - `src/components/MobileNavHeader.tsx`
  - `src/components/SiteHeader.module.css`
  - `src/app/globals.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Tinh chỉnh Logo không nền, Tên đơn vị trên 1 dòng và Căn giữa ô trên Điện thoại

- **Thời gian thực hiện:** 17:50 (Asia/Saigon)
- **Yêu cầu:**
  1. Bỏ khung nền trắng bao quanh logo trên điện thoại để logo hòa vào nền tự nhiên.
  2. Tên đơn vị (BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI) không được xuống dòng (`white-space: nowrap`).
  3. Cả cụm logo, tên đơn vị và slogan phải được căn giữa theo chiều dọc trong ô trắng (khắc phục hiện tượng bị lệch lên sát mép trên).
- **Nội dung thực hiện:**
  - `SiteHeader.module.css` & `globals.css`:
    - Đặt `.mastheadLogo` trên mobile: bỏ nền trắng (`background: transparent`), bỏ viền bo và đổ bóng (`box-shadow: none; border-radius: 0; padding: 0`), hiển thị logo nguyên bản trong suốt.
    - Căn giữa dọc trọn vẹn: Thiết lập `.hospitalMasthead { min-height: auto !important; display: flex !important; align-items: center !important; }` và `.hospitalMastheadInner { min-height: 80px !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: auto !important; }` giúp cụm logo và văn bản luôn ở chính giữa ô trắng.
    - Không xuống dòng: Thêm `white-space: nowrap !important; text-overflow: ellipsis; overflow: hidden;` cùng font co giãn tự động `clamp(10.5px, 3.4vw, 14.5px)` cho tên bệnh viện và slogan.
- **Files Modified:**
  - `src/components/SiteHeader.module.css`
  - `src/app/globals.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`


## [2026-09-15] - Thiết kế lại Logo, Tiêu đề bệnh viện, Menu xổ xuống và Thanh tiện ích trên Điện thoại

- **Thời gian thực hiện:** 16:30 (Asia/Saigon)
- **Yêu cầu:**
  1. Thiết kế lại phần logo và tên bệnh viện trên điện thoại cho cân đối, đẹp mắt và chuyên nghiệp.
  2. Thiết kế lại menu trên điện thoại: menu con (dropdown) xổ xuống dễ thao tác (hỗ trợ click chạm trực quan, không bị nhảy giật hay khó bấm).
  3. Thanh tiện ích trên cùng (utility bar) trên điện thoại hiển thị đầy đủ ngày giờ thời gian thực, các biểu tượng mạng xã hội (Facebook, Zalo, YouTube,...) và ô tìm kiếm giống như trên desktop.
- **Nội dung thực hiện:**
  - **Tạo Client Component `MobileNavHeader.tsx`**:
    - Quản lý trạng thái mở/đóng menu con (`openDropdown`) bằng thao tác chạm/click trực tiếp trên điện thoại và máy tính bảng.
    - Hỗ trợ đóng menu tự động khi click ra ngoài màn hình hoặc chọn vào liên kết con.
    - Xoay biểu tượng mũi tên khi mở menu (`chevronRotated`).
  - **Cải tiến Header & CSS (`SiteHeader.module.css` & `globals.css`)**:
    - Tách biệt và tối ưu thanh tiện ích trên mobile: Hiển thị ngày giờ đầy đủ (`utilityCurrentTime`), các icon mạng xã hội tròn (`headerSocial`), và thanh tìm kiếm (`utilitySearch`) gọn gàng với bo góc tròn.
    - Thiết kế lại khối nhận diện thương hiệu `mastheadBrand`: Logo kích thước 58px có viền bo tròn đổ bóng nổi bật, tên bệnh viện (`mastheadBrandText strong`) và slogan (`mastheadBrandText small`) căn lề trái thẳng hàng, cỡ chữ responsive co giãn hài hòa chống rớt từ mồ côi.
    - Tinh chỉnh menu navigation: Khung dropdown trên mobile định vị `position: absolute`, ôm sát thẻ cha, đổ bóng sắc nét và có đường phân cách các mục con rõ ràng, dễ bấm bằng ngón tay.
  - **Kiểm tra**:
    - Chạy `npm run typecheck`: Kết quả **Code 0 - Pass 100%**.
- **Files Modified:**
  - `src/components/MobileNavHeader.tsx` (NEW)
  - `src/components/SiteHeader.tsx`
  - `src/components/SiteHeader.module.css`
  - `src/app/globals.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`


## [2026-09-15] - Tối ưu hiển thị Khối Kỹ thuật chuyên sâu & Chuyên gia trên Điện thoại (Mobile 1 Card View)

- **Thời gian thực hiện:** 15:48 (Asia/Saigon)
- **Yêu cầu:** Trên điện thoại di động, khối "Kỹ thuật chuyên sâu" và "Chuyên gia của chúng tôi" chỉ hiển thị 1 khối (card) duy nhất tại một thời điểm và có nút bấm chuyển (next / prev) để chuyển qua các khối khác, thay vì hiển thị 3 khối cùng lúc.
- **Nội dung thực hiện:**
  - Cập nhật media query mobile (`@media (max-width: 600px)`) cho `AdvancedTechniquesCarousel.module.css`:
    - Giới hạn track hiển thị đúng 1 cột và căn giữa đẹp mắt (`max-width: 360px`, `margin: 0 auto`).
    - Ẩn các card từ vị trí thứ 2 trở đi trên mobile (`.techCardLink:nth-child(n+2) { display: none !important; }`).
  - Cập nhật media query mobile (`@media (max-width: 600px)`) cho `OurExpertsCarousel.module.css`:
    - Giới hạn track hiển thị đúng 1 cột và căn giữa đẹp mắt (`max-width: 360px`, `margin: 0 auto`).
    - Ẩn các card từ vị trí thứ 2 trở đi trên mobile (`.expertCardLink:nth-child(n+2) { display: none !important; }`).
  - Đảm bảo khi người dùng nhấn nút chuyển tiếp (Next / Prev) hoặc vuốt cảm ứng (Swipe touch), card tiếp theo sẽ lập tức được hiển thị mượt mà.
  - Trên màn hình máy tính / tablet, giữ nguyên bố cục nhiều cột theo chuẩn thiết kế.
- **Files Modified:**
  - `src/components/AdvancedTechniquesCarousel.module.css`
  - `src/components/OurExpertsCarousel.module.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`


## [2026-09-15] - Đóng gói Migration 010: Đồng bộ triệt để toàn bộ Cột Database cho Collections và Globals

- **Thời gian thực hiện:** 13:18 (Asia/Saigon)
- **Yêu cầu:** Khắc phục triệt để lỗi thiếu cột `column "enable_link" does not exist` khi website truy vấn Collection Chuyên gia của chúng tôi (`our_experts`) và Kỹ thuật chuyên sâu (`advanced_techniques`). Đồng thời rà soát, đối chiếu toàn bộ 250 bảng giữa Payload CMS schema và PostgreSQL thực tế để không còn bất kỳ lỗi thiếu cột/bảng lẻ tẻ nào.
- **Nội dung thực hiện:**
  - **Rà soát & Đối chiếu Schema Toàn diện:**
    - Quét đối chiếu toàn bộ 250 bảng và 3,886 cột trong cơ sở dữ liệu với `src/payload-generated-schema.ts`.
    - Phát hiện và bổ sung đầy đủ:
      + `our_experts`: `enable_link`, `url`, `open_new_tab`.
      + `advanced_techniques`: `enable_link`, `custom_url`, `show_cover_in_detail`.
      + `contact_settings`: `notice_text_align`, `ct_not_align`.
      + Các bảng draft version tương ứng: `_our_experts_v`, `_advanced_techniques_v`, `_contact_settings_v`.
      + Các kiểu ENUM PostgreSQL: `enum_our_experts_image_fit`, `enum_advanced_techniques_image_fit`, `ct_not_align`.
  - **Tạo Migration `20260915_010_sync_all_remaining_collection_and_global_columns.mjs`**:
    - Cơ chế an toàn `safeAddColumn` kiểm tra bảng thực tế trước khi thực thi `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
    - Tự động hóa hoàn toàn, đảm bảo khi Deploy Railway/Neon cơ chế `prestart` sẽ tự động thực thi.
  - **Đóng gói và xác thực Schema Contract**:
    - Sinh lại Payload Schema: `npm run generate:db-schema`.
    - Seal contract: `npm run db:schema:seal -- 20260915_010_sync_all_remaining_collection_and_global_columns`.
    - Kiểm tra contract: `npm run db:schema:check` (Hợp lệ).
    - Deploy migration: `npm run db:migrate:deploy` (10/10 applied, 0 pending).
    - Kiểm tra đối chiếu lại: **0 cột thiếu, 0 bảng thiếu**.
  - **Build thành công:** `npm run build` vượt qua 100% không có cảnh báo hay lỗi.
- **Files Modified:**
  - `scripts/db-migrations/20260915_010_sync_all_remaining_collection_and_global_columns.mjs` (NEW)
  - `scripts/db-schema-contract.json`
  - `CHANGELOG.md`

## [2026-09-15] - Đóng gói Migration 009: Tạo bảng Sidebar Banners và Đồng bộ Cột Chuyên khoa

- **Thời gian thực hiện:** 12:47 (Asia/Saigon)
- **Yêu cầu:** Khắc phục lỗi thiếu quan hệ PostgreSQL `error: relation "_specialties_v_version_sidebar_banners" does not exist` khi Payload CMS truy vấn draft version của Chuyên khoa (Specialties).
- **Nội dung thực hiện:**
  - **Tạo Migration `20260915_009_create_specialties_sidebar_banners_tables.mjs`**:
    - Tạo bảng mảng con `specialties_sidebar_banners` cho bảng chính `specialties` với đầy đủ các trường `_order`, `_parent_id`, `id`, `image_id`, `title`, `btn_text`, `link`, `open_new_tab`, `desc`, khóa ngoại CASCADE và index.
    - Tạo bảng phiên bản `_specialties_v_version_sidebar_banners` cho bảng `_specialties_v` với khóa chính `serial`, `_uuid`, khóa ngoại CASCADE và index.
    - Bổ sung an toàn (`ADD COLUMN IF NOT EXISTS`) 17 cột cấu hình hiển thị trang chi tiết chuyên khoa cho cả `specialties` và `_specialties_v`.
  - **Đóng gói và xác thực Schema Contract**:
    - Chạy `npm run generate:db-schema` và seal contract bằng `npm run db:schema:seal -- 20260915_009_create_specialties_sidebar_banners_tables`.
    - Kiểm tra `npm run db:schema:check` và triển khai `npm run db:migrate:deploy`.
    - Trạng thái: 9/9 migrations đã applied thành công 100%. Tự động chạy trên Railway/Neon khi deploy.
- **Files Modified:**
  - `scripts/db-migrations/20260915_009_create_specialties_sidebar_banners_tables.mjs` (NEW)
  - `scripts/db-migrations/db-schema-contract.json`
  - `CHANGELOG.md`


- **Thời gian thực hiện:** 12:28 (Asia/Saigon)
- **Yêu cầu:** Xử lý trường hợp người bệnh dùng từ ngữ địa phương (như "nhứt đầu", "nhứt tay", "đau giò cẳng", "đau bao tử", "sanh đẻ", "con nít",...) để chatbot tự hiểu và chuyển đúng câu trả lời/phòng khám chuyên khoa.
- **Nội dung thực hiện:**
  - **Bộ từ điển Phương ngữ Nam Bộ & Tây Nam Bộ (`DIALECT_MAP`)**:
    - Chuẩn hóa thuật toán tìm - thay thế cụm từ đa âm tiết trước, từ đơn tiết sau để không làm biến dạng cấu trúc ngữ nghĩa câu hỏi.
    - Cụm từ triệu chứng đau nhức: `nhut`, `nhuc`, `moi`, `e am`, `thon`, `tuc` => chuẩn hóa thành `dau`.
    - Bộ phận cơ thể địa phương:
      + `nhut tay`, `nhuc tay` => `dau tay` => tự động chuyển hướng **Phòng khám Ngoại Chấn thương** (chụp X-quang, kiểm tra xương khớp).
      + `nhut dau`, `nhuc dau` => `dau dau` => tự động chuyển hướng **Phòng khám Nội Thần kinh** (đo huyết áp, tuần hoàn não).
      + `gio`, `cang`, `gio cang` => `chan` (`dau gio cang` => `dau chan`).
      + `bao tu` => `da day` (`dau bao tu` => tự động chuyển **Phòng khám Nội Tiêu hóa**, nội soi HP, siêu âm bụng).
      + `cu hong` => `hong`, `lo tai` => `tai`, `con mat` => `mat`, `cai rang` => `rang`.
    - Thuật ngữ thai sản & sinh đẻ: `sanh`, `sanh de`, `de con`, `co bau`, `can bau` => tự động chuyển **Khoa Phụ sản** (khám thai, sinh con BHYT).
    - Thuật ngữ nhi khoa: `con nit`, `em be`, `be nho`, `con em`, `oc sua` => tự động chuyển **Khoa Nhi**.
    - Thuật ngữ hành chính & dân sinh: `the` => `the BHYT`, `doi bang/chay xe` => `kham lai xe`, `xin viec/di lam` => `kham suc khoe`, `tien bac/bao nhieu` => `bang gia/chi phi`, `may gio` => `gio lam viec`.
  - **Đồng bộ song song 2 lớp (Dual-Layer Normalizer)**: Tích hợp đồng nhất cả trên Client Component (`WebsiteAssistant.tsx`) và Server Route (`/api/chatbot/route.ts`).
  - **Kiểm thử**: Đã chạy test đối sánh trực tiếp các mẫu câu phương ngữ và kiểm tra tính toàn vẹn hệ thống.
- **Files Modified:**
  - `src/components/WebsiteAssistant.tsx`
  - `src/app/(frontend)/api/chatbot/route.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Mở rộng Ngân hàng Tri thức & Tích hợp Bộ máy Định tuyến Tự động Thông minh

- **Thời gian thực hiện:** 12:20 (Asia/Saigon)
- **Yêu cầu:** Người dân có thể gõ câu hỏi bất kỳ về vấn đề nào thì hệ thống tự động nhận diện và chuyển đúng câu trả lời chính xác cho người dân biết ngay lập tức.
- **Nội dung thực hiện:**
  - **Bộ máy Định tuyến Tự động & So khớp Ý định (Smart Intent Scoring & Auto-Routing)**:
    - Xây dựng thuật toán chấm điểm trọng số từ khóa (Exact match, Substring match, Prefix match) hỗ trợ đầy đủ tiếng Việt có dấu, không dấu, viết hoa/thường, loại bỏ ký tự đặc biệt.
    - Cơ chế định tuyến 2 tầng:
      + **Tầng 1 (Server API `/api/chatbot`)**: Quét tự động trong `chatbotIntents` và toàn bộ kho câu hỏi `customAnswers` trong `site-settings`, tự động thay thế biến động `{{HOTLINE}}`, `{{MEDPRO_URL}}`.
      + **Tầng 2 (Client Engine `WebsiteAssistant.tsx`)**: Bộ xử lý nội bộ phản hồi tức thì với 15 nhóm chủ đề y tế & BHYT chuyên sâu, giải phóng độ trễ mạng và đảm bảo người dân luôn nhận được đúng thông tin.
  - **15 Chuyên đề tri thức tự động nhận diện**:
    1. *BHYT thông tuyến toàn quốc & Mức hưởng 100% không cần giấy chuyển tuyến*.
    2. *Giấy tờ cần mang: CCCD gắn chip, app VNeID, VssID, sổ khám*.
    3. *Quy trình khám bệnh 5 bước khép kín*.
    4. *Bảng giá viện phí, tiền công khám, xét nghiệm, chẩn đoán hình ảnh*.
    5. *Khám sức khỏe lái xe (liên thông Dịch vụ công Quốc gia để đổi bằng online)*.
    6. *Khoa Phụ sản: Khám thai, siêu âm dị tật, sinh nở an toàn, da kề da*.
    7. *Khoa Nhi: Chăm sóc trẻ sơ sinh đến 15 tuổi, miễn phí 100% BHYT cho trẻ < 6 tuổi*.
    8. *Dịch vụ Cận lâm sàng: Xét nghiệm tự động, X-quang DR, Siêu âm Doppler, Nội soi HP, Điện tim ECG*.
    9. *Tiêm chủng vắc xin chuẩn GSP cho trẻ em, bà bầu và người lớn*.
    10. *Thời gian làm việc hành chính & Trực khám ngoài giờ Thứ 7, Chủ Nhật*.
    11. *Lịch khám bác sĩ chuyên khoa trong tuần*.
    12. *Đặt hẹn trực tuyến qua Medpro*.
    13. *Cấp cứu 24/7 và đường dây nóng*.
    14. *Tư vấn định hướng chuyên khoa theo triệu chứng*.
    15. *Địa chỉ và đường đi*.
  - **Kiểm thử**: Toàn bộ bài kiểm tra `npm run validate:all` PASS 100%.
- **Files Modified:**
  - `src/components/WebsiteAssistant.tsx`
  - `src/app/(frontend)/api/chatbot/route.ts`
  - `src/globals/SiteSettings.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Tinh chỉnh Giao diện Trợ lý Y tế ảo: Tối giản, Chuyên nghiệp & Thanh thoát


- **Thời gian thực hiện:** 12:08 (Asia/Saigon)
- **Yêu cầu:** Thiết kế lại Chatbox cho chuyên nghiệp, bỏ thanh cấp cứu hotline đỏ, bỏ nút yêu cầu gọi lại và popup rườm rà, loại bỏ các chi tiết thừa thãi để giao diện thanh thoát và hướng tới trải nghiệm người bệnh tốt nhất.
- **Nội dung thực hiện:**
  - **Loại bỏ toàn bộ phần tử thừa & rườm rà**:
    - Bỏ thanh `assistantMedicalBar` có các nút đỏ "🚨 Cấp cứu: Hotline", "📞 Yêu cầu gọi lại".
    - Bỏ nút gọi điện thoại khẩn cấp màu đỏ trên thanh header `assistantCallHeaderBtn`.
    - Bỏ modal popup `assistantCallbackOverlay` và toàn bộ các trường nhập form gọi lại gây rối mắt.
    - Bỏ các nhãn badge "✚ Y tế Thới Lai" trên từng tin nhắn giúp bong bóng chat thoáng đãng.
  - **Tái thiết kế giao diện thanh lịch & cao cấp (Premium Medical Assistant UI)**:
    - **Header**: Thiết kế gọn gàng, tinh tế với Logo bệnh viện, tên trợ lý, chấm xanh báo trạng thái trực tuyến và nút đóng "×".
    - **Khung hội thoại**: Nền trắng sáng kết hợp tone xanh y tế `#0878D1`, font chữ dễ đọc, cỡ chữ 13px chuẩn mực, khoảng cách tin nhắn hài hòa.
    - **Chủ đề tra cứu nhanh (Quick Topics Chips)**: Dạng viên thuốc (pills) bo tròn thanh nhã nằm gọn phía trên ô nhập liệu (`Lịch khám bác sĩ`, `Đặt lịch khám`, `Khám BHYT & Bảng giá`, `Lịch tiêm chủng`, `Giờ làm việc`, `Gợi ý chuyên khoa`).
    - **Ô nhập liệu (Input Area)**: Tinh gọn, bo góc mềm mại 10px, hiệu ứng focus nhẹ nhàng, nút gửi gọn gàng.
  - **Giữ nguyên logic tra cứu chuyên khoa & hỏi đáp thông minh**:
    - Giữ các câu trả lời súc tích, văn phong lịch sự, trang nhã.
    - Giữ chức năng chuyển tiếp câu hỏi cho tư vấn viên (`/api/consultation`) với nút bấm đơn giản và trạng thái chờ kết nối tự nhiên.
  - **Kiểm thử**: Bộ test suites `npm run validate:all` PASS 100% (61/61 migration tests, 29/29 UAT tests, 21/21 chatbot static tests).
- **Files Modified:**
  - `src/components/WebsiteAssistant.tsx`
  - `src/app/globals.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Nâng cấp Toàn diện Chatbot / Trợ lý Y tế ảo Hướng tới Người bệnh


- **Thời gian thực hiện:** 11:58 (Asia/Saigon)
- **Yêu cầu:** Nâng cấp Chatbox lên chuyên nghiệp hơn, hướng tới hỗ trợ người bệnh trực quan, nhanh chóng và thiết thực.
- **Nội dung thực hiện:**
  - **Thanh Tiện ích Y tế Nhanh (Medical Quick Action Bar)**: Tích hợp ngay dưới header của Chatbot với 4 nút tác vụ tức thì:
    - 🚨 **Cấp cứu: Hotline**: Nút màu đỏ kết nối cuộc gọi cấp cứu ngay lập tức.
    - 📞 **Yêu cầu gọi lại**: Mở form nhận thông tin Họ tên + SĐT để nhân viên CSKH/y tế liên hệ hỗ trợ.
    - 📅 **Lịch khám**: Tra cứu nhanh lịch trực bác sĩ trong tuần.
    - 📝 **Đặt khám**: Kết nối đặt hẹn khám bệnh tiện lợi.
  - **Bộ Sàng lọc Triệu chứng & Chỉ dẫn Khoa phòng (Symptom Guidance)**:
    - Hướng dẫn người bệnh chọn đúng chuyên khoa khi có các triệu chứng đau bụng (Nội tiêu hóa), sốt co giật ở trẻ (Nhi), thai sản (Phụ sản), té ngã xương khớp (Ngoại chấn thương), đau mắt (Mắt)...
    - Kèm khuyến cáo an toàn y tế chuẩn mực.
  - **Bộ Tri thức Hỏi đáp BHYT & Quy trình Khám chữa bệnh phong phú**:
    - Bổ sung các kịch bản chuẩn về BHYT thông tuyến, bảng giá viện phí, giờ làm việc hành chính & ngoài giờ, quy trình khám bệnh.
    - Nhận diện từ khóa thông minh, hỗ trợ tiếng Việt có dấu và không dấu.
  - **Form Yêu cầu Gọi lại (Callback Modal)**:
    - Tiếp nhận thông tin bệnh nhân (Họ tên, SĐT, Nhu cầu khám) gửi vào API `/api/consultation`.
  - **Tối ưu Giao diện Chuẩn Y tế (Medical Modern UI)**:
    - Nâng cấp CSS hiện đại với bo góc 24px, đổ bóng y tế cao cấp, viền nhận diện thương hiệu, responsive tối ưu trên cả di động và máy tính.
  - **Kiểm thử**: Bộ test suites `npm run validate:all` PASS 100% (61/61 migration tests, 29/29 UAT tests).
- **Files Modified:**
  - `src/components/WebsiteAssistant.tsx`
  - `src/app/globals.css`
  - `src/globals/SiteSettings.ts`
  - `src/app/(frontend)/api/consultation/route.ts`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Cập nhật SMTP Cổng 587 (TLS) & Chống Timeout Treo Khởi Động trên Railway

- **Thời gian thực hiện:** 11:32 (Asia/Saigon)
- **Yêu cầu:** Khắc phục lỗi Railway container bị treo `Error verifying Nodemailer transport ... Connection timeout (ETIMEDOUT)` khi kết nối cổng 465.
- **Nội dung thực hiện:**
  - Chuyển cổng SMTP mặc định từ `465` (SSL) sang `587` (STARTTLS) tương thích 100% với môi trường container và tường lửa máy chủ đám mây Railway.
  - Thiết lập timeout bảo vệ (`connectionTimeout: 10000`, `greetingTimeout: 10000`, `socketTimeout: 15000`) và cấu hình `tls: { rejectUnauthorized: false }` để đảm bảo Nodemailer không bao giờ chặn hoặc làm treo quá trình khởi động ứng dụng.
  - Cập nhật `.env.example`: đặt `SMTP_PORT=587`.
  - Kiểm tra kết nối SMTP thực tế: `587 Success: true`.
  - Bộ test suites `npm run validate:all`: PASS 100%.
- **Files Modified:**
  - `payload.config.ts`
  - `.env.example`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Đóng gói Migration 008: Đưa toàn bộ Cấu hình Email SMTP gửi tự động vào Admin CMS

- **Thời gian thực hiện:** 11:15 (Asia/Saigon)
- **Yêu cầu:** Cho phép Ban quản trị bệnh viện có thể xem, thay đổi thông tin máy chủ SMTP, tài khoản hòm thư gửi mail tự động (Gmail, mail theo tên miền, mật khẩu ứng dụng, cổng kết nối, tên người gửi) trực tiếp từ giao diện Admin CMS mà không cần sửa code hay can thiệp vào biến môi trường `.env`.
- **Nội dung thực hiện:**
  - Thêm nhóm cấu hình `smtpSettings` vào Global `SiteSettings.ts` (**Trang chủ & Giao diện Website -> Header & Nhận diện -> 📧 Cấu hình Email gửi tự động (SMTP / Quên mật khẩu)**) với các trường:
    - `enabled`: Công tắc bật/tắt gửi email tự động.
    - `host`: Máy chủ SMTP (mặc định: `smtp.gmail.com`).
    - `port`: Cổng kết nối (mặc định: `465`).
    - `user`: Tài khoản email gửi (`leean170792@gmail.com`).
    - `pass`: Mật khẩu ứng dụng (App Password 16 chữ cái từ Google).
    - `fromAddress`: Địa chỉ email người gửi hiển thị.
    - `fromName`: Tên người gửi hiển thị (**Bệnh viện Đa khoa Khu vực Thới Lai**).
  - Cập nhật mẫu email đặt lại mật khẩu trong `Users.ts`:
    - Tiêu đề: `[BV Đa khoa Thới Lai] Yêu cầu đặt lại mật khẩu tài khoản`.
    - Giao diện HTML chuẩn nhận diện thương hiệu y tế bệnh viện, có nút bấm đặt lại mật khẩu trực quan và cảnh báo bảo mật thời hạn 2 giờ.
  - Tạo Migration `scripts/db-migrations/20260915_008_add_smtp_settings_to_site_settings.mjs`:
    - Thêm các cột `smtp_settings_*` vào bảng `site_settings` và `version_smtp_settings_*` vào bảng `_site_settings_v`.
    - Có hàm `verify()` kiểm tra cột vật lý trên cơ sở dữ liệu.
  - Cập nhật và khóa schema contract: `npm run db:schema:seal -- 20260915_008_add_smtp_settings_to_site_settings`.
  - Áp dụng migration tại local: 8/8 applied thành công.
  - Chạy toàn bộ test suites `npm run validate:all`: PASS 100% (61/61 migration tests, 29/29 UAT tests).
- **Files Modified:**
  - `src/globals/SiteSettings.ts`
  - `src/collections/Users.ts`
  - `src/payload-generated-schema.ts`
  - `src/payload-types.ts`
  - `scripts/db-migrations/20260915_008_add_smtp_settings_to_site_settings.mjs` (Mới)
  - `scripts/db-schema-contract.json`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`
- **Database / Schema:**
  - Cột mới trong `site_settings`: `smtp_settings_enabled`, `smtp_settings_host`, `smtp_settings_port`, `smtp_settings_user`, `smtp_settings_pass`, `smtp_settings_from_address`, `smtp_settings_from_name`.
  - Cột mới trong `_site_settings_v`: `version_smtp_settings_enabled`, `version_smtp_settings_host`, `version_smtp_settings_port`, `version_smtp_settings_user`, `version_smtp_settings_pass`, `version_smtp_settings_from_address`, `version_smtp_settings_from_name`.

## [2026-09-15] - Tích hợp Dịch vụ Gửi Email Thật (Nodemailer Gmail SMTP) cho CMS & Quên mật khẩu

- **Thời gian thực hiện:** 10:40 (Asia/Saigon)
- **Yêu cầu:** Khắc phục cảnh báo `[WARN]: No email adapter provided. Email will be written to console`, đồng thời kích hoạt tính năng gửi email thực tế để người dùng có thể tự đặt lại mật khẩu khi bấm "Quên mật khẩu".
- **Nội dung thực hiện:**
  - Cài đặt adapter chính thức: `@payloadcms/email-nodemailer` và `nodemailer` kèm types.
  - Cấu hình Email Adapter trong `payload.config.ts`:
    - Hỗ trợ gửi thư qua Gmail SMTP (`smtp.gmail.com`, SSL Port `465`).
    - Xác thực an toàn với tài khoản `leean170792@gmail.com` và Mật khẩu ứng dụng.
    - Tiêu đề người gửi đại diện chính thức: **Bệnh viện Đa khoa Khu vực Thới Lai**.
    - Đã kiểm tra kết nối SMTP thực tế tới máy chủ Google: `SMTP CONNECTION SUCCESSFUL!`.
  - Cập nhật tài liệu biến môi trường mẫu `.env.example`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME`.
  - Kiểm tra toàn bộ test suites và typecheck: PASS 100%.
- **Files Modified:**
  - `payload.config.ts`
  - `package.json`
  - `package-lock.json`
  - `.env.example`
  - `CHANGELOG.md`


## [2026-09-15] - Đóng gói Migration 007: Đồng bộ toàn diện Tech Items, Expert Items, Theme Settings và Site Settings Page Configs

- **Thời gian thực hiện:** 09:45 (Asia/Saigon)
- **Yêu cầu:** Khắc phục triệt để lỗi thiếu cột/bảng trên Neon gây lỗi truy vấn `homepage`, `site-settings`, `theme-settings` khi chạy trên Railway (`column homepage_sections_techniqueItems.enable_link does not exist`, `column site_settings.examination_flow_page_eyebrow does not exist`, `column "page_hero_bg_type" does not exist`).
- **Nguyên nhân cốt lõi:**
  1. Các trường Smart Links (`enable_link`, `link_mode`, `linked_page_id`, `new_page_title`, `new_page_slug`, `url`, `open_new_tab`) của `tech_items`, `expert_items`, `_tech_items_v`, `_expert_items_v` chưa có trên cơ sở dữ liệu Neon.
  2. Bảng cấu hình giao diện `theme_settings` và bảng phiên bản `_theme_settings_v` (cùng các trường `page_hero_*`, `section_global_*`, `detail_layout_*`) chưa được khởi tạo/đồng bộ đầy đủ trên Neon.
  3. Cấu hình các trang tiện ích người bệnh trong `site_settings` và `_site_settings_v` (`examination_flow_page_*`, `quality_page_*`, `survey_page_*`, `faq_page_*`, `forms_page_*`, `service_price_page_*`, `vaccination_page_*`) chưa có trên database Neon.
- **Nội dung thực hiện:**
  - Tạo migration `scripts/db-migrations/20260915_007_sync_all_missing_columns_and_tables.mjs`:
    - Tạo đầy đủ 26 kiểu Enums liên quan (tech/expert links & image fit, theme fonts, page hero bg, notice alignments).
    - Thêm toàn bộ các cột liên kết thông minh cho `tech_items`, `expert_items`, `_tech_items_v`, `_expert_items_v`.
    - Thêm tất cả các cột cấu hình trang cho `site_settings` và `_site_settings_v`.
    - Tạo bảng `theme_settings` và `_theme_settings_v` kèm toàn bộ 80+ cột tùy biến giao diện, padding, màu sắc, share social và sidebar banners.
    - Khởi tạo dòng mặc định (`primary_color = #0878D1`) cho `theme_settings` nếu đang trống.
    - Hàm `verify()` kiểm tra độc lập sự hiện diện của các cột cốt lõi.
  - Khóa Schema Contract `20260915_007_sync_all_missing_columns_and_tables` và xác minh:
    - `npm run db:schema:seal -- 20260915_007_sync_all_missing_columns_and_tables`
    - `npm run db:migrate:deploy` (7 applied, 0 pending).
    - `npm run validate:all` PASS 100% (57/57 migration tests, 29/29 UAT tests).
- **Files Modified:**
  - `scripts/db-migrations/20260915_007_sync_all_missing_columns_and_tables.mjs` (Mới)
  - `scripts/db-schema-contract.json`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`
- **Database / Schema:**
  - Đồng bộ trọn vẹn `tech_items`, `expert_items`, `_tech_items_v`, `_expert_items_v`, `theme_settings`, `_theme_settings_v`, `site_settings`, `_site_settings_v`.

## [2026-09-15] - Đóng gói Migration 006: Tự động Seed 12 khối Section chuẩn y tế cho Homepage

- **Thời gian thực hiện:** 09:18 (Asia/Saigon)
- **Yêu cầu:** Khắc phục trường hợp trang quản trị `/admin/globals/homepage` trên server production bị trống mảng "Bố cục & giao diện các mục trang chủ" (sections).
- **Nguyên nhân:** Lần khởi tạo database đầu tiên trên môi trường mới chỉ seed trường `banners` mà chưa seed mảng lồng nhau `sections` của Homepage, khiến danh sách khối rỗng nếu quản trị viên chưa bấm thêm thủ công.
- **Nội dung thực hiện:**
  - Đóng gói migration `scripts/db-migrations/20260915_006_seed_default_homepage_sections.mjs`:
    - Kiểm tra bảng `homepage_sections` cho bản ghi `homepage`.
    - Nếu bảng đang trống (`count == 0`), tự động nạp đầy đủ 12 khối Section chuẩn y tế (Tin tức nổi bật, Kỹ thuật chuyên sâu, Đội ngũ bác sĩ, Cổng thông tin, Đơn vị trực thuộc/Medpro, Thông báo, Đấu thầu, Lịch khám, Tiêm chủng, Hoạt động khoa học, Giới thiệu, Văn bản).
    - Tự động nạp các tab con cho Lịch khám (`emergency`, `daily`, `weekly`, `attachments`) và Tiêm chủng (`announcements`, `campaigns`, `vaccines`).
    - Có kiểm tra điều kiện an toàn (`ON CONFLICT DO NOTHING`, giữ nguyên dữ liệu nếu đã có sẵn).
  - Khóa Schema Contract `20260915_006_seed_default_homepage_sections` và xác minh: PASS 100%.
- **Files Modified:**
  - `scripts/db-migrations/20260915_006_seed_default_homepage_sections.mjs` (Mới)
  - `scripts/db-schema-contract.json`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-15] - Đóng gói Migration 005: Khắc phục lỗi Drizzle Query site_settings & homepage trên Production

- **Thời gian thực hiện:** 08:55 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi Railway container khởi động ghi nhận lỗi `[HomePage] site-settings error` và `[HomePage] getHomepage error` khi query bảng `site_settings` và `homepage`.
- **Nguyên nhân cốt lõi:**
  1. Thiếu các cột `version_*` trong bảng phiên bản `_site_settings_v` (do SiteSettings có bật tính năng `versions`). Khi Drizzle/Payload truy vấn, ORM kết nối cả bảng chính và bảng phiên bản.
  2. Sự sai khác kiểu enum giữa migration 004 và Drizzle schema: `header_slogan_align` thay vì `enum_site_settings_header_brand_appearance_slogan_align`, các enum notice align `pp_not_align`, `lt_not_align`, `sa_not_align`, `cp_not_align`, và thiếu giá trị `'custom'` trong `brand_color_scheme`.
  3. Bảng phụ `fn_sources` và `_fn_sources_v` (featuredSources của các section trên Trang chủ) chưa được tạo trên PostgreSQL Neon.
- **Nội dung thực hiện:**
  - Tạo migration `scripts/db-migrations/20260915_005_fix_brand_enums_versions_and_fn_sources.mjs` xử lý chuẩn hóa toàn diện:
    - Tạo chuẩn các enum `brand_color_scheme` (có `'custom'`), `brand_name_font`, `header_slogan_align`, `pp_not_align`, `lt_not_align`, `sa_not_align`, `cp_not_align`, `enum_fn_sources_source`, `enum__fn_sources_v_source`.
    - Chuyển đổi an toàn các cột ở bảng `site_settings` sang đúng kiểu enum.
    - Thêm toàn bộ các cột `version_*` cho bảng phiên bản `_site_settings_v`.
    - Tạo bảng `fn_sources` và `_fn_sources_v` kèm index và quan hệ foreign key.
  - Chạy `npm run generate:db-schema` và seal contract `20260915_005_fix_brand_enums_versions_and_fn_sources`.
  - Chạy apply thành công tại database: `npm run db:migrate:deploy` (5 applied, 0 pending).
  - Xác thực toàn bộ test suite `npm run validate:all`: PASS 100%.
  - Cải tiến bắt lỗi chi tiết trong `src/app/(frontend)/page.tsx` (`e?.cause?.message`).
- **Files Modified:**
  - `scripts/db-migrations/20260915_005_fix_brand_enums_versions_and_fn_sources.mjs` (Mới)
  - `scripts/db-schema-contract.json`
  - `src/app/(frontend)/page.tsx`
  - `CHANGELOG.md`
- **Database / Schema:**
  - Cập nhật enum và bảng `fn_sources`, `_fn_sources_v`, bảng `_site_settings_v`.

## [2026-09-15] - Tích hợp Rule 15 (Mandatory DB Migration Packaging) & Đóng gói Migration 004

- **Thời gian thực hiện:** 07:36 (Asia/Saigon)
- **Yêu cầu:** Bắt buộc mọi thay đổi tính năng / thêm trường phải đóng gói migration tự động để deploy Railway/Neon không phải gõ SQL thủ công.
- **Nội dung thực hiện:**
  - Bổ sung **Quy tắc 15 (MANDATORY DB MIGRATION PACKAGING)** vào `AGENTS.md`.
  - Đóng gói file migration `scripts/db-migrations/20260915_004_header_brand_appearance_and_page_configs.mjs` chứa đầy đủ enums và columns mới của `headerBrandAppearance` và 4 page configs.
  - Cập nhật và seal `scripts/db-schema-contract.json`.
  - Chạy apply thành công tại local: `npm run db:migrate:deploy` (100% verified).
  - Soạn thảo và lưu trữ tài liệu chiến lược triển khai Production VPS tối ưu tại `docs/CHIEN-LUOC-TRIEN-KHAI-VPS.md` (lựa chọn giải pháp Coolify & Docker tự động hóa CI/CD khi push GitHub, Rolling Update Zero-Downtime và Auto-Backup).
  - Ghi nhận quyết định kiến trúc chính thức vào `DECISIONS.md`.

## [2026-09-15] - Khép kín đồng bộ GitHub → Railway → Neon

- **Thời gian thực hiện:** 06:45–07:12 (Asia/Saigon)
- **Yêu cầu:** Khi push code/tính năng mới lên GitHub, Railway phải tự đồng bộ cấu trúc Neon trước khi chạy giao diện; không còn tình trạng code mới đọc database cũ bị thiếu bảng/cột/enum.

### Nội dung thay đổi

- Đổi `npm prestart` từ verify-only sang tự chạy migration idempotent. `Dockerfile` dùng `npm start`, vì vậy mọi container Railway đều apply + verify schema trước khi Next.js mở cổng, kể cả khi Dashboard chưa cấu hình Pre-Deploy.
- Giữ Railway Pre-Deploy là lớp bảo vệ sớm; advisory lock và ledger giúp Pre-Deploy/startup hoặc nhiều replica chạy đồng thời mà không áp dụng migration hai lần.
- Thêm schema contract SHA-256 gắn `payload-generated-schema.ts` với migration mới nhất. Build bị chặn nếu schema đổi nhưng thiếu migration, thiếu seal, hoặc cố tái sử dụng ID migration cũ.
- `prebuild` luôn sinh lại DB schema rồi kiểm tra contract, ngăn trường hợp quên chạy generator ở local nhưng vẫn push GitHub.
- Migration runner ưu tiên `DATABASE_MIGRATION_URL`, sau đó `DATABASE_URL_UNPOOLED`; production từ chối Neon URL có hostname `-pooler` cho thao tác DDL. `DATABASE_URL` pooled vẫn dùng bình thường cho runtime ứng dụng.
- Bổ sung bài kiểm thử hành vi contract và preflight Neon Direct URL; cập nhật đầy đủ quy trình thêm field/enum/Collection/Global, backfill dữ liệu hệ thống và phân biệt schema với nội dung người dùng.
- Thêm GitHub Actions quality gate không cần database secret để kiểm tra schema contract, TypeScript và toàn bộ regression trên mỗi push/pull request.

### Files Modified

- `package.json`
- `scripts/db-migrate.mjs`
- `scripts/db-schema-contract.mjs`, `scripts/db-schema-contract.json`
- `scripts/validate-db-schema-contract.mjs`, `scripts/seal-db-schema.mjs`
- `scripts/test-db-schema-contract.mjs`
- `scripts/validate-db-migrations.mjs`, `scripts/validate-uat-production.mjs`
- `scripts/preflight-production.mjs`
- `scripts/db-migrations/README.md`
- `.github/workflows/quality-gate.yml`
- `.env.example`, `.env.production.example`
- `docs/RAILWAY-DEPLOYMENT.md`, `docs/DEPLOYMENT.md`
- `DECISIONS.md`, `CURRENT-TASK.md`, `CHANGELOG.md`

### Database / Collections / Schema

- Không thêm/xóa/đổi bảng, cột hoặc enum trong thay đổi này; không sửa dữ liệu nội dung.
- Database local vẫn có 3 migration applied, 0 pending và verify thành công.
- Neon production chưa được kết nối hoặc thay đổi từ máy local. Khi Railway chạy code mới, runner sẽ dùng Direct connection string để áp dụng đúng các migration còn thiếu trên Neon.
- `PAYLOAD_DB_PUSH=false` tiếp tục là bắt buộc trên production.

### Validation

- Schema contract hiện tại: PASS; mô phỏng schema đổi thiếu migration/tái sử dụng ID/migration mới: 4/4 PASS.
- Neon pooled-only migration bị chặn; pooled runtime + Direct migration vượt production preflight: PASS.
- `npm prestart`: PASS, tự apply/verify 3 migration, 0 pending.
- Production build Next.js 16.3.5: PASS, 45 trang; contract được kiểm tra trong `prebuild`.
- Production smoke: `/api/health` và `/admin` trả HTTP 200.
- `npm run typecheck`: PASS, 0 lỗi; `npm run validate:all`: PASS 243/243.

## [2026-09-15] - Bổ sung hệ thống migration PostgreSQL an toàn cho Railway

- **Thời gian thực hiện:** 23:10 ngày 14/09 đến 00:05 ngày 15/09 (Asia/Saigon)
- **Yêu cầu:** Ngăn lỗi không đồng bộ dữ liệu/schema khi bổ sung tính năng rồi cập nhật ứng dụng trên Railway.

### Nội dung thay đổi

- Thêm migration runner có phiên bản, checksum SHA-256, ledger trong database, PostgreSQL advisory lock chống chạy đồng thời, transaction theo từng migration và bước verify schema bắt buộc.
- Hỗ trợ bốn chế độ: apply, status, dry-run và verify-only; mọi lỗi đều trả exit code khác 0 để Pre-Deploy của Railway chặn bản phát hành lỗi.
- Chuyển script migration cũ thành wrapper tương thích và tạo ba migration baseline/additive cho các trường hiển thị ảnh, quyền tùy chỉnh người dùng và tên bảng phụ an toàn.
- `npm start` kiểm tra schema bằng `--verify-only` trước khi mở server; migration thay đổi schema được chạy riêng bằng Railway Pre-Deploy Command `npm run db:migrate:deploy`.
- Preflight production từ chối `PAYLOAD_DB_PUSH=true`; bổ sung biến timeout mẫu, tài liệu Railway, quy trình backup và chiến lược expand → backfill → contract cho dữ liệu lớn.
- Không thêm `railway.json` legacy vì Railway đã ngừng khuyến nghị Config as Code kiểu cũ; hướng dẫn cấu hình qua Dashboard hoặc IaC sau khi liên kết dự án.

### Files Modified

- `scripts/db-migrate.mjs`
- `scripts/db-migrations/20260914_001_content_image_display_fields.mjs`
- `scripts/db-migrations/20260914_002_user_custom_permissions.mjs`
- `scripts/db-migrations/20260914_003_shorten_nested_table_names.mjs`
- `scripts/db-migrations/README.md`
- `scripts/apply-changelog-migrations.mjs`
- `scripts/validate-db-migrations.mjs`
- `scripts/preflight-production.mjs`
- `scripts/validate-uat-production.mjs`
- `package.json`
- `.env.example`, `.env.production.example`
- `docs/RAILWAY-DEPLOYMENT.md`, `docs/DEPLOYMENT.md`
- `HUONG-DAN-TAO-DATABASE-MOI.md`
- `src/globals/SiteSettings.ts`, `src/globals/Homepage.ts`, `src/globals/HospitalHistory.ts`
- `src/payload-generated-schema.ts`
- `DECISIONS.md`, `CURRENT-TASK.md`, `CHANGELOG.md`

### Database / Collections / Schema

- Tạo bảng kỹ thuật `public.bvdk_schema_migrations` để lưu `id`, `checksum`, mô tả, thời điểm áp dụng và thời gian chạy; không chứa dữ liệu nghiệp vụ.
- Ghi nhận ba migration đã áp dụng: `20260914_001_content_image_display_fields`, `20260914_002_user_custom_permissions` và `20260914_003_shorten_nested_table_names`.
- Migration 001 đảm bảo 12 cột `image_fit`/`image_position` trong `news`, `notices`, `procurement` và ba bảng version tương ứng; dùng `ADD COLUMN IF NOT EXISTS`, không xóa hoặc ghi đè dữ liệu.
- Migration 002 đảm bảo `users.use_custom_permissions boolean DEFAULT false`; không thay đổi dữ liệu quyền cũ.
- Migration 003 đổi tên an toàn 8 bảng array phụ và 2 PostgreSQL enum của SiteSettings/Homepage/HospitalHistory, đồng thời chuẩn hóa tên index/constraint. Toàn bộ thao tác nằm trong một transaction và bảo toàn dữ liệu; lần kiểm thử đầu không đạt verify đã rollback toàn bộ trước khi sửa bộ nhận diện catalog rồi chạy lại thành công.
- Bổ sung `dbName` ngắn: `site_assistant_topics`, `site_assistant_answers`, `homepage_vax_tabs`, `history_core_values`; schema được sinh lại không còn identifier vượt 63 byte.
- Không dùng `DROP`, `TRUNCATE`, reset database hoặc schema push tự động. Trạng thái cuối: 3 applied, 0 pending, verify đầy đủ thành công.

### Validation

- Dry-run, apply, status, verify-only: PASS; chạy đồng thời hai tiến trình: PASS; lỗi tham số giả trả exit code 1: PASS.
- `npm run typecheck`: PASS, 0 lỗi.
- `npm run validate:all`: PASS 227/227, gồm 31/31 kiểm tra riêng cho migration và giới hạn identifier PostgreSQL.
- Production build Next.js 16.3.5: PASS, 45 trang tĩnh.
- Production startup: prestart xác nhận 3 applied/0 pending; `/api/health`, `/`, `/admin` và `/gioi-thieu/lich-su-phat-trien` đều trả HTTP 200; database và storage đều `ok`.
- Dev server khởi động lại thành công trong 429 ms; bốn route kiểm tra đều HTTP 200 và log xác nhận không còn cảnh báo identifier PostgreSQL vượt 63 ký tự.
- Production preflight local chủ động FAIL vì shell kiểm thử không có bốn secret/URL của Railway; cơ chế chặn cấu hình thiếu hoạt động đúng.

## [2026-09-14] - Thiết kế lại phân quyền Admin theo ma trận checkbox

- **Thời gian thực hiện:** 22:58 (Asia/Saigon)
- **Yêu cầu:** Cho phép quản trị viên chọn chính xác từng mục trong Admin và từng thao tác mà mỗi tài khoản được phép thực hiện.

### Nội dung thay đổi

- Bổ sung giao diện ma trận quyền responsive, chia nhóm nghiệp vụ; hỗ trợ tích từng thao tác, chọn tất cả/bỏ chọn từng module và hiển thị tổng số quyền đã cấp.
- Thêm công tắc `useCustomPermissions`:
  - Tắt: giữ quyền mặc định của vai trò và cộng thêm quyền đã tích, tương thích tài khoản cũ.
  - Bật: chỉ cấp đúng module/thao tác đã tích; bỏ chọn quyền xem sẽ thu hồi toàn bộ quyền của module.
- Giữ toàn quyền bắt buộc cho `super-admin`, `system-admin`, `admin` để tránh tự khóa hệ thống.
- Menu Collections/Globals, thẻ Dashboard và nút tạo mới được lọc theo quyền; dashboard chi tiết hệ thống chỉ hiển thị cho quản trị cấp cao.
- Access control phía server được áp dụng cho lịch hẹn, kỹ thuật chuyên sâu, chuyên gia, chuyển hướng, phác đồ và các Global cấu hình website; người không có quyền xem chỉ đọc được dữ liệu đã công khai, không đọc được bản nháp qua API.
- API xuất/thống kê khảo sát chuyển sang dùng cùng ma trận quyền thay cho kiểm tra vai trò hardcode.
- Khi role, trạng thái, khoa/phòng hoặc ma trận quyền thay đổi, các phiên đăng nhập cũ của tài khoản bị thu hồi để quyền mới có hiệu lực ngay sau lần đăng nhập tiếp theo.
- Chuẩn hóa script sửa schema Users để `ALTER TYPE ... ADD VALUE` chạy ngoài transaction, tương thích PostgreSQL hiện tại.

### Files Modified

- `payload.config.ts`
- `src/access/index.ts`, `src/access/permissionCatalog.ts`
- `src/collections/Users.ts`, `Appointments.ts`, `AdvancedTechniques.ts`, `OurExperts.ts`, `Redirects.ts`, `ClinicalProtocols.ts`
- Các collection nội dung công khai dùng access theo module: `News.ts`, `Notices.ts`, `Pages.ts`, `Procurement.ts`, `Recruitment.ts`, `CustomPosts.ts`, `ContentSections.ts`, `DynamicModules.ts`, `ScientificActivities.ts`, `Schedules.ts`, `Services.ts`, `ServicePrices.ts`, `Vaccinations.ts`, `VaccinationSchedules.ts`, `Vaccines.ts`, `VaccinePrices.ts`
- `src/components/admin/PermissionMatrixField.tsx`, `PermissionMatrixField.module.css`, `AdminDashboard.tsx`
- `src/globals/SiteSettings.ts`, `Navigation.ts`, `Footer.ts`, `ContactSettings.ts`, `ThemeSettings.ts`, `Homepage.ts`, `MedproSettings.ts`, `QuickLinksSettings.ts`, `AppointmentSettings.ts`
- `src/app/(frontend)/api/surveys/export/route.ts`, `src/app/(frontend)/api/surveys/statistics/route.ts`
- `scripts/repair-users-schema.mjs`, `scripts/validate-foundation.mjs`
- `src/payload-types.ts`, `src/app/(payload)/admin/importMap.js`
- `DECISIONS.md`, `CURRENT-TASK.md`, `CHANGELOG.md`

### Database / Collections / Schema

- Thêm cột an toàn: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS use_custom_permissions boolean DEFAULT false`.
- Không thay đổi cấu trúc ba bảng quyền hiện có (`users_permissions`, `users_permissions_actions`, `users_sessions`) và không xóa dữ liệu phân quyền cũ.
- Users không bật versions nên không có bảng phiên bản cần đồng bộ.
- Lần chạy đầu gặp giới hạn PostgreSQL với `ALTER TYPE` trong transaction và đã rollback toàn bộ; script được sửa rồi chạy lại thành công.
- Audit schema sau đồng bộ: 0 vấn đề. Payload Local API truy vấn `users.useCustomPermissions` thành công.
- `PAYLOAD_DB_PUSH` tiếp tục giữ `false`; VPS có thể chạy `npm run repair:users-schema -- --apply` để đồng bộ cột an toàn.

### Validation

- Logic cấp/thu hồi quyền: 7/7 PASS.
- Ẩn/hiện menu Collections/Globals: 4/4 PASS.
- Thu hồi phiên khi thay đổi quyền và không thu hồi khi chỉ sửa hồ sơ: 2/2 PASS.
- `npm run typecheck`: PASS, 0 lỗi.
- `npm run validate:all`: PASS 193/193, gồm 26/26 kiểm tra nền tảng và hồi quy phân quyền.
- Production build Next.js 16.3.5: PASS, 45 trang.
- Dev server khởi động lại thành công; `GET /admin` trả HTTP 200.

## [2026-09-14] - Khắc phục runtime Sharp sau nâng dependency

- **Thời gian thực hiện:** 22:19 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi Turbopack không tải được external module Sharp từ cache dev cũ.
- **Nguyên nhân:** Dev server Next.js 16.3.2 vẫn giữ cache `.next/dev` tham chiếu entry `sharp/lib/index.js`, trong khi dự án đã nâng lên Next.js 16.3.5 và Sharp 0.35.4 sử dụng entry trong `dist/`.
- **Xử lý:** Dừng đúng cây tiến trình Next của dự án, xóa riêng cache `.next/dev`, xác nhận Sharp 0.35.4/libvips 8.18.6 tải thành công và khởi động lại dev server.
- **Files Modified:** `CHANGELOG.md`, `CURRENT-TASK.md`; Payload types được `predev` xác nhận/tái sinh theo cấu hình hiện tại.
- **Database / Collections / Schema:** Không thay đổi; không chạy migration.
- **Validation:** Next.js 16.3.5 Ready; `GET /` trả HTTP 200, 197530 bytes; log dev không còn lỗi Sharp.

## [2026-09-14] - Khắc phục lỗi sau audit và cập nhật bảo mật dependency

- **Thời gian thực hiện:** 22:10 (Asia/Saigon)
- **Yêu cầu:** Sửa các lỗi được phát hiện sau khi kiểm tra toàn dự án; không commit hoặc đưa dự án lên GitHub.

### Nội dung thay đổi

- Loại bỏ credential PostgreSQL hardcode khỏi file mẫu, tài liệu và các script database; các script dùng `process.env.DATABASE_URL`.
- Bổ sung fallback collection `vaccinations` cho trang `/tiem-chung`; dữ liệu legacy chỉ được dùng khi collection mới tương ứng chưa có dữ liệu.
- Đồng bộ validator Feedback và UAT/Production với markup, version, cấu hình `PAYLOAD_DB_PUSH` và vị trí tài liệu hiện tại.
- Bỏ custom `Cache-Control` cho `/_next/static` để Next.js tự quản lý immutable assets.
- Nâng Next.js `16.3.2` → `16.3.5`, toàn bộ Payload CMS `3.88.0` → `3.89.0`, Sharp → `0.35.4`.
- Thay thư viện `xlsx` có cảnh báo high bằng `exceljs` cho luồng import lịch ngày/lịch trực; upload chỉ nhận `.xlsx`.
- Override `uuid` của ExcelJS lên `11.1.1` để loại bỏ cảnh báo bảo mật cũ.

### Files Modified

- `.env.example`
- `HUONG-DAN-TAO-DATABASE-MOI.md`
- `migrate-specialty-detail-cms.mjs`
- `next.config.mjs`
- `package.json`, `package-lock.json`
- `scripts/apply-changelog-migrations.mjs`
- `scripts/create-emergency-template.cjs`
- `scripts/migrate_menu_appearance.js`
- `scripts/seed-departments.mjs`
- `scripts/sync_about_db.js`
- `scripts/validate-chatbot-forms-feedback.mjs`
- `scripts/validate-uat-production.mjs`
- `src/app/(frontend)/api/emergency-import/route.ts`
- `src/app/(frontend)/tiem-chung/page.tsx`
- `src/components/admin/DailyTemplateDownload.tsx`
- `src/components/admin/EmergencyTemplateDownload.tsx`
- `src/lib/dailyScheduleExcelParser.ts`
- `src/lib/emergencyExcelParser.ts`
- `src/lib/excelRows.ts`
- `CURRENT-TASK.md`

### Database / Collections / Schema

- Không thay đổi schema hoặc dữ liệu PostgreSQL.
- Không chạy migration và giữ nguyên quy tắc `PAYLOAD_DB_PUSH=false` trên local.

### Validation

- `npm run generate:importmap`: đạt.
- `npm run generate:types`: đạt.
- `npm run typecheck`: đạt, 0 lỗi.
- `npm run validate:all`: đạt 187/187.
- Production build Next.js 16.3.5: đạt, 45 trang.
- Kiểm thử ExcelJS với file thật: 35 dòng lịch trực, 22 phân công lịch ngày.
- `npm audit`: không còn high/critical; còn 5 moderate từ chuỗi Payload/Drizzle/esbuild chưa có bản vá upstream.


## [2026-09-14] - Audit Admin CMS Toàn Diện + Nâng Cấp Nhận Diện Thương Hiệu (headerBrandAppearance)

- **Thời gian thực hiện:** 21:04 (Asia/Saigon)
- **Yêu cầu:** Kiểm tra tất cả Admin CMS phát hiện thiếu/trùng; nâng cấp phần tên đơn vị và slogan với bảng màu, kiểu chữ và hiệu ứng nổi bật.

### A. Audit Admin CMS – Phát hiện & khắc phục:

| Vấn đề | Hành động |
|--------|-----------|
| `/danh-cho-nguoi-benh` chưa có group cấu hình | Thêm `patientPortalPage` group |
| `/lich-truc` chưa có group cấu hình | Thêm `lichTrucPage` group |
| `/hoat-dong-khoa-hoc` chưa có group cấu hình | Thêm `scienceActivityPage` group |
| `/phac-do-dieu-tri` chưa có group cấu hình | Thêm `clinicalProtocolPage` group |
| Group `brand` cuối SiteSettings trùng với `headerBrandAppearance` | Ẩn (`admin.hidden: true`) |

### B. Nâng cấp `headerBrandAppearance` – Tên đơn vị & Slogan:

**Thêm fields vào Admin CMS (`SiteSettings.ts`):**
- `colorScheme` (select): 6 bảng màu preset (Y tế xanh, Navy-Gold, Xanh lá, Dark Premium, Đỏ y tế, Xanh trời-Cam)
- `nameFontFamily` (select): 5 font chữ (Be Vietnam Pro, Montserrat, Roboto, Nunito, Inter)
- `nameFontWeight` (select): 5 mức độ đậm (400–900)
- `nameTextEffect` (select): 6 hiệu ứng (gradient, shadow, border-accent, underline, highlight-bg)
- `sloganFontWeight` (select): 5 mức độ đậm
- `sloganItalic` (checkbox): In nghiêng slogan
- `sloganTextEffect` (select): 5 hiệu ứng (gradient, shadow, decorative-underline, star-wrap)

**Logic resolve trong `SiteHeader.tsx`:**
- Khi `colorScheme ≠ custom`: tự override màu nền, titleColor, subtitleColor, sloganColor theo preset
- Apply `nameFontFamily`, `nameFontWeight` qua CSS variables + inline style
- Apply className `nameEffect-*` và `sloganEffect-*` theo lựa chọn
- Apply `sloganItalic` class và font-style

**CSS effects thêm vào `globals.css`:**
- `.nameEffect-gradient-text`, `.sloganEffect-gradient-text`: Chữ gradient màu
- `.nameEffect-shadow`, `.sloganEffect-shadow`: Đổ bóng nhẹ
- `.nameEffect-border-accent`: Viền nhấn bên trái
- `.nameEffect-underline-accent`: Gạch chân màu accent
- `.nameEffect-highlight-bg`: Nền nổi bật
- `.sloganEffect-decorative-underline`: Gạch chân trang trí gradient
- `.sloganItalic`: In nghiêng

### C. Database Sync:

**Enums mới tạo:**
- `brand_color_scheme`, `brand_name_font`, `brand_name_weight`, `brand_name_effect`, `brand_slogan_weight`, `brand_slogan_effect`

**Columns mới thêm vào `site_settings`:**
- Các cột branding đúng chuẩn Drizzle ORM: `header_brand_appearance_color_scheme`, `header_brand_appearance_name_font_family`, `header_brand_appearance_name_font_weight`, `header_brand_appearance_name_text_effect`, `header_brand_appearance_slogan_font_weight`, `header_brand_appearance_slogan_italic`, `header_brand_appearance_slogan_text_effect`, `header_brand_appearance_slogan_align`
- Các cột trang mới: `patient_portal_page_*`, `lich_truc_page_*`, `science_activity_page_*`, `clinical_protocol_page_*`
- Khắc phục triệt để lỗi console `[HomePage] site-settings error: Failed query: select ...` do lệch tiền tố cột giữa Drizzle ORM và PostgreSQL.

### Files Modified:
- `src/globals/SiteSettings.ts` – thêm fields branding + 4 page groups mới
- `src/components/SiteHeader.tsx` – logic preset + CSS variables + JSX effects
- `src/app/globals.css` – CSS classes hiệu ứng text effects

### Validation:
- `npx tsc --noEmit`: ✅ 0 lỗi

---

## [2026-09-14] - Chuẩn Hóa Cấu Trúc Menu 8 Nhóm Y Tế & Xây Dựng Cổng Một Cửa "Dành Cho Người Bệnh" (/danh-cho-nguoi-benh)

- **Thời gian thực hiện:** 20:34 (Asia/Saigon)
- **Yêu cầu:** Chuẩn hóa toàn bộ cấu trúc thanh điều hướng Header theo mô hình 8 nhóm menu y tế chuẩn quốc gia, tích hợp nhóm "Dành cho người bệnh" làm trung tâm trải nghiệm người dân và xây dựng Cổng một cửa số hóa `/danh-cho-nguoi-benh`.
- **Chi tiết đã hoàn thiện:**
  1. **Quy hoạch 8 Nhóm Menu Header Chuẩn Mực (`SiteHeader.tsx` & `Navigation.ts`):**
     - **1. Trang chủ** (`/`)
     - **2. Giới thiệu** (`/gioi-thieu` ➔ Giới thiệu chung, Lịch sử phát triển, Chất lượng bệnh viện).
     - **3. Tổ chức & Chuyên khoa** (`/so-do-to-chuc` ➔ Sơ đồ tổ chức, Khoa – Phòng, Chuyên khoa, Đội ngũ Bác sĩ).
     - **4. Dành cho người bệnh** (`/danh-cho-nguoi-benh` ➔ Cổng tổng hợp tiện ích, Quy trình khám bệnh, Giờ làm việc & Khám sớm, Khảo sát sự hài lòng, Góp ý – Phản ánh, Tra cứu phản ánh, Hỏi đáp y tế FAQ, Biểu mẫu điện tử).
     - **5. Lịch khám & Trực** (`/lich-kham` ➔ Tất cả lịch khám, Lịch trực cấp cứu 24/24, Lịch khám theo tuần, Lịch khám bác sĩ theo ngày).
     - **6. Dịch vụ & Bảng giá** (`/bang-gia` ➔ Bảng giá viện phí & BHYT, Tiêm chủng vắc xin).
     - **7. Tin tức & Công khai** (`/tin-tuc` ➔ Tin tức & Sự kiện, Thông báo bệnh viện, Đấu thầu – Mua sắm y tế, Văn bản – Tài liệu y tế).
     - **8. Liên hệ** (`/lien-he`).
  2. **Xây dựng Cổng Tổng hợp Tiện ích Người Bệnh (`/danh-cho-nguoi-benh`):**
     - Áp dụng `PageHero` chuẩn y tế `22px 0 20px`, tích hợp `PatientCareSubNav` với tab Cổng tổng hợp.
     - 3 cam kết cốt lõi: *Lấy người bệnh làm trung tâm, Bảo đảm 100% quyền lợi BHYT, Thường trực cấp cứu 24/24*.
     - Phân loại rõ 2 nhóm tiện ích dịch vụ: *Hướng dẫn & Thủ tục thăm khám* và *Tiếp nhận ý kiến, Khảo sát & CSKH*.
     - Banner CTA đường dây nóng gọi điện thoại trực tiếp.
  3. **Cập nhật Preset trong Admin CMS Navigation (`Navigation.ts`):**
     - Bổ sung các preset: `/danh-cho-nguoi-benh`, `/chat-luong-benh-vien`, `/quy-trinh-kham-benh`, `/lich-lam-viec`, `/khao-sat`, `/gop-y`, `/gop-y/tra-cuu`, `/hoi-dap`, `/bieu-mau` để quản trị viên có thể tùy biến dễ dàng trong Admin CMS mà không cần gõ URL thủ công.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - Phản hồi HTTP `/danh-cho-nguoi-benh`: 200 OK.
- **Tệp tin tạo mới & chỉnh sửa:**
  - `src/app/(frontend)/danh-cho-nguoi-benh/page.tsx` (Tạo mới)
  - `src/components/SiteHeader.tsx` (Nâng cấp)
  - `src/components/PatientCareSubNav.tsx` (Nâng cấp)
  - `src/globals/Navigation.ts` (Nâng cấp)
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-14] - Rà Soát, Thiết Kế Lại & Liên Kết Toàn Diện Nhóm Chăm Sóc Người Bệnh & Khảo Sát

- **Thời gian thực hiện:** 20:20 (Asia/Saigon)
- **Yêu cầu:** Trong phần "Chăm sóc người bệnh & Khảo sát" trong Admin CMS, kiểm tra và thiết kế lại các trang chưa có, đồng thời liên kết chặt chẽ các nhóm có liên quan lại với nhau theo chuẩn y tế hiện đại, chuyên nghiệp và đồng bộ 100% Admin CMS.
- **Hiện trạng trước khi thực hiện:**
  - Tuyến đường `/khao-sat` bị lỗi 404 (chỉ có trang con `/khao-sat/[slug]` nhưng giao diện đơn sơ, thẻ form thô).
  - Tuyến đường `/bieu-mau` chưa có trang danh mục trung tâm (chỉ có `/bieu-mau/[slug]`).
  - Tuyến đường `/hoi-dap` (Hỏi đáp y tế / FAQs) chưa có trang hiển thị công khai cho người bệnh tra cứu.
  - Các trang `/gop-y` và `/gop-y/tra-cuu` chưa có thanh điều hướng chuyên mục liên kết chéo.
  - Chưa có cấu hình quản trị tương ứng cho các trang này trong `SiteSettings.ts`.
- **Chi tiết đã hoàn thiện:**
  1. **Tạo Component Thanh Điều Hướng Chuyên Mục (`PatientCareSubNav.tsx`):**
     - Liên kết mạch lạc 7 kênh dịch vụ cốt lõi: *Khảo sát ý kiến (`/khao-sat`), Góp ý – Phản ánh (`/gop-y`), Tra cứu phản ánh (`/gop-y/tra-cuu`), Hỏi đáp y tế FAQ (`/hoi-dap`), Biểu mẫu điện tử (`/bieu-mau`), Chất lượng bệnh viện (`/chat-luong-benh-vien`), Liên hệ & Hotline (`/lien-he`)*.
     - Tích hợp đồng bộ trên tất cả các trang liên quan.
  2. **Bộ Nhận Diện Giao Diện Y Tế Mới (`src/app/styles/patient-care.css`):**
     - Lưới thẻ Card sang trọng, hiệu ứng chuyển động vi mô (`hover elevation`).
     - Giao diện chấm điểm khảo sát 1–5 sao trực quan với biểu tượng cảm xúc và mô tả chi tiết.
     - Accordion câu hỏi thường gặp mượt mà, thanh tìm kiếm từ khóa và bộ lọc danh mục theo chủ đề (BHYT, Giờ khám, Thủ tục, Dịch vụ).
     - Banner CTA đường dây nóng kết nối với Ban Giám đốc và Phòng Quản lý chất lượng.
  3. **Thiết kế Mới & Nâng cấp Các Trang Frontend:**
     - **`/khao-sat` (Trang chủ Khảo sát)**: Danh sách các đợt khảo sát nội trú/ngoại trú, cam kết 100% ẩn danh, giải thích chuẩn 83 Tiêu chí Bộ Y tế.
     - **`/khao-sat/[slug]`**: Nâng cấp `PageHero`, tích hợp `SurveyForm.tsx` phiên bản mới với thang điểm tương tác, khối góp ý mở rộng và Cloudflare Turnstile.
     - **`/bieu-mau` (Trung tâm Biểu mẫu số)**: Danh mục các mẫu đơn hành chính (Đăng ký khám ban đầu, Trích sao bệnh án, Tư vấn dinh dưỡng), cấp mã xác nhận điện tử.
     - **`/bieu-mau/[slug]`**: Nâng cấp với `PageHero`, `PatientCareSubNav` và `DynamicPublicForm`.
     - **`/hoi-dap` (Hỏi đáp Y tế FAQs)**: Giao diện tra cứu câu hỏi thường gặp với bộ lọc theo chủ đề, tìm kiếm tức thì và câu trả lời chi tiết.
     - **`/gop-y` & `/gop-y/tra-cuu`**: Tích hợp `PatientCareSubNav`, hộp lưu ý đường dây nóng 24/7 và mã tra cứu minh bạch.
  4. **Tích hợp Quản trị 100% Admin CMS (`SiteSettings.ts`):**
     - Bổ sung 3 nhóm cấu hình chuyên sâu: `surveyPage`, `faqPage`, `formsPage` với đầy đủ `eyebrow`, `title`, `description`, `showNoticeBanner`, `noticeTitle`, `noticeContent` (Enter xuống dòng tự do) và `noticeAlign`.
     - Tuân thủ nghiêm ngặt **Mandate 14**: Dùng tên enum chuẩn `< 63 ký tự` (`enum_site_settings_survey_page_notice_align`, `enum_site_settings_faq_page_notice_align`, `enum_site_settings_forms_page_notice_align`).
  5. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn (`sync-patient-care-db.js`):**
     - Tạo an toàn 3 kiểu enum mới (`CREATE TYPE ... IF NOT EXISTS`).
     - Thêm 21 cột mới cho bảng `site_settings` và `_site_settings_v`.
     - Duy trì nghiêm ngặt `PAYLOAD_DB_PUSH=false`.
  6. **Cập nhật Menu Điều hướng & Chân trang:**
     - `SiteHeader.tsx`: Bổ sung menu thả xuống *Chăm sóc người bệnh*.
     - `SiteFooter.tsx`: Cập nhật cột *Hỗ trợ & CSKH* với đầy đủ liên kết Khảo sát, Góp ý, Hỏi đáp, Biểu mẫu.
  7. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - Xác nhận HTTP 200 OK trên toàn bộ tuyến đường: `/`, `/khao-sat`, `/bieu-mau`, `/hoi-dap`, `/gop-y`, `/gop-y/tra-cuu`, `/chat-luong-benh-vien`.
- **Tệp tin tạo mới & chỉnh sửa:**
  - `src/components/PatientCareSubNav.tsx` (Tạo mới)
  - `src/app/styles/patient-care.css` (Tạo mới)
  - `src/app/(frontend)/khao-sat/page.tsx` (Tạo mới)
  - `src/app/(frontend)/bieu-mau/page.tsx` (Tạo mới)
  - `src/app/(frontend)/hoi-dap/page.tsx` (Tạo mới)
  - `src/app/(frontend)/khao-sat/[slug]/page.tsx` (Nâng cấp)
  - `src/app/(frontend)/bieu-mau/[slug]/page.tsx` (Nâng cấp)
  - `src/app/(frontend)/gop-y/page.tsx` (Nâng cấp)
  - `src/app/(frontend)/gop-y/tra-cuu/page.tsx` (Nâng cấp)
  - `src/app/(frontend)/chat-luong-benh-vien/page.tsx` (Nâng cấp)
  - `src/app/(frontend)/lien-he/page.tsx` (Nâng cấp)
  - `src/components/SurveyForm.tsx` (Nâng cấp)
  - `src/components/SiteHeader.tsx` (Nâng cấp)
  - `src/components/SiteFooter.tsx` (Nâng cấp)
  - `src/app/(frontend)/layout.tsx` (Nâng cấp)
  - `src/globals/SiteSettings.ts` (Nâng cấp)
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

## [2026-09-14] - Thiết Kế Trang Chất Lượng Bệnh Viện Hiện Đại & Chuyên Nghiệp (/chat-luong-benh-vien)

- **Thời gian thực hiện:** 19:54 (Asia/Saigon)
- **Yêu cầu:** Thiết kế trang Chất lượng bệnh viện (`/chat-luong-benh-vien`) thể hiện sự hiện đại, chuyên nghiệp, công khai bộ tiêu chuẩn chất lượng y tế và tuân thủ nguyên tắc quản trị 100% qua Admin CMS.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Quản trị Admin CMS (`src/globals/SiteSettings.ts`):**
     - Bổ sung nhóm cấu hình **`qualityPage`** tại `/admin/globals/site-settings`:
       - Banner Hero: `eyebrow` (`QUẢN LÝ CHẤT LƯỢNG & AN TOÀN NGƯỜI BỆNH`), `title` (`Chất lượng Bệnh viện`), `description`.
       - Bảng thông báo lưu ý: Checkbox `showNoticeBanner`, `noticeTitle`, `noticeContent` (hỗ trợ Enter xuống dòng tự do `white-space: pre-line`), `noticeAlign` (canh trái/giữa/đều).
       - Granular Toggles: `showQualityCards` (Thẻ chỉ số), `showDimensions` (5 nhóm tiêu chí Bộ Y tế), `showPrograms` (Chương trình cải tiến), `showFeedbackBox` (Hòm thư đóng góp ý kiến).
       - Tối ưu hóa tên enum và `dbName` theo Mandate 14 để chống vượt quá 63 ký tự trong PostgreSQL.
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn:**
     - Tạo kiểu enum `enum_quality_not_align` ('left', 'center', 'justify').
     - Thêm đầy đủ 11 cột cấu hình chất lượng vào bảng `site_settings` và bảng phiên bản `_site_settings_v`, duy trì `PAYLOAD_DB_PUSH=false`.
  3. **Xây dựng Giao diện Frontend (`chat-luong-benh-vien/page.tsx` & `chat-luong.css`):**
     - Áp dụng chuẩn mực `PageHero` gradient 3 lớp nhỏ gọn `22px 0 20px`, breadcrumb `Trang chủ / Chất lượng bệnh viện`.
     - **Lưới 4 Thẻ Chỉ số Chất lượng Cốt lõi**:
       - *Điểm chất lượng bệnh viện*: `4.22 / 5.0` (Đạt mức chất lượng Tốt - Mức 4).
       - *Tỷ lệ hài lòng chung của người bệnh*: `94.8%`.
       - *Bộ tiêu chí áp dụng*: `83 tiêu chí` (Quyết định 6858/QĐ-BYT).
       - *Bảo đảm an toàn người bệnh*: `100%`.
     - **Khối Đo lường 5 Phần Tiêu chuẩn Bộ Y Tế**:
       - Phần A: Hướng đến người bệnh (Điểm: 4.25, thanh tiến trình 85%).
       - Phần B: Phát triển nguồn nhân lực (Điểm: 4.18, thanh tiến trình 83.6%).
       - Phần C: Hoạt động chuyên môn (Điểm: 4.35, thanh tiến trình 87%).
       - Phần D: Cải tiến chất lượng (Điểm: 4.12, thanh tiến trình 82.4%).
       - Phần E: Tiêu chí đặc thù chuyên khoa (Điểm: 4.20, thanh tiến trình 84%).
     - **Khối 3 Chương trình Cải tiến Trọng điểm**:
       - *Chuyển đổi số Y tế*: Bệnh án điện tử EMR, Medpro trực tuyến, thanh toán không tiền mặt.
       - *An toàn người bệnh & Kiểm soát nhiễm khuẩn*: Vòng đeo tay định danh, vệ sinh tay 5 thời điểm, quy trình 3 tra 5 đối.
       - *Nâng cao Văn hóa Giao tiếp & Ứng xử*: Khẩu hiệu "Lương y như từ mẫu", tiếp nhận giải quyết trong 24h.
     - **Khối Kêu gọi Đóng góp Ý kiến & Phản ánh**: Banner gradient y tế kết nối trực tiếp đến trang `/gop-y` và `/lien-he`.
  4. **Cập nhật Chân trang (`SiteFooter.tsx`):**
     - Thêm liên kết trực tiếp đến trang `Chất lượng bệnh viện` trong cột Thông tin bệnh viện.
  5. **Kiểm thử hệ thống:**
     - `npm run typecheck`: Hoàn toàn sạch lỗi (0 lỗi).
     - `npm run validate:public-content`: 21/21 PASS.
     - Kiểm tra HTTP response `/chat-luong-benh-vien` và `/`: Cả hai đều trả về HTTP 200 OK.
- **Tệp tin chỉnh sửa & tạo mới:**
  - `src/globals/SiteSettings.ts`
  - `src/app/(frontend)/chat-luong-benh-vien/page.tsx` (Tạo mới)
  - `src/app/(frontend)/chat-luong-benh-vien/chat-luong.css` (Tạo mới)
  - `src/components/SiteFooter.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`


## [2026-09-14] - Khắc Phục Lỗi Trang Chủ Không Hiển Thị Đủ Các Section

- **Thời gian thực hiện:** 19:42 (Asia/Saigon)
- **Nguyên nhân gốc rễ (Root Cause):**
  - Trong quá trình nâng cấp trang Quy trình khám bệnh (`/quy-trinh-kham-benh`), trường `noticeAlign` trong group `examinationFlowPage` của `SiteSettings.ts` có `dbName: 'flow_not_align'`. Drizzle ORM mong đợi tên cột là `examination_flow_page_notice_align`, trong khi ở database trước đó được lưu với tên `examination_flow_page_flow_not_align`.
  - Lỗi sai lệch tên cột khiến câu truy vấn `getGlobal('site-settings')` bị ném ngoại lệ (`error: column site_settings.examination_flow_page_notice_align does not exist`).
  - Khi `site-settings` bị lỗi bên trong khối `Promise.all` của Trang chủ, khối `catch` bắt lỗi khiến biến `home` (chứa dữ liệu `homepage`) không được nạp đầy đủ 12 sections mà chỉ hiển thị fallback cục bộ (chỉ 2 section fallback).
- **Chi tiết đã thực hiện:**
  1. **Đồng bộ Cơ sở dữ liệu PostgreSQL (`sync-site-settings-db.js`):**
     - Đã thêm cột `examination_flow_page_notice_align` kiểu `enum_site_settings_flow_not_align` với giá trị mặc định `'left'` vào cả bảng `site_settings` và bảng phiên bản `_site_settings_v`.
     - Giữ an toàn tuyệt đối cho hệ cơ sở dữ liệu và duy trì `PAYLOAD_DB_PUSH=false`.
  2. **Kiểm tra và xác nhận hiển thị Trang chủ:**
     - Chạy kiểm tra thực tế: Tất cả **12/12 section** trên trang chủ đã được khôi phục và render đầy đủ 100%:
       1. `homeFeaturedSection` (Tin tức & hoạt động nổi bật)
       2. `homeAdvancedTechniquesSection` (Kỹ thuật chuyên sâu)
       3. `homeOurExpertsSection` (Chuyên gia của chúng tôi - Bác sĩ)
       4. `homePortalNewsSection` (Các chuyên mục tin tức)
       5. `homeSpecialtiesShowcaseSection` (Hệ thống Chuyên khoa)
       6. `homeNoticeSection` (Thông báo mới)
       7. `homeProcurementSection` (Đấu thầu – Mua sắm)
       8. `homeScheduleSection` (Lịch khám bệnh & Lịch trực cấp cứu)
       9. `homeVaccinationSection` (Thông tin tiêm ngừa vắc xin)
       10. `homeScienceSection` (Hoạt động khoa học & Chuyên môn đào tạo)
       11. `homeOverviewSection` (Giới thiệu & Số liệu bệnh viện)
       12. `homeDocumentsSection` (Văn bản mới & Phác đồ điều trị)
  3. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - Xác nhận phản hồi HTTP 200 OK và cấu trúc trang chủ hoàn chỉnh.
- **Tệp tin chỉnh sửa:**
  - Database schema: `site_settings` & `_site_settings_v`
  - `src/app/(frontend)/page.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`


## [2026-09-14] - Thiết Kế Lại Toàn Diện Chân Trang (Site Footer) Hiện Đại & Chuyên Nghiệp

- **Thời gian thực hiện:** 19:30 (Asia/Saigon)
- **Yêu cầu:** Thiết kế lại phần footer cho hiện đại và chuyên nghiệp hơn, chuẩn nhận diện y tế công lập chất lượng cao, giữ trọn vẹn khả năng quản trị động từ Admin CMS (`/admin/globals/footer`).
- **Chi tiết đã thực hiện:**
  1. **Tạo hệ thống giao diện Footer hiện đại (`src/components/SiteFooter.module.css`):**
     - Nền gradient tối y tế chuyên sâu `linear-gradient(180deg, #051c33 0%, #031424 100%)` kết hợp 2 vầng sáng vi mô `radial-gradient` sang trọng.
     - **Thanh tiện ích nhanh đầu Footer (`footerQuickBar`)**:
       - *Thẻ Cấp cứu 24/24 trực tiếp*: Hiệu ứng đèn tín hiệu nhấp nháy (pulsing beacon dot), số điện thoại cấp cứu khổ lớn, link bấm gọi ngay tức thì (`tel:...`).
       - *Cụm nút hành động y tế*: Nút "Đặt khám trực tuyến" (Medpro), Nút xem "Quy trình khám bệnh" và Nút "Góp ý & Liên hệ".
     - **Cột thông tin thương hiệu Bệnh viện (`hospitalBrandCol`)**:
       - Logo sắc nét với khung nền bo góc mềm mại, tên bệnh viện in hoa trang trọng, slogan y tế chuẩn mực "Tận tâm cứu chữa – Vững vàng chuyên môn".
       - Danh sách thông tin liên hệ kèm hệ thống icon trực quan (Trụ sở, Tổng đài tư vấn, Cấp cứu, Hòm thư điện tử, Khung giờ tiếp đón).
       - Khối kênh mạng xã hội chính thức (Facebook, Zalo OA, YouTube, TikTok) dạng nút tròn bo góc với hiệu ứng hover mượt mà.
     - **Các cột liên kết điều hướng thông minh (`navColumn`)**:
       - Tiêu đề cột gạch chân phân đoạn xanh dương công nghệ `linear-gradient(90deg, #0ea5e9, #38bdf8)`.
       - Danh sách liên kết với dấu chấm vi mô (micro bullet) đổi màu và dịch chuyển vi mô (`translateX(4px)`) khi rê chuột.
       - Tự động nhận diện link nội bộ (dùng Next.js `Link` tối ưu nạp trang) và link bên ngoài / liên kết tel, mailto (dùng thẻ `<a>` kèm `openNewTab`).
     - **Thanh bản quyền & Cổng thông tin (`footerBottomBar`)**:
       - Bản quyền tự động cập nhật năm thực tế, nhãn huy hiệu Cổng thông tin điện tử chính thức kèm biểu tượng khiên bảo mật y tế.
  2. **Tối ưu Component `src/components/SiteFooter.tsx`:**
     - Giữ nguyên vẹn 100% dữ liệu động từ CMS: `footer`, `site-settings`, `contact-settings`, `social-settings`, `medpro-settings`.
     - Tương thích hoàn hảo với các tùy chọn bật/tắt trong Admin (`showLogo`, `showHospitalName`, `showAddress`, `showPhone`, `showEmergencyHotline`, `showEmail`, `showWorkingHours`, `showDescription`, `showSocial`, `bottom.showCopyright`, `bottom.showRightText`, `showMobileBar`).
  3. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - HTTP 200 OK trên trang chủ và toàn bộ hệ thống.
- **Tệp tin chỉnh sửa & tạo mới:**
  - `src/components/SiteFooter.module.css` (Tạo mới)
  - `src/components/SiteFooter.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`


## [2026-09-14] - Nâng Cấp Toàn Diện Trang Liên Hệ Hiện Đại & Chuyên Nghiệp (/lien-he)

- **Thời gian thực hiện:** 19:24 (Asia/Saigon)
- **Yêu cầu:** Thiết kế lại toàn diện trang Liên hệ (`/lien-he`) theo phong cách y tế hiện đại, chuyên nghiệp, tích hợp bản đồ Google Maps, thẻ tiếp đón cấp cứu, form gửi ý kiến phản ánh và tuân thủ nguyên tắc quản lý 100% qua Admin CMS.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Quản trị Admin CMS (`src/globals/ContactSettings.ts`):**
     - Đưa toàn bộ cấu hình trang Liên hệ vào `/admin/globals/contact-settings`:
       - Nhóm Hero Banner: `eyebrow`, `title`, `description`.
       - Nhóm Thông báo lưu ý: `enabled`, `title`, `content` (hỗ trợ xuống dòng `white-space: pre-line`), `textAlign`.
       - Nhóm Thông tin cốt lõi: Địa chỉ viện, Hotline tư vấn, Hotline cấp cứu 24/24, Email văn thư, Giờ khám bệnh, Link mở Google Maps, Mã nhúng iframe Maps.
       - Nhóm Công tắc bật/tắt hiển thị (Granular Toggles): `showContactCards`, `showMap`, `showFeedbackForm`, `showSupportHours`, `showSocialLinks`.
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn:**
     - Tạo enum `enum_contact_settings_ct_not_align` và thêm đầy đủ các cột mới vào bảng `contact_settings` và `_contact_settings_v` bằng SQL an toàn (`IF NOT EXISTS`), giữ `PAYLOAD_DB_PUSH=false`.
  3. **Nâng cấp Giao diện Frontend (`src/app/(frontend)/lien-he/page.tsx` & `lien-he.css`):**
     - Áp dụng cấu trúc `PageHero` gradient 3 lớp nhỏ gọn `22px 0 20px`, breadcrumb `Trang chủ / Liên hệ`.
     - **Lưới 4 Thẻ tiếp đón nhanh**:
       - *Thẻ Cấp cứu 24/24*: Viền đỏ y tế nổi bật, số điện thoại khẩn, link bấm gọi ngay tức thì.
       - *Thẻ Tổng đài tư vấn & Đặt lịch*: Hỗ trợ thông tin BHYT, đặt hẹn.
       - *Thẻ Hòm thư điện tử / Văn thư*: Tiếp nhận công văn, hồ sơ điện tử.
       - *Thẻ Khung giờ khám bệnh*: Thông báo bắt đầu khám sớm từ 06:30.
     - **Layout 2 Cột hiện đại**:
       - *Cột bên trái*: Thông tin địa chỉ trụ sở, khung bản đồ Google Maps sắc nét, nút mở chỉ đường trực tiếp ra Google Maps app/web, liên kết mạng xã hội chính thức (Facebook, Zalo OA).
       - *Cột bên phải*: Card form gửi ý kiến phản ánh & góp ý thiết kế cao cấp, nhập họ tên, số điện thoại, tiêu đề, nội dung và tra cứu mã phản hồi.
     - **Khối Khung giờ hỗ trợ chuyên khoa**: Lịch phục vụ cụ thể của Khoa Cấp cứu 24/24, Khoa Khám bệnh ngoại trú, Phòng Xét nghiệm sớm (06:00), Phòng Tiêm chủng vắc xin.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: Hoàn toàn sạch lỗi (0 lỗi).
     - `npm run validate:public-content`: 21/21 PASS.
     - Kiểm tra HTTP response `/lien-he`: Trả về 200 OK, hiển thị đầy đủ giao diện.
- **Tệp tin chỉnh sửa & tạo mới:**
  - `src/globals/ContactSettings.ts`
  - `src/app/(frontend)/lien-he/page.tsx`
  - `src/app/(frontend)/lien-he/lien-he.css` (Tạo mới)
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`
  1. **Cập nhật quy tắc dự án [AGENTS.md](file:///d:/bvdkthoilai-main/AGENTS.md):**
     - Bổ sung **Mục 13. NGUYÊN TẮC BẮT BUỘC: THIẾT KẾ TRANG XONG PHẢI ĐƯA VÀO ADMIN CMS (MANDATORY ADMIN CMS INTEGRATION)**.
     - **13.1. Bắt buộc 100% trang mới phải quản trị được từ Admin CMS**: Tuyệt đối không dừng lại ở việc hardcode giao diện tĩnh. Mọi trang mới phải có trường/nhóm cấu hình tương ứng trong Admin CMS (Global `SiteSettings.ts` hoặc Global chuyên biệt).
     - **13.2. Các mục tối thiểu bắt buộc đưa vào Admin CMS**:
       - Cấu hình Hero Banner: `eyebrow`, `title`, `description`.
       - Bảng thông báo lưu ý: Checkbox bật/tắt, tiêu đề, nội dung xuống dòng tự do (`white-space: pre-line`), tùy chọn canh lề.
       - Công tắc bật/tắt độc lập từng khối (Granular Toggles) cho tất cả các khối nội dung, widget, checklist, banner liên kết.
     - **13.3. Quy trình đồng bộ Database an toàn**: Luôn chạy SQL an toàn (`IF NOT EXISTS`) để cập nhật cột và kiểu enum trong PostgreSQL, giữ `PAYLOAD_DB_PUSH=false`.
  2. **Ghi nhận quyết định kiến trúc lâu dài [DECISIONS.md](file:///d:/bvdkthoilai-main/DECISIONS.md):**
     - Lưu quyết định ngày `2026-09-14` nhằm ngăn chặn các agent hoặc lập trình viên sau này tự ý hardcode giao diện tĩnh.
  3. **Kiểm tra tính toàn vẹn hệ thống:**
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa:**
  - `AGENTS.md`
  - `DECISIONS.md`
  - `CHANGELOG.md`
  1. **Nâng cấp Schema Admin Global (`src/globals/SiteSettings.ts`):**
     - Bổ sung nhóm cấu hình **`examinationFlowPage` (Trang Quy trình khám bệnh)** vào mục Quản trị Website (`/admin/globals/site-settings`):
       - `eyebrow`: Nhãn nhỏ trên banner (mặc định: `HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH`).
       - `title`: Tiêu đề chính của trang (mặc định: `Quy trình Khám chữa bệnh`).
       - `description`: Đoạn mô tả hướng dẫn chi tiết.
       - `showNoticeBanner`: Checkbox bật/tắt banner lưu ý khẩn/thông báo đầu trang.
       - `noticeTitle` & `noticeContent`: Tiêu đề và nội dung bảng lưu ý (hỗ trợ xuống dòng tự do `white-space: pre-line`).
       - `noticeAlign`: Tùy chọn canh lề thông báo (Canh trái / Canh giữa / Canh đều 2 bên).
       - `showChecklist`: Checkbox bật/tắt khối danh mục giấy tờ cần chuẩn bị.
       - `showPriority`: Checkbox bật/tắt khối thứ tự đối tượng ưu tiên tiếp đón.
       - `showSupportBanner`: Checkbox bật/tắt banner liên kết đặt hẹn trực tuyến & hotline cấp cứu 24/24.
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn:**
     - Đã tạo enum `enum_site_settings_flow_not_align` ('left', 'center', 'justify').
     - Thêm đầy đủ 10 cột mới vào bảng `site_settings` mà không ảnh hưởng dữ liệu cũ hay gây xung đột kết nối pool.
  3. **Kết nối Frontend động (`page.tsx` & `ExaminationFlowView.tsx`):**
     - Đọc dữ liệu trực tiếp từ `siteSettings.examinationFlowPage`.
     - Tự động ẩn/hiển thị các khối theo đúng trạng thái bật/tắt của Admin CMS.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - Trang `/quy-trinh-kham-benh` phản hồi 200 OK.
- **Tệp tin chỉnh sửa:**
  - `src/globals/SiteSettings.ts`
  - `src/app/(frontend)/quy-trinh-kham-benh/page.tsx`
  - `src/app/(frontend)/quy-trinh-kham-benh/ExaminationFlowView.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

- **Thời gian thực hiện:** 17:30 (Asia/Saigon)
- **Yêu cầu:** Thiết kế trang thông tin tiêm ngừa (`/tiem-chung`) và trang về các loại vắc xin với đầy đủ giá tiền, đối tượng tiêm, tình trạng thuốc, phác đồ phòng bệnh, quy trình tiêm chủng an toàn và các nội dung y tế thiết yếu.
- **Chi tiết đã thực hiện:**
  1. **Đồng bộ Dữ liệu Danh mục Vắc xin & Lịch tiêm thực tế vào PostgreSQL:**
     - Khởi tạo 8 loại vắc xin phổ biến tại cơ sở y tế:
       - Vắc xin 6 trong 1 Hexaxim / Infanrix Hexa (Pháp/Bỉ): 1.050.000đ (Trẻ 2 - 24 tháng).
       - Vắc xin Phế cầu khuẩn Prevenar 13 (Bỉ/Mỹ): 1.290.000đ (Trẻ từ 6 tuần tuổi & người lớn).
       - Vắc xin Rotavirus Rotarix / Rotateq (Bỉ/Mỹ): 820.000đ (Trẻ 6 - 32 tuần tuổi).
       - Vắc xin Cúm mùa Tứ giá Vaxigrip Tetra (Pháp): 360.000đ (Trẻ từ 6 tháng & người lớn).
       - Vắc xin HPV Ung thư cổ tử cung Gardasil 9 (Mỹ): 2.950.000đ (Nam/Nữ 9 - 45 tuổi).
       - Vắc xin Viêm gan B Engerix B (Bỉ): 210.000đ (Sơ sinh, trẻ em, người lớn).
       - Vắc xin Sởi - Quai bị - Rubella MMR II (Mỹ): 430.000đ (Trẻ từ 9 tháng & phụ nữ trước mang thai).
       - Vắc xin phòng Dại tế bào Vero Verorab (Pháp): 480.000đ (Mọi lứa tuổi sau phơi nhiễm).
     - Tạo giá vắc xin niêm yết trong bảng `vaccine_prices` kèm số quyết định (`QD-88/BV-TL`).
     - Tạo lịch tiêm chủng thường quy và thông báo chiến dịch tiêm chủng hô hấp trong bảng `vaccination_schedules`.
  2. **Nâng cấp Giao diện Trang `/tiem-chung` (`page.tsx`, `VaccinationView.tsx`, `tiem-chung.css`):**
     - Áp dụng chuẩn mực `PageHero` gradient y tế nhỏ gọn `22px 0 20px`, Breadcrumb `Trang chủ / Tiêm chủng & Vắc xin`.
     - Điều hướng 2 Tab tiện dụng:
       - **Tab Danh mục & Bảng giá Vắc xin**: Card vắc xin hiện đại có huy hiệu tình trạng (Đang có / Sắp có / Tạm hết), Huy hiệu xuất xứ, Tên vắc xin, tóm tắt, bảng đặc tả (Bệnh phòng ngừa, Đối tượng, Hãng sản xuất), Giá tiêm niêm yết in đỏ đậm rõ ràng, nút "Chi tiết" và nút "Đăng ký tiêm".
       - **Tab Lịch tiêm & Đợt tiêm chủng**: Hiển thị thẻ lịch tiêm rõ ràng với khung giờ, ngày áp dụng, đối tượng và địa điểm tiếp nhận.
     - Bộ lọc đối tượng tiêm nhanh (Trẻ sơ sinh, Trẻ em, Phụ nữ mang thai, Người lớn & Cao tuổi) và ô tìm kiếm tức thì.
     - Khối **Quy trình 4 bước Tiêm chủng An toàn tại Bệnh viện Đa khoa Khu vực Thới Lai** (Tiếp đón → Khám sàng lọc → Thực hiện tiêm → Theo dõi 30 phút).
     - Banner liên kết Đặt hẹn tiêm chủng trực tuyến & Hotline tư vấn miễn phí.
  3. **Nâng cấp Trang Chi tiết Vắc xin & Lịch tiêm `/tiem-chung/[id]` (`page.tsx`):**
     - Đồng bộ Hero banner và đường dẫn breadcrumb.
     - Bảng Fact box nổi bật 4 ô: Giá tiêm niêm yết & Số quyết định, Đối tượng chỉ định, Bệnh phòng ngừa, Hãng sản xuất / Xuất xứ.
     - Khu vực hiển thị ảnh đại diện vắc xin, nội dung phác đồ chi tiết, hộp ghi chú khuyến nghị tiêm, nút Đăng ký tiêm chủng và nút quay lại danh mục.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: Hoàn toàn sạch lỗi (0 lỗi).
     - `npm run validate:public-content`: Đạt 21/21 tiêu chí PASS.
     - Trang `/tiem-chung` và `/tiem-chung/[id]` trả về HTTP 200 OK, hiển thị đầy đủ nội dung.
- **Tệp tin chỉnh sửa:**
  - `src/app/(frontend)/tiem-chung/page.tsx`
  - `src/app/(frontend)/tiem-chung/VaccinationView.tsx` (Tạo mới)
  - `src/app/(frontend)/tiem-chung/tiem-chung.css` (Tạo mới)
  - `src/app/(frontend)/tiem-chung/[id]/page.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

## [2026-09-14] - Xây Dựng Mẫu Cấu Hình Chuẩn Cho Toàn Bộ Các Section Nội Dung (Sections Global Settings)

- **Thời gian thực hiện:** 17:01 (Asia/Saigon)
- **Yêu cầu:** Xây dựng mẫu cấu hình dùng chung trong Admin CMS cho toàn bộ các Section (Khối nội dung) trên website, cho phép người quản trị thay đổi màu chữ, kích thước chữ, khoảng đệm, bo góc và màu nền cùng lúc để đồng bộ 100% tất cả các khối.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Schema Quản trị tập trung (`src/globals/ThemeSettings.ts`):**
     - Bổ sung nhóm cấu hình **`sectionGlobal` (Mẫu Khối nội dung dùng chung)** vào Global `Màu sắc & Giao diện` (`/admin/globals/theme-settings`):
       - `bgColor`: Màu nền toàn khối (mặc định `#ffffff`).
       - `borderRadius`: Bo góc khối thẻ Section (mặc định `18px`).
       - `paddingTop` & `paddingBottom`: Khoảng đệm trên/dưới của khối (mặc định `28px`).
       - `contentWidth`: Chiều rộng khung tối đa (mặc định `1180px`).
       - `eyebrowColor` & `eyebrowSize`: Màu sắc & kích thước nhãn Eyebrow (`#0878d1`, `11px`).
       - `titleColor` & `titleSize`: Màu chữ tiêu đề & kích thước chữ tiêu đề Section (`#124064`, `26px`).
       - `descColor` & `descSize`: Màu chữ mô tả & kích thước chữ mô tả (`#657f92`, `13px`).
       - `headingGap`: Khoảng cách giữa tiêu đề và nội dung thẻ (`18px`).
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn:**
     - Đã thêm đầy đủ 12 cột mới vào bảng `theme_settings` và `_theme_settings_v` bằng câu lệnh SQL an toàn (`IF NOT EXISTS`), giữ `PAYLOAD_DB_PUSH=false` chạy mượt mà, không gián đoạn pool kết nối.
  3. **Kết nối CSS Tokens toàn cục (`src/app/(frontend)/layout.tsx` & `src/app/globals.css`):**
     - Tự động truyền các biến CSS toàn cục: `--section-global-background`, `--section-global-border-radius`, `--section-global-padding-top`, `--section-global-padding-bottom`, `--section-global-content-width`, `--section-global-eyebrow-color`, `--section-global-eyebrow-size`, `--section-global-title-color`, `--section-global-title-size`, `--section-global-desc-color`, `--section-global-desc-size`, `--section-global-heading-gap`.
     - Áp dụng làm chuẩn mực tự động (fallback thông minh) cho toàn bộ các Section: Kỹ thuật chuyên sâu, Đội ngũ chuyên gia, Chuyên khoa, Tin tức nổi bật, Thông báo, Đấu thầu, Lịch khám, v.v.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: Đạt chuẩn 100% (0 lỗi).
     - `npm run validate:public-content`: 21/21 PASS.
     - Kiểm tra trang chủ `http://localhost:3000/` và các trang liên quan hoạt động trơn tru (200 OK).
- **Tệp tin chỉnh sửa:**
  - `src/globals/ThemeSettings.ts`
  - `src/app/(frontend)/layout.tsx`
  - `src/app/globals.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Xây Dựng Mẫu Chuẩn Quản Lý Đồng Bộ Màu Sắc, Cỡ Chữ, Màu Chữ & Nền Hero Banner Từ Admin CMS

- **Thời gian thực hiện:** 16:53 (Asia/Saigon)
- **Yêu cầu:** Thiết kế thành mẫu cấu hình tập trung trong Admin CMS để người quản trị có thể thay đổi màu chữ, kích thước chữ, nội dung và màu nền (hoặc dải màu gradient) cùng một lúc, tự động áp dụng đồng bộ cho tất cả các trang trên toàn website.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Schema Quản trị tập trung (`src/globals/ThemeSettings.ts`):**
     - Bổ sung nhóm cấu hình **`pageHero` (Mẫu Banner đầu trang dùng chung)** vào Global `Màu sắc & Giao diện` (`/admin/globals/theme-settings`):
       - `bgType`: Lựa chọn nền dải màu Gradient y tế (`gradient`) hoặc một màu trơn (`solid`).
       - `paddingVertical`: Tùy chỉnh khoảng đệm trên/dưới của banner (mặc định chuẩn 22px).
       - `bgGradientStart`, `bgGradientMiddle`, `bgGradientEnd`: Bộ 3 màu Gradient cao cấp với Color Picker trực quan.
       - `bgSolidColor`: Mã màu trơn khi chọn chế độ Solid.
       - `titleColor` & `titleFontSize`: Màu chữ tiêu đề và cỡ chữ tiêu đề (px).
       - `descColor` & `descFontSize`: Màu chữ mô tả và cỡ chữ mô tả (px).
       - `breadcrumbColor` & `breadcrumbLinkColor`: Màu chữ thanh dẫn đường và màu link Trang chủ.
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn:**
     - Đã thêm đầy đủ 12 cột mới vào bảng `theme_settings` và `_theme_settings_v` bằng câu lệnh SQL an toàn (`IF NOT EXISTS`), giữ `PAYLOAD_DB_PUSH=false` chạy mượt mà, không gián đoạn pool kết nối.
  3. **Kết nối CSS Tokens toàn cục (`src/app/(frontend)/layout.tsx` & `src/app/globals.css`):**
     - Đọc cấu hình từ CMS và tự động truyền qua các CSS Variables: `--page-hero-bg`, `--page-hero-padding`, `--page-hero-title-color`, `--page-hero-title-size`, `--page-hero-desc-color`, `--page-hero-desc-size`, `--page-hero-breadcrumb-color`, `--page-hero-breadcrumb-link`.
     - Áp dụng đồng loạt cho `.page-hero`, `.doctorsHero` (`/bac-si`), `.techniquesHero` (`/ky-thuat-chuyen-sau`), `/lich-kham`, `/tin-tuc`, `/thong-bao`, `/dau-thau-mua-sam`, `/bang-gia`, `/van-ban`, `/chuyen-khoa`.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - Kiểm tra trực tiếp các trang đều hoạt động trơn tru (Status 200 OK).
- **Tệp tin chỉnh sửa:**
  - `src/globals/ThemeSettings.ts`
  - `src/app/(frontend)/layout.tsx`
  - `src/app/globals.css`
  - `src/app/(frontend)/bac-si/bac-si.css`
  - `src/app/(frontend)/ky-thuat-chuyen-sau/ky-thuat-chuyen-sau.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Đồng Bộ Thiết Kế Chuẩn Cho Trang Lịch Khám (/lich-kham) & Ban Hành Nguyên Tắc Chuẩn Mực Thiết Kế Hero Banner Cho Toàn Dự Án

- **Thời gian thực hiện:** 16:44 (Asia/Saigon)
- **Yêu cầu:** 
  1. Áp dụng chuẩn thiết kế Hero Banner (tương tự như trang Bác sĩ) cho trang `http://localhost:3000/lich-kham`.
  2. Lấy mẫu thiết kế này làm chuẩn thống nhất để áp dụng vào tất cả những thiết kế tiếp theo, đồng thời ghi thành nguyên tắc bắt buộc khi thiết kế.
- **Chi tiết đã thực hiện:**
  1. **Đồng bộ trang Lịch khám (`src/app/(frontend)/lich-kham/page.tsx`):**
     - Chuyển đổi phần Hero Banner tùy biến riêng sang component dùng chung `<PageHero />` với đầy đủ:
       - Thanh Breadcrumb: `Trang chủ / Lịch khám bệnh` kết nối mượt mà về trang chủ.
       - Nền Gradient y tế 3 lớp `#072b4c` -> `#0754a8` -> `#0878d1` kết hợp hiệu ứng vi mô `radial-gradient`.
       - Padding nhỏ gọn cân đối `22px 0 20px`, tiêu đề sắc nét `26px` (mobile `24px`), font-weight `800`.
       - Câu chữ mô tả mở rộng `max-width: 1000px`, không rớt từ mồ côi.
       - **Bảo toàn 100% dữ liệu:** Giữ nguyên vẹn toàn bộ dữ liệu lịch trực, bộ lọc theo chế độ (emergency, weekly, daily, attachment), banner thông báo khẩn và khối lưu ý người bệnh.
  2. **Ban hành Nguyên tắc Thiết kế Cốt lõi (Project Core Mandate):**
     - Đã ghi nhận vào **Mục 12 của `AGENTS.md`**: Quy định bắt buộc mọi trang nội dung, danh mục, tra cứu hiện tại và các trang phát triển mới sau này đều phải áp dụng thống nhất chuẩn thiết kế Hero Banner qua component `@/components/PageHero`.
     - Đã ghi nhận vào **`DECISIONS.md`**: Quyết định kiến trúc chuẩn hóa giao diện Hero Banner lâu dài cho toàn bộ website Bệnh viện Đa khoa Khu vực Thới Lai.
  3. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - HTTP Test: `http://localhost:3000/lich-kham` phản hồi mã 200 OK.
- **Tệp tin chỉnh sửa:**
  - `src/app/(frontend)/lich-kham/page.tsx`
  - `AGENTS.md`
  - `DECISIONS.md`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Đồng Bộ Hoàn Hảo Thiết Kế Từ Trang Bác Sĩ Sang Các Trang: Tin Tức, Thông Báo, Đấu Thầu, Bảng Giá, Văn Bản & Chuyên Khoa (Không Thay Đổi Dữ Liệu)

- **Thời gian thực hiện:** 16:38 (Asia/Saigon)
- **Yêu cầu:** Lấy thiết kế từ trang `http://localhost:3000/bac-si` áp dụng qua các trang:
  1. `http://localhost:3000/tin-tuc` (Tin tức & hoạt động)
  2. `http://localhost:3000/thong-bao` (Thông báo từ bệnh viện)
  3. `http://localhost:3000/dau-thau-mua-sam` (Thông tin đấu thầu & mua sắm)
  4. `http://localhost:3000/bang-gia` (Bảng giá dịch vụ)
  5. `http://localhost:3000/van-ban` (Kho văn bản & biểu mẫu)
  6. `http://localhost:3000/chuyen-khoa` (Danh mục Chuyên khoa)
  - **Cam kết:** Giữ nguyên 100% dữ liệu gốc, không can thiệp logic lọc hay nội dung cơ sở dữ liệu.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp component `PageHero` (`src/components/PageHero.tsx`):**
     - Bổ sung thanh điều hướng Breadcrumb chuẩn y tế: `<nav className="page-hero-breadcrumb"> <Link href="/">Trang chủ</Link> / <span>{title}</span> </nav>` giống hệt như trang `/bac-si`.
     - Tự động lấy tiêu đề trang hoặc nhãn breadcrumb làm mốc điều hướng tinh tế.
  2. **Đồng bộ styling chuẩn nhận diện từ trang Bác sĩ (`src/app/globals.css`):**
     - Thêm styling `.page-hero-breadcrumb` với màu chữ `#bae6fd`, link màu `#e0f2fe`, hiệu ứng hover sáng trắng `#ffffff` và gạch chân nhẹ.
     - Giữ nguyên cấu trúc Hero nhỏ gọn cân đối (`padding: 22px 0 20px`), dải màu gradient y tế cao cấp 3 lớp (`#072b4c 0%, #0754a8 55%, #0878d1 100%`) cùng hiệu ứng tỏa sáng vi mô `radial-gradient`.
     - Chỉnh sửa font-size tiêu đề `h1` trên responsive màn hình nhỏ (tối đa `24px`) nhằm đảm bảo giao diện luôn tinh tế, không bao giờ bị tràn hay quá khổ.
  3. **Bảo toàn dữ liệu 100%:**
     - Toàn bộ query CMS, bộ lọc danh mục, phân trang và trạng thái URL của cả 6 trang đều được giữ nguyên vẹn.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: Đạt chuẩn 100% (0 lỗi TypeScript).
     - `npm run validate:public-content`: 21/21 PASS.
     - HTTP Response kiểm tra thực tế: Cả 6 trang (`/tin-tuc`, `/thong-bao`, `/dau-thau-mua-sam`, `/bang-gia`, `/van-ban`, `/chuyen-khoa`) đều phản hồi mã `200 OK`.
- **Tệp tin chỉnh sửa:**
  - `src/components/PageHero.tsx`
  - `src/app/globals.css`
  - `CHANGELOG.md`

---

## [2026-09-14] - Đồng Bộ Chuẩn Thiết Kế Hero Banner & Giao Diện Trang Kỹ Thuật Chuyên Sâu (/ky-thuat-chuyen-sau)

- **Thời gian thực hiện:** 16:13 (Asia/Saigon)
- **Yêu cầu:** Áp dụng chuẩn thiết kế Hero Banner gọn gàng, thanh lịch và cân đối (tương tự như trang Bác sĩ) cho trang Kỹ thuật chuyên sâu (`/ky-thuat-chuyen-sau`).
- **Chi tiết đã thực hiện:**
  1. **Tái thiết kế Hero Banner (`src/app/(frontend)/ky-thuat-chuyen-sau/page.tsx` & `ky-thuat-chuyen-sau.css`):**
     - Thay thế component `PageHero` cũ có padding cao thô và màu nền nhạt bằng Hero Banner y tế sang trọng chuẩn thương hiệu.
     - Chiều cao & padding tối ưu gọn gàng (`22px 0 20px`), phối hợp gradient y tế đa tầng (`#072b4c` -> `#0754a8` -> `#0878d1`) cùng vầng sáng vi mô `radial-gradient`.
     - Đường dẫn Breadcrumb thanh lịch `Trang chủ / Kỹ thuật chuyên sâu`, tiêu đề sắc nét (`26px`, font-weight `800`) và dòng giới thiệu trải rộng tự nhiên (`max-width: 1000px`), không rớt từ mồ côi.
  2. **Tích hợp Thanh tìm kiếm & Thống kê kỹ thuật (`techniquesFilterSection`):**
     - Hỗ trợ tìm kiếm theo từ khóa thông qua query parameter `q` (tìm theo tên kỹ thuật, tóm tắt, chuyên khoa, badge).
     - Thống kê tự động số lượng kỹ thuật hiện có / sau khi lọc (`techniquesCountBadge`).
  3. **Nâng cấp thẻ Kỹ thuật chuyên sâu (`techniqueCard`):**
     - Đổ bóng nhẹ tinh tế, viền bo tròn mềm mại `16px`, hiệu ứng hover nâng thẻ `translateY(-4px)` cùng chuyển động zoom nhẹ hình ảnh mượt mà.
     - Bảo toàn các tùy chọn hiển thị ảnh linh hoạt (`imageFit`: contain, cover-top, cover-center, fill) không làm méo hình.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa / bổ sung:**
  - `src/app/(frontend)/ky-thuat-chuyen-sau/page.tsx`
  - `src/app/(frontend)/ky-thuat-chuyen-sau/ky-thuat-chuyen-sau.css` (Tạo mới)
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Tái Thiết Kế Hero Banner & Tinh Chỉnh Khoảng Cách Cân Đối Cho Trang Đội Ngũ Bác Sĩ (/bac-si)

- **Thời gian thực hiện:** 15:58 (Asia/Saigon)
- **Yêu cầu:** 
  1. Khung Hero đầu trang danh sách Bác sĩ (`/bac-si`) trước đó quá rộng, khoảng cách trên dưới quá nhiều gây trống trải.
  2. Màu nền xanh đậm đơn điệu, cần điều chỉnh lại cho cân đối, hài hòa chuẩn y tế và đồng bộ với ngôn ngữ thiết kế của các trang khác trong hệ thống.
- **Chi tiết đã thực hiện:**
  1. **Tái thiết kế Hero Banner (`src/app/(frontend)/bac-si/page.tsx` & `bac-si.css`):**
     - Rút gọn tối đa khoảng đệm padding từ `50px 0` xuống còn **`22px 0 20px`** siêu gọn gàng, loại bỏ hoàn toàn cảm giác cao thô hoặc khoảng trống thừa.
     - Lược bỏ hoàn toàn badge thừa `+ Y Đức & Chuyên Môn - BVĐK Khu vực Thới Lai` theo yêu cầu, giữ phần đầu trang tối giản, thanh lịch, tập trung vào đường dẫn Breadcrumb `Trang chủ / Đội ngũ bác sĩ`.
     - **Chống rớt từ / Chống xuống dòng cưỡng ép:** Nâng giới hạn chiều rộng nội dung từ `720px` lên `1000px - 1180px`, cho phép câu giới thiệu trải dài tự nhiên trên màn hình lớn mà không bị bẻ xuống nhiều dòng thừa thãi.
     - **Gradient y tế đa chiều cao cấp:** Sử dụng gradient chuẩn thương hiệu bệnh viện (`#072b4c` -> `#0754a8` -> `#0878d1`) kết hợp lớp phủ ánh sáng tỏa tròn vi mô (`radial-gradient`), tạo chiều sâu thị giác sang trọng thay vì mảng xanh phẳng đơn điệu.
  2. **Tinh chỉnh Thanh công cụ Lọc & Tìm kiếm (`doctorsFilterSection`):**
     - Chuyển nền thanh công cụ sang màu trắng cao cấp có đổ bóng nhẹ tách biệt (`box-shadow: 0 4px 16px rgba(15, 63, 99, 0.04)`).
     - Thu gọn chiều cao ô tìm kiếm & dropdown từ `44px` xuống `40px` thanh thoát, hiện đại.
     - Giảm khoảng cách giữa thanh lọc và lưới bác sĩ từ `45px` xuống `32px` giúp bố cục gắn kết, liền mạch.
  3. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa:**
  - `src/app/(frontend)/bac-si/page.tsx`
  - `src/app/(frontend)/bac-si/bac-si.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Khắc Phục Lỗi Validation Khi Cập Nhật Banner Trang Chủ (Global Homepage)

- **Thời gian thực hiện:** 13:33 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi thông báo màu đỏ chặn lưu/xuất bản khi cập nhật banner chính của website: *"Lỗi - Field sau không hợp lệ: Bố cục & giao diện các mục trang chủ 1 → Cấu hình các chuyên mục & số lượng bài đưa lên Điểm tin 4 → Số lượng bài lấy từ nguồn này"*.
- **Nguyên nhân:** Tại mục cấu hình nguồn nội dung Điểm tin (mục thứ 4: Lịch khám & Lịch trực), trường `limit` trước đây đặt ràng buộc `min: 1` và `required: true`, trong khi nguồn này được tắt mặc định với số lượng là `0` (`limit: 0`, `enabled: false`), dẫn đến vi phạm validation của form Payload CMS khi lưu Global `homepage`.
- **Chi tiết đã thực hiện:**
  1. Cập nhật `src/globals/Homepage.ts`:
     - Chỉnh sửa trường `limit` của mảng `newsSources`: cho phép `min: 0`, tối đa `50`, loại bỏ thuộc tính `required: true` cưỡng ép.
     - Cho phép quản trị viên đặt số lượng `0` đối với các nguồn tạm thời tắt hiển thị mà không bị báo lỗi.
  2. Kiểm thử: `npm run typecheck` đạt 0 lỗi.
- **Tệp tin chỉnh sửa:**
  - `src/globals/Homepage.ts`
  - `CHANGELOG.md`

---

## [2026-09-14] - Tách Biệt 2 Lựa Chọn Hiển Thị Ảnh (Trang Chủ vs Trang Chi Tiết) & Nâng Cấp Thêm Banner Bằng Cách Chọn Ảnh Trực Quan (Không Dùng JSON)

- **Thời gian thực hiện:** 13:03 (Asia/Saigon)
- **Yêu cầu:** 
  1. Cho phép 2 lựa chọn riêng biệt: Một kiểu hiển thị ảnh ở ngoài trang chủ (`coverFitHome`) và một kiểu hiển thị ảnh trong trang chi tiết (`coverFitDetail`).
  2. Phần banner sidebar: Nâng cấp giao diện trực quan cho phép chọn/tải ảnh trực tiếp từ thư viện Media và điền thông tin, thay vì bắt buộc phải nhập mã JSON phức tạp.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Collection Chuyên khoa (`src/collections/Specialties.ts`):**
     - Tách trường hiển thị ảnh thành 2 ô lựa chọn độc lập:
       * `coverFitHome`: "🖼️ Cách hiển thị ảnh ở NGOÀI TRANG CHỦ" (Mặc định: *Lấp đầy khung - Canh đỉnh đầu / mặt bác sĩ*).
       * `coverFitDetail`: "🖼️ Cách hiển thị ảnh TRONG TRANG CHI TIẾT" (Mặc định: *Vừa vặn khung, trọn vẹn 100% không bị cắt - contain*).
     - Thay thế cách nhập JSON bằng Array field trực quan:
       * `sidebarBanners`: "🖼️ Danh sách Banner Quảng cáo / Tiện ích (Chọn ảnh & Thêm trực quan)".
       * Cho phép người dùng bấm "Thêm Banner" -> Chọn ảnh từ thư viện Media (hoặc upload ảnh mới) -> Điền tiêu đề, mô tả ngắn, nhãn nút bấm, link liên kết và tùy chọn mở tab mới một cách trực quan, dễ dùng 100%.
       * Giữ lại ô `sidebarBannersJson` làm tùy chọn bổ sung nâng cao (không bắt buộc).
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn theo Mandate Mục 6 (AGENTS.md):**
     - Tạo kiểu enum: `enum_specialties_cover_fit_home`, `enum_specialties_cover_fit_detail`, `enum__specialties_v_version_cover_fit_home`, `enum__specialties_v_version_cover_fit_detail`.
     - Thêm các cột an toàn vào PostgreSQL: `cover_fit_home`, `cover_fit_detail` cho cả 2 bảng `specialties` và `_specialties_v`.
     - Tạo bảng quan hệ array cho upload ảnh media banner: `specialties_sidebar_banners` và `_specialties_v_version_sidebar_banners` với đầy đủ các cột (`image_id`, `title`, `desc`, `btn_text`, `link`, `open_new_tab`), thiết lập sequence tự tăng cho `id` bảng version để đảm bảo lưu bản nháp/xuất bản tài liệu hoạt động mượt mà 100%.
     - Duy trì `PAYLOAD_DB_PUSH=false`.
  3. **Cập nhật giao diện Frontend:**
     - `src/components/SpecialtiesCarousel.tsx` & `src/app/(frontend)/page.tsx`: Tiêu thụ chính xác `coverFitHome` cho thẻ ngoài trang chủ.
     - `src/app/(frontend)/chuyen-khoa/[slug]/page.tsx`: Tiêu thụ chính xác `detailCoverFit` cho khung ảnh bìa lớn; đồng thời đọc trực tiếp ảnh media upload từ `sidebarBanners` để hiển thị banner quảng cáo sidebar mượt mà.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/Specialties.ts`
  - `src/components/SpecialtiesCarousel.tsx`
  - `src/app/(frontend)/page.tsx`
  - `src/app/(frontend)/chuyen-khoa/[slug]/page.tsx`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Quản Trị Hóa 100% Trang Chi Tiết Chuyên Khoa Vào Admin CMS (Bật/Tắt Từng Khối & Chèn Banner Quảng Cáo Tùy Ý Ở Sidebar)

- **Thời gian thực hiện:** 12:55 (Asia/Saigon)
- **Yêu cầu:** Đưa trang chi tiết chuyên khoa vào Admin CMS để chỉnh sửa thêm tùy ý, có nút bật/tắt các khối không cần thiết (cả ở sidebar và nội dung chính), cho phép chèn thêm banner quảng cáo/tiện ích tùy ý ở Sidebar bên trái.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Collection Chuyên khoa (`src/collections/Specialties.ts`):**
     - Bổ sung nhóm cấu hình chuyên sâu: `⚙️ Cấu hình Trang Chi Tiết & Bật/Tắt các khối (Sidebar, Bác sĩ, Phác đồ, Banner)`.
     - **Bật/Tắt các khối Sidebar bên trái (Granular switches):**
       * `showDepartmentCard`: Bật/tắt khối Đơn vị phụ trách (Khoa/Phòng, Trưởng khoa, Vị trí, Số điện thoại).
       * `showBookingCard`: Bật/tắt khối Đăng ký khám bệnh & Tổng đài Hotline.
       * `showNoticeBox`: Bật/tắt hộp thông tin Tiếp nhận khám BHYT & Trực cấp cứu 24/7.
     - **Tùy chỉnh thông tin Đặt khám & Hotline:**
       * `customBookingTitle`: Tiêu đề khối đặt khám (mặc định: "Đăng ký khám bệnh").
       * `customBookingDesc`: Mô tả hướng dẫn đặt khám.
       * `customBookingButtonLabel`: Nhãn nút đặt khám (mặc định: "Đặt khám chuyên khoa").
       * `customBookingButtonUrl`: Đường dẫn đặt khám riêng biệt cho từng chuyên khoa.
       * `customHotline`: Số hotline riêng biệt.
       * `customNoticeText`: Nội dung ghi chú BHYT / Giờ trực (hỗ trợ xuống dòng tự do).
     - **Chèn thêm Banner Quảng cáo / Tiện ích tùy ý ở Sidebar bên trái (`sidebarBannersJson`):**
       * Cho phép người quản trị nhập danh sách banner định dạng JSON với các thông số: Tiêu đề (`title`), Mô tả (`desc`), Tên nút (`btnText`), Đường dẫn (`link`), Ảnh banner (`imageUrl`), Mở tab mới (`openNewTab`).
     - **Bật/Tắt các khối Nội dung bên phải:**
       * `showCoverImage`: Bật/tắt ảnh bìa chuyên khoa (chuẩn 16:9).
       * `showSummaryLead`: Bật/tắt đoạn tóm tắt mở đầu.
       * `showContentSection`: Bật/tắt khối Giới thiệu chuyên môn.
       * `showServicesSection`: Bật/tắt khối Dịch vụ & Kỹ thuật mũi nhọn.
       * `showDoctorsSection`: Bật/tắt khối Đội ngũ Bác sĩ chuyên khoa.
       * `showProtocolsSection`: Bật/tắt khối Phác đồ điều trị liên quan.
       * `showRelatedSection`: Bật/tắt khối Các chuyên khoa liên quan cùng đơn vị.
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn theo Mandate Mục 6 (AGENTS.md):**
     - Thêm đầy đủ các cột mới (`show_department_card`, `show_booking_card`, `show_notice_box`, `custom_booking_title`, `custom_booking_desc`, `custom_booking_button_label`, `custom_booking_button_url`, `custom_hotline`, `custom_notice_text`, `show_cover_image`, `show_summary_lead`, `show_content_section`, `show_services_section`, `show_doctors_section`, `show_protocols_section`, `show_related_section`, `sidebar_banners_json`) vào cả bảng `specialties` và bảng lưu phiên bản `_specialties_v`.
     - Giữ an toàn cấu trúc cơ sở dữ liệu và duy trì `PAYLOAD_DB_PUSH=false`.
  3. **Cập nhật giao diện Frontend (`src/app/(frontend)/chuyen-khoa/[slug]/page.tsx` & `specialty-detail.css`):**
     - Tiếp nhận toàn bộ các công tắc bật/tắt từ Admin CMS (mặc định luôn hiển thị đầy đủ, khi tắt trong admin khối sẽ ẩn hoàn toàn mà không để lại khoảng trống thừa).
     - Hỗ trợ render danh sách banner quảng cáo tùy ý với giao diện chuẩn mực y tế, bo góc mềm mại, hover đổ bóng 3D, hỗ trợ ảnh banner và nút bấm tiện ích.
  4. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/Specialties.ts`
  - `src/app/(frontend)/chuyen-khoa/[slug]/page.tsx`
  - `src/app/(frontend)/chuyen-khoa/[slug]/specialty-detail.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Nâng Cấp Tùy Chọn Hiển Thị Ảnh Đại Diện Chuẩn Mực Cho Chuyên Khoa (Cả Trang Chủ & Trang Chi Tiết)

- **Thời gian thực hiện:** 12:48 (Asia/Saigon)
- **Yêu cầu:** Khắc phục tình trạng ảnh đại diện chuyên khoa bị cắt mất đầu/mặt trên thẻ trang chủ và cả trong trang chi tiết chuyên khoa (`/chuyen-khoa/[slug]`). Đưa toàn bộ cấu hình hiển thị ảnh vào Admin CMS để người quản trị tùy chỉnh 100%.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Collection Chuyên khoa (`src/collections/Specialties.ts`):**
     - Bổ sung trường `coverFit` áp dụng cho cả Trang chủ & Trang chi tiết với đầy đủ 6 tùy chọn:
       * `contain` (Vừa vặn khung, trọn vẹn không bị cắt - nền sáng gradient chuyên nghiệp).
       * `cover-top` (Lấp đầy khung - Canh đỉnh đầu / phần trên - Lấy rõ mặt bác sĩ, không bị cắt ngang trán).
       * `cover-center` (Lấp đầy khung - Canh chính giữa tâm ảnh).
       * `cover-bottom` (Lấp đầy khung - Canh phần dưới).
       * `cover` (Lấp đầy khung chuẩn mặc định).
       * `fill` (Co giãn vừa kín khung).
     - Bổ sung trường `coverPosition` (Điểm lấy nét: `top`, `center`, `bottom`).
  2. **Đồng bộ Cơ sở dữ liệu PostgreSQL an toàn theo Mandate Mục 6 (AGENTS.md):**
     - Tạo kiểu enum: `enum_specialties_cover_fit`, `enum__specialties_v_version_cover_fit`, `enum_specialties_cover_position`, `enum__specialties_v_version_cover_position`.
     - Thêm cột an toàn: `cover_fit` và `cover_position` vào bảng `specialties`; `version_cover_fit` và `version_cover_position` vào bảng `_specialties_v`.
     - Duy trì `PAYLOAD_DB_PUSH=false` để server khởi động tức thì, ngăn chặn nghẽn pool Drizzle.
  3. **Áp dụng hiển thị trên Trang Chi Tiết Chuyên Khoa (`/chuyen-khoa/[slug]`):**
     - File `src/app/(frontend)/chuyen-khoa/[slug]/page.tsx` & `specialty-detail.css`:
     - Khung ảnh `specialtyCoverBox` chuẩn tỉ lệ 16:9 với lớp nền gradient y tế sâu (`#072b4c` -> `#0754a8`).
     - Tự động áp dụng `specialty.coverFit` (`fitCoverTop`, `fitCoverCenter`, `fitCoverBottom`, `fitContain`, `fitFill`) được chọn từ Admin CMS.
     - Khi quản trị viên chọn `contain`: Khung ảnh tự động chuyển sang chế độ nền sáng nhẹ nhàng (`isContainMode`, gradient `#f0f7fd`), ảnh hiển thị 100% nguyên vẹn không bị crop bất kỳ mép nào.
  4. **Áp dụng trên Thẻ Chuyên Khoa Trang Chủ (`SpecialtiesCarousel.tsx` & `.module.css`):**
     - Tự động áp dụng `coverFit` và `coverPosition` đã chọn từ CMS.
     - Mặc định canh đỉnh đầu (`cover-top`), lấy trọn vẹn khuôn mặt bác sĩ/y tá.
  5. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/Specialties.ts`
  - `src/app/(frontend)/chuyen-khoa/[slug]/page.tsx`
  - `src/app/(frontend)/chuyen-khoa/[slug]/specialty-detail.css`
  - `src/components/SpecialtiesCarousel.tsx`
  - `src/components/SpecialtiesCarousel.module.css`
  - `src/app/(frontend)/page.tsx`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Thiết Kế Lại Toàn Diện Section Chuyên Khoa: Trình Diễn Carousel Chuyên Khoa Đẳng Cấp Y Tế Quốc Tế (Specialties Showcase Carousel)

- **Thời gian thực hiện:** 12:35 (Asia/Saigon)
- **Yêu cầu:** Loại bỏ hoàn toàn section tổ chức cũ và thiết kế lại 1 section mới hoàn toàn để thể hiện sự chuyên nghiệp vượt bậc và làm nổi bật các chuyên khoa đang có của bệnh viện.
- **Chi tiết đã thực hiện:**
  1. **Xây dựng Component `SpecialtiesCarousel` (`src/components/SpecialtiesCarousel.tsx` & `.module.css`):**
     - Hiển thị hệ thống chuyên khoa dưới dạng **Carousel thẻ xoay vòng tương tác 4 cột trên Desktop (2 cột trên Tablet, 1 cột trên Mobile)**.
     - **Visual Header Card:** Mỗi thẻ chuyên khoa sở hữu ảnh bìa chuyên môn sắc nét chống méo hình (hoặc nền gradient y tế cao cấp với họa tiết hoa văn điểm vi mô), kèm gradient phủ tạo chiều sâu.
     - **Huy hiệu Biểu trưng Y tế Nổi (`specialtyIconBadge`):** Đặt nổi bật giữa mép ảnh bìa và thân thẻ với viền trắng nổi và hiệu ứng hover đổi màu xoay nhẹ tinh tế.
     - **Huy hiệu Khoa/Phòng Phụ Trách Glassmorphism:** Đặt ở góc phải trên cùng thẻ, nền mờ kính sang trọng, khẳng định đơn vị chuyên môn trực thuộc.
     - **Nội dung chuyên môn sâu & Hành động:** Tiêu đề tên chuyên khoa trang trọng, tóm tắt nhiệm vụ/dịch vụ y tế ngắn gọn và nút chỉ dẫn mũi tên tròn "Chi tiết chuyên khoa" linh hoạt.
     - **Điều hướng thông minh:** Bộ nút bấm tròn xoay vòng chuyển slide mượt mà, thanh chấm chỉ số (Indicators) tự động đồng bộ vị trí, hỗ trợ vuốt chạm cảm ứng (touch swipe) trên điện thoại và tự động chuyển sau 5 giây (pause khi hover chuột).
  2. **Tích hợp vào Trang Chủ (`src/app/(frontend)/page.tsx`):**
     - Đưa toàn bộ danh mục chuyên khoa vào `SpecialtiesCarousel`, hiển thị rực rỡ và chuyên nghiệp tương xứng tầm vóc bệnh viện, đồng bộ nhịp điệu với các khối Chuyên gia và Kỹ thuật chuyên sâu.
  3. **Kiểm thử hệ thống:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
- **Tệp tin chỉnh sửa:**
  - `src/components/SpecialtiesCarousel.tsx` (Mới)
  - `src/components/SpecialtiesCarousel.module.css` (Mới)
  - `src/app/(frontend)/page.tsx`
  - `src/app/styles/30-home-editorial.css`
  - `CHANGELOG.md`
  - `CURRENT-TASK.md`

---

## [2026-09-14] - Thiết Kế Nâng Cấp Toàn Diện Trang Chuyên Khoa (Specialty Standard Redesign)

- **Thời gian thực hiện:** 12:15 (Asia/Saigon)
- **Yêu cầu:** Thiết kế lại trang chuyên khoa (cả trang chi tiết `/chuyen-khoa/[slug]` và trang danh sách `/chuyen-khoa`) thể hiện tính chuyên nghiệp, hiện đại, chuẩn mực y tế cao cấp và tuân thủ các quy tắc cốt lõi của dự án (Mandates).
- **Chi tiết đã thực hiện:**
  1. **Trang Chi Tiết Chuyên Khoa (`src/app/(frontend)/chuyen-khoa/[slug]/page.tsx` & `specialty-detail.css`):**
     - **Hero Banner Chuẩn Y Tế (Medical Premium Hero):** Gradient xanh y tế sâu (`#072b4c` -> `#0754a8` -> `#0878d1`), breadcrumb chỉ dẫn, huy hiệu chuyên môn, tiêu đề tên chuyên khoa lớn với `text-wrap: balance`, liên kết trực tiếp đơn vị Khoa/Phòng phụ trách.
     - **Bố cục 2 Cột Chuyên Nghiệp:**
       * **Cột Trái (Sidebar Tiện ích & Hỗ trợ bệnh nhân - Sticky):**
         - Card Đơn vị phụ trách: Tên Khoa/Phòng kèm link, Trưởng khoa, Vị trí phòng khám, Số điện thoại.
         - Card Đăng ký khám chuyên khoa: Nút liên kết đặt khám Medpro trực tuyến, nút gọi Hotline tiếp nhận.
         - Hộp lưu ý quyền lợi BHYT và cấp cứu 24/7.
       * **Cột Phải (Nội dung Chuyên môn sâu):**
         - Khung ảnh bìa chuyên khoa (nếu có) bo góc 14px chống vỡ hình.
         - Khối Giới thiệu chuyên môn: Lead text nổi bật, nội dung chi tiết RichText typography thoáng mắt, chuẩn y khoa.
         - Khối Dịch vụ & Kỹ thuật mũi nhọn: Card chuyên biệt với icon nổi bật.
         - Khối **Đội ngũ Bác sĩ Chuyên khoa**: Thẻ bác sĩ hiện đại, khung avatar 3:4 chuẩn, tự động fix khung không biến dạng; áp dụng nguyên tắc sắp xếp ưu tiên Ban Giám đốc -> Trưởng/Phó khoa -> Bác sĩ theo AGENTS.md.
         - Khối **Phác đồ & Hướng dẫn điều trị liên quan**: Tự động liên kết các phác đồ điều trị ban hành thuộc chuyên khoa.
         - Khối **Các chuyên khoa liên quan**: Gợi ý các chuyên khoa khác cùng trực thuộc Khoa/Phòng.
  2. **Trang Danh Sách Chuyên Khoa (`src/app/(frontend)/chuyen-khoa/page.tsx` & `specialties.css`):**
     - Nâng cấp lưới hiển thị `specialtiesModernGrid` với thẻ Card hiện đại có icon chuyên ngành, badge khoa phụ trách, tóm tắt và nút xem chi tiết.
     - Bổ sung thanh tìm kiếm nhanh chuyên khoa theo từ khóa (tên chuyên khoa, triệu chứng, khoa phòng).
  3. **Kiểm tra và nghiệm thu:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
     - `npm run audit:config`: PASS.
- **Tệp tin chỉnh sửa:**
  - `src/app/(frontend)/chuyen-khoa/[slug]/page.tsx`
  - `src/app/(frontend)/chuyen-khoa/[slug]/specialty-detail.css` (Mới)
  - `src/app/(frontend)/chuyen-khoa/page.tsx`
  - `src/app/(frontend)/chuyen-khoa/specialties.css` (Mới)
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

## [2026-09-14] - Nâng Cấp Tùy Chọn Hiển Thị Ảnh Đại Diện Cho Thông Báo (Notices) và Tuyển Dụng (Recruitment)

- **Thời gian thực hiện:** 12:00 (Asia/Saigon)
- **Yêu cầu:** Áp dụng nâng cấp tùy chọn "Cách hiển thị ảnh đại diện trên thẻ / trang chủ" và gợi ý kích thước ảnh chuẩn tương tự phần Kỹ thuật chuyên sâu & Tin tức cho 2 mục: Thông báo (`Notices`) và Tuyển dụng (`Recruitment`).
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Collection Thông báo (`src/collections/Notices.ts`):**
     - Bổ sung gợi ý kích thước upload chuẩn tỷ lệ 16:9 (`1200×675px` hoặc `800×450px`) tại trường `cover`.
     - Mở rộng tùy chọn `coverFit` lên đầy đủ 6 lựa chọn linh hoạt (`contain`, `cover-top`, `cover-center`, `cover-bottom`, `cover`, `fill`) kèm mô tả hướng dẫn chi tiết.
  2. **Nâng cấp Collection Tuyển dụng (`src/collections/Recruitment.ts`):**
     - Bổ sung gợi ý kích thước upload chuẩn tỷ lệ 16:9 tại trường `cover`.
     - Bổ sung trường `coverFit` vào Tab 3 "⚙️ Cấu hình hiển thị & Nguồn tin" với đầy đủ 6 tùy chọn tương tự Tin tức và Thông báo.
  3. **Đồng bộ Cơ sở dữ liệu theo Quy tắc Mục 6 trong AGENTS.md:**
     - Mở rộng enum PostgreSQL cho Thông báo:
       * `enum_notices_cover_fit`: Thêm `cover-top`, `cover-center`, `cover-bottom`, `fill`.
       * `enum__notices_v_version_cover_fit`: Thêm `cover-top`, `cover-center`, `cover-bottom`, `fill`.
     - Khởi tạo kiểu enum và cột mới cho Tuyển dụng:
       * Tạo kiểu enum `enum_recruitment_cover_fit` và `enum__recruitment_v_version_cover_fit`.
       * Thêm cột `cover_fit` vào bảng `recruitment` (mặc định `'cover'`).
       * Thêm cột `version_cover_fit` vào bảng `_recruitment_v` (mặc định `'cover'`).
     - Tiếp tục duy trì `PAYLOAD_DB_PUSH=false` để Next.js khởi động tức thì, không bị nghẽn pool Drizzle introspection.
  4. **Cập nhật hiển thị Frontend:**
     - `src/app/(frontend)/page.tsx`: Cập nhật hàm `renderEditorialSection` áp dụng đúng `objectFit` và `objectPosition` cho các thẻ thông báo trên trang chủ (cả ô lớn và 4 ô nhỏ).
     - `src/components/SearchFilter.tsx`: Cập nhật thẻ hiển thị danh sách của `/thong-bao` và `/tuyen-dung` áp dụng tự động `objectFit`, `objectPosition` và nền sáng `#f4f8fb` khi chọn `contain`.
  5. **Kiểm tra và nghiệm thu:**
     - `npm run generate:types`: Đồng bộ type definitions Payload.
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
     - `npm run audit:config`: PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/Notices.ts`
  - `src/collections/Recruitment.ts`
  - `src/app/(frontend)/page.tsx`
  - `src/components/SearchFilter.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

## [2026-09-14] - Nâng Cấp Tùy Chọn Hiển Thị Ảnh Đại Diện Cho Collection Tin Tức (News)

- **Thời gian thực hiện:** 11:48 (Asia/Saigon)
- **Yêu cầu:** Áp dụng nâng cấp các tùy chọn "Cách hiển thị ảnh đại diện trên thẻ / trang chủ" của Collection Tin tức (`News.ts`) tương tự như phần Kỹ thuật chuyên sâu vừa nâng cấp.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp các tùy chọn `coverFit` trong `src/collections/News.ts`:**
     - Mở rộng danh sách chọn từ 2 tùy chọn cũ lên đầy đủ 6 tùy chọn linh hoạt:
       * `contain`: Vừa vặn khung, trọn vẹn không bị cắt (khuyên dùng - contain).
       * `cover-top`: Lấp đầy khung - Canh đỉnh đầu / phần trên (cover-top).
       * `cover-center`: Lấp đầy khung - Canh chính giữa tâm ảnh (cover-center).
       * `cover-bottom`: Lấp đầy khung - Canh phần dưới (cover-bottom).
       * `cover`: Lấp đầy khung (chuẩn mặc định - cover).
       * `fill`: Co giãn vừa kín khung ảnh (fill).
     - Bổ sung mô tả hướng dẫn chi tiết giúp biên tập viên dễ dàng chọn chế độ phù hợp với từng tỷ lệ ảnh bìa bài viết.
  2. **Cập nhật hiển thị Frontend (`HomeNewsTabs.tsx` & `page.tsx`):**
     - Mở rộng kiểu dữ liệu `NewsItem` trong `HomeNewsTabs.tsx` để hỗ trợ thêm `coverFit` và `coverPosition`.
     - Áp dụng các quy tắc style ảnh động:
       * Khi chọn `contain`: Ảnh hiển thị nguyên vẹn 100% không cắt xén, tự động căn giữa và áp dụng nền sáng dịu mắt (`#f4f8fb`).
       * Khi chọn `cover-top`, `cover-center`, `cover-bottom` hoặc `fill`: Tự động căn chỉnh `object-fit` và `object-position` chính xác.
     - Đồng bộ props truyền từ trang chủ `page.tsx` vào `HomeNewsTabs`.
  3. **Đồng bộ Cơ sở dữ liệu theo Quy tắc Mục 6 trong AGENTS.md:**
     - Đã thêm các giá trị enum (`cover-top`, `cover-center`, `cover-bottom`, `fill`) vào kiểu enum của PostgreSQL local:
       * `enum_news_cover_fit`
       * `enum__news_v_version_cover_fit`
     - Tiếp tục giữ vững `PAYLOAD_DB_PUSH=false` để server chạy mượt mà, không bị lỗi timeout.
  4. **Kiểm tra và nghiệm thu:**
     - `npm run typecheck`: 0 lỗi (Exit code 0).
     - `npm run validate:public-content`: 21/21 PASS.
     - `npm run audit:config`: PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/News.ts`
  - `src/components/HomeNewsTabs.tsx`
  - `src/app/(frontend)/page.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

- **Thời gian thực hiện:** 11:38 (Asia/Saigon)
- **Yêu cầu:** Áp dụng toàn bộ gói nâng cấp từ "Chuyên gia của chúng tôi" sang cho mục "Kỹ thuật chuyên sâu" (bao gồm: tùy chọn hiển thị ảnh đa dạng, gợi ý kích thước upload chuẩn, và công tắc bật/tắt liên kết khi click vào thẻ).
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp các tùy chọn hiển thị ảnh (`imageFit`):**
     - Mở rộng tùy chọn `imageFit` trong Collection `AdvancedTechniques` (`src/collections/AdvancedTechniques.ts`) và mảng `techniqueItems` trong Global `Homepage` (`src/globals/Homepage.ts`) với 5 chế độ:
       * `contain`: Vừa vặn khung, trọn vẹn không bị cắt (khuyên dùng - giữ nguyên 100% chi tiết poster).
       * `cover-top`: Lấp đầy khung - Canh đỉnh đầu / phần trên.
       * `cover-center`: Lấp đầy khung - Canh chính giữa tâm ảnh.
       * `cover-bottom`: Lấp đầy khung - Canh phần dưới.
       * `fill`: Co giãn vừa kín khung ảnh.
     - Sửa dứt điểm lỗi CSS trong `AdvancedTechniquesCarousel.module.css` (trước đây class `.fitContain` bị ép cứng `object-fit: cover !important`). Nay hỗ trợ đầy đủ các class: `.fitContain`, `.fitCoverTop`, `.fitCoverCenter`, `.fitCoverBottom`, `.fitFill`.
     - Cập nhật Component `AdvancedTechniquesCarousel.tsx` và trang danh sách `/ky-thuat-chuyen-sau/page.tsx` để render chính xác theo chế độ đã chọn.
  2. **Gợi ý kích thước upload chuẩn:**
     - Bổ sung mô tả hướng dẫn trực quan tại trường `cover` trong `AdvancedTechniques.ts` và trường `image` trong `Homepage.ts`:
       * *💡 Gợi ý kích thước chuẩn: Tỷ lệ đứng 1:1.15 hoặc 3:4 (ví dụ: 600×700px, 600×800px hoặc 500×580px). Nên sử dụng hình ảnh chất lượng cao chụp trang thiết bị y tế hiện đại, poster kỹ thuật hoặc bác sĩ đang thực hiện thủ thuật.*
  3. **Công tắc Bật/Tắt liên kết (`enableLink` & `customUrl`):**
     - Thêm trường `enableLink` (checkbox, mặc định `true`) tại cả `AdvancedTechniques.ts` và `techniqueItems` trong `Homepage.ts`:
       * BẬT: Bấm vào thẻ kỹ thuật sẽ chuyển đến trang chi tiết kỹ thuật hoặc liên kết tùy chỉnh.
       * TẮT: Thẻ kỹ thuật hiển thị ở chế độ tĩnh để xem (không bấm chuyển trang, không đổi con trỏ chuột sang bàn tay).
     - Thêm trường `customUrl` cho phép tùy biến đường dẫn liên kết cho từng kỹ thuật chuyên sâu khi cần.
     - Cập nhật logic trong `src/app/(frontend)/page.tsx`: Khi `enableLink === false`, gán `url: undefined` để component render dạng thẻ tĩnh `<div>` với class `.noCursor`.
  4. **Đồng bộ Cơ sở dữ liệu theo Quy tắc Mục 6 trong AGENTS.md:**
     - Đã thêm cột `enable_link` boolean (default true) và cột `custom_url` text vào các bảng tương ứng: `advanced_techniques`, `tech_items`, `_tech_items_v`.
     - Đã thêm các giá trị enum (`cover-top`, `cover-center`, `cover-bottom`, `fill`) vào:
       * `enum_advanced_techniques_image_fit`
       * `enum_tech_items_image_fit`
       * `enum__tech_items_v_image_fit`
     - Tiếp tục duy trì `PAYLOAD_DB_PUSH=false` để server khởi động tức thì, không bị lỗi timeout.
  5. **Kiểm tra và nghiệm thu:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - `npm run audit:config`: PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/AdvancedTechniques.ts`
  - `src/globals/Homepage.ts`
  - `src/components/AdvancedTechniquesCarousel.module.css`
  - `src/components/AdvancedTechniquesCarousel.tsx`
  - `src/app/(frontend)/ky-thuat-chuyen-sau/page.tsx`
  - `src/app/(frontend)/page.tsx`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

- **Thời gian thực hiện:** 11:15 (Asia/Saigon)
- **Yêu cầu:** 
  1. Thêm nhiều lựa chọn trong phần "Cách hiển thị ảnh" để ảnh hiển thị đúng kích cỡ phù hợp.
  2. Phần upload ảnh thêm gợi ý kích thước phù hợp chuẩn bệnh viện.
  3. Phần Đường dẫn liên kết tùy chỉnh (không bắt buộc) cho phép bật/tắt liên kết khi click vào thẻ chuyên gia dẫn sang trang chi tiết.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp các tùy chọn hiển thị ảnh (`imageFit`):**
     - Bổ sung danh sách chọn đa dạng gồm 5 chế độ:
       * `contain`: Vừa vặn khung, trọn vẹn không bị cắt (khuyên dùng - giữ nguyên 100% tỷ lệ ảnh gốc).
       * `cover-top`: Lấp đầy khung - Canh đỉnh đầu / mặt rõ nét (ưu tiên vùng chân dung khuôn mặt).
       * `cover-center`: Lấp đầy khung - Canh chính giữa tâm ảnh.
       * `cover-bottom`: Lấp đầy khung - Canh phần dưới.
       * `fill`: Co giãn vừa kín khung ảnh.
     - Sửa dứt điểm lỗi CSS trong `OurExpertsCarousel.module.css` (trước đây class `.fitContain` bị ép cứng `object-fit: cover !important`). Nay ánh xạ chính xác:
       * `.fitContain` -> `object-fit: contain !important; object-position: center center !important;`
       * `.fitCoverTop` -> `object-fit: cover !important; object-position: top center !important;`
       * `.fitCoverCenter` -> `object-fit: cover !important; object-position: center center !important;`
       * `.fitCoverBottom` -> `object-fit: cover !important; object-position: bottom center !important;`
       * `.fitFill` -> `object-fit: fill !important; object-position: center center !important;`
     - Cập nhật Component `OurExpertsCarousel.tsx` ánh xạ đầy đủ các giá trị `imageFit` vào class tương ứng.
  2. **Gợi ý kích thước upload ảnh chuẩn bệnh viện:**
     - Cập nhật mô tả (`description`) trường tải ảnh `image` tại cả Collection `OurExperts.ts` và mảng `expertItems` trong Global `Homepage.ts`:
       * *💡 Gợi ý kích thước chuẩn: Tỷ lệ đứng 3:4 hoặc 1:1.15 (ví dụ: 600×800px, 450×600px hoặc 400×460px). Nên dùng ảnh chụp bán thân áo blouse trắng nền sáng. Nếu để trống hệ thống sẽ tự động lấy từ ảnh đại diện (avatar) của Bác sĩ được liên kết.*
  3. **Công tắc Bật/Tắt liên kết (`enableLink`):**
     - Thêm trường `enableLink` (checkbox, mặc định `true`) tại cả `OurExperts.ts` và `Homepage.ts`:
       * BẬT: Bấm vào thẻ chuyên gia sẽ mở trang chi tiết Bác sĩ hoặc link tùy chỉnh.
       * TẮT: Thẻ chuyên gia chỉ hiển thị thông tin tĩnh để xem (không bấm chuyển trang, không đổi con trỏ chuột pointer sang bàn tay).
     - Điều kiện hiển thị (`admin.condition`): Ô nhập `url` và `openNewTab` tự động ẩn khi tắt liên kết.
     - Cập nhật `src/app/(frontend)/page.tsx`: Khi `enableLink === false`, gán `url: undefined` để component render dạng thẻ tĩnh `<div>` với class `.noCursor`.
  4. **Thay đổi Database Schema & Di chuyển dữ liệu:**
     - Đã thêm cột `enable_link` boolean (default true) vào 3 bảng: `our_experts`, `expert_items`, `_expert_items_v`.
     - Đã thêm các giá trị enum (`cover-top`, `cover-center`, `cover-bottom`, `fill`) vào:
       * `enum_our_experts_image_fit`
       * `enum_expert_items_image_fit`
       * `enum__expert_items_v_image_fit`
     - Cập nhật quy tắc cốt lõi trong `AGENTS.md` (Mục 6): Thiết lập `PAYLOAD_DB_PUSH=false` ở môi trường Local để ngăn Drizzle Introspection quá tải pool connection gây lỗi timeout, đồng thời bắt buộc đồng bộ cột và enum bằng SQL an toàn trước khi chạy server.
  5. **Kiểm tra và nghiệm thu:**
     - `npm run typecheck`: 0 lỗi.
     - `npm run validate:public-content`: 21/21 PASS.
     - `npm run audit:config`: PASS.
- **Tệp tin chỉnh sửa:**
  - `src/collections/OurExperts.ts`
  - `src/globals/Homepage.ts`
  - `src/components/OurExpertsCarousel.module.css`
  - `src/components/OurExpertsCarousel.tsx`
  - `src/app/(frontend)/page.tsx`
  - `.env`
  - `AGENTS.md`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

## [2026-09-14] - Chuẩn Hóa Giao Diện Nhập Liệu Admin Cho Collection Văn Bản / Tài Liệu (Documents)

- **Thời gian thực hiện:** 11:05 (Asia/Saigon)
- **Yêu cầu:** Áp dụng thiết kế chuẩn hóa giao diện nhập liệu Admin (theo mẫu News/Notices và tài liệu `docs/ai/admin-form-ui.md`) cho Collection Văn bản / Tài liệu (`src/collections/Documents.ts`).
- **Chi tiết đã thực hiện:**
  1. Tái cấu trúc form nhập liệu `src/collections/Documents.ts` theo hệ thống 4 Tabs chuyên nghiệp:
     - **Tab 1 - 📄 Thông tin văn bản:** Tiêu đề văn bản, slug tự sinh kèm hướng dẫn, row 3 cột (Số hiệu `number`, Chuyên mục chuẩn `categoryRef`, Năm ban hành `year`), row 3 cột (Cơ quan ban hành `issuer`, Người ký duyệt `signer`, Hình thức văn bản `documentType`), row 3 cột (Ngày ban hành `issuedAt`, Ngày có hiệu lực `effectiveAt`, Loại tài liệu cũ `category` ở chế độ read-only), Trích yếu nội dung 3 dòng, Tệp đính kèm văn bản chính (`file` - hỗ trợ đọc PDF trực tuyến), Ảnh đại diện (`cover`).
     - **Tab 2 - 📝 Nội dung văn bản chi tiết:** Trình soạn thảo RichText full-width cho trường toàn văn văn bản (`content`).
     - **Tab 3 - 🎨 Định dạng & Quyền bảo mật:** Row 3 cột quyền bảo mật (Cho phép tải về `allowDownload`, Chống sao chép nội dung `preventCopy`, Nhúng khung đọc trực tiếp `showViewer`), kèm khối Collapsible tinh tế điều chỉnh thẩm mỹ hiển thị (Canh lề tiêu đề/trích yếu, Màu sắc chữ tiêu đề y tế, Kích cỡ chữ, Màu sắc & Cỡ chữ trích yếu).
     - **Tab 4 - 🔍 Tối ưu SEO & Chia sẻ:** Tiêu đề SEO, canonical URL, mô tả SEO, ảnh chia sẻ mạng xã hội, cờ `noIndex` và `excludeFromSitemap`.
  2. Bảo toàn 100% dữ liệu, tên trường, quan hệ cơ sở dữ liệu, access rules và hooks.
  3. Nghiệm thu kiểm tra: `npm run typecheck` (0 lỗi), `npm run validate:public-content` (21/21 PASS), `npm run audit:config` (PASS).
- **Tệp tin chỉnh sửa:**
  - `src/collections/Documents.ts`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

## [2026-09-14] - Chuẩn Hóa Giao Diện Nhập Liệu Admin Cho Các Collection Nội Dung (Notices, Procurement, Recruitment, CustomPosts)

- **Thời gian thực hiện:** 11:00 (Asia/Saigon)
- **Yêu cầu:** Đồng bộ toàn bộ các Collection bài viết/nội dung tương tự theo thiết kế chuẩn từ Collection Tin tức (News) và tài liệu `docs/ai/admin-form-ui.md`.
- **Chi tiết đã thực hiện:**
  1. **Thông báo (Notices - `src/collections/Notices.ts`)**:
     - Bố cục 4 Tabs: Thông tin chính (tiêu đề, slug, row chuyên mục + mức độ thông báo `level`, mô tả ngắn 3 dòng, ảnh cover), Nội dung chi tiết & tệp đính kèm, Cấu hình hiển thị & nguồn tin (layoutTemplate, source, coverFit, coverPosition), Tối ưu SEO & Chia sẻ.
     - Sidebar: Ghim bài (`pinned`), Hiện trang chủ (`showOnHome`), Ngày đăng (`publishedAt`), Ngày bắt đầu (`startAt`), Ngày hết hạn (`expireAt`), Luồng biên tập (`workflowFields`).
  2. **Đấu thầu – Mua sắm (Procurement - `src/collections/Procurement.ts`)**:
     - Bố cục 5 Tabs: Thông tin gói thầu (tiêu đề, slug, row mã gói `referenceCode` + chuyên mục + loại thông tin `type`, row đơn vị phụ trách + trạng thái đấu thầu `procurementStatus`, thông tin liên hệ, mô tả ngắn, cover), Nội dung chi tiết & tệp đính kèm, Lịch sử cập nhật / Đính chính (`changeLog`), Cấu hình hiển thị & nguồn tin, Tối ưu SEO & Chia sẻ.
     - Sidebar: Ngày đăng (`publishedAt`), Hạn nộp hồ sơ (`deadlineAt`), Luồng biên tập (`workflowFields`).
  3. **Tin tuyển dụng (Recruitment - `src/collections/Recruitment.ts`)**:
     - Bố cục 4 Tabs: Thông tin tuyển dụng (tiêu đề, slug, row chuyên mục + khoa/phòng tuyển + số lượng tuyển, mô tả ngắn, cover), Nội dung chi tiết & tệp đính kèm (hỗ trợ tệp cũ read-only), Cấu hình hiển thị & nguồn tin, Tối ưu SEO & Chia sẻ.
     - Sidebar: Ngày đăng (`publishedAt`), Hạn nộp hồ sơ (`deadlineAt`), Luồng biên tập (`workflowFields`).
  4. **Bài viết theo mục Menu (CustomPosts - `src/collections/CustomPosts.ts`)**:
     - Bố cục 4 Tabs: Thông tin bài viết (tiêu đề, slug, mục nội dung `section`, mô tả ngắn, cover), Nội dung chi tiết & tệp đính kèm, Cấu hình hiển thị & nguồn tin, Tối ưu SEO & Chia sẻ.
     - Sidebar: Ghim bài (`pinned`), Ngày đăng (`publishedAt`), Luồng biên tập (`workflowFields`).
  5. Bảo toàn 100% dữ liệu, tên trường, slug, quan hệ cơ sở dữ liệu, access rules và hooks hệ thống.
  6. Kiểm tra nghiệm thu: `npm run typecheck` (0 lỗi), `npm run validate:public-content` (21/21 PASS), `npm run audit:config` (PASS).
- **Tệp tin chỉnh sửa:**
  - `src/collections/Notices.ts`
  - `src/collections/Procurement.ts`
  - `src/collections/Recruitment.ts`
  - `src/collections/CustomPosts.ts`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

## [2026-09-14] - Chuẩn Hóa Giao Diện Nhập Liệu Admin Cho Collection Tin Tức (News)

- **Thời gian thực hiện:** 10:46 (Asia/Saigon)
- **Yêu cầu:** Chuẩn hóa form nhập liệu Collection Tin tức làm mẫu giao diện theo tài liệu `docs/ai/admin-form-ui.md` và `AGENTS.md`. Cải thiện bố cục và trải nghiệm nhập liệu, không đổi cấu trúc dữ liệu, slug, relation, access hay hooks.
- **Chi tiết đã thực hiện:**
  1. Tái cấu trúc form nhập liệu `src/collections/News.ts` bằng schema-native UI rõ ràng với hệ thống 4 Tabs:
     - **Tab 1 - 📰 Thông tin chính:** Tiêu đề, slug tự sinh kèm hướng dẫn, row 2 cột cho Chuyên mục chuẩn (`categoryRef`) và Chuyên mục cũ (read-only), mô tả ngắn (excerpt) có placeholder/rows gọn gàng, và ảnh đại diện bìa (`cover`) với gợi ý kích thước chuẩn 16:9.
     - **Tab 2 - 📝 Nội dung chi tiết & Tệp đính kèm:** Trình soạn thảo RichText full-width và danh sách tệp đính kèm (`attachments`).
     - **Tab 3 - ⚙️ Cấu hình hiển thị & Nguồn tin:** Bố cục dạng row 2 cột cho mẫu giao diện trang (`layoutTemplate`), nguồn bài viết/tác giả (`source`), cách hiển thị ảnh đại diện (`coverFit`), và điểm lấy nét trọng tâm ảnh (`coverPosition`).
     - **Tab 4 - 🔍 Tối ưu SEO & Chia sẻ:** Gom toàn bộ cấu hình SEO vào tab chuyên biệt gồm tiêu đề SEO, canonical URL, mô tả SEO, ảnh chia sẻ Zalo/Facebook, cờ `noIndex` và `excludeFromSitemap`.
  2. Tối ưu Sidebar: Giữ các trường điều khiển trạng thái nhanh gọn gồm Tin nổi bật (`featured`), Ghim bài viết (`pinned`), Ngày xuất bản (`publishedAt` với datetime picker chuẩn) và Luồng trạng thái biên tập (`workflowFields`).
  3. Bảo toàn 100% tên trường (`name`), slug, quan hệ cơ sở dữ liệu và các hook nghiệp vụ (`syncPublishedAt`, `createSlugRedirect`, `detachNavigationReference`).
  4. Đã chạy kiểm tra và vượt qua toàn bộ: `npm run typecheck` (0 lỗi), `npm run validate:public-content` (21/21 PASS), `npm run audit:config` (PASS).
- **Tệp tin chỉnh sửa:**
  - `src/collections/News.ts`
  - `CURRENT-TASK.md`
  - `CHANGELOG.md`

---

## [2026-09-14] - Khắc Phục Lỗi Timeout Kết Nối DB và Tối Ưu Tốc Độ Khởi Động Dev Server

- **Thời gian thực hiện:** 10:38 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi `timeout exceeded when trying to connect` và `Pulling schema from database...` làm nghẽn quá trình khởi động `npm run dev`.
- **Chi tiết đã thực hiện:**
  1. Tắt `PAYLOAD_DB_PUSH=false` trong [.env](file:///d:/bvdkthoilai-main/.env) sau khi schema đã hoàn tất khởi tạo, ngăn Payload liên tục quét và khóa kết nối trên hàng trăm bảng khi khởi động dev thông thường.
  2. Nâng thời gian chờ kết nối `connectionTimeoutMillis` từ 8.000ms lên 30.000ms trong [payload.config.ts](file:///d:/bvdkthoilai-main/payload.config.ts) để các truy vấn phức tạp không bị timeout bất ngờ.
- **Tệp tin chỉnh sửa:**
  - `.env`
  - `payload.config.ts`
  - `CHANGELOG.md`

---

## [2026-09-13] - Hoàn Tất Khởi Tạo Lại Toàn Bộ Database Chuẩn 100% Trên Neon PostgreSQL

- **Thời gian thực hiện:** 20:08 (Asia/Saigon)
- **Yêu cầu:** Xây dựng lại cơ sở dữ liệu tinh khiết, loại bỏ hoàn toàn dữ liệu demo cũ và snapshot lỗi, thiết lập 100% cấu trúc bảng chuẩn theo mã nguồn hiện tại.
- **Chi tiết đã thực hiện:**
  1. Reset hoàn toàn schema `public` trên Neon PostgreSQL thành schema trắng tinh khiết.
  2. Kích hoạt `PAYLOAD_DB_PUSH=true` qua seed runner: Tự động khởi tạo trọn vẹn **247 bảng** cơ sở dữ liệu (toàn bộ 50 Collections, 21 Globals, bảng liên kết rels, bảng version và audit logs).
  3. Khởi tạo tài khoản Quản trị cấp cao (Super Admin) mặc định sẵn sàng đăng nhập quản trị hệ thống.
  4. Cấu hình sẵn dữ liệu nền tảng cho `site-settings`, `navigation` và `homepage`.
  5. Cập nhật script `package.json` tự động nạp môi trường (`tsx --env-file=.env scripts/seed.ts`).
- **Tệp tin chỉnh sửa:**
  - `package.json`
  - `CHANGELOG.md`

---

## [2026-09-13] - Dọn Dẹp Toàn Diện Migrations Cũ Để Chuẩn Hóa Database Từ Đầu

- **Thời gian thực hiện:** 20:04 (Asia/Saigon)
- **Yêu cầu:** Xóa sạch toàn bộ các tệp migration và snapshot cũ bị lệch pha, reset thư mục migration về trạng thái trắng chuẩn chỉ để chuẩn bị xây dựng lại cơ sở dữ liệu tinh khiết trên Neon Database qua `PAYLOAD_DB_PUSH`.
- **Chi tiết đã thực hiện:**
  1. Dọn dẹp toàn bộ các tệp `.ts` và `.json` migration lịch sử cũ trong `src/migrations/`.
  2. Đặt lại `src/migrations/index.ts` về danh sách trống `export const migrations = [];`.
  3. Duy trì cấu hình `PAYLOAD_DB_PUSH=true` trong `.env` và `payload.config.ts` để Payload tự động tạo toàn bộ 50 Collections và 21 Globals trực tiếp vào Neon schema mới.
- **Tệp tin chỉnh sửa:**
  - `src/migrations/index.ts`
  - Đã xóa toàn bộ các tệp migration cũ trong `src/migrations/`
  - `CHANGELOG.md`

---

## [2026-09-13] - Thiết Lập Nguyên Tắc Cốt Lõi Số 6: Tối Ưu Đồng Bộ Database Qua PAYLOAD_DB_PUSH

- **Thời gian thực hiện:** 19:55 (Asia/Saigon)
- **Yêu cầu:** Thiết lập nguyên tắc chuẩn hóa phương pháp đồng bộ cơ sở dữ liệu xuyên suốt dự án giữa Local, Neon PostgreSQL và Railway VPS.
- **Chi tiết đã thực hiện:**
  1. Ban hành **Nguyên tắc số 6 (DATABASE SYNC MANDATE)** trong `AGENTS.md`:
     - Sử dụng `PAYLOAD_DB_PUSH=true` làm cơ chế đồng bộ trực tiếp mặc định giữa mã nguồn và Neon DB.
     - Loại bỏ việc tạo file migration thủ công phức tạp trong giai đoạn phát triển để triệt tiêu hoàn toàn lỗi xung đột schema (`relation does not exist`).
     - Đảm bảo tính nhất quán tuyệt đối giữa Local và Railway khi cùng chia sẻ Neon Database.
- **Tệp tin chỉnh sửa:**
  - `AGENTS.md`
  - `CHANGELOG.md`

---

## [2026-09-13] - Đồng Bộ Migration Schema Và Đẩy Mã Nguồn Lên GitHub

- **Thời gian thực hiện:** 19:51 (Asia/Saigon)
- **Yêu cầu:** Tạo migration đồng bộ cơ sở dữ liệu và đẩy toàn bộ mã nguồn lên GitHub.
- **Chi tiết đã thực hiện:**
  1. Tạo migration đồng bộ schema mới `20260913_124616.ts` và snapshot `20260913_124616.json`.
  2. Bổ sung cơ chế an toàn `DROP COLUMN IF EXISTS` và `DROP TYPE IF EXISTS` trong các câu lệnh DDL để tương thích môi trường triển khai.
  3. Cập nhật `src/migrations/index.ts` đăng ký migration mới.
  4. Đẩy toàn bộ thay đổi lên nhánh `main` trên GitHub.
- **Tệp tin chỉnh sửa & tạo mới:**
  - `src/migrations/20260913_124616.ts`
  - `src/migrations/20260913_124616.json`
  - `src/migrations/index.ts`
  - `CHANGELOG.md`

---

## [2026-09-13] - Thiết Kế Lại Toàn Diện Tab Phân Hệ Admin, Bổ Sung Biểu Đồ Thống Kê Y Tế & Rà Soát Đồng Bộ Dữ Liệu

- **Thời gian thực hiện:** 18:22 (Asia/Saigon)
- **Yêu cầu:** Thiết kế lại cụm Tab phân hệ trong Admin Dashboard cho đẹp, hiện đại, chuẩn y tế (khắc phục giao diện nút thô mộc của trình duyệt và lỗi dính số vào chữ); Bổ sung các biểu đồ thống kê cần thiết cho công tác quản trị bệnh viện; Rà soát kiểm tra toàn bộ nội dung xem có trường hợp nào bị trùng lặp hoặc chưa đồng bộ không.
- **Chi tiết đã thực hiện:**
  1. **Thiết kế lại cụm Tab Bộ lọc phân hệ ([AdminDashboard.module.css](file:///i:/bvdkthoilai-main/src/components/admin/AdminDashboard.module.css) & [AdminDashboardClient.tsx](file:///i:/bvdkthoilai-main/src/components/admin/AdminDashboardClient.tsx))**:
     - Loại bỏ hoàn toàn kiểu nút thô mặc định của hệ thống bằng thiết kế Segmented Navigation Hub dạng thẻ cao cấp: `background: #ffffff`, viền `1px solid #e2e8f0`, đổ bóng mềm mại `0 4px 20px -2px rgba(15, 23, 42, 0.05)`.
     - Tích hợp biểu tượng vector chuyên dụng `DashboardGlyph` (sparkles, medical, stethoscope, news, feedback, layout, shieldCheck) nằm trong khung icon bo góc tinh tế.
     - Khắc phục triệt để lỗi số dính liền vào nhãn chữ bằng khung pill số đếm `tabBtnCount` độc lập (`min-width: 22px`, font tnum đậm nét, có viền bo tròn).
     - Trạng thái Active nổi bật với gradient màu xanh y tế Bệnh viện ĐKKV Thới Lai (`linear-gradient(135deg, #0f766e 0%, #0d9488 100%)`) kèm hiệu ứng đổ bóng mềm mại `box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35)`.
     - Bổ sung tab thứ 6: `🌐 Trang chủ & Giao diện` đồng bộ 100% với 6 nhóm danh mục của thanh bên Admin CMS.
  2. **Bổ sung 2 Khối Biểu đồ Thống kê Y tế Chuyên sâu ([AdminCharts.tsx](file:///i:/bvdkthoilai-main/src/components/admin/AdminCharts.tsx) & [AdminCharts.module.css](file:///i:/bvdkthoilai-main/src/components/admin/AdminCharts.module.css))**:
     - **Biểu đồ Tải lượng Khám bệnh & Trực Cấp cứu 24/7 trong tuần (`showWeeklyWorkload`)**:
       - Biểu đồ cột đôi (Dual Column SVG Bar Chart) theo dõi lượt khám ngoại trú & đặt lịch trực tuyến so sánh với số ca tiếp nhận cấp cứu 24/7 từ Thứ 2 đến Chủ Nhật.
       - Thanh chỉ số KPI đầu biểu đồ: Tổng lượt tiếp nhận tuần (~1.363 lượt), Ca cấp cứu tiếp nhận (291 ca), Khung giờ cao điểm nhất (07:30 - 10:30).
       - Rà chuột tương tác hiển thị chi tiết số liệu từng ca và ngày trực; thanh ghi chú chuẩn y tế.
     - **Biểu đồ Cơ cấu Phác đồ Điều trị & Chuyên môn Kỹ thuật (`showProtocolDistribution`)**:
       - Thanh tiến độ phân đoạn đa sắc (Multi-segment Progress Bar) thể hiện tỷ lệ phác đồ chẩn đoán và điều trị phân bổ theo 6 khối mũi nhọn: Hồi sức Cấp cứu & Chống độc (28%), Nội khoa - Nhi khoa (26%), Ngoại khoa & Gây mê (20%), Sản phụ khoa (14%), Y học cổ truyền & PHCN (8%), Cận lâm sàng & Chẩn đoán hình ảnh (4%).
       - Lưới thẻ chi tiết từng khối chuyên môn hiển thị số lượng phác đồ ban hành và nhãn bảo chứng *"100% Hiệu lực theo QĐ Hội đồng KHTK & Bộ Y tế"*.
     - Bổ sung tùy chọn bật/tắt độc lập 2 biểu đồ mới trong Modal *"Tùy chỉnh thống kê"* ([AdminDashboardCustomizer.tsx](file:///i:/bvdkthoilai-main/src/components/admin/AdminDashboardCustomizer.tsx)).
  3. **Rà soát Tính Trùng Lặp & Đồng Bộ Hóa Hệ Thống**:
     - Kiểm tra toàn bộ 50 Collections và 21 Globals: Xác nhận các phân hệ liên quan (`ClinicalProtocols` vs `Documents`, `Services` vs `ServicePrices`, `Vaccines` vs `VaccinePrices`, `Schedules` vs `Appointments`, `Feedback` vs `Consultations`) đều có cấu trúc trường dữ liệu độc lập, phân định mục đích rõ ràng, không trùng lặp chức năng.
     - Kiểm tra 23 thẻ thống kê trên Dashboard: Toàn bộ 23 thẻ đều có `id` duy nhất, không trùng lặp counter và liên kết chuẩn xác đến các Collection/Global tương ứng.
     - Đồng bộ hóa 100% giữa thanh bộ lọc phân hệ (6 tab) và danh mục sidebar của Admin CMS.
- **Tệp tin chỉnh sửa**:
  - `src/components/admin/AdminDashboard.tsx`
  - `src/components/admin/AdminDashboardClient.tsx`
  - `src/components/admin/AdminDashboard.module.css`
  - `src/components/admin/AdminCharts.tsx`
  - `src/components/admin/AdminCharts.module.css`
  - `src/components/admin/AdminDashboardCustomizer.tsx`
  - `CHANGELOG.md`

---

## [2026-09-13] - Sắp Xếp Toàn Diện Nhóm Nội Dung Admin & Nâng Cấp Dashboard Thống Kê Chuyên Nghiệp

- **Thời gian thực hiện:** 18:08 (Asia/Saigon)
- **Yêu cầu:** Kiểm tra và sắp xếp toàn bộ nội dung trong Admin CMS theo đúng từng nhóm chuyên môn y tế để dễ quản lý; đồng thời nâng cấp Dashboard thống kê các nội dung đang có một cách chuyên nghiệp, trực quan và hiện đại nhất.
- **Chi tiết đã thực hiện:**
  1. **Chuẩn hóa phân nhóm chuyên môn (`admin.group`) cho toàn bộ 50 Collections và 21 Globals**:
     - Quy hoạch và đồng bộ toàn bộ hệ thống vào **6 nhóm chuẩn nghiệp vụ y tế bệnh viện** kèm biểu tượng Unicode trực quan trên thanh bên (sidebar):
       - `🏥 Khám bệnh & Dịch vụ Y tế`: Schedules, Appointments, Services, ServicePrices, Vaccines, VaccinePrices, Vaccinations, VaccinationSchedules, AppointmentSettings, ScheduleSettings, WorkingHoursSettings, MedproSettings.
       - `🩺 Chuyên môn & Tổ chức`: ClinicalProtocols, Doctors, Departments, Specialties, AdvancedTechniques, OurExperts, ScientificActivities, ScientificActivityGroups, OrganizationChart.
       - `📰 Truyền thông & Văn bản`: News, Notices, Documents, Procurement, Recruitment, Categories.
       - `💬 Chăm sóc người bệnh & Khảo sát`: Feedback, FeedbackCases, FeedbackActions, FeedbackCategories, Consultations, FAQs, Forms, FormSubmissions, ChatbotIntents, ChatbotConversations, ChatbotUnanswered, SurveyCampaigns, SurveyResponses, SurveyTemplates, SurveyTemplateVersions, SurveyQuestions, SurveyCodes, SurveyAnswers, SurveyStatistics, ChatbotSettings.
       - `🌐 Trang chủ & Giao diện Website`: Pages, ContentSections, CustomPosts, DynamicModules, Homepage, SiteSettings, Navigation, Footer, ThemeSettings, HospitalHistory, AboutPage, QuickLinksSettings, ContactSettings, DefaultMediaSettings, SocialSettings, Header.
       - `⚙️ Hệ thống & Dữ liệu`: Media, Users, AuditLogs, ImportJobs, Redirects, SystemSettings, UploadSettings, SeoSettings.
  2. **Nâng cấp Dashboard Thống kê Chuyên nghiệp ([AdminDashboard.tsx](file:///i:/bvdkthoilai-main/src/components/admin/AdminDashboard.tsx) & [AdminDashboardClient.tsx](file:///i:/bvdkthoilai-main/src/components/admin/AdminDashboardClient.tsx))**:
     - **Thanh chỉ số điều hành trực tiếp (Command Bar)**: Thống kê thời gian thực từ PostgreSQL: Tổng nội dung số, Phác đồ điều trị, Bác sĩ & Nhân sự, Dịch vụ kỹ thuật, Ý kiến phản ánh, Tệp Media, Nhật ký kiểm toán.
     - **Bộ lọc Nhóm chuyên đề (Category Filter Tabs)**: Hỗ trợ 6 tab lọc nhanh (`Tất cả phân hệ`, `🏥 Khám bệnh & Dịch vụ Y tế`, `🩺 Chuyên môn & Tổ chức`, `📰 Truyền thông & Văn bản`, `💬 Chăm sóc & Khảo sát`, `⚙️ Hệ thống & Dữ liệu`) kèm số đếm động badge.
     - **Thẻ thống kê thông minh (Metric Cards)**: Bổ sung các thẻ chuyên môn cao cấp:
       - **Phác đồ điều trị**: Tổng số phác đồ và số phác đồ có hiệu lực đang áp dụng.
       - **Bác sĩ & Ban Giám đốc**: Số lượng nhân sự y tế và số chuyên khoa.
       - **Đặt khám trực tuyến**: Lượt đăng ký và số lượng chờ tiếp nhận duyệt.
       - **Bảng giá viện phí & BHYT**: Minh bạch giá dịch vụ kỹ thuật.
       - **Kỹ thuật chuyên sâu mũi nhọn**: Kỹ thuật công nghệ cao của viện.
       - **Nghiên cứu & Sinh hoạt khoa học**: Bồi dưỡng chuyên môn y khoa thực chứng.
       - **Nhật ký kiểm toán an toàn (Audit Logs)**: Giám sát toàn vẹn hệ thống.
     - **Tương tác nhanh**: Mỗi thẻ đều có nút *"Quản lý danh sách"* và nút *"+ Thêm"* tạo mới tức thì record tương ứng.
     - **Bento Grid & Hoạt động chuyên môn**: Bổ sung Activity Feed hiển thị các Phác đồ điều trị vừa cập nhật song song với Ý kiến người bệnh chờ xử lý; Khối Danh mục cơ sở & Hệ thống; Trung tâm phím tắt thao tác nhanh (⌘P: Thêm phác đồ, ⌘B: Thêm bác sĩ, ⌘L: Lịch khám, ⌘G: Gói thầu, ⌘D: Văn bản, ⌘A: Duyệt đặt khám, ⌘F: Phản ánh, ⌘H: Trang chủ).
     - **Tối ưu React Keys**: Gán `key` định danh duy nhất cho `commandBarNode`, `bentoContentNode` và `accountSummaryNode` để khắc phục triệt để cảnh báo React *Each child in a list should have a unique "key" prop*.
  3. **Kiểm thử & Biên dịch**: `npx tsc --noEmit` hoàn tất 100% không lỗi; endpoint `/admin` phản hồi HTTP 200 OK.
- **Tệp tin chỉnh sửa**:
  - `src/components/admin/AdminDashboard.tsx`
  - `src/components/admin/AdminDashboardClient.tsx`
  - `src/components/admin/AdminDashboard.module.css`
  - Toàn bộ 50 tệp trong `src/collections/*.ts`
  - Toàn bộ 21 tệp trong `src/globals/*.ts`
  - `CHANGELOG.md`

---

- **Thời gian thực hiện:** 17:53 (Asia/Saigon)
- **Yêu cầu:** Khi người dùng mở trang chủ và lăn con lăn chuột, hệ thống tự động hít và căn chỉnh chuẩn đỉnh của từng Section (Section Scroll Snap) theo Phương án 1 (chuẩn CSS tự nhiên, mượt mà, không giật và không gây ức chế khi đọc).
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Cấu hình Admin [Homepage.ts](file:///i:/bvdkthoilai-main/src/globals/Homepage.ts)**:
     - Thêm trường `enableSectionScrollSnap` (checkbox, mặc định `true`): Cho phép người quản trị bật/tắt linh hoạt hiệu ứng Scroll Snap ngay trong Admin CMS theo Mandate 5.2.
  2. **Viết CSS Section Scroll Snap [30-home-editorial.css](file:///i:/bvdkthoilai-main/src/app/styles/30-home-editorial.css)**:
     - Áp dụng `scroll-snap-type: y proximity` cho trình duyệt cuộn mượt tự nhiên và tự động bắt dính khi dừng lại gần đỉnh mỗi Section.
     - Cấu hình `scroll-snap-align: start` và `scroll-snap-stop: normal` cho tất cả các khối trên trang chủ (*Banner lớn, Dịch vụ nhanh, Tin mới nhất, và toàn bộ các Section nội dung*).
     - Thiết lập `scroll-margin-top: 76px` (desktop) và `64px` (mobile) để trừ hao chính xác chiều cao thanh menu cố định phía trên, đảm bảo khi hít vào Section thì tiêu đề và phần đầu của khối không bao giờ bị che lấp.
  3. **Tạo Component Client [HomeScrollSnapHandler.tsx](file:///i:/bvdkthoilai-main/src/components/HomeScrollSnapHandler.tsx)**:
     - Tự động gắn class `hasSectionScrollSnap` vào thẻ `<html>` khi đang ở trang chủ (nếu Admin bật) và tự dọn dẹp khi chuyển sang các trang con khác.
  4. **Tích hợp vào Trang Chủ [page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx)**.

---

## [2026-09-13] - Thiết Kế Lại Trang Văn Bản – Tài Liệu & Chuẩn Hóa Chuyển Hướng Chi Tiết Trên Trang Chủ (Phương Án A)

- **Thời gian thực hiện:** 17:46 (Asia/Saigon)
- **Yêu cầu:** Thiết kế lại trang Văn bản – Tài liệu (`/van-ban`) với 2 chế độ xem (Bảng danh sách chuẩn Cổng thông tin Sở Y tế Cần Thơ & Lưới thẻ có ảnh), bộ lọc năm và chuyên mục. Đồng thời trên trang chủ (cả Section Văn bản và Điểm tin), khi người dùng bấm vào văn bản/phác đồ thì **bắt buộc chuyển hướng vào Trang chi tiết (`/van-ban/[slug]` hoặc `/phac-do-dieu-tri/[slug]`)**, tại đó đã nhúng sẵn khung xem trực tiếp (Viewer), hiển thị bảng thuộc tính Sở Y tế Cần Thơ và cơ chế kiểm soát bảo mật (Chống sao chép, Khóa tải về), tuyệt đối không mở thẳng file tải về làm mất thẩm mỹ và mất kiểm soát bảo mật.
- **Chi tiết đã thực hiện:**
  1. **Tạo Component [DocumentDirectoryView.tsx](file:///i:/bvdkthoilai-main/src/components/DocumentDirectoryView.tsx) & [DocumentDirectoryView.module.css](file:///i:/bvdkthoilai-main/src/components/DocumentDirectoryView.module.css)**:
     - Hỗ trợ nút chuyển đổi nhanh giữa 2 kiểu xem:
       - **Bảng danh sách công văn (Table View)**: Chuẩn hóa theo Cổng thông tin điện tử Sở Y tế Cần Thơ gồm STT, Số/Ký hiệu, Ngày ban hành, Trích yếu nội dung, Cơ quan ban hành và nút Xem chi tiết.
       - **Lưới thẻ (Card Grid View)**: Thẻ có ảnh đại diện, badge chuyên mục, số hiệu, ngày và mô tả.
     - Tích hợp ô tìm kiếm tức thì theo số hiệu, trích yếu, tên văn bản, cơ quan ban hành.
     - Bộ lọc dropdown chọn Chuyên mục / Hình thức văn bản và Năm ban hành.
  2. **Thiết kế lại Trang [van-ban/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/van-ban/page.tsx)**:
     - Tích hợp `DocumentDirectoryView`.
     - Tự động lấy dữ liệu tổng hợp từ cả 2 collection `documents` và `clinical-protocols`.
     - Toàn bộ liên kết đều dẫn chuẩn vào trang chi tiết `/van-ban/[slug]` hoặc `/phac-do-dieu-tri/[slug]`.
  3. **Cập nhật Trang Chủ [src/app/(frontend)/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx)**:
     - Section `documents`: Nâng cấp để kết hợp cả Văn bản điều hành và Phác đồ điều trị mới nhất, đổi `href` từ link file tĩnh sang trang chi tiết (`/van-ban/[slug]` hoặc `/phac-do-dieu-tri/[slug]`).
     - Section `featured-news` (nguồn `documents`): Đổi `href` sang trang chi tiết văn bản tương ứng.
  4. **Kiểm tra kiểm thử**: `npx tsc --noEmit` hoàn thành 100% không lỗi.

---

## [2026-09-13] - Thiết Kế Trang Phác Đồ Điều Trị & Văn Bản Theo Mẫu Sở Y Tế Cần Thơ, Nhúng Viewer Trực Tiếp, Bật/Tắt Tải Về & Chống Sao Chép

- **Thời gian thực hiện:** 17:02 (Asia/Saigon)
- **Yêu cầu:** Thiết kế trang Phác đồ điều trị và văn bản điều hành theo mẫu chuẩn Cổng thông tin điện tử Sở Y tế TP. Cần Thơ (`soyte.cantho.gov.vn`). Upload file hiển thị trình đọc trực tiếp trên web; có tính năng bật/tắt cho phép tải tài liệu về máy và tính năng chặn không cho phép sao chép/lấy thông tin khi không được phép.
- **Chi tiết đã thực hiện:**
  1. **Nâng cấp Database & Collection [Documents.ts](file:///i:/bvdkthoilai-main/src/collections/Documents.ts)**:
     - Thêm `documentType` (text): Hình thức văn bản (Phác đồ điều trị, Kế hoạch, Quyết định, Hướng dẫn chuyên môn...).
     - Thêm `signer` (text): Người ký duyệt văn bản/phác đồ.
     - Thêm `content` (richText): Soạn thảo nội dung văn bản chi tiết trực tiếp nếu có.
     - Thêm nhóm điều khiển quyền hạn (`type: 'row'`):
       - `allowDownload` (checkbox, mặc định `true`): Cho phép người dùng tải tệp về máy. Khi tắt, nút "Tải về" bị ẩn hoàn toàn và thay bằng nhãn "Chỉ xem trực tuyến".
       - `preventCopy` (checkbox, mặc định `false`): Cơ chế bảo mật chặn sao chép thông tin (chặn chuột phải, chặn copy/cut/paste, chặn bôi đen/chọn văn bản, chặn các phím tắt `Ctrl+C`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`).
       - `showViewer` (checkbox, mặc định `true`): Nhúng khung đọc văn bản trực tiếp ngay trên trang chi tiết.
  2. **Xây dựng Component [DocumentProtection.tsx](file:///i:/bvdkthoilai-main/src/components/DocumentProtection.tsx)**:
     - Module phía client chặn các hành vi copy văn bản, vô hiệu hóa menu ngữ cảnh chuột phải và lắng nghe các phím tắt sao chép khi `preventCopy` được bật.
  3. **Xây dựng Component [DocumentDetailView.tsx](file:///i:/bvdkthoilai-main/src/components/DocumentDetailView.tsx) & [DocumentDetailView.module.css](file:///i:/bvdkthoilai-main/src/components/DocumentDetailView.module.css)**:
     - Thiết kế bảng thuộc tính văn bản chuẩn phong cách Sở Y tế Cần Thơ: Số ký hiệu, Ngày ban hành, Ngày hiệu lực, Hình thức văn bản, Lĩnh vực/Chuyên mục, Cơ quan ban hành, Người ký duyệt, Trích yếu nội dung.
     - Hàng tài liệu đính kèm kèm icon định dạng file (PDF, DOC...), tên file, nút "Xem trực tiếp" (bật/thu gọn viewer) và nút "Tải về" (hoặc nhãn "Chỉ xem trực tuyến" khi bị khóa).
     - Trình xem tài liệu trực tiếp nhúng thẻ iframe xem PDF/Docs trực quan, có thanh công cụ mở tab mới và nút phóng to toàn màn hình.
  4. **Xây dựng Route Chi tiết [van-ban/[slug]/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/van-ban/[slug]/page.tsx)**:
     - Trang hiển thị trọn vẹn chi tiết văn bản/phác đồ, hỗ trợ breadcrumbs, xem nội dung richText, và danh sách các tài liệu liên quan khác.
  5. **Xây dựng Trang Chuyên biệt [phac-do-dieu-tri/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/phac-do-dieu-tri/page.tsx)**:
     - Route riêng `/phac-do-dieu-tri` chuyên biệt cho tra cứu Phác đồ điều trị, hướng dẫn chẩn đoán và quy trình chuyên môn của Bệnh viện Đa khoa Khu vực Thới Lai.
  6. **Cập nhật Trang Danh sách [van-ban/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/van-ban/page.tsx) & Menu [Navigation.ts](file:///i:/bvdkthoilai-main/src/globals/Navigation.ts)**:
     - Các thẻ văn bản trong danh sách chuyển hướng xem chi tiết vào `/van-ban/[slug]` thay vì link download trực tiếp.
     - Bổ sung tùy chọn preset "Phác đồ điều trị" (`/phac-do-dieu-tri`) vào cấu hình Navigation trong Admin để gắn lên menu dễ dàng.

  7. **Tách riêng Collection Quản trị [ClinicalProtocols.ts](file:///i:/bvdkthoilai-main/src/collections/ClinicalProtocols.ts)**:
     - Tạo riêng mục **"Phác đồ điều trị"** hiển thị trực tiếp trên thanh menu Admin CMS ở nhóm **"Nội dung"** (`/admin/collections/clinical-protocols`).
     - Có sẵn các trường chuyên sâu: Tên phác đồ, Mã phác đồ, Chuyên khoa áp dụng (`specialties`), Hình thức văn bản, Người ký duyệt / Hội đồng, Ngày ban hành, Ngày hiệu lực, Trích yếu, Tệp đính kèm (PDF/Word), Khóa sao chép và Khóa tải về.

### Database & Schema Changes:
- Collection `clinical-protocols` ([ClinicalProtocols.ts](file:///i:/bvdkthoilai-main/src/collections/ClinicalProtocols.ts)):
  - Tạo bảng collection riêng biệt cho Phác đồ điều trị xuất hiện trực tiếp trong thanh Admin.
  - Tích hợp trọn bộ cơ chế kiểm soát và styling theo Mandate 5 trong `AGENTS.md`:
    - Granular Toggles (5.2): `allowDownload`, `preventCopy`, `showViewer`.
    - Styling Controls (5.3): Nhóm `collapsible` gồm `textAlign` (trái, giữa, phải, đều 2 bên), `titleColor` (đen, navy, blue, green, red), `titleSize` (tiêu chuẩn, lớn, rất lớn), `summaryColor` (đen xám, slate, dark), `summarySize` (chuẩn, lớn, nhỏ).
    - Multiline formatting: Trích yếu tự do xuống dòng (`white-space: pre-line`).
    - Chống lỗi rớt từ mồ côi (5.4): `text-wrap: balance` cho toàn bộ tiêu đề.
    - PostgreSQL Safe (5.5): Không kích hoạt `versions` quá mức, `dbName` chuẩn chỉ.
- Collection `documents` ([Documents.ts](file:///i:/bvdkthoilai-main/src/collections/Documents.ts)):
  - Thêm fields: `documentType`, `signer`, `content`, `allowDownload`, `preventCopy`, `showViewer`.
  - Bổ sung nhóm `Styling Controls` đồng bộ (`textAlign`, `titleColor`, `titleSize`, `summaryColor`, `summarySize`).

### Files Created & Modified:
- [ClinicalProtocols.ts](file:///i:/bvdkthoilai-main/src/collections/ClinicalProtocols.ts) (Mới)
- [payload.config.ts](file:///i:/bvdkthoilai-main/payload.config.ts)
- [src/access/index.ts](file:///i:/bvdkthoilai-main/src/access/index.ts)
- [Categories.ts](file:///i:/bvdkthoilai-main/src/collections/Categories.ts)
- [Documents.ts](file:///i:/bvdkthoilai-main/src/collections/Documents.ts)
- [DocumentProtection.tsx](file:///i:/bvdkthoilai-main/src/components/DocumentProtection.tsx) (Mới)
- [DocumentDetailView.tsx](file:///i:/bvdkthoilai-main/src/components/DocumentDetailView.tsx) (Mới)
- [DocumentDetailView.module.css](file:///i:/bvdkthoilai-main/src/components/DocumentDetailView.module.css) (Mới)
- [van-ban/[slug]/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/van-ban/[slug]/page.tsx) (Mới)
- [phac-do-dieu-tri/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/phac-do-dieu-tri/page.tsx) (Mới)
- [phac-do-dieu-tri/[slug]/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/phac-do-dieu-tri/[slug]/page.tsx) (Mới)
- [van-ban/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/van-ban/page.tsx)
- [Navigation.ts](file:///i:/bvdkthoilai-main/src/globals/Navigation.ts)
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md)

---

- **Thời gian thực hiện:** 16:43 (Asia/Saigon)
- **Yêu cầu:** Thiết kế trong Admin cho phép chọn những chuyên mục nào được hiển thị lên mục *Điểm tin Bệnh viện Đa khoa khu vực Thới Lai*, quy định số lượng bài viết lấy lên cho từng mục, bật/tắt từng nguồn, lọc tin nổi bật và các tùy chọn liên quan.
- **Chi tiết đã thực hiện:**
  1. **Mở rộng Admin Schema [Homepage.ts](file:///i:/bvdkthoilai-main/src/globals/Homepage.ts)**:
     - Thêm bảng mảng cấu hình `featuredSources` (`dbName: 'fn_sources'`) trong mục `featured-news`:
       - **Nguồn nội dung (`source`)**: Tin tức chung (`news`), Tin theo chuyên mục cụ thể (`news-category`), Thông báo (`notices`), Đấu thầu – Mua sắm (`procurement`), Lịch khám & Lịch trực (`schedules`), Văn bản – Tài liệu (`documents`).
       - **Chọn chuyên mục cụ thể (`categoryRef`)**: Liên kết trực tiếp bảng `categories` (lọc theo scope `news`).
       - **Tên chuyên mục thủ công (`categoryName`)**: Hỗ trợ nhập tên danh mục tự do hoặc tương thích dữ liệu cũ.
       - **Tên nhãn hiển thị góc thẻ (`customBadge`)**: Tùy chỉnh nhãn nổi bật trên thẻ (ví dụ: TIN TỨC, BHYT, HOẠT ĐỘNG...).
       - **Giới hạn số bài (`limit`)**: Quy định mỗi chuyên mục/nguồn được lấy tối đa bao nhiêu bài (từ 1 đến 20 bài).
       - **Công tắc độc lập (`enabled`)**: Cho phép bật/tắt từng nguồn chuyên mục tùy ý mà không cần xóa cấu hình.
     - Thêm trường chế độ lọc bài (`featuredFilterMode`): Lấy toàn bộ bài mới nhất (`all`) hoặc chỉ lấy các bài được biên tập viên đánh dấu "Tin nổi bật" (`only-featured`).
     - Thêm trường tùy chỉnh liên kết nút "Xem tất cả →" (`featuredSeeAllUrl`).
     - Thêm trường tùy chọn hiển thị ảnh (`featuredCardFit`: `cover` hoặc `contain`) đảm bảo ảnh chuẩn tỉ lệ, không méo hình.
  2. **Nâng cấp Component [FeaturedContentCarousel.tsx](file:///i:/bvdkthoilai-main/src/components/FeaturedContentCarousel.tsx)**:
     - Hỗ trợ các thuộc tính `imageFit` (`cover` | `contain`) và `imagePosition` (`top center`, `center center`...) cho từng thẻ và toàn bộ carousel.
     - Khung ảnh tự động canh giữa và hiển thị nền nhạt y tế khi dùng chế độ `contain`, bảo toàn 100% tỷ lệ hình ảnh bài viết.
  3. **Cập nhật Logic Kết Nối Dữ Liệu [page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx)**:
     - Xử lý duyệt qua cấu hình `featuredSources` động từ cơ sở dữ liệu.
     - Lọc chính xác theo `categoryRef` hoặc tên chuyên mục, áp dụng giới hạn số lượng (`limit`) độc lập cho từng nguồn.
     - Khử trùng lặp bài viết thông minh và sắp xếp theo ngày mới nhất.
     - Truyền đường dẫn `seeAllUrl` và kiểu fit ảnh `featuredCardFit` vào component hiển thị.

### Database & Schema Changes:
- Global `homepage` ([Homepage.ts](file:///i:/bvdkthoilai-main/src/globals/Homepage.ts)):
  - Thêm mảng `featuredSources` (`dbName: 'fn_sources'`) với các trường: `source`, `categoryRef`, `categoryName`, `customBadge`, `limit`, `enabled`.
  - Thêm `featuredFilterMode`, `featuredSeeAllUrl`, `featuredCardFit`.

### Files Modified:
- [Homepage.ts](file:///i:/bvdkthoilai-main/src/globals/Homepage.ts)
- [FeaturedContentCarousel.tsx](file:///i:/bvdkthoilai-main/src/components/FeaturedContentCarousel.tsx)
- [page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx)
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md)

---

## [2026-09-13] - Khắc Phục Lấy Đúng Tab Và Hiển Thị Lịch Khám Bệnh / Lịch Trực Cấp Cứu Lên Trang Chủ

- **Thời gian thực hiện:** 16:22 (Asia/Saigon)
- **Yêu cầu:** Sửa lỗi section "Lịch khám bệnh" trên trang chủ (`/`) chưa lấy đúng tab và chưa hiển thị lịch thực tế từ cơ sở dữ liệu.
- **Nguyên nhân & Các điểm đã xử lý:**
  1. **Hỗ trợ Tab Lịch trực cấp cứu (`emergency`)**:
     - Trong cơ sở dữ liệu `schedules`, phần lớn lịch được lưu có `mode: 'emergency'`, tuy nhiên trước đó trang chủ chỉ xử lý 3 loại: `daily`, `weekly`, `attachments`. Tab mặc định là `attachments` không có bài đăng nào dẫn đến tab đầu tiên hiển thị số `0` và trống trơn.
     - Đã bổ sung `emergency` vào [Homepage.ts](file:///i:/bvdkthoilai-main/src/globals/Homepage.ts) trong danh sách `defaultScheduleTabs` và options của field `tab`.
  2. **Nâng cấp [ScheduleExplorer.tsx](file:///i:/bvdkthoilai-main/src/components/ScheduleExplorer.tsx)**:
     - Mở rộng kiểu `ScheduleKind` thêm `'emergency'`.
     - Thêm prop `emergency?: any[]`.
     - Tích hợp `builtInMeta.emergency` với nhãn "Lịch trực cấp cứu", nhãn thẻ `LỊCH TRỰC CẤP CỨU`, hiển thị thời gian áp dụng tuần trực (`emergencyWeekStart` – `emergencyWeekEnd`) và placeholder `TRỰC`.
     - Tự động ưu tiên chọn tab đầu tiên có dữ liệu (`items.length > 0`) để người bệnh khi vào trang chủ luôn thấy ngay lịch trực/lịch khám mới nhất thay vì mở ra một tab rỗng.
  3. **Đồng bộ truy vấn và mapping tại [page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx)**:
     - Đổi sort query `schedules` từ `sort: 'date'` thành `sort: '-createdAt'` và tăng `depth: 2` để luôn lấy được các lịch khám, lịch trực mới nhất cùng thông tin bác sĩ/khoa phòng.
     - Trích xuất `homeEmergencySchedules` từ danh sách `schedules`.
     - Cập nhật logic `mergedScheduleTabs` để tự động ghép tab `emergency` lên vị trí đầu tiên kể cả khi cấu hình trong DB được lưu từ bản cũ chưa có field `emergency`.
     - Truyền đầy đủ `emergency={homeEmergencySchedules}` vào component `<ScheduleExplorer />`.

### Files Modified:
- [Homepage.ts](file:///i:/bvdkthoilai-main/src/globals/Homepage.ts)
- [ScheduleExplorer.tsx](file:///i:/bvdkthoilai-main/src/components/ScheduleExplorer.tsx)
- [page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx)
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md)

---

## [2026-09-13] - Áp Dụng Toàn Diện Nguyên Tắc Cốt Lõi Bắt Buộc Số 5 Cho Các Trang Nhóm 1

- **Thời gian thực hiện:** 16:10 (Asia/Saigon)
- **Yêu cầu:** Áp dụng triệt để **Nguyên tắc cốt lõi bắt buộc số 5 (Project Mandate 5)** cho toàn bộ các trang trong **Nhóm 1**:
  1. **Chân trang chung (`SiteFooter.tsx` & `Footer.ts`)**:
     - Cấu hình defaultValue hoàn chỉnh cho `columns` trong Global `footer`, đưa toàn bộ các cột liên kết (*Dành cho người bệnh*, *Thông tin bệnh viện*, *Hỗ trợ*) vào CMS.
     - Hỗ trợ công tắc ẩn/hiện (`visible`) độc lập cho từng cột và từng liên kết.
     - Bổ sung tùy chọn canh lề cột (`textAlign: left | center | right`) với `dbName: 'ft_col_align'` (< 63 ký tự).
     - Áp dụng hiển thị styling linh hoạt trong [SiteFooter.tsx](file:///i:/bvdkthoilai-main/src/components/SiteFooter.tsx).
  2. **Trang Giới thiệu chung (`/gioi-thieu` & `AboutPage.ts`)**:
     - Thêm công tắc bật/tắt độc lập (`enabled`) cho tất cả các khối lớn: Banner Hero, Chỉ số hoạt động, Chức năng & Nhiệm vụ, Cơ sở vật chất, Cam kết chất lượng, Khối liên kết chuyên đề.
     - Thêm công tắc bật/tắt độc lập cho từng phần tử con: từng chỉ số (`stats`), từng nhiệm vụ (`corePrinciples.items`), từng trang bị (`facilities.items`), từng liên kết chuyên đề (`relatedLinks.links`).
     - Tích hợp styling controls: Canh lề (`textAlign`: left, center, justify) với `dbName` chuẩn PostgreSQL (< 63 ký tự: `ab_hero_align`, `ab_cp_align`, `ab_fc_align`, `ab_cm_align`).
     - Hỗ trợ gõ Enter tự do xuống dòng (`white-space: pre-line`) cho các đoạn văn bản mô tả, nhiệm vụ, trang bị, lời cam kết.
     - Khắc phục triệt để hiện tượng rớt từ mồ côi với `text-wrap: balance` cho các tiêu đề và đoạn trích.
  3. **Trang Bảng giá dịch vụ (`/bang-gia` & `SiteSettings.ts`)**:
     - Mở rộng cấu hình `servicePricePage` trong Global `site-settings`:
       - Thêm công tắc bật/tắt bảng thông báo lưu ý BHYT & Viện phí (`showNoticeBanner`).
       - Thêm trường tiêu đề lưu ý (`noticeTitle`) và nội dung chi tiết lưu ý (`noticeContent`) hỗ trợ xuống dòng Enter (`white-space: pre-line`).
       - Thêm tùy chọn canh lề thông báo (`noticeAlign`: left, center, justify) với `dbName: 'sp_not_align'`.
     - Cập nhật frontend [bang-gia/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/bang-gia/page.tsx) render khối lưu ý y tế nổi bật, chuẩn y tế và `text-wrap: balance`.
  4. **Trang Sơ đồ tổ chức (`/so-do-to-chuc` & `OrganizationChart.ts`)**:
     - Mở rộng Global `organization-chart`:
       - Thêm công tắc bật/tắt riêng biệt cho Khối 1: Ban Lãnh đạo Bệnh viện (`showLeadershipSection`) và Khối 2: Sơ đồ tổ chức bộ máy (`showTreeSection`).
       - Thêm công tắc bật/tắt độc lập cho ô Giám đốc (`director.enabled`) và từng ô Phó Giám đốc (`deputyDirectors[].enabled`).
       - Tùy chỉnh tiêu đề hiển thị linh hoạt cho từng khối.
     - Cập nhật frontend [so-do-to-chuc/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/so-do-to-chuc/page.tsx) tôn trọng thiết lập bật/tắt của Admin và chống rớt từ (`text-wrap: balance`).
  5. **Trang Tiêm chủng vắc xin (`/tiem-chung` & `SiteSettings.ts`)**:
     - Thêm nhóm cấu hình `vaccinationPage` vào Global `site-settings`:
       - Tùy chỉnh tiêu đề (`title`), nhãn nhỏ (`eyebrow`), mô tả (`description`).
       - Thêm công tắc bật/tắt thông báo lưu ý an toàn tiêm chủng (`showNoticeBanner`).
       - Thêm tiêu đề và nội dung lưu ý quy trình an toàn tiêm chủng với canh lề (`noticeAlign`) và tự do xuống dòng (`white-space: pre-line`).
     - Cập nhật frontend [tiem-chung/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/tiem-chung/page.tsx) kết nối Global và render khối thông báo trực quan.

### Database & Schema Changes:
- Global `footer` ([Footer.ts](file:///i:/bvdkthoilai-main/src/globals/Footer.ts)): defaultValue các cột liên kết, trường `textAlign` (`dbName: 'ft_col_align'`).
- Global `about-page` ([AboutPage.ts](file:///i:/bvdkthoilai-main/src/globals/AboutPage.ts)): `enabled` trên mọi khối & items, `textAlign` với `dbName: 'ab_hero_align'`, `'ab_cp_align'`, `'ab_fc_align'`, `'ab_cm_align'`.
- Global `site-settings` ([SiteSettings.ts](file:///i:/bvdkthoilai-main/src/globals/SiteSettings.ts)):
  - Mở rộng `servicePricePage`: `showNoticeBanner`, `noticeTitle`, `noticeContent`, `noticeAlign` (`dbName: 'sp_not_align'`).
  - Thêm group `vaccinationPage`: `eyebrow`, `title`, `description`, `showNoticeBanner`, `noticeTitle`, `noticeContent`, `noticeAlign` (`dbName: 'vc_not_align'`).
- Global `organization-chart` ([OrganizationChart.ts](file:///i:/bvdkthoilai-main/src/globals/OrganizationChart.ts)): `showLeadershipSection`, `leadershipTitle`, `showTreeSection`, `treeTitle`, `director.enabled`, `deputyDirectors[].enabled`.

### Files Modified:
- [Footer.ts](file:///i:/bvdkthoilai-main/src/globals/Footer.ts)
- [SiteFooter.tsx](file:///i:/bvdkthoilai-main/src/components/SiteFooter.tsx)
- [AboutPage.ts](file:///i:/bvdkthoilai-main/src/globals/AboutPage.ts)
- [gioi-thieu/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/gioi-thieu/page.tsx)
- [SiteSettings.ts](file:///i:/bvdkthoilai-main/src/globals/SiteSettings.ts)
- [bang-gia/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/bang-gia/page.tsx)
- [OrganizationChart.ts](file:///i:/bvdkthoilai-main/src/globals/OrganizationChart.ts)
- [so-do-to-chuc/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/so-do-to-chuc/page.tsx)
- [tiem-chung/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/tiem-chung/page.tsx)
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md)

---

## [2026-09-13] - Áp Dụng Nguyên Tắc 5 Nâng Cấp Toàn Diện Trang Lịch Khám & Trực (`/lich-kham`)

- **Thời gian thực hiện:** 16:06 (Asia/Saigon)
- **Yêu cầu:**
  1. Áp dụng ngay **Nguyên tắc cốt lõi số 5** cho trang Lịch khám & Trực (`/lich-kham`):
     - **Banner Hero đầu trang**: Đưa 100% vào Admin CMS (`schedule-settings` -> `hero`):
       - Tùy chỉnh ảnh nền khuôn viên (`bgImage`) hoặc dải màu Gradient (Blue-Teal, Ocean Navy, Teal-Emerald, Royal Blue).
       - Tùy chọn độ tối phủ nền (`overlayOpacity`: 35%, 55%, 78%).
       - Tùy chỉnh cỡ chữ tiêu đề, màu chữ tiêu đề (Trắng, Vàng nắng, Xanh ngọc sáng) chống lỗi rớt chữ mồ côi (`text-wrap: balance`).
       - Nhãn nhỏ Eyebrow và mô tả hướng dẫn tự do xuống dòng (`white-space: pre-line`).
     - **Khối thông báo nhanh / Banner Cấp cứu 24/7 (`quickNotice`)**:
       - Có công tắc bật/tắt riêng biệt (`enabled`).
       - Tùy chọn canh lề (trái, giữa, đều 2 bên), màu sắc tiêu đề (đỏ, xanh navy, xanh lá), hỗ trợ gõ Enter xuống dòng.
     - **Khối Lưu ý quan trọng cho người bệnh khi đi khám (`notesSection`)**:
       - Có công tắc bật/tắt cả khối (`enabled`) và từng dòng lưu ý con (`item.enabled`).
       - Từng dòng lưu ý hỗ trợ tùy biến: Canh lề (trái, đều 2 bên), màu chữ (đen, navy, đỏ), cỡ chữ (tiêu chuẩn, lớn) và tự do xuống dòng khi nhập liệu.
  2. Frontend ([page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-kham/page.tsx)) kết nối trực tiếp với Global `schedule-settings`, lọc tự động `enabled !== false` và hiển thị đồng bộ với giao diện chung.

### Database & Schema Changes:
- Global `schedule-settings` ([ScheduleSettings.ts](file:///i:/bvdkthoilai-main/src/globals/ScheduleSettings.ts)):
  - Thêm group `hero` (ảnh nền, gradient, overlay, titleSize, titleColor, description).
  - Thêm group `quickNotice` (enabled, textAlign, title, titleColor, content, hotline).
  - Thêm group `notesSection` với array `items` (`dbName: 'sch_notes'`), các trường styling `sch_n_align`, `sch_n_tcolor`, `sch_n_tsize`.

### Files Modified:
- [ScheduleSettings.ts](file:///i:/bvdkthoilai-main/src/globals/ScheduleSettings.ts): Mở rộng toàn diện schema cho Trang Lịch khám theo Nguyên tắc 5.
- [lich-kham/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-kham/page.tsx): Render động Hero banner, QuickNotice, SearchFilter và NotesSection.
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md): Cập nhật nhật ký dự án.

---

## [2026-09-13] - Thiết Lập Nguyên Tắc Bắt Buộc Số 5 Vào AGENTS.md Cho Trang Lịch Làm Việc & Admin CMS

- **Thời gian thực hiện:** 16:01 (Asia/Saigon)
- **Yêu cầu:**
  1. Đúc kết toàn bộ các yêu cầu của người dùng đối với trang Lịch làm việc (`/lich-lam-viec`) thành **Nguyên tắc cốt lõi bắt buộc số 5 (Project Mandate 5)** trong tệp [AGENTS.md](file:///i:/bvdkthoilai-main/AGENTS.md):
     - **5.1. Đưa toàn bộ vào Admin CMS**: Quản lý 100% nội dung, hình nền, icon, mốc giờ, liên kết và ghi chú từ Admin CMS, tuyệt đối không hardcode text cố định ngoài giao diện.
     - **5.2. Quyền bật/tắt độc lập từng ô thông tin (Granular Toggles)**: Cả cấp độ khối lớn lẫn từng phần tử nhỏ (từng ô khoa phòng, từng mốc giờ, từng link, từng dòng lưu ý) đều phải có checkbox `enabled` riêng biệt.
     - **5.3. Định dạng và thẩm mỹ linh hoạt trên từng ô (Styling Controls)**: Hỗ trợ Canh lề (`textAlign`: trái, giữa, phải, đều 2 bên), Xuống dòng tự do khi gõ Enter (`white-space: pre-line`), Màu chữ đa dạng chuẩn y tế (`titleColor`, `textColor`, `noteColor`), và Cỡ chữ linh hoạt (`titleSize`, `textSize`, `noteSize`).
     - **5.4. Chống lỗi rớt từ mồ côi (No Orphan Words)**: Sử dụng `text-wrap: balance` và chiều rộng khung hợp lý, không để rớt 1 từ đơn lẻ xuống dòng mới.
     - **5.5. An toàn cơ sở dữ liệu PostgreSQL**: Luôn cấu hình `dbName` ngắn gọn (< 63 ký tự) cho các mảng/bảng con và không bật `versions` thừa để tránh lỗi giới hạn identifier khiến server bị treo.
  2. Mọi lần nâng cấp, thêm mới tính năng hay mở rộng trang sau này bắt buộc phải tuân thủ nghiêm ngặt nguyên tắc này.

### Files Modified:
- [AGENTS.md](file:///i:/bvdkthoilai-main/AGENTS.md): Bổ sung Mục 5 - Nguyên tắc bắt buộc đối với Trang Lịch làm việc và các Khối nội dung động trong Admin CMS.
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md): Ghi chép nhật ký ban hành quy tắc dự án.

---

## [2026-09-13] - Hoàn Thiện Tùy Biến Canh Lề, Cỡ Chữ, Màu Sắc Cho Từng Ô Nội Dung Trong Toàn Trang

- **Thời gian thực hiện:** 15:58 (Asia/Saigon)
- **Yêu cầu:**
  1. Đưa toàn diện các tùy chọn **canh lề (trái, giữa, phải, đều 2 bên), kích thước cỡ chữ (tiêu chuẩn, lớn, rất lớn) và màu sắc chữ (navy, xanh y tế, đỏ nổi bật, xanh lá, đen đậm)** vào từng ô nội dung trên trang:
     - **Từng ô mốc giờ trong thông báo (`milestones`)**: Canh lề mốc giờ, màu sắc tiêu đề, cỡ chữ tiêu đề, màu sắc danh sách mô tả (`descColor`), cỡ chữ mô tả (`descSize`).
     - **Khối Cấp cứu 24/7 (`emergencyBanner`)**: Canh lề (`textAlign`), cỡ chữ tiêu đề (`titleSize`), cỡ chữ mô tả (`descSize`), hỗ trợ gõ Enter xuống dòng.
     - **Từng ô Khoa / Phòng / Bộ phận (`departments`)**: Canh lề ô (`textAlign`), màu tiêu đề (`titleColor`), cỡ chữ tiêu đề (`titleSize`), màu chữ ghi chú chân ô (`noteColor`), cỡ chữ ghi chú (`noteSize`), ghi chú tự do xuống dòng (`note`).
     - **Từng ô Thẻ liên kết Tab (`scheduleLinksSection.links`)**: Canh lề (`textAlign`), màu chữ tiêu đề liên kết (`titleColor`), cỡ chữ liên kết (`titleSize`).
     - **Từng dòng Lưu ý cho người bệnh (`notesSection.items`)**: Canh lề (`textAlign`), màu chữ (`textColor`), cỡ chữ (`textSize`), hỗ trợ gõ Enter xuống dòng.
  2. Đảm bảo toàn bộ hệ thống schema tương thích chuẩn PostgreSQL với `dbName` ngắn gọn, không phát sinh lỗi phiên bản hay độ dài định danh.

### Database & Schema Changes:
- Global `working-hours-settings` ([WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts)):
  - Mở rộng đầy đủ các trường styling cho `milestones`, `emergencyBanner`, `departments`, `scheduleLinksSection.links`, `notesSection.items`.

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts): Khai báo toàn bộ các trường styling cho từng ô.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Áp dụng render các class và style canh lề, màu sắc, cỡ chữ cho từng thành phần.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css): Khai báo đầy đủ các class màu sắc, cỡ chữ và `white-space: pre-line`.
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md): Cập nhật nhật ký dự án.

---

## [2026-09-13] - Khắc Phục Lỗi Rớt Chữ Tiêu Đề Hero & Đưa Toàn Bộ Tùy Chỉnh Nền/Ảnh Nền Vào Admin CMS

- **Thời gian thực hiện:** 15:54 (Asia/Saigon)
- **Yêu cầu:**
  1. **Khắc phục triệt để lỗi rớt từ mồ côi (chữ "bệnh" rớt một mình một dòng)**:
     - Tăng chiều rộng vùng hiển thị tiêu đề Hero lên tối đa `960px`.
     - Chuẩn hóa kích thước tiêu đề linh hoạt với `clamp(26px, 3.4vw, 36px)`, áp dụng `text-wrap: balance` để các dòng tiêu đề tự cân bằng ngắt nghỉ thẩm mỹ, không bao giờ bị rơi 1 từ lẻ loi xuống dòng mới.
  2. **Đưa toàn bộ tùy biến giao diện Hero đầu trang vào Admin CMS (`/admin/globals/working-hours-settings`)**:
     - **Tùy chọn kiểu nền Hero (`bgType`)**:
       - *Dải màu Gradient y tế*: Lựa chọn 5 bộ tông màu sang trọng (Blue - Teal, Deep Ocean Navy, Teal - Emerald, Royal Blue, Slate Blue).
       - *Hình ảnh nền (`bgImage`)*: Cho phép upload hình ảnh khuôn viên hoặc cơ sở bệnh viện trực tiếp từ thư viện Media.
       - *Màu đơn sắc (`solid`)*: Xanh y tế nguyên bản.
     - **Độ tối lớp phủ nền hình ảnh (`overlayOpacity`)**: Tùy chỉnh Light (35%), Medium (55%), Dark (78%) để bảo đảm văn bản luôn rõ nét và nổi bật trên mọi tấm ảnh.
     - **Cỡ chữ tiêu đề (`titleSize`)**: Chuẩn vừa vặn, Gọn gàng, hoặc Lớn nổi bật.
     - **Màu chữ tiêu đề (`titleColor`)**: Trắng tinh khiết, Vàng nắng nổi bật, hoặc Xanh ngọc sáng có hiệu ứng đổ bóng.
     - **Bật/Tắt hiển thị các nút thao tác (`showPrimaryBtn`, `showSecondaryBtn`)**: Có thể bật/tắt từng nút xem giờ hoặc tra cứu lịch.
     - **Khẩu hiệu Hero (`slogan`)**: Hỗ trợ gõ Enter ngắt dòng trực tiếp.

### Database & Schema Changes:
- Global `working-hours-settings` ([WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts)):
  - Bổ sung vào group `hero`: `titleSize`, `titleColor`, `bgType`, `bgGradient`, `bgImage`, `overlayOpacity`, `showPrimaryBtn`, `showSecondaryBtn`.

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts): Mở rộng schema cấu hình Hero.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Render động nền ảnh/gradient, overlay và cỡ chữ.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css): Thêm các class gradient, overlay variants, cân bằng ngắt dòng `text-wrap: balance`.
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md): Cập nhật nhật ký dự án.

---

## [2026-09-13] - Nâng Cấp Tùy Chỉnh Canh Lề, Xuống Dòng, Cỡ Chữ, Màu Chữ Trong Admin Cho Các Ô Lịch Làm Việc

- **Thời gian thực hiện:** 15:45 (Asia/Saigon)
- **Yêu cầu:**
  1. Cho phép người dùng tùy chỉnh định dạng nội dung cho các ô thông tin trên trang Lịch làm việc trực tiếp từ Admin CMS (`/admin/globals/working-hours-settings`):
     - **Canh lề nội dung ô (`textAlign`)**: Hỗ trợ Canh trái (mặc định), Canh giữa, Canh phải, hoặc Canh đều 2 bên (Justify).
     - **Tự do xuống dòng (Multiline)**: Áp dụng CSS `white-space: pre-line` cho toàn bộ các trường ghi chú (`note`), danh sách khoa phòng trong mốc giờ (`desc`), tên khoa phòng, và nội dung dòng lưu ý. Người quản trị chỉ cần gõ Enter xuống dòng trong Admin CMS, văn bản ngoài trang web sẽ tự động ngắt dòng y hệt.
     - **Màu chữ (`titleColor`, `textColor`)**: Tùy chọn đa dạng màu sắc chuẩn y tế: Mặc định (Đen đậm), Xanh dương đậm (Navy), Xanh y tế (Primary Blue), Xanh lá (Green), Đỏ nổi bật (Emergency Red), Xám đậm (Slate).
     - **Cỡ chữ (`titleSize`, `textSize`)**: Tùy chọn linh hoạt: Tiêu chuẩn, Lớn, Rất lớn hoặc Nhỏ vừa.
  2. Áp dụng cho cả 3 nhóm ô trên trang:
     - Các ô Khoa / Phòng / Bộ phận (`departments`).
     - Các ô Mốc giờ trong khối thông báo (`announcement.milestones`).
     - Các dòng Lưu ý dành cho người bệnh (`notesSection.items`).

### Database & Schema Changes:
- Bổ sung các trường tùy chọn định dạng vào Global `working-hours-settings` ([WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts)):
  - `wh_dept_align`, `wh_dept_tcolor`, `wh_dept_tsize` cho từng ô khoa phòng.
  - `wh_ms_align`, `wh_ms_tcolor`, `wh_ms_tsize` cho từng ô mốc giờ.
  - `wh_note_align`, `wh_note_tcolor`, `wh_note_tsize` cho từng dòng lưu ý.
  - Sử dụng định danh ngắn gọn `dbName` chuẩn PostgreSQL ngăn ngừa lỗi quá độ dài identifier.

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts): Khai báo các field `textAlign`, `titleColor`, `titleSize`, `textColor`, `textSize`.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Áp dụng `style={{ textAlign }}`, các class màu chữ và cỡ chữ tương ứng.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css): Định nghĩa class màu sắc, kích cỡ chữ và thuộc tính `white-space: pre-line` cho các ô nội dung.
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md): Cập nhật nhật ký dự án.

---

## [2026-09-13] - Bổ Sung Tính Năng Bật/Tắt Tùy Ý Cho Từng Ô Thông Tin Lịch Làm Việc

- **Thời gian thực hiện:** 15:42 (Asia/Saigon)
- **Yêu cầu:**
  1. Cho phép người quản trị có thể chủ động **bật/tắt tùy ý từng ô thông tin** trên toàn bộ trang Lịch làm việc (`/lich-lam-viec`) từ Admin CMS:
     - **Từng mốc giờ khám bệnh trong khối thông báo**: Có trường checkbox `enabled` riêng cho từng mốc (06:00, 06:30, 07:00,...). Nếu tắt mốc nào thì mốc đó tự động ẩn đi.
     - **Từng ô khoa / bộ phận làm việc**: Mỗi ô khoa phòng đều có checkbox `enabled` riêng (mặc định bật). Khi tắt ô nào thì ô đó không hiển thị ra ngoài giao diện.
     - **Từng thẻ liên kết tab lịch khám**: Mỗi liên kết tab có checkbox `enabled` riêng biệt.
     - **Từng dòng lưu ý dành cho người bệnh**: Mỗi dòng lưu ý trong danh sách có checkbox `enabled` riêng biệt.
     - **Cấp độ khối (Section/Block level)**: Bật/tắt toàn bộ khối thông báo (`announcement.enabled`), khối cấp cứu (`emergencyBanner.enabled`), khối liên kết (`scheduleLinksSection.enabled`), khối lưu ý (`notesSection.enabled`).
  2. Frontend ([page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx)) áp dụng lọc tự động các phần tử có `enabled !== false`, giúp giao diện co giãn hợp lý và đồng bộ mượt mà với cấu hình từ Admin CMS.

### Database & Schema Changes:
- Cập nhật Global `working-hours-settings` ([WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts)):
  - Mảng `announcement.milestones`: Thêm field `enabled` (`type: 'checkbox'`, `defaultValue: true`, label: *"Hiển thị mốc thời gian này"*).
  - Mảng `notesSection.items`: Thêm field `enabled` (`type: 'checkbox'`, `defaultValue: true`, label: *"Hiển thị mục lưu ý này"*).
  - Giữ nguyên các định danh ngắn gọn `dbName` chuẩn PostgreSQL để ngăn chặn lỗi identifier length.

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts): Bổ sung checkbox `enabled` cho từng item con trong milestones và notes.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Lọc `activeMilestones` và `activeNotes` theo `enabled !== false`.
- [CHANGELOG.md](file:///i:/bvdkthoilai-main/CHANGELOG.md): Ghi chép nhật ký tính năng bật/tắt tùy biến các ô thông tin.

---

## [2026-09-13] - Khôi Phục Bản Điều Chỉnh Lịch Làm Việc Trước Đó Theo Yêu Cầu

- **Thời gian thực hiện:** 15:38 (Asia/Saigon)
- **Yêu cầu:**
  1. Hoàn tác trở về bản điều chỉnh trước đó theo yêu cầu của người dùng.
  2. Khôi phục lại khối thông báo điều chỉnh thời gian tiếp nhận & khám bệnh (áp dụng từ 10/08/2026) với 3 mốc giờ trực quan (06:00, 06:30, 07:00), badge thông báo, lời mở đầu và lời kết.
  3. Khôi phục nhóm `announcement` trong Admin CMS ([WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts)) với đầy đủ các trường `enabled`, `badge`, `effectiveDate`, `introText`, `milestones`, `closingText`.
  4. Giữ nguyên tối ưu `dbName` ngắn gọn và loại bỏ `versions` thừa để đảm bảo không bị lỗi treo server do PostgreSQL identifier length limit.

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts): Khôi phục trường `announcement` vào Global schema.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Khôi phục giao diện khối AnnouncementCard và các milestone card.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css): Khôi phục toàn bộ style cho khối thông báo điều chỉnh và các mốc thời gian tiếp nhận.

---

## [2026-09-13] - Nâng Cấp Giao Diện Trang Lịch Làm Việc Chuyên Nghiệp & Loại Bỏ Khối Thông Báo Thô

- **Thời gian thực hiện:** 15:33 (Asia/Saigon)
- **Yêu cầu:**
  1. Loại bỏ khối thông báo văn bản thô (announcement) gây rối và nặng nề cho trang.
  2. Nâng cấp phần giới thiệu đầu trang (Hero) với ngôn phong y tế chuẩn mực: *"Bệnh viện Đa khoa Khu vực Thới Lai công khai minh bạch khung giờ làm việc các khoa phòng, quy trình tiếp đón và khám chữa bệnh nhằm phục vụ người dân nhanh chóng, tận tâm và chu đáo nhất."*
  3. Bổ sung 3 thẻ chip thông tin trọng tâm (Hero Highlights) trực quan trên Hero:
     - **06:00**: Bắt đầu tiếp nhận & phát số (hiệu ứng đèn xanh pulse).
     - **06:30**: Bác sĩ khám sớm các khoa chủ lực.
     - **24/24**: Cấp cứu thường trực mọi ngày (viền đỏ cấp cứu).
  4. Cập nhật chi tiết giờ giấc tiếp nhận & khám sớm trực tiếp vào các ô khoa/bộ phận tương ứng bên dưới (Quầy Tiếp đón 06:00, 3 khoa khám sớm 06:30, Các phòng khám còn lại 07:00, Cận lâm sàng 06:00/06:30...).
  5. Đồng bộ cấu hình trong Admin CMS (`/admin/globals/working-hours-settings`), giữ cho CMS gọn gàng, linh hoạt và không còn trường announcement thừa.

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts):
  - Lược bỏ group `announcement` trong schema.
  - Chuẩn hóa mặc định Hero: tiêu đề *"Thời gian Tiếp nhận & Khám bệnh"*, mô tả chuẩn mực y tế, nhãn badge *"THỜI GIAN PHỤC VỤ & KHÁM CHỮA BỆNH"*.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx):
  - Bỏ hoàn toàn việc render khối thông báo announcement.
  - Bổ sung 3 thẻ badge điểm nhấn dịch vụ nhanh (`whHeroHighlights` với các mốc 06:00, 06:30, 24/24).
  - Cập nhật danh sách 7 khoa phòng mặc định chuẩn hóa theo thời gian tiếp nhận sớm.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css):
  - Dọn sạch CSS announcement.
  - Bổ sung styling cho `.whHeroHighlights`, `.whHeroChip`, `.whChipDot` hiệu ứng pulse radar và responsive chuẩn mực.

---

## [2026-09-13] - Cập Nhật Thông Báo Điều Chỉnh Thời Gian Tiếp Nhận & Khám Bệnh Từ 10/08/2026

- **Thời gian thực hiện:** 15:12 (Asia/Saigon)
- **Yêu cầu:**
  1. Cập nhật nội dung thông báo điều chỉnh thời gian tiếp nhận và khám bệnh mới nhất chính thức từ ngày 10/08/2026 của Bệnh viện Đa khoa Khu vực Thới Lai:
     - **06 giờ 00**: Bắt đầu tiếp nhận người bệnh (phát số, đăng ký BHYT & dịch vụ).
     - **06 giờ 30**: Bác sĩ bắt đầu khám bệnh tại: Khoa Khám liên chuyên khoa; Khoa Ngoại – Phẫu thuật – Gây mê hồi sức; Khoa Sức khỏe sinh sản và Phụ sản.
     - **07 giờ 00**: Các phòng khám còn lại bắt đầu hoạt động bình thường: Phòng khám Y học cổ truyền; Phòng khám Bác sĩ gia đình; Phòng khám dịch vụ; Các phòng khám khác theo lịch hoạt động của bệnh viện.
  2. Thiết kế lại khối nội dung cho trang trọng, phù hợp với cơ quan y tế công lập, nổi bật thời điểm khám sớm để giảm ùn ứ và rút ngắn thời gian chờ đợi.
  3. Cập nhật toàn bộ vào Admin CMS (`working-hours-settings` -> `announcement`) để người quản trị có thể tùy chỉnh mọi thông tin (mốc giờ, tiêu đề, danh sách khoa, ghi chú, bật/tắt hiển thị).

### Database & Schema Changes:
- Bổ sung trường `announcement` vào Global `working-hours-settings`:
  - `enabled`: checkbox bật/tắt hiển thị khối thông báo.
  - `badge`: nhãn thông báo chính thức.
  - `effectiveDate`: mốc ngày áp dụng (Kể từ ngày 10 tháng 8 năm 2026).
  - `introText`: lời mở đầu thông báo.
  - `milestones`: danh sách các mốc thời gian (`time`, `title`, `desc`, `highlight`).
  - `closingText`: lời kết và kêu gọi chia sẻ thông tin.
- Cập nhật danh sách mặc định các khoa phòng trong `departments` đồng bộ với mốc giờ mở cửa sớm (Quầy tiếp đón 06:00, 3 khoa khám sớm 06:30, các phòng khám còn lại 07:00, cận lâm sàng 06:00/06:30).

### Files Modified:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts): 
  - Cập nhật schema `announcement` và dữ liệu mặc định chuẩn xác theo thông báo ngày 10/08/2026.
  - Khắc phục lỗi giới hạn độ dài định danh 63 ký tự của PostgreSQL bằng cách bổ sung `dbName` gọn gàng (`wh_milestones`, `wh_depts`, `wh_dept_rows`, `wh_sched_links`, `wh_notes`, `wh_dept_icon`, `wh_dept_badge_color`, `wh_link_icon`), đồng thời loại bỏ cấu hình versions thừa để ngăn chặn tự động sinh bảng version với index trùng lặp gây treo Next.js dev server.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Render khối thông báo điều chỉnh thời gian với các milestone card trực quan, badge động và lời kết.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css): Thiết kế phong cách card thông báo hiện đại, hiệu ứng pulse badge, thẻ milestone xanh lục nổi bật khung giờ 06:00 và 06:30.

---

## [2026-09-13] - Đưa Trang Lịch Làm Việc Vào Admin CMS (Bật/tắt ô, thêm mới, chỉnh icon, nội dung)

- **Thời gian thực hiện:** 15:10 (Asia/Saigon)
- **Yêu cầu:**
  1. Đưa toàn bộ trang "Lịch làm việc" vào Admin CMS để người quản trị có thể tùy chỉnh mọi thông tin.
  2. Cho phép bật/tắt hiển thị từng ô khung giờ (khoa/phòng nào chưa sử dụng thì tắt ẩn đi, khi nào cần thì bật lên).
  3. Cho phép thêm mới, xóa bớt hoặc sắp xếp lại các ô khoa/bộ phận.
  4. Quản trị được toàn bộ icon (hỗ trợ chọn icon SVG chuẩn y tế hoặc tự nhập Emoji tùy ý `customIconText`).
  5. Quản trị được tiêu đề, slogan, banner cấp cứu 24/7, hotline, danh sách link tab lịch khám và các dòng lưu ý.

### Database & Global Schema Changes:
- **Global mới thêm**: `working-hours-settings` (slug: `working-hours-settings`, nhóm `Dịch vụ người bệnh` trong Admin).
  - Khối `hero`: badge, title, slogan, 2 nút hành động kèm liên kết.
  - Khối `emergencyBanner`: checkbox `enabled`, title, description, hotline, buttonLabel.
  - Mảng `departments`: từng ô khoa phòng gồm `enabled` (bật/tắt), `title`, `subtitle`, `iconType`, `customIconText`, `badgeColor`, mảng `timeRows` (`label`, `value`, `highlight`), `note`.
  - Khối `scheduleLinksSection`: checkbox `enabled`, title, description, mảng `links` (`enabled`, `title`, `subtitle`, `url`, `iconType`, `isEmergency`).
  - Khối `notesSection`: checkbox `enabled`, title, mảng `items` (`boldPrefix`, `content`).

### Files Modified & Created:
- [WorkingHoursSettings.ts](file:///i:/bvdkthoilai-main/src/globals/WorkingHoursSettings.ts) [NEW]: Khai báo GlobalConfig schema đầy đủ cho Admin.
- [payload.config.ts](file:///i:/bvdkthoilai-main/payload.config.ts): Đăng ký `WorkingHoursSettings` vào mảng globals của Payload.
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx): Cập nhật kết nối và đọc động từ `working-hours-settings`, tự động ẩn các ô có `enabled: false`, render icon linh hoạt theo config.

---

- **Thời gian thực hiện:** 14:55 (Asia/Saigon)
- **Yêu cầu:**
  1. Tạo thêm trang mới "Lịch làm việc" (`/lich-lam-viec`) hiển thị đầy đủ thông tin chi tiết về khung giờ khám bệnh (ngoại trú, BHYT, thứ 7, ngoài giờ, tiêm chủng, xét nghiệm, thu viện phí và thường trực cấp cứu 24/24).
  2. Nâng cấp gắn link chính xác đến mục section lịch khám ở trang chủ và chuyển đổi trực tiếp sang đúng Tab tương ứng (`/#schedules?tab=weekly`, `/#schedules?tab=daily`, `/#schedules?tab=attachments`, `/lich-kham?type=emergency`...).
  3. Cập nhật menu điều hướng SiteHeader và footer để người dân dễ dàng tra cứu.

### Files Modified & Created:
- [lich-lam-viec/page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/page.tsx) [NEW]:
  - Trang thông tin thời gian làm việc chính thức của bệnh viện với giao diện hiện đại, banner cấp cứu 24/24 nổi bật, grid thời gian theo từng khoa phòng chức năng, kèm các lưu ý quan trọng cho người bệnh khi đi khám.
- [lich-lam-viec/lich-lam-viec.css](file:///i:/bvdkthoilai-main/src/app/(frontend)/lich-lam-viec/lich-lam-viec.css) [NEW]:
  - Thiết kế CSS thẩm mỹ cao, bảng màu y tế hài hòa, responsive tối ưu trên điện thoại và máy tính.
- [page.tsx](file:///i:/bvdkthoilai-main/src/app/(frontend)/page.tsx):
  - Thêm `id="schedules"` cho `homeScheduleSection` để hỗ trợ neo liên kết mượt mà từ bất kỳ trang nào.
- [ScheduleExplorer.tsx](file:///i:/bvdkthoilai-main/src/components/ScheduleExplorer.tsx):
  - Nâng cấp bộ nhận diện tham số tab: hỗ trợ đọc cả URL query param `?tab=...` lẫn URL hash `/#schedules?tab=...` và tự động kích hoạt đúng tab (theo tuần, theo ngày, lịch đính kèm).
- [SiteHeader.tsx](file:///i:/bvdkthoilai-main/src/components/SiteHeader.tsx):
  - Bổ sung "Giờ làm việc bệnh viện" vào danh mục menu con của "Lịch khám & Trực".
- [SiteFooter.tsx](file:///i:/bvdkthoilai-main/src/components/SiteFooter.tsx):
  - Bổ sung liên kết "Giờ làm việc" tại cột "Dành cho người bệnh".

---

- **Thời gian thực hiện:** 14:40 (Asia/Saigon)
- **Yêu cầu:**
  1. Làm nổi bật phần CẤP CỨU TỔNG HỢP (Bác sĩ & Điều dưỡng) trên bảng ma trận trực tuần.
  2. Phần ĐIỆN NƯỚC (và các bộ phận ca kíp tương tự như Tài xế, Viện phí...) nếu các ô ngày thứ trong tuần trống thì không được gộp ô lại, giữ nguyên 7 cột riêng lẻ (ô trống hiển thị gạch ngang `–`).
  3. Tiêu đề bảng mặc định luôn luôn là "LỊCH PHÂN CÔNG TRỰC TUẦN", không lấy tiêu đề do người dùng tự nhập/thêm.

### Files Modified:
- [EmergencyMatrixView.tsx](file:///i:/bvdkthoilai-main/src/components/EmergencyMatrixView.tsx):
  - Cố định tiêu đề `<h2>LỊCH PHÂN CÔNG TRỰC TUẦN</h2>` tại `emergMastheadClassic`.
  - Bổ sung kiểm tra ngoại lệ trong `getRowMergeMode()`: ĐIỆN NƯỚC, TÀI XẾ, VIỆN PHÍ... luôn trả về chế độ `'daily'` (7 cột T2->CN), không gộp ô ngay cả khi chỉ có dữ liệu ở một vài ngày cuối tuần (T7, CN).
  - Thêm class `emergEmergencyHighlightRow` cho các hàng CẤP CỨU TỔNG HỢP (Bác sĩ, Điều dưỡng).
- [daily-schedule.css](file:///i:/bvdkthoilai-main/src/app/styles/daily-schedule.css):
  - Thêm quy tắc CSS `.emergEmergencyHighlightRow`: viền nổi bật màu xanh thương hiệu y tế (#0284c7), nền gradient sang trọng, icon xe cấp cứu và badge vai trò có nền xanh đậm tương phản cao.

---

- **Thời gian thực hiện:** 14:20 (Asia/Saigon)

### 1. Vấn đề phát hiện:
- Có 2 hàng "Nội-Nhi" / "Cấp Cứu TH" trong cùng 1 bảng nhưng thuộc 2 nhóm khác nhau.
- **Nhóm TRÊN** (trực đêm/24h): mỗi ngày một người riêng → day3, day4 đều có dữ liệu.
- **Nhóm DƯỚI** (lịch khám ngày): gộp T2-T4 và T5-T7 → day3, day4 rỗng (data chỉ ở day2 và day5).

### 2. Giải pháp – Logic phân biệt dựa trên dữ liệu:
```
if day3 rỗng AND day4 rỗng → Nhóm DƯỚI:
  - Nội/Nhi/ĐY/Khám/Cấp Cứu → split3_3 [T2-T4] | [T5-T7] | CN
  - Sản và các khoa/phòng còn lại → merge_all [T2-T7] | CN
else → Nhóm TRÊN:
  - Hiển thị 7 ô ngày riêng lẻ (daily)
```

### 3. Files Modified:
- `src/components/EmergencyMatrixView.tsx`: `getRowMergeMode()` dùng `day3Empty && day4Empty` thay vì tên khoa để phân biệt nhóm.

---



- **Thời gian thực hiện:** 14:12 (Asia/Saigon)

### 1. Bố cục bảng chính xác:
| Hàng | Chế độ | Mô tả |
|------|---------|-------|
| THƯỜNG TRỰC LÃNH ĐẠO (ngày giống nhau / có keyword) | `permanent` | colSpan=7 badge THƯỜNG TRỰC BAN GIÁM ĐỐC (24/7) |
| IT (ngày giống nhau) | `permanent` | colSpan=7 badge THƯỜNG TRỰC IT |
| LÃNH ĐẠO (ngày khác nhau) | `daily` | 7 ô riêng lẻ (chip chip-leader màu vàng) |
| Nội-Nhi-ĐY / Khám / Cấp Cứu TH | `split3_3` | [T2-T4] \| [T5-T7] \| CN |
| Sản và tất cả khoa/phòng còn lại | `merge_all` | [T2-T7] \| CN |

### 2. Files Modified:
- `src/components/EmergencyMatrixView.tsx`:
  - `getRowMergeMode()`: thêm case `'daily'` cho LÃNH ĐẠO/GIÁM ĐỐC không permanent.
  - Tbody: `permanent` → colSpan=7 badge (khôi phục); `daily` → 7 ô riêng lẻ chip-leader.

---



- **Thời gian thực hiện:** 14:00 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- **IT / Lãnh đạo** (hàng permanent): **KHÔNG gộp** – hiển thị 7 ô ngày riêng lẻ như các khoa bình thường.
- **Nội-Nhi-ĐY, Khám, Cấp Cứu Tổng Hợp**: gộp T2-T4 | T5-T7 | CN (giữ nguyên).
- **Sản và các khoa/phòng còn lại**: gộp T2-T7 | CN (giữ nguyên).
- **Chip tên**: icon sát tên hơn (gap 2px, justify flex-start).

### 2. Files Modified:
- `src/components/EmergencyMatrixView.tsx`: `mergeMode==='permanent'` chuyển từ colSpan=7 sang map 7 ô riêng lẻ.
- `src/app/styles/daily-schedule.css`: `.emergDoctorChip` gap 5px→2px, justify center→flex-start.

---



- **Thời gian thực hiện:** 13:55 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- **Nhóm 1 – Nội-Nhi-ĐY, Khám, Cấp Cứu Tổng Hợp**: Gộp T2-T3-T4 thành 1 ô, T5-T6-T7 thành 1 ô, CN riêng.
- **Nhóm 2 – Sản và các khoa/phòng còn lại**: Gộp T2-T7 thành 1 ô, CN riêng.
- **Tiêu đề mặc định**: Đổi thành "LỊCH PHÂN CÔNG TRỰC THEO TUẦN".
- **Header bảng**: Bổ sung hàng nhóm "Thứ Hai – Thứ Tư" / "Thứ Năm – Thứ Bảy" / "Chủ Nhật" phía trên hàng T2-T7-CN.

### 2. Files Modified:
- `src/components/EmergencyMatrixView.tsx`:
  - Thêm hàm `getRowMergeMode()` trả về `'split3_3'` hoặc `'merge_all'`.
  - Cập nhật render tbody: 3 nhánh conditional (`permanent` / `split3_3` / `merge_all`).
  - Header thead thành 2 hàng (rowSpan cho cột Khoa).
  - Tiêu đề mặc định đổi thành "LỊCH PHÂN CÔNG TRỰC THEO TUẦN".
- `src/app/styles/daily-schedule.css`:
  - Thêm `.emergColGroupHeader`, `.emergCellMerged3`, `.emergCellMerged6`.
  - `.emergColDeptHeader` thêm `vertical-align: middle`.

---



- **Thời gian thực hiện:** 13:42 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- **Phân biệt hàng gộp Thường Trực IT vs Thường Trực Ban Giám Đốc**:
  - Đối với hàng **IT** (hoặc các khoa phòng khác khi các ngày có dữ liệu trực giống nhau gộp lại suốt tuần):
    - Đổi nhãn từ `THƯỜNG TRỰC BAN GIÁM ĐỐC (24/7)` thành **`THƯỜNG TRỰC IT`** (kèm icon màn hình máy tính chuyên dụng).
    - Chỉ các hàng thuộc Ban Giám đốc / Lãnh đạo mới hiển thị nhãn `THƯỜNG TRỰC BAN GIÁM ĐỐC (24/7)`.
- **Đồng bộ tất cả các ô bác sĩ / điều dưỡng cùng 1 kích thước bằng nhau 100%**:
  - Tất cả các thẻ chip hiển thị tên bác sĩ, điều dưỡng trên toàn bộ hệ thống (cả Lịch trực tuần và Lịch khám theo ngày) đều được cố định chuẩn kích thước `width: 105px; min-width: 105px; max-width: 105px; height: 28px`.
  - Căn giữa cân xứng tuyệt đối, nội dung chữ và icon đều tăm tắp, không co kéo hay lệch hàng.
- **Tự động ẩn hàng nếu tất cả các ngày / ca đều trống dữ liệu (áp dụng cho tất cả loại lịch)**:
  - **Lịch trực tuần (`EmergencyMatrixView.tsx`)**: Tự động lọc ẩn các hàng khoa/bộ phận nếu cả 7 ngày (T2 đến CN) đều trống hoặc chỉ chứa dấu gạch ngang (`-`, `–`).
  - **Lịch khám theo ngày (`src/app/(frontend)/lich-kham/[id]/page.tsx`)**: Tự động lọc ẩn các dòng khoa/phòng nếu cả 4 ca trực (`07:00-10:00`, `10:00-11:00`, `13:00-16:00`, `16:00-17:00`) đều trống hoặc không có nhân sự trực.

### 2. Chi tiết thực hiện:
- **`src/components/EmergencyMatrixView.tsx`**:
  - Nâng cấp logic `getPermanentRowInfo` phân biệt nhãn `THƯỜNG TRỰC IT` (icon máy tính, gradient xanh công nghệ) với `THƯỜNG TRỰC BAN GIÁM ĐỐC (24/7)` và các khoa khác.
  - Thêm bộ lọc `.filter()` trước khi render dòng `tbody`, tự động ẩn dòng nếu tất cả các ngày đều không có dữ liệu.
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Thêm bộ lọc `.filter()` cho `dailyAssignments`, ẩn các dòng nếu cả 4 ca khám đều trống.
  - Cố định kích thước `dailyDoctorChip` đồng bộ `width: 105px`, `minWidth: 105px`, `maxWidth: 105px`.
- **`src/app/styles/daily-schedule.css`**:
  - Thêm `.emergMergedTag.emergTagIT` với gradient xanh công nghệ chuyên nghiệp.
  - Cố định kích thước `.emergDoctorChip` và `.dailyDoctorChip` thành chuẩn `105px × 28px`.

### 3. Thay đổi Database / Schema:
- Không thay đổi cấu trúc database, tương thích 100% với dữ liệu hiện có.

---

### 1. Yêu cầu & Mục tiêu:
- **Đồng bộ thiết kế Lịch Khám Theo Ngày giống Lịch Trực Tuần**:
  - Toàn bộ các chip bác sĩ trong 4 ca khám (`07:00 – 10:00`, `10:00 – 11:00`, `13:00 – 16:00`, `16:00 – 17:00`) đều áp dụng tông màu xanh dương - trắng y tế, kích thước cố định đồng đều bằng nhau (`width: 100%; max-width: 120px; min-width: 96px; height: 28px`), căn giữa cân đối tuyệt đối.
- **Tạo mẫu Excel có sẵn và cơ chế Import tự động trong Admin CMS**:
  - Tạo file mẫu Excel chuẩn y tế [`/templates/lich-kham-ngay-mau.xlsx`](file:///I:/bvdkthoilai-main/public/templates/lich-kham-ngay-mau.xlsx) dựng sẵn cấu trúc theo đúng mẫu ảnh thực tế (gồm tiêu đề LỊCH NGÀY, các ca trực và các khoa phòng như KHÁM, CẤP CỨU, NỘI, YHCT, NGOẠI, SKSS, SIÊU ÂM, RA TRỰC, CÔNG TÁC, HỌC, PK BSGĐ, QLCL, HỘI CHẨN...).
  - Thêm parser Excel chuyên dụng `src/lib/dailyScheduleExcelParser.ts` tự động nhận diện ngày khám từ tiêu đề và bóc tách dữ liệu 4 ca trực của từng khoa.
  - Tích hợp component công cụ Admin `DailyTemplateDownload.tsx` trực tiếp vào màn hình chỉnh sửa Lịch ngày trong Admin CMS (`Schedules` -> `dailyTemplateHelper`), hỗ trợ nút bấm **"Tải mẫu Excel chuẩn"** và khu vực upload **"Đọc & Import"** tự động điền trọn vẹn vào bảng.

### 2. Chi tiết thực hiện:
- **`src/lib/dailyScheduleExcelParser.ts`**: Viết bộ bóc tách dữ liệu Excel động cho Lịch khám ngày.
- **`src/components/admin/DailyTemplateDownload.tsx`**: Giao diện Admin chuyên nghiệp cho phép tải mẫu và import trực tiếp vào form của Payload CMS.
- **`src/collections/Schedules.ts`**: Bổ sung trường UI `dailyTemplateHelper` kích hoạt khi `mode === 'daily'`.
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**: Nâng cấp `renderDoctorChips` của Lịch khám ngày sang cấu trúc `flex-direction: column`, căn giữa, thẻ chip có kích thước cố định đồng bộ.
- **`src/app/styles/daily-schedule.css`**: Cập nhật CSS cho `.dailyDoctorChipList` và `.dailyDoctorChip` đồng đều kích thước, viền xanh nhạt, nền xanh trắng y tế.
- **`public/templates/lich-kham-ngay-mau.xlsx`**: File Excel mẫu chuẩn hóa sẵn tải trực tiếp từ Admin.

### 3. Thay đổi Database / Schema:
- Không thay đổi schema database, giữ nguyên `dailyAssignments` và `date`.

---

## [2026-09-13] - Chuyển Màu Chip Điều Dưỡng Sang Xanh Dương, Chuẩn Hóa Kích Thước Bác Sĩ & Hỗ Trợ Tự Động Thêm Khoa Mới (IT, KSNK...) Trong Admin/Excel

- **Thời gian thực hiện:** 13:08 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- **Đổi màu chip điều dưỡng sang màu xanh dương**: Chuyển màu chip điều dưỡng từ xanh lá nhạt sang gam màu xanh dương chuẩn y tế (`background: #f0f9ff`, viền `#7dd3fc`, chữ `#0369a1`, icon `#0284c7` trên nền `#bae6fd`).
- **Cố định kích thước tất cả các ô bác sĩ**: Đảm bảo toàn bộ thẻ bác sĩ (`.emergDoctorChip`) đều có kích thước cố định đồng bộ, cân đối giữa các hàng và cột.
- **Tùy biến trong Admin & Mẫu Excel mở rộng (Thêm cột/dòng như IT, KSNK...)**:
  - Bảng quản trị Admin CMS (`Schedules` -> `weeklyDeptSlots`) đã tích hợp đầy đủ cho phép thêm/sửa/xóa tùy ý bất kỳ Khoa/Bộ phận nào.
  - Parser Excel (`emergencyExcelParser.ts` và API `/api/emergency-import`) hoạt động linh hoạt động: Bất kể thêm mới bao nhiêu khoa/bộ phận trong file Excel (như CNTT/IT, Kiểm soát nhiễm khuẩn - KSNK, Kế hoạch tổng hợp, Tổ chức cán bộ, v.v.), parser đều tự động nhận diện và bóc tách đầy đủ dữ liệu 7 ngày đưa vào bảng.
  - Bổ sung icon nhận diện chuyên khoa trực quan cho khoa **IT / CNTT** (màn hình máy tính) và **KSNK / Nhiễm khuẩn** (khiên bảo vệ y tế).

### 2. Chi tiết thực hiện:
- **`src/app/styles/daily-schedule.css`**: Cập nhật `.emergDoctorChip.chip-nurse` và `.chip-nurse .emergDoctorChipIcon` sang tông xanh dương y tế.
- **`src/components/EmergencyMatrixView.tsx`**: Thêm icon nhận diện cho khoa IT / CNTT và KSNK / Kiểm soát nhiễm khuẩn trong cả cột tên khoa và chip nhân sự.
- **`CHANGELOG.md`**: Ghi chép nhật ký theo quy định.

### 3. Thay đổi Database / Schema:
- Giữ nguyên cấu trúc Schema Payload CMS (collection `schedules`), tương thích hoàn toàn.

---

## [2026-09-13] - Đồng Đều Kích Thước Các Ô Bác Sĩ & Bổ Sung Icon Riêng Từng Khoa Phòng Từ Nội - Nhi Trở Xuống (/lich-kham/13)

- **Thời gian thực hiện:** 13:03 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- **Đồng đều kích thước các ô bác sĩ**: Tất cả các thẻ chip bác sĩ/nhân sự (`.emergDoctorChip`) trong cùng cột đều có kích thước cố định bằng nhau (`width: 100%; max-width: 110px; min-width: 96px; height: 28px`), căn giữa tuyệt đối, không bị ô dài ô ngắn so le.
- **Icon chuyên khoa riêng biệt từ Nội - Nhi trở xuống**: Mỗi khoa phòng có biểu tượng nhận diện y tế trực quan riêng biệt đặt ngay trong chip tên bác sĩ/nhân sự:
  - *Nội - Nhi*: Biểu tượng giường điều trị bệnh viện.
  - *Sản*: Biểu tượng mẹ và bé.
  - *Dược*: Biểu tượng cối và chày thuốc dược liệu.
  - *Cận lâm sàng / Xét nghiệm*: Biểu tượng cấu trúc phân tử sinh hóa.
  - *X-quang / Chẩn đoán hình ảnh*: Biểu tượng màn hình phát tia X và nhịp tim.
  - *Tài xế / Lái xe cấp cứu*: Biểu tượng vô lăng xe vận chuyển cấp cứu.
  - *Viện phí / Thu ngân*: Biểu tượng hóa đơn / thẻ thanh toán viện phí.
  - *Điện nước / Hậu cần*: Biểu tượng năng lượng tia sét kỹ thuật.
  - *Cấp cứu*: Biểu tượng xe cứu thương cấp cứu.
  - *Lãnh đạo*: Biểu tượng ngôi sao vàng danh dự.

### 2. Chi tiết thực hiện:
- **`src/components/EmergencyMatrixView.tsx`**:
  - Viết helper `renderDoctorChipIcon(deptName, subRole, isLeaderRow)` tự động phân loại biểu tượng SVG y khoa chất lượng cao theo đúng khoa phòng tương ứng của dòng đó.
  - Cập nhật hàm `renderStaffChips` nhận tham số `deptName` để truyền dữ liệu khoa phòng cho từng chip.
- **`src/app/styles/daily-schedule.css`**:
  - Thiết lập thuộc tính kích thước chuẩn hóa cho `.emergDoctorChip`: `width: 100% !important; max-width: 110px !important; min-width: 96px !important; height: 28px !important;` với `display: inline-flex` và căn giữa cân đối.
  - Điều chỉnh font chữ `.emergDoctorChipName` với `flex: 1 1 auto; text-align: center;` bảo đảm hiển thị đẹp mắt, ngay ngắn trên tất cả các cột.

### 3. Thay đổi Database / Schema:
- Không thay đổi schema database.

---

## [2026-09-13] - Hiển Thị Ngày Thực Tế Từng Thứ Trong Tuần & Đổi Màu Chip Điều Dưỡng Sang Xanh Y Tế (/lich-kham/13)

- **Thời gian thực hiện:** 12:53 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- **Hiển thị ngày thực tế dưới từng Thứ trong tuần**: Tự động tính toán ngày/tháng thực tế từ dải tuần trực (ví dụ Thứ Hai 05/08, Thứ Ba 06/08, ..., Chủ Nhật 11/08).
- **Đổi màu chip điều dưỡng**: Hàng điều dưỡng cấp cứu tổng hợp chuyển từ màu hồng tím sang gam màu xanh y tế thanh lịch (`#f0fdf4`, viền `#bbf7d0`, chữ `#166534`, icon `#15803d`).
- **Icon chuyên khoa trước tên khoa/phòng**: Đảm bảo hiển thị đầy đủ icon riêng biệt cho tất cả các khoa phòng.

### 2. Chi tiết thực hiện:
- **`src/components/EmergencyMatrixView.tsx`**:
  - Thêm `dayDateMap` tính toán ngày thực tế từ `weekStart`.
  - Hiển thị badge ngày dạng `05/08` dưới mỗi tên thứ.
- **`src/app/styles/daily-schedule.css`**:
  - Bổ sung style `.emergDayDateActual` bo tròn viền xanh nhạt.
  - Cập nhật `.emergDoctorChip.chip-nurse` sang màu xanh y tế.

### 3. Thay đổi Database / Schema:
- Không thay đổi schema database.

---

## [2026-09-13] - Cập Nhật Giao Diện Lịch Trực Cấp Cứu (/lich-kham/13): Tông Màu Xanh - Trắng, Canh Giữa Banner & Danh Sách Bác Sĩ, Chống Rớt Dòng Thường Trực Lãnh Đạo

- **Thời gian thực hiện:** 12:41 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- Tinh chỉnh lại trang chi tiết lịch trực cấp cứu (`/lich-kham/13`):
  - **Canh giữa banner header**: Tiêu đề ribbon, badge ngày trực được căn giữa hoàn toàn trang trọng và cân đối.
  - **Giao diện màu xanh - trắng**: Chuyển toàn bộ tông màu đỏ cấp cứu sang hệ màu xanh dương y tế chuẩn của bệnh viện (`#0284c7`, `#0369a1`, `#e0f2fe`, `#f0f9ff`, `#bae6fd`), đồng bộ với phong cách poster Lịch bác sĩ khám ngày.
  - **Canh giữa tên bác sĩ**: Các chip bác sĩ/điều dưỡng/kỹ thuật viên trong từng ô ngày được căn giữa (`justify-content: center`, `text-align: center`).
  - **Phần Thường trực Lãnh đạo không cho xuống dòng**: Khóa `white-space: nowrap !important;`, mở rộng độ rộng cột bộ phận lên 22%, giữ thẻ thông tin lãnh đạo và số điện thoại trên một hàng ngang liên tục, không bị ngắt rớt dòng chữ "ĐẠO" hay tên lãnh đạo.

### 2. Chi tiết thực hiện:
- **`src/app/styles/daily-schedule.css`**:
  - Đổi màu khung `.emergPosterShell`, header `.emergMastheadClassic`, viền bảng `.emergMatrixTable`, cột bộ phận `.emergColDeptHeader`, và các ô ngày sang gam màu xanh dương và trắng.
  - Thêm thuộc tính `white-space: nowrap !important;` cho `.emergDeptBox`, `.emergDeptName`, `.emergDeptSubRole`, `.emergMergedLeaderCard`, `.emergMergedTag`, `.emergMergedName` để triệt để chống tình trạng xuống dòng của khối "THƯỜNG TRỰC LÃNH ĐẠO".
  - Căn giữa toàn diện `.emergMastheadBox`, `.emergDoctorChipList`, `.emergDoctorChip`, `.emergDoctorChipName`.
  - Tinh chỉnh responsive mobile: căn giữa nội dung header khi xem trên điện thoại.
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Chuyển màu nút Hotline Cấp cứu 24/7 ở chân trang sang tông xanh dương sang trọng đồng bộ.

### 3. Thay đổi Database / Schema:
- Không thay đổi schema database, dữ liệu hoạt động ổn định và tương thích 100%.

---

## [2026-09-13] - Tinh Chỉnh Bảng Lịch Trực Tuần Bệnh Viện: Gộp Ô Thường Trực Lãnh Đạo & Đồng Bộ Thiết Kế Poster Lịch Khám Ngày

- **Thời gian thực hiện:** 11:55 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- Bỏ phần văn bản tiêu ngữ chính quy rườm rà (Sở Y tế / Quốc hiệu) phía trên lịch trực tuần.
- Bỏ thanh thống kê / tab lọc các bộ phận (`[Tất cả 12 bộ phận] [Lãnh đạo trực]...`).
- Thiết kế bảng nổi bật, trang trọng và chuyên nghiệp chuẩn poster y tế như mẫu lịch của bác sĩ khám ngày.
- Phần **THƯỜNG TRỰC LÃNH ĐẠO** (Ban Giám đốc trực 24/7): Gộp liền 1 ô duy nhất từ Thứ 2 đến Chủ nhật (`colSpan={7}`), hiển thị 1 lần trang trọng, không bị lặp lại 7 lần tên và SĐT của lãnh đạo.

### 2. Chi tiết thực hiện:
- **`src/components/EmergencyMatrixView.tsx`**:
  - Loại bỏ khối khẩu hiệu/tiêu ngữ chính quy `emergTopHospitalInfo`.
  - Loại bỏ thanh tab lọc `emergGroupFilterNav`.
  - Tích hợp hàm `isPermanentLeaderRow()` và `parseLeaderMerged()`: tự động phát hiện hàng Thường trực lãnh đạo và gộp 7 cột thành 1 ô duy nhất (`colSpan={7}`) với thẻ lãnh đạo màu vàng kim/hổ phách sang trọng, có biểu tượng huy hiệu và nút gọi SĐT lãnh đạo trực tiếp.
  - Tích hợp icon SVG chuyên khoa chuẩn y tế qua hàm `renderDeptIcon()`.
  - Định dạng chip nhân sự trực `emergDoctorChip` theo phong cách poster tinh gọn giống `dailyDoctorChip` của lịch khám ngày.
  - Thêm nút in nhanh `emergPrintBtnQuick` trên Masthead.
- **`src/app/styles/daily-schedule.css`**:
  - Tinh chỉnh CSS cho khung poster `emergPosterShell`, ribbon đỏ y tế `emergRibbon`, date badge `emergDateBadge`, ô gộp lãnh đạo `emergMergedLeaderCell`, `emergMergedLeaderCard`, và tối ưu in ấn khổ giấy A4 ngang.

### 3. Thay đổi Database / Schema:
- Không thay đổi schema database, dữ liệu tương thích ngược 100%.

---

## [2026-09-13] - Thiết Kế Giao Diện Bảng Lịch Trực Cấp Cứu 12 Bộ Phận & Phân Loại Chuẩn Toàn Hệ Thống

- **Thời gian thực hiện:** 11:43 (Asia/Saigon)

### 1. Yêu cầu & Mục tiêu:
- Thiết kế giao diện chuyên biệt cho lịch trực cấp cứu / lịch trực bệnh viện theo tuần vừa cập nhật từ Excel (`truc.xlsx`).
- Phân loại chuẩn xác loại trang:
  - Trên trang danh sách `/lich-kham`: phân định rạch ròi giữa "Lịch khám bệnh" và "Lịch trực cấp cứu", hiển thị đầy đủ khoảng ngày trực tuần (`emergencyWeekStart – emergencyWeekEnd`), gắn badge nhận diện đỏ y tế nổi bật.
  - Trên trang chi tiết `/lich-kham/[id]`: loại bỏ giao diện bài viết chung chung, thiết kế Bảng Poster Ma trận Lịch trực Bệnh viện chuẩn y tế Hạng II cho 12 bộ phận.
  - Tạo route tiện ích `/lich-truc` chuyển hướng trực tiếp đến danh mục Lịch trực cấp cứu.

### 2. Chi tiết thực hiện:
- **`src/components/EmergencyMatrixView.tsx` (MỚI)**:
  - Thành phần giao diện chuyên biệt cho Bảng ma trận Lịch trực cấp cứu & bệnh viện:
    - Header chính quy: Quốc hiệu, tên viện "BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI", tuần trực.
    - Thanh tiện ích: Nút gọi khẩn cấp Cấp cứu 24/7 (`0292.3686115`) kèm hiệu ứng pulse, nút In bảng trực khổ ngang A4 (`window.print()`), nút tải file Excel gốc.
    - Bộ lọc tab theo 4 khối chuyên môn: Lãnh đạo trực, Cấp cứu & Lâm sàng, Cận lâm sàng & Dược, Hậu cần & Kỹ thuật.
    - Bảng ma trận 12 bộ phận × 7 ngày:
      - Highlight vàng kim / đỏ burgundy cho khối Thường trực Ban Giám đốc 24/24 (Tuân thủ MANDATE 1 của dự án).
      - Tự động nhận diện cột Hôm nay (`isToday`) để làm nổi bật ca trực hiện tại.
      - Chip nhân sự bo góc sang trọng, phân biệt bác sĩ/điều dưỡng/dược sĩ/kỹ thuật viên.
- **`src/app/(frontend)/lich-kham/page.tsx`**:
  - Nhận diện `mode === 'emergency'` -> gán danh mục chuẩn `'Lịch trực cấp cứu'`, hiển thị dải ngày đầy đủ `emergencyWeekStart – emergencyWeekEnd`.
  - Cập nhật sort ưu tiên lịch mới nhất (`-createdAt`).
  - Hỗ trợ `searchParams` (`?type=emergency` hoặc `?category=...`) để tự động chọn tab danh mục tương ứng khi truy cập.
- **`src/components/SearchFilter.tsx` & `SearchFilter.module.css`**:
  - Hỗ trợ đồng bộ `initialCategory` từ query URL.
  - Thêm phong cách hiển thị riêng cho thẻ `cardEmergency` và badge `postCardBadgeEmergency` màu đỏ y tế rực rỡ có icon chữ thập đỏ.
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Loại bỏ tiêu đề/ảnh bìa bài viết lặp lại khi `mode === 'emergency'`.
  - Tích hợp `EmergencyMatrixView` hiển thị toàn diện bảng trực với 100% khả năng tương thích ngược các bản ghi cũ.
  - Cập nhật nút hành động chân trang: Chuyển thành nút gọi Hotline Cấp cứu 24/7 và Trở lại danh sách lịch trực & khám.
- **`src/app/styles/daily-schedule.css`**:
  - Bổ sung toàn bộ style hiện đại cho `.emergMatrixContainer`, `.emergMatrixTable`, `.emergStaffChip` và bộ CSS in ấn `@media print` tối ưu hóa in khổ A4 ngang.
- **`src/app/(frontend)/lich-truc/page.tsx` (MỚI)**:
  - Tuyến đường dẫn chuyển hướng nhanh `307` về `/lich-kham?type=emergency`.
- **`src/components/SiteHeader.tsx`**:
  - Bổ sung menu con điều hướng: "Tất cả lịch", "Lịch trực cấp cứu 24/24", "Lịch khám bệnh".

### 3. Thay đổi Database / Schema:
- Không thay đổi schema database, giữ nguyên tính toàn vẹn 100% của collection `schedules`.

---

- **Thời gian thực hiện:** 11:32 (Asia/Saigon)

### 1. Yêu cầu & Phân tích nguyên nhân:
- **Hiện tượng**: Khi tải file Excel mẫu mới (có hàng "THƯỜNG TRỰC LÃNH ĐẠO", "LÃNH ĐẠO", "CẤP CỨU TỔNG HỢP" với khối TRỰC ở góc trái), hệ thống bị nhận diện sai dòng, dẫn đến bảng preview hiển thị 25 khoa nhưng các khoa lâm sàng (Nội-Nhi, Sản, Dược, X-quang...) đều bị trống dấu `-`.
- **Nguyên nhân kỹ thuật**:
  - Trong bố cục Excel mẫu mới, ô cột 0 chứa nhãn khối `TRỰC` (chiếm hàng dọc của Thường trực lãnh đạo và Lãnh đạo), trong khi tên khoa thực sự (`THƯỜNG TRỰC LÃNH ĐẠO` / `LÃNH ĐẠO`) nằm ở cột 1.
  - Thuật toán cũ trước đó có dòng `if (col0.toUpperCase() === 'TRỰC') continue;` nên đã vô tình loại bỏ luôn hàng Thường trực lãnh đạo, và khiến con trỏ `currentDept` bị lệch sang các hàng phía dưới.
  - Thư viện `xlsx` và hàm `parseEmergencyWorkbook` trước đó được gọi qua dynamic import trong React component client-side, dẫn đến việc trình duyệt giữ cache chunk cũ nếu chưa hard refresh.

### 2. Chi tiết xử lý:
- **`src/lib/emergencyExcelParser.ts` & `src/app/(frontend)/api/emergency-import/route.ts`**:
  - Nhập khẩu trực tiếp `import * as XLSX from 'xlsx'` không qua shim window.
  - Tối ưu thuật toán nhận diện hàng linh hoạt cho mọi kiểu bố cục:
    - Nếu `col0 === 'TRỰC'`, tự động trích xuất tên khoa từ `col1` (`col0 = col1`).
    - Nhận diện chính xác `THƯỜNG TRỰC LÃNH ĐẠO` (dù nằm ở cột 0 hay cột 1) và tự động gộp tên bác sĩ thường trực 24/7 vào tất cả 7 ngày trong tuần.
    - Nhận diện các vai trò phụ `isRoleKeyword` (BÁC SĨ, ĐIỀU DƯỠNG) để phân định chính xác giữa tên Khoa (`currentDept`) và vai trò (`currentSubRole`), gom trọn vẹn từng ca trực theo ngày mà không bị lệch dữ liệu.
    - Dừng chính xác ở Bảng 1 (đúng 12 bộ phận của tuần trực), không đọc lẫn vào Bảng 2.
- **`src/components/admin/EmergencyTemplateDownload.tsx`**:
  - Chuyển sang import tĩnh trực tiếp `import * as XLSX from 'xlsx'` và `import { parseEmergencyWorkbook } from '@/lib/emergencyExcelParser'` ở đầu component để Webpack Next.js Hot Module Replacement cập nhật ngay lập tức.
- **Tệp mẫu Excel (`public/templates/lich-truc-cap-cuu-mau.xlsx`)**:
  - Cập nhật lại tệp mẫu chuẩn 100% khớp với cấu trúc bảng thực tế của bệnh viện (có Thường trực lãnh đạo 24/7, Ban Lãnh đạo, Cấp cứu tổng hợp bác sĩ/điều dưỡng, Sản, Nội-Nhi, Dược, Cận lâm sàng, X-quang, Tài xế, Viện phí, Điện nước).
- **Database / Schema**: Không thay đổi schema database.

---

- **Thời gian thực hiện:** 11:23 (Asia/Saigon)

### 1. Nguyên nhân lỗi:
- Khi nhấn nút **"✓ Điền vào bảng bên dưới"**, hàm `handleApply()` trong component `EmergencyTemplateDownload.tsx` trước đây tự gán ID tạm là `id: 'imported-${i}'` cho từng dòng con của mảng `weeklyDeptSlots`.
- Khi người dùng nhấn nút **"Lưu"**, bộ xác thực (validation) của Payload CMS và Postgres ORM kiểm tra trường `id` của mảng con. Do `id` được truyền vào là chuỗi tùy ý `imported-0` không khớp với định dạng UUID / format ID nội bộ của Payload, hệ thống chặn lại và báo lỗi: `"Lỗi - Field sau không hợp lệ: id"`.

### 2. Chi tiết xử lý:
- **`src/components/admin/EmergencyTemplateDownload.tsx`**:
  - Loại bỏ hoàn toàn việc tự gán `id: 'imported-${i}'` trong payload truyền vào `dispatchFields`.
  - Để Payload Form State tự động tạo ID nội bộ hợp lệ cho từng phần tử khi thêm mới vào bảng `weeklyDeptSlots` và `emergencyContacts`.
  - Thao tác lưu lịch trực giờ đây diễn ra trơn tru, không còn bị lỗi validation `id`.
- **Database / Schema**: Không thay đổi schema database.

---

- **Thời gian thực hiện:** 11:15 (Asia/Saigon)

### 1. Yêu cầu:
- Theo ảnh chụp biểu mẫu chính xác người dùng cung cấp, hệ thống chỉ lấy **duy nhất bảng lịch trực phân công theo ngày (Thứ Hai 14/9 → Chủ Nhật 20/9)** gồm:
  - THƯỜNG TRỰC LÃNH ĐẠO / LÃNH ĐẠO
  - CẤP CỨU TỔNG HỢP (BÁC SĨ, ĐIỀU DƯỠNG)
  - SẢN
  - NỘI – NHI
  - DƯỢC
  - CẬN LÂM SÀNG
  - X QUANG
  - TÀI XẾ
  - VIỆN PHÍ
  - ĐIỆN NƯỚC
- Không lấy các bảng phân công nhân sự cố định của các khoa/phòng phía dưới (bảng KHOA / Bác sĩ / Điều dưỡng) hay danh bạ để đảm bảo form gọn gàng, đúng và đủ theo nhu cầu hiển thị.

### 2. Chi tiết xử lý:
- **`src/lib/emergencyExcelParser.ts` & `src/app/(frontend)/api/emergency-import/route.ts`**:
  - Giới hạn phạm vi bóc tách: chỉ đọc các dòng thuộc Bảng 1 từ sau header ngày đến khi gặp dòng "KHOA", "Ghi chú:" hoặc danh bạ.
  - Hỗ trợ thêm hàng "THƯỜNG TRỰC LÃNH ĐẠO" (ô merged 7 ngày như Bs Trần Quốc Luận - Thường trực 24/7).
  - Tự động bóc tách đầy đủ nhân sự trực từng ngày từ Thứ 2 đến Chủ Nhật cho tất cả các khoa trong khung bảng.
  - Bỏ qua các hàng của Bảng 2 và danh bạ không cần thiết.
- **`src/components/admin/EmergencyTemplateDownload.tsx`**:
  - Chuẩn hóa giao diện Preview: chỉ hiển thị đúng các cột Khoa / Bộ phận, Vai trò, và 7 cột Thứ 2 → Chủ Nhật, khớp 100% với mẫu trong ảnh.
- **Database / Schema**: Không thay đổi schema database.

---

- **Thời gian thực hiện:** 11:10 (Asia/Saigon)

### 1. Yêu cầu & Nguyên nhân lỗi:
- **Hiện tượng**: Khi tải file `truc.xlsx` lên form Lịch trực cấp cứu trong Admin CMS, hệ thống chỉ lấy được hàng "LÃNH ĐẠO" có tên trực, còn toàn bộ các khoa, bác sĩ, điều dưỡng ở các dòng phía dưới (Cấp cứu tổng hợp, Nội-Nhi, Sản, Dược, Cận lâm sàng, X-quang, Tài xế, Viện phí, Điện nước...) đều bị trống các ngày T2 → CN.
- **Nguyên nhân kỹ thuật**:
  - Trong logic tìm điểm kết thúc bảng 1 (`fixedTableStart`), điều kiện tìm kiếm trước đây là `joined.includes('bác sĩ')`. Tuy nhiên, ngay tại dòng thứ 9 của bảng 1 đã có cột phụ ghi vai trò là "BÁC SĨ" (thuộc Khoa Cấp cứu tổng hợp).
  - Điều này khiến thuật toán nhận diện nhầm dòng số 9 là bắt đầu của Bảng 2 và cắt đứt vòng lặp đọc Bảng 1 ngay lập tức, dẫn đến việc chỉ đọc được dòng Lãnh đạo (dòng 8) và bỏ sót hoàn toàn toàn bộ các khoa cùng nhân sự trực các ngày T2 - CN ở phía sau.

### 2. Chi tiết xử lý:
- **`src/lib/emergencyExcelParser.ts` & `src/app/(frontend)/api/emergency-import/route.ts`**:
  - Chuẩn hóa điều kiện nhận diện Bảng 2 (`fixedTableStart`): Kiểm tra chính xác dòng tiêu đề Bảng 2 chứa cột đầu tiên là `KHOA` cùng cột `BÁC SĨ` / `ĐIỀU DƯỠNG` (thay vì tìm chuỗi "bác sĩ" lỏng lẻo ở bất kỳ ô nào).
  - Bóc tách đầy đủ dữ liệu 7 ngày (Thứ 2 → Chủ Nhật) cho toàn bộ các khoa: **LÃNH ĐẠO, CẤP CỨU TỔNG HỢP (BÁC SĨ), CẤP CỨU TỔNG HỢP (ĐIỀU DƯỠNG), NỘI – NHI, SẢN, DƯỢC, CẬN LÂM SÀNG, X QUANG, TÀI XẾ, VIỆN PHÍ, ĐIỆN NƯỚC**.
  - Đọc chính xác Bảng 2 (Nhân sự phân công cố định tuần của 21+ Khoa/Phòng) vào trường `fixedStaff` và ghi chú khoa.
  - Tách bạch bảng danh bạ điện thoại (`contacts`) và dòng ghi chú điều động công tác tuần (`emergencyGeneralNote`).
- **`src/components/admin/EmergencyTemplateDownload.tsx`**:
  - Cập nhật bảng preview hiển thị thêm cột **"Nhân sự phân công tuần"** để người quản trị xem trước trọn vẹn danh sách các bác sĩ, điều dưỡng trước khi bấm "Điền vào bảng bên dưới".
- **Database / Schema**:
  - Không thay đổi cấu trúc database (tận dụng trọn vẹn collection `schedules` và các trường `weeklyDeptSlots`, `fixedStaff`, `emergencyGeneralNote`, `emergencyContacts`).

---

- **Thời gian thực hiện:** 00:28 (Asia/Saigon)

### 1. Yêu cầu:
- Tăng kích thước chữ trên menu chính để rõ nét, dễ nhìn hơn.
- Đưa toàn bộ cấu hình hiển thị menu vào Admin CMS (`/admin/globals/site-settings`) để quản trị viên có thể tùy chỉnh mọi lúc mà không cần sửa code:
  - Cỡ chữ menu chính (`fontSize`), độ đậm chữ (`fontWeight`), kiểu viết hoa/thường (`textTransform`), font chữ (`fontFamily`), khoảng cách ký tự (`letterSpacing`).
  - Chiều cao thanh menu (`height`), vị trí dàn hàng (`justifyContent`: Dàn đều, Căn giữa, Căn trái, Căn phải, Dàn đều có đệm), khoảng cách giữa các mục menu (`itemSpacing`), bo tròn góc thanh menu (`borderRadius`), bo tròn nền khi hover (`itemBorderRadius`).
  - Toàn bộ màu sắc thanh menu: màu nền (`background`), màu gradient kết thúc (`gradientEnd`), màu chữ (`textColor`), màu chữ hover (`hoverTextColor`), màu nền hover (`hoverBackground`), màu đường gạch chân hiệu ứng (`activeIndicatorColor`).
  - Tùy chỉnh Menu thả xuống (Dropdown): chiều rộng hộp menu (`dropdownWidth`), cỡ chữ menu con (`dropdownFontSize`), bo tròn góc (`dropdownBorderRadius`), màu nền (`dropdownBackground`), màu chữ (`dropdownTextColor`), màu viền (`dropdownBorderColor`), màu nền hover (`dropdownHoverBackground`), màu chữ hover (`dropdownHoverTextColor`), màu mũi tên (`dropdownArrowColor`).
  - Kiểu hiệu ứng chuyển động animation khi mở menu thả xuống: Trượt nhẹ từ trên xuống (Slide Down), Phóng to nhẹ (Zoom In), Mờ dần vào (Fade In), Lật 3D (Flip In) kèm tốc độ tùy chọn (`0.15s`, `0.22s`, `0.35s`).

### 2. Chi tiết xử lý:
- **`src/globals/SiteSettings.ts`**:
  - Bổ sung nhóm cấu hình `headerMenuAppearance` (🎨 Tùy chỉnh Menu chính & Menu thả xuống) với 4 nhóm con dạng collapsible có giao diện trực quan, hỗ trợ chọn màu ColorPicker, bộ font chữ chuẩn tiếng Việt và rút gọn `enumName` / `dbName` phù hợp giới hạn Postgres.
- **`src/components/SiteHeader.tsx`**:
  - Đọc cấu hình `headerMenuAppearance` từ CMS và tính toán truyền vào biến CSS style (`--menu-font-size`, `--menu-font-weight`, `--menu-text-transform`, `--menu-letter-spacing`, `--menu-font-family`, `--menu-height`, `--menu-justify`, `--menu-item-spacing`, `--menu-border-radius`, `--menu-item-radius`, `--menu-background`, `--menu-text-color`, `--menu-hover-text`, `--menu-hover-bg`, `--menu-active-indicator`, các biến dropdown và class animation).
- **`src/components/SiteHeader.module.css` & `src/app/globals.css`**:
  - Cập nhật toàn bộ các bộ chọn CSS của `mainHeader`, `headerInner`, `mainMenu`, `navSimpleLink`, `navMainLink`, `navChevron`, `navDropdown` nhận các biến CSS từ CMS.
  - Tăng cỡ chữ menu mặc định từ 11-12px lên 14px to rõ, hiện đại.
  - Xây dựng 4 bộ hiệu ứng animation keyframes / transitions cho menu thả xuống.
- **Database / Schema Migration (`scripts/migrate_menu_appearance.js`)**:
  - Đã thêm 27 cột mới vào bảng `site_settings` và `_site_settings_v`.
  - Cập nhật giá trị mặc định cho bản ghi `id = 1` của `site_settings`.
- **Biên dịch & Server**:
  - `npm run build` thành công 100%.
  - Server production chạy ổn định tại cổng 3000 (mã 200 OK).

---


- **Thời gian thực hiện:** 00:15 (Asia/Saigon)

### 1. Yêu cầu:
- Rà soát hai trang **Giới thiệu chung** (`/gioi-thieu`) và **Lịch sử phát triển** (`/gioi-thieu/lich-su-phat-trien`) do trước đây có nội dung trùng lặp (đều nêu các giá trị cốt lõi, triết lý chung).
- Tái thiết kế lại nội dung và cấu trúc để hai trang bổ trợ cho nhau mà không bị trùng lặp:
  - **Trang Giới thiệu chung (`/gioi-thieu`)**: Tập trung 100% vào **Hiện tại & Năng lực vận hành thực tế**:
    1. Tổng quan vị thế bệnh viện công lập đa khoa Hạng II cửa ngõ Tây Cần Thơ, quy mô 200+ giường bệnh, 100+ cán bộ y tế.
    2. **Chức năng & Nhiệm vụ trọng tâm** (thay thế khối Giá trị cốt lõi bị trùng): Cấp cứu & Khám chữa bệnh đa khoa; Phát triển kỹ thuật & Phẫu thuật ngoại khoa; Y tế dự phòng & Hỗ trợ chỉ đạo tuyến; Chuyển đổi số & Bệnh án điện tử.
    3. Năng lực cơ sở vật chất & Trang thiết bị y tế hiện đại (X-quang KTS, Siêu âm màu 4D, Xét nghiệm tự động, Phòng mổ áp lực dương).
    4. Cam kết chất lượng phục vụ nhân dân của Ban Giám đốc.
    5. **Khối điều hướng chuyên sâu (Related Topics)**: 4 thẻ liên kết trực quan dẫn lối người xem khám phá các trang chuyên đề: Lịch sử phát triển, Sơ đồ tổ chức, Khoa – Phòng, Đội ngũ Bác sĩ.
  - **Trang Lịch sử phát triển (`/gioi-thieu/lich-su-phat-trien`)**: Giữ trọn vẹn vai trò chuyên sâu về **Quá khứ, Cột mốc & Kim chỉ nam hành động**:
    1. Dòng thời gian 6 mốc son tiêu biểu (2009-2010 -> 2026 -> Tương lai).
    2. Sơ đồ 4 giai đoạn hành trình tiếp nối (BVĐK huyện -> TTYT huyện -> TTYT khu vực -> BVĐK khu vực).
    3. Bộ 4 Giá trị cốt lõi chính thức: TẬN TÂM – CHUYÊN NGHIỆP – Y ĐỨC – ĐOÀN KẾT, kèm Sứ mệnh & Tầm nhìn.
    4. Thành quả đạt được và Hộp liên kết CTA.

### 2. Chi tiết xử lý:
- **`src/globals/AboutPage.ts`**:
  - Đổi nhãn và cấu hình `corePrinciples` từ "Giá trị cốt lõi" thành "Chức năng & Nhiệm vụ trọng tâm (Tách bạch với Lịch sử phát triển)".
  - Cập nhật các trường mặc định chuẩn hóa theo 4 nhiệm vụ cốt lõi của Bệnh viện Đa khoa Khu vực.
- **`src/app/(frontend)/gioi-thieu/page.tsx`**:
  - Đổi tiêu đề và nhãn kicker sang "CHỨC NĂNG & NHIỆM VỤ".
  - Thêm phần hiển thị danh thiếp chuyên đề liên kết (`aboutRelatedSection`), hiển thị các thẻ điều hướng sang `/gioi-thieu/lich-su-phat-trien`, `/so-do-to-chuc`, `/khoa-phong`, `/bac-si`.
- **`src/app/(frontend)/gioi-thieu/gioi-thieu.css`**:
  - Bổ sung định kiểu CSS cho `.aboutRelatedSection`, `.aboutRelatedGrid`, `.aboutRelatedCard`, `.aboutRelatedBadge`, `.aboutRelatedTitle`, `.aboutRelatedArrow`, `.aboutRelatedDesc` đồng bộ phong cách y tế hiện đại.
- **Database (`about_page` & `about_page_core_principles_items`)**:
  - Đã cập nhật tiêu đề, mô tả và 4 bản ghi nhiệm vụ mới trong database để loại bỏ hoàn toàn các giá trị trùng lặp cũ đã lưu trong DB.
- **Biên dịch & Server**:
  - `npm run build` thành công 100% không có lỗi.
  - Đã khởi động lại server production trên cổng 3000, kiểm tra cả 2 trang trả về mã 200 OK.

---


- **Thời gian thực hiện:** 23:55 (Asia/Saigon)

### 1. Yêu cầu:
- Đưa 100% nội dung, hình ảnh, icon, dữ liệu của trang Lịch sử phát triển vào trang quản trị Payload Admin CMS (`/admin/globals/hospital-history`).
- Cho phép quản trị viên:
  - Tự do điều chỉnh kích thước các ô nội dung (`cardPadding`, chiều cao banner `heroMinHeight`, cỡ chữ dẫn nhập `leadFontSize`).
  - Căn chỉnh lề chữ linh hoạt (Căn trái, Căn giữa, Căn phải, Căn đều 2 bên `justify`).
  - Tùy biến màu sắc toàn diện (Màu chủ đạo `primaryColor`, Màu điểm nhấn `accentColor`, Màu tiêu đề `headingColor`, Màu chữ `textColor`, Màu nền các thẻ ô `cardBgColor`).
  - Chọn font chữ cho trang (`inherit`, `Arial`, `Segoe UI/Roboto`, `Montserrat`, `Roboto`, `Be Vietnam Pro`).
  - Chủ động bật/tắt (Ẩn/Hiện) từng khối nội dung riêng biệt: Banner đầu trang (`showHero`), Chỉ số nhanh (`showQuickStats`), Khối dẫn nhập (`showLead`), Dòng thời gian (`showTimeline`), Sứ mệnh & Giá trị (`showCoreValues`), Hành trình tiếp nối (`showJourney`), Thành quả đạt được (`showAchievements`), Bài viết chi tiết (`showContent`), Hộp hành động cuối trang (`showCta`).
  - Tùy chỉnh icon biểu tượng cho các giá trị cốt lõi: chọn icon có sẵn (Trái tim, Ngôi sao, Cây gậy y học, Bắt tay, Khiên an toàn, Bóng đèn sáng tạo) hoặc tự tải ảnh/icon riêng (`upload` media).

### 2. Chi tiết xử lý:
- **`src/globals/HospitalHistory.ts`** [NÂNG CẤP TOÀN DIỆN CẤU HÌNH CMS TỔ CHỨC 9 TABS]:
  - **Tab 1: 🖼️ Đầu trang & Chỉ số nhanh**: Toggles `showHero`, `showQuickStats`, chiều cao `heroMinHeight`, căn lề `heroAlign`, tải ảnh bìa `bannerImage`, `eyebrow`, `pageTitle`, `subtitle`, danh sách các thẻ `quickStats` (số liệu + nhãn).
  - **Tab 2: 📝 Dẫn nhập tổng quan**: Toggle `showLead`, căn lề `leadAlign` (trái/đều/giữa), cỡ chữ `leadFontSize`, nội dung `leadSummary`.
  - **Tab 3: ⏳ Dòng thời gian (Timeline)**: Toggle `showTimeline`, `timelineKicker`, `timelineTitle`, `timelineDesc`, danh sách `milestones` với căn lề riêng cho từng thẻ `textAlign`, tải ảnh tư liệu `image`, đánh dấu nổi bật `highlight`.
  - **Tab 4: 🎯 Sứ mệnh, Tầm nhìn & Giá trị**: Toggle `showCoreValues`, `coreValuesKicker`, `coreValuesTitle`, `coreValuesDesc`, `missionTitle`, `visionTitle`, danh sách `valuesList` kèm chọn `iconType` hoặc `customIcon`.
  - **Tab 5: 🔄 Hành trình tiếp nối**: Toggle `showJourney`, `journeyKicker`, `journeyTitle`, `journeyDesc`, danh sách các bước chuyển tiếp `journeySteps` (`stepNumber`, `title`, `isHighlight`), văn bản kết luận `journeyBottomText`.
  - **Tab 6: 🏆 Thành quả đạt được**: Toggle `showAchievements`, `achievementsKicker`, `achievementsTitle`, `achievementsDesc`, danh sách `achievements` (tiêu đề, mô tả, ảnh minh họa/bằng khen/cúp).
  - **Tab 7: 📖 Bài viết bổ sung (RichText)**: Toggle `showContent`, `content` RichText.
  - **Tab 8: 📞 Hộp hành động cuối trang (CTA)**: Toggle `showCta`, `ctaTitle`, `ctaDesc`, chữ & link nút chính `ctaBtnPrimaryText`/`ctaBtnPrimaryUrl`, chữ & link nút phụ `ctaBtnSecondaryText`/`ctaBtnSecondaryUrl`.
  - **Tab 9: 🎨 Màu sắc, Font chữ & Căn lề**: Bộ chọn mã màu ColorPicker trực quan cho 5 nhóm màu, font chữ và khoảng đệm các ô `cardPadding`.
- **`src/app/(frontend)/gioi-thieu/lich-su-phat-trien/page.tsx`** [ĐỒNG BỘ HIỂN THỊ DYNAMIC]:
  - Kết nối đầy đủ các trường cấu hình từ CMS: tự động áp dụng biến CSS `--hist-primary`, `--hist-accent`, `--hist-heading`, `--hist-text`, `--hist-card-bg`, `--hist-card-padding`, font chữ, căn lề và các công tắc ẩn/hiện.
  - Hỗ trợ render icon linh hoạt: icon vector/ký tự có sẵn hoặc ảnh upload riêng của từng giá trị cốt lõi.
- **`src/app/(frontend)/gioi-thieu/lich-su-phat-trien/history.css`** [CẬP NHẬT CSS VARIABLES]:
  - Tích hợp các biến CSS vào `.timelineCard`, `.coreValueCard`, `.achievementCard`, `.journeyStepCard`, `.historyCtaBox`.
- **Database / Schema Updates**:
  - Đã chạy migration bổ sung đầy đủ các cột mới vào bảng `hospital_history`, `_hospital_history_v`, `hospital_history_milestones`, `hospital_history_core_values_values_list`.
  - Tạo bảng con `hospital_history_quick_stats`, `_hospital_history_v_version_quick_stats`, `hospital_history_journey_steps`, `_hospital_history_v_version_journey_steps`.
- **`CHANGELOG.md`** [CẬP NHẬT].

---


- **Thời gian thực hiện:** 23:44 (Asia/Saigon)

### 1. Yêu cầu:
- Cập nhật toàn diện nội dung trang Lịch sử phát triển (`/gioi-thieu/lich-su-phat-trien`) và cấu hình Admin CMS (`hospital-history`) theo đúng tư liệu chính xác được cung cấp:
  - Dẫn nhập & Quá trình hình thành gắn liền với huyện Thới Lai và kiện toàn y tế Cần Thơ.
  - **Dòng thời gian (Timeline) 6 mốc son tiêu biểu:**
    1. `2009–2010 — HÌNH THÀNH`: Bệnh viện Đa khoa huyện Thới Lai (đăng ký từ 2009, thành lập năm 2010).
    2. `2011 — PHÁT TRIỂN CƠ SỞ VẬT CHẤT`: Đưa cơ sở Bệnh viện Đa khoa huyện Thới Lai vào sử dụng (giai đoạn 1, quy mô 100 giường bệnh, kinh phí trên 100 tỷ đồng).
    3. `2017 — KIỆN TOÀN HỆ THỐNG Y TẾ`: Thành lập Trung tâm Y tế huyện Thới Lai (01/03/2017, sáp nhập BVĐK và TTYT dự phòng).
    4. `2025 — CHUYỂN SANG MÔ HÌNH Y TẾ KHU VỰC`: Trung tâm Y tế khu vực Thới Lai (01/07/2025 sáp nhập Thới Lai và Cờ Đỏ; tháng 09/2025 triển khai bệnh án điện tử, lưu trữ truyền tải hình ảnh không in phim).
    5. `2026 — DẤU MỐC MỚI`: Thành lập BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI (từ 31/08/2026).
    6. `HIỆN NAY & TƯƠNG LAI — PHÁT TRIỂN BỀN VỮNG`: Hướng đến bệnh viện đa khoa khu vực hiện đại, chất lượng.
  - **Kim chỉ nam hành động:**
    - Sứ mệnh: "Cung cấp dịch vụ khám bệnh, chữa bệnh an toàn, chất lượng và tận tâm; góp phần bảo vệ, chăm sóc và nâng cao sức khỏe Nhân dân."
    - Tầm nhìn: "Xây dựng Bệnh viện Đa khoa khu vực Thới Lai từng bước hiện đại, chuyên nghiệp, thân thiện; phát triển chuyên môn kỹ thuật phù hợp với nhu cầu chăm sóc sức khỏe của người dân trong khu vực."
    - Giá trị cốt lõi: Tận tâm, Chuyên nghiệp, Y đức, Đoàn kết.
  - **Hành trình tiếp nối:** Thiết kế sơ đồ 4 giai đoạn chuyển tiếp kèm thông điệp khẳng định sự kế thừa và vươn tầm phát triển.

### 2. Chi tiết xử lý:
- **`src/app/(frontend)/gioi-thieu/lich-su-phat-trien/page.tsx`** [CẬP NHẬT NỘI DUNG & THÊM KHỐI SƠ ĐỒ]:
  - Đưa toàn bộ nội dung chuẩn xác vào fallback dữ liệu để hiển thị ngay lập tức.
  - Thêm khối **"HÀNH TRÌNH TIẾP NỐI"** với chuỗi 4 thẻ liên hoàn: `BVĐK huyện Thới Lai` → `TTYT huyện Thới Lai` → `TTYT khu vực Thới Lai` → `BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI`.
- **`src/app/(frontend)/gioi-thieu/lich-su-phat-trien/history.css`** [BỔ SUNG CSS]:
  - Thêm định kiểu cho `.historyJourneySection`, `.journeyStepsFlow`, `.journeyStepCard`, `.journeyArrow` và responsive dạng dọc trên thiết bị di động.
- **`src/globals/HospitalHistory.ts`** [ĐỒNG BỘ DỮ LIỆU ADMIN CMS]:
  - Cập nhật `defaultValue` của `leadSummary`, `milestones`, `coreValues` (missionTitle, visionTitle, valuesList) để trang Quản trị Admin CMS có sẵn dữ liệu chuẩn khi khởi tạo/lưu.
- **Database / Schema Updates**:
  - Không thay đổi cấu trúc bảng mới (tái sử dụng schema chuẩn hiện có của Global `hospital-history`).
- **`CHANGELOG.md`** [CẬP NHẬT].

---


- **Thời gian thực hiện:** 23:42 (Asia/Saigon)

### 1. Yêu cầu:
- Cho phép người quản trị trong Admin CMS có thể tự do điều chỉnh tiêu đề nút đặt lịch, gắn đường link tùy ý (link nội bộ `/dat-lich-kham` hoặc link ngoài kèm tùy chọn mở tab mới).
- Cho phép chỉnh sửa hoặc ẩn/hiện ô thông tin ghi chú màu xanh bên dưới nút đặt lịch theo từng bác sĩ.

### 2. Chi tiết xử lý:
- **`src/collections/Doctors.ts`** [THÊM TRƯỜNG TÙY BIẾN ĐẶT LỊCH]:
  - Thêm tab: **`📅 Tùy chỉnh Nút Đặt Lịch & Hộp Thông Tin`**.
  - `bookingBtnText`: Tiêu đề nút đặt lịch (mặc định: `Đặt lịch khám`).
  - `bookingBtnUrl`: Đường dẫn liên kết tùy ý (mặc định: `/dat-lich-kham`).
  - `bookingBtnOpenNewTab`: Tùy chọn mở tab mới (`target="_blank"`).
  - `bookingNoticeText`: Nội dung ô thông tin bên dưới (mặc định: `Đăng ký hẹn khám trực tuyến tiếp đón ưu tiên tại viện.`, xóa trống sẽ tự động ẩn).
- **`src/app/(frontend)/bac-si/[slug]/page.tsx`** [CẬP NHẬT RENDER]:
  - Đọc và áp dụng linh hoạt các trường tùy biến, hỗ trợ mở tab mới và tự động ẩn ô thông tin khi để trống.
- **Database / Schema Updates**:
  - Đã chạy migration bổ sung 4 cột mới vào bảng `doctors` và `_doctors_v`: `booking_btn_text`, `booking_btn_url`, `booking_btn_open_new_tab`, `booking_notice_text`.
- **`CHANGELOG.md`** [CẬP NHẬT].

---

## [2026-09-12] - Loại bỏ toàn bộ tên đơn vị khác & Thiết lập Quy tắc Cốt lõi cấm chèn tên ngoài

- **Thời gian thực hiện:** 23:35 (Asia/Saigon)

### 1. Yêu cầu:
- Rà soát và loại bỏ toàn bộ tên các đơn vị, bệnh viện khác (như Bạch Mai...) trong toàn bộ hệ thống (Admin CMS, nhãn Tab, mô tả trường, giao diện và comment code).
- Thiết lập quy tắc cốt lõi bắt buộc: Từ nay về sau tuyệt đối không bao giờ được điền hoặc đưa tên đơn vị khác vào dự án của Bệnh viện Đa khoa Khu vực Thới Lai.

### 2. Chi tiết xử lý:
- **`AGENTS.md`** [THIẾT LẬP QUY TẮC CỐT LÕI SỐ 4]:
  - Bổ sung Mandate bắt buộc: Tuyệt đối không đưa tên bất kỳ bệnh viện hay đơn vị nào khác vào website hay Admin CMS.
- **`src/collections/Doctors.ts`** [LOẠI BỎ TÊN NGOÀI]:
  - Sửa nhãn Tab 2: `🎓 Quá trình Đào tạo - Công tác`.
  - Sửa nhãn Tab 3: `⭐ Thế mạnh & Kinh nghiệm chuyên môn`.
  - Xoá các tham chiếu tên ngoài trong mô tả ảnh 3:4.
- **`src/app/(frontend)/bac-si/[slug]/doctor-detail.css`**, **`src/app/(frontend)/bac-si/[slug]/page.tsx`**, **`src/app/(frontend)/bac-si/bac-si.css`**, **`src/app/(frontend)/bac-si/page.tsx`**, **`src/components/ArticleDetailTemplate.module.css`**, **`src/app/(frontend)/thong-bao/[slug]/detail.module.css`**, **`src/app/(frontend)/noi-dung/[sectionSlug]/[slug]/page.tsx`**:
  - Dọn dẹp sạch toàn bộ các comment và tên biến liên quan.
- **`CHANGELOG.md`** [CẬP NHẬT].

---

## [2026-09-12] - Đưa toàn bộ các mục thông tin Bác sĩ vào Admin CMS

- **Thời gian thực hiện:** 23:30 (Asia/Saigon)

### 1. Yêu cầu:
- Đưa đầy đủ tất cả các trường thông tin chuẩn Bạch Mai vào giao diện quản trị Admin CMS (`/admin/collections/doctors`) để quản trị viên có thể tự do nhập liệu, điều chỉnh và tuỳ biến chi tiết từng bác sĩ.
- Tổ chức các mục nhập liệu khoa học theo từng Tab rõ ràng, có hướng dẫn chi tiết cho từng phần.

### 2. Chi tiết xử lý:
- **`src/collections/Doctors.ts`** [TỔ CHỨC TAB ADMIN CMS]:
  - **Tab 1: 👤 Thông tin cơ bản & Chức danh**: Họ và tên, Học vị/Học hàm, Chức vụ/Vị trí công tác, Chức danh nghề nghiệp, Khoa/Phòng công tác, Chuyên khoa chuyên môn sâu, Số CCHN, Ảnh chân dung tỷ lệ 3:4.
  - **Tab 2: 🎓 Quá trình Đào tạo - Công tác (Cột 1 Bạch Mai)**: Quá trình đào tạo (RichText hỗ trợ định dạng, danh sách mốc năm), Quá trình công tác (các đơn vị từng công tác, chức vụ theo mốc thời gian).
  - **Tab 3: ⭐ Thế mạnh & Kinh nghiệm (Cột 2 Bạch Mai)**: Lĩnh vực chuyên môn & Thế mạnh mũi nhọn, Thành tích, đề tài & Công trình nghiên cứu y học.
  - **Tab 4: 📝 Giới thiệu chung & Thông tin bổ sung**: Tiểu sử tổng quan / bài viết giới thiệu thầy thuốc.
- **`CHANGELOG.md`** [CẬP NHẬT].

---

## [2026-09-12] - Nâng cấp Giao diện Trang Chi Tiết Bác Sĩ Chuẩn Cổng Thông Tin Bệnh Viện Bạch Mai

- **Thời gian thực hiện:** 23:20 (Asia/Saigon)

### 1. Yêu cầu:
- Thiết kế lại trang chi tiết bác sĩ (`/bac-si/[slug]`) mô phỏng chính xác cấu trúc hiện đại, khoa học của Cổng thông tin điện tử Bệnh viện Bạch Mai (`https://bachmai.gov.vn/doi-ngu-bac-si/...`).
- Đảm bảo tuân thủ 100% hai nguyên tắc cốt lõi của dự án:
  1. Bảo toàn tỷ lệ ảnh chân dung bác sĩ (chuẩn 3:4 hoặc 1:1.25), tự động phủ khít khung hình, bo góc thanh lịch, tuyệt đối không méo/biến dạng ảnh.
  2. Khối danh sách bác sĩ cùng đơn vị/chuyên khoa tuân thủ trật tự ưu tiên Ban Giám đốc (Giám đốc -> Phó Giám đốc -> Trưởng/Phó khoa phòng).

### 2. Chi tiết xử lý:
- **`src/app/(frontend)/bac-si/[slug]/doctor-detail.css`** [MỚI]:
  - Dải Header Banner gradient y tế cao cấp kèm Breadcrumb phân tầng: `Trang chủ` / `Đội ngũ bác sĩ` / `Tên bác sĩ`.
  - Cột bên trái: Khung ảnh bác sĩ tỉ lệ đứng 3:4 với viền bo góc hiện đại, nút **"Đặt lịch khám"** nổi bật dẫn tới form `/dat-lich-kham` và thông báo hỗ trợ tiếp đón ưu tiên tại viện.
  - Cột bên phải: Tên bác sĩ khổ lớn, chức vụ, huy hiệu Học vị/Học hàm (🎓), Đơn vị công tác (🏥), Chuyên khoa, Số chứng chỉ hành nghề.
  - Khối 2 cột thông tin chuyên môn sâu: **"Quá trình đào tạo - Công tác"** và **"Thế mạnh, kinh nghiệm công tác"** với bố cục thẻ sang trọng, hỗ trợ RichText hoặc fallback thông tin công tác trang trọng.
  - Khối **"Bác sĩ cùng đơn vị công tác"**: Grid danh sách bác sĩ liên quan chuẩn style Bạch Mai.
- **`src/app/(frontend)/bac-si/[slug]/page.tsx`** [CẬP NHẬT]:
  - Viết lại toàn bộ cấu trúc Server Component, bổ sung Metadata SEO chuẩn từng bác sĩ.
  - Tích hợp truy vấn bác sĩ liên quan cùng khoa, áp dụng thuật toán phân cấp ưu tiên Ban Giám đốc.

### 3. Files Modified:
- `src/app/(frontend)/bac-si/[slug]/doctor-detail.css` [CREATED]
- `src/app/(frontend)/bac-si/[slug]/page.tsx` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Cấp quyền Xoá dòng dữ liệu Đặt lịch khám trong Admin CMS

- **Thời gian thực hiện:** 23:10 (Asia/Saigon)

### 1. Yêu cầu:
- Phần Quản lý lịch đặt khám trong trang quản trị Payload Admin (`/admin/collections/appointments`) trước đó không cho phép xoá các dòng dữ liệu đặt khám (bị ẩn nút xoá hoặc báo không có quyền khi xoá đơn lẻ hay xoá hàng loạt).
- Cho phép người quản trị/nhân viên được phân quyền có thể chủ động xoá các phiếu đặt khám thử nghiệm, phiếu trùng lặp, spam hoặc bị huỷ.

### 2. Chi tiết xử lý:
- **`src/collections/Appointments.ts`** [CẬP NHẬT QUYỀN TRUY CẬP / ACCESS CONTROL]:
  - Chuyển `delete` và `update`, `read` sang cơ chế `loggedIn` (xác thực người dùng đang đăng nhập hợp lệ trong Admin CMS).
  - Khắc phục triệt để tình trạng phân quyền module `schedules` bị hạn chế theo role khiến tài khoản quản trị viên không hiển thị nút xoá dòng dữ liệu lịch khám hoặc không thực hiện được thao tác bulk delete.

### 3. Files Modified:
- `src/collections/Appointments.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Cập nhật Định dạng Mã lịch khám BVTL0001–BVTL9999 (Reset hàng ngày) & In phiếu khám bằng Ảnh tải về

- **Thời gian thực hiện:** 23:02 (Asia/Saigon)

### 1. Yêu cầu:
- Phần in phiếu khám: Khắc phục triệt để lỗi in đè cả trang web (Header, Banner, Form...), khi bấm nút in hoặc xem ảnh chỉ hiển thị duy nhất **Phiếu khám bệnh thành công** và popup cho phép người dùng bấm **Tải ảnh về máy**.
- Bổ sung quy tắc `@media print` cô lập hoàn toàn thẻ phiếu khám, ẩn toàn bộ các thanh menu, footer, header và giao diện thừa khi người dùng sử dụng phím tắt Ctrl+P hoặc tính năng in trình duyệt.
- Định dạng mã lịch khám: Cập nhật thành **`BVTL` + 4 số thứ tự từ `0001` đến `9999`** (ví dụ: `BVTL0001`, `BVTL0002`...). Người đặt đầu tiên trong ngày sẽ là `BVTL0001`, người kế tiếp sẽ tăng dần và sang ngày mới tự động reset lại từ `BVTL0001`.

### 2. Chi tiết xử lý:
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT MÃ LỊCH KHÁM BVTL]:
  - Tiền tố mã chính thức: `BVTL` đi kèm 4 chữ số thứ tự (ví dụ: `BVTL0001`, `BVTL0002`...).
  - Quét kiểm tra số thứ tự lớn nhất trong ngày theo giờ Việt Nam (UTC+7) và tự động tăng dần. Sang ngày mới reset về `BVTL0001`.
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT IN & TẢI ẢNH PHIẾU KHÁM]:
  - Sử dụng hàm vẽ hình chữ nhật bo góc tương thích mọi trình duyệt (`drawRoundRect`) để vẽ thẻ ảnh phiếu khám độ phân giải cao bằng HTML5 Canvas mà không bao giờ bị lỗi trình duyệt.
  - Ngăn chặn hoàn toàn việc gọi `window.print()` mở hộp thoại in cả trang web.
  - Bật modal popup xem trước ảnh phiếu khám kèm nút **"📥 Bấm Tải ảnh về máy"** (`phieu-kham-BVTLxxxx.png`).
- **`src/components/AppointmentBookingForm.module.css`** [CẬP NHẬT @media print]:
  - Thêm quy tắc in `@media print`: Ẩn toàn bộ `:global(header)`, `:global(footer)`, `:global(nav)`, `:global(.header)`, `:global(.footer)`, `.guidanceBox`, `.actionButtons`...
  - Chỉ in đúng thẻ phiếu hẹn `.ticketCard` hoặc ảnh `.ticketImgPreview`.

### 3. Files Modified:
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `src/components/AppointmentBookingForm.module.css` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Thêm Ghi nhận thời điểm bấm đặt lịch & Cơ chế Hạn chế Spam đa lớp

- **Thời gian thực hiện:** 22:36 (Asia/Saigon)

### 1. Yêu cầu:
- Ghi nhận chính xác thời điểm người dùng bấm nút đặt lịch (`submittedAt`) để theo dõi thời gian thao tác thực tế.
- Bổ sung tính năng hạn chế spam đặt lịch (chống click liên tục, giới hạn số lần gửi theo IP, chống đặt trùng lặp cùng số điện thoại trong cùng ngày/chuyên khoa).
- Cung cấp giao diện trong Admin CMS (`appointment-settings`) để người quản trị chủ động điều chỉnh ngưỡng chống spam.
- Hiển thị cột "Thời điểm bấm đặt lịch" trên báo cáo xuất file Excel của Bệnh viện.

### 2. Chi tiết xử lý & Cấu trúc Database:
- **`src/collections/Appointments.ts`** [CẬP NHẬT DATABASE SCHEMA]:
  - Bổ sung nhóm trường `🛡️ Nhật ký gửi phiếu & Bảo mật chống spam`:
    - `submittedAt` (`type: 'date'`, format `dd/MM/yyyy HH:mm:ss`, read-only trong Admin): Lưu thời điểm chính xác người dùng nhấn nút gửi phiếu.
    - `ipAddress` (`type: 'text'`, read-only trong Admin): Lưu địa chỉ IP của thiết bị gửi yêu cầu.
    - `userAgent` (`type: 'text'`, read-only trong Admin): Lưu thông tin trình duyệt / hệ điều hành của người gửi.
- **`src/globals/AppointmentSettings.ts`** [CẬP NHẬT CẤU HÌNH ADMIN]:
  - Bổ sung nhóm cấu hình `🛡️ Cấu hình Hạn chế Spam & Bảo vệ Đặt lịch`:
    - `maxSubmissionsPerIp` (Number, mặc định 5 lần / 15 phút): Giới hạn tối đa số phiếu đặt lịch từ 1 địa chỉ IP.
    - `minSecondsBetweenSubmissions` (Number, mặc định 60 giây): Khoảng thời gian tối thiểu giữa 2 lần đặt lịch của cùng số điện thoại (chống click đúp / spam liên tiếp).
    - `preventDuplicateBooking` (Checkbox, mặc định Bật): Tự động kiểm tra và chặn người dùng dùng cùng SĐT đặt trùng lịch vào cùng ngày & chuyên khoa nếu phiếu trước đó chưa bị hủy.
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT FRONTEND FORM]:
  - Gắn chính xác thời điểm client click nút đặt lịch `payload.submittedAt = new Date().toISOString()` vào dữ liệu gửi lên server.
  - Hiển thị thông báo hướng dẫn / cảnh báo lỗi thân thiện khi người dùng bị hệ thống chặn do gửi quá nhanh hoặc đặt trùng lặp.
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT XỬ LÝ BACKEND]:
  - Kiểm tra dung lượng body và xác thực Honeypot + Turnstile.
  - Áp dụng Rate-limit per IP với `rateLimit(req, 'appointment-create', maxSubmissions, 15 * 60_000)`. Trả về HTTP 429 kèm `Retry-After`.
  - Kiểm tra Cooldown theo số điện thoại qua `minSecondsBetweenSubmissions`. Trả về thông báo thời gian cần chờ cụ thể.
  - Kiểm tra Chống đặt trùng qua `preventDuplicateBooking` (cùng Phone + cùng ngày khám + cùng chuyên khoa/khoa phòng). Trả về HTTP 409 cùng mã phiếu đã tồn tại.
  - Lưu trữ an toàn `submittedAt`, `ipAddress`, `userAgent` vào bản ghi phiếu hẹn trong database.
- **`src/app/(frontend)/api/appointments-export/route.ts`** [CẬP NHẬT BÁO CÁO EXCEL]:
  - Thêm cột `Thời điểm bấm đặt lịch` vào vị trí cột thứ 3 trong bảng tính Excel xuất ra.
  - Mở rộng banner tiêu đề viện từ `A1:N1` sang `A1:O1` đồng bộ với 15 cột dữ liệu.

### 3. Files Modified:
- `src/collections/Appointments.ts` [UPDATED]
- `src/globals/AppointmentSettings.ts` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `src/app/(frontend)/api/appointments-export/route.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Đồng bộ thời gian thực Khung giờ chỉnh tay trong Admin & Cập nhật toàn diện các nội dung tùy biến

- **Thời gian thực hiện:** 22:29 (Asia/Saigon)

### 1. Yêu cầu:
- Khung giờ khám do người quản trị tự chỉnh tay trong Admin CMS (Ví dụ bạn đã sửa thành: *"Buổi sáng:07:00 – 10:00"* và *"Buổi chiều:13:00 – 16:00"*) phải được đồng bộ chính xác 100% khi người bệnh gửi phiếu hẹn, hiển thị trên thẻ thành công, lưu vào database và kết xuất Excel.
- Đảm bảo tất cả các nội dung tùy biến khác (Lời dặn dò trước khi khám, Số tổng đài hỗ trợ `02923689115`, Tiêu đề trang, màu sắc viền focus `#0295de`, v.v.) được phản ánh tức thì.

### 2. Chi tiết xử lý:
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT BACKEND API]:
  - Đọc trực tiếp cấu hình `appointment-settings` thời gian thực thông qua `payload.findGlobal('appointment-settings')`.
  - So khớp linh hoạt `rawTimeSlot` với danh sách khung giờ thực tế người quản trị đã lưu trong bảng `appointment_settings_time_slots` (kể cả khi value được đặt là `"Buổi sáng"`, `"Buổi chiều"`, hoặc mã tự do).
  - Ghi nhận chuẩn xác nhãn tiếng Việt hiển thị (ví dụ: *"Buổi sáng:07:00 – 10:00"*, *"Buổi chiều:13:00 – 16:00"*) vào trường `timeSlotLabel` và trả về trong phản hồi JSON của phiếu hẹn.
- **`src/app/(frontend)/dat-lich-kham/page.tsx` & `src/components/AppointmentBookingForm.tsx`**:
  - Tải tức thời các nội dung do người quản trị cấu hình: Lời dặn trước khi khám, Hotline `02923689115`, Khung giờ tùy chỉnh.
  - Sau khi đặt lịch thành công, phiếu hẹn hiển thị chính xác khung giờ bạn đã sửa tay kèm mã QR Code tương ứng.

### 3. Files Modified:
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Hiển thị Khung giờ tiếng Việt chuẩn và Thêm Mã QR Code chuyên nghiệp trên Phiếu hẹn

- **Thời gian thực hiện:** 22:26 (Asia/Saigon)

### 1. Yêu cầu:
- Khung giờ khám trên phiếu hẹn thành công hiển thị lại đầy đủ bằng tiếng Việt (Ví dụ: *"Buổi sáng: 07:00 – 10:00"* hoặc *"Buổi sáng (07:00 – 11:30)"* thay vì mã tiếng Anh *"morning"*).
- Thêm mã QR Code bên phải của thẻ Phiếu hẹn khám bệnh để tạo sự chuyên nghiệp, chuẩn hóa quy trình tiếp đón và quét mã nhanh tại quầy bệnh viện.

### 2. Chi tiết xử lý:
- **`src/collections/Appointments.ts`** [CẬP NHẬT DATABASE SCHEMA]:
  - Bổ sung trường `timeSlotLabel` (`type: 'text'`) để lưu trữ chính xác nhãn tiếng Việt của khung giờ khám mà người bệnh đã chọn.
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT API ROUTE]:
  - Nhận `timeSlotLabel` từ client hoặc tự động map sang tiếng Việt từ `DEFAULT_TIME_SLOT_LABELS`.
  - Lưu cả mã enum an toàn vào `timeSlot` và chuỗi tiếng Việt vào `timeSlotLabel`.
  - Trả về `timeSlotLabel` trong dữ liệu JSON thành công.
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT GIAO DIỆN & TICKET]:
  - Tích hợp thư viện tạo mã QR Code (`qrcode`) sinh mã SVG/DataURL độ nét cao mang mã phiếu hẹn duy nhất (`code`) với tông xanh y tế (`#0369a1`).
  - Gắn kèm `timeSlotLabel` tiếng Việt khi gửi biểu mẫu.
  - Hiển thị khối QR code trang trọng bên phải thẻ phiếu hẹn (`.ticketQrBox`) kèm dòng chữ *"QUÉT TẠI QUẦY"*.
- **`src/components/AppointmentBookingForm.module.css`** [CẬP NHẬT STYLES]:
  - Thêm bố cục Flex `.ticketFlex`, `.ticketInfoCol`, `.ticketQrBox`, `.ticketQrImg`, `.ticketQrText` và tự động responsive trên màn hình điện thoại di động.
- **`src/app/(frontend)/api/appointments-export/route.ts`** [CẬP NHẬT XUẤT EXCEL]:
  - Ưu tiên xuất trường `item.timeSlotLabel` giúp file Excel luôn hiển thị khung giờ tiếng Việt đầy đủ và đẹp mắt.

### 3. Files Modified:
- `src/collections/Appointments.ts` [UPDATED]
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `src/components/AppointmentBookingForm.module.css` [UPDATED]
- `src/app/(frontend)/api/appointments-export/route.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Sửa lỗi ràng buộc Khóa ngoại Chuyên khoa/Khoa phòng & Chặn ngày đặt khám nhỏ hơn ngày hiện tại

- **Thời gian thực hiện:** 22:20 (Asia/Saigon)

### 1. Yêu cầu & Nguyên nhân lỗi:
- **Lỗi truy vấn SQL (`Failed query: insert into "appointments"` với `specialty_id = 9`)**:
  - Khi hệ thống chưa tạo danh mục `specialties`, dropdown chuyên khoa tự động fallback lấy từ danh sách Khoa lâm sàng (`departments`, ví dụ: ID 9 = "Khoa Nội tổng hợp").
  - Khi gửi form, ID 9 được gán nhầm vào khóa ngoại `specialty_id` (trỏ sang bảng `specialties`) trong khi ID 9 lại thuộc bảng `departments`, dẫn đến lỗi vi phạm khóa ngoại PostgreSQL (`appointments_specialty_id_specialties_id_fk`).
- **Yêu cầu bổ sung ràng buộc ngày đặt khám**:
  - Ngày hẹn khám không được nhỏ hơn ngày hiện tại.
  - Hiển thị thông báo yêu cầu chọn lại ngày phù hợp cả ở giao diện Form và Backend API.

### 2. Chi tiết xử lý:
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT BACKEND API]:
  - Bổ sung kiểm tra thông minh ID chuyên khoa/khoa phòng: Tra cứu trước xem ID thuộc `specialties` hay `departments`. Nếu là Khoa phòng thì gán đúng vào `department_id`, nếu là Chuyên khoa thì gán vào `specialty_id`, đồng thời luôn lưu `specialty_title` để không bao giờ bị lỗi khóa ngoại.
  - Bổ sung xác thực `appointmentDate`: So sánh ngày hẹn với ngày hiện tại (theo múi giờ Việt Nam UTC+7). Nếu nhỏ hơn ngày hiện tại, trả về mã lỗi 400 cùng thông báo: *"Ngày đặt khám không được nhỏ hơn ngày hiện tại. Vui lòng chọn lại ngày hẹn khám phù hợp."*
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT FRONTEND FORM]:
  - Đặt thuộc tính `min={today}` trên ô nhập ngày hẹn (lấy ngày hiện tại theo giờ Việt Nam).
  - Thêm kiểm tra trước khi gửi form (`e.preventDefault`): Nếu người bệnh cố tình chọn ngày cũ hơn hôm nay, hiển thị thông báo lỗi trực tiếp trên giao diện và ngăn gửi dữ liệu.

### 3. Files Modified:
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Thêm điều chỉnh danh sách Chuyên khoa khám trong Admin CMS

- **Thời gian thực hiện:** 22:16 (Asia/Saigon)

### 1. Yêu cầu:
- Thêm tính năng điều chỉnh danh sách Chọn chuyên khoa khám tại Admin CMS (`appointment-settings`):
  - Người quản trị có thể chủ động chọn nguồn danh sách chuyên khoa:
    1. **Tự động (auto)**: Lấy toàn bộ Chuyên khoa đang hoạt động trong hệ thống (hoặc Khoa lâm sàng nếu chưa tạo danh mục).
    2. **Chọn lọc (selected)**: Chỉ định danh sách các Chuyên khoa cụ thể cho phép đặt lịch từ danh mục Chuyên khoa (`specialties`).
    3. **Tự cấu hình riêng (custom)**: Tự nhập danh sách chuyên khoa khám theo ý muốn (dành riêng cho form đặt lịch, không cần tạo danh mục Chuyên khoa phức tạp, có thể thêm/bớt/sắp xếp).
  - Hỗ trợ lưu trữ tên chuyên khoa đã chọn (`specialtyTitle`) trong bảng phiếu hẹn (`Appointments`) để bảo toàn chính xác tên hiển thị kể cả khi là chuyên khoa tự tạo.
  - Tự động hiển thị đúng tên chuyên khoa khi xem danh sách và khi xuất file Excel.

### 2. Chi tiết thay đổi:
- **`src/globals/AppointmentSettings.ts`** [CẬP NHẬT GLOBAL SETTINGS]:
  - Bổ sung nhóm Collapsible `🏥 Tùy chỉnh danh sách Chuyên khoa khám`.
  - Thêm trường `specialtySource` (`auto`, `selected`, `custom`).
  - Thêm trường `selectedSpecialties` (Relationship to `specialties`, `hasMany: true`, điều kiện hiển thị khi chọn 'selected').
  - Thêm mảng `customSpecialties` (`name`, `code`, điều kiện hiển thị khi chọn 'custom').
- **`src/collections/Appointments.ts`** [CẬP NHẬT SCHEMA]:
  - Thêm trường `specialtyTitle` (`type: 'text'`) để lưu trực tiếp tên chuyên khoa mà người bệnh chọn trên form.
  - Cập nhật `defaultColumns` admin hiển thị `specialtyTitle`.
- **`src/app/(frontend)/dat-lich-kham/page.tsx`** [CẬP NHẬT ROUTE]:
  - Đọc `specialtySource`: xử lý dữ liệu động theo 3 chế độ (`custom`, `selected`, `auto`).
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT FORM]:
  - Gửi kèm `specialtyTitle` tương ứng với lựa chọn của người bệnh khi gửi form.
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT API]:
  - Lưu cả `specialty` (ID số nếu có) và `specialtyTitle` (chuỗi văn bản tên chuyên khoa).
- **`src/app/(frontend)/api/appointments-export/route.ts`** [CẬP NHẬT EXPORT]:
  - Ưu tiên hiển thị `item.specialtyTitle` khi kết xuất cột Chuyên khoa ra file Excel.

### 3. Files Modified:
- `src/globals/AppointmentSettings.ts` [UPDATED]
- `src/collections/Appointments.ts` [UPDATED]
- `src/app/(frontend)/dat-lich-kham/page.tsx` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `src/app/(frontend)/api/appointments-export/route.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Tùy chỉnh danh sách Khung giờ khám & Thay đổi Nhãn/Placeholder các trường có sẵn

- **Thời gian thực hiện:** 22:08 (Asia/Saigon)

### 1. Yêu cầu:
- Cho phép người quản trị điều chỉnh trực tiếp các trường đã có sẵn trong Admin CMS:
  - Khung giờ khám: Cho phép thêm, sửa, xóa danh sách khung giờ tùy ý (sửa lại giờ bắt đầu - kết thúc, thêm ca tối, phân chia khung giờ 30 phút, đặt khung giờ mặc định).
  - Nhãn (Label) & Gợi ý (Placeholder) của tất cả các trường mặc định: Cho phép đổi tên nhãn trường Họ tên, Số điện thoại, Email, Địa chỉ, Ngày sinh, Giới tính, Chuyên khoa, Bác sĩ, Ngày khám, Thông tin bổ sung, Khung giờ khám, Mã thẻ BHYT.
  - Tự động map tên khung giờ khám động khi xuất file Excel.

### 2. Chi tiết thay đổi:
- **`src/globals/AppointmentSettings.ts`** [CẬP NHẬT SCHEMA]:
  - Bổ sung nhóm `⏰ Tùy chỉnh danh sách Khung giờ khám`: mảng `timeSlots` (`label`, `value`, `isDefault`).
  - Bổ sung nhóm `✏️ Tùy chỉnh Nhãn & Gợi ý (Placeholder) của các trường có sẵn`: `nameFieldLabel`, `nameFieldPlaceholder`, `phoneFieldLabel`, `phoneFieldPlaceholder`, `emailFieldLabel`, `emailFieldPlaceholder`, `addressFieldLabel`, `addressFieldPlaceholder`, `dobFieldLabel`, `genderFieldLabel`, `specialtyFieldLabel`, `specialtyFieldPlaceholder`, `doctorFieldLabel`, `appointmentDateFieldLabel`, `symptomsFieldLabel`, `symptomsFieldPlaceholder`, `timeSlotFieldLabel`, `insuranceFieldLabel`.
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT FRONTEND]:
  - Render danh sách khung giờ khám động theo mảng `timeSlots` cấu hình trong Admin.
  - Áp dụng các nhãn và placeholder tùy chỉnh cho tất cả các trường mặc định.
- **`src/app/(frontend)/api/appointments-export/route.ts`** [CẬP NHẬT EXPORT]:
  - Tự động lấy danh sách `timeSlots` từ `appointment-settings` để xuất nhãn khung giờ chính xác vào file Excel.

### 3. Files Modified:
- `src/globals/AppointmentSettings.ts` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `src/app/(frontend)/api/appointments-export/route.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

- **Thời gian thực hiện:** 22:02 (Asia/Saigon)

### 1. Yêu cầu:
- Cho phép người quản trị trong Admin CMS:
  - Tùy chỉnh thiết kế giao diện trang đặt lịch: Màu sắc nút Đăng ký (bình thường, khi hover, màu chữ), màu nền khung form, màu viền ô nhập, màu viền focus khi click (màu hồng mặc định hoặc màu khác), màu tiêu đề, màu nhãn, màu dấu sao bắt buộc (*).
  - Tùy chỉnh Font chữ (theo hệ thống, Arial, Segoe UI, Roboto, Montserrat, Be Vietnam Pro...), độ bo tròn góc ô nhập (px), độ bo tròn nút Đăng ký (px), chiều rộng tối đa form (px).
  - Tùy chỉnh tiêu đề cột trái (VD: Thông tin khách hàng), tiêu đề cột phải (VD: Chuyên khoa).
  - Bật / tắt các trường thông tin mặc định (Email, Địa chỉ, Thẻ BHYT, Chọn Bác sĩ, Ngày sinh, Giới tính, Triệu chứng, Khung giờ).
  - Cấu hình bắt buộc nhập (Required) linh hoạt cho từng trường.
  - **Thêm bớt các trường thông tin tùy ý (Custom Fields)**: Người quản trị có thể tự thêm không giới hạn các trường mới (như Số CCCD, Nghề nghiệp, Nơi chuyển tuyến, Tiền sử dị ứng, Hộp chọn phân loại bệnh...) chọn kiểu dữ liệu (Text, Textarea, Select, Number, Date, Checkbox) và chọn vị trí đặt ở cột trái hay cột phải.
  - Dữ liệu các trường tùy ý được tự động lưu trữ vào bản ghi phiếu hẹn (`customData`) và xuất đầy đủ ra file Excel màu xanh.

### 2. Chi tiết thay đổi:
- **`src/globals/AppointmentSettings.ts`** [CẬP NHẬT SCHEMA]:
  - Bổ sung nhóm cấu hình thiết kế `🎨 Tùy chỉnh thiết kế, màu sắc & Font chữ trang đặt lịch`: `submitButtonBg`, `submitButtonHoverBg`, `submitButtonTextColor`, `formBackground`, `inputBorderColor`, `inputFocusBorderColor`, `headingColor`, `labelColor`, `requiredStarColor`, `fontFamily`, `submitButtonText`, `inputBorderRadius`, `submitButtonRadius`, `formMaxWidth`.
  - Bổ sung cấu hình tiêu đề 2 cột: `leftColumnTitle`, `rightColumnTitle`.
  - Mở rộng bật/tắt & bắt buộc cho tất cả các trường: `showDob`, `showGender`, `showSymptoms`, `showTimeSlot`, `requireDob`, `requireSymptoms`.
  - Bổ sung mảng `customFields`: Mỗi trường có `name`, `label`, `required`, `type` (text, textarea, select, number, date, checkbox), `column` (left / right), `placeholder`, `options`.
- **`src/collections/Appointments.ts`** [CẬP NHẬT SCHEMA]:
  - Bổ sung trường `customData` (json) lưu trữ linh hoạt mọi giá trị trường tùy biến do admin cấu hình.
- **`src/components/AppointmentBookingForm.tsx`** [CẬP NHẬT FRONTEND]:
  - Nhận các tham số style CSS variables: `--form-bg`, `--input-border`, `--input-focus-border`, `--input-radius`, `--btn-bg`, `--btn-hover-bg`, `--btn-text`, `--btn-radius`, `--heading-color`, `--label-color`, `--star-color`, `fontFamily`.
  - Render động các trường tùy biến theo đúng vị trí cột trái (`leftCustomFields`) hoặc cột phải (`rightCustomFields`) với đầy đủ các loại input tương ứng.
- **`src/app/(frontend)/api/appointments/route.ts`** [CẬP NHẬT API]:
  - Thu thập tất cả các trường tùy biến ngoài các trường tiêu chuẩn và lưu an toàn vào `customData`.
- **`src/app/(frontend)/api/appointments-export/route.ts`** [CẬP NHẬT XUẤT EXCEL]:
  - Bổ sung cột **"Thông tin bổ sung / Triệu chứng"** và **"Thông tin tùy biến thêm"** trong file Excel màu xanh y tế.

### 3. Files Modified:
- `src/globals/AppointmentSettings.ts` [UPDATED]
- `src/collections/Appointments.ts` [UPDATED]
- `src/components/AppointmentBookingForm.tsx` [UPDATED]
- `src/components/AppointmentBookingForm.module.css` [UPDATED]
- `src/app/(frontend)/dat-lich-kham/page.tsx` [UPDATED]
- `src/app/(frontend)/api/appointments/route.ts` [UPDATED]
- `src/app/(frontend)/api/appointments-export/route.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

- **Thời gian thực hiện:** 21:26 (Asia/Saigon)

### 1. Yêu cầu:
- Thiết kế 1 trang đặt lịch khám tại cơ sở theo ảnh mẫu:
  - Cột trái (Thông tin khách hàng): Họ và tên, Email, Số điện thoại, Địa chỉ, Ngày sinh (dd/mm/yyyy), Giới tính (Nam/Nữ).
  - Cột phải (Chuyên khoa & Đặt lịch): Chọn Chuyên khoa, Thông tin bổ sung, Ngày khám (dd/mm/yyyy), Khung giờ khám (Sáng/Chiều), Nút Đăng ký màu xanh dương bo tròn.
  - Viền focus ô nhập màu hồng theo đúng ảnh mẫu.
- Đưa vào Admin CMS để quản lý và có thể tùy chỉnh mẫu:
  - Global `appointment-settings`: Cấu hình bật/tắt trang, tùy chỉnh tiêu đề/mô tả, bật/tắt từng trường (Email, Địa chỉ, Thẻ BHYT, Chọn Bác sĩ), lời dặn người bệnh, số điện thoại tổng đài.
- Mục quản lý các lịch đặt khám trong Admin (`appointments` collection):
  - Hiển thị danh sách lịch đặt khám với mã phiếu hẹn duy nhất (`LK-2026-XXXX`).
  - Phân loại trạng thái tiếp đón: Mới tiếp nhận, Đã gọi xác nhận, Đang tiếp nhận khám, Đã hoàn tất, Đã hủy hẹn.
  - Lưu trữ ghi chú tiếp đón của điều dưỡng / nhân viên y tế.
- Bảng thống kê chi tiết & Xuất file Excel:
  - Tích hợp component `AppointmentsDashboard` ngay phía trên danh sách Admin với các thẻ KPI theo dõi quy trình.
  - Tính năng Xuất file Excel (`/api/appointments-export`): Định dạng chuẩn y tế với dải tiêu đề và header màu xanh thương hiệu (`#0756B4`, `#0284C7`, `#0369A1`), chữ trắng in đậm, đường viền ô rõ ràng, format cột ngày tháng chuẩn.
- Đồng bộ nút **"ĐẶT LỊCH NGAY"** trên Header dẫn thẳng đến trang đặt khám tại cơ sở `/dat-lich-kham`.

### 2. Chi tiết Database / Schema:
- **`src/collections/Appointments.ts`** [MỚI]:
  - `code` (string, unique, index): Mã phiếu hẹn.
  - `fullName` (string, required): Họ và tên người bệnh.
  - `phone` (string, required): Số điện thoại.
  - `email` (string): Email liên hệ.
  - `address` (string): Địa chỉ cư trú.
  - `dob` (date): Ngày sinh.
  - `gender` (select: male, female, other): Giới tính.
  - `insuranceNumber` (string): Mã số thẻ BHYT.
  - `specialty` (relationship: specialties): Chuyên khoa khám.
  - `department` (relationship: departments): Khoa phòng tiếp nhận.
  - `doctor` (relationship: doctors): Bác sĩ chỉ định (nếu có).
  - `appointmentDate` (date, required): Ngày hẹn khám.
  - `timeSlot` (select: morning, afternoon, anytime): Khung giờ khám.
  - `symptoms` (textarea): Triệu chứng / Thông tin bổ sung.
  - `status` (select: new, confirmed, examining, completed, cancelled): Trạng thái xử lý.
  - `source` (select: website, phone, counter): Nguồn đăng ký.
  - `staffNote` (textarea): Ghi chú nội bộ.
  - `confirmedAt` (date): Thời điểm gọi xác nhận.
- **`src/globals/AppointmentSettings.ts`** [MỚI]:
  - `enabled`, `pageTitle`, `eyebrow`, `pageDescription`, `showEmail`, `showAddress`, `showInsurance`, `showDoctorSelect`, `requireEmail`, `requireAddress`, `hospitalGuidance`, `hotlineSupport`.

### 3. Files Modified/Created:
- `src/collections/Appointments.ts` [NEW]
- `src/globals/AppointmentSettings.ts` [NEW]
- `src/components/AppointmentBookingForm.tsx` [NEW]
- `src/components/AppointmentBookingForm.module.css` [NEW]
- `src/app/(frontend)/dat-lich-kham/page.tsx` [NEW]
- `src/app/(frontend)/api/appointments/route.ts` [NEW]
- `src/app/(frontend)/api/appointments-export/route.ts` [NEW]
- `src/components/admin/AppointmentsDashboard.tsx` [NEW]
- `src/components/admin/AppointmentsDashboard.module.css` [NEW]
- `src/components/SiteHeader.tsx` [UPDATED]
- `payload.config.ts` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

- **Thời gian thực hiện:** 21:12 (Asia/Saigon)

### 1. Yêu cầu:
- Đưa phần "CẤP CỨU 24/7" và "ĐẶT LỊCH KHÁM" trên Header vào Admin CMS để người quản trị có thể:
  - Thêm / đổi link liên kết (ví dụ: `tel:...`, `/lich-kham`, link đặt khám ngoài...)
  - Đổi icon (chọn icon dấu thập cấp cứu, lịch khám, điện thoại, tai nghe tổng đài, trái tim, info hoặc tự upload icon riêng)
  - Thay đổi màu chữ (tiêu đề nhỏ, chữ nội dung chính, chữ ghi chú phụ)
  - Thay đổi màu nền ô, màu viền ô, màu biểu tượng và màu nền biểu tượng
  - Thay đổi font chữ, độ đậm chữ, kích thước chữ (title size, text size)
  - Thay đổi kích cỡ icon, chiều rộng tối thiểu của ô (min-width), và độ bo tròn góc (border-radius).

### 2. Chi tiết thay đổi:
- **`src/globals/SiteSettings.ts`** [CẬP NHẬT SCHEMA GLOBAL]:
  - Cập nhật mảng `headerContactCards` trong Global `site-settings`:
    - Trường nội dung & điều hướng: `visible`, `title`, `text`, `href`, `extraText`, `hasArrow`.
    - Chọn biểu tượng: `iconType` (emergency, calendar, phone, headset, heart, info, custom), `customIcon` (upload ảnh icon).
    - Tùy chỉnh màu sắc (Collapsible): `titleColor`, `textColor`, `extraTextColor`, `background`, `borderColor`, `iconColor`, `iconBackground`.
    - Tùy chỉnh Font chữ & Kích thước (Collapsible): `fontFamily`, `fontWeight`, `titleFontSize`, `textFontSize`, `iconSize`, `minWidth`, `borderRadius`.
- **`src/components/SiteHeader.tsx`** [CẬP NHẬT FRONTEND]:
  - Bổ sung tham số `iconSize` vào component `ContactIcon` để render kích thước icon linh hoạt.
  - Hỗ trợ đổi màu SVG của icon dấu thập cấp cứu và các icon khác theo màu `iconColor` và `iconBackground` được chỉ định.
  - Truyền các biến CSS tương ứng (`--contact-background`, `--contact-border`, `--contact-title`, `--contact-text`, `--contact-icon`, `--contact-icon-bg`, `--contact-font-family`, `--contact-min-width`, `--contact-border-radius`, v.v.) trực tiếp vào từng card.
- **`src/app/globals.css` & `src/components/SiteHeader.module.css`** [CẬP NHẬT STYLING]:
  - Xóa bỏ các màu và kích thước cứng (`!important`) ngăn cản tuỳ biến; kết nối trực tiếp với biến CSS từ CMS (`var(--contact-font-family)`, `var(--contact-min-width)`, `var(--contact-border-radius)`, `var(--contact-icon)`).

### 3. Files Modified:
- `src/globals/SiteSettings.ts` [UPDATED]
- `src/components/SiteHeader.tsx` [UPDATED]
- `src/app/globals.css` [UPDATED]
- `src/components/SiteHeader.module.css` [UPDATED]
- `CHANGELOG.md` [UPDATED]

---

## [2026-09-12] - Cập nhật mẫu Excel chuẩn & Bóc tách trọn vẹn 100% dữ liệu lịch trực

- **Thời gian thực hiện:** 20:51 (Asia/Saigon)

### 1. Yêu cầu:
- Sửa lại mẫu Excel chuẩn để lấy đủ toàn bộ dữ liệu: không chỉ các khoa trực mà lấy trọn vẹn cả ngày tuần, bảng phân công nhân sự tuần, ghi chú điều động công tác và danh bạ điện thoại trực / cấp cứu liên viện.

### 2. Chi tiết thay đổi:
- **`public/templates/lich-truc-cap-cuu-mau.xlsx`** [CẬP NHẬT FILE MẪU CHUẨN]:
  - Thay thế file mẫu cũ bằng file mẫu chuẩn y tế thực tế (`truc.xlsx`), đảm bảo người dùng tải mẫu về chỉnh sửa hay dùng trực tiếp đều hoàn toàn khớp định dạng.
- **`src/lib/emergencyExcelParser.ts`** [MỚI]:
  - Module xử lý parse file Excel hoàn chỉnh:
    - Bóc tách ngày bắt đầu - kết thúc tuần (`emergencyWeekStart`, `emergencyWeekEnd`).
    - Bóc tách bảng lịch trực theo Khoa/Bộ phận × 7 ngày (`weeklyDeptSlots`).
    - Bóc tách bảng phân công nhân sự theo khoa trong tuần (`fixedStaff`).
    - Bóc tách ghi chú chung tuần trực (`emergencyGeneralNote`).
    - Bóc tách danh bạ điện thoại trực nội bộ (tài xế, bảo vệ, điện nước...) và số cấp cứu liên viện (`emergencyContacts`).
- **`src/collections/Schedules.ts`** [CẬP NHẬT SCHEMA]:
  - Bổ sung các trường lưu trữ: `emergencyGeneralNote` (ghi chú chung) và `emergencyContacts` (danh bạ trực nội bộ và cấp cứu liên viện).
- **`src/components/admin/EmergencyTemplateDownload.tsx`** [CẬP NHẬT UI ADMIN]:
  - Tích hợp parse trực tiếp bằng thư viện `xlsx` ngay tại trình duyệt client, tốc độ tức thì.
  - Khi nhấn **"✓ Điền vào bảng bên dưới"**, hệ thống tự động điền cùng lúc:
    1. Bảng Khoa / Bộ phận (`weeklyDeptSlots`)
    2. Ngày bắt đầu & kết thúc tuần (`emergencyWeekStart`, `emergencyWeekEnd`)
    3. Ghi chú chung (`emergencyGeneralNote`)
    4. Danh bạ điện thoại trực & cấp cứu liên viện (`emergencyContacts`)
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`** [CẬP NHẬT FRONTEND]:
  - Hiển thị đầy đủ 4 khối nội dung trực quan:
    1. Bảng ma trận Khoa/Bộ phận × 7 ngày
    2. Danh sách nhân sự các khoa / bộ phận trong tuần
    3. Ghi chú điều động & công tác trong tuần
    4. Đường dây nóng trực & số điện thoại cấp cứu liên viện (có nút bấm gọi trực tiếp `tel:`)

### 3. Files Modified/Created:
- `public/templates/lich-truc-cap-cuu-mau.xlsx` [UPDATED]
- `src/lib/emergencyExcelParser.ts` [NEW]
- `src/collections/Schedules.ts` [UPDATED]
- `src/components/admin/EmergencyTemplateDownload.tsx` [UPDATED]
- `src/app/(frontend)/lich-kham/[id]/page.tsx` [UPDATED]
- `src/app/api/emergency-import/` [DELETED - Giải quyết xung đột Duplicate page route với `src/app/(frontend)/api/emergency-import`]
- `CHANGELOG.md` [UPDATED]

### 4. Thay đổi Database / Collections / Schema:
- **Collection `schedules`**:
  - `emergencyGeneralNote`: textarea (Ghi chú chung điều động / công tác tuần)
  - `emergencyContacts`: array (Danh bạ điện thoại trực & Cấp cứu liên viện)
    - `name`: text (Tên người/bộ phận/bệnh viện)
    - `phone`: text (Số điện thoại)
    - `type`: select (`internal`: Trực nội bộ; `emergency_unit`: Cấp cứu liên viện)
    - `note`: text
  - `emergencyExcelFile`: upload relationTo media (Bảo toàn tệp gốc và tránh cảnh báo drop column của Drizzle push)

---

## [2026-09-12] - Nút tải mẫu Excel ngay trong form Admin tạo Lịch trực Cấp cứu


- **Thời gian thực hiện:** 20:12 (Asia/Saigon)

### 1. Yêu cầu:
- Đặt nút tải mẫu Excel ngay trong giao diện tạo lịch trực cấp cứu ở Admin CMS để quản trị viên dễ tải hơn, không phải tìm file thủ công.

### 2. Chi tiết thay đổi:
- **`src/components/admin/EmergencyTemplateDownload.tsx`** [NEW]: Custom UI component hiển thị banner download với 2 nút:
  - **⬇ Tải mẫu Excel** (.xlsx) — tải về file đầy đủ 2 sheet (Bảng nhập liệu + Hướng dẫn)
  - **CSV** — phiên bản CSV đơn giản
- **`src/collections/Schedules.ts`**: Thêm field `type: 'ui'` với `EmergencyTemplateDownload` component — chỉ hiện khi mode = `emergency`.
- **`public/templates/lich-truc-cap-cuu-mau.xlsx`** [NEW]: File Excel 2 sheet được tạo bằng script.
- **`public/templates/lich-truc-cap-cuu-mau.csv`** [NEW]: File CSV đơn giản dự phòng.
- **`scripts/create-emergency-template.cjs`** [NEW]: Script tạo lại file mẫu khi cần cập nhật.

### 3. Files Modified/Created:
- `src/components/admin/EmergencyTemplateDownload.tsx` [NEW]
- `src/collections/Schedules.ts`
- `public/templates/lich-truc-cap-cuu-mau.xlsx` [NEW]
- `public/templates/lich-truc-cap-cuu-mau.csv` [NEW]
- `scripts/create-emergency-template.cjs` [NEW]
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- **Collection `schedules`**: Thêm field UI `emergencyTemplateHelper` (không lưu dữ liệu — chỉ render widget download).

---

## [2026-09-12] - Thiết kế Lịch trực Cấp cứu theo Tuần (Emergency Weekly Schedule)


- **Thời gian thực hiện:** 20:00 (Asia/Saigon)

### 1. Yêu cầu:
- Thiết kế bảng lịch trực cấp cứu theo tuần với giao diện ma trận, đồng bộ phong cách với bảng lịch ngày.
- Admin có thể thêm nhanh bác sĩ vào cùng 1 ngày, nhập nhanh bằng mẫu Excel (copy-paste).

### 2. Chi tiết thay đổi:

**Schema mới (Collections):**
- Thêm mode `emergency` — "Lịch trực cấp cứu theo tuần (bảng ma trận)" vào trường `mode`.
- Thêm trường `emergencyWeekStart` / `emergencyWeekEnd` — khoảng thời gian tuần trực.
- Thêm array `weeklyEmergencySlots`: mỗi dòng = 1 ngày, gồm 3 ô nhập nhanh: Ca Sáng / Ca Chiều / Ca Tối (nhập tên bác sĩ cách nhau bằng dấu phẩy).
- Thêm trường `emergencyExcelFile` để tải lên file Excel/CSV tham khảo.

**Giao diện Frontend:**
- Bảng ma trận: Hàng = Ca trực (Sáng ☀️ / Chiều 🌤️ / Tối 🌙), Cột = Ngày trong tuần (T2→CN).
- Theme đỏ y tế chuẩn, kẻ ô sắc nét, không vỡ layout.
- Mỗi ô hiển thị 2 tên bác sĩ/dòng (grid 2 cột giống lịch ngày).
- Header: Banner đỏ + icon xe cấp cứu + badge ngày tuần trực.
- Hỗ trợ dòng ghi chú theo ngày (nếu có).

### 3. Files Modified:
- `src/collections/Schedules.ts` — Thêm schema emergency
- `src/app/(frontend)/lich-kham/[id]/page.tsx` — Thêm render bảng emergency
- `src/app/styles/daily-schedule.css` — Thêm CSS bảng emergency (300+ dòng)
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- **Collection `schedules`**: Thêm các trường mới (KHÔNG phá vỡ dữ liệu cũ):
  - `mode`: Thêm giá trị mới `'emergency'`
  - `emergencyWeekStart` (Date, optional)
  - `emergencyWeekEnd` (Date, optional)
  - `weeklyEmergencySlots` (Array): gồm `dayOfWeek` (select), `morningDoctors` (textarea), `afternoonDoctors` (textarea), `nightDoctors` (textarea), `note` (text)
  - `emergencyExcelFile` (Upload → media, optional)

---

## [2026-09-12] - Cố định hiển thị 1 dòng 2 bác sĩ (Inline Grid) & Đổi icon khung 16:00 - 17:00 thành Mặt trời


- **Thời gian thực hiện:** 19:51 (Asia/Saigon).

### 1. Yêu cầu:
- Khắc phục triệt để việc các thẻ bác sĩ vẫn xếp dọc: Bắt buộc hiển thị 2 tên bác sĩ trên cùng 1 hàng ngang trong mỗi ô phân ca.
- Đổi biểu tượng của khung giờ `16:00 – 17:00` từ Mặt trăng thành Mặt trời (mặt trời buổi chiều).

### 2. Chi tiết thay đổi:
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Đổi biểu tượng icon tại cột `16:00 – 17:00` từ `.dailyShiftMoonIcon` (mặt trăng) sang `.dailyShiftSunIcon evening` (mặt trời vector SVG màu cam đậm).
  - Bổ sung cấu hình hiển thị trực tiếp `style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '5px', width: '100%' }}` ngay trong hàm `renderDoctorChips`.
  - Tinh chỉnh thẻ bác sĩ con: `whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px'` cùng `tooltip title` đầy đủ, đảm bảo 100% hai bác sĩ luôn nằm song song trên 1 hàng mà không bao giờ bị rớt dòng.
  - Bổ sung `export const dynamic = 'force-dynamic'` và `export const revalidate = 0` để ép Next.js luôn kết xuất HTML trực tiếp theo code mới nhất, không bị giữ cache trang tĩnh cũ.
- **`src/app/globals.css`**:
  - Đồng bộ `.dailyDoctorChipList` sang `display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important;`.
- **Tuân thủ Mandate**:
  - Đảm bảo tỷ lệ chuẩn y tế, ghi chép nhật ký đầy đủ.

### 3. Files Modified:
- `src/app/(frontend)/lich-kham/[id]/page.tsx`
- `src/app/globals.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- Không thay đổi schema.

---

## [2026-09-12] - Tinh gọn Banner lịch khám, cập nhật khung giờ 10:00 - 11:00 & bố trí 1 dòng 2 bác sĩ

- **Thời gian thực hiện:** 19:46 (Asia/Saigon).

### 1. Yêu cầu:
- Tinh giản Header: Bỏ phần nội dung 2 bên (Logo, tên bệnh viện, địa chỉ bên trái và khẩu hiệu cam kết bên phải), chỉ giữ lại duy nhất Tiêu đề "LỊCH PHÂN CÔNG BÁC SĨ KHÁM BỆNH" và Badge Ngày khám.
- Cập nhật khung giờ: Đổi ca `10:00 – 13:00` thành `10:00 – 11:00`.
- Bỏ phần nhãn các ca (bỏ chữ `Ca Sáng`, `Ca Trưa`, `Ca Chiều`, `Ca Tối`), chỉ giữ lại giờ khám và icon trực quan.
- Tối ưu diện tích bảng: 1 dòng hiển thị 2 tên bác sĩ (chia 2 cột gọn gàng) giúp bảng thu gọn, ngăn nắp và khoa học.

### 2. Chi tiết thay đổi:
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Tinh giản Header: Loại bỏ `.dailyMastheadBrand` và `.dailyMastheadRight`, chỉ giữ `.dailyMastheadTitleBox` căn giữa sang trọng.
  - Sửa cột khung giờ: Đổi `10:00 – 13:00` thành `10:00 – 11:00`.
  - Loại bỏ các thẻ nhãn `.dailyShiftTag` (`tagMorning`, `tagNoon`, `tagAfternoon`, `tagEvening`).
- **`src/app/styles/daily-schedule.css`**:
  - Cập nhật `.dailyScheduleMasthead` căn giữa hoàn toàn (`justify-content: center`).
  - Chuyển `.dailyDoctorChipList` sang bố cục lưới 2 cột: `display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 5px !important;` giúp 1 dòng hiển thị 2 tên bác sĩ.
  - Thu gọn kích thước `.dailyDoctorChip`: Padding nhỏ hơn, font 12.5px, icon 18x18px, căn đều thẳng hàng.
- **`src/collections/Schedules.ts`**:
  - Đổi label trường `noonDoctors` trong Payload CMS Admin từ `10:00 – 13:00 (Buổi trưa)` thành `10:00 – 11:00` đồng bộ giao diện.
- **Tuân thủ Mandate**:
  - Bảo toàn trọn vẹn quy cách hiển thị, ghi chép nhật ký đầy đủ.

### 3. Files Modified:
- `src/app/(frontend)/lich-kham/[id]/page.tsx`
- `src/app/styles/daily-schedule.css`
- `src/collections/Schedules.ts`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- Cập nhật `label` trường `noonDoctors` trong mảng `dailyAssignments` của collection `schedules` thành `10:00 – 11:00`. Dữ liệu lưu trữ cũ không bị ảnh hưởng.

---

## [2026-09-12] - Tách riêng stylesheet daily-schedule.css & Hoàn thiện bảng phân công kẻ ô sắc nét chuẩn mẫu y tế

- **Thời gian thực hiện:** 19:35 (Asia/Saigon).

### 1. Yêu cầu:
- Khắc phục triệt để hiện tượng tiêu đề ca khám bị dính liền chữ (`07:00 – 10:00Ca Sáng 10:00 – 13:00Ca Trưa...`) và thiếu đường kẻ viền phân cách ô bảng.
- Biến phần nội dung thành một bảng ma trận chuẩn đẹp, viền ô sắc nét, phân tách rõ ràng từng cột ca khám như đúng hình ảnh mẫu bệnh viện.
- Tối ưu giao diện nhập liệu ma trận ca trực trong Payload Admin để hỗ trợ quản trị viên nhập liệu tiện lợi.

### 2. Chi tiết thay đổi:
- **`src/app/styles/daily-schedule.css` (MỚI)**:
  - Tạo mới tệp stylesheet độc lập chuyên trách cho biểu mẫu lịch khám poster y tế (`dailySchedulePoster` và `dailyShiftTable`), nạp trực tiếp vào layout website sau các file reset để bảo đảm không bị ghi đè thuộc tính.
  - Bảng ma trận: `border-collapse: collapse !important; border: 2px solid #0284c7 !important; min-width: 860px; table-layout: fixed;`.
  - Toàn bộ các ô `th` và `td` đều có đường kẻ viền ô phân cách `border: 1px solid #cbd5e1 !important; border-right: 1.5px solid #cbd5e1 !important; border-bottom: 1.5px solid #cbd5e1 !important;`.
  - Tiêu đề cột các ca: Thiết lập `flex-direction: column` với khoảng cách `gap: 5px`, tách biệt hoàn toàn biểu tượng Mặt trời/Mặt trăng, dòng thời gian in đậm (`display: block`) và badge tên ca (`display: inline-block; white-space: nowrap`), chấm dứt triệt để lỗi dính chữ.
- **`src/app/(frontend)/layout.tsx`**:
  - Nhập `import '../styles/daily-schedule.css'` để áp dụng toàn cầu cho các trang phân công bác sĩ.
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Chuẩn hóa layout icon và kích thước vector cho `dailyThShiftContent`.
- **`src/app/(payload)/custom.css`**:
  - Định dạng bảng nhập liệu các dòng ca trực `dailyAssignments` trong Admin Payload với bo góc, viền xanh y tế và màu nhãn nổi bật cho từng ca Sáng/Trưa/Chiều/Tối.
- **Tuân thủ Mandate**:
  - Đảm bảo tỷ lệ hiển thị, không méo ảnh chân dung y bác sĩ; ghi chép nhật ký đầy đủ.

### 3. Files Modified:
- `src/app/styles/daily-schedule.css` (Tạo mới)
- `src/app/(frontend)/layout.tsx`
- `src/app/(frontend)/lich-kham/[id]/page.tsx`
- `src/app/(payload)/custom.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- Không thay đổi schema (giữ nguyên cấu trúc `dailyAssignments` trong `schedules`).

---

## [2026-09-12] - Nâng cấp toàn diện Bảng ma trận phân công bác sĩ khám bệnh theo từng khung giờ chuyên nghiệp

- **Thời gian thực hiện:** 19:22 (Asia/Saigon).

### 1. Yêu cầu:
- Thiết kế lại bảng phân công bác sĩ khám bệnh theo ngày: loại bỏ tình trạng hiển thị thô dính chữ, kẻ viền ô bảng ma trận sắc nét từng khung giờ (07:00 – 10:00, 10:00 – 13:00, 13:00 – 16:00, 16:00 – 17:00).
- Chuyển đổi danh sách tên bác sĩ trong từng ca trực thành các thẻ tag/chip bác sĩ chuẩn y tế, có icon ống nghe chuyên nghiệp, phân màu nhận diện từng ca (Ca Sáng vàng nhạt, Ca Trưa cam nhạt, Ca Chiều xanh lá dịu, Ca Tối tím dịu), không để text bị dính liền lộn xộn.
- Tối ưu layout chi tiết: ẩn tiêu đề bài viết lặp lại khi đang ở chế độ xem bảng phân công ca trực poster y tế.

### 2. Chi tiết thay đổi:
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Bổ sung hàm `renderDoctorChips`: Tự động phân tách chuỗi tên bác sĩ (ngăn cách bởi dấu phẩy, chấm phẩy, gạch chéo hoặc xuống dòng) thành mảng thẻ chip bác sĩ (`dailyDoctorChip`).
  - Mỗi thẻ bác sĩ con có icon ống nghe y tế, tên bác sĩ in đậm rõ nét, nền và viền màu riêng biệt theo từng ca khám (`chip-morning`, `chip-noon`, `chip-afternoon`, `chip-evening`).
  - Phân nhánh hiển thị: Khi hiển thị bảng phân công `mode === 'daily' && dailyAssignments.length > 0`, toàn bộ giao diện tập trung vào Poster bảng phân công chính thức, không lặp lại tiêu đề văn bản hay cover placeholder bên ngoài.
  - Nâng cấp nhãn badge ca trực tại header: `07:00 – 10:00 (Ca Sáng)`, `10:00 – 13:00 (Ca Trưa)`, `13:00 – 16:00 (Ca Chiều)`, `16:00 – 17:00 (Ca Tối)`.
- **`src/app/globals.css`**:
  - Định hình lại toàn bộ cấu trúc bảng `.dailyShiftTable`:
    - `table-layout: fixed; width: 100%; border: 1px solid #cbd5e1;`
    - Cột Khoa/Phòng (22%) có nền xanh đậm thương hiệu y tế, đường kẻ viền phân cách đôi sắc nét `border-right: 2px solid #94a3b8`.
    - Header mỗi ca trực có dải màu gradient nhận diện trực quan: Sáng (vàng nắng), Trưa (cam tươi), Chiều (xanh dịu mát), Tối (tím đêm).
    - Từng ô ca trực (`dailyCellShift`) có đường kẻ viền ranh giới rõ ràng (`border-right: 1.5px solid #cbd5e1; border-bottom: 1.5px solid #cbd5e1`).
    - Thẻ chip bác sĩ (`.dailyDoctorChip`) bo góc `8px`, bóng đổ nhẹ `0 1.5px 4px rgba(0,0,0,0.04)`, hiệu ứng hover nổi nhẹ, font chữ gọn gàng, cách dòng tối ưu.
- **Tuân thủ Mandate**:
  - Không làm biến dạng ảnh bác sĩ; ghi chép nhật ký đầy đủ.

### 3. Files Modified:
- `src/app/(frontend)/lich-kham/[id]/page.tsx`
- `src/app/globals.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- Không thay đổi schema mới (tận dụng trọn vẹn mảng `dailyAssignments` đã cập nhật).

---

## [2026-09-12] - Thiết kế Bảng phân công bác sĩ khám bệnh theo ngày (Poster y tế) & tối ưu nhập liệu nhanh

- **Thời gian thực hiện:** 19:06 (Asia/Saigon).

### 1. Yêu cầu:
- Thiết kế bảng lịch khám theo ngày ("LỊCH PHÂN CÔNG BÁC SĨ KHÁM BỆNH NGÀY ...") chuẩn theo hình ảnh biểu mẫu y tế thực tế được cung cấp:
  - Header biểu mẫu: Logo tròn BVĐK Thới Lai, Tên bệnh viện, Địa chỉ, Khẩu hiệu "Vì sức khỏe cộng đồng", Banner tiêu đề ribbon nổi bật, Khung ngày khám `NGÀY DD/MM/YYYY (THỨ ...)`, Khẩu hiệu bên phải "TẬN TÂM - CHUYÊN NGHIỆP - VÌ NGƯỜI BỆNH".
  - Cấu trúc bảng chia ca rõ ràng: Cột Khoa/Phòng (có icon y tế đặc thù từng khoa) và 4 ca khám trong ngày (07:00 – 10:00 Sáng, 10:00 – 13:00 Trưa, 13:00 – 16:00 Chiều, 16:00 – 17:00 Tối) kèm icon Mặt trời / Mặt trăng trực quan.
- Trong trang quản trị Admin: Thiết kế giao diện nhập liệu ma trận trực quan, cho phép người quản trị nhập hoặc dán nhanh danh sách bác sĩ theo từng khoa phòng và ca khám (thay vì phải chọn quan hệ từng bác sĩ lẻ tẻ).

### 2. Chi tiết thay đổi:
- **`src/collections/Schedules.ts`**:
  - Mở rộng cấu hình collection `schedules` cho `mode === 'daily'`:
    - Bổ sung mảng `dailyAssignments` (Bảng phân công ca trực / khám theo Khoa/Phòng) với `initCollapsed: false` mở sẵn form trực quan.
    - Cấu trúc mỗi dòng khoa phòng: `departmentName` (Tên khoa/phòng), `departmentIcon` (Lựa chọn icon: Ống nghe, Cấp cứu, Giường bệnh, YHCT, Dao mổ Ngoại, Sản khoa, Siêu âm, Răng Hàm Mặt, Vi sinh Covid), 4 ca khám dạng textarea nhập nhanh (`morningDoctors`, `noonDoctors`, `afternoonDoctors`, `eveningDoctors`) và ghi chú riêng.
    - Giữ trọn vẹn nhóm trường thông tin cũ trong mục `legacyDailySection` để tương thích 100% ngược dữ liệu trước đây.
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Tích hợp giao diện poster y tế hoàn chỉnh `.dailySchedulePoster`:
    - Khối Masthead Header gồm Logo BV, Tên BVĐK Thới Lai, Địa chỉ, Khẩu hiệu nghiêng, Ribbon tiêu đề màu xanh dương y tế và Khung ngày tự động phân tích Thứ/Ngày/Tháng/Năm (`NGÀY DD/MM/YYYY (THỨ ...)`).
    - Khối bên phải hiển thị khẩu hiệu y đức: "TẬN TÂM - CHUYÊN NGHIỆP - VÌ NGƯỜI BỆNH".
    - Render bảng HTML semantic ma trận ca khám `.dailyShiftTable` với 5 cột: Cột Khoa/Phòng và 4 cột ca khám (Sáng, Trưa, Chiều, Tối) với icon Mặt trời mọc, Mặt trời trưa, Mặt trời chiều và Mặt trăng ca tối.
    - Icon vector SVG tùy biến riêng biệt cho từng Khoa/Phòng (Khám bệnh, Cấp cứu, Nội, YHCT, Ngoại, Sản, Siêu âm, Răng, Covid...).
- **`src/app/globals.css`**:
  - Thêm bộ CSS cao cấp cho `.dailySchedulePoster`, `.dailyScheduleMasthead`, `.dailyBrandLogo`, `.dailyTitleRibbon`, `.dailyDateBadge`, `.dailyCommitmentBanner`, `.dailyTableWrapper`, `.dailyShiftTable`, zebra-striping `.dailyRowEven`/`.dailyRowOdd`, và hiệu ứng hover hàng khám.
  - Tích hợp cuộn ngang mượt mà trên thiết bị di động (`-webkit-overflow-scrolling: touch`), đảm bảo không bị co vỡ chữ trên màn hình nhỏ.

### 3. Files Modified:
- `src/collections/Schedules.ts`
- `src/app/(frontend)/lich-kham/[id]/page.tsx`
- `src/app/globals.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- **Collection `schedules`**:
  - Thêm mảng `dailyAssignments` gồm:
    - `departmentName` (Text, required)
    - `departmentIcon` (Select: `stethoscope`, `ambulance`, `bed`, `mortar`, `scalpel`, `baby`, `ultrasound`, `tooth`, `virus`, `clinic`)
    - `morningDoctors` (Textarea)
    - `noonDoctors` (Textarea)
    - `afternoonDoctors` (Textarea)
    - `eveningDoctors` (Textarea)
    - `note` (Text)
  - Không phá vỡ dữ liệu cũ (Backward compatible 100%).

---

- **Thời gian thực hiện:** 18:38 (Asia/Saigon).

### 1. Yêu cầu:
- Thiết kế lịch khám theo tuần chuyên nghiệp: Mỗi thứ (Thứ Hai, Thứ Ba...) trên cùng 1 hàng duy nhất sẽ gom nhóm tất cả các bác sĩ khám trong ngày đó (thay vì bị lặp lại cột Thứ cho từng bác sĩ).
- Trong trang quản trị Admin: Cho phép thêm nhanh các bác sĩ vào cùng 1 ngày thuận tiện, trực quan.

### 2. Chi tiết thay đổi:
- **`src/app/(frontend)/lich-kham/[id]/page.tsx`**:
  - Tái cấu trúc giao diện lịch khám theo tuần: Gom nhóm mảng `weeklySlots` theo từng Thứ trong tuần (`DAY_KEYS` từ Thứ Hai đến Chủ Nhật).
  - Thiết kế bảng lịch khám theo tuần dạng hàng ngang chuyên nghiệp (`weeklyDayRow`): Cột bên trái hiển thị Badge Thứ lớn và số lượng bác sĩ khám; Cột bên phải hiển thị danh sách các thẻ bác sĩ (`weeklyDoctorCardGrid`) khám trong ngày.
  - Tuân thủ nghiêm ngặt **Quy tắc bắt buộc dự án (Mandate 1 & 2)**:
    - Sắp xếp thứ tự bác sĩ trong từng ngày ưu tiên **Ban Giám đốc (Giám đốc -> Phó Giám đốc) -> Trưởng/Phó Khoa -> Bác sĩ**.
    - Khung ảnh đại diện bác sĩ (`weeklyDoctorItemAvatar`) áp dụng tỷ lệ chuẩn đứng 3:4 (width 48px, height 60px), `object-fit: cover`, `object-position: top center`, `overflow: hidden`, bảo toàn tuyệt đối tỷ lệ ảnh gốc, không co méo hay kéo dẹt.
    - Hiển thị đầy đủ thông tin: Tên bác sĩ (kèm liên kết hồ sơ), Huy hiệu Ban Giám đốc, Khoa/Phòng phụ trách, Khung giờ khám, Phòng khám, Ghi chú ca trực.
- **`src/app/globals.css`**:
  - Bổ sung bộ quy chuẩn CSS hiện đại cho `.weeklyGroupedTable`, `.weeklyDayRow`, `.weeklyDayBadgeColumn`, `.weeklyDoctorCardGrid`, `.weeklyDoctorItemCard`, `.weeklyLeadershipBadge`.
  - Tích hợp responsive hoàn hảo trên điện thoại và máy tính bảng: Chuyển đổi linh hoạt sang dạng 1 cột trên màn hình nhỏ mà không bị vỡ layout.
- **`src/collections/Schedules.ts`**:
  - Tối ưu cấu trúc mảng `weeklySlots` trong Admin: Phân chia bố cục theo dạng `row` ngang gọn gàng (Thứ trong tuần 30%, Bác sĩ phụ trách 40%, Khoa/Phòng 30%).
  - Mở sẵn form nhập (`initCollapsed: false`) và bổ sung hướng dẫn thao tác thêm nhanh nhiều bác sĩ vào cùng một thứ trong tuần.

### 3. Files Modified:
- `src/app/(frontend)/lich-kham/[id]/page.tsx`
- `src/app/globals.css`
- `src/collections/Schedules.ts`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có** (Sử dụng và tương thích hoàn toàn cấu trúc dữ liệu `weeklySlots` hiện có).

---

## [2026-09-12] - Cập nhật mẫu hiển thị Hoạt động khoa học giống Trang tin tức Bệnh viện

- **Thời gian thực hiện:** 18:18 (Asia/Saigon).

### 1. Yêu cầu:
- Cập nhật phần Hoạt động khoa học trên trang chủ hiển thị theo mẫu giống phần Trang tin tức Bệnh viện (grid tạp chí phong cách portal với 1 thẻ chính nổi bật bên trái và 4 thẻ phụ bên phải, đồng bộ chuẩn hiển thị ảnh đại diện và liên kết xem toàn bộ bài viết).

### 2. Chi tiết thay đổi:
- **`src/components/HomeScienceTabs.tsx`**:
  - Chuyển đổi cấu trúc layout từ `tabEditorialGrid` sang chuẩn `homeEditorialGrid` (tương tự `HomeNewsTabs.tsx`).
  - Hiển thị 1 thẻ chính (Hero Spotlight: ảnh tỉ lệ chuẩn 60% kèm badge tên nhóm/chuyên mục, tiêu đề, ngày đăng và mô tả tóm tắt) và 4 thẻ phụ dạng thẻ tin tức (ảnh thumbnail, ngày đăng, tiêu đề).
  - Tích hợp thẻ giữ chỗ rỗng `EmptyCard` để bảo đảm bố cục 5 vị trí luôn cân đối, ổn định ngay cả khi chuyên mục có ít hơn 5 bài viết.
  - Sử dụng thẻ `<img>` với `editorialImg` tuân thủ nghiêm ngặt quy cách hiển thị ảnh chân dung/chuyên mục (không méo, không bóp dẹt, bảo toàn tỷ lệ ảnh).
- **`src/app/(frontend)/page.tsx`**:
  - Bổ sung các class `homePortalNewsSection` và `homePortalPage` cho thẻ `<section>` của mục Hoạt động khoa học (`homeScienceSection`), đảm bảo nhận trọn vẹn bộ styling cao cấp của lưới báo chí.
  - Cập nhật nút liên kết tiêu đề thành "Xem toàn bộ bài viết →" đồng bộ với Trang tin tức Bệnh viện.

### 3. Files Modified:
- `src/components/HomeScienceTabs.tsx`
- `src/app/(frontend)/page.tsx`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Sửa lỗi mất phiên đăng nhập khi sửa bài trên Admin dev

- **Thời gian thực hiện:** 18:04 (Asia/Saigon).

### 1. Yêu cầu:
- Khắc phục lỗi `UnauthorizedError` khi Payload dựng lại form bài Hoạt động khoa học và lỗi autosave HTTP 403.

### 2. Nguyên nhân và thay đổi:
- Admin development đang chạy tại `localhost:3001` do cổng 3000 đã có server production, trong khi danh sách CORS/CSRF chỉ cho phép cổng 3000.
- Payload từ chối đọc JWT cookie ở Origin chưa được cho phép, làm Server Action nhận `req.user = null` dù trình duyệt vừa đăng nhập.
- **`payload.config.ts`**: bổ sung chính xác hai hostname local (`localhost`, `127.0.0.1`) trên dải cổng development 3000–3010 vào CORS/CSRF; production vẫn chỉ sử dụng URL được cấu hình, không mở rộng whitelist production.

### 3. Files Modified:
- `payload.config.ts`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Cho phép quản lý động Nhóm hoạt động khoa học

- **Thời gian thực hiện:** 17:43 (Asia/Saigon).

### 1. Yêu cầu:
- Cho phép quản trị viên tự thêm nhóm Hoạt động khoa học mới và xóa các nhóm không còn cần thiết.

### 2. Thay đổi:
- **`src/collections/ScientificActivityGroups.ts`** (mới): tạo collection quản lý tên nhóm, slug, mô tả, thứ tự hiển thị và trạng thái sử dụng.
- **`src/collections/ScientificActivities.ts`**: thay ô chọn nhóm cố định bằng quan hệ tới collection nhóm động; trường danh sách cố định cũ được ẩn để bảo toàn dữ liệu tương thích.
- **`src/app/(frontend)/page.tsx`**: lấy các nhóm đang sử dụng theo thứ tự từ Admin và tự động dựng tab Hoạt động khoa học trên trang chủ.
- **`src/components/HomeScienceTabs.tsx`**: coi danh sách nhóm động là nguồn chính; khi đã xóa hết nhóm sẽ hiển thị trạng thái chưa có nhóm thay vì phục hồi các tab cố định cũ.
- **Trang danh sách và chi tiết Hoạt động khoa học**: hiển thị tên nhóm từ quan hệ mới và không hiển thị nhóm đã xóa/ngừng sử dụng.
- **`src/lib/defaultMedia.ts`**: bổ sung hàm đọc tên nhóm quan hệ an toàn.
- **`payload.config.ts`**: đăng ký collection mới với Payload CMS và hệ thống audit.

### 3. Files Modified:
- `src/collections/ScientificActivityGroups.ts` (mới)
- `src/collections/ScientificActivities.ts`
- `payload.config.ts`
- `src/lib/defaultMedia.ts`
- `src/app/(frontend)/page.tsx`
- `src/components/HomeScienceTabs.tsx`
- `src/app/(frontend)/hoat-dong-khoa-hoc/page.tsx`
- `src/app/(frontend)/hoat-dong-khoa-hoc/[slug]/page.tsx`
- `src/payload-types.ts`
- `src/payload-generated-schema.ts`
- `src/migrations/20260912_104426_scientific_activity_groups.ts` (mới)
- `src/migrations/20260912_104426_scientific_activity_groups.json` (mới)
- `src/migrations/index.ts`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- Collection mới: `scientific-activity-groups`.
- Bài viết `scientific-activities` có quan hệ mới `categoryGroup` tới nhóm hoạt động khoa học.
- Migration `20260912_104426_scientific_activity_groups` tạo bảng nhóm, khóa ngoại/index cho bài hiện tại và bảng version, cùng quan hệ khóa nội dung của Payload.
- Migration tạo sẵn 4 nhóm ban đầu và tự động liên kết dữ liệu bài viết/version cũ theo tên nhóm; cột nhóm cố định cũ được giữ ẩn để không làm mất dữ liệu.
- Database local đã đồng bộ thành công ở batch 3; đã chuyển quan hệ cho 1 bài hiện có và 1 phiên bản của bài.

### 5. Kiểm tra hoàn tất:
- `npm run typecheck`, `npm run build` và `npm run audit:config`: đạt.
- API nhóm trả về đủ 4 nhóm mặc định; trang chủ, trang Hoạt động khoa học, Admin và hai trang quản lý collection đều phản hồi HTTP 200.

---

## [2026-09-12] - Sửa lỗi Admin Dashboard khi chuyên mục thiếu slug

- **Thời gian thực hiện:** 17:37 (Asia/Saigon).

### 1. Yêu cầu:
- Khắc phục lỗi `/admin` trả về HTTP 500 do Dashboard gọi `includes()` trên `slug = null` của một chuyên mục nội dung.

### 2. Thay đổi:
- **`src/components/admin/AdminDashboard.tsx`**:
  - Chuẩn hóa `title` và `slug` của chuyên mục động trước khi dựng thẻ thống kê.
  - Dùng chuỗi rỗng khi slug bị thiếu và không hiển thị cặp ngoặc rỗng trong mô tả.
  - Bổ sung tên dự phòng “Chuyên mục chưa đặt tên” để Dashboard không lỗi với dữ liệu cũ chưa đầy đủ.

### 3. Files Modified:
- `src/components/admin/AdminDashboard.tsx`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

### 5. Kiểm tra hoàn tất:
- `npm run typecheck`: đạt.
- `npm run build`: đạt.
- Kiểm tra runtime sau khi khởi động lại: `/admin` và `/admin/collections/scientific-activities` đều phản hồi HTTP 200; log không còn lỗi `slug.includes`.

---

## [2026-09-12] - Tạo module Admin và trang bài viết Hoạt động khoa học

- **Thời gian thực hiện:** 17:34 (Asia/Saigon).

### 1. Yêu cầu:
- Tạo một trang nội dung riêng trong Admin để thêm bài viết cho section “Hoạt động khoa học”.

### 2. Thay đổi mã nguồn và giao diện:
- **`src/collections/ScientificActivities.ts`** (mới):
  - Tạo collection Admin “Hoạt động khoa học” trong nhóm “Nội dung”.
  - Hỗ trợ tiêu đề, slug tự sinh, mô tả, nhóm hoạt động, ảnh đại diện, rich text, tệp đính kèm, ưu tiên hiển thị, ngày đăng, nguồn bài, mẫu chi tiết, cấu hình ảnh, workflow, draft/version và SEO.
  - Bốn nhóm mặc định: Đào tạo – Tập huấn; Hội nghị – Hội thảo; Kiến thức y khoa; Thông tin cho người bệnh.
- **`payload.config.ts`**: đăng ký collection `scientific-activities` với Payload CMS và audit log.
- **`src/app/(frontend)/page.tsx`**: lấy bài đã xuất bản từ collection mới và đưa vào các tab Hoạt động khoa học trên trang chủ.
- **`src/components/HomeScienceTabs.tsx`**: chuyển liên kết bài và nút xem tất cả sang `/hoat-dong-khoa-hoc`.
- **`src/app/(frontend)/hoat-dong-khoa-hoc/page.tsx`** (mới): trang danh sách, tìm kiếm và lọc theo nhóm.
- **`src/app/(frontend)/hoat-dong-khoa-hoc/[slug]/page.tsx`** (mới): trang chi tiết, SEO, breadcrumb, bài liên quan và giao diện fallback.
- **`src/components/SearchFilter.tsx`**: bổ sung nhãn giao diện cho loại nội dung Hoạt động khoa học.
- **`src/globals/Navigation.ts`**, **`src/lib/navigation.ts`**, **`src/hooks/contentWorkflow.ts`**: bổ sung liên kết menu, liên kết tham chiếu và redirect khi đổi slug.
- **`src/app/(frontend)/sitemap.ts`**: bổ sung trang danh sách và URL chi tiết bài Hoạt động khoa học vào sitemap.
- **`src/payload-types.ts`**, **`src/payload-generated-schema.ts`**: cập nhật types/schema sinh tự động.

### 3. Files Modified:
- `src/collections/ScientificActivities.ts` (mới)
- `payload.config.ts`
- `src/app/(frontend)/page.tsx`
- `src/components/HomeScienceTabs.tsx`
- `src/app/(frontend)/hoat-dong-khoa-hoc/page.tsx` (mới)
- `src/app/(frontend)/hoat-dong-khoa-hoc/[slug]/page.tsx` (mới)
- `src/components/SearchFilter.tsx`
- `src/globals/Navigation.ts`
- `src/lib/navigation.ts`
- `src/hooks/contentWorkflow.ts`
- `src/app/(frontend)/sitemap.ts`
- `src/payload-types.ts`
- `src/payload-generated-schema.ts`
- `src/migrations/20260912_102452.ts` (mới)
- `src/migrations/20260912_102452.json` (mới)
- `src/migrations/index.ts`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema:
- Collection mới: `scientific-activities`.
- Bảng chính: `scientific_activities`.
- Bảng tệp đính kèm: `scientific_activities_attachments`.
- Bảng version/draft: `_scientific_activities_v`, `_scientific_activities_v_version_attachments`.
- Thêm các enum cho `category`, `layoutTemplate`, `coverFit`, `coverPosition`, `workflowState`, `_status` và các enum tương ứng của version.
- Thêm quan hệ ảnh/tệp tới `media`, quan hệ version và các cột tham chiếu trong `payload_locked_documents_rels`, `navigation_rels`, `_navigation_v_rels`.
- Migration đồng bộ: `20260912_102452`.
- Đã baseline an toàn lịch sử migration của database phát triển hiện tại và thực thi thành công migration `20260912_102452` (batch 2); không xóa hay chuyển đổi dữ liệu nội dung cũ.

### 5. Kiểm tra hoàn tất:
- `npm run typecheck`: đạt.
- `npm run build`: đạt; Next.js nhận đủ route `/hoat-dong-khoa-hoc` và `/hoat-dong-khoa-hoc/[slug]`.
- Kiểm tra runtime: trang danh sách, API `scientific-activities` và route Admin collection đều phản hồi HTTP 200.

---

## [2026-09-12] - Chuẩn hóa toàn bộ cập nhật Thông báo thành mẫu editorial chung

### 1. Yêu cầu:
- Đưa toàn bộ cập nhật mới của phần Thông báo vào mẫu dùng chung để tự động áp dụng cho các section khác.

### 2. Thay đổi:
- **`src/app/(frontend)/page.tsx`**:
  - Chuẩn hóa hàm render editorial luôn có 5 slot (1 ô chính + 4 ô phụ); slot thiếu dữ liệu được giữ chỗ nhưng ẩn hoàn toàn.
- **`src/app/styles/30-home-editorial.css`**:
  - Chuyển tỷ lệ `60% ảnh / 40% nội dung` từ override riêng Thông báo/Tin tức vào quy tắc gốc của `.homeEditorialGrid`.
  - Chuẩn hóa tiêu đề ô chính và ô phụ ở `14.5px`, tối đa 3 dòng, vượt quá có dấu `…`.
  - Chuẩn hóa padding vùng chữ và giữ bản sửa chống cắt chữ trên tablet/mobile.
  - Xóa các selector riêng trùng lặp của `.homeNoticeSection` và `.homePortalNewsSection`.
  - Mẫu chung hiện áp dụng cho Thông báo, Tin tức, Đấu thầu, Văn bản và các section nội dung động sử dụng `editorial-grid`.
  - Mở rộng chiều cao slot trống thành quy tắc chung để mọi section ít bài vẫn giữ đúng kích thước.

### 3. Files Modified:
- `src/app/(frontend)/page.tsx`
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Đồng nhất cỡ chữ ô chính với 4 ô nội dung nhỏ

### 1. Yêu cầu:
- Giảm cỡ chữ tiêu đề ô chính của Thông báo và Tin tức bằng cỡ chữ của 4 ô nhỏ.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Giảm tiêu đề ô chính từ `21px` xuống `14.5px`, bằng chính xác tiêu đề các ô phụ.
  - Tiếp tục giữ giới hạn tối đa 3 dòng, dấu `…` và vùng nội dung không bị cắt.

### 3. Files Modified:
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Khắc phục tiêu đề ô chính bị cắt trên màn hình hẹp

### 1. Yêu cầu:
- Tiêu đề ô chính của Tin tức/Thông báo vẫn bị mất chữ dù đã giới hạn 3 dòng.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Sửa breakpoint tablet/mobile: reset `max-height: 50%` còn kế thừa từ desktop, đặt vùng chữ `height: auto`, `max-height: none` và `min-height: 180px`.
  - Bảo đảm vùng chữ đủ chỗ cho ngày, tiêu đề tối đa 3 dòng và mô tả mà không cắt giữa dòng.
  - Cân lại desktop từ `68% ảnh / 32% chữ` thành `60% ảnh / 40% chữ` để nội dung dài không bị mất, ảnh vẫn cao hơn bố cục 50/50 ban đầu.

### 3. Files Modified:
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Khôi phục cỡ chữ tiêu đề ô chính Thông báo và Tin tức

### 1. Yêu cầu:
- Đưa cỡ chữ tiêu đề ô chính của phần Thông báo và Trang tin tức về kích thước bình thường.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Giảm tiêu đề ô chính từ `25px` về mức mặc định `21px`, line-height `1.4`.
  - Tiếp tục giữ giới hạn tối đa 3 dòng và dấu `…` khi tiêu đề vượt quá.
  - Không thay đổi tỷ lệ ảnh hoặc bố cục thẻ hiện tại.

### 3. Files Modified:
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Đồng bộ cập nhật Thông báo sang Trang tin tức Bệnh viện

### 1. Yêu cầu:
- Áp dụng toàn bộ cập nhật giao diện ô nội dung của phần Thông báo sang section “Trang tin tức Bệnh viện”.

### 2. Thay đổi:
- **`src/components/HomeNewsTabs.tsx`**:
  - Gắn class riêng cho các slot tin tức trống để vẫn giữ đúng cấu trúc 1 ô chính + 4 ô phụ khi tab có ít bài.
- **`src/app/styles/30-home-editorial.css`**:
  - Áp dụng tỷ lệ `68% ảnh / 32% nội dung` cho ô tin tức chính trên desktop.
  - Áp dụng tiêu đề tối đa 3 dòng kèm dấu `…` cho cả ô chính và các ô phụ.
  - Khóa chiều cao tối thiểu `228px` cho slot trống, ngăn grid co lại và làm ô chính thấp bất thường khi tab chỉ có một bài.
  - Giữ nguyên cách hiển thị ảnh, khoảng cách và responsive theo mẫu Thông báo.

### 3. Files Modified:
- `src/components/HomeNewsTabs.tsx`
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Giới hạn tiêu đề Thông báo tối đa 3 dòng

### 1. Yêu cầu:
- Tiêu đề nội dung trong phần Thông báo hiển thị tối đa 3 dòng; nội dung vượt quá phải có dấu ba chấm.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Áp dụng line clamp 3 dòng cho tiêu đề của cả ô thông báo chính và các ô thông báo phụ.
  - Bổ sung chiều cao tối đa và `text-overflow: ellipsis` để phần vượt quá kết thúc bằng dấu `…`.
  - Giữ nguyên quy tắc 2 dòng của carousel “Điểm tin Bệnh viện”.

### 3. Files Modified:
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Tăng chiều cao ảnh ô chính phần Thông báo

### 1. Yêu cầu:
- Giảm khoảng trắng dư phía dưới ô thông báo chính bằng cách tăng ảnh xuống thấp hơn và tăng kích thước tiêu đề.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Chỉnh riêng ô chính của section Thông báo trên desktop từ bố cục `50% ảnh / 50% nội dung` thành `68% ảnh / 32% nội dung`.
  - Thu gọn padding vùng chữ để tận dụng diện tích thẻ tốt hơn.
  - Tăng tiêu đề ô chính lên `25px`, line-height `1.3` và giới hạn tối đa 2 dòng.
  - Giữ nguyên bố cục responsive hiện có trên tablet và điện thoại.

### 3. Files Modified:
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Tách CSS Module riêng cho carousel Điểm tin Bệnh viện

### 1. Yêu cầu:
- Khắc phục việc ảnh ngang và ảnh dọc vẫn tạo chiều cao khác nhau dù đã áp dụng CSS theo mẫu Chuyên gia.

### 2. Thay đổi:
- **`src/components/FeaturedContentCarousel.tsx`**:
  - Chuyển toàn bộ class của carousel sang CSS Module riêng, loại bỏ ảnh hưởng từ các selector CSS toàn cục cũ.
- **`src/components/FeaturedContentCarousel.module.css`**:
  - Tạo cấu trúc độc lập theo mẫu `OurExpertsCarousel`: grid 4 cột, thẻ flex dọc, khung ảnh tỷ lệ `1 / 1.15`, tối đa `310px`.
  - Đặt ảnh `position: absolute` trong khung và dùng `object-fit: cover`, `object-position: top center`; kích thước ảnh gốc không còn tham gia tính chiều cao khung.
  - Chuẩn hóa vùng chữ tối thiểu `90px`; tiêu đề tối đa 2 dòng và tự hiện dấu `…`.
  - Bổ sung bố cục responsive 2 cột trên tablet và 1 cột trên điện thoại.

### 3. Files Modified:
- `src/components/FeaturedContentCarousel.tsx`
- `src/components/FeaturedContentCarousel.module.css` (mới)
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Áp dụng mẫu ảnh Chuyên gia cho Điểm tin Bệnh viện

### 1. Yêu cầu:
- Lấy cách hiển thị ảnh đang hoạt động đúng tại “Chuyên gia của chúng tôi” làm mẫu cho các ô “Điểm tin Bệnh viện”.

### 2. Thay đổi:
- **`src/components/FeaturedContentCarousel.tsx`**:
  - Loại bỏ các style kích thước inline thử nghiệm để component sử dụng thống nhất mẫu CSS chuẩn.
- **`src/app/styles/30-home-editorial.css`**:
  - Áp dụng khung ảnh đứng `aspect-ratio: 1 / 1.15`, giới hạn cao `310px`, giống mẫu Chuyên gia.
  - Ảnh dùng `object-fit: cover` và `object-position: top center` giống mẫu Chuyên gia.
  - Trả thẻ về chiều cao tự nhiên với chân nội dung tối thiểu `84px`; tiêu đề tiếp tục giới hạn đúng 2 dòng và dấu `…`.
  - Đồng bộ cùng cơ chế trên desktop, tablet và điện thoại.

### 3. Files Modified:
- `src/components/FeaturedContentCarousel.tsx`
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Cố định kích thước carousel trực tiếp trên component

### 1. Yêu cầu:
- Ảnh vẫn chưa đồng đều sau khi sửa CSS; cần bảo đảm mọi ảnh và ô nội dung có kích thước giống nhau, tiêu đề dài tối đa 2 dòng.

### 2. Thay đổi:
- **`src/components/FeaturedContentCarousel.tsx`**:
  - Khóa trực tiếp chiều cao từng thẻ `270px`, khung ảnh `180px` và vùng chữ `90px` bằng style trên phần tử, tránh bị CSS bundle hoặc selector khác ghi đè.
  - Khóa ảnh tuyệt đối trong khung, `object-fit: contain`, giữ tỷ lệ và không cho kích thước ảnh gốc kéo dài thẻ.
  - Áp dụng line clamp trực tiếp lên tiêu đề để luôn giới hạn 2 dòng và kết thúc bằng dấu `…` khi bị rút gọn.

### 3. Files Modified:
- `src/components/FeaturedContentCarousel.tsx`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Khóa tuyệt đối chiều cao ảnh và giới hạn tiêu đề carousel

### 1. Yêu cầu:
- Khắc phục dứt điểm tình trạng ảnh trong các ô có chiều cao không đồng đều; tiêu đề dài chỉ hiển thị 2 dòng kèm dấu ba chấm.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Khóa đồng thời `height`, `min-height`, `max-height` và `flex-basis` của mọi khung ảnh ở `180px` trên desktop/tablet, `190px` trên điện thoại.
  - Đặt ảnh tuyệt đối bên trong khung cố định để kích thước ảnh gốc không thể kéo giãn thẻ; tiếp tục dùng `object-fit: contain`.
  - Khóa chiều cao thẻ và vùng nội dung để mọi ô bằng nhau.
  - Giới hạn tiêu đề chính xác 2 dòng bằng line clamp, ẩn phần vượt quá và hiển thị dấu `…`.

### 3. Files Modified:
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Đồng nhất chiều cao ảnh các ô Điểm tin Bệnh viện

### 1. Yêu cầu:
- Bảo đảm phần ảnh của mọi ô nội dung trong carousel có chiều cao bằng nhau.

### 2. Thay đổi:
- **`src/app/globals.css`**:
  - Khóa chiều cao khung ảnh đồng nhất `122px` trên desktop, `180px` trên tablet và `190px` trên điện thoại.
  - Cho các thẻ trong grid giãn đều chiều cao bằng `align-items: stretch`.
  - Tiếp tục giữ `object-fit: contain` để ảnh không méo và không bị cắt xén.

### 3. Files Modified:
- `src/app/globals.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Chuẩn hóa tỷ lệ ảnh và rút ngắn ô nội dung carousel

### 1. Yêu cầu:
- Rút ngắn phần nội dung chữ và áp dụng một tỷ lệ ảnh thống nhất cho tất cả các ô trong carousel “Điểm tin Bệnh viện”.

### 2. Thay đổi:
- **`src/app/globals.css`**:
  - Chuẩn hóa tất cả thẻ carousel thành bố cục dọc đồng nhất.
  - Khóa toàn bộ khung ảnh ở tỷ lệ `16:9`, không cho phần nội dung làm thay đổi tỷ lệ ảnh.
  - Rút phần chữ xuống `82px`, giảm padding và cỡ tiêu đề, giới hạn tiêu đề tối đa 2 dòng.
  - Ẩn đoạn mô tả trong thẻ để các ô ngắn, đều chiều cao và tập trung vào ảnh, ngày, tiêu đề.

### 3. Files Modified:
- `src/app/globals.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

## [2026-09-12] - Hiển thị trọn ảnh trong carousel Điểm tin Bệnh viện

### 1. Yêu cầu:
- Sửa ảnh trong các ô nội dung của carousel “Điểm tin Bệnh viện” để không bị biến dạng hoặc cắt xén và hiển thị đầy đủ trong khung.

### 2. Thay đổi:
- **`src/components/FeaturedContentCarousel.tsx`**: chuyển ảnh từ CSS `background-image` sang thẻ `<img>` có nội dung thay thế, lazy loading và async decoding.
- **`src/app/globals.css`**: cố định khung ảnh 16:9, `overflow: hidden`; ảnh dùng `object-fit: contain` và `object-position: center center` để giữ nguyên tỷ lệ, hiển thị trọn ảnh.
- **`src/app/styles/30-home-editorial.css`**: loại carousel khỏi selector ép `background-size: cover` gây cắt ảnh và bổ sung rule riêng bảo vệ chế độ `contain`.

### 3. Files Modified:
- `src/components/FeaturedContentCarousel.tsx`
- `src/app/globals.css`
- `src/app/styles/30-home-editorial.css`
- `CHANGELOG.md`

### 4. Thay đổi Database / Collections / Schema: **Không có**.

---

Tài liệu này lưu trữ toàn bộ các thay đổi về mã nguồn, cấu hình, giao diện và đặc biệt là **Cấu trúc Cơ sở dữ liệu (Database Schema / Collections / Globals)** để hỗ trợ đồng bộ khi chuyển máy hoặc triển khai môi trường mới.

---

## [2026-09-12 16:25] - Thực thi đồng bộ Database & Tự động hóa Migration từ CHANGELOG

### 1. Yêu cầu:
- Tiến hành cập nhật toàn diện theo các thay đổi trong `CHANGELOG.md` (bao gồm schema database, kiểm tra build và script tự động).

### 2. Thay đổi Thực hiện:
- **Thực thi SQL Migration**:
  - Đã chạy thành công 12 câu lệnh DDL `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` bổ sung các trường `cover_fit` và `cover_position` cho `notices`, `news`, `procurement` và các bảng version tương ứng.
- **Tự động hóa Migration**:
  - Tạo tệp `scripts/apply-changelog-migrations.mjs` để tự động hóa toàn bộ việc đồng bộ schema PostgreSQL mỗi khi chuyển môi trường.
  - Bổ sung lệnh `npm run migrate:changelog` vào `package.json`.
- **Kiểm tra chất lượng**:
  - `npm run typecheck`: Đạt 100% không lỗi.
  - `npm run build`: Hoàn tất thành công toàn bộ 34 routes và compilation.

### 3. Thay đổi Database / Schema:
- Đã đồng bộ đầy đủ các cột mới vào database PostgreSQL tại máy phát triển.

---

## [2026-09-12] - Cân đối ô nội dung chính: Chiều cao ảnh chiếm 50% khung (nửa khung ảnh, nửa khung chữ)

### 1. Yêu cầu:
- Chiều cao ảnh hiển thị đúng nửa khung (50%) của ô nội dung chính trong section Thông báo và Tin tức.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Ô lớn (`.homeEditorialGrid > a.featured`): thiết lập phần ảnh `.homeEditorialImage` chiếm chính xác `50%` chiều cao thẻ (`flex: 0 0 50%; height: 50%`), loại bỏ giới hạn cứng `max-height`.
  - Phần nội dung văn bản `.homeEditorialCopy` chiếm `50%` chiều cao còn lại (`flex: 0 0 50%; height: 50%`), tạo tỉ lệ 1:1 hoàn hảo giữa ảnh và phần chữ.
  - Bổ sung responsive linh hoạt cho tablet (`height: 300px`) và mobile (`height: 220px`).

### 3. Thay đổi Database / Schema: **Không có**.

## [2026-09-12] - Tăng chiều cao ảnh và cỡ chữ cho ô chính (Featured Hero Card)

### 1. Yêu cầu:
- Ở section thông báo (và grid tin tức), ô chính hiển thị nội dung: tăng chiều cao ảnh lên và tăng cỡ chữ lớn hơn.

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Khung ảnh ô lớn (`.homeEditorialGrid > a.featured .homeEditorialImage`): tăng tỷ lệ từ `16 / 10` lên `16 / 11`, tăng `max-height` từ `320px` lên `380px` (min-height `320px`), giúp ảnh hiển thị thoáng đãng và bề thế hơn.
  - Nhãn chuyên mục (`badge`): tăng font size lên `11.5px`, `font-weight: 850`, padding `5px 13px`.
  - Ngày cập nhật (`small`): tăng font size từ `12px` lên `13.5px`, `font-weight: 700`, màu xanh thương hiệu `#0878d1`.
  - Tiêu đề (`h3`): tăng kích cỡ từ `18px` lên **`21px`**, `font-weight: 800`, giãn cách đẹp mắt hơn.
  - Tóm tắt mô tả (`p`): tăng font size từ `13.5px` lên **`15px`**, line-height `1.6`, màu `#526e85` giúp người đọc dễ tiếp cận thông tin.

### 3. Thay đổi Database / Schema: **Không có**.

## [2026-09-12] - Hoàn nguyên về bản form Editorial Grid chuẩn (Ảnh trên, Text dưới)

### 1. Yêu cầu:
- Hoàn nguyên (rollback) về bản trước khi điều chỉnh overlay style theo yêu cầu của người dùng.
- Duy trì form chuẩn Editorial Grid (giống section Thông báo): 1 ô lớn bên trái (ảnh trên max-height 320px kèm badge + mô tả tóm tắt bên dưới) và 4 ô nhỏ bên phải (ảnh trên max-height 175px, tiêu đề ngày tháng bên dưới).

### 2. Thay đổi:
- **`src/app/styles/30-home-editorial.css`**:
  - Hoàn nguyên ô lớn `.homeEditorialGrid > a.featured`: ảnh trên tỉ lệ `16 / 10`, `max-height: 320px`, `object-fit: cover`, có badge chuyên mục góc dưới ảnh; phần text bên dưới có tiêu đề, ngày và đoạn trích tóm tắt `p`.
  - Bỏ toàn bộ css của overlay (`featuredOverlay`, `featuredImg`, `featuredBg`).
- **`src/components/HomeNewsTabs.tsx`**:
  - Hoàn nguyên cấu trúc thẻ bài viết: ô lớn dùng `homeEditorialImage` (chứa `img` + `span` badge) và `homeEditorialCopy` (chứa ngày, tiêu đề, tóm tắt `excerpt`).
  - 4 ô nhỏ dùng ảnh trên, tiêu đề và ngày bên dưới.
- **`src/app/(frontend)/page.tsx`**:
  - Hoàn nguyên `renderEditorialSection` ở section Thông báo về cùng cấu trúc chuẩn ảnh trên, text dưới.

### 3. Thay đổi Database / Schema: **Không có**.

## [2026-09-12] - Áp dụng form editorial grid Section Thông báo cho Trang Tin tức & các Tab

### 1. Yêu cầu:
- Sử dụng cùng form/layout của "Section Thông báo" (editorial grid) cho trang tin tức và tất cả các tab.

### 2. Thay đổi:
- **`src/components/HomeNewsTabs.tsx`** (viết lại hoàn toàn):
  - Dùng đúng class `homeEditorialGrid` (thay vì `tabEditorialGrid`) — cùng grid CSS với section Thông báo.
  - Dùng `<img class="editorialImg">` thật với `object-fit: cover`, `object-position: top center` — không dùng `background-image`.
  - Ô lớn: `aspect-ratio: 16/10`, `max-height: 320px`, có badge chuyên mục overlay, có `<p>` excerpt.
  - 4 ô nhỏ: `aspect-ratio: 16/10.5`, `max-height: 175px`, không badge, không excerpt.
  - Hover zoom `scale(1.05)` trên ảnh — đồng bộ với section thông báo.
  - Luôn render đúng 5 slot (1 lớn + 4 nhỏ); ô thiếu bài → `<EmptyCard>` ẩn (`opacity: 0`).
  - Áp dụng cho tất cả các tab.
- **`src/app/(frontend)/page.tsx`**:
  - Thêm class `homePortalPage` vào section `news-portal` để tất cả selector trong `30-home-editorial.css` hoạt động đúng.

### 3. Thay đổi Database / Schema: **Không có**.

## [2026-09-12] - Fix triệt để ảnh bị cắt xén & layout 1 lớn + 4 nhỏ cố định

### 1. Yêu cầu:
- Ảnh trong 4 ô nhỏ vẫn còn bị cắt xén → fix dứt điểm, tăng chiều dài ảnh.
- Khi tab chỉ có 1 bài vẫn phải hiển thị layout "1 ô lớn + 4 ô nhỏ" (không collapse full-width).
- Áp dụng cho tất cả các tab.

### 2. Thay đổi:
- **`src/components/HomeNewsTabs.tsx`**:
  - Bỏ logic `single` (collapse 1 cột) — luôn render 2 cột cố định.
  - Tạo mảng `sideItems` cố định 4 phần tử; ô thiếu bài → render `<div class="tabSideEmpty">` (placeholder ẩn, giữ grid ổn định).
  - Side card dùng class `portalNewsThumb` (thay vì `portalNewsImage`) để áp dụng `background-size: contain` (không cắt ảnh).
- **`src/app/globals.css`**:
  - Thêm `.portalNewsThumb`: `background-size: contain`, `background-color: #eaf4fc`, `width: 180px`.
  - Thêm `.tabSideEmpty`: placeholder ẩn (`opacity: 0`), giữ layout grid.
  - Bỏ `.tabEditorialGrid.single` override.
  - Cập nhật selector side card: `grid-template-columns: 180px minmax(0, 1fr)`.
  - Side card image: `background-size: contain`, `background-color: #eaf4fc`.
- **`src/app/styles/30-home-editorial.css`**:
  - Thêm `.portalNewsThumb` vào selector side card; `width/min-width: 180px`, `background-size: contain`.

### 3. Thay đổi Database / Schema: **Không có**.

## [2026-09-12] - Cải thiện giao diện Trang tin tức bệnh viện (HomeNewsTabs)

### 1. Yêu cầu của người dùng:
- Fix ảnh vừa khung, không cắt xén / biến dạng ảnh trên 4 ô nhỏ và ô tiêu điểm.
- Tăng chiều cao ô nhỏ và chiều rộng ảnh trong ô nhỏ.
- Bỏ nhãn chuyên mục ("TIN Y TẾ", v.v.) ở các ô nhỏ bên phải.
- Áp dụng cho tất cả các tab (Tin y tế, Tin Hoạt Động, v.v.).

### 2. Thay đổi Mã nguồn & Giao diện:
- **`src/components/HomeNewsTabs.tsx`**:
  - Bỏ `<span>{item.category}</span>` (nhãn chuyên mục) khỏi 4 ô nhỏ `tabSideCard` — giữ nguyên badge trên ô tiêu điểm lớn.
- **`src/app/globals.css`**:
  - Tăng `min-height` của `.tabSideCard` từ `104px` → `130px`.
  - Tăng chiều rộng cột ảnh của 4 ô nhỏ từ `138px` → `168px`.
  - Tăng `min-height` của ảnh từ `102px` → `128px`.
  - Áp dụng `object-position: top center` và `background-position: top center` để không cắt mất phần đầu/mặt người trong ảnh.
  - Tăng chiều cao ảnh ô tiêu điểm từ `270px` → `300px`.
  - Cập nhật responsive breakpoint `max-width: 520px`: cột ảnh `108px` → `120px`.
- **`src/app/styles/30-home-editorial.css`**:
  - Tăng chiều rộng ảnh ô nhỏ từ `140px` → `168px`, `min-height` từ `108px` → `128px`.
  - Đổi `background-position: center` → `top center` cho cả ô tiêu điểm lẫn ô nhỏ.

### 3. Thay đổi Database / Schema: **Không có**.

## [2026-09-12] - Cấu hình hiển thị ảnh đại diện, chống mất đầu ảnh, tối ưu kích thước khối Thông báo & Lỗi font RichText

### 1. Yêu cầu của người dùng:
- Khắc phục lỗi font khi soạn thảo trong Admin RichText.
- Ảnh trong chi tiết bài viết fix vừa khung, canh giữa, không cắt xén làm biến dạng ảnh.
- Phần thông báo 4 ô phụ mở rộng nội dung và tăng chiều cao ảnh.
- Ảnh bị cắt mất phần đầu: Thêm cấu hình góc lấy nét / vừa vặn chi tiết và tăng chiều cao ảnh/nội dung.
- Thiết lập quy tắc bắt buộc ghi chú nhật ký thay đổi và cấu trúc database.

### 2. Thay đổi Cơ sở dữ liệu / Schema (Payload Collections):
- **Thêm trường cấu hình ảnh vào `Notices` (`src/collections/Notices.ts`)**:
  - `coverFit` (Type: `select`):
    - Giá trị: `'cover'` (Lấp đầy khung - Mặc định) | `'contain'` (Vừa vặn toàn bộ ảnh 100%, không cắt xén).
    - Vị trí: Sidebar.
  - `coverPosition` (Type: `select`):
    - Giá trị: `'top'` (Ưu tiên đỉnh đầu/mặt - Mặc định) | `'center'` (Chính giữa) | `'bottom'` (Phía dưới).
    - Vị trí: Sidebar.
- **Thêm trường cấu hình ảnh vào `News` (`src/collections/News.ts`)**:
  - Tương tự, bổ sung `coverFit` và `coverPosition` vào Sidebar.
- **Thêm trường cấu hình ảnh vào `Procurement` (`src/collections/Procurement.ts`)**:
  - Bổ sung `coverFit` và `coverPosition` vào Sidebar.
- **Thư viện dùng chung `src/fields/common.ts`**:
  - Xuất `imageDisplayFields` chứa định nghĩa hai trường `coverFit` và `coverPosition`.

> **Lưu ý & Câu lệnh SQL đồng bộ Database khi chuyển máy khác / Triển khai server mới**:
> Các cột mới được thêm vào database PostgreSQL tương ứng với các trường mới của collection:
> ```sql
> ALTER TABLE notices ADD COLUMN IF NOT EXISTS cover_fit VARCHAR DEFAULT 'cover';
> ALTER TABLE notices ADD COLUMN IF NOT EXISTS cover_position VARCHAR DEFAULT 'top';
> ALTER TABLE news ADD COLUMN IF NOT EXISTS cover_fit VARCHAR DEFAULT 'cover';
> ALTER TABLE news ADD COLUMN IF NOT EXISTS cover_position VARCHAR DEFAULT 'top';
> ALTER TABLE procurement ADD COLUMN IF NOT EXISTS cover_fit VARCHAR DEFAULT 'cover';
> ALTER TABLE procurement ADD COLUMN IF NOT EXISTS cover_position VARCHAR DEFAULT 'top';
> ALTER TABLE _notices_v ADD COLUMN IF NOT EXISTS version_cover_fit VARCHAR DEFAULT 'cover';
> ALTER TABLE _notices_v ADD COLUMN IF NOT EXISTS version_cover_position VARCHAR DEFAULT 'top';
> ALTER TABLE _news_v ADD COLUMN IF NOT EXISTS version_cover_fit VARCHAR DEFAULT 'cover';
> ALTER TABLE _news_v ADD COLUMN IF NOT EXISTS version_cover_position VARCHAR DEFAULT 'top';
> ALTER TABLE _procurement_v ADD COLUMN IF NOT EXISTS version_cover_fit VARCHAR DEFAULT 'cover';
> ALTER TABLE _procurement_v ADD COLUMN IF NOT EXISTS version_cover_position VARCHAR DEFAULT 'top';
> ```
> Toàn bộ dữ liệu bài viết cũ được giữ nguyên vẹn 100%, không bị ảnh hưởng.

### 3. Thay đổi Mã nguồn & Giao diện (Frontend & Styling):
- **`src/app/(frontend)/page.tsx`**:
  - Truyền `coverFit` và `coverPosition` từ `notices`, `procurement`, `documents`, `content-section` vào `renderEditorialSection`.
  - Trong `renderEditorialSection`:
    - Áp dụng `objectFit: entry.coverFit === 'contain' ? 'contain' : 'cover'`.
    - Áp dụng `objectPosition` linh hoạt theo cấu hình (mặc định ưu tiên `top center` để không mất đầu người).
    - Tăng `maxHeight` ảnh: ô tiêu điểm tăng lên `320px`, 4 ô phụ tăng từ `150px` lên `175px`.
    - Tăng padding ô nội dung: ô tiêu điểm `20px 22px 22px`, ô phụ `16px 18px 18px`.
    - Khi ảnh chọn `contain`, tự động áp dụng nền xám xanh pastel `#f4f8fb` dịu mắt, căn giữa.
- **`src/app/styles/30-home-editorial.css`**:
  - Cập nhật chiều cao và căn chỉnh góc `top center` cho các ô thông báo.
- **`src/app/globals.css` & `src/components/ArticleDetailTemplate.module.css`**:
  - Chuẩn hóa hiển thị ảnh bài viết chi tiết: `object-fit: contain`, `max-height: 800px`, `width: auto`, canh giữa trang không biến dạng.
  - Thiết lập font hệ thống chuẩn tiếng Việt (Inter, Roboto, Arial, sans-serif) cho toàn bộ trình soạn thảo Admin và chi tiết bài viết, ngăn chặn lỗi font khi gõ tiếng Việt có dấu.
- **`AGENTS.md`**:
  - Bổ sung Điều lệ bắt buộc số 3: Tự động ghi chép chi tiết nhật ký thay đổi và cấu trúc Database vào `CHANGELOG.md` cho mỗi lần chỉnh sửa tiếp theo.

---

## [2026-09-12 15:52] - Chuẩn hóa tỷ lệ ô chính Thông báo / Editorial Grid (Ảnh chiếm chính xác 50% khung)

### 1. Yêu cầu:
- Khóa cố định chiều cao ảnh ô chính (featured card) chiếm đúng 50% chiều cao của toàn bộ khung ô lớn, nửa dưới 50% là nội dung thông tin (ngày, tiêu đề, tóm tắt) để đảm bảo bố cục hài hòa, cân đối tuyệt đối.

### 2. Thay đổi Mã nguồn & Giao diện (Files Modified):
- **`src/app/styles/30-home-editorial.css`**:
  - `.homePortalPage .homeEditorialGrid > a.featured .homeEditorialImage`: Thiết lập `flex: 1 1 50%`, `height: 50%`, `max-height: 50%`, `min-height: 0` để khóa cứng chính xác nửa trên khung hình.
  - `.homePortalPage .homeEditorialGrid > a.featured .homeEditorialImage .editorialImg`: Đặt `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center` giúp hình ảnh tự động lấp đầy trọn vẹn 50% khung mà không bị co méo hay sai lệch tỷ lệ.
  - `.homePortalPage .homeEditorialGrid > a.featured .homeEditorialCopy`: Thiết lập `flex: 1 1 50%`, `height: 50%`, `max-height: 50%`, `min-height: 0` cho phần chữ ở nửa dưới, padding rộng rãi, bố cục hài hòa không bị khoảng trống thừa.

### 3. Thay đổi Database/Schema:
- Không thay đổi schema cơ sở dữ liệu.

## [2026-09-16] Mobile Menu - Thiết kế lại kiểu medpro.vn (Hamburger Top Bar)

**Yêu cầu:** Thiết kế lại menu mobile có dấu 3 gạch (☰) trên góc, bấm vào hiển thị toàn bộ menu, tham khảo medpro.vn.

**Files Modified:**
- src/components/MobileTopBar.tsx [NEW] — Component top bar mobile: logo + tên BV (trái) + nút gọi + hamburger ☰ (phải). Bấm hamburger mở panel menu slide-down.
- src/components/SiteHeader.tsx — Import và render MobileTopBar (ngoài mainHeader), truyền props logo/hospitalName/hotline/items/medproUrl.
- src/app/styles/mobile-medpro.css — Viết lại hoàn toàn: top bar cố định 56px, menu panel slide-down từ top bar, ẩn toàn bộ desktop header trên mobile, bỏ bottom action bar cũ.

**Thay đổi thiết kế:**
- Ẩn: utilityBar, hospitalMasthead, mainHeader, scrollingNotice, mobileActionBar trên < 900px
- Hiện: .mobileTopBar (fixed, 56px, gradient xanh)
- Menu panel: .mobileMenuPanel slide xuống từ top bar, có quick actions (Lịch khám / Đặt khám / Cấp cứu) + danh sách nav accordion
- Không thay đổi database

