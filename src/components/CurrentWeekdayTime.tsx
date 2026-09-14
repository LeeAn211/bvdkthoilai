'use client'

import { useEffect, useState } from 'react'

function formatNow(date: Date) {
  const day = date.getDay()
  const dayLabel = day === 0 ? 'Chủ nhật' : `Thứ ${day + 1}`
  const dateLabel = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  const timeLabel = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(date)
  return `${dayLabel}, ${dateLabel} • ${timeLabel}`
}

export function CurrentWeekdayTime({ prefix = '', showIcon = true }: { prefix?: string; showIcon?: boolean }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const update = () => setLabel(formatNow(new Date()))
    update()
    const timer = window.setInterval(update, 1_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <span className="utilityCurrentTime" suppressHydrationWarning>
      {showIcon && <svg className="utilityTimeIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v3M17 2v3M3.5 9h17M5.5 4h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M12 12v4l2.5 1.5"/></svg>}
      <span>{prefix ? `${prefix} ` : ''}{label || 'Đang cập nhật thời gian…'}</span>
    </span>
  )
}
