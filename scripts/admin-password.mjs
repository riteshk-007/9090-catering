// Usage: pnpm admin:password "your new password"
// Prints the line to paste into .env.local (replace the old ADMIN_PASSWORD_HASH line), then restart the server.
import { randomBytes, scryptSync } from 'node:crypto'

const password = process.argv[2]
if (!password || password.length < 10) {
  console.error('Please give a password of at least 10 characters:\n  pnpm admin:password "my long password"')
  process.exit(1)
}
const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`)
