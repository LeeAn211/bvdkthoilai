# Production Safety

When using VPS/production with real shared data:
- production DB is authoritative
- separate development and production data where possible
- no reset/drop/truncate
- no destructive seed logic
- backup before schema changes
- review automatic schema push before enabling it in production
- protect secrets/environment variables
- run preflight/build checks before deployment
