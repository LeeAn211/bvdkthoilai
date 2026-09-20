import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator < 1) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const { Client } = pg
const client = new Client({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL })

const SAMPLE_FEEDBACKS = [
  {
    code: 'GY-2026-TL001',
    name: 'Trần Văn Minh',
    phone: '0918123456',
    email: 'tranvanminh@gmail.com',
    type: 'Góp ý',
    message: 'Kính gửi Ban Giám đốc Bệnh viện Đa khoa Khu vực Thới Lai. Tôi đưa người nhà đi khám bệnh BHYT vào sáng thứ Hai. Quy trình lấy số tự động rất nhanh, bác sĩ phòng khám Nội tư vấn tận tình. Tuy nhiên khu vực ghế chờ tại quầy phát thuốc BHYT vào khoảng 09:30 - 10:30 khá đông, mong bệnh viện bố trí thêm quạt gió hoặc máy làm mát để người bệnh cao tuổi ngồi chờ được thoải mái hơn. Xin cảm ơn.',
    status: 'done',
    response: 'Kính gửi ông Trần Văn Minh,\n\nBệnh viện Đa khoa Khu vực Thới Lai xin chân thành cảm ơn ý kiến đóng góp quý báu của ông. Ban Giám đốc đã trực tiếp chỉ đạo Phòng Hành chính quản trị và Khoa Dược khảo sát ngay trong tuần, hiện đã lắp đặt bổ sung thêm 02 quạt công nghiệp công suất lớn tại khu vực chờ phát thuốc BHYT để đảm bảo không gian thoáng mát cho người bệnh.\n\nKính chúc ông và gia đình luôn dồi dào sức khỏe!\nTrân trọng.',
    resolutionNote: 'Đã hoàn tất lắp đặt bổ sung 02 quạt gió tại sảnh phát thuốc BHYT theo chỉ đạo của BGĐ ngày 18/09/2026.',
    subject: 'Góp ý về khu vực ghế chờ tại quầy phát thuốc BHYT',
  },
  {
    code: 'GY-2026-TL002',
    name: 'Lê Thị Thu Thảo',
    phone: '0987654321',
    email: 'thuthao.le@gmail.com',
    type: 'Khen ngợi',
    message: 'Tôi xin gửi lời cảm ơn sâu sắc đến ê-kíp trực cấp cứu và các bác sĩ, điều dưỡng Khoa Ngoại tổng hợp đã kịp thời phẫu thuật và chăm sóc tận tâm cho mẹ tôi trong đợt điều trị viêm ruột thừa vừa qua. Tinh thần thái độ phục vụ rất ân cần, buồng bệnh sạch sẽ, chu đáo.',
    status: 'done',
    response: 'Kính gửi bà Lê Thị Thu Thảo,\n\nBan Giám đốc Bệnh viện Đa khoa Khu vực Thới Lai rất xúc động và trân trọng những lời động viên, khen ngợi của bà dành cho tập thể y bác sĩ Khoa Cấp cứu và Khoa Ngoại. Thư khen của bà đã được biểu dương tại buổi giao ban toàn viện sáng nay nhằm tiếp tục nhân rộng tinh thần y đức và văn hóa phục vụ người bệnh.\n\nKính chúc bà và gia đình thật nhiều sức khỏe, an khang thịnh vượng!',
    resolutionNote: 'Đã biểu dương ê-kíp trực Khoa Cấp cứu và Khoa Ngoại tại buổi giao ban sáng thứ Hai.',
    subject: 'Khen ngợi tinh thần phục vụ của ê-kíp Khoa Cấp cứu và Khoa Ngoại',
  },
  {
    code: 'GY-2026-TL003',
    name: 'Phạm Hoàng Nam',
    phone: '0909112233',
    email: 'hoangnam.pham@yahoo.com',
    type: 'Góp ý',
    message: 'Đề nghị bệnh viện tích hợp thêm việc đặt số thứ tự khám trực tuyến qua ứng dụng trên điện thoại để người dân ở các xã xa như Trường Xuân, Đông Thuận chủ động thời gian đi lại, không cần phải đến quá sớm để bấm máy.',
    status: 'processing',
    response: 'Kính gửi ông Phạm Hoàng Nam,\n\nBệnh viện đã tiếp nhận ý kiến của ông. Hiện tại Bệnh viện đang triển khai liên kết hệ thống Đặt lịch khám trực tuyến qua ứng dụng Medpro và cổng dịch vụ công. Bộ phận Công nghệ thông tin đang tích hợp kỹ thuật thử nghiệm và dự kiến sẽ chính thức vận hành rộng rãi cho toàn thể người dân trong Quý IV/2026.',
    resolutionNote: 'Chuyển Tổ CNTT & Phòng Kế hoạch tổng hợp phối hợp Medpro hoàn thiện kết nối API đặt số trước.',
    subject: 'Đề xuất đặt số thứ tự khám trực tuyến qua ứng dụng điện thoại',
  },
]

async function seed() {
  await client.connect()
  console.log('Đang kết nối PostgreSQL để điền hồ sơ mẫu cho Tra cứu phản ánh...')

  for (const item of SAMPLE_FEEDBACKS) {
    // 1. Chèn hoặc cập nhật vào bảng feedback
    const checkFb = await client.query('SELECT id FROM public."feedback" WHERE "code" = $1;', [item.code])
    let fbId
    if (checkFb.rowCount === 0) {
      const fbIns = await client.query(`
        INSERT INTO public."feedback" (
          "code", "name", "phone", "email", "type", "message", "status", "response", "resolution_note", "resolved_at", "created_at", "updated_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
        RETURNING id;
      `, [
        item.code,
        item.name,
        item.phone,
        item.email,
        item.type,
        item.message,
        item.status,
        item.response,
        item.resolutionNote,
      ])
      fbId = fbIns.rows[0].id
    } else {
      fbId = checkFb.rows[0].id
      await client.query(`
        UPDATE public."feedback" SET
          "name" = $1, "phone" = $2, "email" = $3, "type" = $4, "message" = $5,
          "status" = $6, "response" = $7, "resolution_note" = $8, "resolved_at" = NOW(), "updated_at" = NOW()
        WHERE "id" = $9;
      `, [
        item.name, item.phone, item.email, item.type, item.message,
        item.status, item.response, item.resolutionNote, fbId
      ])
    }

    // 2. Chèn hoặc cập nhật vào bảng feedback_cases
    const checkCase = await client.query('SELECT id FROM public."feedback_cases" WHERE "code" = $1;', [item.code])
    let caseId
    const mappedCaseStatus = item.status === 'done' ? 'resolved' : item.status === 'processing' ? 'processing' : 'new'
    if (checkCase.rowCount === 0) {
      const caseIns = await client.query(`
        INSERT INTO public."feedback_cases" (
          "code", "name", "phone", "email", "subject", "message", "status", "priority", "allow_contact", "public_response", "closed_at", "created_at", "updated_at"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'normal', true, $8, NOW(), NOW(), NOW())
        RETURNING id;
      `, [
        item.code,
        item.name,
        item.phone,
        item.email,
        item.subject,
        item.message,
        mappedCaseStatus,
        item.response,
      ])
      caseId = caseIns.rows[0].id
    } else {
      caseId = checkCase.rows[0].id
      await client.query(`
        UPDATE public."feedback_cases" SET
          "name" = $1, "phone" = $2, "email" = $3, "subject" = $4, "message" = $5,
          "status" = $6, "public_response" = $7, "updated_at" = NOW()
        WHERE "id" = $8;
      `, [
        item.name, item.phone, item.email, item.subject, item.message,
        mappedCaseStatus, item.response, caseId
      ])
    }

    // 3. Chèn các mốc dòng thời gian vào feedback_actions
    await client.query('DELETE FROM public."feedback_actions" WHERE "case_id" = $1;', [caseId])
    
    // Mốc 1: Tiếp nhận
    await client.query(`
      INSERT INTO public."feedback_actions" (
        "case_id", "action", "note", "public", "created_at", "updated_at"
      ) VALUES ($1, 'received', 'Hệ thống website ghi nhận ý kiến phản ánh thành công.', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');
    `, [caseId])

    // Mốc 2: Phân công xác minh
    if (item.status === 'processing' || item.status === 'done') {
      await client.query(`
        INSERT INTO public."feedback_actions" (
          "case_id", "action", "note", "from_status", "to_status", "public", "created_at", "updated_at"
        ) VALUES ($1, 'assigned', 'Ban Giám đốc chuyển thông tin đến khoa/phòng liên quan xác minh & xử lý.', 'new', 'processing', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');
      `, [caseId])
    }

    // Mốc 3: Phản hồi chính thức
    if (item.status === 'done') {
      await client.query(`
        INSERT INTO public."feedback_actions" (
          "case_id", "action", "note", "from_status", "to_status", "public", "created_at", "updated_at"
        ) VALUES ($1, 'response', 'Bệnh viện Đa khoa Khu vực Thới Lai đã hoàn tất xác minh và gửi phản hồi chính thức.', 'processing', 'resolved', true, NOW(), NOW());
      `, [caseId])
    }
  }

  console.log('✓ Đã điền sẵn đầy đủ các hồ sơ mẫu thực tế cho chức năng Tra cứu phản ánh!')
  await client.end()
}

seed().catch(err => {
  console.error('Lỗi nạp dữ liệu tra cứu phản ánh:', err)
  process.exit(1)
})
