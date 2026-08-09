// ─── CUSTOM CURSOR ───
// Note: this queries .skill-card, .stat-card, .project-card, .pub-item, .award-item —
// it must load AFTER render.js has built those cards, or the hover effect won't attach.
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');
const trailCanvas  = document.getElementById('cursor-trail');
const tc = trailCanvas.getContext('2d');

function resizeTrail() {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

let mx = -200, my = -200;
let ox = -200, oy = -200;
const trailPts = [];

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorInner.style.left = mx + 'px';
  cursorInner.style.top  = my + 'px';
  trailPts.push({ x: mx, y: my });
  if (trailPts.length > 30) trailPts.shift();
});

document.querySelectorAll('a, button, .skill-card, .stat-card, .project-card, .pub-item, .award-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorOuter.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hovering'));
});
document.addEventListener('mousedown', () => cursorOuter.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursorOuter.classList.remove('clicking'));

function animateCursor() {
  ox += (mx - ox) * 0.1;
  oy += (my - oy) * 0.1;
  cursorOuter.style.left = ox + 'px';
  cursorOuter.style.top  = oy + 'px';

  tc.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  for (let i = 1; i < trailPts.length; i++) {
    const frac = i / trailPts.length;
    const p = trailPts[i];
    tc.beginPath();
    tc.arc(p.x, p.y, 2.2 * frac, 0, Math.PI * 2);
    tc.fillStyle = `rgba(0,212,255,${0.45 * frac * frac})`;
    tc.shadowColor = 'rgba(0,212,255,0.4)';
    tc.shadowBlur = 5;
    tc.fill();
    tc.shadowBlur = 0;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();
