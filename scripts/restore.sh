#!/bin/sh
set -eu

if [ "${CONFIRM_RESTORE:-}" != "YES" ]; then
  echo "Khôi phục sẽ ghi đè dữ liệu. Chỉ chạy lại với CONFIRM_RESTORE=YES." >&2
  exit 1
fi
if [ -z "${DATABASE_URL:-}" ] || [ -z "${BACKUP_DIR:-}" ] || [ ! -f "$BACKUP_DIR/database.dump" ]; then
  echo "Thiếu DATABASE_URL hoặc BACKUP_DIR hợp lệ." >&2
  exit 1
fi

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
BACKUP_DIR="$BACKUP_DIR" "$SCRIPT_DIR/verify-backup.sh"

pg_restore --clean --if-exists --no-owner --no-acl --dbname="$DATABASE_URL" "$BACKUP_DIR/database.dump"
if [ -f "$BACKUP_DIR/media.tar.gz" ]; then
  MEDIA_DIR="${MEDIA_DIR:-./media}"
  mkdir -p "$MEDIA_DIR"
  tar -xzf "$BACKUP_DIR/media.tar.gz" -C "$MEDIA_DIR"
fi

echo "Khôi phục hoàn tất từ: $BACKUP_DIR"
echo "BẮT BUỘC: chạy health check và UAT tối thiểu sau restore."
