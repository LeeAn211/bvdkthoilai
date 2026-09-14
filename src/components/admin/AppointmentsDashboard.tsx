import styles from './AppointmentsDashboard.module.css'

export default function AppointmentsDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleCol}>
          <div className={styles.badge}>DỊCH VỤ NGƯỜI BỆNH · TIẾP ĐÓN</div>
          <h2 className={styles.title}>Quản lý Lịch Đặt Khám Tại Cơ Sở</h2>
          <p className={styles.desc}>
            Theo dõi, thống kê và xuất báo cáo phiếu hẹn khám bệnh của người dân từ website và các kênh tiếp nhận.
          </p>
        </div>
        <div className={styles.actionCol}>
          <a
            href="/api/appointments-export"
            download
            className={styles.exportBtn}
            title="Xuất toàn bộ danh sách lịch khám ra file Excel với định dạng y tế màu xanh"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Xuất Excel Danh Sách</span>
          </a>
          <a
            href="/dat-lich-kham"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewFormBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Xem trang đặt khám</span>
          </a>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blueCard}`}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Hệ thống tiếp nhận</span>
            <strong className={styles.statValue}>Trực tuyến 24/7</strong>
            <span className={styles.statSub}>Đồng bộ tự động từ trang đặt khám</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.amberCard}`}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Quy trình xử lý</span>
            <strong className={styles.statValue}>Gọi xác nhận</strong>
            <span className={styles.statSub}>Chuyển trạng thái sang "Đã gọi" sau khi liên hệ</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.greenCard}`}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Tiếp đón tại viện</span>
            <strong className={styles.statValue}>Ưu tiên quầy số 1</strong>
            <span className={styles.statSub}>Quét mã QR hoặc đọc mã hẹn khám</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.cyanCard}`}>
          <div className={styles.statIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Báo cáo & Thống kê</span>
            <strong className={styles.statValue}>Excel Chuẩn Y Tế</strong>
            <span className={styles.statSub}>Màu xanh bệnh viện, đầy đủ chi tiết bệnh nhân</span>
          </div>
        </div>
      </div>
    </div>
  )
}
