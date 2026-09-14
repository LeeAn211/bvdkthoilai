# QA / Bàn giao V2

## Đã hoàn thiện trong source

- Next.js 16 + TypeScript
- Payload CMS + PostgreSQL
- Payload Admin route `/admin`
- REST API route Payload
- Site Settings
- Menu động
- Cấu hình Trang chủ
- Media Library
- Rich Text Editor
- Page Builder dạng block
- Tin tức + chi tiết
- Thông báo + chi tiết + file đính kèm
- Đấu thầu – Mua sắm + chi tiết + file + trạng thái + deadline + lịch sử cập nhật
- Văn bản – Tài liệu
- Tuyển dụng
- Sơ đồ tổ chức
- Khoa / Phòng
- Hồ sơ bác sĩ
- Lịch khám
- Bảng giá dịch vụ
- Đặt lịch qua Medpro
- Liên hệ + form phản hồi
- SEO metadata cơ bản
- sitemap.xml
- robots.txt
- Responsive desktop / mobile
- Mobile action bar
- Draft / autosave / versions / scheduled publish
- Role-based access nền tảng
- Dockerfile
- docker-compose PostgreSQL
- Seed script
- Tài liệu deploy
- Quy trình quản trị nội dung

## Việc phải cấu hình trước khi go-live

1. Điền `.env`.
2. Thay `PAYLOAD_SECRET`.
3. Cấu hình PostgreSQL production.
4. Thay hotline / email / địa chỉ / Medpro / Zalo bằng dữ liệu thật.
5. Upload logo và banner thật.
6. Tạo user quản trị thật; không dùng password demo.
7. Cấu hình HTTPS / reverse proxy / Cloudflare.
8. Cấu hình backup PostgreSQL.
9. Nếu media nhiều: chuyển storage sang S3-compatible.
10. Test phân quyền theo từng phòng ban bằng tài khoản thật.
11. Test mobile và accessibility với nội dung thật.
12. Kiểm tra các yêu cầu nội bộ/pháp lý trước khi tích hợp dữ liệu y tế cá nhân.

## Lưu ý kiểm thử

Source đã được cấu trúc theo tài liệu Payload/Next.js hiện hành. Môi trường tạo artifact này không có bước `npm install`
và PostgreSQL đang chạy để thực hiện build/runtime integration test đầy đủ. Vì vậy trước go-live, kỹ thuật viên phải chạy:

```bash
npm install
npm run generate:types
npm run generate:importmap
npm run typecheck
npm run build
```

sau đó test `/`, `/admin`, CRUD CMS và các route public trên staging.
