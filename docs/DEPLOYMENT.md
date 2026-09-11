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

## Health checks nên bổ sung ở hạ tầng
- HTTP GET `/`
- PostgreSQL connection
- disk/object storage
- log rotation
