'use client'

import React from 'react'

type NurseAssignment = {
  departmentName: string
  departmentIcon?: string | null
  administrativeStaff?: string | null
  reinforcementStaff?: string | null
  extraStaff?: string | null
  note?: string | null
}

type Props = {
  title: string
  date?: string | null
  assignments?: NurseAssignment[] | null
  generalNote?: string | null
  // Cấu hình tiêu đề cột tùy biến
  col1Title?: string | null
  col1Sub?: string | null
  col2Title?: string | null
  col2Sub?: string | null
  col3Title?: string | null
  col3Sub?: string | null
  enableCol4?: boolean | null
  col4Title?: string | null
  col4Sub?: string | null
}

// Icon mapper cho Khoa / Phòng điều dưỡng
function renderDeptIcon(icon?: string | null) {
  switch (icon) {
    case 'ambulance':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
          <path d="M7 8h4" /><path d="M9 6v4" />
        </svg>
      )
    case 'bed':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
        </svg>
      )
    case 'mortar':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 11-4-7" /><path d="M4 11h16a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8 8 8 0 0 1-8-8v-1a1 1 0 0 1 1-1Z" />
        </svg>
      )
    case 'scalpel':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 2 4 4-12 12H6v-4L18 2Z" /><path d="m14 6 4 4" />
        </svg>
      )
    case 'baby':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.5 1.5.5 2 0" />
          <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
        </svg>
      )
    case 'ultrasound':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M6 10h2l2-4 3 8 2-4h3" /><path d="M12 17v4" /><path d="M8 21h8" />
        </svg>
      )
    case 'tooth':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 9.5C4.5 6 7 3.5 12 3.5s7.5 2.5 7.5 6c0 3.5-1 7.5-2.5 11-1.5-3-2-5-5-5s-3.5 2-5 5c-1.5-3.5-2.5-7.5-2.5-11Z" />
        </svg>
      )
    case 'virus':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" />
          <path d="m4.93 4.93 2.12 2.12" /><path d="m16.95 16.95 2.12 2.12" />
          <path d="m4.93 19.07 2.12-2.12" /><path d="m16.95 7.05 2.12-2.12" />
        </svg>
      )
    case 'clinic':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2" />
        </svg>
      )
    case 'stethoscope':
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      )
  }
}

export function NurseScheduleView({
  title,
  date,
  assignments,
  generalNote,
  col1Title,
  col1Sub,
  col2Title,
  col2Sub,
  col3Title,
  col3Sub,
  enableCol4,
  col4Title,
  col4Sub,
}: Props) {
  let formattedDate = ''
  if (date) {
    const d = new Date(date)
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const dayOfWeekIdx = d.getDay() // 0 = CN, 1 = T2,...
    const weekdayNames = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY']
    formattedDate = `NGÀY ${day}/${month}/${year} (${weekdayNames[dayOfWeekIdx]})`
  }

  const items = assignments || []
  const hasCol4 = Boolean(enableCol4)
  const totalColumns = hasCol4 ? 4 : 3

  // Nhãn tiêu đề với giá trị mặc định đẹp mắt
  const c1Text = col1Title?.trim() || 'KHOA / PHÒNG'
  const c1SubText = col1Sub?.trim() || ''

  const c2Text = col2Title?.trim() || 'HÀNH CHÁNH'
  const c2SubText = col2Sub?.trim() || 'Ca trực chính theo phân công'

  const c3Text = col3Title?.trim() || 'TĂNG CƯỜNG'
  const c3SubText = col3Sub?.trim() || 'Hỗ trợ chuyên môn / Điều động'

  const c4Text = col4Title?.trim() || 'CỘT BỔ SUNG'
  const c4SubText = col4Sub?.trim() || ''

  return (
    <section className="nurseScheduleContainer">
      {/* 1. Header Banner */}
      <header className="nurseMasthead">
        <div className="nurseMastheadTitleBox">
          <div className="nurseTitleRibbon">
            <h2>{title || 'LỊCH NGÀY ĐD - NHS'}</h2>
          </div>
          {formattedDate && (
            <div className="nurseDateBadge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </header>

      {/* 2. Bảng phân công ĐD - NHS (Hỗ trợ 3 hoặc 4 cột linh hoạt) */}
      <div className="nurseTableWrapper">
        <table className={`nurseShiftTable ${hasCol4 ? 'tableWithCol4' : ''}`}>
          <thead>
            <tr>
              {/* Cột 1: KHOA / PHÒNG */}
              <th className={`nurseColDept ${hasCol4 ? 'nurseColDept4' : ''}`}>
                <div className="nurseThContent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2" />
                  </svg>
                  <div className="nurseShiftHeaderLabel">
                    <strong style={{ color: '#ffffff' }}>{c1Text}</strong>
                    {c1SubText && <span style={{ color: '#d1fae5' }}>({c1SubText})</span>}
                  </div>
                </div>
              </th>

              {/* Cột 2: HÀNH CHÁNH */}
              <th className={`nurseColShift nurseAdminCol ${hasCol4 ? 'nurseAdminCol4' : ''}`}>
                <div className="nurseThContent">
                  <span className="nurseThIcon adminIcon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" fill="#fef08a" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </span>
                  <div className="nurseShiftHeaderLabel">
                    <strong>{c2Text}</strong>
                    {c2SubText && <span>({c2SubText})</span>}
                  </div>
                </div>
              </th>

              {/* Cột 3: TĂNG CƯỜNG */}
              <th className={`nurseColShift nurseReinforceCol ${hasCol4 ? 'nurseReinforceCol4' : ''}`}>
                <div className="nurseThContent">
                  <span className="nurseThIcon reinforceIcon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  </span>
                  <div className="nurseShiftHeaderLabel">
                    <strong>{c3Text}</strong>
                    {c3SubText && <span>({c3SubText})</span>}
                  </div>
                </div>
              </th>

              {/* Cột 4: BỔ SUNG (NẾU BẬT) */}
              {hasCol4 && (
                <th className="nurseColShift nurseExtraCol">
                  <div className="nurseThContent">
                    <span className="nurseThIcon extraIcon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </span>
                    <div className="nurseShiftHeaderLabel">
                      <strong>{c4Text}</strong>
                      {c4SubText && <span>({c4SubText})</span>}
                    </div>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="nurseTableEmptyCell">
                  Chưa có phân công điều dưỡng cho ngày này.
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'nurseRowEven' : 'nurseRowOdd'}>
                  {/* Cột 1: Khoa / Phòng */}
                  <td className={`nurseTdDept ${hasCol4 ? 'nurseTdDept4' : ''}`}>
                    <div className="nurseDeptBox">
                      <span className="nurseDeptIconWrap">
                        {renderDeptIcon(row.departmentIcon)}
                      </span>
                      <div className="nurseDeptNameCol">
                        <strong className="nurseDeptName">{row.departmentName}</strong>
                        {row.note && <span className="nurseRowSubNote">{row.note}</span>}
                      </div>
                    </div>
                  </td>

                  {/* Cột 2: Hành chánh */}
                  <td className="nurseTdShift nurseTdAdmin">
                    {row.administrativeStaff && row.administrativeStaff.trim() ? (
                      <div className="nurseStaffContent">
                        {row.administrativeStaff.split('\n').map((line, lIdx) => (
                          <div key={lIdx} className="nurseStaffLine">
                            {line.trim()}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="nurseCellEmpty">–</span>
                    )}
                  </td>

                  {/* Cột 3: Tăng cường */}
                  <td className="nurseTdShift nurseTdReinforce">
                    {row.reinforcementStaff && row.reinforcementStaff.trim() ? (
                      <div className="nurseStaffContent reinforceText">
                        {row.reinforcementStaff.split('\n').map((line, lIdx) => (
                          <div key={lIdx} className="nurseStaffLine">
                            {line.trim()}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="nurseCellEmpty">–</span>
                    )}
                  </td>

                  {/* Cột 4: Bổ sung (nếu bật) */}
                  {hasCol4 && (
                    <td className="nurseTdShift nurseTdExtra">
                      {row.extraStaff && row.extraStaff.trim() ? (
                        <div className="nurseStaffContent extraText">
                          {row.extraStaff.split('\n').map((line, lIdx) => (
                            <div key={lIdx} className="nurseStaffLine">
                              {line.trim()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="nurseCellEmpty">–</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Ghi chú chung ở chân bảng */}
      {generalNote && generalNote.trim() && (
        <footer className="nurseFooterNoteBox">
          <div className="nurseFooterNoteIcon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="nurseFooterNoteText">
            <strong>{generalNote}</strong>
          </div>
        </footer>
      )}
    </section>
  )
}
