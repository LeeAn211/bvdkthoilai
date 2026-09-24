# CURRENT TASK — Bổ Sung Phạm Vi Bật/Tắt Banner Sidebar Theo Chuyên Mục & Hiển Thị Ảnh Full-Width Khi Ẩn Sidebar

## Trạng thái: HOÀN THÀNH

## Yêu cầu người dùng
1. **Banner hành động trên Sidebar**: Cho phép bật/tắt tùy ý áp dụng cho từng chuyên mục khác nhau (ví dụ: tắt ở Tin tức nhưng Thông báo vẫn hiển thị đầy đủ). Có các lựa chọn: Bật tất cả, Tắt tất cả, và Bật/tắt tùy ý từng mục theo nhu cầu.
2. **Ảnh hiển thị bài viết chi tiết**: Khi ẩn phần sidebar bên phải thì ảnh hiển thị của bài viết chi tiết (ảnh bìa đại diện và ảnh trong bài viết) phải hiển thị full 100% bề ngang khớp hoàn toàn với khối nội dung.

## Đã triển khai
1. **Cấu hình Global `ArticleDetailSettings.ts`**:
   - Thêm `scopeMode` vào group `sidebarBanner` với 3 chế độ: `all` (Bật cho tất cả chuyên mục - mặc định), `custom` (Bật/tắt tùy ý theo từng chuyên mục), `none` (Tắt tất cả banner).
   - Bổ sung nhóm checkbox chuyên mục độc lập: `applyNews`, `applyNotices`, `applyAdvancedTechniques`, `applyProcurement`, `applyRecruitment`, `applyCustomPosts`, `applyClinicalProtocols`, `applyHealthWarnings`, `applyScientificActivities`, `applyDocuments`, và `customSectionsText`.
   - Bổ sung `showCoverImage` và `fullWidthImages` vào group `displayOptions` để kiểm soát hiển thị ảnh bìa và giãn ảnh full khi ẩn sidebar.
2. **Logic Component `ArticleDetailTemplate.tsx`**:
   - Bổ sung hàm kiểm tra phạm vi chuyên mục `isBannerAllowedForCategory(bannerConfig, baseHref)` kết hợp với `scopeMode`.
   - Thêm prop `coverUrl` và render khối ảnh bìa đại diện `.postDetailCoverBox` đầu bài viết.
3. **Styles `ArticleDetailTemplate.module.css`**:
   - Định dạng ảnh đại diện `.postDetailCoverBox` và `.postDetailCoverImage`.
   - Quy định cho layout không có sidebar phải (`.postDetailLayoutFull`, `.postDetailLayoutNoRight`): `.postDetailCoverBox`, `.postDetailCoverImage`, `.postDetailBody img`, `.postDetailBody figure` đạt `width: 100% !important; max-width: 100% !important; height: auto` hiển thị full tràn đều chiều ngang của khối nội dung.
4. **Cập nhật các trang frontend**:
   - Truyền `coverUrl` từ `item.cover` / `item.seoImage` vào `ArticleDetailTemplate` tại các trang: `tin-tuc/[slug]`, `thong-bao/[slug]`, `noi-dung/[sectionSlug]/[slug]`, `tuyen-dung/[slug]`, `dau-thau-mua-sam/[slug]`, `goc-canh-bao/[slug]`.
5. **Database Migration & Schema Seal**:
   - Tạo migration `20260924_075_add_sidebar_banner_scopes_and_full_width_images.mjs`.
   - Chạy `npm run db:schema:seal -- 20260924_075_add_sidebar_banner_scopes_and_full_width_images`.
   - Áp dụng migration vào CSDL qua `npm run db:migrate:deploy`.

## Kiểm tra chất lượng & Fix bổ sung
- **Theo yêu cầu của người dùng ("không hiển thị ảnh đại diện vào trang chi tiết, nếu cần sẽ tự đưa hình vào")**:
  - Đã loại bỏ hoàn toàn khối chèn ảnh bìa tự động (`postDetailCoverBox`) khỏi `ArticleDetailTemplate.tsx` trên tất cả các trang bài viết chi tiết.
  - Ảnh đại diện chỉ phục vụ hiển thị trên thẻ card xem trước ngoài danh sách / trang chủ và phục vụ thẻ SEO OpenGraph.
  - Khi người dùng tự chèn hình ảnh minh họa vào nội dung bài viết (trình soạn thảo RichText), hình ảnh vẫn tự động hiển thị tràn đều Full 100% bề ngang khi ẩn Sidebar bên phải.
- `npm run typecheck`: PASS (0 lỗi).
- `node scripts/validate-db-migrations.mjs`: PASS 330/330 checks.
- `npm run db:schema:check`: PASS (hợp đồng 075).
- Endpoint `/api/globals/article-detail-settings`: HTTP 200 OK.
- Trang chi tiết `/tin-tuc/[slug]`, `/thong-bao/[slug]`, `/goc-canh-bao/[slug]`: HTTP 200 OK, trang hiển thị sạch sẽ, không còn ảnh đại diện cưỡng bức đầu trang.
