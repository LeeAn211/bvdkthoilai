# CURRENT TASK — Bổ Sung Migration 073 & Seal DB Schema Cho Navigation Presets

## Trạng thái: HOÀN THÀNH

## Yêu cầu
Khắc phục lỗi build trên Docker / CI/CD:
`✗ DB SCHEMA CONTRACT FAILED: Payload schema đã thay đổi nhưng chưa có migration được seal. Không được bật PAYLOAD_DB_PUSH trên production; hãy tạo migration mới, sinh lại DB schema và seal contract.`

## Nguyên nhân
Trường chọn preset trong `Navigation.ts` đã được bổ sung tùy chọn `Lịch làm việc cơ quan (/lich-lam-viec)`, dẫn đến các PostgreSQL enum tương ứng trong schema database (`enum_navigation_items_preset`, `enum_navigation_items_children_preset`,...) có thêm giá trị mới nhưng chưa được khóa bằng migration.

## Đã triển khai
1. Tạo migration `scripts/db-migrations/20260924_073_add_work_schedule_preset_to_navigation_enums.mjs`.
2. Khóa hợp đồng DB schema: `npm run db:schema:seal -- 20260924_073_add_work_schedule_preset_to_navigation_enums`.
3. Kiểm tra chất lượng:
   - `npm run prebuild`: PASS (sinh import map, types, db schema và validate contract thành công).
   - `node scripts/validate-db-migrations.mjs`: PASS 322/322 checks.
   - `npm run typecheck`: PASS (0 lỗi).
