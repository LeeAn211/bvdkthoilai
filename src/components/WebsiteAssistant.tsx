'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { getVisibilityClass, shouldRender } from '@/lib/deviceVisibility'

type Message = {
  id: number
  from: 'bot' | 'user'
  text: string
  href?: string
  linkLabel?: string
  external?: boolean
  handoffQuestion?: string
  handoffState?: 'idle' | 'sending' | 'sent' | 'error'
  consultationToken?: string
  resolved?: boolean
  sourceQuestion?: string
  rating?: 'up' | 'down'
  suggestions?: Array<{ label: string; value: string }>
}

type AssistantProps = {
  enabled?: boolean
  backToTopEnabled?: boolean
  assistantVisibility?: string
  backToTopVisibility?: string
  assistantName?: string
  statusText?: string
  greeting?: string
  logoUrl?: string
  primaryColor?: string
  hotline?: string
  medproUrl?: string
  bookingEnabled?: boolean
  inputPlaceholder?: string
  noticeText?: string
  fallbackResponse?: string
  fallbackLinkLabel?: string
  fallbackLinkUrl?: string
  quickTopics?: Array<{ label?: string; value?: string }>
  customAnswers?: Array<{
    question?: string
    keywords?: string
    answer?: string
    linkLabel?: string
    linkUrl?: string
    openNewTab?: boolean
  }>
}

const defaultQuickTopics = [
  { label: 'Lịch khám bác sĩ', value: 'Xem lịch khám bác sĩ' },
  { label: 'Quyền lợi BHYT', value: 'Quyền lợi và mức hưởng BHYT' },
  { label: 'Thủ tục đi khám', value: 'Giấy tờ và quy trình đi khám bệnh' },
  { label: 'Bảng giá viện phí', value: 'Bảng giá dịch vụ và viện phí' },
  { label: 'Khám sức khỏe lái xe', value: 'Khám sức khỏe lái xe và đi làm' },
  { label: 'Đặt lịch khám', value: 'Tôi muốn đặt lịch khám' },
  { label: 'Lịch tiêm chủng', value: 'Thông tin tiêm chủng vắc xin' },
  { label: 'Giờ làm việc', value: 'Giờ làm việc và khám bệnh' },
  { label: 'Gợi ý chuyên khoa', value: 'Tư vấn gợi ý chuyên khoa theo triệu chứng' },
]
// Bộ từ điển phương ngữ Nam Bộ & Tây Nam Bộ (Cần Thơ, Thới Lai) được chuẩn hóa từ cụm dài đến từ đơn
const DIALECT_MAP: Record<string, string> = {
  // Cụm từ ghép / cụm mô tả
  'gio cang': 'chan',
  'chan tay': 'tay chan',
  'bao tu': 'da day',
  'cu hong': 'hong',
  'lo tai': 'tai',
  'con mat': 'mat',
  'cai rang': 'rang',
  'cai bung': 'bung',
  'cai dau': 'dau',
  'sanh de': 'sinh con',
  'de con': 'sinh con',
  'co bau': 'mang thai',
  'co thai': 'mang thai',
  'can bau': 'kham thai',
  'con nit': 'tre em',
  'be nho': 'tre em',
  'con em': 'tre em',
  'em be': 'tre em',
  'oc sua': 'non tro',
  'doi bang': 'lai xe',
  'bang lai': 'lai xe',
  'chay xe': 'lai xe',
  'xin viec': 'kham suc khoe',
  'di lam': 'kham suc khoe',
  'tien bac': 'chi phi',
  'gia ca': 'bang gia',
  'bao nhieu': 'chi phi',
  'may gio': 'gio lam viec',
  'nghi le': 'ngay nghi',
  'chu nhat': 'ngay nghi',
  'thu 7': 'ngay nghi',
  'thu bay': 'ngay nghi',
  'lay so': 'quy trinh',
  'xep hang': 'quy trinh',

  // Từ đơn địa phương
  'nhut': 'dau',
  'nhuc': 'dau',
  'moi': 'dau',
  'e am': 'dau',
  'thon': 'dau',
  'tuc': 'dau',
  'gio': 'chan',
  'cang': 'chan',
  'lung': 'cot song',
  'sanh': 'sinh',
  'de': 'sinh con',
}

function normalize(value: string) {
  let text = ' ' + (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() + ' '

  // Chuẩn hóa từ ngữ địa phương Tây Nam Bộ sang từ khóa y tế phổ thông
  for (const [dialect, standard] of Object.entries(DIALECT_MAP)) {
    text = text.replaceAll(' ' + dialect + ' ', ' ' + standard + ' ')
  }

  return text.replace(/\s+/g, ' ').trim()
}


export function WebsiteAssistant({
  enabled = true,
  backToTopEnabled = true,
  assistantVisibility = 'both',
  backToTopVisibility = 'both',
  assistantName = 'Trợ lý ảo BVĐK Thới Lai',
  statusText = 'Đang trực tuyến',
  greeting = 'Xin chào! Tôi có thể hỗ trợ bạn tra cứu lịch khám bác sĩ, thủ tục BHYT, bảng giá dịch vụ và hướng dẫn chuyên khoa.',
  logoUrl,
  primaryColor = '#0878D1',
  hotline = '02923689115',
  medproUrl = 'https://medpro.vn/',
  bookingEnabled = true,
  inputPlaceholder = 'Nhập câu hỏi của bạn…',
  noticeText = 'Thông tin tư vấn mang tính định hướng y tế. Vui lòng đến trực tiếp cơ sở y tế để được khám chẩn đoán.',
  fallbackResponse = 'Tôi chưa tìm thấy câu trả lời chính xác cho nội dung này. Bạn có thể chọn các gợi ý bên dưới hoặc bấm nút gửi câu hỏi để tư vấn viên hỗ trợ.',
  fallbackLinkLabel = 'Xem trang Liên hệ',
  fallbackLinkUrl = '/lien-he',
  quickTopics = defaultQuickTopics,
  customAnswers = [],
}: AssistantProps) {
  const [open, setOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [input, setInput] = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: greeting },
  ])
  const messageEndRef = useRef<HTMLDivElement>(null)
  const checkingTokens = useRef(new Set<string>())
  const chatSessionId = useRef('')

  useEffect(() => {
    try {
      chatSessionId.current = window.sessionStorage.getItem('thoi-lai-assistant-session') || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.sessionStorage.setItem('thoi-lai-assistant-session', chatSessionId.current)
      const saved = window.sessionStorage.getItem('thoi-lai-assistant-messages')
      const parsed = saved ? JSON.parse(saved) : null
      if (Array.isArray(parsed) && parsed.length) setMessages(parsed.slice(-40))
    } catch {}
    setSessionReady(true)
  }, [])

  useEffect(() => {
    if (!sessionReady) return
    try { window.sessionStorage.setItem('thoi-lai-assistant-messages', JSON.stringify(messages.slice(-40))) } catch {}
  }, [messages, sessionReady])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 450)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    const pending = messages.filter((message) => message.consultationToken && !message.resolved)
    if (!pending.length) return

    const checkReplies = async () => {
      for (const pendingMessage of pending) {
        const token = pendingMessage.consultationToken as string
        if (checkingTokens.current.has(token)) continue
        checkingTokens.current.add(token)
        try {
          const response = await fetch(`/api/consultation?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
          const data = await response.json()
          if (response.ok && data.reply) {
            setMessages((current) => {
              if (current.some((message) => message.consultationToken === token && message.resolved)) return current
              const staffMessage: Message = { id: Date.now(), from: 'bot', text: `Tư vấn viên trả lời: ${data.reply}` }
              return [
                ...current.map((message) => message.consultationToken === token ? { ...message, resolved: true } as Message : message),
                staffMessage,
              ]
            })
          }
        } catch {
          // Giữ yêu cầu để tự kiểm tra lại ở vòng tiếp theo.
        } finally {
          checkingTokens.current.delete(token)
        }
      }
    }
    checkReplies()
    const timer = window.setInterval(checkReplies, 8000)
    return () => window.clearInterval(timer)
  }, [messages])

  const answer = (question: string): Omit<Message, 'id' | 'from'> => {
    const q = normalize(question)
    const replaceVariables = (value?: string) => value
      ?.replaceAll('{{HOTLINE}}', hotline)
      .replaceAll('{{MEDPRO_URL}}', medproUrl)

    // 1. Ưu tiên kiểm tra so khớp thông minh với customAnswers từ CMS (nếu quản trị viên có cấu hình)
    if (Array.isArray(customAnswers) && customAnswers.length > 0) {
      // Tính điểm match cho từng câu hỏi CMS
      let bestCMSMatch: { item: typeof customAnswers[0]; score: number } | null = null

      for (const item of customAnswers) {
        if (!item?.answer) continue
        const terms = [item.question, ...(item.keywords || '').split(/[,;\n]/)]
          .map((term) => normalize(term || ''))
          .filter((term) => term.length >= 2)

        let score = 0
        for (const term of terms) {
          if (q === term) {
            score += 10
          } else if (q.includes(term)) {
            score += term.length > 5 ? 5 : 3
          } else if (term.includes(q) && q.length >= 4) {
            score += 2
          }
        }

        if (score > 0 && (!bestCMSMatch || score > bestCMSMatch.score)) {
          bestCMSMatch = { item, score }
        }
      }

      if (bestCMSMatch && bestCMSMatch.score >= 2) {
        return {
          text: replaceVariables(bestCMSMatch.item.answer) || bestCMSMatch.item.answer || '',
          href: replaceVariables(bestCMSMatch.item.linkUrl) || undefined,
          linkLabel: bestCMSMatch.item.linkLabel || (bestCMSMatch.item.linkUrl ? 'Xem chi tiết' : undefined),
          external: bestCMSMatch.item.openNewTab,
        }
      }
    }

    // 2. Hệ thống nhận diện tự động định tuyến thông minh theo từ khóa y tế & BHYT
    // Cấp cứu khẩn cấp
    if (q.includes('cap cuu') || q.includes('khan cap') || q.includes('tai nan') || q.includes('nguy kich') || q.includes('115') || q.includes('ngo doc') || q.includes('dot quy') || q.includes('hon me')) {
      return {
        text: `Khoa Cấp cứu của Bệnh viện Đa khoa Khu vực Thới Lai hoạt động 24/24 tất cả các ngày trong tuần (kể cả Lễ, Tết).\n\nTrường hợp khẩn cấp, người bệnh cần được chuyển ngay đến cổng Cấp cứu bệnh viện hoặc liên hệ số trực cấp cứu: ${hotline}.`,
        href: `tel:${hotline}`,
        linkLabel: `Gọi số trực cấp cứu: ${hotline}`,
        external: true,
      }
    }

    // BHYT: Thông tuyến, mức hưởng, trái tuyến, chi trả
    if (q.includes('bhyt') || q.includes('bao hiem y te') || q.includes('trai tuyen') || q.includes('thong tuyen') || q.includes('muc huong') || q.includes('bao nhieu phan tram') || q.includes('the bao hiem') || q.includes('dung tuyen')) {
      return {
        text: `BHYT THÔNG TUYẾN TOÀN QUỐC TẠI BVĐK KHU VỰC THỚI LAI:\n\n• Quyền lợi: Tiếp nhận tất cả thẻ BHYT trên toàn quốc, người bệnh được hưởng 100% mức quyền lợi trên thẻ (80%, 95% hoặc 100% tùy mã đối tượng) mà KHÔNG CẦN giấy chuyển tuyến (áp dụng cho cả khám ngoại trú và nằm viện nội trú).\n• Giấy tờ: Người bệnh chỉ cần mang Căn cước công dân gắn chip hoặc điện thoại có ứng dụng VNeID / VssID tích hợp thẻ BHYT.\n• Đồng chi trả: Các danh mục thuốc, vật tư y tế và dịch vụ kỹ thuật được quỹ BHYT thanh toán theo đúng quy định hiện hành của Bộ Y tế.`,
        href: '/trang/kham-bhyt',
        linkLabel: 'Xem chi tiết quyền lợi & thủ tục BHYT',
      }
    }

    // Giấy tờ, thủ tục, quy trình đi khám
    if (q.includes('quy trinh') || q.includes('thu tuc') || q.includes('giay to') || q.includes('cccd') || q.includes('can cuoc') || q.includes('vneid') || q.includes('vssid') || q.includes('can mang gi') || q.includes('dem theo gi') || q.includes('lay so')) {
      return {
        text: `HƯỚNG DẪN GIẤY TỜ & QUY TRÌNH ĐI KHÁM BỆNH:\n\n1. Giấy tờ cần chuẩn bị:\n• CCCD gắn chip hoặc ứng dụng VNeID/VssID (đã tích hợp thẻ BHYT).\n• Trẻ em dưới 6 tuổi: Thẻ BHYT và Giấy khai sinh (bản sao hoặc ảnh chụp).\n• Sổ khám bệnh, đơn thuốc cũ, kết quả xét nghiệm/phim chụp trước đây (nếu có).\n\n2. Quy trình 5 bước:\n• Bước 1: Lấy số thứ tự tại Bàn tiếp đón (Khoa Khám bệnh).\n• Bước 2: Nhân viên tiếp đón đo sinh hiệu và đăng ký vào phòng khám chuyên khoa.\n• Bước 3: Bác sĩ thăm khám, chỉ định cận lâm sàng (xét nghiệm, siêu âm, X-quang...) nếu cần.\n• Bước 4: Thực hiện cận lâm sàng và quay lại phòng khám nghe bác sĩ kết luận, kê đơn.\n• Bước 5: Thanh toán viện phí tại quầy Thu ngân và nhận thuốc tại Khoa Dược.`,
        href: '/trang/kham-bhyt',
        linkLabel: 'Xem hướng dẫn quy trình khám bệnh',
      }
    }

    // Khám sức khỏe: lái xe, đổi bằng lái, xin việc, đi làm, định kỳ
    if (q.includes('kham suc khoe') || q.includes('lai xe') || q.includes('bang lai') || q.includes('doi bang') || q.includes('xin viec') || q.includes('di lam') || q.includes('tuyen dung') || q.includes('dinh ky')) {
      return {
        text: `DỊCH VỤ KHÁM SỨC KHỎE TẠI BỆNH VIỆN:\n\n• Khám sức khỏe lái xe (ô tô, mô tô các hạng): Dữ liệu kết quả được LIÊN THÔNG trực tiếp lên Cổng Dịch vụ công Quốc gia, giúp người dân làm thủ tục cấp đổi giấy phép lái xe trực tuyến tại nhà mà không cần nộp giấy khám bản cứng.\n• Khám sức khỏe đi làm, đi học, tuyển dụng cơ quan doanh nghiệp.\n• Hồ sơ cần mang: CCCD và 02 ảnh thẻ 4x6 (nền trắng, chụp trong vòng 6 tháng gần nhất).`,
        href: '/trang/kham-bhyt',
        linkLabel: 'Xem hướng dẫn khám sức khỏe',
      }
    }

    // Bảng giá dịch vụ, tiền khám, viện phí, chi phí
    if (q.includes('bang gia') || q.includes('vien phi') || q.includes('chi phi') || q.includes('tien kham') || q.includes('gia tien') || q.includes('gia bao nhieu') || q.includes('chi phi bao nhieu') || q.includes('gia xet nghiem')) {
      return {
        text: `BẢNG GIÁ KHÁM BỆNH & DỊCH VỤ KỸ THUẬT:\n\n• Bảng giá khám chữa bệnh tại BVĐK Khu vực Thới Lai được niêm yết công khai, minh bạch theo đúng quy định của Bộ Y tế và UBND TP. Cần Thơ.\n• Đối với người bệnh có thẻ BHYT: Chi phí khám, thuốc men và xét nghiệm được quỹ BHYT chi trả theo tỷ lệ quy định.\n• Bệnh viện công khai toàn bộ chi phí: tiền khám chuyên khoa, ngày giường bệnh nội trú, xét nghiệm cận lâm sàng, siêu âm, chụp X-quang, nội soi tiêu hóa...`,
        href: '/bang-gia',
        linkLabel: 'Tra cứu bảng giá dịch vụ chi tiết',
      }
    }

    // Lịch khám bác sĩ chuyên khoa
    if (q.includes('lich kham') || q.includes('bac si') || q.includes('lich truc') || q.includes('ai truc') || q.includes('phong kham')) {
      return {
        text: `LỊCH KHÁM BỆNH BÁC SĨ CHUYÊN KHOA:\n\nLịch phân công trực khám của các Bác sĩ chuyên khoa (Nội, Ngoại, Sản, Nhi, Mắt, Răng Hàm Mặt, Tai Mũi Họng, Y học cổ truyền...) được cập nhật thường xuyên trên website.\n\nThời gian khám ngoại trú: Thứ 2 đến Thứ 6 (Sáng: 07:00 – 11:30 | Chiều: 13:00 – 16:30). Thứ 7, Chủ Nhật và ngày Lễ có đội ngũ trực tiếp nhận cấp cứu và khám bệnh.`,
        href: '/lich-kham',
        linkLabel: 'Xem lịch khám tuần này',
      }
    }

    // Đặt lịch khám trực tuyến, lấy số trước
    if (q.includes('dat kham') || q.includes('dat lich') || q.includes('lay so') || q.includes('medpro') || q.includes('hen gio') || q.includes('dang ky kham')) {
      const isExternalBooking = /^https?:\/\//i.test(medproUrl)
      return {
        text: isExternalBooking
          ? `ĐĂNG KÝ ĐẶT LỊCH KHÁM TRỰC TUYẾN:\n\nQuý người bệnh có thể đăng ký đặt lịch khám trước qua ứng dụng Medpro để chủ động chọn ngày giờ khám bệnh, giúp giảm thiểu tối đa thời gian xếp hàng chờ đợi tại viện.`
          : `ĐĂNG KÝ ĐẶT LỊCH KHÁM TẠI CƠ SỞ:\n\nQuý người bệnh có thể gửi phiếu đăng ký trực tiếp trên website. Bệnh viện sẽ tiếp nhận và liên hệ xác nhận lịch khám.`,
        href: medproUrl,
        linkLabel: isExternalBooking ? 'Đặt lịch khám trực tuyến qua Medpro' : 'Đặt lịch khám tại cơ sở',
        external: isExternalBooking,
      }
    }

    // Tiêm chủng vắc xin
    if (q.includes('tiem ngua') || q.includes('tiem chung') || q.includes('vac xin') || q.includes('vaccine') || q.includes('tiem phong') || q.includes('mui tiem') || q.includes('tiem dai') || q.includes('uon van')) {
      return {
        text: `PHÒNG TIÊM CHỦNG VẮC XIN - BVĐK KHU VỰC THỚI LAI:\n\n• Cung cấp đầy đủ các loại vắc xin cho trẻ em, phụ nữ chuẩn bị mang thai và người lớn (Vắc xin 6 trong 1, Phế cầu Synflorix/Prevenar, Rota virus, Cúm mùa, Sởi - Quai bị - Rubella, Thủy đậu, Viêm gan B, Uốn ván, Vắc xin phòng Dại...).\n• Vắc xin bảo quản chuẩn dây chuyền lạnh GSP, bác sĩ khám sàng lọc trước tiêm và theo dõi sau tiêm an toàn.`,
        href: '/tiem-chung',
        linkLabel: 'Xem danh mục vắc xin & Lịch tiêm',
      }
    }

    // Giờ làm việc, khám thứ 7 chủ nhật
    if (q.includes('gio lam viec') || q.includes('may gio') || q.includes('thu 7') || q.includes('chu nhat') || q.includes('ngoai gio') || q.includes('ngay nghi') || q.includes('nghi le')) {
      return {
        text: `THỜI GIAN LÀM VIỆC CỦA BỆNH VIỆN:\n\n• Khoa Cấp cứu: Trực 24/24 tất cả các ngày trong tuần (kể cả Lễ, Tết).\n• Khám bệnh ngoại trú (Giờ hành chính): Thứ Hai đến Thứ Sáu (Sáng: 07:00 – 11:30 | Chiều: 13:00 – 16:30).\n• Thứ Bảy, Chủ Nhật & Ngày Lễ: Bệnh viện bố trí đội ngũ bác sĩ trực tiếp nhận người bệnh, đảm bảo đầy đủ quyền lợi BHYT.`,
        href: '/lich-lam-viec',
        linkLabel: 'Xem chi tiết lịch làm việc',
      }
    }

    // Thai sản, sinh con, phụ sản
    if (q.includes('kham thai') || q.includes('sinh con') || q.includes('phu san') || q.includes('de con') || q.includes('sinh mo') || q.includes('sieu am thai') || q.includes('tien san') || q.includes('san phu')) {
      return {
        text: `KHOA PHỤ SẢN - ĐỒNG HÀNH CÙNG MẸ VÀ BÉ:\n\n• Khám thai định kỳ, siêu âm sàng lọc dị tật thai nhi, xét nghiệm tiền sản.\n• Đỡ sinh thường, phẫu thuật mổ lấy thai an toàn, kỹ thuật giảm đau sản khoa.\n• Chăm sóc sau sinh chu đáo: Da kề da mẹ và bé, tiêm ngừa sơ sinh và đo thính lực cho bé.\n• Đảm bảo 100% quyền lợi chế độ BHYT khi sinh nở tại viện.`,
        href: '/chuyen-khoa',
        linkLabel: 'Xem thông tin Khoa Phụ sản',
      }
    }

    // Nhi khoa, trẻ nhỏ, bệnh trẻ em
    if (q.includes('khoa nhi') || q.includes('kham nhi') || q.includes('tre em') || q.includes('tre nho') || q.includes('so sinh') || q.includes('be sot') || q.includes('tay chan mieng') || q.includes('sot xuat huyet')) {
      return {
        text: `KHOA NHI - CHĂM SÓC TOÀN DIỆN CHO BỆNH NHI:\n\n• Tiếp nhận khám và điều trị các bệnh lý trẻ em: Viêm phổi, viêm phế quản, hen suyễn, sốt xuất huyết, tay chân miệng, rối loạn tiêu hóa...\n• Bác sĩ giàu kinh nghiệm, phòng bệnh sạch sẽ, thân thiện với trẻ nhỏ.\n• Trẻ em dưới 6 tuổi được BHYT chi trả 100% chi phí khám chữa bệnh theo quy định.`,
        href: '/chuyen-khoa',
        linkLabel: 'Xem chuyên khoa Nhi',
      }
    }

    // Cận lâm sàng: Xét nghiệm, X-quang, Siêu âm, Nội soi, Đo điện tim
    if (q.includes('xet nghiem') || q.includes('xquang') || q.includes('x quang') || q.includes('sieu am') || q.includes('noi soi') || q.includes('dien tim') || q.includes('chup chieu')) {
      return {
        text: `DỊCH VỤ CẬN LÂM SÀNG & CHẨN ĐOÁN HÌNH ẢNH:\n\n• Xét nghiệm: Huyết học, sinh hóa máu, miễn dịch tự động, đông máu, nước tiểu.\n• Chẩn đoán hình ảnh: Siêu âm màu tổng quát, tim mạch, tuyến giáp, sản khoa; Chụp X-quang kỹ thuật số DR liều tia an toàn.\n• Thăm dò chức năng: Nội soi dạ dày - tá tràng, nội soi đại tràng, đo điện tim ECG.\n• Bệnh viện trả kết quả cận lâm sàng nhanh chóng, chính xác.`,
        href: '/bang-gia',
        linkLabel: 'Xem bảng giá dịch vụ cận lâm sàng',
      }
    }

    // Tư vấn gợi ý chuyên khoa theo triệu chứng / đau nhức cơ thể (hỗ trợ cả từ địa phương như nhứt đầu, nhứt tay, đau giò cẳng, đau bao tử)
    if (q.includes('dau dau') || q.includes('chong mat') || q.includes('te bi') || q.includes('mat ngu')) {
      return {
        text: `ĐỊNH HƯỚNG KHÁM TRIỆU CHỨNG ĐẦU & THẦN KINH:\n\n• Triệu chứng: Nhức đầu, đau nửa đầu, chóng mặt, hoa mắt, mất ngủ, tê bì tay chân, run tay...\n• Khoa phòng phụ trách: Phòng khám Nội Thần kinh / Phòng Nội Tổng quát (Khoa Khám bệnh).\n• Lời khuyên: Quý vị nên đi khám sớm để bác sĩ đo huyết áp, kiểm tra tuần hoàn máu não hoặc chỉ định chụp chiếu nếu cần.`,
        href: '/chuyen-khoa',
        linkLabel: 'Xem danh sách Chuyên khoa',
      }
    }

    if (q.includes('dau tay') || q.includes('dau chan') || q.includes('dau khop') || q.includes('dau lung') || q.includes('te chan') || q.includes('te tay') || q.includes('chan thuong') || q.includes('gay xuong') || q.includes('te nga')) {
      return {
        text: `ĐỊNH HƯỚNG KHÁM CƠ XƯƠNG KHỚP & CHẤN THƯƠNG:\n\n• Triệu chứng: Nhức mỏi tay chân, sưng đau khớp gối, thoái hóa khớp, đau lưng/cột sống, trật khớp, té ngã chấn thương...\n• Khoa phòng phụ trách: Phòng khám Ngoại Chấn thương (hoặc Khoa Y học cổ truyền - Phục hồi chức năng nếu đau nhức mạn tính).\n• Bệnh viện có chụp X-quang kỹ thuật số và xét nghiệm axit uric để chẩn đoán chính xác.`,
        href: '/chuyen-khoa',
        linkLabel: 'Xem Chuyên khoa Ngoại chấn thương',
      }
    }

    if (q.includes('dau bung') || q.includes('dau bao tu') || q.includes('o chua') || q.includes('non oi') || q.includes('trao nguoc') || q.includes('di cau') || q.includes('tieu chay') || q.includes('kho tieu')) {
      return {
        text: `ĐỊNH HƯỚNG KHÁM BỆNH TIÊU HÓA & DẠ DÀY:\n\n• Triệu chứng: Đau bụng (thượng vị/quanh rốn), đau bao tử, ợ chua, trào ngược, buồn nôn, đầy hơi khó tiêu, rối loạn tiêu hóa...\n• Khoa phòng phụ trách: Phòng khám Nội Tiêu hóa (Khoa Khám bệnh).\n• Bệnh viện có dịch vụ Nội soi dạ dày - tá tràng test vi khuẩn HP và Siêu âm ổ bụng tổng quát.`,
        href: '/chuyen-khoa',
        linkLabel: 'Xem Chuyên khoa Nội tiêu hóa',
      }
    }

    if (q.includes('trieu chung') || q.includes('dau nguc') || q.includes('dau mat') || q.includes('dau rang') || q.includes('dau hong') || q.includes('khoa nao') || q.includes('kham o dau') || q.includes('chuyen khoa') || q.includes('ho sot')) {
      return {
        text: `GỢI Ý ĐỊNH HƯỚNG CHUYÊN KHOA THEO TRIỆU CHỨNG:\n\n• Đau bụng, đau bao tử, ợ chua, nôn ói: Khám Nội tổng quát / Tiêu hóa.\n• Nhức đầu, chóng mặt, mất ngủ, tê tay chân: Khám Nội thần kinh.\n• Nhức mỏi tay chân, đau khớp, chấn thương: Khám Ngoại chấn thương.\n• Ho dai dẳng, sốt, khó thở, tức ngực: Khám Nội hô hấp / Tim mạch.\n• Đau mắt, ngứa mắt, đỏ mắt, mờ mắt: Chuyên khoa Mắt.\n• Đau răng, sưng nướu, nhổ răng: Chuyên khoa Răng Hàm Mặt.\n• Đau họng, nghẹt mũi, ù tai: Chuyên khoa Tai Mũi Họng.\n\n* Lưu ý: Khi đến bệnh viện, nhân viên tại bàn tiếp đón sẽ đo sinh hiệu và phân phòng khám chuẩn xác nhất.`,
        href: '/chuyen-khoa',
        linkLabel: 'Xem danh sách Chuyên khoa',
      }
    }

    // Địa chỉ, đường đi, liên hệ hotline
    if (q.includes('dia chi') || q.includes('o dau') || q.includes('lien he') || q.includes('hotline') || q.includes('so dien thoai') || q.includes('sdt') || q.includes('duong di')) {
      return {
        text: `THÔNG TIN LIÊN HỆ BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI:\n\n• Địa chỉ: Thị trấn Thới Lai, Huyện Thới Lai, TP. Cần Thơ.\n• Đường dây nóng tiếp đón & Cấp cứu: ${hotline}\n• Khoa Cấp cứu tiếp nhận 24/24 tất cả các ngày trong tuần.`,
        href: '/lien-he',
        linkLabel: 'Xem bản đồ & Liên hệ',
      }
    }

    return {
      text: replaceVariables(fallbackResponse) || fallbackResponse,
      href: replaceVariables(fallbackLinkUrl) || undefined,
      linkLabel: fallbackLinkUrl ? fallbackLinkLabel : undefined,
      handoffQuestion: question,
      handoffState: 'idle',
    }
  }

  const requestConsultation = async (messageId: number, question: string) => {
    setMessages((current) => current.map((message) => message.id === messageId ? { ...message, handoffState: 'sending' } as Message : message))
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      if (!response.ok || !data.token) throw new Error('send_failed')
      setMessages((current) => current.map((message) => message.id === messageId ? {
        ...message,
        text: 'Câu hỏi của bạn đã được chuyển tiếp đến nhân viên tư vấn. Khi có phản hồi, nội dung sẽ hiển thị ngay tại cửa sổ này.',
        handoffState: 'sent',
        handoffQuestion: undefined,
        consultationToken: data.token,
      } as Message : message))
    } catch {
      setMessages((current) => current.map((message) => message.id === messageId ? { ...message, handoffState: 'error' } as Message : message))
    }
  }

  const rateAnswer = async (messageId: number, rating: 'up' | 'down', question?: string) => {
    setMessages((current) => current.map((message) => message.id === messageId ? { ...message, rating } : message))
    try {
      await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: rating, question: question || 'Phản hồi câu trả lời chatbot', sessionId: chatSessionId.current }),
      })
    } catch {}
  }

  const send = async (value: string) => {
    const question = value.trim()
    if (!question) return
    const now = Date.now()
    setMessages((current) => [...current, { id: now, from: 'user', text: question }])
    setInput('')
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId: chatSessionId.current }),
      })
      const data = await response.json()
      if (response.ok && data.matched && data.answer) {
        setMessages((current) => [
          ...current,
          {
            id: now + 1,
            from: 'bot',
            text: data.answer,
            href: data.linkUrl || undefined,
            linkLabel: data.linkLabel || (data.linkUrl ? 'Xem chi tiết' : undefined),
            external: Boolean(data.openNewTab),
            sourceQuestion: question,
          },
        ])
        return
      }
      if (response.ok && Array.isArray(data.suggestions)) {
        const fallback = answer(question)
        setMessages((current) => [...current, { id: now + 1, from: 'bot', ...fallback, text: data.answer || fallback.text, sourceQuestion: question, suggestions: data.suggestions }])
        return
      }
    } catch {}
    setMessages((current) => [...current, { id: now + 1, from: 'bot', ...answer(question), sourceQuestion: question }])
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(input)
  }

  return (
    <div className="websiteAssistant" style={{ '--assistant-color': primaryColor } as React.CSSProperties}>
      {backToTopEnabled && showBackToTop && !open && shouldRender(backToTopVisibility) && (
        <button className={`backToTopButton ${getVisibilityClass(backToTopVisibility)}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Lên đầu trang" title="Lên đầu trang">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
          <span>Lên đầu</span>
        </button>
      )}

      {enabled && open && shouldRender(assistantVisibility) && (
        <section className={`assistantPanel ${getVisibilityClass(assistantVisibility)}`} role="dialog" aria-label={assistantName}>
          <header className="assistantHeader">
            <span className={`assistantAvatar ${logoUrl ? 'hasLogo' : ''}`}>
              {logoUrl ? <img src={logoUrl} alt="Logo bệnh viện" /> : '✚'}
            </span>
            <div className="assistantHeaderMeta">
              <strong>{assistantName}</strong>
              <small><i /> {statusText}</small>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng trợ lý"
              className="assistantCloseBtn"
            >
              ×
            </button>
          </header>

          <div className="assistantMessages" aria-live="polite">
            {messages.map((message) => (
              <div className={`assistantMessage ${message.from}`} key={message.id}>
                <div className="assistantMessageBubble">
                  <p style={{ whiteSpace: 'pre-line' }}>{message.text}</p>
                  {message.href && (
                    <a
                      href={message.href}
                      target={message.external ? '_blank' : undefined}
                      rel={message.external ? 'noopener noreferrer' : undefined}
                      className="assistantLinkAction"
                    >
                      {message.linkLabel || 'Xem chi tiết'} →
                    </a>
                  )}
                  {message.handoffQuestion && (
                    <div className="assistantHandoffWrap">
                      <button
                        className="assistantHandoff"
                        type="button"
                        disabled={message.handoffState === 'sending'}
                        onClick={() => requestConsultation(message.id, message.handoffQuestion || '')}
                      >
                        {message.handoffState === 'sending' ? 'Đang gửi câu hỏi…' : message.handoffState === 'error' ? 'Thử gửi lại' : 'Gửi câu hỏi cho tư vấn viên'}
                      </button>
                    </div>
                  )}
                  {message.handoffState === 'error' && <small className="assistantSendError">Chưa gửi được. Vui lòng thử lại.</small>}
                  {message.consultationToken && !message.resolved && <small className="assistantWaiting">Đang đợi tư vấn viên phản hồi…</small>}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="assistantClarifyOptions">
                      {message.suggestions.map((suggestion) => (
                        <button type="button" key={suggestion.value} onClick={() => send(suggestion.value)}>{suggestion.label}</button>
                      ))}
                    </div>
                  )}
                  {message.from === 'bot' && message.sourceQuestion && (
                    <div className="assistantRating" aria-label="Đánh giá câu trả lời">
                      <span>{message.rating ? 'Cảm ơn bạn đã đánh giá' : 'Câu trả lời có hữu ích không?'}</span>
                      {!message.rating && <>
                        <button type="button" onClick={() => rateAnswer(message.id, 'up', message.sourceQuestion)} aria-label="Hữu ích">👍</button>
                        <button type="button" onClick={() => rateAnswer(message.id, 'down', message.sourceQuestion)} aria-label="Chưa đúng">👎</button>
                      </>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Danh sách chủ đề tra cứu nhanh */}
          <div className="assistantQuickTopics">
            {quickTopics.filter((topic) => {
              if (!topic.label || !topic.value) return false
              if (bookingEnabled) return true
              return !normalize(`${topic.label} ${topic.value}`).includes('dat lich')
            }).map((topic, index) => (
              <button type="button" key={`${topic.label}-${index}`} onClick={() => send(topic.value || '')}>
                {topic.label}
              </button>
            ))}
          </div>

          <form className="assistantForm" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={inputPlaceholder}
              aria-label="Nội dung cần hỏi"
            />
            <button type="submit" aria-label="Gửi câu hỏi">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" /></svg>
            </button>
          </form>

          {noticeText && <small className="assistantNotice">{noticeText}</small>}
        </section>
      )}

      {enabled && shouldRender(assistantVisibility) && (
        <button
          className={`assistantToggle ${open ? 'isOpen' : ''} ${getVisibilityClass(assistantVisibility)}`}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Đóng trợ lý' : 'Mở trợ lý hỗ trợ'}
        >
          {open ? (
            <span>×</span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 17.5A7.5 7.5 0 1 1 8.2 20L4 21l1-3.5Z" />
                <path d="M8 11h.01M12 11h.01M16 11h.01" />
              </svg>
              <i />
            </>
          )}
        </button>
      )}
    </div>
  )
}
