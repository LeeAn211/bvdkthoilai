import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getCMS } from '@/lib/payload'
import { bodyIsTooLarge, rateLimit, verifyTurnstile } from '@/lib/request-security'

export async function POST(req: Request) {
  try {
    if (bodyIsTooLarge(req, 80_000)) {
      return NextResponse.json({ error: 'Dữ liệu khảo sát quá lớn.' }, { status: 413 })
    }

    const lim = rateLimit(req, 'inpatient-survey', 12, 15 * 60_000)
    if (!lim.allowed) {
      return NextResponse.json({ error: 'Quý vị đã gửi nhiều lần. Vui lòng thử lại sau.' }, { status: 429 })
    }

    const body = await req.json()

    // Honeypot bot check
    if (body.website) {
      return NextResponse.json({ ok: true, code: 'KS-NT-OK' })
    }

    // Turnstile verification
    const verified = await verifyTurnstile(req, body['cf-turnstile-response'])
    if (!verified) {
      return NextResponse.json({ error: 'Không thể xác minh bảo mật. Vui lòng tải lại trang và thử lại.' }, { status: 403 })
    }

    const demographics = body.demographics || {}
    const ratings = body.ratings || {}
    const overallRating10 = Number(body.overallRating10) || 9
    const wouldReturn = String(body.wouldReturn || '').slice(0, 100)
    const comment = String(body.comment || '').trim().slice(0, 5000)

    // Tính điểm trung bình của 20 câu hỏi (thang 5)
    const scores = Object.values(ratings).map((v: any) => Number(v)).filter(n => n >= 1 && n <= 5)
    const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '5.00'

    // Tạo mã biên nhận định danh duy nhất (VD: KS-NOITRU-2026-A1B2C3D4)
    const now = new Date()
    const code = `KS-NOITRU-${now.getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`

    // Định dạng nội dung chi tiết để lưu trữ vào Feedback / FeedbackCases
    const feedbackSubject = `[Khảo sát Nội trú Mẫu 1 BYT] ĐTB: ${averageScore}/5★ | Điểm chung: ${overallRating10}/10`
    const detailedReport = [
      `PHIẾU KHẢO SÁT HÀI LÒNG NGƯỜI BỆNH ĐIỀU TRỊ NỘI TRÚ (MẪU SỐ 1 - BỘ Y TẾ)`,
      `--------------------------------------------------`,
      `Mã khảo sát: ${code}`,
      `Thời gian gửi: ${now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      ``,
      `I. THÔNG TIN CHUNG NGƯỜI BỆNH NỘI TRÚ:`,
      `- Giới tính: ${demographics.gender || 'Chưa cung cấp'}`,
      `- Độ tuổi: ${demographics.ageGroup || 'Chưa cung cấp'}`,
      `- Số ngày nằm viện: ${demographics.daysInHospital || 'Chưa cung cấp'}`,
      `- Thẻ BHYT: ${demographics.insurance || 'Chưa cung cấp'}`,
      `- Nơi cư trú: ${demographics.area || 'Chưa cung cấp'}`,
      `- Khoa điều trị: ${demographics.department || 'Chưa cung cấp'}`,
      ``,
      `II. KẾT QUẢ ĐÁNH GIÁ 5 NHÓM TIÊU CHÍ (THANG ĐIỂM 1 - 5):`,
      `- Điểm trung bình 20 tiêu chí: ${averageScore} / 5.00`,
      ...Object.entries(ratings).map(([qId, score]) => `  • Tiêu chí [${qId}]: ${score}★`),
      ``,
      `III. ĐÁNH GIÁ TỔNG THỂ & Ý KIẾN ĐÓNG GÓP:`,
      `- Điểm hài lòng chung: ${overallRating10} / 10 điểm`,
      `- Khả năng quay lại / giới thiệu: ${wouldReturn}`,
      `- Ý kiến phản hồi / góp ý: ${comment || '(Không có góp ý thêm)'}`,
    ].join('\n')

    const payload = await getCMS()

    // 1. Lưu vào feedbackCases
    try {
      await payload.create({
        collection: 'feedbackCases',
        data: {
          code,
          name: `Người bệnh nội trú (${demographics.gender || 'Ẩn danh'}, ${demographics.department || 'Nội trú'})`,
          phone: '0000000000', // Đánh dấu khảo sát ẩn danh
          subject: feedbackSubject,
          message: detailedReport,
          status: 'resolved',
          priority: 'normal',
          allowContact: false,
          publicResponse: 'Bệnh viện Đa khoa Khu vực Thới Lai xin chân thành cảm ơn Quý người bệnh và thân nhân đã dành thời gian đóng góp ý kiến. Toàn bộ phản hồi được tổng hợp định kỳ báo cáo Ban Giám đốc phục vụ kế hoạch nâng cao chất lượng điều trị và buồng bệnh.',
          closedAt: now.toISOString(),
        },
        overrideAccess: true,
      })
    } catch (caseErr) {
      console.warn('Could not save to feedbackCases:', caseErr)
    }

    // 2. Lưu vào feedback (quản lý trên CMS Dashboard)
    try {
      await payload.create({
        collection: 'feedback',
        data: {
          code,
          name: `Người bệnh nội trú (${demographics.gender || 'Ẩn danh'})`,
          phone: '0000000000',
          type: 'Góp ý',
          message: detailedReport,
          status: 'done',
          response: 'Đã tiếp nhận và tổng hợp vào cơ sở dữ liệu Khảo sát sự hài lòng nội trú định kỳ của bệnh viện.',
          resolvedAt: now.toISOString(),
        },
        overrideAccess: true,
      })
    } catch (fbErr) {
      console.warn('Could not save to feedback:', fbErr)
    }

    return NextResponse.json({
      ok: true,
      code,
      overallScore: Number(averageScore),
    })
  } catch (err: any) {
    console.error('API INPATIENT SURVEY ERROR:', err)
    return NextResponse.json({ error: 'Không thể xử lý phiếu khảo sát. Vui lòng thử lại sau.' }, { status: 500 })
  }
}
