# CURRENT TASK — Khắc phục lỗi tiêu đề bài viết chính của phần tin tức bị thiếu trên điện thoại

## Trạng thái: HOÀN THÀNH

## Nguyên nhân gốc rễ
1. **Xung đột selector CSS dạng lưới cũ (`30-home-editorial.css`)**:
   - Khối bài viết chính (Phương án 3) sử dụng thẻ `<a className="editorialHeroCard">`.
   - Trước đó thẻ chưa có class `featured`, nên trên màn hình điện thoại (<= 600px), quy tắc kế thừa:
     `.homePortalPage .homeEditorialGrid > a:not(.featured)`
     đã áp dụng nhầm lên `.editorialHeroCard`.
   - Quy tắc này đặt `flex-direction: row` và `align-items: stretch`.
   - Khi chuyển sang chiều ngang (`row`), phần ảnh thumbnail chiếm trọn 100% bề ngang, đẩy toàn bộ phần thân nội dung (`.editorialHeroBody` chứa ngày, tiêu đề, tóm tắt và nút xem chi tiết) dạt sang bên phải ra khỏi màn hình.
   - Kết hợp với thuộc tính `overflow: hidden`, phần chữ bị che khuất hoàn toàn, để lại khoảng trắng rỗng bên dưới ảnh.

## Đã thực hiện
1. **Cô lập và bảo vệ thuộc tính của Hero Card** ([`src/app/styles/30-home-editorial.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/styles/30-home-editorial.css)):
   - Khóa chặt `display: flex !important; flex-direction: column !important; align-items: stretch !important;` cho `.editorialHeroCard` ở toàn bộ các kích thước (mặc định, <= 900px, <= 600px).
   - Đảm bảo `.editorialHeroBody` luôn là `flex-direction: column !important; flex: 1 1 auto !important; width: 100% !important;` nằm ngay bên dưới ảnh.
   - Thêm bộ lọc `:not(.editorialVariant3)` cho các bộ chọn lưới cũ `.homePortalPage .homeEditorialGrid:not(.editorialVariant3) > a:not(.featured)` để tránh ảnh hưởng chéo lên các layout mới.
2. **Đồng bộ class `featured` trên các component**:
   - Thêm `featured` vào thẻ link bài viết chính (`editorialHeroCard featured`) tại:
     - [`src/components/HomeNewsTabs.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/HomeNewsTabs.tsx)
     - [`src/components/HomeScienceTabs.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/HomeScienceTabs.tsx)
     - [`src/components/ScheduleExplorer.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/ScheduleExplorer.tsx)
     - [`src/app/(frontend)/page.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/page.tsx)

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi).
- Kiểm tra SSR localhost:200 OK, `editorialHeroCard featured` hiển thị đầy đủ ngày, tiêu đề, trích dẫn.
