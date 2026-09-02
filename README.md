# Natasha Creator Kit

A static creator/media kit for Natasha Golfing, served at:

```txt
https://natashagolfing.com/
https://natashagolfing.com/links
```

## Editing site content

All media-kit profile copy, stats, audience values, and featured posts live in one file:

```txt
data/site.json
```

To update the site:

1. Edit `data/site.json`.
2. Commit the change.
3. Push to `main`.

GitHub Pages runs `node scripts/build-site.mjs`, which generates static `index.html` from `data/site.json` before deploying. There is no client-side stats/profile fetch, so the page does not flash old placeholder content.

## No automatic social stats updates

Instagram and TikTok stats are manual only. This repo only generates static HTML from committed `data/site.json` values.

## Files

- `data/site.json` — one editable source of truth for media-kit content and stats
- `index.template.html` — media-kit HTML template
- `links/index.template.html` — links-page HTML template
- `scripts/build-site.mjs` — local/GitHub Pages generator from `data/site.json` to static HTML
- `index.html`, `styles.css`, `script.js` — generated/static media kit page and interaction styling/JS
- `links/index.html`, `links/styles.css` — generated/static Linktree-style links page and styling
- `assets/` — images, partner logos, and featured thumbnails
- `CNAME` — custom domain for `natashagolfing.com`
- `.github/workflows/pages.yml` — GitHub Pages deploy

## Local preview

Regenerate the static page, then serve the folder:

```bash
node scripts/build-site.mjs
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
http://localhost:8080/links/
```

## GitHub Pages deploy

1. Push this project to GitHub.
2. Go to `Settings → Pages`.
3. Set `Build and deployment → Source → GitHub Actions`.
4. Custom domain is configured through root `CNAME`:

```txt
natashagolfing.com
```

Pushing to `main` deploys the site after generating static HTML from `data/site.json`.
