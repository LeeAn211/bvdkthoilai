'use client'

import { useState } from 'react'

interface FlowStep {
  step: number
  title: string
  location: string
  timeEstimate?: string
  desc: string
  actions?: string[]
  note?: string
  isHighlight?: boolean
  isEmergency?: boolean
}

interface FlowTab {
  id: string
  label: string
  badgeText: string
  title: string
  summary: string
  steps: FlowStep[]
}

const FLOW_DATA: FlowTab[] = [
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
        ],
        note: 'Có thể sử dụng Căn cước công dân gắn chip để quét mã tự động lấy số nhanh chóng.',
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
        ],
        note: 'Người bệnh giữ cẩn thận Phiếu khám bệnh và giấy tờ tùy thân để đối chiếu tại phòng khám.',
        isHighlight: true,
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
        ],
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
        ],
        note: 'Người bệnh không cần tự lấy kết quả giấy (trừ phim X-Quang), hệ thống mạng nội bộ viện sẽ gửi trực tiếp đến phòng khám ban đầu.',
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
        ],
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
        ],
        note: 'Bệnh viện chấp nhận thanh toán không dùng tiền mặt (Quét mã VietQR, Chuyển khoản, Thẻ ngân hàng).',
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
        ],
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
        ],
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
        ],
        isHighlight: true,
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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
        ],
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

export function ExaminationFlowView({
  medproUrl,
  hotline = '0292 3861 234',
  emergencyHotline = '0292 3861 115',
  settings = {},
}: {
  medproUrl: string
  hotline?: string
  emergencyHotline?: string
  settings?: any
}) {
  const [activeTabId, setActiveTabId] = useState('bhyt')

  const currentTab = FLOW_DATA.find((t) => t.id === activeTabId) || FLOW_DATA[0]
  const showChecklist = settings?.showChecklist !== false
  const showPriority = settings?.showPriority !== false
  const showSupportBanner = settings?.showSupportBanner !== false

  return (
    <div className="flowPageWrapper">
      {/* 1. THANH CHỌN QUY TRÌNH (TABS) */}
      <div className="flowTabNav" role="tablist">
        {FLOW_DATA.map((tab) => (
          <button
            type="button"
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            className={`flowTabBtn ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="flowTabCount">{tab.steps.length} bước</span>
          </button>
        ))}
      </div>

      {/* 2. KHỐI THÔNG TIN TÓM TẮT QUY TRÌNH ĐANG CHỌN */}
      <div className="flowIntroCard">
        <div className="flowIntroText">
          <h2>{currentTab.title}</h2>
          <p>{currentTab.summary}</p>
        </div>
        <div className="flowIntroBadge">
          <span>🛡️</span>
          <span>{currentTab.badgeText}</span>
        </div>
      </div>

      {/* 3. SƠ ĐỒ TIMELINE TỪNG BƯỚC KHÁM BỆNH */}
      <div className="flowTimeline">
        {currentTab.steps.map((s) => (
          <div
            className={`flowStepCard ${s.isHighlight ? 'highlightStep' : ''} ${s.isEmergency ? 'emergencyStep' : ''}`}
            key={s.step}
          >
            <div className="flowStepNumberWrap">
              <div className="flowStepNumber">{s.step}</div>
              {s.timeEstimate && <span className="flowStepTimeTag">⏱ {s.timeEstimate}</span>}
            </div>

            <div className="flowStepBody">
              <div className="flowStepHeader">
                <h3 className="flowStepTitle">{s.title}</h3>
                {s.location && (
                  <span className="flowStepLocationBadge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {s.location}
                  </span>
                )}
              </div>

              <p className="flowStepDesc">{s.desc}</p>

              {s.actions && s.actions.length > 0 && (
                <div className="flowSubActionList">
                  {s.actions.map((act, idx) => (
                    <div className="flowSubActionItem" key={idx}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              )}

              {s.note && (
                <div className="flowStepNote">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span><strong>Lưu ý:</strong> {s.note}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 4. KHỐI GIẤY TỜ CẦN CHUẨN BỊ (CHECKLIST) */}
      {showChecklist && (
        <section className="flowChecklistSection">
          <div className="checklistHeader">
            <span className="checklistEyebrow">HƯỚNG DẪN THỦ TỤC</span>
            <h3 className="checklistTitle">Các giấy tờ người bệnh cần chuẩn bị khi đến khám</h3>
          </div>

          <div className="checklistGrid">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <div className="checklistItemCard" key={idx}>
                <div className="checklistItemHead">
                  <div className="checkIconWrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 className="checklistItemTitle">{item.title}</h4>
                </div>
                <p className="checklistItemDesc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. KHỐI ĐỐI TƯỢNG ƯU TIÊN TIẾP ĐÓN */}
      {showPriority && (
        <div className="flowPrioritySection">
          <div className="priorityHeader">
            <span>⭐</span>
            <h3>Thứ tự đối tượng được Ưu tiên Tiếp đón & Khám trước theo quy định</h3>
          </div>
          <div className="priorityList">
            {PRIORITY_GROUPS.map((p, idx) => (
              <div className="priorityItem" key={idx}>
                <span>✓</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. BANNER LIÊN KẾT ĐẶT HẸN & ĐƯỜNG DÂY NÓNG */}
      {showSupportBanner && (
        <div className="flowSupportBanner">
          <div className="flowSupportContent">
            <h3>Chủ động Đặt lịch khám để tiết kiệm thời gian chờ đợi</h3>
            <p>
              Quý khách có thể đăng ký lịch khám bệnh tại cơ sở hoặc qua ứng dụng Medpro để được nhận số thứ tự và khung giờ khám ưu tiên tại Bệnh viện Đa khoa Khu vực Thới Lai.
            </p>
          </div>
          <div className="flowSupportActions">
            <a href="/dat-lich-kham" className="flowSupportBtn">
              <span>📅 Đặt lịch khám trực tuyến</span>
            </a>
            <a href={`tel:${emergencyHotline.replace(/\s+/g, '')}`} className="flowHotlineBtn">
              <span>🚨 Cấp cứu 24/24: {emergencyHotline}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
