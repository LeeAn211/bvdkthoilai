# CURRENT-TASK

## Task: Audit Admin CMS + Nâng c?p headerBrandAppearance

## Tr?ng thái: ? HOÀN THÀNH

## Ngày: 2026-09-14 21:05 (Asia/Saigon)

## Ðã làm:

### Audit CMS:
- Phát hi?n 4 trang chua có group c?u hình: /danh-cho-nguoi-benh, /lich-truc, /hoat-dong-khoa-hoc, /phac-do-dieu-tri
- Phát hi?n 1 group trùng: brand (cu?i SiteSettings) ? ?n di
- Thêm d? 4 groups m?i vào SiteSettings.ts v?i eyebrow/title/description/showNoticeBanner/noticeContent/noticeAlign

### Nâng c?p headerBrandAppearance:
- colorScheme: 6 b?ng màu preset (t? override màu khi không ch?n custom)
- nameFontFamily: 5 font ch? tên don v?
- nameFontWeight: 5 m?c d?m
- nameTextEffect: 6 hi?u ?ng (gradient-text, shadow, border-accent, underline-accent, highlight-bg)
- sloganFontWeight: 5 m?c d?m
- sloganItalic: checkbox in nghiêng
- sloganTextEffect: 5 hi?u ?ng (gradient-text, shadow, decorative-underline, star-wrap)

### Database:
- 6 enum m?i t?o thành công
- 17 c?t m?i thêm vào site_settings thành công

### Validation:
- npx tsc --noEmit: ? 0 l?i
- CHANGELOG.md: ? dã c?p nh?t

## Files Modified:
- src/globals/SiteSettings.ts
- src/components/SiteHeader.tsx
- src/app/globals.css
- CHANGELOG.md
