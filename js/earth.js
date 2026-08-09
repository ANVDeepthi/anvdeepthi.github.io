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
  // -180..180 / -90..90). Hand-simplified, not survey data — the point is
  // getting continents in their correct RELATIVE positions and rough
  // silhouettes (Americas west, Africa/Europe center, Asia east, Australia
  // southeast, correctly separated by ocean), not cartographic accuracy.
  const LAND = [
    { color: '#4d8c5a', points: [[-165,65],[-125,70],[-70,55],[-80,25],[-97,15],[-115,25],[-165,65]] }, // North America
    { color: '#5a9463', points: [[-80,10],[-35,-5],[-40,-20],[-55,-35],[-70,-55],[-75,-20],[-80,10]] },  // South America
    { color: '#9a8a4d', points: [[-17,35],[35,32],[50,12],[42,-1],[35,-25],[18,-35],[12,-15],[-10,5],[-17,35]] }, // Africa
    { color: '#5a9463', points: [[-10,60],[30,68],[40,45],[20,36],[-5,40],[-10,60]] },                    // Europe
    { color: '#6f9a55', points: [[40,70],[100,75],[140,65],[135,20],[105,5],[75,10],[60,30],[45,45],[40,70]] }, // Asia
    { color: '#8a9a4d', points: [[113,-12],[145,-11],[153,-28],[140,-38],[118,-35],[113,-12]] }           // Australia
  ];

  function project(lon, lat) {
    return [
      ((lon + 180) / 360) * TEX_W,
      ((90 - lat) / 180) * TEX_H
    ];
  }

  // Pre-render the map once onto an offscreen canvas — the land shapes never
  // change, so each animation frame only needs to reposition this, not redraw it.
  const texture = document.createElement('canvas');
  texture.width = TEX_W;
  texture.height = TEX_H;
  const tctx = texture.getContext('2d');
  LAND.forEach(mass => {
    tctx.beginPath();
    mass.points.forEach(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      i === 0 ? tctx.moveTo(x, y) : tctx.lineTo(x, y);
    });
    tctx.closePath();
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
