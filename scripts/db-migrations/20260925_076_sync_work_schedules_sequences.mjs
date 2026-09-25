export const id = '20260925_076_sync_work_schedules_sequences'
export const description = 'Đồng bộ lại sequence cho các bảng work_schedules, phiên bản và site_visits_summary để chống trùng lặp khóa chính ID'
export const transactional = false

export async function up({ client }) {
  await client.query(`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'work_schedules_id_seq') THEN
        PERFORM setval('work_schedules_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM public."work_schedules"), 0), 1), (SELECT COUNT(*) > 0 FROM public."work_schedules"));
      END IF;

      IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = '_work_schedules_v_id_seq') THEN
        PERFORM setval('_work_schedules_v_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM public."_work_schedules_v"), 0), 1), (SELECT COUNT(*) > 0 FROM public."_work_schedules_v"));
      END IF;

      IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = '_work_schedules_v_version_days_id_seq') THEN
        PERFORM setval('_work_schedules_v_version_days_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM public."_work_schedules_v_version_days"), 0), 1), (SELECT COUNT(*) > 0 FROM public."_work_schedules_v_version_days"));
      END IF;

      IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'site_visits_summary_id_seq') THEN
        PERFORM setval('site_visits_summary_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM public."site_visits_summary"), 0), 1), (SELECT COUNT(*) > 0 FROM public."site_visits_summary"));
      END IF;
    END $$;
  `)
}

export async function verify({ client }) {
  const checkSeqs = [
    { seq: 'work_schedules_id_seq', table: 'work_schedules' },
    { seq: '_work_schedules_v_id_seq', table: '_work_schedules_v' },
    { seq: '_work_schedules_v_version_days_id_seq', table: '_work_schedules_v_version_days' },
    { seq: 'site_visits_summary_id_seq', table: 'site_visits_summary' },
  ]
  for (const { seq, table } of checkSeqs) {
    const { rows: seqRows } = await client.query(`SELECT last_value FROM ${seq}`)
    const { rows: tableRows } = await client.query(`SELECT COALESCE(MAX(id), 0) AS max_id FROM "${table}"`)
    const lastVal = Number(seqRows[0]?.last_value || 0)
    const maxId = Number(tableRows[0]?.max_id || 0)
    if (lastVal < maxId) {
      throw new Error(`Sequence ${seq} (${lastVal}) nhỏ hơn MAX(id) (${maxId}) của bảng ${table}.`)
    }
  }
}
