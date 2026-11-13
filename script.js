/* ==========================================================================
   Memorabilia Teatral Matamorense · script.js
   JS vanilla, sin dependencias. Todo es mejora progresiva: si algo falla,
   el contenido sigue visible (ver respaldos en index.html y styles.css).
   ========================================================================== */
(() => {
'use strict';

/* ---------- Configuración (única fuente de verdad) ---------- */
const WHATSAPP_NUMERO = '528681159959';        // Vacío = se oculta WhatsApp y queda solo el correo
const YOUTUBE_URLS = {                          // clave = data-yt-link de la tarjeta en index.html; sin enlace = sigue "Próximamente"
  zuniga:   'https://youtu.be/jU-wkTuVCsk',     // Entrevista · Luis Zúñiga
  fajardo:  'https://youtu.be/1wNXPG8xSfs',     // Entrevista · Ramón Fajardo
  garcia:   'https://youtu.be/tIT7Ye97F1Y',     // Entrevista · Joaquín García Quintana
  addis:    'https://youtu.be/e0ZViQ3-WIA',     // Entrevista · Addis Abeba Santacruz
  cisneros: 'https://youtu.be/4p2nXUZ-mGA',     // Entrevista · Carolina Cisneros
  castro:   'https://youtu.be/I5vXjjAGTeE',     // Entrevista · Ana Karen Castro
  zamora:   'https://youtu.be/_utwPb2YWzY',     // Entrevista · Marco A. Zamora
  cruce:    'https://youtu.be/wbyuEvosIlI',     // Obra · El cruce
  arbol:    'https://youtu.be/pa4SwiltjuM',     // Obra · El árbol
  sorjuana: 'https://youtu.be/nhSSVqtmLkw'      // Obra · Transfiguraciones de Sor Juana
  // lopez: 'https://youtu.be/…'                // Entrevista · Oscar Luis López Carreón (aún sin video)
};
const MENSAJE_BASE = 'Hola, vi la página de Memorabilia Teatral Matamorense y quiero participar.';
const EMAIL = 'memorabilateatralmatamorense@gmail.com';

/* ---------- Utilidades ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const root = document.documentElement;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const pad2 = n => String(n).padStart(2, '0');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINO = matchMedia('(hover: hover) and (pointer: fine)').matches;
const SIN_HOVER = matchMedia('(hover: none)').matches;
let vw = innerWidth, vh = innerHeight;

window.__ok = true;                             // avisa al respaldo del <head> que el script está vivo
root.classList.add(RM ? 'rm' : 'mo');

/* ---------- WhatsApp ---------- */
const waURL = t => WHATSAPP_NUMERO ? `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}` : '';
function initWA() {
  $$('[data-wa]').forEach(a => {
    const t = a.dataset.wa || MENSAJE_BASE;
    if (WHATSAPP_NUMERO) {
      a.href = waURL(t); a.target = '_blank'; a.rel = 'noopener noreferrer';
    } else if (a.classList.contains('wa-flot')) {
      a.hidden = true;
    } else {
      a.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Memorabilia Teatral Matamorense')}&body=${encodeURIComponent(t)}`;
    }
  });
  if (!WHATSAPP_NUMERO) root.classList.add('sin-wa');
}

/* ---------- Cargador: contador (el telón se abre por CSS) ---------- */
function cargador() {
  const c = $('#cargador'), num = $('#cgNum');
  if (!c) { root.classList.add('listo'); return; }
  const t0 = performance.now(), D = 1500;
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  (function paso(t) {
    const k = clamp((t - t0) / D);
    if (num) num.textContent = `ACTO I · ${String(Math.round(ease(k) * 100)).padStart(3, '0')} %`;
    if (k < 1) requestAnimationFrame(paso); else root.classList.add('listo');
  })(t0);
  setTimeout(() => { root.classList.add('listo'); c.remove(); }, 2450);
}

/* ---------- Revelados con respaldo por geometría ---------- */
let revealGeo = () => {};
function reveals() {
  const els = $$('.rv');
  let io = null;
  const show = el => { el.classList.add('in'); if (io) io.unobserve(el); };
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) show(e.target); }), { threshold: .01, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => io.observe(e));
  }
  revealGeo = () => {
    for (const el of els) {
      if (el.classList.contains('in')) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight * .97) show(el);
    }
  };
  revealGeo();
  setTimeout(revealGeo, 2000);
  setTimeout(revealGeo, 4500);
}

/* ---------- Header: tema, menú, enlace activo ---------- */
const cab = $('#cab');
function temaHeader() {
  if (!('IntersectionObserver' in window) || !cab) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) cab.dataset.t = (e.target.dataset.tema === 'claro' || e.target.dataset.tema === 'kraft') ? 'claro' : 'oscuro';
  }), { rootMargin: '-40px 0px -90% 0px' });
  $$('[data-tema]').forEach(s => io.observe(s));
}
function menu() {
  const b = $('#burger'), m = $('#menu');
  if (!b || !m) return;
  const set = on => {
    root.classList.toggle('menu-on', on);
    root.classList.toggle('bloq', on);
    b.setAttribute('aria-expanded', String(on));
    b.setAttribute('aria-label', on ? 'Cerrar menú' : 'Abrir menú');
    m.setAttribute('aria-hidden', String(!on));
  };
  b.addEventListener('click', () => set(!root.classList.contains('menu-on')));
  $$('a', m).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-on')) set(false); });
  addEventListener('resize', () => { if (innerWidth >= 1024 && root.classList.contains('menu-on')) set(false); });
}
const secIds = $$('[data-tema]').map(s => s.id).filter(Boolean);
const navLinks = $$('.nav a');
function espia() {
  const y = vh * .4;
  let actual = null;
  for (const id of secIds) {
    const el = document.getElementById(id), r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) { actual = id; break; }
  }
  navLinks.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + actual));
}

/* ---------- Polvo (canvas) ---------- */
function crearPolvo(canvas, { max = 90, movil = 40, haz = false, color = '255,226,176', base = .12 } = {}) {
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (!ctx) return null;
  let w = 0, h = 0, ps = [];
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const nuevo = () => ({ x: Math.random() * w, y: Math.random() * h, r: .6 + Math.random() * 1.7, s: .12 + Math.random() * .45, o: Math.random() * 6.28, k: .3 + Math.random() });
  function size() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = innerWidth < 700 ? movil : max;
    while (ps.length < n) ps.push(nuevo());
    ps.length = n;
    ps.forEach(p => { if (p.x > w) p.x = Math.random() * w; if (p.y > h) p.y = Math.random() * h; });
  }
  function draw(t, b) {
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const tg = b ? Math.tan(b.ang * Math.PI / 180) : 0;
    for (const p of ps) {
      p.y -= p.s * .6;
      p.x += Math.sin(t / 1800 * p.k + p.o) * .25;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      let a = base;
      if (haz && b) {
        const cx = b.ox - p.y * tg;
        const half = Math.max(30, b.W * (.04 + .30 * clamp(p.y / b.H)) * .9);
        const d = Math.abs(p.x - cx) / half;
        a = d < 1 ? base + (.9 - base) * (1 - d * d) : base * .7;
      }
      ctx.fillStyle = `rgba(${color},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      if (a > .5) { ctx.fillStyle = `rgba(${color},${(a * .14).toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.4, 0, 6.2832); ctx.fill(); }
    }
  }
  size();
  return { size, draw };
}

/* ---------- Hero ---------- */
const hero = $('#inicio'), haz = $('#haz'), heroVis = $('#heroVis'), tiltH = $('#tiltH');
const mouse = { x: 0, y: 0, tx: 0, ty: 0, cx: -1, cy: -1, ang: 0 };
let heroOn = true, heroTop = 0, heroLeft = 0, polvoH = null, polvoT = null;
let beam = { ox: 0, W: 1, H: 1 };

function splitHero() {
  $$('[data-split]').forEach(el => {
    const txt = el.textContent.trim();
    const letras = Array.from(txt).map((ch, i) => `<span class="l" style="--i:${i}">${ch}</span>`).join('');
    el.innerHTML = `<span class="sr">${txt}</span><span class="ls" aria-hidden="true">${letras}</span>`;
  });
}
function medirHero() {
  if (!hero) return;
  const hr = hero.getBoundingClientRect(), vr = heroVis.getBoundingClientRect();
  if (vw >= 1024) hero.style.setProperty('--hx', (vr.left + vr.width / 2 - hr.left).toFixed(0) + 'px');
  else hero.style.removeProperty('--hx');
  beam = { ox: haz.offsetLeft, W: haz.offsetWidth || 1, H: haz.offsetHeight || 1 };
}
function heroFrame(t) {
  mouse.x = lerp(mouse.x, mouse.tx, .06); mouse.y = lerp(mouse.y, mouse.ty, .06);
  if (FINO && tiltH) {
    tiltH.style.setProperty('--rx', (-mouse.y * 6).toFixed(2) + 'deg');
    tiltH.style.setProperty('--ry', (mouse.x * 6).toFixed(2) + 'deg');
  }
  const swing = -6 * Math.cos(t / 10000 * Math.PI);
  let extra = 0;
  if (FINO && mouse.cx >= 0 && vw >= 1024) {
    const dx = mouse.cx - (heroLeft + beam.ox), dy = Math.max(120, mouse.cy - heroTop);
    extra = clamp(Math.atan2(dx, dy) * 180 / Math.PI, -16, 16) * -1;
  }
  mouse.ang = lerp(mouse.ang, swing * .7 + extra * .6, .05);
  if (haz) {
    haz.classList.add('haz-js');
    haz.style.transform = `translateX(-50%) rotate(${mouse.ang.toFixed(2)}deg)`;
  }
  if (polvoH) polvoH.draw(t, { ox: beam.ox, ang: mouse.ang, W: beam.W, H: beam.H });
}

/* ---------- Luz de cursor y botones magnéticos ---------- */
const luces = [];
function initLuz() {
  if (!FINO) return;
  $$('[data-luz]').forEach(sec => {
    const el = document.createElement('div');
    el.className = 'luz-cur'; el.setAttribute('aria-hidden', 'true');
    sec.appendChild(el);
    luces.push({ sec, el, x: 0, y: 0, tx: 0, ty: 0 });
  });
}
function frameLuz() {
  if (!luces.length || mouse.cx < 0) return;
  for (const L of luces) {
    const r = L.sec.getBoundingClientRect();
    const dentro = mouse.cx >= r.left && mouse.cx <= r.right && mouse.cy >= r.top && mouse.cy <= r.bottom && r.bottom > 0 && r.top < innerHeight;
    L.el.classList.toggle('on', dentro);
    if (!dentro) continue;
    L.tx = mouse.cx - r.left; L.ty = mouse.cy - r.top;
    L.x = lerp(L.x || L.tx, L.tx, .08); L.y = lerp(L.y || L.ty, L.ty, .08);
    L.el.style.setProperty('--mx', L.x.toFixed(0) + 'px'); L.el.style.setProperty('--my', L.y.toFixed(0) + 'px');
  }
}
function magneticos() {
  if (!FINO) return;
  $$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = `translate(${(dx * 10).toFixed(1)}px,${(dy * 10).toFixed(1)}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ---------- Manifiesto: palabra por palabra y máscaras que se dibujan ---------- */
const man = { el: $('#manGr'), words: [] };
const dib = { svg: $('#mascSvg'), wrap: $('.man-dib') };
function initManifiesto() {
  if (man.el && !RM) {
    const txt = man.el.textContent.trim().split(/\s+/);
    man.el.setAttribute('aria-label', txt.join(' '));
    man.el.innerHTML = txt.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    man.words = $$('.w', man.el);
  }
}
const applyMan = q => {
  const n = man.words.length;
  man.words.forEach((w, i) => w.style.setProperty('--p', clamp((q * (n + 5) - i) / 5).toFixed(3)));
};
const applyDib = q => {
  if (!dib.svg) return;
  dib.svg.style.setProperty('--dr', ((1 - q) * 1.03).toFixed(3));
  dib.svg.classList.toggle('lleno', q > .97);
};

/* ---------- Estado suavizado (lerp) de efectos ligados al scroll ---------- */
const tun = { pista: $('#tunelPista'), mundo: $('#tunelMundo'), figs: $$('.tf'), intro: $('#tunelIntro'), cont: $('#tunelCont'), fin: $('#tunelFin'), N: 0, SP: 520, last: -1 };
tun.N = tun.figs.length;
const pap = { pista: $('#papelesPista'), track: $('#papelesTrack'), ghost: $('#h-pap'), dist: 0 };
const ros = { pista: $('#rostrosPista'), clip: $('#clipIn') };

function layoutTun() {
  if (RM) return;                               // en reduced-motion el túnel es una rejilla estática
  const mob = vw < 700;
  tun.SP = mob ? 440 : 520;
  const R = vw * (mob ? .20 : .26);
  tun.figs.forEach((f, i) => {
    const a = i * 137.5 * Math.PI / 180;
    f.style.transform = `translate(-50%,-50%) translate3d(${(Math.cos(a) * R).toFixed(1)}px,${(Math.sin(a) * R * .6).toFixed(1)}px,${-i * tun.SP}px)`;
  });
}
const tunOpacidad = ez => {
  if (ez < -1500 || ez > 620) return 0;
  if (ez < -400) return (ez + 1500) / 1100;
  if (ez <= 150) return 1;
  return 1 - (ez - 150) / 470;
};
function applyTun(p) {
  if (!tun.mundo || RM) return;
  const d = p * tun.N * tun.SP;
  tun.mundo.style.transform = `translate3d(0,0,${d.toFixed(1)}px)`;
  tun.figs.forEach((f, i) => {
    const o = tunOpacidad(-i * tun.SP + d);
    f.style.opacity = o.toFixed(3);
    f.style.visibility = o < .01 ? 'hidden' : 'visible';
    f.style.pointerEvents = o > .6 ? 'auto' : 'none';
  });
  const idx = clamp(Math.round(d / tun.SP), 0, tun.N - 1) + 1;
  if (idx !== tun.last && tun.cont) { tun.last = idx; tun.cont.textContent = `Pieza ${pad2(idx)} / ${pad2(tun.N)}`; }
  if (tun.intro) tun.intro.style.opacity = (1 - clamp(p * 7)).toFixed(2);
  if (tun.fin) { tun.fin.style.opacity = clamp((p - .86) * 9).toFixed(2); tun.fin.style.pointerEvents = p > .9 ? 'auto' : 'none'; }
}
const papActivo = () => !RM && vw >= 900 && pap.track;
function applyPap(p) {
  if (!pap.track) return;
  if (!papActivo()) { pap.track.style.transform = ''; if (pap.ghost) pap.ghost.style.transform = ''; return; }
  pap.track.style.transform = `translate3d(${(-p * pap.dist).toFixed(1)}px,0,0)`;
  if (pap.ghost) pap.ghost.style.transform = `translate3d(${(p * vw * .22).toFixed(1)}px,0,0)`;
}
const applyRos = c => { if (ros.clip) ros.clip.style.setProperty('--c', c.toFixed(3)); };

const S = {
  man: { t: 0, c: 0, f: applyMan },
  dib: { t: 0, c: 0, f: applyDib },
  tun: { t: 0, c: 0, f: applyTun },
  pap: { t: 0, c: 0, f: applyPap },
  ros: { t: 1, c: 1, f: applyRos }
};
function suavizar() {
  for (const k in S) {
    const o = S[k], d = o.t - o.c;
    if (Math.abs(d) > .0004) {
      o.c += d * (k === 'tun' ? .09 : .12);
      if (Math.abs(o.t - o.c) < .0004) o.c = o.t;
      o.f(o.c);
    }
  }
}
function snap() { for (const k in S) { S[k].c = S[k].t; S[k].f(S[k].c); } }

/* ---------- Efectos por scroll sin suavizado ---------- */
const barra = $('#progreso'), waF = $('#waFlot');
const actos = $$('.acto');
const lt = { el: $('#lt'), fill: $('#ltFill'), nodos: $$('.nodo') };
const wm = $('#wordmark');

function progresoPinned(pista) {
  const r = pista.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - vh));
}
function actosScroll() {
  if (!actos.length) return;
  const sticky = vw >= 900;
  actos.forEach((c, i) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--ab', clamp((vh * .95 - r.top) / (vh * .9)).toFixed(3));
    if (!sticky || i === actos.length - 1) { c.style.removeProperty('--e'); return; }
    const nx = actos[i + 1].getBoundingClientRect();
    const fin = 84 + (i + 1) * 22;
    c.style.setProperty('--e', clamp((vh * .95 - nx.top) / Math.max(1, vh * .95 - fin)).toFixed(3));
  });
}
function trayectoria() {
  if (!lt.el || !lt.fill) return;
  const r = lt.el.getBoundingClientRect();
  const h = r.height, q = clamp((vh * .65 - r.top) / h);
  lt.fill.style.strokeDasharray = h.toFixed(0);
  lt.fill.style.strokeDashoffset = (h * (1 - q)).toFixed(0);
  lt.nodos.forEach(n => {
    const pt = $('.pt', n);
    n.classList.toggle('on', pt.getBoundingClientRect().top < vh * .68);
  });
}
function pieScroll() {
  if (!wm) return;
  const r = wm.getBoundingClientRect();
  wm.style.setProperty('--f', clamp((vh * .95 - r.top) / (vh * .5)).toFixed(3));
}

let ticking = false;
function pedir() { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } }
function onScroll() {
  const y = scrollY;
  const max = root.scrollHeight - vh;
  if (barra) barra.style.transform = `scaleX(${max > 0 ? clamp(y / max).toFixed(4) : 0})`;
  if (waF) waF.classList.toggle('on', y > vh * .6);
  if (hero) {
    const hr = hero.getBoundingClientRect();
    heroTop = hr.top; heroLeft = hr.left;
    if (heroVis) heroVis.style.setProperty('--py', (hr.bottom > 0 ? Math.max(0, -hr.top) * .2 : 0).toFixed(1));
  }
  // manifiesto
  if (man.words.length) {
    const r = man.el.getBoundingClientRect();
    S.man.t = clamp((vh * .85 - r.top) / (r.height + vh * .4));
  }
  if (dib.wrap) { const r = dib.wrap.getBoundingClientRect(); S.dib.t = clamp((vh * .9 - r.top) / (vh * .55)); }
  // pinned (solo con motion)
  if (!RM) {
    if (tun.pista) S.tun.t = progresoPinned(tun.pista);
    if (pap.pista && papActivo()) S.pap.t = progresoPinned(pap.pista);
    if (ros.pista) S.ros.t = clamp(progresoPinned(ros.pista) / .6);
  }
  actosScroll();
  trayectoria();
  pieScroll();
  espia();
  revealGeo();
}

/* ---------- Bucle principal ---------- */
function loop(t) {
  requestAnimationFrame(loop);
  if (document.hidden) return;
  if (heroOn) heroFrame(t);
  if (tunOn && polvoT) polvoT.draw(t);
  suavizar();
  frameLuz();
}
let tunOn = false;
function observarVisibilidad() {
  if (!('IntersectionObserver' in window)) return;
  if (hero) new IntersectionObserver(e => { heroOn = e[0].isIntersecting; }).observe(hero);
  if (tun.pista) new IntersectionObserver(e => { tunOn = e[0].isIntersecting; }).observe(tun.pista);
}

/* ---------- Medidas ---------- */
function medir() {
  vw = innerWidth; vh = innerHeight;
  medirHero();
  layoutTun();
  if (pap.track) pap.dist = Math.max(0, pap.track.offsetWidth - vw);
  if (polvoH) polvoH.size();
  if (polvoT && root.classList.contains('mo')) polvoT.size();
  if (lt.fill) { lt.fill.style.strokeDasharray = ''; }
}

/* ---------- Carpetas: inclinación y estado «abierta» en táctil ---------- */
function carpetas() {
  const cs = $$('.carpeta:not(.fantasma)');
  cs.forEach(c => {
    const t = $('.carp-tilt', c);
    c.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      t.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    });
    c.addEventListener('pointerleave', () => { t.style.transform = ''; });
  });
  if (SIN_HOVER && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('vista', e.isIntersecting && e.intersectionRatio > .7)), { threshold: [.7, .95] });
    cs.forEach(c => io.observe(c));
  }
}

/* ---------- Lupa de papeles (solo puntero fino) ---------- */
function lupas() {
  if (!FINO) return;
  const Z = 2.4, S2 = 170, mitad = (S2 - 6) / 2;
  $$('.hoja-b').forEach(b => {
    const img = $('img', b), lp = $('.lupa', b);
    if (!img || !lp) return;
    b.addEventListener('pointerenter', () => {
      if (!lp.style.backgroundImage) lp.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
      b.classList.add('lupa-on');
    });
    b.addEventListener('pointerleave', () => b.classList.remove('lupa-on'));
    b.addEventListener('pointermove', e => {
      const w = img.offsetWidth, h = img.offsetHeight;
      let x, y;
      if (e.target === img) { x = e.offsetX; y = e.offsetY; }
      else { const r = img.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; }
      lp.style.left = (x - S2 / 2) + 'px'; lp.style.top = (y - S2 / 2) + 'px';
      lp.style.backgroundSize = `${w * Z}px ${h * Z}px`;
      lp.style.backgroundPosition = `${mitad - x * Z}px ${mitad - y * Z}px`;
    });
  });
}

/* ---------- Visor (FLIP, teclado, swipe, miniaturas) ---------- */
const PREF = 'whatsapp-image-2026-11-07-at-';
const FOTO = k => { const [d, id] = k.split('/'); return `assets/img/${d}/${PREF}${id}.jpg`; };
const ZUN = ['12-41-03-pm', '12-41-03-pm-2', '12-41-03-pm-3', '12-41-03-pm-4', '12-41-03-pm-5', '12-41-03-pm-6', '12-41-03-pm-7', '12-41-03-pm-8', '12-41-03-pm-10', '12-41-03-pm-14',
  '12-41-04-pm-9', '12-41-04-pm-10', '12-41-04-pm-11', '12-41-04-pm-12', '12-41-04-pm-15', '12-41-04-pm-16', '12-41-04-pm-21', '12-41-04-pm-22', '12-41-04-pm-23'].map(i => 'zuniga/' + i);
const LOP = ['12-52-10-pm', '12-52-14-pm', '12-52-15-pm-1', '12-52-19-pm', '12-52-19-pm-2', '12-52-20-pm', '12-52-20-pm-2', '12-52-20-pm-4', '12-52-21-pm', '12-52-21-pm-1', '12-52-21-pm-2',
  '12-52-22-pm', '12-52-22-pm-1', '12-52-22-pm-2', '12-52-22-pm-3', '12-52-23-pm', '12-52-23-pm-1', '12-52-23-pm-2', '12-52-23-pm-3', '12-52-23-pm-4', '12-52-25-pm', '12-52-25-pm-1'].map(i => 'lopez/' + i)
  .concat(['12-46-01-pm', '12-46-01-pm-1', '12-46-02-pm', '12-46-02-pm-1', '12-46-02-pm-2', '12-46-02-pm-3', '12-46-02-pm-4', '12-46-02-pm-5', '12-46-02-pm-6', '12-46-02-pm-7'].map(i => 'lopez-docs/' + i));
const AL_REVES = new Set(['lopez/12-52-19-pm-2', 'lopez/12-52-20-pm']);   // escaneos que vienen girados 180°
const SETS = {
  zuniga: { nombre: 'Fondo Luis Zúñiga', items: ZUN, alt: 'Fotografía de archivo del fondo Luis Zúñiga' },
  lopez: { nombre: 'Fondo López Carreón', items: LOP, alt: 'Pieza de archivo del fondo López Carreón' }
};
const V = { el: $('#visor'), img: $('#vImg'), cont: $('#vCont'), fondo: $('#vFondo'), tira: $('#vTira'), cerrar: $('#vCerrar'), prev: $('#vPrev'), next: $('#vNext'), esc: $('#vEsc') };
const vs = { open: false, set: null, key: '', i: 0, flip: null, prevFocus: null };

function terminarFlip() {
  V.img.classList.remove('cambia');
  const f = vs.flip; vs.flip = null;
  if (!f || RM) return;
  const l = V.img.getBoundingClientRect();
  if (!l.width || !l.height || !f.width) return;
  V.img.style.transition = 'none';
  V.img.style.transformOrigin = '0 0';
  V.img.style.transform = `translate(${f.left - l.left}px,${f.top - l.top}px) scale(${f.width / l.width},${f.height / l.height})`;
  void V.img.offsetWidth;
  V.img.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1),opacity .25s';
  V.img.style.transform = '';
  setTimeout(() => { V.img.style.transition = ''; V.img.style.transformOrigin = ''; }, 760);
}
function mostrar(i, primera) {
  const items = vs.set.items, n = items.length;
  i = (i + n) % n; vs.i = i;
  const src = FOTO(items[i]);
  V.img.style.rotate = AL_REVES.has(items[i]) ? '180deg' : '';
  V.cont.textContent = `Pieza ${pad2(i + 1)} / ${pad2(n)}`;
  V.fondo.textContent = vs.set.nombre;
  V.img.alt = `${vs.set.alt}, pieza ${pad2(i + 1)}`;
  $$('button', V.tira).forEach((b, j) => {
    b.classList.toggle('act', j === i);
    if (j === i) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: primera || RM ? 'auto' : 'smooth' });
  });
  if (V.img.getAttribute('src') === src) { terminarFlip(); }
  else {
    if (!primera) V.img.classList.add('cambia');
    V.img.onload = terminarFlip;
    V.img.onerror = () => { V.img.classList.remove('cambia'); };
    V.img.src = src;
  }
  [i + 1, i - 1].forEach(j => { const im = new Image(); im.src = FOTO(items[(j + n) % n]); });
}
function abrirVisor(key, i, origen) {
  const set = SETS[key];
  if (!set || !V.el) return;
  vs.set = set; vs.key = key; vs.open = true; vs.prevFocus = document.activeElement;
  if (V.tira.dataset.k !== key) {
    V.tira.innerHTML = '';
    set.items.forEach((k, j) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', `Ir a la pieza ${j + 1}`);
      const im = new Image(); im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; im.src = FOTO(k);
      if (AL_REVES.has(k)) im.style.rotate = '180deg';
      b.appendChild(im);
      b.addEventListener('click', () => mostrar(j));
      V.tira.appendChild(b);
    });
    V.tira.dataset.k = key;
  }
  V.el.hidden = false;
  root.classList.add('bloq');
  vs.flip = origen ? origen.getBoundingClientRect() : null;
  requestAnimationFrame(() => V.el.classList.add('abierto'));
  mostrar(i, true);
  V.cerrar.focus();
}
function cerrarVisor() {
  if (!vs.open) return;
  vs.open = false;
  V.el.classList.remove('abierto');
  if (!root.classList.contains('menu-on')) root.classList.remove('bloq');
  setTimeout(() => { if (!vs.open) { V.el.hidden = true; V.img.removeAttribute('src'); } }, 360);
  if (vs.prevFocus && vs.prevFocus.focus) vs.prevFocus.focus({ preventScroll: true });
}
function initVisor() {
  if (!V.el) return;
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-visor]');
    if (!t || t.closest('#visor')) return;
    e.preventDefault();
    const set = SETS[t.dataset.visor];
    if (!set) return;
    const i = t.dataset.f ? Math.max(0, set.items.indexOf(t.dataset.f)) : 0;
    const origen = t.matches('img') ? t : (t.querySelector('img.carp-portada') || t.querySelector('img') || (t.closest('.carpeta') && t.closest('.carpeta').querySelector('.carp-portada')));
    abrirVisor(t.dataset.visor, i, origen);
  });
  V.cerrar.addEventListener('click', cerrarVisor);
  V.prev.addEventListener('click', () => mostrar(vs.i - 1));
  V.next.addEventListener('click', () => mostrar(vs.i + 1));
  V.el.addEventListener('click', e => { if (e.target.classList.contains('v-fondo') || e.target === V.esc) cerrarVisor(); });
  addEventListener('keydown', e => {
    if (!vs.open) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarVisor(); }
    else if (e.key === 'ArrowLeft') mostrar(vs.i - 1);
    else if (e.key === 'ArrowRight') mostrar(vs.i + 1);
    else if (e.key === 'Tab') {
      const f = $$('button', V.el).filter(b => b.offsetParent !== null || b === document.activeElement);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      else if (!V.el.contains(document.activeElement)) { e.preventDefault(); a.focus(); }
    }
  });
  let sx = 0, sy = 0;
  V.esc.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  V.esc.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) mostrar(vs.i + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

/* ---------- Entrevistas: onda y enlaces de YouTube ---------- */
function entrevistas() {
  $$('[data-onda]').forEach(o => {
    const n = vw < 700 ? 30 : 56;
    for (let i = 0; i < n; i++) {
      const b = document.createElement('i');
      b.style.animationDuration = (.5 + Math.random() * 1.1).toFixed(2) + 's';
      b.style.animationDelay = (-Math.random() * 1.6).toFixed(2) + 's';
      o.appendChild(b);
    }
  });
  let primero = '';
  $$('[data-yt-link]').forEach(a => {
    const u = YOUTUBE_URLS[a.dataset.ytLink];
    if (!u) return;
    a.href = u; a.hidden = false;
    const chip = $('.chip', a.parentElement); if (chip) chip.hidden = true;
    primero = primero || u;
  });
  const play = $('[data-yt-play]');
  if (play) {
    if (primero) play.setAttribute('aria-label', 'Ver la primera entrevista en YouTube');
    play.addEventListener('click', () => { if (primero) window.open(primero, '_blank', 'noopener'); });
  }
}

/* ---------- Formulario-boleto → WhatsApp ---------- */
function formulario() {
  const f = $('#formParticipa');
  if (!f) return;
  const nombre = $('#fNombre'), opcion = $('#fOpcion'), msg = $('#fMensaje'), aviso = $('#fAviso');
  nombre.addEventListener('input', () => { nombre.classList.remove('err'); aviso.textContent = ''; });
  f.addEventListener('submit', e => {
    e.preventDefault();
    const n = nombre.value.trim();
    if (!n) { nombre.classList.add('err'); aviso.textContent = 'Escribe tu nombre para armar el mensaje.'; nombre.focus(); return; }
    const m = msg.value.trim();
    const texto = `¡Hola! Soy ${n}. Vi Memorabilia Teatral Matamorense y quiero: ${opcion.value}.${m ? ' ' + m : ''}`;
    f.classList.remove('enviado'); void f.offsetWidth; f.classList.add('enviado');
    const url = waURL(texto);
    if (url) {
      const w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (_) { /* ignorar */ } } else { location.href = url; }
    }
  });
}

/* ---------- Varios ---------- */
function varios() {
  const arriba = $('#arriba');
  if (arriba) arriba.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));
}

/* ---------- Arranque ---------- */
splitHero();
initWA();
cargador();
initManifiesto();
initLuz();
reveals();
temaHeader();
menu();
carpetas();
lupas();
initVisor();
entrevistas();
formulario();
varios();
magneticos();

addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  mouse.tx = e.clientX / vw * 2 - 1; mouse.ty = e.clientY / vh * 2 - 1;
  mouse.cx = e.clientX; mouse.cy = e.clientY;
}, { passive: true });
addEventListener('scroll', pedir, { passive: true });
addEventListener('resize', () => { clearTimeout(medir._t); medir._t = setTimeout(() => { medir(); pedir(); revealGeo(); }, 120); });

if (!RM) {
  polvoH = crearPolvo($('#polvoH'), { max: 90, movil: 40, haz: true, base: .1 });
  polvoT = crearPolvo($('#polvoT'), { max: 70, movil: 32, haz: false, base: .42, color: '255,226,176' });
}
observarVisibilidad();
medir();
onScroll();
snap();
if (!RM) requestAnimationFrame(loop);

addEventListener('load', () => {
  medir(); onScroll(); snap();
  $$('.papeles-track img').forEach(im => { if (!im.complete) im.addEventListener('load', () => { medir(); pedir(); }, { once: true }); });
  setTimeout(() => { medir(); onScroll(); revealGeo(); }, 2000);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { medir(); pedir(); });
})();
