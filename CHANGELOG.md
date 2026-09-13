# NHẬT KÝ THAY ĐỔI DỰ ÁN (PROJECT CHANGELOG & DATABASE UPDATES)

## [2026-09-13] - Đưa Toàn Bộ Tùy Chỉnh Menu Chính & Menu Thả Xuống (Dropdown) Vào Admin CMS

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
