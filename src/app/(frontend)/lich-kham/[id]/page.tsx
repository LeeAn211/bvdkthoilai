import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = { params: Promise<{ id: string }> }

const DAY_KEYS = ['2', '3', '4', '5', '6', '7', '8'] as const
const DAY_LABELS: Record<string, { full: string; short: string }> = {
  '2': { full: 'Thứ Hai', short: 'T2' },
  '3': { full: 'Thứ Ba', short: 'T3' },
  '4': { full: 'Thứ Tư', short: 'T4' },
  '5': { full: 'Thứ Năm', short: 'T5' },
  '6': { full: 'Thứ Sáu', short: 'T6' },
  '7': { full: 'Thứ Bảy', short: 'T7' },
  '8': { full: 'Chủ Nhật', short: 'CN' },
}

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : '')

// QUY TẮC BẮT BUỘC DỰ ÁN (MANDATE): Thứ tự ưu tiên Ban Giám đốc Bệnh viện
function getLeadershipRank(doc: any): number {
  if (!doc) return 99
  const title = (doc.title || '').toLowerCase()
  const deptName = (typeof doc.department === 'object' ? doc.department?.name : '').toLowerCase()
  const isBoard = deptName.includes('ban giám đốc') || title.includes('giám đốc')

  if (isBoard) {
    if (title.includes('phó') || title.includes('pho')) return 2 // Phó Giám đốc
    if (title.includes('giám đốc') || title.includes('giam doc')) return 1 // Giám đốc
    return 3 // Thành viên Ban Giám đốc khác
  }
  if (title.includes('trưởng') || title.includes('phó')) return 5
  return 10
}

export default async function ScheduleDetailPage({ params }: Props) {
  const { id } = await params
  let item: any
  let medpro = process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'

  try {
    const [payload, settings] = await Promise.all([getCMS(), getGlobal('site-settings')])
    medpro = (settings as any)?.medproUrl || medpro
    item = await payload.findByID({ collection: 'schedules', id, depth: 2 })
  } catch {
    notFound()
  }

  if (!item || item.active === false) notFound()

  const mode = item.mode || 'daily'
  const image = mediaUrl((mode === 'attachment' ? item.scheduleImage : null) || item.coverImage, 'article')
  const eyebrow = mode === 'attachment' ? 'LỊCH KHÁM ĐÍNH KÈM' : mode === 'weekly' ? 'LỊCH KHÁM THEO TUẦN' : mode === 'emergency' ? 'LỊCH TRỰC CẤP CỨU THEO TUẦN' : 'LỊCH KHÁM THEO NGÀY'

  // Xử lý gom nhóm bác sĩ theo từng Thứ trong tuần
  const rawSlots = item.weeklySlots || []
  const groupedWeeklyDays = DAY_KEYS.map((key) => {
    const slotsInDay = rawSlots.filter((slot: any) => String(slot.dayOfWeek) === key)
    // Sắp xếp thứ tự bác sĩ trong ngày: Ban Giám đốc -> Trưởng/Phó -> Bác sĩ
    slotsInDay.sort((a: any, b: any) => {
      const docA = typeof a.doctor === 'object' ? a.doctor : null
      const docB = typeof b.doctor === 'object' ? b.doctor : null
      const rankA = getLeadershipRank(docA)
      const rankB = getLeadershipRank(docB)
      if (rankA !== rankB) return rankA - rankB
      return (docA?.name || '').localeCompare(docB?.name || '', 'vi')
    })
    return {
      dayKey: key,
      label: DAY_LABELS[key] || { full: `Thứ ${key}`, short: `T${key}` },
      slots: slotsInDay,
    }
  }).filter((group) => group.slots.length > 0)

  // Xử lý dữ liệu lịch trực cấp cứu theo tuần:
  // Hỗ trợ cả 2 định dạng:
  // 1. weeklyDeptSlots (Khoa/Bộ phận × 7 Ngày) - format chuẩn mới theo truc.xlsx
  // 2. weeklyEmergencySlots (Ca sáng/chiều/tối × 7 Ngày) - format cũ
  const weeklyDeptSlots: Array<{
    deptName?: string
    subRole?: string
    deptType?: string
    day2?: string; day3?: string; day4?: string
    day5?: string; day6?: string; day7?: string; day8?: string
    fixedStaff?: string
    note?: string
  }> = item.weeklyDeptSlots || []

  const rawEmergencySlots = item.weeklyEmergencySlots || []
  const emergencyDayMap: Record<string, { morningDoctors?: string; afternoonDoctors?: string; nightDoctors?: string; note?: string }> = {}
  for (const slot of rawEmergencySlots) {
    emergencyDayMap[String(slot.dayOfWeek)] = {
      morningDoctors: slot.morningDoctors,
      afternoonDoctors: slot.afternoonDoctors,
      nightDoctors: slot.nightDoctors,
      note: slot.note,
    }
  }

  const dailyAssignments = item.dailyAssignments || []
  
  // Format tuần cấp cứu
  let emergencyWeekLabel = ''
  if (item.emergencyWeekStart || item.emergencyWeekEnd) {
    const s = item.emergencyWeekStart ? new Date(item.emergencyWeekStart).toLocaleDateString('vi-VN') : ''
    const e = item.emergencyWeekEnd ? new Date(item.emergencyWeekEnd).toLocaleDateString('vi-VN') : ''
    emergencyWeekLabel = [s && `Từ ${s}`, e && `Đến ${e}`].filter(Boolean).join(' – ')
  }

  // Helper render badge khoa / bộ phận
  const getDeptTypeBadge = (type?: string) => {
    switch (type) {
      case 'leader':
        return { label: '👔 Lãnh đạo', bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
      case 'paraclinical':
        return { label: '🔬 Cận lâm sàng', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
      case 'admin':
        return { label: '🚗 Hành chính', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' }
      default:
        return { label: '🏥 Lâm sàng', bg: '#fff1f2', color: '#b91c1c', border: '#fecaca' }
    }
  }

  // Helper render bác sĩ cho bảng emergency (grid 2 cột)
  const renderEmergencyDoctors = (doctorStr?: string, shiftType?: 'morning' | 'afternoon' | 'night') => {
    if (!doctorStr || !doctorStr.trim() || doctorStr.trim() === '-') {
      return <span className="emergencyCellEmpty">–</span>
    }
    const names = doctorStr.split(/[,;\n/]+/).map(n => n.trim()).filter(n => n.length > 0)
    if (names.length === 0) return <span className="emergencyCellEmpty">–</span>
    return (
      <div className="emergencyDoctorGrid">
        {names.map((name, idx) => (
          <div key={idx} className={`emergencyDoctorChip chip-${shiftType || 'default'}`}>
            <span className="emergencyDoctorChipIcon">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </span>
            <strong className="emergencyDoctorName" title={name}>{name}</strong>
          </div>
        ))}
      </div>
    )
  }

  let dailyFormattedDate = ''
  if (item.date) {
    const d = new Date(item.date)
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const dayOfWeekIdx = d.getDay() // 0 = CN, 1 = T2,...
    const weekdayNames = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY']
    dailyFormattedDate = `NGÀY ${day}/${month}/${year} (${weekdayNames[dayOfWeekIdx]})`
  }

  // Helper render icon cho từng khoa
  const renderDepartmentIcon = (iconType?: string) => {
    switch (iconType) {
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
            <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2"/>
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

  // Helper tách và hiển thị danh sách bác sĩ thành từng thẻ Tag chuyên nghiệp
  const renderDoctorChips = (doctorStr?: string, shiftType?: 'morning' | 'noon' | 'afternoon' | 'evening') => {
    if (!doctorStr || !doctorStr.trim() || doctorStr.trim() === '-') {
      return <span className="dailyDoctorEmpty">–</span>
    }

    // Tách theo dấu phẩy, chấm phẩy hoặc dấu gạch chéo hoặc xuống dòng
    const rawNames = doctorStr
      .split(/[,;\n/]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (rawNames.length === 0) {
      return <span className="dailyDoctorEmpty">–</span>
    }

    return (
      <div
        className="dailyDoctorChipList"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '5px',
          width: '100%',
        }}
      >
        {rawNames.map((name, idx) => (
          <div
            key={idx}
            className={`dailyDoctorChip chip-${shiftType || 'default'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 6px',
              borderRadius: '6px',
              minWidth: 0,
            }}
          >
            <span className="dailyDoctorChipIcon" style={{ flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </span>
            <strong
              className="dailyDoctorChipName"
              style={{
                fontSize: '12px',
                fontWeight: 750,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.25,
              }}
              title={name}
            >
              {name}
            </strong>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="article-shell container scheduleDetail">
        {mode !== 'daily' && (
          <>
            <div className="article-meta">{eyebrow}</div>
            <h1>{item.title}</h1>
            {item.summary && <p className="article-lead">{item.summary}</p>}
            {image && (
              <div className="articleCoverFrame">
                <img className="articleCover scheduleDetailCover" src={image} alt={item.title} />
              </div>
            )}
          </>
        )}

        {mode === 'daily' && dailyAssignments.length === 0 && (
          <>
            <div className="article-meta">{eyebrow}</div>
            <h1>{item.title}</h1>
            {item.summary && <p className="article-lead">{item.summary}</p>}
            {image && (
              <div className="articleCoverFrame">
                <img className="articleCover scheduleDetailCover" src={image} alt={item.title} />
              </div>
            )}
          </>
        )}

        {mode === 'daily' && dailyAssignments.length > 0 && (
          <section className="dailySchedulePoster">
            {/* 1. Header tinh gọn: Chỉ giữ lại Lịch phân công bác sĩ khám bệnh và Ngày khám */}
            <header className="dailyScheduleMasthead dailyScheduleMastheadSimple">
              <div className="dailyMastheadTitleBox">
                <div className="dailyTitleRibbon">
                  <h2>LỊCH PHÂN CÔNG BÁC SĨ KHÁM BỆNH</h2>
                </div>
                {dailyFormattedDate && (
                  <div className="dailyDateBadge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{dailyFormattedDate}</span>
                  </div>
                )}
              </div>
            </header>

            {/* 2. Bảng ma trận phân công theo khoa phòng & khung giờ */}
            <div className="dailyTableWrapper">
              <table className="dailyShiftTable">
                <thead>
                  <tr>
                    <th className="dailyColDept">
                      <div className="dailyThDeptContent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2" />
                        </svg>
                        <span>KHOA / PHÒNG</span>
                      </div>
                    </th>
                    <th className="dailyColShift dailyShiftMorningCol">
                      <div className="dailyThShiftContent">
                        <span className="dailyShiftSunIcon morning">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4" fill="#fef08a" />
                            <path d="M12 2v2" /><path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" /><path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                          </svg>
                        </span>
                        <div className="dailyShiftTime">
                          <strong>07:00 – 10:00</strong>
                        </div>
                      </div>
                    </th>
                    <th className="dailyColShift dailyShiftNoonCol">
                      <div className="dailyThShiftContent">
                        <span className="dailyShiftSunIcon noon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" fill="#fed7aa" stroke="#ea580c" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                          </svg>
                        </span>
                        <div className="dailyShiftTime">
                          <strong>10:00 – 11:00</strong>
                        </div>
                      </div>
                    </th>
                    <th className="dailyColShift dailyShiftAfternoonCol">
                      <div className="dailyThShiftContent">
                        <span className="dailyShiftSunIcon afternoon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4" fill="#bae6fd" />
                            <path d="M12 2v2" /><path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" /><path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                          </svg>
                        </span>
                        <div className="dailyShiftTime">
                          <strong>13:00 – 16:00</strong>
                        </div>
                      </div>
                    </th>
                    <th className="dailyColShift dailyShiftEveningCol">
                      <div className="dailyThShiftContent">
                        <span className="dailyShiftSunIcon evening">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4" fill="#fed7aa" stroke="#ea580c" />
                            <path d="M12 2v2" /><path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" /><path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                          </svg>
                        </span>
                        <div className="dailyShiftTime">
                          <strong>16:00 – 17:00</strong>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyAssignments.map((row: any, rIdx: number) => (
                    <tr key={row.id || rIdx} className={rIdx % 2 === 1 ? 'dailyRowEven' : 'dailyRowOdd'}>
                      <td className="dailyCellDept">
                        <div className="dailyDeptLabel">
                          <span className="dailyDeptIcon">{renderDepartmentIcon(row.departmentIcon)}</span>
                          <strong className="dailyDeptName">{row.departmentName}</strong>
                        </div>
                      </td>
                      <td className="dailyCellShift">
                        {renderDoctorChips(row.morningDoctors, 'morning')}
                      </td>
                      <td className="dailyCellShift">
                        {renderDoctorChips(row.noonDoctors, 'noon')}
                      </td>
                      <td className="dailyCellShift">
                        {renderDoctorChips(row.afternoonDoctors, 'afternoon')}
                      </td>
                      <td className="dailyCellShift">
                        {renderDoctorChips(row.eveningDoctors, 'evening')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {mode === 'daily' && dailyAssignments.length === 0 && (
          <div className="scheduleDetailFacts">
            <span>
              Bác sĩ: <b>{item.doctor?.name || 'Bác sĩ phụ trách'}</b>
            </span>
            <span>
              Khoa / Phòng: <b>{item.department?.name || '-'}</b>
            </span>
            <span>
              Ngày khám: <b>{formatDate(item.date)}</b>
            </span>
            <span>
              Thời gian: <b>{item.startTime || '--:--'} – {item.endTime || '--:--'}</b>
            </span>
            <span>
              Phòng khám: <b>{item.room || '-'}</b>
            </span>
          </div>
        )}

        {mode === 'emergency' && (
          <section className="emergencySchedulePoster">
            {/* Header cấp cứu */}
            <header className="emergencyMasthead">
              <div className="emergencyTitleRibbon">
                <span className="emergencyTitleIcon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                    <path d="M7 8h4" /><path d="M9 6v4" />
                  </svg>
                </span>
                <h2>{item.title || 'LỊCH TRỰC CẤP CỨU & BỆNH VIỆN'}</h2>
              </div>
              {emergencyWeekLabel && (
                <div className="emergencyWeekBadge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{emergencyWeekLabel}</span>
                </div>
              )}
            </header>

            {/* BẢNG 1: MA TRẬN KHOA × 7 NGÀY (Chuẩn theo truc.xlsx) */}
            {weeklyDeptSlots.length > 0 ? (
              <div className="emergencyTableWrapper">
                <table className="emergencyShiftTable">
                  <thead>
                    <tr>
                      <th className="emergencyColLabel" style={{ width: '16%' }}>
                        <div className="emergencyThLabelContent">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <span>KHOA / BỘ PHẬN</span>
                        </div>
                      </th>
                      {DAY_KEYS.map((key) => (
                        <th key={key} className="emergencyColDay" style={{ width: '12%' }}>
                          <div className="emergencyThDayContent">
                            <span className="emergencyDayShort">{DAY_LABELS[key]?.short || key}</span>
                            <span className="emergencyDayFull">{DAY_LABELS[key]?.full || `Thứ ${key}`}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyDeptSlots.map((slot, sIdx) => {
                      const badge = getDeptTypeBadge(slot.deptType)
                      const daysData: Record<string, string | undefined> = {
                        '2': slot.day2,
                        '3': slot.day3,
                        '4': slot.day4,
                        '5': slot.day5,
                        '6': slot.day6,
                        '7': slot.day7,
                        '8': slot.day8,
                      }

                      return (
                        <tr key={sIdx}>
                          <td className="emergencyRowHeader" style={{ textAlign: 'left', padding: '10px 12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                                  background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                                  textTransform: 'uppercase', letterSpacing: '0.4px',
                                }}>
                                  {badge.label}
                                </span>
                                {slot.subRole && (
                                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#4b5563', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
                                    {slot.subRole}
                                  </span>
                                )}
                              </div>
                              <strong style={{ fontSize: 12.5, fontWeight: 800, color: '#1e293b', lineHeight: 1.3 }}>
                                {slot.deptName}
                              </strong>
                              {slot.note && (
                                <span style={{ fontSize: 10.5, color: '#64748b', fontStyle: 'italic' }}>
                                  {slot.note}
                                </span>
                              )}
                            </div>
                          </td>
                          {DAY_KEYS.map((key) => {
                            const staffStr = daysData[key]
                            return (
                              <td key={key} style={{ verticalAlign: 'top', padding: '8px 6px' }}>
                                {renderEmergencyDoctors(staffStr, slot.deptType === 'leader' ? 'morning' : slot.deptType === 'paraclinical' ? 'afternoon' : 'night')}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Fallback cho bản ghi cũ dùng weeklyEmergencySlots */
              <div className="emergencyTableWrapper">
                <table className="emergencyShiftTable">
                  <thead>
                    <tr>
                      <th className="emergencyColLabel">
                        <div className="emergencyThLabelContent">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>CA TRỰC</span>
                        </div>
                      </th>
                      {DAY_KEYS.map((key) => (
                        <th key={key} className="emergencyColDay">
                          <div className="emergencyThDayContent">
                            <span className="emergencyDayShort">{DAY_LABELS[key]?.short || key}</span>
                            <span className="emergencyDayFull">{DAY_LABELS[key]?.full || `Thứ ${key}`}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="emergencyRowMorning">
                      <td className="emergencyRowHeader">
                        <div className="emergencyRowHeaderContent">
                          <span className="emergencyRowHeaderIcon">☀️</span>
                          <span className="emergencyRowHeaderLabel">CA SÁNG</span>
                          <span className="emergencyRowHeaderTime">07:00 – 13:00</span>
                        </div>
                      </td>
                      {DAY_KEYS.map((key) => (
                        <td key={key}>{renderEmergencyDoctors(emergencyDayMap[key]?.morningDoctors, 'morning')}</td>
                      ))}
                    </tr>
                    <tr className="emergencyRowAfternoon">
                      <td className="emergencyRowHeader">
                        <div className="emergencyRowHeaderContent">
                          <span className="emergencyRowHeaderIcon">🌤️</span>
                          <span className="emergencyRowHeaderLabel">CA CHIỀU</span>
                          <span className="emergencyRowHeaderTime">13:00 – 19:00</span>
                        </div>
                      </td>
                      {DAY_KEYS.map((key) => (
                        <td key={key}>{renderEmergencyDoctors(emergencyDayMap[key]?.afternoonDoctors, 'afternoon')}</td>
                      ))}
                    </tr>
                    <tr className="emergencyRowNight">
                      <td className="emergencyRowHeader">
                        <div className="emergencyRowHeaderContent">
                          <span className="emergencyRowHeaderIcon">🌙</span>
                          <span className="emergencyRowHeaderLabel">CA TỐI</span>
                          <span className="emergencyRowHeaderTime">19:00 – 07:00</span>
                        </div>
                      </td>
                      {DAY_KEYS.map((key) => (
                        <td key={key}>{renderEmergencyDoctors(emergencyDayMap[key]?.nightDoctors, 'night')}</td>
                      ))}
                    </tr>
                    {DAY_KEYS.some(k => emergencyDayMap[k]?.note) && (
                      <tr className="emergencyNoteRow">
                        <td className="emergencyRowHeader" style={{ borderRight: '2px solid #dc2626', textAlign: 'center', fontSize: 11, color: '#b91c1c', fontWeight: 800 }}>GHI CHÚ</td>
                        {DAY_KEYS.map((key) => (
                          <td key={key} className="emergencyNoteCell">
                            {emergencyDayMap[key]?.note || ''}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* BẢNG 2: DANH SÁCH NHÂN SỰ CỐ ĐỊNH / TRỰC THEO KHOA (Nếu có fixedStaff) */}
            {weeklyDeptSlots.some(s => s.fixedStaff) && (
              <div style={{ marginTop: 24, padding: 18, borderRadius: 12, border: '1.5px solid #fecaca', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: '#b91c1c', fontWeight: 800, fontSize: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>PHÂN CÔNG NHÂN SỰ CÁC KHOA / BỘ PHẬN TRONG TUẦN</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {weeklyDeptSlots.filter(s => s.fixedStaff).map((s, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fef2f2' }}>
                      <div style={{ fontWeight: 800, fontSize: 12, color: '#991b1b', marginBottom: 4, textTransform: 'uppercase' }}>
                        {s.deptName}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#374151', whiteSpace: 'pre-line', lineHeight: 1.45 }}>
                        {s.fixedStaff}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BẢNG 3: GHI CHÚ ĐIỀU ĐỘNG / HỌC TẬP TRONG TUẦN (Nếu có) */}
            {item.emergencyGeneralNote && (
              <div style={{ marginTop: 20, padding: 16, borderRadius: 10, border: '1.5px solid #fed7aa', background: '#fffbeb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#c2410c', fontWeight: 800, fontSize: 13, marginBottom: 6 }}>
                  <span>📌 GHI CHÚ ĐIỀU ĐỘNG & CÔNG TÁC TRONG TUẦN</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#7c2d12', whiteSpace: 'pre-line', lineHeight: 1.5, fontWeight: 500 }}>
                  {item.emergencyGeneralNote}
                </div>
              </div>
            )}

            {/* BẢNG 4: DANH BẠ ĐIỆN THOẠI TRỰC & CẤP CỨU LIÊN VIỆN (Nếu có) */}
            {Array.isArray(item.emergencyContacts) && item.emergencyContacts.length > 0 && (
              <div style={{ marginTop: 20, padding: 18, borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', fontWeight: 800, fontSize: 13.5, marginBottom: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>ĐƯỜNG DÂY NÓNG TRỰC & SỐ ĐIỆN THOẠI CẤP CỨU LIÊN VIỆN</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                  {item.emergencyContacts.map((c: any, idx: number) => {
                    const isHospital = c.type === 'emergency_unit'
                    return (
                      <div key={idx} style={{
                        padding: '10px 12px', borderRadius: 8,
                        border: isHospital ? '1px solid #fecaca' : '1px solid #e2e8f0',
                        background: isHospital ? '#fff1f2' : '#ffffff',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                      }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: isHospital ? '#991b1b' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>
                            {isHospital ? '🚑 Bệnh viện tuyến trên' : '📞 Nội bộ'}
                          </div>
                        </div>
                        <a href={`tel:${String(c.phone).replace(/\s+/g, '')}`} style={{
                          fontSize: 12, fontWeight: 800, color: '#dc2626', textDecoration: 'none',
                          padding: '4px 8px', borderRadius: 6, background: '#fee2e2', whiteSpace: 'nowrap',
                        }}>
                          {c.phone}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {mode === 'weekly' && (
          <section className="weeklyScheduleCard scheduleDetailWeekly">
            <div className="weeklyScheduleHead">
              <div>
                <span>LỊCH KHÁM TUẦN</span>
                <h2>{item.title}</h2>
              </div>
              <strong>
                {formatDate(item.weekStart)} {item.weekEnd ? `– ${formatDate(item.weekEnd)}` : ''}
              </strong>
            </div>

            <div className="weeklyGroupedTable">
              {groupedWeeklyDays.length === 0 ? (
                <div className="weeklyEmptyState">Chưa có thông tin ca khám nào được phân công trong tuần này.</div>
              ) : (
                groupedWeeklyDays.map((dayGroup) => (
                  <div key={dayGroup.dayKey} className="weeklyDayRow">
                    {/* Cột 1: Thông tin Thứ (Gom lại 1 hàng duy nhất) */}
                    <div className="weeklyDayBadgeColumn">
                      <div className="weeklyDayBadge">
                        <span className="weeklyDayShort">{dayGroup.label.short}</span>
                        <strong className="weeklyDayFull">{dayGroup.label.full}</strong>
                      </div>
                      <span className="weeklyDoctorCountBadge">{dayGroup.slots.length} bác sĩ khám</span>
                    </div>

                    {/* Cột 2: Danh sách tất cả các bác sĩ khám trong thứ đó */}
                    <div className="weeklyDayDoctorsColumn">
                      <div className="weeklyDoctorCardGrid">
                        {dayGroup.slots.map((slot: any, sIdx: number) => {
                          const doc = typeof slot.doctor === 'object' ? slot.doctor : null
                          const dept = typeof slot.department === 'object' ? slot.department : null
                          const docAvatar = doc?.avatar ? mediaUrl(doc.avatar, 'thumbnail') : null
                          const isLeadership = getLeadershipRank(doc) <= 3

                          return (
                            <div key={slot.id || sIdx} className={`weeklyDoctorItemCard ${isLeadership ? 'isLeadershipDoctor' : ''}`}>
                              {docAvatar && (
                                <div className="weeklyDoctorItemAvatar">
                                  <img src={docAvatar} alt={doc?.name || 'Bác sĩ'} />
                                </div>
                              )}
                              <div className="weeklyDoctorItemContent">
                                <div className="weeklyDoctorHeaderRow">
                                  <h4 className="weeklyDoctorItemName">
                                    {doc?.slug ? (
                                      <Link href={`/bac-si/${doc.slug}`}>{doc?.name || 'Bác sĩ'}</Link>
                                    ) : (
                                      <span>{doc?.name || 'Bác sĩ'}</span>
                                    )}
                                  </h4>
                                  {isLeadership && <span className="weeklyLeadershipBadge">Ban Giám Đốc</span>}
                                </div>

                                <div className="weeklyDoctorDepartment">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>
                                  <span>{dept?.name || doc?.department?.name || 'Khoa khám bệnh'}</span>
                                </div>

                                <div className="weeklyDoctorMetaRow">
                                  <span className="weeklyDoctorTime">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    {slot.startTime && slot.endTime ? `${slot.startTime} – ${slot.endTime}` : (slot.startTime || slot.endTime || 'Theo ca trực')}
                                  </span>

                                  <span className="weeklyDoctorRoom">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    {slot.room || 'Phòng khám tại quầy'}
                                  </span>
                                </div>

                                {slot.note && <div className="weeklyDoctorNote">💡 {slot.note}</div>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        <RichText data={item.detailContent} />
        {item.note && (
          <p className="vaccinationDetailNote">
            <b>Ghi chú:</b> {item.note}
          </p>
        )}
        <AttachmentList
          items={[
            ...(item.scheduleFile ? [{ file: item.scheduleFile }] : []),
            ...((item.attachmentFiles || []).map((entry: any) => ({ file: entry.file, label: entry.label }))),
          ]}
          title="Tệp lịch khám"
        />
        <div className="scheduleDetailActions">
          <a className="btn btn-primary" href={medpro} target="_blank" rel="noopener noreferrer">
            Đặt lịch khám
          </a>
          <BackToList href="/lich-kham" label="Trở lại danh sách lịch khám" />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
