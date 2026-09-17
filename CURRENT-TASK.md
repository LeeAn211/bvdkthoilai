# CURRENT-TASK

## Mục tiêu
1. Thiết kế trang và mẫu khảo sát ý kiến người bệnh ngoại trú theo Mẫu số 2 của Bộ Y tế (https://hailong.chatluongbenhvien.vn/nguoi-benh-ngoai-tru-v2).
2. Thiết kế trang và mẫu khảo sát ý kiến người bệnh nội trú theo Mẫu số 1 của Bộ Y tế (https://hailong.chatluongbenhvien.vn/nguoi-benh-noi-tru-v2).

## Trạng thái: HOÀN THÀNH

## Files liên quan
- `src/components/OutpatientSurveyForm.tsx` [NEW]
- `src/components/InpatientSurveyForm.tsx` [NEW]
- `src/app/(frontend)/khao-sat/ngoai-tru/page.tsx` [NEW]
- `src/app/(frontend)/khao-sat/noi-tru/page.tsx` [NEW]
- `src/app/(frontend)/khao-sat/[slug]/page.tsx` [MODIFY]
- `src/app/(frontend)/khao-sat/page.tsx` [MODIFY]
- `src/app/(frontend)/api/surveys/outpatient/route.ts` [NEW]
- `src/app/(frontend)/api/surveys/inpatient/route.ts` [NEW]
- `src/app/styles/outpatient-survey.css` [NEW]
- `src/app/(frontend)/layout.tsx` [MODIFY]
- `CHANGELOG.md` [MODIFY]

## Kết quả đạt được
- **Khảo sát Ngoại trú (Mẫu 2 BYT - `/khao-sat/ngoai-tru`)**: 19 câu hỏi thuộc 5 nhóm A-E, thông tin chung phòng khám, thanh đo %, Likert 1-5 sao/emoji, đánh giá thang điểm 10, cấp mã `KS-NT-2026-XXXX`.
- **Khảo sát Nội trú (Mẫu 1 BYT - `/khao-sat/noi-tru`)**: 20 câu hỏi thuộc 5 nhóm A-E (tiếp cận, buồng bệnh, thuốc/viện phí, điều dưỡng chăm sóc, kết quả điều trị), thông tin số ngày nằm viện và khoa điều trị nội trú, thanh đo %, Likert 1-5 sao/emoji, đánh giá thang điểm 10, cấp mã `KS-NOITRU-2026-XXXX`.
- Cả hai trang đều tương thích hoàn hảo trên điện thoại và máy tính, bảo mật 100% ẩn danh, hỗ trợ nút đánh giá nhanh tiện dụng.
- Cả 2 endpoint API và 2 route trang đều trả về HTTP 200 OK.
