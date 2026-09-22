# CURRENT TASK — Khắc phục lỗi mất khối nội dung bên phải (editorialRowList) trên điện thoại

## Trạng thái: HOÀN THÀNH

## Nguyên nhân gốc rễ
1. **Lỗi sụp chiều cao 0px trên WebKit/Safari di động**:
   - Layout Phương án 3 gồm 2 cột: Cột trái (`.editorialHeroCard` - bài nổi bật) và Cột phải (`.editorialRowList` - danh sách các bài phụ).
   - Trên desktop, `.editorialRowList` được đặt `height: 100%` để kéo dãn đều theo cột trái.
   - Khi chuyển sang màn hình di động (<= 900px và <= 600px), layout chuyển thành 1 cột dọc (`grid-template-columns: 1fr`). Hàng thứ 2 chứa `.editorialRowList` có chiều cao `auto`.
   - Trong CSS Grid của Safari/WebKit (iPhone), phần tử mang `height: 100%` nằm trong track `auto` sẽ bị tính thành **0px** do không xác định được chiều cao cha.
   - Do thẻ cha `.configurableHomeSection` có `overflow: hidden`, toàn bộ khối nội dung bên phải (`.editorialRowList`) bị sụp chiều cao và ẩn mất hoàn toàn trên điện thoại.
2. **Kích thước thẻ hero quá lớn**:
   - Khung ảnh và thân thẻ hero chiếm trọn chiều cao màn hình điện thoại khiến người dùng khó nhận biết các bài bên dưới nếu không tối ưu tỷ lệ ảnh.
3. **Thẻ rỗng khi chỉ có 1 bài**:
   - Khi tab chỉ có 1 bài, một thẻ `<div className="editorialRowList"></div>` rỗng vẫn được render trong grid, gây nhiễu layout.

## Đã thực hiện
1. **Định hình lại toàn bộ responsive cho Cột Phải (`.editorialRowList`) trên mobile** ([`src/app/styles/30-home-editorial.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/styles/30-home-editorial.css)):
   - Thêm quy tắc tại `@media (max-width: 900px)` và `@media (max-width: 600px)`:
     - Chuyển `.editorialRowList` thành `height: auto !important`, `min-height: auto`, `justify-content: flex-start !important`, `display: flex !important; flex-direction: column !important`, `width: 100% !important`.
     - Chuyển `.editorialRowItem` thành `flex: 0 0 auto !important`, `min-height: 70px !important`, `height: auto !important`, loại bỏ nguy cơ co rút về 0.
     - Tinh chỉnh `.editorialHeroCard` thành `height: auto !important`, `.editorialHeroThumb` tỉ lệ `16:9` (max-height: 200px) để bố cục gọn gàng, dành không gian hiển thị ngay các bài thuộc khối bên phải bên dưới.
2. **Khắc phục render thẻ rỗng**:
   - [`src/components/ScheduleExplorer.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/ScheduleExplorer.tsx), [`src/components/VaccinationTabs.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/VaccinationTabs.tsx), [`src/components/HomeNewsTabs.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/HomeNewsTabs.tsx), [`src/components/HomeScienceTabs.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/HomeScienceTabs.tsx): Chỉ render `<div className="editorialRowList">` khi thực sự có từ 2 bài trở lên (`visibleItems.length > 1` / `sideItems.length > 0`).

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi).
