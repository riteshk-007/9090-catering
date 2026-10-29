import 'server-only'
import { createHash } from 'node:crypto'
import { headers } from 'next/headers'

export async function clientIp() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}

export const hashIp = (ip: string) =>
  createHash('sha256')
    .update(`${process.env.IP_HASH_SALT ?? ''}${ip}`)
    .digest('hex')

/** Small in-memory sliding-window limiter (per server instance). */
const buckets = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return false
  }
  hits.push(now)
  buckets.set(key, hits)
  return true
}
