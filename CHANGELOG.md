# NHẬT KÝ THAY ĐỔI DỰ ÁN (PROJECT CHANGELOG & DATABASE UPDATES)

Tài liệu này lưu trữ toàn bộ các thay đổi về mã nguồn, cấu hình, giao diện và đặc biệt là **Cấu trúc Cơ sở dữ liệu (Database Schema / Collections / Globals)** để hỗ trợ đồng bộ khi chuyển máy hoặc triển khai môi trường mới.

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

