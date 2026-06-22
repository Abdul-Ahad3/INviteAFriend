import User from '../models/User.js';
import { hashPassword } from '../utils/password.js';

const DEFAULT_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testingtesting2',
};

const seedDefaultUser = async () => {
  const existingUser = await User.findOne({ email: DEFAULT_USER.email });

  if (existingUser) {
    return;
  }

  await User.create({
    name: DEFAULT_USER.name,
    email: DEFAULT_USER.email,
    passwordHash: hashPassword(DEFAULT_USER.password),
  });

  console.log(`Seeded default user: ${DEFAULT_USER.email}`);
};

export { seedDefaultUser };
