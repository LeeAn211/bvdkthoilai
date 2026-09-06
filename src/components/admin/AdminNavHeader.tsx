'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import styles from './AdminNavHeader.module.css'

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin',
  'system-admin': 'System Admin',
  board: 'Ban Giám đốc',
  admin: 'Quản trị website',
  editor: 'Biên tập viên',
  reviewer: 'Người duyệt bài',
  procurement: 'Đấu thầu / Vật tư',
  department: 'Khoa / Phòng',
  'department-manager': 'Quản lý Khoa / Phòng',
  hr: 'Tổ chức / Nhân sự',
  finance: 'Tài chính',
  'clinic-schedule': 'Quản lý lịch khám',
  vaccination: 'Quản lý tiêm chủng',
  'quality-management': 'Quản lý chất lượng',
}

type HospitalUser = {
  name?: string
  email?: string
  role?: string
}

export default function AdminNavHeader() {
  const { user } = useAuth<HospitalUser>()
  const name = user?.name || user?.email || 'Tài khoản quản trị'
  const initial = name.trim().slice(0, 1).toUpperCase() || 'A'

  return (
    <section className={styles.shell}>
      <div className={styles.caption}>TRUNG TÂM ĐIỀU HÀNH NỘI DUNG</div>
      <div className={styles.account}>
        <span className={styles.avatar}>{initial}</span>
        <span className={styles.accountCopy}>
          <strong title={name}>{name}</strong>
          <small>{roleLabels[user?.role || ''] || 'Người dùng hệ thống'}</small>
        </span>
        <span className={styles.online} title="Đang hoạt động" />
      </div>
      <Link className={styles.websiteLink} href="/" target="_blank">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        Mở website
      </Link>
    </section>
  )
}
