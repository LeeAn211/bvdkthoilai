import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const target = url.searchParams.get('url') || '/'
  const expected = process.env.PREVIEW_SECRET
  if (!expected || secret !== expected) return NextResponse.json({ error: 'Preview secret không hợp lệ.' }, { status: 401 })
  if (!target.startsWith('/') || target.startsWith('//')) return NextResponse.json({ error: 'URL preview không hợp lệ.' }, { status: 400 })
  const draft = await draftMode()
  draft.enable()
  return NextResponse.redirect(new URL(target, request.url))
}
