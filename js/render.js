// ─── CONTENT RENDERER ───
// Reads the *_DATA arrays/objects defined in js/data/*.js and builds each
// section's markup. To change page content, edit the data files — this
// file only needs to change if a section's layout changes.

function renderAboutStats() {
  const el = document.getElementById('about-stats');
  if (!el) return;
  el.innerHTML = ABOUT_STATS_DATA.map(s => `
    <div class="stat-card">
      <span class="stat-num">${s.num}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `).join('');
}

function renderSkills() {
  const el = document.getElementById('skills-grid');
  if (!el) return;
  el.innerHTML = SKILLS_DATA.map(s => `
    <div class="skill-card">
      <span class="skill-icon">${s.icon}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function renderExperience() {
  const el = document.getElementById('experience-timeline');
  if (!el) return;
  el.innerHTML = EXPERIENCE_DATA.map(x => {
    const body = x.bullets
      ? `${x.projectLine ? `<p><em>${x.projectLine}</em></p>` : ''}
         <ul>${x.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : `<p>${x.desc}</p>`;
    return `
      <div class="tl-item">
        <div class="tl-meta">
          <span class="tl-period">${x.period}</span>
          <span class="tl-location">${x.location}</span>
        </div>
        <div class="tl-role">${x.role}</div>
        <div class="tl-org">${x.org}</div>
        <div class="tl-desc">${body}</div>
      </div>
    `;
  }).join('');
}

function renderEducation() {
  const el = document.getElementById('education-grid');
  if (!el) return;
  el.innerHTML = EDUCATION_DATA.map(e => `
    <div class="edu-card">
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-inst">${e.inst}</div>
      <div class="edu-meta">${e.meta}</div>
      <p class="edu-desc">${e.desc}</p>
      <span class="grade-badge">${e.grade}</span>
    </div>
  `).join('');
}

function renderProjects() {
  const el = document.getElementById('projects-grid');
  if (!el) return;
  el.innerHTML = PROJECTS_DATA.map(p => `
    <div class="project-card">
      <div class="proj-header">
        <div class="proj-icon">${p.icon}</div>
        <h3>${p.title}</h3>
      </div>
      <div class="proj-funder">${p.funder}</div>
      <p>${p.desc}</p>
      <div class="proj-tags">${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

function renderPublications() {
  // authors/journal are optional — omit either for a placeholder-style entry (e.g. "Coming soon").
  const pubItem = (p, extraClass) => `
    <div class="pub-item ${extraClass || ''}">
      <div class="pub-title">${p.title}${p.badge ? ` <span class="pub-badge">${p.badge}</span>` : ''}</div>
      ${p.authors ? `<div class="pub-authors">${p.authors}</div>` : ''}
      ${p.journal ? `<div class="pub-journal">${p.journal}</div>` : ''}
    </div>
  `;

  const journalEl = document.getElementById('pub-journal-list');
  if (journalEl) journalEl.innerHTML = PUBLICATIONS_DATA.journal.map(p => pubItem(p)).join('');

  const confEl = document.getElementById('pub-conference-list');
  if (confEl) confEl.innerHTML = PUBLICATIONS_DATA.conference.map(p => pubItem(p, 'conf-pub-item')).join('');

  const booksEl = document.getElementById('pub-bookchapters-list');
  if (booksEl && PUBLICATIONS_DATA.bookChapters) {
    booksEl.innerHTML = PUBLICATIONS_DATA.bookChapters.map(p => pubItem(p, 'bookchapters-pub-item')).join('');
  }
}

function renderAwards() {
  const el = document.getElementById('awards-grid');
  if (!el) return;
  el.innerHTML = AWARDS_DATA.map(a => `
    <div class="award-item">
      <div class="award-icon">${a.icon}</div>
      <div class="award-text"><strong>${a.title}</strong>${a.desc}</div>
    </div>
  `).join('');
}

function renderProficiency() {
  const bars = document.getElementById('prog-bars');
  if (bars) {
    bars.innerHTML = PROFICIENCY_DATA.map(p => `
      <div class="prog-item">
        <span class="prog-label">${p.label}</span>
        <div class="prog-track"><div class="prog-fill" style="width:${p.pct}%"></div></div>
        <span class="prog-pct">${p.pct}%</span>
      </div>
    `).join('');
  }

  const langs = document.getElementById('langs-grid');
  if (langs) {
    langs.innerHTML = LANGUAGES_DATA.map(l => `
      <div class="lang-card">
        <div class="lang-name">${l.name}</div>
        <div class="lang-level">${l.level}</div>
      </div>
    `).join('');
  }
}

function renderSite() {
  renderAboutStats();
  renderSkills();
  renderExperience();
  renderEducation();
  renderProjects();
  renderPublications();
  renderAwards();
  renderProficiency();
}

renderSite();
