import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
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

const FLOW_DATA = [
  {
    id: 'bhyt',
    label: 'Khám bệnh BHYT',
    badgeText: 'ĐÚNG TUYẾN & THÔNG TUYẾN TOÀN QUỐC',
    title: 'Quy trình Khám chữa bệnh có thẻ Bảo hiểm Y tế (BHYT)',
    summary:
      'Áp dụng cho người bệnh có thẻ BHYT (hoặc ứng dụng VssID / VNeID mức 2 tích hợp thẻ BHYT). Bệnh viện Đa khoa Khu vực Thới Lai tiếp nhận thông tuyến huyện trên phạm vi toàn quốc theo đúng chính sách của Bộ Y tế.',
    steps: [
      {
        step: 1,
        title: 'Lấy số thứ tự & Tiếp đón ban đầu',
        location: 'Khu tiếp đón bệnh nhân – Tầng 1, Khoa Khám bệnh',
        timeEstimate: '3 – 5 phút',
        desc: 'Người bệnh đến sảnh khoa khám bệnh, lấy số thứ tự tự động tại cây phát số hoặc nhận sự hướng dẫn trực tiếp từ nhân viên Tổ Chăm sóc khách hàng.',
        actions: [
          'Bấm máy lấy số thứ tự theo diện Khám BHYT.',
          'Người cao tuổi (trên 75 tuổi), trẻ em dưới 6 tuổi, phụ nữ mang thai và người khuyết tật được cấp số ưu tiên.',
          'Ngồi chờ tại ghế chờ sảnh tiếp đón, quan sát bảng điện tử gọi số.',
        ].join('\n'),
        note: 'Có thể sử dụng Căn cước công dân gắn chip để quét mã tự động lấy số nhanh chóng.',
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 2,
        title: 'Đăng ký thông tin & Xuất trình thẻ BHYT',
        location: 'Quầy tiếp nhận BHYT (Cửa số 1 – 4)',
        timeEstimate: '5 – 7 phút',
        desc: 'Khi bảng điện tử báo đến lượt, người bệnh đến quầy tiếp nhận để kiểm tra thẻ BHYT và phân buồng khám chuyên khoa.',
        actions: [
          'Xuất trình CCCD gắn chip (hoặc thẻ BHYT giấy + giấy tờ tùy thân có ảnh, hoặc VssID / VNeID).',
          'Nộp giấy chuyển tuyến BHYT (nếu có trường hợp chuyển tuyến theo quy định).',
          'Nhân viên y tế nhập thông tin, đo sinh hiệu cơ bản (huyết áp, nhiệt độ) và cấp Phiếu khám có số phòng & số thứ tự vào phòng khám.',
        ].join('\n'),
        note: 'Người bệnh giữ cẩn thận Phiếu khám bệnh và giấy tờ tùy thân để đối chiếu tại phòng khám.',
        isHighlight: true,
        isEmergency: false,
      },
      {
        step: 3,
        title: 'Bác sĩ thăm khám lâm sàng',
        location: 'Phòng khám chuyên khoa ghi trên phiếu khám',
        timeEstimate: '10 – 15 phút',
        desc: 'Người bệnh di chuyển đến trước phòng khám chuyên khoa tương ứng, chờ gọi tên theo số thứ tự hiển thị trên màn hình trước cửa phòng.',
        actions: [
          'Bác sĩ thăm khám, hỏi tiền sử bệnh tật, chẩn đoán ban đầu.',
          'Nếu bệnh nhẹ không cần xét nghiệm: Bác sĩ kê đơn thuốc điều trị ngoại trú.',
          'Nếu cần cận lâm sàng: Bác sĩ in Phiếu chỉ định (Xét nghiệm máu, nước tiểu, X-quang, Siêu âm, Điện tim...).',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 4,
        title: 'Thực hiện Cận lâm sàng (nếu có chỉ định)',
        location: 'Khoa Cận lâm sàng & Chẩn đoán hình ảnh',
        timeEstimate: '20 – 45 phút (tùy dịch vụ)',
        desc: 'Người bệnh cầm phiếu chỉ định đến khu vực cận lâm sàng để lấy mẫu xét nghiệm hoặc chụp chiếu hình ảnh.',
        actions: [
          'Nộp phiếu tại Bàn tiếp nhận cận lâm sàng để lấy số thứ tự kỹ thuật.',
          'Lấy mẫu máu/nước tiểu tại phòng Xét nghiệm (nhịn ăn sáng nếu có xét nghiệm đường huyết, mỡ máu).',
          'Thực hiện Chụp X-Quang, Siêu âm ổ bụng/tim mạch, Đo điện tim theo hướng dẫn của kỹ thuật viên.',
          'Ngồi chờ kết quả tại khu vực ghế chờ. Kết quả xét nghiệm và hình ảnh sẽ được liên thông tự động về máy tính của Bác sĩ khám.',
        ].join('\n'),
        note: 'Người bệnh không cần tự lấy kết quả giấy (trừ phim X-Quang), hệ thống mạng nội bộ viện sẽ gửi trực tiếp đến phòng khám ban đầu.',
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 5,
        title: 'Bác sĩ kết luận & Tư vấn điều trị',
        location: 'Trở lại Phòng khám ban đầu (Bước 3)',
        timeEstimate: '5 – 10 phút',
        desc: 'Sau khi có đầy đủ kết quả cận lâm sàng, người bệnh quay lại phòng khám ban đầu để bác sĩ hội chẩn và ra phác đồ điều trị.',
        actions: [
          'Bác sĩ đọc kết quả cận lâm sàng, giải thích tình trạng bệnh cho người bệnh và người nhà.',
          'Kê đơn thuốc điều trị ngoại trú và hẹn ngày tái khám.',
          'Hoặc chỉ định làm thủ tục Nhập viện điều trị nội trú nếu tình trạng bệnh cần theo dõi chuyên sâu.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 6,
        title: 'Thanh toán viện phí & Đồng chi trả BHYT',
        location: 'Quầy Thu viện phí – Khoa Khám bệnh',
        timeEstimate: '5 phút',
        desc: 'Người bệnh nộp phiếu thanh toán để đối soát chi phí BHYT và thanh toán phần đồng chi trả (nếu có).',
        actions: [
          'Nhân viên viện phí in Bảng kê chi phí khám chữa bệnh theo mẫu 01/BV của Bộ Y tế.',
          'Người bệnh kiểm tra các mục chi phí và thanh toán phần tiền chênh lệch (nếu có).',
          'Nhận lại Thẻ BHYT, CCCD và biên lai thu tiền điện tử.',
        ].join('\n'),
        note: 'Bệnh viện chấp nhận thanh toán không dùng tiền mặt (Quét mã VietQR, Chuyển khoản, Thẻ ngân hàng).',
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 7,
        title: 'Lĩnh thuốc BHYT & Ra về',
        location: 'Khoa Dược – Quầy Phát thuốc Ngoại trú BHYT',
        timeEstimate: '5 – 10 phút',
        desc: 'Người bệnh nộp đơn thuốc đã thanh toán tại quầy phát thuốc BHYT để nhận thuốc và nghe hướng dẫn sử dụng.',
        actions: [
          'Nộp đơn thuốc vào rổ tiếp nhận và chờ gọi tên.',
          'Dược sĩ kiểm tra đơn thuốc, cấp phát đầy đủ thuốc theo danh mục BHYT.',
          'Dược sĩ hướng dẫn cẩn thận liều dùng, thời điểm uống thuốc và những kiêng cữ cần thiết.',
          'Người bệnh kiểm tra lại số lượng thuốc trước khi rời quầy và hoàn tất quy trình khám.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
    ],
  },
  {
    id: 'dich-vu',
    label: 'Khám Thu phí / Dịch vụ',
    badgeText: 'NHANH CHÓNG & TIỆN ÍCH',
    title: 'Quy trình Khám bệnh Thu phí (Viện phí / Không BHYT)',
    summary:
      'Dành cho người dân không tham gia BHYT, người có nhu cầu khám theo yêu cầu chuyên gia, khám kiểm tra sức khỏe tổng quát định kỳ hoặc người khám vượt tuyến không xuất trình BHYT.',
    steps: [
      {
        step: 1,
        title: 'Tiếp đón & Đăng ký khám Dịch vụ',
        location: 'Quầy tiếp nhận Khám Dịch vụ & Thu viện phí',
        timeEstimate: '3 – 5 phút',
        desc: 'Người bệnh đến quầy tiếp đón dịch vụ, nêu rõ nhu cầu khám chuyên khoa hoặc khám sức khỏe tổng quát.',
        actions: [
          'Cung cấp thông tin cá nhân (Họ tên, ngày sinh, số điện thoại, CCCD).',
          'Đăng ký chuyên khoa mong muốn (Nội, Ngoại, Sản, Nhi, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Y học cổ truyền...).',
          'Tạm ứng tiền công khám theo bảng giá niêm yết công khai của bệnh viện.',
          'Nhận Phiếu khám dịch vụ có số phòng và số thứ tự.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 2,
        title: 'Khám chuyên khoa & Tư vấn',
        location: 'Phòng khám Chuyên khoa theo phiếu',
        timeEstimate: '10 – 15 phút',
        desc: 'Bác sĩ chuyên khoa thăm khám trực tiếp, tư vấn gói cận lâm sàng phù hợp với tình trạng sức khỏe.',
        actions: [
          'Bác sĩ thăm khám cẩn thận, lắng nghe các triệu chứng và nhu cầu kiểm tra.',
          'Chỉ định các xét nghiệm hoặc chẩn đoán hình ảnh cần thiết, giải thích rõ mục đích và chi phí dự kiến.',
        ].join('\n'),
        isHighlight: true,
        isEmergency: false,
      },
      {
        step: 3,
        title: 'Nộp phí Cận lâm sàng',
        location: 'Quầy Thu ngân Ngoại trú',
        timeEstimate: '3 – 5 phút',
        desc: 'Người bệnh mang phiếu chỉ định đến quầy thu ngân để thanh toán phí cận lâm sàng trước khi thực hiện.',
        actions: [
          'Thu ngân in phiếu thu tiền theo bảng giá dịch vụ niêm yết.',
          'Hỗ trợ thanh toán nhanh bằng tiền mặt hoặc quét mã QR qua các ứng dụng ngân hàng.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 4,
        title: 'Thực hiện Xét nghiệm & Chẩn đoán hình ảnh',
        location: 'Khu Kỹ thuật Cận lâm sàng',
        timeEstimate: '20 – 40 phút',
        desc: 'Được ưu tiên điều hướng thực hiện cận lâm sàng nhanh chóng, giảm thiểu tối đa thời gian chờ đợi.',
        actions: [
          'Lấy máu, nước tiểu, đo điện tim, siêu âm màu, chụp X-quang kỹ thuật số.',
          'Nhân viên y tế hướng dẫn chi tiết thứ tự phòng chụp và thời gian trả kết quả.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 5,
        title: 'Kết luận điều trị & Kê đơn thuốc',
        location: 'Phòng khám chuyên khoa ban đầu',
        timeEstimate: '10 phút',
        desc: 'Bác sĩ phân tích kết quả cận lâm sàng, đưa ra chẩn đoán xác định và kê đơn thuốc điều trị.',
        actions: [
          'Tư vấn chế độ dinh dưỡng, sinh hoạt, tập luyện phục hồi.',
          'Kê đơn thuốc ngoại trú hoặc chỉ định nhập viện theo yêu cầu nếu cần.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 6,
        title: 'Mua thuốc tại Nhà thuốc Bệnh viện & Ra về',
        location: 'Nhà thuốc GPP Bệnh viện Đa khoa Khu vực Thới Lai',
        timeEstimate: '5 – 10 phút',
        desc: 'Người bệnh mua thuốc theo đơn tại nhà thuốc đạt chuẩn GPP của bệnh viện, đảm bảo thuốc chính hãng, nguồn gốc rõ ràng và giá đúng quy định.',
        actions: [
          'Dược sĩ đối chiếu đơn thuốc, kiểm tra hạn sử dụng và đóng gói thuốc cẩn thận.',
          'Hướng dẫn chi tiết cách bảo quản và cách dùng thuốc hiệu quả.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
    ],
  },
  {
    id: 'cap-cuu',
    label: 'Cấp cứu 24/24',
    badgeText: 'TIẾP NHẬN LIÊN TỤC 24/7/365',
    title: 'Quy trình Tiếp nhận & Xử trí Cấp cứu 24/24',
    summary:
      'Khoa Cấp cứu tiếp nhận người bệnh trong mọi tình trạng khẩn cấp vào bất kỳ thời điểm nào trong ngày. ƯU TIÊN HÀNG ĐẦU LÀ CỨU CHỮA TÍNH MẠNG NGƯỜI BỆNH, các thủ tục hành chính được hoàn tất sau.',
    steps: [
      {
        step: 1,
        title: 'Tiếp nhận khẩn cấp & Phân loại bệnh nhân (Triage)',
        location: 'Sảnh Khoa Cấp cứu – Cổng Cấp cứu 24/24',
        timeEstimate: 'NGAY TẬP TỨC (< 1 phút)',
        desc: 'Người bệnh được kíp trực cấp cứu tiếp nhận ngay khi đến viện bằng xe cứu thương hoặc phương tiện cá nhân.',
        actions: [
          'Điều dưỡng và Bác sĩ đo sinh hiệu, đánh giá mức độ nguy kịch (Đỏ: Nguy kịch đe dọa tính mạng; Vàng: Nặng cần cấp cứu khẩn; Xanh: Ổn định).',
          'Đưa ngay người bệnh nguy kịch vào Phòng Hồi sức Cấp cứu chống sốc.',
        ].join('\n'),
        isHighlight: true,
        isEmergency: true,
      },
      {
        step: 2,
        title: 'Hồi sức, Khám & Xử trí Cấp cứu ban đầu',
        location: 'Phòng Hồi sức – Cấp cứu',
        timeEstimate: 'Xử trí khẩn trương',
        desc: 'Kíp cấp cứu tiến hành ngay các biện pháp can thiệp y tế để bảo vệ đường thở, tuần hoàn và ổn định sinh hiệu.',
        actions: [
          'Thở oxy, đặt nội khí quản, ép tim ngoài lồng ngực (nếu ngừng thở/ngừng tim).',
          'Thiết lập đường truyền tĩnh mạch, dùng thuốc cấp cứu khẩn cấp.',
          'Băng bó, cầm máu, cố định nẹp nếu có chấn thương, gãy xương.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: true,
      },
      {
        step: 3,
        title: 'Làm thủ tục hành chính (Người nhà bệnh nhân thực hiện)',
        location: 'Bàn tiếp đón Khoa Cấp cứu',
        timeEstimate: 'Thực hiện song song',
        desc: 'Trong lúc bác sĩ đang cấp cứu người bệnh, người nhà đi cùng sẽ cung cấp thông tin và nộp giấy tờ BHYT/CCCD.',
        actions: [
          'Nộp thẻ BHYT, CCCD hoặc ứng dụng định danh điện tử.',
          'Khai báo tiền sử bệnh tật, dị ứng thuốc, nguyên nhân tai nạn/ngộ độc cho nhân viên y tế ghi nhận.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 4,
        title: 'Thực hiện Cận lâm sàng Cấp cứu tại giường hoặc tại khoa',
        location: 'Tại Khoa Cấp cứu / Khoa Chẩn đoán hình ảnh',
        timeEstimate: 'Ưu tiên khẩn cấp',
        desc: 'Kỹ thuật viên xét nghiệm và chẩn đoán hình ảnh phục vụ ngay tại khoa hoặc ưu tiên máy chụp chiếu cao nhất.',
        actions: [
          'Xét nghiệm máu khẩn (khí máu, đông máu, men tim, đường huyết cấp...).',
          'Chụp X-quang cấp cứu tại giường hoặc tại phòng chụp.',
          'Siêu âm cấp cứu FAST phát hiện tràn dịch, tràn máu màng tim/màng bụng.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
      {
        step: 5,
        title: 'Phân luồng điều trị chuyên sâu',
        location: 'Khoa Cấp cứu',
        timeEstimate: 'Sau khi ổn định bước đầu',
        desc: 'Tùy theo kết quả cấp cứu và chẩn đoán bệnh, Bác sĩ trưởng kíp trực quyết định hướng điều trị tiếp theo:',
        actions: [
          'Chuyển Khoa Hồi sức tích cực – Chống độc (ICU) nếu người bệnh cần thở máy, lọc máu, theo dõi liên tục.',
          'Chuyển phòng mổ cấp cứu (Phẫu thuật Ngoại khoa, Sản khoa khẩn cấp).',
          'Chuyển các khoa lâm sàng chuyên khoa (Nội, Ngoại, Nhi, Phụ sản) để điều trị nội trú.',
          'Chuyển tuyến trên an toàn (bằng xe cứu thương chuyên dụng có y bác sĩ đi kèm) nếu vượt quá khả năng chuyên môn kỹ thuật.',
          'Cho về điều trị ngoại trú nếu tình trạng hoàn toàn ổn định và được theo dõi an toàn.',
        ].join('\n'),
        isHighlight: false,
        isEmergency: false,
      },
    ],
  },
]

const CHECKLIST_ITEMS = [
  {
    title: 'Căn cước công dân (CCCD) gắn chip',
    desc: 'Bản gốc CCCD gắn chip của người bệnh hoặc tài khoản định danh điện tử VNeID mức độ 2 đã tích hợp thẻ BHYT.',
    icon: 'id',
  },
  {
    title: 'Thẻ Bảo hiểm Y tế (BHYT)',
    desc: 'Thẻ BHYT giấy còn hạn sử dụng hoặc ứng dụng VssID / VNeID hiển thị mã số và hình ảnh thẻ hợp lệ.',
    icon: 'card',
  },
  {
    title: 'Giấy hẹn tái khám / Chuyển tuyến',
    desc: 'Giấy hẹn khám lại của bệnh viện (nếu có) hoặc Giấy chuyển viện hợp lệ từ cơ sở y tế tuyến trước.',
    icon: 'file',
  },
  {
    title: 'Đơn thuốc & Hồ sơ bệnh cũ',
    desc: 'Các toa thuốc đang uống, sổ khám bệnh, phim chụp X-Quang, CT, MRI và các kết quả xét nghiệm gần nhất để bác sĩ đối chiếu.',
    icon: 'medical',
  },
]

const PRIORITY_GROUPS = [
  'Người bệnh trong tình trạng Cấp cứu khẩn cấp (Ưu tiên số 1)',
  'Trẻ em dưới 6 tuổi',
  'Người cao tuổi từ 75 tuổi trở lên',
  'Người khuyết tật nặng, suy kiệt',
  'Phụ nữ mang thai gần ngày sinh',
  'Người có công với cách mạng, Mẹ Việt Nam Anh hùng',
]

async function seed() {
  await client.connect()
  console.log('Đang kết nối PostgreSQL để điền dữ liệu mẫu cho Trang Quy trình khám bệnh...')

  // 1. Kiểm tra hoặc chèn bản ghi examination_flow_settings
  const check = await client.query('SELECT id FROM public."examination_flow_settings" LIMIT 1;')
  let efsId = 1
  if (check.rowCount === 0) {
    const insertRes = await client.query(`
      INSERT INTO public."examination_flow_settings" (
        "eyebrow", "title", "description",
        "show_notice_banner", "notice_title", "notice_content", "notice_align",
        "show_checklist", "show_priority", "show_support_banner",
        "content_block_enabled", "content_block_title", "content_block_subtitle", "content_block_text_align",
        "created_at", "updated_at"
      ) VALUES (
        'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
        'Quy trình Khám chữa bệnh',
        'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        true,
        'Lưu ý quan trọng khi đến khám tại Bệnh viện Đa khoa Khu vực Thới Lai',
        '• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến huyện được hưởng 100% quyền lợi chi trả theo quy định của Luật BHYT.\n• Bệnh viện tiếp nhận khám sớm từ 06:30 tại các khoa chuyên môn trọng điểm.\n• Người cao tuổi, phụ nữ mang thai và trẻ nhỏ được cấp số ưu tiên tiếp đón.',
        'left',
        true,
        true,
        true,
        true,
        'Nguyên tắc Tiếp đón & Quyền lợi Khám chữa bệnh BHYT Thông tuyến',
        'Chính sách thông tuyến khám chữa bệnh BHYT toàn quốc, ứng dụng Căn cước công dân gắn chip / VNeID mức 2 trong tiếp nhận bệnh nhân và quy chế chuyển tuyến tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        'left',
        NOW(), NOW()
      ) RETURNING id;
    `)
    efsId = insertRes.rows[0].id
  } else {
    efsId = check.rows[0].id
    // Cập nhật lại thông tin chung nếu cần
    await client.query(`
      UPDATE public."examination_flow_settings" SET
        "eyebrow" = 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
        "title" = 'Quy trình Khám chữa bệnh',
        "description" = 'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        "show_notice_banner" = true,
        "notice_title" = 'Lưu ý quan trọng khi đến khám tại Bệnh viện Đa khoa Khu vực Thới Lai',
        "notice_content" = '• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến huyện được hưởng 100% quyền lợi chi trả theo quy định của Luật BHYT.\n• Bệnh viện tiếp nhận khám sớm từ 06:30 tại các khoa chuyên môn trọng điểm.\n• Người cao tuổi, phụ nữ mang thai và trẻ nhỏ được cấp số ưu tiên tiếp đón.',
        "notice_align" = 'left',
        "show_checklist" = true,
        "show_priority" = true,
        "show_support_banner" = true,
        "content_block_enabled" = true,
        "content_block_title" = 'Nguyên tắc Tiếp đón & Quyền lợi Khám chữa bệnh BHYT Thông tuyến',
        "content_block_subtitle" = 'Chính sách thông tuyến khám chữa bệnh BHYT toàn quốc, ứng dụng Căn cước công dân gắn chip / VNeID mức 2 trong tiếp nhận bệnh nhân và quy chế chuyển tuyến tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        "content_block_text_align" = 'left',
        "updated_at" = NOW()
      WHERE "id" = $1;
    `, [efsId])
  }

  // 2. Điền Tabs & Steps vào examination_flow_settings_flow_tabs & examination_flow_settings_flow_tabs_steps
  // Đồng thời điền vào ef_tabs & ef_steps để tương thích tuyệt đối mọi truy vấn
  const tabTables = [
    { tabs: 'examination_flow_settings_flow_tabs', steps: 'examination_flow_settings_flow_tabs_steps' },
    { tabs: 'ef_tabs', steps: 'ef_steps' }
  ]

  for (const t of tabTables) {
    // Xóa dữ liệu cũ của bảng con nếu có
    await client.query(`DELETE FROM public."${t.steps}" WHERE "_parent_id" IN (SELECT "id" FROM public."${t.tabs}" WHERE "_parent_id" = $1);`, [efsId])
    await client.query(`DELETE FROM public."${t.tabs}" WHERE "_parent_id" = $1;`, [efsId])

    let tabOrder = 1
    for (const tab of FLOW_DATA) {
      const tabKey = `ef_tab_${tab.id}`
      await client.query(`
        INSERT INTO public."${t.tabs}" (
          "_order", "_parent_id", "id", "enabled", "label", "badge_text", "title", "summary"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT ("id") DO UPDATE SET
          "_order" = EXCLUDED."_order",
          "_parent_id" = EXCLUDED."_parent_id",
          "enabled" = EXCLUDED."enabled",
          "label" = EXCLUDED."label",
          "badge_text" = EXCLUDED."badge_text",
          "title" = EXCLUDED."title",
          "summary" = EXCLUDED."summary";
      `, [
        tabOrder++,
        efsId,
        tabKey,
        true,
        tab.label,
        tab.badgeText,
        tab.title,
        tab.summary
      ])

      let stepOrder = 1
      for (const step of tab.steps) {
        const stepKey = `ef_step_${tab.id}_${step.step}`
        await client.query(`
          INSERT INTO public."${t.steps}" (
            "_order", "_parent_id", "id", "enabled", "step", "title", "location", "time_estimate", "desc", "actions", "note", "is_highlight", "is_emergency"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT ("id") DO UPDATE SET
            "_order" = EXCLUDED."_order",
            "_parent_id" = EXCLUDED."_parent_id",
            "enabled" = EXCLUDED."enabled",
            "step" = EXCLUDED."step",
            "title" = EXCLUDED."title",
            "location" = EXCLUDED."location",
            "time_estimate" = EXCLUDED."time_estimate",
            "desc" = EXCLUDED."desc",
            "actions" = EXCLUDED."actions",
            "note" = EXCLUDED."note",
            "is_highlight" = EXCLUDED."is_highlight",
            "is_emergency" = EXCLUDED."is_emergency";
        `, [
          stepOrder++,
          tabKey,
          stepKey,
          true,
          step.step,
          step.title,
          step.location,
          step.timeEstimate,
          step.desc,
          step.actions,
          step.note || null,
          step.isHighlight,
          step.isEmergency
        ])
      }
    }
  }

  // 3. Điền Checklists vào examination_flow_settings_checklists & ef_checks
  const checkTables = ['examination_flow_settings_checklists', 'ef_checks']
  for (const tbl of checkTables) {
    await client.query(`DELETE FROM public."${tbl}" WHERE "_parent_id" = $1;`, [efsId])
    let chkOrder = 1
    for (const item of CHECKLIST_ITEMS) {
      const chkKey = `ef_chk_${chkOrder}`
      await client.query(`
        INSERT INTO public."${tbl}" (
          "_order", "_parent_id", "id", "enabled", "title", "desc", "icon"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT ("id") DO UPDATE SET
          "_order" = EXCLUDED."_order",
          "_parent_id" = EXCLUDED."_parent_id",
          "enabled" = EXCLUDED."enabled",
          "title" = EXCLUDED."title",
          "desc" = EXCLUDED."desc",
          "icon" = EXCLUDED."icon";
      `, [
        chkOrder++,
        efsId,
        chkKey,
        true,
        item.title,
        item.desc,
        item.icon
      ])
    }
  }

  // 4. Điền Priorities vào examination_flow_settings_priorities & ef_prios
  const prioTables = ['examination_flow_settings_priorities', 'ef_prios']
  for (const tbl of prioTables) {
    await client.query(`DELETE FROM public."${tbl}" WHERE "_parent_id" = $1;`, [efsId])
    let prioOrder = 1
    for (const text of PRIORITY_GROUPS) {
      const prioKey = `ef_prio_${prioOrder}`
      await client.query(`
        INSERT INTO public."${tbl}" (
          "_order", "_parent_id", "id", "enabled", "text"
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("id") DO UPDATE SET
          "_order" = EXCLUDED."_order",
          "_parent_id" = EXCLUDED."_parent_id",
          "enabled" = EXCLUDED."enabled",
          "text" = EXCLUDED."text";
      `, [
        prioOrder++,
        efsId,
        prioKey,
        true,
        text
      ])
    }
  }

  console.log('✓ Đã điền sẵn đầy đủ 100% nội dung mẫu vào CSDL cho Trang Quy trình khám bệnh!')
  await client.end()
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu mẫu:', err)
  process.exit(1)
})
