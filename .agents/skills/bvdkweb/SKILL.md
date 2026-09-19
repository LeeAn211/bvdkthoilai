---
name: bvdkweb
description: Low-token workflow for developing, debugging, and maintaining the BVDK Thoi Lai website.
---

# bvdkweb

## Start
Read only:
1. `AGENTS.md`
2. `CURRENT-TASK.md`
3. target file

Do not scan the repository by default.

## Load references only when needed
- Payload/Admin/schema → `docs/ai/payload-rules.md`
- Admin form UX → `docs/ai/admin-form-ui.md`
- Database/migration → `docs/ai/database.md`
- Detail page/Hero UI → `docs/ai/detail-page-ui.md`
- Debugging → `docs/ai/debugging.md`
- Regression → `docs/ai/regression-checklist.md`
- Production/deploy → `docs/ai/production-safety.md`
- Source conflict → `docs/ai/source-of-truth.md`

Never load all references by default.

## Workflow
1. Identify exact scope.
2. Read target + direct dependency only when required.
3. Reuse existing component/schema/utilities.
4. Make the smallest safe change.
5. Run the narrowest useful validation.
6. Update `CURRENT-TASK.md`.
7. Update `CHANGELOG.md` only for meaningful completed work.
8. Avoid unrelated refactors.

## Validation level
- Small CSS/text/UI: targeted check; typecheck only when useful.
- Feature: related components/types + targeted validation.
- Schema/database: load DB/Payload rules, generate/check what the schema change requires.
- Release/production: preflight/full build only when appropriate.

## Never
- read full CHANGELOG by default;
- append old tasks into CURRENT-TASK;
- run full-project audit for a local UI bug;
- run production build after every small change;
- modify database or production outside the explicit task.
