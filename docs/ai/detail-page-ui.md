# Detail Page & Hero UI Standard

Load this file only for detail-page, category-page or Hero UI work.

## Shared detail-page system
Prefer existing shared components/layouts before duplicating markup:
- detail layout/template;
- breadcrumb;
- title/meta;
- cover/media;
- RichText;
- attachment UI;
- related content.

Keep spacing, typography, metadata and responsive behavior consistent.

## Page Hero
Use the project's shared `PageHero` when the page belongs to the standard content-page system.

Target visual standard:
- compact Hero, not oversized;
- breadcrumb `Trang chủ / <Tên mục>`;
- balanced title wrapping;
- hospital blue gradient;
- readable description;
- responsive mobile typography.

Do not duplicate a new Hero implementation if the shared component can satisfy the task.

## Images
- Preserve aspect ratio.
- Do not stretch portraits/doctor images.
- Use `object-fit: cover` or `contain` intentionally.
- Use suitable `object-position` and `overflow: hidden`.

## Rich content
- Images, iframe and tables must be responsive.
- Attachments should use shared UI.
- Related-content cards should use shared patterns.

## Validation
Check the affected page at:
- desktop;
- tablet-like width when relevant;
- mobile.

Do not refactor every detail route just because one route has a local issue.
