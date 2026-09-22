# CURRENT TASK — Cho phép chọn nhiều Chuyên khoa trong Phác đồ điều trị

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. **Payload Schema** ([`src/collections/ClinicalProtocols.ts`](file:///f:/20.9%20web/bvdkthoilai-main/src/collections/ClinicalProtocols.ts)):
   - Đặt `hasMany: true` cho trường `specialty` (Chuyên khoa / Lĩnh vực áp dụng), cho phép người quản trị chọn nhiều chuyên khoa cho 1 phác đồ điều trị.
2. **Database Migration & Schema Contract**:
   - Tạo migration [`20260922_062_allow_multiple_specialties_for_clinical_protocols.mjs`](file:///f:/20.9%20web/bvdkthoilai-main/scripts/db-migrations/20260922_062_allow_multiple_specialties_for_clinical_protocols.mjs).
   - Tạo các bảng quan hệ `clinical_protocols_rels` và `_clinical_protocols_v_rels` với `ON DELETE CASCADE`.
   - Di chuyển dữ liệu cũ từ `specialty_id` sang bảng quan hệ mới để đảm bảo không mất dữ liệu.
   - Chạy `payload generate:db-schema`, `payload generate:types`.
   - Đã seal và verify schema contract.
   - Đã áp dụng và xác minh migration trực tiếp trên Railway PostgreSQL.
3. **Frontend Display**:
   - Cập nhật [`src/app/(frontend)/phac-do-dieu-tri/page.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/phac-do-dieu-tri/page.tsx), [`src/app/(frontend)/phac-do-dieu-tri/[slug]/page.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/phac-do-dieu-tri/[slug]/page.tsx) và [`src/app/(frontend)/page.tsx`](file:///f:/20.9%20web/bvdkthoilai-main/src/app/(frontend)/page.tsx) để hỗ trợ hiển thị danh sách nhiều chuyên khoa (ngăn cách bởi dấu phẩy).

## Kiểm tra
- `npm run typecheck`: PASS (0 lỗi)
- `npm run db:schema:check`: PASS
- `npm run validate:migrations`: PASS (278/278 PASS)
- `node scripts/db-migrate.mjs`: PASS (62 applied, 0 pending)


