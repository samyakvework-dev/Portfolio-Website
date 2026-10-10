import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const AUTH_CONFIG_FILE = path.join(process.cwd(), 'data', 'admin-config.json');

const DEFAULT_ADMIN_EMAIL = 'samyakvework@gmail.com';
const DEFAULT_INITIAL_PASSWORD = 'SamyakStudio2026!';
const TOKEN_SECRET = process.env.AUTH_SECRET || process.env.ADMIN_SECRET || 'samyak-portfolio-secure-session-secret-2026';

interface AdminConfig {
  email: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function getStoredConfig(): AdminConfig {
  try {
    if (fs.existsSync(AUTH_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTH_CONFIG_FILE, 'utf8'));
      if (data && data.passwordHash && data.salt) {
        return data;
      }
    }
  } catch (err) {
    console.error('[Auth] Error reading admin config file:', err);
  }

  // Generate initial default credentials
  const salt = crypto.randomBytes(16).toString('hex');
  const initialPassword = process.env.ADMIN_PASSWORD || DEFAULT_INITIAL_PASSWORD;
  const passwordHash = hashPassword(initialPassword, salt);

  const initialConfig: AdminConfig = {
    email: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    passwordHash,
    salt,
    updatedAt: new Date().toISOString()
  };

  try {
    const dir = path.dirname(AUTH_CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTH_CONFIG_FILE, JSON.stringify(initialConfig, null, 2), 'utf8');
  } catch (err) {
    console.error('[Auth] Error creating admin config file:', err);
  }

  return initialConfig;
}

export function verifyCredentials(email: string, pass: string): boolean {
  const config = getStoredConfig();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const configEmail = (config.email || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

  if (normalizedEmail !== configEmail) {
    return false;
  }

  // Check against env override if present
  if (process.env.ADMIN_PASSWORD && pass === process.env.ADMIN_PASSWORD) {
    return true;
  }

  const computedHash = hashPassword(pass, config.salt);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(config.passwordHash, 'hex'));
}

export function updateAdminPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.length < 6) return false;
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(newPassword, salt);
    const config = getStoredConfig();
    const updated: AdminConfig = {
      ...config,
      passwordHash,
      salt,
      updatedAt: new Date().toISOString()
    };
    const dir = path.dirname(AUTH_CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTH_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Auth] Failed to update password:', err);
    return false;
  }
}

/**
 * Generate a signed session token: {email, exp, hmac}
 */
export function createSessionToken(email: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url');
  const hmac = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${hmac}`;
}

/**
 * Verify a session token
 */
export function verifySessionToken(token: string | undefined | null): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payload, hmac] = parts;
  const expectedHmac = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');

  if (hmac !== expectedHmac) {
    return { valid: false };
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) {
      return { valid: false }; // Expired
    }
    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Extract token from request headers
 */
export function extractToken(req: any): string | null {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  // Cookie fallback
  const cookieHeader = req.headers?.cookie || req.headers?.Cookie;
  if (cookieHeader && typeof cookieHeader === 'string') {
    const match = cookieHeader.match(/samyak_admin_session=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}
