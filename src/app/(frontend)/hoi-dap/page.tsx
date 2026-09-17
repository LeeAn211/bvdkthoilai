import type { Metadata } from 'next'
import Link from 'next/link'
import { getCMS, getGlobal } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Hỏi đáp y tế & Câu hỏi thường gặp — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Giải đáp các thắc mắc thường gặp về chế độ BHYT, thủ tục khám chữa bệnh, lịch trực cấp cứu và biểu phí tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

// Danh sách câu hỏi thường gặp chuẩn bị sẵn phục vụ người bệnh
const DEFAULT_FAQS = [
  {
    id: 'faq-bhyt',
    question: 'Khám BHYT tại Bệnh viện Đa khoa Khu vực Thới Lai được hưởng quyền lợi như thế nào?',
    answer: 'Người tham gia BHYT đăng ký khám chữa bệnh ban đầu tại Bệnh viện Đa khoa Khu vực Thới Lai hoặc thông tuyến quận/huyện trong toàn quốc đều được hưởng 100% mức quyền lợi theo quy định (80%, 95% hoặc 100% chi phí tùy theo mã thẻ BHYT). Bệnh viện hỗ trợ xuất trình thẻ BHYT trên ứng dụng VssID hoặc CCCD gắn chip khi làm thủ tục.',
    category: 'Chế độ BHYT',
  },
  {
    id: 'faq-gio-kham',
    question: 'Bệnh viện bắt đầu phát số và tiếp nhận khám từ mấy giờ?',
    answer: 'Khu vực quầy tiếp đón phát số thứ tự tự động từ 06:00 sáng. Bác sĩ tại các chuyên khoa trọng điểm (Khám bệnh, Ngoại – GMHS, Sản phụ khoa) bắt đầu khám từ 06:30 sáng. Các chuyên khoa còn lại khám từ 07:00. Khoa Cấp cứu tiếp nhận 24/24 tất cả các ngày trong tuần.',
    category: 'Giờ khám & Đón tiếp',
  },
  {
    id: 'faq-dat-lich',
    question: 'Làm thế nào để đặt lịch hẹn khám trước để không phải chờ đợi?',
    answer: 'Người bệnh có thể đặt lịch hẹn khám trước thông qua ứng dụng Medpro, gọi đến hotline tư vấn 02923686115 trong giờ hành chính, hoặc sử dụng tính năng Trợ lý ảo trực tuyến ngay tại góc dưới website.',
    category: 'Thủ tục khám',
  },
  {
    id: 'faq-chuyen-tuyen',
    question: 'Thủ tục chuyển tuyến lên bệnh viện tuyến trên được xử lý thế nào?',
    answer: 'Khi tình trạng bệnh vượt quá khả năng chuyên môn kỹ thuật của bệnh viện, bác sĩ điều trị sẽ hội chẩn và lập Giấy chuyển tuyến BHYT theo đúng quy định của Bộ Y tế, đảm bảo người bệnh được chuyển tuyến an toàn và hưởng đầy đủ quyền lợi BHYT tại tuyến trên.',
    category: 'Chế độ BHYT',
  },
  {
    id: 'faq-tiem-chung',
    question: 'Bệnh viện có cung cấp dịch vụ tiêm chủng vắc xin không?',
    answer: 'Phòng Tiêm chủng của bệnh viện thực hiện tiêm chủng mở rộng định kỳ cho trẻ em và cung cấp đầy đủ các loại vắc xin dịch vụ chất lượng cao (Cúm, Phế cầu, Dại, Viêm gan B, Uốn ván...). Người dân có thể tra cứu danh mục và bảng giá vắc xin trực tiếp tại mục Tiêm chủng trên website.',
    category: 'Dịch vụ y tế',
  },
  {
    id: 'faq-tra-cuu-phan-anh',
    question: 'Tôi đã gửi ý kiến phản ánh thì bao lâu sẽ nhận được câu trả lời?',
    answer: 'Tất cả các ý kiến đóng góp và phản ánh được Phòng Quản lý chất lượng & CSKH tiếp nhận xử lý trong vòng 24–48 giờ làm việc. Bạn có thể sử dụng Mã phản hồi để tra cứu trực tuyến tiến độ giải quyết tại trang "Tra cứu phản ánh" trên website.',
    category: 'Góp ý – CSKH',
  },
]

export default async function FaqHubPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>
}) {
  const params = await searchParams
  const selectedCat = params?.cat || 'all'
  const searchKeyword = (params?.q || '').toLowerCase().trim()

  let siteSettings: any = {}
  let cmsFaqs: any[] = []

  let faqConf: any = {}
  try {
    const [specFaq, settings, payload] = await Promise.all([
      getGlobal('faq-page-settings' as any).catch(() => null),
      getGlobal('site-settings' as any).catch(() => ({})),
      getCMS().catch(() => null),
    ])
    siteSettings = settings || {}
    faqConf = (specFaq && Object.keys(specFaq).length > 0) ? specFaq : (siteSettings?.faqPage || {})

    if (payload) {
      const res = await payload.find({
        collection: 'faqs',
        where: {
          and: [
            { active: { equals: true } },
          ],
        },
        limit: 100,
        sort: 'order',
        overrideAccess: true,
      }).catch(() => ({ docs: [] }))

      cmsFaqs = res.docs || []
    }
  } catch {}
  const eyebrow = faqConf.eyebrow || 'CHĂM SÓC NGƯỜI BỆNH & GIẢI ĐÁP'
  const title = faqConf.title || 'Hỏi đáp Y tế & Câu hỏi thường gặp'
  const description = faqConf.description || 'Tổng hợp các giải đáp chính xác, nhanh chóng nhất về chính sách khám chữa bệnh, quyền lợi bảo hiểm và hướng dẫn thủ tục tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  // Kết hợp faqs từ CMS hoặc dùng fallback
  const rawList = cmsFaqs.length > 0
    ? cmsFaqs.map((f: any) => ({
        id: f.id,
        question: f.question,
        answer: typeof f.answer === 'string' ? f.answer : (f.answer?.root?.children?.[0]?.children?.[0]?.text || 'Chi tiết vui lòng liên hệ quầy tư vấn.'),
        category: f.category || 'Chung',
      }))
    : DEFAULT_FAQS

  // Lọc theo chuyên mục & từ khóa
  const filteredFaqs = rawList.filter(item => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat
    const matchKeyword = !searchKeyword ||
      item.question.toLowerCase().includes(searchKeyword) ||
      item.answer.toLowerCase().includes(searchKeyword)
    return matchCat && matchKeyword
  })

  // Danh sách các categories duy nhất
  const categories = ['all', ...Array.from(new Set(rawList.map(item => item.category))).filter(Boolean)]

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Hỏi đáp y tế"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="hoi-dap" />

          {faqConf.showNoticeBanner && (
            <div className="patientCareNoticeBanner" style={{ textAlign: faqConf.noticeAlign || 'left' }}>
              <div className="patientCareNoticeHeader">
                <div className="patientCareNoticeIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="patientCareNoticeTitle">{faqConf.noticeTitle || 'Thông tin giải đáp'}</h2>
              </div>
              <p className="patientCareNoticeContent">{faqConf.noticeContent}</p>
            </div>
          )}

          {/* Thanh tìm kiếm & Phân loại câu hỏi */}
          <div className="faqFilterBar">
            <form action="/hoi-dap" method="GET" style={{ display: 'flex', gap: '10px', flex: 1 }}>
              <input
                type="search"
                name="q"
                defaultValue={params?.q || ''}
                placeholder="Tìm kiếm câu hỏi hoặc nội dung bạn cần biết..."
                className="faqSearchInput"
              />
              {selectedCat !== 'all' && <input type="hidden" name="cat" value={selectedCat} />}
              <button type="submit" className="btnCarePrimary" style={{ flex: 'none', padding: '10px 20px' }}>
                Tìm kiếm
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {categories.map((cat) => {
              const label = cat === 'all' ? 'Tất cả chủ đề' : cat
              const isSelected = selectedCat === cat
              const href = cat === 'all'
                ? (searchKeyword ? `/hoi-dap?q=${encodeURIComponent(searchKeyword)}` : '/hoi-dap')
                : `/hoi-dap?cat=${encodeURIComponent(cat)}${searchKeyword ? `&q=${encodeURIComponent(searchKeyword)}` : ''}`

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`faqCategoryChip ${isSelected ? 'active' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Danh sách câu hỏi Accordion */}
          {filteredFaqs.length > 0 ? (
            <div className="faqAccordionList">
              {filteredFaqs.map((faq, idx) => (
                <details key={faq.id || idx} className="faqItem" open={idx === 0}>
                  <summary className="faqSummary">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#0284c7', fontWeight: 800 }}>Q{idx + 1}.</span>
                      <span>{faq.question}</span>
                    </span>
                    <span className="faqSummaryIcon" aria-hidden="true">▼</span>
                  </summary>
                  <div className="faqAnswer">
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="patientCareCardBadge badgePeriodic">{faq.category}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Bệnh viện Đa khoa Khu vực Thới Lai</span>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="patientCareNoticeBanner" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '16px', color: '#0f172a', fontWeight: 700, margin: '0 0 8px' }}>
                Không tìm thấy câu hỏi phù hợp với từ khóa "{searchKeyword}"
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 18px' }}>
                Quý vị có thể gửi câu hỏi mới trực tiếp đến bác sĩ hoặc sử dụng Trợ lý tư vấn trực tuyến.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Link href="/hoi-dap" className="btnCareSecondary">
                  Xóa bộ lọc
                </Link>
                <Link href="/gop-y" className="btnCarePrimary" style={{ flex: 'none' }}>
                  Gửi câu hỏi mới →
                </Link>
              </div>
            </div>
          )}

          {/* CTA Banner */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Vẫn chưa tìm thấy câu trả lời bạn cần?</h3>
              <p>Trợ lý ảo thông minh Thới Lai và Đội ngũ Chăm sóc khách hàng trực tuyến luôn sẵn sàng giải đáp thắc mắc của bạn 24/7.</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href="/gop-y" className="btnCtaWhite">
                Đặt câu hỏi riêng
              </Link>
              <Link href="/lien-he" className="btnCtaOutline">
                Hotline bệnh viện
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
