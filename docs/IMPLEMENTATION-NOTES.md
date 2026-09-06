# Ghi chú triển khai

## V1 ưu tiên
1. Trang chủ responsive.
2. CMS quản lý toàn bộ nội dung.
3. Tin tức / thông báo / đấu thầu / văn bản.
4. Khoa/phòng + bác sĩ trong sơ đồ tổ chức.
5. Lịch khám và bảng giá.
6. Tích hợp Medpro, Zalo, Maps.
7. Phân quyền và workflow duyệt bài.
8. SEO, accessibility, cache, backup.

## Production hardening cần làm
- Role/access control chi tiết ở collection level.
- Audit log.
- Rate limiting.
- CSP / security headers.
- Object storage S3-compatible.
- Backup PostgreSQL.
- Image optimization policy.
- Monitoring.
- Privacy policy / terms.
- Import Excel bảng giá.
- Search full text.
