// ─── SATELLITE 3D CANVAS ORBITS ───
// Draws the three tilted elliptical orbits + trailing satellites in the hero visual.
const satCanvas = document.getElementById('sat-canvas');
if (satCanvas) {
  const sc = satCanvas.getContext('2d');
  const CX = 210, CY = 210;

  const orbits = [
    { rx: 178, ry: 58,  tiltZ: 0,             speed:  0.38, color: '0,212,255',  sats: [0, Math.PI] },
    { rx: 148, ry: 48,  tiltZ: Math.PI/3,      speed: -0.55, color: '123,97,255', sats: [0, Math.PI] },
    { rx: 112, ry: 36,  tiltZ: 2*Math.PI/3,    speed:  0.85, color: '0,255,224',  sats: [0, Math.PI] },
  ];

  function ellipsePoint(orbit, angle) {
    const lx = Math.cos(angle) * orbit.rx;
    const ly = Math.sin(angle) * orbit.ry;
    const cosZ = Math.cos(orbit.tiltZ);
    const sinZ = Math.sin(orbit.tiltZ);
    return {
      x: CX + lx * cosZ - ly * sinZ,
      y: CY + lx * sinZ + ly * cosZ,
      depth: -Math.sin(angle) * Math.cos(orbit.tiltZ) + Math.cos(angle) * Math.sin(orbit.tiltZ)
    };
  }

  // Trail history: for each orbit, for each sat, store last N points
  const TRAIL_LEN = 42;
  let trails = orbits.map(o => o.sats.map(() => []));
  let satAngles = orbits.map(o => o.sats.map(offset => offset));
  let lastSatTime = null;

  function drawSats(ts) {
    if (!lastSatTime) lastSatTime = ts;
    const dt = Math.min((ts - lastSatTime) / 1000, 0.05);
    lastSatTime = ts;

    sc.clearRect(0, 0, 420, 420);

    orbits.forEach((orbit, oi) => {
      // Advance angles
      orbit.sats.forEach((_, si) => {
        satAngles[oi][si] += orbit.speed * dt;
      });

      orbit.sats.forEach((_, si) => {
        const angle = satAngles[oi][si];
        const pt = ellipsePoint(orbit, angle);

        // Store trail point
        trails[oi][si].push({ x: pt.x, y: pt.y, depth: pt.depth });
        if (trails[oi][si].length > TRAIL_LEN) trails[oi][si].shift();

        // ── Draw orbit trail ──
        const trail = trails[oi][si];
        if (trail.length > 2) {
          for (let i = 1; i < trail.length; i++) {
            const frac = i / trail.length;           // 0→1 (oldest→newest)
            const alpha = frac * frac * 0.55;        // fade older points out
            const width = frac * 1.4;
            const p0 = trail[i - 1];
            const p1 = trail[i];
            sc.beginPath();
            sc.moveTo(p0.x, p0.y);
            sc.lineTo(p1.x, p1.y);
            sc.strokeStyle = `rgba(${orbit.color},${alpha.toFixed(3)})`;
            sc.lineWidth = width;
            sc.lineCap = 'round';
            sc.stroke();
          }
        }

        // ── Draw satellite (no glow) ──
        const depthNorm = (pt.depth + 1) / 2;
        const size  = 10 + depthNorm * 7;
        const alpha = 0.5 + depthNorm * 0.5;

        sc.save();
        sc.globalAlpha = alpha;
        sc.font = `${size}px serif`;
        sc.textAlign = 'center';
        sc.textBaseline = 'middle';
        sc.fillText('🛰️', pt.x, pt.y);
        sc.restore();
      });
    });

    requestAnimationFrame(drawSats);
  }
  requestAnimationFrame(drawSats);
}
