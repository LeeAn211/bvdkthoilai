export const id = '20260920_056_seal_chatbot_answer_schema'
export const description = 'Xác nhận schema sinh ra cho các trường nội dung trả lời chatbot quản trị được'

export async function up() {
  // Schema vật lý đã được bổ sung an toàn trong migration 055.
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'chatbot_settings'
      AND column_name IN ('emergency_response', 'schedule_response_template', 'working_hours_response_template', 'vaccine_response_template', 'notice_response_template', 'procurement_response_template', 'price_response')
  `)
  if (result.rowCount !== 7) throw new Error('Schema nội dung trả lời chatbot chưa đầy đủ.')
}
