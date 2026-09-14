'use client'

import { useState } from 'react'
import { TurnstileWidget } from './TurnstileWidget'

const RATING_LEVELS = [
  { score: 1, label: 'Rất không hài lòng', emoji: '😞' },
  { score: 2, label: 'Không hài lòng', emoji: '🙁' },
  { score: 3, label: 'Bình thường', emoji: '😐' },
  { score: 4, label: 'Hài lòng', emoji: '🙂' },
  { score: 5, label: 'Rất hài lòng', emoji: '😄' },
]

export default function SurveyForm({
  campaignId,
  questions,
}: {
  campaignId: string
  questions: any[]
}) {
  const [done, setDone] = useState('')
  const [busy, setBusy] = useState(false)
  const [answersState, setAnswersState] = useState<Record<string, string>>({})

  function handleScoreChange(qId: string, score: number) {
    setAnswersState(prev => ({ ...prev, [qId]: String(score) }))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    const fd = new FormData(e.currentTarget)
    const answers = questions.map(q => ({
      question: q.id,
      value: answersState[String(q.id)] || fd.getAll(`q_${q.id}`).join(' | '),
    }))

    try {
      const r = await fetch('/api/surveys/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          answers,
          comment: fd.get('comment'),
          website: fd.get('website'),
          'cf-turnstile-response': fd.get('cf-turnstile-response'),
        }),
      })
      const j = await r.json().catch(() => ({}))
      setBusy(false)
      if (r.ok) {
        setDone(`Cảm ơn bạn đã tham gia khảo sát. Mã phản hồi của bạn: ${j.code || 'ĐÃ TIẾP NHẬN'}`)
      } else {
        setDone(j.error || 'Không thể gửi khảo sát. Vui lòng thử lại.')
      }
    } catch {
      setBusy(false)
      setDone('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại mạng internet.')
    }
  }

  if (done) {
    return (
      <div className="patientCareNoticeBanner" style={{ textAlign: 'center', padding: '36px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h3 style={{ fontSize: '20px', color: '#0369a1', margin: '0 0 12px', fontWeight: 800 }}>
          Ý KIẾN CỦA BẠN ĐÃ ĐƯỢC TIẾP NHẬN
        </h3>
        <p style={{ color: '#334155', fontSize: '15px', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
          {done}
        </p>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px' }}>
          Mọi đóng góp quý báu giúp Bệnh viện Đa khoa Khu vực Thới Lai ngày càng nâng cao chất lượng khám chữa bệnh.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <a href="/khao-sat" className="btnCarePrimary" style={{ flex: 'none' }}>
            ← Xem các khảo sát khác
          </a>
          <a href="/" className="btnCareSecondary">
            Về Trang chủ
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="surveyContainer">
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

      {questions.map((q, idx) => (
        <div key={q.id || idx} className="surveyQuestionCard">
          <div className="surveyQuestionTitle">
            <span style={{ color: '#0284c7', fontWeight: 800 }}>{idx + 1}.</span>
            <span>{q.question}</span>
            {q.required && <span className="surveyRequiredStar">*</span>}
          </div>

          {q.type === 'rating5' ? (
            <div className="surveyRatingGrid">
              {RATING_LEVELS.map(item => {
                const isSelected = answersState[String(q.id)] === String(item.score)
                return (
                  <label
                    key={item.score}
                    className={`surveyRatingOption ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleScoreChange(String(q.id), item.score)}
                  >
                    <input
                      required={q.required}
                      type="radio"
                      name={`q_${q.id}`}
                      value={item.score}
                      checked={isSelected}
                      onChange={() => handleScoreChange(String(q.id), item.score)}
                    />
                    <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                    <span className="surveyRatingScore">{item.score} điểm</span>
                    <span className="surveyRatingLabel">{item.label}</span>
                  </label>
                )
              })}
            </div>
          ) : q.type === 'yesno' ? (
            <div className="surveyYesNoGrid">
              {[
                { val: 'Có', label: 'Có / Đúng thực tế', icon: '✅' },
                { val: 'Không', label: 'Không / Chưa đạt', icon: '❌' },
              ].map(x => (
                <label key={x.val} className="surveyRadioBlock">
                  <input
                    required={q.required}
                    type="radio"
                    name={`q_${q.id}`}
                    value={x.val}
                  />
                  <span style={{ fontSize: '18px' }}>{x.icon}</span>
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
          ) : q.type === 'text' ? (
            <textarea
              required={q.required}
              name={`q_${q.id}`}
              rows={4}
              className="surveyTextarea"
              placeholder="Nhập ý kiến đánh giá chi tiết của bạn..."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(q.options || []).map((o: any, oIdx: number) => (
                <label key={o.value || oIdx} className="surveyRadioBlock">
                  <input
                    required={q.required && q.type === 'single'}
                    type={q.type === 'multiple' ? 'checkbox' : 'radio'}
                    name={`q_${q.id}`}
                    value={o.value}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="surveyQuestionCard">
        <div className="surveyQuestionTitle">
          <span style={{ color: '#0284c7', fontWeight: 800 }}>💡</span>
          <span>Ý kiến đóng góp khác (nếu có)</span>
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <a href="/khao-sat" className="btnCareSecondary">
          ← Quay lại danh sách
        </a>
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
