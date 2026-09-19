# CURRENT TASK

## Trạng thái
HOÀN THÀNH — TỐI ƯU CONTEXT AI / LOW-TOKEN

## Mục tiêu
Giảm quota/context bị tiêu hao khi Antigravity, Gemini hoặc Codex làm việc với dự án nhưng vẫn giữ đủ quy tắc và khả năng bàn giao giữa các agent.

## Đã thực hiện
- Rút gọn `AGENTS.md` thành luật lõi + bộ định tuyến tài liệu.
- Chuyển quy tắc chuyên sâu sang `docs/ai/` để chỉ nạp khi đúng loại task.
- Rút gọn `CURRENT-TASK.md` về đúng vai trò bộ nhớ ngắn hạn.
- Giữ `HANDOFF.md` chỉ cho trường hợp chuyển agent/phiên.
- Rút gọn `CHANGELOG.md`; lịch sử cũ được lưu tại `docs/history/CHANGELOG-through-2026-09-19.md`.
- Chuyển các báo cáo audit khỏi thư mục gốc sang `docs/audits/archive/`.
- Bổ sung ignore cho TypeScript cache/temp và bỏ file cache/rác đang track.
- Tối ưu `.agents/skills/bvdkweb/SKILL.md` để không bắt buộc đọc/ghi changelog cho mọi thay đổi nhỏ.

## Database
Không thay đổi schema hoặc dữ liệu.

## Source website
Không thay đổi logic, UI hoặc nội dung website.

## Git
Thay đổi chỉ liên quan cấu hình AI/tài liệu/cache repository.

## Bước tiếp theo
Task mới phải ghi đè nội dung file này thay vì append lịch sử.
