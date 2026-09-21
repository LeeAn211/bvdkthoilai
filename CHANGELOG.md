# CHANGELOG

## 2026-09-21 — Xác minh database runtime khi deploy Railway

- Sau migration Direct URL, kết nối lại bằng chính `DATABASE_URL` pooled của Payload.
- Chặn deploy nếu hai URL lệch Neon endpoint, database hoặc user.
- Kiểm tra migration mới nhất và schema qua pooled connection trước khi chạy Next.js.
- Rút gọn lỗi PostgreSQL về nguyên nhân sâu nhất thay vì chỉ in câu SQL dài.
- Logger trang chủ ghi trực tiếp SQLSTATE/message/detail/table/column từ nguyên nhân sâu nhất.
- Validation migration đạt 274/274 và schema contract behavior đạt 4/4.

## 2026-09-20 — Sửa lỗi build DB schema contract

- Sinh lại schema trực tiếp bằng Payload thay cho bản đồng bộ thủ công trước đó.
- Thêm migration `059` để đồng bộ default chatbot và seal đúng schema production.
- Giữ nguyên các bảng quick-link cũ, không xóa dữ liệu.
- Prebuild, migration local và full production build đều đạt.

## 2026-09-20 — Tư vấn trực tuyến nhiều tin nhắn

- Nâng yêu cầu tư vấn thành phòng chat nhiều lượt giữa người dùng và tư vấn viên.
- Người dùng tiếp tục gửi tin ngay trong chatbot; phản hồi Admin tự xuất hiện gần thời gian thực.
- Bổ sung lịch sử tin nhắn, thời gian hoạt động gần nhất và trạng thái đóng hội thoại trong Admin.
- Giữ tương thích dữ liệu tư vấn cũ, tăng giới hạn request phù hợp cho chat trực tiếp.
- Migration `058`, schema contract và typecheck đều đạt.

## 2026-09-20 — Ngăn chatbot tự đoán câu hỏi mơ hồ

- Không cho câu 1–2 từ tự khớp vào kịch bản dài chỉ vì trùng cụm con.
- Thêm lựa chọn làm rõ cho “dịch vụ”, “tư vấn”, “hỗ trợ” và “thông tin”.
- Nhận diện “giá dịch vụ” là yêu cầu bảng giá; API local và typecheck đều đạt.

## 2026-09-20 — Chuyển đổi Medpro và đặt lịch tại cơ sở

- Mở rộng Admin “Điều hướng Đặt lịch khám” với công tắc bật/tắt và chuyển sang form tại cơ sở.
- Đồng bộ lựa chọn cho trang chủ, menu/thanh mobile, footer và chatbot.
- Chế độ tại cơ sở dùng `/dat-lich-kham`, mở cùng tab; Medpro tiếp tục mở tab ngoài.
- Migration `057` đã áp dụng và xác minh; typecheck và schema contract đạt.

## 2026-09-20 — Quản trị toàn bộ nội dung trả lời Chatbot

- Bổ sung nhóm cấu hình mẫu trả lời cấp cứu, lịch khám, giờ làm việc, vắc xin, thông báo, đấu thầu và viện phí.
- API chatbot thay nội dung cố định bằng mẫu từ Admin, hỗ trợ biến dữ liệu `{{TITLE}}`, `{{ITEMS}}`, `{{HOTLINE}}`.
- Ưu tiên các Kịch bản Chatbot do quản trị viên cấu hình trước bộ dự phòng.
- Migration `055` nạp 19 kịch bản điều hướng website vào Admin, không ghi đè kịch bản đã tồn tại.
- Migration `056` seal schema; typecheck và schema contract đều đạt.
- Sửa lỗi câu ngắn “lịch làm việc” bị ghép nhầm với lịch sử phiên và trả về nội dung lịch khám.
- Sửa nút “Cấp cứu 115” bị nhận nhầm thành tra cứu phản ánh; bổ sung nhận diện ưu tiên cho các cụm cấp cứu và gọi 115.
- Siết thuật toán chatbot: không tái sử dụng token, tăng ngưỡng khớp, đồng bộ Custom Answers, nhận diện yêu cầu gặp tư vấn viên và tách đặt lịch khỏi tra lịch khám.

## 2026-09-20 — Nâng cấp chatbot với FAQ và dữ liệu CMS trực tiếp

- Kết nối kho FAQ thật vào API chatbot và hỗ trợ chuyển Rich Text thành câu trả lời văn bản.
- Nâng cơ chế nhận diện từ so khớp đơn giản sang chấm điểm từ khóa/cụm từ có priority.
- Thêm cảnh báo cấp cứu ưu tiên với nút gọi bệnh viện và 115.
- Trả lời từ dữ liệu CMS cho lịch khám, vắc xin đang có, thông báo và đấu thầu mới nhất.
- Bổ sung nhận diện các cách hỏi về lịch/thời gian/giờ làm việc và trả mốc giờ trực tiếp từ cấu hình trang Lịch làm việc.
- Bổ sung câu trả lời điều hướng cho 19 chức năng: đặt lịch, bác sĩ, chuyên khoa, quy trình khám, BHYT, nội trú, gói khám, sơ đồ, liên hệ, góp ý, khảo sát, biểu mẫu, văn bản, tuyển dụng, phác đồ, kỹ thuật, chất lượng và tìm kiếm.
- Nâng nhận diện câu không dấu và lỗi chính tả bằng so khớp gần đúng theo token, giới hạn sai số theo độ dài từ để giảm trả nhầm.
- Bổ sung ngữ cảnh hội thoại theo phiên cho câu hỏi nối tiếp và các lựa chọn làm rõ khi chatbot chưa hiểu.
- Thêm đánh giá câu trả lời 👍/👎; phản hồi chưa đúng tự động đưa vào danh sách cần bổ sung kịch bản.
- Giữ cơ chế lưu hội thoại, thống kê câu chưa trả lời và chuyển tiếp tư vấn viên.

## 2026-09-20 — Tối ưu tab Các loại vắc xin trên mobile

- Mobile chỉ hiển thị một card trong carousel, tablet tối đa hai card và desktop giữ ba card.
- Chuyển tab/bộ lọc độ tuổi thành thanh cuộn ngang để giảm chiều cao giao diện.
- Thu gọn khoảng cách card mobile nhưng giữ đầy đủ xuất xứ, mã, mô tả, thông tin chi tiết và hai nút thao tác.
- Không thay đổi dữ liệu CMS hoặc bố cục desktop.

## 2026-09-20 — Chuyển FAQ/Chat box về nhóm Trợ lý ảo & Chatbot

- Chuyển collection Câu hỏi thường gặp và cấu hình trang Hỏi đáp khỏi nhóm Chăm sóc người bệnh & Khảo sát.
- Hai mục hiện nằm trong nhóm `🤖 Trợ lý ảo & Chatbot`, đúng với luồng nhập nội dung Chatbot.
- Không thay đổi dữ liệu, URL, slug hoặc phân quyền.

## 2026-09-20 — Khôi phục trang quản lý Phiếu trả lời khảo sát

- Bỏ trạng thái ẩn của collection `survey-responses` trong Payload Admin.
- Bổ sung mô tả và bộ cột danh sách mặc định để theo dõi phiếu, chiến dịch, điểm và thời gian gửi.
- Không thay đổi schema database, dữ liệu hoặc quyền truy cập hiện có.

## 2026-09-20 — Dashboard hài lòng người bệnh và SLA dùng dữ liệu thực

- Tính điểm hài lòng từ phiếu khảo sát và điểm từng câu trả lời thực tế.
- Tính tỷ lệ SLA 24 giờ và thời gian hoàn tất trung bình từ mốc tạo/hoàn tất phản ánh.
- Loại hồ sơ khảo sát `KS-*` khỏi thống kê CSKH để tránh trùng dữ liệu.
- Bỏ toàn bộ số minh họa, fallback 120 phiếu và các nhãn đánh giá cố định.
- Khi chưa có dữ liệu hợp lệ, giao diện hiển thị 0 hoặc trạng thái chưa có dữ liệu.
- Chuyển biểu đồ phân bổ phác đồ sang nhóm chuyên khoa, số lượng, tỷ trọng và hiệu lực lấy trực tiếp từ CMS.
- Bỏ fallback 24 phác đồ, tỷ lệ nhóm cố định và nhãn hiệu lực 100%.
- Chuyển biểu đồ tuần sang số lịch hẹn thực tế theo `appointmentDate`, loại lịch đã hủy và tính khung giờ phổ biến từ dữ liệu CMS.
- Bỏ hoàn toàn dãy lượt khám/ca cấp cứu giả lập; ghi rõ dữ liệu cấp cứu chưa kết nối thay vì hiển thị số không có nguồn.

## 2026-09-20 — Nâng cấp khối Dịch vụ nhanh 3D hiện đại

- Thiết kế lại card dịch vụ với nền kính sáng, viền accent và bóng đổ nhiều lớp.
- Tăng kích thước icon, thêm radial highlight, inset shadow và drop-shadow tạo chiều sâu 3D.
- Tối ưu hiệu ứng hover/focus, responsive tablet/mobile và hỗ trợ reduced motion.
- Thay bộ icon đúng ngữ nghĩa từng mục và đồng bộ màu xanh dương–xanh lá của giao diện.
- Chuyển card/icon sang hiệu ứng kính trong để không che banner phía sau.
- Tinh chỉnh theo ảnh tham chiếu: card 112px, icon outline không nền, huy hiệu y tế nhỏ và căn giữa trên banner.
- Giảm độ đục và độ blur của card để hình banner phía sau hiển thị rõ hơn.
- Loại bỏ hoàn toàn nền, backdrop blur và bóng phủ mặc định của card; chỉ giữ viền nhận diện mảnh.
- Cân bằng lại độ nổi bằng nền kính bán trong suốt không blur, viền sáng và bóng xanh nhẹ để banner vẫn nhìn xuyên qua.
- Chốt phương án nền trắng gần như đặc theo ảnh mẫu để icon và tiêu đề dễ đọc trên banner nhiều chi tiết.
- Đặt nền card thành trắng hoàn toàn ngay cả khi chưa hover.
- Thêm khối Thông tin mới dưới Dịch vụ nhanh, tự lấy bài mới nhất từ Thông báo và Đấu thầu – Mua sắm.
- Khối hỗ trợ tự ẩn nguồn chưa có dữ liệu và chuyển sang bố cục dọc trên mobile.
- Đồng bộ trạng thái hiển thị với `visible` của section Trang chủ và `showOnHome` của từng bài Thông báo.
- Không thay đổi dữ liệu, thứ tự hoặc liên kết đang quản lý trong CMS.

> Nhật ký gọn cho các milestone hiện tại. Lịch sử chi tiết trước ngày 19/09/2026 được lưu tại `docs/history/CHANGELOG-through-2026-09-19.md` và trong Git history.

## 2026-09-19 — Tùy biến tiêu đề cột Lịch Điều dưỡng & Nổi bật Thường trực Ban Giám Đốc
- Cho phép tùy chỉnh tiêu đề và mô tả phụ các cột Khoa/Phòng, Hành chánh, Tăng cường hoặc kích hoạt thêm Cột thứ 4 linh hoạt trong CMS.
- Tạo migration `20260919_054_add_custom_columns_to_nurse_schedules` và cập nhật frontend `NurseScheduleView` co giãn 3-4 cột mượt mà.
- Nổi bật hàng Thường trực Ban Giám Đốc (24/7) Bs Trần Quốc Luận trên bảng Lịch trực cấp cứu tuần theo phong cách lãnh đạo trang trọng.
- Đồng bộ kiểu hiển thị danh sách bác sĩ (lịch ngày) sang thẻ dòng viền trái sắc nét như phong cách lịch điều dưỡng.

## 2026-09-19 — Tách riêng Hình thức đăng lịch Điều dưỡng & Bố cục Tabs trong Admin
- Bổ sung tùy chọn `mode: 'nurse'` riêng biệt trong "Hình thức đăng lịch" của Collection `Schedules`.
- Tổ chức toàn bộ form quản trị `Schedules` thành các Tabs chuyên biệt: Thông tin chung, Phân công Bác sĩ, Phân công Điều dưỡng - NHS, Lịch trực Cấp cứu, Tệp đính kèm.
- Frontend: Tự động phân loại tab chuyên mục `Lịch Điều dưỡng - NHS` riêng biệt ngoài trang danh sách và kích hoạt view chuyên dụng ở trang chi tiết.
- Tạo migration `20260919_053_add_nurse_to_schedules_mode` thêm enum an toàn, sinh schema và seal schema contract.

## 2026-09-19 — Bổ sung Lịch Điều dưỡng - Nữ hộ sinh (ĐD - NHS) & Quét ảnh AI / Excel
- Thêm cấu trúc Lịch Điều dưỡng phân chia 3 cột: Khoa/Phòng, Hành chánh, Tăng cường và Ghi chú nghỉ phép.
- Hỗ trợ tải mẫu Excel chuẩn, upload file Excel tự động điền form (`nurseScheduleExcelParser`).
- Tích hợp Gemini Vision AI OCR (`/api/ai-nurse-ocr`) quét ảnh chụp bảng lịch tự động điền form.
- Tạo component hiển thị frontend `NurseScheduleView` trang nhã, đúng phong cách y tế.
- Tạo migration an toàn `20260919_052_add_nurse_schedule_fields_to_schedules` và seal schema contract.

## 2026-09-19 — Tối ưu AI context / low-token

- Rút gọn `AGENTS.md`, `CURRENT-TASK.md`, `HANDOFF.md` và skill `bvdkweb`.
- Chuyển quy tắc chuyên sâu sang `docs/ai/` để chỉ nạp theo loại task.
- Chuyển các báo cáo audit cũ sang `docs/audits/archive/`.
- Bổ sung ignore cho TypeScript cache/temp; bỏ `tsconfig.tsbuildinfo` và file `-s` khỏi tracking.
- Không thay đổi source website, Payload schema hoặc dữ liệu PostgreSQL.
