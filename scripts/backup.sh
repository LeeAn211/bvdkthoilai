#!/bin/sh
set -eu

BACKUP_ROOT="${BACKUP_ROOT:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_ROOT/$STAMP"
MEDIA_DIR="${MEDIA_DIR:-./media}"
mkdir -p "$TARGET"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Thiếu DATABASE_URL" >&2
  exit 1
fi

command -v pg_dump >/dev/null 2>&1 || { echo "Không tìm thấy pg_dump" >&2; exit 1; }
command -v sha256sum >/dev/null 2>&1 || { echo "Không tìm thấy sha256sum" >&2; exit 1; }

pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" > "$TARGET/database.dump"
pg_restore --list "$TARGET/database.dump" >/dev/null

if [ -d "$MEDIA_DIR" ]; then
  tar -czf "$TARGET/media.tar.gz" -C "$MEDIA_DIR" .
fi

printf '%s\n' "$STAMP" > "$TARGET/version.txt"
printf '%s\n' "${npm_package_version:-unknown}" > "$TARGET/app-version.txt"
(
  cd "$TARGET"
  sha256sum database.dump version.txt app-version.txt > SHA256SUMS
  [ ! -f media.tar.gz ] || sha256sum media.tar.gz >> SHA256SUMS
)

printf '%s\n' "created_at=$STAMP" > "$TARGET/manifest.txt"
printf '%s\n' "has_media=$([ -f "$TARGET/media.tar.gz" ] && echo yes || echo no)" >> "$TARGET/manifest.txt"
printf '%s\n' "database_format=postgres-custom" >> "$TARGET/manifest.txt"

echo "Đã tạo và kiểm tra backup: $TARGET"
