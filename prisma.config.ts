import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
    // Note: directUrl might not be strictly needed for local postgres, 
    // but we'll include it for Supabase compatibility later.
    // directUrl: env('DIRECT_URL'), 
  },
})
