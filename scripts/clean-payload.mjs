import fs from 'node:fs'
import path from 'node:path'

const nextDir = path.resolve('.next')
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true })
}

console.log('Next.js cache cleaned. Payload import map was preserved.')
