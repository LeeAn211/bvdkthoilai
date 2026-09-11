import fs from 'node:fs'
const checks = [
  ['FAQs collection', 'src/collections/FAQs.ts', 'slug: \'faqs\''],
  ['Forms collection', 'src/collections/Forms.ts', "slug: 'forms'"],
  ['Form submissions', 'src/collections/FormSubmissions.ts', "slug: 'formSubmissions'"],
  ['Feedback categories', 'src/collections/FeedbackCategories.ts', "slug: 'feedbackCategories'"],
  ['Feedback cases', 'src/collections/FeedbackCases.ts', "slug: 'feedbackCases'"],
  ['Feedback actions immutable', 'src/collections/FeedbackActions.ts', 'update: () => false'],
  ['Chatbot intents', 'src/collections/ChatbotIntents.ts', "slug: 'chatbotIntents'"],
  ['Chatbot conversations', 'src/collections/ChatbotConversations.ts', "slug: 'chatbotConversations'"],
  ['Chatbot unanswered', 'src/collections/ChatbotUnanswered.ts', "slug: 'chatbotUnanswered'"],
  ['Chatbot global', 'src/globals/ChatbotSettings.ts', "slug: 'chatbot-settings'"],
  ['Feedback public API', 'src/app/(frontend)/api/feedback/route.ts', "collection: 'feedbackCases'"],
  ['Feedback lookup timeline', 'src/app/(frontend)/api/feedback/route.ts', "collection: 'feedbackActions'"],
  ['Chatbot API', 'src/app/(frontend)/api/chatbot/route.ts', "collection: 'chatbotIntents'"],
  ['Unanswered logging', 'src/app/(frontend)/api/chatbot/route.ts', "collection: 'chatbotUnanswered'"],
  ['Dynamic forms API', 'src/app/(frontend)/api/forms/route.ts', "collection: 'formSubmissions'"],
  ['Feedback page', 'src/app/(frontend)/gop-y/page.tsx', '<FeedbackForm/>'],
  ['Feedback lookup page', 'src/app/(frontend)/gop-y/tra-cuu/page.tsx', '<FeedbackLookup'],
  ['Dynamic form page', 'src/app/(frontend)/bieu-mau/[slug]/page.tsx', '<DynamicPublicForm'],
  ['Chatbot server lookup client', 'src/components/WebsiteAssistant.tsx', "fetch('/api/chatbot'"],
  ['Rate limiting feedback', 'src/app/(frontend)/api/feedback/route.ts', "rateLimit(req, 'feedback-case'"],
  ['Rate limiting chatbot', 'src/app/(frontend)/api/chatbot/route.ts', "rateLimit(req, 'chatbot'"],
]
let pass=0
for (const [name,file,needle] of checks){let ok=false;try{ok=fs.readFileSync(file,'utf8').includes(needle)}catch{};console.log(`${ok?'PASS':'FAIL'} - ${name}`);if(ok)pass++}
console.log(`\n${pass}/${checks.length} PASS`)
if(pass!==checks.length)process.exit(1)
console.log('Chatbot / Forms / Feedback static validation: PASS')
