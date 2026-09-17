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

// BỘ CÂU HỎI MẪU SỐ 3 - KHẢO SÁT Ý KIẾN NHÂN VIÊN Y TẾ (BỘ Y TẾ)
export const STAFF_SURVEY_SECTIONS = [
  {
    code: 'A',
    title: 'Phần A: Môi trường làm việc & Điều kiện cơ sở vật chất',
    desc: 'Đánh giá nơi làm việc, phòng giao ban/trực, trang thiết bị y tế, phương tiện bảo hộ và an toàn lao động',
    questions: [
      { id: 'A1', text: 'Nơi làm việc, phòng giao ban, phòng trực sạch sẽ, thông thoáng, đủ ánh sáng và tiện nghi cần thiết' },
      { id: 'A2', text: 'Trang thiết bị, máy móc y tế, thuốc và vật tư tiêu hao được cung ứng đầy đủ, kịp thời phục vụ chuyên môn' },
      { id: 'A3', text: 'Được trang bị đầy đủ phương tiện bảo hộ lao động cá nhân (quần áo, khẩu trang, găng tay, kính bảo hộ...)' },
      { id: 'A4', text: 'Môi trường làm việc an toàn, có biện pháp phòng ngừa rủi ro nghề nghiệp, phơi nhiễm và hành hung y tế' },
    ],
  },
  {
    code: 'B',
    title: 'Phần B: Lãnh đạo quản lý & Mối quan hệ đồng nghiệp',
    desc: 'Đánh giá sự điều hành của Ban Giám đốc và lãnh đạo khoa/phòng, sự công bằng, lắng nghe và tinh thần đoàn kết',
    questions: [
      { id: 'B1', text: 'Lãnh đạo khoa/phòng và Ban Giám đốc lắng nghe, tôn trọng và kịp thời tháo gỡ khó khăn cho nhân viên' },
      { id: 'B2', text: 'Việc phân công công việc, ca trực và đánh giá hoàn thành nhiệm vụ diễn ra công bằng, minh bạch' },
      { id: 'B3', text: 'Đồng nghiệp trong khoa/phòng đoàn kết, sẵn sàng hỗ trợ, chia sẻ kinh nghiệm và phối hợp ăn ý' },
      { id: 'B4', text: 'Sự phối hợp chuyên môn giữa các khoa lâm sàng, cận lâm sàng và phòng chức năng nhịp nhàng, hiệu quả' },
    ],
  },
  {
    code: 'C',
    title: 'Phần C: Quy chế nội bộ, Tiền lương & Chế độ đãi ngộ',
    desc: 'Đánh giá quy chế chi tiêu nội bộ, tiền lương, thu nhập tăng thêm, phụ cấp ưu đãi nghề và khen thưởng',
    questions: [
      { id: 'C1', text: 'Tiền lương, phụ cấp ưu đãi nghề, trực và các chế độ chính sách được chi trả đúng hạn, đầy đủ' },
      { id: 'C2', text: 'Quy chế chi tiêu nội bộ và phân chia thu nhập tăng thêm rõ ràng, công khai và phản ánh đúng công sức' },
      { id: 'C3', text: 'Chính sách khen thưởng, động viên kịp thời các cá nhân, tập thể có thành tích xuất sắc hoặc sáng kiến hay' },
      { id: 'C4', text: 'Các chế độ phúc lợi (khám sức khỏe định kỳ, tham quan, hỗ trợ đời sống, công đoàn) được quan tâm chu đáo' },
    ],
  },
  {
    code: 'D',
    title: 'Phần D: Áp lực công việc, Cơ hội học tập & Phát triển nghề nghiệp',
    desc: 'Đánh giá khối lượng công việc, cân bằng đời sống, cơ hội đào tạo liên tục và thăng tiến nghề nghiệp',
    questions: [
      { id: 'D1', text: 'Khối lượng công việc và tần suất trực phù hợp, không bị quá tải kéo dài gây kiệt sức (burnout)' },
      { id: 'D2', text: 'Bệnh viện tạo điều kiện thuận lợi để cán bộ tham gia đào tạo nâng cao trình độ, chuyên khoa và chứng chỉ' },
      { id: 'D3', text: 'Được tự chủ phát huy năng lực chuyên môn, áp dụng kỹ thuật mới và sáng kiến cải tiến kỹ thuật' },
      { id: 'D4', text: 'Quy hoạch bổ nhiệm cán bộ, cơ hội thăng tiến và phát triển sự nghiệp rộng mở, minh bạch' },
    ],
  },
  {
    code: 'E',
    title: 'Phần E: Hài lòng chung & Ý định gắn bó lâu dài',
    desc: 'Đánh giá niềm tự hào khi công tác tại bệnh viện, sự an tâm cống hiến và cam kết gắn bó',
    questions: [
      { id: 'E1', text: 'Tôi cảm thấy tự hào và vinh dự khi là một thành viên của Bệnh viện Đa khoa Khu vực Thới Lai' },
      { id: 'E2', text: 'Nhìn chung, tôi cảm thấy hài lòng với công việc và môi trường làm việc hiện tại của mình' },
      { id: 'E3', text: 'Tôi mong muốn tiếp tục gắn bó công tác lâu dài và sẵn sàng giới thiệu đồng nghiệp đến làm việc tại viện' },
    ],
  },
]

export default function StaffSurveyForm() {
  const [busy, setBusy] = useState(false)
  const [doneData, setDoneData] = useState<{ code: string; overallScore?: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Thông tin hành chính (Section I)
  const [demographics, setDemographics] = useState({
    gender: 'Nam',
    ageGroup: '30 - 45 tuổi',
    position: 'Bác sĩ điều trị',
    unitType: 'Khoa Lâm sàng',
    yearsOfExperience: '5 - 10 năm',
    department: 'Khoa Nội tổng hợp',
  })

  // Điểm số 1-5 cho 19 câu hỏi Phần A -> E
  const [ratings, setRatings] = useState<Record<string, number>>({})

  // Điểm tổng thể 1-10
  const [overallRating10, setOverallRating10] = useState<number>(9)

  // Ý định gắn bó
  const [loyaltyIntent, setLoyaltyIntent] = useState<string>('Chắc chắn gắn bó lâu dài')

  // Đề xuất cải tiến
  const [suggestion, setSuggestion] = useState('')

  // Tính tổng số câu hỏi cần chấm điểm
  const allQuestions = useMemo(() => {
    const list: { id: string; text: string; sectionCode: string }[] = []
    for (const sec of STAFF_SURVEY_SECTIONS) {
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
    const sec = STAFF_SURVEY_SECTIONS.find(s => s.code === sectionCode)
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
      setErrorMsg(`Đồng chí vui lòng đánh giá đầy đủ tất cả các tiêu chí. Còn ${missing.length} câu chưa chọn (ví dụ: ${missing[0].id}).`)
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
        loyaltyIntent,
        suggestion,
        website: fd.get('website'),
        'cf-turnstile-response': fd.get('cf-turnstile-response'),
      }

      const res = await fetch('/api/surveys/staff', {
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
        setErrorMsg(data.error || 'Có lỗi xảy ra khi gửi phiếu khảo sát. Vui lòng thử lại.')
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
          ĐÃ TIẾP NHẬN PHIẾU KHẢO SÁT NHÂN VIÊN Y TẾ
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
          Cảm ơn Quý đồng nghiệp đã đóng góp ý kiến!
        </h2>
        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 20px' }}>
          Từng ý kiến, tâm tư và đề xuất cải tiến của nhân viên y tế sẽ được Ban Giám đốc bệnh viện cùng Phòng Quản lý Chất lượng và Công đoàn cơ sở tiếp thu nghiêm túc nhằm từng bước xây dựng môi trường làm việc ngày một dân chủ, văn minh, công bằng và đãi ngộ xứng đáng.
        </p>

        <div className="opsReceiptBox">
          <span className="opsReceiptLabel">MÃ BIÊN NHẬN PHIẾU NỘI BỘ</span>
          <span className="opsReceiptCode">{doneData.code}</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Phiếu khảo sát được bảo mật tuyệt đối và 100% ẩn danh</span>
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
            🏛️ BỘ Y TẾ — MẪU SỐ 3 (QĐ 3869/QĐ-BYT)
          </span>
          <span className="opsSecurityBadge">
            🛡️ 100% Ẩn danh & Bảo mật nội bộ
          </span>
        </div>

        <h1 className="opsTitle">
          Phiếu Khảo sát Ý kiến & Sự hài lòng của Nhân viên Y tế
        </h1>
        <p className="opsDesc">
          Nhằm mục đích nắm bắt tâm tư, nguyện vọng của viên chức, người lao động và xây dựng môi trường làm việc an toàn, đoàn kết, chuyên nghiệp và đãi ngộ thỏa đáng, Ban Giám đốc Bệnh viện Đa khoa Khu vực Thới Lai kính đề nghị toàn thể cán bộ, nhân viên y tế tham gia đóng góp ý kiến dân chủ, thẳng thắn theo các nội dung dưới đây.
        </p>

        {/* Thanh tiến trình hoàn thành khảo sát */}
        <div className="opsProgressWrapper">
          <div className="opsProgressInfo">
            <span>Tiến độ hoàn thành: {answeredCount} / {totalQuestions} tiêu chí</span>
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

      {/* SECTION I: THÔNG TIN CHUNG CÁN BỘ / NHÂN VIÊN */}
      <div className="opsSectionCard">
        <div className="opsSectionHeader">
          <div className="opsSectionHeaderTitle">
            <div className="opsSectionTag">I</div>
            <div className="opsSectionTitleText">
              <h3>Thông tin chung về nhân viên y tế</h3>
              <p>Phục vụ thống kê phân nhóm theo quy định của Bộ Y tế (hoàn toàn ẩn danh, không lưu danh tính)</p>
            </div>
          </div>
        </div>
        <div className="opsSectionBody">
          <div className="opsGrid3">
            {/* Giới tính */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Giới tính <span className="opsReq">*</span></label>
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
              <label className="opsLabel">Nhóm tuổi <span className="opsReq">*</span></label>
              <select
                className="opsSelect"
                value={demographics.ageGroup}
                onChange={e => setDemographics(p => ({ ...p, ageGroup: e.target.value }))}
              >
                <option value="Dưới 30 tuổi">Dưới 30 tuổi</option>
                <option value="30 - 45 tuổi">30 – 45 tuổi</option>
                <option value="46 - 55 tuổi">46 – 55 tuổi</option>
                <option value="Trên 55 tuổi">Trên 55 tuổi</option>
              </select>
            </div>

            {/* Vị trí chuyên môn / Chức danh */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Vị trí công tác / Chuyên môn <span className="opsReq">*</span></label>
              <select
                className="opsSelect"
                value={demographics.position}
                onChange={e => setDemographics(p => ({ ...p, position: e.target.value }))}
              >
                <option value="Bác sĩ điều trị">Bác sĩ điều trị</option>
                <option value="Điều dưỡng / Hộ sinh">Điều dưỡng / Hộ sinh</option>
                <option value="Dược sĩ">Dược sĩ</option>
                <option value="Kỹ thuật viên y">Kỹ thuật viên xét nghiệm / CĐHA</option>
                <option value="Chuyên viên / Nhân viên hành chính">Chuyên viên / Nhân viên phòng chức năng</option>
                <option value="Lãnh đạo khoa / phòng">Lãnh đạo Khoa / Phòng</option>
                <option value="Khác">Nhân viên hỗ trợ khác</option>
              </select>
            </div>
          </div>

          <div className="opsGrid3">
            {/* Nhóm khối đơn vị */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Khối đơn vị công tác <span className="opsReq">*</span></label>
              <select
                className="opsSelect"
                value={demographics.unitType}
                onChange={e => setDemographics(p => ({ ...p, unitType: e.target.value }))}
              >
                <option value="Khoa Lâm sàng">Khoa Lâm sàng (Nội, Ngoại, Sản, Nhi, Cấp cứu...)</option>
                <option value="Khoa Cận lâm sàng">Khoa Cận lâm sàng (Xét nghiệm, CĐHA, Dược...)</option>
                <option value="Phòng Chức năng">Phòng Chức năng (KHTH, TCCB, TCKT, QLCL, ĐD...)</option>
              </select>
            </div>

            {/* Thâm niên công tác */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Thâm niên công tác tại viện</label>
              <select
                className="opsSelect"
                value={demographics.yearsOfExperience}
                onChange={e => setDemographics(p => ({ ...p, yearsOfExperience: e.target.value }))}
              >
                <option value="Dưới 2 năm">Dưới 2 năm (Cán bộ mới)</option>
                <option value="2 - 5 năm">2 – 5 năm</option>
                <option value="5 - 10 năm">5 – 10 năm</option>
                <option value="Trên 10 năm">Trên 10 năm (Gắn bó lâu năm)</option>
              </select>
            </div>

            {/* Khoa / Phòng cụ thể */}
            <div className="opsFieldGroup">
              <label className="opsLabel">Khoa / Phòng trực thuộc</label>
              <select
                className="opsSelect"
                value={demographics.department}
                onChange={e => setDemographics(p => ({ ...p, department: e.target.value }))}
              >
                <option value="Khoa Khám bệnh">Khoa Khám bệnh</option>
                <option value="Khoa Cấp cứu - Hồi sức tích cực">Khoa Cấp cứu - Hồi sức tích cực</option>
                <option value="Khoa Nội tổng hợp">Khoa Nội tổng hợp</option>
                <option value="Khoa Ngoại tổng hợp">Khoa Ngoại tổng hợp</option>
                <option value="Khoa Phụ sản">Khoa Phụ sản</option>
                <option value="Khoa Nhi">Khoa Nhi</option>
                <option value="Khoa Y học cổ truyền - PHCN">Khoa Y học cổ truyền & PHCN</option>
                <option value="Khoa Dược">Khoa Dược</option>
                <option value="Khoa Xét nghiệm - CĐHA">Khoa Xét nghiệm & CĐHA</option>
                <option value="Khối các Phòng chức năng">Khối các Phòng chức năng</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION II: 5 PHẦN ĐÁNH GIÁ TIÊU CHÍ NHÂN VIÊN Y TẾ (A -> E) */}
      {STAFF_SURVEY_SECTIONS.map(sec => {
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
                  title="Chọn Rất hài lòng (5 điểm) cho tất cả tiêu chí trong phần này"
                >
                  😄 Tất cả 5★
                </button>
                <button
                  type="button"
                  className="opsQuickBtn"
                  onClick={() => handleBatchSection(sec.code, 4)}
                  title="Chọn Hài lòng (4 điểm) cho tất cả tiêu chí trong phần này"
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

      {/* SECTION III: ĐÁNH GIÁ TỔNG THỂ & ĐỀ XUẤT NÂNG CAO */}
      <div className="opsSectionCard">
        <div className="opsSectionHeader">
          <div className="opsSectionHeaderTitle">
            <div className="opsSectionTag green">III</div>
            <div className="opsSectionTitleText">
              <h3>Đánh giá chung & Kiến nghị / Đề xuất cải tiến</h3>
              <p>Chấm điểm mức độ hài lòng chung trên thang điểm 10 và tâm tư nguyện vọng</p>
            </div>
          </div>
        </div>

        <div className="opsSectionBody">
          {/* Chấm điểm 1-10 */}
          <div style={{ marginBottom: '24px' }}>
            <label className="opsLabel" style={{ fontSize: '14.5px' }}>
              1. Đánh giá chung sự hài lòng của đồng chí đối với môi trường làm việc và chế độ chính sách tại bệnh viện (Thang điểm từ 1 đến 10) <span className="opsReq">*</span>
            </label>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 10px' }}>
              (1 điểm: Rất bất mãn / Thất vọng — 10 điểm: Rất hài lòng / Hoàn toàn an tâm cống hiến)
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

          {/* Ý định gắn bó */}
          <div style={{ marginBottom: '24px' }}>
            <label className="opsLabel" style={{ fontSize: '14.5px' }}>
              2. Đồng chí có dự định tiếp tục gắn bó làm việc lâu dài tại Bệnh viện Đa khoa Khu vực Thới Lai không? <span className="opsReq">*</span>
            </label>
            <div className="opsRadioGroup" style={{ marginTop: '10px' }}>
              {[
                { val: 'Chắc chắn gắn bó lâu dài', icon: '🌟' },
                { val: 'Có thể tiếp tục công tác', icon: '👍' },
                { val: 'Đang phân vân cân nhắc', icon: '🤔' },
                { val: 'Có ý định chuyển công tác', icon: '💼' },
              ].map(item => (
                <label key={item.val} className={`opsRadioPill ${loyaltyIntent === item.val ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    name="loyaltyIntent"
                    value={item.val}
                    checked={loyaltyIntent === item.val}
                    onChange={() => setLoyaltyIntent(item.val)}
                  />
                  <span>{item.icon} {item.val}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Đề xuất kiến nghị tự do */}
          <div>
            <label className="opsLabel" style={{ fontSize: '14.5px' }}>
              3. Đồng chí có đề xuất, kiến nghị hoặc sáng kiến cụ thể nào để Ban Giám đốc hoàn thiện hơn về môi trường làm việc, chế độ đãi ngộ hoặc quy trình chuyên môn?
            </label>
            <textarea
              className="opsInput"
              rows={4}
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              placeholder="Chia sẻ chân thành, cởi mở về máy móc trang thiết bị, phòng trực, thu nhập tăng thêm, cơ hội đào tạo, giảm tải hành chính..."
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
            <strong>Cam kết bảo mật tuyệt đối:</strong> Toàn bộ dữ liệu được mã hóa, không lưu IP hoặc danh tính người trả lời, đảm bảo tính khách quan và dân chủ cơ sở.
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
