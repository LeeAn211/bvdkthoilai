import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

export const metadata: Metadata = {
  title: 'Sơ đồ tổ chức',
  description: 'Cơ cấu Ban Giám đốc, các khoa và phòng thuộc Bệnh viện Đa khoa Khu vực Thới Lai.',
}

const unitValue = (entry: any) => entry?.unit && typeof entry.unit === 'object' ? entry.unit : null
const LeaderCard = ({ person, kind }: { person: any; kind: 'director' | 'deputy' }) => {
  const photo = mediaUrl(person?.photo, 'thumb')
  return <article className={`orgLeaderCard ${kind}`}>
    <div className="orgPortrait">{photo ? <img src={photo} alt={person?.name || person?.title || 'Ban Giám đốc'}/> : <span>{person?.name?.trim()?.slice(0, 1) || '✚'}</span>}</div>
    <div><span>{person?.title || (kind === 'director' ? 'GIÁM ĐỐC' : 'PHÓ GIÁM ĐỐC')}</span><h2>{person?.name || 'Đang cập nhật'}</h2>{person?.responsibility && <p>{person.responsibility}</p>}</div>
  </article>
}

export default async function OrganizationChartPage() {
  let chart: any = {}; let allUnits: any[] = []
  try {
    const [settings, payload] = await Promise.all([getGlobal('organization-chart'), getCMS()])
    chart = settings
    const result = await payload.find({ collection: 'departments', limit: 100, sort: 'name', depth: 1 })
    allUnits = result.docs as any[]
  } catch {}

  const configuredOffices = (chart?.offices || []).map(unitValue).filter(Boolean)
  const configuredDepartments = (chart?.departments || []).map(unitValue).filter(Boolean)
  const offices = configuredOffices.length ? configuredOffices.slice(0, 4) : allUnits.filter(unit => unit.kind === 'office').slice(0, 4)
  const departments = configuredDepartments.length ? configuredDepartments.slice(0, 9) : allUnits.filter(unit => unit.kind !== 'office').slice(0, 9)
  const deputies = (Array.isArray(chart?.deputyDirectors) ? chart.deputyDirectors : []).filter((person: any) => person?.name?.trim())
  const appearance = chart?.appearance || {}
  const style = {
    '--org-primary': appearance.primaryColor || '#0878D1', '--org-director': appearance.directorColor || '#075B9E',
    '--org-deputy': appearance.deputyColor || '#0B84D8', '--org-office': appearance.officeColor || '#188B72',
    '--org-department': appearance.departmentColor || '#6B62C8',
  } as CSSProperties

  return <><SiteHeader/><main className="organizationPage" style={style}>
    <header className="organizationIntro container"><span>CƠ CẤU BỘ MÁY</span><h1>{chart?.pageTitle || 'Sơ đồ tổ chức Bệnh viện Đa khoa Khu vực Thới Lai'}</h1><p>{chart?.description || 'Cơ cấu tổ chức và hệ thống các khoa, phòng trực thuộc bệnh viện.'}</p></header>
    <section className="organizationChart container" aria-label="Sơ đồ tổ chức bệnh viện">
      <div className="orgLevelLabel">BẬC 1</div><div className="orgDirectorLevel"><LeaderCard kind="director" person={chart?.director || { title: 'GIÁM ĐỐC', name: 'Đang cập nhật' }}/></div>
      {deputies.length > 0 ? <><div className="orgConnector vertical" aria-hidden="true"/>
      <div className="orgLevelLabel">BẬC 2</div><div className={`orgDeputyLevel count${deputies.length}`}>{deputies.map((person: any, index: number) => <LeaderCard kind="deputy" person={person} key={person?.id || index}/>)}</div>
      <div className="orgConnector vertical lower" aria-hidden="true"/></> : <div className="orgConnector vertical lower" aria-hidden="true"/>}
      <div className="orgLevelLabel">BẬC 3</div><div className="orgUnitsLevel">
        <section className="orgUnitGroup offices"><header><span>04</span><div><small>KHỐI CHỨC NĂNG</small><h2>Phòng</h2></div></header><div>{Array.from({length:4},(_,i)=>offices[i]||{name:`Phòng ${i+1}`}).map((unit:any,index)=><a href={unit.slug?`/khoa-phong/${unit.slug}`:'/khoa-phong'} key={unit.id||index}><b>{String(index+1).padStart(2,'0')}</b><span><strong>{unit.name}</strong>{unit.leader&&<small>Phụ trách: {unit.leader}</small>}</span><i>→</i></a>)}</div></section>
        <section className="orgUnitGroup departments"><header><span>09</span><div><small>KHỐI CHUYÊN MÔN</small><h2>Khoa</h2></div></header><div>{Array.from({length:9},(_,i)=>departments[i]||{name:`Khoa ${i+1}`}).map((unit:any,index)=><a href={unit.slug?`/khoa-phong/${unit.slug}`:'/khoa-phong'} key={unit.id||index}><b>{String(index+1).padStart(2,'0')}</b><span><strong>{unit.name}</strong>{unit.leader&&<small>Phụ trách: {unit.leader}</small>}</span><i>→</i></a>)}</div></section>
      </div>
    </section>
  </main><SiteFooter/></>
}
