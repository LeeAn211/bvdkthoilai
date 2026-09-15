# CHIẾN LƯỢC TRIỂN KHAI MÔI TRƯỜNG PRODUCTION LÊN VPS (DEVOPS STRATEGY)

Tài liệu này ghi nhận phương án tối ưu nhất để đưa Cổng thông tin điện tử Bệnh viện Đa khoa Khu vực Thới Lai lên máy chủ VPS riêng biệt (hoặc máy chủ dùng chung), bảo đảm hệ thống **tự động deploy khi push GitHub**, **không gián đoạn dịch vụ (Zero Downtime)** và **bảo toàn dữ liệu 100%**.

---

## I. ĐÁNH GIÁ & LỰA CHỌN PHƯƠNG ÁN TỐI ƯU

| Tiêu chí so sánh | Phương án 1: GitHub Actions + PM2 thuần | Phương án 2: Coolify (Docker trên VPS) 🏆 (CHỌN CHÍNH THỨC) | Phương án 3: Webhook script thủ công |
| :--- | :--- | :--- | :--- |
| **Độ ổn định môi trường thật** | Khá (dễ bị lệch phiên bản Node.js/OS trên VPS) | **Tuyệt đối (10/10)**: Đóng gói Docker Container chuẩn xác 100% | Thấp (dễ nghẽn, treo tiến trình chạy ngầm) |
| **Không sập web khi deploy (Zero Downtime)** | Lúc `npm run build` trên VPS dễ ăn 100% CPU/RAM gây lag tạm thời | **Rất cao**: Dùng Rolling Update, bản mới chạy kiểm tra `/api/health` OK mới trỏ domain sang | Kém |
| **Trải nghiệm quản trị** | Toàn bộ qua dòng lệnh SSH | **Trực quan (Dashboard web y hệt Railway/Vercel)** | Khó kiểm soát log và lỗi |
| **Khả năng tự động hóa GitHub** | Tốt (cần quản lý SSH Secret) | **Tự động 100%**: Webhook/GitHub App chính hãng tích hợp sẵn | Trung bình |
| **Bảo mật & Tự động Backup** | Phải viết crontab thủ công | **Tự động sao lưu PostgreSQL hàng ngày** lên Cloud/Local | Tự làm thủ công |

---

## II. PHƯƠNG ÁN CHÍNH THỨC: COOLIFY (SELF-HOSTED PAAS TRÊN VPS)

### 1. Giới thiệu Coolify
- **Coolify** là nền tảng quản trị ứng dụng nguồn mở được ví như phiên bản tự lưu trữ (Self-hosted) của Railway/Heroku trên chính VPS của bạn.
- Bạn làm chủ hoàn toàn máy chủ, không phụ thuộc vào bên thứ 3 và không phát sinh chi phí hàng tháng ngoài tiền thuê VPS.

### 2. Yêu cầu phần cứng VPS khuyến nghị
- **Hệ điều hành**: Ubuntu 22.04 LTS hoặc Ubuntu 24.04 LTS (x86_64 hoặc ARM64).
- **CPU**: Tối thiểu 2 vCPU (khuyến nghị 4 vCPU nếu build trực tiếp).
- **RAM**: Tối thiểu 4 GB (khuyến nghị 8 GB để vận hành trơn tru cả Next.js, Payload CMS, PostgreSQL và Coolify).
- **Dung lượng ổ cứng**: Tối thiểu 40 GB SSD / NVMe.

---

## III. QUY TRÌNH TRIỂN KHAI CHI TIẾT KHI CÓ VPS (CHỈ 4 BƯỚC)

### Bước 1: Cài đặt Coolify lên VPS trắng
Đăng nhập vào VPS qua SSH (với quyền `root`) và chạy **duy nhất 1 câu lệnh**:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
Sau khoảng 2–3 phút, Coolify sẽ khởi động xong. Bạn truy cập vào địa chỉ: `http://IP_VPS:8000` để đặt tài khoản và mật khẩu quản trị.

---

### Bước 2: Tạo PostgreSQL Database trên Coolify
1. Trong Dashboard Coolify, nhấn **+ Create Resource** → chọn **PostgreSQL**.
2. Đặt tên database: `bvdkthoilai_prod`.
3. Bật tính năng **Automated Backups** (Sao lưu tự động mỗi ngày vào 02:00 sáng).
4. Coolify sẽ cung cấp đường dẫn kết nối nội bộ dạng:
   `postgresql://postgres:password@bvdkthoilai-db:5432/bvdkthoilai_prod`

---

### Bước 3: Kết nối GitHub Repository
1. Trong Coolify, chọn **Sources** → **Add GitHub App**.
2. Cấp quyền truy cập vào Repository: `https://github.com/LeeAn211/bvdkthoilai`.
3. Chọn nhánh triển khai: `main`.
4. Coolify sẽ tự động nhận diện tệp `Dockerfile` đã có sẵn trong dự án.

---

### Bước 4: Khai báo Biến môi trường (Environment Variables)
Tại trang cấu hình ứng dụng trên Coolify, điền các biến môi trường:
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@bvdkthoilai-db:5432/bvdkthoilai_prod
PAYLOAD_SECRET=chuoinghaunhien32kitubimatkhongtietlo
PAYLOAD_DB_PUSH=false
NEXT_PUBLIC_SITE_URL=https://bvdkthoilai.cantho.gov.vn
```

---

## IV. CƠ CHẾ TỰ ĐỘNG VẬN HÀNH (CI/CD WORKFLOW)

Từ sau khi thiết lập xong:
1. **Developer đẩy code**: Bạn chỉ cần gõ `git push origin main` trên máy tính.
2. **Coolify nhận diện**: GitHub tự động thông báo tín hiệu cho Coolify trên VPS.
3. **Build an toàn**: Coolify tự động chạy `Dockerfile` build phiên bản mới ngầm trong Docker container.
4. **Tự động chạy Migration Database**:
   - Khi container khởi động, lệnh `npm prestart` (chạy file `scripts/db-migrate.mjs`) sẽ **tự động kết nối vào PostgreSQL trên VPS để thêm cột/bảng mới** theo Quy tắc 15 của dự án.
   - Bạn không cần mở database để gõ lệnh SQL thủ công.
5. **Chuyển đổi không downtime**:
   - Container mới kiểm tra đường dẫn sức khỏe `/api/health` thành công (HTTP 200 OK).
   - Hệ thống mới chuyển hướng tên miền sang container mới và tắt container cũ.
   - Người bệnh và người quản trị truy cập liên tục, không bị ngắt quãng website 1 giây nào.

---

## V. PHƯƠNG ÁN DỰ PHÒNG (CHO VPS CẤU HÌNH THẤP: RAM 1GB - 2GB)

Nếu VPS chỉ có 1GB - 2GB RAM không thể chạy Docker:
- Áp dụng phương án **GitHub Actions + PM2**:
  - Máy chủ GitHub (miễn phí) sẽ chịu tải phần nặng nhất là biên dịch mã nguồn (`npm run build`).
  - Sau đó, GitHub Actions đẩy thư mục build sang VPS qua SSH rsync.
  - PM2 trên VPS nhận file và thực hiện `pm2 reload bvdkthoilai --update-env`.
  - Cơ chế `scripts/db-migrate.mjs` vẫn tự động cập nhật database như bình thường.
