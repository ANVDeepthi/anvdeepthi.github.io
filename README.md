# nvd-ayyagari.github.io

Personal portfolio site for Naga Vijaya Deepthi Ayyagari — live at [www.nvd-ayyagari.space](https://www.nvd-ayyagari.space) (custom domain set in [CNAME](CNAME), hosted on GitHub Pages).

Plain HTML/CSS/JS, no build step, no dependencies to install. You edit a file, open `index.html` in a browser to check it, then commit and push — GitHub Pages serves whatever's in the repo directly.

---

## Project structure

```
index.html              Page shell: head, nav, hero, section wrappers, footer, <script> tags
index.backup.html       Snapshot of the original single-file version, kept for reference — not live, not linked anywhere
css/
  style.css             All styling (colors, fonts, layout, animations' CSS)
js/
  render.js             Reads the data files below and builds each section's HTML — you shouldn't need to touch this for content edits
  space-weather.js       Fetches live space-weather indices from NOAA SWPC for the top ticker, refreshes hourly
  background.js          Hero canvas animation (starfield, aurora, ionospheric lines, particles)
  satellites.js           Orbiting satellite animation in the hero
  cursor.js               Custom cursor + trail effect
  data/
    about.js             The 4 stat cards in "About"
    skills.js              The 6 skill cards
    experience.js          The career timeline
    education.js           The 3 education cards
    projects.js             The project cards
    publications.js         Journal / conference / co-authored publication lists
    awards.js                The award cards
    proficiency.js           Skill bars + spoken languages
CNAME                    Custom domain for GitHub Pages
LICENSE
```

---

## Updating content (the day-to-day stuff)

**Almost everything you'll want to change lives in `js/data/`.** Each file holds one JavaScript array (or object) of plain data — add, remove, or edit an entry, save, and reload the page. No HTML to write.

A few things are *not* in a data file because they're one-off, not a repeated list — those live directly in `index.html`:

| Content | Where |
|---|---|
| Hero name, title/subtitle, bio, badges | `index.html`, inside `<section id="hero">` |
| "About Me" paragraphs | `index.html`, inside `<section id="about">`, class `about-text` |
| Contact links (email, Scholar, ResearchGate, LinkedIn, etc.) | `index.html`, inside `<section id="contact">`, class `contact-links` |
| Footer line | `index.html`, inside `<footer>` |
| Space weather ticker | Don't edit — it's live, see [below](#live-space-weather-ticker) |

### Data file reference

**`js/data/about.js`** — stat cards under "About Me"
```js
{ num: '9+', label: 'Years Research' }
```

**`js/data/skills.js`** — skill cards
```js
{ icon: '🛰️', title: 'Satellite Navigation', desc: 'NavIC, GPS, RTK & PPP evaluations…' }
```

**`js/data/experience.js`** — career timeline, **newest entry first**
```js
{
  period: 'Sep 2025 — Present',
  location: '📍 Meghalaya, India',
  role: 'DST Inspire Faculty Fellow',
  org: 'North Eastern Space Applications Centre (NESAC)',
  projectLine: 'Project: …',      // optional italic line above the bullets
  bullets: ['…', '…']              // OR use `desc: '…'` for a single plain paragraph instead of bullets
}
```

**`js/data/education.js`** — education cards
```js
{ degree: 'Ph.D. Scholar', inst: 'IIT Indore', meta: '2017 – 2023 · Indore, India', desc: '…', grade: 'Grade: A+' }
```

**`js/data/projects.js`** — project cards
```js
{ icon: '🌌', title: '…', funder: '⚡ …', desc: '…', tags: ['Space Weather', 'NavIC'] }
```

**`js/data/publications.js`** — three separate lists in one file: `journal`, `conference`, `coauthored`
```js
{ title: '…', authors: '…', journal: '… · DOI: …', badge: '🏆 Young Scientist Award' } // badge is optional
```

**`js/data/awards.js`** — award cards
```js
{ icon: '🔬', title: '…', desc: '…' }
```

**`js/data/proficiency.js`** — two arrays: `PROFICIENCY_DATA` (skill bars) and `LANGUAGES_DATA`
```js
{ label: 'Python', pct: 92 }
{ name: 'English', level: 'Fluent' }
```

### Gotcha: HTML entities in text

Since these files' text gets inserted as HTML, escape `&` as `&amp;` (e.g. `'DST &amp; ISRO'`), otherwise the browser may render it oddly. Everything else (apostrophes, most punctuation) is fine as-is.

### Gotcha: don't break the JSON-like structure

These are real JavaScript, not JSON — but the shape matters. If you edit one and the *whole page* stops rendering (or just that section goes blank), you likely have a syntax error: a missing comma between objects, an unmatched quote, or a trailing comma after the *last* item in an array (that one's actually fine in modern JS, but a missing comma between two items is not). Check the browser console (`F12` → Console tab) — it'll point at the exact file and line.

---

## "I did X — what do I edit?"

| Situation | Files to touch |
|---|---|
| Add a publication | `js/data/publications.js` |
| Add an award / membership | `js/data/awards.js` |
| Started a new job / role | `js/data/experience.js` (new entry at the **top**), plus — if it's now your *current* role — `index.html`'s hero title/badges and first "About Me" paragraph, and the footer line |
| Finished a project | `js/data/projects.js` |
| New degree / finished a program | `js/data/education.js` |
| Publication/mentee counts changed | `js/data/about.js` |
| Want different colors site-wide | `css/style.css`, the `:root { ... }` block near the top (see below) |
| Want different fonts | `css/style.css` `:root` (`--head`, `--body`, `--mono`), and the Google Fonts `<link>` in `index.html`'s `<head>` if you're switching to fonts not already loaded |
| Want to change the hero animation | `js/background.js` (starfield/aurora/particles) or `js/satellites.js` (orbiting satellites) — see the comments at the top of each file |

---

## Updating design

All colors and fonts are CSS custom properties, defined once in the `:root { ... }` block near the top of `css/style.css`:

| Variable | What it controls |
|---|---|
| `--bg`, `--bg2`, `--bg3` | Background shades, darkest to lightest |
| `--plasma`, `--plasma2` | Cyan accent (primary brand color) |
| `--aurora`, `--aurora2` | Purple / pink accent |
| `--text`, `--text2`, `--text3` | Body text, muted text, faint text |
| `--border`, `--border2` | Panel border colors |
| `--mono` | Monospace font (labels, badges, timestamps) |
| `--head` | Heading font |
| `--body` | Body/paragraph font |

Change a value here and it updates everywhere that variable is used — you don't need to hunt through the rest of the file for individual colors.

---

## Live space weather ticker

The banner under the nav bar (`KP INDEX`, `SOLAR WIND`, `X-RAY FLUX`, etc.) is **not static content** — `js/space-weather.js` fetches real numbers from NOAA SWPC on page load and refreshes them every hour while the tab is open. There's nothing to edit here; if you want to understand or change what it shows, the logic and the reasoning for using NOAA (instead of NASA OMNIWeb, which has no browser-callable API) are documented in the comment block at the top of that file.

---

## Previewing changes locally

No server or build step needed — just double-click `index.html` (or open it via your editor's "Open in Browser") and it works, including the live NOAA fetch. Reload the page after any edit to see it.

---

## Publishing

This repo is pushed manually (not automated). Once you're happy with a change:

```
git add -A
git commit -m "Describe what changed"
git push
```

GitHub Pages serves whatever's on the published branch directly — no build/deploy step runs. The custom domain in `CNAME` stays as-is; you shouldn't need to touch that file unless the domain itself changes.

---

## Other files

- **`index.backup.html`** — the original all-in-one file from before the site was split into `css/`/`js/`. Kept as a reference/rollback point; it's not linked from anywhere and GitHub Pages ignores it (only `index.html` is served at the root). Safe to delete once you're confident you don't need it.
- **`LICENSE`** — repo license, unrelated to content editing.
