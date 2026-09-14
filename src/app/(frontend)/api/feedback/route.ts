import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getCMS } from '@/lib/payload'
import { bodyIsTooLarge, rateLimit, validEmail, validPhone, verifyTurnstile } from '@/lib/request-security'

const makeCode = () => `GY-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`

export async function POST(req: Request) {
  try {
    if (bodyIsTooLarge(req, 20_000)) return NextResponse.json({ error: 'Dữ liệu quá lớn' }, { status: 413 })
    const throttle = rateLimit(req, 'feedback-case', 5, 15 * 60_000)
    if (!throttle.allowed) return NextResponse.json({ error: 'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' }, { status: 429, headers: { 'Retry-After': String(throttle.retryAfter) } })
    const body = await req.json()
    if (body.website) return NextResponse.json({ ok: true })
    if (!(await verifyTurnstile(req, body['cf-turnstile-response']))) return NextResponse.json({ error: 'Không thể xác minh yêu cầu. Vui lòng thử lại.' }, { status: 403 })
    const name = String(body.name || '').trim().slice(0, 150)
    const phone = String(body.phone || '').trim().slice(0, 30)
    const email = String(body.email || '').trim().slice(0, 200)
    const subject = String(body.subject || body.type || 'Góp ý – Phản hồi').trim().slice(0, 250)
    const message = String(body.message || '').trim().slice(0, 5000)
    const category = String(body.category || '').trim()
    const allowContact = body.allowContact !== false && body.allowContact !== 'false'
    if (!name || !validPhone(phone) || !validEmail(email) || message.length < 5) return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })

    const payload = await getCMS()
    let code = makeCode()
    for (let i = 0; i < 3; i++) {
      const exists = await payload.find({ collection: 'feedbackCases', where: { code: { equals: code } }, limit: 1, overrideAccess: true })
      if (!exists.docs.length) break
      code = makeCode()
    }
    let department: number | undefined
    let priority: 'normal' | 'urgent' | 'low' | 'high' = 'normal'
    if (category) {
      const categories = await payload.find({ collection: 'feedbackCategories', where: { id: { equals: category } }, limit: 1, depth: 0, overrideAccess: true })
      const item: any = categories.docs[0]
      const rawDepartment = typeof item?.department === 'object' ? item.department?.id : item?.department
      const parsedDepartment = Number(rawDepartment)
      department = Number.isFinite(parsedDepartment) ? parsedDepartment : undefined
      const rawPriority = String(item?.defaultPriority || 'normal')
      priority = ['normal', 'urgent', 'low', 'high'].includes(rawPriority) ? rawPriority as typeof priority : 'normal'
    }
    const categoryID = Number(category)
    const created: any = await payload.create({ collection: 'feedbackCases', data: { code, name, phone, email: email || undefined, category: Number.isFinite(categoryID) ? categoryID : undefined, subject, message, allowContact, priority, status: 'new', department }, overrideAccess: true })
    await payload.create({ collection: 'feedbackActions', data: { case: created.id, action: 'received', note: 'Phản ánh được tiếp nhận từ website.', public: true }, overrideAccess: true })
    return NextResponse.json({ ok: true, code })
  } catch {
    return NextResponse.json({ error: 'Không thể xử lý yêu cầu' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const throttle = rateLimit(req, 'feedback-lookup', 30, 15 * 60_000)
    if (!throttle.allowed) return NextResponse.json({ error: 'Vui lòng thử lại sau.' }, { status: 429 })
    const url = new URL(req.url)
    const code = String(url.searchParams.get('code') || '').trim().toUpperCase().slice(0, 40)
    const phone = String(url.searchParams.get('phone') || '').trim().slice(0, 30)
    if (!code || !validPhone(phone)) return NextResponse.json({ error: 'Mã tra cứu hoặc số điện thoại không hợp lệ.' }, { status: 400 })
    const payload = await getCMS()
    const result = await payload.find({ collection: 'feedbackCases', where: { and: [{ code: { equals: code } }, { phone: { equals: phone } }] }, limit: 1, depth: 1, overrideAccess: true })
    const item: any = result.docs[0]
    if (!item) return NextResponse.json({ error: 'Không tìm thấy phản ánh phù hợp.' }, { status: 404 })
    const actions = await payload.find({ collection: 'feedbackActions', where: { and: [{ case: { equals: item.id } }, { public: { equals: true } }] }, sort: 'createdAt', limit: 100, depth: 0, overrideAccess: true })
    return NextResponse.json({ code: item.code, subject: item.subject, status: item.status, publicResponse: item.publicResponse || '', createdAt: item.createdAt, updatedAt: item.updatedAt, timeline: actions.docs.map((row: any) => ({ action: row.action, note: row.note || '', createdAt: row.createdAt })) })
  } catch {
    return NextResponse.json({ error: 'Chưa thể tra cứu lúc này.' }, { status: 500 })
  }
}
