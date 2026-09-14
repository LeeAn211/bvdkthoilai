import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })

async function main() {
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!email || !password || password.length < 12) {
      throw new Error('CSDL chưa có người dùng. Hãy đặt SEED_ADMIN_EMAIL và SEED_ADMIN_PASSWORD (ít nhất 12 ký tự) trước khi chạy seed.')
    }
    await payload.create({ collection: 'users', data: { name: 'Quản trị hệ thống', email, password, role: 'super-admin', status: 'active' }, overrideAccess: true } as any)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      hospitalName: 'Bệnh viện Đa khoa Khu vực Thới Lai',
      slogan: 'Chăm sóc sức khỏe – Tận tâm – Chuyên nghiệp',
      hotline: '02923689115',
      emergencyHotline: '02923689115',
      workingHours: 'Thứ 2 – Thứ 6',
      medproUrl: 'https://medpro.vn/'
    }
  })

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        { label:'Giới thiệu', url:'/gioi-thieu', visible:true },
        { label:'Sơ đồ tổ chức', url:'/so-do-to-chuc', visible:true },
        { label:'Khám & Chữa bệnh', url:'/lich-kham', visible:true },
        { label:'Tin tức', url:'/tin-tuc', visible:true },
        { label:'Thông báo', url:'/thong-bao', visible:true },
        { label:'Đấu thầu – Mua sắm', url:'/dau-thau-mua-sam', visible:true },
        { label:'Văn bản', url:'/van-ban', visible:true },
        { label:'Liên hệ', url:'/lien-he', visible:true }
      ]
    }
  })

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      banners: [
        { eyebrow: 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI', title: 'Chăm sóc sức khỏe tận tâm, thuận tiện và an toàn', description: 'Tra cứu lịch khám, dịch vụ y tế và thông tin bệnh viện nhanh chóng.', buttonLabel: 'Xem lịch khám', buttonUrl: '/lich-kham', visible: true },
        { eyebrow: 'TIÊM CHỦNG AN TOÀN', title: 'Theo dõi lịch tiêm chủng và đăng ký thuận tiện', description: 'Cập nhật lịch tiêm và các hướng dẫn cần thiết cho người dân.', buttonLabel: 'Xem lịch tiêm', buttonUrl: '/tiem-chung', visible: true },
        { eyebrow: 'DỊCH VỤ Y TẾ', title: 'Chủ động đặt lịch khám trực tuyến', description: 'Lựa chọn thời gian phù hợp và chuẩn bị thông tin trước khi đến khám.', buttonLabel: 'Đặt lịch khám', buttonUrl: 'https://medpro.vn/', visible: true },
      ],
    },
  })
}
main().then(()=>{ console.log('Seed complete'); process.exit(0) })
