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
    const categoryID = category ? Number(category) : undefined
    const validCategoryID = Number.isFinite(categoryID) && categoryID! > 0 ? categoryID : undefined

    const created: any = await payload.create({
      collection: 'feedbackCases',
      data: {
        code,
        name,
        phone,
        email: email || undefined,
        category: validCategoryID,
        subject,
        message,
        allowContact,
        priority,
        status: 'new',
        department,
      },
      overrideAccess: true,
    })

    // Đồng thời đồng bộ vào collection feedback để hiển thị trên Dashboard Admin
    try {
      await payload.create({
        collection: 'feedback',
        data: {
          code,
          name,
          phone,
          email: email || undefined,
          type: body.type || 'Góp ý',
          message: `${subject ? `[${subject}] ` : ''}${message}`,
          status: 'new',
        },
        overrideAccess: true,
      })
    } catch (fbErr) {
      console.warn('Sync to feedback collection warning:', fbErr)
    }

    await payload.create({
      collection: 'feedbackActions',
      data: {
        case: created.id,
        action: 'received',
        note: 'Phản ánh được tiếp nhận từ website.',
        public: true,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true, code })
  } catch (err: any) {
    console.error('API FEEDBACK ERROR:', err)
    return NextResponse.json({ error: 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const throttle = rateLimit(req, 'feedback-lookup', 40, 15 * 60_000)
    if (!throttle.allowed) return NextResponse.json({ error: 'Vui lòng thử lại sau.' }, { status: 429 })
    const url = new URL(req.url)
    const code = String(url.searchParams.get('code') || '').trim().toUpperCase().slice(0, 40)
    const phone = String(url.searchParams.get('phone') || '').trim().slice(0, 30)

    if (!validPhone(phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.' }, { status: 400 })
    }
    
    const payload = await getCMS()

    // TRƯỜNG HỢP 1: NGƯỜI DÙNG KHÔNG NHẬP HOẶC QUÊN MÃ TRA CỨU -> TÌM TẤT CẢ PHẢN ÁNH THEO SỐ ĐIỆN THOẠI
    if (!code) {
      // Tìm trong feedback
      const fbList = await payload.find({
        collection: 'feedback',
        where: { phone: { equals: phone } },
        sort: '-createdAt',
        limit: 20,
        depth: 0,
        overrideAccess: true,
      })

      // Tìm trong feedbackCases
      const caseList = await payload.find({
        collection: 'feedbackCases',
        where: { phone: { equals: phone } },
        sort: '-createdAt',
        limit: 20,
        depth: 0,
        overrideAccess: true,
      })

      const codeMap = new Map<string, any>()

      for (const item of (fbList.docs as any[])) {
        const itemCode = item.code || `FB-${item.id}`
        const mappedStatus = item.status === 'done' ? 'resolved' : item.status === 'processing' ? 'processing' : 'new'
        codeMap.set(itemCode, {
          code: itemCode,
          name: item.name || 'Người bệnh',
          subject: item.type || 'Phản ánh – Góp ý',
          message: item.message || '',
          status: mappedStatus,
          publicResponse: item.response || '',
          resolvedAt: item.resolvedAt || null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
      }

      for (const item of (caseList.docs as any[])) {
        if (!item.code) continue
        const existing = codeMap.get(item.code)
        if (existing) {
          existing.subject = item.subject || existing.subject
          if (!existing.publicResponse && item.publicResponse) existing.publicResponse = item.publicResponse
          if (item.status === 'resolved' || item.status === 'closed') existing.status = 'resolved'
          else if (item.status === 'processing') existing.status = 'processing'
        } else {
          codeMap.set(item.code, {
            code: item.code,
            name: item.name || 'Người bệnh',
            subject: item.subject || 'Phản ánh – Góp ý',
            message: item.message || '',
            status: item.status,
            publicResponse: item.publicResponse || '',
            resolvedAt: item.closedAt || null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })
        }
      }

      const items = Array.from(codeMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )

      if (items.length === 0) {
        return NextResponse.json({
          error: `Không tìm thấy phản ánh hoặc góp ý nào được gửi từ số điện thoại ${phone}.`,
        }, { status: 404 })
      }

      return NextResponse.json({
        phone,
        total: items.length,
        items,
      })
    }

    // TRƯỜNG HỢP 2: CÓ ĐẦY ĐỦ CẢ MÃ TRA CỨU VÀ SỐ ĐIỆN THOẠI -> TRẢ VỀ CHI TIẾT TỪNG MỤC
    // 1. Tìm trong feedbackCases trước
    const result = await payload.find({
      collection: 'feedbackCases',
      where: { and: [{ code: { equals: code } }, { phone: { equals: phone } }] },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })

    let caseItem: any = result.docs[0]
    let feedbackItem: any = null

    // 2. Tìm trong feedback collection (phản hồi người bệnh)
    try {
      const fbResult = await payload.find({
        collection: 'feedback',
        where: { and: [{ code: { equals: code } }, { phone: { equals: phone } }] },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (fbResult.docs.length > 0) {
        feedbackItem = fbResult.docs[0]
      }
    } catch {}

    if (!caseItem && !feedbackItem) {
      return NextResponse.json({ error: 'Không tìm thấy hồ sơ phản ánh phù hợp với Mã tra cứu và Số điện thoại này.' }, { status: 404 })
    }

    // Lấy câu trả lời chính thức ưu tiên từ feedback (nếu admin vừa nhập vào feedback) hoặc feedbackCases
    const officialResponse = feedbackItem?.response || caseItem?.publicResponse || ''
    
    // Đồng bộ trạng thái mới nhất
    let rawStatus = caseItem?.status || 'new'
    if (feedbackItem?.status === 'done') {
      rawStatus = 'resolved'
    } else if (feedbackItem?.status === 'processing') {
      rawStatus = 'processing'
    }

    let timeline: any[] = []
    if (caseItem?.id) {
      const actions = await payload.find({
        collection: 'feedbackActions',
        where: { and: [{ case: { equals: caseItem.id } }, { public: { equals: true } }] },
        sort: 'createdAt',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      })
      timeline = actions.docs.map((row: any) => ({
        action: row.action,
        note: row.note || '',
        createdAt: row.createdAt,
      }))
    }

    // Nếu đã có câu trả lời chính thức mà chưa có mục trong timeline
    if (officialResponse && !timeline.some((t: any) => t.action === 'response')) {
      timeline.push({
        action: 'response',
        note: 'Bệnh viện Đa khoa Khu vực Thới Lai đã gửi phản hồi chính thức.',
        createdAt: feedbackItem?.resolvedAt || feedbackItem?.updatedAt || caseItem?.updatedAt || new Date().toISOString(),
      })
    }

    return NextResponse.json({
      code: code,
      name: feedbackItem?.name || caseItem?.name || 'Người bệnh',
      subject: caseItem?.subject || feedbackItem?.type || 'Phản ánh – Góp ý',
      message: feedbackItem?.message || caseItem?.message || '',
      status: rawStatus,
      publicResponse: officialResponse,
      resolvedAt: feedbackItem?.resolvedAt || caseItem?.closedAt || null,
      createdAt: caseItem?.createdAt || feedbackItem?.createdAt,
      updatedAt: feedbackItem?.updatedAt || caseItem?.updatedAt,
      timeline,
    })
  } catch {
    return NextResponse.json({ error: 'Chưa thể tra cứu lúc này.' }, { status: 500 })
  }
}
