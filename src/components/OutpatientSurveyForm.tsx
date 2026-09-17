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

// BỘ CÂU HỎI MẪU SỐ 2 - KHẢO SÁT HÀI LÒNG NGƯỜI BỆNH NGOẠI TRÚ (BỘ Y TẾ)
export const OUTPATIENT_SURVEY_SECTIONS = [
  {
    code: 'A',
    title: 'Phần A: Khả năng tiếp cận bệnh viện',
    desc: 'Đánh giá về biển báo chỉ dẫn, sơ đồ bệnh viện, thủ tục đăng ký khám và website tra cứu',
    questions: [
      { id: 'A1', text: 'Biển báo, sơ đồ chỉ dẫn đường đến các khoa/phòng và bàn tiếp đón rõ ràng, dễ tìm' },
      { id: 'A2', text: 'Thủ tục đăng ký khám bệnh (lấy số, tiếp đón, phân buồng khám) nhanh gọn, thuận tiện' },
      { id: 'A3', text: 'Nhân viên hướng dẫn niềm nở, chỉ dẫn người bệnh đến đúng phòng khám chuyên khoa' },
      { id: 'A4', text: 'Kênh tra cứu thông tin (Website, Fanpage, Tổng đài) đầy đủ và hữu ích' },
    ],
  },
  {
    code: 'B',
    title: 'Phần B: Sự minh bạch thông tin & Thủ tục khám bệnh',
    desc: 'Đánh giá về công khai giá viện phí, quyền lợi BHYT, thứ tự gọi số và thời gian chờ đợi',
    questions: [
      { id: 'B1', text: 'Bảng giá dịch vụ kỹ thuật, viện phí và quyền lợi BHYT được niêm yết công khai, rõ ràng' },
      { id: 'B2', text: 'Hệ thống gọi số thứ tự tự động và màn hình hiển thị tại phòng khám công bằng, minh bạch' },
      { id: 'B3', text: 'Thời gian chờ từ lúc đăng ký đến khi được bác sĩ gọi vào khám hợp lý, không quá lâu' },
      { id: 'B4', text: 'Thủ tục làm cận lâm sàng (xét nghiệm, siêu âm, chụp X-quang) và thanh toán thuận tiện' },
    ],
  },
  {
    code: 'C',
    title: 'Phần C: Cơ sở vật chất & Phương tiện phục vụ',
    desc: 'Đánh giá về phòng chờ, quạt mát/điều hòa, ghế ngồi, nước uống và khu vệ sinh',
    questions: [
      { id: 'C1', text: 'Phòng chờ khám sạch sẽ, thoáng mát (có quạt/điều hòa), đủ ghế ngồi cho người bệnh' },
      { id: 'C2', text: 'Có nước uống sạch, thùng rác y tế phân loại và khu vực phục vụ chu đáo' },
      { id: 'C3', text: 'Nhà vệ sinh sạch sẽ, không có mùi hôi, có xà phòng rửa tay và nước dùng đầy đủ' },
      { id: 'C4', text: 'Trang thiết bị, máy móc y tế phục vụ khám bệnh hiện đại, sạch sẽ và an toàn' },
    ],
  },
  {
    code: 'D',
    title: 'Phần D: Thái độ ứng xử & Năng lực của nhân viên y tế',
    desc: 'Đánh giá chuyên môn bác sĩ, tinh thần phục vụ của điều dưỡng, dược sĩ và nhân viên',
    questions: [
      { id: 'D1', text: 'Bác sĩ thăm khám cẩn thận, lắng nghe và giải thích tình trạng bệnh rõ ràng, dễ hiểu' },
      { id: 'D2', text: 'Bác sĩ tư vấn chế độ dùng thuốc, dinh dưỡng và hẹn tái khám cụ thể' },
      { id: 'D3', text: 'Điều dưỡng, kỹ thuật viên thao tác nhẹ nhàng, tôn trọng và quan tâm người bệnh' },
      { id: 'D4', text: 'Dược sĩ cấp phát thuốc hướng dẫn cách uống thuốc tỉ mỉ, kiểm tra đúng đối tượng' },
    ],
  },
  {
    code: 'E',
    title: 'Phần E: Kết quả cung cấp dịch vụ & Niềm tin',
    desc: 'Đánh giá về hiệu quả điều trị, sự cải thiện sức khỏe và mức độ tin tưởng của người bệnh',
    questions: [
      { id: 'E1', text: 'Kết quả chẩn đoán và hướng điều trị giúp tình trạng bệnh được thuyên giảm, cải thiện' },
      { id: 'E2', text: 'Người bệnh cảm thấy an tâm, được tôn trọng và bảo mật quyền riêng tư' },
      { id: 'E3', text: 'Chi phí khám chữa bệnh (đồng chi trả BHYT hoặc viện phí) tương xứng với chất lượng phục vụ' },
    ],
  },
]

interface OutpatientSurveyFormProps {
  customClinics?: string[]
  customAreas?: string[]
}

export default function OutpatientSurveyForm({
  customClinics,
  customAreas,
}: OutpatientSurveyFormProps = {}) {
  const [busy, setBusy] = useState(false)
  const [doneData, setDoneData] = useState<{ code: string; overallScore?: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Danh sách phòng khám: Dùng từ CMS nếu có, nếu chưa có thì fallback về danh sách chuẩn
  const clinicsList = useMemo(() => {
    if (customClinics && customClinics.length > 0) return customClinics
    return [
      'Phòng khám Nội tổng quát / Tim mạch / Tiểu đường',
      'Phòng khám Ngoại - Chấn thương',
      'Phòng khám Sản - Phụ khoa',
      'Phòng khám Nhi khoa',
      'Liên chuyên khoa Mắt - TMH - Răng Hàm Mặt',
      'Phòng khám Y học cổ truyền & Phục hồi chức năng',
      'Khu vực Tiếp nhận Cấp cứu',
    ]
  }, [customClinics])

  // Danh sách gợi ý địa bàn nơi cư trú theo mô hình 2 cấp: Dùng từ CMS nếu có
  const areaSuggestionsList = useMemo(() => {
    if (customAreas && customAreas.length > 0) return customAreas
    return [
      'Xã Thới Lai, TP. Cần Thơ',
      'Xã Trường Thành, TP. Cần Thơ',
      'Xã Đông Thuận, TP. Cần Thơ',
      'Xã Trường Xuân, TP. Cần Thơ',
      'Xã Đông Hiệp, TP. Cần Thơ',
      'Phường Ô Môn, TP. Cần Thơ',
      'Xã Trường Long, TP. Cần Thơ',
      'Xã Thới Hưng, TP. Cần Thơ',
      'Thị trấn Cờ Đỏ, TP. Cần Thơ',
      'Thị trấn Phong Điền, TP. Cần Thơ',
      'Phường Thốt Nốt, TP. Cần Thơ',
      'Phường Ninh Kiều, TP. Cần Thơ',
      'Phường An Khánh, TP. Cần Thơ',
      'Tỉnh Hậu Giang',
      'Tỉnh Kiên Giang',
      'Tỉnh An Giang',
      'Tỉnh Đồng Tháp',
    ]
  }, [customAreas])

  // Thông tin hành chính (Section I)
  const [demographics, setDemographics] = useState({
    gender: 'Nam',
    ageGroup: '30-45',
    insurance: 'Có BHYT',
    area: '',
    department: clinicsList[0] || 'Phòng khám Ngoại trú',
    respondentType: 'Người bệnh trực tiếp',
  })

  // Điểm số 1-5 cho 19 câu hỏi Phần A -> E
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
    for (const sec of OUTPATIENT_SURVEY_SECTIONS) {
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
    const sec = OUTPATIENT_SURVEY_SECTIONS.find(s => s.code === sectionCode)
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
      setErrorMsg(`⚠️ Quý vị vui lòng hoàn thành tất cả các câu hỏi bắt buộc trước khi gửi. Hiện còn ${missing.length} câu chưa chọn (ví dụ: Câu ${missing[0].id}).`)
      // Cuộn tới câu hỏi đầu tiên bị thiếu và highlight
      const el = document.getElementById(`q-${missing[0].id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.style.border = '2px solid #ef4444'
        el.style.borderRadius = '12px'
        el.style.padding = '12px'
        el.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.2)'
        setTimeout(() => {
          el.style.border = ''
          el.style.padding = ''
          el.style.boxShadow = ''
        }, 3000)
      }
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

      const res = await fetch('/api/surveys/outpatient', {
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

  // Giao diện đã gửi thành công
  if (doneData) {
    return (
      <div className="opsSuccessCard">
        <div className="opsSuccessIcon">✓</div>
        <div className="opsGovBadge" style={{ margin: '0 auto 12px', display: 'inline-flex' }}>
          ĐÃ TIẾP NHẬN PHIẾU KHẢO SÁT
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          Cảm ơn Quý người bệnh đã tham gia khảo sát!
        </h2>
        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 20px' }}>
          Ý kiến quý báu của Quý vị đã được chuyển trực tiếp đến Ban Giám đốc và Hội đồng Quản lý Chất lượng Bệnh viện Đa khoa Khu vực Thới Lai để phục vụ công tác cải tiến chất lượng khám chữa bệnh.
        </p>

        <div className="opsReceiptBox">
          <span className="opsReceiptLabel">MÃ BIÊN NHẬN KHẢO SÁT</span>
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
            🏛️ BỘ Y TẾ — MẪU SỐ 2 (QĐ 3869/QĐ-BYT & QĐ 56/QĐ-BYT)
          </span>
          <span className="opsSecurityBadge">
            🛡️ 100% Ẩn danh & Bảo mật
          </span>
        </div>

        <h1 className="opsTitle">
          Phiếu Khảo sát Ý kiến Người bệnh Khám Ngoại trú
        </h1>
        <p className="opsDesc">
          Nhằm mục tiêu không ngừng nâng cao chất lượng khám chữa bệnh và tinh thần thái độ phục vụ, Bệnh viện Đa khoa Khu vực Thới Lai kính mong Quý người bệnh hoặc thân nhân đóng góp ý kiến trung thực theo các nội dung dưới đây.
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
        <div className="surveyMissingWarningBanner">
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '15px' }}>{errorMsg}</span>
        </div>
      )}

      {/* SECTION I: THÔNG TIN CHUNG NGƯỜI BỆNH */}
      <div className="opsSectionCard">
        <div className="opsSectionHeader">
          <div className="opsSectionHeaderTitle">
            <div className="opsSectionTag">I</div>
            <div className="opsSectionTitleText">
              <h3>Thông tin chung về người bệnh</h3>
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

            {/* Có thẻ BHYT không */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Thẻ BHYT <span className="opsReq">*</span></label>
              <div className="opsRadioGroup">
                {['Có BHYT', 'Khám theo yêu cầu / Thu phí'].map(opt => (
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
          </div>

          <div className="opsGrid2">
            {/* Nơi cư trú / Địa chỉ chi tiết (Chính quyền 2 cấp: Xã/Phường/Thị trấn trực thuộc Tỉnh/Thành phố) */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Nơi cư trú (Ấp/Khu vực, Xã/Phường/Thị trấn, Tỉnh/TP)</label>
              <input
                type="text"
                className="opsInput"
                value={demographics.area}
                onChange={e => setDemographics(p => ({ ...p, area: e.target.value }))}
                placeholder="Nhập ấp/khu vực, xã/phường, tỉnh/thành phố (VD: Ấp Thới Thuận B, Xã Thới Lai, TP. Cần Thơ)..."
                list="area-suggestions"
              />
              <datalist id="area-suggestions">
                {areaSuggestionsList.map((area, idx) => (
                  <option key={idx} value={area} />
                ))}
              </datalist>
            </div>

            {/* Khu vực phòng khám đã đến */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Khu vực phòng khám đã khám hôm nay</label>
              <select
                className="opsSelect"
                value={demographics.department}
                onChange={e => setDemographics(p => ({ ...p, department: e.target.value }))}
              >
                {clinicsList.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION II: 5 PHẦN ĐÁNH GIÁ TIÊU CHÍ (A -> E) */}
      {OUTPATIENT_SURVEY_SECTIONS.map(sec => {
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
              {sec.questions.map((q, idx) => {
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
              1. Đánh giá chung sự hài lòng của Quý vị đối với dịch vụ khám ngoại trú (Thang điểm từ 1 đến 10) <span className="opsReq">*</span>
            </label>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 10px' }}>
              (1 điểm: Rất kém / Rất thất vọng — 10 điểm: Rất xuất sắc / Hoàn toàn tin tưởng)
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
              2. Nếu có nhu cầu khám chữa bệnh, Quý vị có sẵn sàng quay lại hoặc giới thiệu người thân đến BVĐK Khu vực Thới Lai không? <span className="opsReq">*</span>
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
              3. Quý vị có ý kiến khen ngợi hoặc góp ý cụ thể nào để Bệnh viện phục vụ tốt hơn nữa không?
            </label>
            <textarea
              className="opsInput"
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Chia sẻ chân thực của Quý vị về bác sĩ, điều dưỡng, thời gian chờ, nhà vệ sinh hoặc các đề xuất cải tiến khác..."
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
            <strong>Cam kết bảo mật:</strong> Mọi ý kiến đều hoàn toàn ẩn danh, phục vụ duy nhất mục đích cải tiến chất lượng chăm sóc người bệnh.
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
