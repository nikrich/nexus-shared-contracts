import jwt from 'jsonwebtoken';
import type { AuthToken } from '../types/user.js';

const DEFAULT_SECRET = 'nexus-dev-secret-change-in-production';
const DEFAULT_EXPIRY = '24h';

function getSecret(): string {
  return process.env.NEXUS_JWT_SECRET || DEFAULT_SECRET;
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: DEFAULT_EXPIRY });
}

export function verifyToken(token: string): AuthToken {
  return jwt.verify(token, getSecret()) as AuthToken;
}
