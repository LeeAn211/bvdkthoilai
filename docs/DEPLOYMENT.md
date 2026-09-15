# Triển khai production

## Kiến trúc đề xuất
Internet → Cloudflare → Nginx/Caddy → Next.js/Payload → PostgreSQL
                                              ↘ Object Storage

## Máy chủ tối thiểu khuyến nghị
- 2 vCPU
- 4 GB RAM
- SSD 40+ GB nếu media dùng object storage
- PostgreSQL backup độc lập

## Bảo mật
- HTTPS bắt buộc
- PAYLOAD_SECRET ngẫu nhiên tối thiểu 32 ký tự
- Database không public Internet
- Admin có MFA ở lớp reverse proxy/SSO nếu tổ chức hỗ trợ
- Giới hạn upload file
- WAF/rate limit cho `/api/feedback`
- Backup và thử restore định kỳ
- Không đưa secret vào Git

## Deploy
```bash
docker compose up -d --build
```

### Railway

Railway bắt buộc chạy migration trước khi kích hoạt deployment mới:

```text
Pre-Deploy Command: npm run db:migrate:deploy
Pre-Deploy Timeout: 300 giây
Healthcheck Path: /api/health
Healthcheck Timeout: 300 giây
```

Giữ `PAYLOAD_DB_PUSH=false`. `npm start` tự apply rồi verify migration trước khi mở Next.js, vì vậy vẫn an toàn nếu Pre-Deploy chưa được cấu hình. Với Neon pooler, ứng dụng dùng `DATABASE_URL` còn migration bắt buộc dùng Direct connection string qua `DATABASE_MIGRATION_URL`. Build cũng kiểm tra schema contract để chặn trường hợp thêm field nhưng quên migration. Quy trình đầy đủ: [RAILWAY-DEPLOYMENT.md](./RAILWAY-DEPLOYMENT.md).

## Health checks nên bổ sung ở hạ tầng
- HTTP GET `/`
- PostgreSQL connection
- disk/object storage
- log rotation
