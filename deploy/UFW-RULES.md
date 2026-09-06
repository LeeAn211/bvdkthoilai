# Firewall VPS (UFW)

Áp dụng sau khi đã xác nhận SSH hoạt động. Không mở 3000/5432 ra Internet.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

Docker Compose v4.3.0 chỉ bind ứng dụng tại `127.0.0.1:3000`; PostgreSQL chỉ `expose` trong mạng Docker.
