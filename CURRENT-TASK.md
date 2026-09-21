# CURRENT TASK — Tối ưu tỷ lệ khung ảnh Kỹ thuật chuyên sâu (4:3) & Đồng bộ hệ thống thẻ 16:9

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. [`src/components/AdvancedTechniquesCarousel.module.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/AdvancedTechniquesCarousel.module.css):
   - Chuyển tỷ lệ khung ảnh `.techCardImage` của mục **Kỹ thuật chuyên sâu** sang tỷ lệ **`4 / 3`** (tăng chiều cao đáng kể so với 16:9, khung ảnh cao ráo, thoáng mắt, hiển thị ảnh ngang/dọc đều rõ ràng và không bị hẹp).
   - Bỏ giới hạn chiều cao cũ để các thẻ linh hoạt theo kích cỡ màn hình.
2. [`src/components/FeaturedContentCarousel.module.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/FeaturedContentCarousel.module.css) & [`FeaturedContentCarousel.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/FeaturedContentCarousel.tsx):
   - Chuyển tỷ lệ khung ảnh `.imageFrame` mục Điểm tin / Tin nổi bật sang chuẩn **`16 / 9`**.
3. [`src/app/styles/30-home-editorial.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/styles/30-home-editorial.css):
   - `.editorialRowThumb`: đổi sang `112px × 63px` (`aspect-ratio: 16 / 9`), mobile `96px × 54px`.
4. [`src/app/globals.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/globals.css):
   - Cập nhật `.homeScheduleSection` và `.homeVaccinationSection` cho các thẻ con bên phải sang tỷ lệ chuẩn 16:9 (`112px × 63px`).
5. [`src/components/SearchFilter.module.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/components/SearchFilter.module.css):
   - Chuẩn hóa khung thẻ bài viết danh sách trang `/lich-kham` sang tỷ lệ chuẩn `16 / 9`.

## Kiểm tra
- `git status -s`: PASS. Tất cả các khối hiển thị đã quy về chuẩn ngang 16:9 đồng nhất.
