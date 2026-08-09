// ─── BACKGROUND CANVAS ───
// Drifting ionospheric wave lines + particles behind the whole page.
const canvas = document.getElementById('ionosphere-canvas');
const ctx = canvas.getContext('2d');
let W, H, lines = [], particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initLines();
}

function initLines() {
  lines = [];
  for (let i = 0; i < 7; i++) {
    lines.push({
      y: H * (0.08 + i * 0.13),
      amplitude: 16 + Math.random() * 32,
      freq: 0.002 + Math.random() * 0.004,
      speed: 0.0006 + Math.random() * 0.001,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.05 + Math.random() * 0.1,
      color: i % 3 === 0 ? '0,212,255' : i % 3 === 1 ? '123,97,255' : '0,255,224',
      width: 0.5 + Math.random() * 0.9
    });
  }
  particles = [];
  // Regular drifting particles
  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.1 - Math.random() * 0.28,
      alpha: 0.12 + Math.random() * 0.3,
      color: Math.random() > 0.5 ? '0,212,255' : '123,97,255',
      solar: false
    });
  }
}

let t = 0;
function draw() {
  ctx.clearRect(0, 0, W, H);
  t += 0.55;

  // Radial aurora glow
  const grad = ctx.createRadialGradient(W/2, H*0.1, 0, W/2, H*0.1, H * 0.65);
  grad.addColorStop(0, 'rgba(0,212,255,0.045)');
  grad.addColorStop(0.4, 'rgba(123,97,255,0.025)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Ionospheric wave lines
  lines.forEach(l => {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = l.y + Math.sin(x * l.freq + t * l.speed + l.phase) * l.amplitude;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${l.color},${l.alpha})`;
    ctx.lineWidth = l.width;
    ctx.shadowColor = `rgba(${l.color},0.35)`;
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  // Particles (drifting + solar wind)
  particles.forEach(p => {
    if (p.solar) {
      p.x += p.vx; p.y += p.vy;
      if (p.x > W + 10) { p.x = -5; p.y = Math.random() * H * 0.65; }
    } else {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.shadowColor = `rgba(${p.color},0.55)`;
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  requestAnimationFrame(draw);
}

// ─── SOLAR WIND PARTICLE INJECTOR ───
setInterval(() => {
  if (Math.random() < 0.4 && particles.length < 140) {
    particles.push({
      x: -5,
      y: Math.random() * H * 0.65,
      r: 0.5 + Math.random() * 0.9,
      vx: 1.8 + Math.random() * 2.6,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: 0.18 + Math.random() * 0.28,
      color: Math.random() > 0.55 ? '255,180,0' : '0,212,255',
      solar: true
    });
  }
}, 90);

window.addEventListener('resize', resize);
resize();
draw();
