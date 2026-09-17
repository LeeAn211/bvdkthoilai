import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getCMS } from '@/lib/payload'
import { bodyIsTooLarge, rateLimit, verifyTurnstile } from '@/lib/request-security'

export async function POST(req: Request) {
  try {
    if (bodyIsTooLarge(req, 80_000)) {
      return NextResponse.json({ error: 'Dữ liệu khảo sát quá lớn.' }, { status: 413 })
    }

    const lim = rateLimit(req, 'staff-survey', 12, 15 * 60_000)
    if (!lim.allowed) {
      return NextResponse.json({ error: 'Đồng chí đã gửi nhiều lần. Vui lòng thử lại sau.' }, { status: 429 })
    }

    const body = await req.json()

    // Honeypot bot check
    if (body.website) {
      return NextResponse.json({ ok: true, code: 'KS-NV-OK' })
    }

    // Turnstile verification
    const verified = await verifyTurnstile(req, body['cf-turnstile-response'])
    if (!verified) {
      return NextResponse.json({ error: 'Không thể xác minh bảo mật. Vui lòng tải lại trang và thử lại.' }, { status: 403 })
    }

    const demographics = body.demographics || {}
    const ratings = body.ratings || {}
    const overallRating10 = Number(body.overallRating10) || 9
    const loyaltyIntent = String(body.loyaltyIntent || '').slice(0, 100)
    const suggestion = String(body.suggestion || '').trim().slice(0, 5000)

    // Tính điểm trung bình của 19 câu hỏi (thang 5)
    const scores = Object.values(ratings).map((v: any) => Number(v)).filter(n => n >= 1 && n <= 5)
    const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '5.00'

    // Tạo mã biên nhận định danh duy nhất (VD: KS-NVYT-2026-A1B2C3D4)
    const now = new Date()
    const code = `KS-NVYT-${now.getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`

    // Định dạng nội dung chi tiết để lưu trữ vào Feedback / FeedbackCases
    const feedbackSubject = `[Khảo sát Nhân viên y tế Mẫu 3 BYT] ĐTB: ${averageScore}/5★ | Điểm chung: ${overallRating10}/10`
    const detailedReport = [
      `PHIẾU KHẢO SÁT Ý KIẾN & SỰ HÀI LÒNG NHÂN VIÊN Y TẾ (MẪU SỐ 3 - BỘ Y TẾ)`,
      `--------------------------------------------------`,
      `Mã khảo sát: ${code}`,
      `Thời gian gửi: ${now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
      ``,
      `I. THÔNG TIN CHUNG CÁN BỘ / NHÂN VIÊN Y TẾ:`,
      `- Giới tính: ${demographics.gender || 'Chưa cung cấp'}`,
      `- Độ tuổi: ${demographics.ageGroup || 'Chưa cung cấp'}`,
      `- Vị trí / Chuyên môn: ${demographics.position || 'Chưa cung cấp'}`,
      `- Khối đơn vị: ${demographics.unitType || 'Chưa cung cấp'}`,
      `- Thâm niên công tác: ${demographics.yearsOfExperience || 'Chưa cung cấp'}`,
      `- Khoa/Phòng: ${demographics.department || 'Chưa cung cấp'}`,
      ``,
      `II. KẾT QUẢ ĐÁNH GIÁ 5 NHÓM TIÊU CHÍ (THANG ĐIỂM 1 - 5):`,
      `- Điểm trung bình 19 tiêu chí: ${averageScore} / 5.00`,
      ...Object.entries(ratings).map(([qId, score]) => `  • Tiêu chí [${qId}]: ${score}★`),
      ``,
      `III. ĐÁNH GIÁ TỔNG THỂ & KIẾN NGHỊ CẢI TIẾN:`,
      `- Điểm hài lòng chung: ${overallRating10} / 10 điểm`,
      `- Ý định gắn bó công tác: ${loyaltyIntent}`,
      `- Đề xuất / Kiến nghị: ${suggestion || '(Không có ý kiến thêm)'}`,
    ].join('\n')

    const payload = await getCMS()

    // 1. Lưu vào feedbackCases
    try {
      await payload.create({
        collection: 'feedbackCases',
        data: {
          code,
          name: `Nhân viên y tế (${demographics.position || 'Cán bộ'}, ${demographics.department || 'Nội bộ'})`,
          phone: '0000000000', // Đánh dấu ẩn danh nội bộ
          subject: feedbackSubject,
          message: detailedReport,
          status: 'resolved',
          priority: 'normal',
          allowContact: false,
          publicResponse: 'Ban Giám đốc Bệnh viện Đa khoa Khu vực Thới Lai xin ghi nhận những đóng góp thẳng thắn, trách nhiệm của Quý đồng nghiệp. Các ý kiến sẽ được đưa vào chương trình nghị sự công đoàn và kế hoạch cải tiến môi trường làm việc của bệnh viện.',
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
          name: `Nhân viên y tế (${demographics.position || 'Cán bộ'})`,
          phone: '0000000000',
          type: 'Góp ý',
          message: detailedReport,
          status: 'done',
          response: 'Đã tiếp nhận và tổng hợp vào cơ sở dữ liệu Khảo sát sự hài lòng nhân viên y tế hàng năm của bệnh viện.',
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
    console.error('API STAFF SURVEY ERROR:', err)
    return NextResponse.json({ error: 'Không thể xử lý phiếu khảo sát. Vui lòng thử lại sau.' }, { status: 500 })
  }
}
