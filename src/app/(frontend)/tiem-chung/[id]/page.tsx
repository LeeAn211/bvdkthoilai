import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import '../tiem-chung.css'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ type?: string }> }
const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : '')
const money = (value: any) =>
  typeof value === 'number'
    ? value === 0
      ? 'Miễn phí'
      : `${new Intl.NumberFormat('vi-VN').format(value)} đ`
    : 'Liên hệ phòng tiêm'

export default async function VaccinationDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const query = await searchParams
  let item: any
  const kind = query.type || 'legacy'
  let currentPrice: any
  let medpro = process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  let hotline = '0292 3861 234'

  try {
    const [payload, settings] = await Promise.all([getCMS(), getGlobal('site-settings')])
    medpro = (settings as any)?.medproUrl || medpro
    hotline = (settings as any)?.hotline || hotline

    if (kind === 'vaccine') {
      item = await payload.findByID({ collection: 'vaccines', id, depth: 2 })
      const prices = await payload.find({
        collection: 'vaccinePrices',
        where: { and: [{ vaccine: { equals: id } }, { active: { equals: true } }] },
        sort: '-effectiveFrom',
        limit: 50,
        depth: 0,
      })
      const now = new Date()
      currentPrice = (prices.docs as any[]).find(
        (p) => (!p.effectiveFrom || new Date(p.effectiveFrom) <= now) && (!p.effectiveTo || new Date(p.effectiveTo) >= now)
      )
    } else if (kind === 'schedule') {
      item = await payload.findByID({ collection: 'vaccinationSchedules', id, depth: 2 })
    } else {
      item = await payload.findByID({ collection: 'vaccinations', id, depth: 2 })
    }
  } catch {
    notFound()
  }

  if (!item || item.active === false) notFound()

  // 1. CHI TIẾT VẮC XIN
  if (kind === 'vaccine') {
    const isAvail = item.availability !== 'unavailable' && item.availability !== 'coming'
    const isComing = item.availability === 'coming'
    const image = mediaUrl(item.image, 'article')

    return (
      <>
        <SiteHeader />
        <PageHero
          eyebrow="THÔNG TIN VẮC XIN"
          title={item.name}
          description={item.summary || `Chi tiết vắc xin, đối tượng chỉ định và giá niêm yết tại Bệnh viện Đa khoa Khu vực Thới Lai.`}
          breadcrumb="Tiêm chủng & Vắc xin"
        />

        <main className="section">
          <div className="container vaccineDetailShell">
            <div className="vaccineDetailCard">
              <div className="vaccineDetailHeader">
                <div className="vaccineDetailMeta">
                  <span
                    className={`vaccineStatusBadge ${
                      isAvail ? 'vaccineStatusAvailable' : isComing ? 'vaccineStatusComing' : 'vaccineStatusUnavailable'
                    }`}
                  >
                    {isAvail ? '● Đang có vắc xin' : isComing ? '⏱ Sắp có vắc xin' : '✕ Tạm hết'}
                  </span>
                  {item.origin && <span className="vaccineOriginBadge">Xuất xứ: {item.origin}</span>}
                  {item.code && <span className="vaccineCardCode">Mã: {item.code}</span>}
                </div>
                <h1 className="vaccineDetailTitle">{item.name}</h1>
                {item.summary && <p className="vaccineDetailLead">{item.summary}</p>}
              </div>

              <div className="vaccineDetailGrid">
                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Giá tiêm niêm yết</span>
                  <span className="vaccineDetailFactPrice">{money(currentPrice?.price)}</span>
                  {currentPrice?.decisionNo && (
                    <small style={{ color: '#64748b', fontSize: '11px' }}>QĐ: {currentPrice.decisionNo}</small>
                  )}
                </div>

                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Đối tượng chỉ định</span>
                  <span className="vaccineDetailFactValue">{item.ageGroup || 'Theo chỉ định của bác sĩ'}</span>
                </div>

                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Bệnh phòng ngừa</span>
                  <span className="vaccineDetailFactValue" style={{ color: '#0369a1' }}>
                    {item.prevents || 'Chi tiết trong phác đồ'}
                  </span>
                </div>

                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Nhà sản xuất / Hãng</span>
                  <span className="vaccineDetailFactValue">{item.manufacturer || item.origin || 'Theo hồ sơ lưu hành'}</span>
                </div>
              </div>

              {image && (
                <div style={{ padding: '24px 32px 0', textAlign: 'center' }}>
                  <img
                    src={image}
                    alt={item.name}
                    style={{
                      maxHeight: '380px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </div>
              )}

              {item.detailContent && (
                <div className="vaccineDetailContent">
                  <RichText data={item.detailContent} />
                </div>
              )}

              {item.note && (
                <div className="vaccineDetailNoteBox">
                  <strong>Lưu ý & Khuyến nghị tiêm:</strong> {item.note}
                </div>
              )}

              <div className="vaccineDetailActionRow">
                <Link href="/tiem-chung" className="vaccineDetailBtn">
                  ← Trở lại danh mục vắc xin
                </Link>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`tel:${hotline.replace(/\s+/g, '')}`}
                    className="vaccineDetailBtn"
                    style={{ background: '#f8fafc' }}
                  >
                    📞 Gọi tư vấn: {hotline}
                  </a>
                  <a
                    href={item.registrationUrl || medpro}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vaccineBookBtn"
                    style={{ padding: '10px 20px', fontSize: '14px' }}
                  >
                    Đăng ký tiêm chủng ngay
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  // 2. CHI TIẾT LỊCH TIÊM CHỦNG
  if (kind === 'schedule') {
    const isOfficial = item.scheduleKind === 'official'
    const image = mediaUrl(item.scheduleImage, 'article')

    return (
      <>
        <SiteHeader />
        <PageHero
          eyebrow={isOfficial ? 'LỊCH TIÊM CHỦNG THƯỜNG QUY' : 'THÔNG BÁO TIÊM CHỦNG'}
          title={item.title}
          description={item.summary || 'Thông tin chi tiết thời gian, đối tượng và địa điểm tiêm chủng tại bệnh viện.'}
          breadcrumb="Tiêm chủng & Vắc xin"
        />

        <main className="section">
          <div className="container vaccineDetailShell">
            <div className="vaccineDetailCard">
              <div className="vaccineDetailHeader">
                <div className="vaccineDetailMeta">
                  <span className={`scheduleKindBadge ${isOfficial ? 'scheduleKindOfficial' : 'scheduleKindAnnouncement'}`}>
                    {isOfficial ? 'Lịch tiêm thường quy' : 'Thông báo tiêm chủng'}
                  </span>
                </div>
                <h1 className="vaccineDetailTitle">{item.title}</h1>
                {item.summary && <p className="vaccineDetailLead">{item.summary}</p>}
              </div>

              <div className="vaccineDetailGrid">
                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Thời gian áp dụng</span>
                  <span className="vaccineDetailFactValue">
                    {formatDate(item.date)} {item.endDate ? `– ${formatDate(item.endDate)}` : ''}
                  </span>
                </div>

                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Khung giờ tiêm</span>
                  <span className="vaccineDetailFactValue">
                    {item.startTime || '07h00'} {item.endTime ? `– ${item.endTime}` : ''}
                  </span>
                </div>

                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Đối tượng áp dụng</span>
                  <span className="vaccineDetailFactValue">{item.target || 'Theo thông báo của bệnh viện'}</span>
                </div>

                <div className="vaccineDetailFactBox">
                  <span className="vaccineDetailFactLabel">Địa điểm tiếp nhận</span>
                  <span className="vaccineDetailFactValue">{item.location || 'Phòng Tiêm chủng BVĐK Thới Lai'}</span>
                </div>
              </div>

              {image && (
                <div style={{ padding: '24px 32px 0', textAlign: 'center' }}>
                  <img
                    src={image}
                    alt={item.title}
                    style={{
                      maxHeight: '450px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </div>
              )}

              {item.detailContent && (
                <div className="vaccineDetailContent">
                  <RichText data={item.detailContent} />
                </div>
              )}

              {item.note && (
                <div className="vaccineDetailNoteBox">
                  <strong>Ghi chú quan trọng:</strong> {item.note}
                </div>
              )}

              {item.scheduleFile && (
                <div style={{ padding: '0 32px 20px' }}>
                  <AttachmentList items={[{ file: item.scheduleFile }]} title="Tệp đính kèm thông báo lịch tiêm" />
                </div>
              )}

              <div className="vaccineDetailActionRow">
                <Link href="/tiem-chung" className="vaccineDetailBtn">
                  ← Trở lại danh sách lịch tiêm
                </Link>

                <a
                  href={item.registrationUrl || medpro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vaccineBookBtn"
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  Đăng ký tiêm ngừa
                </a>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  // 3. DỮ LIỆU LEGACY (NẾU CÓ)
  const type = item.entryType || 'campaign'
  const image = mediaUrl(
    type === 'announcement' ? item.announcementImage : type === 'vaccine' ? item.vaccineImage : item.campaignImage,
    'article'
  )
  const content = type === 'announcement' ? item.announcementContent : item.detailContent

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="THÔNG TIN TIÊM CHỦNG"
        title={item.vaccineName || 'Thông tin tiêm ngừa'}
        description={item.summary || 'Thông tin tiêm chủng lưu trữ tại Bệnh viện Đa khoa Khu vực Thới Lai.'}
        breadcrumb="Tiêm chủng & Vắc xin"
      />
      <main className="section">
        <div className="container vaccineDetailShell">
          <div className="vaccineDetailCard">
            <div className="vaccineDetailHeader">
              <h1 className="vaccineDetailTitle">{item.vaccineName}</h1>
              {item.summary && <p className="vaccineDetailLead">{item.summary}</p>}
            </div>

            {image && (
              <div style={{ padding: '24px 32px 0', textAlign: 'center' }}>
                <img
                  src={image}
                  alt={item.vaccineName}
                  style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }}
                />
              </div>
            )}

            {content && (
              <div className="vaccineDetailContent">
                <RichText data={content} />
              </div>
            )}

            {item.announcementFile && (
              <div style={{ padding: '0 32px 20px' }}>
                <AttachmentList items={[{ file: item.announcementFile }]} title="Tệp thông báo" />
              </div>
            )}

            <div className="vaccineDetailActionRow">
              <Link href="/tiem-chung" className="vaccineDetailBtn">
                ← Trở lại danh mục
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
