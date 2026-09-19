# CURRENT TASK

## Trạng thái
HOÀN THÀNH — TỐI ƯU GIAO DIỆN CHUYÊN GIA TRÊN ĐIỆN THOẠI (MOBILE)

## Mục tiêu
Thiết kế lại khối "Chuyên gia của chúng tôi" trên giao diện điện thoại (mobile) đồng nhất, thanh lịch như desktop, hiển thị ngắn gọn 1 thẻ chuyên nghiệp tại một thời điểm, loại bỏ tình trạng chia quá nhiều ô chồng chéo.

## Đã thực hiện
- Tinh chỉnh `OurExpertsFeaturedGrid.module.css`:
  - Ẩn lưới phụ (sub-grid) nhiều ô trên mobile (`<= 600px`).
  - Thiết kế thẻ chuyên gia chính hiển thị thanh lịch, bo góc 16px, hình ảnh và tỷ lệ đồng nhất như desktop.
  - Tối ưu kích thước chữ, huy hiệu và nút bấm hành động chuẩn màn hình cảm ứng di động.
  - Cung cấp bộ nút chuyển tròn `< >` (44px) nổi bật, dễ thao tác dưới thẻ.
- Cập nhật logic trong `OurExpertsFeaturedGrid.tsx`:
  - Trên mobile, các nút chuyển trước/sau và thao tác vuốt chạm (swipe) trực tiếp chuyển đổi lần lượt qua từng chuyên gia trong danh sách.
  - Cơ chế tự động chuyển vòng tròn (Autoplay) mượt mà qua từng chuyên gia.

## Files sửa đổi
- `src/components/OurExpertsFeaturedGrid.module.css`
- `src/components/OurExpertsFeaturedGrid.tsx`

## Validation
- `npx tsc --noEmit`: Đạt (0 errors).
