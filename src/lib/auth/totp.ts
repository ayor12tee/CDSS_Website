// Time-based one-time passwords (RFC 6238), compatible with Google Authenticator,
// Microsoft Authenticator, Authy, 1Password, etc. Built on Node's crypto; no external service.
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const PERIOD = 30; // seconds
const DIGITS = 6;
const WINDOW = 1; // accept one step either side to tolerate clock drift
export const ISSUER = 'CDSS Admin';

// ---------------------------------------------------------------------------
// base32 (RFC 4648), the format authenticator apps expect
// ---------------------------------------------------------------------------
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf: Buffer) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(input: string) {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    value = (value << 5) | ALPHABET.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

// ---------------------------------------------------------------------------
// TOTP
// ---------------------------------------------------------------------------
/** A new random 160-bit secret, base32-encoded. */
export function generateTotpSecret() {
  return base32Encode(randomBytes(20));
}

function hotp(secret: Buffer, counter: number) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac('sha1', secret).update(msg).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const bin = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(bin % 10 ** DIGITS).padStart(DIGITS, '0');
}

export const currentStep = (now = Date.now()) => Math.floor(now / 1000 / PERIOD);

/**
 * Checks a 6-digit code. Returns the matched time step, or null.
 * Codes at or before `lastStep` are rejected so a code can never be replayed.
 */
export function verifyTotp(secretBase32: string, code: string, lastStep = 0, now = Date.now()): number | null {
  const digits = code.replace(/\s|-/g, '');
  if (!/^\d{6}$/.test(digits)) return null;
  const secret = base32Decode(secretBase32);
  const step = currentStep(now);
  for (let w = -WINDOW; w <= WINDOW; w++) {
    const candidate = step + w;
    if (candidate <= lastStep) continue;
    const expected = hotp(secret, candidate);
    if (timingSafeEqual(Buffer.from(expected), Buffer.from(digits))) return candidate;
  }
  return null;
}

/** otpauth:// URI encoded in the QR code. */
export function otpauthUrl(email: string, secretBase32: string) {
  const label = encodeURIComponent(`${ISSUER}:${email}`);
  const params = new URLSearchParams({ secret: secretBase32, issuer: ISSUER, algorithm: 'SHA1', digits: String(DIGITS), period: String(PERIOD) });
  return `otpauth://totp/${label}?${params}`;
}

/** Groups a secret for manual entry: ABCD EFGH IJKL ... */
export const formatSecret = (s: string) => s.replace(/(.{4})/g, '$1 ').trim();

// ---------------------------------------------------------------------------
// encryption at rest (AES-256-GCM)
// ---------------------------------------------------------------------------
function encryptionKey() {
  const raw = process.env.TOTP_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) throw new Error('TOTP_ENCRYPTION_KEY must be set to a random string of at least 32 characters (see .env.example).');
  return createHash('sha256').update(raw).digest();
}

export function encryptSecret(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), data.toString('base64url')].join('.');
}

export function decryptSecret(stored: string) {
  const [version, iv, tag, data] = stored.split('.');
  if (version !== 'v1' || !iv || !tag || !data) throw new Error('Unrecognised encrypted secret');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
}

// ---------------------------------------------------------------------------
// backup codes
// ---------------------------------------------------------------------------
const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'; // no 0/o, 1/l/i

/** 10 single-use codes like "k7mq-2xhd". Show once; store only the hashes. */
export function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, () => {
    const bytes = randomBytes(8);
    const chars = Array.from(bytes, b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
    return `${chars.slice(0, 4)}-${chars.slice(4)}`;
  });
}

export const normaliseBackupCode = (code: string) => code.toLowerCase().replace(/[^a-z0-9]/g, '');

export const hashBackupCode = (code: string) => createHash('sha256').update(normaliseBackupCode(code)).digest('hex');
