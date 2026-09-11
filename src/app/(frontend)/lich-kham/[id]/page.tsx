import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

type Props = { params: Promise<{ id: string }> }
const dayNames: Record<string, string> = { '2': 'Thứ Hai', '3': 'Thứ Ba', '4': 'Thứ Tư', '5': 'Thứ Năm', '6': 'Thứ Sáu', '7': 'Thứ Bảy', '8': 'Chủ Nhật' }
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''

export default async function ScheduleDetailPage({ params }: Props) {
  const { id } = await params
  let item:any; let medpro=process.env.NEXT_PUBLIC_MEDPRO_URL||'https://medpro.vn/'
  try { const [payload,settings]=await Promise.all([getCMS(),getGlobal('site-settings')]); medpro=(settings as any)?.medproUrl||medpro; item=await payload.findByID({collection:'schedules',id,depth:2}) } catch { notFound() }
  if(!item||item.active===false)notFound()
  const mode=item.mode||'daily'
  const image=mediaUrl((mode==='attachment'?item.scheduleImage:null)||item.coverImage,'article')
  const eyebrow=mode==='attachment'?'LỊCH KHÁM ĐÍNH KÈM':mode==='weekly'?'LỊCH KHÁM THEO TUẦN':'LỊCH KHÁM THEO NGÀY'
  return <><SiteHeader/><main className="article-shell container scheduleDetail"><div className="article-meta">{eyebrow}</div><h1>{item.title}</h1>{item.summary&&<p className="article-lead">{item.summary}</p>}{image&&<div className="articleCoverFrame"><img className="articleCover scheduleDetailCover" src={image} alt={item.title}/></div>} {mode==='daily'&&<div className="scheduleDetailFacts"><span>Bác sĩ: <b>{item.doctor?.name||'Bác sĩ phụ trách'}</b></span><span>Khoa / Phòng: <b>{item.department?.name||'-'}</b></span><span>Ngày khám: <b>{formatDate(item.date)}</b></span><span>Thời gian: <b>{item.startTime||'--:--'} – {item.endTime||'--:--'}</b></span><span>Phòng khám: <b>{item.room||'-'}</b></span></div>}{mode==='weekly'&&<section className="weeklyScheduleCard scheduleDetailWeekly"><div className="weeklyScheduleHead"><div><span>LỊCH KHÁM TUẦN</span><h2>{item.title}</h2></div><strong>{formatDate(item.weekStart)} {item.weekEnd?`– ${formatDate(item.weekEnd)}`:''}</strong></div><div className="weeklyScheduleGrid">{(item.weeklySlots||[]).map((slot:any,index:number)=><article key={slot.id||index}><div className="weeklyDay"><strong>{dayNames[slot.dayOfWeek]||'Ngày khám'}</strong><span>{slot.startTime} – {slot.endTime}</span></div><div><b>{slot.doctor?.name||'Bác sĩ'}</b><span>{slot.department?.name||''}</span><small>{slot.room||'Phòng khám cập nhật tại quầy'}{slot.note?` · ${slot.note}`:''}</small></div></article>)}</div></section>}<RichText data={item.detailContent}/>{item.note&&<p className="vaccinationDetailNote"><b>Ghi chú:</b> {item.note}</p>}<AttachmentList items={[...(item.scheduleFile?[{file:item.scheduleFile}]:[]), ...((item.attachmentFiles||[]).map((entry:any)=>({file:entry.file,label:entry.label})))]} title="Tệp lịch khám"/><div className="scheduleDetailActions"><a className="btn btn-primary" href={medpro} target="_blank" rel="noopener noreferrer">Đặt lịch khám</a><BackToList href="/lich-kham" label="Trở lại danh sách lịch khám"/></div></main><SiteFooter/></>
}
