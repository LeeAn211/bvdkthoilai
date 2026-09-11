import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getCMS } from '@/lib/payload'
import { bodyIsTooLarge, rateLimit } from '@/lib/request-security'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    if (bodyIsTooLarge(req, 8_000)) return NextResponse.json({ error: 'Dữ liệu quá lớn' }, { status: 413 })
    const throttle = rateLimit(req, 'consultation-create', 8, 15 * 60_000)
    if (!throttle.allowed) return NextResponse.json({ error: 'Bạn gửi quá nhiều câu hỏi. Vui lòng thử lại sau.' }, { status: 429, headers: { 'Retry-After': String(throttle.retryAfter) } })
    const body = await req.json()
    const question = String(body.question || '').trim().slice(0, 3000)
    if (question.length < 3) return NextResponse.json({ error: 'Câu hỏi không hợp lệ' }, { status: 400 })

    const payload = await getCMS()
    const publicToken = randomUUID()
    await payload.create({
      collection: 'consultations',
      data: { publicToken, question, status: 'new' },
      overrideAccess: true,
    })
    return NextResponse.json({ ok: true, token: publicToken })
  } catch {
    return NextResponse.json({ error: 'Chưa thể chuyển câu hỏi đến tư vấn viên' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const throttle = rateLimit(req, 'consultation-status', 120, 15 * 60_000)
    if (!throttle.allowed) return NextResponse.json({ error: 'Vui lòng thử lại sau.' }, { status: 429, headers: { 'Retry-After': String(throttle.retryAfter) } })
    const token = new URL(req.url).searchParams.get('token')?.trim() || ''
    if (token.length < 20) return NextResponse.json({ error: 'Mã yêu cầu không hợp lệ' }, { status: 400 })

    const payload = await getCMS()
    const result = await payload.find({
      collection: 'consultations',
      where: { publicToken: { equals: token } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const item: any = result.docs[0]
    if (!item) return NextResponse.json({ error: 'Không tìm thấy yêu cầu' }, { status: 404 })
    return NextResponse.json({ status: item.status, reply: item.staffReply || '' })
  } catch {
    return NextResponse.json({ error: 'Chưa thể kiểm tra câu trả lời' }, { status: 500 })
  }
}
