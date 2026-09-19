# CHANGELOG

> Nhật ký gọn cho các milestone hiện tại. Lịch sử chi tiết trước ngày 19/09/2026 được lưu tại `docs/history/CHANGELOG-through-2026-09-19.md` và trong Git history.

## 2026-09-19 — Tối ưu AI context / low-token

- Rút gọn `AGENTS.md`, `CURRENT-TASK.md`, `HANDOFF.md` và skill `bvdkweb`.
- Chuyển quy tắc chuyên sâu sang `docs/ai/` để chỉ nạp theo loại task.
- Chuyển các báo cáo audit cũ sang `docs/audits/archive/`.
- Bổ sung ignore cho TypeScript cache/temp; bỏ `tsconfig.tsbuildinfo` và file `-s` khỏi tracking.
- Không thay đổi source website, Payload schema hoặc dữ liệu PostgreSQL.
