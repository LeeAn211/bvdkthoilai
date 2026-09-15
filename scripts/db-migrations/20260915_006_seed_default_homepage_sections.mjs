export const id = '20260915_006_seed_default_homepage_sections'
export const description = 'Nạp 12 khối section chuẩn y tế cho homepage nếu bảng homepage_sections đang trống'
export const transactional = false

export async function up({ client }) {
  // 1. Đảm bảo đã có bản ghi trong bảng homepage (id = 1)
  const hpCheck = await client.query('SELECT id FROM public."homepage" LIMIT 1;')
  let homepageId = 1
  if (hpCheck.rowCount === 0) {
    const hpInsert = await client.query(`
      INSERT INTO public."homepage" (
        "hero_eyebrow", "hero_title", "hero_description",
        "show_hero_banners", "banner_autoplay_seconds", "enable_section_scroll_snap",
        "intro_eyebrow", "intro_title", "intro_description",
        "_status", "created_at", "updated_at"
      ) VALUES (
        'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI',
        'Chăm sóc sức khỏe tận tâm, thuận tiện và an toàn',
        'Đồng hành cùng sức khỏe cộng đồng',
        true, 5, true,
        'VỀ CHÚNG TÔI',
        'Đồng hành cùng sức khỏe cộng đồng',
        'Không ngừng nâng cao chất lượng khám chữa bệnh.',
        'published', NOW(), NOW()
      ) RETURNING id;
    `)
    homepageId = hpInsert.rows[0].id
  } else {
    homepageId = hpCheck.rows[0].id
  }

  // 2. Kiểm tra nếu bảng homepage_sections đã có dữ liệu thì không ghi đè
  const secCheck = await client.query('SELECT count(*) as total FROM public."homepage_sections" WHERE "_parent_id" = $1;', [homepageId])
  if (parseInt(secCheck.rows[0].total, 10) > 0) {
    return // Đã có sections, giữ nguyên cho quản trị viên
  }

  // 3. Danh sách 12 khối Section chuẩn y tế mặc định
  const sections = [
    {
      order: 1,
      id: 'sec_featured_news',
      type: 'featured-news',
      visible: true,
      eyebrow: 'HOẠT ĐỘNG NỔI BẬT TẠI BỆNH VIỆN',
      title: 'Điểm tin Bệnh viện Đa khoa khu vực Thới Lai',
      description: 'Các hoạt động chuyên môn, chăm sóc người bệnh và sự kiện tiêu biểu mới nhất.',
      featuredItemLimit: 16,
      carouselSeconds: 4.5,
      featuredSeeAllUrl: '/tin-tuc',
    },
    {
      order: 2,
      id: 'sec_adv_techniques',
      type: 'advanced-techniques',
      visible: true,
      eyebrow: 'CHUYÊN KHOA & CÔNG NGHỆ Y TẾ',
      title: 'Kỹ thuật chuyên sâu',
      description: 'Tiên phong ứng dụng các kỹ thuật cao, trang thiết bị hiện đại phục vụ chăm sóc và điều trị.',
      techniqueItemsPerView: 3,
      techniqueAutoplaySeconds: 5,
      cardBarBgColor: '#f0f7fd',
      cardBarTextColor: '#0754a8',
    },
    {
      order: 3,
      id: 'sec_our_experts',
      type: 'our-experts',
      visible: true,
      eyebrow: 'ĐỘI NGŨ Y BÁC SĨ',
      title: 'Chuyên gia của chúng tôi',
      description: 'Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn sâu, luôn tận tâm vì sức khỏe người bệnh.',
      expertItemsPerView: 4,
      expertAutoplaySeconds: 5,
      expertCardBgColor: '#f0f7fd',
      expertCardTextColor: '#0754a8',
    },
    {
      order: 4,
      id: 'sec_news_portal',
      type: 'news-portal',
      visible: true,
      eyebrow: 'CỔNG THÔNG TIN BỆNH VIỆN',
      title: 'Trang tin tức Bệnh viện',
      description: null,
    },
    {
      order: 5,
      id: 'sec_organization',
      type: 'organization',
      visible: true,
      eyebrow: 'TỔ CHỨC BỆNH VIỆN',
      title: 'Đơn vị trực thuộc',
      description: null,
      orgMedproEnabled: true,
      orgMedproEyebrow: 'ĐẶT LỊCH KHÁM QUA MEDPRO',
      orgMedproTitle: 'Chủ động thời gian – Giảm thời gian chờ đợi',
      orgMedproBullet1: 'Đặt lịch nhanh chóng',
      orgMedproBullet2: 'Chọn bác sĩ theo nhu cầu',
      orgMedproBullet3: 'Nhận nhắc hẹn tự động',
      orgMedproButtonLabel: 'ĐẶT LỊCH NGAY',
      orgMedproGuideLabel: 'Hướng dẫn đặt lịch khám',
      orgMedproGuideUrl: '/lich-kham',
    },
    {
      order: 6,
      id: 'sec_notices',
      type: 'notices',
      visible: true,
      eyebrow: 'THÔNG BÁO',
      title: 'Thông báo mới từ bệnh viện',
      description: 'Cập nhật thông tin quan trọng dành cho người bệnh và cộng đồng.',
    },
    {
      order: 7,
      id: 'sec_procurement',
      type: 'procurement',
      visible: true,
      eyebrow: 'CÔNG KHAI MUA SẮM',
      title: 'Đấu thầu – Mua sắm',
      description: 'Thông tin mời thầu, kế hoạch lựa chọn nhà thầu và kết quả mua sắm.',
    },
    {
      order: 8,
      id: 'sec_schedules',
      type: 'schedules',
      visible: true,
      eyebrow: 'THÔNG TIN KHÁM BỆNH',
      title: 'Lịch khám bệnh',
      description: 'Tra cứu bác sĩ, chuyên khoa, thời gian và phòng khám trước khi đến bệnh viện.',
    },
    {
      order: 9,
      id: 'sec_vaccinations',
      type: 'vaccinations',
      visible: true,
      eyebrow: 'TIÊM NGỪA AN TOÀN',
      title: 'Thông tin tiêm ngừa',
      description: 'Thông báo lịch tiêm chung, các đợt tiêm và danh mục vắc xin tại bệnh viện.',
    },
    {
      order: 10,
      id: 'sec_science',
      type: 'science',
      visible: true,
      eyebrow: 'CHUYÊN MÔN – ĐÀO TẠO',
      title: 'Hoạt động khoa học',
      description: null,
    },
    {
      order: 11,
      id: 'sec_introduction',
      type: 'introduction',
      visible: true,
      eyebrow: 'VỀ CHÚNG TÔI',
      title: 'Đồng hành cùng sức khỏe cộng đồng',
      description: null,
    },
    {
      order: 12,
      id: 'sec_documents',
      type: 'documents',
      visible: true,
      eyebrow: 'TÀI LIỆU CÔNG KHAI',
      title: 'Văn bản mới',
      description: 'Quyết định, biểu mẫu và tài liệu được cập nhật từ hệ thống quản trị.',
    },
  ]

  for (const s of sections) {
    await client.query(`
      INSERT INTO public."homepage_sections" (
        "_parent_id", "_order", "id", "type", "visible", "eyebrow", "title", "description",
        "technique_autoplay_seconds", "technique_items_per_view",
        "card_bar_bg_color", "card_bar_text_color",
        "expert_autoplay_seconds", "expert_items_per_view",
        "expert_card_bg_color", "expert_card_text_color",
        "carousel_seconds", "featured_item_limit", "featured_filter_mode", "featured_see_all_url", "featured_card_fit",
        "organization_medpro_enabled", "organization_medpro_eyebrow", "organization_medpro_title",
        "organization_medpro_bullet1", "organization_medpro_bullet2", "organization_medpro_bullet3",
        "organization_medpro_button_label", "organization_medpro_guide_label", "organization_medpro_guide_url",
        "padding_top", "padding_bottom", "content_width", "heading_gap"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'all', $19, 'cover',
        $20, $21, $22, $23, $24, $25, $26, $27, $28,
        42, 42, 1180, 18
      ) ON CONFLICT ("id") DO NOTHING;
    `, [
      homepageId,
      s.order,
      s.id,
      s.type,
      s.visible,
      s.eyebrow,
      s.title,
      s.description,
      s.techniqueAutoplaySeconds || 5,
      s.techniqueItemsPerView || 3,
      s.cardBarBgColor || null,
      s.cardBarTextColor || null,
      s.expertAutoplaySeconds || 5,
      s.expertItemsPerView || 4,
      s.expertCardBgColor || null,
      s.expertCardTextColor || null,
      s.carouselSeconds || 4.5,
      s.featuredItemLimit || 16,
      s.featuredSeeAllUrl || '/tin-tuc',
      s.orgMedproEnabled ?? true,
      s.orgMedproEyebrow || 'ĐẶT LỊCH KHÁM QUA MEDPRO',
      s.orgMedproTitle || 'Chủ động thời gian – Giảm thời gian chờ đợi',
      s.orgMedproBullet1 || 'Đặt lịch nhanh chóng',
      s.orgMedproBullet2 || 'Chọn bác sĩ theo nhu cầu',
      s.orgMedproBullet3 || 'Nhận nhắc hẹn tự động',
      s.orgMedproButtonLabel || 'ĐẶT LỊCH NGAY',
      s.orgMedproGuideLabel || 'Hướng dẫn đặt lịch khám',
      s.orgMedproGuideUrl || '/lich-kham',
    ])
  }

  // 4. Khối Schedules: nạp tab order mặc định nếu chưa có
  await client.query(`
    INSERT INTO public."homepage_sections_schedule_tab_order" ("_parent_id", "_order", "id", "label", "tab", "visible")
    VALUES
      ('sec_schedules', 1, 'sched_tab_1', 'Lịch trực cấp cứu', 'emergency', true),
      ('sec_schedules', 2, 'sched_tab_2', 'Theo ngày', 'daily', true),
      ('sec_schedules', 3, 'sched_tab_3', 'Theo tuần', 'weekly', true),
      ('sec_schedules', 4, 'sched_tab_4', 'Lịch đính kèm', 'attachments', true)
    ON CONFLICT ("id") DO NOTHING;
  `)

  // 5. Khối Vaccinations: nạp tab order mặc định nếu chưa có
  await client.query(`
    INSERT INTO public."homepage_vax_tabs" ("_parent_id", "_order", "id", "label", "tab", "visible")
    VALUES
      ('sec_vaccinations', 1, 'vax_tab_1', 'Thông báo lịch tiêm', 'announcements', true),
      ('sec_vaccinations', 2, 'vax_tab_2', 'Tiêm ngừa theo đợt', 'campaigns', true),
      ('sec_vaccinations', 3, 'vax_tab_3', 'Các loại vắc xin', 'vaccines', true)
    ON CONFLICT ("id") DO NOTHING;
  `)
}

export async function verify({ client }) {
  const result = await client.query('SELECT count(*) as total FROM public."homepage_sections";')
  if (parseInt(result.rows[0].total, 10) === 0) {
    throw new Error('homepage_sections chưa có dữ liệu.')
  }
}
