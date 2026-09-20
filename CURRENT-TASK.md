# CURRENT TASK

## Trạng thái
HOÀN THÀNH — NGĂN CHATBOT TỰ ĐOÁN SAI CÂU HỎI MƠ HỒ

## Hiện tượng
- “dịch vụ” bị hiểu thành “dịch vụ kỹ thuật”.
- “giá dịch vụ” không đi đúng trang bảng giá.

## Nguyên nhân
- Câu 1–2 từ được phép khớp vào một kịch bản dài hơn chỉ vì là cụm con.
- Các từ chung như dịch vụ, tư vấn, hỗ trợ, thông tin không đủ ngữ cảnh nhưng chatbot vẫn chọn kết quả điểm cao nhất.

## Đã sửa
1. Câu 1–2 từ không còn tự khớp vào kịch bản dài từ 3 từ trở lên chỉ vì trùng cụm con.
2. “dịch vụ” trả lựa chọn: bảng giá, gói khám, kỹ thuật chuyên sâu, tiêm chủng.
3. “tư vấn”, “hỗ trợ”, “thông tin” trả các lựa chọn làm rõ phù hợp.
4. “giá dịch vụ” được nhận diện trực tiếp là yêu cầu bảng giá.
5. Frontend hiển thị lời nhắc làm rõ do API trả về thay vì câu fallback chung.
6. Vẫn giữ so khớp không dấu và lỗi chính tả cho câu có đủ ngữ cảnh.

## Validation
- `npm.cmd run typecheck`: PASS.
- API local “dịch vụ”: trả `matched: false` cùng 4 lựa chọn đúng.
- API local “giá dịch vụ”: trả `/bang-gia` đúng.
