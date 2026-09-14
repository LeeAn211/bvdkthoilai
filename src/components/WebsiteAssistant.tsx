'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

type Message = {
  id: number
  from: 'bot' | 'user'
  text: string
  href?: string
  linkLabel?: string
  external?: boolean
  handoffQuestion?: string
  handoffState?: 'idle' | 'sending' | 'sent' | 'error'
  consultationToken?: string
  resolved?: boolean
}

type AssistantProps = {
  enabled?: boolean
  backToTopEnabled?: boolean
  assistantName?: string
  statusText?: string
  greeting?: string
  logoUrl?: string
  primaryColor?: string
  hotline?: string
  medproUrl?: string
  inputPlaceholder?: string
  noticeText?: string
  fallbackResponse?: string
  fallbackLinkLabel?: string
  fallbackLinkUrl?: string
  quickTopics?: Array<{ label?: string; value?: string }>
  customAnswers?: Array<{
    question?: string
    keywords?: string
    answer?: string
    linkLabel?: string
    linkUrl?: string
    openNewTab?: boolean
  }>
}

const defaultQuickTopics = [
  { label: 'Lịch khám', value: 'Xem lịch khám bác sĩ' },
  { label: 'Đặt khám', value: 'Tôi muốn đặt lịch khám' },
  { label: 'Bảng giá', value: 'Tra cứu bảng giá dịch vụ' },
  { label: 'Tiêm ngừa', value: 'Thông tin tiêm ngừa' },
]

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function WebsiteAssistant({
  enabled = true,
  backToTopEnabled = true,
  assistantName = 'Trợ lý Thới Lai',
  statusText = 'Đang trực tuyến',
  greeting = 'Xin chào! Tôi có thể giúp bạn tra cứu lịch khám, bảng giá, tiêm ngừa và thông tin bệnh viện.',
  logoUrl,
  primaryColor = '#0878D1',
  hotline = '02923689115',
  medproUrl = 'https://medpro.vn/',
  inputPlaceholder = 'Nhập nội dung cần hỏi…',
  noticeText = 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.',
  fallbackResponse = 'Tôi chưa hiểu rõ câu hỏi. Bạn hãy chọn một mục gợi ý bên dưới hoặc liên hệ trực tiếp với bệnh viện để được hỗ trợ.',
  fallbackLinkLabel = 'Liên hệ bệnh viện',
  fallbackLinkUrl = '/lien-he',
  quickTopics = defaultQuickTopics,
  customAnswers = [],
}: AssistantProps) {
  const [open, setOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [input, setInput] = useState('')
  const [sessionReady, setSessionReady] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: greeting },
  ])
  const messageEndRef = useRef<HTMLDivElement>(null)
  const checkingTokens = useRef(new Set<string>())
  const chatSessionId = useRef('')

  useEffect(() => {
    try {
      chatSessionId.current = window.sessionStorage.getItem('thoi-lai-assistant-session') || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.sessionStorage.setItem('thoi-lai-assistant-session', chatSessionId.current)
      const saved = window.sessionStorage.getItem('thoi-lai-assistant-messages')
      const parsed = saved ? JSON.parse(saved) : null
      if (Array.isArray(parsed) && parsed.length) setMessages(parsed.slice(-40))
    } catch {}
    setSessionReady(true)
  }, [])

  useEffect(() => {
    if (!sessionReady) return
    try { window.sessionStorage.setItem('thoi-lai-assistant-messages', JSON.stringify(messages.slice(-40))) } catch {}
  }, [messages, sessionReady])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 450)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    const pending = messages.filter((message) => message.consultationToken && !message.resolved)
    if (!pending.length) return

    const checkReplies = async () => {
      for (const pendingMessage of pending) {
        const token = pendingMessage.consultationToken as string
        if (checkingTokens.current.has(token)) continue
        checkingTokens.current.add(token)
        try {
          const response = await fetch(`/api/consultation?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
          const data = await response.json()
          if (response.ok && data.reply) {
            setMessages((current) => {
              if (current.some((message) => message.consultationToken === token && message.resolved)) return current
              const staffMessage: Message = { id: Date.now(), from: 'bot', text: `Tư vấn viên trả lời: ${data.reply}` }
              return [
                ...current.map((message) => message.consultationToken === token ? { ...message, resolved: true } as Message : message),
                staffMessage,
              ]
            })
          }
        } catch {
          // Giữ yêu cầu để tự kiểm tra lại ở vòng tiếp theo.
        } finally {
          checkingTokens.current.delete(token)
        }
      }
    }
    checkReplies()
    const timer = window.setInterval(checkReplies, 8000)
    return () => window.clearInterval(timer)
  }, [messages])

  const answer = (question: string): Omit<Message, 'id' | 'from'> => {
    const q = normalize(question)
    const replaceVariables = (value?: string) => value
      ?.replaceAll('{{HOTLINE}}', hotline)
      .replaceAll('{{MEDPRO_URL}}', medproUrl)
    const customAnswer = customAnswers.find((item) => {
      const terms = [item.question, ...(item.keywords || '').split(/[,;\n]/)]
        .map((term) => normalize(term || '').trim())
        .filter((term) => term.length > 1)
      return terms.some((term) => q.includes(term))
    })
    if (customAnswer?.answer) {
      return {
        text: replaceVariables(customAnswer.answer) || customAnswer.answer,
        href: replaceVariables(customAnswer.linkUrl) || undefined,
        linkLabel: customAnswer.linkLabel || (customAnswer.linkUrl ? 'Xem chi tiết' : undefined),
        external: customAnswer.openNewTab,
      }
    }
    return { text: replaceVariables(fallbackResponse) || fallbackResponse, href: replaceVariables(fallbackLinkUrl) || undefined, linkLabel: fallbackLinkUrl ? fallbackLinkLabel : undefined, handoffQuestion: question, handoffState: 'idle' }
  }

  const requestConsultation = async (messageId: number, question: string) => {
    setMessages((current) => current.map((message) => message.id === messageId ? { ...message, handoffState: 'sending' } as Message : message))
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      if (!response.ok || !data.token) throw new Error('send_failed')
      setMessages((current) => current.map((message) => message.id === messageId ? {
        ...message,
        text: 'Câu hỏi đã được chuyển đến tư vấn viên. Bạn giữ cửa sổ này mở, câu trả lời mới sẽ tự hiển thị.',
        handoffState: 'sent',
        handoffQuestion: undefined,
        consultationToken: data.token,
      } as Message : message))
    } catch {
      setMessages((current) => current.map((message) => message.id === messageId ? { ...message, handoffState: 'error' } as Message : message))
    }
  }

  const send = async (value: string) => {
    const question = value.trim()
    if (!question) return
    const now = Date.now()
    setMessages((current) => [...current, { id: now, from: 'user', text: question }])
    setInput('')
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId: chatSessionId.current }),
      })
      const data = await response.json()
      if (response.ok && data.matched && data.answer) {
        setMessages((current) => [...current, { id: now + 1, from: 'bot', text: data.answer, href: data.linkUrl || undefined, linkLabel: data.linkLabel || (data.linkUrl ? 'Xem chi tiết' : undefined), external: Boolean(data.openNewTab) }])
        return
      }
    } catch {}
    setMessages((current) => [...current, { id: now + 1, from: 'bot', ...answer(question) }])
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(input)
  }

  return (
    <div className="websiteAssistant" style={{ '--assistant-color': primaryColor } as React.CSSProperties}>
      {backToTopEnabled && showBackToTop && !open && (
        <button className="backToTopButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Lên đầu trang" title="Lên đầu trang">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
          <span>Lên đầu</span>
        </button>
      )}

      {enabled && open && (
        <section className="assistantPanel" role="dialog" aria-label={assistantName}>
          <header className="assistantHeader">
            <span className={`assistantAvatar ${logoUrl ? 'hasLogo' : ''}`}>{logoUrl ? <img src={logoUrl} alt="Logo chatbot" /> : '✚'}</span>
            <div><strong>{assistantName}</strong><small><i /> {statusText}</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng chatbot">×</button>
          </header>
          <div className="assistantMessages" aria-live="polite">
            {messages.map((message) => (
              <div className={`assistantMessage ${message.from}`} key={message.id}>
                <p>{message.text}</p>
                {message.href && <a href={message.href} target={message.external ? '_blank' : undefined} rel={message.external ? 'noopener noreferrer' : undefined}>{message.linkLabel} →</a>}
                {message.handoffQuestion && <button className="assistantHandoff" type="button" disabled={message.handoffState === 'sending'} onClick={() => requestConsultation(message.id, message.handoffQuestion || '')}>{message.handoffState === 'sending' ? 'Đang chuyển…' : message.handoffState === 'error' ? 'Thử gửi lại cho tư vấn viên' : 'Gửi tư vấn viên'}</button>}
                {message.handoffState === 'error' && <small className="assistantSendError">Chưa gửi được. Vui lòng thử lại.</small>}
                {message.consultationToken && !message.resolved && <small className="assistantWaiting">● Đang chờ tư vấn viên trả lời</small>}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <div className="assistantQuickTopics">
            {quickTopics.filter((topic) => topic.label && topic.value).map((topic, index) => <button type="button" key={`${topic.label}-${index}`} onClick={() => send(topic.value || '')}>{topic.label}</button>)}
          </div>
          <form className="assistantForm" onSubmit={submit}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={inputPlaceholder} aria-label="Nội dung cần hỏi" />
            <button type="submit" aria-label="Gửi câu hỏi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" /></svg></button>
          </form>
          <small className="assistantNotice">{noticeText}</small>
        </section>
      )}

      {enabled && (
        <button className={`assistantToggle ${open ? 'isOpen' : ''}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Đóng trợ lý' : 'Mở trợ lý hỗ trợ'}>
          {open ? <span>×</span> : <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17.5A7.5 7.5 0 1 1 8.2 20L4 21l1-3.5Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></svg><i /></>}
        </button>
      )}
    </div>
  )
}
