export const id = '20260915_007_sync_all_missing_columns_and_tables'
export const description = 'Bổ sung đầy đủ các cột và bảng còn thiếu trên Neon: tech_items, expert_items, theme_settings, site_settings'
export const transactional = false

export async function up({ client }) {
  // ==========================================
  // 1. TẠO CÁC ENUMS CÒN THIẾU
  // ==========================================
  const enums = [
    { name: 'enum_tech_items_image_fit', values: ['contain', 'cover'] },
    { name: 'enum_tech_items_link_mode', values: ['auto-page', 'existing-page', 'internal', 'external'] },
    { name: 'enum__tech_items_v_image_fit', values: ['contain', 'cover'] },
    { name: 'enum__tech_items_v_link_mode', values: ['auto-page', 'existing-page', 'internal', 'external'] },
    { name: 'enum_expert_items_image_fit', values: ['contain', 'cover'] },
    { name: 'enum_expert_items_link_mode', values: ['auto-page', 'existing-page', 'internal', 'external'] },
    { name: 'enum__expert_items_v_image_fit', values: ['contain', 'cover'] },
    { name: 'enum__expert_items_v_link_mode', values: ['auto-page', 'existing-page', 'internal', 'external'] },
    { name: 'sp_not_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_site_settings_service_price_page_rows_per_page', values: ['40', '50'] },
    { name: 'vc_not_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_flow_not_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_quality_not_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_site_settings_survey_page_notice_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_site_settings_faq_page_notice_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_site_settings_forms_page_notice_align', values: ['left', 'center', 'justify'] },
    { name: 'enum__site_settings_v_version_service_price_page_rows_per_page', values: ['40', '50'] },
    { name: 'enum__site_settings_v_version_survey_page_notice_align', values: ['left', 'center', 'justify'] },
    { name: 'enum__site_settings_v_version_faq_page_notice_align', values: ['left', 'center', 'justify'] },
    { name: 'enum__site_settings_v_version_forms_page_notice_align', values: ['left', 'center', 'justify'] },
    { name: 'enum_theme_settings_font_family', values: ['system', 'arial', 'tahoma'] },
    { name: 'enum_theme_settings_page_hero_bg_type', values: ['gradient', 'solid'] },
    { name: 'share_pos', values: ['left', 'right', 'top', 'bottom'] },
    { name: 'banner_pos', values: ['aboveLatest', 'belowLatest'] },
    { name: 'enum__theme_settings_v_version_font_family', values: ['system', 'arial', 'tahoma'] },
    { name: 'enum__theme_settings_v_version_page_hero_bg_type', values: ['gradient', 'solid'] },
  ]

  for (const { name, values } of enums) {
    const formattedValues = values.map((v) => `'${v}'`).join(', ')
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${name}') THEN
          CREATE TYPE public."${name}" AS ENUM (${formattedValues});
        END IF;
      END $$;
    `)
  }

  // ==========================================
  // 2. TECH_ITEMS & EXPERT_ITEMS (BẢNG CHÍNH & VERSION)
  // ==========================================
  const itemColumns = [
    // tech_items
    ['tech_items', 'technique_ref_id', 'integer REFERENCES public."advanced_techniques"("id") ON DELETE SET NULL', null],
    ['tech_items', 'title', 'varchar', null],
    ['tech_items', 'badge', 'varchar', null],
    ['tech_items', 'image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['tech_items', 'image_fit', 'public."enum_tech_items_image_fit"', "'contain'"],
    ['tech_items', 'enable_link', 'boolean', 'true'],
    ['tech_items', 'link_mode', 'public."enum_tech_items_link_mode"', "'internal'"],
    ['tech_items', 'linked_page_id', 'integer REFERENCES public."pages"("id") ON DELETE SET NULL', null],
    ['tech_items', 'new_page_title', 'varchar', null],
    ['tech_items', 'new_page_slug', 'varchar', null],
    ['tech_items', 'url', 'varchar', null],
    ['tech_items', 'open_new_tab', 'boolean', 'false'],
    ['tech_items', 'visible', 'boolean', 'true'],

    // _tech_items_v
    ['_tech_items_v', 'technique_ref_id', 'integer REFERENCES public."advanced_techniques"("id") ON DELETE SET NULL', null],
    ['_tech_items_v', 'title', 'varchar', null],
    ['_tech_items_v', 'badge', 'varchar', null],
    ['_tech_items_v', 'image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_tech_items_v', 'image_fit', 'public."enum__tech_items_v_image_fit"', "'contain'"],
    ['_tech_items_v', 'enable_link', 'boolean', 'true'],
    ['_tech_items_v', 'link_mode', 'public."enum__tech_items_v_link_mode"', "'internal'"],
    ['_tech_items_v', 'linked_page_id', 'integer REFERENCES public."pages"("id") ON DELETE SET NULL', null],
    ['_tech_items_v', 'new_page_title', 'varchar', null],
    ['_tech_items_v', 'new_page_slug', 'varchar', null],
    ['_tech_items_v', 'url', 'varchar', null],
    ['_tech_items_v', 'open_new_tab', 'boolean', 'false'],
    ['_tech_items_v', 'visible', 'boolean', 'true'],
    ['_tech_items_v', '_uuid', 'varchar', null],

    // expert_items
    ['expert_items', 'doctor_ref_id', 'integer REFERENCES public."doctors"("id") ON DELETE SET NULL', null],
    ['expert_items', 'name', 'varchar', null],
    ['expert_items', 'position', 'varchar', null],
    ['expert_items', 'show_department', 'boolean', 'true'],
    ['expert_items', 'custom_subtitle', 'varchar', null],
    ['expert_items', 'image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['expert_items', 'image_fit', 'public."enum_expert_items_image_fit"', "'contain'"],
    ['expert_items', 'enable_link', 'boolean', 'true'],
    ['expert_items', 'link_mode', 'public."enum_expert_items_link_mode"', "'internal'"],
    ['expert_items', 'linked_page_id', 'integer REFERENCES public."pages"("id") ON DELETE SET NULL', null],
    ['expert_items', 'newPageTitle', 'varchar', null], // safety
    ['expert_items', 'new_page_title', 'varchar', null],
    ['expert_items', 'new_page_slug', 'varchar', null],
    ['expert_items', 'url', 'varchar', null],
    ['expert_items', 'open_new_tab', 'boolean', 'false'],
    ['expert_items', 'visible', 'boolean', 'true'],

    // _expert_items_v
    ['_expert_items_v', 'doctor_ref_id', 'integer REFERENCES public."doctors"("id") ON DELETE SET NULL', null],
    ['_expert_items_v', 'name', 'varchar', null],
    ['_expert_items_v', 'position', 'varchar', null],
    ['_expert_items_v', 'show_department', 'boolean', 'true'],
    ['_expert_items_v', 'custom_subtitle', 'varchar', null],
    ['_expert_items_v', 'image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_expert_items_v', 'image_fit', 'public."enum__expert_items_v_image_fit"', "'contain'"],
    ['_expert_items_v', 'enable_link', 'boolean', 'true'],
    ['_expert_items_v', 'link_mode', 'public."enum__expert_items_v_link_mode"', "'internal'"],
    ['_expert_items_v', 'linked_page_id', 'integer REFERENCES public."pages"("id") ON DELETE SET NULL', null],
    ['_expert_items_v', 'new_page_title', 'varchar', null],
    ['_expert_items_v', 'new_page_slug', 'varchar', null],
    ['_expert_items_v', 'url', 'varchar', null],
    ['_expert_items_v', 'open_new_tab', 'boolean', 'false'],
    ['_expert_items_v', 'visible', 'boolean', 'true'],
    ['_expert_items_v', '_uuid', 'varchar', null],
  ]

  for (const [table, column, type, defaultValue] of itemColumns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
    `)
  }

  // ==========================================
  // 3. SITE_SETTINGS & _SITE_SETTINGS_V CÁC TRANG CÒN THIẾU
  // ==========================================
  const pageColumns = [
    // Service price page
    ['site_settings', 'service_price_page_title', 'varchar', "'Bảng giá dịch vụ'"],
    ['site_settings', 'service_price_page_description', 'varchar', "'Tra cứu giá BHYT và giá dịch vụ được cập nhật trực tiếp từ hệ thống quản trị.'"],
    ['site_settings', 'service_price_page_show_notice_banner', 'boolean', 'true'],
    ['site_settings', 'service_price_page_notice_title', 'varchar', "'Lưu ý về giá khám chữa bệnh BHYT và Viện phí'"],
    ['site_settings', 'service_price_page_notice_content', 'varchar', "'• Bảng giá dịch vụ khám bệnh, chữa bệnh được thực hiện công khai theo đúng quy định hiện hành của Bộ Y tế.\\n• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả theo quy định.\\n• Các dịch vụ kỹ thuật cao, dịch vụ theo yêu cầu được tư vấn rõ ràng trước khi thực hiện.'"],
    ['site_settings', 'service_price_page_notice_align', 'public."sp_not_align"', "'left'"],
    ['site_settings', 'service_price_page_search_placeholder', 'varchar', "'Nhập tên, mã dịch vụ, nhóm hoặc ghi chú…'"],
    ['site_settings', 'service_price_page_rows_per_page', 'public."enum_site_settings_service_price_page_rows_per_page"', "'40'"],
    ['site_settings', 'service_price_page_search_notes', 'boolean', 'true'],
    ['site_settings', 'service_price_page_empty_text', 'varchar', "'Không tìm thấy dịch vụ phù hợp.'"],

    // Vaccination page
    ['site_settings', 'vaccination_page_eyebrow', 'varchar', "'TIÊM NGỪA AN TOÀN'"],
    ['site_settings', 'vaccination_page_title', 'varchar', "'Thông tin tiêm ngừa'"],
    ['site_settings', 'vaccination_page_description', 'varchar', "'Theo dõi thông báo lịch tiêm, các đợt tiêm và danh mục vắc xin tại bệnh viện.'"],
    ['site_settings', 'vaccination_page_show_notice_banner', 'boolean', 'true'],
    ['site_settings', 'vaccination_page_notice_title', 'varchar', "'Quy trình và An toàn Tiêm chủng tại Bệnh viện'"],
    ['site_settings', 'vaccination_page_notice_content', 'varchar', "'• Người đến tiêm chủng được khám sàng lọc trước tiêm và tư vấn chỉ định vắc xin phù hợp.\\n• Theo dõi sức khỏe ít nhất 30 phút sau tiêm tại phòng theo dõi của bệnh viện.\\n• Vui lòng mang theo sổ tiêm chủng hoặc ứng dụng tiêm chủng điện tử khi đến tiêm.'"],
    ['site_settings', 'vaccination_page_notice_align', 'public."vc_not_align"', "'left'"],

    // Examination flow page
    ['site_settings', 'examination_flow_page_eyebrow', 'varchar', "'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH'"],
    ['site_settings', 'examination_flow_page_title', 'varchar', "'Quy trình Khám chữa bệnh'"],
    ['site_settings', 'examination_flow_page_description', 'varchar', "'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['site_settings', 'examination_flow_page_show_notice_banner', 'boolean', 'false'],
    ['site_settings', 'examination_flow_page_notice_title', 'varchar', "'Lưu ý khi đến khám tại Bệnh viện Đa khoa Khu vực Thới Lai'"],
    ['site_settings', 'examination_flow_page_notice_content', 'varchar', "'• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả.\\n• Bệnh viện tiếp nhận khám sớm từ 06:30 tại các khoa chuyên môn trọng điểm.\\n• Người cao tuổi, phụ nữ mang thai và trẻ nhỏ được cấp số ưu tiên tiếp đón.'"],
    ['site_settings', 'examination_flow_page_notice_align', 'public."enum_flow_not_align"', "'left'"],
    ['site_settings', 'examination_flow_page_show_checklist', 'boolean', 'true'],
    ['site_settings', 'examination_flow_page_show_priority', 'boolean', 'true'],
    ['site_settings', 'examination_flow_page_show_support_banner', 'boolean', 'true'],

    // Quality page
    ['site_settings', 'quality_page_eyebrow', 'varchar', "'QUẢN LÝ CHẤT LƯỢNG & AN TOÀN NGƯỜI BỆNH'"],
    ['site_settings', 'quality_page_title', 'varchar', "'Chất lượng Bệnh viện'"],
    ['site_settings', 'quality_page_description', 'varchar', "'Bộ chỉ số đo lường 83 tiêu chí chất lượng, kết quả khảo sát sự hài lòng và các chương trình cải tiến liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['site_settings', 'quality_page_show_notice_banner', 'boolean', 'false'],
    ['site_settings', 'quality_page_notice_title', 'varchar', "'Cam kết chất lượng phục vụ của Bệnh viện Đa khoa Khu vực Thới Lai'"],
    ['site_settings', 'quality_page_notice_content', 'varchar', "'• Lấy người bệnh làm trung tâm phục vụ, đảm bảo an toàn và quyền lợi người bệnh.\\n• Đánh giá chất lượng định kỳ theo Bộ 83 Tiêu chí của Bộ Y tế.\\n• Mọi ý kiến đóng góp được Ban Giám đốc tiếp nhận và cải tiến liên tục.'"],
    ['site_settings', 'quality_page_notice_align', 'public."enum_quality_not_align"', "'left'"],
    ['site_settings', 'quality_page_show_quality_cards', 'boolean', 'true'],
    ['site_settings', 'quality_page_show_dimensions', 'boolean', 'true'],
    ['site_settings', 'quality_page_show_programs', 'boolean', 'true'],
    ['site_settings', 'quality_page_show_feedback_box', 'boolean', 'true'],

    // Survey page
    ['site_settings', 'survey_page_eyebrow', 'varchar', "'CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT'"],
    ['site_settings', 'survey_page_title', 'varchar', "'Khảo sát Ý kiến & Sự hài lòng'"],
    ['site_settings', 'survey_page_description', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng từng ý kiến đóng góp của người bệnh và thân nhân để không ngừng nâng cao y đức, văn hóa phục vụ và chất lượng điều trị.'"],
    ['site_settings', 'survey_page_show_notice_banner', 'boolean', 'false'],
    ['site_settings', 'survey_page_notice_title', 'varchar', "'Quy chế khảo sát ẩn danh'"],
    ['site_settings', 'survey_page_notice_content', 'varchar', "'Mọi câu trả lời của quý người bệnh hoàn toàn bảo mật và không ảnh hưởng đến quá trình điều trị.'"],
    ['site_settings', 'survey_page_notice_align', 'public."enum_site_settings_survey_page_notice_align"', "'left'"],

    // FAQ page
    ['site_settings', 'faq_page_eyebrow', 'varchar', "'CHĂM SÓC NGƯỜI BỆNH & GIẢI ĐÁP'"],
    ['site_settings', 'faq_page_title', 'varchar', "'Hỏi đáp Y tế & Câu hỏi thường gặp'"],
    ['site_settings', 'faq_page_description', 'varchar', "'Tổng hợp các giải đáp chính xác, nhanh chóng nhất về chính sách khám chữa bệnh, quyền lợi bảo hiểm và hướng dẫn thủ tục tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['site_settings', 'faq_page_show_notice_banner', 'boolean', 'false'],
    ['site_settings', 'faq_page_notice_title', 'varchar', "'Giải đáp thắc mắc người bệnh'"],
    ['site_settings', 'faq_page_notice_content', 'varchar', "'Nếu chưa tìm thấy thông tin cần biết, quý vị có thể đặt câu hỏi trực tuyến hoặc gọi hotline 02923686115.'"],
    ['site_settings', 'faq_page_notice_align', 'public."enum_site_settings_faq_page_notice_align"', "'left'"],

    // Forms page
    ['site_settings', 'forms_page_eyebrow', 'varchar', "'CHĂM SÓC NGƯỜI BỆNH & THỦ TỤC ĐIỆN TỬ'"],
    ['site_settings', 'forms_page_title', 'varchar', "'Biểu mẫu Điện tử & Đăng ký'"],
    ['site_settings', 'forms_page_description', 'varchar', "'Hệ thống biểu mẫu hành chính số hóa giúp người bệnh đăng ký thủ tục nhanh chóng, tiết kiệm thời gian chờ đợi tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['site_settings', 'forms_page_show_notice_banner', 'boolean', 'false'],
    ['site_settings', 'forms_page_notice_title', 'varchar', "'Lưu ý khi điền biểu mẫu trực tuyến'"],
    ['site_settings', 'forms_page_notice_content', 'varchar', "'Vui lòng cung cấp đúng số điện thoại để nhận mã xác nhận tiếp nhận từ bệnh viện.'"],
    ['site_settings', 'forms_page_notice_align', 'public."enum_site_settings_forms_page_notice_align"', "'left'"],

    // --- CÁC CỘT CHO _SITE_SETTINGS_V ---
    // Service price page
    ['_site_settings_v', 'version_service_price_page_title', 'varchar', "'Bảng giá dịch vụ'"],
    ['_site_settings_v', 'version_service_price_page_description', 'varchar', "'Tra cứu giá BHYT và giá dịch vụ được cập nhật trực tiếp từ hệ thống quản trị.'"],
    ['_site_settings_v', 'version_service_price_page_show_notice_banner', 'boolean', 'true'],
    ['_site_settings_v', 'version_service_price_page_notice_title', 'varchar', "'Lưu ý về giá khám chữa bệnh BHYT và Viện phí'"],
    ['_site_settings_v', 'version_service_price_page_notice_content', 'varchar', "'• Bảng giá dịch vụ khám bệnh, chữa bệnh được thực hiện công khai theo đúng quy định hiện hành của Bộ Y tế.\\n• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả theo quy định.\\n• Các dịch vụ kỹ thuật cao, dịch vụ theo yêu cầu được tư vấn rõ ràng trước khi thực hiện.'"],
    ['_site_settings_v', 'version_service_price_page_notice_align', 'public."sp_not_align"', "'left'"],
    ['_site_settings_v', 'version_service_price_page_search_placeholder', 'varchar', "'Nhập tên, mã dịch vụ, nhóm hoặc ghi chú…'"],
    ['_site_settings_v', 'version_service_price_page_rows_per_page', 'public."enum__site_settings_v_version_service_price_page_rows_per_page"', "'40'"],
    ['_site_settings_v', 'version_service_price_page_search_notes', 'boolean', 'true'],
    ['_site_settings_v', 'version_service_price_page_empty_text', 'varchar', "'Không tìm thấy dịch vụ phù hợp.'"],

    // Vaccination page
    ['_site_settings_v', 'version_vaccination_page_eyebrow', 'varchar', "'TIÊM NGỪA AN TOÀN'"],
    ['_site_settings_v', 'version_vaccination_page_title', 'varchar', "'Thông tin tiêm ngừa'"],
    ['_site_settings_v', 'version_vaccination_page_description', 'varchar', "'Theo dõi thông báo lịch tiêm, các đợt tiêm và danh mục vắc xin tại bệnh viện.'"],
    ['_site_settings_v', 'version_vaccination_page_show_notice_banner', 'boolean', 'true'],
    ['_site_settings_v', 'version_vaccination_page_notice_title', 'varchar', "'Quy trình và An toàn Tiêm chủng tại Bệnh viện'"],
    ['_site_settings_v', 'version_vaccination_page_notice_content', 'varchar', "'• Người đến tiêm chủng được khám sàng lọc trước tiêm và tư vấn chỉ định vắc xin phù hợp.\\n• Theo dõi sức khỏe ít nhất 30 phút sau tiêm tại phòng theo dõi của bệnh viện.\\n• Vui lòng mang theo sổ tiêm chủng hoặc ứng dụng tiêm chủng điện tử khi đến tiêm.'"],
    ['_site_settings_v', 'version_vaccination_page_notice_align', 'public."vc_not_align"', "'left'"],

    // Examination flow page
    ['_site_settings_v', 'version_examination_flow_page_eyebrow', 'varchar', "'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH'"],
    ['_site_settings_v', 'version_examination_flow_page_title', 'varchar', "'Quy trình Khám chữa bệnh'"],
    ['_site_settings_v', 'version_examination_flow_page_description', 'varchar', "'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_examination_flow_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_examination_flow_page_notice_title', 'varchar', "'Lưu ý khi đến khám tại Bệnh viện Đa khoa Khu vực Thới Lai'"],
    ['_site_settings_v', 'version_examination_flow_page_notice_content', 'varchar', "'• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả.\\n• Bệnh viện tiếp nhận khám sớm từ 06:30 tại các khoa chuyên môn trọng điểm.\\n• Người cao tuổi, phụ nữ mang thai và trẻ nhỏ được cấp số ưu tiên tiếp đón.'"],
    ['_site_settings_v', 'version_examination_flow_page_notice_align', 'public."enum_flow_not_align"', "'left'"],
    ['_site_settings_v', 'version_examination_flow_page_show_checklist', 'boolean', 'true'],
    ['_site_settings_v', 'version_examination_flow_page_show_priority', 'boolean', 'true'],
    ['_site_settings_v', 'version_examination_flow_page_show_support_banner', 'boolean', 'true'],

    // Quality page
    ['_site_settings_v', 'version_quality_page_eyebrow', 'varchar', "'QUẢN LÝ CHẤT LƯỢNG & AN TOÀN NGƯỜI BỆNH'"],
    ['_site_settings_v', 'version_quality_page_title', 'varchar', "'Chất lượng Bệnh viện'"],
    ['_site_settings_v', 'version_quality_page_description', 'varchar', "'Bộ chỉ số đo lường 83 tiêu chí chất lượng, kết quả khảo sát sự hài lòng và các chương trình cải tiến liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_quality_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_quality_page_notice_title', 'varchar', "'Cam kết chất lượng phục vụ của Bệnh viện Đa khoa Khu vực Thới Lai'"],
    ['_site_settings_v', 'version_quality_page_notice_content', 'varchar', "'• Lấy người bệnh làm trung tâm phục vụ, đảm bảo an toàn và quyền lợi người bệnh.\\n• Đánh giá chất lượng định kỳ theo Bộ 83 Tiêu chí của Bộ Y tế.\\n• Mọi ý kiến đóng góp được Ban Giám đốc tiếp nhận và cải tiến liên tục.'"],
    ['_site_settings_v', 'version_quality_page_notice_align', 'public."enum_quality_not_align"', "'left'"],
    ['_site_settings_v', 'version_quality_page_show_quality_cards', 'boolean', 'true'],
    ['_site_settings_v', 'version_quality_page_show_dimensions', 'boolean', 'true'],
    ['_site_settings_v', 'version_quality_page_show_programs', 'boolean', 'true'],
    ['_site_settings_v', 'version_quality_page_show_feedback_box', 'boolean', 'true'],

    // Survey page
    ['_site_settings_v', 'version_survey_page_eyebrow', 'varchar', "'CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT'"],
    ['_site_settings_v', 'version_survey_page_title', 'varchar', "'Khảo sát Ý kiến & Sự hài lòng'"],
    ['_site_settings_v', 'version_survey_page_description', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng từng ý kiến đóng góp của người bệnh và thân nhân để không ngừng nâng cao y đức, văn hóa phục vụ và chất lượng điều trị.'"],
    ['_site_settings_v', 'version_survey_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_survey_page_notice_title', 'varchar', "'Quy chế khảo sát ẩn danh'"],
    ['_site_settings_v', 'version_survey_page_notice_content', 'varchar', "'Mọi câu trả lời của quý người bệnh hoàn toàn bảo mật và không ảnh hưởng đến quá trình điều trị.'"],
    ['_site_settings_v', 'version_survey_page_notice_align', 'public."enum__site_settings_v_version_survey_page_notice_align"', "'left'"],

    // FAQ page
    ['_site_settings_v', 'version_faq_page_eyebrow', 'varchar', "'CHĂM SÓC NGƯỜI BỆNH & GIẢI ĐÁP'"],
    ['_site_settings_v', 'version_faq_page_title', 'varchar', "'Hỏi đáp Y tế & Câu hỏi thường gặp'"],
    ['_site_settings_v', 'version_faq_page_description', 'varchar', "'Tổng hợp các giải đáp chính xác, nhanh chóng nhất về chính sách khám chữa bệnh, quyền lợi bảo hiểm và hướng dẫn thủ tục tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_faq_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_faq_page_notice_title', 'varchar', "'Giải đáp thắc mắc người bệnh'"],
    ['_site_settings_v', 'version_faq_page_notice_content', 'varchar', "'Nếu chưa tìm thấy thông tin cần biết, quý vị có thể đặt câu hỏi trực tuyến hoặc gọi hotline 02923686115.'"],
    ['_site_settings_v', 'version_faq_page_notice_align', 'public."enum__site_settings_v_version_faq_page_notice_align"', "'left'"],

    // Forms page
    ['_site_settings_v', 'version_forms_page_eyebrow', 'varchar', "'CHĂM SÓC NGƯỜI BỆNH & THỦ TỤC ĐIỆN TỬ'"],
    ['_site_settings_v', 'version_forms_page_title', 'varchar', "'Biểu mẫu Điện tử & Đăng ký'"],
    ['_site_settings_v', 'version_forms_page_description', 'varchar', "'Hệ thống biểu mẫu hành chính số hóa giúp người bệnh đăng ký thủ tục nhanh chóng, tiết kiệm thời gian chờ đợi tại Bệnh viện Đa khoa Khu vực Thới Lai.'"],
    ['_site_settings_v', 'version_forms_page_show_notice_banner', 'boolean', 'false'],
    ['_site_settings_v', 'version_forms_page_notice_title', 'varchar', "'Lưu ý khi điền biểu mẫu trực tuyến'"],
    ['_site_settings_v', 'version_forms_page_notice_content', 'varchar', "'Vui lòng cung cấp đúng số điện thoại để nhận mã xác nhận tiếp nhận từ bệnh viện.'"],
    ['_site_settings_v', 'version_forms_page_notice_align', 'public."enum__site_settings_v_version_forms_page_notice_align"', "'left'"],
  ]

  for (const [table, column, type, defaultValue] of pageColumns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
    `)
  }

  // ==========================================
  // 4. THEME_SETTINGS & _THEME_SETTINGS_V
  // ==========================================
  // Tạo bảng theme_settings nếu chưa có
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."theme_settings" (
      "id" serial PRIMARY KEY,
      "primary_color" varchar DEFAULT '#0878D1',
      "secondary_color" varchar DEFAULT '#0754A8',
      "accent_color" varchar DEFAULT '#16A36A',
      "font_family" public."enum_theme_settings_font_family" DEFAULT 'system',
      "base_font_size" numeric DEFAULT 16,
      "font_scale" numeric DEFAULT 115,
      "content_max_width" numeric DEFAULT 1300,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)

  // Tạo bảng _theme_settings_v nếu chưa có
  await client.query(`
    CREATE TABLE IF NOT EXISTS public."_theme_settings_v" (
      "id" serial PRIMARY KEY,
      "version_primary_color" varchar DEFAULT '#0878D1',
      "version_secondary_color" varchar DEFAULT '#0754A8',
      "version_accent_color" varchar DEFAULT '#16A36A',
      "version_font_family" public."enum__theme_settings_v_version_font_family" DEFAULT 'system',
      "version_base_font_size" numeric DEFAULT 16,
      "version_font_scale" numeric DEFAULT 115,
      "version_content_max_width" numeric DEFAULT 1300,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone,
      "snapshot" boolean,
      "published_locale" varchar,
      "latest" boolean,
      "autosave" boolean
    );
  `)

  const themeColumns = [
    // theme_settings
    ['theme_settings', 'page_hero_bg_type', 'public."enum_theme_settings_page_hero_bg_type"', "'gradient'"],
    ['theme_settings', 'page_hero_padding_vertical', 'numeric', '22'],
    ['theme_settings', 'page_hero_bg_gradient_start', 'varchar', "'#072b4c'"],
    ['theme_settings', 'page_hero_bg_gradient_middle', 'varchar', "'#0754a8'"],
    ['theme_settings', 'page_hero_bg_gradient_end', 'varchar', "'#0878d1'"],
    ['theme_settings', 'page_hero_bg_solid_color', 'varchar', "'#0754a8'"],
    ['theme_settings', 'page_hero_title_color', 'varchar', "'#ffffff'"],
    ['theme_settings', 'page_hero_title_font_size', 'numeric', '26'],
    ['theme_settings', 'page_hero_desc_color', 'varchar', "'#e2f1fc'"],
    ['theme_settings', 'page_hero_desc_font_size', 'numeric', '14'],
    ['theme_settings', 'page_hero_breadcrumb_color', 'varchar', "'#bae6fd'"],
    ['theme_settings', 'page_hero_breadcrumb_link_color', 'varchar', "'#e0f2fe'"],

    ['theme_settings', 'section_global_bg_color', 'varchar', "'#ffffff'"],
    ['theme_settings', 'section_global_border_radius', 'numeric', '18'],
    ['theme_settings', 'section_global_padding_top', 'numeric', '28'],
    ['theme_settings', 'section_global_padding_bottom', 'numeric', '28'],
    ['theme_settings', 'section_global_content_width', 'numeric', '1180'],
    ['theme_settings', 'section_global_eyebrow_color', 'varchar', "'#0878d1'"],
    ['theme_settings', 'section_global_eyebrow_size', 'numeric', '11'],
    ['theme_settings', 'section_global_title_color', 'varchar', "'#124064'"],
    ['theme_settings', 'section_global_title_size', 'numeric', '26'],
    ['theme_settings', 'section_global_desc_color', 'varchar', "'#657f92'"],
    ['theme_settings', 'section_global_desc_size', 'numeric', '13'],
    ['theme_settings', 'section_global_heading_gap', 'numeric', '18'],

    ['theme_settings', 'detail_layout_apply_news', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_apply_procurement', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_apply_recruitment', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_apply_custom_posts', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_apply_all_new_sections', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_custom_slugs_text', 'varchar', null],
    ['theme_settings', 'detail_layout_share_settings_enabled', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_share_settings_position', 'public."share_pos"', "'left'"],
    ['theme_settings', 'detail_layout_share_settings_platforms_order', 'varchar', "'facebook, zalo, copy, print, custom'"],
    ['theme_settings', 'detail_layout_share_settings_show_facebook', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_share_settings_facebook_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_share_settings_show_zalo', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_share_settings_zalo_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_share_settings_show_copy_link', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_share_settings_copy_link_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_share_settings_show_print', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_share_settings_print_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_share_settings_custom_shares_json', 'varchar', null],

    ['theme_settings', 'detail_layout_sidebar_banner_enabled', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_sidebar_banner_position', 'public."banner_pos"', "'aboveLatest'"],
    ['theme_settings', 'detail_layout_sidebar_banner_title', 'varchar', "'ĐẶT LỊCH KHÁM BỆNH'"],
    ['theme_settings', 'detail_layout_sidebar_banner_description', 'varchar', "'Khám chữa bệnh nhanh chóng, tiện lợi, không phải chờ đợi qua ứng dụng y tế.'"],
    ['theme_settings', 'detail_layout_sidebar_banner_button_text', 'varchar', "'Đặt lịch khám ngay →'"],
    ['theme_settings', 'detail_layout_sidebar_banner_button_link', 'varchar', "'https://medpro.vn/'"],
    ['theme_settings', 'detail_layout_sidebar_banner_open_new_tab', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_sidebar_banner_custom_banner_image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_enabled', 'boolean', 'false'],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_title', 'varchar', "'LỊCH TIÊM CHỦNG'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_description', 'varchar', "'Tra cứu thông tin và lịch tiêm vắc xin cho trẻ em và người lớn.'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_button_text', 'varchar', "'Xem lịch tiêm →'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_button_link', 'varchar', "'/tiem-chung'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_open_new_tab', 'boolean', 'false'],
    ['theme_settings', 'detail_layout_sidebar_banner_banner2_image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_enabled', 'boolean', 'false'],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_title', 'varchar', "'BẢNG GIÁ DỊCH VỤ'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_description', 'varchar', "'Công khai giá khám chữa bệnh BHYT và dịch vụ yêu cầu.'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_button_text', 'varchar', "'Tra cứu giá →'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_button_link', 'varchar', "'/bang-gia'"],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_open_new_tab', 'boolean', 'false'],
    ['theme_settings', 'detail_layout_sidebar_banner_banner3_image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['theme_settings', 'detail_layout_sidebar_banner_extra_banners_json', 'varchar', null],

    ['theme_settings', 'detail_layout_display_options_show_views', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_display_options_show_date', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_display_options_show_category', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_display_options_show_sidebar_latest', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_display_options_sidebar_latest_title', 'varchar', "'Tin mới nhất'"],
    ['theme_settings', 'detail_layout_display_options_show_related_section', 'boolean', 'true'],
    ['theme_settings', 'detail_layout_display_options_related_section_title', 'varchar', "'Tin tức cùng chuyên mục'"],
    ['theme_settings', 'detail_layout_display_options_default_source_name', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai'"],

    // _theme_settings_v
    ['_theme_settings_v', 'version_page_hero_bg_type', 'public."enum__theme_settings_v_version_page_hero_bg_type"', "'gradient'"],
    ['_theme_settings_v', 'version_page_hero_padding_vertical', 'numeric', '22'],
    ['_theme_settings_v', 'version_page_hero_bg_gradient_start', 'varchar', "'#072b4c'"],
    ['_theme_settings_v', 'version_page_hero_bg_gradient_middle', 'varchar', "'#0754a8'"],
    ['_theme_settings_v', 'version_page_hero_bg_gradient_end', 'varchar', "'#0878d1'"],
    ['_theme_settings_v', 'version_page_hero_bg_solid_color', 'varchar', "'#0754a8'"],
    ['_theme_settings_v', 'version_page_hero_title_color', 'varchar', "'#ffffff'"],
    ['_theme_settings_v', 'version_page_hero_title_font_size', 'numeric', '26'],
    ['_theme_settings_v', 'version_page_hero_desc_color', 'varchar', "'#e2f1fc'"],
    ['_theme_settings_v', 'version_page_hero_desc_font_size', 'numeric', '14'],
    ['_theme_settings_v', 'version_page_hero_breadcrumb_color', 'varchar', "'#bae6fd'"],
    ['_theme_settings_v', 'version_page_hero_breadcrumb_link_color', 'varchar', "'#e0f2fe'"],

    ['_theme_settings_v', 'version_section_global_bg_color', 'varchar', "'#ffffff'"],
    ['_theme_settings_v', 'version_section_global_border_radius', 'numeric', '18'],
    ['_theme_settings_v', 'version_section_global_padding_top', 'numeric', '28'],
    ['_theme_settings_v', 'version_section_global_padding_bottom', 'numeric', '28'],
    ['_theme_settings_v', 'version_section_global_content_width', 'numeric', '1180'],
    ['_theme_settings_v', 'version_section_global_eyebrow_color', 'varchar', "'#0878d1'"],
    ['_theme_settings_v', 'version_section_global_eyebrow_size', 'numeric', '11'],
    ['_theme_settings_v', 'version_section_global_title_color', 'varchar', "'#124064'"],
    ['_theme_settings_v', 'version_section_global_title_size', 'numeric', '26'],
    ['_theme_settings_v', 'version_section_global_desc_color', 'varchar', "'#657f92'"],
    ['_theme_settings_v', 'version_section_global_desc_size', 'numeric', '13'],
    ['_theme_settings_v', 'version_section_global_heading_gap', 'numeric', '18'],

    ['_theme_settings_v', 'version_detail_layout_apply_news', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_apply_procurement', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_apply_recruitment', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_apply_custom_posts', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_apply_all_new_sections', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_custom_slugs_text', 'varchar', null],
    ['_theme_settings_v', 'version_detail_layout_share_settings_enabled', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_share_settings_position', 'public."share_pos"', "'left'"],
    ['_theme_settings_v', 'version_detail_layout_share_settings_platforms_order', 'varchar', "'facebook, zalo, copy, print, custom'"],
    ['_theme_settings_v', 'version_detail_layout_share_settings_show_facebook', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_share_settings_facebook_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_share_settings_show_zalo', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_share_settings_zalo_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_share_settings_show_copy_link', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_share_settings_copy_link_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_share_settings_show_print', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_share_settings_print_custom_icon_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_share_settings_custom_shares_json', 'varchar', null],

    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_enabled', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_position', 'public."banner_pos"', "'aboveLatest'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_title', 'varchar', "'ĐẶT LỊCH KHÁM BỆNH'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_description', 'varchar', "'Khám chữa bệnh nhanh chóng, tiện lợi, không phải chờ đợi qua ứng dụng y tế.'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_button_text', 'varchar', "'Đặt lịch khám ngay →'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_button_link', 'varchar', "'https://medpro.vn/'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_open_new_tab', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_custom_banner_image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_enabled', 'boolean', 'false'],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_title', 'varchar', "'LỊCH TIÊM CHỦNG'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_description', 'varchar', "'Tra cứu thông tin và lịch tiêm vắc xin cho trẻ em và người lớn.'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_button_text', 'varchar', "'Xem lịch tiêm →'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_button_link', 'varchar', "'/tiem-chung'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_open_new_tab', 'boolean', 'false'],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner2_image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_enabled', 'boolean', 'false'],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_title', 'varchar', "'BẢNG GIÁ DỊCH VỤ'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_description', 'varchar', "'Công khai giá khám chữa bệnh BHYT và dịch vụ yêu cầu.'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_button_text', 'varchar', "'Tra cứu giá →'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_button_link', 'varchar', "'/bang-gia'"],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_open_new_tab', 'boolean', 'false'],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_banner3_image_id', 'integer REFERENCES public."media"("id") ON DELETE SET NULL', null],
    ['_theme_settings_v', 'version_detail_layout_sidebar_banner_extra_banners_json', 'varchar', null],

    ['_theme_settings_v', 'version_detail_layout_display_options_show_views', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_display_options_show_date', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_display_options_show_category', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_display_options_show_sidebar_latest', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_display_options_sidebar_latest_title', 'varchar', "'Tin mới nhất'"],
    ['_theme_settings_v', 'version_detail_layout_display_options_show_related_section', 'boolean', 'true'],
    ['_theme_settings_v', 'version_detail_layout_display_options_related_section_title', 'varchar', "'Tin tức cùng chuyên mục'"],
    ['_theme_settings_v', 'version_detail_layout_display_options_default_source_name', 'varchar', "'Bệnh viện Đa khoa Khu vực Thới Lai'"],
  ]

  for (const [table, column, type, defaultValue] of themeColumns) {
    const defaultClause = defaultValue !== null ? ` DEFAULT ${defaultValue}` : ''
    await client.query(`
      ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause};
    `)
  }

  // Đảm bảo có ít nhất 1 dòng trong theme_settings
  const tsCheck = await client.query('SELECT id FROM public."theme_settings" LIMIT 1;')
  if (tsCheck.rowCount === 0) {
    await client.query(`
      INSERT INTO public."theme_settings" ("primary_color", "created_at", "updated_at")
      VALUES ('#0878D1', NOW(), NOW());
    `)
  }
}

export async function verify({ client }) {
  // 1. Kiểm tra cột enable_link trong tech_items
  const techLink = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tech_items' AND column_name = 'enable_link';
  `)
  if (techLink.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột enable_link trong bảng tech_items.')
  }

  // 2. Kiểm tra cột examination_flow_page_eyebrow trong site_settings
  const flowEyebrow = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_settings' AND column_name = 'examination_flow_page_eyebrow';
  `)
  if (flowEyebrow.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột examination_flow_page_eyebrow trong bảng site_settings.')
  }

  // 3. Kiểm tra cột page_hero_bg_type trong theme_settings
  const heroBgType = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'theme_settings' AND column_name = 'page_hero_bg_type';
  `)
  if (heroBgType.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột page_hero_bg_type trong bảng theme_settings.')
  }
}
