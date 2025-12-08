/**
 * Secure Authentication Library
 * Uses httpOnly cookies and JWT for secure admin authentication
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  authenticated: boolean;
  iat: number;
  exp: number;
}

/**
 * Create a signed JWT token
 */
export async function createToken(): Promise<string> {
  const secret = getJwtSecret();

  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Set the authentication cookie (httpOnly, secure in production)
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Clear the authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Get the session from cookies (server-side only)
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * Verify admin password
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }

  // Constant-time comparison to prevent timing attacks
  if (password.length !== adminPassword.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session?.authenticated === true;
}

