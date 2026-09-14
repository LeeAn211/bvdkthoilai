#!/bin/sh
set -eu

if [ -z "${BACKUP_DIR:-}" ] || [ ! -d "$BACKUP_DIR" ]; then
  echo "Đặt BACKUP_DIR đến thư mục backup cần kiểm tra." >&2
  exit 1
fi

command -v sha256sum >/dev/null 2>&1 || { echo "Không tìm thấy sha256sum" >&2; exit 1; }
command -v pg_restore >/dev/null 2>&1 || { echo "Không tìm thấy pg_restore" >&2; exit 1; }

cd "$BACKUP_DIR"
[ -f SHA256SUMS ] || { echo "Thiếu SHA256SUMS" >&2; exit 1; }
sha256sum -c SHA256SUMS
pg_restore --list database.dump >/dev/null
if [ -f media.tar.gz ]; then
  tar -tzf media.tar.gz >/dev/null
fi

echo "Backup hợp lệ: $BACKUP_DIR"
