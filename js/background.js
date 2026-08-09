// ─── BACKGROUND CANVAS ───
// Hero backdrop only: every section below the hero paints a solid background
// over this canvas, so there's no point animating past it — an
// IntersectionObserver pauses the whole loop while #hero is scrolled out of
// view (and visibilitychange pauses it while the tab is backgrounded).
//
// Layers, back to front: twinkling starfield → drifting multi-color aurora
// wash → ionospheric wave lines → ambient plasma particles → streaking solar
// wind. A wrapping IIFE keeps all of this out of the global scope so it can't
// collide with variables declared in the other page scripts.
(function () {
  const canvas = document.getElementById('ionosphere-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');

  const STAR_COUNT = 220;
  const LINE_COUNT = 7;
  const PARTICLE_COUNT = 46;
  const MAX_STREAKS = 90;
  const STREAK_INJECT_MS = 90;
  const STREAK_INJECT_CHANCE = 0.4;

  let W = 0, H = 0;
  let stars = [], lines = [], particles = [], streaks = [];
  let pointerX = 0, pointerY = 0;         // smoothed, roughly -1..1
  let targetPointerX = 0, targetPointerY = 0;
  let rafId = null;
  let lastTs = null;
  let heroVisible = true;
  let t = 0; // wave-line clock, advanced in real seconds (see draw())

  function rand(min, max) { return min + Math.random() * (max - min); }

  // ── SETUP ──
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initLines();
    initParticles();
    streaks = []; // matches prior behavior: a resize also wipes in-flight solar streaks
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: rand(0.4, 1.3),
        baseAlpha: rand(0.15, 0.55),
        twinkleSpeed: rand(0.5, 1.8),
        phase: Math.random() * Math.PI * 2,
        depth: rand(0.3, 1)  // parallax weight — closer "stars" drift a little more
      });
    }
  }

  function initLines() {
    lines = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      lines.push({
        y: H * (0.08 + i * 0.13),
        amplitude: 14 + Math.random() * 30,
        freq: 0.0018 + Math.random() * 0.0038,
        speed: 0.04 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.05 + Math.random() * 0.09,
        color: i % 3 === 0 ? '0,212,255' : i % 3 === 1 ? '123,97,255' : '0,255,224',
        width: 0.5 + Math.random() * 0.9
      });
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.5 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.1 - Math.random() * 0.28,
        alpha: 0.12 + Math.random() * 0.3,
        color: Math.random() > 0.5 ? '0,212,255' : '123,97,255'
      });
    }
  }

  function spawnStreak() {
    return {
      x: -20,
      y: Math.random() * H * 0.65,
      vx: 1.8 + Math.random() * 2.6,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: 0.22 + Math.random() * 0.3,
      color: Math.random() > 0.55 ? '255,180,0' : '0,212,255'
    };
  }

  // ── DRAW LAYERS ──
  function drawAurora(ts) {
    const driftX = Math.sin(ts / 8000) * 60 + pointerX * 40;
    const driftY = Math.cos(ts / 11000) * 30 + pointerY * 20;

    const blobs = [
      { cx: W * 0.32 + driftX,        cy: H * 0.04 + driftY,        r: H * 0.62, color: '0,212,255',  a: 0.05 },
      { cx: W * 0.72 - driftX * 0.7,  cy: H * 0.02 - driftY * 0.5,  r: H * 0.56, color: '123,97,255', a: 0.04 },
      { cx: W * 0.5,                  cy: H * 0.15 + driftY * 0.3,  r: H * 0.4,  color: '255,97,199', a: 0.02 }
    ];

    blobs.forEach(b => {
      const grad = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, b.r);
      grad.addColorStop(0, `rgba(${b.color},${b.a})`);
      grad.addColorStop(0.5, `rgba(${b.color},${b.a * 0.4})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });
  }

  function drawStars(ts) {
    stars.forEach(s => {
      const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(ts / 1000 * s.twinkleSpeed + s.phase));
      const x = s.x + pointerX * 14 * s.depth;
      const y = s.y + pointerY * 10 * s.depth;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(205,230,245,${alpha.toFixed(3)})`;
      ctx.fill();
    });
  }

  function drawLines(dtFrames) {
    t += 0.55 * dtFrames;
    lines.forEach(l => {
      const yOffset = pointerY * 4;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = l.y + yOffset + Math.sin(x * l.freq + t * l.speed + l.phase) * l.amplitude;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${l.color},${l.alpha})`;
      ctx.lineWidth = l.width;
      ctx.shadowColor = `rgba(${l.color},0.35)`;
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawParticles(dtFrames) {
    particles.forEach(p => {
      p.x += p.vx * dtFrames;
      p.y += p.vy * dtFrames;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.shadowColor = `rgba(${p.color},0.55)`;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function drawStreaks(dtFrames) {
    streaks.forEach(s => {
      const prevX = s.x, prevY = s.y;
      s.x += s.vx * dtFrames;
      s.y += s.vy * dtFrames;
      if (s.x > W + 20) Object.assign(s, spawnStreak());

      const grad = ctx.createLinearGradient(prevX, prevY, s.x, s.y);
      grad.addColorStop(0, `rgba(${s.color},0)`);
      grad.addColorStop(1, `rgba(${s.color},${s.alpha})`);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.shadowColor = `rgba(${s.color},0.5)`;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  // ── SOLAR WIND STREAK INJECTOR ──
  setInterval(() => {
    if (!heroVisible) return;
    if (Math.random() < STREAK_INJECT_CHANCE && streaks.length < MAX_STREAKS) {
      streaks.push(spawnStreak());
    }
  }, STREAK_INJECT_MS);

  // ── MAIN LOOP ──
  function draw(ts) {
    if (lastTs == null) lastTs = ts;
    const dtSeconds = Math.min((ts - lastTs) / 1000, 0.1); // clamp to avoid a huge jump after a paused tab
    const dtFrames = dtSeconds * 60; // scales the original per-frame-at-60fps tuning to any refresh rate
    lastTs = ts;

    pointerX += (targetPointerX - pointerX) * 0.06;
    pointerY += (targetPointerY - pointerY) * 0.06;

    ctx.clearRect(0, 0, W, H);
    drawAurora(ts);
    drawStars(ts);
    drawLines(dtFrames);
    drawParticles(dtFrames);
    drawStreaks(dtFrames);

    rafId = requestAnimationFrame(draw);
  }

  function startLoop() {
    if (rafId == null) {
      lastTs = null;
      rafId = requestAnimationFrame(draw);
    }
  }
  function stopLoop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ── VISIBILITY GATING ──
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        heroVisible = entry.isIntersecting;
        if (heroVisible && !document.hidden) startLoop(); else stopLoop();
      });
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else if (heroVisible) startLoop();
  });

  // ── POINTER PARALLAX ──
  window.addEventListener('mousemove', e => {
    targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', resize);
  resize();
  startLoop();
})();