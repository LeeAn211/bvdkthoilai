# Database Rules

Load this file only for database/schema/migration work.

## Local default
- Keep `PAYLOAD_DB_PUSH=false` for normal local work.
- Do not rely on automatic Drizzle push for routine schema synchronization.

## Safety
- No reset/drop/truncate by default.
- No destructive seed on valuable data.
- Do not modify production data unless explicitly requested and the operation is safe.
- Back up before major schema restructuring or production migration.
- Never commit credentials, dumps or secrets.

## Schema changes
When a Payload field/enum/Collection/Global changes the DB shape:
1. Generate the Payload DB schema when required.
2. Create a migration under `scripts/db-migrations/`.
3. Migration must be idempotent/safe where practical and include verification.
4. Seal the schema contract:
   - `npm run db:schema:seal -- <migration_id>`
5. Check:
   - `npm run db:schema:check`
6. Run targeted migration validation.
7. Deploy local migration only when the task requires it.

Do not create complex destructive migrations when a safe additive migration is sufficient.

## PostgreSQL specifics
- Payload select fields may map to PostgreSQL enums; adding enum values requires explicit migration handling.
- Keep identifiers below PostgreSQL limits.
- Keep main tables and version tables consistent when both exist.
- Verify generated ORM queries after schema changes that alter physical column names.

## Production
- Production deployment/migration rules are in `docs/ai/production-safety.md`.
- Never infer that a local build proves production migration safety.
