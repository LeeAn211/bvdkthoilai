'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import styles from './AdminAccountSummary.module.css'

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin',
  'system-admin': 'System Admin',
  board: 'Ban Giám đốc',
  admin: 'Quản trị website',
  editor: 'Biên tập viên',
  reviewer: 'Người duyệt bài',
  department: 'Khoa / Phòng',
  'department-manager': 'Quản lý Khoa / Phòng',
  hr: 'Tổ chức / Nhân sự',
  finance: 'Tài chính',
  procurement: 'Đấu thầu / Vật tư',
  'clinic-schedule': 'Quản lý lịch khám',
  vaccination: 'Quản lý tiêm chủng',
  'quality-management': 'Quản lý chất lượng',
}

const statusLabels: Record<string, string> = {
  active: 'Đang hoạt động',
  locked: 'Đã khóa',
  inactive: 'Ngừng hoạt động',
}

type DepartmentValue = number | string | { id?: number | string; name?: string } | null

type HospitalUser = {
  id?: number | string
  name?: string
  email?: string
  role?: string
  status?: string
  department?: DepartmentValue
}

function departmentLabel(value?: DepartmentValue) {
  if (!value) return ''
  if (typeof value === 'object') return value.name || ''
  return ''
}

export default function AdminAccountSummary() {
  const { user } = useAuth<HospitalUser>()
  const name = user?.name || user?.email || 'Tài khoản quản trị'
  const email = user?.email || ''
  const role = roleLabels[user?.role || ''] || 'Người dùng hệ thống'
  const status = statusLabels[user?.status || 'active'] || 'Đang hoạt động'
  const department = departmentLabel(user?.department)
  const initial = name.trim().slice(0, 1).toUpperCase() || 'A'

  return (
    <div className={styles.accountCard}>
      <div className={styles.avatar}>{initial}</div>
      <div className={styles.identity}>
        <span className={styles.caption}>TÀI KHOẢN ĐANG ĐĂNG NHẬP</span>
        <strong>{name}</strong>
        <small>{role}{department ? ` · ${department}` : ''}</small>
        {email && <span className={styles.email}>{email}</span>}
      </div>
      <div className={styles.accountActions}>
        <span className={styles.status}><i />{status}</span>
        {user?.id && <Link href={`/admin/collections/users/${user.id}`}>Tài khoản →</Link>}
      </div>
    </div>
  )
}
