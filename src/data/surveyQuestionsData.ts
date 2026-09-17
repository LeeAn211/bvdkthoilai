// Bộ câu hỏi khảo sát chuẩn Bộ Y tế - Tách riêng dạng dữ liệu thuần túy không chứa JSX/'use client'
// để an toàn dùng chung cho cả Server Components, API Route và Client Components.

export interface SurveySectionQuestion {
  id: string
  text: string
}

export interface SurveySection {
  code: string
  title: string
  desc: string
  questions: SurveySectionQuestion[]
}

// BỘ CÂU HỎI MẪU SỐ 2 - KHẢO SÁT HÀI LÒNG NGƯỜI BỆNH NGOẠI TRÚ (BỘ Y TẾ)
export const RAW_OUTPATIENT_SURVEY_SECTIONS: SurveySection[] = [
  {
    code: 'A',
    title: 'Phần A: Khả năng tiếp cận bệnh viện',
    desc: 'Đánh giá về biển báo chỉ dẫn, sơ đồ bệnh viện, thủ tục đăng ký khám và website tra cứu',
    questions: [
      { id: 'A1', text: 'Biển báo, sơ đồ chỉ dẫn đường đến các khoa/phòng và bàn tiếp đón rõ ràng, dễ tìm' },
      { id: 'A2', text: 'Thủ tục đăng ký khám bệnh (lấy số, tiếp đón, phân buồng khám) nhanh gọn, thuận tiện' },
      { id: 'A3', text: 'Nhân viên hướng dẫn niềm nở, chỉ dẫn người bệnh đến đúng phòng khám chuyên khoa' },
      { id: 'A4', text: 'Kênh tra cứu thông tin (Website, Fanpage, Tổng đài) đầy đủ và hữu ích' },
    ],
  },
  {
    code: 'B',
    title: 'Phần B: Sự minh bạch thông tin & Thủ tục khám bệnh',
    desc: 'Đánh giá về công khai giá viện phí, quyền lợi BHYT, thứ tự gọi số và thời gian chờ đợi',
    questions: [
      { id: 'B1', text: 'Bảng giá dịch vụ kỹ thuật, viện phí và quyền lợi BHYT được niêm yết công khai, rõ ràng' },
      { id: 'B2', text: 'Hệ thống gọi số thứ tự tự động và màn hình hiển thị tại phòng khám công bằng, minh bạch' },
      { id: 'B3', text: 'Thời gian chờ từ lúc đăng ký đến khi được bác sĩ gọi vào khám hợp lý, không quá lâu' },
      { id: 'B4', text: 'Thủ tục làm cận lâm sàng (xét nghiệm, siêu âm, chụp X-quang) và thanh toán thuận tiện' },
    ],
  },
  {
    code: 'C',
    title: 'Phần C: Cơ sở vật chất & Phương tiện phục vụ',
    desc: 'Đánh giá về phòng chờ, quạt mát/điều hòa, ghế ngồi, nước uống và khu vệ sinh',
    questions: [
      { id: 'C1', text: 'Phòng chờ khám sạch sẽ, thoáng mát (có quạt/điều hòa), đủ ghế ngồi cho người bệnh' },
      { id: 'C2', text: 'Có nước uống sạch, thùng rác y tế phân loại và khu vực phục vụ chu đáo' },
      { id: 'C3', text: 'Nhà vệ sinh sạch sẽ, không có mùi hôi, có xà phòng rửa tay và nước dùng đầy đủ' },
      { id: 'C4', text: 'Trang thiết bị, máy móc y tế phục vụ khám bệnh hiện đại, sạch sẽ và an toàn' },
    ],
  },
  {
    code: 'D',
    title: 'Phần D: Thái độ ứng xử & Năng lực của nhân viên y tế',
    desc: 'Đánh giá chuyên môn bác sĩ, tinh thần phục vụ của điều dưỡng, dược sĩ và nhân viên',
    questions: [
      { id: 'D1', text: 'Bác sĩ thăm khám cẩn thận, lắng nghe và giải thích tình trạng bệnh rõ ràng, dễ hiểu' },
      { id: 'D2', text: 'Bác sĩ tư vấn chế độ dùng thuốc, dinh dưỡng và hẹn tái khám cụ thể' },
      { id: 'D3', text: 'Điều dưỡng, kỹ thuật viên thao tác nhẹ nhàng, tôn trọng và quan tâm người bệnh' },
      { id: 'D4', text: 'Dược sĩ cấp phát thuốc hướng dẫn cách uống thuốc tỉ mỉ, kiểm tra đúng đối tượng' },
    ],
  },
  {
    code: 'E',
    title: 'Phần E: Kết quả cung cấp dịch vụ & Niềm tin',
    desc: 'Đánh giá về hiệu quả điều trị, sự cải thiện sức khỏe và mức độ tin tưởng của người bệnh',
    questions: [
      { id: 'E1', text: 'Kết quả chẩn đoán và hướng điều trị giúp tình trạng bệnh được thuyên giảm, cải thiện' },
      { id: 'E2', text: 'Người bệnh cảm thấy an tâm, được tôn trọng và bảo mật quyền riêng tư' },
      { id: 'E3', text: 'Chi phí khám chữa bệnh (đồng chi trả BHYT hoặc viện phí) tương xứng với chất lượng phục vụ' },
    ],
  },
]

// BỘ CÂU HỎI MẪU SỐ 1 - KHẢO SÁT HÀI LÒNG NGƯỜI BỆNH NỘI TRÚ (BỘ Y TẾ)
export const RAW_INPATIENT_SURVEY_SECTIONS: SurveySection[] = [
  {
    code: 'A',
    title: 'Phần A: Khả năng tiếp cận & Thủ tục nhập viện',
    desc: 'Đánh giá về chỉ dẫn đường, sơ đồ khoa phòng điều trị, thủ tục nhập viện và phân buồng bệnh',
    questions: [
      { id: 'A1', text: 'Biển báo, sơ đồ chỉ dẫn đường đến các khoa điều trị nội trú rõ ràng, dễ tìm' },
      { id: 'A2', text: 'Thủ tục làm hồ sơ nhập viện nhanh gọn, được nhân viên y tế hướng dẫn tận tình chu đáo' },
      { id: 'A3', text: 'Được bố trí buồng bệnh và giường nằm kịp thời, thuận tiện cho người bệnh và thân nhân' },
      { id: 'A4', text: 'Được phổ biến nội quy buồng bệnh, giờ thăm nuôi và chế độ sinh hoạt rõ ràng' },
    ],
  },
  {
    code: 'B',
    title: 'Phần B: Sự minh bạch thông tin & Chi phí điều trị',
    desc: 'Đánh giá việc giải thích bệnh tật, phác đồ điều trị, công khai đơn thuốc và viện phí BHYT',
    questions: [
      { id: 'B1', text: 'Bác sĩ giải thích rõ ràng về tình trạng bệnh, mục đích các xét nghiệm và phác đồ điều trị' },
      { id: 'B2', text: 'Được thông báo và giải thích trước khi thực hiện các thủ thuật, phẫu thuật hoặc kỹ thuật cao' },
      { id: 'B3', text: 'Quyền lợi BHYT, chi phí tiền giường, thuốc và dịch vụ kỹ thuật được công khai minh bạch' },
      { id: 'B4', text: 'Thủ tục thanh toán viện phí, tạm ứng và thanh quyết toán khi ra viện thuận lợi, nhanh chóng' },
    ],
  },
  {
    code: 'C',
    title: 'Phần C: Cơ sở vật chất & Tiện nghi buồng bệnh',
    desc: 'Đánh giá về buồng bệnh, giường nệm, chăn ga, vệ sinh buồng phòng, nguồn nước và an ninh',
    questions: [
      { id: 'C1', text: 'Buồng bệnh sạch sẽ, thoáng mát (có quạt/điều hòa), không gian yên tĩnh nghỉ ngơi' },
      { id: 'C2', text: 'Giường bệnh, đệm, ga trải giường và quần áo người bệnh sạch sẽ, được thay định kỳ' },
      { id: 'C3', text: 'Nhà vệ sinh trong khoa điều trị sạch sẽ, có nước dùng đầy đủ, không có mùi khó chịu' },
      { id: 'C4', text: 'Hệ thống điện nước, chuông gọi điều dưỡng tại đầu giường hoạt động tốt, an toàn' },
      { id: 'C5', text: 'An ninh trật tự trong bệnh viện được đảm bảo tốt, không xảy ra mất cắp hay quấy rầy' },
    ],
  },
  {
    code: 'D',
    title: 'Phần D: Thái độ ứng xử & Năng lực chăm sóc của nhân viên y tế',
    desc: 'Đánh giá chuyên môn bác sĩ, tinh thần phục vụ của điều dưỡng, sự ân cần và sẵn sàng hỗ trợ',
    questions: [
      { id: 'D1', text: 'Bác sĩ thăm khám hàng ngày cẩn thận, ân cần, lắng nghe và giải đáp các thắc mắc' },
      { id: 'D2', text: 'Điều dưỡng thực hiện tiêm truyền, phát thuốc nhẹ nhàng, đúng giờ, chu đáo và thân thiện' },
      { id: 'D3', text: 'Khi người bệnh bấm chuông gọi hoặc cần giúp đỡ khẩn cấp, nhân viên y tế có mặt kịp thời' },
      { id: 'D4', text: 'Nhân viên y tế tôn trọng quyền riêng tư, giữ thái độ hòa nhã, không cáu gắt hay vòi vĩnh' },
    ],
  },
  {
    code: 'E',
    title: 'Phần E: Kết quả điều trị & Niềm tin của người bệnh',
    desc: 'Đánh giá về mức độ hồi phục sức khỏe, hướng dẫn dặn dò khi xuất viện và niềm tin vào bệnh viện',
    questions: [
      { id: 'E1', text: 'Tình trạng sức khỏe được cải thiện rõ rệt sau đợt điều trị nội trú tại bệnh viện' },
      { id: 'E2', text: 'Trước khi xuất viện, bác sĩ dặn dò kỹ lưỡng về chế độ ăn uống, dùng thuốc và hẹn tái khám' },
      { id: 'E3', text: 'Chất lượng điều trị và chăm sóc y tế nội trú tương xứng với sự tin tưởng và chi phí bỏ ra' },
    ],
  },
]

// BỘ CÂU HỎI MẪU SỐ 3 - KHẢO SÁT Ý KIẾN NHÂN VIÊN Y TẾ (BỘ Y TẾ)
export const RAW_STAFF_SURVEY_SECTIONS: SurveySection[] = [
  {
    code: 'A',
    title: 'Phần A: Môi trường làm việc & Điều kiện cơ sở vật chất',
    desc: 'Đánh giá nơi làm việc, phòng giao ban/trực, trang thiết bị y tế, phương tiện bảo hộ và an toàn lao động',
    questions: [
      { id: 'A1', text: 'Nơi làm việc, phòng giao ban, phòng trực sạch sẽ, thông thoáng, đủ ánh sáng và tiện nghi cần thiết' },
      { id: 'A2', text: 'Trang thiết bị, máy móc y tế, thuốc và vật tư tiêu hao được cung ứng đầy đủ, kịp thời phục vụ chuyên môn' },
      { id: 'A3', text: 'Được trang bị đầy đủ phương tiện bảo hộ lao động cá nhân (quần áo, khẩu trang, găng tay, kính bảo hộ...)' },
      { id: 'A4', text: 'Môi trường làm việc an toàn, có biện pháp phòng ngừa rủi ro nghề nghiệp, phơi nhiễm và hành hung y tế' },
    ],
  },
  {
    code: 'B',
    title: 'Phần B: Lãnh đạo quản lý & Mối quan hệ đồng nghiệp',
    desc: 'Đánh giá sự điều hành của Ban Giám đốc và lãnh đạo khoa/phòng, sự công bằng, lắng nghe và tinh thần đoàn kết',
    questions: [
      { id: 'B1', text: 'Lãnh đạo khoa/phòng và Ban Giám đốc lắng nghe, tôn trọng và kịp thời tháo gỡ khó khăn cho nhân viên' },
      { id: 'B2', text: 'Việc phân công công việc, ca trực và đánh giá hoàn thành nhiệm vụ diễn ra công bằng, minh bạch' },
      { id: 'B3', text: 'Đồng nghiệp trong khoa/phòng đoàn kết, sẵn sàng hỗ trợ, chia sẻ kinh nghiệm và phối hợp ăn ý' },
      { id: 'B4', text: 'Sự phối hợp chuyên môn giữa các khoa lâm sàng, cận lâm sàng và phòng chức năng nhịp nhàng, hiệu quả' },
    ],
  },
  {
    code: 'C',
    title: 'Phần C: Quy chế nội bộ, Tiền lương & Chế độ đãi ngộ',
    desc: 'Đánh giá quy chế chi tiêu nội bộ, tiền lương, thu nhập tăng thêm, phụ cấp ưu đãi nghề và khen thưởng',
    questions: [
      { id: 'C1', text: 'Tiền lương, phụ cấp ưu đãi nghề, trực và các chế độ chính sách được chi trả đúng hạn, đầy đủ' },
      { id: 'C2', text: 'Quy chế chi tiêu nội bộ và phân chia thu nhập tăng thêm rõ ràng, công khai và phản ánh đúng công sức' },
      { id: 'C3', text: 'Chính sách khen thưởng, động viên kịp thời các cá nhân, tập thể có thành tích xuất sắc hoặc sáng kiến hay' },
      { id: 'C4', text: 'Các chế độ phúc lợi (khám sức khỏe định kỳ, tham quan, hỗ trợ đời sống, công đoàn) được quan tâm chu đáo' },
    ],
  },
  {
    code: 'D',
    title: 'Phần D: Áp lực công việc, Cơ hội học tập & Phát triển nghề nghiệp',
    desc: 'Đánh giá khối lượng công việc, cân bằng đời sống, cơ hội đào tạo liên tục và thăng tiến nghề nghiệp',
    questions: [
      { id: 'D1', text: 'Khối lượng công việc và tần suất trực phù hợp, không bị quá tải kéo dài gây kiệt sức (burnout)' },
      { id: 'D2', text: 'Bệnh viện tạo điều kiện thuận lợi để cán bộ tham gia đào tạo nâng cao trình độ, chuyên khoa và chứng chỉ' },
      { id: 'D3', text: 'Được tự chủ phát huy năng lực chuyên môn, áp dụng kỹ thuật mới và sáng kiến cải tiến kỹ thuật' },
      { id: 'D4', text: 'Quy hoạch bổ nhiệm cán bộ, cơ hội thăng tiến và phát triển sự nghiệp rộng mở, minh bạch' },
    ],
  },
  {
    code: 'E',
    title: 'Phần E: Hài lòng chung & Ý định gắn bó lâu dài',
    desc: 'Đánh giá niềm tự hào khi công tác tại bệnh viện, sự an tâm cống hiến và cam kết gắn bó',
    questions: [
      { id: 'E1', text: 'Tôi cảm thấy tự hào và vinh dự khi là một thành viên của Bệnh viện Đa khoa Khu vực Thới Lai' },
      { id: 'E2', text: 'Nhìn chung, tôi cảm thấy hài lòng với công việc và môi trường làm việc hiện tại của mình' },
      { id: 'E3', text: 'Tôi mong muốn tiếp tục gắn bó công tác lâu dài và sẵn sàng giới thiệu đồng nghiệp đến làm việc tại viện' },
    ],
  },
]
