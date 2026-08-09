// ─── BLOG STARDUST CURSOR TRAIL ───
// A light sparkle trail that follows the pointer on blog pages. Unlike the
// homepage's js/cursor.js, the native cursor stays fully visible and usable
// here — a page meant for reading/selecting text shouldn't hide it, so this
// only ever adds a decorative trail on top, never replaces the cursor itself.
//
// Creates its own <canvas> at runtime, so the only thing a blog page needs is
// a <script src="…/js/blog-cursor.js"> tag — no markup to add or keep in sync.
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'stardust-canvas';
  canvas.style.cssText = 'position:fixed; inset:0; z-index:9999; pointer-events:none;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Pull the site's real accent colors from CSS rather than hardcoding hex
  // values a second time — same tokens defined once in css/style.css.
  const rootStyle = getComputedStyle(document.documentElement);
  const readColor = (name, fallback) => (rootStyle.getPropertyValue(name) || '').trim() || fallback;
  const COLORS = [
    readColor('--plasma', '#00d4ff'),
    readColor('--plasma2', '#00ffe0'),
    readColor('--aurora', '#7b61ff')
  ];

  const LIFESPAN_MS = 700;
  const MAX_PARTICLES = 60;
  const MIN_SPAWN_DISTANCE = 14; // px of pointer travel between sparkles, so a still cursor spawns nothing

  let W = 0, H = 0;
  let particles = [];
  let lastX = null, lastY = null;
  let rafId = null;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawn(x, y) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    particles.push({
      x, y,
      size: 2.5 + Math.random() * 3,
      rotation: Math.random() * Math.PI,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      born: performance.now()
    });
  }

  // Draws a small 4-point sparkle (a rotated "+"), fading and shrinking over its lifespan.
  // Returns false once it's fully faded, so the caller can drop it from the array.
  function drawSparkle(p, now) {
    const frac = (now - p.born) / LIFESPAN_MS;
    if (frac >= 1) return false;

    const alpha = 1 - frac;
    const size = p.size * (1 - frac * 0.4);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-size, 0); ctx.lineTo(size, 0);
    ctx.moveTo(0, -size); ctx.lineTo(0, size);
    ctx.stroke();
    ctx.restore();
    return true;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const now = performance.now();
    particles = particles.filter(p => drawSparkle(p, now));
    rafId = requestAnimationFrame(draw);
  }

  function startLoop() { if (rafId == null) rafId = requestAnimationFrame(draw); }
  function stopLoop() { if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; } }

  document.addEventListener('mousemove', e => {
    if (lastX == null) { lastX = e.clientX; lastY = e.clientY; return; }
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (Math.hypot(dx, dy) >= MIN_SPAWN_DISTANCE) {
      spawn(e.clientX, e.clientY);
      lastX = e.clientX; lastY = e.clientY;
    }
  });

  // Pause when the tab is backgrounded — same courtesy as js/background.js.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop(); else startLoop();
  });

  window.addEventListener('resize', resize);
  resize();
  startLoop();
})();
