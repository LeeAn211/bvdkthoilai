---
name: bvdkweb
description: Workflow for developing, debugging, and maintaining the BVDK Thoi Lai website with low-token context loading. Shared project rules live in AGENTS.md and docs/ai/.
---

# bvdkweb

## Use shared rules
Before substantial work, follow `AGENTS.md`.

Load only the relevant shared reference:
- Detail page UI → `docs/ai/detail-page-ui.md`
- Payload/Admin/schema → `docs/ai/payload-rules.md`
- Database/schema → `docs/ai/database.md`
- Debugging → `docs/ai/debugging.md`
- Regression checks → `docs/ai/regression-checklist.md`
- Production/VPS/deploy → `docs/ai/production-safety.md`
- Source conflicts → `docs/ai/source-of-truth.md`
- Changelog policy → `docs/ai/changelog-policy.md`

Do not read all references by default.

## Workflow
1. Read the target file and direct dependencies.
2. Reuse existing components/schema/utilities before creating new ones.
3. Make the smallest safe change.
4. Run the narrowest useful validation.
5. Update `CHANGELOG.md`.
6. Avoid unrelated refactors.

## Change levels
- Small: CSS/text/simple bug → target files + typecheck if needed.
- Feature: multiple components → related components/types + targeted validation.
- Schema: Payload/database → schema rules + generate types/importmap + typecheck.
- Production: VPS/deploy/real DB → production safety + preflight/build.

## Completion
A task is complete when requested behavior works, validation is appropriate, no unrelated behavior is intentionally changed, and `CHANGELOG.md` is updated.
