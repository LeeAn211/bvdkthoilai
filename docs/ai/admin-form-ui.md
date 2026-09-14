# Admin Form System

Mục tiêu: chuẩn hóa giao diện nhập liệu Payload Admin để các Collection dễ dùng, đồng bộ và dễ bảo trì mà không cần custom React Admin quá sớm.

## Nguyên tắc chung
- Ưu tiên schema-native UI của Payload: `tabs`, `row`, `sidebar`, `collapsible`, `description`, `placeholder`.
- Không custom component React nếu schema-native UI đã giải quyết được vấn đề.
- Không tạo style/form riêng cho từng Collection nếu có thể dùng pattern chung.
- Không làm thay đổi dữ liệu hoặc field hiện có chỉ để đổi bố cục form.
- Field legacy phải được bảo toàn; nếu chỉ giữ tương thích thì để read-only hoặc gom vào nhóm riêng.

## Bố cục chuẩn
1. Tab `Thông tin chính`
2. Tab `Nội dung chi tiết`
3. Tab `Hiển thị & cấu hình`
4. Tab `SEO` nếu Collection có SEO
5. Sidebar: trạng thái, bật/tắt, nổi bật, thứ tự, ngày xuất bản và các tùy chọn quản trị ngắn

Không bắt buộc mọi Collection có đủ tất cả tab; chỉ dùng phần phù hợp.

## Quy tắc field
- Tối đa 2 field thông thường trên một `row`.
- Field dài như `richText`, `textarea` lớn, upload chính hoặc array phức tạp nên full width.
- Field quan trọng/được nhập thường xuyên đặt trước.
- Field ít dùng, kỹ thuật hoặc legacy đặt cuối hoặc trong tab/collapsible riêng.
- `description` ngắn, hướng dẫn trực tiếp; không viết đoạn văn dài nếu placeholder đủ diễn đạt.
- Dùng `placeholder` cho ví dụ nhập liệu.
- Boolean quan trọng như `active`, `featured`, `enabled`, `showOnHome` ưu tiên sidebar khi hợp lý.
- `order` ưu tiên sidebar.

## Nhóm Collection
### Content
Ví dụ: News, Notices, Documents, Procurement, Recruitment.
Pattern ưu tiên:
- Thông tin chính: tiêu đề, slug, danh mục, thumbnail/cover.
- Nội dung: excerpt + rich text/body.
- Hiển thị: pin/nổi bật/trạng thái/thời gian.
- File đính kèm nếu có.
- SEO cuối cùng.

### People & Organization
Ví dụ: Doctors, Departments, Specialties.
Pattern ưu tiên:
- Thông tin nhận diện.
- Quan hệ khoa/phòng/chuyên khoa.
- Quá trình/giới thiệu/chuyên môn.
- Ảnh đại diện.
- Hiển thị trên website và thứ tự ở sidebar.

### Service & Operations
Ví dụ: Services, Vaccines, Schedules, Appointments.
Pattern ưu tiên:
- Thông tin nghiệp vụ chính.
- Giá/thời gian/trạng thái/quan hệ.
- Cấu hình hiển thị.
- Field hệ thống/đối soát tách riêng nếu có.

## Component/helper dùng chung
Ưu tiên tạo helper field/layout trong `src/fields/` hoặc thư mục tương đương thay vì lặp cấu hình.
Có thể tạo các helper như:
- `halfWidthAdmin`
- `makeVisibilitySidebar()`
- `makeOrderField()`
- `makeEnabledField()`
- `makeSeoTab()`
- `makeBasicInfoTab()` khi nhiều Collection thực sự dùng cùng cấu trúc

Chỉ tạo helper khi có ít nhất 2-3 nơi dùng thật; không trừu tượng hóa quá sớm.

## Collection mẫu
Dùng `Doctors` làm Collection mẫu đầu tiên vì đã có tabs/rows/sidebar tương đối đầy đủ.
Quy trình:
1. Chuẩn hóa `Doctors` theo tài liệu này.
2. Kiểm tra trải nghiệm nhập liệu desktop/mobile Admin.
3. Chốt pattern.
4. Áp dụng dần cho các Collection cùng nhóm.
5. Không đồng loạt sửa toàn bộ Collection trước khi mẫu được duyệt.

## Kiểm tra sau sửa
- Không mất field hiện có.
- Không đổi `name`, `slug`, `relationTo` nếu chỉ chỉnh UI.
- Không đổi dữ liệu hoặc logic access/hook.
- Chạy `npm run generate:types` và `npm run generate:importmap` nếu schema thay đổi.
- Chạy `npm run typecheck`.
- Kiểm tra form Admin không bị quá dài, field không bị chật/cắt, tab/row/sidebar dễ hiểu.
