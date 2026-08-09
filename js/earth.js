// ─── EARTH — simplified rotating world map ───
// Draws a rough, simplified world map onto #earth-canvas, then pans it
// sideways each frame to fake axial rotation without any 3D — the same
// "scrolling texture under fixed lighting" trick used all over this file,
// just with real (if hand-simplified) continents instead of random shapes.
//
// This canvas only paints land; .earth-core's own CSS radial-gradient shows
// through as ocean everywhere else, and provides the "lit sphere" shading.
(function () {
  const canvas = document.getElementById('earth-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SIZE = canvas.width;   // canvas is authored square, matching .earth-core's diameter
  const TEX_W = SIZE * 3;      // texture is wider than the visible circle for smooth panning
  const TEX_H = SIZE;
  const ROTATION_MS = 24000;   // one full turn — a small nod to Earth's real ~24h day

  // Rough continent outlines as [longitude, latitude] point lists (degrees,
  // -180..180 / -90..90), each walking the coastline perimeter in order —
  // NOT closed (no repeated first/last point; the smoothing below treats
  // each list as a closed loop automatically). Hand-simplified, not survey
  // data — the point is getting continents in their correct RELATIVE
  // positions and rough silhouettes (Americas west, Africa/Europe center,
  // Asia east, Australia southeast, correctly separated by ocean), not
  // cartographic accuracy.
  const LAND = [
    { color: '#4d8c5a', points: [[-165,65],[-130,71],[-95,70],[-75,50],[-80,25],[-97,16],[-110,25],[-125,45]] }, // North America
    { color: '#5a9463', points: [[-80,10],[-50,0],[-35,-6],[-40,-20],[-58,-35],[-72,-50],[-78,-15]] },            // South America
    { color: '#9a8a4d', points: [[-17,35],[10,37],[35,32],[50,12],[42,-1],[35,-25],[18,-35],[12,-15],[-10,5]] },  // Africa
    { color: '#5a9463', points: [[-10,60],[30,68],[40,45],[20,36],[-5,40]] },                                    // Europe
    { color: '#6f9a55', points: [[40,70],[100,75],[140,65],[135,20],[105,5],[90,10],[75,8],[60,30],[45,45]] },   // Asia
    { color: '#8a9a4d', points: [[113,-12],[145,-11],[153,-28],[140,-38],[118,-35]] }                            // Australia
  ];

  function project(lon, lat) {
    return [
      ((lon + 180) / 360) * TEX_W,
      ((90 - lat) / 180) * TEX_H
    ];
  }

  // Draws a smooth closed curve THROUGH every point in `pts` (Catmull-Rom,
  // converted to bezier segments) instead of connecting them with straight
  // lines — turns a handful of hand-placed vertices into an organic,
  // coastline-like outline rather than a visibly angular polygon.
  function smoothClosedPath(c, pts) {
    const n = pts.length;
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
    }
    c.closePath();
  }

  // Pre-render the map once onto an offscreen canvas — the land shapes never
  // change, so each animation frame only needs to reposition this, not redraw it.
  const texture = document.createElement('canvas');
  texture.width = TEX_W;
  texture.height = TEX_H;
  const tctx = texture.getContext('2d');
  LAND.forEach(mass => {
    const pts = mass.points.map(([lon, lat]) => project(lon, lat));
    smoothClosedPath(tctx, pts);
    tctx.globalAlpha = 0.82; // lets .earth-core's lighting gradient influence the land tone slightly
    tctx.fillStyle = mass.color;
    tctx.fill();
  });

  let startTs = null;
  function draw(ts) {
    if (startTs == null) startTs = ts;
    const progress = ((ts - startTs) % ROTATION_MS) / ROTATION_MS;
    const offset = progress * TEX_W;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    // Two copies of the texture, offset by one texture-width apart, so as the
    // first pans off-screen the second fills the gap behind it — seamless wrap.
    ctx.drawImage(texture, -offset, 0);
    ctx.drawImage(texture, TEX_W - offset, 0);
    ctx.restore();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
