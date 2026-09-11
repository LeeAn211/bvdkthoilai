# Khởi tạo PostgreSQL mới từ project – v4.4.31

Dùng khi máy mới **không còn backup database cũ**.

## 1. Tạo database trống
Mở pgAdmin Query Tool hoặc psql bằng tài khoản postgres và chạy:

```sql
CREATE DATABASE thoi_lai_hospital
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TEMPLATE = template0;
```

## 2. Cấu hình `.env`
Ví dụ:

```env
DATABASE_URL=postgresql://postgres:MAT_KHAU_POSTGRES@localhost:5432/thoi_lai_hospital
PAYLOAD_SECRET=CHUOI_BI_MAT_DAI_NGAU_NHIEN
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYLOAD_DB_PUSH=true
```

Lưu ý: nếu mật khẩu PostgreSQL có ký tự đặc biệt như `@`, `#`, `%`, `:` hoặc `/`, cần URL-encode mật khẩu trong DATABASE_URL.

## 3. Tạo schema từ source Payload
Chỉ thực hiện khi database `thoi_lai_hospital` đang trống:

```powershell
npm install
npm run dev
```

Chờ Payload/Drizzle tạo schema. Khi server báo Ready, mở:

`http://localhost:3000/admin`

Tạo tài khoản quản trị đầu tiên nếu Payload hiển thị màn hình tạo First User.

## 4. TẮT DB PUSH ngay sau khi schema đã tạo
Dừng server bằng Ctrl+C. Sửa `.env`:

```env
PAYLOAD_DB_PUSH=false
```

Sau đó chạy lại:

```powershell
npm run dev
```

Từ đây database không còn tự động đổi schema khi khởi động.

## 5. Dữ liệu cũ
Cách này chỉ tái tạo **schema hiện tại từ code**, không thể khôi phục bài viết, hình ảnh, tài khoản, cấu hình, khoa/phòng, bác sĩ, bảng giá... đã mất cùng database cũ.

Thư mục file media trong project (nếu còn) cũng không tự tạo lại các bản ghi Media trong PostgreSQL.

## 6. Không chạy các repair cũ trước khi bootstrap
Không cần chạy `repair:users-schema`, `repair:visibility`, `migrate:legacy` trên database trống. Payload sẽ tạo schema theo collection/global hiện tại.
