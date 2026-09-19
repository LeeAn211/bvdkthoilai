# Payload CMS Rules

Load this file only for Payload/Admin/schema tasks.

## Core
- Reuse existing Collections/Globals/components before creating new ones.
- Check existing fields before adding new fields.
- Do not delete/rename data-bearing fields without a preservation plan.
- Prefer CMS-managed content over hardcoded frontend content.
- Do not put page-specific settings into `SiteSettings`; create an independent Global/Collection when appropriate.
- Avoid duplicate components/collections for existing functionality.

## New pages / dynamic content
- Page Hero and meaningful page content should be CMS-manageable when the page is designed as configurable content.
- Large blocks and relevant child items should support independent `enabled`/show toggles when administrators need granular visibility.
- Dynamic lists should use arrays/relationships instead of repeated hardcode.
- Rich content should use the existing RichText system when appropriate.
- Keep frontend fallback data safe so an empty CMS does not produce a broken page.

## PostgreSQL / field naming
- Keep explicit `dbName` values short (<63 characters).
- Avoid unnecessary custom `dbName` on nested group fields.
- After adding a field, verify the generated physical column/query names, including version tables where applicable.
- Avoid unnecessary versions on Globals.

## Validation
For schema edits, use only the required subset:
- `npm run generate:types`
- `npm run generate:importmap`
- database schema generation/check when DB shape changed
- `npm run typecheck`

Do not run full production build for every small Admin layout change.
