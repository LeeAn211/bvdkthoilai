# Database Rules

Development may use PAYLOAD_DB_PUSH=true.

Safety:
- no reset/drop/truncate by default
- no destructive seed on valuable data
- backup before major schema restructuring
- record schema/database impact in CHANGELOG.md
- production uses stricter rules in production-safety.md
