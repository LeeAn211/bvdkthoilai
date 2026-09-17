import {
  RAW_OUTPATIENT_SURVEY_SECTIONS,
  RAW_INPATIENT_SURVEY_SECTIONS,
  RAW_STAFF_SURVEY_SECTIONS,
} from '@/data/surveyQuestionsData'

export interface SurveyPresetQuestion {
  code: string
  type: 'rating5' | 'rating10' | 'single' | 'multiple' | 'yesno' | 'text'
  question: string
  options?: string
  required?: boolean
  order?: number
}

export interface SurveyPreset {
  id: string
  title: string
  description: string
  type: 'outpatient' | 'inpatient' | 'staff'
  icon: string
  questions: SurveyPresetQuestion[]
}

export function getPresetOutpatient(): SurveyPresetQuestion[] {
  const result: SurveyPresetQuestion[] = []
  let order = 1
  for (const sec of RAW_OUTPATIENT_SURVEY_SECTIONS) {
    for (const q of sec.questions) {
      result.push({
        code: q.id,
        type: 'rating5',
        question: `[${sec.code}] ${q.text}`,
        options: '',
        required: true,
        order: order++,
      })
    }
  }
  // Thêm 2 câu hỏi tổng kết đặc trưng của Bộ Y Tế
  result.push({
    code: 'E4',
    type: 'rating10',
    question: 'Đánh giá chung về chất lượng dịch vụ của Bệnh viện Đa khoa Khu vực Thới Lai (Thang điểm 1 - 10)',
    options: '',
    required: true,
    order: order++,
  })
  result.push({
    code: 'E5',
    type: 'single',
    question: 'Nếu có nhu cầu khám chữa bệnh trong tương lai, Quý vị có quay lại hoặc giới thiệu cho người thân không?',
    options: 'Chắc chắn có\nCó thể có\nKhông chắc chắn\nChắc chắn không',
    required: true,
    order: order++,
  })
  result.push({
    code: 'E6',
    type: 'text',
    question: 'Ý kiến đóng góp hoặc đề xuất chân thành khác của Quý người bệnh để bệnh viện hoàn thiện hơn',
    options: '',
    required: false,
    order: order++,
  })
  return result
}

export function getPresetInpatient(): SurveyPresetQuestion[] {
  const result: SurveyPresetQuestion[] = []
  let order = 1
  for (const sec of RAW_INPATIENT_SURVEY_SECTIONS) {
    for (const q of sec.questions) {
      result.push({
        code: q.id,
        type: 'rating5',
        question: `[${sec.code}] ${q.text}`,
        options: '',
        required: true,
        order: order++,
      })
    }
  }
  result.push({
    code: 'E4',
    type: 'rating10',
    question: 'Đánh giá chung về chất lượng điều trị và chăm sóc nội trú của Bệnh viện (Thang điểm 1 - 10)',
    options: '',
    required: true,
    order: order++,
  })
  result.push({
    code: 'E5',
    type: 'single',
    question: 'Nếu cần điều trị nội trú trong tương lai, Quý vị có sẵn sàng quay lại hoặc giới thiệu người thân không?',
    options: 'Chắc chắn có\nCó thể có\nKhông chắc chắn\nChắc chắn không',
    required: true,
    order: order++,
  })
  result.push({
    code: 'E6',
    type: 'text',
    question: 'Ý kiến phản ánh, đề xuất cụ thể khác của Quý người bệnh và thân nhân về buồng bệnh, thái độ y bác sĩ',
    options: '',
    required: false,
    order: order++,
  })
  return result
}

export function getPresetStaff(): SurveyPresetQuestion[] {
  const result: SurveyPresetQuestion[] = []
  let order = 1
  for (const sec of RAW_STAFF_SURVEY_SECTIONS) {
    for (const q of sec.questions) {
      result.push({
        code: q.id,
        type: 'rating5',
        question: `[${sec.code}] ${q.text}`,
        options: '',
        required: true,
        order: order++,
      })
    }
  }
  result.push({
    code: 'E4',
    type: 'rating10',
    question: 'Đánh giá mức độ hài lòng chung đối với môi trường và chế độ đãi ngộ của Bệnh viện (Thang điểm 1 - 10)',
    options: '',
    required: true,
    order: order++,
  })
  result.push({
    code: 'E5',
    type: 'single',
    question: 'Đồng chí có ý định gắn bó lâu dài và cống hiến sự nghiệp tại Bệnh viện Đa khoa Khu vực Thới Lai không?',
    options: 'Chắc chắn gắn bó lâu dài\nTiếp tục công tác và theo dõi thêm\nĐang cân nhắc chuyển công tác\nCó kế hoạch nghỉ việc / tìm môi trường khác',
    required: true,
    order: order++,
  })
  result.push({
    code: 'E6',
    type: 'text',
    question: 'Đề xuất, kiến nghị tâm huyết gửi Ban Giám đốc nhằm cải tiến điều kiện làm việc và đãi ngộ',
    options: '',
    required: false,
    order: order++,
  })
  return result
}

export const SYSTEM_SURVEY_PRESETS: SurveyPreset[] = [
  {
    id: 'preset-outpatient',
    title: 'Mẫu 2: Khảo sát Hài lòng Người bệnh Ngoại trú (Chuẩn Bộ Y tế - 22 câu)',
    description: 'Bao gồm 19 câu tiêu chuẩn 5 nhóm (Tiếp cận, Minh bạch, Cơ sở vật chất, Ứng xử y bác sĩ, Kết quả) + Đánh giá điểm 1-10 + Khả năng quay lại + Ý kiến tự do.',
    type: 'outpatient',
    icon: '🩺',
    questions: getPresetOutpatient(),
  },
  {
    id: 'preset-inpatient',
    title: 'Mẫu 1: Khảo sát Hài lòng Người bệnh Nội trú (Chuẩn Bộ Y tế - 23 câu)',
    description: 'Bao gồm 20 câu tiêu chuẩn 5 nhóm (Nhập viện, Minh bạch chi phí, Buồng bệnh & Tiện nghi, Chăm sóc điều dưỡng/bác sĩ, Kết quả) + Đánh giá điểm 1-10 + Ý kiến tự do.',
    type: 'inpatient',
    icon: '🏥',
    questions: getPresetInpatient(),
  },
  {
    id: 'preset-staff',
    title: 'Mẫu 3: Khảo sát Ý kiến & Sự hài lòng Nhân viên Y tế (Chuẩn Bộ Y tế - 22 câu)',
    description: 'Bao gồm 19 câu tiêu chuẩn 5 nhóm (Môi trường làm việc, Lãnh đạo & Đồng nghiệp, Quy chế lương & Đãi ngộ, Cơ hội học tập, Gắn bó) + Đánh giá điểm 1-10 + Nguyện vọng.',
    type: 'staff',
    icon: '👨‍⚕️',
    questions: getPresetStaff(),
  },
]
