'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TurnstileWidget } from './TurnstileWidget'

const RATING_5_LEVELS = [
  { score: 1, label: 'Rất không hài lòng', emoji: '😞' },
  { score: 2, label: 'Không hài lòng', emoji: '🙁' },
  { score: 3, label: 'Bình thường', emoji: '😐' },
  { score: 4, label: 'Hài lòng', emoji: '🙂' },
  { score: 5, label: 'Rất hài lòng', emoji: '😄' },
]

export default function SurveyForm({
  campaignId,
  questions,
  showDemographics = false,
}: {
  campaignId: string
  questions: any[]
  showDemographics?: boolean
}) {
  const [doneData, setDoneData] = useState<{ code: string; overallScore?: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [answersState, setAnswersState] = useState<Record<string, any>>({})
  const [demographics, setDemographics] = useState({
    name: '',
    phone: '',
    gender: 'Nam',
    ageGroup: '30 - 45 tuổi',
    respondentType: 'Người bệnh trực tiếp',
  })

  // Đếm tiến độ câu hỏi
  const totalQuestions = questions.length
  const answeredCount = questions.filter(q => {
    const val = answersState[String(q.id || q.code)]
    if (Array.isArray(val)) return val.length > 0
    return val !== undefined && String(val).trim() !== ''
  }).length
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 100

  function handleSingleChoice(key: string, val: any) {
    setAnswersState(prev => ({ ...prev, [key]: val }))
    setErrorMsg('')
  }

  function handleMultipleChoice(key: string, optionVal: string, isChecked: boolean) {
    setAnswersState(prev => {
      const currentList: string[] = Array.isArray(prev[key]) ? prev[key] : []
      let updated: string[]
      if (isChecked) {
        updated = currentList.includes(optionVal) ? currentList : [...currentList, optionVal]
      } else {
        updated = currentList.filter(x => x !== optionVal)
      }
      return { ...prev, [key]: updated }
    })
    setErrorMsg('')
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')

    // Kiểm tra các câu hỏi bắt buộc
    for (const q of questions) {
      const key = String(q.id || q.code)
      const val = answersState[key]
      const isEmpty = val === undefined || (Array.isArray(val) && val.length === 0) || String(val).trim() === ''
      if (q.required && isEmpty) {
        setErrorMsg(`⚠️ Quý vị vui lòng hoàn thành câu hỏi bắt buộc: "${q.question}" trước khi gửi phiếu khảo sát!`)
        const el = document.getElementById(`q-${key}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.style.borderColor = '#ef4444'
          el.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.2)'
          setTimeout(() => {
            el.style.borderColor = ''
            el.style.boxShadow = ''
          }, 3000)
        }
        return
      }
    }

    setBusy(true)
    const fd = new FormData(e.currentTarget)

    const answers = questions.map(q => {
      const key = String(q.id || q.code)
      const stateVal = answersState[key]
      let value = ''
      if (Array.isArray(stateVal)) {
        value = stateVal.join(' | ')
      } else if (stateVal !== undefined) {
        value = String(stateVal)
      } else {
        value = String(fd.get(`q_${key}`) || '')
      }
      return {
        question: key,
        value,
      }
    })

    try {
      const r = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          answers,
          demographics: showDemographics ? demographics : undefined,
          comment: fd.get('comment'),
          website: fd.get('website'),
          'cf-turnstile-response': fd.get('cf-turnstile-response'),
        }),
      })
      const j = await r.json().catch(() => ({}))
      setBusy(false)
      if (r.ok) {
        setDoneData({ code: j.code || 'KS-OK', overallScore: j.overallScore })
      } else {
        setErrorMsg(j.error || 'Không thể gửi khảo sát. Vui lòng thử lại.')
      }
    } catch {
      setBusy(false)
      setErrorMsg('Đã xảy ra lỗi kết nối internet. Vui lòng kiểm tra lại mạng.')
    }
  }

  if (doneData) {
    return (
      <div className="opsReceiptCard" style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0369a1', margin: '0 0 10px' }}>
          Ý KIẾN CỦA QUÝ VỊ ĐÃ ĐƯỢC TIẾP NHẬN THÀNH CÔNG!
        </h2>
        <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 20px' }}>
          Bệnh viện Đa khoa Khu vực Thới Lai trân trọng cảm ơn Quý vị đã dành thời gian quý báu để tham gia khảo sát. Mọi ý kiến đều được tổng hợp báo cáo Hội đồng Quản lý Chất lượng và Ban Giám đốc phục vụ công tác cải tiến dịch vụ.
        </p>

        <div className="opsReceiptBox">
          <span className="opsReceiptLabel">MÃ BIÊN NHẬN KHẢO SÁT ĐỊNH DANH</span>
          <span className="opsReceiptCode">{doneData.code}</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Khảo sát được bảo mật tuyệt đối theo quy định an toàn thông tin
          </span>
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
    <form onSubmit={submit} className="surveyContainer">
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

      {/* Tiến độ khảo sát */}
      <div className="opsProgressWrapper" style={{ marginBottom: '24px' }}>
        <div className="opsProgressInfo">
          <span>Tiến độ câu hỏi: {answeredCount} / {totalQuestions}</span>
          <span style={{ color: progressPercent === 100 ? '#10b981' : '#0284c7' }}>
            {progressPercent}%
          </span>
        </div>
        <div className="opsProgressBar">
          <div className="opsProgressFill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {errorMsg && (
        <div className="surveyMissingWarningBanner">
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '15px' }}>{errorMsg}</span>
        </div>
      )}

      {/* Khối Demographics nếu được bật */}
      {showDemographics && (
        <div className="opsSectionCard">
          <div className="opsSectionHeader">
            <div className="opsSectionHeaderTitle">
              <div className="opsSectionTag">👤</div>
              <div className="opsSectionTitleText">
                <h3>Thông tin người tham gia khảo sát</h3>
                <p>Phục vụ công tác thống kê phân nhóm (được bảo mật và ẩn danh theo quy định)</p>
              </div>
            </div>
          </div>
          <div className="opsSectionBody">
            <div className="opsGrid3">
              <div className="opsFieldGroup">
                <label className="opsLabel">Giới tính</label>
                <div className="opsRadioGroup">
                  {['Nam', 'Nữ'].map(g => (
                    <label key={g} className={`opsRadioPill ${demographics.gender === g ? 'checked' : ''}`}>
                      <input
                        type="radio"
                        name="demo_gender"
                        value={g}
                        checked={demographics.gender === g}
                        onChange={() => setDemographics(p => ({ ...p, gender: g }))}
                      />
                      {g === 'Nam' ? '👨 Nam' : '👩 Nữ'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="opsFieldGroup">
                <label className="opsLabel">Độ tuổi</label>
                <select
                  className="opsSelect"
                  value={demographics.ageGroup}
                  onChange={e => setDemographics(p => ({ ...p, ageGroup: e.target.value }))}
                >
                  <option value="Dưới 18 tuổi">Dưới 18 tuổi</option>
                  <option value="18 - 29 tuổi">18 – 29 tuổi</option>
                  <option value="30 - 45 tuổi">30 – 45 tuổi</option>
                  <option value="46 - 60 tuổi">46 – 60 tuổi</option>
                  <option value="Trên 60 tuổi">Trên 60 tuổi</option>
                </select>
              </div>

              <div className="opsFieldGroup">
                <label className="opsLabel">Đối tượng tham gia</label>
                <select
                  className="opsSelect"
                  value={demographics.respondentType}
                  onChange={e => setDemographics(p => ({ ...p, respondentType: e.target.value }))}
                >
                  <option value="Người bệnh trực tiếp">Người bệnh trực tiếp</option>
                  <option value="Thân nhân người bệnh">Thân nhân người bệnh</option>
                  <option value="Cán bộ nhân viên">Cán bộ / Nhân viên y tế</option>
                  <option value="Khách đến liên hệ công tác">Khách liên hệ công tác</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách câu hỏi linh hoạt */}
      {questions.map((q, idx) => {
        const key = String(q.id || q.code)
        const qOptions: string[] = typeof q.options === 'string'
          ? q.options.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
          : Array.isArray(q.options)
            ? q.options.map((o: any) => typeof o === 'string' ? o : o.label || o.value)
            : []

        return (
          <div key={key || idx} id={`q-${key}`} className="surveyQuestionCard">
            <div className="surveyQuestionTitle">
              <span style={{ color: '#0284c7', fontWeight: 800 }}>{idx + 1}.</span>
              <span>{q.question}</span>
              {q.required && <span className="surveyRequiredStar">*</span>}
            </div>

            {/* Kiểu 1: Đánh giá 1-5 sao / Likert */}
            {q.type === 'rating5' && (
              <div className="surveyRatingGrid">
                {RATING_5_LEVELS.map(item => {
                  const isSelected = String(answersState[key]) === String(item.score)
                  return (
                    <label
                      key={item.score}
                      className={`surveyRatingOption ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSingleChoice(key, item.score)}
                    >
                      <input
                        type="radio"
                        name={`q_${key}`}
                        value={item.score}
                        checked={isSelected}
                        onChange={() => handleSingleChoice(key, item.score)}
                      />
                      <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                      <span className="surveyRatingScore">{item.score} điểm</span>
                      <span className="surveyRatingLabel">{item.label}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* Kiểu 2: Đánh giá thang điểm 1-10 */}
            {q.type === 'rating10' && (
              <div style={{ marginTop: '12px' }}>
                <div className="surveyScore10Grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(pt => {
                    const isSelected = Number(answersState[key]) === pt
                    return (
                      <button
                        key={pt}
                        type="button"
                        className={`surveyScore10Btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSingleChoice(key, pt)}
                      >
                        {pt}
                      </button>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <span>1: Hoàn toàn không hài lòng</span>
                  {answersState[key] !== undefined && (
                    <span className="surveyScore10SelectedBadge">
                      ✓ Đang chọn: <strong>{answersState[key]} / 10 điểm</strong>
                    </span>
                  )}
                  <span>10: Cực kỳ hài lòng</span>
                </div>
              </div>
            )}

            {/* Kiểu 3: Đúng / Sai hoặc Có / Không */}
            {q.type === 'yesno' && (
              <div className="surveyYesNoGrid">
                {[
                  { val: 'Có', label: 'Có / Đúng thực tế', icon: '✅' },
                  { val: 'Không', label: 'Không / Chưa đạt', icon: '❌' },
                ].map(x => {
                  const isSelected = answersState[key] === x.val
                  return (
                    <label key={x.val} className={`surveyRadioBlock ${isSelected ? 'checked' : ''}`}>
                      <input
                        type="radio"
                        name={`q_${key}`}
                        value={x.val}
                        checked={isSelected}
                        onChange={() => handleSingleChoice(key, x.val)}
                      />
                      <span style={{ fontSize: '18px' }}>{x.icon}</span>
                      <span>{x.label}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* Kiểu 4: Chọn 1 đáp án (Radio) */}
            {q.type === 'single' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {qOptions.map((opt, oIdx) => {
                  const isSelected = answersState[key] === opt
                  return (
                    <label key={oIdx} className={`surveyRadioBlock ${isSelected ? 'checked' : ''}`}>
                      <input
                        type="radio"
                        name={`q_${key}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => handleSingleChoice(key, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* Kiểu 5: Chọn nhiều đáp án (Checkbox) */}
            {q.type === 'multiple' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {qOptions.map((opt, oIdx) => {
                  const isChecked = Array.isArray(answersState[key]) && answersState[key].includes(opt)
                  return (
                    <label key={oIdx} className={`surveyRadioBlock ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => handleMultipleChoice(key, opt, e.target.checked)}
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* Kiểu 6: Nhập văn bản tự do */}
            {q.type === 'text' && (
              <div style={{ marginTop: '10px' }}>
                <textarea
                  name={`q_${key}`}
                  rows={4}
                  className="surveyTextarea"
                  value={answersState[key] || ''}
                  onChange={e => handleSingleChoice(key, e.target.value)}
                  placeholder="Nhập ý kiến đánh giá chi tiết của quý vị..."
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Ý kiến đóng góp khác */}
      <div className="surveyQuestionCard">
        <div className="surveyQuestionTitle">
          <span style={{ color: '#0284c7', fontWeight: 800 }}>💡</span>
          <span>Ý kiến đóng góp hoặc đề xuất khác (nếu có)</span>
        </div>
        <textarea
          name="comment"
          rows={4}
          className="surveyTextarea"
          placeholder="Chia sẻ thêm những điểm bệnh viện cần hoàn thiện hoặc khen ngợi tập thể y bác sĩ..."
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <TurnstileWidget />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/khao-sat" className="btnCareSecondary">
          ← Quay lại danh sách
        </Link>
        <button
          type="submit"
          className="btnCarePrimary"
          disabled={busy}
          style={{ padding: '14px 32px', fontSize: '15px' }}
        >
          {busy ? 'Đang gửi thông tin...' : 'Gửi phiếu khảo sát →'}
        </button>
      </div>
    </form>
  )
}
