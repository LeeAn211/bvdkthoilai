# CURRENT TASK — Khắc Phục Lỗi Trùng Lặp ID Lịch Công Tác, Nâng Cấp Model Gemini OCR & Chống Spam Log Sở Y Tế

## Trạng thái: HOÀN THÀNH

## Bối cảnh & Vấn đề xử lý
1. **Lỗi `ERROR: Lỗi - Field sau không hợp lệ: id` (`work_schedules`, `id: 5`, code 400)**:
   - Khi chỉnh sửa/áp dụng dữ liệu lịch công tác tuần, form state dispatch `REPLACE_STATE` vô tình giữ lại trường `id` cấp cao nhất, khiến Payload CMS cố gắng ghi đè hoặc xung đột khóa chính `work_schedules_pkey`.
   - Các sequence PostgreSQL (`work_schedules_id_seq`, `_work_schedules_v_id_seq`, `_work_schedules_v_version_days_id_seq`, `site_visits_summary_id_seq`) chưa được đồng bộ với `MAX(id)` thực tế dẫn đến nguy cơ xung đột khóa chính khi tạo mới.
2. **Lỗi AI OCR 404 & 503**:
   - Google Gemini thông báo dừng hỗ trợ các model cũ (`gemini-2.0-flash`, `gemini-2.5-flash`, `gemini-1.5-flash` trả về status 404).
   - `ai-work-schedule-ocr` bị thiếu model chuẩn mới nhất `gemini-3.8-flash`.
   - Các model `gemini-3.6-flash`, `gemini-3.5-flash` gặp spike quá tải tạm thời (503) gây đứt gãy OCR ngay lập tức.
3. **Log spam `[CanThoHealthDept] Fetch failed, using cache/fallback`**:
   - Khi kết nối mạng ngoài đến cổng thông tin Sở Y tế Cần Thơ bị chặn hoặc timeout, server liên tục thử lại trên mọi request gây ngập log.

## Đã triển khai
1. **Khắc phục xung đột ID trong `WorkScheduleAdminHelper.tsx`**:
   - Loại trừ hoàn toàn trường `id` cấp cao nhất khỏi `nextState` khi nạp dữ liệu từ AI OCR hoặc Excel (`delete nextState['id']`). Payload CMS tự quản lý ID bản ghi qua URL/context.
2. **Nâng cấp toàn bộ các API Route AI OCR**:
   - Cập nhật danh sách ưu tiên model chuẩn mới nhất: `['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite']`.
   - Áp dụng trên cả 4 route: `ai-work-schedule-ocr`, `ai-schedule-ocr`, `ai-daily-ocr`, `ai-nurse-ocr`.
   - Bổ sung cơ chế tự động thử lại (retry với backoff 1s) khi gặp lỗi quá tải tạm thời 503 hoặc 429 trước khi chuyển sang model dự phòng.
3. **Tối ưu bộ đệm `canthoHealthDept.ts`**:
   - Thêm thời gian chờ (cooldown 5 phút) khi gặp lỗi mạng ngoài; lập tức trả về cache/fallback để tránh nghẽn server và ngập log.
4. **Database Migration & Schema Seal**:
   - Tạo migration `20260925_076_sync_work_schedules_sequences.mjs` đồng bộ chuẩn hóa toàn bộ sequences PostgreSQL.
   - Chạy `npm run db:schema:seal -- 20260925_076_sync_work_schedules_sequences` và triển khai qua `npm run db:migrate:deploy`.

## Kiểm tra chất lượng (Verification)
- `npm run typecheck`: PASS (0 lỗi).
- `node scripts/validate-db-migrations.mjs`: PASS 334/334 checks.
- `npm run db:schema:check`: PASS (hợp đồng 076).
- Kiểm tra các model Gemini API thực tế: `gemini-3.8-flash` phản hồi HTTP 200 OK ngay lập tức.
- Kiểm tra toàn bộ sequence CSDL: Đã đồng bộ hoàn hảo (0 lỗi out of sync).
