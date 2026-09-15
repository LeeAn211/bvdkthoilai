import { NextResponse } from 'next/server'
import { getCMS } from '@/lib/payload'
import { bodyIsTooLarge, rateLimit } from '@/lib/request-security'

// Bộ từ điển phương ngữ Nam Bộ & Tây Nam Bộ (Cần Thơ, Thới Lai) được chuẩn hóa từ cụm dài đến từ đơn
const DIALECT_MAP: Record<string, string> = {
  // Cụm từ ghép / cụm mô tả
  'gio cang': 'chan',
  'chan tay': 'tay chan',
  'bao tu': 'da day',
  'cu hong': 'hong',
  'lo tai': 'tai',
  'con mat': 'mat',
  'cai rang': 'rang',
  'cai bung': 'bung',
  'cai dau': 'dau',
  'sanh de': 'sinh con',
  'de con': 'sinh con',
  'co bau': 'mang thai',
  'co thai': 'mang thai',
  'can bau': 'kham thai',
  'con nit': 'tre em',
  'be nho': 'tre em',
  'con em': 'tre em',
  'em be': 'tre em',
  'oc sua': 'non tro',
  'doi bang': 'lai xe',
  'bang lai': 'lai xe',
  'chay xe': 'lai xe',
  'xin viec': 'kham suc khoe',
  'di lam': 'kham suc khoe',
  'tien bac': 'chi phi',
  'gia ca': 'bang gia',
  'bao nhieu': 'chi phi',
  'may gio': 'gio lam viec',
  'nghi le': 'ngay nghi',
  'chu nhat': 'ngay nghi',
  'thu 7': 'ngay nghi',
  'thu bay': 'ngay nghi',
  'lay so': 'quy trinh',
  'xep hang': 'quy trinh',

  // Từ đơn địa phương
  'nhut': 'dau',
  'nhuc': 'dau',
  'moi': 'dau',
  'e am': 'dau',
  'thon': 'dau',
  'tuc': 'dau',
  'gio': 'chan',
  'cang': 'chan',
  'lung': 'cot song',
  'sanh': 'sinh',
  'de': 'sinh con',
}

const normalize = (value: string) => {
  let text = ' ' + (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() + ' '

  for (const [dialect, standard] of Object.entries(DIALECT_MAP)) {
    text = text.replaceAll(' ' + dialect + ' ', ' ' + standard + ' ')
  }

  return text.replace(/\s+/g, ' ').trim()
}


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

    // Nếu chưa match trong chatbotIntents, kiểm tra tiếp trong customAnswers của site-settings
    if (!matched) {
      try {
        const siteSettings: any = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
        const customAnswers = siteSettings?.websiteAssistant?.customAnswers
        if (Array.isArray(customAnswers) && customAnswers.length > 0) {
          let bestCMS: any = null
          let bestScore = 0
          for (const ans of customAnswers) {
            if (!ans?.answer) continue
            const terms = [ans.question, ...(ans.keywords || '').split(/[,;\n]/)]
              .map((t: any) => normalize(String(t || '')))
              .filter((t: string) => t.length >= 2)
            let score = 0
            for (const t of terms) {
              if (q === t) score += 10
              else if (q.includes(t)) score += t.length > 5 ? 5 : 3
              else if (t.includes(q) && q.length >= 4) score += 2
            }
            if (score > bestScore) {
              bestScore = score
              bestCMS = ans
            }
          }
          if (bestCMS && bestScore >= 2) {
            const hotline = String(siteSettings?.hotline || '02923689115')
            const medproUrl = String(siteSettings?.medproUrl || 'https://medpro.vn/')
            const replaceVars = (v?: string) => v?.replaceAll('{{HOTLINE}}', hotline).replaceAll('{{MEDPRO_URL}}', medproUrl)
            matched = {
              answer: replaceVars(bestCMS.answer),
              linkLabel: replaceVars(bestCMS.linkLabel),
              linkUrl: replaceVars(bestCMS.linkUrl),
              openNewTab: bestCMS.openNewTab,
            }
          }
        }
      } catch {}
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
