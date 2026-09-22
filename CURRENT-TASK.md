# CURRENT TASK — Khắc phục lỗi cắt chữ thẻ lịch khám bệnh trên điện thoại

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. **Khắc phục lỗi cắt chữ và tràn khung trên mobile** ([`src/app/styles/30-home-editorial.css`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/styles/30-home-editorial.css)):
   - Khắc phục lỗi khi có 1 bài: `.editorialVariant3.single` trên màn hình di động (≤ 900px) được thiết lập lại `grid-template-columns: 1fr` thay vì bị cố định `minmax(0, 680px)`, loại bỏ nguyên nhân thẻ bị phình to vượt quá chiều rộng màn hình điện thoại dẫn đến mép phải bị cắt.
   - Thêm `width: 100%`, `max-width: 100%`, `box-sizing: border-box` cho `.editorialHeroCard`, `.editorialHeroThumb`, `.editorialHeroBody`, `.editorialRowItem` trên thiết bị di động (≤ 600px).
   - Thiết lập `max-width: 100%`, `overflow-wrap: anywhere`, `word-break: break-word` cho `.editorialHeroTitle`, `.editorialHeroDate`, `.editorialHeroExcerpt`, `.editorialHeroAction` để đảm bảo văn bản tự động xuống dòng và luôn hiển thị trọn vẹn trong viền thẻ, không bị tràn hay cắt chữ ở mép phải.

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi).
