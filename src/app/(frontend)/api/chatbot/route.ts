import { NextResponse } from 'next/server'
import { getCMS } from '@/lib/payload'
import { bodyIsTooLarge, rateLimit } from '@/lib/request-security'

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

export async function POST(req: Request) {
  try {
    if (bodyIsTooLarge(req, 8_000)) return NextResponse.json({ error: 'Dữ liệu quá lớn' }, { status: 413 })
    const throttle = rateLimit(req, 'chatbot', 60, 15 * 60_000)
    if (!throttle.allowed) return NextResponse.json({ error: 'Bạn gửi quá nhiều câu hỏi.' }, { status: 429 })
    const body = await req.json()
    const question = String(body.question || '').trim().slice(0, 1500)
    const sessionId = String(body.sessionId || '').trim().slice(0, 100)
    if (question.length < 2) return NextResponse.json({ error: 'Câu hỏi không hợp lệ' }, { status: 400 })
    const q = normalize(question)
    const payload = await getCMS()
    const intents = await payload.find({ collection: 'chatbotIntents', where: { active: { equals: true } }, sort: '-priority', limit: 200, depth: 0, overrideAccess: true })
    let matched: any
    for (const intent of intents.docs as any[]) {
      const phrases = Array.isArray(intent.phrases) ? intent.phrases.map((p: any) => normalize(String(p?.text || ''))).filter(Boolean) : []
      if (phrases.some((phrase: string) => q.includes(phrase) || phrase.includes(q))) { matched = intent; break }
    }

    const now = new Date().toISOString()
    if (sessionId) {
      try {
        const existing = await payload.find({ collection: 'chatbotConversations', where: { sessionId: { equals: sessionId } }, limit: 1, depth: 0, overrideAccess: true })
        const current: any = existing.docs[0]
        const messages = [...(Array.isArray(current?.messages) ? current.messages : []), { from: 'user', text: question, at: now }, ...(matched ? [{ from: 'bot', text: matched.answer, at: now }] : [])].slice(-100)
        if (current) await payload.update({ collection: 'chatbotConversations', id: current.id, data: { messages, lastMessageAt: now }, overrideAccess: true })
        else await payload.create({ collection: 'chatbotConversations', data: { sessionId, messages, lastMessageAt: now }, overrideAccess: true })
      } catch {}
    }

    if (!matched) {
      try {
        const old = await payload.find({ collection: 'chatbotUnanswered', where: { and: [{ normalizedQuestion: { equals: q } }, { resolved: { equals: false } }] }, limit: 1, depth: 0, overrideAccess: true })
        const item: any = old.docs[0]
        if (item) await payload.update({ collection: 'chatbotUnanswered', id: item.id, data: { count: Number(item.count || 1) + 1, lastAskedAt: now }, overrideAccess: true })
        else await payload.create({ collection: 'chatbotUnanswered', data: { question, normalizedQuestion: q, count: 1, lastAskedAt: now, resolved: false }, overrideAccess: true })
      } catch {}
      return NextResponse.json({ matched: false })
    }
    return NextResponse.json({ matched: true, answer: matched.answer, linkLabel: matched.linkLabel || undefined, linkUrl: matched.linkUrl || undefined, openNewTab: Boolean(matched.openNewTab) })
  } catch {
    return NextResponse.json({ matched: false })
  }
}
