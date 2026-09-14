# Detail Page UI Standard

Use one shared visual system for detail pages: breadcrumb, title, metadata, cover, rich text, attachments, related content.

Prefer reusable components such as:
- DetailPageLayout
- DetailBreadcrumb
- DetailMeta
- DetailCover
- RichTextContent
- AttachmentList
- RelatedContent

Rules:
- consistent max-width, spacing, typography, metadata styling
- preserve image aspect ratio
- rich-text images/iframes/tables must be responsive
- attachment UI should be shared
- related-content cards should be shared
- validate desktop, tablet-like width, and mobile
- when repeated layout code appears across detail routes, refactor toward shared components
