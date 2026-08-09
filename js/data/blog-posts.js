// Blog post listing — one entry per post, rendered as cards on blog/index.html
// by js/blog-render.js. This is metadata only: the actual writing lives in its
// own file under blog/posts/ (see blog/post-template.html to start a new one).
//
// Fields:
//   title      required  Post title, shown on the card and used as the page's <h1>
//   date       required  ISO date 'YYYY-MM-DD' — used only to sort newest-first,
//                        never displayed directly
//   dateLabel  required  Human-readable date shown on the card, e.g. 'August 2026'
//   excerpt    required  One or two sentences, shown on the card
//   url        required  Path to the post's HTML file, relative to blog/index.html,
//                        e.g. 'posts/your-post.html'
//   cover      optional  Path to a cover image, relative to blog/index.html,
//                        e.g. 'images/posts/your-photo.jpg' — omit it and the
//                        card shows a plain placeholder instead
//   tags       optional  Array of short strings, shown as pills
//
// Order in this array doesn't matter — posts are sorted by `date` automatically.
const BLOG_POSTS_DATA = [
  {
    title: 'Welcome to the Blog',
    date: '2026-08-09',
    dateLabel: 'August 2026',
    excerpt: "A short sample post showing how this section works — replace it with your first real one whenever you're ready, or just delete it.",
    url: 'posts/welcome-to-the-blog.html',
    tags: ['Life']
  }
];
