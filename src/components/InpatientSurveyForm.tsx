'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { TurnstileWidget } from './TurnstileWidget'

// Cấu trúc chuẩn Thang điểm 5 mức Likert của Bộ Y tế
const RATING_5_LEVELS = [
  { score: 1, label: 'Rất không hài lòng', emoji: '😞' },
  { score: 2, label: 'Không hài lòng', emoji: '🙁' },
  { score: 3, label: 'Bình thường', emoji: '😐' },
  { score: 4, label: 'Hài lòng', emoji: '🙂' },
  { score: 5, label: 'Rất hài lòng', emoji: '😄' },
]

// BỘ CÂU HỎI MẪU SỐ 1 - KHẢO SÁT HÀI LÒNG NGƯỜI BỆNH NỘI TRÚ (BỘ Y TẾ)
export const INPATIENT_SURVEY_SECTIONS = [
  {
    code: 'A',
    title: 'Phần A: Khả năng tiếp cận & Thủ tục nhập viện',
    desc: 'Đánh giá về chỉ dẫn đường, sơ đồ khoa phòng điều trị, thủ tục nhập viện và phân buồng bệnh',
    questions: [
      { id: 'A1', text: 'Biển báo, sơ đồ chỉ dẫn đường đến các khoa điều trị nội trú rõ ràng, dễ tìm' },
      { id: 'A2', text: 'Thủ tục làm hồ sơ nhập viện nhanh gọn, được nhân viên y tế hướng dẫn tận tình chu đáo' },
      { id: 'A3', text: 'Được bố trí buồng bệnh và giường nằm kịp thời, thuận tiện cho người bệnh và thân nhân' },
      { id: 'A4', text: 'Được phổ biến nội quy buồng bệnh, giờ thăm nuôi và chế độ sinh hoạt rõ ràng' },
    ],
  },
  {
    code: 'B',
    title: 'Phần B: Sự minh bạch thông tin & Chi phí điều trị',
    desc: 'Đánh giá việc giải thích bệnh tật, phác đồ điều trị, công khai đơn thuốc và viện phí BHYT',
    questions: [
      { id: 'B1', text: 'Bác sĩ giải thích rõ ràng về tình trạng bệnh, mục đích các xét nghiệm và phác đồ điều trị' },
      { id: 'B2', text: 'Được thông báo và giải thích trước khi thực hiện các thủ thuật, phẫu thuật hoặc kỹ thuật cao' },
      { id: 'B3', text: 'Quyền lợi BHYT, chi phí tiền giường, thuốc và dịch vụ kỹ thuật được công khai minh bạch' },
      { id: 'B4', text: 'Thủ tục thanh toán viện phí, tạm ứng và thanh quyết toán khi ra viện thuận lợi, nhanh chóng' },
    ],
  },
  {
    code: 'C',
    title: 'Phần C: Cơ sở vật chất & Tiện nghi buồng bệnh',
    desc: 'Đánh giá về buồng bệnh, giường nệm, chăn ga, vệ sinh buồng phòng, nguồn nước và an ninh',
    questions: [
      { id: 'C1', text: 'Buồng bệnh sạch sẽ, thoáng mát (có quạt/điều hòa), không gian yên tĩnh nghỉ ngơi' },
      { id: 'C2', text: 'Giường bệnh, đệm, ga trải giường và quần áo người bệnh sạch sẽ, được thay định kỳ' },
      { id: 'C3', text: 'Nhà vệ sinh trong khoa điều trị sạch sẽ, có nước dùng đầy đủ, không có mùi khó chịu' },
      { id: 'C4', text: 'Hệ thống điện nước, chuông gọi điều dưỡng tại đầu giường hoạt động tốt, an toàn' },
      { id: 'C5', text: 'An ninh trật tự trong bệnh viện được đảm bảo tốt, không xảy ra mất cắp hay quấy rầy' },
    ],
  },
  {
    code: 'D',
    title: 'Phần D: Thái độ ứng xử & Năng lực chăm sóc của nhân viên y tế',
    desc: 'Đánh giá chuyên môn bác sĩ, tinh thần phục vụ của điều dưỡng, sự ân cần và sẵn sàng hỗ trợ',
    questions: [
      { id: 'D1', text: 'Bác sĩ thăm khám hàng ngày cẩn thận, ân cần, lắng nghe và giải đáp các thắc mắc' },
      { id: 'D2', text: 'Điều dưỡng thực hiện tiêm truyền, phát thuốc nhẹ nhàng, đúng giờ, chu đáo và thân thiện' },
      { id: 'D3', text: 'Khi người bệnh bấm chuông gọi hoặc cần giúp đỡ khẩn cấp, nhân viên y tế có mặt kịp thời' },
      { id: 'D4', text: 'Nhân viên y tế tôn trọng quyền riêng tư, giữ thái độ hòa nhã, không cáu gắt hay vòi vĩnh' },
    ],
  },
  {
    code: 'E',
    title: 'Phần E: Kết quả điều trị & Niềm tin của người bệnh',
    desc: 'Đánh giá về mức độ hồi phục sức khỏe, hướng dẫn dặn dò khi xuất viện và niềm tin vào bệnh viện',
    questions: [
      { id: 'E1', text: 'Tình trạng sức khỏe được cải thiện rõ rệt sau đợt điều trị nội trú tại bệnh viện' },
      { id: 'E2', text: 'Trước khi xuất viện, bác sĩ dặn dò kỹ lưỡng về chế độ ăn uống, dùng thuốc và hẹn tái khám' },
      { id: 'E3', text: 'Chất lượng điều trị và chăm sóc y tế nội trú tương xứng với sự tin tưởng và chi phí bỏ ra' },
    ],
  },
]

export default function InpatientSurveyForm() {
  const [busy, setBusy] = useState(false)
  const [doneData, setDoneData] = useState<{ code: string; overallScore?: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Thông tin hành chính (Section I)
  const [demographics, setDemographics] = useState({
    gender: 'Nam',
    ageGroup: '30-45',
    daysInHospital: '3 - 5 ngày',
    insurance: 'Có BHYT',
    area: 'Huyện Thới Lai',
    department: 'Khoa Nội tổng hợp',
    respondentType: 'Người bệnh trực tiếp',
  })

  // Điểm số 1-5 cho 20 câu hỏi Phần A -> E
  const [ratings, setRatings] = useState<Record<string, number>>({})

  // Điểm tổng thể 1-10
  const [overallRating10, setOverallRating10] = useState<number>(9)

  // Khả năng quay lại / giới thiệu
  const [wouldReturn, setWouldReturn] = useState<string>('Chắc chắn quay lại')

  // Góp ý khác
  const [comment, setComment] = useState('')

  // Tính tổng số câu hỏi cần chấm điểm
  const allQuestions = useMemo(() => {
    const list: { id: string; text: string; sectionCode: string }[] = []
    for (const sec of INPATIENT_SURVEY_SECTIONS) {
      for (const q of sec.questions) {
        list.push({ ...q, sectionCode: sec.code })
      }
    }
    return list
  }, [])

  const totalQuestions = allQuestions.length
  const answeredCount = Object.keys(ratings).length
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100)

  function handleRating(qId: string, score: number) {
    setRatings(prev => ({ ...prev, [qId]: score }))
    setErrorMsg('')
  }

  function handleBatchSection(sectionCode: string, score: number) {
    const sec = INPATIENT_SURVEY_SECTIONS.find(s => s.code === sectionCode)
    if (!sec) return
    const update: Record<string, number> = {}
    for (const q of sec.questions) {
      update[q.id] = score
    }
    setRatings(prev => ({ ...prev, ...update }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')

    // Kiểm tra xem đã chấm điểm đầy đủ chưa
    const missing = allQuestions.filter(q => !ratings[q.id])
    if (missing.length > 0) {
      setErrorMsg(`Quý vị vui lòng đánh giá đầy đủ tất cả câu hỏi. Còn ${missing.length} câu chưa chọn (ví dụ: ${missing[0].id}).`)
      const el = document.getElementById(`q-${missing[0].id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setBusy(true)
    const fd = new FormData(e.currentTarget)

    try {
      const payload = {
        demographics,
        ratings,
        overallRating10,
        wouldReturn,
        comment,
        website: fd.get('website'),
        'cf-turnstile-response': fd.get('cf-turnstile-response'),
      }

      const res = await fetch('/api/surveys/inpatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setBusy(false)

      if (res.ok && data.ok) {
        setDoneData({ code: data.code, overallScore: data.overallScore })
        window.scrollTo({ top: 100, behavior: 'smooth' })
      } else {
        setErrorMsg(data.error || 'Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.')
      }
    } catch {
      setBusy(false)
      setErrorMsg('Lỗi kết nối máy chủ. Vui lòng kiểm tra đường truyền internet.')
    }
  }

  // Giao diện gửi thành công
  if (doneData) {
    return (
      <div className="opsSuccessCard">
        <div className="opsSuccessIcon">✓</div>
        <div className="opsGovBadge" style={{ margin: '0 auto 12px', display: 'inline-flex' }}>
          ĐÃ TIẾP NHẬN PHIẾU KHẢO SÁT NỘI TRÚ
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          Cảm ơn Quý người bệnh đã tham gia khảo sát!
        </h2>
        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 20px' }}>
          Ý kiến phản hồi chân thực từ Quý vị trong suốt quá trình nằm viện điều trị sẽ giúp Bệnh viện Đa khoa Khu vực Thới Lai liên tục cải tiến môi trường buồng bệnh và nâng cao tinh thần chăm sóc y tế.
        </p>

        <div className="opsReceiptBox">
          <span className="opsReceiptLabel">MÃ BIÊN NHẬN KHẢO SÁT NỘI TRÚ</span>
          <span className="opsReceiptCode">{doneData.code}</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Phiếu khảo sát được bảo mật và ẩn danh 100%</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
          <Link href="/khao-sat" className="btnCarePrimary" style={{ padding: '12px 24px', textDecoration: 'none' }}>
            ← Xem các khảo sát khác
          </Link>
          <Link href="/" className="btnCareSecondary" style={{ padding: '12px 24px', textDecoration: 'none' }}>
            Về Trang chủ Bệnh viện
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="opsContainer">
      {/* Honeypot chống bot */}
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

      {/* Header Banner & Tiêu đề chính */}
      <div className="opsHeaderCard">
        <div className="opsBadgeRow">
          <span className="opsGovBadge">
            🏛️ BỘ Y TẾ — MẪU SỐ 1 (QĐ 3869/QĐ-BYT & QĐ 56/QĐ-BYT)
          </span>
          <span className="opsSecurityBadge">
            🛡️ 100% Ẩn danh & Bảo mật
          </span>
        </div>

        <h1 className="opsTitle">
          Phiếu Khảo sát Ý kiến Người bệnh Điều trị Nội trú
        </h1>
        <p className="opsDesc">
          Nhằm mục tiêu không ngừng nâng cao y đức, tinh thần chăm sóc và điều kiện cơ sở vật chất buồng bệnh, Bệnh viện Đa khoa Khu vực Thới Lai kính mong Quý người bệnh hoặc thân nhân đóng góp ý kiến trung thực theo các nội dung dưới đây.
        </p>

        {/* Thanh tiến trình hoàn thành khảo sát */}
        <div className="opsProgressWrapper">
          <div className="opsProgressInfo">
            <span>Tiến độ hoàn thành: {answeredCount} / {totalQuestions} câu hỏi</span>
            <span style={{ color: progressPercent === 100 ? '#10b981' : '#0284c7' }}>
              {progressPercent}%
            </span>
          </div>
          <div className="opsProgressBar">
            <div className="opsProgressFill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="patientCareNoticeBanner" style={{ background: '#fef2f2', borderColor: '#fca5a5', borderLeftColor: '#ef4444', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', fontWeight: 700, fontSize: '14.5px' }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* SECTION I: THÔNG TIN CHUNG NGƯỜI BỆNH NỘI TRÚ */}
      <div className="opsSectionCard">
        <div className="opsSectionHeader">
          <div className="opsSectionHeaderTitle">
            <div className="opsSectionTag">I</div>
            <div className="opsSectionTitleText">
              <h3>Thông tin chung về người bệnh nội trú</h3>
              <p>Phục vụ công tác thống kê phân loại dữ liệu theo quy định của Bộ Y tế (hoàn toàn ẩn danh)</p>
            </div>
          </div>
        </div>
        <div className="opsSectionBody">
          <div className="opsGrid3">
            {/* Giới tính */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Giới tính người bệnh <span className="opsReq">*</span></label>
              <div className="opsRadioGroup">
                {['Nam', 'Nữ'].map(g => (
                  <label key={g} className={`opsRadioPill ${demographics.gender === g ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={demographics.gender === g}
                      onChange={() => setDemographics(p => ({ ...p, gender: g }))}
                    />
                    {g === 'Nam' ? '👨 Nam' : '👩 Nữ'}
                  </label>
                ))}
              </div>
            </div>

            {/* Nhóm tuổi */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Độ tuổi <span className="opsReq">*</span></label>
              <select
                className="opsSelect"
                value={demographics.ageGroup}
                onChange={e => setDemographics(p => ({ ...p, ageGroup: e.target.value }))}
              >
                <option value="Dưới 18 tuổi">Dưới 18 tuổi</option>
                <option value="18 - 29 tuổi">18 – 29 tuổi</option>
                <option value="30 - 45 tuổi">30 – 45 tuổi</option>
                <option value="46 - 60 tuổi">46 – 60 tuổi</option>
                <option value="Trên 60 tuổi">Trên 60 tuổi (Người cao tuổi)</option>
              </select>
            </div>

            {/* Số ngày nằm viện */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Số ngày nằm viện điều trị <span className="opsReq">*</span></label>
              <select
                className="opsSelect"
                value={demographics.daysInHospital}
                onChange={e => setDemographics(p => ({ ...p, daysInHospital: e.target.value }))}
              >
                <option value="1 - 2 ngày">1 – 2 ngày</option>
                <option value="3 - 5 ngày">3 – 5 ngày</option>
                <option value="6 - 10 ngày">6 – 10 ngày</option>
                <option value="Trên 10 ngày">Trên 10 ngày</option>
              </select>
            </div>
          </div>

          <div className="opsGrid3">
            {/* Có thẻ BHYT không */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Thẻ BHYT <span className="opsReq">*</span></label>
              <div className="opsRadioGroup">
                {['Có BHYT', 'Thu phí / Theo yêu cầu'].map(opt => (
                  <label key={opt} className={`opsRadioPill ${demographics.insurance === opt ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="insurance"
                      value={opt}
                      checked={demographics.insurance === opt}
                      onChange={() => setDemographics(p => ({ ...p, insurance: opt }))}
                    />
                    {opt === 'Có BHYT' ? '💳 Có BHYT' : '💵 Thu phí'}
                  </label>
                ))}
              </div>
            </div>

            {/* Nơi cư trú */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Nơi cư trú</label>
              <select
                className="opsSelect"
                value={demographics.area}
                onChange={e => setDemographics(p => ({ ...p, area: e.target.value }))}
              >
                <option value="Huyện Thới Lai">Tại huyện Thới Lai</option>
                <option value="Quận/Huyện khác tại Cần Thơ">Quận/Huyện khác thuộc TP. Cần Thơ</option>
                <option value="Tỉnh/Thành phố lân cận">Tỉnh lân cận (Hậu Giang, Kiên Giang, An Giang...)</option>
              </select>
            </div>

            {/* Khoa điều trị nội trú */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Khoa điều trị nội trú</label>
              <select
                className="opsSelect"
                value={demographics.department}
                onChange={e => setDemographics(p => ({ ...p, department: e.target.value }))}
              >
                <option value="Khoa Nội tổng hợp">Khoa Nội tổng hợp</option>
                <option value="Khoa Ngoại tổng hợp">Khoa Ngoại tổng hợp</option>
                <option value="Khoa Phụ sản">Khoa Phụ sản</option>
                <option value="Khoa Nhi">Khoa Nhi</option>
                <option value="Khoa Hồi sức cấp cứu">Khoa Hồi sức cấp cứu (ICU)</option>
                <option value="Khoa Y học cổ truyền - PHCN">Khoa Y học cổ truyền & PHCN</option>
                <option value="Khoa Truyền nhiễm">Khoa Truyền nhiễm</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION II: 5 PHẦN ĐÁNH GIÁ TIÊU CHÍ NỘI TRÚ (A -> E) */}
      {INPATIENT_SURVEY_SECTIONS.map(sec => {
        const secAnswered = sec.questions.filter(q => ratings[q.id]).length
        const isComplete = secAnswered === sec.questions.length

        return (
          <div key={sec.code} className="opsSectionCard">
            <div className="opsSectionHeader">
              <div className="opsSectionHeaderTitle">
                <div className={`opsSectionTag ${isComplete ? 'green' : ''}`}>
                  {isComplete ? '✓' : sec.code}
                </div>
                <div className="opsSectionTitleText">
                  <h3>{sec.title}</h3>
                  <p>{sec.desc}</p>
                </div>
              </div>

              {/* Tiện ích chọn nhanh cho toàn bộ phần */}
              <div className="opsQuickRow">
                <span style={{ fontSize: '12px', color: '#64748b' }}>Đánh giá nhanh:</span>
                <button
                  type="button"
                  className="opsQuickBtn"
                  onClick={() => handleBatchSection(sec.code, 5)}
                  title="Chọn Rất hài lòng (5 điểm) cho tất cả câu trong phần này"
                >
                  😄 Tất cả 5★
                </button>
                <button
                  type="button"
                  className="opsQuickBtn"
                  onClick={() => handleBatchSection(sec.code, 4)}
                  title="Chọn Hài lòng (4 điểm) cho tất cả câu trong phần này"
                >
                  🙂 Tất cả 4★
                </button>
              </div>
            </div>

            <div className="opsSectionBody">
              {sec.questions.map(q => {
                const currentScore = ratings[q.id]
                return (
                  <div key={q.id} id={`q-${q.id}`} className="opsQuestionItem">
                    <div className="opsQuestionTitle">
                      <span className="opsQuestionNumber">{q.id}.</span>
                      <span>{q.text} <span className="opsReq">*</span></span>
                    </div>

                    <div className="opsLikertGrid">
                      {RATING_5_LEVELS.map(lvl => {
                        const isSelected = currentScore === lvl.score
                        return (
                          <div
                            key={lvl.score}
                            className={`opsLikertCard ${isSelected ? `selected-${lvl.score}` : ''}`}
                            onClick={() => handleRating(q.id, lvl.score)}
                          >
                            <span className="opsLikertEmoji">{lvl.emoji}</span>
                            <span className="opsLikertScore">{lvl.score}</span>
                            <span className="opsLikertLabel">{lvl.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* SECTION III: ĐÁNH GIÁ CHUNG & Ý KIẾN ĐÓNG GÓP */}
      <div className="opsSectionCard">
        <div className="opsSectionHeader">
          <div className="opsSectionHeaderTitle">
            <div className="opsSectionTag green">III</div>
            <div className="opsSectionTitleText">
              <h3>Đánh giá chung & Đóng góp ý kiến</h3>
              <p>Chấm điểm mức độ hài lòng chung trên thang điểm 10 và phản hồi tự do</p>
            </div>
          </div>
        </div>

        <div className="opsSectionBody">
          {/* Chấm điểm 1-10 */}
          <div style={{ marginBottom: '24px' }}>
            <label className="opsLabel" style={{ fontSize: '14.5px' }}>
              1. Đánh giá chung sự hài lòng của Quý vị đối với toàn bộ quá trình điều trị nội trú tại bệnh viện (Thang điểm từ 1 đến 10) <span className="opsReq">*</span>
            </label>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 10px' }}>
              (1 điểm: Rất kém / Thất vọng — 10 điểm: Rất xuất sắc / Hoàn toàn tin tưởng)
            </p>

            <div className="opsScore10Grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                <div
                  key={val}
                  className={`opsScore10Card ${overallRating10 === val ? 'active' : ''}`}
                  onClick={() => setOverallRating10(val)}
                >
                  {val}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#0284c7', fontWeight: 700 }}>
              Điểm đã chọn: {overallRating10} / 10 điểm
            </div>
          </div>

          {/* Khả năng quay lại */}
          <div style={{ marginBottom: '24px' }}>
            <label className="opsLabel" style={{ fontSize: '14.5px' }}>
              2. Nếu có người thân hoặc bản thân cần nằm viện điều trị, Quý vị có sẵn sàng quay lại hoặc giới thiệu BVĐK Khu vực Thới Lai không? <span className="opsReq">*</span>
            </label>
            <div className="opsRadioGroup" style={{ marginTop: '10px' }}>
              {[
                { val: 'Chắc chắn quay lại', icon: '🌟' },
                { val: 'Có thể quay lại', icon: '👍' },
                { val: 'Không chắc chắn', icon: '🤔' },
                { val: 'Chắc chắn không quay lại', icon: '👎' },
              ].map(item => (
                <label key={item.val} className={`opsRadioPill ${wouldReturn === item.val ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    name="wouldReturn"
                    value={item.val}
                    checked={wouldReturn === item.val}
                    onChange={() => setWouldReturn(item.val)}
                  />
                  <span>{item.icon} {item.val}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ý kiến góp ý tự do */}
          <div>
            <label className="opsLabel" style={{ fontSize: '14.5px' }}>
              3. Quý vị có lời khen ngợi hoặc ý kiến đóng góp cụ thể nào để Khoa phòng và Bệnh viện phục vụ người bệnh nội trú tốt hơn?
            </label>
            <textarea
              className="opsInput"
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Chia sẻ về sự tận tâm của bác sĩ, điều dưỡng chăm sóc, vệ sinh buồng bệnh, chăn ga, bữa ăn hay thủ tục viện phí..."
              style={{ marginTop: '8px', lineHeight: 1.6 }}
            />
          </div>
        </div>
      </div>

      {/* Cloudflare Turnstile xác minh chống spam */}
      <div style={{ marginBottom: '20px' }}>
        <TurnstileWidget />
      </div>

      {/* Form Footer & Submit Button */}
      <div className="opsFooterCard">
        <div className="opsFooterNote">
          <div className="opsFooterNoteIcon">🛡️</div>
          <div>
            <strong>Cam kết bảo mật:</strong> Mọi ý kiến đều hoàn toàn ẩn danh, phục vụ duy nhất mục đích nâng cao y đức và chất lượng điều trị người bệnh nội trú.
          </div>
        </div>

        <button
          type="submit"
          className="opsSubmitBtn"
          disabled={busy}
        >
          {busy ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Đang gửi phiếu...
            </>
          ) : (
            <>
              <span>Gửi phiếu khảo sát</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
