import { defineConfig } from 'prisma/config'

try {
  process.loadEnvFile('.env.local')
} catch {
  // env may already be provided by the host
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: process.env.DATABASE_URL },
})
