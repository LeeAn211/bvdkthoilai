# CURRENT TASK — Di chuyển hoàn toàn Database từ Neon sang Railway PostgreSQL

## Trạng thái: HOÀN THÀNH

## Đã thực hiện
1. **Khởi tạo schema và cấu trúc**:
   - Đồng bộ đầy đủ các ENUM type và 342+ bảng/bảng phiên bản trên Railway PostgreSQL.
   - Đồng bộ migration schema contract.
2. **Di chuyển 100% dữ liệu từ Neon sang Railway**:
   - Di chuyển sạch và an toàn (1603 dịch vụ & bảng giá, 14 chuyên khoa, 7 bác sĩ, 5 tin tức, 42 media, lịch khám, tài khoản...).
   - Tự động reset và cân chỉnh toàn bộ sequence ID trên Railway để tránh trùng khóa chính khi tạo mới bài viết/dịch vụ.
3. **Dọn dẹp môi trường**:
   - Dọn sạch các script chuyển dữ liệu tạm thời, không để rò rỉ connection string hay credential ra repo.

## Bước tiếp theo (Thao tác trên Railway Dashboard)
- Cập nhật biến môi trường service Web sang Railway Postgres Private URL: `${{Postgres.DATABASE_PRIVATE_URL}}`

