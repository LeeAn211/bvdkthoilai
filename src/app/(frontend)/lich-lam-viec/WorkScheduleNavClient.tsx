'use client'

import React from 'react'

type Props = {
  currentWeek: number
  currentYear: number
  prevWeek: number
  prevYear: number
  nextWeek: number
  nextYear: number
  allWeeks: Array<{ weekNumber: number; year: number; title: string }>
  attachedFileUrl?: string | null
}

export function WorkScheduleNavClient({
  currentWeek,
  currentYear,
  prevWeek,
  prevYear,
  nextWeek,
  nextYear,
  allWeeks,
  attachedFileUrl,
}: Props) {
  const handleSelectWeek = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!val) return
    const [w, y] = val.split('_')
    window.location.href = `/lich-lam-viec?week=${w}&year=${y}`
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <section className="scheduleNavToolbar" aria-label="Thanh điều hướng tuần">
      <div className="scheduleNavGroup">
        <a
          href={`/lich-lam-viec?week=${prevWeek}&year=${prevYear}`}
          className="scheduleNavBtn"
          title="Xem tuần trước"
        >
          ← Tuần {prevWeek}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>Tuần:</span>
          <select
            className="scheduleNavSelect"
            value={`${currentWeek}_${currentYear}`}
            onChange={handleSelectWeek}
          >
            {allWeeks.length > 0 ? (
              allWeeks.map((w, idx) => (
                <option key={idx} value={`${w.weekNumber}_${w.year}`}>
                  Tuần {w.weekNumber} năm {w.year}
                </option>
              ))
            ) : (
              <option value={`${currentWeek}_${currentYear}`}>
                Tuần {currentWeek} năm {currentYear}
              </option>
            )}
          </select>
        </div>

        <a
          href={`/lich-lam-viec?week=${nextWeek}&year=${nextYear}`}
          className="scheduleNavBtn"
          title="Xem tuần sau"
        >
          Tuần {nextWeek} →
        </a>
      </div>

      <div className="scheduleActionBtns">
        {attachedFileUrl && (
          <a
            href={attachedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="actionBtn actionBtnDownload"
            download
          >
            📥 Tải văn bản gốc
          </a>
        )}
      </div>
    </section>
  )
}
