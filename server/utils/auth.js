const crypto = require('crypto');

const secret = process.env.AUTH_SECRET || 'onkar-dev-secret';

const base64UrlEncode = (input) => Buffer.from(input).toString('base64url');
const base64UrlDecode = (input) => Buffer.from(input, 'base64url').toString('utf8');

const sign = (payload) => crypto.createHmac('sha256', secret).update(payload).digest('base64url');

const createToken = (payload) => {
  const body = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const encoded = base64UrlEncode(JSON.stringify(body));
  return `${encoded}.${sign(encoded)}`;
};

const verifyToken = (token) => {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || sign(encoded) !== signature) {
    throw new Error('Invalid token signature.');
  }

  const payload = JSON.parse(base64UrlDecode(encoded));
  if (payload.exp < Date.now()) {
    throw new Error('Token expired.');
  }
  return payload;
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
};

const hashResetCode = (code) => crypto.createHash('sha256').update(String(code)).digest('hex');

module.exports = {
  createToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  hashResetCode,
};
