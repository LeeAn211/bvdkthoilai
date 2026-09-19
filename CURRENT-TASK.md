# CURRENT TASK

## Trạng thái
HOÀN THÀNH — NỔI BẬT THƯỜNG TRỰC BAN GIÁM ĐỐC TRÊN BẢNG LỊCH TRỰC TUẦN

## Đã thực hiện
1. **Component Hiển thị (`src/components/EmergencyMatrixView.tsx`)**:
   - Nhận diện hàng Thường trực Lãnh đạo / Ban Giám đốc (`isLeadership`).
   - Tách riêng class `emergDirectorRow`, `emergMergedDirectorCell`, `emergDirectorCard`.
   - Bổ sung huy hiệu y tế uy tín: **"NGƯỜI CHỊU TRÁCH NHIỆM CHÍNH"** bên cạnh tên Giám đốc.
2. **Kiểu dáng và Trực quan hóa Cao cấp (`src/app/styles/daily-schedule.css`)**:
   - **Hàng Lãnh đạo VIP**: Nền vàng hổ phách hoàng kim (`linear-gradient(90deg, #fffbeb 0%, #fef3c7 45%, #fffbeb 100%)`), dải viền trái màu hổ phách đậm 5px (`#d97706`).
   - **Tag Tiêu đề**: Gradient vàng cam sang trọng (`#b45309` → `#d97706` → `#f59e0b`), chữ in hoa đậm nét, icon khiên bảo trợ phát sáng.
   - **Tên Bác sĩ Giám đốc**: Phông chữ cỡ lớn 17px, đậm 950 (`#78350f`), hiển thị rõ ràng và uy nghiêm.
   - **Nút gọi SĐT**: Khung viền kép vàng hổ phách, chữ số to rõ, hỗ trợ bấm gọi ngay lập tức (`tel:`) với hiệu ứng hover bóng bẩy.
3. **Validation**:
   - `npm run typecheck`: Pass 100% không có lỗi.
