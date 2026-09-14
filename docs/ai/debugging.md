# Debugging Workflow

1. Reproduce or identify the exact error.
2. Read the failing file and direct imports first.
3. Check related types/schema only when relevant.
4. Fix the smallest root cause.
5. Run the narrowest useful validation.
6. Check directly affected routes/components for regression.
7. Update CHANGELOG.md.

Common areas:
- Next.js runtime/build
- Payload import map/types
- Payload Admin components
- PostgreSQL schema mismatch
- responsive UI
- duplicate React keys
- media/thumbnail rendering

Do not scan the whole repository unless targeted inspection fails.
