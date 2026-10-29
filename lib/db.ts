import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/lib/generated/prisma/client'

function createClient() {
  const url = new URL(process.env.DATABASE_URL ?? '')
  // `schema` is a Prisma URL option, not a libpq one: pass it to the adapter instead.
  const schema = url.searchParams.get('schema') ?? 'public'
  url.searchParams.delete('schema')
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url.toString() }, { schema }),
  })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
