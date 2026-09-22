# CURRENT TASK — Khắc phục lỗi chọn Phòng chức năng & Khoa chuyên môn trong Sơ đồ tổ chức

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. **Payload Admin Filter Fix** ([`src/globals/OrganizationChart.ts`](file:///f:/20.9%20web/bvdkthoilai-main/src/globals/OrganizationChart.ts)):
   - Trong `OrganizationChart.ts`, trường `offices` (Phòng chức năng) và `departments` (Khoa chuyên môn) trước đây chỉ lọc theo cột `kind: { equals: 'office' }`.
   - Tuy nhiên trong CSDL, các phòng chức năng được lưu loại chuẩn qua trường `unitType = 'office'`, còn trường `kind` mang giá trị lịch sử `clinical`. Do đó dropdown lọc ra 0 kết quả ("Không có lựa chọn").
   - Đã cập nhật `filterOptions`:
     - **Phòng chức năng**: Lọc điều kiện linh hoạt `or: [{ unitType: { equals: 'office' } }, { kind: { equals: 'office' } }]` ➔ hiển thị đầy đủ 4 Phòng chức năng (Tổ chức - Hành chính, Kế hoạch tổng hợp, Tài chính - Kế toán, Điều dưỡng).
     - **Khoa chuyên môn**: Lọc điều kiện `and: [{ unitType: { not_equals: 'office' } }, { kind: { not_equals: 'office' } }]` ➔ hiển thị đúng danh sách các khoa, không lẫn phòng chức năng.
2. **Frontend Organization Chart** ([`src/app/(frontend)/so-do-to-chuc/page.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/so-do-to-chuc/page.tsx)):
   - Đảm bảo hiển thị chuẩn xác 3 cột:
     - Cột 1: Khối Phòng Chức năng / VP
     - Cột 2: Khối Lâm sàng - Khoa
     - Cột 3: Khối Cận lâm sàng
   - Hoạt động mượt mà cả khi Admin thiết lập tùy biến hoặc khi để mặc định tự động đọc từ CSDL.

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi)



