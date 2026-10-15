// Styled QR rendering on canvas and as SVG: colours, rounded dots, centre
// logo (switches to high error correction) and an optional caption.

import qrcode from '../vendor/qrcode.js';

export const DEFAULT_QR = { fg: '#000000', bg: '#ffffff', dots: 'square', logo: '', caption: '' };

export function makeQr(text, style = DEFAULT_QR) {
  const qr = qrcode(0, style.logo ? 'H' : 'M');
  qr.addData(text);
  qr.make();
  return qr;
}

function isFinder(r, c, n) {
  return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
}

function logoBox(n) {
  const size = Math.floor(n * 0.22);
  const start = Math.floor((n - size) / 2);
  return { start, end: start + size };
}

function hidden(r, c, n, style) {
  if (!style.logo) return false;
  const { start, end } = logoBox(n);
  return r >= start && r < end && c >= start && c < end;
}

export async function drawQr(canvas, text, style = DEFAULT_QR, { size = canvas.width, margin = 4 } = {}) {
  const ctx = canvas.getContext('2d');
  const captionH = style.caption ? Math.round(size * 0.12) : 0;
  canvas.width = size;
  canvas.height = size + captionH;
  ctx.fillStyle = style.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!text) return;
  const qr = makeQr(text, style);
  const n = qr.getModuleCount();
  const cell = size / (n + margin * 2);
  const off = margin * cell;
  ctx.fillStyle = style.fg;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || hidden(r, c, n, style)) continue;
      const x = off + c * cell;
      const y = off + r * cell;
      if (style.dots === 'round' && !isFinder(r, c, n)) {
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
  if (style.logo) {
    const img = await loadImage(style.logo);
    const { start, end } = logoBox(n);
    const pad = cell * 0.5;
    const x = off + start * cell + pad;
    const w = (end - start) * cell - pad * 2;
    ctx.fillStyle = style.bg;
    ctx.fillRect(off + start * cell, off + start * cell, (end - start) * cell, (end - start) * cell);
    const ratio = Math.min(w / img.width, w / img.height);
    ctx.drawImage(img, x + (w - img.width * ratio) / 2, x + (w - img.height * ratio) / 2, img.width * ratio, img.height * ratio);
  }
  if (style.caption) {
    ctx.fillStyle = style.fg;
    ctx.font = `600 ${Math.round(captionH * 0.5)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(style.caption, size / 2, size + captionH / 2 - cell);
  }
}

export function qrSvg(text, style = DEFAULT_QR, { cell = 10, margin = 4 } = {}) {
  const qr = makeQr(text, style);
  const n = qr.getModuleCount();
  const size = (n + margin * 2) * cell;
  const captionH = style.caption ? Math.round(size * 0.12) : 0;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const shapes = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || hidden(r, c, n, style)) continue;
      const x = (c + margin) * cell;
      const y = (r + margin) * cell;
      shapes.push(style.dots === 'round' && !isFinder(r, c, n) ? `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell * 0.45}"/>` : `<rect x="${x}" y="${y}" width="${cell}" height="${cell}"/>`);
    }
  }
  let logo = '';
  if (style.logo) {
    const { start, end } = logoBox(n);
    const p = (start + margin) * cell + cell * 0.5;
    const w = (end - start) * cell - cell;
    logo = `<image href="${esc(style.logo)}" x="${p}" y="${p}" width="${w}" height="${w}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  const caption = style.caption
    ? `<text x="${size / 2}" y="${size + captionH / 2 - cell}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="${Math.round(captionH * 0.5)}" fill="${esc(style.fg)}">${esc(style.caption)}</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size + captionH}" width="${size}" height="${size + captionH}"><rect width="100%" height="100%" fill="${esc(style.bg)}"/><g fill="${esc(style.fg)}">${shapes.join('')}</g>${logo}${caption}</svg>`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
