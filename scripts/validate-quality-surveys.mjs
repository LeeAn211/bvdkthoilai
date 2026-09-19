import fs from 'node:fs'
const checks = [
 ['survey-templates','src/collections/SurveyTemplates.ts'],['survey-template-versions','src/collections/SurveyTemplateVersions.ts'],['survey-questions','src/collections/SurveyQuestions.ts'],['survey-campaigns','src/collections/SurveyCampaigns.ts'],['survey-codes','src/collections/SurveyCodes.ts'],['survey-responses','src/collections/SurveyResponses.ts'],['survey-answers','src/collections/SurveyAnswers.ts'],['survey-statistics','src/collections/SurveyStatistics.ts'],['public survey page','src/app/(frontend)/khao-sat/[slug]/page.tsx'],['survey API','src/app/(frontend)/api/surveys/submit/route.ts'],['statistics API','src/app/(frontend)/api/surveys/statistics/route.ts'],['export API','src/app/(frontend)/api/surveys/export/route.ts'],['QR API','src/app/(frontend)/api/surveys/qr/route.ts']]
let pass=0; for (const [n,p] of checks){const ok=fs.existsSync(p); console.log(`${ok?'PASS':'FAIL'} ${n}`); if(ok)pass++} console.log(`Quality Surveys: ${pass}/${checks.length} PASS`); if(pass!==checks.length)process.exit(1)

const responseCollection = fs.readFileSync('src/collections/SurveyResponses.ts', 'utf8')
const answerCollection = fs.readFileSync('src/collections/SurveyAnswers.ts', 'utf8')
const submitRoute = fs.readFileSync('src/app/(frontend)/api/surveys/submit/route.ts', 'utf8')
const securityChecks = [
  ['survey-responses blocks direct create', /create:\s*\(\)\s*=>\s*false/.test(responseCollection)],
  ['survey-answers blocks direct create', /create:\s*\(\)\s*=>\s*false/.test(answerCollection)],
  ['controlled submit uses privileged local writes', (submitRoute.match(/overrideAccess:\s*true/g) || []).length >= 3],
]
let securityPass = 0
for (const [name, ok] of securityChecks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (ok) securityPass++
}
console.log(`Survey security boundary: ${securityPass}/${securityChecks.length} PASS`)
if (securityPass !== securityChecks.length) process.exit(1)
