const buckets = new Map<string, { count: number; resetAt: number }>()

// In production the app port is bound to 127.0.0.1 and Nginx overwrites these
// headers, so they cannot be supplied directly by an Internet client.
export function clientAddress(req: Request) {
  return req.headers.get('x-real-ip')?.trim()
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown'
}

export function rateLimit(req: Request, namespace: string, limit: number, windowMs: number) {
  const now = Date.now()
  const key = `${namespace}:${clientAddress(req)}`
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: Math.ceil(windowMs / 1000) }
  }
  current.count += 1
  if (buckets.size > 10_000) {
    for (const [bucketKey, value] of buckets) if (value.resetAt <= now) buckets.delete(bucketKey)
  }
  return { allowed: current.count <= limit, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
}

export function bodyIsTooLarge(req: Request, maxBytes: number) {
  const length = Number(req.headers.get('content-length') || 0)
  return Number.isFinite(length) && length > maxBytes
}

export async function verifyTurnstile(req: Request, token: unknown) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) return true // Optional until keys are configured on VPS.
  const responseToken = String(token || '').trim()
  if (!responseToken || responseToken.length > 4096) return false
  try {
    const form = new URLSearchParams({ secret, response: responseToken })
    const ip = clientAddress(req)
    if (ip && ip !== 'unknown') form.set('remoteip', ip)
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form, cache: 'no-store',
    })
    if (!response.ok) return false
    const result = await response.json() as { success?: boolean }
    return result.success === true
  } catch { return false }
}

export const validPhone = (value: string) => /^(?:\+?84|0)[0-9\s.-]{8,14}$/.test(value)
export const validEmail = (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
