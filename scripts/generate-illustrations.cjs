// Generates the blueprint-style SVG illustrations in public/img/.
// Usage: npm run illustrations
// All artwork is procedural so it stays on-brand (CDSS navy + chrome) and weighs a few KB each.

const W = 800, H = 500;
const LINE = '#dfe2ff';
const SOFT = '#8f95ea';

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const f = n => Math.round(n * 10) / 10;
const pts = arr => arr.map(p => f(p[0]) + ',' + f(p[1])).join(' ');

function frame(inner, { glow = '#241bb8', gx = .78, gy = .2, label } = {}) {
  const block = label ? titleBlock(label) : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#030417"/><stop offset=".6" stop-color="#080a3f"/><stop offset="1" stop-color="#0d0a86"/></linearGradient>
<radialGradient id="glow" cx="${gx}" cy="${gy}" r=".75"><stop offset="0" stop-color="${glow}" stop-opacity=".6"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
<pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#fff" stroke-opacity=".035"/></pattern>
<pattern id="g2" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="#fff" stroke-opacity=".07"/></pattern>
<linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#e4e6f0"/><stop offset="1" stop-color="#9ea3bd"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#glow)"/><rect width="${W}" height="${H}" fill="url(#g1)"/><rect width="${W}" height="${H}" fill="url(#g2)"/>
${inner}
${block}
</svg>`;
}

function titleBlock(label) {
  return `<g font-family="ui-monospace,Menlo,Consolas,monospace" font-size="9" fill="${SOFT}" fill-opacity=".85">
<rect x="612" y="446" width="170" height="38" fill="#030417" fill-opacity=".55" stroke="${LINE}" stroke-opacity=".35"/>
<line x1="612" y1="462" x2="782" y2="462" stroke="${LINE}" stroke-opacity=".25"/>
<text x="620" y="458">CDSS (NIG.) LTD</text><text x="720" y="458">REV A</text>
<text x="620" y="476">${label}</text></g>`;
}

function mono(x, y, text, opts = '') {
  const fill = / fill="|^fill="/.test(opts) ? '' : ` fill="${SOFT}"`;
  const size = /font-size="/.test(opts) ? '' : ' font-size="10"';
  return `<text x="${x}" y="${y}" font-family="ui-monospace,Menlo,Consolas,monospace"${size}${fill} ${opts}>${text}</text>`;
}

// ---------- isometric helpers ----------
const C = Math.cos(Math.PI / 6);
function isoFactory(ox, oy) {
  return (x, y, z = 0) => [ox + (x - y) * C, oy + (x + y) * 0.5 - z];
}
function isoBox(P, b, style) {
  const { x, y, w, d, h, floors = 0 } = b;
  const top = [P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)];
  const right = [P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x + w, y, h)];
  const left = [P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x, y + d, h)];
  const solid = style === 'solid';
  const dash = style === 'wire' ? ' stroke-dasharray="4 4"' : '';
  let s = '';
  s += `<polygon points="${pts(left)}" fill="${solid ? '#1b2152' : 'none'}" fill-opacity="${solid ? .95 : 0}" stroke="${LINE}" stroke-opacity=".75"${dash}/>`;
  s += `<polygon points="${pts(right)}" fill="${solid ? '#241bb8' : 'none'}" fill-opacity="${solid ? .55 : 0}" stroke="${LINE}" stroke-opacity=".75"${dash}/>`;
  s += `<polygon points="${pts(top)}" fill="${solid ? '#8f95ea' : 'none'}" fill-opacity="${solid ? .45 : 0}" stroke="${LINE}" stroke-opacity=".9"${dash}/>`;
  if (floors) {
    const fh = h / floors;
    let lines = '';
    for (let k = 1; k < floors; k++) {
      const z = k * fh;
      lines += `<polyline points="${pts([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y, z)])}"/>`;
    }
    const cols = Math.max(2, Math.round(w / 22));
    for (let k = 1; k < cols; k++) {
      const xx = x + (w / cols) * k;
      lines += `<line x1="${f(P(xx, y + d, 0)[0])}" y1="${f(P(xx, y + d, 0)[1])}" x2="${f(P(xx, y + d, h)[0])}" y2="${f(P(xx, y + d, h)[1])}"/>`;
    }
    const rows = Math.max(2, Math.round(d / 22));
    for (let k = 1; k < rows; k++) {
      const yy = y + (d / rows) * k;
      lines += `<line x1="${f(P(x + w, yy, 0)[0])}" y1="${f(P(x + w, yy, 0)[1])}" x2="${f(P(x + w, yy, h)[0])}" y2="${f(P(x + w, yy, h)[1])}"/>`;
    }
    s += `<g fill="none" stroke="${LINE}" stroke-opacity="${solid ? .28 : .35}" stroke-width=".8"${dash}>${lines}</g>`;
  }
  return s;
}
function isoGround(P, min, max, step, opacity = .12) {
  let s = `<g stroke="${LINE}" stroke-opacity="${opacity}" stroke-width=".8">`;
  for (let v = min; v <= max; v += step) {
    const a = P(v, min), b = P(v, max), c = P(min, v), d = P(max, v);
    s += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/><line x1="${f(c[0])}" y1="${f(c[1])}" x2="${f(d[0])}" y2="${f(d[1])}"/>`;
  }
  return s + '</g>';
}
function sortBoxes(boxes) {
  return boxes.slice().sort((a, b) => (a.x + a.y + a.w + a.d) - (b.x + b.y + b.w + b.d));
}

// ---------- scenes ----------
function aecScene({ contours = false } = {}) {
  const P = isoFactory(400, 330);
  const boxes = [
    { x: -160, y: -40, w: 90, d: 90, h: 150, floors: 6 },
    { x: -40, y: -130, w: 100, d: 100, h: 215, floors: 9 },
    { x: 90, y: -60, w: 80, d: 120, h: 170, floors: 7 },
    { x: -60, y: 50, w: 120, d: 80, h: 100, floors: 4 },
    { x: 100, y: 90, w: 80, d: 60, h: 62, floors: 2 },
  ];
  let s = isoGround(P, -260, 260, 26);
  if (contours) {
    s += `<g fill="none" stroke="${SOFT}" stroke-opacity=".22">`;
    for (let k = 1; k < 7; k++) {
      const ring = [];
      for (let t = 0; t <= 64; t++) {
        const a = t / 64 * Math.PI * 2;
        const r = 40 * k * (1 + .12 * Math.sin(3 * a + k));
        ring.push(P(r * Math.cos(a) + 20, r * Math.sin(a) + 20));
      }
      s += `<polyline points="${pts(ring)}"/>`;
    }
    s += '</g>';
  }
  sortBoxes(boxes).forEach(b => { s += isoBox(P, b, 'solid'); });
  // crane
  s += `<g stroke="${LINE}" stroke-opacity=".8" fill="none" stroke-width="1.2">
<line x1="690" y1="360" x2="690" y2="72"/><line x1="704" y1="360" x2="704" y2="72"/>`;
  for (let y = 360; y > 80; y -= 14) s += `<line x1="690" y1="${y}" x2="704" y2="${y - 14}"/>`;
  s += `<polyline points="540,78 790,78"/><polyline points="540,90 690,90"/><polyline points="697,50 540,78"/><polyline points="697,50 790,78"/>
<line x1="697" y1="50" x2="697" y2="72"/>`;
  for (let x = 552; x < 690; x += 14) s += `<line x1="${x}" y1="78" x2="${x + 7}" y2="90"/>`;
  s += `<line x1="600" y1="90" x2="600" y2="170" stroke-dasharray="3 3"/><rect x="592" y="170" width="16" height="10"/>
<rect x="742" y="72" width="30" height="18" fill="#12173f"/></g>`;
  s += mono(60, 60, 'LEVEL 09  +32.400');
  s += `<g stroke="${SOFT}" stroke-opacity=".6"><line x1="60" y1="68" x2="200" y2="68"/><line x1="60" y1="64" x2="60" y2="72"/><line x1="200" y1="64" x2="200" y2="72"/></g>`;
  return s;
}

function oilGasScene() {
  let s = '';
  // sea
  s += `<rect x="0" y="360" width="800" height="140" fill="#030417" fill-opacity=".45"/>`;
  s += `<g fill="none" stroke="${SOFT}">`;
  for (let r = 0; r < 5; r++) {
    let d = `M0 ${372 + r * 24}`;
    for (let x = 0; x < 800; x += 40) d += ` q20 ${-6 + r} 40 0`;
    s += `<path d="${d}" stroke-opacity="${.5 - r * .08}"/>`;
  }
  s += '</g>';
  // jacket
  s += `<g fill="none" stroke="${LINE}" stroke-width="1.6" stroke-opacity=".9">
<polyline points="300,252 262,480"/><polyline points="500,252 538,480"/>
<polyline points="370,252 360,480"/><polyline points="430,252 440,480"/>`;
  const levels = [252, 310, 370, 430, 480];
  const at = (x1, x2, y) => x1 + (x2 - x1) * ((y - 252) / (480 - 252));
  for (let i = 0; i < levels.length; i++) {
    const y = levels[i];
    s += `<line x1="${f(at(300, 262, y))}" y1="${y}" x2="${f(at(500, 538, y))}" y2="${y}" stroke-opacity=".6"/>`;
    if (i < levels.length - 1) {
      const y2 = levels[i + 1];
      s += `<line x1="${f(at(300, 262, y))}" y1="${y}" x2="${f(at(370, 360, y2))}" y2="${y2}" stroke-opacity=".5"/>`;
      s += `<line x1="${f(at(370, 360, y))}" y1="${y}" x2="${f(at(300, 262, y2))}" y2="${y2}" stroke-opacity=".5"/>`;
      s += `<line x1="${f(at(500, 538, y))}" y1="${y}" x2="${f(at(430, 440, y2))}" y2="${y2}" stroke-opacity=".5"/>`;
      s += `<line x1="${f(at(430, 440, y))}" y1="${y}" x2="${f(at(500, 538, y2))}" y2="${y2}" stroke-opacity=".5"/>`;
    }
  }
  s += '</g>';
  // decks & modules
  s += `<g stroke="${LINE}" stroke-opacity=".9" stroke-width="1.4">
<rect x="270" y="232" width="262" height="20" fill="#241bb8" fill-opacity=".55"/>
<rect x="292" y="196" width="100" height="36" fill="#1b2152"/>
<rect x="400" y="206" width="110" height="26" fill="#1b2152"/>
<rect x="250" y="186" width="70" height="8" fill="#8f95ea" fill-opacity=".45"/>
<line x1="262" y1="194" x2="290" y2="232"/><line x1="310" y1="194" x2="300" y2="232"/>
</g>`;
  s += `<g fill="none" stroke="${LINE}" stroke-opacity=".5">`;
  for (let x = 300; x < 392; x += 12) s += `<line x1="${x}" y1="200" x2="${x}" y2="228"/>`;
  s += '</g>';
  // derrick
  s += `<g fill="none" stroke="${LINE}" stroke-width="1.4" stroke-opacity=".9"><polyline points="410,206 446,70 482,206"/>`;
  for (let y = 190; y > 80; y -= 18) {
    const k = (206 - y) / 136, xl = 410 + 36 * k, xr = 482 - 36 * k;
    s += `<line x1="${f(xl)}" y1="${y}" x2="${f(xr)}" y2="${y}" stroke-opacity=".6"/>`;
    const y2 = y - 18, k2 = (206 - y2) / 136;
    if (y2 > 74) s += `<line x1="${f(xl)}" y1="${y}" x2="${f(482 - 36 * k2)}" y2="${y2}" stroke-opacity=".45"/>`;
  }
  s += `<rect x="440" y="62" width="12" height="8"/></g>`;
  // flare boom
  s += `<g stroke="${LINE}" stroke-opacity=".85" fill="none" stroke-width="1.3"><line x1="520" y1="232" x2="640" y2="120"/><line x1="532" y1="232" x2="646" y2="126"/>`;
  for (let i = 0; i < 8; i++) {
    const t = i / 8, t2 = (i + 1) / 8;
    s += `<line x1="${f(520 + 120 * t)}" y1="${f(232 - 112 * t)}" x2="${f(532 + 114 * t2)}" y2="${f(232 - 106 * t2)}" stroke-opacity=".5"/>`;
  }
  s += `</g><path d="M646 118c-6-10 2-16 0-26 10 8 14 18 6 28z" fill="url(#chrome)" fill-opacity=".9"/>`;
  s += `<circle cx="646" cy="104" r="26" fill="#8f95ea" fill-opacity=".12"/>`;
  // helideck H
  s += mono(275, 184, 'H', 'font-size="9" fill="#fff"');
  // annotations
  s += `<g stroke="${SOFT}" stroke-opacity=".6"><line x1="580" y1="232" x2="700" y2="232" stroke-dasharray="2 4"/><line x1="580" y1="360" x2="700" y2="360" stroke-dasharray="2 4"/><line x1="690" y1="236" x2="690" y2="356"/></g>`;
  s += mono(698, 300, 'EL +18.0');
  s += mono(60, 70, 'JACKET  4-LEG');
  s += mono(60, 86, 'SACS  /  AUTOPIPE');
  return s;
}

function gisScene() {
  let s = '';
  // parcels
  s += `<g stroke="${LINE}" stroke-opacity=".16" fill="none">`;
  for (let i = 0; i < 9; i++) s += `<line x1="${40 + i * 38}" y1="330" x2="${10 + i * 38}" y2="480"/>`;
  for (let j = 0; j < 5; j++) s += `<line x1="0" y1="${340 + j * 34}" x2="360" y2="${330 + j * 34}"/>`;
  s += '</g>';
  const hill = (cx, cy, n, sx, sy, seed) => {
    let out = '';
    for (let k = 1; k <= n; k++) {
      const ring = [];
      for (let t = 0; t <= 90; t++) {
        const a = t / 90 * Math.PI * 2;
        const r = 20 * k * (1 + .16 * Math.sin(3 * a + k * .45 + seed) + .07 * Math.cos(5 * a - k * .3));
        ring.push([cx + r * Math.cos(a) * sx, cy + r * Math.sin(a) * sy]);
      }
      const major = k % 4 === 0;
      out += `<polyline points="${pts(ring)}" stroke-opacity="${major ? .8 : .42}" stroke-width="${major ? 1.5 : 1}"/>`;
    }
    return out;
  };
  s += `<g fill="none" stroke="${LINE}">${hill(300, 220, 10, 1.35, .9, 0)}${hill(590, 300, 8, 1.2, .85, 2)}</g>`;
  // route
  s += `<path d="M20 430 C160 400 220 330 330 330 S520 400 620 170 S760 90 790 80" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="8 7" stroke-opacity=".85"/>`;
  // pins
  const pin = (x, y, lbl) => `<g transform="translate(${x} ${y})"><path d="M0 0c-10-14-14-20-14-27a14 14 0 0 1 28 0c0 7-4 13-14 27z" fill="#fff"/><circle cx="0" cy="-27" r="5.5" fill="#0d0a86"/></g>${mono(x + 18, y - 26, lbl, 'fill="#fff" fill-opacity=".8"')}`;
  s += pin(330, 330, 'BM-04');
  s += pin(620, 172, 'BM-11');
  s += pin(160, 402, 'BM-01');
  // survey marks
  s += `<g stroke="${SOFT}" stroke-opacity=".8">`;
  [[300, 220], [590, 300]].forEach(([x, y]) => { s += `<line x1="${x - 6}" y1="${y}" x2="${x + 6}" y2="${y}"/><line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 6}"/>`; });
  s += '</g>';
  // north arrow + scale bar
  s += `<g transform="translate(724 62)"><circle r="22" fill="none" stroke="${LINE}" stroke-opacity=".5"/><path d="M0-18 6 6 0 1-6 6z" fill="#fff"/></g>`;
  s += mono(720, 102, 'N');
  s += `<g><rect x="60" y="60" width="40" height="6" fill="#fff"/><rect x="100" y="60" width="40" height="6" fill="none" stroke="#fff"/><rect x="140" y="60" width="40" height="6" fill="#fff"/></g>`;
  s += mono(60, 82, '0      250     500 m');
  return s;
}

function miningScene() {
  let s = '';
  const surface = x => 150 + 24 * Math.sin(x / 140) + 12 * Math.sin(x / 55 + 1);
  const layer = (i) => x => 210 + i * 62 + 16 * Math.sin(x / 115 + i) + 9 * Math.sin(x / 47 + i * 2);
  const band = (fnTop, opacity, stroke = .5) => {
    let d = `M0 ${f(fnTop(0))}`;
    for (let x = 20; x <= 800; x += 20) d += ` L${x} ${f(fnTop(x))}`;
    d += ' L800 500 L0 500Z';
    return `<path d="${d}" fill="#8f95ea" fill-opacity="${opacity}" stroke="${LINE}" stroke-opacity="${stroke}"/>`;
  };
  s += band(surface, .05, .9);
  for (let i = 0; i < 5; i++) s += band(layer(i), .045 + i * .02);
  // ore body
  const ob = [];
  for (let t = 0; t <= 60; t++) {
    const a = t / 60 * Math.PI * 2;
    const r = 1 + .18 * Math.sin(3 * a) + .1 * Math.cos(5 * a + 1);
    ob.push([480 + Math.cos(a) * 120 * r, 350 + Math.sin(a) * 42 * r - Math.cos(a) * 18]);
  }
  s += `<polygon points="${pts(ob)}" fill="url(#chrome)" fill-opacity=".35" stroke="#fff" stroke-width="1.5"/>`;
  s += `<polygon points="${pts(ob.map(([x, y]) => [480 + (x - 480) * .55, 350 + (y - 350) * .55]))}" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".6" stroke-dasharray="3 3"/>`;
  // drill holes
  [[250, 330], [420, 400], [560, 395], [680, 300]].forEach(([x, depth], i) => {
    const y0 = surface(x);
    s += `<g stroke="#fff" stroke-opacity=".85"><line x1="${x}" y1="${f(y0)}" x2="${x + (i % 2 ? 14 : -10)}" y2="${depth}" stroke-dasharray="4 4"/>`;
    s += `<polyline points="${x - 9},${f(y0)} ${x},${f(y0 - 26)} ${x + 9},${f(y0)}" fill="none"/></g>`;
    for (let k = 1; k < 5; k++) {
      const t = k / 5;
      s += `<circle cx="${f(x + (i % 2 ? 14 : -10) * t)}" cy="${f(y0 + (depth - y0) * t)}" r="2.6" fill="#fff"/>`;
    }
    s += mono(x + 12, f(y0 - 18), 'DH-0' + (i + 1), 'fill="#fff" fill-opacity=".75"');
  });
  // depth axis
  s += `<g stroke="${SOFT}" stroke-opacity=".6"><line x1="36" y1="160" x2="36" y2="470"/>`;
  for (let k = 0; k <= 6; k++) s += `<line x1="32" y1="${160 + k * 50}" x2="40" y2="${160 + k * 50}"/>`;
  s += '</g>';
  for (let k = 0; k <= 6; k += 2) s += mono(46, 164 + k * 50, `-${k * 25} m`);
  s += mono(60, 60, 'LEAPFROG GEO  ·  SECTION A–A');
  return s;
}

function archiveScene() {
  const R = rng(7);
  const plan = [
    [20, 20, 230, 20], [230, 20, 230, 280], [230, 280, 20, 280], [20, 280, 20, 20],
    [20, 140, 120, 140], [140, 20, 140, 110], [140, 150, 140, 200], [140, 200, 230, 200],
    [60, 200, 60, 280], [180, 60, 230, 60],
  ];
  let s = '';
  // left sheet: raster
  s += `<g transform="translate(96 108) rotate(-4)"><rect width="250" height="300" fill="#fff" fill-opacity=".07" stroke="${LINE}" stroke-opacity=".5"/>`;
  plan.forEach(([x1, y1, x2, y2]) => {
    const len = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(len / 5);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = x1 + (x2 - x1) * t + (R() - .5) * 1.6, y = y1 + (y2 - y1) * t + (R() - .5) * 1.6;
      s += `<rect x="${f(x - 2)}" y="${f(y - 2)}" width="4" height="4" fill="#fff" fill-opacity="${f(.35 + R() * .55)}"/>`;
    }
  });
  for (let i = 0; i < 90; i++) s += `<rect x="${f(10 + R() * 230)}" y="${f(10 + R() * 280)}" width="2" height="2" fill="#fff" fill-opacity="${f(R() * .25)}"/>`;
  s += '</g>';
  // arrow
  s += `<g stroke="#fff" stroke-width="2" fill="none"><line x1="372" y1="258" x2="428" y2="258"/><polyline points="418,248 430,258 418,268"/></g>`;
  s += mono(378, 242, 'R2V', 'fill="#fff"');
  // right sheet: vector
  s += `<g transform="translate(454 100)"><rect width="250" height="300" fill="#0d0a86" fill-opacity=".35" stroke="${LINE}" stroke-opacity=".8"/><g stroke="#fff" stroke-width="2.4" stroke-linecap="square">`;
  plan.forEach(([x1, y1, x2, y2]) => { s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; });
  s += `</g><g fill="none" stroke="${SOFT}"><path d="M120 140 A20 20 0 0 1 140 120"/><path d="M140 150 A18 18 0 0 0 158 168"/>
<line x1="20" y1="296" x2="230" y2="296"/><line x1="20" y1="292" x2="20" y2="300"/><line x1="230" y1="292" x2="230" y2="300"/></g>`;
  s += `<text x="112" y="292" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="9" fill="${SOFT}">12 400</text></g>`;
  s += mono(96, 76, 'SCAN · 400 DPI · TIFF');
  s += mono(454, 76, 'VECTOR · DWG / DGN');
  return s;
}

function bimScene() {
  const P = isoFactory(400, 340);
  const b = { x: -120, y: -90, w: 210, d: 150, h: 230, floors: 8 };
  let s = isoGround(P, -240, 240, 30, .1);
  s += `<defs><clipPath id="solidHalf"><rect x="400" y="0" width="400" height="500"/></clipPath><clipPath id="wireHalf"><rect x="0" y="0" width="400" height="500"/></clipPath></defs>`;
  s += `<g clip-path="url(#wireHalf)">${isoBox(P, b, 'wire')}</g>`;
  s += `<g clip-path="url(#solidHalf)">${isoBox(P, b, 'solid')}</g>`;
  s += `<rect x="398" y="40" width="4" height="420" fill="#fff" fill-opacity=".9"/><rect x="380" y="40" width="40" height="420" fill="#8f95ea" fill-opacity=".12"/>`;
  s += mono(250, 70, 'CAD  ·  2D LINEWORK', 'fill="#fff" fill-opacity=".7"');
  s += mono(430, 70, 'BIM  ·  PARAMETRIC MODEL', 'fill="#fff" fill-opacity=".9"');
  return s;
}

function awardScene() {
  // Everything that matters sits inside a central safe area (x 120–680, y 90–410) so the artwork
  // survives every crop it is shown in: 21:9 article covers, 16:10 cards and the near-square award panel.
  const cx = 400, cy = 200; // medallion centre
  const RING = 76; // medallion radius
  const STEM = 100; // laurel stem radius
  const rad = d => (d * Math.PI) / 180;
  let s = '';

  s += `<defs>
<radialGradient id="awardGlow" cx=".5" cy=".4" r=".5"><stop offset="0" stop-color="#241bb8" stop-opacity=".75"/><stop offset="1" stop-color="#241bb8" stop-opacity="0"/></radialGradient>
<radialGradient id="medal" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#2a22c4"/><stop offset=".65" stop-color="#0d0a86"/><stop offset="1" stop-color="#080660"/></radialGradient>
</defs>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="300" ry="210" fill="url(#awardGlow)"/>`;

  // background stars, kept away from the text column
  const R = rng(3);
  for (let i = 0; i < 70; i++) {
    const x = R() * 800, y = R() * 500, r = R() * 1.5 + .4, o = R() * .45 + .1;
    if (x > 230 && x < 570 && y > 80 && y < 420) continue;
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff" fill-opacity="${f(o)}"/>`;
  }

  // decorative rings: upper arcs only, so they never cross the caption below
  const arc = (r, from, to) => {
    const p = a => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
    const [x1, y1] = p(from), [x2, y2] = p(to);
    return `M${f(x1)} ${f(y1)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${f(x2)} ${f(y2)}`;
  };
  s += `<g fill="none" stroke="${LINE}">
<path d="${arc(140, 160, 380)}" stroke-opacity=".22"/>
<path d="${arc(172, 175, 365)}" stroke-opacity=".14" stroke-dasharray="2 7"/>
<path d="${arc(206, 190, 350)}" stroke-opacity=".08"/>
</g>`;

  // laurel: two stems that open at the bottom, leaves alternating outside/inside and shrinking towards the tips
  const LEAVES = 13;
  const laurel = side => {
    const start = 28, end = 150; // degrees from straight down
    const pt = (deg, r) => [cx + side * r * Math.sin(rad(deg)), cy + r * Math.cos(rad(deg))];
    const [sx, sy] = pt(start, STEM), [ex, ey] = pt(end, STEM);
    let out = `<path d="M${f(sx)} ${f(sy)} A${STEM} ${STEM} 0 0 ${side > 0 ? 0 : 1} ${f(ex)} ${f(ey)}" fill="none" stroke="url(#chrome)" stroke-width="2" stroke-linecap="round" stroke-opacity=".85"/>`;
    for (let i = 0; i < LEAVES; i++) {
      const t = i / (LEAVES - 1);
      const deg = start + 6 + t * (end - start - 10);
      const outer = i % 2 === 0;
      const [x, y] = pt(deg, STEM + (outer ? 6.5 : -6.5));
      // tangent pointing up the stem, then tilted away from it
      const tangent = (Math.atan2(-Math.sin(rad(deg)), side * Math.cos(rad(deg))) * 180) / Math.PI;
      const tilt = tangent + side * (outer ? -32 : 32);
      // small at the base, fullest in the middle, fine at the tips
      const len = 7.5 + Math.sin(Math.PI * (0.25 + t * 0.75)) * 4.5, wid = 2.8 + Math.sin(Math.PI * (0.25 + t * 0.75)) * 1.6;
      out += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(len)}" ry="${f(wid)}" transform="rotate(${f(tilt)} ${f(x)} ${f(y)})" fill="url(#chrome)" fill-opacity="${f(.95 - t * .3)}"/>`;
    }
    // top bud
    const [bx, by] = pt(end + 4, STEM);
    out += `<circle cx="${f(bx)}" cy="${f(by)}" r="3.2" fill="url(#chrome)" fill-opacity=".7"/>`;
    return out;
  };
  s += laurel(-1) + laurel(1);

  // star where the stems meet
  const star = (x, y, r) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = rad(-90 + i * 36), rr = i % 2 ? r * .45 : r;
      p.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]);
    }
    return `<polygon points="${pts(p)}" fill="url(#chrome)"/>`;
  };
  s += star(cx, cy + STEM + 4, 8);

  // medallion
  s += `<circle cx="${cx}" cy="${cy}" r="${RING + 6}" fill="#030417" fill-opacity=".35"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${RING}" fill="url(#medal)" stroke="url(#chrome)" stroke-width="3.5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${RING - 9}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-dasharray="1.5 5"/>`;
  s += `<text x="${cx}" y="${cy - 34}" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="11" letter-spacing="4" fill="#fff" fill-opacity=".85"><tspan dx="2">2025</tspan></text>`;
  s += `<text x="${cx}" y="${cy + 26}" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="72" letter-spacing="-2" fill="url(#chrome)">#1</text>`;

  // caption
  const dividerY = cy + STEM + 34;
  s += `<g stroke="${SOFT}" stroke-opacity=".6"><line x1="${cx - 90}" y1="${dividerY}" x2="${cx - 14}" y2="${dividerY}"/><line x1="${cx + 14}" y1="${dividerY}" x2="${cx + 90}" y2="${dividerY}"/></g>`;
  s += `<rect x="${cx - 4}" y="${dividerY - 4}" width="8" height="8" transform="rotate(45 ${cx} ${dividerY})" fill="${SOFT}"/>`;
  s += `<text x="${cx}" y="${dividerY + 32}" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="700" font-size="17" letter-spacing="5" fill="#fff"><tspan dx="2.5">TOP-PERFORMING PARTNER</tspan></text>`;
  s += `<text x="${cx}" y="${dividerY + 56}" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="11" letter-spacing="3.5" fill="${SOFT}"><tspan dx="1.75">BENTLEY SYSTEMS · SUB-SAHARAN AFRICA</tspan></text>`;
  return s;
}

function historyScene() {
  let s = `<text x="760" y="420" text-anchor="end" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="300" fill="#fff" fill-opacity=".04">35</text>`;
  s += `<line x1="60" y1="270" x2="740" y2="270" stroke="${LINE}" stroke-opacity=".5" stroke-width="1.5"/>`;
  for (let x = 60; x <= 740; x += 17) s += `<line x1="${x}" y1="266" x2="${x}" y2="274" stroke="${LINE}" stroke-opacity=".25"/>`;
  const nodes = [[130, '1989', 'CDSS INCORPORATED', -1], [300, '1992', 'FIRST AUTOCAD IN NIGERIA', 1], [500, '2000s', 'MULTI-VENDOR PORTFOLIO', -1], [670, '2025', '#1 BENTLEY PARTNER · AFRICA', 1]];
  nodes.forEach(([x, year, label, dir]) => {
    const y = 270 + dir * 90;
    s += `<line x1="${x}" y1="270" x2="${x}" y2="${y}" stroke="${LINE}" stroke-opacity=".5" stroke-dasharray="3 4"/>`;
    s += `<circle cx="${x}" cy="270" r="11" fill="#0d0a86" stroke="#fff" stroke-width="2"/><circle cx="${x}" cy="270" r="4" fill="#fff"/>`;
    s += `<text x="${x}" y="${dir < 0 ? y - 28 : y + 30}" text-anchor="middle" font-family="Plus Jakarta Sans,Arial,sans-serif" font-weight="800" font-size="34" fill="url(#chrome)">${year}</text>`;
    s += `<text x="${x}" y="${dir < 0 ? y - 8 : y + 50}" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="9.5" letter-spacing="1.5" fill="${SOFT}">${label}</text>`;
  });
  return s;
}

function pipelineScene() {
  const path = 'M-20 390 L250 390 Q300 390 330 360 L400 290 Q430 260 480 260 L820 260';
  let s = `<path d="${path}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="42" stroke-linejoin="round"/>`;
  s += `<path d="${path}" fill="none" stroke="#12173f" stroke-width="38" stroke-linejoin="round"/>`;
  s += `<path d="${path}" fill="none" stroke="#241bb8" stroke-opacity=".7" stroke-width="16" stroke-linejoin="round" transform="translate(0 -8)"/>`;
  s += `<path d="${path}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" transform="translate(0 -13)"/>`;
  [[120, 390], [560, 260], [700, 260]].forEach(([x, y]) => { s += `<rect x="${x - 6}" y="${y - 27}" width="12" height="54" rx="2" fill="#dfe2ff" fill-opacity=".85"/>`; });
  // weld seams
  [[200, 390], [620, 260]].forEach(([x, y]) => { s += `<line x1="${x}" y1="${y - 20}" x2="${x}" y2="${y + 20}" stroke="#fff" stroke-opacity=".4" stroke-dasharray="2 2"/>`; });
  // inspection chart
  const bx = 420, by = 60, bw = 330, bh = 140;
  s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" fill="#030417" fill-opacity=".7" stroke="${LINE}" stroke-opacity=".35"/>`;
  const R = rng(11);
  const series = [];
  for (let i = 0; i <= 60; i++) {
    let v = .35 + (R() - .5) * .08;
    if (i > 36 && i < 44) v += Math.sin((i - 36) / 8 * Math.PI) * .32;
    series.push([bx + 20 + i * ((bw - 40) / 60), by + 30 + v * (bh - 50)]);
  }
  s += `<line x1="${bx + 20}" y1="${by + 104}" x2="${bx + bw - 20}" y2="${by + 104}" stroke="#ffb4b4" stroke-opacity=".8" stroke-dasharray="5 4"/>`;
  s += `<polyline points="${pts(series)}" fill="none" stroke="#fff" stroke-width="1.8"/>`;
  s += `<circle cx="${f(series[40][0])}" cy="${f(series[40][1])}" r="11" fill="none" stroke="#ffb4b4" stroke-width="1.5"/>`;
  s += mono(bx + 20, by + 22, 'WALL THICKNESS · MM');
  s += mono(bx + bw - 118, by + 120, 'MIN. REQUIRED', 'fill="#ffb4b4" fill-opacity=".85"');
  s += mono(60, 470, 'KP 12+400  →  KP 14+900');
  return s;
}

function simulationScene() {
  const inside = (x, y) => {
    const inL = (x >= 170 && x <= 300 && y >= 100 && y <= 390) || (x >= 170 && x <= 660 && y >= 290 && y <= 390);
    const h1 = Math.hypot(x - 235, y - 165) < 30, h2 = Math.hypot(x - 590, y - 340) < 22;
    return inL && !h1 && !h2;
  };
  const stops = [[13, 10, 134], [36, 27, 184], [143, 149, 234], [223, 226, 255], [255, 255, 255]];
  const color = v => {
    v = Math.max(0, Math.min(1, v)) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(v)), t = v - i;
    const c = stops[i].map((a, k) => Math.round(a + (stops[i + 1][k] - a) * t));
    return `rgb(${c.join(',')})`;
  };
  const stress = (x, y) => {
    const d = Math.hypot(x - 300, y - 290);
    return Math.exp(-d / 85) * .95 + (y > 360 ? .12 : 0) * Math.exp(-Math.abs(x - 300) / 200);
  };
  let s = '<g stroke="#fff" stroke-opacity=".18" stroke-width=".6">';
  const step = 18;
  for (let y = 100; y < 390; y += step) {
    for (let x = 170; x < 660; x += step) {
      const q = [[x, y], [x + step, y], [x + step, y + step], [x, y + step]];
      const tris = ((x + y) / step) % 2 ? [[q[0], q[1], q[2]], [q[0], q[2], q[3]]] : [[q[0], q[1], q[3]], [q[1], q[2], q[3]]];
      tris.forEach(t => {
        const cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
        if (!inside(cx, cy)) return;
        s += `<polygon points="${pts(t)}" fill="${color(stress(cx, cy))}"/>`;
      });
    }
  }
  s += '</g>';
  s += `<g fill="none" stroke="#fff" stroke-width="1.6"><circle cx="235" cy="165" r="30"/><circle cx="590" cy="340" r="22"/></g>`;
  // fixed support hatch
  s += `<g stroke="${LINE}" stroke-opacity=".8"><line x1="160" y1="96" x2="160" y2="394" stroke-width="2"/>`;
  for (let y = 100; y < 394; y += 14) s += `<line x1="160" y1="${y}" x2="146" y2="${y + 12}"/>`;
  s += '</g>';
  // load arrows
  s += `<g stroke="#fff" stroke-width="1.8" fill="#fff">`;
  [610, 640].forEach(x => { s += `<line x1="${x}" y1="210" x2="${x}" y2="282"/><path d="M${x - 6} 272 ${x} 286 ${x + 6} 272z"/>`; });
  s += '</g>';
  s += mono(596, 200, 'F = 12 kN', 'fill="#fff"');
  // legend
  s += `<defs><linearGradient id="lg" x1="0" y1="1" x2="0" y2="0">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="rgb(${c.join(',')})"/>`).join('')}</linearGradient></defs>`;
  s += `<rect x="720" y="110" width="14" height="220" fill="url(#lg)" stroke="#fff" stroke-opacity=".4"/>`;
  ['MAX', '', 'MID', '', 'MIN'].forEach((t, i) => { if (t) s += mono(742, 118 + i * 55, t); });
  s += mono(60, 60, 'VON MISES STRESS · STATIC STRUCTURAL');
  return s;
}

function trainingScene() {
  const P = isoFactory(400, 300);
  let s = `<rect x="170" y="70" width="460" height="300" rx="14" fill="#030417" fill-opacity=".6" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>`;
  s += `<rect x="186" y="86" width="428" height="268" rx="6" fill="#0d0a86" fill-opacity=".35"/>`;
  s += `<path d="M360 370 L340 420 H460 L440 370" fill="#12173f" stroke="#fff" stroke-opacity=".5"/><line x1="300" y1="420" x2="500" y2="420" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>`;
  s += `<g>${isoBox(P, { x: -70, y: -40, w: 110, d: 80, h: 120, floors: 5 }, 'solid')}${isoBox(P, { x: 50, y: -10, w: 60, d: 60, h: 70, floors: 3 }, 'solid')}</g>`;
  // UI chrome
  s += `<g fill="#fff" fill-opacity=".5"><circle cx="204" cy="102" r="4"/><circle cx="218" cy="102" r="4"/><circle cx="232" cy="102" r="4"/></g>`;
  s += `<g fill="#fff" fill-opacity=".14"><rect x="200" y="120" width="70" height="8" rx="4"/><rect x="200" y="136" width="54" height="8" rx="4"/><rect x="200" y="152" width="62" height="8" rx="4"/></g>`;
  // certificate badge
  s += `<g transform="translate(610 120)"><circle r="48" fill="#0d0a86" stroke="url(#chrome)" stroke-width="3"/><circle r="38" fill="none" stroke="#fff" stroke-opacity=".4" stroke-dasharray="2 4"/><path d="M-14 0 -4 10 16-10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  s += mono(566, 190, 'CERTIFIED', 'fill="#fff" letter-spacing="2"');
  return s;
}

const scenes = {
  'hero': () => frame(aecScene({ contours: true }), { label: 'DWG 00 · OVERVIEW', gx: .5, gy: .1 }),
  'industry-aec': () => frame(aecScene(), { label: 'DWG 02 · AEC' }),
  'industry-oil-gas': () => frame(oilGasScene(), { label: 'DWG 01 · OFFSHORE', gx: .8, gy: .15 }),
  'industry-gis': () => frame(gisScene(), { label: 'DWG 03 · SURVEY', gx: .3, gy: .3 }),
  'industry-mining': () => frame(miningScene(), { label: 'DWG 04 · GEOSCIENCE', gx: .6, gy: .7 }),
  'archive': () => frame(archiveScene(), { label: 'DWG 05 · BUREAU', gx: .7, gy: .4 }),
  'bim': () => frame(bimScene(), { label: 'DWG 06 · CAD → BIM', gx: .6, gy: .2 }),
  'award': () => frame(awardScene(), { gx: .5, gy: .45 }),
  'history': () => frame(historyScene(), { label: 'DWG 07 · 1989 → TODAY', gx: .85, gy: .3 }),
  'pipeline': () => frame(pipelineScene(), { label: 'DWG 08 · PIPELINE', gx: .8, gy: .2 }),
  'simulation': () => frame(simulationScene(), { label: 'DWG 09 · FEA', gx: .35, gy: .6 }),
  'training': () => frame(trainingScene(), { label: 'DWG 10 · TRAINING', gx: .7, gy: .15 }),
};

const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'public', 'img');
fs.mkdirSync(out, { recursive: true });
for (const [name, render] of Object.entries(scenes)) fs.writeFileSync(path.join(out, name + '.svg'), render());
console.log('Wrote ' + Object.keys(scenes).length + ' illustrations to public/img');
