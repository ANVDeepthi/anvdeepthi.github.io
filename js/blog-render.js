// ─── BLOG LISTING ───
// Reads BLOG_POSTS_DATA (js/data/blog-posts.js) and builds the post cards on
// blog/index.html. Wrapped in an IIFE to keep its variables out of the global
// scope — see the "How the page assembles itself" note in README.md for why
// that matters when multiple plain <script> tags share one page.
(function () {
  const grid = document.getElementById('blog-grid');
  if (!grid || typeof BLOG_POSTS_DATA === 'undefined') return;

  const posts = [...BLOG_POSTS_DATA].sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

  grid.innerHTML = posts.map(p => `
    <a class="blog-card" href="${p.url}">
      ${p.cover
        ? `<div class="blog-card-cover"><img src="${p.cover}" alt=""></div>`
        : `<div class="blog-card-cover placeholder">🖼️ No cover photo yet</div>`}
      <div class="blog-card-body">
        <span class="blog-card-date">${p.dateLabel}</span>
        <h3>${p.title}</h3>
        <p class="blog-card-excerpt">${p.excerpt}</p>
        ${p.tags && p.tags.length ? `<div class="blog-card-tags">${p.tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>` : ''}
      </div>
    </a>
  `).join('');
})();
