# Post images

Drop photos for blog posts here. This file also just keeps the folder present in the
repo — git doesn't track empty folders — so feel free to leave it in place alongside
your images.

**Before adding a photo**, resize/compress it for web — a few hundred KB is plenty for
something displayed at most a few hundred pixels wide, whereas an original phone or
camera photo can be several MB, which slows the page down and bloats the repo. Any
free image compressor (e.g. squoosh.app) or your photo editor's "export for web"
option works fine.

**Referencing an image:**

From a post file in `blog/posts/`:
```html
<img class="post-photo" src="../images/posts/your-photo.jpg" alt="Describe the photo">
```

As a card cover image, in `js/data/blog-posts.js`:
```js
cover: 'images/posts/your-photo.jpg'
```
(note: no `../` here — that file is loaded from `blog/index.html`, one level up from `blog/posts/`, so the path is relative to `blog/`, not `blog/posts/`)
