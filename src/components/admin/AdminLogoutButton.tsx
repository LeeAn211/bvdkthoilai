'use client'

import { useAuth } from '@payloadcms/ui'
import { useState } from 'react'
import styles from './AdminLogoutButton.module.css'

export default function AdminLogoutButton() {
  const { logOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const logout = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      await logOut()
      window.location.assign('/admin/login')
    } catch {
      setError('Chưa thể đăng xuất. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.button} type="button" onClick={logout} disabled={loading}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 5H5v14h5" />
          <path d="M13 8l4 4-4 4M8 12h9" />
        </svg>
        <span>{loading ? 'Đang đăng xuất…' : 'Đăng xuất tài khoản'}</span>
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  )
}
