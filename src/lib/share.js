// No-backend team sharing: a workspace packs into a short code (and QR) that
// a teammate pastes to import. Admin lock: a PIN hash travels with the
// workspace; members can use it but can't change rules without the PIN.
// This is a soft lock that stops accidental edits, not a security boundary.

const PREFIX = 'UTMG1.';
const REQ_PREFIX = 'UTMG-REQ1.';

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str) {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, c => c.charCodeAt(0));
}

async function pipe(bytes, stream) {
  const out = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

export function shareable(ws) {
  return { ...ws, shortener: { ...(ws.shortener || {}), token: '' }, webhook: ws.webhook ? { ...ws.webhook, url: '' } : undefined, qr: ws.qr ? { ...ws.qr, logo: '' } : undefined };
}

export async function encodeWorkspace(ws) {
  const json = new TextEncoder().encode(JSON.stringify(shareable(ws)));
  return PREFIX + b64url(await pipe(json, new CompressionStream('deflate-raw')));
}

export async function decodeWorkspace(code) {
  const c = String(code || '').trim();
  if (!c.startsWith(PREFIX)) throw new Error('This is not a UTM Governor workspace code');
  const bytes = await pipe(fromB64url(c.slice(PREFIX.length)), new DecompressionStream('deflate-raw'));
  const ws = JSON.parse(new TextDecoder().decode(bytes));
  if (!ws || typeof ws !== 'object' || !ws.name) throw new Error('The workspace code is damaged');
  return ws;
}

export async function hashPin(pin, salt) {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return b64url(new Uint8Array(digest));
}

export async function makeLock(pin) {
  const salt = b64url(crypto.getRandomValues(new Uint8Array(12)));
  return { salt, hash: await hashPin(pin, salt) };
}

export async function checkPin(lock, pin) {
  if (!lock) return true;
  return (await hashPin(pin, lock.salt)) === lock.hash;
}

// Approval requests: a member asks for a new approved value; the admin
// pastes the request into Settings to approve it.
export function encodeRequest(req) {
  return REQ_PREFIX + b64url(new TextEncoder().encode(JSON.stringify(req)));
}

export function decodeRequest(code) {
  const c = String(code || '').trim();
  if (!c.startsWith(REQ_PREFIX)) throw new Error('This is not a UTM Governor approval request');
  const req = JSON.parse(new TextDecoder().decode(fromB64url(c.slice(REQ_PREFIX.length))));
  if (!['source', 'medium'].includes(req.field) || !req.value) throw new Error('The request is incomplete');
  return req;
}
