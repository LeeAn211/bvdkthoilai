import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get('image') as File | null
    const customApiKey = (formData.get('apiKey') as string || '').trim()

    if (!imageFile) {
      return NextResponse.json({ error: 'Vui lòng chọn hoặc tải lên ảnh chụp lịch trực.' }, { status: 400 })
    }

    // Lấy API key từ request, hoặc .env, hoặc từ Cấu hình lịch trong Payload
    let apiKey = customApiKey || process.env.GEMINI_API_KEY || ''
    if (!apiKey) {
      try {
        const payload = await getPayload({ config })
        const schedSettings: any = await payload.findGlobal({ slug: 'schedule-settings' }).catch(() => null)
        apiKey = schedSettings?.geminiApiKey || ''
      } catch (err) {
        console.warn('Không thể đọc geminiApiKey từ schedule-settings:', err)
      }
    }

    if (!apiKey) {
      return NextResponse.json({
        error: 'Chưa cấu hình Google Gemini API Key. Bạn có thể nhập trực tiếp API Key vào ô cấu hình hoặc liên hệ quản trị hệ thống.'
      }, { status: 400 })
    }

    // Chuyển file sang Base64
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const base64Image = buffer.toString('base64')
    const mimeType = imageFile.type || 'image/jpeg'

    // System prompt chuyên dụng cho ma trận lịch trực bệnh viện Việt Nam
    const prompt = `
Bạn là chuyên gia OCR và xử lý văn bản y tế cho bệnh viện Việt Nam.
Nhiệm vụ của bạn là phân tích bức ảnh LỊCH TRỰC TUẦN / MA TRẬN PHÂN CÔNG TRỰC BỆNH VIỆN và trích xuất dữ liệu thành định dạng JSON chuẩn.

QUY TẮC PHÂN TÍCH:
1. Xác định Tiêu đề lịch (VD: "LỊCH TRỰC BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI" hoặc tương đương).
2. Xác định Thời gian tuần: "Từ ngày DD/MM/YYYY đến ngày DD/MM/YYYY". Trả về emergencyWeekStart và emergencyWeekEnd dạng YYYY-MM-DD.
3. Nhận diện các cột ngày từ Thứ Hai đến Chủ Nhật:
   - day2: Thứ Hai
   - day3: Thứ Ba
   - day4: Thứ Tư
   - day5: Thứ Năm
   - day6: Thứ Sáu
   - day7: Thứ Bảy
   - day8: Chủ Nhật
4. Nhận diện từng dòng Khoa / Bộ phận (deptName), Vai trò / Loại nhân sự (subRole) và phân loại deptType:
   - Lãnh đạo trực ngày: deptName: "LÃNH ĐẠO", subRole: "LÃNH ĐẠO", deptType: "leader"
   - Cấp cứu tổng hợp - Bác sĩ: deptName: "CẤP CỨU TỔNG HỢP", subRole: "BÁC SĨ", deptType: "clinical"
   - Cấp cứu tổng hợp - Điều dưỡng: deptName: "CẤP CỨU TỔNG HỢP", subRole: "ĐIỀU DƯỠNG", deptType: "clinical"
   - Các khoa Sản, Nội - Nhi, Dược, Cận lâm sàng, X-Quang, Tài xế, Viện phí, Điện nước... Trích xuất chính xác tên bác sĩ / nhân viên trực từng ngày. Nếu 1 ô có nhiều tên (mỗi người 1 dòng hoặc cách nhau bởi dấu phẩy/chấm), nối các tên bằng ký tự xuống dòng '\\n'.
5. Nhận diện dòng "THƯỜNG TRỰC LÃNH ĐẠO" (nếu có, VD: "Bs Trần Quốc Luận (Thường trực 24/7, ĐT: 0943.068.189)"): đưa thông tin này vào "generalNote" hoặc "fixedStaff" của dòng Lãnh đạo.
6. Nhận diện danh bạ điện thoại ở phía dưới (nếu có):
   - Tên bộ phận/cá nhân, số điện thoại, type ('internal' nếu là tài xế/điện nước/bảo vệ/nội bộ, 'emergency_unit' nếu là bệnh viện tuyến trên như Đa khoa TW, Nhi Đồng...).

ĐỊNH DẠNG JSON BẮT BUỘC TRẢ VỀ (CHỈ TRẢ VỀ JSON HỢP LỆ, KHÔNG KÈM TEXT GIẢI THÍCH):
{
  "title": "Lịch trực Bệnh viện ...",
  "emergencyWeekStart": "YYYY-MM-DD",
  "emergencyWeekEnd": "YYYY-MM-DD",
  "weekLabel": "Từ ngày ... đến ngày ...",
  "generalNote": "...",
  "slots": [
    {
      "deptName": "Tên Khoa/Phòng",
      "subRole": "BÁC SĨ / ĐIỀU DƯỠNG / ...",
      "deptType": "clinical | leader | paraclinical | admin",
      "day2": "Tên nhân sự trực Thứ 2 (xuống dòng nếu nhiều người)",
      "day3": "Tên nhân sự trực Thứ 3",
      "day4": "Tên nhân sự trực Thứ 4",
      "day5": "Tên nhân sự trực Thứ 5",
      "day6": "Tên nhân sự trực Thứ 6",
      "day7": "Tên nhân sự trực Thứ 7",
      "day8": "Tên nhân sự trực Chủ Nhật",
      "fixedStaff": "",
      "note": ""
    }
  ],
  "contacts": [
    {
      "name": "Hiện (Tài xế)",
      "phone": "0798.010.703",
      "type": "internal",
      "note": ""
    }
  ]
}
`

    // Danh sách các model theo thứ tự ưu tiên (đã test 200 OK trên tài khoản của bạn)
    const CANDIDATE_MODELS = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ]

    const payloadBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1,
      },
    }

    let geminiRes: Response | null = null
    let lastErrorText = ''

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadBody),
        })

        if (res.ok) {
          geminiRes = res
          break
        } else {
          lastErrorText = await res.text()
          console.warn(`Model ${modelName} thất bại (${res.status}): ${lastErrorText.slice(0, 150)}`)
        }
      } catch (err: any) {
        lastErrorText = err?.message || String(err)
        console.warn(`Lỗi khi gọi model ${modelName}:`, err)
      }
    }

    if (!geminiRes) {
      console.error('Tất cả models Gemini đều không phản hồi thành công:', lastErrorText)
      return NextResponse.json({
        error: `Lỗi kết nối Gemini API: ${lastErrorText.slice(0, 250)}...`
      }, { status: 502 })
    }

    const resJson = await geminiRes.json()
    const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!rawText) {
      return NextResponse.json({ error: 'AI không trả về kết quả nhận diện nào.' }, { status: 500 })
    }

    // Làm sạch markdown nếu có ```json ... ```
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsedData = JSON.parse(cleanJson)

    return NextResponse.json({
      success: true,
      data: parsedData,
    })

  } catch (error: any) {
    console.error('OCR Error:', error)
    return NextResponse.json({
      error: error?.message || 'Có lỗi xảy ra trong quá trình quét ảnh lịch trực.'
    }, { status: 500 })
  }
}
