import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ type?: string }> }
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''
const money = (value: any) => typeof value === 'number' ? `${new Intl.NumberFormat('vi-VN').format(value)}đ` : 'Liên hệ'

export default async function VaccinationDetailPage({ params, searchParams }: Props) {
  const { id } = await params; const query = await searchParams
  let item:any; let kind = query.type || 'legacy'; let currentPrice:any
  let medpro = process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  try {
    const [payload, settings] = await Promise.all([getCMS(), getGlobal('site-settings')]); medpro=(settings as any)?.medproUrl||medpro
    if (kind === 'vaccine') {
      item = await payload.findByID({ collection:'vaccines', id, depth:2 })
      const prices = await payload.find({ collection:'vaccinePrices', where:{ and:[{ vaccine:{ equals:id } },{ active:{ equals:true } }] }, sort:'-effectiveFrom', limit:50, depth:0 })
      const now=new Date(); currentPrice=(prices.docs as any[]).find(p=>(!p.effectiveFrom||new Date(p.effectiveFrom)<=now)&&(!p.effectiveTo||new Date(p.effectiveTo)>=now))
    } else if (kind === 'schedule') item = await payload.findByID({ collection:'vaccinationSchedules', id, depth:2 })
    else item = await payload.findByID({ collection:'vaccinations', id, depth:2 })
  } catch { notFound() }
  if (!item || item.active === false) notFound()

  if (kind === 'vaccine') {
    const image=mediaUrl(item.image,'article')
    return <><SiteHeader/><main className="article-shell container vaccinationDetail"><div className="article-meta">THÔNG TIN VẮC XIN</div><h1>{item.name}</h1>{item.summary&&<p className="article-lead">{item.summary}</p>}{image&&<div className="articleCoverFrame"><img className="articleCover vaccinationDetailCover" src={image} alt={item.name}/></div>}<div className="vaccinationDetailFacts"><span>Nhà sản xuất: <b>{item.manufacturer||'-'}</b></span><span>Xuất xứ: <b>{item.origin||'-'}</b></span><span>Phòng bệnh: <b>{item.prevents||'-'}</b></span><span>Đối tượng: <b>{item.ageGroup||'-'}</b></span><span>Giá đang áp dụng: <b>{money(currentPrice?.price)}</b></span>{currentPrice?.decisionNo&&<span>Quyết định: <b>{currentPrice.decisionNo}</b></span>}</div><RichText data={item.detailContent}/>{item.note&&<p className="vaccinationDetailNote"><b>Ghi chú:</b> {item.note}</p>}<a className="btn btn-primary vaccinationRegister" href={item.registrationUrl||medpro} target="_blank" rel="noopener noreferrer">Đăng ký tiêm ngừa</a><BackToList href="/tiem-chung?tab=vaccines" label="Trở lại danh mục vắc xin"/></main><SiteFooter/></>
  }

  if (kind === 'schedule') {
    const image=mediaUrl(item.scheduleImage,'article')
    return <><SiteHeader/><main className="article-shell container vaccinationDetail"><div className="article-meta">{item.scheduleKind==='announcement'?'THÔNG BÁO TIÊM NGỪA':'LỊCH TIÊM CHỦNG'}</div><h1>{item.title}</h1>{item.summary&&<p className="article-lead">{item.summary}</p>}{image&&<div className="articleCoverFrame"><img className="articleCover vaccinationDetailCover" src={image} alt={item.title}/></div>}<div className="vaccinationDetailFacts"><span>Thời gian: <b>{formatDate(item.date)} {item.endDate?`– ${formatDate(item.endDate)}`:''}</b></span><span>Giờ tiêm: <b>{item.startTime||'Theo thông báo'} {item.endTime?`– ${item.endTime}`:''}</b></span><span>Địa điểm: <b>{item.location||'Theo thông báo của bệnh viện'}</b></span><span>Đối tượng: <b>{item.target||'Theo thông báo của bệnh viện'}</b></span></div><RichText data={item.detailContent}/>{item.note&&<p className="vaccinationDetailNote"><b>Ghi chú:</b> {item.note}</p>}<AttachmentList items={item.scheduleFile?[{file:item.scheduleFile}]:[]} title="Tệp lịch tiêm"/>{item.scheduleKind!=='announcement'&&<a className="btn btn-primary vaccinationRegister" href={item.registrationUrl||medpro} target="_blank" rel="noopener noreferrer">Đăng ký tiêm ngừa</a>}<BackToList href="/tiem-chung" label="Trở lại danh sách tiêm ngừa"/></main><SiteFooter/></>
  }

  const type=item.entryType||'campaign'; const image=mediaUrl(type==='announcement'?item.announcementImage:type==='vaccine'?item.vaccineImage:item.campaignImage,'article'); const content=type==='announcement'?item.announcementContent:item.detailContent
  return <><SiteHeader/><main className="article-shell container vaccinationDetail"><div className="article-meta">DỮ LIỆU TIÊM NGỪA CŨ</div><h1>{item.vaccineName}</h1>{item.summary&&<p className="article-lead">{item.summary}</p>}{image&&<div className="articleCoverFrame"><img className="articleCover vaccinationDetailCover" src={image} alt={item.vaccineName}/></div>}<RichText data={content}/><AttachmentList items={item.announcementFile?[{file:item.announcementFile}]:[]} title="Tệp thông báo"/><BackToList href="/tiem-chung" label="Trở lại danh sách tiêm ngừa"/></main><SiteFooter/></>
}
