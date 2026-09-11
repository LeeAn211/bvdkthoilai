import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PageHero } from '@/components/PageHero'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './org-chart.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Cơ cấu tổ chức - Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Sơ đồ cơ cấu tổ chức bộ máy, Ban Giám đốc và các Phòng, Khoa trực thuộc Bệnh viện Đa khoa Khu vực Thới Lai theo chuẩn quốc gia.',
}

const unitValue = (entry: any) => (entry?.unit && typeof entry.unit === 'object' ? entry.unit : null)

interface LeaderProps {
  person: any
  kind: 'director' | 'deputy'
  fallbackRole: string
  fallbackDoctor?: any
}

function LeaderCard({ person, kind, fallbackRole, fallbackDoctor }: LeaderProps) {
  const linkedDoc = person?.doctorRef && typeof person.doctorRef === 'object'
    ? person.doctorRef
    : fallbackDoctor

  const rawPhoto = person?.photo
  const photoUrl = mediaUrl(rawPhoto, 'card') || (linkedDoc?.avatar ? mediaUrl(linkedDoc.avatar, 'card') : '')
  const name = person?.name?.trim() || linkedDoc?.name || 'Đang cập nhật'
  const title = person?.title?.trim() || linkedDoc?.title || fallbackRole
  const responsibility = person?.responsibility?.trim() || (linkedDoc?.expertise || linkedDoc?.bio || '')
  const docUrl = linkedDoc?.slug ? `/bac-si/${linkedDoc.slug}` : undefined

  const cardContent = (
    <>
      <div className="bmLeaderPhotoBox">
        {photoUrl ? (
          <img src={photoUrl} alt={name} loading="lazy" />
        ) : (
          <div className="bmLeaderPlaceholder">
            <span>{name.trim().slice(0, 1) || '✚'}</span>
          </div>
        )}
      </div>
      <div className="bmLeaderMeta">
        <div className="bmLeaderRole">{title}</div>
        <h3 className="bmLeaderName">{name}</h3>
        {responsibility && <p className="bmLeaderDesc">{responsibility}</p>}
      </div>
    </>
  )

  if (docUrl) {
    return (
      <Link
        href={docUrl}
        className={kind === 'director' ? 'bmDirectorCard' : 'bmDeputyCard'}
        title={`Xem thông tin chi tiết: ${name}`}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div className={kind === 'director' ? 'bmDirectorCard' : 'bmDeputyCard'}>
      {cardContent}
    </div>
  )
}

export default async function OrganizationChartPage() {
  let chart: any = {}
  let allUnits: any[] = []
  let doctors: any[] = []

  try {
    const [settings, payload] = await Promise.all([getGlobal('organization-chart'), getCMS()])
    chart = settings
    const [unitsRes, docsRes] = await Promise.all([
      payload.find({ collection: 'departments', limit: 100, sort: ['order', 'name'], depth: 1 }),
      payload.find({ collection: 'doctors', where: { active: { equals: true } }, limit: 100, sort: ['order', 'name'], depth: 1 }),
    ])
    allUnits = unitsRes.docs as any[]
    doctors = docsRes.docs as any[]
  } catch {}

  // Lọc Ban Giám đốc từ DB Bác sĩ
  const boardDoctors = doctors.filter((doc: any) => {
    const dName = typeof doc.department === 'object' ? doc.department?.name : ''
    const t = `${doc.title || ''} ${doc.name || ''}`.toLowerCase()
    return dName.includes('Ban Giám đốc') || t.includes('giám đốc')
  })

  const directorDoctor = boardDoctors.find((d: any) => {
    const t = `${d.title || ''}`.toLowerCase()
    return (t.includes('giám đốc') || t.includes('gián đốc')) && !t.includes('phó')
  }) || doctors.find((d: any) => d.slug?.includes('tran-quoc-luan') || d.name?.includes('Trần Quốc Luận'))

  const deputyDoctors = boardDoctors.filter((d: any) => {
    const t = `${d.title || ''}`.toLowerCase()
    return t.includes('phó giám đốc') || (d.id !== directorDoctor?.id && d.name !== directorDoctor?.name)
  })
  // Đọc danh sách khoa phòng - luôn lấy từ CSDL thực
  const activeUnits = allUnits.filter((u) => u.active !== false && !u.name?.includes('Ban Giám đốc'))

  // Phân loại đơn vị theo chuẩn:
  // 1. Khối Phòng chức năng (office)
  // 2. Khối Lâm sàng (clinical)
  // 3. Khối Cận lâm sàng (paraclinical)
  // LUON lấy từ CSDL thực - nếu admin có thiết lập danh sách ưu tiên dùng đó, ngược lại tự phân loại từ unitType
  const configuredOffices = (chart?.offices || []).map(unitValue).filter(Boolean)
  const configuredDepartments = (chart?.departments || []).map(unitValue).filter(Boolean)

  // Phòng chức năng: admin chọn hoặc tự lậc theo unitType='office'
  const offices = configuredOffices.length > 0
    ? configuredOffices
    : activeUnits.filter((u) => u.unitType === 'office' || u.kind === 'office')

  // Khối lâm sàng: admin chọn hoặc tự lậc theo unitType='clinical'
  const clinicalUnits = configuredDepartments.length > 0
    ? configuredDepartments.filter((u: any) => u.unitType === 'clinical' || u.kind === 'clinical')
    : activeUnits.filter((u) => (u.unitType === 'clinical' || u.kind === 'clinical') && u.unitType !== 'office')

  // Khối cận lâm sàng: luôn lấy từ CSDL thực (không phụ thuộc configuredDepartments)
  const paraclinicalUnits = activeUnits.filter(
    (u) => u.unitType === 'paraclinical' || u.kind === 'paraclinical'
  )

  // Phó giám đốc
  const rawDeputies = Array.isArray(chart?.deputyDirectors) ? chart.deputyDirectors.filter((p: any) => p?.name?.trim() || p?.doctorRef) : []
  const deputies = rawDeputies.length > 0
    ? rawDeputies
    : (deputyDoctors.length > 0 ? deputyDoctors.map((doc: any) => ({ name: doc.name, title: doc.title, doctorRef: doc })) : [])

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CƠ CẤU BỘ MÁY"
        title="Sơ đồ tổ chức Bệnh viện"
        description="Cơ cấu tổ chức bộ máy và hệ thống các khoa, phòng trực thuộc Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="bmOrgPage">
        <div className="container">
          {/* SECTION 1: BAN LÃNH ĐẠO BỆNH VIỆN */}
          <section className="bmLeadershipSection" aria-label="Ban Lãnh đạo Bệnh Viện">
            <div className="bmSectionHeader">
              <h2 className="bmSectionTitle">Ban Lãnh đạo Bệnh Viện</h2>
            </div>

            {/* Giám đốc ở trên cùng */}
            <div className="bmDirectorWrap">
              <LeaderCard
                kind="director"
                person={chart?.director}
                fallbackRole="Giám đốc Bệnh viện"
                fallbackDoctor={directorDoctor}
              />
            </div>

            {/* Các Phó Giám đốc ở hàng dưới - tự cănh chỉnh theo số lượng */}
            {deputies.length > 0 && (
              <div
                className="bmDeputiesGrid"
                data-count={String(Math.min(deputies.length, 8))}
              >
                {deputies.map((person: any, index: number) => (
                  <LeaderCard
                    key={person?.id || index}
                    kind="deputy"
                    person={person}
                    fallbackRole="Phó Giám đốc Bệnh viện"
                    fallbackDoctor={deputyDoctors[index]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: SƠ ĐỒ TỔ CHỨC BỘ MÁY */}
          <section className="bmTreeSection" aria-label="Sơ đồ tổ chức bộ máy">
            <div className="bmSectionHeader treeHead">
              <h2 className="bmSectionTitle">Sơ đồ tổ chức bộ máy</h2>
            </div>

            <div className="bmTreeWrap">
              {/* Cấp cao nhất: BAN GIÁM ĐỐC */}
              <div className="bmTreeBoardWrap">
                <div className="bmTreeBoardBox">
                  <h3 className="bmTreeBoardBoxTitle">Ban Giám Đốc</h3>
                  <div className="bmTreeBoardBoxSub">Chỉ đạo & Điều hành toàn diện</div>
                </div>
              </div>

              {/* Đường nối xuống các khối */}
              <div className="bmTreeVerticalLine" aria-hidden="true" />
              <div className="bmTreeBranchContainer" aria-hidden="true">
                <div className="bmTreeBranchLine" />
                <div className="bmTreeBranchCenterLine" />
              </div>

              {/* 3 Khối Cột Chuẩn: Phòng Chức năng / Lâm sàng / Cận lâm sàng */}
              <div className="bmColumnsGrid">
                {/* Cột 1: Phòng Chức năng / VP */}
                <div className="bmColumnCard offices">
                  <div className="bmColumnHeader">
                    <div className="bmColumnHeaderLeft">
                      <span className="bmColumnIcon">🏢</span>
                      <h4 className="bmColumnHeaderTitle">Phòng Chức năng / VP</h4>
                    </div>
                    <span className="bmColumnCount">{offices.length}</span>
                  </div>
                  <ul className="bmUnitList">
                    {offices.map((unit: any, idx: number) => (
                      <li key={unit.id || idx} className="bmUnitItem">
                        <Link href={unit.slug ? `/khoa-phong/${unit.slug}` : '/khoa-phong'} className="bmUnitLink">
                          <span>{unit.name}</span>
                          <i>→</i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cột 2: Khối Lâm sàng - Khoa */}
                <div className="bmColumnCard clinical">
                  <div className="bmColumnHeader">
                    <div className="bmColumnHeaderLeft">
                      <span className="bmColumnIcon">🩺</span>
                      <h4 className="bmColumnHeaderTitle">Khối Lâm sàng - Khoa</h4>
                    </div>
                    <span className="bmColumnCount">{clinicalUnits.length}</span>
                  </div>
                  <ul className="bmUnitList">
                    {clinicalUnits.map((unit: any, idx: number) => (
                      <li key={unit.id || idx} className="bmUnitItem">
                        <Link href={unit.slug ? `/khoa-phong/${unit.slug}` : '/khoa-phong'} className="bmUnitLink">
                          <span>{unit.name}</span>
                          <i>→</i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cột 3: Khối Cận lâm sàng */}
                <div className="bmColumnCard paraclinical">
                  <div className="bmColumnHeader">
                    <div className="bmColumnHeaderLeft">
                      <span className="bmColumnIcon">🔬</span>
                      <h4 className="bmColumnHeaderTitle">Khối Cận lâm sàng</h4>
                    </div>
                    <span className="bmColumnCount">{paraclinicalUnits.length}</span>
                  </div>
                  <ul className="bmUnitList">
                    {paraclinicalUnits.map((unit: any, idx: number) => (
                      <li key={unit.id || idx} className="bmUnitItem">
                        <Link href={unit.slug ? `/khoa-phong/${unit.slug}` : '/khoa-phong'} className="bmUnitLink">
                          <span>{unit.name}</span>
                          <i>→</i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hộp Thông tin Nguyên tắc Phối hợp */}
              <div className="bmOrgInfoBox">
                <div className="bmOrgInfoIcon">ℹ️</div>
                <div className="bmOrgInfoContent">
                  <h4>Nguyên tắc hoạt động & Phối hợp chuyên môn</h4>
                  <p>
                    Bệnh viện Đa khoa Khu vực Thới Lai hoạt động dưới sự lãnh đạo tập trung của Ban Giám đốc. Các Phòng chức năng đóng vai trò tham mưu, tổng hợp và giám sát quy trình nghiệp vụ; các Khoa Lâm sàng và Cận lâm sàng phối hợp chặt chẽ trong tiếp nhận, cấp cứu, chẩn đoán và điều trị người bệnh với tinh thần trách nhiệm cao nhất.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
