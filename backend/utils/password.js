import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPasswordHash) => {
  const [salt, storedHash] = String(storedPasswordHash || '').split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const hashBuffer = Buffer.from(storedHash, 'hex');
  const suppliedHashBuffer = scryptSync(password, salt, KEY_LENGTH);

  if (hashBuffer.length !== suppliedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, suppliedHashBuffer);
};

export { hashPassword, verifyPassword };
