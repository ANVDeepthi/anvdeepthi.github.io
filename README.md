# nvd-ayyagari.github.io

Personal portfolio site for **Naga Vijaya Deepthi Ayyagari** — space & atmospheric scientist.

**Live:** [www.nvd-ayyagari.space](https://www.nvd-ayyagari.space) (custom domain via [`CNAME`](CNAME), hosted on GitHub Pages)

Plain HTML, CSS, and vanilla JavaScript. No framework, no bundler, no `package.json`, nothing to `npm install`. You edit a file, open `index.html` in a browser to look at it, then commit and push — GitHub Pages serves exactly what's in the repo, with zero build step in between. This document is the map for doing that: what every file is for, where a given piece of content actually lives, and how to change it without breaking anything.

This repo is maintained by hand — updates are written and pushed by the site owner, not by any automated process.

---

## Table of contents

1. [Why it's built this way](#why-its-built-this-way)
2. [Project structure](#project-structure)
3. [How the page assembles itself](#how-the-page-assembles-itself)
4. [Updating content](#updating-content)
5. [Section-by-section map](#section-by-section-map)
6. [Blog](#blog)
7. [Design system](#design-system)
8. [Animations & visual effects](#animations--visual-effects)
9. [Live space weather ticker](#live-space-weather-ticker)
10. [Browser support](#browser-support)
11. [Previewing changes locally](#previewing-changes-locally)
12. [Step-by-step: common edits](#step-by-step-common-edits)
13. [Publishing](#publishing)
14. [Troubleshooting](#troubleshooting)
15. [Periodic maintenance](#periodic-maintenance)
16. [Other files](#other-files)
17. [Attribution & license](#attribution--license)

---

## Why it's built this way

A framework, bundler, or static-site generator would add a build step between "I edited a file" and "the site shows the change" — which means a broken build could quietly block a content edit you made months from now, for reasons unrelated to the edit itself. For a portfolio site that gets updated every few months by one person, that's a cost with no real benefit.

Instead, the site is split into two concerns that don't need a compiler to stay separated:

- **Content** — everything that changes when your career changes (a new job, a new paper, a new award) lives in small, flat data files under `js/data/`, each one just a JavaScript array of plain objects.
- **Structure & behavior** — the page shell, styling, and rendering logic live in `index.html`, `css/style.css`, and `js/render.js`, and rarely need to change at all.

You should be able to add a publication without touching HTML, and change the color scheme without touching content.

---

## Project structure

```
index.html              Page shell: <head>, nav, hero, one empty container per
                         section, footer, and the <script> tags that load everything
index.backup.html       Snapshot of the original single-file version (pre-refactor),
                         kept only as a reference/rollback point — not live, not linked
css/
  style.css             All styling: CSS custom properties, layout, components,
                         keyframe animations, the one responsive breakpoint
js/
  render.js              Reads the data files below and writes each section's HTML.
                          You edit this only if you're changing how a section is laid
                          out — not for day-to-day content changes.
  space-weather.js        Fetches live space-weather indices from NOAA SWPC for the
                          ticker under the nav bar; refreshes hourly. Self-contained,
                          nothing to configure.
  background.js           Hero canvas animation: starfield, aurora wash, ionospheric
                          wave lines, drifting particles, streaking solar wind.
  satellites.js            The three orbiting-satellite paths drawn in the hero.
  cursor.js                 Custom cursor ring + trailing particle effect.
  data/
    about.js               The 4 stat cards under "About Me"
    skills.js                The skill cards under "Skills & Tools"
    experience.js            The career timeline under "Research Experience"
    education.js             The cards under "Education"
    projects.js               The cards under "Key Projects"
    publications.js           Three lists: journal articles, conference proceedings,
                              co-authored papers
    awards.js                  The cards under "Honours & Awards"
    proficiency.js             Skill bars + spoken languages under "Technical
                              Proficiency"
    blog-posts.js               Blog post metadata (title, date, excerpt, tags,
                                link to the post file) — not the posts themselves
  blog-render.js          Reads blog-posts.js and builds the post cards on
                          blog/index.html. Separate from render.js because blog
                          pages don't load the rest of the homepage's scripts.
blog/
  index.html              Blog listing page (post cards)
  post-template.html       Copy this to start a new post — see [Blog](#blog)
  posts/
    welcome-to-the-blog.html   A real, working sample post (safe to delete)
  images/
    posts/                 Drop post photos here (see the README.md inside it)
CNAME                    Custom domain for GitHub Pages — one line, the domain name
LICENSE                  Repo license (unrelated to content editing)
README.md                This file
```

---

## How the page assembles itself

Nothing here is a module system — every `<script>` tag in `index.html` runs in the same global scope, in the order it's written, and that order matters:

```
1. js/data/*.js        Defines global consts: ABOUT_STATS_DATA, SKILLS_DATA, …
2. js/render.js         Reads those consts, builds each section's HTML, and calls
                        renderSite() immediately — the page has real content the
                        instant this script finishes.
3. js/space-weather.js   Fetches live data and fills in the ticker. Independent of
                        the content sections; could run in any position after <body>.
4. js/background.js     )
   js/satellites.js      )  Purely visual — don't read or depend on any of the
   js/cursor.js          )  rendered content, except cursor.js, which attaches
                            hover listeners to cards that render.js just built, so
                            it must load after render.js or those hover effects
                            won't attach to anything.
```

If you ever add a new script, keep data → render → everything else, and put content-dependent scripts after `render.js`.

One non-obvious rule if you add more scripts: **wrap anything with its own top-level variables in an IIFE** — `(function () { ... })();` — like `background.js` does. Two plain `<script>` tags that each declare a top-level `let` or `const` with the same name (e.g. both wanting a variable called `mx` for mouse position) will throw a `SyntaxError` on the second one and silently break that entire script. This already came up once (`background.js` needed pointer-tracking variables that would have collided with `cursor.js`'s), which is why it's wrapped and the others aren't strictly required to be — but it's the safe default for any new script.

---

## Updating content

**Almost everything you'll want to change lives in `js/data/`.** Each file holds one JavaScript array (or, for publications, one object of three arrays) of plain data objects. Add, remove, reorder, or edit an entry, save the file, reload the page — that's the whole workflow.

A few things are *not* in a data file, because they're one-off content rather than a repeated list of cards. Those live directly in `index.html`:

| Content | Where in `index.html` |
|---|---|
| Hero name, title/subtitle, bio, badges | inside `<section id="hero">` |
| "About Me" paragraphs (the two `<p>` tags, not the stat cards) | inside `<section id="about">`, class `about-text` |
| Contact links (email, Scholar, ResearchGate, LinkedIn, …) | inside `<section id="contact">`, class `contact-links` |
| Footer line | inside `<footer>` |
| Space weather ticker | Don't edit by hand — it's live, see [Live space weather ticker](#live-space-weather-ticker) |

### Data file reference

Every field for every file, so you're not guessing what's optional.

#### `js/data/about.js`
Array of stat cards shown under "About Me".
```js
{ num: '9+', label: 'Years Research' }
```
| Field | Required | Notes |
|---|---|---|
| `num` | yes | Big number, shown as-is (string, so `'9+'` works) |
| `label` | yes | Caption underneath |

#### `js/data/skills.js`
Array of skill cards.
```js
{ icon: '🛰️', title: 'Satellite Navigation', desc: 'NavIC, GPS, RTK &amp; PPP evaluations…' }
```
| Field | Required | Notes |
|---|---|---|
| `icon` | yes | One emoji |
| `title` | yes | Card heading |
| `desc` | yes | Body text — HTML entities allowed (see [gotchas](#gotchas)) |

#### `js/data/experience.js`
Array of timeline entries — **keep newest first**, it renders top to bottom in array order.
```js
{
  period: 'Sep 2025 — Present',
  location: '📍 Meghalaya, India',
  role: 'DST Inspire Faculty Fellow',
  org: 'North Eastern Space Applications Centre (NESAC)',
  projectLine: 'Project: …',        // optional
  bullets: ['…', '…']                // use this OR `desc`, not both
}
```
| Field | Required | Notes |
|---|---|---|
| `period` | yes | Free text, e.g. `'2017 — 2023'` |
| `location` | yes | Prefix with `📍 ` to match the existing style |
| `role` | yes | Job title |
| `org` | yes | Employer/institution |
| `projectLine` | no | Italic line above the bullets, usually naming the funded project |
| `bullets` | one of `bullets`/`desc` | Array of strings, rendered as a `<ul>` |
| `desc` | one of `bullets`/`desc` | A single plain paragraph instead of a bulleted list — used for older/simpler roles |

#### `js/data/education.js`
Array of education cards.
```js
{ degree: 'Ph.D. Scholar', inst: 'Indian Institute of Technology Indore', meta: '2017 – 2023 · Indore, India', desc: '…', grade: 'Grade: A+' }
```
| Field | Required | Notes |
|---|---|---|
| `degree` | yes | e.g. `'M.Sc. Satellite Meteorology'` |
| `inst` | yes | Institution name |
| `meta` | yes | Years + location, one line |
| `desc` | yes | Field of study / specialization sentence |
| `grade` | yes | Shown as a small badge, e.g. `'Distinction · Gold Medal'` |

#### `js/data/projects.js`
Array of project cards.
```js
{ icon: '🌌', title: '…', funder: '⚡ …', desc: '…', tags: ['Space Weather', 'NavIC'] }
```
| Field | Required | Notes |
|---|---|---|
| `icon` | yes | One emoji |
| `title` | yes | Project name |
| `funder` | yes | Prefix with `⚡ ` to match the existing style |
| `desc` | yes | Description paragraph |
| `tags` | yes | Array of short strings, rendered as pill tags |

#### `js/data/publications.js`
One object, `PUBLICATIONS_DATA`, with three array properties: `journal`, `conference`, `bookChapters`. Each entry has the same shape:
```js
{ title: '…', authors: '…', journal: '… · DOI: …', badge: '🏆 Young Scientist Award' }
```
| Field | Required | Notes |
|---|---|---|
| `title` | yes | Paper title |
| `authors` | no | Author list as one string — omit for a placeholder entry (e.g. `{ title: 'Coming soon' }`) |
| `journal` | no | Venue, volume/year, DOI — one string; also omittable for a placeholder |
| `badge` | no | Small tag next to the title, e.g. an award |

To add a new paper, find the right array (`journal`/`conference`/`bookChapters`) and add an entry — order is whatever order you list them in (currently newest-ish first, but it's not enforced). There's no `coauthored` list anymore — co-authored papers now live in `journal` alongside first-author papers; if you want a separate co-authored section again later, copy the pattern of the `journal`/`conference` blocks in `index.html`, `render.js`, and `css/style.css`.

#### `js/data/awards.js`
Array of award cards.
```js
{ icon: '🔬', title: '…', desc: '…' }
```
| Field | Required | Notes |
|---|---|---|
| `icon` | yes | One emoji |
| `title` | yes | Award/membership name |
| `desc` | yes | One or two sentences |

#### `js/data/proficiency.js`
Two separate arrays in one file.
```js
// PROFICIENCY_DATA — the skill bars
{ label: 'Python', pct: 92 }

// LANGUAGES_DATA — the language cards
{ name: 'English', level: 'Fluent' }
```
| Field | Required | Notes |
|---|---|---|
| `label` | yes (proficiency) | Skill name |
| `pct` | yes (proficiency) | 0–100, drives the bar width |
| `name` | yes (languages) | Language name |
| `level` | yes (languages) | e.g. `'Native'`, `'Beginner'` |

### Gotchas

- **HTML entities**: this text gets inserted as real HTML, so an `&` in your text should be written as `&amp;` (e.g. `'DST &amp; ISRO'`). Straight quotes, apostrophes, and most punctuation are fine as-is — just make sure a `'` inside a single-quoted string is escaped (`'India\'s NavIC'` or switch that string to double quotes).
- **These are JavaScript files, not JSON** — the shape (curly braces, commas between objects, matching quotes) has to be valid JS or the *entire file* fails to load, which can blank out that whole section (or worse, since a syntax error in one `<script>` doesn't stop the next `<script>` tag from trying to run — see [Troubleshooting](#troubleshooting)).
- **A trailing comma after the last item in an array/object is fine** in modern JavaScript — you don't need to remove it when you delete the last entry, but a *missing* comma between two entries will break the file.

---

## Section-by-section map

Every section in `index.html` has an empty container `<div>`/`<div id="...">` that one function in `render.js` fills in from one data file. Useful if you're trying to trace "where does this box of cards actually come from":

| Page section (`<section id="…">`) | Container id | Filled by | From data file |
|---|---|---|---|
| `hero` | — (static, no container) | — | hand-written in `index.html` |
| `about` | `about-stats` | `renderAboutStats()` | `about.js` |
| `skills` | `skills-grid` | `renderSkills()` | `skills.js` |
| `experience` | `experience-timeline` | `renderExperience()` | `experience.js` |
| `education` | `education-grid` | `renderEducation()` | `education.js` |
| `projects` | `projects-grid` | `renderProjects()` | `projects.js` |
| `publications` | `pub-journal-list`, `pub-conference-list`, `pub-bookchapters-list` | `renderPublications()` | `publications.js` |
| `awards` | `awards-grid` | `renderAwards()` | `awards.js` |
| `gallery` | `prog-bars`, `langs-grid` | `renderProficiency()` | `proficiency.js` |
| `contact` | — (static, no container) | — | hand-written in `index.html` |

`render.js` calls all of the above once, from a single `renderSite()` at the bottom of the file, the moment the script runs.

---

## Blog

The blog is a separate, lighter section of the site — personal thoughts, travel, photos — and it's built differently from the rest of the site on purpose:

- **The homepage is one page**; render.js builds all its sections from data files at load time. **The blog is multiple plain HTML pages** — a listing page plus one file per post — because long-form writing with inline photos is much easier to write directly as HTML than to cram into a JS array field.
- **Only post *metadata* is data-driven.** `js/data/blog-posts.js` holds each post's title, date, excerpt, tags, and a link to its file — that's what builds the cards on the Blog page. The actual writing lives in its own file under `blog/posts/`, written by hand.
- **Blog pages don't load the homepage's visual-effect scripts** — no animated hero canvas, no orbiting satellites, no custom cursor, no space weather ticker. Those are homepage-specific; a page meant for reading text and looking at photos doesn't need them, and skipping them keeps blog pages lighter. They *do* share `css/style.css`, so the color scheme, fonts, and card styling all match the rest of the site.

### Writing a new post

1. Copy `blog/post-template.html` into `blog/posts/`, and rename it to something like `your-post-title.html`
2. Fill in the title, date, tags, and write your paragraphs inside `<article class="post-body">` — the template has TODO comments marking exactly what to replace
3. If you have photos: drop them in `blog/images/posts/` (see the README.md in that folder for size guidance), then uncomment one of the `<img>` patterns already in the template — one for a single photo with a caption, one for two side by side
4. Add one entry to `js/data/blog-posts.js` with the post's title, date, excerpt, and a link to the file you just created — this is what makes it show up as a card on the Blog page. Field reference:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Post title |
| `date` | yes | ISO date `'YYYY-MM-DD'` — used only to sort posts newest-first |
| `dateLabel` | yes | Human-readable date shown on the card, e.g. `'August 2026'` |
| `excerpt` | yes | One or two sentences shown on the card |
| `url` | yes | Path to the post file, relative to `blog/index.html`, e.g. `'posts/your-post-title.html'` |
| `cover` | no | Path to a cover image, relative to `blog/index.html`, e.g. `'images/posts/your-photo.jpg'` — omit it and the card shows a plain placeholder |
| `tags` | no | Array of short strings, shown as pills, e.g. `['Travel']` |

5. Reload `blog/index.html` to confirm the card looks right, then open the post itself to check the writing/photos render correctly
6. Commit and push

The included `blog/posts/welcome-to-the-blog.html` is a real, working sample post — open it once to see the patterns in action, then replace or delete it whenever you're ready to publish your first real one.

### Linking back to the homepage

Blog pages use relative paths back to the homepage's sections (e.g. `../index.html#about`) since they're separate documents, not anchors on the same page. If you ever rename a homepage section id or restructure the nav, you'll need to mirror that change in three places: `index.html`, `blog/index.html`, and `blog/post-template.html` (existing posts under `blog/posts/` too, if you want them to match — they won't break, their nav links just won't reflect the change).

---

## Design system

All colors and fonts are CSS custom properties, defined once in the `:root { ... }` block near the top of `css/style.css` — change a value there and it updates everywhere that variable is used, no hunting through the rest of the file required.

| Variable | What it controls |
|---|---|
| `--bg`, `--bg2`, `--bg3` | Background shades, darkest to lightest (used for the page body, alternating section backgrounds, and card backgrounds respectively) |
| `--plasma`, `--plasma2` | Cyan accent — the primary brand color (links, glows, the gradient name in the hero) |
| `--aurora`, `--aurora2` | Purple / pink accent (secondary highlights, org names in the timeline) |
| `--glow`, `--glow2` | Pre-mixed low-opacity versions of `--plasma`/`--aurora`, used for hover box-shadows |
| `--text`, `--text2`, `--text3` | Body text, muted text, faint text (labels/metadata) |
| `--border`, `--border2` | Panel border colors, resting and hover state |
| `--mono` | Monospace font — labels, badges, timestamps, anything meant to look technical |
| `--head` | Heading font (Rajdhani) |
| `--body` | Body/paragraph font (Crimson Pro) |

**Fonts** are loaded from Google Fonts via the `<link>` tag in `index.html`'s `<head>`. If you change `--head`/`--body`/`--mono` to a font that isn't already loaded, update that `<link>` too, or the browser will silently fall back to a generic font.

**Layout**: page content is capped at `1060px` wide via the `.container` class. Most card grids use `grid-template-columns: repeat(auto-fill, minmax(…, 1fr))`, which means you don't need to touch CSS when the number of cards changes — the grid reflows on its own.

**Responsive breakpoint**: one media query at `768px` in `css/style.css` — below that width, the hero's side-by-side layout stacks, the animated hero visual is hidden entirely (performance/relevance on mobile), and the nav links collapse.

---

## Animations & visual effects

<details>
<summary>Click to expand — internals of the three effect scripts</summary>

### `js/background.js` — hero backdrop

Every section below the hero paints a solid, opaque background over the canvas, so **this animation is only ever visible inside the hero** — that's a deliberate scope decision, not an oversight, and it's why the script pauses itself the moment the hero scrolls out of view (see below).

Layers, back to front:
1. **Starfield** — 220 tiny twinkling stars, no glow (kept cheap on purpose — this is the layer with the highest count)
2. **Aurora wash** — three overlapping colored radial gradients (cyan/purple/pink) that drift slowly and independently
3. **Ionospheric wave lines** — 7 animated sine waves
4. **Ambient particles** — ~46 slow-drifting plasma-colored dots
5. **Solar wind streaks** — particles injected from the left edge, drawn as short motion-blurred streaks rather than dots

Also handles:
- **Delta-time-based motion** — speed is normalized to real elapsed time, not frame count, so it looks the same on a 60Hz and a 144Hz display
- **Pauses when it can't be seen** — an `IntersectionObserver` on `#hero` stops the whole `requestAnimationFrame` loop while you've scrolled past it, and a `visibilitychange` listener pauses it when the browser tab is backgrounded
- **Subtle pointer parallax** — stars and wave lines shift a few px opposite the cursor for a sense of depth
- Wrapped in an IIFE — see [How the page assembles itself](#how-the-page-assembles-itself) for why that matters

### `js/satellites.js` — orbiting satellites

Draws three tilted elliptical orbit paths with satellites moving along them, each leaving a fading trail, on the `#sat-canvas` element inside the hero visual. Self-contained; doesn't interact with any other script.

### `js/cursor.js` — custom cursor

Replaces the OS cursor with a ring + dot + particle trail. Attaches a "hovering" state to `a`, `button`, `.skill-card`, `.stat-card`, `.project-card`, `.pub-item`, and `.award-item` — since most of those are rendered by `render.js`, this script has to load *after* `render.js` or the hover listeners will attach to nothing.

</details>

---

## Live space weather ticker

<details>
<summary>Click to expand — how the ticker works and where its data comes from</summary>

The banner under the nav (`KP INDEX`, `SOLAR WIND`, `X-RAY FLUX`, `PROTON FLUX`, `MAGNETIC Bz`, `IONOSPHERE`) is **not static content**. `js/space-weather.js` fetches real-time data on page load and refreshes it every hour while the tab stays open.

**Why NOAA and not NASA OMNIWeb directly**: OMNIWeb is a legacy FTP/CGI system built for downloading data files, not for being called from a browser on another domain — it sends no CORS headers, so a `fetch()` from this page would be blocked outright. NOAA SWPC (`services.swpc.noaa.gov`) publishes the same underlying real-time DSCOVR/GOES measurements that OMNIWeb itself archives, as CORS-enabled JSON meant for exactly this kind of public widget. It's the live operational source; OMNIWeb is the historical archive of the same feeds.

| Ticker item | Source endpoint | Field used |
|---|---|---|
| `KP INDEX` / `IONOSPHERE` | `products/noaa-planetary-k-index.json` | `Kp` (latest entry) |
| `SOLAR WIND` | `json/rtsw/rtsw_wind_1m.json` | `proton_speed` (latest active entry) |
| `MAGNETIC Bz` | `json/rtsw/rtsw_mag_1m.json` | `bz_gsm` (latest active entry) |
| `X-RAY FLUX` | `json/goes/primary/xrays-1-day.json` | `flux` where `energy === '0.1-0.8nm'`, converted to NOAA flare-class notation (A/B/C/M/X) |
| `PROTON FLUX` | `json/goes/primary/integral-protons-1-day.json` | `flux` where `energy === '>=10 MeV'` |

Each value also drives its status dot color (green/yellow/red/cyan) via a threshold function in the same file (`kpCategory`, `windDot`, `xrayDot`, `protonDot`, `bzDot`) — e.g. `Bz ≤ -6 nT` turns the dot red.

**Refresh cadence**: `SW_REFRESH_MS` at the top of the file, currently one hour (`60 * 60 * 1000`). Change that constant to adjust it.

**Failure behavior**: if a refresh fails (offline, NOAA endpoint down, ad-blocker interference), the ticker just keeps showing whatever it last successfully fetched, rather than blanking out. On first load, before the first fetch resolves, it briefly shows a "SYNCING WITH NOAA SWPC…" placeholder.

There's nothing to maintain here day-to-day — it's fully automatic. You'd only touch this file to change the refresh interval, the color thresholds, or which indices are shown.

</details>

---

## Browser support

Relies on `fetch`, `IntersectionObserver`, `requestAnimationFrame`, `<canvas>`, CSS Grid, and CSS custom properties — all standard in any current evergreen browser (Chrome, Firefox, Safari, Edge). No Internet Explorer support, and none is planned. The custom cursor and hover effects assume a mouse; on touch devices they simply don't trigger, which is expected and not a bug to fix.

---

## Previewing changes locally

No server, no build step — just open `index.html` directly in a browser (double-click it, or your editor's "Open in Browser"). This works even for the live NOAA fetch: `js/space-weather.js` calls a CORS-enabled endpoint (`Access-Control-Allow-Origin: *`), which permits requests from a `file://` page too.

Reload the page after any edit to see it. If you want auto-reload on save, any static-file live-reload tool works (e.g. the VS Code "Live Server" extension) — entirely optional, not required for this site to work.

---

## Step-by-step: common edits

**Add a publication**
1. Open `js/data/publications.js`
2. Find the right list — `journal`, `conference`, or `bookChapters`
3. Add a new `{ title, authors, journal }` object (copy an existing one as a template, add a comma after the previous entry)
4. Save, reload `index.html`, check it rendered correctly
5. `git add -A && git commit -m "Add publication: <title>" && git push`

**Start a new job / role**
1. Open `js/data/experience.js`, add a new entry **at the top** of the array
2. If this is now your *current* role, also update, in `index.html`:
   - the hero subtitle (`<div class="hero-title">…</div>`)
   - the hero badges if relevant (`<div class="hero-badges">…</div>`)
   - the first "About Me" paragraph
   - the footer line
3. Save, reload, check the timeline order and the hero both read correctly
4. Commit and push

**Change the accent color**
1. Open `css/style.css`, find `:root { ... }` near the top
2. Change `--plasma`/`--plasma2` (and `--aurora`/`--aurora2` if you want the secondary color to shift too)
3. Reload — every glow, border, and highlight site-wide updates at once
4. Commit and push

**Write a blog post** — see [Blog](#blog) for the full walkthrough; short version:
1. Copy `blog/post-template.html` → `blog/posts/your-post-title.html`, write it
2. Add a matching entry to `js/data/blog-posts.js`
3. Reload `blog/index.html`, check the card and the post itself
4. Commit and push

---

## Publishing

This repo is pushed manually, on purpose — nothing pushes changes for you. Once you're happy with an edit:

```
git add -A
git commit -m "Describe what changed"
git push
```

GitHub Pages serves whatever's on the published branch directly; there's no build/deploy step in between. The custom domain in `CNAME` should stay as-is unless the domain itself changes — no DNS changes needed for a normal content edit.

> If this folder isn't yet connected to a GitHub repository (e.g. you're starting fresh from these files), initialize it first:
> ```
> git init
> git add -A
> git commit -m "Initial commit"
> git remote add origin <your-repo-url>
> git push -u origin main
> ```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| A whole section is blank after a content edit | Syntax error in that section's data file (missing comma, unmatched quote) | Open the browser console (`F12` → Console) — it names the file and line |
| The *whole page* looks broken, not just one section | Syntax error in a data file that loads before `render.js` — a broken `<script>` tag doesn't stop later ones from trying to run against missing data | Same as above: check the console, it'll point at the failing file |
| The animated background isn't visible while scrolling | Expected — it's hero-only by design, see [Animations & visual effects](#animations--visual-effects) | Not a bug |
| The ticker is stuck on "SYNCING WITH NOAA SWPC…" | Offline, a NOAA endpoint is down, or an ad-blocker/privacy extension is blocking the request | Check the browser console for `[space-weather]` warnings; try a different network/browser to confirm it's not local blocking |
| Custom cursor doesn't show up | You're on a touch device, or hovering an element added *before* `cursor.js` finished loading | Expected on touch; if it's missing on desktop, check script load order in `index.html` |
| Google Fonts don't load / fallback font shows | No network access (Google Fonts is loaded from a CDN, not bundled) | Expected when fully offline; fine once deployed |
| A blog photo shows a broken-image icon | Wrong relative path — posts and `blog-posts.js` resolve `images/posts/...` from different base folders (see the [Blog](#blog) field reference) | From a post file, prefix with `../` (`../images/posts/x.jpg`); from `blog-posts.js`'s `cover` field, don't (`images/posts/x.jpg`) |
| A new blog post doesn't appear on the Blog page | Forgot to add its entry to `js/data/blog-posts.js`, or the `url` field doesn't match the actual file path | Check both against the [Blog](#blog) walkthrough |

---

## Periodic maintenance

Nothing here is urgent, but worth a glance every so often:

- **Footer copyright year** — hand-written in `index.html`, doesn't update itself
- **Stat counts** in `js/data/about.js` (years of research, papers, mentees) — these are typed numbers, not calculated from anything
- **Contact links** — periodically confirm the Scholar/ResearchGate/LinkedIn URLs still resolve
- **NOAA endpoint availability** — SWPC endpoints are stable public infrastructure, but if the ticker stays stuck on the loading state for an extended period, it's worth spot-checking the URLs listed in [Live space weather ticker](#live-space-weather-ticker) in a browser
- **Blog image sizes** — photos dropped into `blog/images/posts/` straight off a phone or camera can be several MB each; worth a quick compress before committing (see the README.md in that folder) so the repo doesn't balloon and posts stay fast to load

---

## Other files

- **`index.backup.html`** — the original all-in-one file from before the site was split into `css/`/`js/`. Kept as a reference/rollback point; it's not linked from anywhere, and GitHub Pages only serves `index.html` at the root, so this file has no effect on the live site. Safe to delete once you're confident you don't need it.
- **`LICENSE`** — repo license, unrelated to content editing.

---

## Attribution & license

Real-time space weather data courtesy of [NOAA Space Weather Prediction Center](https://www.swpc.noaa.gov/) (public data, no attribution required by them, credited here anyway). Fonts via [Google Fonts](https://fonts.google.com/) (Rajdhani, Share Tech Mono, Crimson Pro). See [`LICENSE`](LICENSE) for the repository's license.