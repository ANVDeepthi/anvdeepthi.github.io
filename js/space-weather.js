// ─── LIVE SPACE WEATHER TICKER ───
// Pulls real near-real-time indices from NOAA SWPC (services.swpc.noaa.gov).
//
// Why NOAA and not NASA OMNIWeb directly: OMNIWeb is a legacy FTP/CGI system
// built for downloading data files, not for being called from a browser on
// another domain — it sends no CORS headers, so fetch() from this page would
// be blocked outright. NOAA SWPC publishes the same underlying real-time
// DSCOVR/GOES measurements that OMNIWeb itself archives, as CORS-enabled JSON
// meant for exactly this kind of public widget. It's the live operational
// source; OMNIWeb is the historical archive of the same feeds.
//
// Refreshes once an hour while the tab stays open. If a refresh fails
// (offline, endpoint down), the ticker just keeps showing the last values
// it had rather than blanking out.

const SW_REFRESH_MS = 60 * 60 * 1000; // 1 hour

const SW_ENDPOINTS = {
  kp:     'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
  wind:   'https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json',
  mag:    'https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json',
  xray:   'https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json',
  proton: 'https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json'
};

async function swFetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

// Scans from the newest entry backwards for the first one matching `test` —
// these feeds sometimes end with a few null/inactive trailing samples.
function latestValid(arr, test) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (test(arr[i])) return arr[i];
  }
  return null;
}

// GOES long-band (0.1-0.8nm) flux in W/m² → NOAA flare class, e.g. "C1.2".
function xrayFluxToClass(flux) {
  if (flux == null || flux <= 0) return null;
  const bands = [
    { letter: 'X', min: 1e-4 },
    { letter: 'M', min: 1e-5 },
    { letter: 'C', min: 1e-6 },
    { letter: 'B', min: 1e-7 },
    { letter: 'A', min: 1e-8 }
  ];
  const band = bands.find(b => flux >= b.min) || bands[bands.length - 1];
  return `${band.letter}${(flux / band.min).toFixed(1)}`;
}

function kpCategory(kp) {
  if (kp >= 7) return { label: 'STRONG STORM', dot: 'red' };
  if (kp >= 5) return { label: 'STORM',         dot: 'red' };
  if (kp >= 4) return { label: 'UNSETTLED',     dot: 'yellow' };
  return           { label: 'QUIET',          dot: 'green' };
}

function windDot(speedKmS) {
  if (speedKmS >= 700) return 'red';
  if (speedKmS >= 500) return 'yellow';
  if (speedKmS >= 350) return 'cyan';
  return 'green';
}

function xrayDot(letter) {
  if (letter === 'X' || letter === 'M') return 'red';
  if (letter === 'C') return 'yellow';
  return 'green';
}

function protonDot(pfu) {
  if (pfu >= 10) return 'red';
  if (pfu >= 1) return 'yellow';
  return 'green';
}

function bzDot(bzNt) {
  if (bzNt <= -6) return 'red';
  if (bzNt <= -3) return 'yellow';
  return 'green';
}

async function fetchSpaceWeather() {
  const [kpData, windData, magData, xrayData, protonData] = await Promise.all([
    swFetchJSON(SW_ENDPOINTS.kp),
    swFetchJSON(SW_ENDPOINTS.wind),
    swFetchJSON(SW_ENDPOINTS.mag),
    swFetchJSON(SW_ENDPOINTS.xray),
    swFetchJSON(SW_ENDPOINTS.proton)
  ]);

  const kpEntry     = kpData.length ? kpData[kpData.length - 1] : null;
  const windEntry   = latestValid(windData, d => d.active && d.proton_speed != null);
  const magEntry    = latestValid(magData, d => d.active && d.bz_gsm != null);
  const xrayEntry   = latestValid(xrayData, d => d.energy === '0.1-0.8nm' && d.flux != null);
  const protonEntry = latestValid(protonData, d => d.energy === '>=10 MeV' && d.flux != null);

  const items = [];

  if (kpEntry) {
    const cat = kpCategory(kpEntry.Kp);
    items.push({ text: `KP INDEX: ${kpEntry.Kp.toFixed(1)} — ${cat.label}`, dot: cat.dot });
    items.push({ text: `IONOSPHERE: ${cat.label === 'QUIET' ? 'STABLE' : cat.label}`, dot: cat.dot });
  }
  if (windEntry) {
    const speed = Math.round(windEntry.proton_speed);
    items.push({ text: `SOLAR WIND: ${speed} km/s`, dot: windDot(speed) });
  }
  if (xrayEntry) {
    const cls = xrayFluxToClass(xrayEntry.flux);
    if (cls) items.push({ text: `X-RAY FLUX: ${cls}`, dot: xrayDot(cls[0]) });
  }
  if (protonEntry) {
    items.push({ text: `PROTON FLUX: ${protonEntry.flux.toFixed(2)} pfu (≥10 MeV)`, dot: protonDot(protonEntry.flux) });
  }
  if (magEntry) {
    items.push({ text: `MAGNETIC Bz: ${magEntry.bz_gsm.toFixed(1)} nT`, dot: bzDot(magEntry.bz_gsm) });
  }

  return items;
}

function renderTicker(items) {
  const ticker = document.getElementById('sw-ticker');
  if (!ticker || !items.length) return;
  const itemsHTML = items.map(i => `<span class="sw-item"><span class="sw-dot ${i.dot}"></span> ${i.text}</span>`).join('');
  // Duplicated once so the CSS marquee (@keyframes ticker, translateX -50%) loops seamlessly.
  ticker.innerHTML = itemsHTML + itemsHTML;
}

async function updateSpaceWeather() {
  try {
    const items = await fetchSpaceWeather();
    renderTicker(items);
    console.info(`[space-weather] refreshed from NOAA SWPC at ${new Date().toISOString()}`);
  } catch (err) {
    // Keep whatever's already on screen rather than blanking the ticker on a transient failure.
    console.warn('[space-weather] refresh failed, keeping last known values:', err);
  }
}

updateSpaceWeather();
setInterval(updateSpaceWeather, SW_REFRESH_MS);