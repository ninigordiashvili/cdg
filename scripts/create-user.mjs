// Usage: npm run create-user -- <email> <password> "<name>" [admin|editor]
import { createUser, MIN_PASSWORD_LENGTH } from '../src/server/users.ts';

const [email, password, name, role = 'admin'] = process.argv.slice(2);

if (!email || !password || !name || !['admin', 'editor'].includes(role)) {
  console.error('Usage: npm run create-user -- <email> <password> "<name>" [admin|editor]');
  process.exit(1);
}
if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  process.exit(1);
}

await createUser({ email, name, password, role });
console.log(`Created ${role} ${email}`);
process.exit(0);
